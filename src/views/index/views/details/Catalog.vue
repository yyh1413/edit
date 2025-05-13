<template>
  <div class="notebook_catalog">
    <!-- <ul class="toc">
    <toc-item v-for="(item, index) in tocTree" :key="index" :item="item" />
  </ul> -->
    <el-tree :data="catalogMenu" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :render-content="renderContent" highlight-current></el-tree>

  </div>
</template>

<script>

export default {
  props: {
    base64Ipynb: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      notebookData: null,
      catalogData: [],
      catalogMenu: [],

      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.formatCatalog()


  },
  methods: {
    formatCatalog() {
      this.catalogData = this.base64Ipynb.cells.filter(v => v.cell_type === 'markdown' && v.source.charAt(0) === '#').map(v => ({
        source: v.source,
        id: v.id,

      }))

      this.catalogMenu = this.tocTree()
      // console.log(JSON.stringify(this.catalogMenu, null, 2));
    },
    tocTree() {
      const toc = []
      const stack = []

      this.catalogData.forEach(item => {
        const match = item.source.match(/^#{1,6}\s*(.+)/)
        if (!match) return

        const level = match[0].match(/^#+/)[0].length
        const title = match[1].trim()

        const node = {
          id: item.id,
          label: title,
          level,
          children: []
        }

        // 找一个合适的父级：level 必须小于当前 node.level
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop()
        }

        if (stack.length === 0) {
          toc.push(node)
        } else {
          stack[stack.length - 1].children.push(node)
        }

        stack.push(node)
      })

      return toc
    },
    handleNodeClick(data) {
      // 获取目标锚点并滚动到它
      const el = document.getElementById(data.label)
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    },
    renderContent(h, { node, data, store }) {
      const isParent = data.children && data.children.length > 0

      return h(
        'span',
        {
          style: {
            fontWeight: isParent ? '500' : 'normal'
          }
        },
        [data.label]
      )
    }

  }
}
</script>

<style>
.el-tree {
  color: #000;
  font-size: 14px;
  cursor: pointer;
}

.el-tree-node__expand-icon {
  color: #000;
}

.notebook_catalog {
  width: 100%;
  height: 100%;
  padding: 30px 10px;
  /* background-color: #f5f5f5; */
}
</style>