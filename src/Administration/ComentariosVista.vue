<template>
  <div class="comentarios-dashboard">
    <div class="dashboard-header" v-motion-slide-top>
      <h2>Dashboard de Comentarios</h2>
      <p class="dashboard-subtitle">Análisis de la experiencia de los usuarios</p>
    </div>
    <div class="statistics-container" v-motion-slide-up>
      <div class="stat-card">
        <h3>Total de Comentarios</h3>
        <div class="stat-value">{{ estadisticas.total_comentarios }}</div>
      </div>
      <div class="stat-card">
        <h3>Satisfacción General</h3>
        <div class="stat-value">{{ estadisticas.porcentaje_satisfaccion }}%</div>
      </div>
      <div class="stat-card">
        <h3>Me Gusta</h3>
        <div class="stat-value positive">{{ estadisticas.total_me_gusta }}</div>
      </div>
      <div class="stat-card">
        <h3>No Me Gusta</h3>
        <div class="stat-value negative">{{ estadisticas.total_no_me_gusta }}</div>
      </div>
      <div class="stat-card">
        <h3>Usuarios Participantes</h3>
        <div class="stat-value">{{ estadisticas.total_usuarios_comentaron }}</div>
      </div>
      <div class="stat-card">
        <h3>Total Usuarios</h3>
        <div class="stat-value">{{ estadisticas.total_usuarios_normales }}</div>
      </div>
      <div class="stat-card highlight">
        <h3>Tasa de Participación</h3>
        <div class="stat-value">{{ estadisticas.porcentaje_participacion }}%</div>
        <div class="stat-subtitle">de usuarios han comentado</div>
      </div>
    </div>

    <!-- Sección de Gráficos -->
    <div class="charts-section" v-motion-slide-up>
      <div class="chart-container feedback-chart">
        <h3>Distribución de Reacciones</h3>
        <div class="chart-wrapper">
          <Pie
            :data="chartDataReacciones"
            :options="chartOptions"
          />
        </div>
      </div>

      <div class="chart-container participation-chart">
        <h3>Participación de Usuarios</h3>
        <div class="chart-wrapper">
          <Pie
            :data="chartDataParticipacion"
            :options="chartOptions"
          />
        </div>
      </div>
    </div>

    <!-- Lista de Comentarios -->
    <div class="comments-section" v-motion-slide-up>
      <div class="comments-header">
        <h3>Comentarios Recientes</h3>
        <div class="comments-filters">
          <button 
            :class="['filter-btn', { active: filtroActual === 'todos' }]"
            @click="filtrarComentarios('todos')"
          >
            Todos
          </button>
          <button 
            :class="['filter-btn', { active: filtroActual === 'positivos' }]"
            @click="filtrarComentarios('positivos')"
          >
            Positivos
          </button>
          <button 
            :class="['filter-btn', { active: filtroActual === 'negativos' }]"
            @click="filtrarComentarios('negativos')"
          >
            Negativos
          </button>
        </div>
      </div>

      <div v-if="comentariosPaginados.length === 0" class="no-comments">
        No hay comentarios disponibles
      </div>
      
      <div v-else class="comments-list">
        <div v-for="comentario in comentariosPaginados" :key="comentario.id_comentario" class="comment-card">
          <div class="comment-header">
            <div class="user-info">
              <span class="user-name">{{ comentario.nombre_usuario }}</span>
              <div class="comment-date">
                <span class="date-label">Fecha comentada:</span>
                <span class="date-value">{{ formatearFecha(comentario.fecha_comentario) }}</span>
              </div>
              <div class="reaction-badge" :class="{ 
                'positive': comentario.me_gusta, 
                'negative': comentario.no_me_gusta 
              }">
                {{ comentario.me_gusta ? '👍 Me gustó' : '👎 No me gustó' }}
              </div>
            </div>
          </div>
          <div v-if="comentario.comentario_extra" class="comment-content">
            "{{ comentario.comentario_extra }}"
          </div>
        </div>
      </div>

      <!-- Controles de Paginación -->
      <div class="pagination-controls" v-if="totalPaginas > 1">
        <button 
          @click="paginaActual = Math.max(1, paginaActual - 1)"
          :disabled="paginaActual === 1"
        >
          Anterior
        </button>
        <span>Página {{ paginaActual }} de {{ totalPaginas }}</span>
        <button 
          @click="paginaActual = Math.min(totalPaginas, paginaActual + 1)"
          :disabled="paginaActual === totalPaginas"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { vMotionSlideTop, vMotionSlideUp } from '@vueuse/motion';
import axios from 'axios';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const comentarios = ref([]);
const estadisticas = ref({
  total_comentarios: 0,
  total_me_gusta: 0,
  total_no_me_gusta: 0,
  porcentaje_satisfaccion: 0,
  total_usuarios_comentaron: 0,
  total_usuarios: 0,
  total_usuarios_normales: 0,
  porcentaje_participacion: 0
});

const filtroActual = ref('todos');
const paginaActual = ref(1);
const comentariosPorPagina = 5;

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(fecha).toLocaleDateString('es-ES', options);
};

const chartDataReacciones = computed(() => ({
  labels: ['Me gusta', 'No me gusta'],
  datasets: [{
    data: [
      estadisticas.value.total_me_gusta,
      estadisticas.value.total_no_me_gusta
    ],
    backgroundColor: ['#4CAF50', '#F44336'],
    borderColor: ['#43A047', '#E53935'],
    borderWidth: 1
  }]
}));

