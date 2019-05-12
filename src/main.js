// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // Open Graph Required
  // http://ogp.me/
  // https://developers.facebook.com/tools/debug/sharing/?q=marantosws.com
  const images = [
    'https://raw.githubusercontent.com/maranto-sws/maranto-sws.github.io/c36529a976969582ad1ae5398fc15950b922da12/src/assets/logo_on_white_4096x2048.jpg',
  ]
  const slogan = 'Maranto’s Sewer & Water Services LLC'

  images.forEach((content) => {
    head.meta.push({
      key: 'og:image',
      property: 'og:image',
      content: content,
    })
  })

  head.meta.push({
    key: 'og:title',
    property: 'og:title',
    content: slogan,
  })

  head.meta.push({
    key: 'og:type',
    property: 'og:type',
    content: 'website',
  })

  // head.meta.push({
  //   key: 'og:url',
  //   property: 'og:url',
  //   content: `https://www.marantosws.com/`,
  // })

  // Open Graph Optional
  head.meta.push({
    key: 'og:description',
    property: 'og:description',
    content: slogan,
  })

  // Twitter
  // head.meta.push({
  //   key: 'twitter:card',
  //   property: 'twitter:card',
  //   content: 'summary',
  // })

  // head.meta.push({
  //   key: 'twitter:site',
  //   property: 'twitter:site',
  //   content: '@RyanBalfanz',
  // })

  // head.meta.push({
  //   key: 'twitter:creator',
  //   property: 'twitter:creator',
  //   content: '@RyanBalfanz',
  // })

  // router.beforeEach((to, _from, next) => {
  //   head.meta.push({
  //     key: 'og:url',
  //     property: 'og:url',
  //     content: process.env.GRIDSOME_BASE_PATH + to.path,
  //   })
  //   next()
  // })
}
