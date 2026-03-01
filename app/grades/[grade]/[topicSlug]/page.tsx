import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgressControls from '@/components/ProgressControls';
import SwfPlayer from '@/components/SwfPlayer';
import { findTopic, getContentIndex, getSortedTopics } from '@/lib/content';

export default async function TopicPage({
  params
}: {
  params: { grade: string; topicSlug: string };
}) {
  const content = await getContentIndex();
  const topics = getSortedTopics(content[params.grade] ?? [], 'order');
  const topic = findTopic(topics, params.topicSlug);

  if (!topic) notFound();

  const currentIndex = topics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <main className="container">
      <div className="breadcrumbs">
        <Link href="/">Классы</Link> / <Link href={`/grades/${params.grade}`}>{params.grade} класс</Link> /{' '}
        <span>{topic.title}</span>
      </div>
      <h1>{topic.title}</h1>
      <p className="muted">{topic.description || 'Описание отсутствует.'}</p>
      <ProgressControls grade={params.grade} slug={topic.slug} />
      <SwfPlayer src={topic.swf} />
      <div className="topic-actions">
        <Link href={`/grades/${params.grade}`}>
          <button>Назад к темам</button>
        </Link>
        {prevTopic && (
          <Link href={`/grades/${params.grade}/${prevTopic.slug}`}>
            <button>← Предыдущая тема</button>
          </Link>
        )}
        {nextTopic && (
          <Link href={`/grades/${params.grade}/${nextTopic.slug}`}>
            <button>Следующая тема →</button>
          </Link>
        )}
      </div>
    </main>
  );
}
