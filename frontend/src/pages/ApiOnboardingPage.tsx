import { useState } from 'react'

const LABEL = 'text-xs uppercase tracking-widest text-[#888] font-semibold mb-1'
const SECTION_TITLE = 'text-lg font-bold text-white mb-1'
const SECTION_DESC = 'text-sm text-[#aaa] mb-4'
const CODE_COLORS = 'bg-[#0c0a14] text-[#a29bfe] font-mono text-sm rounded-xl p-4 overflow-x-auto'

export function ApiOnboardingPage() {
  const [showKey, setShowKey] = useState(false)
  const [activeLang, setActiveLang] = useState<'curl' | 'python' | 'ts'>('curl')

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-2">
      {/* Header */}
      <div>
        <div className={LABEL}>API Portal</div>
        <h2 className="text-3xl font-bold text-white mb-2">
          REST API & SDK Integration
        </h2>
        <p className="text-[#aaa] text-base max-w-2xl">
          Integrate the Helicity scoring engine into your DAO treasury, DeFi protocol, or AI agent workflow. Access realtime reserve risk data via REST API or MCP.
        </p>
      </div>

      {/* Quick nav */}
      <div className="flex flex-wrap gap-3">
        <a href="#api-keys" className="px-4 py-2 bg-white/[0.05] text-white border border-white/[0.06] rounded-lg font-medium hover:bg-white/[0.08] transition-colors text-sm">
          API Keys
        </a>
        <a href="#sdk-quickstart" className="px-4 py-2 bg-white/[0.05] text-white border border-white/[0.06] rounded-lg font-medium hover:bg-white/[0.08] transition-colors text-sm">
          SDK Quickstart
        </a>
        <a href="#rest-api" className="px-4 py-2 bg-white/[0.05] text-white border border-white/[0.06] rounded-lg font-medium hover:bg-white/[0.08] transition-colors text-sm">
          REST API
        </a>
        <a href="#mcp-server" className="px-4 py-2 bg-white/[0.05] text-white border border-white/[0.06] rounded-lg font-medium hover:bg-white/[0.08] transition-colors text-sm">
          MCP Server
        </a>
      </div>

      {/* API Key Management */}
      <section id="api-keys" className="scroll-mt-24 space-y-4">
        <div>
          <div className={SECTION_TITLE}>API Key Management</div>
          <p className={SECTION_DESC}>Manage your production and development API keys.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/[0.03] rounded-lg border border-white/[0.06] p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-white">Active Production Key</span>
              <span className="text-xs bg-[#00b894]/10 text-[#00b894] px-2 py-1 rounded font-medium">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded px-3 py-2.5 text-sm text-white font-mono">
                {showKey ? 'sk-heli-live-9f8e7d...a1b2c3' : 'sk-heli-live-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
              </code>
              <button
                onClick={() => setShowKey(!showKey)}
                className="px-3 py-2.5 bg-white/[0.05] text-[#aaa] border border-white/[0.06] rounded hover:bg-white/[0.08] transition-colors flex items-center justify-center"
                title={showKey ? "Hide" : "Reveal"}
              >
                {showKey ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
              <button className="px-4 py-2.5 bg-[#6c5ce7] text-white rounded font-medium text-sm hover:bg-[#4834d4] transition-colors shadow-sm">
                Copy
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="text-sm font-medium text-[#e17055] hover:underline">Roll Key</button>
              <span className="text-white/20">|</span>
              <button className="text-sm font-medium text-[#aaa] hover:text-white hover:underline">Revoke</button>
            </div>
          </div>

          <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-5">
            <h3 className="text-sm font-bold text-white mb-4">Usage Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#aaa]">Requests Today</span>
                  <span className="font-mono font-medium text-white">1,248</span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                  <div className="bg-[#6c5ce7] h-1.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#aaa]">Requests This Month</span>
                  <span className="font-mono font-medium text-white">45,201 <span className="text-[#888] font-sans text-xs">/ 100k</span></span>
                </div>
                <div className="w-full bg-white/[0.04] rounded-full h-1.5">
                  <div className="bg-[#6c5ce7] h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDK Quickstart */}
      <section id="sdk-quickstart" className="scroll-mt-24 space-y-4">
        <div>
          <div className={SECTION_TITLE}>SDK Quickstart</div>
          <p className={SECTION_DESC}>Get started with a single API call.</p>
        </div>

        <div className="bg-[#0c0a14] rounded-lg overflow-hidden">
          <div className="flex bg-[#1a1825] px-2 py-2 border-b border-white/10 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveLang('curl')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeLang === 'curl' ? 'bg-[#6c5ce7] text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
            >
              cURL
            </button>
            <button
              onClick={() => setActiveLang('python')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeLang === 'python' ? 'bg-[#6c5ce7] text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
            >
              Python (httpx)
            </button>
            <button
              onClick={() => setActiveLang('ts')}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${activeLang === 'ts' ? 'bg-[#6c5ce7] text-white' : 'text-[#888] hover:text-white hover:bg-white/5'}`}
            >
              TypeScript
            </button>
          </div>
          <div className="p-5">
            {activeLang === 'curl' && (
              <pre className="text-sm text-[#e2e8f0] font-mono leading-relaxed overflow-x-auto">
<span className="text-[#a29bfe]">curl</span> -X GET https://api.katabatic.network/v1/stress-scores \
  -H <span className="text-[#00b894]">"Authorization: Bearer sk-kata-live-..."</span>
              </pre>
            )}
            {activeLang === 'python' && (
              <pre className="text-sm text-[#e2e8f0] font-mono leading-relaxed overflow-x-auto">
<span className="text-[#e84393]">import</span> httpx

headers = &#123;
    <span className="text-[#00b894]">"Authorization"</span>: <span className="text-[#00b894]">"Bearer sk-kata-live-..."</span>
&#125;

<span className="text-[#e84393]">with</span> httpx.Client() <span className="text-[#e84393]">as</span> client:
    response = client.get(<span className="text-[#00b894]">"https://api.katabatic.network/v1/stress-scores"</span>, headers=headers)
    data = response.json()
    <span className="text-[#888]"># &#123;"data": [&#123;"symbol": "USDC", "score": 12, ...&#125;], ...&#125;</span>
              </pre>
            )}
            {activeLang === 'ts' && (
              <pre className="text-sm text-[#e2e8f0] font-mono leading-relaxed overflow-x-auto">
<span className="text-[#e84393]">const</span> response = <span className="text-[#e84393]">await</span> fetch(<span className="text-[#00b894]">'https://api.katabatic.network/v1/stress-scores'</span>, &#123;
  headers: &#123;
    <span className="text-[#00b894]">'Authorization'</span>: <span className="text-[#00b894]">'Bearer sk-kata-live-...'</span>
  &#125;
&#125;);

<span className="text-[#e84393]">const</span> &#123; data &#125; = <span className="text-[#e84393]">await</span> response.json();
<span className="text-[#888]">// [&#123;symbol: "USDC", score: 12, ...&#125;]</span>
              </pre>
            )}
          </div>
        </div>
      </section>

      {/* REST API Section */}
      <section id="rest-api" className="scroll-mt-24 space-y-4">
        <div>
          <div className={SECTION_TITLE}>REST API Documentation</div>
          <p className={SECTION_DESC}>
            Base URL: <code className="bg-white/[0.06] px-1.5 py-0.5 rounded ml-1 font-mono text-xs">https://api.helicity.network/v1</code>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/[0.04] p-4 rounded-lg">
            <h3 className="text-sm font-bold text-white mb-2">Authentication</h3>
            <p className="text-sm text-[#aaa]">All endpoints require a Bearer token in the <code className="text-xs font-mono">Authorization</code> header.</p>
          </div>
          <div className="bg-white/[0.04] p-4 rounded-lg">
            <h3 className="text-sm font-bold text-white mb-2">Rate Limits</h3>
            <p className="text-sm text-[#aaa]">100 requests / minute per active key. IPFS pinning endpoints are limited to 10 / minute.</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Endpoint 1 */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="bg-white/[0.03] border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#00b894]/10 text-[#00b894] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">GET</span>
                <code className="text-white font-mono text-sm font-medium">/api/stress-scores</code>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#aaa] mb-4">Returns liquidity stress scores for all tracked stablecoins.</p>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-2">Response Schema</h4>
              <pre className={CODE_COLORS}>
{`{
  "data": [
    {
      "symbol": "USDC",
      "score": 12,
      "latency_hours": 4,
      "lcr_estimate": 1.05
    }
  ],
  "error": null,
  "timestamp": "2026-03-14T00:00:00Z"
}`}
              </pre>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="bg-white/[0.03] border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="bg-[#00b894]/10 text-[#00b894] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">GET</span>
                <code className="text-white font-mono text-sm font-medium">/api/stress-scores/&#123;symbol&#125;</code>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#aaa]">Returns a single stablecoin's detailed 6 dimension breakdown and consensus narrative.</p>
            </div>
          </div>

          {/* Endpoint 3 */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="bg-white/[0.03] border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="bg-[#e17055]/10 text-[#e17055] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">POST</span>
                <code className="text-white font-mono text-sm font-medium">/api/stress-scores/project</code>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#aaa]">Projects a scenario analysis given specific macro/weather shocks.</p>
            </div>
          </div>

          {/* Endpoint 4 */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="bg-white/[0.03] border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="bg-[#00b894]/10 text-[#00b894] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">GET</span>
                <code className="text-white font-mono text-sm font-medium">/api/weather/active</code>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#aaa]">Returns active NOAA events with estimated operational impact.</p>
            </div>
          </div>

          {/* Endpoint 5 */}
          <div className="border border-white/[0.06] rounded-xl overflow-hidden">
            <div className="bg-white/[0.03] border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="bg-[#00b894]/10 text-[#00b894] px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">GET</span>
                <code className="text-white font-mono text-sm font-medium">/api/graph</code>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#aaa]">Returns the complete knowledge graph configuration (nodes, edges, weights).</p>
            </div>
          </div>
        </div>
      </section>

      {/* MCP Server Section */}
      <section id="mcp-server" className="scroll-mt-24 space-y-4">
        <div>
          <div className={SECTION_TITLE}>MCP Server Setup</div>
          <p className={SECTION_DESC}>
            The Model Context Protocol (MCP) server allows AI trading bots and agent frameworks to query risk scores as tool calls before executing stablecoin positions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-3">Tool Reference</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] mt-2"></div>
                <div>
                  <code className="bg-white/[0.04] border border-white/[0.06] px-1 py-0.5 rounded text-xs font-mono font-medium text-white">get_stress_scores</code>
                  <p className="text-sm text-[#888] mt-1">Returns all tracked scores.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] mt-2"></div>
                <div>
                  <code className="bg-white/[0.04] border border-white/[0.06] px-1 py-0.5 rounded text-xs font-mono font-medium text-white">get_stablecoin_detail(symbol)</code>
                  <p className="text-sm text-[#888] mt-1">Returns dimension breakdown.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] mt-2"></div>
                <div>
                  <code className="bg-white/[0.04] border border-white/[0.06] px-1 py-0.5 rounded text-xs font-mono font-medium text-white">project_scenario(macro_shock)</code>
                  <p className="text-sm text-[#888] mt-1">Projects stress scores under various scenarios.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] mt-2"></div>
                <div>
                  <code className="bg-white/[0.04] border border-white/[0.06] px-1 py-0.5 rounded text-xs font-mono font-medium text-white">get_active_alerts()</code>
                  <p className="text-sm text-[#888] mt-1">NOAA weather events + ops impact.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6c5ce7] mt-2"></div>
                <div>
                  <code className="bg-white/[0.04] border border-white/[0.06] px-1 py-0.5 rounded text-xs font-mono font-medium text-white">get_score_history(symbol)</code>
                  <p className="text-sm text-[#888] mt-1">Historical scores with IPFS CIDs.</p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4">Transports</h3>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                stdio (Local Agents)
              </h4>
              <p className="text-sm text-[#aaa] mb-2">Run the server as a subprocess for local agents like Claude Code or Cursor.</p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                SSE (Remote Agents)
              </h4>
              <p className="text-sm text-[#aaa]">Connect remote agents to the hosted MCP server over Server-Sent Events utilizing API Key authentication.</p>
              <code className="block mt-2 text-xs bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded font-mono text-white">https://api.helicity.network/mcp/sse</code>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0c0a14] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider text-[#bbbbbb] font-medium">Claude Desktop Config JSON (stdio)</span>
            </div>
            <pre className="text-sm text-white font-mono overflow-x-auto whitespace-pre">
&#123;
  <span className="text-[#6c5ce7]">"mcpServers"</span>: &#123;
    <span className="text-[#6c5ce7]">"katabatic"</span>: &#123;
      "command": "python",
      "args": ["-m", "helicity.mcp_server"],
      "env": &#123;
        "HELICITY_API_KEY": "sk-heli-live-..."
      &#125;
    &#125;
  &#125;
&#125;
            </pre>
          </div>

          <div className="bg-[#0c0a14] rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs uppercase tracking-wider text-[#bbbbbb] font-medium">Custom Agent Integration (Python fastmcp client)</span>
            </div>
            <pre className="text-sm text-white font-mono overflow-x-auto whitespace-pre">
<span className="text-[#e84393]">from</span> fastmcp <span className="text-[#e84393]">import</span> FastMCPClient

<span className="text-[#888]"># Connect to Katabatic via SSE</span>
client = FastMCPClient(
    url=<span className="text-[#00b894]">"https://api.katabatic.network/mcp/sse"</span>,
    headers=&#123;<span className="text-[#00b894]">"Authorization"</span>: <span className="text-[#00b894]">"Bearer sk-kata-live-..."</span>&#125;
)

<span className="text-[#888]"># Use tools in your agent loop</span>
scores = client.call_tool(<span className="text-[#00b894]">"get_stress_scores"</span>)
print(scores)
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
