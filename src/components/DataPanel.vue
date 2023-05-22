<template>
  <v-list class="data-panel">
    <AoiComponent @aoi-loaded="filterBounds"/>

    <LayerComponent v-if="aoiExtentStatus" @show-data="showData" :layerOptions="layerOptions"/>

    <v-divider v-if="aoiExtentStatus && getSelectedLayer" class="my-2"></v-divider>

    <v-list-group v-if="aoiExtentStatus && getSelectedLayer" value="Filter">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Filters" class="pt-0"></v-list-item>
      </template>
      <FilterComponent @filter-layer="filterLyr"/>
    </v-list-group>
  </v-list>
</template>
<script>
import { useStore } from 'vuex';
import {
  ref, computed,
} from 'vue';
import AoiComponent from '@/components/DataPanel/AoiComponent.vue';
import FilterComponent from '@/components/DataPanel/FilterComponent.vue';
import LayerComponent from './DataPanel/LayerComponent.vue';

export default {
  name: 'OeiDataPanel',
  components: {
    AoiComponent,
    LayerComponent,
    FilterComponent,
  },
  emits: ['aoi-loaded', 'show-data', 'filter-layer'],
  setup(props, context) {
    const store = useStore();

    const aoiExtentStatus = computed(() => !!store.state.aoiExtent);
    const setLayer = ref(null);

    const layerOptions = computed(() => store.getters.getLayers);
    const getSelectedLayer = computed(() => store.getters.getSelectedLayer);

    const layerType = computed(() => {
      if (getSelectedLayer.value) {
        return getSelectedLayer.value.type;
      }
      return null;
    });

    function selectLayer() {
      store.dispatch('setSelectedLayer', setLayer);
    }

    const filterBounds = (aoi) => {
      context.emit('aoi-loaded', aoi);
    };

    const showData = () => {
      context.emit('show-data');
    };

    const filterLyr = (filterItems) => {
      context.emit('filter-layer', filterItems);
    };

    return {
      aoiExtentStatus,
      setLayer,
      selectLayer,
      filterBounds,
      layerOptions,
      getSelectedLayer,
      layerType,
      showData,
      filterLyr,
    };
  },
};
</script>
<style>
.data-panel {
  max-height: 64vh;
  overflow-y: auto;
}
</style>
