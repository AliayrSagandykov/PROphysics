import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getLanguageFromSearchParam } from '@/lib/content';

const grades = ['7', '8', '9'];

export default function HomePage({ searchParams }: { searchParams?: { lang?: string } }) {
  const lang = getLanguageFromSearchParam(searchParams?.lang);

  return (
    <main className="container">
      <div className="page-toolbar">
        <h1>Физика 7–9 класс</h1>
        <LanguageSwitcher lang={lang} />
      </div>
      <p className="muted">Выберите класс, чтобы открыть каталог тем и уроков.</p>
      <div className="grid grid-3">
        {grades.map((grade) => (
          <Link key={grade} href={`/grades/${grade}?lang=${lang}`} className="card">
            <h2 style={{ margin: 0 }}>{grade} класс</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
