# New Thorbis

## Overview

Thorbis is a decoupled CMS platform that orchestrates website management through existing cloud services. It provides a centralized management system for websites while leveraging third-party infrastructure for hosting and deployment. The system is built around a "bring your own credentials" model where users maintain complete control of their service integrations.

## Core Concepts

### 1. Infrastructure Model

- **Serverless Architecture**: All components run on serverless infrastructure.
- **Database**: Prisma ORM with SQLite (initial implementation).
- **Deployment**: User-owned Vercel integration for website hosting.
- **Version Control**: User-owned GitHub integration for code management.
- **Authentication**: OAuth-based system for multiple services with user-owned credentials.
- **Dynamic Content Editing System**: A component-based system allowing users to control layout, design, and content through the CMS.

### 2. System Components

### 2.1 Core Database Schema (Prisma)

```
prisma
Copy code
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String?
  projects      Project[]
  teamMembers   TeamMember[]
  integrations  Integration[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Integration {
  id            String    @id @default(cuid())
  userId        String
  platform      String    // 'github' or 'vercel'
  clientId      String
  clientSecret  String    // encrypted
  accessToken   String?   // encrypted
  user          User      @relation(fields: [userId], references: [id])
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([userId, platform])
}

model Project {
  id            String        @id @default(cuid())
  name          String
  userId        String
  repositoryUrl String
  vercelProjectId String
  components    Component[]   // New: Components associated with the project
  content       Content[]     // New: Content entries using components
  user          User          @relation(fields: [userId], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Component {
  id            String        @id @default(cuid())
  projectId     String
  name          String
  properties    Json          // Properties schema for the component
  code          String        // Reference to component code or source code
  project       Project       @relation(fields: [projectId], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model Content {
  id            String        @id @default(cuid())
  projectId     String
  title         String
  slug          String        @unique
  components    Json          // Structure of components used
  data          Json          // User-provided data for components
  project       Project       @relation(fields: [projectId], references: [id])
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

// ... [Previous Team and TeamMember models remain the same]

```

### 2.2 API Structure

```sql
sql
Copy code
/api
├── auth/
│   ├── github/
│   │   ├── setup
│   │   └── callback
│   ├── vercel/
│   │   ├── setup
│   │   └── callback
│   └── callback/
├── integrations/
│   ├── [platform]/
│   │   ├── store
│   │   ├── verify
│   │   └── revoke
│   └── status
├── projects/
│   ├── create
│   ├── [projectId]/
│   │   ├── components/
│   │   │   ├── create
│   │   │   ├── update
│   │   │   ├── delete
│   │   │   └── list
│   │   ├── content/
│   │   │   ├── create
│   │   │   ├── update
│   │   │   ├── delete
│   │   │   └── list
│   │   ├── deploy
│   │   └── settings
├── teams/
│   └── ... [Unchanged]

```

### 3. Key Workflows

### 3.0 Integration Setup Flow

1. **User Account Creation**: User creates an account in Thorbis.
2. **OAuth App Setup**:
    - User is guided to create their own GitHub OAuth App.
    - User creates their own Vercel Integration.
3. **Credential Provision**: User provides OAuth credentials to Thorbis.
4. **Credential Storage**: System encrypts and securely stores credentials.
5. **Integration Validation**: System validates the integrations.

### 3.1 Project Creation Flow

1. **Integration Verification**: System ensures the user has valid GitHub and Vercel integrations.
2. **Project Initialization**:
    - User creates a new project in Thorbis.
    - System sets up a GitHub repository under the user's account.
    - System configures a Vercel project using the user's integration.
3. **Deployment Configuration**:
    - Deployment hooks are set up.
    - Necessary files and configurations are committed to the repository.
4. **Database Update**: Project details are stored in the database.

### 3.2 Component Management Flow (New)

1. **Component Definition by Developer**:
    - Developer creates components using preferred frontend framework (e.g., React).
    - Components are defined with properties and behaviors.
    - Components are registered in `thoris.config.ts`.
2. **Component Registration in Thorbis**:
    - Thorbis reads `thoris.config.ts` from the repository.
    - Components are stored in the database associated with the project.
3. **Component Updates**:
    - Developers can update components.
    - Changes are synced with Thorbis upon repository updates.

### 3.3 Content Creation and Editing Flow (New)

1. **Access Visual Editor**: User opens the visual composition interface within Thorbis.
2. **Compose Content**:
    - User drags and drops components to build pages or content sections.
    - Components can be nested and arranged.
