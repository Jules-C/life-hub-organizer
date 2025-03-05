I'll update the README to include deployment instructions, particularly for the Supabase components we've been discussing.

# LifeHubOrganizer

A comprehensive life organization system designed to manage the complexities of multi-generational family life in one centralized platform.

## Project Overview

LifeHubOrganizer aims to reduce information overload and cognitive burden by consolidating documents, schedules, emails, and tasks into a single, intelligent system. The project specifically addresses the unique challenges of managing both young children's activities and aging parents' needs.

### Key Features

- **Document Management** - Capture, organize, and find important documents for all family members with **customizable document types and metadata schemas**
- **Health Tracking** - Private, secure tracking of personal health data including period tracking
- **Personal & Work Scheduling** - Manage personal commitments and work schedules with privacy controls
- **Calendar Integration** - Unified view of all family schedules with specialized views for different needs
- **Email Processing** - Smart filtering and prioritization to reduce notification fatigue
- **Multi-generational Task Management** - Age-appropriate task assignment and tracking
- **Medical Document Subsystem** - Specialized handling of healthcare information
- **School & Activity Management** - Permission slips, schedules, and requirements tracking
- **Caregiver Coordination** - Tools for managing elder care with outside caregivers
- **Context-Aware Dashboard** - Information when and where you need it
- **Family Management** - Family creation, member invitations, and role-based access controls

## Project Documentation

This repository contains comprehensive documentation for the LifeHubOrganizer project:

### 1. Project Definition

- **Project-Requirements.md** - Detailed requirements and objectives
- **Technology-Stack.md** - Selected technologies and components
- **Budget-Analysis.md** - Cost projections and optimization strategies
- **Implementation-Roadmap.md** - Phased development plan

### 2. Technical Architecture

- **System-Architecture.svg** - High-level architecture diagram
- **Database-Schema.md** - Database model and relationships
- **API-Endpoints.md** - Backend service specifications
- **System-Integration-Diagram.svg** - Component integration visualization

### 3. User Experience

- **User-Personas.md** - Detailed profiles of different user types
- **User-Journey-Maps.md** - How different users interact with the system
- **UI-Wireframes.svg** - Key interface designs

### 4. Feature Specifications

- **Multi-Generational-Features.md** - Comprehensive breakdown of specialized features including:
  - Caregiver Calendar Integration
  - Medical Document Subsystem
  - School and Activity Management
  - Quiet Hours and Priority Filtering
  - Multi-generational Task Delegation
  - Life Transition Management
  - Family Communication Hub
  - Context-Aware Dashboard

### 5. Risk Management

- **Risk-Assessment.md** - Identified risks and mitigation strategies

## Deployment Guide

### Prerequisites

- Node.js (v16.x or later)
- npm or yarn
- Supabase account
- SMTP server credentials for email functionality (optional)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lifehuborganizer.git
   cd lifehuborganizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` to add your Supabase credentials and other configuration values.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Supabase Setup

1. **Create a Supabase Project**:
   - Sign up/login at [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key for configuration

2. **Database Migration**:
   - Navigate to the SQL Editor in your Supabase dashboard
   - Execute the migration scripts in order:
     1. Run `supabase/migrations/20240226_initial_schema.sql`
     2. Run `supabase/migrations/20240227_health_personal_schema.sql`
     3. Run `supabase/migrations/20240306_invitation_system.sql`

3. **Edge Function Deployment** (for email invitations):
   - In the Supabase dashboard, navigate to Edge Functions
   - Create a new function named "send-invitation-email"
   - Upload or paste the code from `supabase/functions/send-invitation-email/index.js`
   - Set the following environment variables in the Edge Function settings:
     ```
     SMTP_HOST=your-smtp-server.com
     SMTP_PORT=587
     SMTP_USERNAME=your-username
     SMTP_PASSWORD=your-password
     FROM_EMAIL=noreply@yourdomain.com
     FRONTEND_URL=https://your-app-domain.com
     ```

4. **Authentication Setup**:
   - In the Supabase dashboard, go to Authentication → Settings
   - Configure site URL and redirect URLs
   - Enable Email provider and customize email templates
   - Set up any additional auth providers as needed

### Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Deploy to your hosting platform** (e.g., Vercel, Netlify, or your own server):

   **Vercel Deployment**:
   ```bash
   npm install -g vercel
   vercel
   ```

   **Netlify Deployment**:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Set environment variables** on your hosting platform with the same values as your `.env.local` file.

4. **Update Supabase settings**:
   - Update Site URL in Authentication settings to match your production URL
   - Update FRONTEND_URL environment variable in your Edge Function

### Email System Configuration

For the invitation email system to work, you need to:

1. Set up SMTP credentials in your Edge Function environment variables
2. Ensure the `send-invitation-email` function is properly deployed
3. Test the invitation flow in your development environment

### Updating Database Schema

When updating the database schema:

1. Create a new migration file in the `supabase/migrations` directory with a timestamp prefix
2. Apply the migration via the Supabase SQL Editor
3. Update your application code to work with the new schema

## Development Status

This project is currently in the active development phase with the family onboarding system being implemented.

## Budget Constraints

The system is designed to operate within a monthly budget of $40 USD using cloud services with free tiers where possible.

## Timeline

The initial implementation is planned for a 10-week development cycle, with a phased approach to feature deployment.

## Getting Started

1. Review the Project-Requirements.md to understand project goals
2. Examine the Implementation-Roadmap.md to see development phases
3. Set up development environment according to the Deployment Guide above
4. Begin implementation of Phase 0 components

## Contact

For questions or more information about this project, please contact [Your Contact Information].

---

Documentation updated: March 2025