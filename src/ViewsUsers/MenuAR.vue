<template>
    <div class="historical-tour">
      <div class="tour-header" v-motion-slide-top>
        <h2>Recorrido Histórico</h2>
        <p class="tour-intro">Explora la historia de Bolivia a través de sus personajes más emblemáticos</p>
      </div>
  
      <div class="timeline-container">
        <div class="timeline-navigation">
          <button 
            class="nav-button prev" 
            @click="prevCharacter"
            :disabled="currentIndex === 0"
            v-motion-slide-left
          >
            &#8592;
          </button>
  
          <div class="character-view" v-motion-fade>
            <div class="character-content">
              <div class="character-image">
                <img :src="currentCharacter.image" :alt="currentCharacter.name" />
              </div>
  
              <div class="character-info">
                <div class="character-header">
                  <h3>{{ currentCharacter.name }}</h3>
                  <span class="years">{{ currentCharacter.years }}</span>
                </div>
  
                <div class="character-description">
                  {{ currentCharacter.description }}
                </div>
  
                <a 
                  :href="currentCharacter.arLink" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ar-experience-button"
                >
                  Explorar en Realidad Aumentada
                </a>
              </div>
            </div>
          </div>
  
          <button 
            class="nav-button next" 
            @click="nextCharacter"
            :disabled="currentIndex === characters.length - 1"
            v-motion-slide-right
          >
            &#8594;
          </button>
        </div>
  
        <div class="timeline-progress">
          <div 
            v-for="(character, index) in characters" 
            :key="character.id"
            class="timeline-point"
            :class="{ active: index === currentIndex }"
            @click="goToCharacter(index)"
          >
            <div class="point-content">
              <img :src="character.image" :alt="character.name" class="point-image" />
              <span class="point-year">{{ character.years.split(' - ')[0] }}</span>
            </div>
          </div>
          <div class="timeline-line"></div>
        </div>
  
        <div v-if="currentIndex === characters.length - 1" class="feedback-section">
          <div v-if="showFeedbackForm" class="feedback-container" v-motion-slide-up>
            <h3 class="feedback-title">¡Gracias por completar el recorrido!</h3>
            <p class="feedback-subtitle">Nos gustaría conocer tu opinión sobre la experiencia en realidad aumentada</p>
            
            <form @submit.prevent="submitFeedback" class="feedback-form">
              <div class="rating-buttons">
                <button 
                  type="button"
                  :class="['reaction-button', { active: feedback.me_gusta }]"
                  @click="setRating(true)"
                >
                  <span class="icon">👍</span>
                  Me gustó
                </button>
                
                <button 
                  type="button"
                  :class="['reaction-button', { active: feedback.no_me_gusta }]"
                  @click="setRating(false)"
                >
                  <span class="icon">👎</span>
                  No me gustó
                </button>
              </div>
  
              <div class="form-group">
                <label for="comentario" class="form-label">Cuéntanos más sobre tu experiencia (opcional):</label>
                <textarea 
                  id="comentario"
                  v-model="feedback.comentario_extra"
                  rows="4"
                  class="form-textarea"
                  placeholder="Comparte tus comentarios, sugerencias o experiencia..."
                ></textarea>
              </div>
  
              <button type="submit" class="submit-button" :disabled="isSubmitting || !isRatingSelected">
                {{ isSubmitting ? 'Enviando...' : 'Enviar comentarios' }}
              </button>
            </form>
          </div>
  
          <div v-else class="feedback-container thank-you-message" v-motion-slide-up>
            <h3 class="feedback-title">¡Gracias por tu participación!</h3>
            <p class="feedback-subtitle">Ya has compartido tu opinión sobre la experiencia.</p>
            <div class="completion-message">
              <p>Tu feedback nos ayuda a mejorar la experiencia para todos los visitantes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { vMotionSlideTop, vMotionSlideLeft, vMotionSlideRight, vMotionFade, vMotionSlideUp } from '@vueuse/motion'
  import axios from 'axios'
  import avaroa from '@/assets/avaroa.jpg'
  import sucre from '@/assets/sucre.jpg'
  import padilla from '@/assets/padilla.png'
  import bolivar from '@/assets/bolivar.jpg'
  import estensoro from '@/assets/estensoro.jpg'
  import villaroel from '@/assets/villaroel.jpg'
  import bosco from '@/assets/bosco.jpg'
  import mendez from '@/assets/mendez.jpg'
  
  const currentIndex = ref(0)
  const isSubmitting = ref(false)
  const hasUserCommented = ref(false)
  
  const feedback = ref({
    me_gusta: null,
    no_me_gusta: null,
    comentario_extra: '',
    id_usuario: null
  })
  
  const characters = ref([
    {
      id: 1,
      name: "Eduardo Avaroa Hidalgo",
      years: "1838 - 1879",
      image: avaroa,
      description: "Héroe de la Guerra del Pacífico y defensor de Calama. Su valentía y patriotismo quedaron inmortalizados en la histórica frase '¿Rendirme yo? ¡Que se rinda su abuela, carajo!' antes de su muerte defendiendo el territorio boliviano.",
      arLink: "https://ar-2.vercel.app/"
    },
    {
      id: 2,
      name: "Mariscal Antonio Jose de Sucre",
      years: "1795 - 1830",
      image: sucre,
      description: "Prócer de la independencia americana y primer presidente de Bolivia. Lideró importantes batallas como Ayacucho y Pichincha, contribuyendo decisivamente a la independencia de varios países sudamericanos.",
      arLink: "https://josedesucre.vercel.app/"
    },
    {
      id: 3,
      name: "Juana Azurduy de Padilla",
      years: "1780 - 1862",
      image: padilla,
      description: "Heroína de la independencia de Bolivia y Alto Perú. Lideró guerrillas contra el ejército realista y fue nombrada Mariscala del ejército argentino por su valentía y liderazgo militar.",
      arLink: "https://juanapadilla.vercel.app/"
    },
    {
      id: 4,
      name: "Victor Paz Estensoro",
      years: "1907 - 2001",
      image: estensoro,
      description: "Líder de la Revolución Nacional de 1952, implementó el voto universal, la reforma agraria y la nacionalización de las minas. Fue presidente de Bolivia en cuatro ocasiones, transformando profundamente la sociedad boliviana.",
      arLink: "https://estensoro.vercel.app/"
    },
    {
      id: 5,
      name: "Eustaquio Méndez",
      years: "1784 - 1841",
      image: mendez,
      description: "Conocido como 'El Moto Méndez', fue un destacado guerrillero durante la guerra de independencia. Sus tácticas de guerra y su valentía fueron fundamentales en la lucha por la libertad de Bolivia.",
      arLink: "https://mendez.vercel.app/"
    },
    {
      id: 6,
      name: "Simón Bolívar",
      years: "1783 - 1830",
      image: bolivar,
      description: "El Libertador de América y primer presidente de Bolivia. Su visión de una América unida y sus campañas militares fueron decisivas para la independencia de varios países sudamericanos.",
      arLink: "https://bolivar-iota.vercel.app/"
    },
    {
      id: 7,
      name: "Don Bosco",
      years: "1815 - 1888",
      image: bosco,
      description: "Santo educador italiano que revolucionó la pedagogía. Su sistema preventivo y obra educativa tuvieron gran impacto en Bolivia, donde fundó numerosas instituciones educativas que continúan su legado.",
      arLink: "https://ar-4-eight.vercel.app/"
    },
    {
      id: 8,
      name: "Gualberto Villarroel",
      years: "1908 - 1946",
      image: villaroel,
      description: "Presidente de Bolivia que implementó importantes reformas sociales. Abolió el pongueaje, convocó el primer congreso indígena y promovió derechos laborales, antes de su trágico final en la Plaza Murillo.",
      arLink: "https://villaroel.vercel.app/"
    }
  ])
  
  const currentCharacter = computed(() => characters.value[currentIndex.value])
  const showFeedbackForm = computed(() => {
    return currentIndex.value === characters.value.length - 1 && !hasUserCommented.value
  })
  const isRatingSelected = computed(() => feedback.value.me_gusta !== null || feedback.value.no_me_gusta !== null)
  
  const checkUserComment = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) return
  
      const response = await axios.get(`http://localhost:7274/api/Comentarios/usuario/${user.id}`)
      if (response.data && response.data.length > 0) {
        hasUserCommented.value = true
      }
    } catch (error) {
      console.error('Error al verificar comentarios del usuario:', error)
    }
  }
  
  const nextCharacter = () => {
    if (currentIndex.value < characters.value.length - 1) {
      currentIndex.value++
    }
  }
  
  const prevCharacter = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
    }
  }
  
  const goToCharacter = (index) => {
    currentIndex.value = index
  }
  
  const setRating = (isLike) => {
    feedback.value.me_gusta = isLike
    feedback.value.no_me_gusta = !isLike
  }
  
  const submitFeedback = async () => {
    try {
      isSubmitting.value = true
      
      const user = JSON.parse(localStorage.getItem('user'))
      
      if (!user) {
        throw new Error('Usuario no autenticado')
      }
  
      feedback.value.id_usuario = user.id
  
      const response = await axios.post('http://localhost:7274/api/Comentarios', feedback.value)
  
      if (response.data) {
        alert('¡Gracias por tus comentarios!')
        hasUserCommented.value = true
        feedback.value = {
          me_gusta: null,
          no_me_gusta: null,
          comentario_extra: '',
          id_usuario: null
        }
      }
    } catch (error) {
      console.error('Error al enviar el feedback:', error)
      
      let errorMessage = 'Hubo un error al enviar tus comentarios.'
      if (error.message === 'Usuario no autenticado') {
        errorMessage = 'Debes iniciar sesión para enviar comentarios.'
      }
      
      alert(errorMessage)
    } finally {
      isSubmitting.value = false
    }
  }
  
  onMounted(() => {
    checkUserComment()
  })
  </script>
  
  <style scoped>
  .historical-tour {
    background-color: #FFF8DC;
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }
  
  .tour-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  
  .tour-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    color: #3D2B1F;
    margin-bottom: 1rem;
  }
  
  .tour-intro {
    color: #3D2B1F;
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .timeline-container {
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  
  .timeline-navigation {
    display: flex;
    align-items: center;
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .nav-button {
    background-color: #3D2B1F;
    color: #FFF8DC;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .nav-button:hover:not(:disabled) {
    background-color: #DEB887;
    transform: scale(1.1);
  }
  
  .nav-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .character-view {
    flex-grow: 1;
    background-color: #FAEBD7;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .character-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  .character-image {
    height: 500px;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .character-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .character-info {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
  
  .character-header {
    margin-bottom: 2rem;
  }
  
  .character-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: #3D2B1F;
    margin-bottom: 0.5rem;
  }
  
  .years {
    color: #666;
    font-size: 1.1rem;
  }
  
  .character-description {
    flex-grow: 1;
    line-height: 1.8;
    font-size: 1.1rem;
    color: #3D2B1F;
    margin-bottom: 2rem;
  }
  
  .ar-experience-button {
    background-color: #3D2B1F;
    color: #FFF8DC;
    padding: 1.2rem 2rem;
    border-radius: 30px;
    text-decoration: none;
    text-align: center;
    font-weight: bold;
    transition: all 0.3s ease;
    font-size: 1.1rem;
  }
  
  .ar-experience-button:hover {
    background-color: #DEB887;
    transform: translateY(-2px);
    color: #FFF8DC;
  }
  
  .timeline-progress {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 2rem 0;
    margin-top: 2rem;
  }
  
  .timeline-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #DEB887;
    z-index: 1;
  }
  
  .timeline-point {
    position: relative;
    z-index: 2;
    cursor: pointer;
  }
  
  .point-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .point-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #FFF8DC;
  transition: all 0.3s ease;
  object-fit: cover;
}

.timeline-point.active .point-image {
  border-color: #3D2B1F;
  transform: scale(1.2);
}

.point-year {
  font-size: 0.8rem;
  color: #3D2B1F;
}

.feedback-section {
  margin-top: 4rem;
  padding: 2rem;
}

.feedback-container {
  background-color: #FAEBD7;
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.feedback-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #3D2B1F;
  margin-bottom: 1rem;
  text-align: center;
}

.feedback-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.rating-buttons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.reaction-button {
  background-color: #FFF8DC;
  border: 2px solid #3D2B1F;
  border-radius: 15px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #3D2B1F;
}

.reaction-button:hover {
  background-color: #DEB887;
  color: #FFF8DC;
}

.reaction-button.active {
  background-color: #3D2B1F;
  color: #FFF8DC;
}

.icon {
  font-size: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #3D2B1F;
  font-size: 1.1rem;
  font-weight: 500;
}

.form-textarea {
  background-color: #FFF8DC;
  border: 2px solid #3D2B1F;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  color: #3D2B1F;
}

.form-textarea:focus {
  outline: none;
  border-color: #DEB887;
}

.submit-button {
  background-color: #3D2B1F;
  color: #FFF8DC;
  padding: 1.2rem 2rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.submit-button:hover:not(:disabled) {
  background-color: #DEB887;
  transform: translateY(-2px);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Estilos responsivos */
@media (max-width: 1024px) {
  .character-content {
    grid-template-columns: 1fr;
  }

  .character-image {
    height: 300px;
  }

  .feedback-container {
    margin: 0 1rem;
  }
}

@media (max-width: 768px) {
  .timeline-navigation {
    flex-direction: column;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .timeline-progress {
    overflow-x: auto;
    padding: 2rem 1rem;
  }

  .point-image {
    width: 40px;
    height: 40px;
  }

  .tour-header h2 {
    font-size: 2rem;
  }

  .feedback-title {
    font-size: 1.5rem;
  }

  .rating-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .reaction-button {
    width: 100%;
    justify-content: center;
  }

  .feedback-section {
    padding: 1rem;
  }

  .feedback-container {
    padding: 1.5rem;
  }

  .submit-button {
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .tour-header h2 {
    font-size: 1.8rem;
  }

  .tour-intro {
    font-size: 1rem;
  }

  .character-header h3 {
    font-size: 1.5rem;
  }

  .character-description {
    font-size: 1rem;
  }

  .feedback-subtitle {
    font-size: 1rem;
  }

  .form-textarea {
    min-height: 100px;
  }
}
</style>