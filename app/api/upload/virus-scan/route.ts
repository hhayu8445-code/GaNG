import { NextResponse } from "next/server"
import crypto from "crypto"

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || ""

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const hash = crypto.createHash("sha256").update(buffer).digest("hex")

    if (!VIRUSTOTAL_API_KEY) {
      return NextResponse.json({ 
        clean: true, 
        message: "VirusTotal API not configured - file accepted",
        hash 
      })
    }

    const checkResponse = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
      headers: { "x-apikey": VIRUSTOTAL_API_KEY }
    })

    if (checkResponse.status === 404) {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      
      const uploadResponse = await fetch("https://www.virustotal.com/api/v3/files", {
        method: "POST",
        headers: { "x-apikey": VIRUSTOTAL_API_KEY },
        body: uploadFormData
      })

      const uploadData = await uploadResponse.json()
      
      return NextResponse.json({
        clean: true,
        scanning: true,
        analysisId: uploadData.data?.id,
        message: "File uploaded for scanning",
        hash
      })
    }

    const data = await checkResponse.json()
    const stats = data.data?.attributes?.last_analysis_stats || {}
    const malicious = stats.malicious || 0
    const suspicious = stats.suspicious || 0

    return NextResponse.json({
      clean: malicious === 0 && suspicious === 0,
      stats,
      hash,
      permalink: data.data?.links?.self
    })
  } catch (error) {
    console.error("Virus scan error:", error)
    return NextResponse.json({ 
      clean: true, 
      message: "Scan failed - file accepted by default" 
    })
  }
}
