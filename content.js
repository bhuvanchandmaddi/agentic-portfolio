/**
 * ============================================================================
 *  CENTRAL CONTENT FILE  —  edit everything about the portfolio here.
 *  Every section of the site reads from this single object, so you can
 *  update text, links, projects, skills, etc. without touching components.
 * ============================================================================
 */

export const profile = {
  name: 'Bhuvan Chand Maddi',
  firstName: 'Bhuvan Chand',
  lastName: 'Maddi',
  role: 'Sr Platform / DevOps Engineer',
  company: 'American Airlines',
  // Rotating words shown in the animated hero headline.
  taglineWords: ['Kubernetes', 'Terraform', 'GitOps', 'Cloud-Native', 'Observability'],
  tagline: 'I design, build and automate scalable, secure, cloud-native platforms.',
  location: 'Hyderabad, India',
  availability: 'Open to platform & DevOps conversations',
  resumeUrl: '', // optional: drop a link to a hosted PDF résumé here
}

export const social = {
  email: 'bhuvanchand.maddi333@gmail.com',
  phone: '+91 8885194481',
  linkedin: 'https://www.linkedin.com/in/bhuvanchand-maddi/',
  github: 'https://github.com/bhuvanchandmaddi',
}

export const about = {
  headline: 'Turning complex infrastructure into calm, automated systems.',
  paragraphs: [
    "I'm a Senior DevOps / Platform Engineer with 7+ years of experience designing, building and maintaining scalable, secure and automated cloud-native systems. I specialise in containerisation and orchestration with Docker and Kubernetes.",
    "I've built a wide range of CI/CD pipelines with GitHub Actions, Azure Pipelines and Jenkins, and lean on GitOps tools like Argo CD and Flux for continuous delivery. On the infrastructure side I work extensively across AWS and Azure, using Terraform to provision and manage multi-cloud environments reliably.",
    "I'm passionate about observability — Prometheus, Grafana, Datadog and Dynatrace — and centralised logging with the ELK Stack and Fluent Bit. I love experimenting with new CNCF projects, maintaining a personal lab, and helping teams build modern, resilient, high-performing platforms.",
  ],
  languages: ['English', 'Telugu', 'Hindi'],
}

// Headline metrics shown as animated counters.
export const stats = [
  { value: 7, suffix: '+', label: 'Years in DevOps' },
  { value: 5, suffix: '', label: 'Companies shipped for' },
  { value: 75, suffix: '%', label: 'Faster deployments' },
  { value: 70, suffix: '%', label: 'Cloud cost reduced' },
]

// Skills grouped by category. `level` (0-100) drives the animated bars.
export const skillGroups = [
  {
    title: 'Containers & Orchestration',
    icon: '☸️',
    skills: [
      { name: 'Kubernetes', level: 95 },
      { name: 'Docker', level: 95 },
      { name: 'Helm', level: 90 },
      { name: 'AWS EKS', level: 90 },
    ],
  },
  {
    title: 'CI/CD & GitOps',
    icon: '🔁',
    skills: [
      { name: 'GitHub Actions', level: 92 },
      { name: 'Jenkins', level: 90 },
      { name: 'Argo CD', level: 90 },
      { name: 'Azure Pipelines', level: 82 },
      { name: 'Flux', level: 80 },
    ],
  },
  {
    title: 'Cloud & IaC',
    icon: '☁️',
    skills: [
      { name: 'AWS', level: 92 },
      { name: 'Microsoft Azure', level: 82 },
      { name: 'Terraform', level: 92 },
      { name: 'Ansible', level: 88 },
    ],
  },
  {
    title: 'Observability & Logging',
    icon: '📊',
    skills: [
      { name: 'Prometheus', level: 90 },
      { name: 'Grafana', level: 90 },
      { name: 'Datadog', level: 82 },
      { name: 'ELK / Fluent Bit', level: 85 },
    ],
  },
  {
    title: 'Languages & Scripting',
    icon: '⌨️',
    skills: [
      { name: 'Python', level: 88 },
      { name: 'Bash', level: 90 },
      { name: 'Java', level: 72 },
      { name: 'Git', level: 92 },
    ],
  },
  {
    title: 'Platform & Security',
    icon: '🔐',
    skills: [
      { name: 'HashiCorp Vault', level: 82 },
      { name: 'Karpenter', level: 80 },
      { name: 'Liquibase', level: 78 },
      { name: 'SonarQube', level: 78 },
    ],
  },
]

