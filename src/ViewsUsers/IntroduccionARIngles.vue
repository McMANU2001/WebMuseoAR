<template>
    <div class="ar-introduction">
      <div class="navigation-buttons">
        <router-link to="/realidad-aumentada" class="nav-button">
          Cambiar a español
        </router-link>
      </div>
      
      <div class="ar-content">
        <section class="ar-welcome">
          <h2>Welcome to the Augmented Reality Experience</h2>
          <p>Get ready to immerse yourself in a unique experience where history comes to life through marker-based Augmented Reality technology.</p>
        </section>
  
        <section class="ar-description">
          <h3>What is marker-based Augmented Reality?</h3>
          <p>This technology allows you to visualize 3D digital content superimposed on the real world using your mobile device. Markers are special images that, when scanned with your camera, trigger the appearance of 3D historical characters, images, and audio.</p>
        </section>
  
        <section class="ar-guide">
          <h3>Quick User Guide</h3>
          <div class="guide-steps">
            <div class="step-card">
              <div class="step-number">1</div>
              <div class="step-icon">📱</div>
              <h4>Prepare your device</h4>
              <p>Make sure your device's camera is ready and allow the necessary permissions when requested.</p>
            </div>
  
            <div class="step-card">
              <div class="step-number">2</div>
              <div class="step-icon">🔍</div>
              <h4>Look for markers</h4>
              <p>You'll find special markers next to museum exhibits. These have a distinctive design and are clearly marked.</p>
            </div>
  
            <div class="step-card">
              <div class="step-number">3</div>
              <div class="step-icon">📸</div>
              <h4>Scan the marker</h4>
              <p>Point your camera at the marker and maintain a distance of 30-50 cm.</p>
            </div>
  
            <div class="step-card">
              <div class="step-number">4</div>
              <div class="step-icon">✨</div>
              <h4>Explore the content</h4>
              <p>Watch historical characters come to life. You can look around to better see the different objects.</p>
            </div>
          </div>
        </section>
  
        <section class="ar-tips">
          <h3>Tips for a better experience</h3>
          <ul>
            <li>Keep your device sufficiently charged</li>
            <li>Ensure you have internet connection</li>
            <li>Avoid covering the marker with shadows or reflections</li>
            <li>If content doesn't appear, try adjusting the distance or angle</li>
          </ul>
        </section>
  
        <div class="ar-start">
          <router-link to="/realidad-aumentada/personajes-ingles" class="start-button">
            NEXT
          </router-link>
        </div>
      </div>
    </div>
</template>
  
<script setup>
</script>
  
<style scoped>
.ar-introduction {
  background-color: #FFF8DC;
  min-height: 100vh;
  padding: 2rem 1rem;
  position: relative;
}

.navigation-buttons {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 100;
}

.nav-button {
  display: inline-block;
  background-color: #3D2B1F;
  color: #FFF8DC;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.nav-button:hover {
  background-color: #DEB887;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.ar-content {
  max-width: 1200px;
  margin: 0 auto;
  color: #3D2B1F;
  padding-top: 2rem; 
}

.ar-welcome {
  text-align: center;
  margin-bottom: 3rem;
}
  
.ar-welcome h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  color: #3D2B1F;
  margin-bottom: 1rem;
}
  
.ar-welcome p {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}
  
.ar-description, .ar-guide, .ar-tips {
  margin-bottom: 3rem;
}
  
h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  color: #3D2B1F;
  margin-bottom: 1.5rem;
}
  
.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
  
.step-card {
  background-color: #FAEBD7;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  position: relative;
  transition: transform 0.3s ease;
}
  
.step-card:hover {
  transform: translateY(-5px);
}
  
.step-number {
  position: absolute;
  top: -15px;
  left: -15px;
  background-color: #DEB887;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
  
.step-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
  
.step-card h4 {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #3D2B1F;
}
  
.ar-tips ul {
  list-style-type: none;
  padding: 0;
}
  
.ar-tips li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}
  
.ar-tips li::before {
  content: '•';
  color: #DEB887;
  font-size: 1.5rem;
  position: absolute;
  left: 0.5rem;
}
  
.ar-start {
  text-align: center;
  margin-top: 3rem;
}
  
.start-button {
  display: inline-block;
  background-color: #3D2B1F;
  color: #FFF8DC;
  padding: 1rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}
  
.start-button:hover {
  background-color: #DEB887;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
  
@media (max-width: 768px) {
  .ar-welcome h2 {
    font-size: 2rem;
  }
  
  .guide-steps {
    grid-template-columns: 1fr;
  }
  
  .step-card {
    margin-bottom: 2rem;
  }

  .nav-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>