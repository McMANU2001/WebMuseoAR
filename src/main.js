import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { MotionPlugin } from '@vueuse/motion';
import VueChartJs from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale } from 'chart.js';
import App from './App.vue';
import IndexMuseo from './ViewsUsers/IndexMuseo.vue';
import AcercaDelMuseo from './ViewsUsers/AcercaDelMuseo.vue';
import AgendarVisita from './ViewsUsers/AgendarVisita.vue';
import Login from './ViewsUsers/Login.vue';
import Eventos from './ViewsUsers/Eventos.vue';
import Register from './ViewsUsers/Register.vue';
import AdminDashboard from './Administration/AdminDashboard.vue';
import IndexDelUsuario from './ViewsUsers/IndexMuseo.vue';
import Perfil from './ViewsUsers/Perfil.vue';
import AR from './ViewsUsers/IntroduccionAR.vue';
import ARIngles from './ViewsUsers/IntroduccionARIngles.vue';
import MenuAR from './ViewsUsers/MenuAR.vue';
import MenuARIngles from './ViewsUsers/MenuARIngles.vue';
import ComentariosDashboard from './Administration/ComentariosVista.vue';


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);



const routes = [
  { path: '/', name: 'Inicio', component: IndexMuseo },
  { path: '/acerca-del-museo', name: 'Acerca del museo', component: AcercaDelMuseo },
  { path: '/eventos', name: 'Eventos', component: Eventos },
  { path: '/agendar-visita', name: 'Agendar Visita', component: AgendarVisita },
  { path: '/realidad-aumentada', name: 'Realidad Aumentada', component: AR },
  { path: '/realidad-aumentada-EN', name: 'Realidad Aumentada Ingles', component: ARIngles},
  { path: '/realidad-aumentada/personajes', name: 'Realidad Aumentada Menu', component: MenuAR },
  { path: '/realidad-aumentada/personajes-ingles', name: 'Realidad Aumentada Menu Ingles', component: MenuARIngles },

  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/perfil', name: 'perfil', component: Perfil },
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminDashboard, 
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
  { 
    path: '/user', 
    name: 'user', 
    component: IndexDelUsuario, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin/comentarios', 
    name: 'comentarios-dashboard', 
    component: ComentariosDashboard,
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!user) {
      next('/login');
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (user.rol) {
        next();
      } else {
        next('/user');
      }
    } else {
      next();
    }
  } else {
    next();
  }
});

const app = createApp(App);

app.use(MotionPlugin);
app.use(router);
app.use(VueChartJs);

app.mount('#app');