// Work history — newest first. `current: true` highlights the active role.
export const experience = [
  {
    company: 'American Airlines',
    role: 'Sr Platform Engineer',
    period: 'Mar 2025 — Present',
    location: 'Hyderabad, India',
    current: true,
    points: [
      'Built AI-powered automation to create vulnerability remediation user stories, generate code fixes, and raise pull requests with minimal developer intervention.',
      'Developed Generative AI solutions using LLMs, MCP, and AI agents to automate developer workflows and accelerate engineering productivity.',
      'Architected a RAG-based platform that enabled natural language interaction with enterprise databases by converting user queries into SQL and presenting insights through dashboards.',
      'Implemented GitHub Actions and AI-driven workflows to automate repository documentation, keeping README files and technical documents synchronized with code changes.',
      'Strengthened application and platform security by integrating CodeQL, Dependabot, and Tenable, while driving security enhancements across AKS environments.',
      'Streamlined CI/CD pipelines and deployment processes, improving developer experience, release reliability, and operational efficiency.',
      'Led high-availability initiatives by migrating AKS workloads from single-zone to multi-zone deployments and Azure storage from LRS to ZRS.'
    ],
    tags: ['GenAI', 'AIOPS', 'Azure', 'AI agents'],
  },
  {
    company: 'Foundation AI',
    role: 'Senior DevOps Engineer',
    period: 'Jan 2024 — Mar 2025',
    location: 'Hyderabad, India',
    points: [
      'Created and optimised CI/CD pipelines with GitHub Actions across dev, staging and production with environment-specific triggers.',
      'Implemented a GitOps workflow with Argo CD — commit-based for dev, tag-based for staging, release-notes-based for production.',
      'Provisioned AWS infrastructure end-to-end with Terraform using Infrastructure-as-Code practices.',
      'Built an observability stack on EKS with AWS OpenSearch & ElasticSearch, Prometheus + Grafana, and Datadog in production.',
      'Migrated Airflow from a single-machine Docker Compose setup to Kubernetes for scalability and operational efficiency.',
      'Automated database schema changes with Liquibase and deployed apps via custom Helm charts through Argo CD.',
    ],
    tags: ['GitHub Actions', 'Argo CD', 'Terraform', 'EKS', 'Datadog'],
  },
  {
    company: 'Verifone',
    role: 'DevOps Engineer',
    period: 'May 2023 — Dec 2023',
    location: 'Karnataka, India',
    points: [
      'Built and managed Jenkins CI/CD pipelines to containerise and deploy Spring Boot apps to Kubernetes with one-click lower-env deployments.',
      'Automated VM-based RPM deployments with Ansible integrated into Jenkins pipelines.',
      'Developed Helm charts from scratch for diverse containerised applications.',
      'Integrated HashiCorp Vault with Kubernetes to manage secrets and protect sensitive data.',
      'Delivered tailored CI/CD pipelines for Spring Boot, Node.js and .NET, plus Jenkins shared libraries and JFrog Artifactory automation.',
    ],
    tags: ['Jenkins', 'Helm', 'Vault', 'Kubernetes'],
  },
  {
    company: 'OpenText',
    role: 'DevOps Engineer',
    period: 'May 2020 — May 2023',
    location: 'Hyderabad, India',
    points: [
      'Developed Helm charts for Kubernetes solutions and maintained CI/CD pipelines with Jenkins, GitLab & TeamCity publishing to JFrog Artifactory.',
      'Rolled out declarative CD (Argo CD) for ECM monitoring solutions on Kubernetes.',
      'Automated staging infrastructure in AWS with Terraform, reducing deployment time by 75%.',
      'Built EKS clusters (Ingress controller, EBS/EFS CSI) with Karpenter autoscaling and EC2 spot instances, cutting cost by 70%.',
      'Improved system performance with monitoring & logging, achieving a 30% reduction in downtime, and mentored junior engineers (+40% productivity).',
    ],
    tags: ['Terraform', 'Argo CD', 'Karpenter', 'AWS'],
  },
  {
    company: 'OpenText',
    role: 'Associate DevOps Engineer',
    period: 'Jun 2019 — May 2020',
    location: 'Hyderabad, India',
    points: [
      'Built CI/CD pipelines to automate customer deployment of the ECM solution into a private cloud.',
      'Implemented a logging framework for the containerised ECM app using Fluent Bit.',
      'Automated database backups across 4 database flavours with Ansible and developed Kubernetes solutions to deploy partner offerings.',
    ],
    tags: ['CI/CD', 'Fluent Bit', 'Ansible', 'Kubernetes'],
  },
  {
    company: 'OpenText',
    role: 'Engineering Intern',
    period: 'Dec 2018 — May 2019',
    location: 'Hyderabad, India',
    points: [
      'Automated internal team activities with Bash, PowerShell and Ansible scripts.',
      'Developed automated tests for a Content Server module using Selenium in Java.',
      'Performed Kubernetes deployments of the Content Suite Platform and provisioned Oracle, PostgreSQL & MS SQL databases.',
    ],
    tags: ['Bash', 'Selenium', 'Kubernetes'],
  },
]

