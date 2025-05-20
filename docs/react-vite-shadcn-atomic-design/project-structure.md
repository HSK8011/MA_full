# Project Structure Guidelines

This document outlines the recommended project structure for our React application using Shadcn UI components and following the Atomic Design pattern.

## Directory Structure

The project follows this structure:

```
story_type/
├── docs/
│   ├── api/
│   │   └── [endpoint]/
│   │       └── [method].md
│   │   ├── pages/
│   │   │   ├── HomePage.md
│   │   │   ├── DashboardPage.md
│   │   │   └── AuthenticationComponents.md
│   │   └── react-vite-shadcn-atomic-design/
│   │       ├── atomic-design.md
│   │       ├── project-structure.md
│   │       ├── styling.md
│   │       └── typescript.md
│   ├── public/
│   │   ├── favicon.ico
│   │   └── ...
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── posts.ts
│   │   │   └── ...
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   └── ...
│   │   │   │   └── custom/
│   │   │   │       ├── Logo/
│   │   │   │       │   ├── Logo.tsx
│   │   │   │       │   ├── Logo.test.tsx
│   │   │   │       │   └── index.ts
│   │   │   │       └── ...
│   │   │   ├── molecules/
│   │   │   │   ├── FormField/
│   │   │   │   │   ├── FormField.tsx
│   │   │   │   │   ├── FormField.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── ...
│   │   │   ├── organisms/
│   │   │   │   ├── Header/
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Header.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── ...
│   │   │   └── templates/
│   │   │   │   ├── DashboardTemplate/
│   │   │   │   │   ├── DashboardTemplate.tsx
│   │   │   │   │   ├── DashboardTemplate.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   │   └── ...
│   │   │   ├── context/
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   └── ...
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── ...
│   │   │   ├── lib/
│   │   │   │   ├── utils.ts
│   │   │   │   └── ...
│   │   │   ├── pages/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Home.tsx
│   │   │   │   └── ...
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   ├── types/
│   │   │   │   ├── auth.ts
│   │   │   │   └── ...
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   └── ...
│   ├── .gitignore
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
```

## Component File Structure

### Component Organization

Components should follow a consistent file structure:

#### For atoms, molecules, and organisms:

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.test.tsx
└── index.ts
```

**ComponentName.tsx**
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  // Props definition
}

export const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  return (
    // Component JSX
  );
};
```

**index.ts**
```ts
export * from './ComponentName';
```

**ComponentName.test.tsx**
```tsx
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

### Imports and Exports

- Use named exports for components.
- Use barrel exports (index.ts files) for cleaner imports.
- Use absolute imports with path aliases.

```tsx
// Good
import { Button } from '@/components/atoms/ui/button';

// Avoid
import Button from '../../../../components/atoms/ui/Button';
```

## Naming Conventions

### Files and Directories

- **Components**: PascalCase for component files and directories (e.g., `Button.tsx`, `FormField/`)
- **Utilities**: camelCase for utility files (e.g., `utils.ts`, `formatDate.ts`)
- **Contexts**: PascalCase followed by "Context" (e.g., `AuthContext.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useAuth.ts`, `useForm.ts`)

### Component Naming

- **Atoms**: Descriptive of the element (e.g., `Button`, `Input`, `Checkbox`)
- **Molecules**: Descriptive of the combination (e.g., `FormField`, `SearchBar`, `MenuItem`)
- **Organisms**: Descriptive of the section (e.g., `Header`, `Footer`, `Sidebar`, `ProductCard`)
- **Templates**: Descriptive of the layout with "Template" suffix (e.g., `DashboardTemplate`, `AuthTemplate`)

## Best Practices

1. **File Placement**: Place components in the correct atomic design category.
2. **Consistent Imports**: Use consistent import ordering (React, external libraries, internal components, styles).
3. **Documentation**: Add JSDoc comments for components and utilities.
4. **Testing**: Co-locate test files with the components they test.
5. **Type Safety**: Use TypeScript interfaces for component props.
6. **Code Splitting**: Use dynamic imports for code splitting when needed.
7. **State Management**: Keep state at the appropriate level (local component state, context, or global state).

## Code Organization

### Component Order

Within a component file, maintain this order:

1. Imports
2. Types/Interfaces
3. Constants
4. Component definition
5. Exports

Example:

```tsx
// 1. Imports
import React from 'react';
import { cn } from '@/lib/utils';

// 2. Types/Interfaces
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

// 3. Constants
const sizeClasses = {
  small: 'px-2 py-1 text-sm',
  medium: 'px-4 py-2',
  large: 'px-6 py-3 text-lg',
};

// 4. Component definition
export const Button = ({ 
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'rounded font-medium',
        sizeClasses[size],
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        variant === 'outline' && 'border border-gray-300 bg-transparent'
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// 5. Exports (if using default export, which is less preferred)
// export default Button;
```

By following these project structure guidelines, we ensure consistency, maintainability, and scalability of our codebase. 