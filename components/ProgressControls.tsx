'use client';

import { useEffect, useState } from 'react';

type Props = {
  grade: string;
  slug: string;
};

export default function ProgressControls({ grade, slug }: Props) {
  const [completed, setCompleted] = useState(false);

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
        {completed ? 'Снять отметку «Пройдено»' : 'Отметить как пройдено'}
      </button>
    </div>
  );
}
