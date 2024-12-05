<template>
  <div class="museum-container">
    <header class="museum-header" v-motion-slide-top :style="{ top: headerVisible ? '0' : '-100%' }">
      <div class="header-content">
        <h1>Museo de la Revolución Nacional</h1>

        <button class="menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="nav-container" :class="{ 'nav-active': isMobileMenuOpen }">
          <nav class="museum-nav">
            <ul>
              <li v-for="item in navItems" :key="item">
                <router-link 
                  :to="{ name: item }" 
                  :class="{ active: $route.name === item }"
                  @click="isMobileMenuOpen = false"
                >
                  {{ item }}
                </router-link>
              </li>
            </ul>
          </nav>
          
          <div class="auth-section">
            <div class="profile-dropdown">
              <img :src="profileImageUrl" alt="Perfil" @click="toggleProfileMenu" />
              <div v-if="profileMenuOpen" class="dropdown-menu">
                <template v-if="isAuthenticated">
                  <router-link to="/perfil" @click="isMobileMenuOpen = false">Perfil</router-link>
                  <template v-if="user?.rol === true">
                    <router-link to="/admin" @click="isMobileMenuOpen = false">Panel de administración</router-link>
                  </template>
                  <template v-if="user?.rol === false">
                    
                    <router-link to="/agendar-visita" @click="isMobileMenuOpen = false">Agendar Visita</router-link>
                  </template>
                  <button @click="handleLogout">Salir</button>
                </template>
                <template v-else>
                  <router-link to="/realidad-aumentada" @click="isMobileMenuOpen = false">Realidad Aumentada</router-link>
                  <router-link to="/login" @click="isMobileMenuOpen = false">Iniciar sesión</router-link>
                  <router-link to="/register" @click="isMobileMenuOpen = false">Registrarse</router-link>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main>
      <router-view v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <footer class="museum-footer" v-motion-slide-bottom>
      <p>&copy; {{ currentYear }} Museo de la Revolución Nacional</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { vMotionSlideTop, vMotionSlideBottom } from '@vueuse/motion'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import defaultProfileImage from '@/assets/fotoPerfil.png'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const navItems = ['Inicio', 'Acerca del museo', 'Eventos']
const currentYear = new Date().getFullYear()
const headerVisible = ref(true)
let lastScrollPosition = 0

const profileMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)

const profileImageUrl = computed(() => {
  return isAuthenticated.value && user.value?.profileImageUrl
    ? user.value.profileImageUrl
    : defaultProfileImage
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    profileMenuOpen.value = false
  }
}

const onScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
  if (currentScrollPosition < 0) return
  
  if (currentScrollPosition < lastScrollPosition) {
    headerVisible.value = true
  } else {
    headerVisible.value = false
    isMobileMenuOpen.value = false
  }
  lastScrollPosition = currentScrollPosition
}

const toggleProfileMenu = () => {
  profileMenuOpen.value = !profileMenuOpen.value
}

const handleLogout = () => {
  logout()
  profileMenuOpen.value = false
  isMobileMenuOpen.value = false
  router.push('/login')
}

watch(user, (newUser) => {
  if (newUser) {
    console.log('Usuario autenticado:', newUser)
  } else {
    console.log('Usuario desconectado')
  }
})

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Source+Sans+Pro:wght@400;600&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #FFF8DC;
  font-family: 'Source Sans Pro', sans-serif;
}

.museum-container {
  color: #3D2B1F;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.museum-header {
  background-color: #FAEBD7;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  transition: top 0.3s;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.museum-header h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  margin: 0;
  padding: 0.5rem 0;
  color: #3D2B1F;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: #3D2B1F;
  transition: all 0.3s ease;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.museum-nav ul {
  list-style-type: none;
  display: flex;
  gap: 1rem;
  padding: 0;
  margin: 0;
}

.museum-nav a {
  color: #3D2B1F;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.museum-nav a:hover, 
.museum-nav a.active {
  background-color: #DEB887;
  color: #FFF8DC;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.auth-section {
  display: flex;
  gap: 1rem;
}

.profile-dropdown {
  position: relative;
}

.profile-dropdown img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #FAEBD7;
  border: 1px solid #DEB887;
  border-radius: 4px;
  padding: 0.5rem;
  min-width: 150px;
  z-index: 1001;
}

.dropdown-menu a, 
.dropdown-menu button {
  display: block;
  padding: 0.5rem;
  text-decoration: none;
  color: #3D2B1F;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
}

.dropdown-menu a:hover, 
.dropdown-menu button:hover {
  background-color: #DEB887;
}

/* Mobile styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-container {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 250px;
    background-color: #FAEBD7;
    flex-direction: column;
    padding: 80px 20px 20px;
    transition: right 0.3s ease;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  }

  .nav-container.nav-active {
    right: 0;
  }

  .museum-nav ul {
    flex-direction: column;
    width: 100%;
  }

  .museum-nav a {
    display: block;
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .auth-section {
    margin-top: 2rem;
    width: 100%;
  }

  .profile-dropdown {
    width: 100%;
  }

  .dropdown-menu {
    position: static;
    width: 100%;
    box-sizing: border-box;
    margin-top: 1rem;
  }
}

main {
  flex-grow: 1;
  padding: 2rem;
  margin-top: 80px;
}

.museum-footer {
  background-color: #3D2B1F;
  color: #FFF8DC;
  text-align: center;
  padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>