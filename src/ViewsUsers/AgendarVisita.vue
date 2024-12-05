
<template>
  <div class="agendar-visita-container">
    <h2>Agendar Visita</h2>
    
    <div v-if="notification.show" :class="['notification', notification.type]">
      {{ notification.message }}
      <button class="notification-close" @click="closeNotification">&times;</button>
    </div>

    <div v-if="visitaPendiente" class="status-section">
      <div class="status-container">
        <div class="status-header">
          <h3>Estado de su Solicitud Actual</h3>
          <span :class="['status-badge', visitaPendiente.estado.toLowerCase()]">
            {{ visitaPendiente.estado }}
          </span>
        </div>
        <div class="status-details">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Fecha:</span>
              <span class="value">{{ visitaPendiente.fecha_visita }}</span>
            </div>
            <div class="info-item">
              <span class="label">Hora:</span>
              <span class="value">{{ visitaPendiente.hora_visita }}</span>
            </div>
            <div class="info-item">
              <span class="label">Visitantes:</span>
              <span class="value">{{ visitaPendiente.nro_visitantes }}</span>
            </div>
            <div class="info-item">
              <span class="label">Tipo:</span>
              <span class="value">{{ visitaPendiente.entidad }}</span>
            </div>
          </div>

          <div class="status-message" v-if="visitaPendiente.estado === 'Pendiente'">
            <p>Su solicitud está siendo revisada. Por favor, espere la confirmación.</p>
          </div>
          <div class="status-message success" v-else-if="visitaPendiente.estado === 'Confirmada'">
            <p>¡Su visita ha sido confirmada! Lo esperamos en la fecha y hora indicada.</p>
          </div>
          <div class="status-message error" v-else-if="visitaPendiente.estado === 'Denegada'">
            <p>Lo sentimos, su solicitud no pudo ser procesada. Puede intentar agendar una nueva visita.</p>
          </div>
        </div>
      </div>

      <div v-if="visitaPendiente.estado !== 'Pendiente'" class="new-request-section">
        <button 
          @click="initializeNewRequest" 
          class="new-request-btn"
        >
          Agendar Nueva Visita
        </button>
      </div>
    </div>

    <form 
      v-if="!visitaPendiente || visitaPendiente.estado === 'Denegada' || visitaPendiente.estado === 'Confirmada'" 
      @submit.prevent="submitForm" 
      :class="{ 'form-disabled': isSubmitting }"
    >
      <div v-if="isSubmitting" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Procesando su solicitud...</p>
      </div>

      <div class="form-group">
        <label for="fecha_visita">Fecha de Visita:</label>
        <input 
          type="date" 
          id="fecha_visita" 
          v-model="visita.fecha_visita" 
          :min="getCurrentDate()"
          @change="validateDateTime"
          required
        >
        <span class="error-message" v-if="errors.fecha">{{ errors.fecha }}</span>
      </div>
      
      <div class="form-group">
        <label for="hora_visita">Hora de Visita:</label>
        <input 
          type="time" 
          id="hora_visita" 
          v-model="visita.hora_visita"
          @change="validateDateTime"
          required
        >
        <span class="error-message" v-if="errors.hora">{{ errors.hora }}</span>
      </div>
      
      <div class="form-group">
        <label for="nro_visitantes">Número de Visitantes:</label>
        <input 
          type="number" 
          id="nro_visitantes" 
          v-model="visita.nro_visitantes" 
          required 
          min="1"
          max="50"
        >
        <span class="helper-text">Máximo 50 visitantes por grupo</span>
      </div>
      
      <div class="form-group">
        <label for="entidad">Tipo de Visitante:</label>
        <select id="entidad" v-model="visita.entidad" required @change="resetInstitucionFields">
          <option value="Particular">Particular</option>
          <option value="Institución">Unidad Educativa</option>
        </select>
      </div>
      
      <div v-if="visita.entidad === 'Institución'" class="institucion-fields">
        <div class="form-group">
          <label for="macrodistrito">Macrodistrito:</label>
          <select id="macrodistrito" v-model="visita.macrodistrito" required>
            <option value="">Seleccione el macrodistrito</option>
            <option value="Cotahuma">Cotahuma</option>
            <option value="Max Paredes">Max Paredes</option>
            <option value="Periférica">Periférica</option>
            <option value="San Antonio">San Antonio</option>
            <option value="Sur">Sur</option>
            <option value="Mallasa">Mallasa</option>
            <option value="Centro">Centro</option>
            <option value="Hampaturi">Hampaturi</option>
            <option value="Zongo">Zongo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="dependencia">Dependencia:</label>
          <select id="dependencia" v-model="visita.dependencia" required>
            <option value="">Seleccione la dependencia</option>
            <option value="Fiscal">Fiscal</option>
            <option value="Privado">Privado</option>
            <option value="Convenio">Convenio</option>
          </select>
        </div>

        <div class="form-group">
          <label for="tipo_institucion">Nivel de Unidad Educativa:</label>
          <select id="tipo_institucion" v-model="visita.tipo_institucion" required>
            <option value="">Seleccione el nivel</option>
            <option value="Inicial">Inicial</option>
            <option value="Primaria">Primaria</option>
            <option value="Secundaria">Secundaria</option>
            <option value="Alternativa">Educación Alternativa</option>
            <option value="Superior">Educación Superior</option>
          </select>
        </div>

        <div class="form-group">
          <label for="nombre_entidad">Nombre de la Unidad Educativa:</label>
          <input 
            type="text" 
            id="nombre_entidad" 
            v-model="visita.nombre_entidad" 
            required
            placeholder="Ejemplo: Unidad Educativa San Andrés"
          >
        </div>

        <div class="form-group">
          <label for="docente_responsable">Docente Responsable:</label>
          <input 
            type="text" 
            id="docente_responsable" 
            v-model="visita.docente_responsable"
            required
            placeholder="Nombre completo del docente"
          >
        </div>

        <div class="form-group">
          <label for="cargo_docente">Cargo del Docente:</label>
          <select id="cargo_docente" v-model="visita.cargo_docente" required>
            <option value="">Seleccione el cargo</option>
            <option value="Director">Director/a</option>
            <option value="Profesor">Profesor/a</option>
            <option value="Regente">Regente</option>
            <option value="Coordinador">Coordinador/a</option>
          </select>
        </div>

        <div class="form-group">
          <label for="telefono_contacto">Teléfono de Contacto:</label>
          <input 
            type="tel" 
            id="telefono_contacto" 
            v-model="visita.telefono_contacto"
            required
            pattern="[0-9]{8}"
            placeholder="Ejemplo: 22334455"
            @input="validatePhone"
          >
          <span class="error-message" v-if="errors.telefono">{{ errors.telefono }}</span>
          <span class="helper-text">Número fijo de La Paz o celular sin código de país</span>
        </div>

        <div class="form-group">
          <label for="grado_curso">Grado o Curso:</label>
          <input 
            type="text" 
            id="grado_curso" 
            v-model="visita.grado_curso"
            required
            placeholder="Ejemplo: 6to de Primaria"
          >
        </div>
      </div>
      
      <div class="form-group">
        <label for="comentario">Objetivo de la Visita:</label>
        <textarea 
          id="comentario" 
          v-model="visita.comentario" 
          rows="3"
          :placeholder="getComentarioPlaceholder()"
          required
        ></textarea>
      </div>

      <button 
        type="submit" 
        class="submit-btn" 
        :disabled="hasErrors || !isFormValid || isSubmitting"
      >
        {{ isSubmitting ? 'Enviando solicitud...' : 'Agendar Visita' }}
      </button>
    </form>

    <!-- Horarios de atención -->
    <div class="horario-info">
      <h3>Horario de atención:</h3>
      <p>Martes a viernes: 09:00 - 12:30 y 14:30 - 19:00</p>
      <p>Sábado: 09:00 - 17:00 (horario continuo)</p>
      <p class="notice">Domingo y Lunes: Cerrado</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const { user } = useAuth()
