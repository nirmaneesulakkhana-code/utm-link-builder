import type { ChannelId, MetaPlatform } from './channels'

export interface HistoryEntry {
  id: string
  createdAt: string
  landingUrl: string
  channelId: ChannelId
  channelLabel: string
  metaPlatform?: MetaPlatform
  source: string
  medium: string
  campaign: string
  content: string
  term: string
  url: string
}

const KEY = 'utm-builder.history.v1'

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    // Storage unavailable (private mode or quota). History stays in memory for this visit.
  }
}

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
}

export function historyToCsv(entries: HistoryEntry[]): string {
  const header = ['Date', 'Channel', 'Landing URL', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'Tracking URL']
  const rows = entries.map((e) => [
    new Date(e.createdAt).toISOString(),
    e.channelLabel,
    e.landingUrl,
    e.source,
    e.medium,
    e.campaign,
    e.content,
    e.term,
    e.url,
  ])
  return [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\n')
}
