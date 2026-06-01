import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import axios from "axios"

export default function UploadPage({ onUpload }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const steps = [
    { label: "Uploading and parsing contract" },
    { label: "Running AI risk analysis" },
    { label: "Detecting deviations from Indian law standards" },
    { label: "Finalizing analysis" },
  ]

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return
    setLoading(true)
    setError("")
    setProgress(0)

    const file = acceptedFiles[0]
    const form = new FormData()
    form.append("file", file)

    try {
      setStatus("Uploading and parsing contract...")
      setProgress(25)
      const uploadRes = await axios.post("/contracts/upload", form)
      const id = uploadRes.data.contract_id

      setStatus("Running AI risk analysis...")
      setProgress(50)
      await axios.post(`/contracts/${id}/analyze`, {}, { timeout: 120000 })

      setStatus("Detecting deviations from Indian law standards...")
      setProgress(75)
      await axios.post(`/contracts/${id}/detect-deviations`, {}, { timeout: 120000 })

      setProgress(100)
      setStatus("Analysis complete!")
      setTimeout(() => onUpload(id), 600)

    } catch (e) {
      setError(e.response?.data?.detail || e.response?.data?.error || e.message)
      setLoading(false)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    disabled: loading,
    maxFiles: 1
  })

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none"
      }} />

      {/* Glow */}
      <div style={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ maxWidth: "560px", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
            padding: "6px 16px", borderRadius: "99px", marginBottom: "1.5rem"
          }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ color: "#a5b4fc", fontSize: "13px", fontWeight: 500 }}>AI-Powered Legal Analysis</span>
          </div>

          <h1 style={{
            fontSize: "44px", fontWeight: 700, color: "#fff",
            margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-1.5px"
          }}>
            Legal Contract<br />
            <span style={{ color: "#6366f1" }}>Analyzer</span>
          </h1>

          <p style={{ color: "#64748b", fontSize: "16px", margin: "0 0 1.25rem" }}>
            Indian law compliance analysis powered by AI
          </p>

          <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
            {["ICA 1872", "RERA 2016", "Companies Act 2013", "IT Act 2000"].map(law => (
              <span key={law} style={{
                fontSize: "11px", fontWeight: 600, color: "#64748b",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                padding: "4px 10px", borderRadius: "6px"
              }}>{law}</span>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          style={{
            background: isDragActive ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
            border: `2px dashed ${isDragActive ? "#6366f1" : "rgba(255,255,255,0.1)"}`,
            borderRadius: "20px",
            padding: loading ? "2rem" : "3rem 2rem",
            textAlign: "center",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            marginBottom: "1.25rem"
          }}
        >
          <input {...getInputProps()} />

          {loading ? (
            <div>
              {/* Progress bar */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "12px" }}>Analyzing contract...</span>
                  <span style={{ color: "#6366f1", fontSize: "12px", fontWeight: 600 }}>{progress}%</span>
                </div>
                <div style={{
                  height: "6px", background: "rgba(255,255,255,0.08)",
                  borderRadius: "99px", overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "linear-gradient(90deg, #6366f1, #818cf8)",
                    borderRadius: "99px", transition: "width 0.6s ease"
                  }} />
                </div>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {steps.map((step, i) => {
                  const stepProgress = (i + 1) * 25
                  const isDone = progress >= stepProgress
                  const isCurrent = progress >= stepProgress - 24 && progress < stepProgress
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "8px 12px", borderRadius: "8px",
                      background: isDone ? "rgba(99,102,241,0.1)" : isCurrent ? "rgba(255,255,255,0.04)" : "transparent",
                    }}>
                      <span style={{ fontSize: "14px", flexShrink: 0 }}>
                        {isDone ? "✅" : isCurrent ? "⏳" : "⭕"}
                      </span>
                      <span style={{
                        fontSize: "13px", fontWeight: 500,
                        color: isDone ? "#a5b4fc" : isCurrent ? "#e2e8f0" : "#334155"
                      }}>{step.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              <div style={{
                width: "60px", height: "60px", borderRadius: "14px",
                background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", margin: "0 auto 1.25rem"
              }}>📄</div>

              <p style={{ color: "#e2e8f0", fontSize: "18px", fontWeight: 600, margin: "0 0 8px" }}>
                {isDragActive ? "Drop your contract here" : "Upload your contract"}
              </p>
              <p style={{ color: "#334155", fontSize: "14px", margin: "0 0 1.5rem" }}>
                Drag and drop a PDF or DOCX file
              </p>
              <button style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                color: "#fff", border: "none",
                padding: "11px 28px", borderRadius: "10px",
                fontSize: "14px", fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}>
                Browse Files
              </button>
              <p style={{ color: "#1e293b", fontSize: "12px", margin: "1rem 0 0" }}>
                PDF and DOCX supported
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "12px 16px", marginBottom: "1rem"
          }}>
            <p style={{ color: "#fca5a5", fontSize: "13px", margin: 0 }}>⚠️ {error}</p>
            <p style={{ color: "#7f1d1d", fontSize: "12px", margin: "4px 0 0" }}>
              If this is a rate limit error, wait 5 minutes and try again.
            </p>
          </div>
        )}

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "1.5rem" }}>
          {[
            { icon: "⚖️", title: "Risk Scoring", desc: "Low / Medium / High" },
            { icon: "📚", title: "RAG Detection", desc: "vs Indian standards" },
            { icon: "🔒", title: "Reviewer Queue", desc: "Human oversight" },
          ].map(f => (
            <div key={f.title} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px", padding: "12px", textAlign: "center"
            }}>
              <div style={{ fontSize: "18px", marginBottom: "4px" }}>{f.icon}</div>
              <p style={{ color: "#94a3b8", fontSize: "11px", fontWeight: 600, margin: "0 0 2px" }}>{f.title}</p>
              <p style={{ color: "#334155", fontSize: "10px", margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", margin: 0 }}>
          <a href="#reviewer" style={{ color: "#6366f1", fontSize: "13px", textDecoration: "none" }}>
            Legal Reviewer? Open dashboard →
          </a>
        </p>
      </div>
    </div>
  )
}