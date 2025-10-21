/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TICKETMASTER_API_KEY: string
  readonly VITE_OPENTRIPMAP_API_KEY: string
  readonly VITE_UNSPLASH_API_KEY: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
