import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/login", "/register"],
        disallow: ["/dashboard", "/analytics", "/modules", "/quizzes", "/settings", "/api/"],
      },
    ],
    sitemap: "https://syntra.vercel.app/sitemap.xml",
  }
}
