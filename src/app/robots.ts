import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/about", "/privacy", "/terms", "/login", "/register"],
        disallow: ["/dashboard", "/analytics", "/modules", "/quizzes", "/settings", "/api/"],
      },
    ],
    sitemap: "https://syntra-learn.vercel.app/sitemap.xml",
  }
}
