export async function extractPdfText(uint8: Uint8Array): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")

  const worker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs")
  ;(globalThis as any).pdfjsWorker = worker

  const loadingTask = pdfjs.getDocument({ data: uint8 })
  const pdf = await loadingTask.promise
  const pageTexts: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent({ includeMarkedContent: false, disableNormalization: false })
    const texts = content.items.filter((item: any) => "str" in item).map((item: any) => item.str).join(" ")
    pageTexts.push(texts)
    page.cleanup()
  }
  const fullText = pageTexts.join("\n\n")
  await pdf.destroy()
  return fullText
}
