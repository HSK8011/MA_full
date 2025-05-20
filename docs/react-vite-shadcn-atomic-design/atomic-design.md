# Atomic Design Pattern with Shadcn UI

This document outlines the implementation of the Atomic Design pattern in our React application using Shadcn UI components.

## Overview

Atomic Design is a methodology composed of five distinct stages working together to create interface design systems in a more deliberate and hierarchical manner. The five stages of Atomic Design are:

1. **Atoms**
2. **Molecules**
3. **Organisms**
4. **Templates**
5. **Pages**

## Implementation with Shadcn UI

### 1. Atoms

Atoms are the basic building blocks of matter. In our UI, atoms are:

- Shadcn UI base components (Button, Input, Label, etc.)
- Typography elements (h1, p, etc. using the `cn` utility)
- Icons (Lucide icons)
- Basic UI elements (Separator, Badge, etc.)

#### Example: Button Atom

```tsx
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 2. Molecules

Molecules are groups of atoms bonded together that take on new properties. In our UI:

- Form fields (combining Label, Input, and FormMessage)
- Card with header and content
- ComboBox with label
- Dialog with trigger
- Dropdown menu with items

#### Example: FormField Molecule

```tsx
import { Label } from "@/components/atoms/ui/label";
import { Input } from "@/components/atoms/ui/input";
import { FormMessage } from "@/components/atoms/ui/form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

export const FormField = ({
  label,
  id,
  type = "text",
  placeholder,
  error,
  className,
  required = false,
  ...props
}: FormFieldProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(error && "border-destructive")}
        aria-invalid={!!error}
        required={required}
        {...props}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
};
```

### 3. Organisms

Organisms are groups of molecules joined together to form a relatively complex, distinct section of an interface:

- Forms with multiple form fields
- Navigation bars with dropdowns
- Data tables with sorting and filtering
- Complex cards with multiple interactive elements
- Sidebar with navigation items

#### Example: Header Organism

```tsx
import { Button } from "@/components/atoms/ui/button";
import { Logo } from "@/components/atoms/Logo";
import { MobileMenu } from "@/components/molecules/MobileMenu";
import { NavigationMenu } from "@/components/molecules/NavigationMenu";
import { UserDropdown } from "@/components/molecules/UserDropdown";

export const Header = ({ user }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-4">
          <Logo />
          <NavigationMenu className="hidden md:flex" />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
              <Button size="sm">Sign up</Button>
            </div>
          )}
          <MobileMenu className="md:hidden" />
        </div>
      </div>
    </header>
  );
};
```

### 4. Templates

Templates are page-level objects that place components into a layout and articulate the design's underlying content structure:

- Dashboard layouts
- Authentication page layouts
- Settings page layouts
- Profile page layouts

#### Example: DashboardTemplate

```tsx
import { Sidebar } from "@/components/organisms/Sidebar";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";
import { Footer } from "@/components/organisms/Footer";

interface DashboardTemplateProps {
  children: React.ReactNode;
}

export const DashboardTemplate = ({ children }: DashboardTemplateProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
```

### 5. Pages

Pages are specific instances of templates that show what a UI looks like with real representative content in place:

- Home page
- Dashboard page
- Settings page
- Profile page

#### Example: DashboardPage

```tsx
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";
import { AnalyticsCards } from "@/components/organisms/AnalyticsCards";
import { RecentPosts } from "@/components/organisms/RecentPosts";
import { UpcomingPosts } from "@/components/organisms/UpcomingPosts";

export const DashboardPage = () => {
  return (
    <DashboardTemplate>
      <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl mb-6">Dashboard</h1>
      <AnalyticsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <RecentPosts />
        <UpcomingPosts />
      </div>
    </DashboardTemplate>
  );
};
```

## Component Directory Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── ui/ (shadcn components)
│   │   └── custom/ (custom atomic components)
│   ├── molecules/
│   ├── organisms/
│   └── templates/
```

## Best Practices

1. **Reusability**: Design components to be reusable across different parts of the application.
2. **Composition**: Prefer composition over inheritance for maximum flexibility.
3. **Props**: Use well-defined prop interfaces for all components.
4. **Styling**: Use Tailwind CSS with the `cn` utility for consistent styling.
5. **Naming**: Use clear, descriptive names for components.
6. **Documentation**: Document component props and usage with comments.
7. **Testing**: Create unit tests for all components, especially atoms and molecules. 