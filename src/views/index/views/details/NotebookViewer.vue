<template>
  <div class="notebook-container">
    <div v-for="(cell, index) in processedCells" :key="index" class="notebook-cell">
      <!-- 处理markdown类型cell -->
      <div v-if="cell.type === 'markdown'" class="markdown-cell" v-html="renderMarkdown(cell)"></div>

      <!-- 处理code类型cell -->
      <div v-else-if="cell.type === 'code'" class="code-cell">
        <div class="markdown-container" v-html="renderMarkdown(cell)"></div>


        <!-- 展示代码输出 -->
        <div v-if="cell.outputs && cell.outputs.length" class="code-outputs">
          <div v-for="(output, outIndex) in cell.outputs" :key="outIndex" class="output-item">
            <!-- 处理图片输出 -->
            <img v-if="output.data && output.data['image/png']" :src="'data:image/png;base64,' + output.data['image/png']" class="output-image">

            <!-- 处理文本输出 -->
            <div v-else-if="output.text" class="output-text">
              <!-- {{ output.text.join('\n') }} -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

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
      processedCells: []
    }
  },
  created() {
    // 配置marked
    marked.setOptions({
      highlight: function (code, language) {
        if (language && hljs.getLanguage(language)) {
          return hljs.highlight(language, code).value;
        }
        return hljs.highlightAuto(code).value;
      },
      breaks: true,
      gfm: true
    });

    this.fetchNotebookData();
  },
  methods: {
    fetchNotebookData() {
      
      this.notebookData =this.base64Ipynb;
      
      this.processCells();
    },

    processCells() {

      this.processedCells = this.notebookData.cells.map(cell => {
        if (cell.cell_type === 'markdown') {
          return {
            type: 'markdown',
            source: cell.source
          };
        } else if (cell.cell_type === 'code') {
          return {
            type: 'code',
            source: cell.source,
            outputs: cell.outputs || []
          };
        }
        return null;
      }).filter(Boolean);
    },

    renderMarkdown(source) {
      // 转换为Markdown格式
      if (source.type === 'markdown') {
        return marked(source.source);
      } else if (source.type === 'code') {
        return marked('```javascript\n' + source.source + '\n```');
      }
      return marked(source);
    }
  }
}
</script>

<style>
.notebook-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  margin: 0 auto;
  padding: 20px;
}

.notebook-cell {
  margin-bottom: 30px;
}

.markdown-cell {
  padding: 10px;
}

.code-cell {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
}

.code-cell pre {
  margin: 0;
  padding: 16px;
  background-color: #f6f8fa;
  overflow-x: auto;
}

.code-cell code {
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
}

.code-outputs {
  padding: 16px;
  background-color: white;
}

.output-image {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}

.output-text {
  font-family: monospace;
  white-space: pre-wrap;
  margin: 0;
}
</style>