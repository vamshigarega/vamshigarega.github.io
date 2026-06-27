// Single source of truth for portfolio content.
// Real, defensible facts only. No invented metrics. No em or en dashes.

export const profile = {
  name: "Vamshi Krishna Garega",
  shortName: "Vamshi Garega",
  initials: "VKG",
  role: "AI Engineer",
  tagline: "I build LLM agents, MCP servers, and large-scale data systems.",
  location: "Austin, Texas",
  company: "Apple",
  companyNote: "via OSI Engineering",
  email: "vamshikrishna9031@gmail.com",
  phone: "+1 (830) 359-9463",
  resume: "/resume/Vamshi_Krishna_Garega_Resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/vamshi-krishna-garega/",
    github: "https://github.com/vamshigarega",
    leetcode: "https://leetcode.com/u/G_Vamshi_Krishna/",
    hackerrank: "https://www.hackerrank.com/profile/180330137_cse_c",
    codechef: "https://www.codechef.com/users/gvamshi_123",
    instagram: "https://www.instagram.com/vamshikrishna.garige/",
  },
};

// All coding profiles, shown in the footer.
export const codingProfiles = [
  { label: "GitHub", handle: "vamshigarega", href: profile.socials.github },
  { label: "LeetCode", handle: "G_Vamshi_Krishna", href: profile.socials.leetcode },
  { label: "HackerRank", handle: "180330137_cse_c", href: profile.socials.hackerrank },
  { label: "CodeChef", handle: "gvamshi_123", href: profile.socials.codechef },
];

export const about = [
  "I am a Software Engineer at Apple working full-stack across AI, backend, and data. I design and ship production AI agents and Model Context Protocol (MCP) servers, and I also build the services, APIs, and pipelines around them, from React and TypeScript front ends to FastAPI and Django back ends running on Kubernetes.",
  "I own systems end to end: agentic tooling with the Anthropic Claude SDK and Google ADK, state-machine acquisition pipelines, and large-scale distributed data platforms that power Apple's hardware manufacturing analytics across nine product lines. I care about clean architecture, reliable CI/CD, and code other engineers can build on.",
  "I hold a Master's in Computer Science from Texas State University and a peer-reviewed SPIE publication on adversarial machine learning. I like turning ambiguous problems into shipped, well-engineered systems.",
];

export const stats = [
  { value: "9", label: "Production AI agents shipped" },
  { value: "13+", label: "MCP servers delivered" },
  { value: "505+", label: "Gateway queries served" },
  { value: "95.6%", label: "Gateway success rate" },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  points: string[];
};

export const experience: Experience[] = [
  {
    company: "Apple",
    role: "Software Engineer",
    period: "May 2025 - Present",
    location: "Austin, Texas",
    current: true,
    points: [
      "Built and shipped 9 production AI agents and 13+ MCP servers (Anthropic Claude SDK, Google ADK) on Python, FastAPI, and Kubernetes for 8 internal engineering teams.",
      "Engineered a central MCP gateway that serves 505+ queries at a 95.6% success rate and became the team's standard integration pattern.",
      "Worked full-stack across React / TypeScript front ends and FastAPI / Django back ends, including a real-time AI alerting system on Airflow and Slack.",
      "Designed distributed data pipelines (Apache Airflow, Iceberg + Trino) powering Apple's hardware manufacturing analytics across 9 product lines.",
      "Owned CI/CD and reliability, leading a zero-downtime migration of 6 production agents across cloud regions.",
    ],
  },
  {
    company: "Braintrust Partners LLC",
    role: "Associate Data Engineer",
    period: "July 2024 - April 2025",
    location: "Austin, Texas",
    points: [
      "Designed and operated end-to-end ETL/ELT pipelines on Treasure Data (CDP), processing millions of customer records across ingestion, transformation, and activation for a leading Texas bank.",
      "Optimized large-scale SQL queries, reducing query runtime by roughly 40% and enabling faster churn analysis and customer segmentation.",
      "Engineered real-time streaming pipelines with Apache Kafka and processed structured and unstructured data on Databricks (Apache Spark) and AWS S3.",
      "Led cloud data migration from on-premises systems to AWS Redshift, Azure Data Lake, and Snowflake with validation checks that ensured zero data loss.",
    ],
  },
  {
    company: "Texas State University",
    role: "Graduate Research Assistant",
    period: "Aug 2022 - May 2024",
    location: "San Marcos, Texas",
    points: [
      "Researched time-series forecasting by combining Adversarial Statistical Decision Theory (ASDT) with statistical models on ERCOT energy-load data.",
      "Built and optimized ML forecasting models (ARIMA, SARIMA, HMM), improving prediction accuracy by 20% through hyperparameter tuning and cross-validation.",
      "Applied AI/ML and adversarial-robustness techniques to the Joint All-Domain Command and Control (JADC2) framework for the U.S. Air Force Office of Scientific Research; co-authored a peer-reviewed SPIE publication.",
    ],
  },
  {
    company: "Ernst & Young (EY)",
    role: "Software Analyst",
    period: "Dec 2021 - July 2022",
    location: "Bengaluru, India",
    points: [
      "Developed and maintained enterprise Java applications for business-critical systems, improving stability and performance through refactoring and root-cause analysis.",
      "Designed and built RESTful APIs to integrate legacy systems with third-party platforms.",
      "Automated deployment and system tasks in Unix/Linux with shell scripting in an Agile environment.",
    ],
  },
];

