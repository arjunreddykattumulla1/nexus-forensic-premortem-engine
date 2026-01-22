
# Nexus Forensic Pre-Mortem Engine 🛡️🔬

An enterprise-grade adversarial intelligence platform designed to simulate system collapses before they reach production. Nexus utilizes **Gemini 2.5/3 Pro** to map architectural vulnerabilities through Bayesian probabilistic simulation (P95).

![Nexus Banner](https://via.placeholder.com/1200x400/020617/f43f5e?text=NEXUS+FORENSIC+ENGINE+v2.5)

## 📂 Project Structure

```text
nexus-forensic-premortem-engine/
│
├── README.md                # Forensic Documentation
├── LICENSE                  # MIT Open Source
├── package.json             # Build Orchestration
├── vite.config.ts           # Production Pipeline
├── tsconfig.json            # Strict-Type Schema
│
├── frontend/                # Root Source (Move here for production)
│   ├── index.html           # Secure Entry Point
│   └── src/
│       ├── App.tsx          # Nexus Command Center
│       ├── components/      # UI Forensic Modules
│       ├── services/        # Intelligence Layer (Gemini API)
│       └── types.ts         # Actuarial Risk Schema
│
└── docs/                    # Recruiter Artifacts
    ├── screenshots/         # Dashboards & Simulations
    └── dossiers/            # Sample PDF Export
```

## 🚀 Key Engineering Features

- **Adversarial Cascade Simulation**: Uses LLM-driven Directed Acyclic Graphs (DAGs) to predict failure chains.
- **Actuarial Dashboard**: Real-time Heatmaps and Hardening ROI Analysis via Recharts.
- **Dossier Export Engine**: High-fidelity PDF generation of forensic reports using `html2canvas` and `jsPDF`.
- **System Health Manifest**: Live diagnostic stream for internal simulation monitoring.
- **Bayesian Risk Trending**: Historical and projected risk scoring compared against system baselines.

## 🛠️ Tech Stack

- **Core**: React 19 + TypeScript
- **AI**: Google Gemini API (`@google/genai`)
- **Graphics**: Recharts (Actuarial Visualization)
- **Styling**: Tailwind CSS + Framer-inspired animations
- **Exports**: jsPDF & html2canvas

## 🔑 Installation & Access

1. **Obtain API Key**: Requires a Google Gemini API Key from [AI Studio](https://aistudio.google.com/).
2. **Setup**:
   ```bash
   npm install
   npm run dev
   ```
3. **Environment**: Add `API_KEY` to your environment variables.

---
*Developed as a high-fidelity demonstration of SRE logic and Adversarial Risk Management.*
