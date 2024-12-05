<template>
  <div class="register-container">
    <h2>Registrarse</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="name">Nombre de Usuario</label>
        <input 
          type="text" 
          id="name" 
          v-model="name" 
          required
        >
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
        >
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <div class="password-input-container">
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password" 
            v-model="password"
            class="password-input"
            required
            @input="validatePassword"
          >
          <button 
            type="button" 
            @click="togglePasswordVisibility('password')" 
            class="toggle-password-btn"
          >
            <span class="icon">{{ showPassword ? '🙈' : '👁️' }}</span>
          </button>
        </div>
        <div v-if="passwordStrength" :class="['password-strength', passwordStrength]">
          Fortaleza de la contraseña: {{ passwordStrength }}
        </div>
        <ul v-if="password" class="password-requirements">
          <li :class="{ met: hasUpperCase }">Al menos una letra mayúscula</li>
          <li :class="{ met: hasLowerCase }">Al menos una letra minúscula</li>
          <li :class="{ met: hasNumber }">Al menos un número</li>
          <li :class="{ met: hasSpecialChar }">Al menos un carácter especial</li>
          <li :class="{ met: isLongEnough }">Al menos 8 caracteres</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña</label>
        <div class="password-input-container">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirmPassword" 
            v-model="confirmPassword"
            class="password-input"
            required
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

      <button type="submit" class="submit-btn" :disabled="!isFormValid">Registrarse</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineComponent } from 'vue';
import axios from 'axios';

defineComponent({
  name: 'RegisterForm'
});


const apiClient = axios.create({
  baseURL: 'http://localhost:7274',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const successMessage = ref('');
const emailError = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const hasUpperCase = ref(false);
const hasLowerCase = ref(false);
const hasNumber = ref(false);
const hasSpecialChar = ref(false);
const isLongEnough = ref(false);

const passwordStrength = computed(() => {
  const strength = [
    hasUpperCase.value, 
    hasLowerCase.value, 
    hasNumber.value, 
    hasSpecialChar.value, 
    isLongEnough.value
  ].filter(Boolean).length;
  
  if (strength === 5) return 'fuerte';
  if (strength >= 3) return 'media';
  if (strength > 0) return 'débil';
  return '';
});

const isFormValid = computed(() => {
  return name.value.length > 0 &&
         validateEmail(email.value) &&
         hasUpperCase.value &&
         hasLowerCase.value &&
         hasNumber.value &&
         hasSpecialChar.value &&
         isLongEnough.value &&
         password.value === confirmPassword.value;
});

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = () => {
  const passwordValue = password.value;
  hasUpperCase.value = /[A-Z]/.test(passwordValue);
  hasLowerCase.value = /[a-z]/.test(passwordValue);
  hasNumber.value = /[0-9]/.test(passwordValue);
  hasSpecialChar.value = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  isLongEnough.value = passwordValue.length >= 8;
};

// Funciones de utilidad
const togglePasswordVisibility = (field) => {
  if (field === 'password') {
    showPassword.value = !showPassword.value;
  } else if (field === 'confirm') {
    showConfirmPassword.value = !showConfirmPassword.value;
  }
};

const clearForm = () => {
  name.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  error.value = '';
  emailError.value = '';
};

watch(email, (newEmail) => {
  if (newEmail && !validateEmail(newEmail)) {
    emailError.value = 'Por favor, ingrese un correo electrónico válido.';
  } else {
    emailError.value = '';
  }
});

const handleRegister = async () => {
  error.value = '';
  successMessage.value = '';
  emailError.value = '';

  try {
    const response = await apiClient.post('/api/usuario/registro', {
      nombre_usuario: name.value,
      correo_electronico: email.value,
      contrasenia: password.value,
      rol: false
    });

    console.log('Respuesta del servidor:', response.data);
    successMessage.value = '¡Registro exitoso! Ya puedes iniciar sesión';
    clearForm();

  } catch (err) {
    console.error('Error al registrarse:', err);
    
    if (err.response) {
      switch (err.response.status) {
        case 409:
          emailError.value = 'Este correo electrónico ya está en uso';
          break;
        case 400:
          error.value = 'Datos de registro inválidos';
          break;
        case 500:
          error.value = 'Error en el servidor';
          break;
        default:
          error.value = err.response.data.message || 'Error al registrarse';
      }
    } else if (err.request) {
      error.value = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      error.value = 'Error al procesar la solicitud';
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #FAEBD7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  color: #3D2B1F;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  color: #3D2B1F;
  display: block;
  margin-bottom: 0.5rem;
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

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background-color: #DEB887;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #CD853F;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #D8000C;
  background-color: #FFD2D2;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.success-message {
  color: #4F8A10;
  background-color: #DFF2BF;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>