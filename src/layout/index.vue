<template>
  <div class="app-wrapper">
    <div class="main-container">
      <div class="navbar-container">
        <navbar />
      </div>
      <div style="padding-top: 44px" class="app_outer">
        <app-main />
      </div>
    </div>
    <!-- <Report /> -->
  </div>
</template>

<script>
import { AppMain, Navbar } from './components'
export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
  },
  data() {
    return {
      toolShow: true
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
}
</script>

<style lang="scss" scoped>
.app_outer {
  position: relative;
  height: 100%;
  width: 100%;
}

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.main-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.navbar-container {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
