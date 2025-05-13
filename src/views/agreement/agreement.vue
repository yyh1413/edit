<template>
  <div class='agreementPage' style="height: 100%;">
    <span v-html="content"></span>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: 'agreementPage',
  data() {
    return {
      content: '',

    }
  },
  mounted() {
    this.getSearchInfo()
  },
  methods: {
    async getSearchInfo() {
      // this.loading = true
      const query = this.$route.query
      if (!query.type || !query.code) {
        return false
      }
      const params = { type: query.type, code: query.code }
      let res = await request({ url: '/agreement/getByAgreement', method: 'get', params })
      // this.loading = false
      if (res?.code == 200) {
        this.content = res?.data?.content || ''
      }
    }
  }
}
</script>
<style scoped>
.agreementPage {
  padding: 20px;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  text-align: justify;
}
</style>
