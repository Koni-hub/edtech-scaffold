declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFParseResult {
    text: string
    numpages: number
    numrender: number
    info: Record<string, unknown>
    metadata: Record<string, unknown>
    version: string
  }

  function pdf(dataBuffer: Buffer, options?: { pagerender?: (pageData: Record<string, unknown>) => string }): Promise<PDFParseResult>
  export default pdf
}
