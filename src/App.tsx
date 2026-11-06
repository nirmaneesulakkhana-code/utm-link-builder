import { useEffect, useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import { BuilderForm, type FormErrors, type FormState } from './components/BuilderForm'
import { GeneratedUrl } from './components/GeneratedUrl'
import { HistoryTable } from './components/HistoryTable'
import { getChannel, sourceFor, type ChannelId, type MetaPlatform } from './lib/channels'
import { copyText } from './lib/clipboard'
import { historyToCsv, loadHistory, newId, saveHistory, type HistoryEntry } from './lib/storage'
import { buildUtmUrl, normalizeValue, validateLandingUrl } from './lib/utm'

const EMPTY: FormState = {
  landingUrl: '',
  channelId: '',
  metaPlatform: 'facebook',
  source: '',
  medium: '',
  campaign: '',
  content: '',
  term: '',
}

const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'] as const
const REQUIRED: { key: keyof FormState; label: string }[] = [
  { key: 'landingUrl', label: 'landing page URL' },
  { key: 'channelId', label: 'marketing channel' },
  { key: 'source', label: 'source' },
  { key: 'medium', label: 'medium' },
  { key: 'campaign', label: 'campaign' },
]

function computeErrors(f: FormState): FormErrors {
  return {
    landingUrl: validateLandingUrl(f.landingUrl),
    channelId: f.channelId ? null : 'Select a marketing channel.',
    source: f.source.trim() ? null : 'UTM source is required.',
    medium: f.medium.trim() ? null : 'UTM medium is required.',
    campaign: f.campaign.trim() ? null : 'UTM campaign is required.',
  }
}

export default function App() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [enforce, setEnforce] = useState(true)
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [copied, setCopied] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => saveHistory(history), [history])

  const clean = (v: string) => (enforce ? normalizeValue(v) : v.trim())

  const allErrors = useMemo(() => computeErrors(form), [form])
  const visibleErrors: FormErrors = Object.fromEntries(
    Object.entries(allErrors).map(([k, v]) => [k, touched[k as keyof FormState] ? v : null]),
  )
  const isValid = Object.values(allErrors).every((e) => !e)

  const params = {
    source: clean(form.source),
    medium: clean(form.medium),
    campaign: clean(form.campaign),
    content: clean(form.content),
    term: clean(form.term),
  }
  const url = isValid && params.source && params.medium && params.campaign ? buildUtmUrl(form.landingUrl, params) : null
  const missing = REQUIRED.filter((r) => allErrors[r.key]).map((r) => r.label)
  const savedAlready = !!url && history.some((h) => h.url === url)

  useEffect(() => setCopied(false), [url])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  const handleBlur = (key: keyof FormState) => {
    setTouched((t) => ({ ...t, [key]: true }))
    if (enforce && (UTM_KEYS as readonly string[]).includes(key)) {
      setForm((f) => ({ ...f, [key]: normalizeValue(f[key] as string) }))
    }
    if (key === 'landingUrl') setForm((f) => ({ ...f, landingUrl: f.landingUrl.trim() }))
  }

  const handleChannel = (id: ChannelId | '') => {
    const ch = getChannel(id)
    setForm((f) => ({
      ...f,
      channelId: id,
      metaPlatform: 'facebook',
      source: ch ? sourceFor(ch, 'facebook') : f.source,
      medium: ch ? ch.medium : f.medium,
    }))
    setTouched((t) => ({ ...t, channelId: true }))
  }

  const handlePlatform = (p: MetaPlatform) => setForm((f) => ({ ...f, metaPlatform: p, source: p }))

  const toEntry = (u: string): HistoryEntry => ({
    id: newId(),
    createdAt: new Date().toISOString(),
    landingUrl: form.landingUrl.trim(),
    channelId: form.channelId as ChannelId,
    channelLabel: getChannel(form.channelId)?.label ?? '',
    metaPlatform: form.channelId === 'meta' ? form.metaPlatform : undefined,
    ...params,
    url: u,
  })

  const save = () => {
    if (!url || savedAlready) return
    setHistory((h) => [toEntry(url), ...h])
  }

  const copy = async () => {
    if (!url) return
    if (await copyText(url)) {
      setCopied(true)
      save()
    }
  }

  const reset = () => {
    setForm(EMPTY)
    setTouched({})
  }

  const copyFromHistory = async (e: HistoryEntry) => {
    if (await copyText(e.url)) {
      setCopiedId(e.id)
      setTimeout(() => setCopiedId((c) => (c === e.id ? null : c)), 1500)
    }
  }

  const reuse = (e: HistoryEntry) => {
    setForm({
      landingUrl: e.landingUrl,
      channelId: e.channelId,
      metaPlatform: e.metaPlatform ?? 'facebook',
      source: e.source,
      medium: e.medium,
      campaign: e.campaign,
      content: e.content,
      term: e.term,
    })
    setTouched({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = (id: string) => setHistory((h) => h.filter((e) => e.id !== id))

  const clearAll = () => {
    if (window.confirm('Delete all saved links? This cannot be undone.')) setHistory([])
  }

  const exportCsv = (rows: HistoryEntry[]) => {
    const blob = new Blob([historyToCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `utm-links-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const paramList = (Object.entries(params) as [string, string][])
    .filter(([, v]) => v)
    .map(([k, v]) => [`utm_${k}`, v] as [string, string])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-4 py-4 sm:px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Link2 className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <h1 className="text-base leading-tight font-semibold text-gray-900">UTM Link Builder</h1>
            <p className="text-xs text-gray-500">Standardized campaign tracking URLs</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <BuilderForm
            form={form}
            errors={visibleErrors}
            enforceConvention={enforce}
            onEnforceChange={setEnforce}
            onChange={update}
            onChannelChange={handleChannel}
            onPlatformChange={handlePlatform}
            onBlur={handleBlur}
            onReset={reset}
          />
          <div className="lg:sticky lg:top-6">
            <GeneratedUrl
              url={url}
              missing={missing}
              params={paramList}
              copied={copied}
              saved={savedAlready}
              onCopy={copy}
              onSave={save}
            />
          </div>
        </div>

        <HistoryTable
          entries={history}
          copiedId={copiedId}
          onCopy={copyFromHistory}
          onReuse={reuse}
          onDelete={remove}
          onClear={clearAll}
          onExport={exportCsv}
        />
      </main>
    </div>
  )
}
