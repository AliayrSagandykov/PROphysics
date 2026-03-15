'use client';

import { useEffect, useState } from 'react';
import { getUiText } from '../lib/ui-i18n';

type Props = {
  grade: string;
  slug: string;
  lang: string;
};

export default function ProgressControls({ grade, slug, lang }: Props) {
  const [completed, setCompleted] = useState(false);
  const t = getUiText(lang);

  useEffect(() => {
    const viewedKey = `physics:viewed:${grade}`;
    const completedKey = `physics:completed:${grade}`;

    const viewed = new Set<string>(JSON.parse(localStorage.getItem(viewedKey) ?? '[]'));
    viewed.add(slug);
    localStorage.setItem(viewedKey, JSON.stringify([...viewed]));

    const completedSet = new Set<string>(JSON.parse(localStorage.getItem(completedKey) ?? '[]'));
    setCompleted(completedSet.has(slug));
  }, [grade, slug]);

  const toggleCompleted = () => {
    const key = `physics:completed:${grade}`;
    const completedSet = new Set<string>(JSON.parse(localStorage.getItem(key) ?? '[]'));
    if (completedSet.has(slug)) {
      completedSet.delete(slug);
      setCompleted(false);
    } else {
      completedSet.add(slug);
      setCompleted(true);
    }
    localStorage.setItem(key, JSON.stringify([...completedSet]));
  };

  return (
    <div className="topic-actions">
      <button onClick={toggleCompleted} className={completed ? '' : 'primary'}>
        {completed ? t.unmarkDone : t.markDone}
      </button>
    </div>
  );
}
