'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Topic } from '@/lib/content';
import { getSortedTopics } from '@/lib/content';

type Props = {
  grade: string;
  topics: Topic[];
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

export default function TopicListClient({ grade, topics }: Props) {
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'title'>('order');
  const [completed, setCompleted] = useState<Set<string>>(readCompleted(grade));

  useEffect(() => {
    const update = () => setCompleted(readCompleted(grade));
    update();

    window.addEventListener('storage', update);
    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);

    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, [grade]);

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
          Прогресс: <strong>{progress}%</strong> ({completed.size}/{topics.length})
        </p>
        <div className="progress-bar" aria-label="grade progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="controls">
        <input
          placeholder="Поиск по темам и ключевым словам"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'order' | 'title')}>
          <option value="order">Сортировка по номеру</option>
          <option value="title">Сортировка по алфавиту</option>
        </select>
      </div>
      <div className="grid">
        {filtered.map((topic) => (
          <Link key={topic.slug} href={`/grades/${grade}/${topic.slug}`} className="card">
            <h3 style={{ marginTop: 0 }}>{topic.title}</h3>
            <p className="muted">{topic.description || 'Без описания'}</p>
            <p className="muted">Статус: {completed.has(topic.slug) ? '✅ Пройдено' : '— Не отмечено'}</p>
          </Link>
        ))}
        {filtered.length === 0 && <p className="muted">Ничего не найдено.</p>}
      </div>
    </>
  );
}
