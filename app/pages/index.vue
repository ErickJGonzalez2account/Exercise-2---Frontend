<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Mis tareas</h1>
        <p class="page-subtitle">Organiza y lleva el control de tu trabajo</p>
      </div>
      <button class="btn btn--primary" @click="abrirCrear">
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Nueva tarea
      </button>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="stat">
        <span class="stat__value">{{ store.total }}</span>
        <span class="stat__label">Total</span>
      </div>
      <div class="stat__divider" />
      <div class="stat">
        <span class="stat__value stat__value--done">{{ store.completadas }}</span>
        <span class="stat__label">Completadas</span>
      </div>
      <div class="stat__divider" />
      <div class="stat">
        <span class="stat__value stat__value--pending">{{ store.pendientes }}</span>
        <span class="stat__label">Pendientes</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <button
        v-for="f in filtros"
        :key="f.value"
        :class="['filter-btn', { 'filter-btn--active': filtroActivo === f.value }]"
        @click="filtroActivo = f.value; paginaActual = 1"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- List -->
    <div v-if="store.loading" class="empty-state">
      <div class="spinner" />
      <p>Cargando tareas...</p>
    </div>

    <div v-else-if="store.error" class="empty-state empty-state--error">
      <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p>{{ store.error }}</p>
      <button class="btn btn--ghost" @click="store.cargarTareas()">Reintentar</button>
    </div>

    <div v-else-if="tareasFiltradas.length === 0" class="empty-state">
      <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
        <rect x="8" y="6" width="32" height="36" rx="4" stroke="#2A2D3E" stroke-width="2"/>
        <path d="M16 18h16M16 24h10" stroke="#374151" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="36" cy="36" r="8" fill="#0F1117" stroke="#6366F1" stroke-width="1.5"/>
        <path d="M33 36h6M36 33v6" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <p class="empty-state__text">
        {{ filtroActivo === 'todas' ? 'Aún no tienes tareas. ¡Crea una!' : 'Sin tareas en esta categoría.' }}
      </p>
      <button v-if="filtroActivo === 'todas'" class="btn btn--primary" @click="abrirCrear">
        Crear primera tarea
      </button>
    </div>

    <template v-else>
      <TransitionGroup name="list" tag="div" class="tarea-list">
        <TareaCard
          v-for="tarea in tareasPaginadas"
          :key="tarea.id"
          :tarea="tarea"
          @eliminar="eliminarTarea"
          @editar="abrirEditar"
        />
      </TransitionGroup>

      <div v-if="totalPaginas > 1" class="pagination">
        <button class="pagination__btn" :disabled="paginaActual === 1" @click="paginaActual--">‹</button>
        <span class="pagination__info">{{ paginaActual }} / {{ totalPaginas }}</span>
        <button class="pagination__btn" :disabled="paginaActual === totalPaginas" @click="paginaActual++">›</button>
      </div>
    </template>

    <!-- Modal -->
    <TareaModal
      v-if="mostrarModal"
      :tarea="tareaEditando ?? undefined"
      @cerrar="cerrarModal"
      @guardado="onGuardado"
    />
  </div>
</template>

<script setup lang="ts">
import { useTareasStore } from '@/stores/tareas'
import type { Tarea } from '@/types/tarea.types'
import TareaCard from '@/components/tareas/TareaCard.vue'
import TareaModal from '@/components/tareas/TareaModal.vue'

definePageMeta({ layout: 'default' })

const store = useTareasStore()
const mostrarModal = ref(false)
const tareaEditando = ref<Tarea | null>(null)
const filtroActivo = ref<'todas' | 'pendientes' | 'completadas'>('todas')
const paginaActual = ref(1)
const { $swal } = useNuxtApp()

const filtros = [
  { label: 'Todas', value: 'todas' },
  { label: 'Pendientes', value: 'pendientes' },
  { label: 'Completadas', value: 'completadas' }
] as const

const tareasFiltradas = computed(() => {
  if (filtroActivo.value === 'pendientes') return store.tareas.filter(t => !t.completado)
  if (filtroActivo.value === 'completadas') return store.tareas.filter(t => t.completado)
  return store.tareas
})

const totalPaginas = computed(() => Math.ceil(tareasFiltradas.value.length / 10))
const tareasPaginadas = computed(() => tareasFiltradas.value.slice((paginaActual.value - 1) * 10, paginaActual.value * 10))

onMounted(() => store.cargarTareas())

function abrirCrear() {
  tareaEditando.value = null
  mostrarModal.value = true
}

function abrirEditar(tarea: Tarea) {
  tareaEditando.value = tarea
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
  tareaEditando.value = null
}

async function onGuardado() {
  cerrarModal()
  await ($swal as any).fire({
    toast: true, position: 'top-end', icon: 'success', title: 'Tarea guardada',
    showConfirmButton: false, timer: 2500, background: '#1A1D27', color: '#F1F5F9'
  })
}

async function eliminarTarea(id: number) {
  await store.eliminarTarea(id)
  if (tareasPaginadas.value.length === 0 && paginaActual.value > 1) paginaActual.value--
  await ($swal as any).fire({
    toast: true, position: 'top-end', icon: 'success', title: 'Tarea eliminada',
    showConfirmButton: false, timer: 2000, background: '#1A1D27', color: '#F1F5F9'
  })
}
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #F1F5F9;
  letter-spacing: -0.02em;
}
.page-subtitle {
  font-size: 0.875rem;
  color: #4B5563;
  margin-top: 4px;
}
.stats {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #1A1D27;
  border: 1px solid #2A2D3E;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 20px;
}
.stat { text-align: center; }
.stat__value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #F1F5F9;
  line-height: 1;
}
.stat__value--done { color: #34d399; }
.stat__value--pending { color: #fbbf24; }
.stat__label {
  display: block;
  font-size: 0.75rem;
  color: #4B5563;
  margin-top: 4px;
}
.stat__divider {
  width: 1px;
  height: 32px;
  background: #2A2D3E;
}
.filters {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #2A2D3E;
  background: transparent;
  color: #64748B;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.filter-btn:hover { border-color: #6366F1; color: #818CF8; }
.filter-btn--active {
  background: #312E81;
  border-color: #4338CA;
  color: #A5B4FC;
}
.tarea-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list-enter-active, .list-leave-active { transition: all 0.2s ease; }
.list-enter-from { opacity: 0; transform: translateY(-8px); }
.list-leave-to { opacity: 0; transform: translateX(16px); }
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 64px 24px;
  color: #374151;
  text-align: center;
}
.empty-state--error { color: #f87171; }
.empty-state__text { font-size: 0.9375rem; color: #4B5563; }
.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid #2A2D3E;
  border-top-color: #6366F1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: background 0.15s;
}
.btn--primary { background: #6366F1; color: #fff; }
.btn--primary:hover { background: #4F46E5; }
.btn--ghost {
  background: transparent;
  color: #64748B;
  border: 1px solid #2A2D3E;
}
.btn--ghost:hover { background: #1A1D27; color: #94A3B8; }
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}
.pagination__btn {
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #2A2D3E;
  background: transparent;
  color: #64748B;
  font-size: 0.875rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.pagination__btn:hover:not(:disabled) { border-color: #6366F1; color: #818CF8; }
.pagination__btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pagination__info {
  font-size: 0.8125rem;
  color: #4B5563;
  padding: 0 4px;
}
</style>