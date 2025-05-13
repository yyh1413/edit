<template>
  <div class="footer">
    <div class="p" style="cursor: pointer;">
      <span class="agreement-css" @click="gotoAgreement(1)">隐私政策</span> <el-divider direction="vertical" />
      <span class="agreement-css" @click="gotoAgreement(2)">关于我们</span> <el-divider direction="vertical" />
      <span class="agreement-css" @click="gotoAgreement(3)">用户协议</span> <el-divider direction="vertical" />
      <span class="agreement-css" @click="gotoAgreement(4)">产品服务协议</span>
    </div>

    <div class="p">Copyright © 2004 广州阔跃生物科技有限公司</div>
    <div class="p">粤ICP备2024280025号-1</div>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {

    }
  },
  mounted() {

  },
  methods: {
    gotoAgreement(code) {
      const targetRoute = this.$router.resolve({
        name: 'AgreementList',
        query: { code: code, type: 1 }
      });
      window.open(targetRoute.href, '_blank');
    },
  }
}
</script>
<style lang="scss" scoped>
.agreement-css {
  color: #0092FF;
  cursor: pointer;

  &:hover {
    color: #0092FF;
  }
}

.footer {
  padding-top: 20px;
  padding-bottom: 50px;
  border-top: 1px solid #E4E4E4;

  .p {
    height: 17px;
    font-size: 12px;
    color: #666666;
    line-height: 17px;
    text-align: center;
    margin-bottom: 10px;
  }
}
</style>