3. **Customize Components**:
    - User edits component properties via a properties panel.
    - Changes are reflected in real-time within the editor.
4. **Save Content**:
    - The content structure and data are saved in the `Content` model.
5. **Deployment**:
    - Thorbis triggers a deployment to Vercel.
    - The site is built using the latest components and content.

### 4. Integration Points

### 4.1 GitHub Integration

- **User-Owned OAuth App**: Users create and manage their own GitHub OAuth Apps.
- **Repository Management**:
    - Repositories are created under the user's account.
    - Component code and configurations are stored in the repository.
- **Webhook Configuration**: Webhooks are set up using the user's tokens.
- **Permissions**: Actions are performed based on the user's GitHub permissions.

### 4.2 Vercel Integration

- **User-Owned Integration**: Users create their own Vercel integrations.
- **Project Deployment**:
    - Deployments are managed under the user's Vercel account.
    - Environment variables and domains are configured by the user.
- **Build Hooks**: Deployment hooks are configured to trigger builds on content updates.

### 5. Security Considerations

### 5.1 Authentication

- **OAuth 2.0**: Used for platform access and integrations.
- **Credential Storage**: Sensitive data is encrypted.
- **JWT Tokens**: For session management.
- **Access Control**: Role-Based Access Control (RBAC) for users and team members.

### 5.2 Rate Limiting

- **User-Based Limits**: Rate limits align with the user's service quotas.
- **Monitoring**: System tracks usage per integration and alerts users when limits are approached.

### 5.3 Content Security (New)

- **Input Validation**: All user inputs are validated to prevent security vulnerabilities.
- **Secure Rendering**: Proper sanitization to prevent XSS and injection attacks.
- **Permission Checks**: Ensuring only authorized users can modify components and content.

### 6. Implementation Guidelines

### 6.1 Component System

**Component Definition Example (`thoris.config.ts`):**

```tsx
typescript
Copy code
export const components = [
  {
    name: 'HeroSection',
    properties: {
      title: { type: 'string', default: 'Welcome to Thorbis' },
      subtitle: { type: 'string', default: '' },
      backgroundImage: { type: 'image', default: null },
    },
  },
  {
    name: 'FeatureList',
    properties: {
      features: {
        type: 'list',
        items: {
          icon: { type: 'icon', default: 'default-icon' },
          title: { type: 'string', default: 'Feature Title' },
          description: { type: 'string', default: 'Feature Description' },
        },
      },
    },
  },
  // ...additional components
];

```

**Component Registration:**

- Thorbis reads the `thoris.config.ts` file during project setup or updates.
- Components are parsed and stored in the `Component` model.
- Properties schema is stored for use in the visual editor.

### 6.2 Visual Composition Interface

- **Drag-and-Drop Functionality**: Users can visually construct pages by placing components.
- **Properties Panel**: Users can edit component properties with form inputs matching the properties schema.
- **Real-Time Preview**: Users see immediate feedback on changes.
- **Responsive Design Tools**: Options to adjust layouts for different screen sizes.

### 6.3 Rendering Engine

- **Data Binding**: Components receive data from the `Content` model during rendering.
- **SSR and CSR Support**: Compatible with both server-side and client-side rendering as needed.
- **Performance Optimization**:
    - Implement caching strategies.
    - Use lazy loading for components and assets.

### 6.4 Content Storage

- **Structured Data**: Content is stored in a structured format, allowing for efficient querying and manipulation.
- **Versioning**: Implement content versioning for rollback capabilities.
- **Collaboration Support**: Track changes and support multiple users editing content.

### 7. User Experience Enhancements

### 7.1 Onboarding and Tutorials

- **Interactive Guides**: Walk users through creating their first page using components.
- **Tooltips and Help**: Contextual assistance within the editor.

### 7.2 Templates and Presets

- **Component Presets**: Pre-configured components with default settings for common use cases.
- **Layout Templates**: Starting points for users to customize further.

### 8. Integration with Existing Technologies

### 8.1 Framework Support

- **Standardization**: Adopt React as the standard framework for component development.
- **Third-Party Libraries**: Allow integration with libraries like Material-UI or Ant Design.

### 8.2 API and Webhooks

- **Headless CMS**: Provide RESTful and GraphQL APIs for content retrieval.
- **Event Hooks**: Webhooks for content changes to integrate with other services.

### 9. User Integration Setup Guides

### 9.1 GitHub OAuth App Setup

