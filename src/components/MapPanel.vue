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

export default {
  name: 'OeiMapPanel',
  props: {
    aoiExtent: {
      type: Object,
      required: false,
    },
    lyrRq: {
      type: [Object, Boolean],
      required: false,
    },
  },
  setup(props) {
    const store = useStore();

    const mapRef = ref(null);
    const onMapReady = (map) => {
      mapRef.value = map;
    };

    onMounted(() => {
      mapRef.value = L.map('mapContainer').setView([51.175, 10.454], 5);
      L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        { attribution: 'Map data © <a href="https://openstreetmapRef.org">OpenStreetMap</a> contributors' },
      ).addTo(mapRef.value);
    });

    const currentLayer = computed(() => store.getters.getSelectedLayer);
    const aoiExtent = computed(() => store.state.aoiExtent);
    const layerReqUrl = computed(() => props.lyrRq);
    const aoiLayer = ref(null);
    const vectorLayer = ref(null);
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

    async function addUploadedAoi(filteredBounds) {
      try {
        if (vectorLayer.value) {
          mapRef.value.removeLayer(vectorLayer.value);
          vectorLayer.value = null;
        }

        aoiLayer.value = L.geoJSON(filteredBounds).addTo(mapRef.value);

        aoiLayer.value.setStyle({
          color: '#840032',
          weight: 3,
          opacity: 1,
          fillOpacity: 0,
        });

        mapRef.value.fitBounds(aoiLayer.value.getBounds());
      } catch (error) {
        console.error(error);
      }
    }

    async function addVectorLayer(requestUrl, params) {
      try {
        if (vectorLayer.value) {
          mapRef.value.removeLayer(vectorLayer.value);
          vectorLayer.value = null;
        }
        const countOnly = {
          ...params,
          returnGeometry: false,
          returnCountOnly: true,
        };
        const validResp = await axios.get(requestUrl, { params: countOnly });
        const count = computed(() => {
          if (validResp.status === 200) { return validResp.data.properties.count; }
          return null;
        });
        if (count.value) {
          store.dispatch('startLoading');

          const response = await axios.get(requestUrl, { params });
          geoJSONData.value = response.data;

          store.dispatch('alert/setAlert', { message: 'Your request has completed', color: 'success' });
          vectorLayer.value = L.geoJSON(geoJSONData.value, { onEachFeature }).addTo(mapRef.value);

          vectorLayer.value.setStyle({
            color: '#002642',
            weight: 3,
            opacity: 1,
            fill: '#002642',
            fillOpacity: 0.1,
          });

          mapRef.value.fitBounds(vectorLayer.value.getBounds());

          store.dispatch('finishLoading');
        } else {
          throw new Error('Your request did not return any results!');
        }
      } catch (err) {
        store.dispatch('alert/setAlert', { message: `ERROR: ${err.message}`, color: 'error' });
      }
    }

    async function handleaoiExtent(bbox) {
      const bounds = bbox.features[0].geometry;
      if (bounds) {
        if (aoiLayer.value) {
          mapRef.value.removeLayer(aoiLayer.value);
          aoiLayer.value = null;
        }
        addUploadedAoi(bounds);
      }
    }

    async function getLayer(req) {
      if (currentLayer.value.type === 'vector') {
        const aoiParams = {
          geometry: aoiLayer.value.getBounds().toBBoxString(),
          geometryType: 'esriGeometryEnvelope',
          inSR: '4326',
        };
        if (req.value === true) {
          await addVectorLayer(currentLayer.value.url, aoiParams);
        } else {
          const getSelectedSpatialRel = computed(
            () => store.getters.getSelectedSpatialRel,
          );
          const params = req.value.data;
          const aoiStatParams = {
            ...params,
            geometry: aoiLayer.value.getBounds().toBBoxString(),
            geometryType: 'esriGeometryEnvelope',
            inSR: '4326',
            spatialRel: getSelectedSpatialRel.value,
          };
          if (Object.keys(params).includes('outStatistics')) {
            const arr = JSON.parse(params.outStatistics);
            const field = arr[0].onStatisticField;
            if (aoiLayer.value) {
              const aoiStatsResponse = await axios
                .get(currentLayer.value.url, { params: aoiStatParams });
              const minMaxFieldValue = Object.values(
                aoiStatsResponse.data.features[0].properties,
              )[0];
              const featParams = {
                where: `${field}=${minMaxFieldValue}`,
                returnGeometry: true,
              };
              await addVectorLayer(currentLayer.value.url, featParams);
            }
          } else {
            await addVectorLayer(currentLayer.value.url, aoiStatParams);
          }
        }
      }
    }

    watch(aoiExtent, (newVal) => {
      if (newVal) {
        handleaoiExtent(newVal);
      } else if (!newVal) {
        mapRef.value.removeLayer(aoiLayer.value);
        aoiLayer.value = null;
      }
    });
    watch(layerReqUrl, () => {
      getLayer(layerReqUrl);
    });

    watch(aoiExtent, (newVal) => {
      if (!newVal) {
        if (vectorLayer.value) {
          mapRef.value.removeLayer(vectorLayer.value);
        }
      }
    });

    return {
      mapRef,
      onMapReady,
      features,
      getLayer,
    };
  },
};
</script>

<style scoped>
#mapContainer {
  height: 660px;
}
</style>
