export interface Tarea {
  id: number
  titulo: string
  descripcion: string
  completado: boolean
  fechaCreacion: string
}

export type CrearTareaPayload = Pick<Tarea, 'titulo' | 'descripcion'>
export type ActualizarTareaPayload = Partial<Pick<Tarea, 'titulo' | 'descripcion' | 'completado'>>