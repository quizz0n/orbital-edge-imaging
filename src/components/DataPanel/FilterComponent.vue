<template>
  <div color="grey-lighten-4" class="px-4 d-flex align-center
    justify-space-between">
    <v-btn variant="flat" color="secondary" size="x-small" :disabled="selectedFilters.length == 0"
    @click="applyFilters">Apply Filters</v-btn>
    <v-btn variant="text" color="primary" size="x-small" :disabled="selectedFilters.length == 0"
    @click="resetFilters">Reset</v-btn>
  </div>
  <v-divider class="my-2"></v-divider>
  <div class="px-4 pt-1">
    <v-select label="Spatial relationship" default="test"
    :items="spatialRelList" item-title="name" item-value="value"
    v-model="spatialRel"
    @update:modelValue="selectSpatialRel"
    variant="outlined" density="compact" hide-details="true">
    </v-select>
  </div>
  <v-list-item v-for="filter in filtersList" :key="filter.field" class="pa-0 filters-list">
    <v-checkbox :value="filter.field" :label="filter.alias" v-model="filter.selected"
      density="compact" hide-details  class="sm-label-checkbox"></v-checkbox>
    <v-row v-if="filter.selected">
      <v-col cols=12 :class="{'pb-5': filter.selectedRadio != 'range',
        'pb-0': filter.selectedRadio == 'range'}">
        <v-radio-group v-model="filter.selectedRadio"
        class="filter-radio-options d-flex justify-md-center"
        inline density="compact" hide-details>
          <v-radio value="min" label="min"></v-radio>
          <v-radio value="max" label="max"></v-radio>
          <v-radio value="range" label="range"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row v-if="filter.selected && filter.selectedRadio == 'range'"
    class="mb-1 justify-md-space-evenly">
      <v-col cols="4">
        <v-text-field density="compact" variant="outlined"
        hide-details :rules=numRules class="interval-field pb-0"
        v-model="filter.rangeMin" label="min"></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field density="compact" variant="outlined"
        hide-details :rules=numRules class="interval-field pb-0"
        v-model="filter.rangeMax" label="max"></v-text-field>
      </v-col>
    </v-row>
  </v-list-item>
</template>
<script>
import { useStore } from 'vuex';
import {
  ref, computed, watch,
  onMounted,
} from 'vue';

export default {
  name: 'FilterComponent',
  emits: ['filter-layer'],
  setup(props, context) {
    const store = useStore();

    const spatialRelList = computed(() => store.getters.getSpatialRels);
    const spatialRel = ref(spatialRelList.value[0]);
    const selectedRadio = ref(null);

    const numRules = ref([(v) => /^[0-9]+$/.test(v) || 'Only numbers are allowed']);

    const getSelectedLayer = computed(() => store.getters.getSelectedLayer);

    const filtersList = ref(getSelectedLayer.value ? getSelectedLayer.value.layerAttr : []);

    onMounted(() => {
      store.dispatch('setSelectedSpatialRel', spatialRel.value);
    });

    function selectSpatialRel() {
      store.dispatch('setSelectedSpatialRel', spatialRel);
    }

    watch(getSelectedLayer, (newVal) => {
      if (newVal && newVal.type === 'vector') {
        filtersList.value = newVal ? newVal.layerAttr.slice(0, -1) : [];
      }
    }, { deep: true });

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

    const filterLayer = (filterItems) => {
      context.emit('filter-layer', filterItems);
    };

    const applyFilters = () => {
      const outStatistics = [];
      const whereClauses = [];

      Object.values(selectedFilters.value).forEach((f) => {
        const attrKey = f.field;
        const attrMin = f.min;
        const attrMax = f.max;
        const attrRangeMin = f.rangeMin;
        const attrRangeMax = f.rangeMax;

        if (attrKey && attrMin) {
          outStatistics.push({
            statisticType: 'MIN',
            onStatisticField: attrKey,
            outStatisticFieldName: `min_${attrKey}`,
          });
        } else if (attrKey && attrMax) {
          outStatistics.push({
            statisticType: 'MAX',
            onStatisticField: attrKey,
            outStatisticFieldName: `max_${attrKey}`,
          });
        }

        if (attrKey && attrRangeMin && attrRangeMax) {
          whereClauses.push(`${attrKey} >= ${attrRangeMin} AND ${attrKey} <= ${attrRangeMax}`);
        } else if (attrKey && attrRangeMin) {
          whereClauses.push(`${attrKey} >= ${attrRangeMin}`);
        } else if (attrKey && attrRangeMax) {
          whereClauses.push(`${attrKey} <= ${attrRangeMax}`);
        }
      });

      const filter = {};

      if (outStatistics.length > 0) {
        filter.outStatistics = JSON.stringify(outStatistics);
      }
      if (whereClauses.length > 0) {
        filter.where = whereClauses.join(' AND ');
      }

      filterLayer(filter);
    };

    const resetFilters = () => {
      filtersList.value = filtersList.value.map((filter) => ({
        ...filter,
        selected: false,
        selectedRadio: null,
        rangeMin: null,
        rangeMax: null,
      }));
    };

    return {
      spatialRelList,
      spatialRel,
      numRules,
      filtersList,
      selectSpatialRel,
      selectedRadio,
      selectedFilters,
      applyFilters,
      resetFilters,
    };
  },
};
</script>
<style scoped>
.filters-list {
  padding-inline-start: 16px !important;
}
.filter-radio-options ::v-deep .v-icon--size-default {
  font-size: calc(var(--v-icon-size-multiplier) * 1.2em);
}
.filter-radio-options ::v-deep .v-label {
  font-size: 0.9rem;
}
.interval-field {
  width: 80px;
}
</style>
