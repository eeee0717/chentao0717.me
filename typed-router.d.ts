/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...404]': RouteRecordInfo<'/[...404]', '/:404(.*)', { 404: ParamValue<true> }, { 404: ParamValue<false> }>,
    '/bookmarks': RouteRecordInfo<'/bookmarks', '/bookmarks', Record<never, never>, Record<never, never>>,
    '/demos': RouteRecordInfo<'/demos', '/demos', Record<never, never>, Record<never, never>>,
    '/notes': RouteRecordInfo<'/notes', '/notes', Record<never, never>, Record<never, never>>,
    '/posts/': RouteRecordInfo<'/posts/', '/posts', Record<never, never>, Record<never, never>>,
    '/projects': RouteRecordInfo<'/projects', '/projects', Record<never, never>, Record<never, never>>,
  }
}
