export const SUPPORTED_LANGUAGES = ['ru', 'kk'] as const;
export type ContentLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type Topic = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  swf: string;
  order: number;
};

export type ContentIndex = Record<string, Topic[]>;

function normalizeLanguage(lang?: string): ContentLanguage {
  return SUPPORTED_LANGUAGES.includes(lang as ContentLanguage) ? (lang as ContentLanguage) : 'ru';
}

async function fetchContentIndex(lang?: string): Promise<ContentIndex> {
  const safeLang = normalizeLanguage(lang);
  const path = `/contentIndex.${safeLang}.json`;
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return res.json();
}

export async function getContentIndex(lang?: string) {
  return fetchContentIndex(lang);
}

export async function loadContentIndex(lang?: string) {
  return fetchContentIndex(lang);
}

export async function readContentIndex(lang?: string) {
  return fetchContentIndex(lang);
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
