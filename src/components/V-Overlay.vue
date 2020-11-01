<template>
  <transition name="fade" mode="in-out">
    <div v-show="show" class="overlay">
      <div class="overlay__inner">
        <div class="overlay__inner--circle"></div>
        <div class="overlay__inner--circle"></div>
        <div class="overlay__inner--circle"></div>
      </div>
    </div>
  </transition>
</template>

<script>
import gsap from 'gsap';
import { onMounted } from 'vue';

export default {
  name: 'Overlay',
  setup() {
    function loadingAnim() {
      gsap.to('.overlay__inner--circle', {
        stagger: {
          each: 0.2,
          yoyo: true,
          repeat: -1,
        },
        duration: 0.4,
        y: -25,
      });
    }

    onMounted(() => loadingAnim());
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: #eee;
  transition: all 200ms ease-in-out;
}

.overlay__inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2rem;
  justify-content: space-evenly;
}

.overlay__inner--circle {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  background: #18181e;
  opacity: 0.9;
  border-radius: 50%;
}
</style>