const isSubmitting = ref(false)
const visitaPendiente = ref(null)

const checkVisitaPendiente = async () => {
  try {
    const response = await axios.get(`http://localhost:7274/api/Visita/user/${user.value?.id}`)
    const visitas = response.data
    const ultimaVisita = visitas.find(v => v.estado === 'Pendiente') || 
                        visitas[visitas.length - 1]
    
    if (ultimaVisita) {
      visitaPendiente.value = ultimaVisita
    }
  } catch (error) {
    console.error('Error al verificar visitas pendientes:', error)
  }
}

onMounted(() => {
  checkVisitaPendiente()
})

const visita = ref({
  fecha_visita: '',
  hora_visita: '',
  nro_visitantes: 1,
  estado: 'Pendiente',
  entidad: 'Particular',
  nombre_entidad: '',
  macrodistrito: '',
  dependencia: '',
  tipo_institucion: '',
  docente_responsable: '',
  cargo_docente: '',
  telefono_contacto: '',
  grado_curso: '',
  comentario: '',
  id_usuario: user.value?.id
})

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const errors = ref({
  fecha: '',
  hora: '',
  telefono: ''
})

const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '')
})

const isFormValid = computed(() => {
  if (visita.value.entidad === 'Institución') {
    return visita.value.fecha_visita && 
           visita.value.hora_visita && 
           visita.value.nro_visitantes > 0 &&
           visita.value.macrodistrito &&
           visita.value.dependencia &&
           visita.value.tipo_institucion &&
           visita.value.nombre_entidad &&
           visita.value.docente_responsable &&
           visita.value.cargo_docente &&
           visita.value.telefono_contacto &&
           visita.value.grado_curso &&
           visita.value.comentario
  } else {
    return visita.value.fecha_visita && 
           visita.value.hora_visita && 
           visita.value.nro_visitantes > 0 &&
           visita.value.comentario
  }
})

