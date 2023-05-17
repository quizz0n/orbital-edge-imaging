<template>
  <v-select clearable flat variant="solo-filled" density="compact" hide-details="true"
  v-model="selectedLayer" :items="layerOptions.map((l) => l.name)"
  @update:modelValue="selectLayer" label="Available layers"
  ></v-select>
  <div color="grey-lighten-4" class="px-4 pt-2 d-flex align-center justify-space-between">
    <h4>Filters</h4>
    <v-btn variant="text" @click="resetFilters">Reset</v-btn>
  </div>
  <v-divider class="my-2"></v-divider>
  <v-list>
    <v-list-item v-for="filter in filtersList" :key="filter.field">
      <v-checkbox :value="filter.field" :label="filter.alias" v-model="filter.selected"
        density="compact" hide-details></v-checkbox>
      <v-row v-if="filter.selected">
        <v-col cols=12 class="px-8">
          <v-radio-group v-model="filter.selectedRadio" inline density="compact" hide-details>
            <v-radio value="min" label="min"></v-radio>
            <v-radio value="max" label="max"></v-radio>
            <v-radio value="range" label="range"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row v-if="filter.selectedRadio == 'range'">
        <v-col cols="6">
          <v-text-field density="compact" hide-details :rules=numRules
           v-model="filter.rangeMin" label="min"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field density="compact" hide-details :rules=numRules
          v-model="filter.rangeMax" label="max"></v-text-field>
        </v-col>
      </v-row>
    </v-list-item>
  </v-list>
  <v-btn variant="text" @click="applyFilters">Apply Filters</v-btn>
</template>
<script>
import { useStore } from 'vuex';
import {
  ref, computed,
} from 'vue';
// import axios from 'axios';

export default {
  name: 'OeiDataPanel',
  emits: ['update-layer'],
  props: {
    attrs: {
      type: Object,
      required: false,
    },
  },
  setup(props, context) {
    const store = useStore();

    const selectedLayer = ref(null);
    const filterList = ref([]);
    const selectedRadio = ref(null);
    const attributes = ref({});
    const numRules = ref([(v) => /^[0-9]+$/.test(v) || 'Only numbers are allowed']);

    const layerOptions = computed(() => store.getters.getLayers);
    const getSelectedLayer = computed(() => store.getters.getSelectedLayer);

    function selectLayer() {
      store.dispatch('setSelectedLayer', selectedLayer);
    }

    const filtersList = computed(() => {
      if (getSelectedLayer.value && getSelectedLayer.value.layerAttr) {
        return getSelectedLayer.value.layerAttr;
      }
      return [];
    });

    const selectedFilters = computed(() => {
      const filteredResults = [];
      filtersList.value.forEach((filter) => {
        if (filter.selected) {
          filteredResults.push({
            field: filter.field,
            alias: filter.alias,
            min: filter.selectedRadio === 'min',
            max: filter.selectedRadio === 'max',
            rangeMin: filter.selectedRadio === 'range' ? filter.rangeMin : null,
            rangeMax: filter.selectedRadio === 'range' ? filter.rangeMax : null,
          });
        }
      });
      return filteredResults;
    });

    const updateLyr = (filterItems) => {
      context.emit('update-layer', filterItems);
    };

    const applyFilters = () => {
      let filter;
      Object.values(selectedFilters.value).forEach((f) => {
        const attrKey = f.field;
        const attrMin = f.min;
        const attrMax = f.max;
        const attrRangeMin = f.rangeMin;
        const attrRangeMax = f.rangeMax;
        if (attrKey && attrMin) {
          filter = {
            outStatistics: JSON.stringify([{
              statisticType: 'MIN',
              onStatisticField: attrKey,
              outStatisticFieldName: `min_${attrKey}`,
            }]),
          };
        } else if (attrKey && attrMax) {
          filter = {
            outStatistics: JSON.stringify([{
              statisticType: 'MAX',
              onStatisticField: attrKey,
              outStatisticFieldName: `max_${attrKey}`,
            }]),
          };
        } else if (attrKey && attrRangeMin && attrRangeMax) {
          filter = {
            where: `${attrKey} >= ${attrRangeMin} AND ${attrKey} <= ${attrRangeMax}`,
          };
        } else if (attrKey && attrRangeMin) {
          filter = {
            where: `${attrKey} >= ${attrRangeMin}`,
          };
        } else if (attrKey && attrRangeMax) {
          filter = {
            where: `${attrKey} <= ${attrRangeMax}`,
          };
        }
      });
      updateLyr(filter);
    };

    const resetFilters = () => {
      filtersList.value = null;
    };

    return {
      selectedLayer,
      layerOptions,
      selectLayer,
      attributes,
      numRules,
      filtersList,
      filterList,
      selectedRadio,
      selectedFilters,
      applyFilters,
      resetFilters,
    };
  },
};
</script>