export const skillGroups = [
  {
    title: "AI / ML & Agents",
    items: [
      "LLMs",
      "Anthropic Claude SDK",
      "Google ADK",
      "MCP / FastMCP",
      "RAG",
      "Multi-agent systems",
      "Agent orchestration",
      "Prompt engineering",
      "TensorFlow",
      "Scikit-Learn",
    ],
  },
  {
    title: "Languages",
    items: ["Python", "Java", "C++", "TypeScript", "JavaScript", "SQL", "Bash"],
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
    ],
  },
  {
    title: "Cloud & DevOps",
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
    title: "Data Engineering",
    items: [
      "Apache Airflow",
      "Apache Spark",
      "Kafka",
      "Snowflake",
      "Trino",
      "Apache Iceberg",
      "PostgreSQL",
      "Databricks",
    ],
  },
  {
    title: "Auth & Platform",
    items: ["OAuth 2.0", "OIDC", "JWT", "RBAC", "Secret management"],
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  // Lucide icon name + a two-stop gradient used to render a designed cover.
  icon: string;
  from: string;
  to: string;
};

export const projects: Project[] = [
  {
    title: "Adversarial Forecasting in a DDDAS Framework",
    description:
      "Applied the Adversarial Statistical Decision Theory (ASDT) framework to Joint All-Domain Command and Control (JADC2), addressing data-manipulation threats in a distributed, dynamic computing environment.",
    tags: ["Python", "Machine Learning", "ASDT", "Research"],
    icon: "ShieldAlert",
    from: "#4f46e5",
    to: "#7c3aed",
  },
  {
    title: "Passport Management System",
    description:
      "A passport-management platform using Kafka queues for real-time processing of passport data, improving the efficiency and accuracy of issuance and tracking.",
    tags: ["Java", "Kafka", "Spring Boot", "MySQL"],
    icon: "Waypoints",
    from: "#0ea5e9",
    to: "#2563eb",
  },
  {
    title: "Text Summarizer",
    description:
      "An NLP application built with Django that generates concise summaries from web pages and text, using Beautiful Soup for scraping and extractive summarization.",
    tags: ["Python", "Django", "NLP", "Beautiful Soup"],
    icon: "FileText",
    from: "#8b5cf6",
    to: "#d946ef",
  },
  {
    title: "Note Taking Application",
    description:
      "A cross-platform note-taking app built with React Native and Google Firebase, with a clean interface for capturing and organizing day-to-day events.",
    tags: ["React Native", "Firebase", "JavaScript", "NoSQL"],
    icon: "NotebookPen",
    from: "#14b8a6",
    to: "#0ea5e9",
  },
  {
    title: "Soil Contamination Classification",
    description:
      "Analyzed soil data to classify contamination levels using Decision Trees, Random Forest, and Support Vector Machines, with feature engineering and model comparison.",
    tags: ["Python", "Scikit-learn", "Pandas", "ML"],
    icon: "FlaskConical",
    from: "#10b981",
    to: "#6366f1",
  },
  {
    title: "E-Commerce Platform",
    description:
      "A dynamic e-commerce platform built with Python and Django, integrating order management, real-time inventory tracking, and caching for performance.",
    tags: ["Python", "Django", "PostgreSQL", "Redis"],
    icon: "ShoppingBag",
    from: "#6366f1",
    to: "#3b82f6",
  },
];

export const publication = {
  title: "Command and Control with Poisoned Temporal Batch Data",
  venue: "SPIE 12538",
  date: "June 12, 2023",
  doi: "https://www.spiedigitallibrary.org/conference-proceedings-of-spie/12538/125380G/Command-and-control-with-poisoned-temporal-batch-data/10.1117/12.2663283.full",
  tags: ["JADC2", "Machine Learning", "Data Security"],
  abstract:
    "Data manipulation can alter the performance of Joint All-Domain Command and Control (JADC2) decisions. We present a Bayesian decision-theoretic approach for adversarial forecasting when the underlying data collected over time is subject to attack from intelligent adversaries. The adversarial risk analysis framework allows for incomplete information and uncertainty, and we solve the adversary's poisoning decision problem against statistical autoregressive models. The findings expose the vulnerability of forecasting models under adversarial activity and outline potential defender strategies.",
};

export const honors = [
  {
    title: "U.S. Air Force Office of Scientific Research Student Fellowship Grant",
    note: "Approximately $16,000",
    year: "2023 - 2024",
  },
  {
    title: "Texas State University Student Government Scholarship",
    note: "Awarded for academic and community contribution",
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

export const education = [
  {
    degree: "Master of Science in Computer Science",
    school: "Texas State University, San Marcos, TX",
    detail: "CGPA 3.75 / 4.0",
    period: "Aug 2022 - May 2024",
  },
  {
    degree: "B.Tech in Computer Science (AI Specialization)",
    school: "Koneru Lakshmaiah Education Foundation, India",
    detail: "CGPA 3.76 / 4.0",
    period: "July 2018 - June 2022",
  },
];

export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
];

// Places shown on the contact map.
export const places = [
  {
    name: "Austin, Texas",
    detail: "Current base",
    lat: 30.2672,
    lng: -97.7431,
  },
  {
    name: "San Marcos, Texas",
    detail: "Texas State University",
    lat: 29.8833,
    lng: -97.9414,
  },
];

// EmailJS configuration for the contact form.
// These are publishable client-side identifiers (safe to ship).
// Update them in the EmailJS dashboard if the service or template changes.
export const emailConfig = {
  publicKey: "jODXfU7WROLVmWy1n",
  serviceId: "service_g7hxjpd",
  templateId: "template_cd2gkhh",
};
