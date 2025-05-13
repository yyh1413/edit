<template>
  <div>
    <el-submenu v-if="item.children && item.children.length" :index="item.path">
      <template slot="title">
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      <menu-item v-for="child in item.children" :key="child.path" :item="child" />
    </el-submenu>
    <el-menu-item v-else :index="item.path">
      <i :class="item.meta.icon"></i>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
