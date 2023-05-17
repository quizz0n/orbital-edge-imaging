<template>
  <v-main class="bg-grey-lighten-3">
    <v-container>
      <v-row>
        <v-col cols="12" md="3">
          <v-sheet rounded="lg">
            <v-list rounded="lg">
              <oei-data-panel :attrs="layerAttr" @update-layer="sendLayerReq"/>
            </v-list>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="9">
          <v-sheet min-height="70vh" rounded="lg" class="map-panel-sheet">
            <v-list rounded="lg" class="map-panel-list d-flex flex-column justify-space-between">
              <v-list-item>
                <oei-map @attr-fetched="sendData" :lyrRq="layerReq"/>
              </v-list-item>
              <v-list-item color="grey-lighten-4">
                <v-divider class="my-2"></v-divider>
                <v-list-item-title>
                  Legend
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { ref } from 'vue';
import OeiDataPanel from '@/components/DataPanel.vue';
import OeiMap from '@/components/MapPanel.vue';

export default {
  name: 'AppMain',
  components: {
    OeiDataPanel,
    OeiMap,
  },
  setup() {
    const layerAttr = ref(null);

    const layerReq = ref(null);

    const sendData = (data) => {
      layerAttr.value = data;
    };

    const sendLayerReq = (data) => {
      layerReq.value = { data };
    };

    return {
      layerAttr,
      layerReq,
      sendData,
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
