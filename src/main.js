// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { router, head, isClient }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  // Open Graph Required
  // https://developers.facebook.com/tools/debug/sharing/?q=marantosws.com
  const images = [
    'https://imagecdn.app/v1/images/https%3A%2F%2Fimages.unsplash.com%2Fphoto-1538474705339-e87de81450e8%3Fixlib%3Drb-1.2.1%26ixid%3DeyJhcHBfaWQiOjEyMDd9%26auto%3Dformat%26fit%3Dcrop%26w%3D2100%26q%3D80?width=600',
  ]

  images.forEach((content) => {
    head.meta.push({
      key: 'og:image',
      name: 'og:image',
      content: content,
    })
  })

  // head.meta.push({
  //   key: 'og:title',
  //   name: 'og:title',
  //   content: `Maranto’s Sewer & Water Services LLC`,
  // })

  // head.meta.push({
  //   key: 'og:type',
  //   name: 'og:type',
  //   content: 'website',
  // })

  // head.meta.push({
  //   key: 'og:url',
  //   name: 'og:url',
  //   content: `https://www.marantosws.com/`,
  // })

  // Open Graph Optional
  // head.meta.push({
  //   key: 'og:description',
  //   name: 'og:description',
  //   content: `Maranto’s Sewer & Water Services LLC`,
  // })

  // Twitter
  // head.meta.push({
  //   key: 'twitter:card',
  //   name: 'twitter:card',
  //   content: 'summary',
  // })

  // head.meta.push({
  //   key: 'twitter:site',
  //   name: 'twitter:site',
  //   content: '@RyanBalfanz',
  // })

  // head.meta.push({
  //   key: 'twitter:creator',
  //   name: 'twitter:creator',
  //   content: '@RyanBalfanz',
  // })

  // router.beforeEach((to, _from, next) => {
  //   head.meta.push({
  //     key: 'og:url',
  //     name: 'og:url',
  //     content: process.env.GRIDSOME_BASE_PATH + to.path,
  //   })
  //   next()
  // })
}
