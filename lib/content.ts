import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import type { ContentIndex } from '@/lib/content-types';

const indexPath = path.join(process.cwd(), 'public', 'contentIndex.json');

export async function getContentIndex(): Promise<ContentIndex> {
  try {
    const raw = await fs.readFile(indexPath, 'utf8');
    return JSON.parse(raw) as ContentIndex;
  } catch {
    return { '7': [], '8': [], '9': [] };
  }
}
