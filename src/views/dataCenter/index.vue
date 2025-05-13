<template>
  <div class="container">
    <h1 style="margin-left: 4px;">数据中心</h1>
    <div class="breadcrumb">
      <div class="breadcrumb_item" v-for="(item, i) in currentPath" :key="i" @click="handlePathChangeGo(item, i)">{{ item }}</div>
    </div>
    <div class="option">
      <div class="btns">
        <el-button size="mini" :disabled="multipleSelection.length === 0" @click="handleDel">删除</el-button>
        <el-button size="mini" :disabled="multipleSelection.length === 0" @click="handleDownload">下载</el-button>
        <el-button size="mini" type="primary" @click="openCreateDirectory = true">创建文件夹</el-button>
        <Upload :currentPath="currentPath.join('/')" @uploadSuccess="uploadSuccess" />
      </div>

      <div class="help">
        <i class="el-icon-reading"></i><span>使用文档</span>
      </div>
    </div>

    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" size="mini" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="文件名称">
          <template slot-scope="scope">
            <div class="file_name" @click="handlePathChange(scope.row)">
              <img src="@/assets/images/wjj.png" width="36px" height="36px" v-if="scope.row.isDirectory">
              <img src="@/assets/images/wj.png" width="36px" height="36px" v-else>
              <span class="els">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="文件类型" width="120">
          <template slot-scope="scope">
            <div class="file_name">
              <span class="els" v-if="scope.row.isDirectory">文件夹</span>
              <span class="els" v-else>文件</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小" width="100">
          <template slot-scope="scope">
            <span class="els">{{ formatSize(scope.row.size) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastModifiedTime" label="修改时间" width="150">
        </el-table-column>
        <!-- <el-table-column prop="name" label="数据源">
        </el-table-column> -->
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleNameEdit(scope.$index, scope.row)">重命名</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- <el-pagination style="margin-top: 10px;" background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="handlePageChange" /> -->
    </div>



    <el-dialog title="修改文件名称" :visible.sync="nameEditOpen" width="400px" :before-close="handleNameEditClose">
      <el-input v-model="reNameValue" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="handleNameEditSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="创建文件夹" :visible.sync="openCreateDirectory" width="400px" :before-close="() => { openCreateDirectory = false }">
      <el-input v-model="directoryName" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="handleCreateDirectory">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import Upload from '@/components/upload';
import path from 'path'

export default {
  components: {
    Upload
  },
  computed: {

  },
  data() {
    return {
      directoryName: '',
      src: '',
      openCreateDirectory: false,
      fullscreenLoading: false,
      uploadOpen: false,
      nameEditOpen: false,
      row: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      multipleSelection: [],
      reNameValue: '',
      currentPath: ['/']
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatSize(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
      } else if (size < 1024 * 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
      } else {
        return (size / 1024 / 1024 / 1024).toFixed(2) + 'GB'
      }
    },
    fetchData() {
      const url = path.join(...this.currentPath)
      this.http.get('/v1/file/listFiles?path=' + url).then(res => {
        this.tableData = res.data;
      })

    },
    handlePageChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleSortChange({ column, prop, order }) {
      console.log('sortChange', column, prop, order)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDel() {
      this.$confirm('删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let index = 0
        this.multipleSelection.forEach(item => {
          this.http.post(`/v1/file/delete?path=/${item.relativePath}`).then(res => {
            index++
            if (index === this.multipleSelection.length) {
              this.multipleSelection = []
              this.fetchData()
            }
          })

        })
      })
    },
    handleDownload() {
      this.$confirm('下载该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.multipleSelection.forEach(item => {
          if (!item.isDirectory) {
            this.http.get(`/v1/oss/getOssDownloadUrl?filePath=/${item.relativePath}`).then(res => {
              window.open(res.data)
            })
          } else {
            this.$message.error('文件夹不能下载')
          }
        })
        // this.multipleSelection = []

      })

    },
    handleNameEdit(idx, item) {
      this.nameEditOpen = true;
      this.row = item;
      this.reNameValue = item.name;
    },
    handleNameEditClose() {
      this.nameEditOpen = false;
      this.row = {};
      this.reNameValue = ''
    },
    handleNameEditSave() {
      this.$confirm('确定修改文件名, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.nameEditOpen = false;

        const params = {
          sourcePath: '/' + this.row.relativePath,
          targetPath: path.join(...this.currentPath, this.reNameValue)
        }
        this.http.post(`/v1/file/rename?sourcePath=${params.sourcePath}&targetPath=${params.targetPath}`).then(res => {
          this.fetchData();
          this.row = {};
        })

      })
    },
    replaceFileName(relativePath, newName) {
      return relativePath.replace(/[^/]+$/, newName);
    },
    handlePathChange(row) {

      if (row.isDirectory) {
        this.currentPath = [...this.currentPath, row.name]
        // this.currentPath = path.join(this.currentPath, row.name);
        this.fetchData();
      }
    },
    uploadSuccess() {
      this.uploadOpen = false;
      this.fetchData();
    },
    handlePathChangeGo(row, index) {
      if (index === this.currentPath.length - 1) return
      if (index === 0) {
        this.currentPath = ['/']
      } else {
        this.currentPath = this.currentPath.slice(0, index + 1)
      }
      this.fetchData();
    },
    handleCreateDirectory() {
      if (!this.directoryName.trim()) return
      const param = path.join(...this.currentPath, this.directoryName);
      this.http.post(`/v1/file/createDirectory?path=${param}`).then(res => {
        this.fetchData();

      }).finally(() => {
        this.directoryName = ''
        this.openCreateDirectory = false
      })
    }
  }

};
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  font-size: 12px;
  line-height: 1;
}

.container {
  width: 100%;

  .breadcrumb {
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E6EBF1;
    padding: 5px;
    display: flex;
    align-items: center;
    padding-left: 10px;

    .breadcrumb_item {
      color: #888888;
      font-size: 12px;
      cursor: pointer;
    }

    .breadcrumb_item:last-child {
      color: #000;

    }

    .breadcrumb_item:not(:last-child)::after {
      content: ">";
      margin: 0 0.5em;
      /* 添加一些左右边距，使符号看起来更美观 */
    }
  }

  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;

    .help {
      color: #4b4b4b;
      font-size: 12px;
      cursor: pointer;

      .el-icon-reading {
        margin-right: 5px;
      }
    }
  }
}

.file_name {
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    margin-right: 5px;
  }

  .els {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.btns {
  display: flex;
  align-items: center;
  gap: 10px;

  .el-button {
    margin: 0;
    font-size: 12px;
  }
}
</style>
