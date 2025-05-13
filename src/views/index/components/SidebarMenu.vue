<template>
  <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" :unique-opened="true" router>
    <menu-item v-for="route in menuRoutes" :key="route.path" :item="route" />
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem.vue';
import { getToken, } from '@/utils/auth';
export default {
  components: { MenuItem },
  data() {
    return {
      menuRoutes: []
    };
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
  mounted() {
    console.log(getToken());
    if (getToken()) {
      this.menuRoutes = this.$router.options.routes[0].children[0].children.filter(v => v.meta.menu)
    } else {
      this.menuRoutes = this.$router.options.routes[0].children[0].children.filter(v => v.meta.menu && !v.meta.isLogin)
    }
  }
};
</script>

<style scoped>
.el-menu {
  border-right: none;
  height: 100%;
}
</style>
