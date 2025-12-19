# Building Thorbis: A Modern Field Service Management Platform for the Next Generation

## Introduction

After years of working with field service companies and witnessing the daily struggles of dispatchers, technicians, and business owners, I decided to build **Thorbis**—a comprehensive field service management platform designed from the ground up with modern technology, real-world workflows, and operational excellence at its core.

This isn't just another software project. It's a response to the fragmented, outdated, and often frustrating tools that service companies have been forced to use. Thorbis represents what field service management should be: fast, reliable, secure, and built for the people who actually use it every day.

---

## What is Thorbis?

Thorbis is an enterprise-grade field service management platform built specifically for home service and commercial trade companies. Whether you're running an HVAC business, plumbing operation, electrical service, or any other field-based service company, Thorbis provides the complete toolkit you need to manage your operations from the first customer call to final payment.

### Core Capabilities

**Customer Management**: A complete CRM that tracks customer information, properties, contact history, and service relationships. Every interaction is logged, every property detail is accessible, and every customer preference is remembered.

**Work Management**: Jobs, estimates, invoices, and scheduling all in one place. Track work from initial quote through completion and payment, with full visibility into job status, technician assignments, and profitability.

**Communications**: Integrated voice, SMS, and email capabilities that keep your team and customers connected. Unlike competitors that fragment communication across platforms, Thorbis unifies all channels in one conversation hub.

**Payments**: Stripe integration with support for subscriptions, metering, and high-value transactions. Process payments seamlessly without the limitations that plague other platforms.

**Field Service**: Mobile-optimized scheduling and dispatch that works offline. Technicians can access job details, update status, and communicate even when connectivity is spotty.

**Reporting & Analytics**: Real-time dashboards that show you what's happening in your business right now, not yesterday's data.

**Multi-tenant Architecture**: Organization-based access control that scales from solo operators to enterprise teams with complex hierarchies.

---

## Why I Started Building Thorbis

### The Problem with Existing Solutions

After working with national HVAC brands and seeing how field service companies operate, I identified critical gaps in the market:

**1. Fragmented Communication**
Most field service platforms treat SMS, email, and voice calls as separate systems. ServiceTitan can't receive photos on toll-free numbers. Housecall Pro limits texting to mobile devices only, forcing office staff to juggle phones while at their desks. This fragmentation creates communication gaps, missed messages, and frustrated customers.

**2. Outdated Technology**
Many field service platforms are built on legacy architectures that can't leverage modern web technologies. They're slow, clunky, and don't take advantage of server-side rendering, streaming, or modern React patterns. This results in poor performance, especially on mobile devices where technicians spend most of their time.

**3. Security Gaps**
Row-Level Security (RLS) is often an afterthought or partially implemented. Critical tables containing customer data, payment information, and communications lack proper access controls. This isn't just a technical issue—it's a compliance and trust issue.

**4. One-Size-Fits-All Approach**
Most platforms force every business into the same workflow, regardless of industry or size. An HVAC company has different needs than a plumbing business, but existing solutions don't adapt. Customization is expensive, time-consuming, or simply not possible.

**5. Performance Problems**
Bundle sizes are bloated, initial page loads are slow, and mobile experiences are subpar. In an industry where technicians are constantly on the move, every second of load time matters.

**6. Missing Real-World Features**
Industry leaders like ServiceTitan track 47+ critical job fields that many platforms ignore. Job costing, profitability tracking, warranty management, and equipment history are often incomplete or missing entirely.

### The Vision

I set out to build a platform that:

- **Puts operators first**: Built alongside dispatchers, technicians, and leaders who rely on it daily
- **Automates with empathy**: AI and automation that remove drudgery while enhancing the human experience
- **Measures outcomes, not features**: Every release tied to customer metrics—faster booking, higher close rates, lower DSO
- **Prioritizes security and dependability**: SOC 2 aligned processes, encryption, and 99.9%+ uptime baked into the culture

---

## Why Thorbis is an Important Stepping Stone for Field Management Systems

### 1. Modern Architecture from Day One

Thorbis is built on **Next.js 16** with **React 19**, leveraging the App Router, Partial Prerendering (PPR), and server-side rendering by default. This isn't just about using the latest technology—it's about building a platform that can scale, perform, and evolve.

**Server Components First**: By default, everything is a server component. This means less JavaScript sent to the browser, faster initial page loads, and better SEO. Client components are only used when interactivity is actually needed.

**Performance Obsession**: We've reduced bundle sizes by 795KB through aggressive optimization. Core Web Vitals are prioritized: LCP under 2.5s, FID under 100ms, CLS under 0.1. Every optimization decision is measured and validated.

**Security by Default**: Row-Level Security (RLS) is enabled on all tables. Server-side validation with Zod ensures data integrity. Every mutation goes through proper authentication and authorization checks.

### 2. Unified Communication Hub

Unlike competitors that fragment communication across platforms, Thorbis provides a **unified conversation hub** that brings SMS, email, voice, and in-app messaging together in one place. This solves the critical problem of communication context loss that plagues existing solutions.

**Multi-Channel Support**: Customers can reach you via their preferred channel, and all conversations are unified in a single thread. No more switching between apps to see the full conversation history.

**Team Collaboration**: Assignment systems, internal notes, real-time presence indicators, and typing indicators make team collaboration seamless. Multiple team members can work on the same conversation without stepping on each other.

**Mobile-First Design**: Built for technicians who spend their days in the field. The messaging interface is optimized for mobile, with offline support and fast performance even on slower connections.

### 3. Industry Best Practices Built In

