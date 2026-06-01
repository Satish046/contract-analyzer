import { useEffect, useState } from "react"
import axios from "axios"

export default function ReviewerPage() {
  const [queue, setQueue] = useState([])
  const [loading, setLoading] = useState(true)
  const [deciding, setDeciding] = useState(null)

  const fetchQueue = async () => {
    const res = await axios.get("/reviewer/queue")
    setQueue(res.data.queue)
    setLoading(false)
  }

  useEffect(() => { fetchQueue() }, [])

  const decide = async (clauseId, decision) => {
    setDeciding(clauseId)
    await axios.post("/reviewer/decision", {
      clause_id: clauseId,
      decision,
      notes: `${decision} by reviewer`
    })
    await fetchQueue()
    setDeciding(null)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-500">Loading reviewer queue...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Reviewer Dashboard</h1>
          <p className="text-blue-300 text-sm">Legal reviewer approval queue</p>
        </div>
        <a href="#" className="text-blue-300 text-sm hover:text-white">
          ← Back to upload
        </a>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-700">
            {queue.length === 0 ? "All clauses reviewed ✓" : `${queue.length} clause(s) pending review`}
          </h2>
          <button onClick={fetchQueue} className="text-blue-600 text-sm hover:underline">
            Refresh
          </button>
        </div>

        {queue.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-10 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-green-700 font-bold text-lg">All high-risk clauses reviewed</p>
            <p className="text-green-600 text-sm mt-1">PDF reports are now unblocked for all contracts</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map(item => (
              <div key={item.queue_id} className="bg-white border border-red-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                      HIGH RISK
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {item.clause_type?.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{item.contract_filename}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Clause Text</p>
                  <p className="text-sm text-gray-600">{item.clause_text}</p>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">
                    <span className="font-bold">Risk:</span> {item.risk_reason}
                  </p>
                  <p className="text-xs text-blue-600">
                    <span className="font-bold">Law:</span> {item.law_reference}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => decide(item.clause_id, "approved")}
                    disabled={deciding === item.clause_id}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50"
                  >
                    {deciding === item.clause_id ? "Processing..." : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => decide(item.clause_id, "escalated")}
                    disabled={deciding === item.clause_id}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50"
                  >
                    ↑ Escalate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}