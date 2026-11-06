export type ChannelId = 'google_search' | 'meta' | 'email' | 'whatsapp' | 'chatgpt'

export type MetaPlatform = 'facebook' | 'instagram'

export interface Channel {
  id: ChannelId
  label: string
  source: string
  medium: string
  /** Shown under the channel dropdown when selected. */
  note?: string
}

export const CHANNELS: Channel[] = [
  { id: 'google_search', label: 'Google Ads Search', source: 'google', medium: 'cpc' },
  { id: 'meta', label: 'Meta Ads', source: 'facebook', medium: 'paid_social' },
  { id: 'email', label: 'Email Marketing', source: 'newsletter', medium: 'email' },
  { id: 'whatsapp', label: 'WhatsApp Marketing', source: 'whatsapp', medium: 'messaging' },
  {
    id: 'chatgpt',
    label: 'ChatGPT Ads',
    source: 'chatgpt',
    medium: 'paid_ai',
    note:
      'Provisional naming convention. "chatgpt / paid_ai" is an internal standard, not an official tracking specification from OpenAI. Review it once official guidance is published.',
  },
]

export const META_PLATFORMS: { id: MetaPlatform; label: string }[] = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
]

export function getChannel(id: string): Channel | undefined {
  return CHANNELS.find((c) => c.id === id)
}

export function sourceFor(channel: Channel, platform: MetaPlatform): string {
  return channel.id === 'meta' ? platform : channel.source
}
