import { ToneOption, AssetTypeOption, TeamUseCase, NewsArticle, UserComment } from "../types";

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "confident",
    label: "Confident",
    value: "confident, bold, authoritative, clear",
    icon: "bolt",
    description: "Striking, clear, visionary voice suitable for major announcements."
  },
  {
    id: "approachable",
    label: "Approachable",
    value: "approachable, conversational, warm, empathetic",
    icon: "sentiment_satisfied",
    description: "Friendly, direct, and accessible style ideal for onboarding or daily briefs."
  },
  {
    id: "minimalist",
    label: "Minimalist",
    value: "minimalist, precise, understated, Swiss-modern",
    icon: "density_medium",
    description: "Clean, brief, highly professional copy focusing strictly on core benefits."
  },
  {
    id: "bold",
    label: "Bold",
    value: "high-energy, persuasive, direct, inspiring",
    icon: "campaign",
    description: "Dynamic and motivating language designed to stand out."
  }
];

export const ASSET_TYPES: AssetTypeOption[] = [
  {
    id: "email",
    label: "Email Newsletter",
    value: "email",
    icon: "mail",
    promptPlaceholder: "Draft a product announcement email for the new 'Pro' tier..."
  },
  {
    id: "social",
    label: "Social Post",
    value: "social",
    icon: "share",
    promptPlaceholder: "Create a LinkedIn caption announcing our expansion..."
  },
  {
    id: "brief",
    label: "Campaign Brief",
    value: "brief",
    icon: "assignment",
    promptPlaceholder: "Create an strategic launch campaign brief for creative teams..."
  },
  {
    id: "guidelines",
    label: "Brand Guidelines",
    value: "guidelines",
    icon: "menu_book",
    promptPlaceholder: "Write a short brand tone guide specifying vocabulary to use and avoid..."
  }
];

export const TEAM_USE_CASES: TeamUseCase[] = [
  // Strategy
  {
    id: "sc-1",
    title: "Campaign Briefs",
    description: "Generate comprehensive briefs aligned with brand strategy and core values.",
    imageUrl: "https://images.unsplash.com/photo-1614852207233-e8d771f8e9fc?q=80&w=2070&auto=format&fit=crop",
    category: "Strategy"
  },
  {
    id: "sc-2",
    title: "Strategic Alignment",
    description: "Audit existing resources to ensure quarterly objectives align perfectly with visual systems.",
    imageUrl: "https://images.unsplash.com/photo-1774420073915-96cc5e3abdb7?q=80&w=2021&auto=format&fit=crop",
    category: "Strategy"
  },
  // Marketing
  {
    id: "mc-1",
    title: "Social Assets",
    description: "Ensure complete visual and message consistency across Instagram, LinkedIn, and Twitter.",
    imageUrl: "https://images.unsplash.com/photo-1645811791249-93a1e10d0169?q=80&w=869&auto=format&fit=crop",
    category: "Marketing"
  },
  {
    id: "mc-2",
    title: "Content Calendars",
    description: "Auto-generate engaging campaign timelines optimized for target demographics.",
    imageUrl: "https://images.unsplash.com/photo-1607874089816-bf5af74fe2c5?q=80&w=2070&auto=format&fit=crop",
    category: "Marketing"
  },
  // Design
  {
    id: "dc-1",
    title: "Voice Guidelines",
    description: "Codify your brand's unique tone and terminology for product teams and agencies.",
    imageUrl: "https://images.unsplash.com/photo-1770791779732-7d1ef12524f2?q=80&w=2021&auto=format&fit=crop",
    category: "Design"
  },
  {
    id: "dc-2",
    title: "Visual Asset Audits",
    description: "Evaluate spacing, contrast, and layout alignments automatically against guidelines.",
    imageUrl: "https://images.unsplash.com/photo-1751467928435-22c8826b5310?q=80&w=1064&auto=format&fit=crop",
    category: "Design"
  },
  // Sales
  {
    id: "sac-1",
    title: "Sales Decks",
    description: "Empower account representatives with up-to-date, highly converting, on-brand messaging.",
    imageUrl: "https://images.unsplash.com/photo-1661962399580-80301d32d791?q=80&w=1625&auto=format&fit=crop",
    category: "Sales"
  },
  {
    id: "sac-2",
    title: "Client Proposals",
    description: "Instantly draft customized proposals that resonate with the client's industry and brand tone.",
    imageUrl: "https://images.unsplash.com/photo-1762532264999-7dde57d37f22?q=80&w=2664&auto=format&fit=crop",
    category: "Sales"
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "n-1",
    title: "Introducing Lumio Studio Analytics",
    category: "Product Update",
    date: "Oct 12, 2026",
    imageUrl: "https://images.unsplash.com/photo-1615714259003-5db15f3cf5f5?q=80&w=987&auto=format&fit=crop",
    content: "We're thrilled to introduce Lumio Studio Analytics. This update brings a suite of predictive performance tools into your creative environment, enabling teams to evaluate how visual copy and layouts will perform before launching across social channels. The analytics engine scores clarity, focus, and visual structure in real-time, matching results against 10M+ historic campaigns."
  },
  {
    id: "n-2",
    title: "The Modern Brand Architecture",
    category: "Insights",
    date: "Oct 08, 2026",
    imageUrl: "https://images.unsplash.com/photo-1646388286080-62887d1b34ab?q=80&w=987&auto=format&fit=crop",
    content: "Why do legacy brand books fail? Modern teams create and distribute content at rates never seen before. A static PDF style guide is no longer sufficient. In this in-depth guide, we explore the rise of 'living systems' – where brand intelligence sits at the center of the asset creation pipeline, self-correcting drift and offering context-specific guidance at the point of creation."
  },
  {
    id: "n-3",
    title: "Lumio raises Series B to expand AI features",
    category: "News",
    date: "Sep 24, 2026",
    imageUrl: "https://images.unsplash.com/photo-1615714259121-c9870fd23fcd?q=80&w=2070&auto=format&fit=crop",
    content: "Today we are excited to announce our Series B funding round. This milestone represents more than capital; it validates our vision that creative intelligence is the missing layer in the enterprise workspace. This investment will accelerate the development of our automated guidelines checking engine and deep context mapping capabilities, allowing even more teams to work with absolute visual confidence."
  }
];

