<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('cerrar')">
      <div class="modal">
        <div class="modal__header">
          <h3 class="modal__title">{{ tarea ? 'Editar tarea' : 'Nueva tarea' }}</h3>
          <button class="modal__close" @click="$emit('cerrar')" aria-label="Cerrar">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <div class="modal__body">
          <div class="field">
            <label class="field__label" for="titulo">Título <span class="field__required">*</span></label>
            <input
              id="titulo"
              v-model="form.titulo"
              class="field__input"
              :class="{ 'field__input--error': v$.titulo.$error }"
              placeholder="¿Qué hay que hacer?"
              @blur="v$.titulo.$touch()"
            />
            <p v-if="v$.titulo.$error" class="field__error">
              {{ v$.titulo.$errors[0]?.$message }}
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              class="field__input field__input--textarea"
              placeholder="Detalles opcionales..."
              rows="3"
            />
          </div>

          <div v-if="tarea" class="field field--inline">
            <input type="checkbox" v-model="form.completado" id="completado" class="field__checkbox" />
            <label for="completado" class="field__label field__label--inline">Marcar como completada</label>
          </div>
        </div>

        <div class="modal__footer">
          <button class="btn btn--ghost" @click="$emit('cerrar')">Cancelar</button>
          <button class="btn btn--primary" :disabled="loading" @click="guardar">
            <span v-if="loading" class="btn__spinner" />
            {{ tarea ? 'Actualizar' : 'Crear tarea' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { useTareasStore } from '~/stores/tareas'
import type { Tarea } from '~/types/tarea.types'

const props = defineProps<{ tarea?: Tarea }>()
const emit = defineEmits<{
  cerrar: []
  guardado: []
}>()

const store = useTareasStore()
const loading = ref(false)

const form = reactive({
  titulo: props.tarea?.titulo ?? '',
  descripcion: props.tarea?.descripcion ?? '',
  completado: props.tarea?.completado ?? false
})

const rules = {
  titulo: {
    required: helpers.withMessage('El título es obligatorio', required),
    minLength: helpers.withMessage('Mínimo 3 caracteres', minLength(3))
  }
}

const v$ = useVuelidate(rules, form)

async function guardar() {
  const valid = await v$.value.$validate()
  if (!valid) return

  loading.value = true
  try {
    if (props.tarea) {
      await store.actualizarTarea(props.tarea.id, {
        titulo: form.titulo,
        descripcion: form.descripcion,
        completado: form.completado
      })
    } else {
      await store.crearTarea({
        titulo: form.titulo,
        descripcion: form.descripcion
      })
    }
    emit('guardado')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
}

.modal {
  background: #1A1D27;
  border: 1px solid #2A2D3E;
  border-radius: 16px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
  animation: modal-in 0.2s ease;
}
@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}
.modal__title {
  font-size: 1rem;
  font-weight: 600;
  color: #F1F5F9;
}
.modal__close {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #4B5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.modal__close:hover { background: #2A2D3E; color: #94A3B8; }
.modal__close svg { width: 14px; height: 14px; }

.modal__body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal__footer {
  padding: 0 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Fields */
.field { display: flex; flex-direction: column; gap: 6px; }
.field--inline { flex-direction: row; align-items: center; gap: 10px; }
.field__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #94A3B8;
}
.field__label--inline { color: #CBD5E1; font-size: 0.875rem; }
.field__required { color: #6366F1; }
.field__input {
  background: #0F1117;
  border: 1px solid #2A2D3E;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.875rem;
  color: #F1F5F9;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
  resize: none;
  width: 100%;
  box-sizing: border-box;
}
.field__input::placeholder { color: #374151; }
.field__input:focus { border-color: #6366F1; }
.field__input--error { border-color: #ef4444; }
.field__input--textarea { resize: vertical; min-height: 80px; }
.field__error { font-size: 0.75rem; color: #f87171; }
.field__checkbox {
  width: 16px;
  height: 16px;
  accent-color: #6366F1;
  cursor: pointer;
}

/* Buttons */
.btn {
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s, opacity 0.15s;
}
.btn--ghost {
  background: transparent;
  color: #64748B;
  border: 1px solid #2A2D3E;
}
.btn--ghost:hover { background: #2A2D3E; color: #94A3B8; }
.btn--primary {
  background: #6366F1;
  color: #fff;
}
.btn--primary:hover { background: #4F46E5; }
.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>