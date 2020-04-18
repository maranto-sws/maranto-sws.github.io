<template>
  <Layout>
    <h1>Contact us</h1>
    <div>
      <iframe v-bind:src="form.src" v-bind:width="form.width" v-bind:height="form.height" frameborder="0"
        marginheight="0" marginwidth="0">{{ form.loadingText }}</iframe>
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    const formSrc = 'https://docs.google.com/forms/d/e/1FAIpQLScKz-1faYc05hZyNHNSgSPauHL14uu2WJk7m7uRVtUi_yVAwQ/viewform?embedded=true'

    return {
      form: {
        src: formSrc,
        width: 640,
        height: 1388,
        loadingText: 'Loading...'
      }
    }
  },
  metaInfo: {
    title: 'Contact us'
  }
}
</script>
