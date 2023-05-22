<template>
  <v-app>
    <router-view />
    <alert/>
  </v-app>
</template>

<script>
import Alert from './Alert.vue';

export default {
  components: { Alert },
};
</script>
<style>
  @font-face {
    font-family: "Orbitron";
    src: local("Orbitron"),
    url(@/public/Orbitron/Orbitron-VariableFont_wght.ttf) format("truetype")
  }
</style>
