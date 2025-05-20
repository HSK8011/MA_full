# Styling Guidelines

This document outlines the styling practices for our React application using Shadcn UI components, TailwindCSS, and following the Atomic Design pattern.

## Core Principles

1. **Consistency**: Use consistent styling patterns across the application.
2. **Responsiveness**: Design for all screen sizes with a mobile-first approach.
3. **Accessibility**: Ensure styles meet accessibility standards (contrast, focus states, etc.).
4. **Reusability**: Create reusable style patterns with Tailwind and the `cn` utility.
5. **Theme Alignment**: Adhere to the design system defined in the tailwind config.

## Technology Stack

- **TailwindCSS**: Primary styling utility
- **Class Variance Authority (cva)**: For component variants
- **Tailwind Merge**: For class name merging
- **clsx**: For conditional class names

## Utility Functions

We use a utility function `cn` that combines clsx and tailwind-merge:

```tsx
// src/lib/utils.ts
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This function should be used when combining class names, especially when some classes are conditional.

## Theme Configuration

Our theme is defined in `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Define your keyframes here
      },
      animation: {
        // Define your animations here
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

## Component Styling Approaches

### 1. TailwindCSS Classes

Use TailwindCSS classes directly for most styling needs:

```tsx
<div className="flex items-center space-x-4 p-4 bg-background rounded-lg shadow-sm">
  <h2 className="text-xl font-semibold text-foreground">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

### 2. Class Variance Authority (cva)

Use cva for components with variants:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
};
```

### 3. Conditional Styling

Use the `cn` utility for conditional styling:

```tsx
<div
  className={cn(
    "base-class-always-applied",
    isActive && "active-class",
    isDisabled ? "disabled-class" : "enabled-class",
    className // Allow component consumers to extend styles
  )}
>
  Content
</div>
```

## Responsive Design

Follow these best practices for responsive design:

### 1. Mobile-First Approach

Start with mobile styles and add breakpoint modifiers for larger screens:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>
```

### 2. Standard Breakpoints

Use Tailwind's default breakpoints consistently:

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

### 3. Fluid Typography

Use responsive font sizes:

```tsx
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Heading
</h1>
```

### 4. Touch-Friendly UI

Ensure touch targets are large enough on mobile (minimum 44px):

```tsx
<button className="h-11 w-11 sm:h-10 sm:w-10">
  <span className="sr-only">Menu</span>
  <MenuIcon className="h-5 w-5" />
</button>
```

## Dark Mode Support

We support dark mode using Tailwind's dark mode feature:

```tsx
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
  Dark mode supported content
</div>
```

A theme toggle can be implemented like this:

```tsx
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-md bg-background"
    >
      Toggle theme
    </button>
  );
}
```

## Consistent Spacing

Use Tailwind's spacing scale consistently:

- `0`: 0px
- `0.5`: 0.125rem (2px)
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `5`: 1.25rem (20px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `10`: 2.5rem (40px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `20`: 5rem (80px)
- `24`: 6rem (96px)

## Accessibility

Follow these accessibility practices:

1. **Color Contrast**: Ensure sufficient contrast between text and background colors.
2. **Focus States**: Maintain visible focus states for keyboard navigation.
3. **Reduced Motion**: Respect user preferences for reduced motion.
4. **Screen Reader Text**: Use `.sr-only` for screen-reader-only content.

Example of accessible styling:

```tsx
<button
  className={cn(
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "motion-reduce:transition-none",
    "bg-primary text-primary-foreground hover:bg-primary/90"
  )}
>
  <span className="sr-only">Close</span>
  <XIcon className="h-4 w-4" />
</button>
```

## Best Practices

1. **Avoid Inline Styles**: Use TailwindCSS classes instead of inline styles.
2. **Consistency**: Use the same spacing, colors, and typographic scales throughout.
3. **Component Props**: Allow style overrides through component props.
4. **Reusable Patterns**: Extract common patterns into reusable components.
5. **Theme Variables**: Use theme variables rather than hardcoded values.
6. **Responsive Testing**: Test on various screen sizes and devices.
7. **Documentation**: Document any complex styling patterns for team reference.

By following these styling guidelines, we ensure a consistent, accessible, and maintainable design system throughout our application. 