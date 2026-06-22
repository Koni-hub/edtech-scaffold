declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFParseResult {
    text: string
    numpages: number
    numrender: number
    info: { [key: string]: unknown }
    metadata: { [key: string]: unknown }
    version: string
  }

  function pdf(dataBuffer: Buffer, options?: { pagerender?: (pageData: { [key: string]: unknown }) => string }): Promise<PDFParseResult>
  export default pdf
}