const initializeNewRequest = () => {
  visitaPendiente.value = null
  visita.value = {
    fecha_visita: '',
    hora_visita: '',
    nro_visitantes: 1,
    estado: 'Pendiente',
    entidad: 'Particular',
    nombre_entidad: '',
    macrodistrito: '',
    dependencia: '',
    tipo_institucion: '',
    docente_responsable: '',
    cargo_docente: '',
    telefono_contacto: '',
    grado_curso: '',
    comentario: '',
    id_usuario: user.value?.id
  }
}

const resetInstitucionFields = () => {
  if (visita.value.entidad !== 'Institución') {
    visita.value.macrodistrito = ''
    visita.value.dependencia = ''
    visita.value.tipo_institucion = ''
    visita.value.nombre_entidad = ''
    visita.value.docente_responsable = ''
    visita.value.cargo_docente = ''
    visita.value.telefono_contacto = ''
    visita.value.grado_curso = ''
  }
}

const validatePhone = () => {
  errors.value.telefono = ''
  const phoneRegex = /^[0-9]{8}$/
  if (visita.value.telefono_contacto && !phoneRegex.test(visita.value.telefono_contacto)) {
    errors.value.telefono = 'El teléfono debe contener 8 dígitos numéricos'
  }
}

const getComentarioPlaceholder = () => {
  if (visita.value.entidad === 'Institución') {
    return 'Describa el objetivo pedagógico de la visita y cualquier requerimiento especial'
  }
  return 'Ingrese cualquier comentario o requerimiento especial'
}
const validateDateTime = () => {
  errors.value = { fecha: '', hora: '' }
  
  if (visita.value.fecha_visita) {
    if (new Date(visita.value.fecha_visita) < new Date(getCurrentDate())) {
      errors.value.fecha = 'La fecha no puede ser anterior a hoy'
      return
    }

    const selectedDate = new Date(visita.value.fecha_visita)
    const day = selectedDate.getDay()
    
    switch(day) {
      case -1:
        errors.value.fecha = 'El museo no atiende los domingos'
        return
      case 0:
        errors.value.fecha = 'El museo no atiende los lunes'
        return
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break
      default:
        errors.value.fecha = 'El museo no atiende los domingos'
        return
    }

    if (visita.value.hora_visita) {
      if (!isWithinBusinessHours(visita.value.hora_visita, visita.value.fecha_visita)) {
        if (day === 6) {
          errors.value.hora = `El sábado el horario es de ${horarios.sabado.continuo.inicio} a ${horarios.sabado.continuo.fin}`
        } else {
          errors.value.hora = `El horario entre semana es de ${horarios.semana.manana.inicio} a ${horarios.semana.manana.fin} y de ${horarios.semana.tarde.inicio} a ${horarios.semana.tarde.fin}`
        }
      }
    }
  }
}

const horarios = {
  semana: {
    manana: { inicio: '09:00', fin: '12:30' },
    tarde: { inicio: '14:30', fin: '19:00' }
  },
  sabado: {
    continuo: { inicio: '09:00', fin: '17:00' }
  }
}

const getCurrentDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

