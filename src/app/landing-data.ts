import { BookOpen, BarChart3, Target, GraduationCap, Layers, Upload, Bot, LineChart } from "lucide-react"
import type { ComponentType } from "react"

interface Feature {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

interface Step {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

interface Stat {
  value: string
  label: string
}

interface Testimonial {
  quote: string
  author: string
  role: string
}

interface ComparisonRow {
  feature: string
  syntra: boolean
  nlm: boolean
  sf: boolean
  qz: boolean
  kt: boolean
}

export const features: Feature[] = [
  {
    icon: Upload, title: "Upload & Process",
    description: "Upload PDFs and documents. AI automatically extracts, structures, and chunks your material into organized learning modules.",
  },
  {
    icon: Bot, title: "AI Quiz Generation",
    description: "Generate intelligent quizzes from your content. Multiple formats, adaptive difficulty, and instant feedback.",
  },
  {
    icon: LineChart, title: "Deep Analytics",
    description: "Track understanding scores, retention rates, and topic mastery with rich visualizations over time.",
  },
  {
    icon: Target, title: "Smart Review",
    description: "Identify weak areas with data-driven insights. Get personalized recommendations for targeted practice.",
  },
  {
    icon: GraduationCap, title: "Flashcard Mode",
    description: "Reinforce knowledge with AI-generated flashcards using spaced repetition for optimal retention.",
  },
  {
    icon: Layers, title: "Multi-Subject",
    description: "Organize modules by subject, switch between topics seamlessly, and manage your entire curriculum.",
  },
]

export const steps: Step[] = [
  { icon: Upload, title: "Upload", description: "Drop your PDFs and study materials into the platform." },
  { icon: Bot, title: "Process", description: "AI analyzes content and builds structured learning modules." },
  { icon: BookOpen, title: "Practice", description: "Take AI-generated quizzes and review with flashcards." },
  { icon: BarChart3, title: "Master", description: "Track progress and solidify understanding over time." },
]

export const stats: Stat[] = [
  { value: "10K+", label: "Quizzes Generated" },
  { value: "5K+", label: "Active Learners" },
  { value: "50+", label: "Subjects" },
  { value: "92%", label: "Satisfaction" },
]

export const testimonials: Testimonial[] = [
  { quote: "Syntra transformed how I study. The AI-generated quizzes are incredibly relevant.", author: "Alex M.", role: "Medical Student" },
  { quote: "The analytics helped me identify exactly which topics I was struggling with.", author: "Sarah K.", role: "Computer Science" },
  { quote: "Uploading lecture notes and getting instant practice questions is a game changer.", author: "James R.", role: "Engineering" },
]

export const comparisonRows: ComparisonRow[] = [
  { feature: "AI quiz from uploads", syntra: true, nlm: false, sf: true, qz: false, kt: true },
  { feature: "Deep learning analytics", syntra: true, nlm: false, sf: true, qz: false, kt: false },
  { feature: "Topic mastery breakdown", syntra: true, nlm: false, sf: false, qz: false, kt: false },
  { feature: "Spaced repetition", syntra: true, nlm: false, sf: true, qz: true, kt: true },
  { feature: "Multiple question formats", syntra: true, nlm: true, sf: true, qz: true, kt: true },
  { feature: "Progress over time", syntra: true, nlm: false, sf: false, qz: true, kt: true },
  { feature: "Upload your own materials", syntra: true, nlm: true, sf: true, qz: false, kt: false },
  { feature: "Free tier available", syntra: true, nlm: true, sf: false, qz: true, kt: true },
  { feature: "Adaptive difficulty", syntra: true, nlm: false, sf: false, qz: false, kt: false },
  { feature: "Flashcard review", syntra: true, nlm: true, sf: true, qz: true, kt: true },
]
