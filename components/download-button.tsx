"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"
import { Download, Coins, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"

interface DownloadButtonProps {
  assetId: string
  price: "free" | "premium"
  coinPrice?: number
}

export function DownloadButton({ assetId, price, coinPrice = 0 }: DownloadButtonProps) {
  const { user, refreshSession } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState("")

  const handleDownload = async () => {
    if (!user) {
      setError("Please login to download")
      setShowModal(true)
      return
    }

    if (price === "premium") {
      setShowModal(true)
      return
    }

    await processDownload()
  }

  const processDownload = async () => {
    setIsDownloading(true)
    setError("")

    try {
      const res = await fetch(`/api/download/${assetId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Download failed")
        return
      }

      if (data.coinsDeducted) {
        await refreshSession()
      }

      window.location.href = data.downloadUrl
      setShowModal(false)
    } catch (error) {
      setError("Download failed. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <Button onClick={handleDownload} className="w-full bg-primary hover:bg-primary/90 gap-2 rounded-xl h-12 text-base glow-sm" size="lg">
        <Download className="h-5 w-5" />
        {price === "free" ? "Download Free" : `Download (${coinPrice} Coins)`}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md glass border-2 border-primary/30">
          <div className="p-6 space-y-4">
            {error ? (
              <>
                <div className="text-center">
                  <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
                  <p className="text-muted-foreground">{error}</p>
                </div>
                <Button onClick={() => setShowModal(false)} variant="outline" className="w-full rounded-xl">
                  Close
                </Button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="h-16 w-16 rounded-2xl bg-warning/20 flex items-center justify-center mx-auto mb-4">
                    <img src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif" alt="Coins" className="h-10 w-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Confirm Download</h2>
                  <p className="text-muted-foreground mb-4">This will cost {coinPrice} coins</p>
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Your Balance:</span>
                      <span className="text-lg font-bold text-foreground flex items-center gap-1">
                        <img src="https://i.gifer.com/origin/e0/e02ce86bcfd6d1d6c2f775afb3ec8c01_w200.gif" alt="Coins" className="h-5 w-5" />
                        {user?.coins || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="text-lg font-bold text-destructive">-{coinPrice}</span>
                    </div>
                    <div className="border-t border-border/50 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">After Download:</span>
                        <span className="text-lg font-bold text-success">{(user?.coins || 0) - coinPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => setShowModal(false)} variant="outline" className="flex-1 rounded-xl bg-transparent">
                    Cancel
                  </Button>
                  <Button onClick={processDownload} disabled={isDownloading || (user?.coins || 0) < coinPrice} className="flex-1 bg-primary hover:bg-primary/90 rounded-xl">
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
