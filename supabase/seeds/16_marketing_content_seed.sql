-- Seed data for blog and resource content --------------------------------------------------------

INSERT INTO public.blog_authors (slug, name, title, bio, avatar_url, website_url, linkedin_url, twitter_url)
VALUES
  (
    'jane-doe',
    'Jane Doe',
    'Director of Product Marketing',
    'Jane leads Thorbis storytelling, pairing market insight with field experience to help contractors scale smarter.',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    'https://thorbis.com',
    'https://www.linkedin.com/in/janedoe',
    'https://twitter.com/thorbis'
  ),
  (
    'marcus-lee',
    'Marcus Lee',
    'VP of Operations Enablement',
    'Marcus partners with service leaders to modernise operations with AI, automation, and data-driven decisions.',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    'https://thorbis.com',
    'https://www.linkedin.com/in/marcuslee',
    'https://twitter.com/thorbis'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_categories (slug, name, description, icon, color)
VALUES
  (
    'product-updates',
    'Product Updates',
    'Release notes and feature deep-dives from the Thorbis product team.',
    '🚀',
    '#2563eb'
  ),
  (
    'field-service-strategy',
    'Field Service Strategy',
    'Playbooks, metrics, and workflows for high-performing field service operators.',
    '🛠️',
    '#0ea5e9'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.content_tags (slug, name, description)
VALUES
  ('ai', 'AI', 'Artificial intelligence for smarter scheduling, dispatch, and customer engagement.'),
  ('automation', 'Automation', 'Workflows that remove manual tasks from busy operations teams.'),
  ('customer-experience', 'Customer Experience', 'Tactics to delight homeowners and commercial clients.'),
  ('operations', 'Operations', 'Process optimisation and KPI management for field teams.'),
  ('training', 'Training', 'Upskill technicians and office staff faster.')
ON CONFLICT (slug) DO NOTHING;

WITH author AS (
  SELECT id FROM public.blog_authors WHERE slug = 'jane-doe'
),
category AS (
  SELECT id FROM public.blog_categories WHERE slug = 'product-updates'
)
INSERT INTO public.blog_posts (
  slug,
  title,
  excerpt,
  content,
  hero_image_url,
  status,
  featured,
  pinned,
  allow_comments,
  published_at,
  reading_time,
  category_id,
  author_id,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  metadata
)
SELECT
  'introducing-thorbis-ai-dispatch',
  'Introducing Thorbis AI Dispatch: Your Newest Dispatcher Works 24/7',
  'Resolve scheduling conflicts in seconds and keep every technician on time with the new Thorbis AI Dispatch engine.',
  $$## What''s New

Thorbis AI Dispatch uses real-time capacity planning and predictive travel times to plan routes that keep your day on track.

### Highlights
- Automatically assign the right tech using skills, certifications, and proximity.
- Reroute jobs instantly when emergencies arrive or technicians run behind.
- Surface customer insights on every assignment so your team arrives prepared.

### Early Access
The feature is available to Growth and Scale plans today. Contact your Thorbis partner team for rollout support or to upgrade your plan.$$,
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
  'published',
  TRUE,
  FALSE,
  TRUE,
  TIMEZONE('utc', NOW()) - INTERVAL '5 days',
  6,
  category.id,
  author.id,
  'Introducing Thorbis AI Dispatch | Thorbis',
  'Learn how Thorbis AI Dispatch keeps jobs on schedule and customers delighted.',
  ARRAY['ai', 'automation', 'dispatch'],
  'https://thorbis.com/blog/introducing-thorbis-ai-dispatch',
  jsonb_build_object('release_version', '2025.02')
FROM author, category
ON CONFLICT (slug) DO NOTHING;

WITH author AS (
  SELECT id FROM public.blog_authors WHERE slug = 'marcus-lee'
),
category AS (
  SELECT id FROM public.blog_categories WHERE slug = 'field-service-strategy'
)
INSERT INTO public.blog_posts (
  slug,
  title,
  excerpt,
  content,
  hero_image_url,
  status,
  featured,
  pinned,
  allow_comments,
  published_at,
  reading_time,
  category_id,
  author_id,
  seo_title,
  seo_description,
  seo_keywords,
  canonical_url,
  metadata
)
SELECT
  'field-service-kpis-that-matter',
  '7 Field Service KPIs That Actually Improve Profitability',
  'Tired of vanity dashboards? Focus on the operational KPIs that move revenue, utilisation, and customer retention.',
  $$## The Metrics Playbook

We analysed more than 500 high-performing service companies on Thorbis to surface the KPIs that really matter.

### Core KPIs
1. **First-Time Fix Rate** – The fastest way to protect margins and win repeat business.
2. **Technician Utilisation** – Balance drive time with productive labour hours.
3. **Average Ticket Value** – Equip teams with data to expand revenue per visit.
4. **Net Promoter Score** – Measure what customers actually feel after service.
5. **Callback Ratio** – Early warning for training and quality issues.
6. **Schedule Density** – Optimise routes and reduce windshield time.
7. **Quote Conversion Rate** – Connect marketing, sales, and operations workflows.

Download the companion checklist to operationalise each KPI in your next leadership meeting.$$,
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
  'published',
  FALSE,
  FALSE,
  TRUE,
  TIMEZONE('utc', NOW()) - INTERVAL '12 days',
  8,
  category.id,
  author.id,
  '7 Field Service KPIs That Improve Profitability | Thorbis',
  'Run your service company with confidence using seven KPIs that drive efficiency, revenue, and retention.',
  ARRAY['operations', 'training', 'profitability'],
  'https://thorbis.com/blog/field-service-kpis-that-matter',
  '{}'::jsonb
FROM author, category
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.blog_post_tags (post_id, tag_id)
SELECT bp.id, ct.id
FROM public.blog_posts bp
JOIN public.content_tags ct ON ct.slug = ANY (ARRAY['ai', 'automation', 'customer-experience'])
WHERE bp.slug = 'introducing-thorbis-ai-dispatch'
ON CONFLICT DO NOTHING;

INSERT INTO public.blog_post_tags (post_id, tag_id)
SELECT bp.id, ct.id
FROM public.blog_posts bp
JOIN public.content_tags ct ON ct.slug = ANY (ARRAY['operations', 'training'])
WHERE bp.slug = 'field-service-kpis-that-matter'
ON CONFLICT DO NOTHING;

WITH author AS (
  SELECT id FROM public.blog_authors WHERE slug = 'marcus-lee'
)
INSERT INTO public.resource_items (
  slug,
  title,
  excerpt,
  content,
  hero_image_url,
  status,
  type,
  featured,
  author_id,
  published_at,
  event_start_at,
  event_end_at,
  registration_url,
  cta_label,
  cta_url,
  seo_title,
  seo_description,
  seo_keywords,
  metadata
)
SELECT
  'ops-blueprint-2025-webinar',
  'Operations Blueprint 2025: Build a Profitable Service Machine',
  'Live 60-minute session covering the playbook that top 5% field operators use to scale with Thorbis.',
  $$Join the Thorbis strategy team for a tactical walkthrough of scheduling, pricing, and technician enablement frameworks that maximise utilisation without burning out your crew.$$,
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  'published',
  'webinar',
  TRUE,
  author.id,
  TIMEZONE('utc', NOW()) - INTERVAL '3 days',
  TIMEZONE('utc', NOW()) + INTERVAL '10 days',
  TIMEZONE('utc', NOW()) + INTERVAL '10 days' + INTERVAL '1 hour',
  'https://thorbis.com/webinars/ops-blueprint-2025',
  'Save your seat',
  'https://thorbis.com/webinars/ops-blueprint-2025/register',
  'Operations Blueprint 2025 Webinar | Thorbis',
  'Register for a live Thorbis webinar to modernise your service operations in 2025.',
  ARRAY['operations', 'training'],
  jsonb_build_object('duration_minutes', 60, 'hosts', ARRAY['Marcus Lee', 'Jane Doe'])
FROM author
ON CONFLICT (slug) DO NOTHING;

WITH author AS (
  SELECT id FROM public.blog_authors WHERE slug = 'jane-doe'
)
INSERT INTO public.resource_items (
  slug,
  title,
  excerpt,
  content,
  hero_image_url,
  status,
  type,
  featured,
  author_id,
  published_at,
  download_url,
  cta_label,
  cta_url,
  seo_title,
  seo_description,
  seo_keywords,
  metadata
)
SELECT
  'case-study-northwind-hvac',
  'Case Study: Northwind HVAC Cuts Drive Time by 32%',
  'See how Northwind HVAC replaced three legacy tools with Thorbis and delivered same-day service without overtime.',
  $$Northwind HVAC grew revenue 41% YoY after consolidating scheduling, dispatch, and customer communications into Thorbis. Download the case study for the exact rollout checklist.$$,
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
  'published',
  'case_study',
  TRUE,
  author.id,
  TIMEZONE('utc', NOW()) - INTERVAL '20 days',
  'https://thorbis.com/case-studies/northwind-hvac.pdf',
  'Download the case study',
  'https://thorbis.com/case-studies/northwind-hvac?download=1',
  'Northwind HVAC Case Study | Thorbis',
  'Discover how Northwind HVAC reduced windshield time, improved first-time fix rate, and increased revenue with Thorbis.',
  ARRAY['case-study', 'operations', 'customer-experience'],
  jsonb_build_object('industry', 'HVAC', 'employees', 58, 'region', 'Pacific Northwest')
FROM author
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.resource_item_tags (resource_item_id, tag_id)
SELECT ri.id, ct.id
FROM public.resource_items ri
JOIN public.content_tags ct ON ct.slug = ANY (ARRAY['operations', 'training'])
WHERE ri.slug = 'ops-blueprint-2025-webinar'
ON CONFLICT DO NOTHING;

INSERT INTO public.resource_item_tags (resource_item_id, tag_id)
SELECT ri.id, ct.id
FROM public.resource_items ri
JOIN public.content_tags ct ON ct.slug = ANY (ARRAY['operations', 'customer-experience'])
WHERE ri.slug = 'case-study-northwind-hvac'
ON CONFLICT DO NOTHING;

