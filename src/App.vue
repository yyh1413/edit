<template>
  <div id="app">
    <router-view v-if="ssoFlag" />
  </div>
</template>

<script>
import { initApp } from '@/utils/init'
import { handleLoginGetInfo } from '@/utils/auth'

export default {
  name: "App",
  data() {
    return {
      ssoFlag: true
    };
  },
  created() {
    // handleLoginGetInfo();
    // initApp(this);
  },
  mounted() {

  },
};
</script>
<style scoped>
#app {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
}
</style>
