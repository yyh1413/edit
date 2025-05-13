<template>
  <div class="container" v-loading.fullscreen.lock="fullscreenLoading" v-if="src">
    <iframe :src="src" frameborder="0"></iframe>
    <!-- <iframe src="https://editor.bio-ky.com/editor-api/2/lab" frameborder="0"></iframe> -->

  </div>

</template>
<script>


export default {

  data() {
    return {
      beforeUrl: 'https://editor.bio-ky.com/editor-api',
      src: '',
      fullscreenLoading: true,
      option: {
        userId: '',
        templateId: '',
      }
    };
  },
  created() {
    this.option = this.$route.query;

    console.log('this.option', this.option.src);
    this.fullscreenLoading = false;
    this.src = this.option.src
  },
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);

  },
  beforeDestroy() {
    this.handleClose();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);

  },
  methods: {
    getRun() {
      const params = {
        anonId: this.option.userId,
        templateId: this.option.templateId,
      }

      this.http.get('/api/v1/scriptTemplate/run', params).then(v => {
        setTimeout(() => {
          this.src = `${this.beforeUrl}/${v.data.link}`;
        }, 1000);
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 4000);
      }).catch(() => {
        this.fullscreenLoading = false;
      })
    },
    handleClose() {
      const params = {
        anonId: this.option.userId,
      }
      this.http.get('/api/v1/scriptTemplate/destroy', params).then(v => {
      })
    },
    handleBeforeUnload(event) {
      // 显示默认的确认弹窗
      event.preventDefault();
      event.returnValue = ''; // 兼容多数浏览器
      this.handleClose();
      console.log('关闭页面');

    }
  }

};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
