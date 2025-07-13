<template>
  <div class="login-form__container">
    <Logo />
    <form class="login-form" @submit.prevent="onSubmit">
      <InputField
        id="email"
        label="Correo Electrónico"
        type="email"
        v-model="email"
        :error="emailError"
        autocomplete="email"
        autofocus
        inputmode="email"
      />
      <InputField
        id="password"
        label="Contraseña"
        type="password"
        v-model="password"
        :error="''"
        autocomplete="current-password"
        inputmode="password"
      />
      <Button type="submit">
        Iniciar Sesión
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Logo from '@/components/Logo/Logo.vue'
import InputField from '@/components/InputField/InputField.vue'
import Button from '@/components/Button/Button.vue'

const email = ref('')
const password = ref('')
const emailError = ref('')

function validarEmail(email: string) {
  // Simple regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function onSubmit() {
  emailError.value = ''
  if (!validarEmail(email.value)) {
    emailError.value = 'Correo electrónico no válido'
    return
  }
  // TODO: Autenticación real aquí
  // Por ahora, solo redirigir o mostrar éxito
  alert('¡Inicio de sesión exitoso!')
}
</script>

<style scoped lang="scss">
.login-form__container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--color-bg, #fff);
  transition: background 0.3s;
  padding: 2rem 0;
}

.login-form {
  width: 100%;
  max-width: 340px;
  background: var(--color-card, #fff);
  border-radius: 14px;
  box-shadow: 0 2px 24px 0 rgba(0,0,0,0.04);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 400px) {
  .login-form {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
  }
}
</style>
