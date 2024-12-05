<template>
  <div class="museo-container">

    <div class="inicio-section">
      <h2 v-motion-slide-top>Bienvenidos al Museo de la Revolución Nacional</h2>
      
      <div class="carousel" v-motion-slide-visible>
        <swiper :modules="modules" :pagination="{ clickable: true }" :navigation="true" :autoplay="{ delay: 3000 }">
          <swiper-slide v-for="(imagen, index) in imagenes" :key="index">
            <img :src="imagen.src" :alt="imagen.alt" />
          </swiper-slide>
        </swiper>
      </div>
      
      <section class="featured-exhibits" v-motion-slide-visible>
        <h3>Información Destacada</h3>
        <div class="exhibit-list">
          <div v-for="exhibit in featuredExhibits" :key="exhibit.id" class="exhibit-card"
               v-motion-slide-visible-once>
            <div class="icon" v-html="exhibit.icon"></div>
            <h4>{{ exhibit.title }}</h4>
            <p>{{ exhibit.description }}</p>
            <a href="#" class="view-more">Ver más →</a>
          </div>
        </div>
      </section>

      <section class="location" v-motion-slide-visible>
        <h3>Ubicación</h3>
        <div class="location-content">
          <div class="map">
            <img src="@/assets/mapa.png" alt="Mapa de ubicación del museo" />
          </div>
          <div class="address">
            <h4>Dirección</h4>
            <p>El Museo de la Revolución Nacional se encuentra en La Paz-Bolivia en la zona de alto miraflores final de la avenidad Busch.</p>
            <h4>Cómo llegar</h4>
            <p>Para llegar al museo se puede tomar como referencia la linea naranja y blanca del teleferico que se encuentra en la misma plaza de donde se encuentra el museo.</p>
          </div>
        </div>
      </section>
      
      <div class="horarios-visita" v-motion-slide-visible>
        <h3>Horarios y Tarifas</h3>
        <div class="horarios-info">
          <div class="horarios">
            <h4>Horario de atención:</h4>
            <p>Martes a viernes: 09:00 - 12:30 y 14:30 - 19:00</p>
            <p>Sábado: 09:00 - 17:00 (horario continuo)</p>
          </div>
          <div class="tarifas">
            <h4>Tarifas:</h4>
            <ul>
              <li>Profesores: Bs 1</li>
              <li>Adultos (18-60 años): Bs 3</li>
              <li>Extranjeros: Bs 5</li>
              <li>Adultos mayores y estudiantes: Gratuito</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { vMotionSlideTop, vMotionSlideVisible, vMotionSlideVisibleOnce } from '@vueuse/motion'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation, Autoplay, Zoom } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/zoom'

import imagenMuseo1 from '@/assets/FotoMuseo.jpg'
import imagenMuseo2 from '@/assets/exterior.jpg'
import imagenMuseo3 from '@/assets/interior.jpg'

const modules = [Pagination, Navigation, Autoplay, Zoom]

const imagenes = ref([
  { src: imagenMuseo1, alt: "Fachada del Museo de la Revolución Nacional" },
  { src: imagenMuseo2, alt: "Vista exterior del Museo" },
  { src: imagenMuseo3, alt: "Interior del Museo" }
])

const featuredExhibits = ref([
  { 
    id: 1, 
    title: 'La Revolución de 1952', 
    icon: '🏴', 
    description: 'Explora los eventos clave que dieron forma a la Revolución Nacional de Bolivia.' 
  },
  { 
    id: 2, 
    title: 'Líderes Revolucionarios', 
    icon: '👥', 
    description: 'Conoce a las figuras icónicas que lideraron el movimiento revolucionario.' 
  },
  { 
    id: 3, 
    title: 'Impacto Social y Económico', 
    icon: '📊', 
    description: 'Analiza las transformaciones sociales y económicas resultantes de la revolución.' 
  }
])
</script>

<style scoped>
.museo-container {
  position: relative;
}

.auth-buttons {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
}

.login-button, .register-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button {
  background-color: #DEB887;
  color: #FFF8DC;
}

.register-button {
  background-color: #3D2B1F;
  color: #FFF8DC;
}

.login-button:hover, .register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.inicio-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h2, h3 {
  font-family: 'Playfair Display', serif;
  text-align: center;
  color: #3D2B1F;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

h3 {
  font-size: 2rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.carousel {
  margin: 2rem 0;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
  height: 700px; 
}

.swiper {
  height: 100%;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.swiper-zoom-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.featured-exhibits {
  margin-top: 3rem;
}

.exhibit-list {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
}

.exhibit-card {
  background-color: #FAEBD7;
  border: 1px solid #DEB887;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  flex: 1;
  transition: all 0.3s ease;
}

.exhibit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h4 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: #3D2B1F;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  color: #5D4037;
  margin-bottom: 1.5rem;
}

.view-more {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #DEB887;
  color: #FFF8DC;
  text-decoration: none;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.view-more:hover {
  background-color: #3D2B1F;
  transform: translateY(-2px);
}

.location {
  margin-top: 3rem;
}

.horarios-visita {
  background-color: #FAEBD7;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 3rem;
}
  
.horarios-info {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
}
  
.horarios, .tarifas {
  flex: 1;
}
  
.horarios h4, .tarifas h4 {
  color: #3D2B1F;
  margin-bottom: 1rem;
}
  
.tarifas ul {
  list-style-type: none;
  padding: 0;
}
  
.tarifas li {
   margin-bottom: 0.5rem;
}

.location-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.map {
  flex: 1;
}

.map img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.address {
  flex: 1;
}

.address h4 {
  margin-top: 0;
}

@media (max-width: 768px) {
  .exhibit-list, .location-content {
    flex-direction: column;
  }
  
  .exhibit-card, .map, .address {
    margin-bottom: 1rem;
  }

  .auth-buttons {
    position: static;
    justify-content: center;
    margin-bottom: 1rem;
  }
}
</style>