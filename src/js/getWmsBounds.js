import axios from 'axios';
import L from 'leaflet';

export default {
  async getWmsBounds(url) {
    try {
      const capabilitiesUrl = `${url}?service=WMS&request=GetCapabilities`;
      const response = await axios.get(capabilitiesUrl);
      const features = this.parseResponse(response.data);

      return features;
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
    }
  },

  parseResponse(capabilitiesXml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(capabilitiesXml, 'application/xml');

    const bbox = Array.from(xmlDoc.getElementsByTagName('EX_GeographicBoundingBox'))[0];

    if (!bbox) {
      console.error('No response to the WMS request');
      return [];
    }

    const minx = bbox.getElementsByTagName('westBoundLongitude')[0].textContent;
    const miny = bbox.getElementsByTagName('southBoundLatitude')[0].textContent;
    const maxx = bbox.getElementsByTagName('eastBoundLongitude')[0].textContent;
    const maxy = bbox.getElementsByTagName('northBoundLatitude')[0].textContent;

    return L.latLngBounds([[miny, minx], [maxy, maxx]]);
  },
};
