import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080'
})

export const buscar = async <T>(url: string, setDados: (data: T) => void): Promise<void> => {
  const resposta = await api.get<T>(url)
  setDados(resposta.data)
}

export const cadastrar = async <TInput extends Record<string, unknown>, TOutput>(url: string, dados: TInput, setDados: (data: TOutput) => void): Promise<void> => {
  const resposta = await api.post<TOutput>(url, dados)
  setDados(resposta.data)
}

export const atualizar = async <TInput extends Record<string, unknown>, TOutput>(url: string, dados: TInput, setDados: (data: TOutput) => void): Promise<void> => {
  const resposta = await api.put<TOutput>(url, dados)
  setDados(resposta.data)
}

export const deletar = async(url: string): Promise<void> => {
  await api.delete(url)
}