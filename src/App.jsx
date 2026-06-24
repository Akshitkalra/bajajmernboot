import { useState } from 'react'

const EXAMPLES = {
  A: { label: 'Example A', data: ['a', '1', '334', '4', 'R', '$'] },
  B: { label: 'Example B', data: ['2', 'a', 'y', '4', '&', '-', '*', '5', '92', 'b'] },
  C: { label: 'Example C', data: ['A', 'ABCD', 'DOE'] },
}

const FIELD_CONFIG = [
  { key: 'is_success',         label: 'Status',              icon: '✓',  type: 'bool'  },
  { key: 'user_id',            label: 'User ID',             icon: '👤', type: 'string'},
  { key: 'email',              label: 'Email',               icon: '📧', type: 'string'},
  { key: 'roll_number',        label: 'Roll Number',         icon: '🎓', type: 'string'},
  { key: 'odd_numbers',        label: 'Odd Numbers',         icon: '🔢', type: 'array', color: '#a78bfa' },
  { key: 'even_numbers',       label: 'Even Numbers',        icon: '🔢', type: 'array', color: '#34d399' },
  { key: 'alphabets',          label: 'Alphabets',           icon: '🔤', type: 'array', color: '#60a5fa' },
  { key: 'special_characters', label: 'Special Characters',  icon: '⚡', type: 'array', color: '#f472b6' },
  { key: 'sum',                label: 'Sum',                 icon: '∑',  type: 'string'},
  { key: 'concat_string',      label: 'Concat String',       icon: '🔗', type: 'string'},
]

export default function App() {
  const [input, setInput]       = useState(JSON.stringify({ data: ['a', '1', '334', '4', 'R', '$'] }, null, 2))
  const [response, setResponse] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [health, setHealth]     = useState(null)
  const [healthLoading, setHealthLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      const body = JSON.parse(input)
      const res  = await fetch('/bfhl', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      })
      const json = await res.json()
      setResponse({ status: res.status, data: json })
    } catch (e) {
      setError(e.message.includes('JSON') ? 'Invalid JSON — please fix your input.' : e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleHealth() {
    setHealthLoading(true)
    setHealth(null)
    try {
      const res  = await fetch('/health')
      const json = await res.json()
      setHealth(json)
    } catch {
      setHealth({ status: 'ERROR', message: 'Could not reach /health' })
    } finally {
      setHealthLoading(false)
    }
  }

  function loadExample(key) {
    setInput(JSON.stringify({ data: EXAMPLES[key].data }, null, 2))
    setResponse(null)
    setError(null)
  }

  function renderValue(field, value) {
    if (field.type === 'bool') {
      return (
        <span className={`badge ${value ? 'badge-success' : 'badge-error'}`}>
          {value ? 'true' : 'false'}
        </span>
      )
    }
    if (field.type === 'array') {
      if (!value || value.length === 0) return <span className="empty">[ ]</span>
      return (
        <div className="chips">
          {value.map((v, i) => (
            <span key={i} className="chip" style={{ borderColor: field.color, color: field.color }}>
              {v}
            </span>
          ))}
        </div>
      )
    }
    return <span className="mono">{String(value)}</span>
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <div>
              <h1>BFHL API Tester</h1>
              <p>Bajaj Finserv Health — Developer Challenge</p>
            </div>
          </div>
          <button
            className={`health-btn ${health?.status === 'UP' ? 'health-up' : ''}`}
            onClick={handleHealth}
            disabled={healthLoading}
          >
            <span className={`dot ${health?.status === 'UP' ? 'dot-up' : 'dot-idle'}`} />
            {healthLoading ? 'Checking…' : health ? health.status : 'Check Health'}
          </button>
        </div>
      </header>

      <main className="main">
        {/* Left: Input */}
        <section className="panel input-panel">
          <div className="panel-header">
            <span className="panel-title">Request</span>
            <div className="examples">
              {Object.entries(EXAMPLES).map(([k, v]) => (
                <button key={k} className="example-btn" onClick={() => loadExample(k)}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="endpoint-pill">
            <span className="method">POST</span>
            <span className="path">/bfhl</span>
          </div>

          <textarea
            className="code-area"
            value={input}
            onChange={e => setInput(e.target.value)}
            spellCheck={false}
            rows={10}
          />

          <button className="send-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <><span className="spinner" /> Sending…</>
            ) : (
              <><span>▶</span> Send Request</>
            )}
          </button>

          {error && <div className="error-box">{error}</div>}
        </section>

        {/* Right: Response */}
        <section className="panel response-panel">
          <div className="panel-header">
            <span className="panel-title">Response</span>
            {response && (
              <span className={`status-code ${response.status === 200 ? 'code-ok' : 'code-err'}`}>
                {response.status} {response.status === 200 ? 'OK' : 'Error'}
              </span>
            )}
          </div>

          {!response && !loading && (
            <div className="empty-state">
              <span className="empty-icon">📡</span>
              <p>Send a request to see the response</p>
            </div>
          )}

          {loading && (
            <div className="empty-state">
              <span className="spinner-lg" />
              <p>Waiting for response…</p>
            </div>
          )}

          {response && (
            <div className="response-grid">
              {FIELD_CONFIG.map(field => (
                <div className="response-row" key={field.key}>
                  <div className="field-label">
                    <span className="field-icon">{field.icon}</span>
                    <span>{field.label}</span>
                  </div>
                  <div className="field-value">
                    {response.data[field.key] !== undefined
                      ? renderValue(field, response.data[field.key])
                      : <span className="empty">—</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>Manya Batra · Roll No. 2310992064 · Chitkara University</span>
        <span className="footer-sep">·</span>
        <span>BFHL API · MERN Stack</span>
      </footer>
    </div>
  )
}
