<template>
  <v-list-subheader>Available layers</v-list-subheader>
  <v-list-item v-for="l in layerOptions"
    :key="l.id">
    <v-checkbox :label="l.name" :value="l.name" class="text-black sm-label-checkbox"
      v-model="setLayer" @update:modelValue="selectLayer" density="compact" hide-details>
    </v-checkbox>
    <v-btn variant="flat" color="secondary" size="x-small" :disabled="!setLayer"
    @click="showData">Show All Features</v-btn>
  </v-list-item>
</template>
<script>
import { useStore } from 'vuex';
import { ref } from 'vue';

export default {
  name: 'LayerComponent',
  emits: ['show-data'],
  props: {
    layerOptions: {
      type: Object,
      required: false,
    },
  },
  setup(props, context) {
    const store = useStore();

    const setLayer = ref(null);

    function selectLayer() {
      store.dispatch('setSelectedLayer', setLayer);
    }

    const showData = () => {
      context.emit('show-data');
    };

    return {
      setLayer,
      selectLayer,
      showData,
    };
  },
};
</script>
<style>
.sm-label-checkbox .v-label {
  font-size: 0.8rem;
  font-weight: 500;
}
</style>
