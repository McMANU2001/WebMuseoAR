<template>
    <div class="historical-tour">
      <div class="tour-header" v-motion-slide-top>
        <h2>Historical Tour</h2>
        <p class="tour-intro">Explore Bolivia's history through its most emblematic characters</p>
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
                  Explore in Augmented Reality
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
            <h3 class="feedback-title">Thank you for completing the tour!</h3>
            <p class="feedback-subtitle">We would love to hear your thoughts about the augmented reality experience</p>
            
            <form @submit.prevent="submitFeedback" class="feedback-form">
              <div class="rating-buttons">
                <button 
                  type="button"
                  :class="['reaction-button', { active: feedback.me_gusta }]"
                  @click="setRating(true)"
                >
                  <span class="icon">👍</span>
                  I liked it
                </button>
                
                <button 
                  type="button"
                  :class="['reaction-button', { active: feedback.no_me_gusta }]"
                  @click="setRating(false)"
                >
                  <span class="icon">👎</span>
                  I didn't like it
                </button>
              </div>
  
              <div class="form-group">
                <label for="comentario" class="form-label">Tell us more about your experience (optional):</label>
                <textarea 
                  id="comentario"
                  v-model="feedback.comentario_extra"
                  rows="4"
                  class="form-textarea"
                  placeholder="Share your comments, suggestions, or experience..."
                ></textarea>
              </div>
  
              <button type="submit" class="submit-button" :disabled="isSubmitting || !isRatingSelected">
                {{ isSubmitting ? 'Sending...' : 'Submit feedback' }}
              </button>
            </form>
          </div>
  
          <div v-else class="feedback-container thank-you-message" v-motion-slide-up>
            <h3 class="feedback-title">Thank you for your participation!</h3>
            <p class="feedback-subtitle">You have already shared your opinion about the experience.</p>
            <div class="completion-message">
              <p>Your feedback helps us improve the experience for all visitors.</p>
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
    description: "Hero of the Pacific War and defender of Calama. His courage and patriotism were immortalized in the historic phrase 'Surrender, me? Your grandmother should surrender, damn it!' before his death defending Bolivian territory.",
    arLink: "https://ar-2-avaroa-ingles.vercel.app/"
  },
  {
    id: 2,
    name: "Marshal Antonio Jose de Sucre",
    years: "1795 - 1830",
    image: sucre,
    description: "Hero of American independence and first president of Bolivia. He led important battles such as Ayacucho and Pichincha, contributing decisively to the independence of several South American countries.",
    arLink: "https://ar-8-sucre-ingles.vercel.app/"
  },
  {
    id: 3,
    name: "Juana Azurduy de Padilla",
    years: "1780 - 1862",
    image: padilla,
    description: "Heroine of the independence of Bolivia and Alto Peru. She led guerrillas against the royalist army and was named Marshal of the Argentine army for her bravery and military leadership.",
    arLink: "https://ar-9-juana-ingles.vercel.app/"
  },
  {
    id: 4,
    name: "Victor Paz Estensoro",
    years: "1907 - 2001",
    image: estensoro,
    description: "Leader of the 1952 National Revolution, he implemented universal suffrage, agrarian reform, and the nationalization of mines. He was president of Bolivia four times, profoundly transforming Bolivian society.",
    arLink: "https://ar-6-estenssoro-ingles.vercel.app/"
  },
  {
    id: 5,
    name: "Eustaquio Méndez",
    years: "1784 - 1841",
    image: mendez,
    description: "Known as 'El Moto Méndez', he was a prominent guerrilla fighter during the war of independence. His war tactics and bravery were fundamental in the fight for Bolivia's freedom.",
    arLink: "https://ar-5-mendez-ingles.vercel.app/"
  },
  {
    id: 6,
    name: "Simón Bolívar",
    years: "1783 - 1830",
    image: bolivar,
    description: "The Liberator of America and first president of Bolivia. His vision of a united America and his military campaigns were decisive for the independence of several South American countries.",
    arLink: "https://ar-7-bolivar-ingles.vercel.app/"
  },
  {
    id: 7,
    name: "Don Bosco",
    years: "1815 - 1888",
    image: bosco,
    description: "Italian educator saint who revolutionized pedagogy. His preventive system and educational work had a great impact in Bolivia, where he founded numerous educational institutions that continue his legacy.",
    arLink: "https://ar-4-bosco-ingles.vercel.app/"
  },
  {
    id: 8,
    name: "Gualberto Villarroel",
    years: "1908 - 1946",
    image: villaroel,
    description: "President of Bolivia who implemented important social reforms. He abolished pongueaje, convened the first indigenous congress and promoted labor rights, before his tragic end in Plaza Murillo.",
    arLink: "https://ar-3-villaroel-ingles.vercel.app/"
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
    console.error('Error checking user comments:', error)
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
      throw new Error('User not authenticated')
    }

    feedback.value.id_usuario = user.id

    const response = await axios.post('http://localhost:7274/api/Comentarios', feedback.value)

    if (response.data) {
      alert('Thank you for your feedback!')
      hasUserCommented.value = true
      feedback.value = {
        me_gusta: null,
        no_me_gusta: null,
        comentario_extra: '',
        id_usuario: null
      }
    }
  } catch (error) {
    console.error('Error submitting feedback:', error)
    
    let errorMessage = 'There was an error submitting your feedback.'
    if (error.message === 'User not authenticated') {
      errorMessage = 'You must be logged in to submit feedback.'
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