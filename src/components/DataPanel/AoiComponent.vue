<template>
  <div>
    <h5 class="mx-6 mt-2">Use the field below to select an Area of Interest (AOI)</h5>
    <v-file-input v-model="file"
      label="GeoJSON file" prepend-icon="null"
      class="file-input mx-6 mt-4" :rules="rules">
    </v-file-input>
  </div>
</template>
<script>
import { useStore } from 'vuex';
import { ref, watch } from 'vue';

export default {
  name: 'AoiComponent',
  emits: ['aoi-loaded'],
  setup(props, context) {
    const store = useStore();
    const file = ref(null);
    const rules = [
      (v) => {
        const fileObj = v[0];
        if (fileObj && fileObj.name.split('.')[1] !== 'geojson') {
          return 'Only GeoJSON files are supported';
        }
        if (fileObj && fileObj.size >= 2 * 1024 * 1024) {
          return 'File size should be less than 2 MB';
        }
        return true;
      },
    ];

    watch(file, () => {
      const fileObj = file.value[0];
      if (fileObj && fileObj.size <= 2 * 1024 * 1024 && fileObj.name.split('.')[1] === 'geojson') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const geoJsonData = JSON.parse(event.target.result);
          context.emit('aoi-loaded', { geoJsonData });
          store.dispatch('setUploadedAoi', geoJsonData);
        };
        reader.readAsText(fileObj);
      } else if (!fileObj) {
        store.dispatch('clearUploadedAoi');
      } else {
        console.error('Only GeoJSON files are supported');
      }
    });

    return {
      file,
      rules,
    };
  },
};
</script>
<style>
.file-input .v-label {
  font-size: 0.9rem;
}
.file-input .v-input__prepend{
  display: none;
}
</style>
