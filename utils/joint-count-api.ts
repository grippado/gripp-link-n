import axios from 'axios'

// Configure sua URL da API Lambda aqui
// Você receberá essa URL após fazer o deploy
// Pode ser configurada via variável de ambiente JOINT_COUNT_API_URL
// ou via runtimeConfig do Nuxt (useRuntimeConfig().public.jointCountApiUrl)

// Função para obter a URL da API
// No cliente, use useRuntimeConfig().public.jointCountApiUrl
// No servidor ou como fallback, use process.env.JOINT_COUNT_API_URL
let API_BASE_URL = ''

// Esta função deve ser chamada no componente Vue com useRuntimeConfig
export function setApiBaseUrl(url: string) {
  API_BASE_URL = url
}

// Função auxiliar para obter a URL
function getApiBaseUrl(): string {
  if (API_BASE_URL) return API_BASE_URL
  if (typeof process !== 'undefined' && process.env?.JOINT_COUNT_API_URL) {
    return process.env.JOINT_COUNT_API_URL
  }
  return ''
}

export interface JointCountData {
  userId: string
  totalJoints: number
  startDate: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateJointCountRequest {
  userId?: string
  totalJoints?: number
  startDate?: string
  increment?: boolean
}

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * Busca a contagem de joints do DynamoDB
 */
export async function getJointCount(userId: string = 'default', apiUrl?: string): Promise<JointCountData> {
  const url = apiUrl || getApiBaseUrl()
  
  // Garantir que a URL não está vazia e não é localhost
  if (!url) {
    throw new Error('JOINT_COUNT_API_URL não configurada. Configure a variável de ambiente JOINT_COUNT_API_URL ou use useRuntimeConfig().public.jointCountApiUrl')
  }
  
  // Construir URL completa
  const fullUrl = url.startsWith('http') ? `${url}/joint-count` : `https://${url}/joint-count`

  try {
    const response = await axios.get<JointCountData>(fullUrl, {
      params: { userId },
      timeout: 10000 // 10 segundos de timeout
    })
    
    // A Lambda retorna diretamente o objeto JointCountData
    const data = response.data
    
    // Garantir que temos os campos necessários
    return {
      userId: data.userId || userId,
      totalJoints: data.totalJoints || 0,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }
  } catch (error: any) {
    console.error('Erro ao buscar contagem de joints:', error)
    if (error.response) {
      console.error('Response error:', error.response.data)
      throw new Error(error.response.data?.error || error.response.data?.message || 'Erro ao buscar contagem')
    }
    throw error
  }
}

/**
 * Atualiza a contagem de joints no DynamoDB
 */
export async function updateJointCount(
  request: UpdateJointCountRequest,
  apiUrl?: string
): Promise<JointCountData> {
  const url = apiUrl || getApiBaseUrl()
  
  if (!url) {
    throw new Error('JOINT_COUNT_API_URL não configurada. Configure a variável de ambiente JOINT_COUNT_API_URL ou use useRuntimeConfig().public.jointCountApiUrl')
  }
  
  // Construir URL completa
  const fullUrl = url.startsWith('http') ? `${url}/joint-count` : `https://${url}/joint-count`

  try {
    const response = await axios.put<ApiResponse<JointCountData>>(
      fullUrl,
      request,
      {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    // A Lambda retorna { success: true, data: JointCountData } ou { error: ... }
    if (response.data.error) {
      throw new Error(response.data.error)
    }
    
    // Se tem data dentro, retorna data, senão retorna o próprio response.data
    const result = response.data.data || response.data as any
    
    // Garantir que temos os campos necessários
    return {
      userId: result.userId || request.userId || 'default',
      totalJoints: result.totalJoints ?? 0,
      startDate: result.startDate || new Date().toISOString().split('T')[0],
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }
  } catch (error: any) {
    console.error('Erro ao atualizar contagem de joints:', error)
    if (error.response) {
      console.error('Response error:', error.response.data)
      throw new Error(error.response.data?.error || error.response.data?.message || 'Erro ao atualizar contagem')
    }
    throw error
  }
}

/**
 * Incrementa a contagem de joints em 1
 */
export async function incrementJointCount(userId: string = 'default', apiUrl?: string): Promise<JointCountData> {
  return updateJointCount({
    userId,
    increment: true
  }, apiUrl)
}