// Featured projects.
export const projects = [
  {
    title: 'Dockerization & CI/CD Pipeline to Kubernetes',
    blurb:
      'A tailored CI/CD pipeline for Kubernetes clusters: optimised Maven builds, secure Docker images scanned with Twistlock & Lacework, stored in JFrog Artifactory, and precise Helm-bundled deployments orchestrated by Jenkins.',
    tags: ['Jenkins', 'Docker', 'Helm', 'Kubernetes', 'Artifactory'],
    accent: 'cyan',
    highlights: ['Twistlock & Lacework scans', 'Helm-bundled manifests', 'Config separation'],
  },
  {
    title: 'EKS + Karpenter Autoscaling (Terraform)',
    blurb:
      'A solo POC provisioning an Amazon EKS cluster entirely with Terraform, wired for intelligent, dynamic autoscaling with Karpenter — a reliable, cost-aware, Infrastructure-as-Code foundation for containerised workloads.',
    tags: ['Terraform', 'AWS EKS', 'Karpenter', 'IaC'],
    accent: 'violet',
    highlights: ['Infrastructure as Code', 'Dynamic autoscaling', 'Spot-instance ready'],
  },
  {
    title: 'Prometheus + Grafana Observability for ECM',
    blurb:
      'An advanced observability solution for ECM containerised deployments featuring a custom Prometheus exporter tailored to app metrics and a bespoke Grafana dashboard delivering intuitive, actionable insight into performance and health.',
    tags: ['Prometheus', 'Grafana', 'Custom Exporter', 'Kubernetes'],
    accent: 'pink',
    highlights: ['Custom exporter', 'Bespoke dashboards', 'Health & performance'],
  },
  {
    title: 'Ansible-Driven Automated DB Backups',
    blurb:
      'A robust internal tool automating database backups with Ansible across MS SQL Server, Oracle and more. Tailored playbooks ensure consistency and reliability across heterogeneous environments while minimising data-loss risk.',
    tags: ['Ansible', 'PostgreSQL', 'Oracle', 'Automation'],
    accent: 'emerald',
    highlights: ['Multi-DB support', 'Consistent & reliable', 'Reduced data-loss risk'],
  },
  {
    title: 'GitHub Actions + Argo CD Deployment Framework',
    blurb:
      'A CI/CD automation framework on Amazon EKS: build Docker images, push to Amazon ECR and gate on SonarQube quality checks. Argo CD orchestrates commit-, tag- and release-notes-based promotions across dev, staging and production.',
    tags: ['GitHub Actions', 'Argo CD', 'Amazon ECR', 'SonarQube'],
    accent: 'amber',
    highlights: ['Quality gates', 'Env-based promotion', 'GitOps delivery'],
  },
]

