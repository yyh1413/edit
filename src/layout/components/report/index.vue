<template>
  <div>
    <div class="report_tool" @click="handleOpen()">
      <div class="report">投诉举报</div>
    </div>

    <el-dialog title="投诉举报" :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="form">
        <el-form-item label="投诉类型" required>
          <el-select v-model="form.feedbackType" placeholder="请选择投诉类型">
            <el-option label="投诉" value="1"></el-option>
            <el-option label="建议" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投诉内容" required>
          <el-input v-model="form.feedbackContent" type="textarea" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        feedbackType: '',
        feedbackContent: ''
      }
    }
  },
  methods: {
    handleOpen() {
      this.form = {
        feedbackType: '',
        feedbackContent: ''
      }
      this.dialogFormVisible = true
    },
    async submit() {
      if (!this.form.feedbackType) {
        this.$message.error('请选择投诉类型')
        return
      }
      if (!this.form.feedbackContent || this.form.feedbackContent.length < 5) {
        this.$message.error('请输入投诉内容大于5字')
        return
      }

      request({
        url: "/system/complaint/add",
        method: "post",
        data: this.form,
      }).then((res) => {
        this.$message.success('提交成功')
        this.dialogFormVisible = false
      })
    }
  }
}
</script>


<style lang='scss' scoped>
.report_tool {
  position: fixed;
  cursor: pointer;
  bottom: 10px;
  right: 10px;
  z-index: 10;

  .report {
    border: 1px solid #5a5a5a;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    padding: 0 10px;
    color: #5a5a5a;
  }
}
</style>