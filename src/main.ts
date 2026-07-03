import './assets/main.css'
import './assets/styles/tailwind.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue';
import router from './router'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYtxmVHx_1buEX9V_IgaQLHqMNGxEikkw",
  authDomain: "linksnip-7d59b.firebaseapp.com",
  projectId: "linksnip-7d59b",
  storageBucket: "linksnip-7d59b.appspot.com",
  messagingSenderId: "920249909716",
  appId: "1:920249909716:web:191b78977f987070549641"
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
