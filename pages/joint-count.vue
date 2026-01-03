<template lang="pug">
section.joint-count-page
  // Page Protection Dialog - using global composable
  PageAuthDialog(
    :is-authenticated="isPageAuthenticated"
    v-model:password-input="pageAuth.passwordInput"
    :password-error="pageAuth.passwordError"
    :password-input-ref="pageAuth.passwordInputRef"
    title="🔒 Protected Page"
    subtitle="Enter password to access joint count"
    @submit="handlePageAuthSubmit"
  )
  
  // Main Content - only shown when authenticated
  .container(v-if="isPageAuthenticated")
    .image-container(
      :class="{ loading: isLoading }"
      @click="incrementCount"
    )
      img.joint-image(
        src="/joint.png"
        alt="Joint"
      )
    
    .counter-section
      p.counter-label
        span.counter-text joint smoked: 
        span.counter-number(:class="{ loading: isLoading }") {{ totalJoints }}

      p.api-error(v-if="apiError") {{ apiError }}
      p.api-loading(v-if="isLoading") ⏳ Loading...
    
    .date-section
      p.current-date {{ currentDate }}
    
    .stats-section
      h3.stats-title Stats for Nerds
      .stats-content
        .stats-grid
          .stat-group
            h4.stats-subtitle 🔥 Essentials
            p.stat-item
              span.label ⏱️ Last joint:
              span.value {{ timeSinceLastJoint }}
            p.stat-item
              span.label 📊 Avg/day:
              span.value {{ averagePerDay.toFixed(2) }}
            p.stat-item
              span.label 📅 Days:
              span.value {{ daysSinceStart }}
            p.stat-item
              span.label 🗓️ Started:
              span.value {{ startDate }}
          
          .stat-group
            h4.stats-subtitle ⚡ Recent Activity
            p.stat-item
              span.label 1h:
              span.value {{ averageLastHour.toFixed(2) }}
            p.stat-item
              span.label 6h:
              span.value {{ averageLast6Hours.toFixed(2) }}
            p.stat-item
              span.label 12h:
              span.value {{ averageLast12Hours.toFixed(2) }}
            p.stat-item
              span.label 48h:
              span.value {{ averageLast48Hours.toFixed(2) }}
          
          .stat-group
            h4.stats-subtitle 📈 Long Term Avg
            p.stat-item
              span.label Daily:
              span.value {{ averageLast24Hours.toFixed(2) }}
            p.stat-item
              span.label Week:
              span.value {{ averageLastWeek.toFixed(2) }}
            p.stat-item
              span.label Month:
              span.value {{ averageLastMonth.toFixed(2) }}
            p.stat-item
              span.label Year:
              span.value {{ averageLastYear.toFixed(2) }}
  
  // Increment Authentication Dialog
  .auth-dialog-overlay(
    v-if="showAuthDialog && isPageAuthenticated"
    @click.self="closeAuthDialog"
  )
    .auth-dialog
      form(@submit.prevent="handlePasswordSubmit")
        h3.auth-dialog-title 🔒 Authentication Required
        p.auth-dialog-subtitle Enter password to increment count
        input.auth-dialog-input(
          type="password"
          v-model="passwordInput"
          @keyup.enter="handlePasswordSubmit"
          placeholder="Password"
          ref="passwordInputRef"
        )
        p.auth-dialog-error(v-if="passwordError") {{ passwordError }}
        .auth-dialog-buttons
          button.auth-dialog-btn.auth-dialog-btn-cancel(
            type="button"
            @click="closeAuthDialog"
          ) Cancel
          button.auth-dialog-btn.auth-dialog-btn-submit(
            type="submit"
            :disabled="!passwordInput"
          ) Confirm
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { getJointCount, incrementJointCount, updateJointCount } from '../utils/joint-count-api'
import { usePageAuth } from '../composables/usePageAuth'

// URL da API Lambda
const API_URL = 'https://zx8085f2yg.execute-api.us-east-1.amazonaws.com/dev'

const totalJoints = ref(0)
const startDate = ref('')
const lastUpdatedAt = ref<string | null>(null)
const currentDate = ref('')
const isLoading = ref(false)
const apiError = ref<string | null>(null)
const useApi = ref(true) // Sempre usar API

// Page Protection - using global composable
const pageAuth = usePageAuth({
  sessionKey: 'jointCount_page_auth'
})

