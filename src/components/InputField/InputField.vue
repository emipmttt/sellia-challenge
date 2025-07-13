<template>
  <div class="input-field" :class="{ 'has-error': error, focused: isFocused }">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      :placeholder="label"
      v-model="modelValueProxy"
      @focus="isFocused = true"
      @blur="isFocused = false"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
    />
    <span v-if="error" class="error-message">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import './InputField.scss'

import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
  type: {
    type: String,
    default: 'text',
  },
  error: String,
  id: String,
  autocomplete: {
    type: String,
    default: '',
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['update:modelValue'])
const isFocused = ref(false)
const modelValueProxy = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>
