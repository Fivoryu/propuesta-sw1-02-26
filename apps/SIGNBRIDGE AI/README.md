# SignBridge AI

**Comunicación accesible mediante visión por computadora.**

SignBridge AI es un prototipo funcional de aplicación web que demuestra cómo la visión por computadora e inteligencia artificial pueden usarse para reconocer lengua de señas y convertirla en texto y voz, facilitando la comunicación entre personas oyentes y personas sordas o con limitaciones auditivas.

---

## Instalación y ejecución

```bash
# Desde la raíz del monorepo
pnpm install
pnpm dev:signbridge
```

O directamente desde esta carpeta:

```bash
cd "apps/SIGNBRIDGE AI"
pnpm install
pnpm dev
```

La app estará disponible en: **http://localhost:5178**

---

## Funciones REALES del prototipo

| Función | Estado |
|---|---|
| Acceso a cámara web (`getUserMedia`) | ✅ Real |
| Navegación entre pantallas | ✅ Real |
| Text-to-Speech (`speechSynthesis`) | ✅ Real |
| Historial guardado en `localStorage` | ✅ Real |
| Interfaz responsive | ✅ Real |
| Selección de vocabulario | ✅ Real |

## Funciones SIMULADAS del prototipo

| Función | Estado |
|---|---|
| Detección de manos | 🔵 Simulada |
| Clasificación de señas por IA | 🔵 Simulada |
| Nivel de confianza del modelo | 🔵 Simulada |
| Métricas del panel administrativo | 🔵 Simulada |
| Envío de correcciones al backend | 🔵 Simulada |

---

## Flujo de reconocimiento (simulado)

```
Cámara → Detección de manos → Extracción de landmarks
→ Modelo de IA → Clasificación → Confianza → Texto → Voz
```

En el prototipo, los pasos intermedios son simulados con datos mock y delays para demostrar el flujo de usuario.

---

## Escenarios de demostración

1. **Reconocimiento correcto** — Simular seña → resultado con ≥85% confianza → reproducir voz
2. **Resultado incierto** — Simular incertidumbre → resultado 60-84% → ver alternativas
3. **No reconocido** — Simular error → consejos al usuario
4. **Modo práctica** — Seleccionar seña → practicar → ver coincidencia
5. **Dashboard admin** — Ver métricas, vocabularios y estado del modelo

---

## Stack tecnológico

- **React 19** + **TypeScript**
- **Vite 7**
- **Tailwind CSS**
- **React Router v7**
- **Zustand** (estado global)
- **Lucide React** (iconos)

---

> SignBridge AI es una herramienta de apoyo para vocabularios específicos y no reemplaza a intérpretes profesionales.
