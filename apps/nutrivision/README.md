# NutriVision — Frontend Prototype

NutriVision es un prototipo web mobile-first para visualizar el funcionamiento de una futura aplicación móvil de análisis nutricional mediante visión artificial.

La demostración permite ingresar edad, peso, estatura, sexo biológico y actividad; calcular metas orientativas según un objetivo; fotografiar o seleccionar una comida; revisar una detección visual simulada; ajustar alimentos; consultar macronutrientes y registrar la comida dentro de un seguimiento diario local.

## Límites del prototipo

- La inteligencia artificial está simulada por `src/services/mock/analyze-food.ts`.
- Los alimentos, calorías y macronutrientes son datos de demostración.
- No existe backend, base de datos, autenticación, almacenamiento remoto ni envío de imágenes.
- El estado se mantiene solo durante la sesión del navegador.
- El cálculo de metas es una estimación orientativa de demostración, no sustituye el consejo de un profesional de salud.

## Rutas

`/`, `/profile-setup`, `/goal`, `/home`, `/camera`, `/processing`, `/analysis`, `/nutrition-result`, `/success`, `/history`, `/meal/:id` y `/profile`.

## Ejecución

Desde la raíz del monorepo:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev:nutrivision
```

La aplicación se sirve en `http://localhost:5177`.
