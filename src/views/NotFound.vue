<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="go-home">Go back to Home</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

h1 {
  font-size: 3rem;
  color: #e3342f;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 2rem;
  font-size: 1.25rem;
}

.go-home {
  color: #3490dc;
  text-decoration: underline;
  font-weight: bold;
}
</style>
