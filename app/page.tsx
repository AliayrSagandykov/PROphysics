import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getLanguageFromSearchParam } from '@/lib/content';
import { getUiText } from '@/lib/ui-i18n';

const grades = ['7', '8', '9'];

export default function HomePage({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = getLanguageFromSearchParam(searchParams?.lang);
  const t = getUiText(lang);

  return (
    <main className="container">
      <div className="page-toolbar">
        <h1>{t.homeTitle}</h1>
        <LanguageSwitcher lang={lang} label={t.languageLabel} />
      </div>
      <p className="muted">{t.homeSubtitle}</p>
      <div className="grid grid-3">
        {grades.map((grade) => (
          <Link key={grade} href={`/grades/${grade}?lang=${lang}`} className="card">
            <h2 style={{ margin: 0 }}>
              {grade} {t.gradeSuffix}
            </h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
