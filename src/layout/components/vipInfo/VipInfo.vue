<template>
  <div class="list-side">
    <div class="side-title" :style="{ color: myMember.levelOrder > 0 ? '#E19460' : '#333333' }">{{ myMember.levelName }}</div>
    <div class="side-ul">
      <ul>
        <li>
          钱包金额：¥{{ myMember.balance }}
        </li>
        <li>
          PLUS会员：{{ myMember.expired ? '已购买' : '暂无会员包' }}
        </li>
        <li style="color: #0092FF;">
          <router-link to="/user/member">详情</router-link>
        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VipInfo',
  computed: {
    ...mapGetters(['myMember'])
  }

}
</script>
<style lang="scss" scoped>
ul {
  padding: 0;
  margin: 0;
}

ul li {
  list-style: none;
}

.list-side {
  margin-right: 70px;

  .side-title {
    font-weight: 500;

    font-size: 18px;
    color: #333333;
    margin-bottom: 20px;
  }

  .side-ul {
    ul {
      li {
        margin-bottom: 8px;
        font-size: 14px;
        color: #333333;
      }

      .itemsstyle {
        color: #0092FF;
      }
    }
  }
}
</style>