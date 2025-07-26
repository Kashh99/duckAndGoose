# Frontend Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
cd src/frontend
npm install
```

### Development
```bash
npm start
```
The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── index.ts         # Component exports
│   ├── App.tsx          # Main application
│   ├── FileUpload.tsx   # File upload component
│   ├── NAVAnalysis.tsx  # Analysis results
│   ├── Button.tsx       # Button component
│   ├── Card.tsx         # Card container
│   ├── LoadingSpinner.tsx # Loading indicator
│   └── StatusBadge.tsx  # Status indicator
├── types/               # TypeScript definitions
├── services/            # API services
└── index.css           # Global styles
```

## 🎨 Design System

### Colors
- **Primary**: `#2563eb` (Blue)
- **Success**: `#16a34a` (Green)
- **Warning**: `#d97706` (Orange)
- **Danger**: `#dc2626` (Red)

### Typography
- **UI Font**: Inter
- **Code Font**: JetBrains Mono

### Components

#### Button
```tsx
import { Button } from './components';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

#### Card
```tsx
import { Card } from './components';

<Card padding="lg" shadow="md">
  Content here
</Card>
```

#### StatusBadge
```tsx
import { StatusBadge } from './components';

<StatusBadge type="success" text="Completed" />
```

## 🔧 Development

### Adding New Components
1. Create component in `src/components/`
2. Add TypeScript interfaces
3. Include JSDoc documentation
4. Export from `src/components/index.ts`

### Styling
- Use Tailwind CSS classes
- Follow the design system
- Maintain responsive design
- Ensure accessibility

### TypeScript
- Use strict typing
- Define interfaces for props
- Avoid `any` type
- Use proper type guards

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Best Practices
- Mobile-first approach
- Touch-friendly interactions
- Optimized typography scaling
- Efficient use of screen space

## ♿ Accessibility

### Requirements
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

### Implementation
- Use semantic HTML
- Add ARIA labels
- Ensure logical tab order
- Test with screen readers

## 🚀 Deployment

### Build
```bash
npm run build
```

### Serve
```bash
npx serve -s build
```

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_ENV`: Environment (development/production)

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

## 📚 Resources

- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Happy coding! 🎉** 