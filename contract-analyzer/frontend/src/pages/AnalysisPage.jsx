import { useEffect, useState, useRef } from "react"
import axios from "axios"

const RISK = {
  high:    { color: "#ef4444", bg: "rgba(239,68,68,0.1)",    border: "rgba(239,68,68,0.3)",    label: "HIGH",    dot: "#ef4444" },
  medium:  { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.3)",   label: "MEDIUM",  dot: "#f59e0b" },
  low:     { color: "#10b981", bg: "rgba(16,185,129,0.1)",   border: "rgba(16,185,129,0.3)",   label: "LOW",     dot: "#10b981" },
  pending: { color: "#64748b", bg: "rgba(100,116,139,0.1)",  border: "rgba(100,116,139,0.3)",  label: "PENDING", dot: "#64748b" },
}

function RiskBadge({ level }) {
  const r = RISK[level] || RISK.pending
  return (
    <span style={{
      background: r.bg, border: `1px solid ${r.border}`,
      color: r.color, fontSize: "10px", fontWeight: 700,
      padding: "3px 8px", borderRadius: "6px", letterSpacing: "0.05em"
    }}>{r.label}</span>
  )
}

export default function AnalysisPage({ contractId }) {
  const [data, setData] = useState(null)
  const [selected, setSelected] = useState(null)
  const [chatMsg, setChatMsg] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("clauses")
  const [filter, setFilter] = useState("all")
  const chatEndRef = useRef(null)

  useEffect(() => {
    axios.get(`/contracts/${contractId}`).then(res => {
      setData(res.data)
      if (res.data.clauses.length > 0) setSelected(res.data.clauses[0])
    })
  }, [contractId])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const sendChat = async () => {
    if (!chatMsg.trim() || chatLoading) return
    const msg = chatMsg
    setChatMsg("")
    setChatLoading(true)
    setChatHistory(h => [...h, { role: "user", content: msg }])
    try {
      const res = await axios.post(`/contracts/${contractId}/chat`, { message: msg })
      setChatHistory(h => [...h, { role: "assistant", content: res.data.response }])
    } catch (e) {
      setChatHistory(h => [...h, { role: "assistant", content: "Error: " + (e.response?.data?.detail || e.message) }])
    }
    setChatLoading(false)
  }

  if (!data) return (
    <div style={{
      minHeight: "100vh", background: "#0a0f1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px", height: "40px", border: "3px solid #6366f1",
          borderTopColor: "transparent", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 1rem"
        }} />
        <p style={{ color: "#64748b", fontSize: "14px" }}>Loading analysis...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const counts = {
    high: data.clauses.filter(c => c.risk_level === "high").length,
    medium: data.clauses.filter(c => c.risk_level === "medium").length,
    low: data.clauses.filter(c => c.risk_level === "low").length,
  }

  const filteredClauses = filter === "all"
    ? data.clauses
    : data.clauses.filter(c => c.risk_level === filter)

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0f1e",
      fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0",
      display: "flex", flexDirection: "column"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        input, textarea { color: #e2e8f0 !important; caret-color: #6366f1 !important; }
        input::placeholder, textarea::placeholder { color: #475569 !important; }
      `}</style>

      {/* Navbar */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "8px",
            background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px"
          }}>⚖️</div>
          <div>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#e2e8f0" }}>
              {data.contract.filename}
            </p>
            <p style={{ margin: 0, fontSize: "11px", color: "#475569" }}>
              Contract #{contractId} • {data.clauses.length} clauses analyzed
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {[
            { level: "high", count: counts.high },
            { level: "medium", count: counts.medium },
            { level: "low", count: counts.low },
          ].map(({ level, count }) => (
            <div key={level} style={{
              display: "flex", alignItems: "center", gap: "5px",
              background: RISK[level].bg, border: `1px solid ${RISK[level].border}`,
              padding: "4px 10px", borderRadius: "8px"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: RISK[level].dot, display: "inline-block" }} />
              <span style={{ color: RISK[level].color, fontSize: "12px", fontWeight: 700 }}>{count}</span>
            </div>
          ))}

          <a href={`http://localhost:8000/contracts/${contractId}/report`}
            target="_blank" rel="noreferrer"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "#fff", textDecoration: "none",
              padding: "8px 16px", borderRadius: "8px",
              fontSize: "13px", fontWeight: 600, marginLeft: "8px"
            }}
          >↓ Download Report</a>

          <a href="#reviewer" style={{
            color: "#6366f1", fontSize: "13px", textDecoration: "none",
            padding: "8px 12px", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "8px"
          }}>Reviewer →</a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 24px", flexShrink: 0
      }}>
        {[
          { id: "clauses", label: "Clause Explorer" },
          { id: "chat", label: "AI Chat" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "14px 20px",
            color: activeTab === tab.id ? "#6366f1" : "#475569",
            fontSize: "13px", fontWeight: 600,
            borderBottom: activeTab === tab.id ? "2px solid #6366f1" : "2px solid transparent",
            transition: "all 0.15s"
          }}>{tab.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {activeTab === "clauses" && (
          <>
            {/* Clause list */}
            <div style={{
              width: "260px", flexShrink: 0,
              borderRight: "1px solid rgba(255,255,255,0.08)",
              display: "flex", flexDirection: "column", overflow: "hidden"
            }}>
              {/* Filter buttons */}
              <div style={{ padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["all", "high", "medium", "low"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      flex: 1,
                      background: filter === f ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${filter === f ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)"}`,
                      color: filter === f ? "#a5b4fc" : "#475569",
                      padding: "5px 0", borderRadius: "6px",
                      fontSize: "10px", fontWeight: 700,
                      cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.04em"
                    }}>
                      {f === "all" ? `All ${data.clauses.length}` : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clause list */}
              <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                {filteredClauses.map((c, i) => {
                  const r = RISK[c.risk_level] || RISK.pending
                  const isSelected = selected?.id === c.id
                  return (
                    <div key={c.id} onClick={() => setSelected(c)} style={{
                      padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                      marginBottom: "4px",
                      background: isSelected ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.06)"}`,
                      transition: "all 0.15s"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: isSelected ? "#a5b4fc" : "#94a3b8" }}>
                          Clause {data.clauses.indexOf(c) + 1}
                        </span>
                        <span style={{
                          width: "7px", height: "7px", borderRadius: "50%",
                          background: r.dot, display: "inline-block"
                        }} />
                      </div>
                      <p style={{
                        margin: 0, fontSize: "11px", textTransform: "capitalize",
                        color: isSelected ? "#94a3b8" : "#334155"
                      }}>
                        {c.clause_type?.replace(/_/g, " ") || "unclassified"}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Detail panel */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {selected ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                    <h2 style={{
                      margin: 0, fontSize: "20px", fontWeight: 700, color: "#f1f5f9",
                      textTransform: "capitalize"
                    }}>
                      {selected.clause_type?.replace(/_/g, " ") || "Unclassified"}
                    </h2>
                    <RiskBadge level={selected.risk_level} />
                    {selected.law_reference && (
                      <span style={{
                        fontSize: "11px", color: "#6366f1",
                        background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                        padding: "3px 8px", borderRadius: "6px", fontWeight: 600
                      }}>{selected.law_reference}</span>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                    {/* Clause text */}
                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "14px", padding: "18px"
                    }}>
                      <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Clause Text</p>
                      <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: 1.7 }}>{selected.text}</p>
                    </div>

                    {/* Risk reason */}
                    {selected.risk_reason && (
                      <div style={{
                        background: (RISK[selected.risk_level] || RISK.pending).bg,
                        border: `1px solid ${(RISK[selected.risk_level] || RISK.pending).border}`,
                        borderRadius: "14px", padding: "18px"
                      }}>
                        <p style={{ margin: "0 0 8px", fontSize: "10px", fontWeight: 700, color: (RISK[selected.risk_level] || RISK.pending).color, letterSpacing: "0.08em", textTransform: "uppercase" }}>⚠️ Risk Analysis</p>
                        <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1", lineHeight: 1.7 }}>{selected.risk_reason}</p>
                      </div>
                    )}

                    {/* Law + Deviation */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      {selected.law_reference && (
                        <div style={{
                          background: "rgba(99,102,241,0.08)",
                          border: "1px solid rgba(99,102,241,0.2)",
                          borderRadius: "14px", padding: "16px"
                        }}>
                          <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em", textTransform: "uppercase" }}>📜 Law Reference</p>
                          <p style={{ margin: 0, fontSize: "13px", color: "#a5b4fc", fontWeight: 600, lineHeight: 1.5 }}>{selected.law_reference}</p>
                        </div>
                      )}
                      {selected.deviation_summary && (
                        <div style={{
                          background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.2)",
                          borderRadius: "14px", padding: "16px"
                        }}>
                          <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 700, color: "#f59e0b", letterSpacing: "0.08em", textTransform: "uppercase" }}>📊 Deviation from Standard</p>
                          <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", lineHeight: 1.6 }}>{selected.deviation_summary}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "40px", marginBottom: "12px" }}>👈</p>
                    <p style={{ color: "#334155", fontSize: "15px" }}>Select a clause to view analysis</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "chat" && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            padding: "24px", maxWidth: "800px", margin: "0 auto", width: "100%"
          }}>
            <div style={{ marginBottom: "16px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 600, color: "#e2e8f0" }}>AI Legal Assistant</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#475569" }}>Ask questions about this contract. The AI knows all clauses and their risk levels.</p>
            </div>

            {/* Suggested questions */}
            {chatHistory.length === 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {[
                  "What is the riskiest clause?",
                  "Is this contract standard under Indian law?",
                  "What should I negotiate?",
                  "Explain the non-compete clause",
                  "Which clauses violate ICA 1872?",
                ].map(q => (
                  <button key={q} onClick={() => setChatMsg(q)} style={{
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#a5b4fc", padding: "8px 14px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                  }}>{q}</button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", marginBottom: "16px",
              display: "flex", flexDirection: "column", gap: "12px",
              minHeight: "200px"
            }}>
              {chatHistory.length === 0 && (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  minHeight: "200px"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "40px", marginBottom: "8px" }}>💬</p>
                    <p style={{ color: "#334155", fontSize: "14px" }}>Ask anything about this contract</p>
                  </div>
                </div>
              )}
              {chatHistory.map((m, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start"
                }}>
                  <div style={{
                    maxWidth: "75%", padding: "12px 16px", borderRadius: "14px",
                    background: m.role === "user"
                      ? "linear-gradient(135deg, #6366f1, #818cf8)"
                      : "rgba(255,255,255,0.05)",
                    border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                    color: m.role === "user" ? "#fff" : "#cbd5e1",
                    fontSize: "14px", lineHeight: 1.6
                  }}>
                    {m.role === "assistant" && (
                      <p style={{ margin: "0 0 6px", fontSize: "10px", fontWeight: 700, color: "#6366f1", letterSpacing: "0.08em" }}>AI LEGAL ASSISTANT</p>
                    )}
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "12px 16px", borderRadius: "14px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{
                          width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1",
                          animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite`,
                          display: "inline-block"
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{
              display: "flex", gap: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", padding: "8px 8px 8px 16px",
              alignItems: "center"
            }}>
              <input
                value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                placeholder="Ask about this contract..."
                disabled={chatLoading}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontSize: "14px", fontFamily: "'DM Sans', sans-serif",
                  color: "#e2e8f0"
                }}
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatMsg.trim()}
                style={{
                  background: chatMsg.trim() ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(255,255,255,0.05)",
                  border: "none",
                  color: chatMsg.trim() ? "#fff" : "#334155",
                  padding: "10px 20px", borderRadius: "8px",
                  fontSize: "13px", fontWeight: 600,
                  cursor: chatMsg.trim() ? "pointer" : "not-allowed",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s"
                }}
              >Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}