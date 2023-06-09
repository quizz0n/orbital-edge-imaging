import { createApp } from 'vue';

import { registerPlugins } from '@/plugins';
import App from './App.vue';
import store from './store';
import './styles/custom.scss';

const app = createApp(App);

registerPlugins(app);

app.use(store).mount('#app');
