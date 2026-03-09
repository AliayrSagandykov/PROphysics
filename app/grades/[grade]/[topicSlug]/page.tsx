import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgressControls from '@/components/ProgressControls';
import SwfPlayer from '@/components/SwfPlayer';
import { findTopic, getContentIndex, getSortedTopics } from '@/lib/content';

export async function generateStaticParams() {
  const content = await getContentIndex();
  return Object.entries(content).flatMap(([grade, topics]) =>
    topics.map((topic) => ({ grade, topicSlug: topic.slug }))
  );
}

function normalizeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildTopicHref(grade: string, slug: string): string {
  return `/grades/${encodeURIComponent(grade)}/${encodeURIComponent(slug)}`;
}

export default async function TopicPage({
  params
}: {
  params: { grade: string; topicSlug: string };
}) {
  const grade = normalizeParam(params.grade);
  const topicSlug = normalizeParam(params.topicSlug);

  const content = await getContentIndex();
  const topics = getSortedTopics(content[grade] ?? [], 'order');
  const topic = findTopic(topics, topicSlug);

  if (!topic) notFound();

  const currentIndex = topics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <main className="container">
      <div className="breadcrumbs">
        <Link href="/">Классы</Link> / <Link href={`/grades/${encodeURIComponent(grade)}`}>{grade} класс</Link> /{' '}
        <span>{topic.title}</span>
      </div>
      <h1>{topic.title}</h1>
      <p className="muted">{topic.description || 'Описание отсутствует.'}</p>
      <ProgressControls grade={grade} slug={topic.slug} />
      <SwfPlayer src={topic.swf} />
      <div className="topic-actions">
        <Link href={`/grades/${encodeURIComponent(grade)}`}>
          <button>Назад к темам</button>
        </Link>
        {prevTopic && (
          <Link href={buildTopicHref(grade, prevTopic.slug)}>
            <button>← Предыдущая тема</button>
          </Link>
        )}
        {nextTopic && (
          <Link href={buildTopicHref(grade, nextTopic.slug)}>
            <button>Следующая тема →</button>
          </Link>
        )}
      </div>
    </main>
  );
}
