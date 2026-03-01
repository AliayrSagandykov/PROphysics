import fs from 'node:fs/promises';
import path from 'node:path';

export type Topic = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  swf: string;
  order: number;
};

export type ContentIndex = Record<string, Topic[]>;

const indexPath = path.join(process.cwd(), 'public', 'contentIndex.json');

export async function getContentIndex(): Promise<ContentIndex> {
  try {
    const raw = await fs.readFile(indexPath, 'utf8');
    return JSON.parse(raw) as ContentIndex;
  } catch {
    return { '7': [], '8': [], '9': [] };
  }
}

export function getSortedTopics(
  topics: Topic[],
  sortBy: 'order' | 'title'
): Topic[] {
  return [...topics].sort((a, b) =>
    sortBy === 'title' ? a.title.localeCompare(b.title, 'ru') : a.order - b.order
  );
}

export function findTopic(topics: Topic[], slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug);
}
