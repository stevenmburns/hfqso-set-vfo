import { useState } from 'react'

interface Band {
  band: string
  freq: string
  hz: number
}

const BANDS: Band[] = [
  { band: '17m', freq: '18.1575', hz: 18157500 },
  { band: '15m', freq: '21.3830', hz: 21383000 },
  { band: '12m', freq: '24.9700', hz: 24970000 },
  { band: '10m', freq: '28.4700', hz: 28470000 },
]

async function setVfo(hz: number): Promise<void> {
  const xml = `<?xml version="1.0"?><methodCall><methodName>rig.set_vfo</methodName><params><param><value><double>${hz}</double></value></param></params></methodCall>`
  const res = await fetch('http://localhost:12346', {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml' },
    body: xml,
  })
  if (!res.ok) throw new Error(`proxy ${res.status}`)
}

type Status = { type: 'idle' } | { type: 'ok'; msg: string } | { type: 'err'; msg: string }

export default function VfoPanel() {
  const [status, setStatus] = useState<Status>({ type: 'idle' })
  const [loading, setLoading] = useState<number | null>(null)

  async function handleClick(b: Band) {
    setLoading(b.hz)
    setStatus({ type: 'idle' })
    try {
      await setVfo(b.hz)
      setStatus({ type: 'ok', msg: `Tuned to ${b.freq} MHz (${b.band})` })
    } catch {
      setStatus({ type: 'err', msg: 'Error: flrig unreachable' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-wide text-amber-400">HFQSO Set VFO</h1>
        <p className="text-gray-400 text-sm mt-1">Select a band to tune your rig</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {BANDS.map((b) => (
          <button
            key={b.hz}
            onClick={() => handleClick(b)}
            disabled={loading !== null}
            className="
              flex flex-col items-center justify-center
              bg-gray-800 hover:bg-gray-700 active:bg-gray-600
              disabled:opacity-50 disabled:cursor-not-allowed
              border border-gray-600 rounded-lg
              px-4 py-5 gap-1
              transition-colors duration-150
              cursor-pointer
            "
          >
            <span className="text-xl font-bold text-amber-400">{b.band}</span>
            <span className="text-sm text-gray-300">{b.freq} MHz</span>
            {loading === b.hz && (
              <span className="text-xs text-gray-500 mt-1">tuning…</span>
            )}
          </button>
        ))}
      </div>

      <div className="h-6 text-sm text-center">
        {status.type === 'ok' && (
          <span className="text-green-400">{status.msg}</span>
        )}
        {status.type === 'err' && (
          <span className="text-red-400">{status.msg}</span>
        )}
      </div>
    </div>
  )
}
