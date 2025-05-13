<template>
  <el-dropdown @command="handleCommand" class="avatar-container">
    <span class=" avatar_box">
      <div class="avatar" style=" border: 1px solid #333;">
        <i class="el-icon-user-solid"></i>
      </div>
      <div class="vip_text" v-if="isLogin">{{ userInfo.nickName }}</div>
    </span>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="logout" v-if="isLogin">退出</el-dropdown-item>
      <el-dropdown-item command="loin" v-else>登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo", 'isLogin']),
  },
  created() {
    // console.log(this.$store);
  },
  methods: {
    handleCommand(command) {
      console.log('command', command);

      if (command == "logout") {
        this.$confirm('确定退出登录吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch("LogOut");
        })

      } else if (command == "loin") {
        this.$router.push("/login");
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.avatar_box {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.avatar {

  border-radius: 50%;
  margin-left: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;


}

.vip {
  width: 13px;
  height: 13px;
  position: absolute;
  top: -6px;
  right: 42px;

}

.vip_text {
  margin-left: 5px;
  font-size: 14px;
  color: #282828;
}

.iconfont {
  font-size: 18px;
  margin-left: 15px;
  cursor: pointer;
}
</style>