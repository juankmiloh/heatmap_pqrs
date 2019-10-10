<template>
  <section class="container">
    <div>
      <!-- <app-logo/> -->
      <img src="~/assets/logo_super.png" height="150px">
      <h1 class="title">
        MAPA DE CALOR
      </h1>
      <h2 class="subtitle">
        Peticiones Quejas y Reclamos SSPD
      </h2>
      <div class="links">
        <nuxt-link class="button--green" to="/map">
          Ver Mapa
        </nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import AppLogo from '~/components/AppLogo.vue'

export default {
  components: {
    AppLogo
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

