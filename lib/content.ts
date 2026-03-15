import fs from 'fs/promises';
import path from 'path';

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

function getIndexPath(lang?: string): string {
  const safeLang = normalizeLanguage(lang);
  return path.join(process.cwd(), 'public', `contentIndex.${safeLang}.json`);
}

export async function getContentIndex(lang?: string): Promise<ContentIndex> {
  const indexPath = getIndexPath(lang);

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

export function getLanguageFromSearchParam(lang?: string): ContentLanguage {
  return normalizeLanguage(lang);
}
