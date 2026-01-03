<template lang="pug">
.auth-dialog-overlay(
  v-if="!isAuthenticatedValue"
  class="page-protection"
)
  .auth-dialog
    h3.auth-dialog-title 🔒 {{ title }}
    p.auth-dialog-subtitle {{ subtitle }}
    input.auth-dialog-input(
      type="password"
      v-model="passwordInputValue"
      @keyup.enter="handleSubmit"
      :placeholder="placeholder"
      ref="inputRef"
    )
    p.auth-dialog-error(v-if="passwordErrorValue") {{ passwordErrorValue }}
    .auth-dialog-buttons
      button.auth-dialog-btn.auth-dialog-btn-submit(
        @click="handleSubmit"
        :disabled="!localPasswordInput || localPasswordInput.trim().length === 0"
      ) {{ submitText }}
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'

interface Props {
  isAuthenticated: boolean | { value: boolean }
  passwordInput: string | { value: string }
  passwordError: string | null | { value: string | null }
  passwordInputRef?: HTMLInputElement | null | { value: HTMLInputElement | null }
  title?: string
  subtitle?: string
  placeholder?: string
  submitText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '🔒 Protected Page',
  subtitle: 'Enter password to access this page',
  placeholder: 'Password',
  submitText: 'Access'
})

const emit = defineEmits<{
  'update:passwordInput': [value: string]
  submit: [password: string]
}>()

// Unwrap refs/computed if needed
const isAuthenticatedValue = computed(() => {
  const val = props.isAuthenticated
  // Handle ComputedRef, Ref, or plain boolean
  if (typeof val === 'object' && val !== null) {
    if ('value' in val) {
      return val.value
    }
    // If it's a computed ref, try to get value
    if (typeof val === 'function') {
      return val()
    }
  }
  return Boolean(val)
})

// Use a local ref for the input value to ensure reactivity
const localPasswordInput = ref('')

// Sync with prop when it changes
watch(() => props.passwordInput, (newVal) => {
  if (typeof newVal === 'object' && newVal !== null && 'value' in newVal) {
    const propValue = newVal.value || ''
    if (localPasswordInput.value !== propValue) {
      localPasswordInput.value = propValue
    }
  } else {
    const propValue = newVal || ''
    if (localPasswordInput.value !== propValue) {
      localPasswordInput.value = propValue
    }
  }
}, { immediate: true })

// Watch local changes and emit updates immediately
watch(localPasswordInput, (newVal) => {
  emit('update:passwordInput', newVal)
}, { immediate: false })

const passwordInputValue = localPasswordInput

const passwordErrorValue = computed(() => {
  const val = props.passwordError
  return typeof val === 'object' && 'value' in val ? val.value : val
})

const inputRef = ref<HTMLInputElement | null>(null)

// Handle submit - pass password directly in the event
const handleSubmit = () => {
  emit('update:passwordInput', localPasswordInput.value)
  emit('submit', localPasswordInput.value)
}

onMounted(() => {
  if (inputRef.value && !isAuthenticatedValue.value) {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  }
})
</script>

<style lang="stylus" scoped>
.auth-dialog-overlay
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.9)
  display flex
  justify-content center
  align-items center
  z-index 2000
  backdrop-filter blur(5px)
  
  &.page-protection
    z-index 2000

.auth-dialog
  background linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  border-radius 16px
  padding 2rem
  max-width 400px
  width 90%
  box-shadow 0 20px 60px rgba(0, 0, 0, 0.5)
  animation slideIn 0.3s ease-out

@keyframes slideIn
  from
    opacity 0
    transform translateY(-20px)
  to
    opacity 1
    transform translateY(0)

.auth-dialog-title
  font-size 1.5rem
  color #fff
  margin 0 0 0.5rem 0
  font-weight 600
  text-align center

.auth-dialog-subtitle
  font-size 0.9rem
  color rgba(255, 255, 255, 0.9)
  margin 0 0 1.5rem 0
  text-align center

.auth-dialog-input
  width 100%
  padding 0.75rem 1rem
  border 2px solid rgba(255, 255, 255, 0.3)
  border-radius 8px
  background rgba(255, 255, 255, 0.1)
  color #fff
  font-size 1rem
  margin-bottom 1rem
  outline none
  transition all 0.3s ease
  
  &::placeholder
    color rgba(255, 255, 255, 0.5)
  
  &:focus
    border-color rgba(255, 255, 255, 0.6)
    background rgba(255, 255, 255, 0.15)
  
  &[type="password"]
    font-family monospace
    letter-spacing 0.2em

.auth-dialog-error
  color rgba(255, 200, 200, 0.9)
  font-size 0.85rem
  margin -0.5rem 0 1rem 0
  text-align center
  min-height 1.2rem

.auth-dialog-buttons
  display flex
  gap 1rem
  margin-top 1rem

.auth-dialog-btn
  flex 1
  padding 0.75rem 1.5rem
  border none
  border-radius 8px
  font-size 1rem
  font-weight 600
  cursor pointer
  transition all 0.3s ease
  
  &:disabled
    opacity 0.5
    cursor not-allowed
  
  &:not(:disabled):hover
    transform translateY(-2px)
    box-shadow 0 4px 12px rgba(0, 0, 0, 0.3)

.auth-dialog-btn-submit
  background rgba(255, 255, 255, 0.9)
  color #667eea
  
  &:hover:not(:disabled)
    background #fff
</style>
