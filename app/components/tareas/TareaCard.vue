<template>
  <div :class="['tarea-card', { 'tarea-card--completada': completado }]">
    <button
      class="tarea-card__checkbox-wrap"
      @click="toggleCompletado"
      :aria-label="completado ? 'Marcar como pendiente' : 'Marcar como completada'"
    >
      <span :class="['tarea-card__check-icon', { 'tarea-card__check-icon--checked': completado }]">
        <svg v-if="completado" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </button>

    <div class="tarea-card__body">
      <p :class="['tarea-card__titulo', { 'tarea-card__titulo--done': completado }]">
        {{ tarea.titulo }}
      </p>
      <p v-if="tarea.descripcion" class="tarea-card__desc">
        {{ tarea.descripcion }}
      </p>
      <span class="tarea-card__fecha">
        {{ formatFecha(tarea.fechaCreacion) }}
      </span>
    </div>

    <div class="tarea-card__actions">
      <button class="tarea-card__btn tarea-card__btn--edit" @click="$emit('editar', tarea)" title="Editar">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="tarea-card__btn tarea-card__btn--delete" @click="confirmarEliminar" title="Eliminar">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M3 4h10M6 4V3h4v1M5 4l.5 9h5L11 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTareasStore } from '~/stores/tareas'
import type { Tarea } from '~/types/tarea.types'

const props = defineProps<{ tarea: Tarea }>()
const emit = defineEmits<{
  eliminar: [id: number]
  editar: [tarea: Tarea]
}>()

const store = useTareasStore()

const completado = ref(props.tarea.completado)

watch(() => props.tarea.completado, (val) => {
  completado.value = val
})

function formatFecha(fecha: string): string {
  return new Date(fecha).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

async function toggleCompletado() {
  const nuevoValor = !completado.value
  completado.value = nuevoValor
  try {
    await store.actualizarTarea(props.tarea.id, { completado: nuevoValor })
  } catch {
    completado.value = !nuevoValor
  }
}

async function confirmarEliminar() {
  const { $swal } = useNuxtApp()
  const result = await ($swal as any).fire({
    title: '¿Eliminar tarea?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
    background: '#1A1D27',
    color: '#F1F5F9',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#374151'
  })
  if (result.isConfirmed) emit('eliminar', props.tarea.id)
}
</script>

<style scoped>
.tarea-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  background: #1A1D27;
  border: 1px solid #2A2D3E;
  border-radius: 12px;
  transition: border-color 0.2s, background 0.2s;
}
.tarea-card:hover {
  border-color: #6366F1;
}
.tarea-card--completada {
  background: #161820;
  border-color: #1E2130;
}

.tarea-card__checkbox-wrap {
  display: flex;
  align-items: center;
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
}
.tarea-card__check-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #3A3D54;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #fff;
  flex-shrink: 0;
}
.tarea-card__check-icon--checked {
  background: #6366F1;
  border-color: #6366F1;
}

.tarea-card__body {
  flex: 1;
  min-width: 0;
}
.tarea-card__titulo {
  font-size: 0.9375rem;
  font-weight: 500;
  color: #F1F5F9;
  line-height: 1.4;
  transition: color 0.2s;
  word-break: break-word;
}
.tarea-card__titulo--done {
  text-decoration: line-through;
  color: #4B5563;
}
.tarea-card__desc {
  font-size: 0.8125rem;
  color: #64748B;
  margin-top: 4px;
  line-height: 1.5;
  word-break: break-word;
}
.tarea-card__fecha {
  display: inline-block;
  font-size: 0.75rem;
  color: #374151;
  margin-top: 8px;
}

.tarea-card__actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}
.tarea-card__btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  color: #4B5563;
}
.tarea-card__btn svg {
  width: 15px;
  height: 15px;
}
.tarea-card__btn--edit:hover {
  background: #312E81;
  color: #818CF8;
}
.tarea-card__btn--delete:hover {
  background: #450a0a;
  color: #f87171;
}
</style>