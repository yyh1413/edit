<template>
  <div class="note_book_main">
    <div v-if="!category">
      <NoteBook name="流程Notebook模板" :list="processList" />
      <NoteBook name="可视化Notebook模板" :list="visList" />
      <NoteBook name="工具Notebook模板" :list="toolList" />
    </div>
    <div v-if="category">
      <NoteBook :name="title" :list="list" />
    </div>
  </div>
</template>

<script>
import NoteBook from '@/components/noteBook/NoteBook.vue';

export default {
  components: { NoteBook },
  data() {
    return {
      processList: [],
      visList: [],
      toolList: [],
      list: [],
      title: '',
      category: undefined
    }
  },
  created() {
    const pathList = {
      'process-notebook': '流程',
      'vis-notebook': '可视化',
      'tool-notebook': '工具',
    }

    const category = pathList[this.$route.name];
    if (category) {
      this.title = this.$route.meta.title
      this.category = category
      this.getNoteBookList();
    } else {
      this.getAllNoteBookList();
    }


  },
  methods: {
    formatData(row) {
      row?.forEach(v => {
        v.tags = v.tags.split(',')
        //base64转图片
        v.templateImageContent = v.templateImageContent && `data:image/png;base64,${v.templateImageContent}`
      })
    },
    getNoteBookList() {
      this.http.get('/api/v1/scriptTemplate/getPage', { category: this.category }).then(v => {
        this.formatData(v.data)
        this.list = v.data
      })

    },
    getAllNoteBookList() {
      const pathList = ['流程', '可视化', '工具']

      pathList.forEach(j => {
        this.http.get('/api/v1/scriptTemplate/getPage', { category: j }).then(v => {
          this.formatData(v.data)
          if (j == '流程') {
            this.processList = v.data
          } else if (j == '可视化') {
            this.visList = v.data
          } else if (j == '工具') {
            this.toolList = v.data
          }

        })
      })
    },

  }

}
</script>

<style lang="scss" scoped>
// .note_book_main {
//   background: #fff;
//   border-radius: 4px;

// }</style>