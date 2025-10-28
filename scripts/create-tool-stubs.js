/**
 * Script to create stub pages for all tool resources
 * Run with: node scripts/create-tool-stubs.js
 */

const fs = require('fs');
const path = require('path');

const toolPages = [
  // Marketing pages
  {
    path: 'marketing/instagram',
    title: 'Instagram for Business',
    subtitle: 'Showcase your work and connect with customers through visual content',
    icon: 'Camera',
    description: [
      'Instagram is a visual-first platform perfect for showcasing your work. With over 1 billion active users, it\'s an excellent way to attract new customers and build brand awareness.',
      'Share before/after photos, behind-the-scenes content, and customer testimonials to demonstrate your expertise and professionalism.'
    ]
  },
  {
    path: 'marketing/twitter',
    title: 'X (Twitter) Business',
    subtitle: 'Share updates and engage with your community in real-time',
    icon: 'Hash',
    description: [
      'X (formerly Twitter) is great for sharing quick updates, industry news, and engaging in conversations with customers and other professionals.',
      'Use X to establish thought leadership in your trade and stay connected with your local community.'
    ]
  },
  {
    path: 'marketing/linkedin',
    title: 'LinkedIn Company Page',
    subtitle: 'Build professional network and attract commercial clients',
    icon: 'Briefcase',
    description: [
      'LinkedIn is the premier professional networking platform, ideal for attracting commercial clients and building B2B relationships.',
      'Share industry insights, company updates, and thought leadership content to position your business as an industry expert.'
    ]
  },
  {
    path: 'marketing/social-media',
    title: 'Social Media Setup Guide',
    subtitle: 'Complete guide to establishing your social media presence',
    icon: 'Megaphone',
    description: [
      'Social media is essential for modern businesses. This guide will help you set up profiles across all major platforms and develop a content strategy.',
      'Learn best practices for each platform, content creation tips, and how to manage multiple social media accounts efficiently.'
    ]
  },
  // Business Setup pages
  {
    path: 'business/registration',
    title: 'Business Registration',
    subtitle: 'Register your business entity, EIN, and legal structure',
    icon: 'Briefcase',
    description: [
      'Properly registering your business is a critical first step. Choose the right business structure (LLC, S-Corp, etc.) and obtain your federal tax ID (EIN).',
      'We\'ll guide you through the registration process, including state and local requirements specific to trade contractors.'
    ]
  },
  {
    path: 'business/licensing',
    title: 'Licensing & Permits',
    subtitle: 'State and local license requirements for trade contractors',
    icon: 'FileText',
    description: [
      'Every state and locality has different licensing requirements for trade contractors. Ensure you have all necessary licenses and permits before starting work.',
      'Learn about trade-specific licenses (HVAC, plumbing, electrical), general contractor licenses, and ongoing renewal requirements.'
    ]
  },
  {
    path: 'business/insurance',
    title: 'Business Insurance',
    subtitle: 'General liability, workers comp, and commercial auto insurance',
    icon: 'Shield',
    description: [
      'Proper insurance protection is non-negotiable for trade contractors. General liability, workers compensation, and commercial auto insurance protect your business from financial risk.',
      'We\'ll help you understand coverage requirements, find competitive quotes, and ensure you\'re adequately protected.'
    ]
  },
  {
    path: 'business/banking',
    title: 'Banking & Payroll',
    subtitle: 'Business banking, payroll services, and accounting software',
    icon: 'DollarSign',
    description: [
      'Separate your business and personal finances with a dedicated business bank account. Set up efficient payroll processing and accounting systems.',
      'Discover the best banking partners for contractors, payroll service providers, and accounting software solutions.'
    ]
  },
  {
    path: 'business/legal',
    title: 'Legal Resources',
    subtitle: 'Contracts, liability waivers, and legal templates',
    icon: 'FileText',
    description: [
      'Protect your business with proper legal documents. Service agreements, proposal templates, liability waivers, and payment terms are essential.',
      'Access contractor-specific legal templates and learn when you need to consult with a business attorney.'
    ]
  },
  // Financing pages
  {
    path: 'financing/business-loans',
    title: 'Business Loans & Lines of Credit',
    subtitle: 'Working capital loans, equipment financing, and SBA loans',
    icon: 'DollarSign',
    description: [
      'Access capital to grow your business, purchase equipment, or smooth out cash flow fluctuations. Multiple financing options are available for trade contractors.',
      'Learn about SBA loans, business lines of credit, equipment financing, and alternative lending options.'
    ]
  },
  {
    path: 'financing/equipment',
    title: 'Equipment Financing',
    subtitle: 'Finance trucks, tools, and equipment for your business',
    icon: 'Wrench',
    description: [
      'Equipment financing allows you to acquire trucks, tools, and specialized equipment without depleting your cash reserves.',
      'Explore lease-to-own options, equipment loans, and vendor financing programs designed for trade contractors.'
    ]
  },
  {
    path: 'financing/credit-card',
    title: 'Credit Card Processing',
    subtitle: 'Accept payments with Square, Stripe, or merchant services',
    icon: 'Receipt',
    description: [
      'Make it easy for customers to pay you with credit card processing. Accept payments in the field, online, or in your office.',
      'Compare processing fees, equipment costs, and features from major payment processors tailored for service businesses.'
    ]
  },
  // Network pages
  {
    path: 'networks/service-nation',
    title: 'Service Nation Alliance',
    subtitle: 'Business coaching and peer group network for contractors',
    icon: 'Users',
    description: [
      'Service Nation Alliance is a business development organization similar to Nexstar, offering coaching, peer groups, and training for home service contractors.',
      'Members benefit from proven business systems, financial benchmarking, and a supportive community of successful contractors.'
    ]
  },
  {
    path: 'networks/acca',
    title: 'ACCA - HVAC Excellence',
    subtitle: 'Air Conditioning Contractors of America trade association',
    icon: 'Zap',
    description: [
      'ACCA is the leading trade association for HVAC contractors. Members get access to technical training, business resources, and industry advocacy.',
      'Join ACCA to stay current on industry standards, building codes, and best practices in HVAC installation and service.'
    ]
  },
  {
    path: 'networks/phcc',
    title: 'PHCC - Plumbing & HVAC',
    subtitle: 'Plumbing-Heating-Cooling Contractors Association',
    icon: 'Wrench',
    description: [
      'PHCC is the oldest trade association in the construction industry, representing plumbing and HVAC contractors since 1883.',
      'Members receive apprenticeship programs, safety training, legislative advocacy, and business development resources.'
    ]
  },
  {
    path: 'networks/neca',
    title: 'NECA - Electrical',
    subtitle: 'National Electrical Contractors Association',
    icon: 'Zap',
    description: [
      'NECA represents electrical contractors across the United States. Join to access education programs, safety resources, and industry standards.',
      'Members benefit from apprenticeship training, code update seminars, and networking opportunities with other electrical professionals.'
    ]
  },
  // Training pages
  {
    path: 'training/certifications',
    title: 'Trade Certifications',
    subtitle: 'State licensing, master certifications, and specialty credentials',
    icon: 'BadgeCheck',
    description: [
      'Advance your career and business with professional certifications. From journeyman to master level, certifications demonstrate expertise and command higher rates.',
      'Learn about certification requirements for your trade, testing procedures, and continuing education to maintain credentials.'
    ]
  },
  {
    path: 'training/osha',
    title: 'OSHA Safety Training',
    subtitle: 'Workplace safety certifications and compliance training',
    icon: 'Shield',
    description: [
      'OSHA compliance is required for most contractors. OSHA 10 and OSHA 30 training courses cover workplace safety, hazard recognition, and accident prevention.',
      'Learn about OSHA requirements for your trade, find approved training providers, and maintain ongoing safety compliance.'
    ]
  },
  {
    path: 'training/epa',
    title: 'EPA Certifications',
    subtitle: 'EPA 608 refrigerant handling and environmental certifications',
    icon: 'Shield',
    description: [
      'EPA Section 608 certification is required for HVAC technicians who work with refrigerants. Learn about Type I, Type II, Type III, and Universal certifications.',
      'Find EPA-approved testing centers, study materials, and understand ongoing compliance requirements for environmental regulations.'
    ]
  },
  {
    path: 'training/business',
    title: 'Business Management Training',
    subtitle: 'Operations, sales, customer service, and leadership courses',
    icon: 'GraduationCap',
    description: [
      'Technical skills alone aren\'t enough to run a successful business. Develop your business management, sales, leadership, and customer service skills.',
      'Explore training programs in financial management, marketing, team building, and operational excellence designed for trade business owners.'
    ]
  },
  // Resources pages
  {
    path: 'resources/news',
    title: 'Industry News & Blogs',
    subtitle: 'Stay updated with trade publications and industry trends',
    icon: 'BookOpen',
    description: [
      'Stay informed about industry trends, new technologies, regulations, and business strategies. Follow leading trade publications and industry blogs.',
      'Discover magazines, podcasts, newsletters, and websites that provide valuable insights for contractors in your specific trade.'
    ]
  },
  {
    path: 'resources/calculators',
    title: 'Pricing Calculators',
    subtitle: 'Job cost estimators, material calculators, and pricing tools',
    icon: 'Wrench',
    description: [
      'Accurate pricing is critical for profitability. Use online calculators to estimate job costs, material quantities, labor hours, and markup percentages.',
      'Access tools for load calculations (HVAC), pipe sizing (plumbing), voltage drop (electrical), and other trade-specific calculations.'
    ]
  },
  {
    path: 'resources/vendors',
    title: 'Vendor Directories',
    subtitle: 'Find suppliers, wholesalers, and equipment dealers',
    icon: 'Package',
    description: [
      'Build relationships with reliable suppliers and wholesalers. Find equipment dealers, parts distributors, and specialty suppliers in your area.',
      'Compare pricing, delivery options, and account terms from major distributors and local suppliers serving trade contractors.'
    ]
  },
  {
    path: 'resources/emergency',
    title: 'Emergency Services Info',
    subtitle: 'After-hours support, emergency dispatch, and on-call resources',
    icon: 'Phone',
    description: [
      'Many contractors offer emergency services for premium rates. Learn how to set up after-hours call handling, emergency dispatch, and on-call scheduling.',
      'Discover answering services, dispatch software, and best practices for managing emergency service calls efficiently and profitably.'
    ]
  }
];

// Template for generating page content
const generatePageContent = (page) => `/**
 * ${page.title} Resource Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation every hour
 */

import { ${page.icon}, ExternalLink } from "lucide-react";
import { ResourcePageTemplate } from "@/components/tools/resource-page-template";

export const revalidate = 3600;

export default function Page() {
  return (
    <ResourcePageTemplate
      title="${page.title}"
      subtitle="${page.subtitle}"
      icon={${page.icon}}
      description={${JSON.stringify(page.description)}}
      externalLinks={[
        {
          title: "Getting Started Guide",
          description: "External resource and documentation",
          url: "#",
          icon: ExternalLink,
        },
      ]}
    />
  );
}
`;

// Create all stub pages
function createStubPages() {
  const baseDir = path.join(__dirname, '../src/app/(dashboard)/dashboard/tools');

  toolPages.forEach(page => {
    const fullPath = path.join(baseDir, page.path);
    const filePath = path.join(fullPath, 'page.tsx');

    // Create directory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    // Write page content
    fs.writeFileSync(filePath, generatePageContent(page));
    console.log(`✓ Created ${page.path}/page.tsx`);
  });

  console.log(`\n✓ Successfully created ${toolPages.length} stub pages!`);
}

// Run the script
createStubPages();
