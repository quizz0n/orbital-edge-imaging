<template>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-card rounded="lg">
            <v-list rounded="lg">
              <app-bar />
              <oei-data-panel :attrs="layerAttr"
              @aoi-loaded="sendLayerExt"
              @show-data="sendLayerReq"
              @filter-layer="sendLayerReq"/>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="9">
          <v-card min-height="72vh" rounded="lg" class="map-panel-sheet" :loading=loading>
            <v-list rounded="lg" class="map-panel-list d-flex flex-column justify-space-between">
              <v-list-item>
                <oei-map :extent="layerExt" :lyrRq="layerReq"/>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import AppBar from '@/layouts/AppBar.vue';
import OeiDataPanel from '@/components/DataPanel.vue';
import OeiMap from '@/components/MapPanel.vue';

export default {
  name: 'AppMain',
  components: {
    AppBar,
    OeiDataPanel,
    OeiMap,
  },
  setup() {
    const store = useStore();

    const loading = computed(() => store.state.loading);

    const layerAttr = ref(null);
    const layerExt = ref(null);
    const layerReq = ref(null);

    const sendData = (data) => {
      layerAttr.value = data;
    };
    const sendLayerExt = (data) => {
      layerExt.value = { data };
    };
    const sendLayerReq = (data) => {
      if (data) {
        layerReq.value = { data };
      } else {
        layerReq.value = true;
      }
    };

    return {
      loading,
      layerAttr,
      layerExt,
      layerReq,
      sendData,
      sendLayerExt,
      sendLayerReq,
    };
  },
};
</script>
<style>
.map-panel-sheet,
.map-panel-list {
  height: 100%;
}
</style>