const chartDataParticipacion = computed(() => ({
  labels: ['Han comentado', 'No han comentado'],
  datasets: [{
    data: [
      estadisticas.value.total_usuarios_comentaron,
      estadisticas.value.total_usuarios_normales - estadisticas.value.total_usuarios_comentaron
    ],
    backgroundColor: ['#2196F3', '#FFA726'],
    borderColor: ['#1E88E5', '#FB8C00'],
    borderWidth: 1
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: {
          size: 14,
          family: "'Playfair Display', serif"
        },
        padding: 20,
        color: '#3D2B1F'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(61, 43, 31, 0.9)',
      titleFont: {
        size: 14,
        family: "'Playfair Display', serif"
      },
      bodyFont: {
        size: 13
      },
      padding: 12
    }
  }
};

const comentariosFiltrados = computed(() => {
  if (filtroActual.value === 'todos') return comentarios.value;
  if (filtroActual.value === 'positivos') {
    return comentarios.value.filter(c => c.me_gusta);
  }
  return comentarios.value.filter(c => c.no_me_gusta);
});

const comentariosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * comentariosPorPagina;
  const fin = inicio + comentariosPorPagina;
  return comentariosFiltrados.value.slice(inicio, fin);
});

const totalPaginas = computed(() => {
  return Math.ceil(comentariosFiltrados.value.length / comentariosPorPagina);
});

const filtrarComentarios = (filtro) => {
  filtroActual.value = filtro;
  paginaActual.value = 1;
};

const fetchComentarios = async () => {
  try {
    const response = await axios.get('http://localhost:7274/api/Comentarios');
    comentarios.value = response.data;
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
  }
};

const fetchEstadisticas = async () => {
  try {
    const response = await axios.get('http://localhost:7274/api/Comentarios/estadisticas');
    estadisticas.value = response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
  }
};

onMounted(() => {
  fetchComentarios();
  fetchEstadisticas();
});
</script>

<style scoped>
.comentarios-dashboard {
  padding: 2rem;
  background-color: #FFF8DC;
  min-height: 100vh;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #3D2B1F;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  color: #666;
  font-size: 1.2rem;
}

.statistics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: #FAEBD7;
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  color: #3D2B1F;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #3D2B1F;
}

.stat-value.positive {
  color: #4CAF50;
}

.stat-value.negative {
  color: #F44336;
}

.stat-card.highlight {
  background-color: #3D2B1F;
  color: #FFF8DC;
}

.stat-card.highlight h3,
.stat-card.highlight .stat-value,
.stat-card.highlight .stat-subtitle {
  color: #FFF8DC;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.chart-container {
  background-color: #FAEBD7;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-container h3 {
  color: #3D2B1F;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.chart-wrapper {
  height: 300px;
  width: 100%;
  margin: 0 auto;
}

.comments-section {
  background-color: #FAEBD7;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.comments-header h3 {
  color: #3D2B1F;
  font-size: 1.3rem;
  margin: 0;
}

.comments-filters {
  display: flex;
  gap: 1rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #3D2B1F;
  border-radius: 20px;
  background: none;
  color: #3D2B1F;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background-color: #3D2B1F;
  color: #FFF8DC;
}

.comments-list {
  display: grid;
  gap: 1rem;
}

.comment-card {
  background-color: #FFF8DC;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.comment-header {
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-weight: bold;
  color: #3D2B1F;
}

.comment-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.date-label {
  font-weight: 600;
  color: #3D2B1F;
}

.date-value {
  color: #666;
}

.reaction-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}
.reaction-badge.positive {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.reaction-badge.negative {
  background-color: #FFEBEE;
  color: #C62828;
}

.comment-content {
  color: #666;
  line-height: 1.5;
  font-style: italic;
}

.no-comments {
  text-align: center;
  color: #666;
  padding: 2rem;
  font-style: italic;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1rem;
}

.pagination-controls button {
  padding: 0.5rem 1.2rem;
  border: 2px solid #3D2B1F;
  border-radius: 20px;
  background: none;
  color: #3D2B1F;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #3D2B1F;
  color: #FFF8DC;
  transform: translateY(-2px);
}

.pagination-controls button:disabled {
  border-color: #ccc;
  color: #999;
  cursor: not-allowed;
}

.pagination-controls span {
  color: #3D2B1F;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #FFF8DC;
  border-radius: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 1200px) {
  .statistics-container {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 992px) {
  .statistics-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .comentarios-dashboard {
    padding: 1rem;
  }

  .dashboard-header h2 {
    font-size: 2rem;
  }

  .statistics-container {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .chart-wrapper {
    height: 250px;
  }

  .comments-header {
    flex-direction: column;
    gap: 1rem;
  }

  .comments-filters {
    width: 100%;
    justify-content: center;
  }

  .pagination-controls {
    flex-direction: row;
    gap: 1rem;
  }

  .pagination-controls button {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  }

  .pagination-controls span {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .filter-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .pagination-controls {
    gap: 0.7rem;
  }

  .pagination-controls button {
    padding: 0.3rem 0.8rem;
    font-size: 0.85rem;
  }

  .pagination-controls span {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .comment-date {
    margin: 0.5rem 0;
  }
}
</style>