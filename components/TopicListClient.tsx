'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Topic } from '../lib/content-client';
import { getSortedTopics } from '../lib/content-client';
import { getUiText } from '../lib/ui-i18n';

type Props = {
  grade: string;
  topics: Topic[];
  lang: string;
};

function readCompleted(grade: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(`physics:completed:${grade}`);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

export default function TopicListClient({ grade, topics, lang }: Props) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'title'>('order');
  const [completed] = useState<Set<string>>(readCompleted(grade));
  const t = getUiText(lang);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const searched = q
      ? topics.filter(
          (topic) =>
            topic.title.toLowerCase().includes(q) ||
            topic.keywords.some((keyword) => keyword.toLowerCase().includes(q))
        )
      : topics;
    return getSortedTopics(searched, sortBy);
  }, [topics, query, sortBy]);

  const progress = topics.length ? Math.round((completed.size / topics.length) * 100) : 0;

  return (
    <>
      <div className="card">
        <p>
          {t.progressLabel}: <strong>{progress}%</strong> ({completed.size}/{topics.length})
        </p>
        <div className="progress-bar" aria-label="grade progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="controls">
        <input
          placeholder={t.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select value={sortBy} onChange={(event) => setSortBy(event.target.value as 'order' | 'title')}>
          <option value="order">{t.sortByOrder}</option>
          <option value="title">{t.sortByTitle}</option>
        </select>
      </div>
      <div className="grid">
        {filtered.map((topic) => (
          <Link
            key={topic.slug}
            href={`/grades/${encodeURIComponent(grade)}/${encodeURIComponent(topic.slug)}?lang=${lang}`}
            className="card"
          >
            <h3 style={{ marginTop: 0 }}>{topic.title}</h3>
            <p className="muted">{topic.description || t.noDescription}</p>
            <p className="muted">
              {t.statusLabel}: {completed.has(topic.slug) ? t.statusDone : t.statusNotMarked}
            </p>
          </Link>
        ))}
        {filtered.length === 0 && <p className="muted">{t.notFound}</p>}
      </div>
    </>
  );
}