// Create a computed for template reactivity
const isPageAuthenticated = computed(() => pageAuth.isAuthenticated.value)

// Increment Authentication
const showAuthDialog = ref(false)
const passwordInput = ref('')
const passwordError = ref<string | null>(null)
const passwordInputRef = ref<HTMLInputElement | null>(null)

// Password for increment - ONLY uses JOINT_COUNT_PASSWORD
// This is separate from GRIPP_LINK_DEFAULT_PASSWD which is only for page authentication
const config = useRuntimeConfig()
const ADMIN_PASSWORD = config.public.jointCountPassword || 'gripp2026!'

// Computed properties
const daysSinceStart = computed(() => {
  if (!startDate.value) return 0
  const start = new Date(startDate.value)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1 // Prevents division by zero
})

const averagePerDay = computed(() => {
  if (daysSinceStart.value === 0) return 0
  return totalJoints.value / daysSinceStart.value
})

// Tempo desde o último joint
const timeSinceLastJoint = computed(() => {
  if (!lastUpdatedAt.value) return 'N/A'
  const last = new Date(lastUpdatedAt.value)
  const now = new Date()
  const diffMs = now.getTime() - last.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h ${diffMinutes % 60}m`
  if (diffHours > 0) return `${diffHours}h ${diffMinutes % 60}m`
  if (diffMinutes > 0) return `${diffMinutes}m ${diffSeconds % 60}s`
  return `${diffSeconds}s`
})

// Função auxiliar para calcular média estimada por período
const estimatedAverageForPeriod = (hours: number): number => {
  if (totalJoints.value === 0 || !lastUpdatedAt.value) return 0
  
  const now = new Date()
  const periodStart = new Date(now.getTime() - hours * 60 * 60 * 1000)
  const start = new Date(startDate.value)
  
  // Se o período é maior que o tempo desde o início, usar média geral
  if (periodStart < start) {
    const totalHours = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
    return totalHours > 0 ? (totalJoints.value / totalHours) * hours : 0
  }
  
  // Estimar baseado na distribuição uniforme desde o início
  const totalHours = (now.getTime() - start.getTime()) / (1000 * 60 * 60)
  if (totalHours === 0) return 0
  
  // Assumir distribuição uniforme e calcular proporção do período
  const ratePerHour = totalJoints.value / totalHours
  return ratePerHour * hours
}

// Médias por período
const averageLastHour = computed(() => estimatedAverageForPeriod(1))
const averageLast6Hours = computed(() => estimatedAverageForPeriod(6))
const averageLast12Hours = computed(() => estimatedAverageForPeriod(12))
const averageLast24Hours = computed(() => estimatedAverageForPeriod(24))
const averageLast48Hours = computed(() => estimatedAverageForPeriod(48))
const averageLastWeek = computed(() => estimatedAverageForPeriod(24 * 7))
const averageLastMonth = computed(() => estimatedAverageForPeriod(24 * 30))
const averageLastYear = computed(() => estimatedAverageForPeriod(24 * 365))

// Funções
const updateCurrentDate = () => {
  const now = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  currentDate.value = now.toLocaleDateString('en-US', options)
}

const openAuthDialog = () => {
  showAuthDialog.value = true
  passwordInput.value = ''
  passwordError.value = null
  // Focus on input after dialog appears
  setTimeout(() => {
    passwordInputRef.value?.focus()
  }, 100)
}

const closeAuthDialog = () => {
  showAuthDialog.value = false
  passwordInput.value = ''
  passwordError.value = null
}

const handlePasswordSubmit = async () => {
  if (!passwordInput.value) {
    passwordError.value = 'Please enter password'
    return
  }

  if (passwordInput.value !== ADMIN_PASSWORD) {
    passwordError.value = 'Incorrect password'
    passwordInput.value = ''
    setTimeout(() => {
      passwordInputRef.value?.focus()
    }, 100)
    return
  }

  // Correct password, close dialog and increment
  closeAuthDialog()
  await performIncrement()
}

const performIncrement = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  apiError.value = null

  try {
    const result = await incrementJointCount('default', API_URL)
    
    totalJoints.value = result.totalJoints || 0
    if (result.startDate) {
      startDate.value = result.startDate
    }
    if (result.updatedAt) {
      lastUpdatedAt.value = result.updatedAt
    }
    
    apiError.value = null
  } catch (error: any) {
    console.error('Error incrementing count:', error)
    const errorMessage = error?.message || 'Unknown error'
    apiError.value = `Error saving: ${errorMessage}. Using local storage.`
    
    totalJoints.value++
    saveToLocalStorage()
  } finally {
    isLoading.value = false
  }
}

const incrementCount = () => {
  // Open authentication dialog instead of incrementing directly
  openAuthDialog()
}

const loadJointCount = async () => {
  isLoading.value = true
  apiError.value = null

  try {
    const result = await getJointCount('default', API_URL)
    
    totalJoints.value = result.totalJoints || 0
    startDate.value = result.startDate || new Date().toISOString().split('T')[0]
    lastUpdatedAt.value = result.updatedAt || null
    
    if (!result.startDate || result.totalJoints === 0) {
      const today = new Date().toISOString().split('T')[0]
      if (result.startDate !== today) {
        await updateJointCount({
          userId: 'default',
          totalJoints: result.totalJoints,
          startDate: startDate.value
        }, API_URL)
      }
    }
    
    apiError.value = null
  } catch (error: any) {
    console.error('Error loading count:', error)
    const errorMessage = error?.message || 'Unknown error'
    apiError.value = `Error loading: ${errorMessage}. Using local storage.`
    
    loadFromLocalStorage()
  } finally {
    isLoading.value = false
  }
}

const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const savedTotal = localStorage.getItem('jointCount_total')
    const savedStartDate = localStorage.getItem('jointCount_startDate')
    
    if (savedTotal) {
      totalJoints.value = parseInt(savedTotal, 10)
    }
    
    if (savedStartDate) {
      startDate.value = savedStartDate
    } else {
      // First time - save current date as start
      startDate.value = new Date().toISOString().split('T')[0]
      saveToLocalStorage()
    }
  }
}

const saveToLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jointCount_total', totalJoints.value.toString())
    localStorage.setItem('jointCount_startDate', startDate.value)
  }
}

// Page authentication handler
const handlePageAuthSubmit = (password?: string) => {
  const passwordToUse = password || pageAuth.passwordInput.value
  const authenticated = pageAuth.authenticate(passwordToUse)
  
  if (authenticated) {
    pageAuth.passwordInput.value = ''
    loadJointCount()
    updateCurrentDate()
  }
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }
  
  // Initialize page auth (checks sessionStorage)
  pageAuth.init()
  
  // Watch for authentication changes and load data when authenticated
  let intervalSet = false
  watchEffect(() => {
    // If authenticated, load data (only once)
    if (pageAuth.isAuthenticated.value && !intervalSet) {
      updateCurrentDate()
      loadJointCount()
      setInterval(updateCurrentDate, 60000)
      intervalSet = true
    }
  })
})
</script>

<style lang="stylus" scoped>
.joint-count-page
  min-height 100vh
  display flex
  justify-content center
  align-items center
  background #4CAF50
  padding 1rem
  overflow-y auto

.container
  display flex
  flex-direction column
  align-items center
  gap 1rem
  max-width 700px
  width 100%
  margin auto

    .image-container
      cursor pointer
      transition transform 0.3s ease
      position relative
      
      &:hover
        transform scale(1.05)
      
      &:active
        transform scale(0.95)
      
      &.loading
        cursor wait
        opacity 0.7

.joint-image
  max-width 280px
  width 100%
  height auto
  filter drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4))
  border-radius 12px

.counter-section
  text-align center
  position relative

.counter-label
  font-size 1.5rem
  color rgba(255, 255, 255, 0.9)
  margin 0
  display flex
  align-items center
  justify-content center
  gap 0.5rem
  flex-wrap wrap

.counter-text
  font-size 1.5rem
  font-weight 500

.counter-number
  font-size 3rem
  font-weight bold
  color #fff
  text-shadow 0 4px 8px rgba(0, 0, 0, 0.3)
  opacity 1
  transition opacity 0.3s ease
  line-height 1
  
  &.loading
    opacity 0.6

.date-section
  text-align center

.current-date
  font-size 0.85rem
  color rgba(255, 255, 255, 0.85)
  margin 0
  padding 0.4rem 0.8rem
  background rgba(255, 255, 255, 0.1)
  border-radius 6px
  backdrop-filter blur(10px)

.stats-section
  width 100%
  text-align center
  padding 1rem
  background rgba(255, 255, 255, 0.1)
  border-radius 12px
  backdrop-filter blur(10px)

.stats-title
  font-size 1.1rem
  color #fff
  margin 0 0 0.75rem 0
  font-weight 600

.stats-content
  display flex
  flex-direction column
  gap 0.5rem

.stats-grid
  display grid
  grid-template-columns repeat(auto-fit, minmax(140px, 1fr))
  gap 0.75rem
  margin-top 0.5rem

.stat-group
  display flex
  flex-direction column
  justify-content center
  gap 0.3rem
  padding 0 1rem
  border-right 1px solid rgba(255, 255, 255, 0.2)
  
  &:last-child
    border-right none

.stats-subtitle
  font-size 0.7rem
  color rgba(255, 255, 255, 0.7)
  margin 0.5rem 0 0.3rem 0
  font-weight 600
  text-transform uppercase
  letter-spacing 0.5px

.stat-item
  display flex
  justify-content space-between
  align-items center
  color rgba(255, 255, 255, 0.9)
  font-size 0.8rem
  margin 0
  padding 0.2rem 0
  line-height 1.3

.label
  font-weight 500
  font-size 0.75rem
  text-align left

.value
  font-weight bold
  color #fff
  font-size 0.85rem
  text-align right
  min-width 50px

// Auth Dialog Styles
.auth-dialog-overlay
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.7)
  display flex
  justify-content center
  align-items center
  z-index 1000
  backdrop-filter blur(5px)
  
  &.page-protection
    background rgba(0, 0, 0, 0.9)
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

.auth-dialog-btn-cancel
  background rgba(255, 255, 255, 0.2)
  color #fff
  
  &:hover:not(:disabled)
    background rgba(255, 255, 255, 0.3)

.auth-dialog-btn-submit
  background rgba(255, 255, 255, 0.9)
  color #667eea
  
  &:hover:not(:disabled)
    background #fff

.api-error
  font-size 0.85rem
  color rgba(255, 200, 200, 0.9)
  margin-top 0.5rem
  padding 0.25rem 0.5rem
  background rgba(255, 0, 0, 0.2)
  border-radius 4px

.api-status
  font-size 0.75rem
  color rgba(200, 255, 200, 0.9)
  margin-top 0.5rem
  padding 0.25rem 0.5rem
  background rgba(0, 255, 0, 0.1)
  border-radius 4px

.api-loading
  font-size 0.75rem
  color rgba(255, 255, 200, 0.9)
  margin-top 0.5rem
  padding 0.25rem 0.5rem
  background rgba(255, 255, 0, 0.1)
  border-radius 4px

// MEDIA QUERIES
@media (max-width: 768px)
  .joint-count-page
    padding 30px 0.75rem
    align-items flex-start
    justify-content flex-start
    padding-top 30px
  
  .container
    gap 0.75rem
    max-width 100%
    align-items center
  
  .counter-label
    font-size 1.2rem
    gap 0.3rem
  
  .counter-text
    font-size 1.2rem
  
  .counter-number
    font-size 2.4rem
  
  .joint-image
    max-width 120px
  
  .stats-section
    padding 0.75rem
  
  .stats-grid
    grid-template-columns 1fr
    gap 0.5rem
    width 100%
  
  .stat-group
    gap 0.2rem
    padding 0
    border-right none
    border-bottom 1px solid rgba(255, 255, 255, 0.2)
    padding-bottom 0.75rem
    margin-bottom 0.5rem
    align-items center
    text-align center
    
    &:last-child
      border-bottom none
      margin-bottom 0
      padding-bottom 0
  
  .image-container
    display flex
    justify-content center
    align-items center
  
  .counter-section
    width 100%
    display flex
    flex-direction column
    align-items center
  
  .date-section
    width 100%
    display flex
    justify-content center
  
  .stat-item
    font-size 0.75rem
    padding 0.15rem 0
  
  .label
    font-size 0.7rem
  
  .value
    font-size 0.8rem
  
  .stats-subtitle
    margin 0.4rem 0 0.2rem 0
    font-size 0.65rem
  
  .current-date
    font-size 0.75rem
    padding 0.3rem 0.6rem
  
  .counter-label
    font-size 0.9rem
</style>

