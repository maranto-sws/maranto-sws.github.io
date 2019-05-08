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
export default {
  data() {
    return {
      slogan: "If water goes through it, Maranto's can do it!",
      links: [{
        id: 1,
        linkText: "Facebook",
        linkUri: "https://www.facebook.com/Marantos-Sewer-Water-Services-LLC-657508358034475/"
      }]
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
