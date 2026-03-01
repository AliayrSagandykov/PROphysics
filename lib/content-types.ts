export type Topic = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  swf: string;
  order: number;
};

export type ContentIndex = Record<string, Topic[]>;

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
