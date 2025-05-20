<template>
  <div class="image-manage-container">
    <div class="header">
      <h1>镜像资源管理</h1>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="镜像标题">
          <el-input v-model="searchForm.title" placeholder="请输入镜像标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="镜像名称">
          <el-input v-model="searchForm.name" placeholder="请输入镜像名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="searchForm.tags" placeholder="请选择标签" multiple clearable>
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
      <el-button type="primary" @click="handleAdd">新增镜像</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
      <el-table-column prop="title" label="镜像标题" min-width="120"></el-table-column>
      <el-table-column prop="name" label="镜像名称" min-width="120"></el-table-column>
      <el-table-column prop="description" label="镜像介绍" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column label="标签" min-width="150">
        <template #default="scope">
          <el-tag v-for="tag in scope.row.tags" :key="tag" style="margin-right: 5px" size="small">{{ tag }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="environment" label="主要环境" min-width="150"></el-table-column>
      <el-table-column prop="recommendedConfig" label="推荐配置" min-width="120"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="150"></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
          <el-button type="text" size="small" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :current-page="pagination.currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pagination.pageSize"
        :total="pagination.total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="dialogType === 'add' ? '新增镜像' : dialogType === 'edit' ? '编辑镜像' : '镜像详情'" :visible.sync="dialogVisible" width="650px" :close-on-click-modal="false">
      <el-form ref="imageFormRef" :model="imageForm" :rules="formRules" label-width="100px" :disabled="dialogType === 'view'">
        <el-form-item label="镜像标题" prop="title">
          <el-input v-model="imageForm.title" placeholder="请输入镜像标题"></el-input>
        </el-form-item>
        <el-form-item label="镜像名称" prop="name">
          <el-input v-model="imageForm.name" placeholder="请输入镜像名称"></el-input>
        </el-form-item>
        <el-form-item label="镜像介绍" prop="description">
          <el-input v-model="imageForm.description" type="textarea" :rows="3" placeholder="请输入镜像介绍"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="imageForm.tags" multiple filterable allow-create default-first-option placeholder="请选择或创建标签">
            <el-option v-for="item in tagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要环境" prop="environment">
          <el-input v-model="imageForm.environment" placeholder="例如：Python 3.12, CUDA 12.1"></el-input>
        </el-form-item>
        <el-form-item label="推荐配置" prop="recommendedConfig">
          <el-input v-model="imageForm.recommendedConfig" placeholder="例如：5核, 8GB"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogType !== 'view'" type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageManage',
  data() {
    return {
      // 搜索表单
      searchForm: {
        title: '',
        name: '',
        tags: []
      },
      // 表格数据
      tableData: [],
      loading: false,
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 对话框
      dialogVisible: false,
      dialogType: 'add', // add, edit, view
      // 表单数据
      imageForm: {
        id: '',
        title: '',
        name: '',
        description: '',
        tags: [],
        environment: '',
        recommendedConfig: '',
        createTime: ''
      },
      // 表单验证规则
      formRules: {
        title: [
          { required: true, message: '请输入镜像标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入镜像名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入镜像介绍', trigger: 'blur' }
        ],
        environment: [
          { required: true, message: '请输入主要环境', trigger: 'blur' }
        ],
        recommendedConfig: [
          { required: true, message: '请输入推荐配置', trigger: 'blur' }
        ]
      },
      // 标签选项
      tagOptions: [
        { value: 'Python', label: 'Python' },
        { value: 'CUDA', label: 'CUDA' },
        { value: 'TensorFlow', label: 'TensorFlow' },
        { value: 'PyTorch', label: 'PyTorch' },
        { value: '深度学习', label: '深度学习' },
        { value: '机器学习', label: '机器学习' },
        { value: '数据分析', label: '数据分析' }
      ]
    }
  },
  created() {
    this.getImageList()
  },
  methods: {
    // 获取镜像列表
    async getImageList() {
      this.loading = true
      try {
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...this.searchForm
        }
        const res = await this.http.post('/api/image/list', params)
        if (res.code === 0) {
          this.tableData = res.data.list || []
          this.pagination.total = res.data.total || 0
        } else {
          this.$message.error(res.message || '获取镜像列表失败')
        }
      } catch (error) {
        console.error('获取镜像列表失败', error)
        this.$message.error('获取镜像列表失败')
      } finally {
        this.tableData = [{
          title: '镜像标题',
          name: '镜像名称',
          description: '镜像介绍',
          tags: ['标签1', '标签2'],
          environment: '主要环境',
        }
        ]
        this.loading = false
      }
    },

    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1
      this.getImageList()
    },

    // 重置搜索
    resetSearch() {
      this.searchForm = {
        title: '',
        name: '',
        tags: []
      }
      this.handleSearch()
    },

    // 新增镜像
    handleAdd() {
      this.dialogType = 'add'
      this.imageForm = {
        id: '',
        title: '',
        name: '',
        description: '',
        tags: [],
        environment: '',
        recommendedConfig: '',
        createTime: ''
      }
      this.dialogVisible = true
    },

    // 编辑镜像
    handleEdit(row) {
      this.dialogType = 'edit'
      this.imageForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },

    // 查看镜像
    handleView(row) {
      this.dialogType = 'view'
      this.imageForm = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },

    // 删除镜像
    handleDelete(row) {
      this.$confirm('确认删除该镜像?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.http.post('/api/image/delete', { id: row.id })
          if (res.code === 0) {
            this.$message.success('删除成功')
            this.getImageList()
          } else {
            this.$message.error(res.message || '删除失败')
          }
        } catch (error) {
          console.error('删除镜像失败', error)
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除
      })
    },

    // 提交表单
    submitForm() {
      this.$refs.imageFormRef.validate(async (valid) => {
        if (valid) {
          try {
            const url = this.dialogType === 'add' ? '/api/image/add' : '/api/image/update'
            const res = await this.http.post(url, this.imageForm)
            if (res.code === 0) {
              this.$message.success(this.dialogType === 'add' ? '新增成功' : '更新成功')
              this.dialogVisible = false
              this.getImageList()
            } else {
              this.$message.error(res.message || (this.dialogType === 'add' ? '新增失败' : '更新失败'))
            }
          } catch (error) {
            console.error(this.dialogType === 'add' ? '新增镜像失败' : '更新镜像失败', error)
            this.$message.error(this.dialogType === 'add' ? '新增失败' : '更新失败')
          }
        } else {
          return false
        }
      })
    },

    // 分页大小变化
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.getImageList()
    },

    // 当前页变化
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.getImageList()
    }
  }
}
</script>

<style scoped>
.image-manage-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.search-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}


.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
