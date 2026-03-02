import fs from 'fs/promises';
import path from 'path';

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
  const resourceHref = manifestXml.match(/<resource[^>]*\shref=["']([^"']+)["'][^>]*>/i);
  return resourceHref?.[1] ?? null;
}

function extractLomFields(lomXml) {
  const titleBlock = extractTag(lomXml, 'title');
  const title = titleBlock ? stripTags(titleBlock) : null;

  const descriptionBlock = extractTag(lomXml, 'description');
  const description = descriptionBlock ? stripTags(descriptionBlock) : '';

  const keywordBlocks = extractAllTags(lomXml, 'keyword');
  const keywords = keywordBlocks.map(stripTags).filter(Boolean);

  return { title, description, keywords };
}

function getOrder(slug) {
  const match = slug.match(/^(\d+(?:[\.,]\d+)?)/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number.parseFloat(match[1].replace(',', '.'));
}

function normalizeResourcePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '');
}

async function findFirstFile(topicDir, candidates) {
  const dirents = await fs.readdir(topicDir, { withFileTypes: true });
  for (const candidate of candidates) {
    const file = dirents.find(
      (d) => d.isFile() && d.name.localeCompare(candidate, undefined, { sensitivity: 'accent' }) === 0
    );
    if (file) {
      return path.join(topicDir, file.name);
    }
  }
  return null;
}

async function findFirstSwf(topicDir) {
  const dirents = await fs.readdir(topicDir, { withFileTypes: true });
  const swf = dirents.find((d) => d.isFile() && d.name.toLowerCase().endsWith('.swf'));
  return swf ? swf.name : null;
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

      try {
        const manifestPath = await findFirstFile(topicDir, ['imsmanifest.xml']);
        const lomPath = await findFirstFile(topicDir, ['LOM_resource.xml', 'lom_resource.xml']);

        let href = null;
        if (manifestPath) {
          const manifestXml = await readXml(manifestPath);
          href = extractHref(manifestXml);
        }

        const swfFile = href ? normalizeResourcePath(href) : await findFirstSwf(topicDir);

        if (!swfFile) {
          console.warn(`[skip] ${grade}/${slug}: missing swf`);
          continue;
        }

        let title = slug;
        let description = '';
        let keywords = [];
        if (lomPath) {
          const lomXml = await readXml(lomPath);
          const parsed = extractLomFields(lomXml);
          title = parsed.title || slug;
          description = parsed.description;
          keywords = parsed.keywords;
        }

        result[grade].push({
          slug,
          title,
          description,
          keywords,
          swf: `/content/${grade}/${slug}/${swfFile}`,
          order: getOrder(slug)
        });
      } catch (error) {
        console.warn(`[skip] ${grade}/${slug}: ${error.message}`);
      }
    }

    result[grade].sort((a, b) => a.order - b.order);
  }

  await fs.writeFile(outPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(`Generated ${path.relative(root, outPath)}`);
}

build();
