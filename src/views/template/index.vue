<template>
  <div class="template-management">
    <!-- 查询条件 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="模板标题">
          <el-input v-model="searchForm.templateTitle" placeholder="请输入模板标题"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="searchForm.category" placeholder="请输入分类"></el-input>

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
      <el-table :data="tableData" v-loading="loading" size="mini">
        <el-table-column prop="templateTitle" label="模板标题" width="180">
        </el-table-column>
        <el-table-column prop="templateFilename" label="模版文件名称" width="180">
        </el-table-column>
        <el-table-column prop="templatePath" label="模板文件路径">
        </el-table-column>
        <el-table-column prop="templateImage" label="模板封面路径">
        </el-table-column>
        <el-table-column prop="templateRootPath" label="模板文件根目录" width="120">
        </el-table-column>
        <el-table-column prop="category" label="标签分类">
        </el-table-column>
        <el-table-column prop="tags" label="标签">
        </el-table-column>
        <el-table-column prop="kernelName" label="内核名称">
        </el-table-column>
        <el-table-column prop="templateDesc" label="备注">
        </el-table-column>
        <el-table-column prop="createName" label="创建人">
        </el-table-column>
        <el-table-column prop="updateName" label="更新人">
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pagination.total" class="pagination">
      </el-pagination> -->
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" @closed="handleDialogClose" :modal-append-to-body='false' :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="模板标题" prop="templateTitle">
          <el-input v-model="form.templateTitle"></el-input>
        </el-form-item>
        <el-form-item label="模版文件名称" prop="templateFilename">
          <el-input v-model="form.templateFilename"></el-input>
        </el-form-item>
        <el-form-item label="模板文件路径" prop="templatePath">
          <el-input v-model="form.templatePath"></el-input>
        </el-form-item>
        <el-form-item label="模板封面路径" prop="templateImage">
          <el-input v-model="form.templateImage"></el-input>
        </el-form-item>
        <el-form-item label="模板文件根目录" prop="templateRootPath">
          <el-input v-model="form.templateRootPath"></el-input>
        </el-form-item>
        <el-form-item label="标签分类" prop="category">
          <el-input v-model="form.category"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="多个标签用分号分隔"></el-input>
        </el-form-item>
        <el-form-item label="内核名称" prop="kernelName">
          <el-input v-model="form.kernelName"></el-input>
        </el-form-item>
        <el-form-item label="容器资源配置" prop="containerResourceProfileId">
          <el-select v-model="form.containerResourceProfileId" placeholder="请选择容器资源配置">
            <el-option v-for="item in resourceProfileOptions" :key="item.id" :label="item.name" :value="item.id.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传模板文件">
          <el-upload class="upload-demo" action="#" :auto-upload="false" :on-change="handleFileChange" :before-upload="beforeUpload" :limit="1" :file-list="fileList" ref="upload">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip/rar文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="templateDesc">
          <el-input v-model="form.templateDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'TemplateManagement',
  data() {
    return {
      loading: false,
      searchForm: {
        templateTitle: '',
        category: ''
      },
      categoryOptions: [
        { value: '分类1', label: '分类1' },
        { value: '分类2', label: '分类2' },
        { value: '分类3', label: '分类3' }
      ],
      resourceProfileOptions: [],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '新增模板',
      form: {
        id: '',
        templateTitle: '',
        templateFilename: '',
        templatePath: '',
        templateImage: '',
        templateRootPath: '',
        category: '',
        tags: '',
        kernelName: '',
        containerResourceProfileId: '',
        templateDesc: '',
      },
      rules: {
        templateTitle: [
          { required: true, message: '请输入模板标题', trigger: 'blur' }
        ],
        templateFilename: [
          { required: true, message: '请输入模版文件名称', trigger: 'blur' }
        ],
        templatePath: [
          { required: true, message: '请输入模板文件路径', trigger: 'blur' }
        ],
        templateImage: [
          { required: true, message: '请输入模板封面路径', trigger: 'blur' }
        ],
        templateRootPath: [
          { required: true, message: '请输入模板文件根目录', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入标签分类', trigger: 'blur' }
        ],
        tags: [
          { required: true, message: '请输入标签', trigger: 'blur' }
        ],
        kernelName: [
          { required: true, message: '请输入内核名称', trigger: 'blur' }
        ],
        containerResourceProfileId: [
          { required: true, message: '请选择容器资源配置', trigger: 'change' }
        ]
      },
      fileList: [],
      isEdit: false,
      formFile: null
    };
  },
  created() {
    this.fetchData();
    this.fetchResourceProfiles();
  },
  methods: {
    // 获取表格数据
    fetchData() {
      this.loading = true;
      const params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        category: this.searchForm.category,
        templateTitle: this.searchForm.templateTitle
      };

      this.http.post('/api/v1/admin/scriptTemplate/pageList', params)
        .then(response => {
          if (response.code === 200) {
            this.tableData = response.data
            this.pagination.total = response.data.length;
          } else {
            this.$message.error(response.msg || '获取数据失败');
          }
          this.loading = false;
        })
        .catch(error => {
          console.error('获取数据失败:', error);
          this.loading = false;
          this.$message.error('获取数据失败');
        });
    },

    // 获取容器资源配置列表
    fetchResourceProfiles() {
      this.http.get('/api/v1/admin/scriptTemplate/getContainerResourceProfileList')
        .then(response => {
          const data = response;
          if (data.code === 200) {
            this.resourceProfileOptions = data.data;
          } else {
            this.$message.error(data.msg || '获取容器资源配置失败');
          }
        })
        .catch(error => {
          console.error('获取容器资源配置失败:', error);
          this.$message.error('获取容器资源配置失败');
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
        templateTitle: '',
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
        templateTitle: '',
        templateFilename: '',
        templatePath: '',
        templateImage: '',
        templateRootPath: '',
        category: '',
        tags: '',
        kernelName: '',
        containerResourceProfileId: '',
        templateDesc: '',
      };
      this.fileList = [];
      this.formFile = null;
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
        templateTitle: row.templateTitle,
        templateFilename: row.templateFilename,
        templatePath: row.templatePath,
        templateImage: row.templateImage,
        templateRootPath: row.templateRootPath,
        category: row.category,
        tags: row.tags,
        kernelName: row.kernelName,
        containerResourceProfileId: row.containerResourceProfileId,
        templateDesc: row.templateDesc
      };
      this.fileList = [{
        name: row.templateFilename,
        url: row.templatePath
      }];
      this.formFile = null;
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
        this.http.get(`/api/v1/admin/scriptTemplate/delete?id=${row.id}`)
          .then(response => {
            const data = response;
            if (data.code === 200) {
              this.$message.success('删除成功');
              this.fetchData();
            } else {
              this.$message.error(data.msg || '删除失败');
            }
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

    // 文件选择变化
    handleFileChange(file) {
      this.formFile = file.raw;
      // 返回false阻止自动上传
      return false;
    },

    // 验证文件
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isZipOrRar = file.name.endsWith('.zip') || file.name.endsWith('.rar');

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
          if (!this.formFile && !this.isEdit) {
            this.$message.warning('请先选择模板文件');
            return;
          }
          this.loading = true;
          // 创建FormData对象
          const formData = new FormData();
          // 添加表单字段
          formData.append('id', this.form.id || '');
          formData.append('templateTitle', this.form.templateTitle || '');
          formData.append('templateFilename', this.form.templateFilename || '');
          formData.append('templatePath', this.form.templatePath || '');
          formData.append('templateImage', this.form.templateImage || '');
          formData.append('templateRootPath', this.form.templateRootPath || '');
          formData.append('category', this.form.category || '');
          formData.append('tags', this.form.tags || '');
          formData.append('templateDesc', this.form.templateDesc || '');
          formData.append('kernelName', this.form.kernelName || '');
          formData.append('containerResourceProfileId', this.form.containerResourceProfileId || '');

          // 添加文件（如果有）
          if (this.formFile) {
            formData.append('file', this.formFile);
          }

          // 发送请求
          const url = this.isEdit ? '/api/v1/admin/scriptTemplate/edit' : '/api/v1/admin/scriptTemplate/add';
          this.http.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            this.$message.success(this.isEdit ? '编辑成功' : '新增成功');
            this.dialogVisible = false;
            this.fetchData();

          }).finally(() => {
            this.loading = false;
          })
        } else {
          return false;
        }
      });
    },

    // 处理对话框关闭
    handleDialogClose() {
      this.formFile = null;
      this.fileList = [];
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