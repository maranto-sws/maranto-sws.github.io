<template>
  <Layout>
    <h1>About us</h1>
    <div class="vcard">
      <p class="tel"><a v-bind:href="phoneNumberUri">{{ phoneNumber }}</a></p>
      <p class="adr">
        <span class="street-address">{{ address.street }}</span><br />
        <span class="region">{{ address.city }}, {{ address.state }}</span>&nbsp;<span class="postal-code">{{ address.zip }}</span><br />
        <span class="country-name">{{ address.country }}</span>
      </p>
    </div>
    <div>
      <iframe v-bind:src="map.src" v-bind:width="map.width" v-bind:height="map.height"></iframe>
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    const mapSrc = 'https://www.google.com/maps/d/embed?mid=13b8fRuq3vAolH_nKIZlEtlCYYUFNP9lA'
    const phoneNumber = '16304210091'

    // https://stackoverflow.com/a/8358141
    function formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
      if (match) {
        var intlCode = (match[1] ? '+1 ' : '')
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
      }
      return null
    }

    return {
      phoneNumber: formatPhoneNumber(phoneNumber),
      phoneNumberUri: `tel:${phoneNumber}`,
      address: {
        street: "235 Nordic Rd".toLocaleUpperCase(),
        city: "Bloomingdale".toLocaleUpperCase(),
        state: "IL".toLocaleUpperCase(),
        country: "United States".toLocaleUpperCase(),
        zip: "60108-1611".toLocaleUpperCase()
      },
      map: {
        src: mapSrc,
        width: 640,
        height: 480
      }
    }
  },
  metaInfo: {
    title: 'About us'
  }
}
</script>
