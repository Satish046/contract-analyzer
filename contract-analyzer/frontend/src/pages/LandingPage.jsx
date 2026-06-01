import React from "react";

export default function LandingPage({ onUpload }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Navbar */}

<nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">

  <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">

    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
      LegalAI
    </h1>

    <div className="hidden md:flex gap-8 text-slate-300">

      <a href="#features" className="hover:text-white">
        Features
      </a>

      <a href="#workflow" className="hover:text-white">
        How It Works
      </a>

      <a href="#dashboard" className="hover:text-white">
        Dashboard
      </a>

      <a href="#assistant" className="hover:text-white">
        AI Assistant
      </a>

      <a href="#upload" className="hover:text-white">
        Upload
      </a>

    </div>

    <button
      onClick={() =>
        document.getElementById("upload").scrollIntoView({
          behavior: "smooth"
        })
      }
      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600"
    >
      Upload Contract
    </button>

  </div>

</nav>

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[150px]" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[150px]" />

      {/* Hero */}

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">

        <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          LegalAI
        </h1>

        <p className="text-2xl text-slate-300 max-w-3xl">
          Enterprise Contract Intelligence for Indian Law
        </p>

        <p className="mt-6 text-slate-400 max-w-4xl text-lg">
          Analyze NDAs, Employment Agreements, Service Agreements
          and RERA Contracts using AI-powered legal analysis,
          risk scoring and reviewer workflows.
        </p>

        <button
          onClick={() =>
            document.getElementById("upload").scrollIntoView({
              behavior: "smooth"
            })
          }
          className="mt-10 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition"
        >
          Upload Contract
        </button>

      </section>

      {/* Statistics */}

      <section className="py-20 px-10">

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-cyan-400">15K+</h2>
            <p className="text-slate-400 mt-2">Contracts Reviewed</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-cyan-400">45K+</h2>
            <p className="text-slate-400 mt-2">Clauses Analyzed</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-cyan-400">97%</h2>
            <p className="text-slate-400 mt-2">Reviewer Approval</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <h2 className="text-4xl font-bold text-cyan-400">12s</h2>
            <p className="text-slate-400 mt-2">Average Analysis Time</p>
          </div>

        </div>

      </section>

      {/* Features */}

      <section id="features" className="py-24 px-10">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Powerful AI Features
          </h2>

          <p className="text-slate-400 text-lg">
            Built specifically for Indian legal contracts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

          {[
            ["⚖️", "Clause Classification"],
            ["⚠️", "Risk Detection"],
            ["📊", "Deviation Analysis"],
            ["💬", "AI Assistant"],
            ["👨‍⚖️", "Reviewer Workflow"],
            ["📄", "PDF Reports"]
          ].map(([icon, title]) => (
            <div
              key={title}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-slate-400">
                Advanced AI-powered legal intelligence and
                contract analysis capabilities.
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* How It Works */}

      <section id="workflow" className="py-24 px-10">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            How It Works
          </h2>

          <p className="text-slate-400">
            Upload → Extract → Analyze → Review → Report
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 text-center max-w-6xl mx-auto">

          <div>
            <div className="text-5xl">📤</div>
            <h3 className="font-bold mt-4">Upload</h3>
          </div>

          <div>
            <div className="text-5xl">🔍</div>
            <h3 className="font-bold mt-4">Extract</h3>
          </div>

          <div>
            <div className="text-5xl">🤖</div>
            <h3 className="font-bold mt-4">Analyze</h3>
          </div>

          <div>
            <div className="text-5xl">⚖️</div>
            <h3 className="font-bold mt-4">Review</h3>
          </div>

          <div>
            <div className="text-5xl">📄</div>
            <h3 className="font-bold mt-4">Report</h3>
          </div>

        </div>

      </section>

      {/* Dashboard Preview */}

      <section id="dashboard" className="py-24 px-10">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Contract Intelligence Dashboard
          </h2>

          <p className="text-slate-400">
            AI-powered risk analysis and legal insights
          </p>
        </div>

        <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <div className="grid md:grid-cols-4 gap-6 mb-8">

            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">Risk Score</p>
              <h3 className="text-4xl font-bold text-red-400">8.4</h3>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">High Risk</p>
              <h3 className="text-4xl font-bold text-red-400">4</h3>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">Medium Risk</p>
              <h3 className="text-4xl font-bold text-yellow-400">17</h3>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm">Low Risk</p>
              <h3 className="text-4xl font-bold text-green-400">4</h3>
            </div>

          </div>

        </div>

      </section>

      {/* AI Assistant */}

      <section id="assistant" className="py-24 px-10">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            AI Legal Assistant
          </h2>

          <p className="text-slate-400">
            Ask questions about any contract
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8">

          <div className="bg-blue-600 p-4 rounded-2xl w-fit ml-auto mb-4">
            What is the riskiest clause?
          </div>

          <div className="bg-slate-800 p-5 rounded-2xl">
            The highest-risk clause is the Non-Compete clause.
            It may conflict with Indian Contract Act 1872 Section 27.
          </div>

        </div>

      </section>
      {/* Technology Stack */}

      <section id="tech-stack" className="py-24 px-10">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Technology Stack
          </h2>

          <p className="text-slate-400">
            Production-grade architecture powering LegalAI
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-cyan-400 font-bold text-xl mb-2">Frontend</h3>
            <p className="text-slate-400">
              React 19
              <br />
              TailwindCSS
              <br />
              Axios
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-cyan-400 font-bold text-xl mb-2">Backend</h3>
            <p className="text-slate-400">
              FastAPI
              <br />
              Celery
              <br />
              Redis
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-cyan-400 font-bold text-xl mb-2">AI Layer</h3>
            <p className="text-slate-400">
              Groq API
              <br />
              Llama 3.3 70B
              <br />
              Sentence Transformers
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-cyan-400 font-bold text-xl mb-2">Storage</h3>
            <p className="text-slate-400">
              PostgreSQL
              <br />
              Qdrant
              <br />
              File Storage
            </p>
          </div>

        </div>

      </section>
      {/* Architecture */}
      <section className="py-24 px-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            System Architecture
          </h2>
          <p className="text-slate-400">
            End-to-end AI contract analysis pipeline
          </p>
        </div>
        <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-10">
          <div className="grid md:grid-cols-7 gap-4 text-center">
            <div className="bg-slate-800 p-5 rounded-xl">
              Upload
            </div>
            <div className="flex items-center justify-center text-cyan-400">
              →
            </div>
            <div className="bg-slate-800 p-5 rounded-xl">
              Parsing
            </div>
            <div className="flex items-center justify-center text-cyan-400">
              →
            </div>
            <div className="bg-slate-800 p-5 rounded-xl">
              AI Analysis
            </div>
            <div className="flex items-center justify-center text-cyan-400">
              →
            </div>
            <div className="bg-slate-800 p-5 rounded-xl">
              Report
            </div>
          </div>
        </div>
      </section>
          

      {/* Upload CTA */}

      <section id="upload" className="py-32 text-center">

        <h2 className="text-5xl font-bold mb-4">
          Ready To Analyze Contracts?
        </h2>

        <p className="text-slate-400 mb-8">
          Start AI-powered legal analysis today.
        </p>

        <button
          onClick={() => onUpload(1)}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-105 transition"
        >
          Start Analysis
        </button>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-800 py-16 text-center">

        <h3 className="text-3xl font-bold">
          LegalAI
        </h3>

        <p className="mt-4 text-slate-400">
          AI-Powered Contract Intelligence Platform
        </p>

        <div className="mt-10">
          <h4 className="font-semibold text-lg">
            Built By
          </h4>

          <p className="text-slate-300 mt-2">
            V Satish
          </p>

          <p className="text-slate-500">
            AI / Machine Learning Engineer
          </p>
        </div>

      </footer>

    </div>
  );
}