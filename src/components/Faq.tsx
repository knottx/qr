import { ChevronDown } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

const FAQ: FaqItem[] = [
  {
    question: 'Is this QR code generator really free?',
    answer:
      'Yes. There is no sign-up, no watermark, and no limit on how many QR codes you create. Download as many PNG or SVG files as you need for personal or commercial use.',
  },
  {
    question: 'Do the QR codes expire?',
    answer:
      'No. These are static QR codes: your link or text is encoded directly into the pattern, with no redirect service in between. They keep working as long as the content they point to does.',
  },
  {
    question: 'Is my data private?',
    answer:
      'Yes. QR codes are generated locally in your browser. What you type is never uploaded, logged, or sent to any analytics service. Only your theme and style preferences are saved, in your own browser.',
  },
  {
    question: 'Should I download PNG or SVG?',
    answer:
      'Use PNG for websites, documents, and social media. Exports go up to 4096 × 4096 pixels. Use SVG for print, such as posters, packaging, and business cards, because it is a vector format that stays sharp at any size.',
  },
  {
    question: 'Which error correction level should I choose?',
    answer:
      'Error correction lets a QR code scan even when part of it is damaged or covered. Low (L) recovers about 7% of the code, Medium (M) 15%, Quartile (Q) 25%, and High (H) 30%. Higher levels are more robust but make the code denser. Quartile is a good default; choose High for codes that will be printed outdoors or get worn.',
  },
  {
    question: 'How much text can a QR code hold?',
    answer:
      'Up to 2,953 bytes at the Low error correction level, and less at higher levels. Short content makes a simpler code that scans faster, so for long URLs consider using a shorter link.',
  },
  {
    question: 'Why won’t my custom QR code scan?',
    answer:
      'Most scanning problems come from low contrast. Keep the foreground clearly darker than the background, avoid inverted (light on dark) colors, and leave a quiet margin around the code. The generator warns you when your colors may cause trouble.',
  },
]

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="mt-12 sm:mt-16">
      <h2 id="faq-title" className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
        Frequently asked questions
      </h2>
      <div className="theme-transition mt-5 divide-y divide-border rounded-2xl border border-border bg-surface">
        {FAQ.map(({ question, answer }) => (
          <details key={question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium sm:px-6 [&::-webkit-details-marker]:hidden">
              <h3>{question}</h3>
              <ChevronDown
                className="size-4 shrink-0 text-fg-subtle transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-relaxed text-pretty text-fg-muted sm:px-6">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
