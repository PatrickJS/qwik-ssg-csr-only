# Qwik SSG->CSR only. No SSR

example on how to do CSR only by using SSG->CSR with useResource and some of the qwik-city router features.

## What you lose from SSR
* server$
  * you have to make your own fetch wrappers
* $routerLoader
  * you have to useResource with useVisibleTask$ example to load on new route
* actions
  * you need a server for this anyways so you must use signals. Modular Forms does have a way to use signals-only



## FAQ
* CORS
  * add proxy in vite.config with changeOrigin to your api