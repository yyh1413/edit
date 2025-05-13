<template>
  <div class="search-bar">
    <el-input placeholder="搜索" v-model="searchQuery" class="input-with-select" @focus="focusHistory" @blur="blurHistory">
      <el-button slot="append" type="primary" @click="search">搜索</el-button>
    </el-input>
    <div class="history-dropdown" v-if="showHistory">
      <ul>
        <li v-for="(item, index) in historyList" :key="index" @click="selectHistory(item)">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { searchHistory } from "@/api/index/main"

export default {
  data() {
    return {
      searchQuery: '',
      showHistory: false,
      historyList: []
    }
  },
  methods: {
    search() {
      this.$router.push({ path: '/search', query: { keyword: this.searchQuery } })
    },
    selectHistory(item) {
      this.searchQuery = item;
      this.showHistory = false;
      this.search();
    },
    clearHistory() {
      this.showHistory = false;
    },
    blurHistory() {
      setTimeout(() => {
        this.showHistory = false
      }, 200);
    },
    focusHistory() {
      this.getHistory();
    },
    getHistory() {
      searchHistory().then((res) => {
        this.historyList = res.data.length > 0 ? res.data : ['单细胞分析', '单细胞空间转录组', '可视化/数据分析'];

        if (this.historyList) {
          this.showHistory = true;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.history-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 9999;
  width: 150px;
  border: 1px solid #0092FF;
  border-top: none;
  background-color: white;
}

.history-dropdown::before {
  content: "";
  position: absolute;
  top: -14px;
  width: 11px;
  height: 22px;
  background: #fff;
  left: -1px;
  border-left: 1px solid #0092FF;
}

.history-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.history-dropdown li {
  padding: 5px;
  cursor: pointer;
  font-size: 12px;
  color: #656565;
}

.history-dropdown li:hover {
  background-color: #f2faff;
}

.close-history {
  width: 100%;
  padding: 2px;
  border: none;
  cursor: pointer;
}
</style>