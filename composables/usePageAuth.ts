import { ref, computed } from 'vue'

export interface PageAuthOptions {
  password?: string
  sessionKey?: string
  redirectOnFail?: string
}

export const usePageAuth = (options: PageAuthOptions = {}) => {
  const config = useRuntimeConfig()
  
  // Page authentication password - ONLY uses GRIPP_LINK_DEFAULT_PASSWD
  // This is separate from JOINT_COUNT_PASSWORD which is only for incrementing
  const defaultPassword = config.public.defaultPassword || 'gripp2026!'
  const password = options.password || defaultPassword
  
  // Session key for storing authentication state
  const sessionKey = options.sessionKey || 'page_authenticated'
  
  // State
  const isAuthenticated = ref(false)
  const passwordInput = ref('')
  const passwordError = ref<string | null>(null)
  const passwordInputRef = ref<HTMLInputElement | null>(null)
  
  // Check if already authenticated
  const checkAuthentication = (): boolean => {
    if (typeof window === 'undefined') return false
    
    const savedAuth = sessionStorage.getItem(sessionKey)
    if (savedAuth === 'true') {
      isAuthenticated.value = true
      return true
    }
    return false
  }
  
  // Authenticate with password
  const authenticate = (inputPassword: string): boolean => {
    if (!inputPassword) {
      passwordError.value = 'Please enter password'
      return false
    }
    
    if (inputPassword !== password) {
      passwordError.value = `Incorrect password.`
      passwordInput.value = ''
      setTimeout(() => {
        passwordInputRef.value?.focus()
      }, 100)
      return false
    }
    
    // Correct password
    isAuthenticated.value = true
    passwordError.value = null
    
    // Save authentication in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionKey, 'true')
    }
    
    return true
  }
  
  // Clear authentication
  const logout = () => {
    isAuthenticated.value = false
    passwordInput.value = ''
    passwordError.value = null
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(sessionKey)
    }
  }
  
  // Handle password submit
  const handlePasswordSubmit = (): boolean => {
    const result = authenticate(passwordInput.value)
    if (result) {
      passwordInput.value = ''
    }
    return result
  }
  
  // Initialize - check if already authenticated
  const init = () => {
    if (typeof window !== 'undefined') {
      const wasAuthenticated = checkAuthentication()
      
      // Focus on input if not authenticated
      if (!wasAuthenticated) {
        setTimeout(() => {
          passwordInputRef.value?.focus()
        }, 100)
      }
    }
  }
  
  return {
    // State - return refs directly for v-model compatibility
    isAuthenticated: computed(() => isAuthenticated.value),
    passwordInput,
    passwordError,
    passwordInputRef,
    
    // Methods
    authenticate,
    logout,
    handlePasswordSubmit,
    checkAuthentication,
    init
  }
}

