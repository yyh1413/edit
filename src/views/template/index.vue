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
        <el-table-column prop="createName" label="创建人">
        </el-table-column>
        <el-table-column prop="updateName" label="更新人">
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
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
          <el-upload class="upload-demo" :action="isEdit ? '/api/v1/admin/scriptTemplate/edit' : '/api/v1/admin/scriptTemplate/add'" :on-success="handleUploadSuccess" :before-upload="beforeUpload"
            :limit="1" :file-list="fileList" :data="uploadParams" ref="upload" :http-request="customUploadRequest">
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

export default {
  name: 'TemplateManagement',
  data() {
    return {
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
        templateTitle: '',
        templateFilename: '',
        templatePath: '',
        templateImage: '',
        templateRootPath: '',
        category: '',
        tags: '',
        kernelName: '',
        containerResourceProfileId: ''
      },
      rules: {
        templateTitle: [
          { required: true, message: '请输入模板标题', trigger: 'blur' }
        ],
        templateFilename: [
          { required: true, message: '请输入模版文件名称', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择标签分类', trigger: 'change' }
        ]
      },
      fileList: [],
      isEdit: false,
      formFile: null
    };
  },
  computed: {
    uploadParams() {
      return {
        id: this.form.id,
        templateTitle: this.form.templateTitle,
        templateFilename: this.form.templateFilename,
        templatePath: this.form.templatePath,
        templateImage: this.form.templateImage,
        templateRootPath: this.form.templateRootPath,
        tags: this.form.tags,
        category: this.form.category,
        kernelName: this.form.kernelName,
        containerResourceProfileId: this.form.containerResourceProfileId
      };
    }
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
        containerResourceProfileId: ''
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
        containerResourceProfileId: row.containerResourceProfileId
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

    // 保存文件引用
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
      this.formFile = file;
      return true;
    },

    // 自定义上传请求
    customUploadRequest(options) {
      const { action, file, onSuccess, onError } = options;

      const formData = new FormData();
      formData.append('file', file);

      // 添加其他表单参数
      for (const key in this.uploadParams) {
        if (this.uploadParams[key]) {
          formData.append(key, this.uploadParams[key]);
        }
      }

      this.http.post(action, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        onSuccess(response.data);
        this.formFile = null; // 重置文件引用
      }).catch(error => {
        onError(error);
      });
    },

    // 上传成功回调
    handleUploadSuccess(response) {
      if (response.code === 200) {
        this.$message.success('上传成功');
        this.dialogVisible = false;
        this.fetchData();
      } else {
        this.$message.error(response.msg || '上传失败');
      }
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.formFile && !this.isEdit) {
            this.$message.warning('请先上传模板文件');
            return;
          }

          if (this.formFile) {
            // 触发上传操作
            this.$refs.upload.submit();
          } else {
            // 编辑时可能不上传新文件，直接提交表单数据
            const url = this.isEdit ? '/api/v1/admin/scriptTemplate/edit' : '/api/v1/admin/scriptTemplate/add';
            const formData = new FormData();
            for (const key in this.uploadParams) {
              if (this.uploadParams[key]) {
                formData.append(key, this.uploadParams[key]);
              }
            }

            this.http.post(url, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(response => {
              if (response.code === 200) {
                this.$message.success(this.isEdit ? '编辑成功' : '新增成功');
                this.dialogVisible = false;
                this.fetchData();
              } else {
                this.$message.error(response.msg || '操作失败');
              }
            }).catch(error => {
              console.error('操作失败:', error);
              this.$message.error('操作失败');
            });
          }
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