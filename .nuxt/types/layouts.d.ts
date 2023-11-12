import { ComputedRef, MaybeRef } from 'vue'
export type LayoutKey = "main"
declare module "../../node_modules/.pnpm/nuxt@3.8.1_vite@4.5.0/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: MaybeRef<LayoutKey | false> | ComputedRef<LayoutKey | false>
  }
}