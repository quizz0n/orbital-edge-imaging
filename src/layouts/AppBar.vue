<template>
  <v-app-bar flat>
    <v-container class="fill-height d-flex align-center">
      <v-avatar
        class="me-10 ms-4"
        image="@/assets/logo.png"
        size="42"
      ></v-avatar>

      <h3 class="text-h4 font-weight-bold">Orbital Edge Imaging</h3>

      <v-spacer></v-spacer>

      <v-responsive max-width="260">
        <v-text-field
          density="compact"
          hide-details
          variant="solo"
        ></v-text-field>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>

<script setup>
//
</script>
