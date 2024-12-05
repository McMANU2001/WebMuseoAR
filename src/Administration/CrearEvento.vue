<template>
  <div class="eventos-container">
    <div class="header-controls">
      <h2>Gestión de Eventos</h2>
      <button @click="showCreateModal = true" class="btn-create">Crear Evento</button>
    </div>
    
    <div class="table-controls">
      <div class="show-entries">
        Mostrando <select v-model="entriesPerPage">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select> eventos
      </div>
      <div class="search">
        Buscar: <input type="text" v-model="searchTerm" @input="filterEvents">
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Hora Inicio</th>
          <th>Hora Fin</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="evento in paginatedEvents" :key="evento.id_evento">
          <td>{{ evento.id_evento }}</td>
          <td>{{ evento.nombre_evento }}</td>
          <td>{{ formatDate(evento.fecha) }}</td>
          <td>{{ evento.hora_inicio }}</td>
          <td>{{ evento.hora_fin }}</td>
          <td>
            <button @click="editarEvento(evento)" class="btn-edit">Editar</button>
            <button @click="eliminarEvento(evento.id_evento)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <span>Mostrando {{ startIndex + 1 }} a {{ endIndex }} de {{ filteredEvents.length }} eventos</span>
      <div class="pagination-buttons">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>{{ currentPage }}</span>
        <button @click="nextPage" :disabled="currentPage >= totalPages">Siguiente</button>
      </div>
    </div>

    <!-- Modal de creación -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h2>Creación de Evento</h2>
        <form @submit.prevent="validateAndCreateEvent">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" v-model="nuevoEvento.nombre" placeholder="Nombre" required>
          </div>
          
          <div class="form-group">
            <label for="fecha">Fecha</label>
            <input type="date" id="fecha" v-model="nuevoEvento.fecha" 
                   :min="minDate" required>
            <span v-if="fechaError" class="error-message">{{ fechaError }}</span>
          </div>
          
          <div class="form-group">
            <label for="horaInicio">Hora de Inicio</label>
            <input type="time" id="horaInicio" v-model="nuevoEvento.horaInicio" 
                   @change="validateHoras" required>
            <span v-if="horaError" class="error-message">{{ horaError }}</span>
          </div>
          
          <div class="form-group">
            <label for="horaFin">Hora de Fin</label>
            <input type="time" id="horaFin" v-model="nuevoEvento.horaFin" 
                   @change="validateHoras" required>
          </div>
          
          <div class="form-group">
            <label for="imagen">Imagen</label>
            <input type="file" id="imagen" @change="(e) => handleFileUpload(e, 'create')" required>
          </div>
          
          <div class="form-group">
            <label for="descripcion">Comentario</label>
            <textarea id="descripcion" v-model="nuevoEvento.descripcion" 
                      placeholder="Escriba un comentario para tomar en cuenta en la visita" required></textarea>
          </div>
          
          <div class="modal-buttons">
            <button type="submit" class="btn-save">Crear</button>
            <button type="button" @click="closeCreateModal" class="btn-cancel">Cancelar</button>
          </div>
        </form>
        
        <p v-if="mensaje" :class="{ 'success-message': !mensaje.includes('error'), 
                                  'error-message': mensaje.includes('error') }">
          {{ mensaje }}
        </p>
      </div>
    </div>

    <!-- Modal de edición -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Editar Evento</h3>
        <form @submit.prevent="validateAndUpdateEvent">
          <div class="form-group">
            <label for="edit-nombre">Nombre</label>
            <input type="text" id="edit-nombre" v-model="eventoEditando.nombre_evento" required>
          </div>
          
          <div class="form-group">
            <label for="edit-fecha">Fecha</label>
            <input type="date" id="edit-fecha" v-model="eventoEditando.fecha" 
                   :min="minDate" required>
            <span v-if="fechaErrorEdit" class="error-message">{{ fechaErrorEdit }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-hora-inicio">Hora de Inicio</label>
            <input type="time" id="edit-hora-inicio" v-model="eventoEditando.hora_inicio" 
                   @change="validateHorasEdit" required>
            <span v-if="horaErrorEdit" class="error-message">{{ horaErrorEdit }}</span>
          </div>
          
          <div class="form-group">
            <label for="edit-hora-fin">Hora de Fin</label>
            <input type="time" id="edit-hora-fin" v-model="eventoEditando.hora_fin" 
                   @change="validateHorasEdit" required>
          </div>
          
          <div class="form-group">
            <label for="edit-imagen">Imagen</label>
            <input type="file" id="edit-imagen" @change="(e) => handleFileUpload(e, 'edit')">
            <span class="image-helper">Mantener vacío para mantener la imagen actual</span>
          </div>
          
          <div class="form-group">
            <label for="edit-descripcion">Descripción</label>
            <textarea id="edit-descripcion" v-model="eventoEditando.descripcion" required></textarea>
          </div>
          
          <div class="modal-buttons">
            <button type="submit" class="btn-save">Guardar</button>
            <button type="button" @click="closeEditModal" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Referencias reactivas
const eventos = ref([]);
const filteredEvents = ref([]);
const searchTerm = ref('');
const entriesPerPage = ref(10);
const currentPage = ref(1);
const showEditModal = ref(false);
const showCreateModal = ref(false);
const eventoEditando = ref({});
const mensaje = ref('');

// Variables para manejo de errores
const fechaError = ref('');
const horaError = ref('');
const fechaErrorEdit = ref('');
const horaErrorEdit = ref('');

// Evento nuevo
const nuevoEvento = ref({
  nombre: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  descripcion: '',
  imagenEvento: null
});

// Computed properties
const startIndex = computed(() => (currentPage.value - 1) * entriesPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + entriesPerPage.value, filteredEvents.value.length));
const totalPages = computed(() => Math.ceil(filteredEvents.value.length / entriesPerPage.value));
const minDate = computed(() => new Date().toISOString().split('T')[0]);

