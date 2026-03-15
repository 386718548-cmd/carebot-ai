import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import en from '../../messages/en.json';
import zh from '../../messages/zh.json';

const messages: Record<string, any> = { en, zh };

type Locale = 'en' | 'zh';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (namespace: string) => (key: string, values?: any) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const t = useCallback((namespace: string) => (key: string, values?: any) => {
    const nsMessages = messages[locale][namespace];
    if (!nsMessages) return `${namespace}.${key}`;
    
    let message = nsMessages[key] || key;
    if (values) {
      Object.keys(values).forEach(v => {
        message = message.replace(`{${v}}`, values[v]);
      });
    }
    return message;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslations(namespace: string) {
  const { t } = useI18n();
  return t(namespace);
}

export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}
