<template>
  <div class="appbar-wrapper">
    <v-container class="pa-0 appbar">
      <router-link :to="{name:'Home'}" class="no-underline">
        <div class="mb-2 d-flex align-center">
          <v-avatar class="ms-4 me-6" image="@/assets/logo.png" size="55"></v-avatar>
          <h3 class="text-secondary appbar-title">Orbital<br/>Edge Imaging</h3>
        </div>
      </router-link>
    </v-container>
  </div>
</template>

<script setup>
//
</script>
<style>
.no-underline {
  text-decoration: none;
}
.appbar-wrapper {
  border-bottom: 5px solid rgb(var(--v-theme-secondary)) !important;
}
.appbar {
  border-bottom: 5px solid rgb(var(--v-theme-primary)) !important;
}
.appbar-title {
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
}
</style>
