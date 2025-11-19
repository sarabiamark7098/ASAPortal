<template>
  <div class="snowflake" :style="flakeStyle"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const flakeStyle = ref({})

onMounted(() => {
  const size = Math.random() * 5 + 2 // 2px to 7px
  const left = Math.random() * 100
  const duration = 6 + Math.random() * 4
  const delay = Math.random() * 5
  const drift = Math.random() * 50 - 25

  const animationName = `fall-${Math.random().toString(36).substring(2, 8)}`
  const keyframes = `
    @keyframes ${animationName} {
      0% {
        transform: translateX(0) translateY(0);
        background-color: #0b77e3;
        opacity: 1;
      }
      100% {
        transform: translateX(${drift}px) translateY(100vh);
        background-color: #0b77e3;
        opacity: 0.3;
      }
    }
  `

  const styleTag = document.createElement('style')
  styleTag.innerHTML = keyframes
  document.head.appendChild(styleTag)

  flakeStyle.value = {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    animation: `${animationName} ${duration}s linear ${delay}s infinite`,
  }
})
</script>

<!-- Scoped style for base snowflake -->
<style scoped>
.snowflake {
  position: absolute;
  top: -10px;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(0.5px);
}
</style>