Thorbis doesn't just implement features—it implements them the way industry leaders do it. After analyzing ServiceTitan, Jobber, and Housecall Pro, we've incorporated their best practices while avoiding their mistakes.

**Price Book Structure**: Three distinct item types (Services, Materials, Equipment) with hierarchical categories, following ServiceTitan's proven approach.

**Job Workflow**: Comprehensive job lifecycle tracking with 47+ critical fields for costing, scheduling, warranty, and compliance—matching enterprise-level platforms.

**Settings System**: 23 database tables covering communications, customers, scheduling, billing, and more. Every aspect of the platform is configurable without code changes.

### 4. Real-World Workflow Focus

Thorbis isn't built in a vacuum. It's built by understanding how service companies actually operate:

**Offline Support**: Technicians can access job details, update status, and work with checklists even when connectivity is poor. Changes sync automatically when connection is restored.

**Mobile Optimization**: Every feature is tested and optimized for mobile devices. The scheduling interface, job details, customer information—all designed for small screens and touch interactions.

**Operational Intelligence**: Property enrichment features pull in demographics, air quality, elevation, flood zones, and market data to help technicians and dispatchers make better decisions.

**Widget System**: Customizable job detail pages that adapt to different industries. HVAC companies see different information than plumbing businesses, and both can customize their view.

### 5. Developer Experience and Maintainability

Thorbis is built to be maintainable and extensible:

**Monorepo Architecture**: Shared packages for auth, database, UI components, and configuration. Changes propagate automatically, reducing duplication and ensuring consistency.

**Comprehensive Documentation**: 500+ documentation files covering architecture, migrations, performance, troubleshooting, and implementation guides. Every major decision is documented.

**Type Safety**: TypeScript throughout, with strict mode and no `any` types. This catches errors at compile time and makes refactoring safe.

**Testing Infrastructure**: Unit tests, integration tests, and E2E tests with 80% coverage targets. The codebase is built to be reliable.

### 6. Scalability and Performance

**Database Architecture**: 42 production tables with proper indexing, foreign keys, and RLS policies. The schema is designed to scale from small businesses to enterprise organizations.

**Caching Strategy**: Aggressive caching with Next.js, Redis-ready architecture, and smart invalidation strategies. Static data is cached, dynamic data is streamed.

**Code Splitting**: Heavy components are lazy-loaded. The schedule views, payment processors, and other large features only load when needed.

**Error Handling**: 33 error boundaries across the application ensure that failures are contained and users see helpful error messages, not blank screens.

### 7. Security and Compliance

**Row-Level Security**: Every table has RLS policies that ensure users can only access data they're authorized to see. Multi-tenant isolation is enforced at the database level.

**Server-Side Validation**: All inputs are validated with Zod schemas on the server. Client-side validation is for UX; server-side validation is for security.

**Audit Trails**: Complete activity tracking for compliance and debugging. Every change is logged with who made it and when.

**Secure File Handling**: Document uploads with virus scanning, file type validation, and secure storage. Files are organized by context (customer, job, equipment) with proper access controls.

---

## Technical Innovations

### Partial Prerendering (PPR)

Thorbis leverages Next.js 16's Partial Prerendering to get the best of both worlds: static performance for the shell and dynamic data for personalized content. This means pages load instantly while still showing real-time data.

### Server Actions Over API Routes

Instead of building separate API routes for every mutation, Thorbis uses Server Actions. This reduces boilerplate, improves type safety, and makes the codebase more maintainable. Server Actions are authenticated, validated, and secure by default.

### Streaming with Suspense

Heavy data loads are streamed to the client with React Suspense boundaries. Users see the page shell immediately, then data streams in as it becomes available. This dramatically improves perceived performance.

### Unified State Management

Zustand is used for client-side state, but most state lives on the server. This reduces client bundle size and ensures data consistency. Server components fetch data directly, and client components only manage UI state.

### Offline Architecture

Service workers and IndexedDB enable offline functionality. Technicians can work with job details, update status, and fill out forms even without connectivity. Changes queue up and sync when connection is restored.

---

## The Road Ahead

Thorbis is more than a product—it's a platform for the future of field service management. As we continue to build, we're focused on:

**AI Integration**: Intelligent call handling, automated follow-ups, and smart scheduling recommendations that learn from your business patterns.

**Advanced Analytics**: Predictive insights that help you understand not just what happened, but what's likely to happen next.

**Ecosystem Integration**: APIs and webhooks that let Thorbis integrate with the tools you already use, from accounting software to marketing platforms.

**Industry Specialization**: Deep customization for specific trades, with industry-specific workflows, terminology, and best practices built in.

---

## Conclusion

Building Thorbis has been a journey of understanding what field service companies actually need versus what existing platforms provide. It's a stepping stone toward a future where field service management software is:

- **Fast**: Built on modern architecture that performs
- **Unified**: All communication, data, and workflows in one place
- **Secure**: Security and compliance built in from day one
- **Flexible**: Adapts to your business, not the other way around
- **Reliable**: Works offline, handles errors gracefully, and scales with your growth

The field service industry deserves better tools. Thorbis is my contribution to making that happen—one feature, one optimization, one customer success story at a time.

If you're running a field service business and tired of fragmented tools, slow performance, and security concerns, Thorbis might be the platform you've been waiting for. It's built for operators, by operators, with the technology stack and architecture that can actually deliver on the promise of modern field service management.

---

**About the Author**: This project represents years of experience working with field service companies, understanding their pain points, and building solutions that actually work in the real world. Thorbis is open for early access—join the waitlist to be part of shaping the future of field service management.

---

*For technical documentation, architecture details, and implementation guides, see the `/docs` directory in the Thorbis repository.*