1. **Navigate to GitHub Developer Settings**: [https://github.com/settings/developers](https://github.com/settings/developers)
2. **Create New OAuth App**:
    - Application Name: `Thorbis CMS Integration`
    - Homepage URL: `https://your-thorbis-instance.com`
    - Authorization Callback URL: `https://your-thorbis-instance.com/api/auth/github/callback`
3. **Save Client ID and Secret**.
4. **Required Scopes**:
    - `repo`
    - `admin:repo_hook`

### 9.2 Vercel Integration Setup

1. **Go to Vercel Integration Console**: https://vercel.com/dashboard/integrations
2. **Create New Integration**:
    - Name: `Thorbis CMS Integration`
    - Redirect URL: `https://your-thorbis-instance.com/api/auth/vercel/callback`
3. **Save Integration ID and Client Secret**.
4. **Required Scopes**:
    - `deployments:write`
    - `projects:write`

### 10. Getting Started

1. **Sign Up**: Create an account on Thorbis.
2. **Set Up Integrations**: Follow the guides to set up GitHub and Vercel integrations.
3. **Create a Project**: Use Thorbis to initialize a new project.
4. **Define Components**:
    - Create components in your development environment.
    - Define them in `thoris.config.ts`.
    - Push to your GitHub repository.
5. **Compose Content**:
    - Use the visual editor to build pages with your components.
    - Customize component properties as needed.
6. **Deploy**: Save your content and deploy your site through Thorbis.

---

## **Business Plan Development**

### **Target Market and Audience**

- **Primary Target Audience**:
    - Thorbis aims to directly compete with WordPress, targeting the same broad audience.
    - The primary target includes developers, designers, small to medium-sized businesses, enterprises, and agencies.
- **Industries and Sectors**:
    - Focus on developers and business owners across various industries.
    - Suitable for e-commerce, blogging, portfolios, and any web project requiring a CMS.
- **Key Pain Points Thorbis Aims to Solve**:
    - Simplifying project management for clients and agencies.
    - Bridging the gap between traditional CMS platforms like WordPress and modern web development technologies.
    - Providing flexibility and adaptability to any website built on modern frameworks, as long as developers follow Thorbis documentation.

### **Value Proposition**

- **What Sets Thorbis Apart**:
    - Thorbis offers deployment and project management capabilities along with a headless CMS.
    - It is database-agnostic, giving users the freedom to choose their database.
    - Provides a modern architecture similar to WordPress but built for contemporary technologies.
- **Unique Features**:
    - Headless API for the CMS with full deployment and project management.
    - Compatibility with modern frameworks (Next.js, Angular, Vue, etc.) using Thorbis API.
    - Ability to pull in any GitHub repository containing `thoris.config.ts` and use Thorbis API.
- **Main Benefits for Users**:
    - Ease of deployment and project management.
    - Flexibility in choosing databases and hosting platforms.
    - Modern, scalable architecture that adapts to various web technologies.

### **Revenue Model**

- **Monetization Strategy**:
    - Thorbis plans to offer a generous free tier, with potential charges for API usage.
    - Subscription-based model with two options:
        - **Free Tier**: Access to essential features suitable for individual users and small projects.
        - **Paid Tier** ($3/month per user): Additional features and fewer restrictions, ideal for businesses and agencies.
- **Differentiation Between Tiers**:
    - User restrictions: The free tier may have limitations on the number of projects, collaborators, or integrations.
    - Advanced Features: Paid users might have access to premium features like data migration between databases, priority support, and advanced analytics.
- **Additional Revenue Streams**:
    - Potential for a marketplace for components, themes, plugins.
    - Offering premium support services or consulting for enterprise clients.

### **Market Strategy**

- **Go-to-Market Strategy**:
    - Utilize social media advertising on platforms like Twitter and Facebook.
    - Leverage communities on Reddit and Product Hunt to gain early adopters.
    - Use Google Ads to reach potential users searching for CMS solutions.
- **Attracting and Retaining Users**:
    - Offer a modern alternative to WordPress with enhanced features and flexibility.
    - Provide extensive documentation and developer-friendly tools to win over developers.
    - Engage users through community building, forums, webinars, and regular updates.
- **Internationalization Plans**:
    - Initial focus on English-speaking markets.
    - Plans to expand support for multiple languages and regions after establishing a strong proof of concept.

### **Competitor Analysis**

- **Main Competitors**:
    - Traditional CMS platforms: WordPress, Joomla, Drupal.
    - Website builders: Squarespace, Wix.
    - Headless CMS providers: Contentful, Strapi, Sanity.
- **Competitors' Strengths and Weaknesses**:
    - **Strengths**:
        - Established user base and community support.
        - Extensive features and plugins.
        - Brand recognition and trust.
    - **Weaknesses**:
        - Vendor lock-in and limited flexibility.
        - Outdated technologies and architectures.
        - Can be complex and bloated for modern development needs.
- **Capitalizing on Market Gaps**:
    - Thorbis can offer a modern, flexible CMS that integrates seamlessly with new technologies.
    - Address the need for a CMS that is both developer-friendly and easy for end-users.
    - Provide freedom from vendor lock-in by allowing users to own their data and deployments.

---

## **API Development**

### **Core API Functionality**

- **Essential Features**:
    - Support for all integrations (GitHub, Vercel, etc.).
    - Comprehensive content management features, including blocks and rich text editors.
    - Functions for content creation, component management, deployment triggers, and user authentication.
- **API Preferences**:
    - Support for both RESTful APIs and GraphQL.
        - **Reason**: Catering to a wider range of developers and making Thorbis more appealing to them.
- **Notable Benefit**:
    - Developers can update their own repositories for the websites, and Thorbis automatically updates all the websites using those themes if the user chooses to update.

### **Authentication and Security**

- **Authentication Methods**:
    - Implement OAuth 2.0 for secure authentication with third-party services.
    - Use JWT (JSON Web Tokens) for session management and API authentication.
    - API keys for service-to-service communication if necessary.
- **User Roles and Permissions**:
    - Implement Role-Based Access Control (RBAC) to manage user permissions via the API.
    - Custom roles can be defined for more granular control.

### **Third-Party Integrations**

- **Additional Platforms for Integration**:
    - Future plans to integrate with Netlify, AWS, GitLab, Bitbucket.
- **Functionalities of Integrations**:
    - Deployment management, version control, storage solutions, and analytics capabilities.

### **Scalability and Performance**

- **API Performance Expectations**:
    - Fast response times with efficient concurrency handling.
    - Implement rate limits to ensure fair usage and prevent abuse.
- **Scalability Importance**:
    - Scalability is crucial even for the initial launch to accommodate potential rapid user adoption.
    - Aim for an architecture that can handle growth without significant re-engineering.

### **Developer Experience**

- **API Documentation and Tooling**:
    - High priority on comprehensive API documentation.
    - Plans to provide SDKs, code samples, and interactive documentation tools like Swagger or GraphQL Playground.
- **Sandbox Environment**:
    - Offering a sandbox or testing environment for developers to experiment without affecting production data.

---

## **File Structure and Technical Architecture**

### **Technology Stack Preferences**

- **Backend Technologies**:
    - Node.js with TypeScript for type safety and modern development practices.
- **Frontend Framework**:
    - React is confirmed for the frontend.
    - Utilizing state management tools like Redux or Context API as needed.

### **Project and File Organization**

- **File and Folder Structures**:
    - Following industry-standard conventions (e.g., MVC pattern).
    - Separate folders for components, services, utilities, and configurations.
- **Component and Configuration Organization**:
    - Components organized by feature or functionality.
    - Configurations stored in a centralized location with environment-specific overrides.

### **Component Development Workflow**

- **Process for Developers**:
    - Developers use their preferred code editors and tools.
    - Thorbis provides CLI tools and GUI interfaces to facilitate component creation and updates.
- **Syncing Components**:
    - Components are synced via Git repositories.
    - Thorbis pulls the latest changes from the user's repository during deployment.

### **Database Considerations**

- **Database Choices**:
    - Considering PostgreSQL for its robustness and scalability.
- **Scalability and Availability**:
    - High availability and scalability are required from the start to ensure reliability.

### **Deployment and Infrastructure**

- **Hosting Thorbis**:
    - Thorbis will be deployed on cloud providers like AWS or Google Cloud for scalability and global reach.
- **CI/CD Pipelines**:
    - Utilizing tools like GitHub Actions or Jenkins for continuous integration and deployment.
    - Automate testing, building, and deployment processes.

---

## **Product Features and User Experience**

### **User Onboarding**

- **Onboarding Process**:
    - Step-by-step wizards guiding users through account setup, integrations, and project creation.
    - Interactive tutorials and default projects to help users get started quickly.
- **Customization During Onboarding**:
    - Users can select preferred frameworks, templates, and configurations.

### **Content Editing Experience**

- **Visual Composition Interface**:
    - Drag-and-drop editors with real-time previews.
    - Intuitive UI elements for content creation and layout adjustments.
- **Switching Between Editing Modes**:
    - Users can easily switch between block editors, rich text editors, and code editors.

### **Customization and Extensibility**

- **Creating Custom Components**:
    - Users can create custom components through visual tools or by importing them from repositories.
- **Plugin or Extension System**:
    - Plans to support a plugin system allowing third-party developers to extend functionality.

### **Media and Asset Management**

- **Handling Media Files**:
    - Integration with cloud storage services like AWS S3 or Google Cloud Storage.
    - Built-in media library for uploading, organizing, and managing assets.
- **CDN Integration**:
    - Utilizing CDNs for efficient asset delivery and improved site performance.

### **Internationalization (i18n) and Localization**

- **Multilingual Support**:
    - Multilingual support is planned for future releases.
- **Content Translation Management**:
    - Providing tools within the CMS for managing translations and localized content.

---

## **Future Roadmap and Vision**

### **Long-Term Goals**

- **Thorbis in 3-5 Years**:
    - Expanding features to include more integrations and advanced CMS capabilities.
    - Growing the user base to become a major player in the CMS market.
    - Entering new markets and supporting a global audience.
- **Integrating Emerging Technologies**:
    - Exploring AI/ML for content suggestions, personalization, and analytics.
    - Considering AR/VR support as technology and demand evolve.
    - Monitoring blockchain applications for potential integration, such as decentralized content delivery.

### **Community and Ecosystem**

- **Building a Community**:
    - Establishing forums, hosting webinars, and participating in developer conferences.
    - Encouraging user-generated content and feedback.
- **Third-Party Contributions**:
    - Opening up the platform for third-party developers to contribute components, themes, and plugins.
    - Possibly hosting a marketplace for these contributions.

### **Customer Support and Services**

- **Support Channels**:
    - Providing email support, live chat, a comprehensive knowledge base, and a ticketing system.
- **Premium Support Tiers**:
    - Offering premium support plans with faster response times, dedicated support staff, and personalized assistance.

---

## **Risk Management and Compliance**

### **Legal and Regulatory Compliance**

- **Regulations to Comply With**:
    - Ensuring compliance with GDPR, CCPA, and other international data protection laws.
- **User Data Privacy**:
    - Implementing strong encryption for data at rest and in transit.
    - Clear privacy policies and user consent mechanisms.

### **Potential Risks and Mitigation Strategies**

- **Major Risks**:
    - **Technical Challenges**: Building a scalable, flexible platform that integrates with various technologies.
    - **Market Adoption Barriers**: Competing with well-established platforms and convincing users to switch.
    - **Competition**: Rapid changes in the CMS market and new entrants.
- **Mitigation Strategies**:
    - Focus on delivering unique value propositions and superior user experience.
    - Aggressive marketing and community engagement to build brand awareness.
    - Continual innovation and staying ahead of industry trends.

---

## **Budget and Resources**

### **Development Team and Resources**

- **Team Structure**:
    - Starting with a small core team and planning to recruit developers skilled in:
        - Backend development (Node.js, TypeScript)
        - Frontend development (React)
        - DevOps and cloud infrastructure
- **Budget Allocation**:
    - Prioritizing development and infrastructure.
    - Allocating funds for marketing efforts as the product approaches launch.

### **Timeline and Milestones**

- **Expected Timeline**:
    - **MVP Development**: Next 3-6 months.
    - **Beta Testing**: Following MVP completion, lasting 2-3 months.
    - **Official Launch**: After refining based on beta feedback.
- **External Factors**:
    - No immediate external deadlines but aiming to capture market interest promptly.

---

## **Additional Considerations**

### **Feedback and Iteration**

- **Gathering User Feedback**:
    - Launching beta programs to involve early adopters.
    - Utilizing surveys, user interviews, and analytics tools.
- **Integrating Feedback**:
    - Implementing agile development practices to iterate quickly based on user input.

### **Accessibility**

- **Accessibility Standards**:
    - Committed to meeting WCAG 2.1 compliance levels.
    - Ensuring the platform is usable with assistive technologies.

### **Environmental and Social Impact**

- **Sustainability Factors**:
    - Considering green hosting options and energy-efficient infrastructure.
- **Community Contributions**:
    - Encouraging open-source contributions and possibly supporting non-profit organizations.