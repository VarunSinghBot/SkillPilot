# Contributing to SkillPilot

First off, thank you for considering contributing to SkillPilot! 🎉

It's people like you that make SkillPilot such a great tool for career planning and skill development.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Project Structure](#project-structure)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Focus on what is best** for the community
- **Show empathy** towards other community members

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When suggesting an enhancement:

- **Use a clear and descriptive title**
- **Provide detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Include mockups** or examples if applicable

### 🔨 Pull Requests

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests if applicable
3. Ensure the test suite passes
4. Make sure your code lints
5. Update documentation as needed
6. Issue the pull request!

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.0.0
- PostgreSQL database

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/skillpilot.git
   cd SkillPilot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Type Checking

```bash
pnpm check-types
```

### Linting

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the style guidelines
   - Add comments for complex logic
   - Update documentation

3. **Test your changes**
   ```bash
   pnpm check-types
   pnpm lint
   pnpm build
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Request review from maintainers

## Style Guidelines

### TypeScript

- Use **TypeScript** for all new code
- Enable strict mode in `tsconfig.json`
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Avoid `any` type - use `unknown` if necessary

### React

- Use **functional components** with hooks
- Follow the [React Hooks rules](https://reactjs.org/docs/hooks-rules.html)
- Use **TypeScript** for prop types
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks

### File Naming

- **Components**: PascalCase (e.g., `CareerCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useCareerPlans.ts`)
- **Types**: PascalCase (e.g., `CareerPlan.ts`)

### Code Formatting

We use **Prettier** for code formatting:

```bash
pnpm format
```

### ESLint Rules

Follow the ESLint configuration. Run:

```bash
pnpm lint
```

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(dashboard): add career path comparison feature

fix(auth): resolve Google OAuth redirect issue

docs(readme): update installation instructions

refactor(api): simplify career plan endpoints
```

## Project Structure

Understanding the project structure helps you navigate the codebase:

```
SkillPilot/
├── apps/
│   ├── docs/              # Documentation site
│   └── web/               # Main application
│       ├── app/           # Next.js pages (App Router)
│       ├── components/    # React components
│       ├── lib/           # Utilities and configs
│       └── public/        # Static assets
├── packages/
│   ├── ai-engine/         # AI integration
│   ├── db/                # Database (Prisma)
│   ├── types/             # Shared types
│   └── ui/                # Shared components
└── ...config files
```

### Component Organization

```
components/
├── dashboard/             # Dashboard-specific components
├── career/               # Career path components
├── layout/               # Layout components (Navbar, Footer)
└── ui/                   # Reusable UI components
```

## Database Changes

When modifying the database schema:

1. Update the Prisma schema in `packages/db/prisma/schema.prisma`
2. Generate Prisma Client: `pnpm prisma generate`
3. Create a migration: `pnpm prisma migrate dev --name your_migration_name`
4. Update TypeScript types if needed
5. Document the changes in your PR

## Questions?

Don't hesitate to ask questions! You can:

- Open a [GitHub issue](https://github.com/yourusername/skillpilot/issues)
- Join our [Discord community](https://discord.gg/skillpilot)
- Email us at contribute@skillpilot.dev

---

Thank you for contributing to SkillPilot! 🚀
