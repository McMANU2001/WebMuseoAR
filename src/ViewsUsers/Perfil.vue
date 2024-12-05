<template>
  <div class="profile-container">
    <h2>Mi Perfil</h2>
    
    <div v-if="!editMode" class="profile-view">
      <div class="info-group">
        <label>Nombre de Usuario</label>
        <p>{{ userData?.nombre_usuario || 'Cargando...' }}</p>
      </div>
      
      <div class="info-group">
        <label>Correo Electrónico</label>
        <p>{{ userData?.correo_electronico || 'Cargando...' }}</p>
      </div>
      
      <button @click="toggleEditMode" class="edit-button">Editar Perfil</button>
    </div>
    
    <form v-else @submit.prevent="updateProfile" class="profile-form">
      <div class="form-group">
        <label for="nombre">Nombre de Usuario</label>
        <input 
          id="nombre"
          v-model="editData.nombre_usuario"
          type="text"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="correo">Correo Electrónico</label>
        <input 
          id="correo"
          v-model="editData.correo_electronico"
          type="email"
          required
        >
      </div>
      
      <div class="password-section">
        <h3>Cambiar Contraseña</h3>
        <div class="form-group">
          <label for="currentPassword">Contraseña Actual</label>
          <div class="password-input-container">
            <input 
              id="currentPassword"
              v-model="editData.contrasenia_actual"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="password-input"
            >
            <button 
              type="button" 
              @click="togglePasswordVisibility('current')" 
              class="toggle-password-btn"
            >
              <span class="icon">{{ showCurrentPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <div class="password-input-container">
            <input 
              id="newPassword"
              v-model="editData.contrasenia_nueva"
              :type="showNewPassword ? 'text' : 'password'"
              @input="validatePassword"
              class="password-input"
            >
            <button 
              type="button" 
              @click="togglePasswordVisibility('new')" 
              class="toggle-password-btn"
            >
              <span class="icon">{{ showNewPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
          <div v-if="passwordStrength" :class="['password-strength', passwordStrength]">
            Fortaleza de la contraseña: {{ passwordStrength }}
          </div>
          <ul v-if="editData.contrasenia_nueva" class="password-requirements">
            <li :class="{ met: hasUpperCase }">Al menos una letra mayúscula</li>
            <li :class="{ met: hasLowerCase }">Al menos una letra minúscula</li>
            <li :class="{ met: hasNumber }">Al menos un número</li>
            <li :class="{ met: hasSpecialChar }">Al menos un carácter especial</li>
            <li :class="{ met: isLongEnough }">Al menos 8 caracteres</li>
          </ul>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Nueva Contraseña</label>
          <div class="password-input-container">
            <input 
              id="confirmPassword"
              v-model="editData.confirmar_contrasenia"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="password-input"
            >
            <button 
              type="button" 
              @click="togglePasswordVisibility('confirm')" 
              class="toggle-password-btn"
            >
              <span class="icon">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div class="button-group">
        <button type="submit" class="update-button" :disabled="!isPasswordValid">Guardar Cambios</button>
        <button type="button" @click="cancelEdit" class="cancel-button">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent } from 'vue'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'

defineComponent({
  name: 'PerfilForm'
})

const { user } = useAuth()
const editMode = ref(false)
const userData = ref(null)
const editData = ref({
  nombre_usuario: '',
  correo_electronico: '',
  contrasenia_actual: '',
  contrasenia_nueva: '',
  confirmar_contrasenia: ''
})

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const hasUpperCase = ref(false)
const hasLowerCase = ref(false)
const hasNumber = ref(false)
const hasSpecialChar = ref(false)
const isLongEnough = ref(false)

const passwordStrength = computed(() => {
  const strength = [hasUpperCase.value, hasLowerCase.value, hasNumber.value, hasSpecialChar.value, isLongEnough.value].filter(Boolean).length
  if (strength === 5) return 'fuerte'
  if (strength >= 3) return 'media'
  if (strength > 0) return 'débil'
  return ''
})

const isPasswordValid = computed(() => {
  return hasUpperCase.value && hasLowerCase.value && hasNumber.value && hasSpecialChar.value && isLongEnough.value &&
         editData.value.contrasenia_nueva === editData.value.confirmar_contrasenia
})

onMounted(async () => {
  await fetchUserData()
})

const fetchUserData = async () => {
  try {
    const response = await axios.get('http://localhost:7274/api/usuario')
    const users = response.data
    const currentUser = users.find(u => u.id_usuario === user.value?.id)
    if (currentUser) {
      userData.value = currentUser
    } else {
      console.error('User not found in the response')
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error)
  }
}

const toggleEditMode = () => {
  editMode.value = true
  editData.value = {
    nombre_usuario: userData.value?.nombre_usuario || '',
    correo_electronico: userData.value?.correo_electronico || '',
    contrasenia_actual: '',
    contrasenia_nueva: '',
    confirmar_contrasenia: ''
  }
}

const cancelEdit = () => {
  editMode.value = false
}

const togglePasswordVisibility = (field) => {
  switch (field) {
    case 'current':
      showCurrentPassword.value = !showCurrentPassword.value
      break
    case 'new':
      showNewPassword.value = !showNewPassword.value
      break
    case 'confirm':
      showConfirmPassword.value = !showConfirmPassword.value
      break
  }
}

const validatePassword = () => {
  const password = editData.value.contrasenia_nueva
  hasUpperCase.value = /[A-Z]/.test(password)
  hasLowerCase.value = /[a-z]/.test(password)
  hasNumber.value = /[0-9]/.test(password)
  hasSpecialChar.value = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  isLongEnough.value = password.length >= 8
}

const updateProfile = async () => {
  if (editData.value.contrasenia_nueva && !isPasswordValid.value) {
    alert('Por favor, asegúrese de que la nueva contraseña cumpla con todos los requisitos y que ambas contraseñas coincidan.')
    return
  }

  try {
    const updateData = {
      id_usuario: user.value.id,
      nombre_usuario: editData.value.nombre_usuario,
      correo_electronico: editData.value.correo_electronico,
    }

    if (editData.value.contrasenia_actual && editData.value.contrasenia_nueva) {
      updateData.contrasenia_actual = editData.value.contrasenia_actual
      updateData.contrasenia_nueva = editData.value.contrasenia_nueva
    }

    const response = await axios.put(`http://localhost:7274/api/usuario/${user.value.id}`, updateData)
    
    if (response.status === 200) {
      alert('Perfil actualizado exitosamente')
      userData.value = {
        ...userData.value,
        nombre_usuario: editData.value.nombre_usuario,
        correo_electronico: editData.value.correo_electronico
      }
      const updatedUser = {
        ...user.value,
        userName: editData.value.nombre_usuario
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      editMode.value = false
    }
  } catch (error) {
    console.error('Error al actualizar el perfil:', error)
    alert('Error al actualizar el perfil: ' + error.response?.data || error.message)
  }
}
</script>
  
<style scoped>
.profile-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  color: #3D2B1F;
  margin-bottom: 2rem;
}

.info-group, .form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  color: #3D2B1F;
  display: block;
  margin-bottom: 0.5rem;
}

.info-group p {
  padding: 0.75rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin: 0;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #DEB887;
  border-radius: 4px;
  font-size: 1rem;
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 40px;
}

.toggle-password-btn {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #8B4513;
}

.toggle-password-btn:hover {
  color: #A0522D;
}

.icon {
  font-size: 1.2rem;
}

.password-section {
  margin-top: 2rem;
  border-top: 1px solid #DEB887;
  padding-top: 1rem;
}

.password-requirements {
  list-style: none;
  padding-left: 0;
  margin-top: 0.5rem;
}

.password-requirements li {
  color: #666;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.password-requirements li::before {
  content: '✖';
  color: #dc3545;
  margin-right: 0.5rem;
}

.password-requirements li.met::before {
  content: '✓';
  color: #28a745;
}

.password-strength {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.password-strength.débil {
  color: #dc3545;
  background-color: #f8d7da;
}

.password-strength.media {
  color: #856404;
  background-color: #fff3cd;
}

.password-strength.fuerte {
  color: #155724;
  background-color: #d4edda;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.edit-button, .update-button, .cancel-button {
  padding: 1rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.edit-button, .update-button {
  background-color: #DEB887;
  color: white;
  border: none;
}

.cancel-button {
  background-color: #f5f5f5;
  color: #3D2B1F;
  border: 1px solid #DEB887;
}

.edit-button:hover, .update-button:hover {
  background-color: #CD853F;
}

.cancel-button:hover {
  background-color: #e5e5e5;
}

.update-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>