import type { Tarea, CrearTareaPayload, ActualizarTareaPayload } from '~/types/tarea.types'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => `Error ${res.status}`)
    throw new Error(message || `Error ${res.status}`)
  }
  const text = await res.text()
return text ? JSON.parse(text) : undefined as unknown as T
}

export function useTareasApi() {
  const config = useRuntimeConfig()
  const API_URL = config.public.apiUrl
  const AUTH_TOKEN = config.public.authToken

  const baseHeaders: HeadersInit = {
    authorization: AUTH_TOKEN,
    'Content-Type': 'application/json'
  }
  async function listar(): Promise<Tarea[]> {
    const res = await fetch(`${API_URL}/tareas`, { headers: baseHeaders })
    return handleResponse<Tarea[]>(res)
  }

  async function crear(payload: CrearTareaPayload): Promise<Tarea> {
    const res = await fetch(`${API_URL}/tareas`, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(payload)
    })
    return handleResponse<Tarea>(res)
  }

  async function actualizar(id: number, payload: ActualizarTareaPayload): Promise<Tarea> {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: baseHeaders,
      body: JSON.stringify(payload)
    })
    return handleResponse<Tarea>(res)
  }

  async function eliminar(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/tareas/${id}`, {
      method: 'DELETE',
      headers: baseHeaders
    })
    return handleResponse<void>(res)
  }

  return { listar, crear, actualizar, eliminar }
}