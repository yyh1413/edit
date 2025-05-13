<template>
  <div class="template-management">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="模板标题">
          <el-input v-model="searchForm.title" placeholder="请输入模板标题"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="showAddDialog">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格数据 -->
    <el-card class="table-card">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="模板标题" width="180">
        </el-table-column>
        <el-table-column prop="fileName" label="模版文件名称" width="180">
        </el-table-column>
        <el-table-column prop="filePath" label="模板文件路径">
        </el-table-column>
        <el-table-column prop="coverPath" label="模板封面路径">
        </el-table-column>
        <el-table-column prop="rootDir" label="模板文件根目录">
        </el-table-column>
        <el-table-column prop="category" label="标签分类">
        </el-table-column>
        <el-table-column prop="kernelName" label="内核名称">
        </el-table-column>
        <el-table-column prop="creator" label="创建人">
        </el-table-column>
        <el-table-column prop="updater" label="更新人">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" class="pagination">
      </el-pagination>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="模板标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="模版文件名称" prop="fileName">
          <el-input v-model="form.fileName"></el-input>
        </el-form-item>
        <el-form-item label="模板文件路径" prop="filePath">
          <el-input v-model="form.filePath"></el-input>
        </el-form-item>
        <el-form-item label="模板封面路径" prop="coverPath">
          <el-input v-model="form.coverPath"></el-input>
        </el-form-item>
        <el-form-item label="模板文件根目录" prop="rootDir">
          <el-input v-model="form.rootDir"></el-input>
        </el-form-item>
        <el-form-item label="标签分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择标签分类">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内核名称" prop="kernelName">
          <el-input v-model="form.kernelName"></el-input>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload class="upload-demo" action="/api/upload" :on-success="handleUploadSuccess" :before-upload="beforeUpload" :limit="1" :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip/rar文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TemplateManagement',
  data() {
    return {
      searchForm: {
        title: '',
        category: ''
      },
      categoryOptions: [
        { value: '1', label: '分类1' },
        { value: '2', label: '分类2' },
        { value: '3', label: '分类3' }
      ],
      tableData: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '新增模板',
      form: {
        id: '',
        title: '',
        fileName: '',
        filePath: '',
        coverPath: '',
        rootDir: '',
        category: '',
        kernelName: '',
        attachment: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入模板标题', trigger: 'blur' }
        ],
        fileName: [
          { required: true, message: '请输入模版文件名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择标签分类', trigger: 'change' }
        ]
      },
      fileList: [],
      isEdit: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取表格数据
    fetchData() {
      this.loading = true;
      const params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        ...this.searchForm
      };

      axios.get('/api/templates', { params })
        .then(response => {
          const data = response.data;
          this.tableData = data.list;
          this.pagination.total = data.total;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取数据失败:', error);
          this.loading = false;
          this.$message.error('获取数据失败');
        });
    },

    // 查询
    handleSearch() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },

    // 重置查询条件
    resetSearch() {
      this.searchForm = {
        title: '',
        category: ''
      };
      this.handleSearch();
    },

    // 显示新增弹窗
    showAddDialog() {
      this.dialogTitle = '新增模板';
      this.isEdit = false;
      this.form = {
        id: '',
        title: '',
        fileName: '',
        filePath: '',
        coverPath: '',
        rootDir: '',
        category: '',
        kernelName: '',
        attachment: ''
      };
      this.fileList = [];
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    // 显示编辑弹窗
    handleEdit(index, row) {
      this.dialogTitle = '编辑模板';
      this.isEdit = true;
      this.form = {
        id: row.id,
        title: row.title,
        fileName: row.fileName,
        filePath: row.filePath,
        coverPath: row.coverPath,
        rootDir: row.rootDir,
        category: row.category,
        kernelName: row.kernelName,
        attachment: row.attachment
      };
      if (row.attachment) {
        this.fileList = [{ name: row.attachment }];
      } else {
        this.fileList = [];
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    // 删除
    handleDelete(index, row) {
      this.$confirm('确认删除该模板吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.delete(`/api/templates/${row.id}`)
          .then(response => {
            this.$message.success('删除成功');
            this.fetchData();
          })
          .catch(error => {
            console.error('删除失败:', error);
            this.$message.error('删除失败');
          });
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchData();
    },

    // 上传成功回调
    handleUploadSuccess(response, file, fileList) {
      this.form.attachment = response.data.filePath;
      this.fileList = fileList;
      this.$message.success('上传成功');
    },

    // 上传前校验
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isZipOrRar = file.type === 'application/zip' || file.type === 'application/x-rar-compressed';

      if (!isZipOrRar) {
        this.$message.error('只能上传zip/rar文件');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过10MB');
        return false;
      }
      return true;
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const api = this.isEdit ?
            axios.put(`/api/templates/${this.form.id}`, this.form) :
            axios.post('/api/templates', this.form);

          api.then(response => {
            this.$message.success(this.isEdit ? '编辑成功' : '新增成功');
            this.dialogVisible = false;
            this.fetchData();
          })
            .catch(error => {
              console.error('操作失败:', error);
              this.$message.error('操作失败');
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.template-management {}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.upload-demo {
  width: 100%;
}
</style>