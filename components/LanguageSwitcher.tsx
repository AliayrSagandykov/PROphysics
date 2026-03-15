'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const languageOptions = [
  { code: 'ru', label: 'Русский' },
  { code: 'kk', label: 'Қазақша' }
] as const;

export default function LanguageSwitcher({
  lang,
  label
}: {
  lang: string;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (nextLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', nextLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="language-switcher">
      <label htmlFor="language-select">{label}</label>
      <select
        id="language-select"
        value={lang}
        onChange={(event) => handleLanguageChange(event.target.value)}
      >
        {languageOptions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
