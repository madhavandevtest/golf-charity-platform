insert into public.charities (slug, name, category, location, website_url, summary, description, impact_stat, featured)
values
  (
    'youth-links',
    'Youth Links Collective',
    'Youth Development',
    'Manchester, UK',
    'https://example.org/youth-links',
    'Funds coaching, mentoring, and accessible recreation for underrepresented young people.',
    'Youth Links Collective creates access to confidence-building programs, school support, and community-led wellbeing services for young people who need a safe launchpad.',
    '2,800 young people supported in the last 12 months',
    true
  ),
  (
    'clean-water-foundation',
    'Clean Water Foundation',
    'Water Security',
    'Austin, USA',
    'https://example.org/clean-water',
    'Builds community water systems and resilience projects for families facing unreliable supply.',
    'Clean Water Foundation partners with local communities to install filtration, education, and rapid-response water infrastructure where health outcomes are at risk.',
    '48 villages now have reliable drinking water access',
    false
  ),
  (
    'green-horizons',
    'Green Horizons Alliance',
    'Climate Action',
    'Cape Town, South Africa',
    'https://example.org/green-horizons',
    'Restores native habitats while creating paid green jobs in vulnerable regions.',
    'Green Horizons Alliance supports reforestation, biodiversity corridors, and local employment pathways that leave communities more resilient over time.',
    '120,000 trees planted with local job placement support',
    false
  )
on conflict (slug) do nothing;
