<template>
  <el-dialog
    width="824px"
    append-to-body
    class="dialog-register-success"
    title="阔跃用户服务协议和隐私政策"
    :visible="visible"
    @close="close"
  >
    <div class="content">
      <iframe width="742px" height="350px" src="/html/privacy_policy.html" frameborder="0"></iframe>
    </div>
    <el-button
      type="primary"
      class="btn"
      @click.native.prevent="agree"
    >
    同意并继续
    </el-button>
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
      this.$emit("update:visible", false);
    },
    agree() {
      this.close()
      this.$emit("agree");
    }
  },
};
</script>
<style>
.dialog-register-success .el-dialog__body {
  padding: 24px;
  padding-top: 10px;
}
</style>
<style scoped lang="scss">
.content{
  height: 390px;
  background: #F6F7FA;
  border: 1px solid #E7E8EE;
  padding: 20px;
  box-sizing: border-box;
  font-size: 16px;
  color: #262930;
}
.btn{
  display: block;
  width: 262px;
  height: 36px;
  background: #0092FF;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
