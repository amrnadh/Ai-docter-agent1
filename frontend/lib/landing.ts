// Landing page content. Every claim here is backed by code in this repo —
// keep it that way when editing (recruiters do click through).

import {
  Brain, ScanLine, FileText, MessageSquareText, Mic, Stethoscope, Pill, CalendarClock,
  type LucideIcon,
} from "lucide-react";

export const author = {
  name: "Amarnadh",
  // Fill these in; empty links are hidden.
  github: "",
  linkedin: "",
  portfolio: "",
  source: "https://gitlab.com/medsage/MedSage",
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
  detail: string;
  href: string;
};

export const features: Feature[] = [
  {
    icon: MessageSquareText,
    title: "Multi-agent assistant",
    body: "Ask anything medical. A LangGraph router picks the right specialist agent and grounds the answer in clinical literature.",
    detail: "Groq Llama 3.3 · Gemini · Qdrant RAG",
    href: "/dashboard/assistant",
  },
  {
    icon: Brain,
    title: "Brain MRI analysis",
    body: "Four-class tumor classification from an ensemble of two CNNs, with Grad-CAM heatmaps and uncertainty estimates.",
    detail: "DenseNet-169 + EfficientNet-B3",
    href: "/dashboard/brain-tumor-analysis",
  },
  {
    icon: ScanLine,
    title: "Chest X-ray screening",
    body: "Pneumonia screening from a chest radiograph, with a heatmap of the regions behind the prediction and a PDF report.",
    detail: "MobileNetV2 · TensorFlow",
    href: "/dashboard/xray_analysis",
  },
  {
    icon: FileText,
    title: "Lab report analysis",
    body: "Upload a PDF blood report, get a plain-language summary, then ask follow-up questions grounded in that report.",
    detail: "pdfplumber · FAISS · Groq",
    href: "/dashboard/report_analysis",
  },
  {
    icon: Stethoscope,
    title: "Symptom checker",
    body: "Describe symptoms in your own words. Get ranked possible causes, an urgency level and what to do next.",
    detail: "Profile-aware triage",
    href: "/dashboard/symptom-checker",
  },
  {
    icon: Pill,
    title: "Medications & interactions",
    body: "Track prescriptions and check new drugs against everything you already take, with severity grading.",
    detail: "Drug-interaction agent",
    href: "/dashboard/medications",
  },
  {
    icon: Mic,
    title: "Voice consultation",
    body: "Talk to a specialist AI doctor out loud. Turn-taking voice, live transcript, and a summary saved to your history.",
    detail: "Vapi · ElevenLabs",
    href: "/dashboard/consultation",
  },
  {
    icon: CalendarClock,
    title: "Book a real doctor",
    body: "Doctors publish availability, patients book a slot, and the appointment opens a video room in the browser.",
    detail: "Slot engine · Jitsi video",
    href: "/dashboard/consultation_booking",
  },
];

// The LangGraph state machine in backend/app/agents/agent_decision.py
export const pipeline = [
  { step: "Input guardrail", note: "Blocks unsafe or off-topic prompts before any model sees them." },
  { step: "Router", note: "Reads the message, any image and your health profile, then picks one agent." },
  { step: "Specialist agent", note: "Conversation, RAG, web search, imaging, symptom or drug-interaction." },
  { step: "Confidence check", note: "RAG answers scoring below 0.40 are retried with live web + PubMed search." },
  { step: "Human validation", note: "Imaging diagnoses are flagged for review by a clinician." },
  { step: "Output guardrail", note: "Final safety pass before the answer reaches you." },
];

export const agents = [
  "Conversation", "RAG", "Web search", "Brain tumor", "Chest X-ray",
  "Skin lesion", "Symptom checker", "Drug interaction",
];

export type Model = { task: string; arch: string; output: string; runtime: string };

export const models: Model[] = [
  { task: "Brain tumor (MRI)", arch: "DenseNet-169 + EfficientNet-B3 ensemble", output: "Glioma · Meningioma · Pituitary · None, + Grad-CAM, MC-dropout uncertainty", runtime: "PyTorch" },
  { task: "Brain tumor (MRI)", arch: "Vision Transformer", output: "Second-opinion classifier", runtime: "PyTorch" },
  { task: "Pneumonia (X-ray)", arch: "MobileNetV2", output: "Pneumonia vs normal, 96.4% sensitivity on 485 held-out images", runtime: "TensorFlow" },
  { task: "COVID-19 (X-ray)", arch: "DenseNet-121", output: "COVID-19 vs normal", runtime: "PyTorch" },
  { task: "Skin lesion", arch: "U-Net", output: "Lesion segmentation mask", runtime: "PyTorch" },
];

export const stack: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { group: "Backend", items: ["FastAPI", "SQLModel", "Alembic", "PostgreSQL (Supabase)"] },
  { group: "AI", items: ["LangGraph", "LangChain", "Gemini 2.5", "Groq Llama 3.3", "Qdrant", "FAISS", "Tavily"] },
  { group: "ML serving", items: ["PyTorch", "TensorFlow", "Hugging Face Spaces", "Docker"] },
  { group: "Platform", items: ["Clerk auth", "Vapi voice", "Jitsi video", "Vercel"] },
];
