import { createStore } from 'vuex';
import alert from './alert';

export default createStore({
  state() {
    return {
      loading: false,
      aoiExtent: null,
      layers: [
        {
          id: '0',
          name: 'DE: Passenger cars by fuel type',
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
      ],
      spatialRel: [
        { id: 0, value: 'esriSpatialRelContains', name: 'Contain' },
        { id: 1, value: 'esriSpatialRelIntersects', name: 'Intersect' },
      ],
      selectedLayer: null,
      selectedSpatialRel: null,
    };
  },
  getters: {
    getLayers(state) {
      return state.layers;
    },
    getSelectedLayer(state) {
      return state.selectedLayer;
    },
    getSpatialRels(state) {
      return state.spatialRel;
    },
    getSelectedSpatialRel(state) {
      return state.selectedSpatialRel;
    },
  },
  mutations: {
    SET_UPLOADED_AOI(state, data) {
      state.aoiExtent = data;
    },
    START_LOADING(state) {
      state.loading = true;
    },
    FINISH_LOADING(state) {
      state.loading = false;
    },
    CLEAR_UPLOADED_AOI(state) {
      state.aoiExtent = null;
    },
    SET_SELECTED_LAYER(state, layer) {
      state.selectedLayer = state.layers.find((l) => l.name.includes(layer.value));
    },
    SET_SELECTED_SPATIAL_REL(state, spatialRel) {
      state.selectedSpatialRel = spatialRel.value;
    },
  },
  actions: {
    setUploadedAoi({ commit }, data) {
      commit('SET_UPLOADED_AOI', data);
    },
    startLoading({ commit }) {
      commit('START_LOADING');
    },
    clearUploadedAoi({ commit }) {
      commit('CLEAR_UPLOADED_AOI');
    },
    finishLoading({ commit }) {
      commit('FINISH_LOADING');
    },
    setSelectedLayer({ commit }, layer) {
      commit('SET_SELECTED_LAYER', layer);
    },
    setSelectedSpatialRel({ commit }, spatialRel) {
      commit('SET_SELECTED_SPATIAL_REL', spatialRel);
    },
  },
  modules: {
    alert,
  },
});
