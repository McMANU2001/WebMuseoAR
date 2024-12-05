<template>
  <div class="admin-panel">
    <div class="sidebar">
      <h2>Menú de Administración</h2>
      <nav>
        <ul>
          <li>
            <button @click="currentView = 'dashboard'" :class="{ active: currentView === 'dashboard' }">
              BIENVENIDO
            </button>
          </li>
          <li>
            <button @click="currentView = 'crearEvento'" :class="{ active: currentView === 'crearEvento' }">
              EVENTOS
            </button>
          </li>
          <li>
            <button @click="currentView = 'gestionVisitas'" :class="{ active: currentView === 'gestionVisitas' }">
              VISITAS
            </button>
          </li>
          <li>
            <button @click="currentView = 'comentariosVista'" :class="{ active: currentView === 'comentariosVista' }">
              COMENTARIOS
            </button>
          </li>
        </ul>
      </nav>
    </div>
    <div class="main-content">
      <component :is="currentViewComponent" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Dashboard from './Dashboard.vue';
import CrearEvento from './CrearEvento.vue';
import GestionVisitas from './GestionVisitas.vue';
import ComentariosVista from './ComentariosVista.vue';

const currentView = ref('dashboard');

const currentViewComponent = computed(() => {
  const components = {
    dashboard: Dashboard,
    crearEvento: CrearEvento,
    gestionVisitas: GestionVisitas,
    comentariosVista: ComentariosVista
  };
  
  return components[currentView.value] || Dashboard;
});
</script>

<style scoped>
.admin-panel {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background-color: #3D2B1F;
  color: #FFF8DC;
  padding: 20px;
}

.sidebar h2 {
  margin-bottom: 20px;
  text-align: center;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
}

.sidebar button {
  width: 100%;
  padding: 10px;
  background-color: transparent;
  color: #FFF8DC;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar button:hover, .sidebar button.active {
  background-color: #2A1E16;
}

.main-content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>