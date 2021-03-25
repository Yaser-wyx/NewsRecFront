<template>
  <v-app class="back">
    <nuxt style="z-index: 1"/>
  </v-app>
</template>

<script>
  import Baidu from "../components/mixin/utils/Baidu";
  import detectDevice from "../components/mixin/utils/detectDevice";

  export default {
    mixins: [Baidu, detectDevice],
  }
</script>
<style scoped>
  .back {
    background-color: #EAEFF3;
    position: relative;
  }

</style>
