# Decisiones Técnicas

## 1. SQLite en lugar de PostgreSQL
Se eligió SQLite por simplicidad para desarrollo local. No requiere servidor externo y es suficiente para una prueba técnica de inventario interno.

## 2. stock_actual como columna en la DB
Se decidió guardar el stock como columna y actualizarlo en cada movimiento, en lugar de calcularlo dinámicamente sumando movimientos. Esto mejora el rendimiento en consultas de listado.

## 3. Soft delete para productos
El DELETE no elimina el registro sino que pone is_active=False. Esto preserva el historial de movimientos y mantiene la integridad referencial de la base de datos.

## 4. Vite en lugar de Create React App
Vite tiene tiempos de arranque significativamente más rápidos y es el estándar moderno para proyectos React. CRA está deprecado.

## 5. bcrypt==4.0.1 en lugar de la versión más reciente
La versión 5.x de bcrypt eliminó el atributo __about__ que passlib necesita para detectar la versión. Se fijó en 4.0.1 para mantener compatibilidad.

## Uso de IA

### Herramientas utilizadas
- Claude Code (para scaffolding inicial de archivos)

### 2 ejemplos de prompts usados
1. "Crea el archivo database.py con engine SQLite, SessionLocal y Base para SQLAlchemy."
2. "Agrega el endpoint POST /movements que valide que el stock no quede negativo antes de registrar una salida."

### 1 caso donde la IA generó algo incorrecto
Claude Code instaló bcrypt en su versión más reciente (5.x), incompatible con passlib 1.7.4. El error se detectó manualmente al probar el registro: el backend lanzaba ValueError. La solución fue identificada y aplicada manualmente fijando bcrypt==4.0.1.

### Partes escritas sin IA
La arquitectura general del proyecto, el orden de desarrollo (modelos → auth → endpoints → frontend), la lógica de negocio de movimientos de stock, la validación de stock negativo, y la corrección del bug de bcrypt fueron realizados sin asistencia de IA. Se usó IA únicamente para generar boilerplate de archivos individuales, siempre revisando y ajustando el código generado.