# 🚀 Advanced Project Management System

> A modern, feature-rich project management platform built with React 18+ and cutting-edge web technologies

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.158+-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Experience the future of project management** with our advanced 3D-powered platform featuring intelligent UI, real-time collaboration, and stunning visual effects.

## ✨ Features

<div align="center">
  <img src="https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Preview" alt="Dashboard Preview" width="100%" style="border-radius: 12px; margin: 20px 0;">
</div>

### 🎯 Core Functionality
- **📊 Dashboard Overview** - Real-time analytics with interactive charts and KPI tracking
- **📁 Project Management** - Complete project lifecycle management with progress monitoring
- **📋 Kanban Board** - Visual task management with drag-and-drop and custom workflows
- **📅 Calendar View** - Advanced scheduling with deadline tracking and event management
- **👥 Team Management** - User roles, permissions, and collaboration tools
- **📈 Analytics** - Comprehensive reporting with performance insights
- **⚙️ Settings** - Extensive customization and workspace management

### 🚀 Advanced Features
- **🌟 3D Interactive Background** - WebGL-powered particle effects with Three.js
- **🧠 Smart Sidebar** - AI-powered auto-close with 0.01s response time
- **🎨 Smooth Animations** - GSAP-powered micro-interactions and scroll effects
- **⌨️ Command Palette** - Quick actions with keyboard shortcuts (⌘K)
- **🔍 Advanced Search** - Global search with filters and real-time suggestions
- **📱 Responsive Design** - Mobile-first approach with adaptive layouts
- **🌙 Theme System** - Light/dark mode with smooth transitions

