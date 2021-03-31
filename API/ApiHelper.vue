<template>

</template>

<script>
import $axios from '@/API/AxiosHelper'


export default {
  name: "ApiHandler",
  methods: {
    errorCheck(response, errorAction) {
      const {data} = response
      if (data.code !== 200) {
        if (errorAction) {
          errorAction()
        } else {
          this.$message.info(data.message)
        }
        return false
      }
      return data.data
    },
    async get(url, params, errorAction = null) {
      const response = await $axios.get(url, params)
      return this.errorCheck(response, errorAction)
    },
    async post(url, params, headers = {'Content-Type': 'application/x-www-form-urlencoded'}, errorAction = null) {
      const response = await $axios.post(url, params, headers)
      return this.errorCheck(response, errorAction)
    }
  }
}
</script>

<style scoped>

</style>
