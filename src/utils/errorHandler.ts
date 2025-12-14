import { AxiosError } from 'axios';

/**
 * Estrutura de erro padrão da API
 */
export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
  path?: string;
  timestamp?: string;
  errors?: Record<string, string>; // Para erros de validação
}

/**
 * Extrai a mensagem de erro da resposta da API
 * Prioridade: errors (validação) > message > fallback
 */
export function getErrorMessage(
  error: unknown, 
  fallback: string = 'Ocorreu um erro inesperado. Tente novamente.'
): string {
  // Se for um AxiosError com resposta da API
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Partial<ApiErrorResponse>;
    
    // Erros de validação - retorna o primeiro erro
    if (data.errors && typeof data.errors === 'object') {
      const firstError = Object.values(data.errors)[0];
      if (firstError) return firstError;
    }
    
    // Mensagem padrão da API
    if (data.message) {
      return data.message;
    }
  }
  
  // Se for um Error genérico
  if (error instanceof Error) {
    return error.message;
  }
  
  return fallback;
}

/**
 * Extrai todos os erros de validação como objeto
 * Útil para exibir erros por campo no formulário
 */
export function getValidationErrors(error: unknown): Record<string, string> | null {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Partial<ApiErrorResponse>;
    
    if (data.errors && typeof data.errors === 'object') {
      return data.errors;
    }
  }
  
  return null;
}

/**
 * Verifica o código de status HTTP do erro
 */
export function getErrorStatus(error: unknown): number | null {
  if (isAxiosError(error) && error.response) {
    return error.response.status;
  }
  return null;
}

/**
 * Type guard para AxiosError
 */
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

/**
 * Helper para mensagens específicas por contexto
 */
export const ErrorMessages = {
  // Auth
  loginFailed: 'Email ou senha incorretos',
  sessionExpired: 'Sua sessão expirou. Faça login novamente.',
  unauthorized: 'Você não tem permissão para esta ação',
  
  // CRUD
  createFailed: (entity: string) => `Erro ao criar ${entity}`,
  updateFailed: (entity: string) => `Erro ao atualizar ${entity}`,
  deleteFailed: (entity: string) => `Erro ao excluir ${entity}`,
  loadFailed: (entity: string) => `Erro ao carregar ${entity}`,
  
  // Rede
  networkError: 'Erro de conexão. Verifique sua internet.',
  serverError: 'Erro no servidor. Tente novamente mais tarde.',
  timeout: 'A requisição demorou muito. Tente novamente.',
} as const;
