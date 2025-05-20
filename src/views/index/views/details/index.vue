<template>
  <div class="details" v-loading="fetchLoading">
    <div class="catalog">
      <Catalog :base64Ipynb="base64Ipynb" v-if="base64Ipynb" />
    </div>
    <div class="container">
      <h1>{{ info.templateTitle }}</h1>
      <div class="tag">
        <div class="tag_item" v-for="tag in info.tags" :key="tag">{{ tag }}</div>
      </div>
      <div class="content">
        <img class="templateImageContent" :src="info.templateImageContent" />
        <span>发布于：{{ info.createdAt }}</span>
        <div class="but_run" @click="handleRunBefore">开始运行</div>
      </div>
      <div class="viewer">
        <NotebookViewer :base64Ipynb="base64Ipynb" v-if="base64Ipynb" />

      </div>
    </div>
    <el-dialog :visible.sync="visible" title="服务器详情" width="400px">
      <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
        <li><strong>服务器名称：</strong>{{ server.name }}</li>
        <li><strong>配置：</strong>{{ server.cpu }} 核 CPU · {{ server.memory }}GB 内存</li>
        <li><strong>创建时间：</strong>{{ server.createdAt }}</li>
      </ul>
      <template #footer>
        <el-button type="primary" @click="handleRun" :loading="loading">确定运行</el-button>
        <!-- <el-button @click="visible = false">关闭</el-button> -->
      </template>
    </el-dialog>
  </div>
</template>

<script>
import base from './base64.json'
import NotebookViewer from './NotebookViewer.vue'
import { v4 as uuidv4 } from 'uuid';
import Catalog from './Catalog.vue'
import { mapGetters } from 'vuex';
export default {
  components: { NotebookViewer, Catalog },
  data() {

    return {
      fetchLoading: false,
      loading: false,
      info: {},
      base64Ipynb: undefined,
      notebookId: '',
      visible: false,
      server: {},
      beforeUrl: 'https://editor.bio-ky.com/editor-api',
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    console.log('userInfo', this?.userInfo);

    this.notebookId = this.$route.params.id
    this.getNoteBookDetails();
  },
  methods: {
    getNoteBookDetails() {
      this.fetchLoading = true
      this.http.get('/api/v1/scriptTemplate/detail', { id: this.notebookId }).then(v => {
        v.data.tags = v.data.tags.split(',')
        v.data.templateImageContent = v.data.templateImageContent && `data:image/png;base64,${v.data.templateImageContent}`
        this.info = v.data
        const formatData = JSON.parse(decodeURIComponent(escape(atob(v.data.templateFileContent))))
        formatData.cells.forEach(item => {
          if (Array.isArray(item.source)) {
            item.source = item.source.join('')
          }
        })
        this.base64Ipynb = formatData
        console.log('this.base64Ipynb', JSON.parse(JSON.stringify(this.base64Ipynb)));

      }).finally(() => {
        this.fetchLoading = false
      })
    },
    handleRunBefore() {
      this.http.get('api/v1/scriptTemplate/queryContainerResourceProfile', { profileId: this.info.containerResourceProfileId }).then(v => {
        if (!v.data) return
        v.data.memory = v.data.memory / 1024
        this.server = v.data
        this.visible = true
      })

    },
    handleRun() {
      const uuidstore = this?.userInfo?.userId
      // const uuidstore = ''
      let uid = ''
      if (uuidstore) {
        uid = uuidstore + ''
      } else {
        if (localStorage.getItem('uuidstore')) {
          uid = localStorage.getItem('uuidstore') + ''
        } else {
          uid = uuidv4()
          localStorage.setItem('uuidstore', uid)
        }
      }
      const params = {
        anonId: uid,
        templateId: this.notebookId,
      }
      this.loading = true
      this.http.get('/api/v1/scriptTemplate/run', params).then(v => {
        setTimeout(() => {
          this.loading = false
          // this.$router.push({ path: `/edit`, query: { userId: uid, templateId: this.notebookId, src: `${this.beforeUrl}/${v.data.link}` } })
          const query = new URLSearchParams({ userId: uid, templateId: this.notebookId, src: `${this.beforeUrl}/${v.data.link}` }).toString()
          const url = `/edit?${query}`;
          window.open(url, '_blank');
          this.visible = false
        }, 3000)
      })

    }
  }

}
</script>

<style lang="scss" scoped>
.details {
  padding-top: 20px;
  height: 100%;
  // width: 100%;
  // overflow-y: auto;
  margin: 0 auto;
  display: flex;

  .catalog {
    height: 100%;
    overflow-y: auto;
    width: 300px;
    background: #fff;
    border-radius: 10px 0 0 10px;
  }

  // background: #fff;
  .container {
    width: 800px;
    flex: 1;
    padding: 20px;
    background: #f8fcff;
    border-radius: 0 10px 10px 0;
    height: 100%;
    overflow-y: auto;

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

    .content {
      margin-top: 20px;
      display: flex;
      align-items: center;
      gap: 20px;

      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .but_run {
        width: 100px;
        height: 40px;
        background: linear-gradient(to right, #2841ff, #6315ff);
        cursor: pointer;
        border-radius: 40px;
        font-size: 14px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .but_run:hover {
        background: linear-gradient(to right, #6315ff, #2841ff);
      }

      .but_run:active {
        border: 1px solid #ffffff;
      }
    }

    .viewer {
      margin-top: 20px;
      background: #fff;
    }
  }
}

.templateImageContent {
  width: 76px;
  height: 76px;
  background: #D8D8D8;
  border-radius: 8px;
}
</style>