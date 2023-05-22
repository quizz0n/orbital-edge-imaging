# Orbital Edge Imaging (OEI)

This is a simple front-end app made with VueJS 3, Vuex 4 and Leaflet for displaying GeoJSON files. 

It loads features from the [Passenger cars by fuel type in Germany (Esri Germany)](https://hub.arcgis.com/datasets/esri-de-content::personenkraftwagen-nach-kraftstoffarten-in-deutschland/about) dataset.

Main features are as follows:
1. Add an Area of Interest (AOI)
2. Filter layer's features within the extent of the AOI
3. Extra filtering options based on the layer's properties
4. Popup message with feature properties on feature interaction


## Project setup
Download/clone this repository and enter directory:
```
git clone git@github.com:quizz0n/orbital-edge-imaging.git
cd orbital-edge-imaging
```

### Install dependencies

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### AOI sample file

The repository includes a sample GeoJSON file in the root directory that can be used to test the application.
```
orbital-edge-imaging/aoi-sm.geojson
```