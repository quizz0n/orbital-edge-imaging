<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000"
  class="snackbar">
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const snackbar = computed(() => store.getters['alert/getAlert']);

    return { snackbar };
  },
};
</script>
<style>
.snackbar .v-snackbar__content {
  text-align: center;
}
</style>
