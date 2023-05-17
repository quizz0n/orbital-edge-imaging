<template>
  <div id="mapContainer"></div>
</template>

<script>
import {
  ref, onMounted, computed, watch,
} from 'vue';
import { useStore } from 'vuex';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import getWmsBoundsModule from '@/js/getWmsBounds';

export default {
  name: 'OeiMapPanel',
  emits: ['attr-fetched'],
  props: {
    lyrRq: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    const map = ref(null);
    const store = useStore();

    onMounted(() => {
      map.value = L.map('mapContainer').setView([51.175, 10.454], 5);
      L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        { attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors' },
      ).addTo(map.value);
    });

    const currentLayer = computed(() => store.getters.getSelectedLayer);
    const layerReqUrl = computed(() => props.lyrRq);
    const vectorLayer = ref(null);
    const wmsLayer = ref(null);
    const features = ref([]);
    const geoJSONData = ref(null);

    function onEachFeature(feature, layer) {
      const attrName = Object.keys(feature.properties).slice(3, -2);
      const newKeys = ['NAME', 'Total cars', 'Petrol', 'Diesel', 'Gas', 'Total hibrid', 'Plug-In Hybrid', 'Electric', 'Other', 'YEAR'];
      const newAttrName = attrName.map((attr, index) => (index === 0 ? newKeys[index] : attr));

      const spans = newKeys.map((n) => {
        const value = feature.properties[newAttrName[newKeys.indexOf(n)]];
        return `<span><strong>${n}:</strong> ${value}</span><br/>`;
      });
      const popupContent = spans.join('');

      layer.bindPopup(popupContent);
    }

    async function addVectorLayer(requestUrl, params) {
      try {
        if (vectorLayer.value) {
          map.value.removeLayer(vectorLayer.value);
          vectorLayer.value = null;
        }

        const response = await axios.get(requestUrl, { params });
        geoJSONData.value = response.data;
        vectorLayer.value = L.geoJSON(geoJSONData.value, { onEachFeature }).addTo(map.value);
      } catch (error) {
        console.error('Failed to fetch GeoJSON data:', error);
      }
    }

    async function addWmsLayer(requestUrl, options) {
      wmsLayer.value = L.tileLayer.wms(requestUrl, options).addTo(map.value);
      wmsLayer.value.on('load', async () => {
        const bounds = await getWmsBoundsModule.getWmsBounds(currentLayer.value.url);
        map.value.fitBounds(bounds);
      });
    }

    async function handleLayerSelection() {
      if (currentLayer.value) {
        const options = {
          format: currentLayer.value.format,
          transparent: currentLayer.value.transparent,
          layers: currentLayer.value.layerName,
        };

        switch (currentLayer.value.type) {
          case 'vector':
            break;
          case 'wms':
            if (vectorLayer.value) {
              map.value.removeLayer(vectorLayer.value);
              vectorLayer.value = null;
            }
            if (wmsLayer.value) {
              map.value.removeLayer(wmsLayer.value);
              wmsLayer.value = null;
            }
            addWmsLayer(currentLayer.value.url, options);
            break;
          default:
        }
      }
    }

    watch(currentLayer, handleLayerSelection);

    async function filterLayer(filters) {
      if (currentLayer.value.type === 'vector') {
        const params = filters.value.data;
        if (Object.keys(params).includes('outStatistics')) {
          const arr = JSON.parse(params.outStatistics);
          const field = arr[0].onStatisticField;
          const statsResponse = await axios.get(currentLayer.value.url, { params });
          const minMaxFieldValue = Object.values(statsResponse.data.features[0].properties)[0];
          const newParams = {
            where: `${field}=${minMaxFieldValue}`,
            returnGeometry: true,
          };
          await addVectorLayer(currentLayer.value.url, newParams);
        } else {
          await addVectorLayer(currentLayer.value.url, params);
        }
      }
    }

    watch(layerReqUrl, () => {
      filterLayer(layerReqUrl);
    });

    watch(currentLayer, (newVal) => {
      if (!newVal) {
        if (vectorLayer.value) {
          map.value.removeLayer(vectorLayer.value);
        } else if (wmsLayer.value) {
          map.value.removeLayer(wmsLayer.value);
        }
      }
    });

    return {
      map,
      features,
      filterLayer,
    };
  },
};
</script>

<style scoped>
#mapContainer {
  height: 600px;
}
</style>
