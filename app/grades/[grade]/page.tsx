import Link from 'next/link';
import { getContentIndex, getLanguageFromSearchParam } from '@/lib/content';
import TopicListClient from '@/components/TopicListClient';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getUiText } from '@/lib/ui-i18n';

export async function generateStaticParams() {
  const content = await getContentIndex('ru');
  return Object.keys(content).map((grade) => ({ grade }));
}

export default async function GradePage({
  params,
  searchParams
}: {
  params: { grade: string };
  searchParams?: { lang?: string };
}) {
  const lang = getLanguageFromSearchParam(searchParams?.lang);
  const t = getUiText(lang);
  const content = await getContentIndex(lang);
  const topics = content[params.grade] ?? [];

  return (
    <main className="container">
      <div className="page-toolbar">
        <div className="breadcrumbs">
          <Link href={`/?lang=${lang}`}>{t.classes}</Link> /{' '}
          <span>
            {params.grade} {t.gradeSuffix}
          </span>
        </div>
        <LanguageSwitcher lang={lang} label={t.languageLabel} />
      </div>
      <h1>
        {params.grade} {t.gradeSuffix}
      </h1>
      <TopicListClient grade={params.grade} topics={topics} lang={lang} />
    </main>
  );
}
