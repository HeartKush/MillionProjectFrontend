# 🏠 Million Project Frontend

Frontend moderno para gestión de propiedades inmobiliarias desarrollado con **Next.js 14**, **TypeScript**, **Tailwind CSS** y **React Query**.

## 🚀 Características

- ✅ **Arquitectura SOLID** - Principios de diseño orientado a objetos
- ✅ **Atomic Design** - Componentes organizados por niveles (atoms, molecules, organisms)
- ✅ **TypeScript** - Tipado estático para mayor robustez
- ✅ **Responsive Design** - Adaptable a todos los dispositivos
- ✅ **Testing** - Cobertura de pruebas unitarias con Jest y React Testing Library
- ✅ **State Management** - React Query para manejo de estado del servidor
- ✅ **Formularios** - React Hook Form con validación Zod
- ✅ **UI/UX** - Interfaz moderna y accesible
- ✅ **Rutas Dinámicas** - Navegación con URLs persistentes
- ✅ **CRUD Completo** - Crear, leer, actualizar y eliminar propiedades y propietarios
- ✅ **Sistema de Transacciones** - Gestión completa de ventas con cálculo automático de impuestos
- ✅ **Estados Dinámicos** - Disponibilidad y destacado basados en datos reales
- ✅ **Notificaciones Toast** - Feedback visual para todas las operaciones
- ✅ **Modales de Confirmación** - Confirmación elegante para acciones destructivas

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos utilitarios
- **React Query** - Manejo de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Axios** - Cliente HTTP
- **date-fns** - Manipulación de fechas
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   ├── providers.tsx      # Proveedores de contexto
│   ├── propiedades/       # Páginas de propiedades
│   │   ├── page.tsx       # Lista de propiedades
│   │   └── [id]/          # Detalle de propiedad
│   └── propietarios/      # Páginas de propietarios
│       ├── page.tsx       # Lista de propietarios
│       └── [id]/          # Detalle de propietario
├── components/            # Componentes organizados por Atomic Design
│   ├── atoms/            # Componentes atómicos
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Switch/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   ├── LoadingSpinner/
│   │   └── ErrorMessage/
│   ├── molecules/        # Componentes moleculares
│   │   ├── PropertyCard/
│   │   ├── PropertyDetail/
│   │   ├── PropertyForm/
│   │   ├── PropertyTraceForm/
│   │   ├── PropertyTraceList/
│   │   ├── PropertyTraceModal/
│   │   ├── PropertyListByOwner/
│   │   ├── OwnerForm/
│   │   ├── OwnerDetail/
│   │   ├── FilterForm/
│   │   ├── OwnerFilterForm/
│   │   └── ConfirmModal/
│   └── organisms/        # Componentes organismos
│       ├── PropertyList/
│       ├── PropertyFilters/
│       ├── PropertyDetailView/
│       ├── OwnerList/
│       ├── OwnerFilters/
│       └── OwnerDetailView/
├── contexts/             # Contextos de React
│   └── ToastContext.tsx  # Contexto para notificaciones
├── lib/                  # Utilidades y lógica de negocio
│   ├── api/             # Servicios de API
│   ├── hooks/           # Hooks personalizados
│   ├── types/           # Definiciones de tipos
│   ├── utils/           # Funciones utilitarias
│   └── constants/       # Constantes de la aplicación
└── styles/              # Estilos adicionales
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend API ejecutándose en `http://localhost:5120`

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd million-project-frontend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env.local
   ```

   Editar `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5120
   ```

4. **Ejecutar en desarrollo**

   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm run start        # Ejecutar servidor de producción

# Testing
npm run test         # Ejecutar tests
npm run test:watch   # Ejecutar tests en modo watch
npm run test:coverage # Ejecutar tests con cobertura

# Linting
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🧪 Testing

El proyecto incluye una suite completa de tests unitarios:

- **Cobertura mínima**: 80% en branches, functions, lines y statements
- **Frameworks**: Jest + React Testing Library
- **Estrategia**: Testing de componentes, hooks y utilidades

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🎨 Diseño y UX

### Atomic Design

El proyecto sigue la metodología **Atomic Design**:

- **Atoms**: Componentes básicos (Button, Input, Card, etc.)
- **Molecules**: Combinaciones de atoms (PropertyCard, FilterForm, etc.)
- **Organisms**: Secciones complejas (PropertyList, PropertyFilters, etc.)
- **Templates**: Layouts de página
- **Pages**: Páginas específicas

### Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: xs (475px), sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Grid System**: CSS Grid con clases utilitarias de Tailwind
- **Typography**: Escala tipográfica responsive

### Accesibilidad

- **ARIA Labels**: Etiquetas semánticas para screen readers
- **Keyboard Navigation**: Navegación completa por teclado
- **Focus Management**: Indicadores de foco visibles
- **Color Contrast**: Cumple estándares WCAG 2.1

## 🔧 Arquitectura

### Principios SOLID

- **S** - Single Responsibility: Cada componente tiene una responsabilidad
- **O** - Open/Closed: Extensible sin modificar código existente
- **L** - Liskov Substitution: Componentes intercambiables
- **I** - Interface Segregation: Interfaces específicas y pequeñas
- **D** - Dependency Inversion: Dependencias a través de abstracciones

### Patrones de Diseño

- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio separada
- **Custom Hooks**: Lógica reutilizable encapsulada
- **Compound Components**: Componentes compuestos flexibles

## 🌐 API Integration

### Endpoints de Propiedades

- `GET /api/property` - Listar propiedades con filtros avanzados
- `GET /api/property/{id}` - Obtener propiedad por ID
- `POST /api/property` - Crear nueva propiedad
- `PUT /api/property/{id}` - Actualizar propiedad existente
- `DELETE /api/property/{id}` - Eliminar propiedad

### Endpoints de Propietarios

- `GET /api/owner` - Listar propietarios con filtros
- `GET /api/owner/{id}` - Obtener propietario por ID
- `POST /api/owner` - Crear nuevo propietario
- `PUT /api/owner/{id}` - Actualizar propietario existente
- `DELETE /api/owner/{id}` - Eliminar propietario

### Endpoints de Transacciones

- `GET /api/propertyTrace` - Listar transacciones por propiedad
- `GET /api/propertyTrace/{id}` - Obtener transacción por ID
- `POST /api/propertyTrace` - Crear nueva transacción
- `PUT /api/propertyTrace/{id}` - Actualizar transacción existente
- `DELETE /api/propertyTrace/{id}` - Eliminar transacción

### Filtros y Parámetros

#### Propiedades

- **name**: Búsqueda por nombre de propiedad
- **address**: Búsqueda por dirección
- **minPrice/maxPrice**: Rango de precios
- **idOwner**: Filtrar por propietario específico

#### Propietarios

- **name**: Búsqueda por nombre del propietario
- **address**: Búsqueda por dirección del propietario

#### Características Técnicas

- **Debounce**: Búsqueda optimizada con delay de 300ms
- **Paginación**: Soporte para paginación en listas
- **Cache**: Invalidación automática de cache
- **Error Handling**: Manejo robusto de errores HTTP

## 📱 Funcionalidades

### 🏠 Gestión de Propiedades

#### Lista de Propiedades

- ✅ **Vista Grid/Lista** - Alternancia entre vistas de tarjetas y lista
- ✅ **Filtros Avanzados** - Búsqueda por nombre, dirección y rango de precios
- ✅ **Estados Dinámicos** - Disponible/Vendida basado en transacciones
- ✅ **Propiedades Destacadas** - Badge especial para propiedades destacadas
- ✅ **Ordenamiento** - Por precio, fecha de creación, nombre
- ✅ **Estadísticas** - Contadores de total, activas y recientes
- ✅ **Responsive** - Adaptable a todos los dispositivos

#### Detalle de Propiedad

- ✅ **Información Completa** - Datos detallados de la propiedad
- ✅ **Imagen Principal** - Visualización de imagen de alta calidad
- ✅ **Propietario Asociado** - Información del propietario con navegación
- ✅ **Historial de Transacciones** - Lista completa de ventas
- ✅ **CRUD Completo** - Crear, editar y eliminar propiedades
- ✅ **Navegación** - Rutas dinámicas con URLs persistentes

### 👥 Gestión de Propietarios

#### Lista de Propietarios

- ✅ **Filtros de Búsqueda** - Por nombre y dirección
- ✅ **Estadísticas** - Contadores de total, activos y recientes
- ✅ **Vista Responsive** - Adaptable a diferentes pantallas
- ✅ **Navegación** - Enlaces a detalles de propietarios

#### Detalle de Propietario

- ✅ **Información Personal** - Datos completos del propietario
- ✅ **Foto de Perfil** - Imagen del propietario
- ✅ **Propiedades Asociadas** - Lista de propiedades del propietario
- ✅ **CRUD Completo** - Crear, editar y eliminar propietarios
- ✅ **Navegación** - Rutas dinámicas con URLs persistentes

### 💰 Sistema de Transacciones

#### Gestión de Transacciones

- ✅ **CRUD Completo** - Crear, editar y eliminar transacciones
- ✅ **Cálculo Automático** - Impuestos calculados según normativa colombiana
- ✅ **Desglose de Impuestos** - Visualización detallada del cálculo
- ✅ **Validación** - Formularios con validación robusta
- ✅ **Historial** - Lista completa de transacciones por propiedad

#### Cálculo de Impuestos

- ✅ **Normativa 2025** - Tabla de impuestos actualizada
- ✅ **UVT** - Cálculo basado en Unidades de Valor Tributario
- ✅ **Progresivo** - Tarifas escalonadas según valor
- ✅ **Transparente** - Desglose completo del cálculo

### 🎨 Sistema de UI/UX

#### Componentes Reutilizables

- ✅ **Atomic Design** - Componentes organizados por niveles
- ✅ **Switch Moderno** - Toggle elegante para valores booleanos
- ✅ **Modales** - Confirmación y formularios en overlays
- ✅ **Toast Notifications** - Feedback visual para todas las operaciones
- ✅ **Loading States** - Indicadores de carga consistentes

#### Navegación

- ✅ **Rutas Dinámicas** - URLs persistentes y compartibles
- ✅ **Breadcrumbs** - Navegación contextual
- ✅ **Navbar Activo** - Indicadores de página actual
- ✅ **Responsive** - Menú adaptativo para móviles

### 🔧 Funcionalidades Técnicas

#### Estado y Cache

- ✅ **React Query** - Manejo inteligente de estado del servidor
- ✅ **Invalidación Automática** - Cache sincronizado entre vistas
- ✅ **Optimistic Updates** - Actualizaciones optimistas
- ✅ **Error Handling** - Manejo robusto de errores

#### Formularios

- ✅ **React Hook Form** - Manejo eficiente de formularios
- ✅ **Validación Zod** - Esquemas de validación robustos
- ✅ **Debounce** - Búsquedas optimizadas
- ✅ **Estados de Carga** - Feedback visual durante operaciones

## 🚀 Despliegue

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://api.millionproject.com
NODE_ENV=production
```

### Build de Producción

```bash
npm run build
npm run start
```

### Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Ismael Parra** - [LinkedIn](https://www.linkedin.com/in/ismaelparra)

---

## 📚 Documentación Adicional

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Atomic Design Methodology](https://bradfrost.com/blog/post/atomic-web-design/)
