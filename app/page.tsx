import Link from 'next/link';

const grades = ['7', '8', '9'];

export default function HomePage() {
  return (
    <main className="container">
      <h1>Физика 7–9 класс</h1>
      <p className="muted">Выберите класс, чтобы открыть каталог тем и уроков.</p>
      <div className="grid grid-3">
        {grades.map((grade) => (
          <Link key={grade} href={`/grades/${grade}`} className="card">
            <h2 style={{ margin: 0 }}>{grade} класс</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
