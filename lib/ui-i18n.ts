export type UiLanguage = 'ru' | 'kk';

type UiDictionary = {
  languageLabel: string;
  homeTitle: string;
  homeSubtitle: string;
  classes: string;
  gradeSuffix: string;
  progressLabel: string;
  searchPlaceholder: string;
  sortByOrder: string;
  sortByTitle: string;
  noDescription: string;
  statusLabel: string;
  statusDone: string;
  statusNotMarked: string;
  notFound: string;
  descriptionMissing: string;
  backToTopics: string;
  prevTopic: string;
  nextTopic: string;
  markDone: string;
  unmarkDone: string;
};

const dict: Record<UiLanguage, UiDictionary> = {
  ru: {
    languageLabel: 'Язык:',
    homeTitle: 'Физика 7–9 класс',
    homeSubtitle: 'Выберите класс, чтобы открыть каталог тем и уроков.',
    classes: 'Классы',
    gradeSuffix: 'класс',
    progressLabel: 'Прогресс',
    searchPlaceholder: 'Поиск по темам и ключевым словам',
    sortByOrder: 'Сортировка по номеру',
    sortByTitle: 'Сортировка по алфавиту',
    noDescription: 'Без описания',
    statusLabel: 'Статус',
    statusDone: '✅ Пройдено',
    statusNotMarked: '— Не отмечено',
    notFound: 'Ничего не найдено.',
    descriptionMissing: 'Описание отсутствует.',
    backToTopics: 'Назад к темам',
    prevTopic: '← Предыдущая тема',
    nextTopic: 'Следующая тема →',
    markDone: 'Отметить как пройдено',
    unmarkDone: 'Снять отметку «Пройдено»'
  },
  kk: {
    languageLabel: 'Тіл:',
    homeTitle: 'Физика 7–9 сынып',
    homeSubtitle: 'Тақырыптар мен сабақтар каталогын ашу үшін сыныпты таңдаңыз.',
    classes: 'Сыныптар',
    gradeSuffix: 'сынып',
    progressLabel: 'Прогресс',
    searchPlaceholder: 'Тақырыптар мен кілт сөздер бойынша іздеу',
    sortByOrder: 'Нөмір бойынша сұрыптау',
    sortByTitle: 'Әліпби бойынша сұрыптау',
    noDescription: 'Сипаттама жоқ',
    statusLabel: 'Күйі',
    statusDone: '✅ Өтілді',
    statusNotMarked: '— Белгіленбеген',
    notFound: 'Ештеңе табылмады.',
    descriptionMissing: 'Сипаттама жоқ.',
    backToTopics: 'Тақырыптарға оралу',
    prevTopic: '← Алдыңғы тақырып',
    nextTopic: 'Келесі тақырып →',
    markDone: 'Өтілді деп белгілеу',
    unmarkDone: '«Өтілді» белгісін алып тастау'
  }
};

export function getUiText(lang: string): UiDictionary {
  return dict[lang as UiLanguage] ?? dict.ru;
}
