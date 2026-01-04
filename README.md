# NhatCapDang

A modern Next.js application showcasing token swap functionality, code examples, and best practices for React/TypeScript development.

## 🚀 Features

- **Token Swap Interface**: Interactive UI for swapping cryptocurrency tokens with real-time price calculations
- **Multi-language Support**: Built-in internationalization using `next-intl`
- **Dark Mode**: Theme switching with `next-themes`
- **Type-Safe Forms**: Form validation using `react-hook-form` and `zod`
- **Modern UI Components**: Custom components built with Radix UI and Tailwind CSS
- **Code Examples**: Interactive code tabs showcasing different programming solutions
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Leveraging Next.js 15 with Turbopack

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 15.5.4](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **React**: 19.2.0
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

### UI Components
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)
- **Syntax Highlighting**: [Shiki](https://shiki.style/)

### State Management & Data Fetching
- **State**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

### Development Tools
- **Build Tool**: Turbopack
- **Linting**: ESLint
- **Git Hooks**: Husky
- **Package Manager**: Yarn 4.12.0

## 📋 Prerequisites

- Node.js 20.x or higher
- Yarn 4.12.0 (included via packageManager)

## 🚦 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Nhatcapdang/code-challenge
cd code-challenge

# Install dependencies
yarn install
```

### Development

```bash
# Run development server (on port 3001)
yarn dev

# Run with type checking
yarn typescript

# Lint code
yarn lint
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

### Production

```bash
# Build for production
yarn build

# Start production server
yarn start
```

## 📁 Project Structure

```
nhatcapdang-1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── (main)/        # Main layout group
│   │   │   └── layout.tsx     # Locale layout
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── shadcn-io/   # Custom shadcn components
│   │   │   └── *.tsx        # UI primitives
│   │   ├── form/            # Form components
│   │   ├── navbar/          # Navigation components
│   │   ├── swap.tsx         # Token swap component
│   │   ├── problem1.tsx     # Code example #1
│   │   └── problem3.tsx     # Code example #3
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── providers/           # Context providers
│   ├── stores/              # Zustand stores
│   └── @types/              # TypeScript type definitions
├── messages/                # i18n translation files
├── public/                  # Static assets
└── components.json          # shadcn/ui configuration
```

## 🎨 Key Components

### Token Swap
The main feature allowing users to swap between different cryptocurrency tokens with:
- Real-time price calculations
- Token selection with search
- Amount validation
- Success animations with confetti
- Transaction history

### Code Examples
Interactive code tabs demonstrating:
- **Problem 1**: Multiple implementations of sum_to_n function
- **Problem 3**: Code refactoring and best practices analysis

### UI Components
Comprehensive set of accessible, customizable components:
- Forms (Input, Textarea, Select, Checkbox)
- Navigation (Menu, Breadcrumb, Sidebar)
- Feedback (Alert, Dialog, Toast, Spinner)
- Data Display (Card, Avatar, Badge, Separator)
- Layout (Sheet, Collapsible, Tabs)

## 🌐 Internationalization

The app supports multiple languages using `next-intl`. Translation files are located in the `messages/` directory.

To add a new language:
1. Create a new JSON file in `messages/` (e.g., `fr.json`)
2. Add translations following the existing structure
3. Update the i18n configuration

## 🎯 Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server on port 3001 with Turbopack |
| `yarn build` | Build production bundle |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint |
| `yarn typescript` | Type check without emitting files |
| `yarn prepare` | Setup Husky git hooks |

## 🔧 Configuration

### Tailwind CSS
Configuration is handled through the new Tailwind CSS 4 setup with PostCSS.

### TypeScript
Strict mode enabled with comprehensive type checking. See `tsconfig.json` for details.

### ESLint
Custom ESLint configuration with Next.js and React best practices.

## 🎨 Styling Guidelines

- Use Tailwind utility classes for styling
- Follow mobile-first responsive design
- Maintain consistent spacing with Tailwind's spacing scale
- Use CSS variables for theme colors (defined in `globals.css`)
- Support dark mode using CSS variables

## 📦 Adding UI Components

This project uses a custom component system inspired by shadcn/ui. To add new components:

```bash
# Using shadcn CLI
npx shadcn@latest add [component-name]
```

Components are configured via `components.json` and support multiple registries.

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new code
3. Ensure components are accessible (ARIA attributes, keyboard navigation)
4. Write meaningful commit messages
5. Test thoroughly before submitting

## 📝 Code Style

- Use functional components with TypeScript interfaces
- Prefer `const` arrow functions for component definitions
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`)
- Implement proper error handling and validation
- Follow React best practices (hooks rules, component composition)
- Use early returns for cleaner code

## 🔒 Environment Variables

Create a `.env.local` file in the root directory for environment-specific variables:

```env
# Add your environment variables here
NEXT_PUBLIC_API_URL=your_api_url
```

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- All other open-source libraries used in this project

---

Built with ❤️ using Next.js and TypeScript

