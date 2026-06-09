import 'i18next';
import enMain from './locales/en/main.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'main';
    resources: {
      main: typeof enMain;
    };
  }
}