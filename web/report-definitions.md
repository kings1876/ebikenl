# Report definitions

Saved by the report-builder skill. Rerun a report by name ("run the blog report") without re-describing it.

### Blog post report
Created:   2026-11-28
Last run:  2026-11-28
Cadence:   one-off per published batch (run after every blog post or batch goes live)

```
Report name:  Blog post report
Cadence:      per published batch
Period:       publish date of the batch through the run date
Comparison:   none on first run; on reruns, versus the previous run for the same posts
Grouping:     post (slug), batches labelled by publish date

Metrics:
  Post URL              =  https://ebike-te-koop.nl/blog/<slug>                      [post front matter]
  Primary keyword       =  front matter `keyword`                                     [post front matter]
  Supporting keywords   =  front matter `secondary` (all of them)                     [post front matter]
  Search volume         =  monthly NL volume per keyword, only where listed           [seo/KEYWORD-PLAN.md (Semrush)]
  Live / sitemap        =  HTTP status of the post, listed in sitemap.xml             [live site, verify-html.mjs]
  Submissions           =  IndexNow response, Google + Bing sitemap resubmit result   [IndexNow API, GSC, Bing WMT]
  Content checks        =  words, images, order cards, quote form, text ratio, Lighthouse SEO   [verify.mjs, Lighthouse]
  Clicks / impressions  =  per post URL                                               [Google Search Console]
  Quote enquiries       =  enquiries of kind 'quote' whose source is the post path    [/admin dashboard (Upstash)]

Sources:      post front matter, seo/KEYWORD-PLAN.md, live site, IndexNow, Google Search Console, Bing Webmaster Tools, /admin enquiries
Notes:        Pass the post slugs and publish date as the skill arguments.
              Any number without data is written "n/a" with its source named. Never estimate traffic or leads.
              Search volume shows demand only, never expected traffic.
              Lead with a chat summary (three findings max), then the house-style report page, plus an XLSX workbook
              (tabs: Summary, Keywords, Distribution, Content, Raw data).
```

Runs:
  2026-11-28: kleine-elektrische-fiets-kopen, sportieve-elektrische-fiets-kopen (batch 2026-11-28), plus the unreported batch
  2026-11-26 (lichtgewicht-elektrische-fiets-kopen, elektrische-fiets-met-riemaandrijving-kopen).
  Page: https://claude.ai/artifact/G5umgf8CcFU8RwPPnVij2P. Workbook: web/reports/blog-report-2026-11-28.xlsx.
