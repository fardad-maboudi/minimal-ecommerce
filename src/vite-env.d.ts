/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JOORCHIN_APP_ID?: string;
  readonly VITE_JOORCHIN_SERVER_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
