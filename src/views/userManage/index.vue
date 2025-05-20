<template>
  <div class="container">
    <h1 style="margin-left: 4px;">用户资源管理</h1>

    <!-- 查询区域 -->
    <div class="search-container">
      <el-form :inline="true" :model="queryParams" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border size="mini">
      <el-table-column prop="username" label="用户名" min-width="120">
      </el-table-column>
      <el-table-column prop="modulePermissions" label="模块权限" min-width="180">
        <template slot-scope="scope">
          <div class="permission-tags">
            <el-tag v-for="(item, index) in scope.row.modulePermissionsArray" :key="index" size="mini" style="margin-right: 5px; margin-bottom: 5px;">
              {{ item }}
            </el-tag>
            <span v-if="!scope.row.modulePermissionsArray || scope.row.modulePermissionsArray.length === 0">无权限</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="gpuType" label="GPU类型" min-width="120">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="handleEditPermission(scope.row)">模块权限编辑</el-button>
          <el-button size="mini" type="text" @click="handleEditGpu(scope.row)">GPU类型</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryParams.pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px; text-align: right;">
    </el-pagination>

    <!-- 模块权限编辑弹窗 -->
    <el-dialog title="模块权限编辑" :visible.sync="permissionDialogVisible" width="500px">
      <div class="permission-tree-container">
        <el-tree ref="permissionTree" :data="permissionTreeData" show-checkbox node-key="id" :props="defaultProps" :default-checked-keys="selectedPermissions">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePermissions">确 定</el-button>
      </span>
    </el-dialog>

    <!-- GPU类型编辑弹窗 -->
    <el-dialog title="GPU类型配置" :visible.sync="gpuDialogVisible" width="400px">
      <el-form :model="gpuForm" label-width="120px">
        <el-form-item label="是否开启GPU">
          <el-switch v-model="gpuForm.enableGpu"></el-switch>
        </el-form-item>
        <el-form-item label="GPU类型" v-if="gpuForm.enableGpu">
          <el-select v-model="gpuForm.gpuType" placeholder="请选择GPU类型">
            <el-option v-for="item in gpuOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="gpuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveGpuSettings">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserManage',
  data() {
    return {
      // 加载状态
      loading: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        userId: ''
      },
      // 表格数据
      tableData: [],
      // 总条数
      total: 0,
      // 权限弹窗可见性
      permissionDialogVisible: false,
      // 权限树数据
      permissionTreeData: [
        {
          id: 1,
          label: '可视化',
          children: [
            { id: 11, label: '可视化' },
            { id: 12, label: '可视化' },
            { id: 13, label: '可视化' }
          ]
        },
        {
          id: 2,
          label: '火山图',
          children: [
            { id: 21, label: '火山图' },
            { id: 22, label: '火山图' },
            { id: 23, label: '火山图' }
          ]
        },
       
      ],
      // 默认树属性
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 当前选中的权限
      selectedPermissions: [],
      // 当前编辑的用户
      currentUser: null,
      // GPU弹窗可见性
      gpuDialogVisible: false,
      // GPU表单
      gpuForm: {
        enableGpu: false,
        gpuType: ''
      },
      // GPU选项
      gpuOptions: [
        { value: 'nvidia_t4', label: 'NVIDIA T4' },
        { value: 'nvidia_v100', label: 'NVIDIA V100' },
        { value: 'nvidia_a100', label: 'NVIDIA A100' },
        { value: 'amd_mi100', label: 'AMD MI100' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取用户列表
    getList() {
      this.loading = true
      this.http.post('/api/user/list', this.queryParams).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.list.map(item => {
            // 将权限字符串转为数组，用于显示标签
            item.modulePermissionsArray = item.modulePermissions ? item.modulePermissions.split(',') : []
            return item
          })
          this.total = res.data.total
        } else {
          this.$message.error(res.msg || '获取用户列表失败')
        }
      }).catch(err => {
        console.error('获取用户列表失败', err)
        this.$message.error('获取用户列表失败')
      }).finally(() => {
        this.tableData = [{
          username: 'admin',
          modulePermissions: '1,2,3',
          gpuType: 'nvidia_t4'
        }, {
          username: 'admin',
          modulePermissions: '1,2,3',
          gpuType: 'nvidia_t4'
        }]
        this.loading = false
      })
    },
    // 查询按钮
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    // 编辑模块权限
    handleEditPermission(row) {
      this.currentUser = row
      // 将权限字符串转为ID数组
      this.selectedPermissions = this.getPermissionIds(row.modulePermissions)
      this.permissionDialogVisible = true
      // 等待DOM更新后设置选中状态
      this.$nextTick(() => {
        if (this.$refs.permissionTree) {
          this.$refs.permissionTree.setCheckedKeys(this.selectedPermissions)
        }
      })
    },
    // 将权限字符串转为ID数组
    getPermissionIds(permissionStr) {
      if (!permissionStr) return []
      // 这里简化处理，实际应根据后端返回的权限格式进行转换
      const permissionMap = {
        '用户管理': 11,
        '角色管理': 12,
        '权限管理': 13,
        '文章管理': 21,
        '分类管理': 22,
        '标签管理': 23,
        '图片管理': 31,
        '文件管理': 32,
        '视频管理': 33
      }
      return permissionStr.split(',').map(p => permissionMap[p]).filter(id => id)
    },
    // 保存权限
    savePermissions() {
      const checkedNodes = this.$refs.permissionTree.getCheckedNodes()
      const halfCheckedNodes = this.$refs.permissionTree.getHalfCheckedNodes()

      // 只取叶子节点的权限
      const leafPermissions = checkedNodes
        .filter(node => !node.children)
        .map(node => node.label)

      // 构造权限字符串
      const permissionStr = leafPermissions.join(',')

      // 保存权限
      this.http.post('/api/user/updatePermissions', {
        userId: this.currentUser.userId,
        modulePermissions: permissionStr
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('权限更新成功')
          // 更新当前行数据
          this.currentUser.modulePermissions = permissionStr
          this.currentUser.modulePermissionsArray = leafPermissions
          this.permissionDialogVisible = false
        } else {
          this.$message.error(res.msg || '权限更新失败')
        }
      }).catch(err => {
        console.error('权限更新失败', err)
        this.$message.error('权限更新失败')
      })
    },
    // 编辑GPU类型
    handleEditGpu(row) {
      this.currentUser = row
      this.gpuForm.enableGpu = !!row.gpuType
      this.gpuForm.gpuType = row.gpuType || ''
      this.gpuDialogVisible = true
    },
    // 保存GPU设置
    saveGpuSettings() {
      const gpuType = this.gpuForm.enableGpu ? this.gpuForm.gpuType : ''

      this.http.post('/api/user/updateGpuSettings', {
        userId: this.currentUser.userId,
        gpuType: gpuType
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('GPU设置更新成功')
          // 更新当前行数据
          this.currentUser.gpuType = gpuType
          this.gpuDialogVisible = false
        } else {
          this.$message.error(res.msg || 'GPU设置更新失败')
        }
      }).catch(err => {
        console.error('GPU设置更新失败', err)
        this.$message.error('GPU设置更新失败')
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.permission-tags {
  display: flex;
  flex-wrap: wrap;
}

.permission-tree-container {
  max-height: 400px;
  overflow-y: auto;
}
</style>
