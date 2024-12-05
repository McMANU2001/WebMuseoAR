<template> 
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
        >
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
          >
          <button 
            type="button" 
            @click="togglePasswordVisibility" 
            class="toggle-password-btn"
          >
            <span class="icon">{{ showPassword ? '🙈' : '👁️' }}</span>
          </button>
        </div>
      </div>
      <button type="submit" class="submit-btn">Iniciar Sesión</button>
    </form>
    <p v-if="message" :class="{'success-message': isSuccess, 'error-message': !isSuccess}">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuth } from '@/composables/useAuth';

defineComponent({
  name: 'LoginForm'
});

const router = useRouter();
const { login, user } = useAuth();
const email = ref('');
const password = ref('');
const message = ref('');
const isSuccess = ref(false);
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:7274/api/usuario/login', {
      correo_electronico: email.value,
      contrasenia: password.value,
    });

    if (response.data.success) {
      isSuccess.value = true;
      const userData = {
        id: response.data.userId,
        userName: response.data.userName,
        rol: response.data.rol
      };
      
      await login({
        correo_electronico: email.value,
        contrasenia: password.value,
      });

      user.value = userData;

      if (userData.rol) {
        message.value = `Inicio de sesión exitoso como administrador. Bienvenido, ${userData.userName}!`;
        setTimeout(() => {
          router.push({ name: 'admin' });
          setTimeout(() => {
            window.location.reload();
          }, 500); 
        }, 1500);
      } else {
        message.value = `Inicio de sesión exitoso como usuario. Bienvenido, ${userData.userName}!`;
        setTimeout(() => {
          router.push({ name: 'user' });
          setTimeout(() => {
            window.location.reload();
          }, 500); 
        }, 1500);
      }
    } else {
      isSuccess.value = false;
      message.value = 'Credenciales inválidas';
    }
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    isSuccess.value = false;
    message.value = 'Error al iniciar sesión. Por favor, inténtelo de nuevo.';
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #FAEBD7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  color: #3D2B1F;
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #3D2B1F;
  font-weight: 600;
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

.success-message {
  color: #4F8A10;
  background-color: #DFF2BF;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.error-message {
  color: #D8000C;
  background-color: #FFD2D2;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 1rem;
}
</style>