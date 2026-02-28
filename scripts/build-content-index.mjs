import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const contentRoot = path.join(root, 'public', 'content');
const outPath = path.join(root, 'public', 'contentIndex.json');
const grades = ['7', '8', '9'];

const win1251Decoder = new TextDecoder('windows-1251');

async function readXml(filePath) {
  const buf = await fs.readFile(filePath);
  const utf8 = buf.toString('utf8');
  if (/encoding=["']windows-1251["']/i.test(utf8) || utf8.includes('�')) {
    return win1251Decoder.decode(buf);
  }
  return utf8;
}

function normalizeXml(xml) {
  return xml.replace(/<(\/?)([\w.-]+):([\w.-]+)/g, '<$1$2_$3');
}

function extractTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match?.[1]?.trim() ?? null;
}

function extractAllTags(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi'))].map((m) =>
    m[1].trim()
  );
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function extractHref(manifestXml) {
  const normalized = normalizeXml(manifestXml);
  const resourceHref = normalized.match(/<resource[^>]*\shref=["']([^"']+)["'][^>]*>/i);
  return resourceHref?.[1]?.trim() ?? null;
}

function extractLomFields(lomXml) {
  const normalized = normalizeXml(lomXml);

  const titleBlock =
    extractTag(normalized, 'title') ??
    extractTag(normalized, 'general_title') ??
    extractTag(normalized, 'lom_general_title');
  const title = titleBlock ? stripTags(titleBlock) : null;

  const descriptionBlock =
    extractTag(normalized, 'description') ??
    extractTag(normalized, 'general_description') ??
    extractTag(normalized, 'lom_general_description');
  const description = descriptionBlock ? stripTags(descriptionBlock) : '';

  const keywordBlocks = [
    ...extractAllTags(normalized, 'keyword'),
    ...extractAllTags(normalized, 'general_keyword'),
    ...extractAllTags(normalized, 'lom_general_keyword')
  ];
  const keywords = [...new Set(keywordBlocks.map(stripTags).filter(Boolean))];

  return { title, description, keywords };
}

function getOrder(slug) {
  const match = slug.match(/^(\d+(?:[\.,]\d+)?)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number.parseFloat(match[1].replace(',', '.'));
}

async function build() {
  const result = { '7': [], '8': [], '9': [] };

  for (const grade of grades) {
    const gradeDir = path.join(contentRoot, grade);
    let dirents = [];

    try {
      dirents = await fs.readdir(gradeDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const dirent of dirents) {
      if (!dirent.isDirectory()) continue;

      const slug = dirent.name;
      const topicDir = path.join(gradeDir, slug);
      const manifestPath = path.join(topicDir, 'imsmanifest.xml');
      const lomPath = path.join(topicDir, 'LOM_resource.xml');

      try {
        const [manifestXml, lomXml] = await Promise.all([readXml(manifestPath), readXml(lomPath)]);
        const href = extractHref(manifestXml);
        const { title, description, keywords } = extractLomFields(lomXml);

        if (!href || !title) {
          console.warn(`[skip] ${grade}/${slug}: missing href or title`);
          continue;
        }

        result[grade].push({
          slug,
          title,
          description,
          keywords,
          swf: `/content/${grade}/${slug}/${href}`,
          order: getOrder(slug)
        });
      } catch (error) {
        console.warn(`[skip] ${grade}/${slug}: ${error.message}`);
      }
    }

    result[grade].sort((a, b) => a.order - b.order);
  }

  await fs.writeFile(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(`Generated ${path.relative(root, outPath)}`);
}

build();
