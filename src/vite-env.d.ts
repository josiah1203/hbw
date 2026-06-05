/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HBP_API_URL?: string;
  readonly VITE_HBP_ACCESS_TOKEN?: string;
  readonly VITE_HBP_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
