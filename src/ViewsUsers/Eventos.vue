<template>
  <div class="eventos-container">
    <h1 class="eventos-title">EVENTOS</h1>
    <div v-if="loading" class="loading">Cargando eventos...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="eventos-list">
      <div v-for="(evento, index) in eventos" :key="evento.id_evento" class="evento-card" :class="{ 'reverse': index % 2 !== 0 }">
        <div class="evento-content">
          <h2 class="evento-title">{{ evento.nombre_evento }}</h2>
          <p class="evento-date">{{ formatDate(evento.fecha) }}</p>
          <p class="evento-time">
            Hora de: {{ formatTime(evento.hora_inicio) }} a {{ formatTime(evento.hora_fin) }}
          </p>
          <p class="evento-description">{{ evento.descripcion }}</p>
        </div>
        <div class="evento-image">
          <img :src="evento.imagen_evento" :alt="evento.nombre_evento" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineComponent, onMounted } from 'vue';
import axios from 'axios';

defineComponent({
  name: 'EventsView'
});

const eventos = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchEventos = async () => {
  try {
    const response = await axios.get('http://localhost:7274/api/evento');
    eventos.value = response.data;
    loading.value = false;
  } catch (err) {
    console.error('Error fetching eventos:', err);
    error.value = 'Hubo un error al cargar los eventos. Por favor, intente de nuevo más tarde.';
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

const formatTime = (timeString) => {
  if (!timeString) return 'No especificado';
  const [hours, minutes] = timeString.split(':');
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

onMounted(fetchEventos);
</script>

<style scoped>
.eventos-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.eventos-title {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.loading, .error {
  text-align: center;
  color: #666;
  font-style: italic;
}

.eventos-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.evento-card {
  display: flex;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.evento-card.reverse {
  flex-direction: row-reverse;
}

.evento-content {
  flex: 1;
  padding: 2rem;
}

.evento-title {
  color: #333;
  margin-bottom: 0.5rem;
}

.evento-date, .evento-time {
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.evento-description {
  color: #444;
  line-height: 1.6;
  margin-top: 1rem;
}

.evento-image {
  flex: 1;
  max-width: 50%;
}

.evento-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .evento-card, .evento-card.reverse {
    flex-direction: column;
  }

  .evento-image {
    max-width: 100%;
  }
}
</style>