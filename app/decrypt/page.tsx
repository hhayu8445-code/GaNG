"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { Lock, Unlock, Upload, Download, Shield, AlertTriangle } from "lucide-react"

export default function DecryptPage() {
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [decrypting, setDecrypting] = useState(false)
  const [result, setResult] = useState("")

  const handleDecrypt = async () => {
    if (!file) return
    setDecrypting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      
      const res = await fetch("/api/decrypt", {
        method: "POST",
        body: formData
      })
      
      const data = await res.json()
      
      if (data.success) {
        setResult(data.decrypted)
      } else {
        setResult(`// Error: ${data.error}`)
      }
    } catch (error) {
      setResult("// Error: Failed to decrypt file")
    } finally {
      setDecrypting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-72">
        <Header />
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-destructive to-chart-5 flex items-center justify-center glow-sm">
                <Lock className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Script Decryptor</h1>
                <p className="text-sm md:text-base text-muted-foreground">Decrypt FiveM encrypted scripts safely</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
            <div className="glass rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload Encrypted File
              </h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                    accept=".lua,.luac"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm md:text-base font-medium text-foreground mb-1">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">LUA or LUAC files only</p>
                  </label>
                </div>

                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 md:p-4">
                  <div className="flex gap-2 md:gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning mb-1">Important Notice</p>
                      <p className="text-xs text-muted-foreground">
                        Only decrypt scripts you own or have permission to decrypt. Respect intellectual property rights.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleDecrypt}
                  disabled={!file || decrypting}
                  className="w-full bg-primary hover:bg-primary/90 gap-2 h-11 md:h-12 text-sm md:text-base"
                >
                  {decrypting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" />
                      Decrypt File
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-success" />
                Decrypted Output
              </h2>
              <Textarea
                value={result}
                readOnly
                placeholder="Decrypted code will appear here..."
                className="min-h-[300px] md:min-h-[400px] font-mono text-xs md:text-sm bg-secondary/30 resize-none"
              />
              {result && (
                <Button className="w-full mt-4 bg-success hover:bg-success/90 gap-2 h-10 md:h-11 text-sm md:text-base">
                  <Download className="h-4 w-4" />
                  Download Decrypted File
                </Button>
              )}
            </div>
          </div>

          {user?.isAdmin && (
            <div className="glass rounded-2xl p-4 md:p-6 mt-4 md:mt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Admin Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                  { label: "Total Decrypts", value: "1,234" },
                  { label: "Success Rate", value: "98.5%" },
                  { label: "Active Users", value: "456" },
                  { label: "Today", value: "89" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-secondary/30 rounded-xl p-3 md:p-4">
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
