<template>
  <div class="login-form__container">
    <Logo />
    <form class="login-form" @submit.prevent="onSubmit">
      <InputField
        id="email"
        label="Correo Electrónico"
        type="text"
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
        :error="passwordError"
        autocomplete="current-password"
        inputmode="password"
      />
      <Button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/components/Logo/Logo.vue'
import InputField from '@/components/InputField/InputField.vue'
import Button from '@/components/Button/Button.vue'
import { useAuth } from '@/services/auth'

const router = useRouter()
const { login } = useAuth()
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')
const isLoading = ref(false)

function validarEmail(email: string): string {
  if (!email) {
    return 'El correo electrónico es requerido'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return 'Formato de correo electrónico inválido'
  }
  return ''
}

function validarPassword(password: string): string {
  if (!password) {
    return 'La contraseña es requerida'
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres'
  }
  return ''
}

async function onSubmit() {
  const emailValidation = validarEmail(email.value)
  if (emailValidation) {
    emailError.value = emailValidation
    return
  }

  const passwordValidation = validarPassword(password.value)
  if (passwordValidation) {
    passwordError.value = passwordValidation
    return
  }

  try {
    isLoading.value = true
    await login({ email: email.value, password: password.value })
    router.push('/home')
  } catch (error) {
    emailError.value = 'Credenciales inválidas'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss">
.login-form__container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--color-bg);
  transition: background 0.3s;
  padding: 2rem 0;
}

.login-form {
  width: 100%;
  max-width: 340px;
  background: var(--color-card);
  color: var(--color-text);
  border-radius: 14px;
  box-shadow: 0 2px 24px 0 rgba(0,0,0,0.04);
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  // Always use theme variables for background, border, and text for dark mode support
}

.login-form label, .login-form input, .login-form button {
  color: var(--color-text);
  background: transparent;
}


@media (max-width: 400px) {
  .login-form {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
  }
}
</style>
