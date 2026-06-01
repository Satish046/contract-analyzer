import { useEffect, useState } from "react"
import axios from "axios"

export default function PreviewPage({ contractId }) {
  const [pdf, setPdf] = useState(null)

  useEffect(() => {
    axios.get(`/contracts/${contractId}/report`, { responseType: 'blob' })
      .then(res => {
        const url = URL.createObjectURL(res.data)
        setPdf(url)
      })
  }, [contractId])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex gap-4 mb-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded">
          ← Back
        </button>
        <a href={pdf} download={`contract_${contractId}_report.pdf`} 
           className="bg-green-600 text-white px-6 py-2 rounded">
          ↓ Download PDF
        </a>
      </div>
      {pdf && <iframe src={pdf} className="w-full h-screen" />}
    </div>
  )
}