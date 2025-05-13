<template>
  <div class="layout" :style="{ width: $store.getters.isAdmin ? '100%' : '1200px' }">
    <el-container style="height: 100%">
      <el-aside width="200px">
        <sidebar-menu />
      </el-aside>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SidebarMenu from './components/SidebarMenu.vue';

export default {
  components: {
    SidebarMenu,
  },
  mounted() {
    console.log('  this.$store.getters', this.$store.getters.isAdmin);

  }
};
</script>

<style scoped>
.layout {
  padding: 20px 0;
  height: 100%;
  /* width: 1200px; */
  margin: 0 auto;

}

.el-main {
  padding: 0 !important;
  margin-left: 14px;
  /* background: #fcfeff; */
  border-radius: 10px;
}
</style>
