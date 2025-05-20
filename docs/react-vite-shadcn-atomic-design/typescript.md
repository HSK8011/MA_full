# TypeScript Guidelines

This document outlines TypeScript best practices for our React application using Shadcn UI components and following the Atomic Design pattern.

## Core Principles

1. **Type Safety**: Use TypeScript to catch type errors at compile time.
2. **Readability**: Write clear, self-documenting types.
3. **Reusability**: Create reusable type definitions.
4. **Consistency**: Follow consistent typing patterns throughout the codebase.
5. **Strictness**: Use TypeScript's strict mode for enhanced type checking.

## TypeScript Configuration

Our TypeScript configuration is defined in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Type Definitions

### 1. React Component Types

Define props using interfaces:

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  children,
  onClick,
}: ButtonProps) => {
  // Component implementation
};
```

### 2. Extending HTML Element Props

Extend native HTML element props:

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div>
      <label>{label}</label>
      <input {...props} />
      {error && <p>{error}</p>}
    </div>
  );
};
```

### 3. Type Unions for Variants

Use type unions for component variants:

```tsx
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  // other props
}
```

### 4. Type Aliases vs Interfaces

- Use **interfaces** for object types that will be implemented or extended.
- Use **type aliases** for unions, primitives, tuples, or complex types that won't be extended.

```tsx
// Interface example (extendable)
interface User {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends User {
  role: 'admin';
  permissions: string[];
}

// Type alias example (union)
type Status = 'idle' | 'loading' | 'success' | 'error';

// Type alias example (complex type)
type FetchResult<T> = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: T }
  | { status: 'error', error: Error };
```

## Hooks and Custom Hooks

### 1. Typing React Hooks

Always provide type parameters to React hooks:

```tsx
// useState
const [count, setCount] = useState<number>(0);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// useReducer
type State = { count: number };
type Action = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset', payload: number };

const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, { count: 0 });
```

### 2. Custom Hooks

Type your custom hooks thoroughly:

```tsx
type UseToggleReturn = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

function useToggle(initialState = false): UseToggleReturn {
  const [isOpen, setIsOpen] = useState<boolean>(initialState);
  
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  
  return { isOpen, toggle, open, close };
}
```

## Event Handling

Type your event handlers correctly:

```tsx
// Button click
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // Handle click
};

// Input change
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const value = event.target.value;
  // Handle change
};

// Form submission
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  // Handle form submission
};
```

## API and Data Types

### 1. API Response Types

Define types for API responses:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface PostsResponse {
  posts: Post[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Using the types
const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');
  const data = await response.json();
  return data;
};
```

### 2. API Request Types

Define types for API requests:

```tsx
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
}

// Using the types
const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  return data;
};
```

## Type Utilities

### 1. Partial Types

Use `Partial<T>` for optional updates:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Only some fields required for update
const updateUser = (id: string, userData: Partial<Omit<User, 'id'>>) => {
  // Update implementation
};

// Usage
updateUser('user-123', { name: 'New Name' }); // Valid
updateUser('user-123', { email: 'new@example.com' }); // Valid
```

### 2. Pick and Omit

Use `Pick<T, K>` and `Omit<T, K>` to create derived types:

```tsx
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// Only pick certain fields for public display
type PublicUser = Omit<User, 'password'>;

// Only include specific fields for profile
type UserProfile = Pick<User, 'id' | 'name' | 'avatar'>;
```

### 3. Record Type

Use `Record<K, T>` for dictionaries:

```tsx
// Map of user IDs to user objects
const userMap: Record<string, User> = {};

// Map of configuration keys to values
const config: Record<string, string | number | boolean> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  debug: true,
};
```

## Component Prop Types with Shadcn UI

When working with Shadcn UI components, follow these patterns:

### 1. Class Variance Authority with TypeScript

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        destructive: "...",
      },
      size: {
        default: "...",
        sm: "...",
        lg: "...",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Combine VariantProps with other props
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

### 2. Slot Pattern with TypeScript

When using Radix UI's Slot component:

```tsx
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const Button = ({
  asChild = false,
  className,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={className} {...props} />;
};
```

## Best Practices

1. **Always Use Type Annotations**: Add return types to functions and explicit types to variables when not obvious.
   ```tsx
   function getUserName(user: User): string {
     return user.name;
   }
   ```

2. **Avoid `any`**: Use `unknown` instead when type is truly unknown, and add type guards.
   ```tsx
   function processValue(value: unknown): string {
     if (typeof value === 'string') {
       return value.toUpperCase();
     }
     return String(value);
   }
   ```

3. **Use Type Guards**: Create custom type guards for complex types.
   ```tsx
   function isUser(value: unknown): value is User {
     return (
       typeof value === 'object' &&
       value !== null &&
       'id' in value &&
       'name' in value &&
       'email' in value
     );
   }
   ```

4. **Readonly for Immutability**: Use `readonly` for immutable properties/arrays.
   ```tsx
   interface Config {
     readonly apiKey: string;
     readonly environment: 'dev' | 'staging' | 'prod';
   }
   
   function processItems(items: readonly string[]): number {
     // Cannot modify items
     return items.length;
   }
   ```

5. **Generic Components**: Create reusable components with generics.
   ```tsx
   interface ListProps<T> {
     items: T[];
     renderItem: (item: T) => React.ReactNode;
   }
   
   function List<T>({ items, renderItem }: ListProps<T>) {
     return (
       <ul>
         {items.map((item, index) => (
           <li key={index}>{renderItem(item)}</li>
         ))}
       </ul>
     );
   }
   
   // Usage
   <List
     items={['Apple', 'Banana', 'Cherry']}
     renderItem={(item) => <span>{item}</span>}
   />
   ```

By following these TypeScript guidelines, we ensure type safety, code quality, and developer productivity throughout our application. 