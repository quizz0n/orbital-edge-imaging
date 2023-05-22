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
  #app .v-application {
    background-image: url('./assets/background.png');
    background-size: contain;
    background-position: right;
    background-repeat: no-repeat;
  }
  @media (max-width: 1280px) {
    #app .v-application {
      background-size: cover;
      background-position: center;
    }
  }
</style>
