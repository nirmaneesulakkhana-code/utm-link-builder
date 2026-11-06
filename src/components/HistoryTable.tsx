import { useMemo, useState } from 'react'
import { Check, Copy, Download, History, PencilLine, Search, Trash2 } from 'lucide-react'
import { CHANNELS } from '../lib/channels'
import type { HistoryEntry } from '../lib/storage'
import { inputClass } from './Field'

interface Props {
  entries: HistoryEntry[]
  copiedId: string | null
  onCopy: (e: HistoryEntry) => void
  onReuse: (e: HistoryEntry) => void
  onDelete: (id: string) => void
  onClear: () => void
  onExport: (rows: HistoryEntry[]) => void
}

const dateFmt = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function HistoryTable({ entries, copiedId, onCopy, onReuse, onDelete, onClear, onExport }: Props) {
  const [query, setQuery] = useState('')
  const [channel, setChannel] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (channel && e.channelId !== channel) return false
      if (!q) return true
      return [e.campaign, e.channelLabel, e.source, e.medium, e.content, e.term, e.landingUrl]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [entries, query, channel])

  const iconBtn = 'inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'

  const actions = (e: HistoryEntry) => (
    <div className="flex items-center gap-1.5">
      <button type="button" className={iconBtn} onClick={() => onCopy(e)} title="Copy URL" aria-label={`Copy URL for ${e.campaign}`}>
        {copiedId === e.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </button>
      <button type="button" className={iconBtn} onClick={() => onReuse(e)} title="Load into builder" aria-label={`Load ${e.campaign} into builder`}>
        <PencilLine className="h-4 w-4" />
      </button>
      <button
        type="button"
        className={iconBtn + ' hover:border-red-200 hover:bg-red-50 hover:text-red-600'}
        onClick={() => onDelete(e.id)}
        title="Delete"
        aria-label={`Delete ${e.campaign}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <section aria-labelledby="history-title" className="rounded-xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="history-title" className="text-base font-semibold text-gray-900">Campaign History</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {entries.length} saved {entries.length === 1 ? 'link' : 'links'}, stored in this browser only.
          </p>
        </div>
        {entries.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onExport(filtered)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" aria-hidden />
              Export CSV
            </button>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Clear all
            </button>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <History className="h-8 w-8 text-gray-300" aria-hidden />
          <p className="mt-3 text-sm font-medium text-gray-700">No saved links yet</p>
          <p className="mt-1 text-sm text-gray-500">Links you copy or save will show up here.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 px-5 pt-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search campaign, source, medium, content or URL"
                aria-label="Search history"
                className={inputClass() + ' pl-9'}
              />
            </div>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              aria-label="Filter by channel"
              className={inputClass() + ' sm:w-52'}
            >
              <option value="">All channels</option>
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-500">No links match your search.</p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden px-5 py-4 md:block">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
                      <tr>
                        <th className="px-3 py-2.5 font-medium">Date</th>
                        <th className="px-3 py-2.5 font-medium">Campaign</th>
                        <th className="px-3 py-2.5 font-medium">Channel</th>
                        <th className="px-3 py-2.5 font-medium">Source / Medium</th>
                        <th className="px-3 py-2.5 font-medium">Content</th>
                        <th className="px-3 py-2.5 font-medium">URL</th>
                        <th className="px-3 py-2.5 font-medium"><span className="sr-only">Actions</span></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filtered.map((e) => (
                        <tr key={e.id} className="align-top hover:bg-gray-50/60">
                          <td className="px-3 py-3 whitespace-nowrap text-gray-500">{dateFmt.format(new Date(e.createdAt))}</td>
                          <td className="px-3 py-3 font-medium text-gray-900">{e.campaign}</td>
                          <td className="px-3 py-3 whitespace-nowrap text-gray-700">{e.channelLabel}</td>
                          <td className="px-3 py-3 font-mono text-xs whitespace-nowrap text-gray-700">{e.source} / {e.medium}</td>
                          <td className="px-3 py-3 font-mono text-xs text-gray-600">{e.content || <span className="text-gray-300">none</span>}</td>
                          <td className="px-3 py-3">
                            <p className="w-56 truncate font-mono text-xs text-gray-600 xl:w-72" title={e.url}>{e.url}</p>
                          </td>
                          <td className="px-3 py-3">{actions(e)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <ul className="flex flex-col gap-3 px-5 py-4 md:hidden">
                {filtered.map((e) => (
                  <li key={e.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{e.campaign}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {e.channelLabel} · {dateFmt.format(new Date(e.createdAt))}
                        </p>
                      </div>
                      {actions(e)}
                    </div>
                    <p className="mt-2 font-mono text-xs text-gray-700">
                      {e.source} / {e.medium}
                      {e.content && <span className="text-gray-500"> · {e.content}</span>}
                    </p>
                    <p className="mt-1.5 break-all font-mono text-xs text-gray-500">{e.url}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </section>
  )
}
