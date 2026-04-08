"use client"

import { useState, useCallback } from "react"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download, Copy } from "lucide-react"
import { useData } from "@/lib/data-context"
import type { Freelancer } from "@/lib/types"

const columnMapping: Record<string, keyof Freelancer> = {
  "المستقل": "name",
  "المسمى الوظيفي": "jobTitle",
  "المدير المباشر": "directManager",
  "مركز التكلفة (النسب)": "costCenter",
  "الإدارة": "department",
  "المبلغ المستحق": "amount",
}

// Parse CSV handling multiline quoted fields
function parseCSV(text: string): Freelancer[] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ""
  let inQuotes = false
  
  // Parse character by character to handle multiline quoted fields
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"'
        i++
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim())
      currentField = ""
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      // End of row (only when not in quotes)
      if (char === '\r') i++ // Skip \n after \r
      currentRow.push(currentField.trim())
      if (currentRow.some(field => field !== "")) {
        rows.push(currentRow)
      }
      currentRow = []
      currentField = ""
    } else if (char === '\r' && !inQuotes) {
      // End of row (old Mac format)
      currentRow.push(currentField.trim())
      if (currentRow.some(field => field !== "")) {
        rows.push(currentRow)
      }
      currentRow = []
      currentField = ""
    } else {
      currentField += char
    }
  }
  
  // Don't forget the last field and row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    if (currentRow.some(field => field !== "")) {
      rows.push(currentRow)
    }
  }
  
  if (rows.length < 2) return []
  
  const headers = rows[0]
  const freelancers: Freelancer[] = []
  let totalAmount = 0
  
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i]
    const freelancer: Partial<Freelancer> = { id: String(i) }
    
    headers.forEach((header, index) => {
      const key = columnMapping[header]
      if (key && values[index] !== undefined) {
        if (key === "amount") {
          // Remove all non-numeric characters except decimal point
          const cleanValue = values[index].replace(/[^\d.]/g, "")
          const parsedAmount = parseFloat(cleanValue) || 0
          freelancer[key] = parsedAmount
          totalAmount += parsedAmount
        } else {
          (freelancer as Record<string, string | number>)[key] = values[index]
        }
      }
    })
    
    if (freelancer.name && freelancer.department) {
      freelancers.push(freelancer as Freelancer)
    }
  }
  
  console.log("[v0] Total parsed amount:", totalAmount)
  console.log("[v0] Total freelancers:", freelancers.length)
  
  return freelancers
}

export function FileUpload() {
  const { uploadData, isLoaded, currentDatasetId } = useData()
  const [isDragging, setIsDragging] = useState(false)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [fileName, setFileName] = useState("")
  const [recordCount, setRecordCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      setStatus("uploading")
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string
          const freelancers = parseCSV(text)
          if (freelancers.length > 0) {
            const datasetId = await uploadData(freelancers)
            if (datasetId) {
              setStatus("success")
              setFileName(file.name)
              setRecordCount(freelancers.length)
            } else {
              setStatus("error")
            }
          } else {
            setStatus("error")
          }
        } catch {
          setStatus("error")
        }
      }
      reader.readAsText(file)
    },
    [uploadData]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && (file.name.endsWith(".csv") || file.name.endsWith(".txt"))) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const copyShareLink = () => {
    if (!currentDatasetId) return
    const link = `${window.location.origin}/share/${currentDatasetId}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === "success" || isLoaded) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {fileName || "تم تحميل البيانات"}
            </p>
            <p className="text-xs text-muted-foreground">
              {recordCount > 0 ? `${recordCount} سجل` : "بيانات تجريبية"}
            </p>
          </div>
        </div>
        
        {currentDatasetId && (
          <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 p-3">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/share/${currentDatasetId}`}
              className="flex-1 bg-transparent text-xs text-muted-foreground outline-none"
            />
            <button
              onClick={copyShareLink}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="h-4 w-4" />
              {copied ? "تم النسخ" : "نسخ"}
            </button>
          </div>
        )}
      </div>
    )
  }

  const downloadTemplate = () => {
    const headers = Object.keys(columnMapping).join(",")
    const sampleRow1 = "أحمد محمد,مصمم جرافيك,سارة أحمد,مشروع التطبيق,التصميم,5500"
    const sampleRow2 = "فاطمة علي,مطور ويب,خالد العمري,مشروع الموقع,التقنية,8000"
    const content = `${headers}\n${sampleRow1}\n${sampleRow2}`
    
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "template.csv"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-xl border-2 border-dashed p-6 transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : status === "error"
            ? "border-red-500/50 bg-red-500/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleChange}
          disabled={status === "uploading"}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        <div className="flex flex-col items-center gap-3 text-center">
          {status === "error" ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">حدث خطأ في قراءة الملف</p>
                <p className="text-xs text-muted-foreground">تأكد من صحة تنسيق الملف</p>
              </div>
            </>
          ) : status === "uploading" ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                <div className="animate-spin">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">جاري التحميل...</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                {isDragging ? (
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  اسحب ملف CSV هنا أو انقر للتحميل
                </p>
                <p className="text-xs text-muted-foreground">
                  يجب أن يحتوي الملف على الأعمدة المطلوبة
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <button
        type="button"
        onClick={downloadTemplate}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Download className="h-4 w-4" />
        <span>تحميل نموذج الملف</span>
      </button>
    </div>
  )
}
