import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enFooter from './locales/en/footer.json';
import enFuture from './locales/en/future.json';
import enGallery from './locales/en/gallery.json';
import enGrowth from './locales/en/growth.json';
import enHero from './locales/en/hero.json';
import enJourney from './locales/en/journey.json';
import enMemories from './locales/en/memories.json';
import enNavbar from './locales/en/navbar.json';
import enProjects from './locales/en/projects.json';

import idFooter from './locales/id/footer.json';
import idFuture from './locales/id/future.json';
import idGallery from './locales/id/gallery.json';
import idGrowth from './locales/id/growth.json';
import idHero from './locales/id/hero.json';
import idJourney from './locales/id/journey.json';
import idMemories from './locales/id/memories.json';
import idNavbar from './locales/id/navbar.json';
import idProjects from './locales/id/projects.json';

export const LANGUAGE_STORAGE_KEY = 'portfolio_language';
export const supportedLanguages = ['en', 'id'];

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
const initialLanguage = supportedLanguages.includes(savedLanguage) ? savedLanguage : 'en';

const resources = {
  en: {
    footer: enFooter,
    future: enFuture,
    gallery: enGallery,
    growth: enGrowth,
    hero: enHero,
    journey: enJourney,
    memories: enMemories,
    navbar: enNavbar,
    projects: enProjects,
  },
  id: {
    footer: idFooter,
    future: idFuture,
    gallery: idGallery,
    growth: idGrowth,
    hero: idHero,
    journey: idJourney,
    memories: idMemories,
    navbar: idNavbar,
    projects: idProjects,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    defaultNS: 'navbar',
    ns: ['navbar', 'hero', 'memories', 'journey', 'gallery', 'growth', 'future', 'footer', 'projects'],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

i18n.on('languageChanged', (language) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.documentElement.lang = language === 'id' ? 'id' : 'en';
});

document.documentElement.lang = initialLanguage === 'id' ? 'id' : 'en';

export default i18n;
