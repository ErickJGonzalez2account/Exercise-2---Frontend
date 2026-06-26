import { defineStore } from 'pinia'
import { useTareasApi } from '~/composables/useTareasApi'
import type { Tarea, CrearTareaPayload, ActualizarTareaPayload } from '~/types/tarea.types'

export const useTareasStore = defineStore('tareas', {
  state: () => ({
    tareas: [] as Tarea[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    total: (state) => state.tareas.length,
    completadas: (state) => state.tareas.filter(t => t.completado).length,
    pendientes: (state) => state.tareas.filter(t => !t.completado).length
  },

  actions: {
    async cargarTareas() {
      const api = useTareasApi()
      this.loading = true
      this.error = null
      try {
        this.tareas = await api.listar()
      } catch (e) {
        this.error = e instanceof Error ? e.message : 'Error al cargar tareas'
      } finally {
        this.loading = false
      }
    },

    async crearTarea(payload: CrearTareaPayload) {
      const api = useTareasApi()
      const nueva = await api.crear(payload)
      this.tareas.unshift(nueva)
    },

    async actualizarTarea(id: number, payload: ActualizarTareaPayload) {
      const api = useTareasApi()
      const idx = this.tareas.findIndex(t => t.id === id)

      if (idx !== -1) {
        this.tareas.splice(idx, 1, { ...this.tareas[idx], ...payload } as Tarea)
      }

      try {
        const actualizada = await api.actualizar(id, payload)
        if (idx !== -1) {
          this.tareas.splice(idx, 1, actualizada)
        }
      } catch (e) {
        await this.cargarTareas()
        throw e
      }
    },

    async eliminarTarea(id: number) {
      const api = useTareasApi()
      await api.eliminar(id)
      this.tareas = this.tareas.filter(t => t.id !== id)
    }
  }
})