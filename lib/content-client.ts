export type Topic = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  swf: string;
  order: number;
};

export type ContentIndex = Record<string, Topic[]>;

async function fetchContentIndex(): Promise<ContentIndex> {
  const res = await fetch('/contentIndex.json', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load /contentIndex.json');
  }
  return res.json();
}

export async function getContentIndex() {
  return fetchContentIndex();
}

export async function loadContentIndex() {
  return fetchContentIndex();
}

export async function readContentIndex() {
  return fetchContentIndex();
}

export function getSortedTopics(
  topics: Topic[],
  sortBy: 'order' | 'title'
): Topic[] {
  return [...topics].sort((a, b) =>
    sortBy === 'title' ? a.title.localeCompare(b.title, 'ru') : a.order - b.order
  );
}

export default fetchContentIndex;
