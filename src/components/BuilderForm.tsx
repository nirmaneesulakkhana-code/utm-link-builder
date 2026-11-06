import { Info, RotateCcw } from 'lucide-react'
import { CHANNELS, META_PLATFORMS, type ChannelId, type MetaPlatform } from '../lib/channels'
import { Field, inputClass } from './Field'

export interface FormState {
  landingUrl: string
  channelId: ChannelId | ''
  metaPlatform: MetaPlatform
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

export type FormErrors = Partial<Record<keyof FormState, string | null>>

interface Props {
  form: FormState
  errors: FormErrors
  enforceConvention: boolean
  onEnforceChange: (v: boolean) => void
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onChannelChange: (id: ChannelId | '') => void
  onPlatformChange: (p: MetaPlatform) => void
  onBlur: (key: keyof FormState) => void
  onReset: () => void
}

export function BuilderForm({
  form,
  errors,
  enforceConvention,
  onEnforceChange,
  onChange,
  onChannelChange,
  onPlatformChange,
  onBlur,
  onReset,
}: Props) {
  const channel = CHANNELS.find((c) => c.id === form.channelId)

  const text = (key: 'source' | 'medium' | 'campaign' | 'content' | 'term', placeholder: string) => (
    <input
      id={key}
      type="text"
      value={form[key]}
      placeholder={placeholder}
      autoComplete="off"
      spellCheck={false}
      aria-invalid={!!errors[key]}
      aria-describedby={errors[key] ? `${key}-error` : `${key}-hint`}
      className={inputClass(!!errors[key])}
      onChange={(e) => onChange(key, e.target.value)}
      onBlur={() => onBlur(key)}
    />
  )

  return (
    <section aria-labelledby="builder-title" className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
        <div>
          <h2 id="builder-title" className="text-base font-semibold text-gray-900">UTM Link Builder</h2>
          <p className="mt-0.5 text-sm text-gray-500">Pick a channel and the source and medium fill in for you.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset
        </button>
      </div>

      <form className="grid gap-5 px-5 py-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="sm:col-span-2">
          <Field id="landingUrl" label="Landing Page URL" required error={errors.landingUrl} hint="The full page address people land on, including https://">
            <input
              id="landingUrl"
              type="url"
              inputMode="url"
              value={form.landingUrl}
              placeholder="https://example.com/products"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={!!errors.landingUrl}
              className={inputClass(!!errors.landingUrl)}
              onChange={(e) => onChange('landingUrl', e.target.value)}
              onBlur={() => onBlur('landingUrl')}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field id="channelId" label="Marketing Channel" required error={errors.channelId}>
            <select
              id="channelId"
              value={form.channelId}
              aria-invalid={!!errors.channelId}
              className={inputClass(!!errors.channelId) + ' appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27none%27 stroke=%27%236b7280%27 stroke-width=%272%27%3E%3Cpath d=%27m4 6 4 4 4-4%27/%3E%3C/svg%3E")] bg-[position:right_0.75rem_center] bg-no-repeat pr-9'}
              onChange={(e) => onChannelChange(e.target.value as ChannelId | '')}
              onBlur={() => onBlur('channelId')}
            >
              <option value="">Select a channel</option>
              {CHANNELS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          {channel?.id === 'meta' && (
            <fieldset className="mt-3">
              <legend className="mb-2 text-sm font-medium text-gray-800">
                Platform <span className="ml-1 text-xs font-normal text-gray-400">Optional</span>
              </legend>
              <div className="inline-flex rounded-lg border border-gray-300 p-0.5">
                {META_PLATFORMS.map((p) => {
                  const active = form.metaPlatform === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onPlatformChange(p.id)}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium ${active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      {p.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {channel?.note && (
            <div className="mt-3 flex gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <Info className="mt-px h-4 w-4 shrink-0" aria-hidden />
              <p>{channel.note}</p>
            </div>
          )}
        </div>

        <Field id="source" label="UTM Source" required error={errors.source} hint="Where the traffic comes from. Auto filled, editable.">
          {text('source', 'google')}
        </Field>

        <Field id="medium" label="UTM Medium" required error={errors.medium} hint="The type of traffic. Auto filled, editable.">
          {text('medium', 'cpc')}
        </Field>

        <div className="sm:col-span-2">
          <Field id="campaign" label="UTM Campaign" required error={errors.campaign} hint="Example: november_2026_promotion">
            {text('campaign', 'november_2026_promotion')}
          </Field>
        </div>

        <Field id="content" label="UTM Content" error={errors.content} hint="Identifies the creative, ad or placement.">
          {text('content', 'carousel_ad_01')}
        </Field>

        <Field id="term" label="UTM Term" error={errors.term} hint="Paid keyword or audience segment.">
          {text('term', 'fitness_enthusiasts')}
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 sm:col-span-2">
          <input
            type="checkbox"
            checked={enforceConvention}
            onChange={(e) => onEnforceChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm">
            <span className="font-medium text-gray-800">Enforce naming convention</span>
            <span className="block text-xs text-gray-500">
              Lowercase, spaces and hyphens become underscores, special characters removed. "Summer Sale" becomes summer_sale, so your analytics reports stay clean.
            </span>
          </span>
        </label>
      </form>
    </section>
  )
}
