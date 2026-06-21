"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfViewerProps {
  dataUrl: string
  title?: string
}

export function PdfViewer({ dataUrl, title }: PdfViewerProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-sm font-medium">{title ?? "PDF Preview"}</span>
        <a href={dataUrl} download={title ?? "document.pdf"}>
          <Button variant="ghost" size="sm">
            <Download size={16} />
          </Button>
        </a>
      </div>
      <iframe
        src={dataUrl}
        className="w-full h-[80vh]"
        title={title ?? "PDF Viewer"}
      />
    </div>
  )
}
