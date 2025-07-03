<script setup>
import { ref, onMounted } from 'vue'

const fireflyStyle = ref({})

onMounted(() => {
  const steps = 4
  const scale = 0.5 + Math.random() * 0.5
  const duration = 20 + Math.random() * 10
  const delay = Math.random() * 5
  const name = `move-${Math.random().toString(36).substring(2, 8)}`
  let keyframes = `@keyframes ${name} {\n`

  for (let i = 0; i <= steps; i++) {
    const percent = (i / steps) * 100
    const x = Math.random() * 50 - 25 // -25vw to +25vw
    const y = Math.random() * 50 - 25 // -25vh to +25vh
    const rotate = Math.random() * 60 // less rotation
    keyframes += `  ${percent}% {
      transform: translate(${x}vw, ${y}vh) scale(${scale}) rotate(${rotate}deg);
    }\n`
  }
  keyframes += `}`

  const styleSheet = document.styleSheets[0]
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length)

  const startTop = Math.random() * 100
  const startLeft = Math.random() * 100

  fireflyStyle.value = {
    top: `${startTop}%`,
    left: `${startLeft}%`,
    animation: `${name} ${duration}s ease-in-out ${delay}s infinite`,
  }
})
</script>

<template>
  <div class="firefly" :style="fireflyStyle"></div>
</template>

<style scoped>
.firefly {
  position: absolute;
  width: 0.4vw;
  height: 0.4vw;
  pointer-events: none;
  z-index: 0;
}

.firefly::before,
.firefly::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform-origin: -10vw;
}

.firefly::before {
  background: black;
  opacity: 0.3;
  animation: drift 25s linear infinite;
}

.firefly::after {
  opacity: 0;
  animation:
    drift 25s linear infinite,
    flash 4s ease-in-out infinite;
}

@keyframes drift {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes flash {
  0%,
  30%,
  100% {
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
}
</style>
