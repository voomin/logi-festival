// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  css: ['~/assets/style.css'],
  modules: ['@pinia/nuxt'],
  app: {
    head: {
      title: '로지 운동회',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      

      // meta
      meta: [
        { hid: 'description', name: 'description', content: '로지 운동회' },
        { hid: 'og:title', property: 'og:title', content: '로지 운동회' },
        { hid: 'og:description', property: 'og:description', content: '로지 운동회' },
        { hid: 'og:image', property: 'og:image', content: 'https://rojihub.com/roji.png' },
        { hid: 'og:url', property: 'og:url', content: 'https://rojihub.com' },
      ],

      // favicon
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css', crossorigin: 'anonymous', integrity: "sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" },
      ],

      script: [
        { src: "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js", integrity: "sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r", crossorigin: "anonymous" },
        { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js", integrity: "sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+", crossorigin: "anonymous" },
      ],
    },
  },
});