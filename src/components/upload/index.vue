<template>
  <el-upload action="" class="upload-demo" :auto-upload="false" :limit="1" :file-list="fileList" :on-change="handleFileChange" :on-remove="handleRemove" :show-file-list="true">
    <el-button type="primary" size="mini">上传数据</el-button>
  </el-upload>
</template>

<script>
import OSS from "ali-oss";
import path from "path";
export default {
  props: {
    currentPath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      client: null,
      url: '/v1/oss/getUploadStsToken',
      allowedPath: ''
    };
  },
  methods: {
    // 获取临时 token 并初始化 ali-oss 客户端
    async initOSSClient(fileName) {
      // /v1//oss/getUploadStsToken
      const res = await this.http.get(this.url);

      const { accessKeyId, accessKeySecret, securityToken, bucketName, region, allowedPath } = res.data;
      // console.log('获取临时 token：', res.data, accessKeyId, accessKeySecret, securityToken);
      this.allowedPath = allowedPath
      this.client = new OSS({
        region: region,
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        stsToken: securityToken,
        authorizationV4: true,
        bucket: bucketName,
        secure: true
      });
    },
    // 文件变化时：自动上传
    async handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1); // 只保留一个文件
      const rawFile = file.raw;

      // 初始化 OSS 客户端
      if (!this.client) {
        await this.initOSSClient(rawFile.name);
      }

      // 自定义文件名，可加时间戳避免重复
      const url = path.join(this.allowedPath, this.currentPath, rawFile.name);
      // console.log('filename', url);

      try {
        const result = await this.client.put(url, rawFile);
        this.$message.success("上传成功！");
        this.$emit("uploadSuccess", result.url);
        console.log("上传结果：", result);
      } catch (err) {
        this.$message.error("上传失败！");
        console.error("OSS 上传失败：", err);
      }
      this.fileList = []
    },

    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
  },
};
</script>