export const INITIAL_COMMENTS: UserComment[] = [
  {
    id: "c-1",
    author: "Alex Morgan",
    role: "VP of Brand, Northline",
    text: "Lumio was built with the desire to liberate creative teams from menial tasks, allowing them to focus on true strategic innovation.",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_dQOYUXm-9ocUk-1cRA5ZyP6tu7OdWwNIU7SRhouWt3u89anzj3A5_pr7FGCCICOiz6a2FoSpC-bN53AYbiVQ-spgKPawBtGZtLq-9c6QyNclym7oEuOsCnQllJenEGuMkAeM3mwnTOLdgJakEE63ozCYcDA2l-C2EQnZiozAakUbDrwJG_jxTwrvV9I5p2oiVPXIDBv-rltdG9P0TX6X2OUHQcwckpskXXJEawplcI8ff_rzn1YnIDgrniF27Vjc0Lz4LKcazue9",
    date: "June 25, 2026"
  },
  {
    id: "c-2",
    author: "Jessica Chen",
    role: "Design Lead, Arcform",
    text: "Since introducing Lumio OS, our creative output has accelerated threefold while visual drift has dropped to zero.",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxUZpAK7kBAK1H5Anlz-i_nh19XyaGUt1hLDC6ZASnuBK2vRcwFDP46vx7HodMWCGvWJVA3aKLfp00pDRGNPsH0LVYvOGBSQ1KJIx2wTCxFcEJMNlnv9DHJKT0wyVelxRunXJN3d41Z2MPDK4poxQF_iybQaYL4ebVjC52RWnq9U6Y-VA7k5seZ7Z4c1n3nq7ply6CwSNm8-OH_B6wae1-h-Zmn2y3jh9urDyal2zhahuy408MHHCcPTmA9TNKUOA7WEsjuEy1iMvC",
    date: "June 28, 2026"
  }
];
