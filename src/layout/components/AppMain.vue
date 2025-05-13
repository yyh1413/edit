<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="!$route.meta.link" :key="key" />
    </transition>
  </section>
</template>

<script>

export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path + Math.random()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  height: 100%;
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  // overflow: hidden;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 6px;
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background-color: #c0c0c0;
  border-radius: 3px;
}
</style>
