<template>
  <v-container class="fill-height" :class="{'pa-0' : $vuetify.display.mobile}">
    <div class="gradient-border">
      <div class="home-container">
        <div class="home-text-area d-flex flex-column justify-space-evenly">
          <div>
            <div class="text-body-2 mb-n1 text-primary">Welcome to</div>
            <h1 class="home-title text-secondary">Orbital<br/>Edge Imaging</h1>
          </div>
          <v-btn :to="{name:'Request'}"
          class="home-explore-btn" color="primary">
            Explore our products
          </v-btn>
        </div>
        <v-img src="@/assets/logo.png" class="home-logo-orbit"/>
      </div>
  </div>
  </v-container>
</template>

<script setup>
//
</script>
<style>
.gradient-border {
  position: relative;
  padding: 5px;
  background: #fff;
  border-radius: 50%;
  margin: 0 auto;
}
.gradient-border::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  margin: -5px;
  border-radius: inherit;
  background-image: linear-gradient(45deg, #840032 0%, #002642 50%, #840032 100%);
}
.home-container {
  background: white;
  position: relative;
  width: 60vw;
  height: 60vw;
  max-height: 60vh;
  max-width: 60vh;
  margin: 0 auto;
  border-radius: 50%;
  z-index: 2;
  padding: 5px;
}
.home-text-area {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50%;
}
.home-title {
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
}
.home-explore-btn {
  position: absolute;
  border: none;
  cursor: pointer;
  width: 90%;
}
.home-logo-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6vw;
  height: 6vw;
  max-height: 6vh;
  max-width: 6vh;
  margin-top: -3vw;
  margin-left: -3vw;
  animation: rotation 10s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg) translateX(15vw) rotate(0deg);
  }
  to {
    transform: rotate(1turn) translateX(15vw) rotate(-1turn);
  }
}
@media (max-width: 280px) {
  .home-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 550px) {
  .gradient-border {
    padding: 3px;
  }
  .home-container  {
    width: 85vw;
    height: 85vw;
    max-height: 85vh;
    max-width: 85vh;
  }
  .home-text-area {
    margin-left: 5%;
  }
  .home-logo-orbit {
    width: 15vw;
    height: 15vw;
  }

  @keyframes rotation {
  from {
    transform: rotate(0deg) translateX(45vw) rotate(0deg);
  }
  to {
    transform: rotate(1turn) translateX(45vw) rotate(-1turn);
  }
  }
}

@media (min-width: 760px) {
  .home-title {
    font-size: 2.5rem;
    font-weight: 900;
  }
  .home-text-area {
    width: 100%;
    padding-left: 10%;
    padding-right: 10%;
  }
}

@media (min-width: 760px) and (max-width: 1024px) {
  .home-container  {
    width: 80vw;
    height: 80vw;
    max-height: 80vh;
    max-width: 80vh;
  }
  .home-title {
    font-size: 3.2rem;
  }
  .home-logo-orbit {
    width: 14vw;
    height: 14vw;
  }
  @keyframes rotation {
  from {
    transform: rotate(0deg) translateX(42vw) rotate(0deg);
  }
  to {
    transform: rotate(1turn) translateX(42vw) rotate(-1turn);
  }
  }
}

@media (min-width: 1200px) and (max-width: 1280px) {
  @keyframes rotation {
  from {
    transform: rotate(0deg) translateX(19vw) rotate(0deg);
  }
  to {
    transform: rotate(1turn) translateX(19vw) rotate(-1turn);
  }
  }
}

@media (max-width: 1024px) {
  .home-logo-orbit {
    margin-top: -4vw;
    margin-left: -7vw;
  }
}
</style>
