// Single source of truth for portfolio content.
// Real, defensible facts only. No invented metrics. No em or en dashes.
// Every number states what it measures. Internal system names are generalized.

export const profile = {
  name: "Vamshi Krishna Garega",
  shortName: "Vamshi Garega",
  initials: "VG",
  role: "AI Engineer",
  title: "Software Engineer",
  company: "Apple",
  companyNote: "via OSI Engineering",
  location: "Austin, Texas",
  email: "vamshikrishna9031@gmail.com",
  phone: "+1 (830) 359-9463",
  resume: "/resume/Vamshi_Krishna_Garega_Resume.pdf",
  availability: "Open to AI and software engineering roles",
  socials: {
    linkedin: "https://www.linkedin.com/in/vamshi-krishna-garega/",
    github: "https://github.com/vamshigarega",
    leetcode: "https://leetcode.com/u/G_Vamshi_Krishna/",
    hackerrank: "https://www.hackerrank.com/profile/180330137_cse_c",
    codechef: "https://www.codechef.com/users/gvamshi_123",
    instagram: "https://www.instagram.com/vamshikrishna.garige/",
  },
};

export const nav = [
  { id: "platform", label: "Platform" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "toolkit", label: "Toolkit" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------
   The platform tour. Chapter 0 is the hero; chapters 1-4 walk down the
   stack shown in the 3D scene. `focus` names the tiers the scene lights.
   ------------------------------------------------------------------ */

export type Metric = { value: string; label: string };

export type Chapter = {
  id: string;
  /** short name on the chapter rail */
  rail: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  metrics: Metric[];
  stack: string[];
};

export const hero = {
  kicker: "AI Engineer",
  headline: "I build AI agents and the platform that puts them in production.",
  /** words in the headline that carry the spectrum treatment */
  highlight: "in production",
  summary:
    "Software Engineer at Apple. In my first 13 months I shipped 9 production AI agents and 13+ MCP servers to 8 engineering teams, on top of a data platform that runs about 350 Kubernetes pods.",
  primaryCta: "Tour the platform",
  secondaryCta: "Get in touch",
  facts: [
    { value: "9", label: "AI agents in production" },
    { value: "13+", label: "MCP servers behind one gateway" },
    { value: "8", label: "engineering teams served" },
    { value: "95.6%", label: "gateway success, 505 queries in 30 days" },
  ] as Metric[],
};

// Labels pinned to each tier of the 3D stack.
export const stageLabels = {
  teams: "8 engineering teams",
  agents: "9 AI agents",
  gateway: "MCP gateway",
  servers: "13+ MCP servers",
  data: "~350 pods, 9 product lines",
};

// Name of the opening chapter on the rail (the hero).
export const overviewRail = "Overview";

// How to use each 3D picture, shown beside it.
export const stageHint = {
  pointer: "Drag to turn it. Click a layer to open it.",
  touch: "Swipe to turn it. Tap a layer to open it.",
  // the first sentence is dropped for readers who asked for reduced motion,
  // since for them the chart is shown already built
  towers: ["It builds as you scroll.", "Drag to turn it."],
  rings: "Drag to spin it.",
  plane: {
    pointer: "It follows the cursor. Click for a roll.",
    touch: "Swipe to turn it. Tap it for a roll.",
  },
};

// The counts that ride on top of the three stacks in the before-and-after
// section. One slab is one real thing, so the numbers are simply counted.
export const towerLabels = {
  agents: (n: number) => ({ value: String(n), caption: n === 1 ? "AI agent" : "AI agents" }),
  // the cluster runs more than the 13 drawn
  servers: (n: number) => ({
    value: n >= 13 ? "13+" : String(n),
    caption: n === 1 ? "MCP server" : "MCP servers",
  }),
  teams: (n: number) => ({ value: String(n), caption: n === 1 ? "team" : "teams" }),
};

export const chapters: Chapter[] = [
  {
    id: "agents",
    rail: "Agents",
    kicker: "01 / Agents",
    title: "Nine agents. One foundation.",
    body: "When I joined, the team ran a single agent. I built a shared base image that handles credential injection, MCP wiring, skill loading, and telemetry, so a new agent starts from a working production baseline instead of a blank repository. That foundation now carries nine production agents used by eight engineering teams.",
    points: [
      "Agents built on the Anthropic Claude SDK and Google ADK, served with Python and FastAPI on Kubernetes",
      "Telemetry middleware baked into the base image without breaking agent-to-agent streaming",
      "Separate dev and prod images, deployments, and routes, so an experimental build never reaches users",
    ],
    metrics: [
      { value: "9", label: "production AI agents" },
      { value: "8", label: "engineering teams served" },
      { value: "~12", label: "services running on the shared base image" },
    ],
    stack: ["Claude SDK", "Google ADK", "FastAPI", "Docker", "Kubernetes"],
  },
  {
    id: "gateway",
    rail: "Gateway",
    kicker: "02 / Gateway",
    title: "One gateway instead of N x M integrations.",
    body: "Every agent needed every tool, and point-to-point integrations were multiplying across teams. I built a central MCP gateway that turns N x M connections into N + M. Agents call one endpoint, and the gateway routes each request to the right MCP server with the caller's identity intact.",
    points: [
      "FastMCP with OAuth 2.0 / OIDC and RFC 8693 token exchange, so every call carries the real user",
      "13+ MCP servers behind it: documentation, memory, databases, diagnostics, and dashboards",
      "Fixed a bug where background tasks lost the user's token; the fix became the team's standard pattern",
    ],
    metrics: [
      { value: "13+", label: "MCP servers routed through the gateway" },
      { value: "505", label: "queries served in a 30-day window" },
      { value: "95.6%", label: "of those queries completed successfully" },
    ],
    stack: ["FastMCP", "OAuth 2.0", "OIDC", "RFC 8693", "Python"],
  },
  {
    id: "data",
    rail: "Data",
    kicker: "03 / Data platform",
    title: "About 350 pods across nine product lines.",
    body: "The agents sit on a hardware manufacturing analytics platform that I also operate. State-machine pipelines fetch, parse, and load factory test data for nine product lines: a controller schedules the jobs, worker pods process them, and the results land in Snowflake and a lakehouse for analytics and machine learning.",
    points: [
      "Cut a processing backlog by about 70% by rescaling one product line from 25 to 85 workers, scoped so other teams kept their autoscaling",
      "Authored 19 production Airflow DAGs and rebuilt the Airflow foundation from Python 3.6 / Airflow 1.10 to Python 3.12 / Airflow 2.7.3 (49 files, 34 tests)",
      "Onboarded the team to an Apache Iceberg + Trino lakehouse that loaded 2.6M rows in its first 7 days",
    ],
    metrics: [
      { value: "~350", label: "Kubernetes pods in the processing fleet" },
      { value: "9", label: "product lines on the platform" },
      { value: "19", label: "production Airflow DAGs authored" },
    ],
    stack: ["Airflow", "Snowflake", "Trino", "Iceberg", "Django", "Kubernetes"],
  },
  {
    id: "foundation",
    rail: "Foundation",
    kicker: "04 / Foundation",
    title: "Built so the next service ships in hours.",
    body: "A small team cannot hand-build every service. I wrote bootstrap templates for new agents and MCP servers, standardized how about 30 services read their credentials, and moved six production agents to a new cloud region without downtime.",
    points: [
      "Agent and MCP templates cut new-service onboarding from days to roughly 3 hours",
      "Zero-downtime migration of 6 agents, delivered as 8 Kustomize overlays and 12 CI/CD pipelines",
      "One typed, role-based secrets wrapper adopted across about 30 services and 9 product lines",
    ],
    metrics: [
      { value: "~3 hrs", label: "to onboard a new service, down from days" },
      { value: "6", label: "agents migrated across regions, zero downtime" },
      { value: "~30", label: "services on one credential standard" },
    ],
    stack: ["Kustomize", "CI/CD", "RBAC", "Docker", "Kubernetes"],
  },
];

/* ------------------------------------------------------------------
   Thirteen months, before and after. Each row is a state the team was
   in when I joined and the state I helped leave it in.
   ------------------------------------------------------------------ */
export const shift = {
  kicker: "Thirteen months",
  title: "Before and after.",
  body: "The same small team, measured from the month I joined to a year later.",
  rows: [
    { area: "Agents in production", before: "1", after: "9" },
    { area: "MCP servers", before: "0", after: "13+ behind a central gateway" },
    { area: "Teams served", before: "Our own", after: "8 engineering teams" },
    {
      area: "Airflow foundation",
      before: "1.10 on Python 3.6",
      after: "Rebuilt on 2.7.3 and Python 3.12",
    },
    {
      area: "Front end",
      before: "An aging landing page",
      after: "React 19, TypeScript, Vite, Tailwind",
    },
  ],
};

/* ------------------------------------------------------------------
   More shipped work, each as problem -> what I built -> result.
   ------------------------------------------------------------------ */
export type Shipped = {
  /** lucide icon name, mapped in Shipped.tsx */
  icon: string;
  /** the one number (or short phrase) that sums up the outcome */
  figure: string;
  figureLabel: string;
  title: string;
  problem: string;
  built: string;
  result: string;
  /** how it works, one short step per line (the back of the card) */
  flow: string[];
  stack: string[];
};

export const shipped: Shipped[] = [
  {
    icon: "BellRing",
    figure: "79",
    figureLabel: "alerts delivered on the first production run",
    title: "Real-time alerting for hardware-test deterioration",
    problem:
      "Engineers were missing emerging test deteriorations because nothing watched for them.",
    built:
      "The whole path: a React configuration form, a Django module, a four-table Snowflake schema, and an hourly Airflow DAG with SHA-256 deduplication that fans out to Slack and email.",
    result: "Delivered 79 alerts on its first production run.",
    flow: [
      "An engineer sets thresholds in a React form",
      "A Django module stores the configuration",
      "An hourly Airflow DAG checks Snowflake",
      "A SHA-256 hash drops alerts already sent",
      "New alerts fan out to Slack and email",
    ],
    stack: ["Airflow", "Snowflake", "Django", "React", "Slack"],
  },
  {
    icon: "Layers",
    figure: "~1,000",
    figureLabel: "lines of code removed while three stores became one",
    title: "Agent memory, three stores collapsed into one",
    problem:
      "The agents' memory service ran on three separate stores that drifted out of sync.",
    built:
      "Re-architected it onto a managed Milvus vector database as the single source of truth, replacing a Qdrant, Memgraph, and SQLite backend.",
    result: "About 1,000 lines of code removed and two always-on services retired per cluster.",
    flow: [
      "An agent asks the memory MCP server",
      "One Milvus collection holds every memory",
      "Each query is filtered to its user",
      "No side stores left to keep in sync",
    ],
    stack: ["Milvus", "MCP", "Python"],
  },
  {
    icon: "LifeBuoy",
    figure: "8",
    figureLabel: "enterprise data sources behind a single agent",
    title: "An AI co-pilot for on-call reliability engineers",
    problem:
      "On-call engineers needed answers that lived in eight different systems.",
    built:
      "Integrated eight enterprise data sources, including issue tracking, dashboards, the data warehouse, the lakehouse, wiki, and tickets, into one agent.",
    result: "Shipped 5 reusable query skills that on-call engineers use directly.",
    flow: [
      "An on-call engineer asks in plain language",
      "The agent picks one of 5 query skills",
      "The skill queries the right one of 8 sources",
      "One answer comes back in one place",
    ],
    stack: ["Claude SDK", "Snowflake", "Trino", "Tableau", "Jira"],
  },
  {
    icon: "PanelsTopLeft",
    figure: "React 19",
    figureLabel: "front end, with docs anyone can contribute to",
    title: "React 19 rewrite of the platform's front door",
    problem:
      "The landing page and documentation were aging, and only engineers could update them.",
    built:
      "Rebuilt the landing and AI pages in React 19, TypeScript, Vite, and Tailwind, added UI for configuration management, build-coverage insights, and embedded dashboards, and moved docs to a site that turns Markdown repositories into searchable pages.",
    result: "Documentation that non-engineers can contribute to.",
    flow: [
      "Teams keep docs as Markdown in their own repositories",
      "The docs site turns them into searchable pages",
      "The React 19 app adds configuration, coverage, and dashboards",
      "Anyone on the team can contribute a page",
    ],
    stack: ["React 19", "TypeScript", "Vite", "Tailwind", "Docusaurus"],
  },
  {
    icon: "KeyRound",
    figure: "2 days",
    figureLabel: "of opaque errors, traced to one wrong token type",
    title: "A two-day 500 error traced to the wrong token type",
    problem:
      "A Trino cluster rejected programmatic access with an opaque delegation-token error for two days.",
    built:
      "Ruled out mutual TLS and bearer access tokens in turn, then found that the catalog required an OIDC ID token with JWT authentication.",
    result: "Documented as the standard, so later integrations skip the trap.",
    flow: [
      "The cluster answers 500 with a delegation-token error",
      "Mutual TLS: ruled out",
      "Bearer access token: ruled out",
      "OIDC ID token with JWT authentication: works",
      "Written up as the team standard",
    ],
    stack: ["Trino", "OIDC", "JWT"],
  },
  {
    icon: "MessagesSquare",
    figure: "1",
    figureLabel: "notification path shared by every pipeline",
    title: "One Slack and notification layer for every pipeline",
    problem:
      "Each pipeline carried its own ad hoc Slack client, and health reporting was inconsistent.",
    built:
      "A shared notification module and integration guide, plus daily pipeline-health summaries and alerts routed through it.",
    result: "Replaced the per-pipeline clients with one maintained path.",
    flow: [
      "Every pipeline calls one shared module",
      "The module formats and routes the message",
      "Alerts and daily health summaries reach Slack",
    ],
    stack: ["Airflow", "Slack", "Python"],
  },
];

/* ------------------------------------------------------------------ */

export const about = {
  kicker: "Profile",
  title: "Full-stack by necessity, AI by focus.",
  paragraphs: [
    "I work on a small team that builds data and AI tooling for hardware engineering at Apple. On a team that size you own the whole stack: React and TypeScript front ends, Python services in FastAPI and Django, Airflow pipelines, Snowflake and Trino, and the Kubernetes deployments underneath.",
    "Most of what I have shipped started as an empty repository. I care about clean architecture, reviewed pull requests, and leaving behind templates and documentation so the next engineer moves faster than I did.",
  ],
  facts: [
    { label: "Currently", value: "Software Engineer, Apple" },
    { label: "Based in", value: "Austin, Texas" },
    { label: "Education", value: "M.S. Computer Science, Texas State University" },
    { label: "Published", value: "SPIE 12538, adversarial machine learning" },
  ],
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  summary: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Apple",
    role: "Software Engineer",
    period: "May 2025 - Present",
    location: "Austin, Texas",
    current: true,
    summary:
      "AI agents, MCP servers, and the data platform for hardware manufacturing analytics.",
    points: [
      "Shipped 9 production AI agents and 13+ MCP servers (Anthropic Claude SDK, Google ADK) on Python, FastAPI, and Kubernetes for 8 internal engineering teams.",
      "Built the central MCP gateway (FastMCP, OAuth 2.0 / OIDC, RFC 8693 token exchange), which served 505 queries in a 30-day window at a 95.6% success rate.",
      "Operate state-machine data pipelines across about 350 Kubernetes pods and 9 product lines; cut one processing backlog by about 70% by rescaling workers from 25 to 85.",
      "Authored 19 production Airflow DAGs, rebuilt the Airflow foundation on Python 3.12 / Airflow 2.7.3, and onboarded the team to an Iceberg + Trino lakehouse (2.6M rows in its first 7 days).",
      "Built real-time alerting on Airflow, Slack, and email that delivered 79 alerts on its first production run.",
      "Wrote agent and MCP templates that cut new-service onboarding from days to roughly 3 hours, and led a zero-downtime migration of 6 agents across cloud regions.",
    ],
  },
  {
    company: "Braintrust Partners",
    role: "Associate Data Engineer",
    period: "July 2024 - April 2025",
    location: "Austin, Texas",
    summary: "Customer data pipelines for a leading Texas bank.",
    points: [
      "Designed and operated end-to-end ETL/ELT pipelines on Treasure Data, processing millions of customer records across ingestion, transformation, and activation.",
      "Automated audience-segment refreshes in Python and SQL and synced them to HubSpot, cutting manual campaign-prep effort by about 80%.",
      "Optimized large-scale SQL queries, reducing query runtime by about 40% for churn analysis and customer segmentation.",
      "Led cloud data migration from on-premises systems to AWS Redshift, Azure Data Lake, and Snowflake, with validation checks that ensured zero data loss.",
    ],
  },
  {
    company: "Texas State University",
    role: "Graduate Research Assistant",
    period: "Aug 2022 - May 2024",
    location: "San Marcos, Texas",
    summary: "Adversarial machine learning research funded by the U.S. Air Force.",
    points: [
      "Researched time-series forecasting by combining Adversarial Statistical Decision Theory with statistical models on ERCOT energy-load data.",
      "Built and tuned forecasting models (ARIMA, SARIMA, HMM), improving prediction accuracy by 20% through hyperparameter tuning and cross-validation.",
      "Applied adversarial-robustness techniques to the Joint All-Domain Command and Control framework for the U.S. Air Force Office of Scientific Research; co-authored a peer-reviewed SPIE publication.",
    ],
  },
  {
    company: "Ernst & Young",
    role: "Software Analyst",
    period: "Dec 2021 - July 2022",
    location: "Bengaluru, India",
    summary: "Enterprise Java applications and integrations.",
    points: [
      "Developed and maintained enterprise Java applications for business-critical systems, improving stability through refactoring and root-cause analysis.",
      "Designed and built RESTful APIs to integrate legacy systems with third-party platforms.",
      "Automated deployment and system tasks on Unix/Linux with shell scripting in an Agile team.",
    ],
  },
];

// Shown as four columns of two. Each pair puts a long group above a short
// one, so the columns come out the same height.
export const toolkit = [
  {
    title: "AI and agents",
    items: [
      "LLMs",
      "Anthropic Claude SDK",
      "Google ADK",
      "MCP / FastMCP",
      "RAG",
      "Multi-agent systems",
      "Agent orchestration",
      "Prompt engineering",
      "Context-window management",
    ],
  },
  {
    title: "Front end",
    items: ["React", "Redux", "Tailwind CSS", "Vite", "Docusaurus"],
  },
  {
    title: "Data engineering",
    items: [
      "Apache Airflow",
      "Apache Spark",
      "Kafka",
      "Snowflake",
      "Trino",
      "Apache Iceberg",
      "PostgreSQL",
      "Databricks",
      "ETL / ELT",
    ],
  },
  {
    title: "Auth and platform",
    items: ["OAuth 2.0", "OIDC", "JWT", "RBAC", "Token exchange (RFC 8693)", "Secret management"],
  },
  {
    title: "Backend",
    items: [
      "FastAPI",
      "Django",
      "Node.js",
      "Express.js",
      "REST APIs",
      "GraphQL",
      "Microservices",
      "State-machine architecture",
    ],
  },
  {
    title: "ML and analytics",
    items: ["TensorFlow", "Scikit-Learn", "Pandas", "ARIMA / SARIMA", "Tableau", "Power BI"],
  },
  {
    title: "Cloud and DevOps",
    items: [
      "AWS",
      "Docker",
      "Kubernetes",
      "GitHub Actions",
      "Jenkins",
      "Grafana",
      "Splunk",
      "Sentry",
    ],
  },
  {
    title: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C++", "SQL", "Bash"],
  },
];

/* How I work: the habits behind the output. */
export const principles = [
  {
    title: "Nothing goes straight to main.",
    body: "Feature branches and reviewed pull requests, including for the urgent fix.",
  },
  {
    title: "Read-only until proven otherwise.",
    body: "I assume read-only access on any data source I do not own, and ask for write access only when the work needs it.",
  },
  {
    title: "A user's token belongs to the user.",
    body: "Services get scoped, role-based secrets. Personal credentials never land in a shared store.",
  },
  {
    title: "Write it down.",
    body: "Every hard-won fix becomes a note, a guide, or a template, so it is only hard once.",
  },
];

export const publication = {
  title: "Command and Control with Poisoned Temporal Batch Data",
  venue: "SPIE 12538",
  date: "June 12, 2023",
  doi: "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/12538/125380G/Command-and-control-with-poisoned-temporal-batch-data/10.1117/12.2663283.full",
  tags: ["JADC2", "Adversarial ML", "Data security"],
  abstract:
    "Data manipulation can alter the performance of Joint All-Domain Command and Control (JADC2) decisions. We present a Bayesian decision-theoretic approach for adversarial forecasting when the underlying data collected over time is subject to attack from intelligent adversaries. The adversarial risk analysis framework allows for incomplete information and uncertainty, and we solve the adversary's poisoning decision problem against statistical autoregressive models. The findings expose the vulnerability of forecasting models under adversarial activity and outline potential defender strategies.",
};

export const education = [
  {
    degree: "Master of Science in Computer Science",
    school: "Texas State University, San Marcos, TX",
    detail: "CGPA 3.75 / 4.0",
    period: "Aug 2022 - May 2024",
  },
  {
    degree: "B.Tech in Computer Science (AI Specialization)",
    school: "KL University, India",
    detail: "CGPA 3.76 / 4.0",
    period: "July 2018 - June 2022",
  },
];

export const honors = [
  {
    title: "U.S. Air Force Office of Scientific Research Student Fellowship Grant",
    note: "Approximately $16,000",
    year: "2023 - 2024",
  },
  {
    title: "Texas State University Student Government Scholarship",
    note: "Academic and community contribution",
    year: "2023 - 2024",
  },
  {
    title: "Computer Science Graduate Academic Excellence Award",
    note: "Texas State University",
    year: "2023 - 2024",
  },
  {
    title: "Best Graduate Research Poster",
    note: "TXST Center for Analytics and Data Science",
    year: "2024",
  },
];

/* Earlier, independent and academic projects. */
export const projects = [
  {
    title: "Adversarial Forecasting in a DDDAS Framework",
    description:
      "Applied Adversarial Statistical Decision Theory to Joint All-Domain Command and Control, addressing data-manipulation threats in a distributed, dynamic computing environment.",
    tags: ["Python", "Machine learning", "Research"],
  },
  {
    title: "Passport Management System",
    description:
      "A passport-management platform using Kafka queues for real-time processing of passport data across issuance and tracking.",
    tags: ["Java", "Kafka", "Spring Boot", "MySQL"],
  },
  {
    title: "Text Summarizer",
    description:
      "An NLP application built with Django that scrapes web pages and produces extractive summaries.",
    tags: ["Python", "Django", "NLP"],
  },
  {
    title: "Soil Contamination Classification",
    description:
      "Classified contamination levels with Decision Trees, Random Forest, and Support Vector Machines, with feature engineering and model comparison.",
    tags: ["Python", "Scikit-learn", "Pandas"],
  },
  {
    title: "E-Commerce Platform",
    description:
      "A Django platform with order management, real-time inventory tracking, and caching for performance.",
    tags: ["Python", "Django", "PostgreSQL", "Redis"],
  },
  {
    title: "Note Taking Application",
    description:
      "A cross-platform note-taking app built with React Native and Firebase.",
    tags: ["React Native", "Firebase"],
  },
];

export const contactCopy = {
  kicker: "Contact",
  title: "Let us build something that ships.",
  body: "I am open to AI and software engineering roles. Send a message and it lands straight in my inbox.",
};

// All coding profiles, shown in the footer.
export const codingProfiles = [
  { label: "GitHub", href: profile.socials.github },
  { label: "LeetCode", href: profile.socials.leetcode },
  { label: "HackerRank", href: profile.socials.hackerrank },
  { label: "CodeChef", href: profile.socials.codechef },
];

// Places shown on the contact map.
export const places = [
  { name: "Austin, Texas", detail: "Current base" },
  { name: "San Marcos, Texas", detail: "Texas State University" },
];

// Contact form delivery via FormSubmit.co.
// No signup, no API key, no OAuth that can expire. Messages POST straight to
// this inbox. ONE-TIME STEP: the first submission after deploy triggers an
// activation email to this address; click the link once and the form is live.
export const contact = {
  formEndpoint: `https://formsubmit.co/ajax/${profile.email}`,
};
