import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      layers: [
        {
          id: '0',
          name: 'Germany - Passenger cars by fuel type',
          type: 'vector',
          layerAttr: [
            // { field: 'NAME', alias: 'NAME' },
            {
              field: 'a0', alias: 'Total cars', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a1', alias: 'Petrol', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a2', alias: 'Diesel', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a3', alias: 'Gas', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a4', alias: 'Total hibrid', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a5', alias: 'Plug-In Hybrid', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a6', alias: 'Electric', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'a7', alias: 'Other', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
            {
              field: 'JAHR', alias: 'YEAR', selected: false, selectedRadio: false, min: false, max: false, rangeMin: null, rangeMax: null,
            },
          ],
          transparent: true,
          url: 'https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/ab21b2/FeatureServer/0/query?outFields=*&f=geojson',
        },
        {
          id: '1',
          name: 'Germany - Digital Topographic Map 1:250,000',
          type: 'wms',
          layerAttr: null,
          layerName: 'dtk250',
          format: 'image/png',
          transparent: true,
          url: 'http://sg.geodatenzentrum.de/wms_dtk250',
        },
      ],
      selectedLayer: null,
    };
  },
  getters: {
    getLayers(state) {
      return state.layers;
    },
    getSelectedLayer(state) {
      return state.selectedLayer;
    },
  },
  mutations: {
    SET_SELECTED_LAYER(state, layer) {
      state.selectedLayer = state.layers.find((l) => l.name.includes(layer.value));
    },
    SET_LAYER_ATTR(state, { layerId, data }) {
      const layer = state.layers.find((l) => l.id === layerId);
      if (layer) {
        layer.layerAttr = data;
      }
    },
  },
  actions: {
    setSelectedLayer({ commit }, layer) {
      commit('SET_SELECTED_LAYER', layer);
    },
    setLayerAttr({ commit }, { layerId, data }) {
      commit('SET_LAYER_ATTR', { layerId, data });
    },
  },
});
