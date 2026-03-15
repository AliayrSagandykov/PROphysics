import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgressControls from '@/components/ProgressControls';
import SwfPlayer from '@/components/SwfPlayer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { findTopic, getContentIndex, getLanguageFromSearchParam, getSortedTopics } from '@/lib/content';

export async function generateStaticParams() {
  const content = await getContentIndex('ru');
  return Object.entries(content).flatMap(([grade, topics]) =>
    topics.map((topic) => ({ grade, topicSlug: topic.slug }))
  );
}

function buildTopicHref(grade: string, slug: string, lang: string): string {
  return `/grades/${encodeURIComponent(grade)}/${encodeURIComponent(slug)}?lang=${lang}`;
}

export default async function TopicPage({
  params,
  searchParams
}: {
  params: { grade: string; topicSlug: string };
  searchParams?: { lang?: string };
}) {
  const grade = decodeURIComponent(params.grade);
  const topicSlug = decodeURIComponent(params.topicSlug);
  const lang = getLanguageFromSearchParam(searchParams?.lang);

  const content = await getContentIndex(lang);
  const topics = getSortedTopics(content[grade] ?? [], 'order');
  const topic = findTopic(topics, topicSlug);

  if (!topic) notFound();

  const currentIndex = topics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <main className="container">
      <div className="page-toolbar">
        <div className="breadcrumbs">
          <Link href={`/?lang=${lang}`}>Классы</Link> /{' '}
          <Link href={`/grades/${encodeURIComponent(grade)}?lang=${lang}`}>{grade} класс</Link> /{' '}
          <span>{topic.title}</span>
        </div>
        <LanguageSwitcher lang={lang} />
      </div>
      <h1>{topic.title}</h1>
      <p className="muted">{topic.description || 'Описание отсутствует.'}</p>
      <ProgressControls grade={grade} slug={topic.slug} />
      <SwfPlayer src={topic.swf} />
      <div className="topic-actions">
        <Link href={`/grades/${encodeURIComponent(grade)}?lang=${lang}`}>
          <button>Назад к темам</button>
        </Link>
        {prevTopic && (
          <Link href={buildTopicHref(grade, prevTopic.slug, lang)}>
            <button>← Предыдущая тема</button>
          </Link>
        )}
        {nextTopic && (
          <Link href={buildTopicHref(grade, nextTopic.slug, lang)}>
            <button>Следующая тема →</button>
          </Link>
        )}
      </div>
    </main>
  );
}
