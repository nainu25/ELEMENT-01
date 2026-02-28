# ELEMENT-01 // Digital Olfactory Laboratory

![ELEMENT-01 Banner] ![alt text](./element-01/src//assets/Dashboard.png)

**ELEMENT-01** is a high-performance, molecular-focused fragrance discovery platform. It treats scent selection as a scientific process, utilizing a "Digital Laboratory" aesthetic to bridge the gap between complex chemistry and luxury consumer experience.

## 🔬 Core Philosophy

The project is built around the concept of **Olfactory Allocation**. Instead of traditional shopping, users navigate a scientific index of molecular specimens, each documented with technical precision:
- **Formula Codes**: Unique identifiers for every specimen.
- **Molecular Data**: Precise tracking of weight, concentration, and volatility.
- **Structural Hierarchy**: Visualization of top, heart, and base layers as a molecular pyramid.

## 🚀 Key Features

### 1. Scent Discovery Algorithm (Phase 01-03)
An interactive diagnostic tool that correlates user environmental preferences with molecular stability parameters to find the optimal olfactory match.

### 2. Digital Specimen Index
- **High-Tech Grid**: Optimized 2x3 grid display for focused analysis.
- **Scanner Animation**: Visual confirmation of specimen integrity upon interaction.
- **Dynamic Theming**: Full support for `Laboratory_Light` and `Atmospheric_Dark` modes.

### 3. Allocation Protocol (Checkout)
A secure checkout flow that simulates a laboratory requisition process. Integrates with Stripe for secure transaction handling.

### 4. Inventory Management
A centralized dashboard for real-time monitoring of molecular stock levels and specimen data management.

## 🛠 Technical Specification

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Runtime** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Database** | Supabase |
| **State** | Zustand |
| **Payments** | Stripe |
| **Theming** | next-themes |
| **VCS** | Git |

## 📦 Laboratory Setup

### Prerequisites
- Node.js (Late-model Version)
- npm or yarn

### Installation Sequence
```bash
# 01. Clone the repository
git clone [repository-url]

# 02. Navigate to node
cd ELEMENT-01

# 03. Initialize dependencies
npm install

# 04. Configure variables
cp .env.example .env.local
# Add your Supabase and Stripe credentials
```

### Development Protocol
```bash
npm run dev
```

## 🎨 Design System

The platform adheres to a strict "Scientific Minimalist" design language:
- **Typography**: `Geist Mono` for all technical data and headers.
- **Palette**: Monochromatic base with `Atomic Orange` (#FF5F00) highlights for active states.
- **Transitions**: 500ms duration for theme shifts to simulate atmospheric adjustment.

---

**Developed by E01-LABS // © 2026. Molecular Discovery Protocol v4.2.**
