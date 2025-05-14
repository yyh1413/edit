<template>
  <div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" size="medium">
      <el-form-item class="input" prop="username">
        <el-input v-model="loginForm.username" type="email" auto-complete="off" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">

        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item prop="emailCode">
        <el-input v-model="loginForm.emailCode" auto-complete="off" placeholder="请输入验证码" maxlength="6" @keyup.enter.native="handleLogin">
          <div slot="suffix" class="btn-wrap">
            <el-button class="btn-code" type="primary" @click.native.prevent="getSmsCode">{{
              computeTime > 0 ? `(${computeTime}s)已发送` : "获取验证码"
            }}</el-button>
          </div>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" class="btn" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getSmsCode } from "@/api/login";
import { handleLoginGetInfo } from "@/utils/auth";

export default {
  name: "ByCode",
  data() {
    return {
      loginForm: {
        uuid: "",
        username: "",
        emailCode: "",
        code: "",
        type: 2
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "邮箱不能为空" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] },
        ],
        emailCode: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
          { min: 6, max: 6, message: "验证码为6位", trigger: "blur" },
        ],
        code: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
        ]
      },
      loading: false,
      computeTime: 0,
      captchaToken: '',
      codeRef: null,
      codeUrl: '',
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
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              handleLoginGetInfo();
              this.$router.push({ path:  "/" })

            })
            .catch(() => {
              this.getCode();
              this.loading = false;
            });
        }
      });
    },
    getSmsCode() {
      if (this.computeTime > 0) {
        return
      }
      if (!this.loginForm.username) {
        this.$message.error("请输入邮箱");
      } else if (!this.loginForm.code) {
        this.$message.error("请输入验证码");
      } else {
        this.verifySuccess();
      }
    },
    verifySuccess() {
      const param = {
        "username": this.loginForm.username,
        "uuid": this.loginForm.uuid,
        "code": this.loginForm.code,
      }
      getSmsCode(param).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: "验证码已发送",
            type: "success",
          });
          this.loginForm.uuid = res.uuid;
          this.computeTime = 60;
          this.timer = setInterval(() => {
            this.computeTime--;
            if (this.computeTime <= 0) {
              clearInterval(this.timer);
            }
          }, 1000);
        }
      }).catch(() => {
        this.getCode();
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.btn {
  height: 44px;
  width: 100%;
  font-weight: 600;
  font-size: 18px;
  margin-top: 20px;
}

.btn-wrap {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-code {
  width: 94px;
  height: 30px;
  display: flex;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
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
