import { createApp } from 'vue';
import App from './App.vue';
import axiosPlugin from './plugins/axios';
import { BootstrapVue3 } from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import router from './router';

const app = createApp(App);

app.use(axiosPlugin);
app.use(router);
app.use(BootstrapVue3);
app.mount('#app');