const isWithinBusinessHours = (time, date) => {
  const day = new Date(date).getDay()
  const timeInMinutes = parseTimeToMinutes(time)

  if (day === 6) { 
    const inicioSabado = parseTimeToMinutes(horarios.sabado.continuo.inicio)
    const finSabado = parseTimeToMinutes(horarios.sabado.continuo.fin)
    return timeInMinutes >= inicioSabado && timeInMinutes <= finSabado
  } else { 
    const inicioManana = parseTimeToMinutes(horarios.semana.manana.inicio)
    const finManana = parseTimeToMinutes(horarios.semana.manana.fin)
    const inicioTarde = parseTimeToMinutes(horarios.semana.tarde.inicio)
    const finTarde = parseTimeToMinutes(horarios.semana.tarde.fin)
    
    return (timeInMinutes >= inicioManana && timeInMinutes <= finManana) ||
           (timeInMinutes >= inicioTarde && timeInMinutes <= finTarde)
  }
}

const showNotification = (message, type = 'success') => {
  notification.value = {
    show: true,
    message,
    type
  }
  setTimeout(() => {
    closeNotification()
  }, 5000)
}

const closeNotification = () => {
  notification.value.show = false
}

const submitForm = async () => {
  validateDateTime()
  validatePhone()
  
  if (hasErrors.value || !isFormValid.value) {
    return
  }

  if (visitaPendiente.value && visitaPendiente.value.estado === 'Pendiente') {
    showNotification('Ya tiene una solicitud de visita pendiente', 'error')
    return
  }

  isSubmitting.value = true

  const visitaData = {
    fecha_visita: visita.value.fecha_visita,
    hora_visita: visita.value.hora_visita,
    nro_visitantes: parseInt(visita.value.nro_visitantes),
    entidad: visita.value.entidad,
    comentario: visita.value.comentario,
    estado: 'Pendiente',
    id_usuario: user.value?.id
  }

  if (visita.value.entidad === 'Institución') {
    Object.assign(visitaData, {
      nombre_entidad: visita.value.nombre_entidad,
      macrodistrito: visita.value.macrodistrito,
      dependencia: visita.value.dependencia,
      tipo_institucion: visita.value.tipo_institucion,
      docente_responsable: visita.value.docente_responsable,
      cargo_docente: visita.value.cargo_docente,
      telefono_contacto: visita.value.telefono_contacto.toString(),
      grado_curso: visita.value.grado_curso
    })
  }

  try {
    const response = await axios.post('http://localhost:7274/api/Visita', visitaData)
    
    if (response.data) {
      showNotification('Su solicitud ha sido enviada y está pendiente de aprobación', 'success')
      await checkVisitaPendiente()
      
      visita.value = {
        fecha_visita: '',
        hora_visita: '',
        nro_visitantes: 1,
        estado: 'Pendiente',
        entidad: 'Particular',
        nombre_entidad: '',
        macrodistrito: '',
        dependencia: '',
        tipo_institucion: '',
        docente_responsable: '',
        cargo_docente: '',
        telefono_contacto: '',
        grado_curso: '',
        comentario: '',
        id_usuario: user.value?.id
      }
    }
  } catch (error) {
    console.error('Datos enviados:', visitaData)
    console.error('Error completo:', error.response?.data || error)
    
    let errorMessage = 'Error al enviar la solicitud'

    if (error.response) {
      if (error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        errorMessage = Object.values(errors).join('. ')
      } else {
        errorMessage = error.response.data.message || 'Error al procesar la solicitud'
      }
    }

    showNotification(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
<style scoped>
.agendar-visita-container {
  max-width: 600px; 
  margin: 2rem auto; 
  padding: 2rem;
  background-color: #FAEBD7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
}

.notification {
  position: relative;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.notification.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.notification-close {
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: inherit;
  padding: 0 0.5rem;
}

h2 {
  color: #3D2B1F; 
  text-align: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3D2B1F;
  font-weight: 500;
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #DEB887;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3D2B1F;
  box-shadow: 0 0 0 2px rgba(61, 43, 31, 0.1);
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #3D2B1F;
  color: #FFF;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2A1E16;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.helper-text {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.institucion-fields {
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  margin: 1rem 0;
}

.horario-info {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #DEB887;
}

.horario-info h3 {
  color: #3D2B1F;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.horario-info p {
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.horario-info .notice {
  color: #dc3545;
  font-weight: 500;
}
</style>