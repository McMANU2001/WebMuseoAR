<template>
  <div class="dashboard">
    <h2>BIENVENIDO</h2>
    <p>Desde aquí podrás gestionar los eventos, realizar el seguimiento de las visitas y proximamente ver estadisticas de satisfaccion del usuario.</p>
  </div>
</template>



<script setup>
  import { defineComponent } from 'vue';

  defineComponent({
    name: 'DashboardAdmin'
  });

</script>

<style scoped>
.dashboard {
  padding: 20px;
  text-align: center;
  background-color: #FAEBD7;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 20px auto;
}

h2 {
  color: #3D2B1F;
  margin-bottom: 20px;
}

p {
  color: #5D4037;
  font-size: 18px;
  line-height: 1.6;
}
</style>