const paginatedEvents = computed(() => {
  return filteredEvents.value.slice(startIndex.value, endIndex.value);
});

// Métodos de validación
const validateHoras = () => {
  horaError.value = '';
  if (nuevoEvento.value.horaInicio && nuevoEvento.value.horaFin) {
    if (nuevoEvento.value.horaInicio >= nuevoEvento.value.horaFin) {
      horaError.value = 'La hora de fin debe ser posterior a la hora de inicio';
      return false;
    }
  }
  return true;
};

const validateFecha = () => {
  fechaError.value = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(nuevoEvento.value.fecha);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    fechaError.value = 'No se pueden crear eventos en fechas pasadas';
    return false;
  }
  return true;
};

const validateHorasEdit = () => {
  horaErrorEdit.value = '';
  if (eventoEditando.value.hora_inicio && eventoEditando.value.hora_fin) {
    if (eventoEditando.value.hora_inicio >= eventoEditando.value.hora_fin) {
      horaErrorEdit.value = 'La hora de fin debe ser posterior a la hora de inicio';
      return false;
    }
  }
  return true;
};

const validateFechaEdit = () => {
  fechaErrorEdit.value = '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(eventoEditando.value.fecha);
  selectedDate.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    fechaErrorEdit.value = 'No se pueden programar eventos en fechas pasadas';
    return false;
  }
  return true;
};

// Métodos de manejo de archivos
const handleFileUpload = (event, mode) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (mode === 'create') {
        nuevoEvento.value.imagenEvento = reader.result;
      } else if (mode === 'edit') {
        eventoEditando.value.imagen_evento = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

// Métodos CRUD
const validateAndCreateEvent = async () => {
  if (!validateFecha() || !validateHoras()) {
    return;
  }
  await crearEvento();
};

const crearEvento = async () => {
  const evento = {
    nombre_evento: nuevoEvento.value.nombre,
    fecha: nuevoEvento.value.fecha,
    hora_inicio: nuevoEvento.value.horaInicio,
    hora_fin: nuevoEvento.value.horaFin,
    descripcion: nuevoEvento.value.descripcion,
    imagen_evento: nuevoEvento.value.imagenEvento
  };

  try {
    const response = await axios.post('http://localhost:7274/api/evento', evento);
    mensaje.value = response.data;
    await cargarEventos();
    closeCreateModal();
  } catch (error) {
    console.error('Error al crear el evento:', error);
    mensaje.value = 'Hubo un error al crear el evento';
  }
};

const validateAndUpdateEvent = async () => {
  if (!validateFechaEdit() || !validateHorasEdit()) {
    return;
  }
  await actualizarEvento();
};

const actualizarEvento = async () => {
  try {
    await axios.put('http://localhost:7274/api/evento', eventoEditando.value);
    await cargarEventos();
    closeEditModal();
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    mensaje.value = 'Hubo un error al actualizar el evento';
  }
};

const eliminarEvento = async (id) => {
  if (confirm('¿Está seguro de que desea eliminar este evento?')) {
    try {
      await axios.delete(`http://localhost:7274/api/evento/${id}`);
      await cargarEventos();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      mensaje.value = 'Hubo un error al eliminar el evento';
    }
  }
};

// Métodos de carga y filtrado
const cargarEventos = async () => {
  try {
    const response = await axios.get('http://localhost:7274/api/evento');
    eventos.value = response.data;
    filteredEvents.value = [...eventos.value];
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    mensaje.value = 'Error al cargar los eventos';
  }
};

const filterEvents = () => {
  filteredEvents.value = eventos.value.filter(evento => 
    evento.nombre_evento.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
  currentPage.value = 1;
};

// Métodos de utilidad
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const editarEvento = (evento) => {
  eventoEditando.value = { ...evento };
  showEditModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  nuevoEvento.value = {
    nombre: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    descripcion: '',
    imagenEvento: null
  };
  fechaError.value = '';
  horaError.value = '';
  mensaje.value = '';
};

const closeEditModal = () => {
  showEditModal.value = false;
  eventoEditando.value = {};
  fechaErrorEdit.value = '';
  horaErrorEdit.value = '';
};

// Métodos de paginación
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Inicialización
onMounted(() => {
  cargarEventos();
});
</script>

<style scoped>
.eventos-container {
  padding: 2rem;
  background-color: #FAEBD7;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

th, td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #DEB887;
}

th {
  background-color: #3D2B1F;
  color: white;
}

.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background-color: #4CAF50;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-save {
  background-color: #4CAF50;
  color: white;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #FAEBD7;
  padding: 2rem;
  border-radius: 8px;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.image-helper {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3D2B1F;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #DEB887;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  height: 100px;
  resize: vertical;
}

p {
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
}
</style>