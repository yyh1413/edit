import { handleSingleSignOn } from "@/utils/sso";
import { getToken } from '@/utils/auth'
import { startHeartbeat, stopHeartbeat } from '@/utils/refreshToken'


export const initApp = (_this) => {

  if (getToken()) {
    startHeartbeat()
  }
  
  handleSingleSignOn().then(() => {
    _this.ssoFlag = true;
  })
  _this.$store.dispatch("GetIpLocation");
}