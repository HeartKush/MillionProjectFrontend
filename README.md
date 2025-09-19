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

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página principal
│   └── providers.tsx      # Proveedores de contexto
├── components/            # Componentes organizados por Atomic Design
│   ├── atoms/            # Componentes atómicos
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── LoadingSpinner/
│   │   └── ErrorMessage/
│   ├── molecules/        # Componentes moleculares
│   │   ├── PropertyCard/
│   │   ├── FilterForm/
│   │   └── PropertyDetail/
│   └── organisms/        # Componentes organismos
│       ├── PropertyList/
│       ├── PropertyFilters/
│       └── PropertyDetailView/
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

### Endpoints Soportados

- `GET /api/property` - Listar propiedades con filtros
- `GET /api/property/{id}` - Obtener propiedad por ID
- `POST /api/property` - Crear nueva propiedad
- `GET /api/owner` - Listar propietarios
- `GET /api/owner/{id}` - Obtener propietario por ID
- `POST /api/owner` - Crear nuevo propietario

### Filtros de Búsqueda

- **Nombre**: Búsqueda por nombre de propiedad
- **Dirección**: Búsqueda por dirección
- **Rango de Precio**: Precio mínimo y máximo
- **Debounce**: Búsqueda optimizada con delay de 300ms

## 📱 Funcionalidades

### Lista de Propiedades

- ✅ Visualización en grid responsive
- ✅ Filtros de búsqueda en tiempo real
- ✅ Paginación y carga lazy
- ✅ Estados de carga y error
- ✅ Formato de moneda colombiana

### Detalle de Propiedad

- ✅ Información completa de la propiedad
- ✅ Imagen de la propiedad
- ✅ Datos del propietario
- ✅ Navegación de regreso
- ✅ Estados de carga y error

### Filtros Avanzados

- ✅ Búsqueda por nombre
- ✅ Búsqueda por dirección
- ✅ Rango de precios
- ✅ Limpieza de filtros
- ✅ Validación de formularios

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