export const certifications = [
  { name: 'Certified Kubernetes Application Developer (CKAD)', issuer: 'CNCF', note: 'Valid to Nov 2026' },
  { name: 'Kubernetes & Cloud Native Associate (KCNA)', issuer: 'CNCF', note: 'Valid to May 2026' },
  { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', note: 'Practice-tested' },
  { name: 'Cisco CCNA 200-301', issuer: 'Cisco', note: 'Networking' },
]

export const education = {
  school: 'Raghu Engineering College',
  degree: "Bachelor's degree, Computer Science",
  period: 'Aug 2015 — May 2019',
  location: 'Andhra Pradesh, India',
}

// Short marquee terms that scroll across the site.
export const marquee = [
  'Kubernetes', 'Docker', 'Terraform', 'AWS', 'Azure', 'Argo CD', 'GitHub Actions',
  'Jenkins', 'Helm', 'Prometheus', 'Grafana', 'Datadog', 'Ansible', 'Vault',
  'Fluent Bit', 'GitOps', 'CNCF', 'Python', 'Karpenter', 'ELK Stack',
]

export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

/* ----------------------------------------------------------------------------
 *  Agentic-build site extras (used by index.html / app.js)
 * --------------------------------------------------------------------------*/

export const hero = {
  bigWord: 'PORTFOLIO',
  greeting: "Hello, I'm",
  shortName: 'BHUVANCHAND',
  badge: 'Sr Platform Engineer & DevOps Architect',
  // **text** renders bold + underlined like the reference.
  intro:
    'Engineering **self-healing cloud platforms**, **GitOps delivery pipelines** and **AI-driven DevSecOps automation** across AWS & Azure — infrastructure as code, zero click-ops.',
  primaryCta: 'Initiate Dispatch',
  secondaryCta: 'Explore Architecture',
  core: {
    index: '01.',
    status: 'RUNTIME',
    title: 'Platform Core',
    typed: 'Kubernetes + Terraform + Argo CD + GitHub Actions + LLM Agents',
  },
  now: {
    index: '02.',
    status: 'ONLINE',
    title: 'Currently Deploying',
    text: 'Sr Platform Engineer @ American Airlines — GenAI, AIOps & AKS reliability.',
  },
  heroStats: [
    { value: '7+', label: 'Years Ops' },
    { value: '7', label: 'Layer Stack' },
    { value: '75%', label: 'Faster Deploys' },
    { value: '70%', label: 'Cost Reduced' },
  ],
}

export const quote =
  'I build platforms that deploy themselves, heal themselves and explain themselves — so engineers can ship without fear.'

export const principles = [
  { title: 'Automate Everything', text: 'If it is done twice, it becomes a pipeline, a playbook or an agent.' },
  { title: 'GitOps by Default', text: 'Git is the single source of truth — every change reviewed, versioned and reversible.' },
  { title: 'Observable by Design', text: 'Metrics, logs and traces are shipped with the service, not bolted on later.' },
  { title: 'Secure the Supply Chain', text: 'CodeQL, Dependabot, Vault and image scanning gate every release.' },
]

// Flagship platform showcased with an interactive layer stack.
export const flagship = {
  tag: 'Core Platform',
  title: 'AA Platform — AI-Driven DevSecOps Ecosystem',
  text:
    'An enterprise platform on Azure Kubernetes Service where LLM agents raise vulnerability fixes as pull requests, RAG turns plain-English questions into SQL dashboards, and docs stay in sync with code — all on multi-zone, GitOps-managed infrastructure.',
  meta: 'Hyderabad · American Airlines · 2025 — Present',
  stats: [
    { value: 'Multi-AZ', label: 'AKS Topology' },
    { value: 'ZRS', label: 'Storage Redundancy' },
    { value: 'MCP', label: 'Agent Tooling' },
    { value: 'RAG', label: 'Text-to-SQL' },
  ],
  layers: [
    { id: 'L1', name: 'Cloud Fabric', detail: 'AWS & Azure provisioned end-to-end with Terraform modules — VPCs, IAM, managed databases and storage, all reviewed as code.', tools: ['Terraform', 'AWS', 'Azure'] },
    { id: 'L2', name: 'Orchestration', detail: 'EKS & AKS clusters with ingress controllers, CSI drivers and Karpenter spot autoscaling — multi-zone for high availability.', tools: ['EKS', 'AKS', 'Karpenter', 'Helm'] },
    { id: 'L3', name: 'Delivery', detail: 'GitHub Actions, Jenkins & Azure Pipelines with SonarQube quality gates, image scanning and environment-specific triggers.', tools: ['GitHub Actions', 'Jenkins', 'SonarQube'] },
    { id: 'L4', name: 'GitOps', detail: 'Argo CD promotions — commit-based for dev, tag-based for staging, release-notes-based for production.', tools: ['Argo CD', 'Flux'] },
    { id: 'L5', name: 'Security', detail: 'Secrets in HashiCorp Vault; CodeQL, Dependabot and Tenable wired into every repository and AKS environment.', tools: ['Vault', 'CodeQL', 'Tenable'] },
    { id: 'L6', name: 'Observability', detail: 'Prometheus + Grafana, Datadog in production, ELK / OpenSearch and Fluent Bit for centralised logging.', tools: ['Prometheus', 'Grafana', 'Datadog', 'ELK'] },
    { id: 'L7', name: 'AI Ops', detail: 'LLM agents over MCP generate fixes, raise PRs, sync READMEs and answer data questions through a RAG pipeline.', tools: ['LLMs', 'MCP', 'RAG', 'AI Agents'] },
  ],
}

// Entries for the filterable "Systems Matrix" grid.
export const systems = [
  { category: 'AI / Automation', title: 'Autonomous Vulnerability Remediation', text: 'AI agents read scanner findings, open user stories, generate code fixes and raise pull requests with minimal developer intervention.', tags: ['LLM Agents', 'MCP', 'GitHub'] },
  { category: 'AI / Automation', title: 'RAG Text-to-SQL Insight Engine', text: 'Natural-language questions converted into SQL against enterprise databases with results rendered as live dashboards.', tags: ['RAG', 'LLM', 'SQL'] },
  { category: 'AI / Automation', title: 'Self-Syncing Documentation', text: 'GitHub Actions + AI workflows that keep README files and technical docs aligned with every code change.', tags: ['GitHub Actions', 'GenAI'] },
  { category: 'CI/CD & GitOps', title: 'GitHub Actions + Argo CD Framework', text: 'Build, scan and push to ECR, gate on SonarQube, then promote across dev, staging and prod through Argo CD.', tags: ['Argo CD', 'ECR', 'SonarQube'] },
  { category: 'CI/CD & GitOps', title: 'Dockerised Jenkins Delivery to K8s', text: 'Optimised Maven builds, Twistlock & Lacework scanned images in Artifactory, Helm-bundled deployments.', tags: ['Jenkins', 'Helm', 'Artifactory'] },
  { category: 'Cloud & IaC', title: 'EKS + Karpenter on Terraform', text: 'A fully IaC-provisioned EKS cluster with Karpenter spot autoscaling — 70% infrastructure cost reduction.', tags: ['Terraform', 'EKS', 'Karpenter'] },
  { category: 'Cloud & IaC', title: 'Multi-Zone AKS Resilience Migration', text: 'Moved AKS workloads from single-zone to multi-zone and Azure storage from LRS to ZRS for high availability.', tags: ['AKS', 'Azure', 'HA'] },
  { category: 'Observability', title: 'Prometheus Exporter for ECM', text: 'A custom Prometheus exporter and bespoke Grafana dashboards for ECM containerised deployments.', tags: ['Prometheus', 'Grafana'] },
  { category: 'Observability', title: 'EKS Observability Stack', text: 'OpenSearch / Elasticsearch logging, Prometheus + Grafana metrics and Datadog APM for production workloads.', tags: ['Datadog', 'OpenSearch'] },
  { category: 'Containers', title: 'Airflow to Kubernetes Migration', text: 'Migrated Airflow from single-machine Docker Compose to Kubernetes for scale and operational efficiency.', tags: ['Airflow', 'Kubernetes'] },
  { category: 'Containers', title: 'Ansible Multi-DB Backup Engine', text: 'Playbooks automating backups across MS SQL, Oracle, PostgreSQL and more — consistent, reliable, low data-loss risk.', tags: ['Ansible', 'Oracle', 'PostgreSQL'] },
  { category: 'Containers', title: 'Vault-Backed Kubernetes Secrets', text: 'HashiCorp Vault integrated with Kubernetes so applications consume secrets without ever storing them in Git.', tags: ['Vault', 'Kubernetes'] },
]

export const personal = [
  { icon: '⌂', title: 'Home Lab Tinkerer', text: 'Runs a personal lab to break, rebuild and benchmark new CNCF projects before they reach production.' },
  { icon: '◎', title: 'Mentor', text: 'Mentored junior engineers to a measurable 40% productivity lift — loves pairing on pipelines.' },
  { icon: '✦', title: 'Always Certifying', text: 'CKAD & KCNA certified, CKA practice-tested — learning in public, one exam at a time.' },
  { icon: '◈', title: 'Multilingual', text: 'Speaks English, Telugu and Hindi. Based in Hyderabad, India — collaborates across time zones.' },
]

export const contactCopy = {
  label: 'Direct Connect',
  titleTop: "Let's Architect Something",
  titleBottom: 'Unbreakable.',
  text: 'Available for platform engineering, DevOps transformation, Kubernetes architecture and AI-driven automation conversations worldwide.',
}