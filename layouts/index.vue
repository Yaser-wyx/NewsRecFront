<template>
  <v-app class="back">
    <nuxt/>
  </v-app>
</template>

<script>
  import Baidu from "../components/mixin/utils/Baidu";
  import detectDevice from "../components/mixin/utils/detectDevice";
  export default {
    name: "index",
    mixins:[Baidu,detectDevice],
  }
</script>

<style scoped>
  .back {
    background-color: white;
  }
</style>
