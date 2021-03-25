<template>

</template>

<script>
  export default {
    name: "userMix",
    computed: {
      userStore: function () {
        return this.$store.state;
      },
      user: function () {
        return this.userStore.user;
      },
      isLogin: function () {
        return this.userStore.isLogin;
      }
    },
    methods: {
      commit(name, data) {
        this.$store.commit(`${name}`, data)
      },
      login(user) {
        this.commit("login", user)
      },
      logout() {
        this.commit("logout")
      }
    }
  }
</script>

<style scoped>

</style>
