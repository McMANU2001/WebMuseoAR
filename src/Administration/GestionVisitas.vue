<template>
  <div class="museo-container">
    <div class="inicio-section">
      <h2>Gestión de Visitas</h2>
      
      <div class="filters-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Buscar por nombre o entidad..."
            @input="filterVisits"
          >
        </div>
        <div class="filter-buttons">
          <button 
            v-for="filter in statusFilters" 
            :key="filter.value"
            :class="['filter-btn', { active: currentFilter === filter.value }]"
            @click="filterByStatus(filter.value)"
          >
            {{ filter.label }}
            <span class="count-badge">{{ getStatusCount(filter.value) }}</span>
          </button>
        </div>
      </div>

      <div class="visitas-grid">
        <div v-if="isLoading" class="loading">
          Cargando visitas...
        </div>

        <div v-else-if="!paginatedVisits || paginatedVisits.length === 0" class="no-results">
          No se encontraron visitas que coincidan con los filtros aplicados
        </div>
        
        <div v-else v-for="visit in paginatedVisits" 
             :key="visit.id_visita" 
             class="visita-card"
             :class="visit.estado"
             @click="openVisitModal(visit)"
        >
          <div class="card-header">
            <span :class="['estado-badge', visit.estado]">
              {{ capitalizeFirst(visit.estado) }}
            </span>
            <span class="visita-id">#{{ visit.id_visita }}</span>
          </div>

          <div class="card-content">
            <div class="basic-info">
              <div class="fecha-hora">
                <div class="info-group">
                  <i class="fas fa-calendar"></i>
                  <span>{{ formatDate(visit.fecha_visita) }}</span>
                </div>
                <div class="info-group">
                  <i class="fas fa-clock"></i>
                  <span>{{ visit.hora_visita }}</span>
                </div>
              </div>

              <div class="info-group">
                <label>Visitantes:</label>
                <span class="highlight">{{ visit.nro_visitantes }}</span>
              </div>

              <div class="info-group">
                <label>Tipo:</label>
                <span>{{ visit.entidad }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-left"></i> Anterior
        </button>
        
        <div class="pagination-numbers">
          <button 
            v-for="page in displayedPages" 
            :key="page"
            :class="['page-number', { active: currentPage === page }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>

        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination-btn"
        >
          Siguiente <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      
      <div class="visits-summary" v-if="filteredVisits && filteredVisits.length">
        <div class="summary-item">
          <span class="summary-label">Total de visitas:</span>
          <span class="summary-value">{{ filteredVisits.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Mostrando:</span>
          <span class="summary-value">
            {{ (currentPage - 1) * itemsPerPage + 1 }} - 
            {{ Math.min(currentPage * itemsPerPage, filteredVisits.length) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="selectedVisit" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalles de la Visita #{{ selectedVisit.id_visita }}</h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="modal-section">
            <h4>Información de la Visita</h4>
            <div class="info-grid">
              <div class="info-group">
                <label>ID de Visita:</label>
                <span>{{ selectedVisit.id_visita }}</span>
              </div>
              <div class="info-group">
                <label>Estado:</label>
                <span :class="['estado-badge', selectedVisit.estado]">
                  {{ capitalizeFirst(selectedVisit.estado) }}
                </span>
              </div>
              <div class="info-group">
                <label>Fecha:</label>
                <span>{{ formatDate(selectedVisit.fecha_visita) }}</span>
              </div>
              <div class="info-group">
                <label>Hora:</label>
                <span>{{ selectedVisit.hora_visita }}</span>
              </div>
              <div class="info-group">
                <label>Número de Visitantes:</label>
                <span>{{ selectedVisit.nro_visitantes }}</span>
              </div>
              <div class="info-group">
                <label>ID de Usuario:</label>
                <span>{{ selectedVisit.id_usuario }}</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h4>Información de la Entidad</h4>
            <div class="info-grid">
              <div class="info-group">
                <label>Tipo de Entidad:</label>
                <span>{{ selectedVisit.entidad }}</span>
              </div>
              <div class="info-group">
                <label>Nombre de la Entidad:</label>
                <span>{{ selectedVisit.nombre_entidad || 'No especificado' }}</span>
              </div>
              <div class="info-group">
                <label>Macrodistrito:</label>
                <span>{{ selectedVisit.macrodistrito || 'No especificado' }}</span>
              </div>
              <div class="info-group">
                <label>Dependencia:</label>
                <span>{{ selectedVisit.dependencia || 'No especificado' }}</span>
              </div>
              <div class="info-group">
                <label>Tipo de Institución:</label>
                <span>{{ selectedVisit.tipo_institucion || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h4>Información del Contacto</h4>
            <div class="info-grid">
              <div class="info-group">
                <label>Docente Responsable:</label>
                <span>{{ selectedVisit.docente_responsable || 'No especificado' }}</span>
              </div>
              <div class="info-group">
                <label>Cargo del Docente:</label>
                <span>{{ selectedVisit.cargo_docente || 'No especificado' }}</span>
              </div>
              <div class="info-group">
                <label>Teléfono de Contacto:</label>
                <span>{{ selectedVisit.telefono_contacto || 'No especificado' }}</span>
              </div>
              <div class="info-group">
                <label>Grado/Curso:</label>
                <span>{{ selectedVisit.grado_curso || 'No especificado' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <h4>Comentario Administrativo</h4>
            <textarea 
              v-model="selectedVisit.comentario" 
              @blur="updateComment(selectedVisit)"
              placeholder="Agregar comentario o notas adicionales"
              class="comentario-input"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <template v-if="selectedVisit.estado === 'pendiente'">
            <button 
              @click="updateVisitStatus(selectedVisit.id_visita, 'confirmada')"
              class="confirm-btn"
            >
              <i class="fas fa-check"></i> Confirmar Visita
            </button>
            <button 
              @click="updateVisitStatus(selectedVisit.id_visita, 'denegada')"
              class="deny-btn"
            >
              <i class="fas fa-times"></i> Denegar Visita
            </button>
          </template>
          <button 
            v-else
            @click="updateVisitStatus(selectedVisit.id_visita, 'pendiente')"
            class="reset-btn"
          >
            <i class="fas fa-undo"></i> Restablecer a Pendiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const visits = ref([]);
    const filteredVisits = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 6;
    const searchTerm = ref('');
    const currentFilter = ref('all');
    const isLoading = ref(false);
    const selectedVisit = ref(null);

    const statusFilters = [
      { value: 'all', label: 'Todas' },
      { value: 'pendiente', label: 'Pendientes' },
      { value: 'confirmada', label: 'Confirmadas' },
      { value: 'denegada', label: 'Denegadas' }
    ];
    const totalPages = computed(() => {
      if (!filteredVisits.value) return 0;
      return Math.ceil(filteredVisits.value.length / itemsPerPage);
    });

    const displayedPages = computed(() => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= totalPages.value; i++) {
        if (i === 1 || i === totalPages.value || 
            (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
          range.push(i);
        }
      }

      range.forEach(i => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      });

      return rangeWithDots;
    });

    const paginatedVisits = computed(() => {
      if (!filteredVisits.value) return [];
      
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredVisits.value.slice(start, end);
    });

    const getStatusCount = (status) => {
      if (!visits.value) return 0;
      if (status === 'all') return visits.value.length;
      return visits.value.filter(visit => visit.estado === status).length;
    };

    const filterVisits = () => {
      if (!visits.value) return;
      
      let filtered = [...visits.value];
      
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase();
        filtered = filtered.filter(visit => 
          visit.nombre_entidad?.toLowerCase().includes(term) ||
          visit.entidad.toLowerCase().includes(term) ||
          visit.docente_responsable?.toLowerCase().includes(term)
        );
      }

      if (currentFilter.value !== 'all') {
        filtered = filtered.filter(visit => visit.estado === currentFilter.value);
      }

      filteredVisits.value = filtered;
      currentPage.value = 1;
    };

    const filterByStatus = (status) => {
      currentFilter.value = status;
      filterVisits();
    };

    const openVisitModal = (visit) => {
      selectedVisit.value = { ...visit };
    };

    const closeModal = () => {
      selectedVisit.value = null;
    };

    const fetchVisits = async () => {
      isLoading.value = true;
      try {
        const response = await axios.get('http://localhost:7274/api/Visita');
        visits.value = response.data ?? [];
        filteredVisits.value = response.data ?? [];
      } catch (error) {
        console.error('Error fetching visits:', error);
        visits.value = [];
        filteredVisits.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const updateVisitStatus = async (visitId, newStatus) => {
      try {
        await axios.put(`http://localhost:7274/api/visita/updateStatus/${visitId}`, { 
          status: newStatus 
        });
        await fetchVisits();
        closeModal();
      } catch (error) {
        console.error('Error updating visit status:', error);
      }
    };

    const updateComment = async (visit) => {
      if (!visit) return;
      
      try {
        await axios.put(`http://localhost:7274/api/visita/${visit.id_visita}`, visit);
      } catch (error) {
        console.error('Error updating visit comment:', error);
      }
    };

    const capitalizeFirst = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Lifecycle hooks
    onMounted(fetchVisits);

    return {
      visits,
      filteredVisits,
      paginatedVisits,
      currentPage,
      totalPages,
      displayedPages,
      searchTerm,
      currentFilter,
      statusFilters,
      isLoading,
      selectedVisit,
      filterVisits,
      filterByStatus,
      getStatusCount,
      openVisitModal,
      closeModal,
      updateVisitStatus,
      updateComment,
      capitalizeFirst,
      formatDate
    };
  }
};
</script>

<style scoped>
.museo-container {
 max-width: 1200px;
 margin: 0 auto;
 padding: 2rem;
}

h2 {
 font-size: 2rem;
 color: #3D2B1F;
 text-align: center;
 margin-bottom: 2rem;
}

.filters-section {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 2rem;
 gap: 1rem;
 flex-wrap: wrap;
}

.search-box {
 flex: 1;
 min-width: 300px;
}

.search-box input {
 width: 100%;
 padding: 0.75rem;
 border: 1px solid #DEB887;
 border-radius: 6px;
 font-size: 1rem;
}

.filter-buttons {
 display: flex;
 gap: 0.5rem;
 flex-wrap: wrap;
}

.filter-btn {
 padding: 0.5rem 1rem;
 border: 1px solid #DEB887;
 border-radius: 4px;
 background: white;
 cursor: pointer;
 transition: all 0.3s ease;
}

.filter-btn.active {
 background: #3D2B1F;
 color: white;
}

.count-badge {
 background: #DEB887;
 padding: 0.2rem 0.5rem;
 border-radius: 999px;
 font-size: 0.8rem;
 margin-left: 0.5rem;
}

/* Grid de visitas */
.visitas-grid {
 display: grid;
 grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
 gap: 1.5rem;
 margin-bottom: 2rem;
}

.visita-card {
 background: white;
 border-radius: 8px;
 box-shadow: 0 2px 4px rgba(0,0,0,0.1);
 overflow: hidden;
 border: 1px solid #DEB887;
}

.card-header {
 padding: 1rem;
 background: #FAEBD7;
 display: flex;
 justify-content: space-between;
 align-items: center;
}

.estado-badge {
 padding: 0.4rem 0.8rem;
 border-radius: 999px;
 font-weight: 500;
 font-size: 0.875rem;
}

.pendiente .estado-badge {
 background: #FEF3C7;
 color: #92400E;
}

.confirmada .estado-badge {
 background: #D1FAE5;
 color: #065F46;
}

.denegada .estado-badge {
 background: #FEE2E2;
 color: #991B1B;
}

.visita-id {
 font-size: 0.875rem;
 color: #6B7280;
}

.card-content {
 padding: 1rem;
}

.basic-info {
 margin-bottom: 1rem;
}

.fecha-hora {
 display: flex;
 justify-content: space-between;
 margin-bottom: 0.75rem;
}

.info-group {
 margin-bottom: 0.5rem;
}

.info-group label {
 font-weight: 500;
 color: #6B7280;
 margin-right: 0.5rem;
}

.highlight {
 font-weight: bold;
 color: #3D2B1F;
}

.detailed-info {
 border-top: 1px solid #E5E7EB;
 margin-top: 1rem;
 padding-top: 1rem;
}

.section-title {
 display: flex;
 justify-content: space-between;
 align-items: center;
 cursor: pointer;
 padding: 0.5rem 0;
 color: #3D2B1F;
 font-weight: 500;
}

.info-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
 gap: 1rem;
 margin-top: 1rem;
}

.comentario-section {
 margin-top: 1rem;
 padding-top: 1rem;
 border-top: 1px solid #E5E7EB;
}

.comentario-input {
 width: 100%;
 padding: 0.75rem;
 border: 1px solid #DEB887;
 border-radius: 4px;
 margin-top: 0.5rem;
 resize: vertical;
}

.card-actions {
 padding: 1rem;
 border-top: 1px solid #E5E7EB;
 display: flex;
 gap: 0.5rem;
 justify-content: flex-end;
}

.confirm-btn, .deny-btn, .reset-btn {
 padding: 0.5rem 1rem;
 border: none;
 border-radius: 4px;
 cursor: pointer;
 font-weight: 500;
 display: flex;
 align-items: center;
 gap: 0.5rem;
 transition: all 0.3s ease;
}

.confirm-btn {
 background: #D1FAE5;
 color: #065F46;
}

.deny-btn {
 background: #FEE2E2;
 color: #991B1B;
}

.reset-btn {
 background: #E5E7EB;
 color: #374151;
}

.confirm-btn:hover, .deny-btn:hover, .reset-btn:hover {
 transform: translateY(-1px);
}

/* Paginación */
.pagination {
 display: flex;
 justify-content: center;
 align-items: center;
 gap: 1rem;
 margin-top: 2rem;
}

.pagination-btn {
 padding: 0.5rem 1rem;
 border: 1px solid #DEB887;
 border-radius: 4px;
 background: white;
 cursor: pointer;
}

.pagination-btn:disabled {
 opacity: 0.5;
 cursor: not-allowed;
}

.pagination-numbers {
 display: flex;
 gap: 0.5rem;
}

.page-number {
 padding: 0.5rem 1rem;
 border: 1px solid #DEB887;
 border-radius: 4px;
 background: white;
 cursor: pointer;
}

.page-number.active {
 background: #3D2B1F;
 color: white;
 border-color: #3D2B1F;
}

/* Resumen */
.visits-summary {
 display: flex;
 justify-content: space-between;
 margin-top: 1rem;
 padding: 1rem;
 background: #FAEBD7;
 border-radius: 6px;
}

.summary-item {
 font-size: 0.875rem;
}

.summary-label {
 color: #6B7280;
 margin-right: 0.5rem;
}

.summary-value {
 font-weight: 500;
 color: #3D2B1F;
}

/* Responsive */
@media (max-width: 768px) {
 .museo-container {
   padding: 1rem;
 }

 .visitas-grid {
   grid-template-columns: 1fr;
 }

 .filters-section {
   flex-direction: column;
 }

 .search-box {
   width: 100%;
 }

 .filter-buttons {
   width: 100%;
   justify-content: center;
 }

 .pagination {
   flex-direction: column;
   gap: 0.5rem;
 }
}

.no-results {
 grid-column: 1 / -1;
 text-align: center;
 padding: 2rem;
 background: #FAEBD7;
 border-radius: 8px;
 color: #3D2B1F;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-section {
  margin-bottom: 2rem;
}

.modal-section h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Estilos para la tarjeta simplificada */
.visita-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.visita-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Grid de información en el modal */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-group label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-group span {
  color: #2c3e50;
}

.confirm-btn,
.deny-btn,
.reset-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.confirm-btn {
  background-color: #4caf50;
  color: white;
}

.confirm-btn:hover {
  background-color: #45a049;
}

.deny-btn {
  background-color: #f44336;
  color: white;
}

.deny-btn:hover {
  background-color: #da190b;
}

.reset-btn {
  background-color: #607d8b;
  color: white;
}

.reset-btn:hover {
  background-color: #546e7a;
}

.comentario-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
  resize: vertical;
}

.comentario-input:focus {
  outline: none;
  border-color: #4caf50;
}

.estado-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.pendiente {
  background-color: #fff3cd;
  color: #856404;
}

.confirmada {
  background-color: #d4edda;
  color: #155724;
}

.denegada {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
  }
}
</style>