/**
 * NEXUS AI RESUME - CORE APPLICATION ENGINE
 * High-performance state management, ATS scoring algorithms,
 * Google X-Y-Z impact validator, and live reactive preview.
 */

// Global App State
const state = {
  profile: {
    fullname: "Alex Rivera",
    jobtitle: "Senior AI & Machine Learning Engineer",
    email: "alex@rivera.ai",
    phone: "+1 (415) 890-3421",
    location: "San Francisco, CA (Open to Remote)",
    linkedin: "linkedin.com/in/alexrivera-ai",
    github: "github.com/alexrivera",
    website: "alexrivera.dev",
    summary: "Innovative Senior AI Engineer with 6+ years of experience designing scalable LLM architectures, fine-tuning foundational models, and deploying high-throughput ML pipelines in production. Spearheaded enterprise RAG systems reducing query hallucination by 48% and cut cloud inference costs by $340K annually.",
    skills: {
      lang: "Python, TypeScript, C++, Go, SQL",
      frameworks: "PyTorch, Hugging Face, LangChain, LlamaIndex, vLLM, TensorRT",
      cloud: "Google Cloud (Vertex AI), AWS (SageMaker), Docker, Kubernetes, MLflow, CI/CD",
      data: "PostgreSQL, Redis, Kafka, Pinecone, Qdrant, Milvus"
    },
    experience: [
      {
        id: "exp-1",
        role: "Senior AI Engineer",
        company: "Nexus Systems AI",
        location: "San Francisco, CA",
        dates: "2023 - Present",
        bullets: [
          "Architected and deployed a multi-agent LLM orchestration pipeline serving 4.5M+ requests/month, decreasing average response latency from 1.8s to 420ms (76% reduction).",
          "Fine-tuned open-source LLMs (Llama 3, Mistral) on 12M+ domain-specific tokens, boosting task-specific benchmark accuracy from 71% to 94.2% while slashing OpenAI API spend by $28,000/month.",
          "Engineered real-time vector search index using Pinecone and hybrid BM25 retrieval, elevating search relevance recall@10 by 34%."
        ]
      },
      {
        id: "exp-2",
        role: "Machine Learning Engineer",
        company: "Quantum Analytics Inc.",
        location: "Palo Alto, CA",
        dates: "2020 - 2023",
        bullets: [
          "Built and scaled distributed computer vision inference pipelines handling 100K+ image classifications/day across Kubernetes cluster with 99.99% uptime.",
          "Optimized PyTorch model quantization and ONNX runtime integration, reducing memory footprint by 58% and accelerating edge inference by 3.2x.",
          "Automated feature engineering and CI/CD testing pipelines with MLflow and Airflow, cutting model deployment turnaround time from 2 weeks to 4 hours."
        ]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Autonomous RAG Knowledge Agent",
        tech: "Python, LangChain, FastAPI, Qdrant, Docker",
        link: "github.com/alexrivera/auto-rag",
        bullets: [
          "Developed an autonomous multi-document question answering agent with semantic caching, achieving 98.4% citation factual precision across 50,000 internal documents.",
          "Garnered 1.8k+ GitHub stars and 400+ weekly active open-source developers."
        ]
      },
      {
        id: "proj-2",
        title: "NeuroVision: Real-Time Edge Detector",
        tech: "C++, PyTorch, TensorRT, CUDA",
        link: "github.com/alexrivera/neurovision",
        bullets: [
          "Implemented ultra-low-latency object detection on embedded Jetson Orin hardware, sustaining 60 FPS video processing with sub-15ms inference latency."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science (Artificial Intelligence & Systems)",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        dates: "2016 - 2020",
        honors: "Magna Cum Laude • GPA: 3.88/4.0 • EECS Honors Program"
      }
    ],
    activities: [
      {
        id: "act-1",
        role: "Lead Technical Mentor & Speaker",
        organization: "Global AI Hackathon & Berkeley AI Club",
        location: "San Francisco, CA",
        dates: "2023 - Present",
        bullets: [
          "Mentored 200+ developers on fine-tuning open-source LLMs and RAG system architecture across 3 national hackathons.",
          "Delivered keynote workshop on 'Productionizing Agentic Workflows' to an audience of 600+ engineers."
        ]
      },
      {
        id: "act-2",
        role: "Open Source Contributor & Maintainer",
        organization: "PyTorch & Hugging Face Community",
        location: "Remote",
        dates: "2021 - Present",
        bullets: [
          "Contributed 15+ pull requests improving vector indexing and documentation, assisting 20,000+ monthly active open-source developers."
        ]
      }
    ],
    certifications: [
      "AWS Certified Machine Learning - Specialty (2024)",
      "Google Cloud Professional Machine Learning Engineer (2023)",
      "DeepLearning.AI: Deep Learning Specialization by Andrew Ng (2021)"
    ]
  },
  activeTemplate: "template-modern",
  targetJD: "",
  currentDbResumeId: null,
  currentDbResumeTitle: "Senior AI Engineer",
  isBackendOnline: false,
  activeColor: "accent-indigo",
  activeFont: "font-inter",
  activeDensity: "density-standard",
  zoomLevel: 100,
  sectionOrder: ["summary", "skills", "experience", "projects", "education", "activities", "certifications"],
  sectionVisibility: {
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    activities: true,
    certifications: true
  },
  coverLetter: {
    company: "Frontier AI Labs",
    manager: "AI Engineering Hiring Committee",
    role: "Senior AI & Machine Learning Engineer",
    tone: "technical",
    body: ""
  }
};

// Backend REST API Base URL
const API_BASE = "http://127.0.0.1:5000/api";

// Power action verbs dictionary for ATS analysis
const POWER_VERBS = [
  "architected", "spearheaded", "engineered", "optimized", "fine-tuned",
  "accelerated", "scaled", "automated", "reduced", "boosted", "implemented",
  "deployed", "orchestrated", "transformed", "designed", "built", "developed",
  "slashed", "maximized", "formulated", "led", "decreased", "increased",
  "streamlined", "generated", "pioneered", "revamped", "modernized", "delivered"
];

// Weak / passive verbs that damage ATS impact scores
const WEAK_VERBS = [
  "worked on", "helped", "responsible for", "assisted", "handled", "managed",
  "did", "tried", "participated in", "took part", "supported", "contributed to",
  "tasked with", "duties included"
];

// Corporate clichés and empty buzzwords that weaken technical resumes
const RESUME_CLICHES = [
  { phrase: "team player", tip: "Replace with: 'Collaborated across cross-functional squads to...'" },
  { phrase: "hard worker", tip: "Demonstrate via quantifiable output (e.g. delivered 4 releases ahead of schedule)" },
  { phrase: "go-getter", tip: "Demonstrate via: 'Spearheaded', 'Pioneered', or 'Initiated'" },
  { phrase: "synergy", tip: "Replace with: 'Cross-system integration' or 'collaborative efficiency'" },
  { phrase: "think outside the box", tip: "Replace with: 'Architected novel algorithm' or 'Engineered workaround'" },
  { phrase: "results-driven", tip: "Replace with hard numbers and business metrics directly" },
  { phrase: "detail-oriented", tip: "Demonstrate with zero-defect rate or test coverage %" },
  { phrase: "dynamic", tip: "Omit filler word; describe concrete system adaptability" },
  { phrase: "proactive", tip: "Replace with: 'Preemptively resolved' or 'Automated prevention'" },
  { phrase: "self-starter", tip: "Replace with: 'Independently engineered' or 'Founded'" }
];

// Alternate Demo Profiles
const DEMO_PROFILES = {
  fullstack: {
    fullname: "Jordan Chen",
    jobtitle: "Staff Full-Stack Software Engineer",
    email: "jordan.chen@devmail.io",
    phone: "+1 (206) 555-0199",
    location: "Seattle, WA (Hybrid)",
    linkedin: "linkedin.com/in/jordanchen-swe",
    github: "github.com/jordanchen",
    website: "jordanchen.io",
    summary: "High-impact Staff Full-Stack Engineer with 8+ years architecting cloud-native distributed microservices and reactive frontend platforms. Expert in Next.js, Node.js, TypeScript, and AWS. Proven track record scaling platforms from zero to 10M+ MAU with 99.99% availability.",
    skills: {
      lang: "TypeScript, JavaScript, Go, Python, SQL, HTML5/CSS3",
      frameworks: "React, Next.js, Node.js, Express, NestJS, GraphQL, TailwindCSS",
      cloud: "AWS (ECS, Lambda, CloudFront), Terraform, Docker, Kubernetes, GitHub Actions",
      data: "PostgreSQL, DynamoDB, Redis, Elasticsearch, Kafka"
    },
    experience: [
      {
        id: "exp-1",
        role: "Staff Software Engineer",
        company: "Stratos Cloud",
        location: "Seattle, WA",
        dates: "2022 - Present",
        bullets: [
          "Spearheaded the migration of monolithic checkout service to event-driven serverless architecture, reducing checkout latency by 64% and supporting $45M in peak holiday volume.",
          "Architected shared Design System with Next.js & TypeScript adopted across 14 product squads, accelerating frontend delivery cycles by 35%."
        ]
      },
      {
        id: "exp-2",
        role: "Senior Full-Stack Engineer",
        company: "Vanguard Tech",
        location: "Seattle, WA",
        dates: "2019 - 2022",
        bullets: [
          "Engineered high-concurrency WebSocket notification infrastructure processing 250,000 concurrent socket connections with sub-50ms message broadcast latency.",
          "Designed automated end-to-end testing pipeline with Playwright, decreasing production regression bug incidents by 82%."
        ]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "FastGraph: Lightweight GraphQL Gateway",
        tech: "Go, GraphQL, Redis, Docker",
        link: "github.com/jordanchen/fastgraph",
        bullets: [
          "Engineered high-throughput Go proxy caching GraphQL query ASTs, reducing database query volume by 45% for 3,000+ RPS."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science",
        school: "University of Washington",
        location: "Seattle, WA",
        dates: "2015 - 2019",
        honors: "Dean's List (All Quarters) • GPA: 3.92/4.0"
      }
    ],
    activities: [
      {
        id: "act-1",
        role: "Co-Organizer & Technical Speaker",
        organization: "Seattle Cloud & React Meetup",
        location: "Seattle, WA",
        dates: "2021 - Present",
        bullets: [
          "Organized monthly technical meetups with 1,200+ members; facilitated hands-on workshops on Next.js server actions and distributed microfrontends."
        ]
      }
    ],
    certifications: [
      "AWS Certified Solutions Architect - Professional (2024)",
      "CKA: Certified Kubernetes Administrator (2023)"
    ]
  },
  datascientist: {
    fullname: "Dr. Elena Rostova",
    jobtitle: "Lead Data Scientist & Predictive Modeler",
    email: "elena.rostova@datascience.org",
    phone: "+1 (617) 555-8291",
    location: "Boston, MA (Remote)",
    linkedin: "linkedin.com/in/elena-rostova-phd",
    github: "github.com/erostova",
    website: "elenarostova.science",
    summary: "Quantitative Data Scientist & PhD with 7+ years of experience extracting commercial intelligence and building predictive machine learning models. Built customer lifetime value (CLV) and churn prediction models driving $18.5M in retained annual recurring revenue.",
    skills: {
      lang: "Python, R, SQL, Julia, Scala",
      frameworks: "Scikit-Learn, XGBoost, LightGBM, Statsmodels, Pandas, NumPy, SciPy",
      cloud: "Google Cloud Platform (BigQuery, Vertex AI), Databricks, Snowflake, dbt",
      data: "Time-Series Forecasting, A/B Hypothesis Testing, Bayesian Inference, Causal Analysis"
    },
    experience: [
      {
        id: "exp-1",
        role: "Lead Data Scientist",
        company: "Apex Financial",
        location: "Boston, MA",
        dates: "2021 - Present",
        bullets: [
          "Developed ensemble gradient boosting fraud detection model on 85M+ credit transactions, cutting false-positive declines by 42% and saving $6.4M in annual chargebacks.",
          "Designed statistical A/B testing framework evaluating 120+ concurrent product experiments with rigorous Bayesian sequential sampling, accelerating test conclusion time by 3 weeks."
        ]
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "ProphetX: Hierarchical Demand Forecaster",
        tech: "Python, Stan, Prophet, Streamlit",
        link: "github.com/erostova/prophetx",
        bullets: [
          "Built hierarchical time-series model predicting supply chain inventory requirements with 96.1% forecast accuracy across 12,000 SKUs."
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "Ph.D. in Applied Statistics & Machine Learning",
        school: "Massachusetts Institute of Technology (MIT)",
        location: "Cambridge, MA",
        dates: "2017 - 2021",
        honors: "Doctoral Fellowship • 6 Peer-Reviewed Papers in NeurIPS / ICML"
      }
    ],
    activities: [
      {
        id: "act-1",
        role: "Technical Committee & Mentor",
        organization: "Women in Machine Learning (WiML) & MIT Data Club",
        location: "Boston, MA",
        dates: "2020 - Present",
        bullets: [
          "Mentored 35+ graduate students on causal inference and predictive modeling; reviewed 20+ workshop papers for NeurIPS and ICML."
        ]
      }
    ],
    certifications: [
      "Google Cloud Certified Professional Data Engineer (2024)"
    ]
  }
};

// Sample Target Job Description for Testing Matcher
const SAMPLE_AI_JD = `
Job Title: Senior AI & Machine Learning Engineer (Platform & LLMs)
Company: Frontier AI Labs
Location: San Francisco, CA / Remote

About the Role:
We are looking for a Senior AI & Machine Learning Engineer to design and deploy state-of-the-art Large Language Model (LLM) infrastructure, autonomous agents, and high-throughput retrieval augmented generation (RAG) pipelines.

Responsibilities:
- Architect distributed LLM inference pipelines with low latency (sub-500ms) and high throughput using vLLM, TensorRT, or Triton.
- Fine-tune open-source models (Llama, Mistral) with domain-specific datasets using PyTorch, LoRA, and Hugging Face.
- Build resilient RAG architectures utilizing vector databases such as Pinecone, Qdrant, or Milvus with hybrid keyword retrieval.
- Deploy and monitor production ML models on cloud infrastructure (Google Cloud Vertex AI or AWS SageMaker) with Docker, Kubernetes, and MLflow.
- Optimize inference costs, memory footprint, and token latency across multi-GPU clusters.

Requirements:
- 5+ years of software engineering and machine learning experience in production.
- Proficient in Python, C++, and modern SQL.
- Deep hands-on experience with PyTorch, Hugging Face, LangChain, and vector embeddings.
- Track record of quantifiable business impact (e.g. latency reduction, cost reduction, accuracy lift).
- Strong understanding of microservices, Kafka, Redis, and distributed systems.
`;

/* ==========================================================================
   INITIALIZATION & EVENT BINDINGS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initFormValues();
  renderExperienceEditor();
  renderProjectsEditor();
  renderEducationEditor();
  renderActivitiesEditor();
  renderSectionManager();
  initCoverLetter();
  renderLiveResumePreview();
  applyPaperCustomization();
  runAtsAudit();
  generateAiPrompts();
  setupEventListeners();
  checkBackendHealth();
});

// Sync initial state to form inputs
function initFormValues() {
  const p = state.profile;
  document.getElementById("input-fullname").value = p.fullname || "";
  document.getElementById("input-jobtitle").value = p.jobtitle || "";
  document.getElementById("input-email").value = p.email || "";
  document.getElementById("input-phone").value = p.phone || "";
  document.getElementById("input-location").value = p.location || "";
  document.getElementById("input-linkedin").value = p.linkedin || "";
  document.getElementById("input-github").value = p.github || "";
  document.getElementById("input-website").value = p.website || "";
  document.getElementById("input-summary").value = p.summary || "";
  document.getElementById("input-skills-lang").value = p.skills.lang || "";
  document.getElementById("input-skills-frameworks").value = p.skills.frameworks || "";
  document.getElementById("input-skills-cloud").value = p.skills.cloud || "";
  document.getElementById("input-skills-data").value = p.skills.data || "";
  document.getElementById("input-certifications").value = p.certifications.join("\n");
  updateSummaryWordCount();
}

// Bind all DOM events
function setupEventListeners() {
  // Input changes in core fields
  const coreInputs = [
    "input-fullname", "input-jobtitle", "input-email", "input-phone",
    "input-location", "input-linkedin", "input-github", "input-website",
    "input-summary", "input-skills-lang", "input-skills-frameworks",
    "input-skills-cloud", "input-skills-data", "input-certifications"
  ];

  coreInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", () => {
        handleCoreInputChange(id);
        renderLiveResumePreview();
        runAtsAudit();
      });
    }
  });

  // Tab switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Header ATS widget click switches to ATS audit tab
  document.getElementById("header-ats-widget").addEventListener("click", () => {
    document.querySelector('[data-tab="tab-ats"]').click();
  });

  // Template switching
  document.querySelectorAll(".template-btn-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".template-btn-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const templateClass = btn.getAttribute("data-template");
      state.activeTemplate = templateClass;
      applyPaperCustomization();
    });
  });

  // Add Item Buttons
  document.getElementById("btn-add-experience").addEventListener("click", addExperienceItem);
  document.getElementById("btn-add-project").addEventListener("click", addProjectItem);
  document.getElementById("btn-add-education").addEventListener("click", addEducationItem);
  document.getElementById("btn-add-activity").addEventListener("click", addActivityItem);

  // Quick Action Verb chips insert into first experience bullet
  document.querySelectorAll(".verb-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const verb = chip.getAttribute("data-verb");
      if (state.profile.experience.length > 0) {
        state.profile.experience[0].bullets[0] = verb + " " + state.profile.experience[0].bullets[0];
        renderExperienceEditor();
        renderLiveResumePreview();
        runAtsAudit();
      }
    });
  });

  // AI Polish for Summary
  document.getElementById("btn-ai-enhance-summary").addEventListener("click", enhanceSummary);

  // Load Demo Profiles
  document.getElementById("btn-load-ai-engineer").addEventListener("click", () => loadDemoProfile("ai"));
  document.getElementById("btn-load-fullstack").addEventListener("click", () => loadDemoProfile("fullstack"));
  document.getElementById("btn-load-data-scientist").addEventListener("click", () => loadDemoProfile("datascientist"));

  // JD Tailoring
  document.getElementById("btn-load-sample-jd").addEventListener("click", () => {
    document.getElementById("input-jd-text").value = SAMPLE_AI_JD.trim();
  });
  document.getElementById("btn-scan-jd").addEventListener("click", scanJobDescription);

  // AI Prompt Studio Refresh
  document.getElementById("btn-refresh-prompts").addEventListener("click", generateAiPrompts);

  // Print PDF
  document.getElementById("btn-print-pdf").addEventListener("click", triggerPrint);
  document.getElementById("btn-print-preview").addEventListener("click", triggerPrint);

  // Plain Text ATS Modal
  const modal = document.getElementById("plain-text-modal");
  document.getElementById("btn-open-plain-text").addEventListener("click", () => {
    document.getElementById("modal-plain-text").value = generatePlainTextResume();
    modal.classList.add("active");
  });
  document.getElementById("btn-close-modal").addEventListener("click", () => modal.classList.remove("active"));
  document.getElementById("btn-modal-cancel").addEventListener("click", () => modal.classList.remove("active"));
  document.getElementById("btn-modal-copy").addEventListener("click", () => {
    const textEl = document.getElementById("modal-plain-text");
    textEl.select();
    navigator.clipboard.writeText(textEl.value).then(() => {
      alert("✅ ATS Plain Text copied to clipboard!");
      modal.classList.remove("active");
    });
  });

  // Export JSON
  document.getElementById("btn-export-json").addEventListener("click", exportResumeJson);

  // Import JSON
  document.getElementById("file-import-json").addEventListener("change", importResumeJson);

  // Database Save Version Modal
  document.getElementById("btn-save-db").addEventListener("click", openSaveDbModal);
  document.getElementById("btn-close-save-modal").addEventListener("click", () => {
    document.getElementById("save-db-modal").classList.remove("active");
  });
  document.getElementById("btn-cancel-save-modal").addEventListener("click", () => {
    document.getElementById("save-db-modal").classList.remove("active");
  });
  document.getElementById("btn-confirm-save-db").addEventListener("click", saveResumeToBackend);

  // Database Resumes & Version Control Modal
  document.getElementById("btn-open-resumes-db").addEventListener("click", openDatabaseModal);
  document.getElementById("btn-close-db-modal").addEventListener("click", () => {
    document.getElementById("database-resumes-modal").classList.remove("active");
  });
  document.getElementById("btn-close-db-footer").addEventListener("click", () => {
    document.getElementById("database-resumes-modal").classList.remove("active");
  });
  document.getElementById("btn-refresh-db-list").addEventListener("click", fetchSavedResumes);
  document.getElementById("btn-back-to-resumes").addEventListener("click", () => {
    document.getElementById("db-versions-view").style.display = "none";
    document.getElementById("db-resumes-list-view").style.display = "block";
  });

  // Color Swatch Picker
  document.querySelectorAll(".color-swatch-circle").forEach(swatch => {
    swatch.addEventListener("click", () => {
      document.querySelectorAll(".color-swatch-circle").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");
      state.activeColor = swatch.getAttribute("data-color");
      applyPaperCustomization();
    });
  });

  // Font Family Selector
  const fontSelect = document.getElementById("select-resume-font");
  if (fontSelect) {
    fontSelect.addEventListener("change", (e) => {
      state.activeFont = e.target.value;
      applyPaperCustomization();
    });
  }

  // Density Selector
  const densitySelect = document.getElementById("select-resume-density");
  if (densitySelect) {
    densitySelect.addEventListener("change", (e) => {
      state.activeDensity = e.target.value;
      applyPaperCustomization();
    });
  }

  // Zoom Controls
  document.getElementById("btn-zoom-in")?.addEventListener("click", () => setZoom(state.zoomLevel + 10));
  document.getElementById("btn-zoom-out")?.addEventListener("click", () => setZoom(state.zoomLevel - 10));
  document.getElementById("btn-zoom-reset")?.addEventListener("click", () => setZoom(100));

  // Cover Letter Studio Controls
  document.getElementById("btn-generate-cover-letter")?.addEventListener("click", generateCoverLetter);
  document.getElementById("btn-print-cover-letter")?.addEventListener("click", printCoverLetter);
  document.getElementById("cl-input-body")?.addEventListener("input", updateCoverLetterWordCount);
  document.getElementById("cl-select-tone")?.addEventListener("change", generateCoverLetter);
}

// Update State from Core Inputs
function handleCoreInputChange(id) {
  const p = state.profile;
  const val = document.getElementById(id).value;
  switch (id) {
    case "input-fullname": p.fullname = val; break;
    case "input-jobtitle": p.jobtitle = val; break;
    case "input-email": p.email = val; break;
    case "input-phone": p.phone = val; break;
    case "input-location": p.location = val; break;
    case "input-linkedin": p.linkedin = val; break;
    case "input-github": p.github = val; break;
    case "input-website": p.website = val; break;
    case "input-summary": 
      p.summary = val; 
      updateSummaryWordCount();
      break;
    case "input-skills-lang": p.skills.lang = val; break;
    case "input-skills-frameworks": p.skills.frameworks = val; break;
    case "input-skills-cloud": p.skills.cloud = val; break;
    case "input-skills-data": p.skills.data = val; break;
    case "input-certifications":
      p.certifications = val.split("\n").map(s => s.trim()).filter(Boolean);
      break;
  }
}

function updateSummaryWordCount() {
  const summary = state.profile.summary || "";
  const count = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const label = document.getElementById("summary-counter");
  if (label) {
    label.innerText = `${count} words ${count >= 30 && count <= 75 ? "(Optimal)" : "(Aim for 35-65 words)"}`;
  }
}

/* ==========================================================================
   DYNAMIC SECTION RENDERERS (EDITOR)
   ========================================================================== */

function renderExperienceEditor() {
  const container = document.getElementById("experience-list-container");
  container.innerHTML = "";

  state.profile.experience.forEach((exp, idx) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-card-top">
        <span class="item-badge">Role #${idx + 1}</span>
        <button class="btn btn-danger-outline btn-sm" onclick="deleteExperience('${exp.id}')">Delete</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Job Title / Role</label>
          <input type="text" class="form-input" value="${escapeHtml(exp.role)}" oninput="updateExperience('${exp.id}', 'role', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Company / Organization</label>
          <input type="text" class="form-input" value="${escapeHtml(exp.company)}" oninput="updateExperience('${exp.id}', 'company', this.value)">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-input" value="${escapeHtml(exp.location)}" oninput="updateExperience('${exp.id}', 'location', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Dates / Period</label>
          <input type="text" class="form-input" value="${escapeHtml(exp.dates)}" oninput="updateExperience('${exp.id}', 'dates', this.value)">
        </div>
      </div>
      <div class="form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <label class="form-label" style="margin-bottom: 0;">Achievement Bullet Points (Google X-Y-Z)</label>
          <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 2px 6px;" onclick="addBulletToExperience('${exp.id}')">+ Add Bullet</button>
        </div>
        <div id="exp-bullets-${exp.id}">
          ${exp.bullets.map((b, bIdx) => `
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.4rem; align-items: flex-start;">
              <textarea class="form-textarea" rows="2" style="min-height: 52px; font-size: 0.82rem;" oninput="updateExperienceBullet('${exp.id}', ${bIdx}, this.value)">${escapeHtml(b)}</textarea>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <button class="btn btn-secondary btn-sm" style="padding: 4px;" title="AI Re-phrase to Google XYZ" onclick="aiPolishBullet('${exp.id}', ${bIdx})">✨</button>
                <button class="btn btn-danger-outline btn-sm" style="padding: 4px;" title="Remove bullet" onclick="removeBulletFromExperience('${exp.id}', ${bIdx})">✕</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateExperience(id, field, value) {
  const exp = state.profile.experience.find(e => e.id === id);
  if (exp) {
    exp[field] = value;
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function updateExperienceBullet(id, bulletIdx, value) {
  const exp = state.profile.experience.find(e => e.id === id);
  if (exp && exp.bullets[bulletIdx] !== undefined) {
    exp.bullets[bulletIdx] = value;
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function addBulletToExperience(id) {
  const exp = state.profile.experience.find(e => e.id === id);
  if (exp) {
    exp.bullets.push("Architected and implemented [system/feature] reducing [bottleneck] by 30% for 100K+ users.");
    renderExperienceEditor();
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function removeBulletFromExperience(id, bulletIdx) {
  const exp = state.profile.experience.find(e => e.id === id);
  if (exp) {
    exp.bullets.splice(bulletIdx, 1);
    renderExperienceEditor();
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function addExperienceItem() {
  const newExp = {
    id: "exp-" + Date.now(),
    role: "Senior Software Engineer",
    company: "Company Name",
    location: "City, State",
    dates: "2021 - 2023",
    bullets: [
      "Engineered high-throughput service resulting in 40% performance improvement across 500K daily transactions."
    ]
  };
  state.profile.experience.unshift(newExp);
  renderExperienceEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

function deleteExperience(id) {
  state.profile.experience = state.profile.experience.filter(e => e.id !== id);
  renderExperienceEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

// AI Polish specific bullet point to Google XYZ
function aiPolishBullet(expId, bIdx) {
  const exp = state.profile.experience.find(e => e.id === expId);
  if (!exp) return;
  const current = exp.bullets[bIdx];

  // Algorithmic transformer: replace weak verbs and inject quantifiable benchmark metrics
  let enhanced = current;
  if (/worked on|helped with|responsible for/i.test(enhanced)) {
    enhanced = enhanced.replace(/worked on|helped with|responsible for/gi, "Architected and delivered");
  } else if (!/^[A-Z][a-z]+ed\b/.test(enhanced)) {
    enhanced = "Spearheaded " + enhanced.charAt(0).toLowerCase() + enhanced.slice(1);
  }

  // Ensure metric presence if missing
  if (!/\d+%|\$\d+|\b\d+x\b|\d+K|\d+M/i.test(enhanced)) {
    enhanced += ", accelerating execution velocity by 38% and saving 200+ engineering hours annually";
  }

  exp.bullets[bIdx] = enhanced;
  renderExperienceEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

// AI Polish Executive Summary
function enhanceSummary() {
  const current = state.profile.summary;
  const polished = "Strategic and results-driven Senior AI & Machine Learning Engineer with 6+ years of expertise architecting high-throughput distributed LLM microservices and production machine learning pipelines. Demonstrated track record delivering 76% latency reductions and $340K+ in annual infrastructure cost savings across multi-region cloud clusters.";
  state.profile.summary = polished;
  document.getElementById("input-summary").value = polished;
  updateSummaryWordCount();
  renderLiveResumePreview();
  runAtsAudit();
}

/* ==========================================================================
   PROJECTS & EDUCATION RENDERERS
   ========================================================================== */
function renderProjectsEditor() {
  const container = document.getElementById("projects-list-container");
  container.innerHTML = "";

  state.profile.projects.forEach((proj, idx) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-card-top">
        <span class="item-badge">Project #${idx + 1}</span>
        <button class="btn btn-danger-outline btn-sm" onclick="deleteProject('${proj.id}')">Delete</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Title</label>
          <input type="text" class="form-input" value="${escapeHtml(proj.title)}" oninput="updateProject('${proj.id}', 'title', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Tech Stack (comma-separated)</label>
          <input type="text" class="form-input" value="${escapeHtml(proj.tech)}" oninput="updateProject('${proj.id}', 'tech', this.value)">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">URL / Repository Link</label>
        <input type="text" class="form-input" value="${escapeHtml(proj.link)}" oninput="updateProject('${proj.id}', 'link', this.value)">
      </div>
      <div class="form-group">
        <label class="form-label">Project Impact & Metrics</label>
        <textarea class="form-textarea" rows="2" oninput="updateProjectBullets('${proj.id}', this.value)">${escapeHtml(proj.bullets.join("\n"))}</textarea>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateProject(id, field, value) {
  const proj = state.profile.projects.find(p => p.id === id);
  if (proj) {
    proj[field] = value;
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function updateProjectBullets(id, textValue) {
  const proj = state.profile.projects.find(p => p.id === id);
  if (proj) {
    proj.bullets = textValue.split("\n").filter(Boolean);
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function addProjectItem() {
  state.profile.projects.push({
    id: "proj-" + Date.now(),
    title: "New AI Open Source Tool",
    tech: "Python, PyTorch, FastAPI",
    link: "github.com/alexrivera/new-tool",
    bullets: ["Engineered open-source ML tool downloaded 10K+ times, achieving 99.2% benchmark accuracy."]
  });
  renderProjectsEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

function deleteProject(id) {
  state.profile.projects = state.profile.projects.filter(p => p.id !== id);
  renderProjectsEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

function renderEducationEditor() {
  const container = document.getElementById("education-list-container");
  container.innerHTML = "";

  state.profile.education.forEach((edu, idx) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-card-top">
        <span class="item-badge">Degree #${idx + 1}</span>
        <button class="btn btn-danger-outline btn-sm" onclick="deleteEducation('${edu.id}')">Delete</button>
      </div>
      <div class="form-group">
        <label class="form-label">Degree & Major</label>
        <input type="text" class="form-input" value="${escapeHtml(edu.degree)}" oninput="updateEducation('${edu.id}', 'degree', this.value)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">University / School</label>
          <input type="text" class="form-input" value="${escapeHtml(edu.school)}" oninput="updateEducation('${edu.id}', 'school', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Years / Graduation</label>
          <input type="text" class="form-input" value="${escapeHtml(edu.dates)}" oninput="updateEducation('${edu.id}', 'dates', this.value)">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Honors / GPA / Distinctions</label>
        <input type="text" class="form-input" value="${escapeHtml(edu.honors || '')}" oninput="updateEducation('${edu.id}', 'honors', this.value)">
      </div>
    `;
    container.appendChild(card);
  });
}

function updateEducation(id, field, value) {
  const edu = state.profile.education.find(e => e.id === id);
  if (edu) {
    edu[field] = value;
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function addEducationItem() {
  state.profile.education.push({
    id: "edu-" + Date.now(),
    degree: "M.S. in Computer Science",
    school: "Stanford University",
    location: "Stanford, CA",
    dates: "2020 - 2022",
    honors: "GPA: 3.9/4.0"
  });
  renderEducationEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

function deleteEducation(id) {
  state.profile.education = state.profile.education.filter(e => e.id !== id);
  renderEducationEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

/* ==========================================================================
   EXTRACURRICULAR & LEADERSHIP ACTIVITIES EDITOR
   ========================================================================== */
function renderActivitiesEditor() {
  const container = document.getElementById("activities-list-container");
  if (!container) return;
  container.innerHTML = "";

  if (!state.profile.activities) {
    state.profile.activities = [];
  }

  state.profile.activities.forEach((act, idx) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-card-top">
        <span class="item-badge">Activity #${idx + 1}</span>
        <button class="btn btn-danger-outline btn-sm" onclick="deleteActivity('${act.id}')">Delete</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Role / Position Title</label>
          <input type="text" class="form-input" value="${escapeHtml(act.role)}" oninput="updateActivity('${act.id}', 'role', this.value)" placeholder="e.g. Lead Technical Mentor">
        </div>
        <div class="form-group">
          <label class="form-label">Organization / Club / Event</label>
          <input type="text" class="form-input" value="${escapeHtml(act.organization)}" oninput="updateActivity('${act.id}', 'organization', this.value)" placeholder="e.g. Berkeley AI Club">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-input" value="${escapeHtml(act.location || '')}" oninput="updateActivity('${act.id}', 'location', this.value)" placeholder="e.g. San Francisco, CA">
        </div>
        <div class="form-group">
          <label class="form-label">Dates / Duration</label>
          <input type="text" class="form-input" value="${escapeHtml(act.dates)}" oninput="updateActivity('${act.id}', 'dates', this.value)" placeholder="e.g. 2023 - Present">
        </div>
      </div>
      <div class="form-group">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <label class="form-label" style="margin-bottom: 0;">Contribution / Impact Bullets</label>
          <button type="button" class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 2px 6px;" onclick="addBulletToActivity('${act.id}')">+ Add Bullet</button>
        </div>
        <div id="act-bullets-${act.id}">
          ${(act.bullets || []).map((b, bIdx) => `
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.4rem; align-items: flex-start;">
              <textarea class="form-textarea" rows="2" style="min-height: 50px; font-size: 0.82rem;" oninput="updateActivityBullet('${act.id}', ${bIdx}, this.value)">${escapeHtml(b)}</textarea>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <button class="btn btn-secondary btn-sm" style="padding: 4px;" title="AI Re-phrase to Impact Bullet" onclick="aiPolishActivityBullet('${act.id}', ${bIdx})">✨</button>
                <button class="btn btn-danger-outline btn-sm" style="padding: 4px;" title="Remove bullet" onclick="removeBulletFromActivity('${act.id}', ${bIdx})">✕</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function updateActivity(id, field, value) {
  const act = state.profile.activities.find(a => a.id === id);
  if (act) {
    act[field] = value;
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function updateActivityBullet(id, bulletIdx, value) {
  const act = state.profile.activities.find(a => a.id === id);
  if (act && act.bullets[bulletIdx] !== undefined) {
    act.bullets[bulletIdx] = value;
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function addBulletToActivity(id) {
  const act = state.profile.activities.find(a => a.id === id);
  if (act) {
    if (!act.bullets) act.bullets = [];
    act.bullets.push("Spearheaded technical workshops training 100+ members in modern engineering methodologies.");
    renderActivitiesEditor();
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function removeBulletFromActivity(id, bulletIdx) {
  const act = state.profile.activities.find(a => a.id === id);
  if (act && act.bullets) {
    act.bullets.splice(bulletIdx, 1);
    renderActivitiesEditor();
    renderLiveResumePreview();
    runAtsAudit();
  }
}

function aiPolishActivityBullet(id, bulletIdx) {
  const act = state.profile.activities.find(a => a.id === id);
  if (!act || !act.bullets[bulletIdx]) return;
  let text = act.bullets[bulletIdx];
  if (/helped|worked|participated/i.test(text)) {
    text = text.replace(/helped with|worked on|participated in/gi, "Spearheaded and coordinated");
  } else if (!/^[A-Z][a-z]+ed\b/.test(text)) {
    text = "Organized and facilitated " + text.charAt(0).toLowerCase() + text.slice(1);
  }
  if (!/\d+/.test(text)) {
    text += ", engaging 150+ participants and raising $5,000 in student sponsorship funds";
  }
  act.bullets[bulletIdx] = text;
  renderActivitiesEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

function addActivityItem() {
  if (!state.profile.activities) state.profile.activities = [];
  state.profile.activities.push({
    id: "act-" + Date.now(),
    role: "Leadership & Community Contributor",
    organization: "Tech Society / Open Source Community",
    location: "Remote",
    dates: "2023 - Present",
    bullets: [
      "Mentored and guided 50+ junior developers in technical architecture and open-source contributions."
    ]
  });
  renderActivitiesEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

function deleteActivity(id) {
  if (!state.profile.activities) return;
  state.profile.activities = state.profile.activities.filter(a => a.id !== id);
  renderActivitiesEditor();
  renderLiveResumePreview();
  runAtsAudit();
}

/* ==========================================================================
   LIVE RESUME PREVIEW RENDERER
   ========================================================================== */
function renderLiveResumePreview() {
  const p = state.profile;

  // Header Elements
  setText("view-fullname", p.fullname || "Your Name");
  setText("view-jobtitle", p.jobtitle || "");

  // Contacts
  const contactParts = [];
  if (p.email) contactParts.push(p.email);
  if (p.phone) contactParts.push(p.phone);
  if (p.location) contactParts.push(p.location);
  if (p.linkedin) contactParts.push(p.linkedin);
  if (p.github) contactParts.push(p.github);
  if (p.website) contactParts.push(p.website);

  const contactContainer = document.getElementById("view-contacts");
  contactContainer.innerHTML = contactParts.map(c => `<span>${escapeHtml(c)}</span>`).join(` <span style="color: #94a3b8;">•</span> `);

  // Summary
  const summarySection = document.getElementById("view-summary-section");
  if (p.summary) {
    summarySection.style.display = "block";
    setText("view-summary", p.summary);
  } else {
    summarySection.style.display = "none";
  }

  // Skills
  setText("view-skills-lang", p.skills.lang);
  setText("view-skills-frameworks", p.skills.frameworks);
  setText("view-skills-cloud", p.skills.cloud);
  setText("view-skills-data", p.skills.data);

  toggleDisplay("view-skills-lang-row", p.skills.lang);
  toggleDisplay("view-skills-frameworks-row", p.skills.frameworks);
  toggleDisplay("view-skills-cloud-row", p.skills.cloud);
  toggleDisplay("view-skills-data-row", p.skills.data);

  // Experience
  const expContainer = document.getElementById("view-experience-container");
  expContainer.innerHTML = "";
  p.experience.forEach(exp => {
    const item = document.createElement("div");
    item.className = "r-item";
    item.innerHTML = `
      <div class="r-item-head">
        <div>
          <span>${escapeHtml(exp.role)}</span>
          <span style="font-weight: normal; color: #64748b;"> at </span>
          <span class="r-item-company">${escapeHtml(exp.company)}</span>
        </div>
        <div class="r-item-dates">${escapeHtml(exp.dates)} | ${escapeHtml(exp.location || '')}</div>
      </div>
      <ul class="r-bullets">
        ${exp.bullets.map(b => `<li>${highlightMetrics(escapeHtml(b))}</li>`).join("")}
      </ul>
    `;
    expContainer.appendChild(item);
  });

  // Projects
  const projContainer = document.getElementById("view-projects-container");
  projContainer.innerHTML = "";
  p.projects.forEach(proj => {
    const item = document.createElement("div");
    item.className = "r-item";
    item.innerHTML = `
      <div class="r-project-head">
        <div>
          <span>${escapeHtml(proj.title)}</span>
          ${proj.tech ? `<span style="font-weight: normal; font-size: 8.5pt; color: #64748b;"> [${escapeHtml(proj.tech)}]</span>` : ""}
        </div>
        ${proj.link ? `<span class="r-project-link">${escapeHtml(proj.link)}</span>` : ""}
      </div>
      <ul class="r-bullets">
        ${proj.bullets.map(b => `<li>${highlightMetrics(escapeHtml(b))}</li>`).join("")}
      </ul>
    `;
    projContainer.appendChild(item);
  });

  // Education
  const eduContainer = document.getElementById("view-education-container");
  eduContainer.innerHTML = "";
  p.education.forEach(edu => {
    const item = document.createElement("div");
    item.className = "r-item";
    item.innerHTML = `
      <div class="r-item-head">
        <div>
          <span style="font-weight: 700;">${escapeHtml(edu.degree)}</span>
          <span style="font-weight: normal; color: #64748b;"> — </span>
          <span class="r-item-company">${escapeHtml(edu.school)}</span>
        </div>
        <div class="r-item-dates">${escapeHtml(edu.dates)}</div>
      </div>
      ${edu.honors ? `<div style="font-size: 8.5pt; color: #475569; margin-top: 2px;">${escapeHtml(edu.honors)}</div>` : ""}
    `;
    eduContainer.appendChild(item);
  });

  // Leadership & Extracurricular Activities
  const actContainer = document.getElementById("view-activities-container");
  const actSection = document.getElementById("view-activities-section");
  if (actContainer && actSection) {
    if (p.activities && p.activities.length > 0) {
      actSection.style.display = "block";
      actContainer.innerHTML = "";
      p.activities.forEach(act => {
        const item = document.createElement("div");
        item.className = "r-item";
        item.innerHTML = `
          <div class="r-item-head">
            <div>
              <span style="font-weight: 700;">${escapeHtml(act.role)}</span>
              <span style="font-weight: normal; color: #64748b;"> — </span>
              <span class="r-item-company">${escapeHtml(act.organization)}</span>
            </div>
            <div class="r-item-dates">${escapeHtml(act.dates)} ${act.location ? `| ${escapeHtml(act.location)}` : ""}</div>
          </div>
          ${act.bullets && act.bullets.length > 0 ? `
            <ul class="r-bullets">
              ${act.bullets.map(b => `<li>${highlightMetrics(escapeHtml(b))}</li>`).join("")}
            </ul>
          ` : ""}
        `;
        actContainer.appendChild(item);
      });
    } else {
      actSection.style.display = "none";
    }
  }

  // Certifications
  const certContainer = document.getElementById("view-certifications-container");
  const certSection = document.getElementById("view-certifications-section");
  if (p.certifications && p.certifications.length > 0) {
    certSection.style.display = "block";
    certContainer.innerHTML = p.certifications.map(c => `<li>${escapeHtml(c)}</li>`).join("");
  } else {
    certSection.style.display = "none";
  }
}

// Visual highlight of metrics inside bullet points (%, $, numbers)
function highlightMetrics(text) {
  return text.replace(/(\b\d+(\.\d+)?%|\$\d+([,\.]\d+)?([KkMmBb])?|\b\d+(\.\d+)?x\b|\b\d+([,\.]\d+)?\s*(ms|s|K|M|B|users|tokens|FPS)\b)/gi, 
    '<strong class="r-metric-highlight">$1</strong>');
}

/* ==========================================================================
   AI ATS SCORING & AUDIT ENGINE
   ========================================================================== */
function runAtsAudit() {
  const p = state.profile;
  let totalScore = 0;
  const insights = [];
  const foundPowerVerbs = new Set();
  const foundWeakVerbs = new Set();

  // 1. Contact & Header Completeness (Max 15 pts)
  let contactScore = 0;
  if (p.fullname && p.fullname.length > 2) contactScore += 3;
  if (p.email && p.email.includes("@")) contactScore += 3;
  if (p.phone && p.phone.length > 6) contactScore += 3;
  if (p.location && p.location.length > 3) contactScore += 3;
  if (p.linkedin || p.github) contactScore += 3;
  totalScore += contactScore;

  if (contactScore === 15) {
    insights.push({ type: "success", text: "<strong>Contact Header:</strong> 100% complete with professional email, location, phone, and technical profiles." });
  } else {
    insights.push({ type: "warning", text: "<strong>Contact Info:</strong> Missing LinkedIn, GitHub, or location. ATS bots require complete header fields." });
  }

  // 2. Executive Summary Audit (Max 15 pts)
  const summaryWords = p.summary ? p.summary.trim().split(/\s+/).length : 0;
  let summaryScore = 0;
  if (summaryWords >= 30 && summaryWords <= 75) {
    summaryScore += 10;
    insights.push({ type: "success", text: `<strong>Executive Summary:</strong> Excellent length (${summaryWords} words). Fits standard 3-4 sentence elevator pitch.` });
  } else if (summaryWords > 0) {
    summaryScore += 6;
    insights.push({ type: "warning", text: `<strong>Summary Word Count:</strong> Current ${summaryWords} words. Optimal range is 35-70 words to prevent cognitive overload.` });
  } else {
    insights.push({ type: "danger", text: "<strong>Missing Summary:</strong> Professional summary is empty. Add a concise summary highlighting your years of experience & key metrics." });
  }

  // Check for numbers in summary
  if (/\d+/.test(p.summary)) {
    summaryScore += 5;
  }
  totalScore += summaryScore;

  // 3. Google X-Y-Z Formula Metric Density (Max 30 pts)
  let allBullets = [];
  p.experience.forEach(e => allBullets.push(...e.bullets));
  p.projects.forEach(pj => allBullets.push(...pj.bullets));
  if (p.activities) {
    p.activities.forEach(act => {
      if (act.bullets) allBullets.push(...act.bullets);
    });
  }

  let bulletsWithMetrics = 0;
  allBullets.forEach(b => {
    if (/(\d+%|\$\d+|\b\d+(\.\d+)?x\b|\b\d+[KkMmBb]\b|\b\d+ (users|requests|latency|hours|ms|s)\b)/i.test(b)) {
      bulletsWithMetrics++;
    }

    // Inspect verbs
    const lower = b.toLowerCase();
    POWER_VERBS.forEach(v => {
      if (lower.includes(v)) foundPowerVerbs.add(v);
    });
    WEAK_VERBS.forEach(wv => {
      if (lower.includes(wv)) foundWeakVerbs.add(wv);
    });
  });

  const metricPct = allBullets.length > 0 ? Math.round((bulletsWithMetrics / allBullets.length) * 100) : 0;
  const xyzScore = Math.min(30, Math.round((metricPct / 100) * 30));
  totalScore += xyzScore;

  document.getElementById("metric-xyz-val").innerText = `${metricPct}%`;
  document.getElementById("metric-xyz-bar").style.width = `${metricPct}%`;

  if (metricPct >= 75) {
    insights.push({ type: "success", text: `<strong>Google X-Y-Z Compliance:</strong> Outstanding! ${metricPct}% of your bullet points contain verifiable quantifiable metrics (%, $, x, time savings).` });
  } else {
    insights.push({ type: "warning", text: `<strong>Metrics Gap:</strong> Only ${metricPct}% of bullets have hard numbers. Elevate weak bullets by adding percentage lifts or scale metrics.` });
  }

  // 4. Action Verbs Ratio (Max 20 pts)
  const powerVerbCount = foundPowerVerbs.size;
  const weakVerbCount = foundWeakVerbs.size;
  let verbScore = Math.min(20, powerVerbCount * 3 - weakVerbCount * 4);
  verbScore = Math.max(5, verbScore);
  totalScore += verbScore;

  const verbPct = Math.min(100, Math.round((powerVerbCount / Math.max(1, powerVerbCount + weakVerbCount)) * 100));
  document.getElementById("metric-verbs-val").innerText = `${verbPct}%`;
  document.getElementById("metric-verbs-bar").style.width = `${verbPct}%`;

  if (weakVerbCount > 0) {
    insights.push({ type: "danger", text: `<strong>Weak Action Verbs Detected:</strong> Found ${weakVerbCount} passive phrases ("worked on", "helped", "responsible for"). Replace them with decisive impact verbs like "Architected" or "Spearheaded".` });
  } else {
    insights.push({ type: "success", text: `<strong>Strong Action Verbs:</strong> Detected ${powerVerbCount} diverse leadership verbs. Zero passive filler phrases found.` });
  }

  // 5. Technical Skills Matrix & Categorization (Max 20 pts)
  let skillsScore = 0;
  if (p.skills.lang && p.skills.lang.length > 5) skillsScore += 5;
  if (p.skills.frameworks && p.skills.frameworks.length > 5) skillsScore += 5;
  if (p.skills.cloud && p.skills.cloud.length > 5) skillsScore += 5;
  if (p.skills.data && p.skills.data.length > 5) skillsScore += 5;
  totalScore += skillsScore;

  if (skillsScore === 20) {
    insights.push({ type: "success", text: "<strong>Categorized Skills:</strong> Well-structured technical grid allows ATS scanners to index Languages, Frameworks, Cloud, and Databases instantaneously." });
  } else {
    insights.push({ type: "warning", text: "<strong>Skills Structure:</strong> Some skill categories are empty. Fill out all rows to maximize keyword match score." });
  }

  // 6. Leadership & Extracurricular Activities Evaluation
  if (p.activities && p.activities.length > 0) {
    insights.push({ type: "tip", text: `<strong>Extracurricular Leadership:</strong> Identified ${p.activities.length} extracurricular / community contributions. Great demonstration of mentorship, technical initiative, and cultural leadership.` });
  }

  // Calculate Overall Word Count
  const fullText = JSON.stringify(p);
  const totalWordCount = fullText.split(/\s+/).length;
  document.getElementById("metric-words-val").innerText = `${totalWordCount} w`;
  document.getElementById("metric-words-bar").style.width = `${Math.min(100, Math.round((totalWordCount / 600) * 100))}%`;

  // Final Score Cap
  totalScore = Math.min(100, Math.max(10, totalScore));

  // Determine Grade
  let gradeText = "ELITE / A+";
  let gradeDesc = "Your resume is ranked in the top 2% of candidate profiles. Flawless ATS parsing, intense quantifiable impact, and pristine technical taxonomy.";
  if (totalScore < 70) {
    gradeText = "NEEDS WORK";
    gradeDesc = "Several ATS red flags detected. Add missing contact links, quantify bullets with hard numbers, and replace passive verbs.";
  } else if (totalScore < 85) {
    gradeText = "COMPETITIVE / B+";
    gradeDesc = "Solid foundation. Increase the density of Google X-Y-Z metrics and ensure exact keyword alignment with target job descriptions.";
  } else if (totalScore < 93) {
    gradeText = "STRONG / A";
    gradeDesc = "High probability of passing ATS auto-screeners. Ready to tailor to specific job listings.";
  }

  // Update Score Elements in UI
  document.getElementById("header-score-num").innerText = `${totalScore}/100`;
  document.getElementById("tab-score-badge").innerText = totalScore;
  document.getElementById("ats-hero-score").innerText = totalScore;
  document.getElementById("ats-hero-grade").innerText = gradeText;
  document.getElementById("ats-hero-title").innerText = `ATS Score: ${totalScore}/100 (${gradeText})`;
  document.getElementById("ats-hero-desc").innerText = gradeDesc;

  // Set CSS conic-gradient property
  document.getElementById("header-score-circle").style.setProperty("--score-pct", totalScore);
  document.getElementById("ats-hero-circle").style.setProperty("--score-pct", totalScore);

  // Render Insights List
  const insightsContainer = document.getElementById("ai-insights-container");
  insightsContainer.innerHTML = insights.map(i => `
    <div class="insight-card ${i.type}">
      <div>${i.text}</div>
    </div>
  `).join("");

  // Render Power & Weak Verb Badges
  const powerEl = document.getElementById("detected-power-verbs");
  powerEl.innerHTML = Array.from(foundPowerVerbs).map(v => `<span class="verb-chip" style="background: rgba(16, 185, 129, 0.2); border-color: #34d399; color: #a7f3d0;">✓ ${v}</span>`).join("") || '<span style="color: var(--text-dim); font-size: 0.75rem;">None detected yet</span>';

  const weakEl = document.getElementById("detected-weak-verbs");
  weakEl.innerHTML = Array.from(foundWeakVerbs).map(v => `<span class="verb-chip" style="background: rgba(244, 63, 94, 0.2); border-color: #fb7185; color: #fecdd3;">⚠ ${v}</span>`).join("") || '<span style="color: #34d399; font-size: 0.75rem;">None! Excellent job.</span>';

  // 7. Corporate Clichés and Empty Buzzwords Scanner
  const resumeFullLower = JSON.stringify(p).toLowerCase();
  const foundCliches = [];
  RESUME_CLICHES.forEach(c => {
    if (resumeFullLower.includes(c.phrase.toLowerCase())) {
      foundCliches.push(c);
    }
  });

  const clicheCountBadge = document.getElementById("cliche-count-badge");
  const clicheContainer = document.getElementById("detected-cliches-container");
  if (clicheCountBadge) {
    clicheCountBadge.innerText = foundCliches.length === 0 ? "0 Clichés (Clean)" : `${foundCliches.length} Found`;
    clicheCountBadge.style.color = foundCliches.length === 0 ? "#34d399" : "#fb7185";
  }
  if (clicheContainer) {
    if (foundCliches.length === 0) {
      clicheContainer.innerHTML = '<span style="color: #34d399; font-size: 0.75rem;">🎉 Zero fluff! Your resume is clean, concise, and metric-focused.</span>';
    } else {
      clicheContainer.innerHTML = foundCliches.map(c => `
        <span class="cliche-tag" title="${escapeHtml(c.tip)}">
          ⚠ "${escapeHtml(c.phrase)}" <small style="color: #cbd5e1; font-weight: normal;">— ${escapeHtml(c.tip)}</small>
        </span>
      `).join("");
    }
  }
}

/* ==========================================================================
   JOB DESCRIPTION SCANNER & KEYWORD MATCHER
   ========================================================================== */
function scanJobDescription() {
  const jdText = document.getElementById("input-jd-text").value.trim();
  if (!jdText) {
    alert("Please paste a Job Description first!");
    return;
  }

  // Extract key technical buzzwords from JD
  const COMMON_TECH_TERMS = [
    "python", "pytorch", "tensorflow", "hugging face", "langchain", "llamaindex",
    "rag", "llm", "large language model", "vllm", "tensorrt", "triton",
    "docker", "kubernetes", "aws", "gcp", "azure", "vertex ai", "sagemaker",
    "mlflow", "airflow", "sql", "postgresql", "redis", "kafka", "pinecone",
    "qdrant", "milvus", "weaviate", "c++", "go", "typescript", "react", "next.js",
    "ci/cd", "microservices", "lora", "fine-tuning", "quantization", "onnx",
    "distributed systems", "scikit-learn", "xgboost", "spark", "bigquery"
  ];

  const jdLower = jdText.toLowerCase();
  const resumeLower = JSON.stringify(state.profile).toLowerCase();

  const jdTermsFound = COMMON_TECH_TERMS.filter(term => jdLower.includes(term));
  
  if (jdTermsFound.length === 0) {
    alert("Could not identify specific tech keywords in this text. Try pasting a full engineering job description.");
    return;
  }

  const matched = [];
  const missing = [];

  jdTermsFound.forEach(term => {
    if (resumeLower.includes(term)) {
      matched.push(term);
    } else {
      missing.push(term);
    }
  });

  const matchPct = Math.round((matched.length / jdTermsFound.length) * 100);

  // Update UI Results
  document.getElementById("jd-match-results").style.display = "flex";
  document.getElementById("matched-keywords-wrapper").style.display = "block";
  document.getElementById("missing-keywords-wrapper").style.display = "block";

  document.getElementById("jd-match-pct").innerText = `${matchPct}%`;
  document.getElementById("jd-match-count").innerText = `${matched.length} / ${jdTermsFound.length}`;

  const matchedListEl = document.getElementById("matched-keywords-list");
  matchedListEl.innerHTML = matched.map(m => `<span class="kw-badge matched">✓ ${m}</span>`).join("");

  const missingListEl = document.getElementById("missing-keywords-list");
  if (missing.length === 0) {
    missingListEl.innerHTML = '<span style="color: #34d399; font-size: 0.8rem;">🎉 100% Keyword match! No critical technical gaps.</span>';
  } else {
    missingListEl.innerHTML = missing.map(m => `
      <span class="kw-badge missing" onclick="addKeywordToSkills('${m}')" title="Click to add to skills">+ ${m}</span>
    `).join("");
  }

  // Update AI Prompts with this JD
  state.targetJD = jdText;
  generateAiPrompts();
}

// 1-Click add missing keyword to skills
function addKeywordToSkills(keyword) {
  state.profile.skills.frameworks += `, ${keyword}`;
  document.getElementById("input-skills-frameworks").value = state.profile.skills.frameworks;
  renderLiveResumePreview();
  runAtsAudit();
  scanJobDescription(); // re-scan
}

/* ==========================================================================
   AI PROMPT STUDIO
   ========================================================================== */
function generateAiPrompts() {
  const p = state.profile;
  const jd = state.targetJD || "[PASTE TARGET JOB DESCRIPTION HERE]";

  // Prompt 1: Tailor Bullet Points
  const p1 = `You are a world-class Executive Resume Architect specializing in AI and High-Tech Engineering roles.

Review my current resume details:
Name: ${p.fullname}
Title: ${p.jobtitle}
Summary: ${p.summary}
Skills: ${p.skills.lang}, ${p.skills.frameworks}, ${p.skills.cloud}, ${p.skills.data}

Target Job Description:
${jd}

TASK:
1. Identify the top 5 highest-priority requirements from this Job Description.
2. Re-write 3 of my work experience bullet points using the Google X-Y-Z formula ("Accomplished [X], as measured by [Y], by doing [Z]").
3. Inject the exact keywords from the JD without stuffing.
4. Maintain a 100% professional, metrics-driven tone.`;

  document.getElementById("prompt-tailor-box").innerText = p1;

  // Prompt 2: Cover Letter
  const p2 = `Act as an expert career strategist. Write an ultra-compelling 300-word cover letter for the role described below.

Candidate Background:
${p.fullname} (${p.jobtitle})
Key Strengths: ${p.skills.frameworks}, ${p.skills.cloud}
Key Achievement: ${p.experience[0]?.bullets[0] || ""}

Target Role & Company:
${jd}

GUIDELINES:
- No generic clichés ("I am writing to apply...", "I am a hard worker").
- Open with a powerful hook describing a technical challenge the company faces and how my experience solves it.
- Highlight 2 quantifiable results from my background.
- Close with a confident call to action.`;

  document.getElementById("prompt-cover-letter-box").innerText = p2;

  // Prompt 3: Mock Interview Prep
  const p3 = `Act as the VP of Engineering conducting a rigorous technical hiring interview for the following position:

${jd}

My Background:
- Role: ${p.jobtitle}
- Core Stack: ${p.skills.lang}, ${p.skills.frameworks}, ${p.skills.data}
- Notable Project: ${p.projects[0]?.title || ""}

Generate:
1. Three high-signal System Design & Architecture questions specific to this JD.
2. Two deep-dive behavioral questions about handling production outages and performance trade-offs.
3. For each question, outline what a 10/10 answer must cover.`;

  document.getElementById("prompt-interview-box").innerText = p3;
}

function copyPrompt(boxId) {
  const text = document.getElementById(boxId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("✅ AI Prompt copied to clipboard! Paste it into Gemini, Claude, or ChatGPT.");
  });
}

/* ==========================================================================
   EXPORT, PRINT & IMPORT UTILITIES
   ========================================================================== */
function triggerPrint() {
  window.print();
}

function exportResumeJson() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.profile, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `resume-${state.profile.fullname.toLowerCase().replace(/\s+/g, "-")}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importResumeJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      state.profile = parsed;
      initFormValues();
      renderExperienceEditor();
      renderProjectsEditor();
      renderEducationEditor();
      renderActivitiesEditor();
      renderLiveResumePreview();
      runAtsAudit();
      generateAiPrompts();
      alert("✅ Resume imported successfully!");
    } catch (err) {
      alert("❌ Invalid JSON file format.");
    }
  };
  reader.readAsText(file);
}

function generatePlainTextResume() {
  const p = state.profile;
  let txt = "";
  txt += `${p.fullname.toUpperCase()}\n`;
  txt += `${p.jobtitle}\n`;
  txt += `${[p.email, p.phone, p.location, p.linkedin, p.github].filter(Boolean).join(" | ")}\n\n`;

  if (p.summary) {
    txt += `PROFESSIONAL SUMMARY\n--------------------\n${p.summary}\n\n`;
  }

  txt += `TECHNICAL SKILLS\n----------------\n`;
  if (p.skills.lang) txt += `* Languages: ${p.skills.lang}\n`;
  if (p.skills.frameworks) txt += `* Frameworks & AI: ${p.skills.frameworks}\n`;
  if (p.skills.cloud) txt += `* Cloud & Infrastructure: ${p.skills.cloud}\n`;
  if (p.skills.data) txt += `* Databases & Systems: ${p.skills.data}\n\n`;

  txt += `WORK EXPERIENCE\n---------------\n`;
  p.experience.forEach(exp => {
    txt += `${exp.role} - ${exp.company} (${exp.dates})\n`;
    exp.bullets.forEach(b => {
      txt += `  * ${b}\n`;
    });
    txt += `\n`;
  });

  if (p.projects && p.projects.length > 0) {
    txt += `FEATURED PROJECTS\n-----------------\n`;
    p.projects.forEach(proj => {
      txt += `${proj.title} [${proj.tech}]\n`;
      proj.bullets.forEach(b => {
        txt += `  * ${b}\n`;
      });
      txt += `\n`;
    });
  }

  if (p.education && p.education.length > 0) {
    txt += `EDUCATION\n---------\n`;
    p.education.forEach(edu => {
      txt += `${edu.degree} - ${edu.school} (${edu.dates})\n`;
      if (edu.honors) txt += `  ${edu.honors}\n`;
      txt += `\n`;
    });
  }

  if (p.activities && p.activities.length > 0) {
    txt += `LEADERSHIP & EXTRACURRICULAR ACTIVITIES\n---------------------------------------\n`;
    p.activities.forEach(act => {
      txt += `${act.role} - ${act.organization} (${act.dates})\n`;
      if (act.bullets && act.bullets.length > 0) {
        act.bullets.forEach(b => {
          txt += `  * ${b}\n`;
        });
      }
      txt += `\n`;
    });
  }

  if (p.certifications && p.certifications.length > 0) {
    txt += `CERTIFICATIONS & AWARDS\n-----------------------\n`;
    p.certifications.forEach(c => {
      txt += `* ${c}\n`;
    });
  }

  return txt;
}

function loadDemoProfile(key) {
  if (key === "ai") {
    // Reset to base Alex Rivera
    location.reload();
    return;
  }
  const demo = DEMO_PROFILES[key];
  if (demo) {
    state.profile = JSON.parse(JSON.stringify(demo));
    initFormValues();
    renderExperienceEditor();
    renderProjectsEditor();
    renderEducationEditor();
    renderActivitiesEditor();
    renderLiveResumePreview();
    runAtsAudit();
    generateAiPrompts();
  }
}

// Utility Helpers
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function toggleDisplay(id, hasContent) {
  const el = document.getElementById(id);
  if (el) el.style.display = hasContent ? "flex" : "none";
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   BACKEND & SQLITE MULTI-RESUME VERSION CONTROL
   ========================================================================== */
async function checkBackendHealth() {
  const badgeDot = document.getElementById("backend-status-dot");
  const badgeText = document.getElementById("backend-status-text");
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      state.isBackendOnline = true;
      if (badgeDot && badgeText) {
        badgeDot.style.background = "#10b981";
        badgeText.style.color = "#10b981";
        badgeText.innerText = "DB: Online (SQLite)";
      }
      updateSavedResumesCountBadge();
      return;
    }
  } catch (err) {
    // Backend offline / not reachable
  }

  state.isBackendOnline = false;
  if (badgeDot && badgeText) {
    badgeDot.style.background = "#64748b";
    badgeText.style.color = "#94a3b8";
    badgeText.innerText = "DB: Offline (Local Mode)";
  }
}

async function updateSavedResumesCountBadge() {
  if (!state.isBackendOnline) return;
  try {
    const res = await fetch(`${API_BASE}/resumes`);
    const data = await res.json();
    if (data.success) {
      const countEl = document.getElementById("saved-resumes-count");
      if (countEl) countEl.innerText = data.count || "0";
    }
  } catch (e) {}
}

function openSaveDbModal() {
  const modal = document.getElementById("save-db-modal");
  const titleInput = document.getElementById("input-save-title");
  const roleInput = document.getElementById("input-save-role");
  const changelogInput = document.getElementById("input-save-changelog");

  if (titleInput) {
    titleInput.value = state.currentDbResumeTitle || (state.profile.jobtitle ? `${state.profile.jobtitle} Profile` : "My Resume");
  }
  if (roleInput) roleInput.value = "";
  if (changelogInput) changelogInput.value = state.currentDbResumeId ? "Updated experience metrics and skills" : "Initial version";
  
  modal.classList.add("active");
}

async function saveResumeToBackend() {
  const title = document.getElementById("input-save-title").value.trim() || "Untitled Resume";
  const targetRole = document.getElementById("input-save-role").value.trim();
  const changelog = document.getElementById("input-save-changelog").value.trim() || "Version update";
  const atsScore = parseInt(document.getElementById("tab-score-badge").innerText) || 85;

  const payload = {
    title: title,
    target_role: targetRole,
    profile: state.profile,
    ats_score: atsScore,
    changelog: changelog
  };

  try {
    let url = `${API_BASE}/resumes`;
    let method = "POST";

    if (state.currentDbResumeId) {
      url = `${API_BASE}/resumes/${state.currentDbResumeId}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      state.currentDbResumeId = data.id;
      state.currentDbResumeTitle = title;
      alert(`✅ Success: ${data.message}`);
      document.getElementById("save-db-modal").classList.remove("active");
      updateSavedResumesCountBadge();
    } else {
      alert(`❌ Error saving: ${data.error || "Unknown server error"}`);
    }
  } catch (err) {
    alert(`❌ Could not connect to backend server at ${API_BASE}. Make sure 'run_backend.bat' is running!`);
  }
}

function openDatabaseModal() {
  const modal = document.getElementById("database-resumes-modal");
  document.getElementById("db-resumes-list-view").style.display = "block";
  document.getElementById("db-versions-view").style.display = "none";
  modal.classList.add("active");
  fetchSavedResumes();
}

async function fetchSavedResumes() {
  const container = document.getElementById("db-resumes-container");
  container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">Loading from SQLite database...</div>';

  try {
    const res = await fetch(`${API_BASE}/resumes`);
    const data = await res.json();

    if (!data.success || !data.resumes || data.resumes.length === 0) {
      container.innerHTML = `
        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: var(--radius-md);">
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">📁 No saved resumes in database yet</div>
          <p style="font-size: 0.8rem; margin-bottom: 0.75rem;">Click "Save Version" in the top bar to save your current resume to the SQLite database.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.resumes.map(r => `
      <div class="item-card" style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: #ffffff; font-size: 0.95rem; display: flex; align-items: center; gap: 0.5rem;">
            ${escapeHtml(r.title)}
            <span class="brand-pill" style="font-size: 0.65rem;">v${r.current_version}</span>
            <span style="font-size: 0.75rem; font-weight: 700; color: #34d399;">ATS ${r.ats_score}/100</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 3px;">
            Candidate: <strong>${escapeHtml(r.fullname)}</strong> ${r.target_role ? `• Target: ${escapeHtml(r.target_role)}` : ""}
          </div>
          <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 2px;">
            Last updated: ${escapeHtml(r.updated_at)}
          </div>
        </div>
        <div style="display: flex; gap: 0.4rem; align-items: center;">
          <button class="btn btn-primary btn-sm" onclick="loadResumeFromDb(${r.id})">Load</button>
          <button class="btn btn-secondary btn-sm" onclick="viewResumeVersions(${r.id}, '${escapeHtml(r.title)}')">Versions</button>
          <button class="btn btn-danger-outline btn-sm" onclick="deleteResumeFromDb(${r.id})">🗑️</button>
        </div>
      </div>
    `).join("");

    updateSavedResumesCountBadge();
  } catch (err) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: #fb7185; background: rgba(244,63,94,0.1); border-radius: var(--radius-md);">
        ⚠️ Unable to connect to backend server. Run 'run_backend.bat' in the project directory to launch the server!
      </div>
    `;
  }
}

async function loadResumeFromDb(id) {
  try {
    const res = await fetch(`${API_BASE}/resumes/${id}`);
    const data = await res.json();
    if (data.success && data.resume) {
      state.profile = data.resume.profile;
      state.currentDbResumeId = data.resume.id;
      state.currentDbResumeTitle = data.resume.title;

      initFormValues();
      renderExperienceEditor();
      renderProjectsEditor();
      renderEducationEditor();
      renderActivitiesEditor();
      renderLiveResumePreview();
      runAtsAudit();
      generateAiPrompts();

      document.getElementById("database-resumes-modal").classList.remove("active");
      alert(`✅ Loaded '${data.resume.title}' (Version ${data.resume.current_version}) from database!`);
    }
  } catch (e) {
    alert("❌ Error loading resume from database.");
  }
}

async function viewResumeVersions(id, title) {
  document.getElementById("db-resumes-list-view").style.display = "none";
  document.getElementById("db-versions-view").style.display = "block";
  document.getElementById("versions-resume-title").innerText = `Version History: ${title}`;

  const container = document.getElementById("db-versions-container");
  container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">Loading version timeline...</div>';

  try {
    const res = await fetch(`${API_BASE}/resumes/${id}/versions`);
    const data = await res.json();

    if (!data.success || !data.versions || data.versions.length === 0) {
      container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 1rem; text-align: center;">No version snapshots found.</div>';
      return;
    }

    container.innerHTML = data.versions.map(v => `
      <div class="item-card" style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; background: rgba(14,20,33,0.85);">
        <div>
          <div style="font-weight: 700; color: #ffffff; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;">
            <span class="brand-pill">Snapshot Version ${v.version_number}</span>
            <span style="font-size: 0.75rem; color: #34d399; font-weight: 700;">ATS: ${v.ats_score}/100</span>
          </div>
          <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 4px;">
            📝 Changelog: <em>"${escapeHtml(v.changelog || 'No notes')}"</em>
          </div>
          <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 2px;">
            Saved at: ${escapeHtml(v.created_at)}
          </div>
        </div>
        <div>
          <button class="btn btn-secondary btn-sm" onclick="rollbackResumeVersion(${id}, ${v.version_number})">
            ⏪ Restore v${v.version_number}
          </button>
        </div>
      </div>
    `).join("");
  } catch (e) {
    container.innerHTML = '<div style="color: #fb7185; padding: 1rem; text-align: center;">Error loading versions.</div>';
  }
}

async function rollbackResumeVersion(resumeId, versionNum) {
  if (!confirm(`Are you sure you want to rollback to Version ${versionNum}? A new snapshot version will be created.`)) return;

  try {
    const res = await fetch(`${API_BASE}/resumes/${resumeId}/rollback/${versionNum}`, {
      method: "POST"
    });
    const data = await res.json();
    if (data.success && data.profile) {
      state.profile = data.profile;
      state.currentDbResumeId = resumeId;

      initFormValues();
      renderExperienceEditor();
      renderProjectsEditor();
      renderEducationEditor();
      renderActivitiesEditor();
      renderLiveResumePreview();
      runAtsAudit();
      generateAiPrompts();

      alert(`✅ ${data.message}`);
      document.getElementById("database-resumes-modal").classList.remove("active");
    }
  } catch (e) {
    alert("❌ Error rolling back version.");
  }
}

async function deleteResumeFromDb(id) {
  if (!confirm("Are you sure you want to delete this resume and its entire version history?")) return;
  try {
    const res = await fetch(`${API_BASE}/resumes/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      if (state.currentDbResumeId === id) {
        state.currentDbResumeId = null;
      }
      fetchSavedResumes();
    }
  } catch (e) {
    alert("❌ Error deleting resume.");
  }
}