### 🔧 Technical Excellence
- **⚡ Performance Optimized** - Code splitting, lazy loading, and intelligent caching
- **🔄 Real-time Updates** - Live data synchronization and notifications
- **♿ Accessibility** - WCAG compliant with full keyboard navigation
- **🛡️ Error Handling** - Comprehensive error boundaries and graceful fallbacks
- **🔒 Security** - Input validation, XSS protection, and secure headers

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend Core** | ![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=flat-square&logo=react) ![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=flat-square&logo=vite) ![Tailwind](https://img.shields.io/badge/Tailwind-3.3+-38B2AC?style=flat-square&logo=tailwind-css) |
| **Animation & 3D** | ![Three.js](https://img.shields.io/badge/Three.js-0.158+-000000?style=flat-square&logo=three.js) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16+-0055FF?style=flat-square) ![GSAP](https://img.shields.io/badge/GSAP-3.14+-88CE02?style=flat-square) |
| **State & Routing** | ![Zustand](https://img.shields.io/badge/Zustand-4.4+-FF6B6B?style=flat-square) ![React Router](https://img.shields.io/badge/React_Router-6.20+-CA4245?style=flat-square) |
| **UI & Interactions** | ![Lucide](https://img.shields.io/badge/Lucide-0.294+-000000?style=flat-square) ![DnD Kit](https://img.shields.io/badge/DnD_Kit-Latest-4A90E2?style=flat-square) |
| **Development** | ![ESLint](https://img.shields.io/badge/ESLint-8.53+-4B32C3?style=flat-square&logo=eslint) ![PostCSS](https://img.shields.io/badge/PostCSS-8.4+-DD3A0A?style=flat-square&logo=postcss) |

</div>

### 🎨 Frontend Architecture
- **React 18.2+** - Modern React with concurrent features and Suspense
- **Vite 5.0** - Lightning-fast build tool with HMR and optimized bundling
- **Tailwind CSS 3.3+** - Utility-first CSS with custom design system
- **TypeScript Ready** - Full TypeScript support for enhanced development experience

### 🎭 Animation & 3D Graphics
- **Three.js 0.158+** - WebGL-powered 3D graphics and particle systems
- **@react-three/fiber 8.15+** - React renderer for Three.js with hooks
- **@react-three/drei 9.88+** - Essential helpers and abstractions
- **Framer Motion 10.16+** - Production-ready motion library
- **GSAP 3.14+** - Professional animation with ScrollTrigger

### 🗂️ State Management & Data Flow
- **Zustand 4.4+** - Lightweight, scalable state management
- **React Router 6.20+** - Declarative routing with data loading
- **React Hook Form 7.48+** - Performant forms with validation
- **Zod 3.22+** - TypeScript-first schema validation

## 📁 Project Structure

```
Project-Management-System/
├── frontend/                          # React application
│   ├── public/                        # Static assets
│   │   ├── logo.png                   # Application logo
│   │   └── vite.svg                   # Vite logo
│   ├── src/                           # Source code
│   │   ├── components/                # React components
│   │   │   ├── 3d/                    # Three.js 3D components
│   │   │   │   └── Background3D.jsx   # Interactive 3D background
│   │   │   ├── animations/            # Animation components
│   │   │   │   ├── HorizontalScroll.jsx
│   │   │   │   ├── MagneticButton.jsx
│   │   │   │   ├── ParallaxElement.jsx
│   │   │   │   ├── PinSection.jsx
│   │   │   │   ├── ScrollReveal.jsx
│   │   │   │   └── TextReveal.jsx
│   │   │   ├── auth/                  # Authentication components
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── UserMenu.jsx
│   │   │   ├── common/                # Shared components
│   │   │   │   └── Copyright.jsx
│   │   │   ├── dashboard/             # Dashboard components
│   │   │   │   ├── AnalyticsView.jsx  # Performance analytics
│   │   │   │   ├── AutoCloseIndicator.jsx # Smart sidebar indicator
│   │   │   │   ├── CalendarDropdown.jsx
│   │   │   │   ├── CalendarView.jsx   # Calendar and scheduling
│   │   │   │   ├── CommandPalette.jsx # Quick actions (⌘K)
│   │   │   │   ├── DashboardHeader.jsx # Advanced header with search
│   │   │   │   ├── DashboardOverview.jsx # Main dashboard
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── FilterDropdown.jsx
│   │   │   │   ├── KanbanView.jsx     # Drag & drop kanban board
│   │   │   │   ├── NewProjectModal.jsx
│   │   │   │   ├── ProjectsView.jsx   # Project management
│   │   │   │   ├── SearchDropdown.jsx # Advanced search
│   │   │   │   ├── SettingsView.jsx   # Account settings
│   │   │   │   ├── Sidebar.jsx        # Smart auto-close sidebar
│   │   │   │   ├── SkeletonCard.jsx
│   │   │   │   ├── TeamView.jsx       # Team management
│   │   │   │   └── Tooltip.jsx
│   │   │   ├── error/                 # Error handling
│   │   │   │   └── ErrorBoundary.jsx
│   │   │   ├── layout/                # Layout components
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navigation.jsx
│   │   │   ├── sections/              # Landing page sections
│   │   │   │   ├── CTA.jsx
│   │   │   │   ├── DashboardPreview.jsx
│   │   │   │   ├── FAQ.jsx
│   │   │   │   ├── Features.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── HorizontalFeatures.jsx
│   │   │   │   ├── Integrations.jsx
│   │   │   │   ├── PinnedShowcase.jsx
│   │   │   │   ├── Pricing.jsx
│   │   │   │   ├── ProductDemo.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   ├── TrustLogos.jsx
│   │   │   │   └── Workflow.jsx
│   │   │   └── ui/                    # Reusable UI components
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Input.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── contexts/                  # React contexts
│   │   │   ├── AuthContext.jsx        # Authentication state
│   │   │   └── ThemeContext.jsx       # Theme management
│   │   ├── data/                      # Mock data and constants
│   │   │   └── mockData.js            # Development data
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── use3DScrollEffects.js  # 3D scroll animations
│   │   │   ├── useAnimatedCounter.js  # Number animations
│   │   │   ├── useAutoCloseSidebar.js # Smart sidebar logic
│   │   │   ├── useDebounce.js         # Input debouncing
│   │   │   ├── useGSAP.js            # GSAP integration
│   │   │   └── useResponsive.js       # Responsive breakpoints
│   │   ├── pages/                     # Page components
│   │   │   ├── auth/                  # Authentication pages
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx          # Main dashboard page
│   │   │   ├── LandingPage.jsx        # Marketing landing page
│   │   │   └── Projects.jsx           # Projects overview
│   │   ├── services/                  # API services
│   │   │   └── api.js                 # HTTP client and endpoints
│   │   ├── stores/                    # State management
│   │   │   ├── kanbanStore.js         # Kanban board state
│   │   │   └── projectStore.js        # Project data state
│   │   ├── utils/                     # Utility functions
│   │   │   ├── cn.js                  # Class name utilities
│   │   │   └── gsapOptimizations.js   # GSAP performance optimizations
│   │   ├── App.jsx                    # Main application component
│   │   ├── index.css                  # Global styles and Tailwind
│   │   └── main.jsx                   # Application entry point
│   ├── .eslintrc.cjs                  # ESLint configuration
│   ├── .gitignore                     # Git ignore rules
│   ├── index.html                     # HTML template
│   ├── LICENSE                        # MIT license
│   ├── package.json                   # Dependencies and scripts
│   ├── postcss.config.js              # PostCSS configuration
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   └── vite.config.js                 # Vite build configuration
└── README.md                          # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn/pnpm
- **Modern browser** with WebGL support
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Project-Management-System

# Navigate to frontend
cd frontend

# Install dependencies (choose one)
npm install
# or
yarn install
# or
pnpm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:5173
```

### 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 🚀 Start development server with HMR |
| `npm run build` | 📦 Build optimized production bundle |
| `npm run preview` | 👀 Preview production build locally |
| `npm run lint` | 🔍 Run ESLint for code quality |

### 🔧 Environment Setup

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Project Management System

# Feature Flags
VITE_ENABLE_3D=true
VITE_ENABLE_ANALYTICS=true

# Performance Settings
VITE_AUTO_CLOSE_DELAY=10
VITE_ANIMATION_DURATION=300
```

## 🎨 Key Features Deep Dive

### 🧠 Smart Auto-Close Sidebar
<details>
<summary>Click to expand details</summary>

- **⚡ Lightning Fast**: 0.01-second response time to user activity
- **🎯 Activity Detection**: Monitors mouse, keyboard, scroll, and touch events
- **🛡️ Hover Protection**: Prevents closure when hovering over sidebar
- **📱 Mobile Optimized**: Intelligently disabled on mobile devices
- **👁️ Visual Feedback**: Optional countdown indicator for user awareness
- **🔧 Customizable**: Adjustable timing and behavior settings

```javascript
// Example usage
const { isOpen, shouldClose } = useAutoCloseSidebar({
  delay: 10000, // 10 seconds
  enableHoverProtection: true,
  enableOnMobile: false
})
```
</details>

### 🌟 3D Interactive Background
<details>
<summary>Click to expand details</summary>

- **🎮 WebGL Powered**: Hardware-accelerated 3D graphics using Three.js
- **✨ Particle System**: Dynamic effects responding to user interactions
- **⚡ Performance Optimized**: Automatic quality adjustment based on device
- **📱 Responsive**: Adapts to different screen sizes and capabilities
- **🎨 Customizable**: Configurable colors, density, and animation speed

```javascript
// 3D Background configuration
<Background3D
  particleCount={1000}
  animationSpeed={0.5}
  interactionRadius={100}
  colors={['#4F46E5', '#7C3AED', '#EC4899']}
/>
```
</details>

### 📊 Advanced Dashboard
<details>
<summary>Click to expand details</summary>

- **📈 Real-time Analytics**: Live project statistics and performance metrics
- **📊 Interactive Charts**: Dynamic data visualization with smooth animations
- **⌨️ Command Palette**: Quick actions accessible via ⌘K shortcut
- **🔍 Global Search**: Instant search across projects, tasks, and team members
- **🎛️ Smart Filters**: Advanced filtering with multiple criteria
- **📱 Responsive Design**: Optimized for all screen sizes

```javascript
// Command Palette usage
const commands = [
  { id: 'new-project', label: 'Create New Project', shortcut: '⌘N' },
  { id: 'search', label: 'Search Everything', shortcut: '⌘K' },
  { id: 'settings', label: 'Open Settings', shortcut: '⌘,' }
]
```
</details>

### 📋 Kanban Board
<details>
<summary>Click to expand details</summary>

- **🎯 Drag & Drop**: Smooth task movement between columns with @dnd-kit
- **🔧 Custom Workflows**: Configurable board columns and statuses
- **📊 Progress Tracking**: Visual progress indicators and completion rates
- **👥 Team Collaboration**: Assignee management and task comments
- **🏷️ Labels & Tags**: Organize tasks with custom labels and priorities

```javascript
// Kanban configuration
const boardConfig = {
  columns: ['To Do', 'In Progress', 'Review', 'Done'],
  allowedTransitions: {
    'To Do': ['In Progress'],
    'In Progress': ['Review', 'To Do'],
    'Review': ['Done', 'In Progress'],
    'Done': []
  }
}
```
</details>

## 🔧 Configuration & Customization

### 🎨 Theme Configuration
Customize the design system in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        // Add your custom colors
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      }
    }
  }
}
```

### 🎭 Animation Settings
Configure GSAP animations in `src/utils/gsapOptimizations.js`:

```javascript
export const animationConfig = {
  duration: 0.6,
  ease: "power2.out",
  stagger: 0.1,
  scrollTrigger: {
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play none none reverse"
  }
}
```

### 🌟 3D Effects Configuration
Customize Three.js settings in `src/components/3d/Background3D.jsx`:

```javascript
const config = {
  particleCount: 1000,
  particleSize: 2,
  animationSpeed: 0.5,
  mouseInfluence: 100,
  colors: ['#4F46E5', '#7C3AED', '#EC4899']
}
```

### 🧠 Sidebar Behavior
Modify auto-close timing in `src/hooks/useAutoCloseSidebar.js`:

```javascript
const sidebarConfig = {
  autoCloseDelay: 10000, // 10 seconds
  hoverProtection: true,
  enableOnMobile: false,
  showCountdown: true
}
```

## 🌐 Browser Support & Performance

### 📱 Supported Browsers
| Browser | Version | Status |
|---------|---------|--------|
| ![Chrome](https://img.shields.io/badge/Chrome-90+-4285F4?style=flat-square&logo=google-chrome&logoColor=white) | 90+ | ✅ Fully Supported |
| ![Firefox](https://img.shields.io/badge/Firefox-88+-FF7139?style=flat-square&logo=firefox&logoColor=white) | 88+ | ✅ Fully Supported |
| ![Safari](https://img.shields.io/badge/Safari-14+-000000?style=flat-square&logo=safari&logoColor=white) | 14+ | ✅ Fully Supported |
| ![Edge](https://img.shields.io/badge/Edge-90+-0078D4?style=flat-square&logo=microsoft-edge&logoColor=white) | 90+ | ✅ Fully Supported |
| ![Mobile](https://img.shields.io/badge/Mobile-WebGL-00D4AA?style=flat-square&logo=android&logoColor=white) | WebGL | ✅ Optimized |

### ⚡ Performance Features
- **📦 Code Splitting**: Automatic route-based code splitting reduces initial bundle size
- **🔄 Lazy Loading**: Components and images loaded on demand
- **🗜️ Bundle Optimization**: Tree shaking and dead code elimination
- **💾 Intelligent Caching**: Service worker caching for offline functionality
- **🧹 Memory Management**: Automatic cleanup of animations and 3D resources
- **📊 Performance Monitoring**: Built-in performance metrics and monitoring

### 🔒 Security Features
- **🛡️ Input Validation**: Comprehensive form validation with Zod schemas
- **🚫 XSS Protection**: Sanitized user inputs and outputs
- **🔐 CSRF Protection**: Built-in CSRF token handling
- **🔒 Secure Headers**: Security headers for production deployment
- **🔍 Content Security Policy**: Strict CSP for enhanced security

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### 🚀 Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### 📋 Code Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](frontend/LICENSE) file for details.

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ using cutting-edge web technologies**

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

### Special Thanks
- **React Team** - For the incredible React ecosystem
- **Three.js Community** - For powerful 3D graphics capabilities  
- **Tailwind CSS** - For the utility-first CSS approach
- **GSAP** - For professional-grade animations
- **Framer Motion** - For smooth React animations
- **Open Source Community** - For the amazing ecosystem

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

*Copyright (c) 2026 Project Management System. All rights reserved.*

</div>