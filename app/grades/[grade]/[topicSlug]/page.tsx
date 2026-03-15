import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgressControls from '@/components/ProgressControls';
import SwfPlayer from '@/components/SwfPlayer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { findTopic, getContentIndex, getLanguageFromSearchParam, getSortedTopics } from '@/lib/content';
import { getUiText } from '@/lib/ui-i18n';

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
  const t = getUiText(lang);

  const content = await getContentIndex(lang);
  const topics = getSortedTopics(content[grade] ?? [], 'order');
  const topic = findTopic(topics, topicSlug);

  if (!topic) notFound();

  const currentIndex = topics.findIndex((topicItem) => topicItem.slug === topic.slug);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex >= 0 && currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <main className="container">
      <div className="page-toolbar">
        <div className="breadcrumbs">
          <Link href={`/?lang=${lang}`}>{t.classes}</Link> /{' '}
          <Link href={`/grades/${encodeURIComponent(grade)}?lang=${lang}`}>
            {grade} {t.gradeSuffix}
          </Link>{' '}
          / <span>{topic.title}</span>
        </div>
        <LanguageSwitcher lang={lang} label={t.languageLabel} />
      </div>
      <h1>{topic.title}</h1>
      <p className="muted">{topic.description || t.descriptionMissing}</p>
      <ProgressControls grade={grade} slug={topic.slug} lang={lang} />
      <SwfPlayer src={topic.swf} />
      <div className="topic-actions">
        <Link href={`/grades/${encodeURIComponent(grade)}?lang=${lang}`}>
          <button>{t.backToTopics}</button>
        </Link>
        {prevTopic && (
          <Link href={buildTopicHref(grade, prevTopic.slug, lang)}>
            <button>{t.prevTopic}</button>
          </Link>
        )}
        {nextTopic && (
          <Link href={buildTopicHref(grade, nextTopic.slug, lang)}>
            <button>{t.nextTopic}</button>
          </Link>
        )}
      </div>
    </main>
  );
}
