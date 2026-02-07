<div align="center">
  <h1>🧭 SkillPilot</h1>
  <p><strong>Navigate Your Career Like Git for Your Future</strong></p>
  <p>An AI-powered career planning platform that enables parallel career path exploration with persistent skill tracking.</p>
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Database](#-database)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About

**SkillPilot** transforms career planning from a linear process into a dynamic, multi-dimensional journey. Just like Git allows developers to branch, experiment, and merge code, SkillPilot enables professionals and students to:

- **Branch**: Create multiple parallel career paths without losing progress
- **Experiment**: Test different career trajectories simultaneously
- **Merge**: Leverage shared skills across different paths
- **Track**: Monitor progress with intelligent analytics and AI insights

Traditional career planning forces you to choose one path. SkillPilot lets you explore multiple futures at once, making informed decisions based on data, not guesswork.

---

## ✨ Features

### 🎯 **Parallel Career Paths**
Create and manage multiple career trajectories simultaneously. Compare "Frontend Developer" vs "Data Scientist" paths side-by-side without losing progress in either.

### 📊 **Persistent Skill Tracking**
Skills you acquire belong to you, not just a career path. Delete or archive a path, but keep all the skills and progress you've built.

### 🤖 **AI-Powered Insights**
- Intelligent skill gap analysis
- Personalized learning recommendations
- Realistic timeline predictions
- Conflict detection when paths overlap

### 📈 **Visual Analytics**
- Progress tracking with beautiful dashboards
- Skill distribution charts
- Career path comparisons
- Time investment visualizations

### 🎨 **Modern UI/UX**
- Clean, intuitive interface with dark mode support
- Smooth animations powered by Framer Motion
- Responsive design for all devices
- Glass-morphism cards and modern color palette

### 🔐 **Secure Authentication**
- Google OAuth integration via NextAuth.js
- Secure session management
- User data privacy and protection

---

## 🛠 Tech Stack

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Recharts](https://recharts.org/)** - Data visualization
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### **Backend & Database**
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication

### **Development Tools**
- **[Turborepo](https://turborepo.dev/)** - Monorepo management
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 📁 Project Structure

```
SkillPilot/
├── apps/
│   ├── docs/              # Documentation site (Next.js)
│   └── web/               # Main web application (Next.js)
│       ├── app/           # Next.js App Router pages
│       ├── components/    # React components
│       ├── lib/           # Utility functions & configs
│       └── public/        # Static assets
├── packages/
│   ├── ai-engine/         # AI integration & logic
│   ├── db/                # Prisma schema & migrations
│   ├── types/             # Shared TypeScript types
│   ├── ui/                # Shared UI components
│   ├── eslint-config/     # Shared ESLint configurations
│   └── typescript-config/ # Shared TypeScript configurations
├── turbo.json             # Turborepo configuration
├── package.json           # Root package configuration
└── pnpm-workspace.yaml    # pnpm workspace configuration
```

---

## 🎯 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/skillpilot.git
   cd SkillPilot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env
   ```
   
   Edit `apps/web/.env` with your configuration (see [Environment Variables](#-environment-variables))

4. **Set up the database**
   ```bash
   cd packages/db
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Development

### Run all apps in development mode
```bash
pnpm dev
```

### Run a specific app
```bash
# Web app only
turbo dev --filter=web

# Docs only
turbo dev --filter=docs
```

### Build for production
```bash
pnpm build
```

### Type checking
```bash
pnpm check-types
```

### Linting
```bash
pnpm lint
```

### Format code
```bash
pnpm format
```

---

## 🗄 Database

SkillPilot uses **Prisma** as the ORM with **PostgreSQL** as the database.

### Database Schema Management

```bash
# Navigate to db package
cd packages/db

# Generate Prisma Client
pnpm prisma generate

# Push schema changes to database (development)
pnpm prisma db push

# Create a migration (production)
pnpm prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
pnpm prisma studio
```

### Key Models

- **User** - User accounts and authentication
- **CareerPlan** - Individual career paths
- **Skill** - Skills library with categories
- **UserSkill** - User's skill progress and proficiency
- **CareerSkillMapping** - Skills associated with career paths

---

## 🔐 Environment Variables

Create a `.env` file in `apps/web/` with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/skillpilot"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Integration (Optional)
OPENAI_API_KEY="your-openai-api-key"
```

> **Note**: Never commit your `.env` file to version control. Use `.env.example` as a template.

---

## 📜 Scripts

### Root Level Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all code with Prettier |
| `pnpm check-types` | Type-check all packages |

### Web App Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start Next.js dev server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Lint the web app |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Standards

- Write TypeScript with strict type checking
- Follow the existing code style (enforced by ESLint & Prettier)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgments

- Built with ❤️ using [Next.js](https://nextjs.org/), [React](https://reactjs.org/), and [TypeScript](https://www.typescriptlang.org/)
- Monorepo managed by [Turborepo](https://turborepo.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">
  <p>Made with 🧭 by the SkillPilot Team</p>
  <p>
    <a href="https://github.com/yourusername/skillpilot">GitHub</a> •
    <a href="https://skillpilot.dev">Website</a> •
    <a href="https://twitter.com/skillpilot">Twitter</a>
  </p>
</div>
