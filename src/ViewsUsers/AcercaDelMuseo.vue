<template>
    <div class="acerca-del-museo">
      <h2 v-motion-slide-top>Acerca del Museo de la Revolución Nacional</h2>
      
      <div class="museo-historia" v-motion-slide-visible>
        <div class="imagen-museo">
          <img :src="fachadaMuseo" alt="Fachada del Museo de la Revolución Nacional" @error="handleImageError" />
        </div>
        <div class="texto-historia">
          <h3>Un legado del pasado para nuestro presente</h3>
          <p>Inaugurado el 23 de agosto de 1964 durante el tercer gobierno del Dr. Víctor Paz Estensorro, el Museo de la Revolución Nacional se erige como un testimonio arquitectónico y artístico de uno de los momentos más trascendentales de la historia boliviana: la Revolución de 1952.</p>
        </div>
      </div>
  
      <div class="murales-section" v-motion-slide-visible>
        <h3>Los Murales: Historia en Imágenes</h3>
        <div class="murales-gallery">
          <div class="mural-item" v-for="(mural, index) in murales" :key="index" @click="openMuralModal(mural)">
            <img :src="mural.imagen" :alt="mural.titulo" @error="handleImageError" />
            <div class="mural-info">
              <h4>{{ mural.titulo }}</h4>
              <p>{{ mural.artista }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <div class="salas-exposicion" v-motion-slide-visible>
        <h3>Salas de Exposición</h3>
        <div class="sala-cards">
          <div class="sala-card" v-for="(sala, index) in salas" :key="index" @click="toggleSalaInfo(index)">
            <h4>{{ sala.nombre }}</h4>
            <transition name="fade">
              <p v-if="sala.mostrarInfo">{{ sala.descripcion }}</p>
            </transition>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div v-if="muralModalVisible" class="mural-modal" @click="closeMuralModal">
          <div class="mural-modal-content" @click.stop>
            <img :src="selectedMural.imagen" :alt="selectedMural.titulo" />
            <h3>{{ selectedMural.titulo }}</h3>
            <p><strong>Artista:</strong> {{ selectedMural.artista }}</p>
            <p>{{ selectedMural.descripcion }}</p>
          </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { vMotionSlideTop, vMotionSlideVisible } from '@vueuse/motion'
  
  import fachadaMuseo from '@/assets/fachada-museo.jpg'
  import muralEducacion from '@/assets/mural-educacion-voto.jpg'
  import muralTriunfoPueblo from '@/assets/mural-triunfo-pueblo.jpg'
  import muralFuturoBolivia from '@/assets/mural-futuro-bolivia.jpg'
  
  const murales = ref([
    {
      titulo: "El Triunfo del Pueblo",
      artista: "Miguel Alandia Pantoja",
      imagen: muralTriunfoPueblo,
      descripcion: "Este impresionante mural muestra el triunfo del pueblo desde la larga historia colonial y republicana. Un gran cóndor derrota a las fuerzas de la reacción, simbolizando la liberación y el poder popular."
    },
    {
      titulo: "La Educación y el Voto Universal",
      artista: "Miguel Alandia Pantoja",
      imagen: muralEducacion,
      descripcion: "Este mural hace alusión a la educación con la emblemática mujer mestiza levantando una letra, y al voto universal, dos de los logros fundamentales de la Revolución de 1952."
    },
    {
      titulo: "El Futuro de Bolivia",
      artista: "Walter Solón Romero",
      imagen: muralFuturoBolivia,
      descripcion: "Solón muestra el futuro, la unidad del país en un baile celebratorio y la proyección al futuro representada por la minería y el petróleo."
    }
  ])
  
  const salas = ref([
    {
      nombre: "Sala de Murales",
      descripcion: "Además de los impresionantes murales, esta sala alberga una colección de herramientas utilizadas por los artistas y los restos de Miguel Alandia Pantoja. Los murales ofrecen una explicación visual de la historia de Bolivia, ideal para estudiantes.",
      mostrarInfo: false
    },
    {
      nombre: "Sala del Mausoleo",
      descripcion: "Aquí se encuentra la cripta con los restos del Presidente Juan José Torres y Juan Lechín, líder minero y gestor de la Revolución. También alberga las urnas simbólicas de Gualberto Villarroel y Germán Busch, junto con bustos de personalidades bolivianas destacadas.",
      mostrarInfo: false
    }
  ])
  
  const muralModalVisible = ref(false)
  const selectedMural = ref(null)
  
  const openMuralModal = (mural) => {
    selectedMural.value = mural
    muralModalVisible.value = true
  }
  
  const closeMuralModal = () => {
    muralModalVisible.value = false
  }
  
  const toggleSalaInfo = (index) => {
    salas.value[index].mostrarInfo = !salas.value[index].mostrarInfo
  }
  
  const handleImageError = (event) => {
    event.target.src = `/api/placeholder/${event.target.width}/${event.target.height}`
  }
  </script>
  
  <style scoped>
  .acerca-del-museo {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h2, h3 {
    font-family: 'Playfair Display', serif;
    color: #3D2B1F;
    text-align: center;
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
  
  .museo-historia {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .imagen-museo {
    flex: 1;
  }
  
  .imagen-museo img {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .texto-historia {
    flex: 1;
  }
  
  .murales-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .mural-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .mural-item:hover {
    transform: scale(1.05);
  }
  
  .mural-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .mural-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(61, 43, 31, 0.8);
    color: #FFF8DC;
    padding: 0.5rem;
  }
  
  .mural-info h4 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .mural-info p {
    margin: 0;
    font-size: 0.9rem;
  }
  
  .sala-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .sala-card {
    background-color: #FAEBD7;
    border: 1px solid #DEB887;
    border-radius: 8px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .sala-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .sala-card h4 {
    margin-top: 0;
    color: #3D2B1F;
    font-size: 1.5rem;
    text-align: center;
  }
  
  .mural-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .mural-modal-content {
    background: #FFF8DC;
    padding: 2rem;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }
  
  .mural-modal-content img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    margin-bottom: 1rem;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .museo-historia {
      flex-direction: column;
    }
    
    .horarios-info {
      flex-direction: column;
    }
  }
  </style>