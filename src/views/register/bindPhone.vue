<template>
  <div class="wrap-register">
    <div class="header">
      <div class="left">
        <img class="logo" src="@/assets/login-logo.jpg" alt=""/>
        手机号绑定
      </div>
    </div>

    <el-form class="form" ref="fromData" :model="fromData" :rules="formRules" size="medium">
      <el-form-item class="input" prop="phone">
        <el-input
          v-model="fromData.phone"
          type="text"
          auto-complete="off"
          placeholder="请输入手机号"
        >
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <el-input
          v-model="fromData.code"
          auto-complete="off"
          placeholder="请输入验证码"
          maxlength="4"
        >
          <div slot="suffix" class="btn-wrap">
            <el-button class="btn-code" type="primary" @click.native.prevent="handleSendCode">{{
                computeTime > 0 ? `(${computeTime}s)已发送` : "获取验证码"
              }}
            </el-button>
          </div>
        </el-input>
      </el-form-item>

      <el-form-item class="form-btn">
        <el-button
          :loading="loading"
          type="primary"
          class="btn"
          @click.native.prevent="handleSubmit"
        >
          确认绑定
        </el-button>
      </el-form-item>
    </el-form>

    <div ref="code"></div>
    <com-footer/>
  </div>
</template>

<script>
import {bindPhone, sendCode} from '@/api/login'
import ComFooter from '@/components/Footer'
import {setToken} from "@/utils/auth";
import {DX_APP_ID} from "@/utils/constants";

export default {
  name: 'BindPhone',
  components: {
    ComFooter
  },
  data() {
    return {
      computeTime: 0,
      fromData: {
        phone: "",
        code: "",
        tempToken: this.$route.query.token || ""
      },
      formRules: {
        phone: [
          {required: true, trigger: "blur", message: "手机号不能为空"},
          {min: 11, max: 11, message: "手机号必须是11位", trigger: "blur"},
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        code: [
          {required: true, trigger: "blur", message: "请输入验证码"},
        ]
      },
      loading: false,
      captchaToken: '',
      codeRef: null
    }
  },
  created() {
    if (!this.fromData.tempToken) {
      this.$message.error('无效的访问')
      this.$router.push('/')
    }
  },
  mounted() {
    // 初始化顶象验证码
    this.codeRef = _dx.Captcha(this.$refs.code, {
      appId: DX_APP_ID,
      style: 'popup',
      success: token => {
        this.captchaToken = token
        this.codeRef.hide()
        this.verifySuccess()
      }
    });
  },
  methods: {
    async handleSendCode() {
      try {
        await this.$refs.fromData.validateField("phone");
        if (!this.computeTime) {
          if (!this.fromData.phone) {
            this.$message.error("请输入手机号");
            return;
          }
          // 显示顶象验证码
          this.codeRef.show()
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 顶象验证成功后发送短信验证码
    async verifySuccess() {
      try {
        await sendCode(this.fromData.phone, this.fromData.tempToken, this.captchaToken);
        this.$message.success('验证码已发送');
        this.computeTime = 60;
        let timer = setInterval(() => {
          this.computeTime--;
          if (this.computeTime <= 0) {
            clearInterval(timer);
          }
        }, 1000);
      } catch (error) {
        console.error(error);
      }
    },
    handleSubmit() {
      this.$refs.fromData.validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            const response = await bindPhone(this.fromData);
            this.$message.success("绑定成功，正在跳转！");
            setToken(response.data);
            setTimeout(() => {
              this.$router.push("/");
            }, 1500);
          } catch (error) {
            console.error(error);
          } finally {
            this.loading = false;
          }
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
}

::v-deep {
  .form-btn {
    margin-bottom: 24px;
  }
}
</style>
