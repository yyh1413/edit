<template>
  <div class="wrap-login">
    <div class="content">
      <img class="logo" src="@/assets/login-logo.jpg" alt="" />

      <div class="body">
        <div class="form">
          <div class="left">
            <div class="tab">
              <div @click="current = 1" :class="current === 1 ? 'active' : ''" class="item">密码登录</div>
              <div @click="current = 2" :class="current === 2 ? 'active' : ''" class="item">验证码登录</div>
            </div>
            <ByPassword v-if="current === 1" />
            <ByCode v-if="current === 2" />
            <div @click="goRegister" class="register">立即注册</div>
          </div>
        </div>
      </div>
      <com-footer />

    </div>
  </div>
</template>

<script>
import ComFooter from '@/components/Footer'
import { resetRouter } from '@/utils/auth'

import ByCode from './ByCode'
import ByPassword from './ByPassword'
export default {
  components: {
    ByCode,
    ByPassword,
    ComFooter
  },
  data() {
    return {
      current: 1
    }
  },
  mounted() {
    localStorage.clear('isad')
    resetRouter()
  },
  methods: {
    goRegister() {
      this.$router.push("/register");
    },

  }
}
</script>
<style lang="scss" scoped>
.wrap-login {
  background: #F5F6FA;
  min-height: 100vh;

  .logo {
    width: 170px;
    height: 60px;
    margin-top: 36px;
    margin-bottom: 50px;
  }

  .content {
    width: 368px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // width: 1088px;
    margin: 0 auto;
  }

  .body {
    // height: 532px;
    background: #FFFFFF;
    border-radius: 12px;
    padding: 40px;
    box-sizing: border-box;

    .form {
      display: flex;
      justify-content: space-between;
    }

    .left {
      width: 368px;
    }

    .line {
      width: 1px;
      height: 320px;
      background: #BEC4CA;
    }

    .right {
      width: 225px;
    }

    .register {
      font-size: 14px;
      color: #595959;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }

    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      .item {
        font-weight: 600;
        font-size: 20px;
        color: #1A1A1A;
        line-height: 28px;
        margin: 0 10px;
        cursor: pointer;

        &.active {
          color: #0092FF;
        }
      }
    }
  }

  .footer {
    margin-top: 100px;

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
</style>
