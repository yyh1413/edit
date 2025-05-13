<template>
  <div>
    <h1 style="margin-left: 4px;">{{ name }}</h1>
    <el-empty description="暂无数据" v-if='list.length == 0'></el-empty>
    <div class="notebook_box" v-else>
      <div v-for="item in list" :key="item.id" class="notebook_item" @click="$router.push(`/detailsNotebook/${item.id}`)">
        <img :src="item.templateImageContent" />
        <div class="note_right">
          <div class="notebook_item_title">{{ item.templateTitle }}</div>
          <div class="tag">
            <div class="tag_item" v-for="v in item.tags" :key="v">{{ v }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default: () => [],
    },
  },


}
</script>

<style lang="scss" scoped>
.notebook_box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .notebook_item {
    width: 49%;
    height: 100px;
    background: #FFFFFF;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 15px;
    cursor: pointer;

    img {
      width: 76px;
      height: 76px;
      background: #D8D8D8;
      border-radius: 8px;
    }

    .note_right {
      margin-left: 10px;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .notebook_item_title {
        font-weight: 500;
        font-size: 14px;
        color: #262626;

      }

      .tag {
        margin-top: 10px;
        display: flex;
        gap: 10px;
      }

      .tag_item {
        padding: 0 10px;
        min-width: 68px;
        height: 24px;
        background: #E6EBF1;
        border-radius: 12px;
        font-size: 12px;
        color: #262626;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>