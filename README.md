# UTM Link Builder

Generates standardized campaign tracking URLs for marketing teams. React + TypeScript + Tailwind CSS + Lucide. No backend; history lives in the browser's localStorage.

## Run

    npm install
    npm run dev      # local dev server
    npm run build    # production build in dist/

## Channel presets

| Channel | utm_source | utm_medium |
|---|---|---|
| Google Ads Search | google | cpc |
| Meta Ads | facebook / instagram | paid_social |
| Email Marketing | newsletter | email |
| WhatsApp Marketing | whatsapp | messaging |
| ChatGPT Ads (provisional) | chatgpt | paid_ai |

Edit presets in `src/lib/channels.ts`.

## Behaviour notes

- Landing URL must be http or https. Existing query params and #anchors are kept; any old utm_* params are replaced.
- "Enforce naming convention" (on by default) lowercases values and turns spaces/hyphens into underscores.
- Copy URL also saves to history (duplicates skipped). History supports search, channel filter, reuse, delete, and CSV export.
