import Link from 'next/link';
import { getContentIndex } from '@/lib/content';
import TopicListClient from '@/components/TopicListClient';

export default async function GradePage({ params }: { params: { grade: string } }) {
  const content = await getContentIndex();
  const topics = content[params.grade] ?? [];

  return (
    <main className="container">
      <div className="breadcrumbs">
        <Link href="/">Классы</Link> / <span>{params.grade} класс</span>
      </div>
      <h1>{params.grade} класс</h1>
      <TopicListClient grade={params.grade} topics={topics} />
    </main>
  );
}
