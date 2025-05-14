<template>
  <div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" size="medium">
      <el-form-item class="input" prop="username">
        <el-input v-model="loginForm.username" type="username" auto-complete="off" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">

        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <div class="footer">
        <div @click="goRetrievePassword" class="tip">找回密码</div>
        <el-form-item>
          <el-button :loading="loading" type="primary" class="btn" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { handleLoginGetInfo } from "@/utils/auth";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        uuid: "",
        code: "",
        type: 1
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "邮箱不能为空" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
        ]
      },
      loading: false,
      codeUrl: "",
    }
  },
  mounted() {
    this.getCode();
  },
  methods: {
    getCode() {
      this.http.get('/captchaImage').then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    goRetrievePassword() {
      this.$router.push("/retrievePassword");
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              handleLoginGetInfo();
              this.$router.push({ path: "/" })
            })
            .catch(() => {
              this.getCode();
              this.loading = false;
            });
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.footer {
  position: relative;
}

.tip {
  font-size: 14px;
  color: #666666;
  cursor: pointer;
  text-align: right;
}

.btn {
  height: 44px;
  width: 100%;
  font-weight: 600;
  font-size: 18px;
}

::v-deep {
  .el-form-item {
    margin-bottom: 16px;
  }

  .el-input__inner {
    border: 1px solid #F7F8FC;
    box-shadow: none !important;
    vertical-align: middle;
    height: 44px;
    background: #F7F8FC;
    border-radius: 8px;
  }
}

.register-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.register-code-img {
  height: 38px;
}
</style>
