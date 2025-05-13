<template>
  <div class="wrap-register">
    <div class="header">
      <div class="left">
        <img class="logo" src="@/assets/login-logo.jpg" alt="" />
        找回密码
      </div>
    </div>

    <el-form class="form" ref="fromData" :model="fromData" :rules="formRules" size="medium">
      <el-form-item class="input" prop="username">
        <el-input v-model="fromData.username" type="text" auto-complete="off" placeholder="请输入邮箱">
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="fromData.code" auto-complete="off" placeholder="验证码" style="width: 63%">

        </el-input>
        <div class="register-code">
          <img :src="codeUrl" @click="getCode" class="register-code-img" />
        </div>
      </el-form-item>
      <el-form-item prop="emailCode">
        <el-input v-model="fromData.emailCode" auto-complete="off" placeholder="请输入验证码" maxlength="6" @keyup.enter.native="handleLogin">
          <div slot="suffix" class="btn-wrap">
            <el-button class="btn-code" type="primary" @click.native.prevent="getSmsCode">{{
              computeTime > 0 ? `(${computeTime}s)已发送` : "获取验证码"
            }}</el-button>
          </div>
        </el-input>

      </el-form-item>
      <el-form-item class="input" prop="password">
        <el-input v-model="fromData.password" type="password" auto-complete="off" placeholder="请输入新密码">
          <template slot="prepend">
            <div class="pre">新 密 码</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="input" prop="confirmPassword">
        <el-input v-model="fromData.confirmPassword" type="password" auto-complete="off" placeholder="请再输入新密码">
          <template slot="prepend">
            <div class="pre">确认密码</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button :loading="loading" type="primary" class="btn" @click.native.prevent="handleSubmit">
          确认更改密码
        </el-button>
      </el-form-item>
    </el-form>

    <com-footer />
    <div ref="code"></div>

  </div>
</template>

<script>
import { getSmsCode, resetPassword } from '@/api/login'
import ComFooter from '@/components/Footer'
import { DX_APP_ID } from "@/utils/constants";

export default {
  components: {
    ComFooter
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!regex.test(value)) {
        callback(new Error('密码必须包含8-30个字母、数字和特殊符号'));
      } else {
        callback();
      }
    };
    const equalToPassword = (rule, value, callback) => {
      if (this.fromData.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      computeTime: 0,
      fromData: {
        username: "",
        password: "",
        code: "",
        confirmPassword: "",
        uuid: "",
        emailCode: "",
      },
      formRules: {

        username: [
          { required: true, trigger: "blur", message: "邮箱不能为空" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] },
        ],
        code: [
          { required: true, trigger: "blur", message: "请输入验证码" },
        ],
        emailCode: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
          { min: 6, max: 6, message: "请输入6位验证码", trigger: "blur" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { validator: validatePassword }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
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
        this.fromData.uuid = res.uuid;
      });
    },
    getSmsCode() {
      if (!this.fromData.username) {
        this.$message.error("请输入邮箱");
      } else if (!this.fromData.code) {
        this.$message.error("请输入验证码");
      } else {
        this.verifySuccess();
      }

    },
    verifySuccess() {
      if (!this.computeTime) {
        this.$refs.fromData.validateField("username", (valid) => {
          if (!valid) {
            console.log(valid)
            const param = {
              "username": this.fromData.username,
              "uuid": this.fromData.uuid,
              "code": this.fromData.code,
            }
            getSmsCode(param).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '验证码已发送',
                  type: 'success'
                });
                this.fromData.uuid = res.uuid;
                this.computeTime = 60;
                let timer = setInterval(() => {
                  this.computeTime--;
                  if (this.computeTime <= 0) {
                    clearInterval(timer)
                  }
                }, 1000);
              }
            })
          } else {
            this.$message.error('请输入邮箱');
          }
        })

      }
    },
    handleSubmit() {
      this.$refs.fromData.validate(valid => {
        if (valid) {
          this.loading = true;
          resetPassword(this.fromData).then(res => {
            this.$message.success("密码更改成功，正在跳转登录！");
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          }).catch(() => {
            this.loading = false;
          })
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap-register {
  .header {
    height: 100px;
    padding: 0 78px;
    background: #FFFFFF;
    box-shadow: 0px 8px 6px 0px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      width: 170px;
      height: 60px;
      margin-right: 24px;
    }

    .left {
      display: flex;
      align-items: center;
      font-size: 24px;
      color: #333333;
    }
  }

  .btn {
    height: 44px;
    width: 100%;
    font-size: 16px;
    margin-top: 20px;
  }

  .btn-wrap {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-code {
    width: 94px;
    height: 34px;
    display: flex;
    border-radius: 4px;
    align-items: center;
    justify-content: center;
  }

  .form {
    width: 398px;
    margin: 0 auto;
    margin-top: 80px;
    margin-bottom: 80px;
  }

  .pre {
    width: 40px;
    font-size: 14px;
    color: #666666;
  }
}

::v-deep {
  .el-form-item {
    margin-bottom: 40px;
  }

  .el-input {
    border: 1px solid #CCCCCC;
  }

  .el-input__inner {
    border: 1px solid #CCCCCC;
    border: none;
    box-shadow: none !important;
    vertical-align: middle;
    height: 50px;
    border-radius: 8px;
  }

  .el-input-group__prepend {
    background: #fff;
    border: none;
  }
}

::v-deep {
  .form-btn {
    margin-bottom: 24px;
  }
}

.register-code {
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
