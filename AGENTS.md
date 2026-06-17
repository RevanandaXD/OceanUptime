# AGENTS.md

## Project Overview

Project Name: OceanUptime

OceanUptime is a multi-provider website monitoring dashboard that allows users to monitor uptime, response time, deployment status, SSL validity, and infrastructure health across multiple hosting providers such as Vercel, Netlify, Cloudflare Pages, Railway, and GitHub Pages.

The system should provide a unified dashboard for monitoring all websites and services from a single interface.

---

# Primary Goals

1. Monitor website availability.
2. Measure response time.
3. Store uptime history.
4. Detect downtime incidents.
5. Monitor SSL certificate expiration.
6. Integrate deployment information from hosting providers.
7. Support notifications (Email, Discord, Telegram).
8. Provide analytics and uptime reports.

---

# Tech Stack

Frontend:

* Next.js 16+
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Next.js Route Handlers
* Server Actions

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* NextAuth/Auth.js

Deployment:

* Vercel

Monitoring Jobs:

* Vercel Cron
* GitHub Actions (fallback)

---

# Architecture

Modules:

1. Authentication
2. Website Management
3. Monitoring Engine
4. Deployment Integrations
5. SSL Monitoring
6. Notifications
7. Analytics Dashboard

---

# Database Models

## User

Fields:

* id
* name
* email
* createdAt

## Website

Fields:

* id
* name
* url
* provider
* isActive
* createdAt

## WebsiteCheck

Fields:

* id
* websiteId
* status
* responseTime
* statusCode
* checkedAt

## Incident

Fields:

* id
* websiteId
* startedAt
* resolvedAt
* duration
* reason

## SSLCertificate

Fields:

* id
* websiteId
* issuer
* expiresAt
* daysRemaining

## Deployment

Fields:

* id
* websiteId
* provider
* deploymentId
* status
* commitHash
* deployedAt

---

# Supported Providers

Phase 1:

* Generic HTTP Monitoring

Phase 2:

* Vercel API
* Netlify API
* Cloudflare Pages API

Phase 3:

* Railway API
* Render API
* GitHub API

---

# Monitoring Rules

Monitoring checks should:

* Run every 5 minutes.
* Record response time.
* Record HTTP status code.
* Record availability status.
* Handle redirects.
* Timeout after 10 seconds.

Status Logic:

200-399 => UP

400-599 => DOWN

Timeout => DOWN

Network Error => DOWN

---

# SSL Monitoring

Check:

* Expiration date
* Issuer
* Days remaining

Warning Levels:

30 days remaining => Warning

14 days remaining => Critical

7 days remaining => Urgent

---

# Dashboard Features

Overview Page:

* Total websites
* Online websites
* Offline websites
* Average response time
* Active incidents

Website Details:

* Uptime percentage
* Response time graph
* Incident history
* SSL status
* Deployment history

---

# Notification Channels

Phase 1:

* Email

Phase 2:

* Discord Webhook
* Telegram Bot

Phase 3:

* Slack

Triggers:

* Website Down
* Website Recovered
* SSL Expiring
* Deployment Failed

---

# API Design

REST endpoints:

GET /api/websites

POST /api/websites

GET /api/websites/:id

DELETE /api/websites/:id

GET /api/checks

GET /api/incidents

GET /api/deployments

GET /api/ssl

---

# Coding Standards

General Rules:

* Use TypeScript everywhere.
* Avoid "any".
* Prefer Server Components.
* Use Zod for validation.
* Use Prisma for database access.
* Use Server Actions when appropriate.
* Use async/await.
* No duplicated business logic.

Performance Rules:

* Minimize database queries.
* Use pagination.
* Cache expensive operations.
* Avoid unnecessary client components.

---

# UI Guidelines

Theme:

* Modern SaaS dashboard
* Dark mode support
* Responsive design

Components:

* Data tables
* Status badges
* Charts
* Activity timeline
* Monitoring cards

---

# Future Features

* Public status pages
* Team collaboration
* Custom domains
* Status page branding
* Real-time websocket updates
* Multi-tenant organizations
* API monitoring
* Cron monitoring
* Database monitoring

---

# Success Criteria

The project is considered MVP-complete when:

* Users can add websites.
* Monitoring checks run automatically.
* Downtime is recorded.
* Dashboard displays status.
* Response times are tracked.
* SSL expiration is tracked.
* Notifications work.
* Deployment integrations work for Vercel.
