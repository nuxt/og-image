import { defineEventHandler, setHeader } from 'h3'
import { prefixStorage } from 'unstorage'
import { useRuntimeConfig, useSiteConfig, useStorage } from '#imports'

// @ts-expect-error untyped
import { componentNames } from '#nuxt-og-image/component-names.mjs'

export default defineEventHandler(async (e) => {
  // set json header
  setHeader(e, 'Content-Type', 'application/json')
  const runtimeConfig = useRuntimeConfig()['nuxt-og-image']
  const siteConfig = await useSiteConfig(e, { debug: true })

  const baseCacheKey = runtimeConfig.runtimeCacheStorage === 'default' ? `/cache/nuxt-og-image@${runtimeConfig.version}` : `/nuxt-og-image@${runtimeConfig.version}`
  const cache = prefixStorage(useStorage(), `${baseCacheKey}/`)
  return {
    siteConfigUrl: {
      value: siteConfig.url,
      source: siteConfig._context.url || 'unknown',
    },
    componentNames,
    runtimeConfig,
    baseCacheKey,
    cachedKeys: await cache.getKeys(),
  }
})