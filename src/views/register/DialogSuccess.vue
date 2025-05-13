<template>
  <el-dialog
    width="824px"
    append-to-body
    class="dialog-register-success"
    title="恭喜您注册成功"
    :visible="visible"
    @close="close"
  >
    <div class="content">
      <div class="left">

      </div>
      <div class="right"></div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {},
  },
  data() {
    return {
      // 表单校验
    };
  },
  mounted() {},
  methods: {
    close() {
      this.$router.push("/login");
      this.$emit("update:visible", false);
    },
  },
};
</script>
<style>
.dialog-register-success .el-dialog__body {
  padding: 24px;
}
</style>
<style scoped lang="scss">
.content{
  display: flex;
  justify-content: space-between;
  .left{
    width: 488px;
    height: 444px;
    background: #F6F7FA;
    border: 1px solid #E7E8EE;
    padding: 20px;
    box-sizing: border-box;
    font-size: 16px;
    color: #262930;
  }

  .right{
    width: 260px;
    height: 260px;
    background: #FFFFFF;
    border-radius: 12px;
    border: 1px solid #E6EBF1;
    padding: 8px;
    box-sizing: border-box;
    padding: 10px;
  }
}
</style>
