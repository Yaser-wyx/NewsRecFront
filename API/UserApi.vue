<template>

</template>

<script>
import ApiHelper from "@/API/ApiHelper";
import {Log} from "@/utils";

export default {
  name: "UserApi",
  data() {
    return {
      baseUrl: "/v1/user"
    }
  },
  extends: ApiHelper,
  methods: {
    async registerApi(user) {
      Log(user)
      return await this.post(this.baseUrl + "/register", user)
    }
  }

}
</script>

<style scoped>

</style>
