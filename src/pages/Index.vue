<template>
  <Layout>
    
    <!-- Learn how to use images here: https://gridsome.org/docs/images -->
    <g-image alt="Example image" src="~/favicon.png" width="135" />
    
    <h1>Home</h1>
   
    <p>{{ slogan }}</p>

    <p class="home-links">
        <a v-for="link in links" :key="link.id" v-bind:href="link.linkUri" target="_blank" rel="noopener">{{ link.linkText }}</a>
    </p>

  </Layout>
</template>

<script>
import social_links from "../../static/social_links.json"

export default {
  data() {
    return {
      slogan: "If water goes through it, Maranto's can do it!",
      links: social_links
    }
  },
  metaInfo: {
    title: 'Home'
  }
}
</script>

<style>
.home-links a {
  margin-right: 1rem;
}
</style>
