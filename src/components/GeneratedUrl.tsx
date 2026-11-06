import { Check, Copy, Link2, Save } from 'lucide-react'

interface Props {
  url: string | null
  missing: string[]
  params: [string, string][]
  copied: boolean
  saved: boolean
  onCopy: () => void
  onSave: () => void
}

export function GeneratedUrl({ url, missing, params, copied, saved, onCopy, onSave }: Props) {
  return (
    <section aria-labelledby="output-title" className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 id="output-title" className="text-base font-semibold text-gray-900">Generated URL</h2>
        <p className="mt-0.5 text-sm text-gray-500">Updates as you type. Copying a link also saves it to history.</p>
      </div>

      <div className="px-5 py-5">
        {url ? (
          <>
            <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-3">
              <p className="break-all font-mono text-sm leading-relaxed text-gray-900" aria-live="polite">{url}</p>
            </div>

            <dl className="mt-3 flex flex-wrap gap-1.5">
              {params.map(([k, v]) => (
                <div key={k} className="inline-flex max-w-full items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs">
                  <dt className="text-gray-500">{k}</dt>
                  <dd className="truncate font-medium text-gray-800">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={onCopy}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              >
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? 'Copied' : 'Copy URL'}
              </button>
              <button
                type="button"
                onClick={onSave}
                disabled={saved}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-default disabled:text-gray-400 disabled:hover:bg-white"
              >
                {saved ? <Check className="h-4 w-4" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
                {saved ? 'Saved to history' : 'Save to history'}
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
            <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
            <div>
              <p className="font-medium text-gray-700">Your tracking URL will appear here.</p>
              {missing.length > 0 && <p className="mt-1">Still needed: {missing.join(', ')}.</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
