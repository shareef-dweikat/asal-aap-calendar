import { Context, Store } from '../context/store';
import { useContext, useEffect } from 'react';
import de from '../locales/de.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';
import ptBR from '../locales/ptBR.json';
import ru from '../locales/ru.json';
import zh from '../locales/zh.json';

const getKnownLanguage = (language: string) => {
  switch (language) {
    case 'en':
      return en;
    case 'de':
      return de;
    case 'es':
      return es;
    case 'fr':
      return fr;
    case 'it':
      return it;
    case 'ptBR':
      return ptBR;
    case 'ru':
      return ru;
    case 'zh':
      return zh;
    default:
      return 'en';
  }
};

const LanguageLayer = (props: {
  children: any;
  language?: string;
  customLanguage?: any;
}) => {
  const { language, customLanguage } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [store, dispatch]: [Store, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatch({ type, payload });
  };

  const { translations } = store;

  useEffect(() => {
    if (customLanguage) {
      setContext('translations', customLanguage);
    } else if (language) {
      setContext('translations', getKnownLanguage(language));
    }
  }, []);

  useEffect(() => {
    if (customLanguage) {
      setContext('translations', customLanguage);
    } else if (language) {
      setContext('translations', getKnownLanguage(language));
    }
  }, [customLanguage, language]);

  return translations ? props.children : null;
};

export default LanguageLayer;
