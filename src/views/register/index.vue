<template>
  <div class="wrap-register">
    <div class="header">
      <div class="left">
        <img class="logo" src="@/assets/login-logo.jpg" alt="" />
        欢迎注册
      </div>
      <div @click="goLogin" class="right">
        已有账号？<span>请登录></span>
      </div>
    </div>

    <el-form class="form" ref="registerForm" :model="fromData" :rules="formRules" size="medium">
      <el-form-item class="input" prop="username">
        <el-input v-model="fromData.username" type="email" auto-complete="off" placeholder="建议使用常用邮箱">
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
        <el-input v-model="fromData.emailCode" auto-complete="off" placeholder="请输入验证码" maxlength="6">
          <div slot="suffix" class="btn-wrap">
            <el-button class="btn-code" type="primary" @click.native.prevent="getSmsCode">{{
              computeTime > 0 ? `(${computeTime}s)已发送` : "获取验证码"
            }}
            </el-button>
          </div>
        </el-input>

      </el-form-item>
      <el-form-item class="input" prop="password">
        <el-input v-model="fromData.password" type="password" auto-complete="off" placeholder="8-30个字母、数字、特殊符号组成的字符串">
        </el-input>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button :loading="loading" type="primary" class="btn" @click.native.prevent="handleRegister">
          注 册
        </el-button>
      </el-form-item>
      <div class="check">
        <el-checkbox v-model="fromData.isAgreement">
          阅读并同意
        </el-checkbox>
        <span @click="showProtocol">《用户服务协议》</span>
      </div>
    </el-form>

    <com-footer />
    <DialogSuccess v-if="visibleSuccess" :visible.sync="visibleSuccess" @close="visibleSuccess = false" />
    <DialogProtocol v-if="visibleProtocol" :visible.sync="visibleProtocol" @close="visibleProtocol = false" @agree="() => { fromData.isAgreement = true }" />
  </div>
</template>

<script>
import DialogSuccess from "./DialogSuccess";
import DialogProtocol from "./DialogProtocol";
import { getSmsCode, register } from '@/api/login'
import ComFooter from '@/components/Footer'

export default {
  components: {
    DialogSuccess,
    DialogProtocol,
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
    return {
      visibleSuccess: false,
      visibleProtocol: false,
      computeTime: 0,
      fromData: {
        code: "",
        username: "",
        password: "",
        emailCode: "",
        uuid: "",
        isAgreement: false,
        supportCode: null
      },
      formRules: {
        username: [
          { required: true, trigger: "blur", message: "邮箱不能为空" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur"] },
        ],
        code: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
        ],
        emailCode: [
          { required: true, trigger: "blur", message: "验证码不能为空" },
          { min: 6, max: 6, message: "请输入6位验证码", trigger: "blur" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { validator: validatePassword }
        ],
      },
      loading: false,
      codeUrl: "",
      // captchaToken: '',
      // codeRef: null
    }
  },
  mounted() {
    // this.codeRef = _dx.Captcha(this.$refs.code, {
    //   appId: DX_APP_ID,
    //   style: 'popup',
    //   success: token => {
    //     this.captchaToken = token
    //     this.codeRef.hide()
    //     this.verifySuccess()
    //   }
    // });
  },
  created() {
    this.getCode();
    if (this.$route.query.code) {
      this.fromData.supportCode = this.$route.query.code;
    }
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
        if (this.fromData.username) {
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
      }
    },
    handleRegister() {
      if (!this.fromData.isAgreement) {
        this.$message.warning("请阅读并同意协议");
        return
      }
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const param = {
            "username": this.fromData.username,
            "password": this.fromData.password,
            "confirmPassword": this.fromData.password,
            "emailCode": this.fromData.emailCode,
          }
          register(param).then(res => {
            this.$message.success("注册成功，正在跳转登录！");
            setTimeout(() => {
              this.$router.push("/login");
            }, 1000);
          }).catch(() => {
            this.loading = false;
            this.getCode();
          })
        }
      });
    },
    submitSuccess() {
      this.visibleSuccess = true;
    },
    showProtocol() {
      this.visibleProtocol = true;
    },
    goLogin() {
      this.$router.push("/login");
    },
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

    .right {
      font-size: 16px;
      color: #999999;
      line-height: 22px;

      span {
        color: #0092FF;
        cursor: pointer;
        text-decoration: underline;
      }
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
    margin-bottom: 126px;
  }

  .check {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    cursor: pointer;

    span {
      color: #0092FF;
      text-decoration: underline;
    }
  }

  .footer {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #E4E4E4;
    ;

    .p {
      height: 17px;
      font-size: 12px;
      color: #666666;
      line-height: 17px;
      text-align: center;
      margin-bottom: 10px;
    }
  }
}

::v-deep {
  .el-form-item {
    margin-bottom: 40px;
  }

  .el-input__inner {
    border: 1px solid #CCCCCC;
    box-shadow: none !important;
    vertical-align: middle;
    height: 52px;
    border-radius: 8px;
  }
}

::v-deep {
  .form-btn {
    margin-bottom: 24px;
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
