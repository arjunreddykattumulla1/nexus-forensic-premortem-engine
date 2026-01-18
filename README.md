
# Nexus Forensic Pre-Mortem Engine 🛡️🔬

An enterprise-grade intelligence platform that predicts how and why complex systems will fail before they are deployed. Using **Gemini 2.5/3 Pro**, Nexus simulates architecture cascades, scores probabilistic risk (Bayesian P95), and generates forensic prevention roadmaps.

## 🚀 Key Features

- **Adversarial Simulation**: Triggers deep-dives into systemic vulnerabilities, infrastructure gridlock, and logic collapses.
- **Forensic Dashboard**: Real-time Risk Heatmaps, Hardening ROI Analysis, and Bayesian Risk Trending.
- **Deep Failure Briefings**: AI-driven "Explain Error" button for technical anatomy and trigger vectors.
- **Enterprise Reporting**:
  - **Visual Reports**: ASCII-structured dashboards optimized for Slack/Email stakeholders.
  - **Forensic Dossiers**: High-fidelity PDF exports for executive review.
- **Identity Vault**: Multi-provider secure authentication with simulated Cryptographic OTP verification.

## 🛠️ Tech Stack

- **Framework**: React 19 (ES6 Modules)
- **Intelligence**: Google Gemini API (`@google/genai`)
- **UI/UX**: Tailwind CSS, Lucide Icons, Recharts
- **Export**: jsPDF, html2canvas

## 🔑 Setup

1. **API Key**: This application requires a Google Gemini API Key.
2. **Environment**: Ensure `process.env.API_KEY` is configured in your deployment environment (e.g., Vercel, Netlify, or local `.env`).

## 🛡️ Security Protocol

The app includes a mock authentication layer (Nexus Identity Vault) to demonstrate enterprise access patterns, including:
- Social Login (Google, Microsoft, Yahoo)
- Email/Password + OTP Verification
- Session persistence via LocalStorage

---
*Developed as a high-fidelity demonstration of AI-driven SRE and Risk Management.*
