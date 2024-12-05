import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import profileImage from '@/assets/fotoPerfil.png';

export function useAuth() {
  const router = useRouter();
  const user = ref(JSON.parse(localStorage.getItem('user')));
  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:7274/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      if (data.success) {
        user.value = {
          id: data.userId,
          userName: data.userName,
          rol: data.rol,
          profileImageUrl: profileImage
        };
        localStorage.setItem('user', JSON.stringify(user.value));
      } else {
        throw new Error('Invalid credentials');
      }

      return user.value;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
    router.push('/');
  };

  return {
    user,
    isAuthenticated,
    login,
    logout
  };
}
