'use client';

// Customer-service pages: plain, readable text pages. A client component on purpose: the text then travels once as
// props instead of a second time as a server-rendered tree in the framework payload (see ProductFaq), which keeps the
// text-to-HTML ratio of these text-only pages above 10%. The data comes in as props from the route.
import NextLink from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { ServicePage } from '@/data/service';

const EMAIL = 'verkoop@e-bike-tekoop.nl';

export type Topic = { slug: string; label: string; description: string };
export type Qa = { q: string; a: string; slug?: string };

export function ServiceTopics({ topics, current }: { topics: Topic[]; current?: string }) {
  const cur = (is: boolean) => (is ? ({ 'aria-current': 'page' } as const) : {});
  return (
    <nav aria-label="Klantenservice onderwerpen" className="svc-nav">
      <h2>Onderwerpen</h2>
      <ul>
        <li>
          <NextLink prefetch={false} href="/klantenservice" {...cur(current === undefined)}>
            Klantenservice
          </NextLink>
        </li>
        {topics.map((p) => (
          <li key={p.slug}>
            <NextLink prefetch={false} href={`/klantenservice/${p.slug}`} {...cur(current === p.slug)}>
              {p.label}
            </NextLink>
          </li>
        ))}
        <li>
          <NextLink prefetch={false} href="/contact">
            Contact
          </NextLink>
        </li>
      </ul>
    </nav>
  );
}

function Prose({ page, qa }: { page: ServicePage; qa: Qa[] }) {
  return (
    <div className="svc">
      {page.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.p?.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {s.ol && (
            <ol>
              {s.ol.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          )}
          {s.ul && (
            <ul>
              {s.ul.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {qa.length > 0 && (
        <section>
          <h2>Veelgestelde vragen</h2>
          <dl>
            {qa.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

export function ServicePageView({ page, qa, topics }: { page: ServicePage; qa: Qa[]; topics: Topic[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Klantenservice', path: '/klantenservice' }, { label: page.label }]} />
      <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <article className="max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{page.title}</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">{page.intro}</p>
          <div className="mt-8">
            <Prose page={page} qa={qa} />
          </div>
          <p className="mt-10 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            Staat je vraag er niet bij? Mail ons op{' '}
            <a className="font-semibold text-blue-700 underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>{' '}
            of gebruik het{' '}
            <NextLink prefetch={false} href="/contact" className="font-semibold text-blue-700 underline">
              contactformulier
            </NextLink>
            .
          </p>
        </article>
        <aside>
          <ServiceTopics topics={topics} current={page.slug} />
        </aside>
      </div>
    </div>
  );
}

export function ServiceHome({ faq, topics }: { faq: Qa[]; topics: Topic[] }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'Klantenservice' }]} />
      <div className="mt-2 grid gap-8 lg:grid-cols-[1fr_16rem]">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Klantenservice: waarmee kunnen we je helpen?</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Hier vind je antwoorden over bestellen, betalen, bezorgen, retourneren en garantie, plus onze voorwaarden en privacyverklaring. Kom je er niet uit? Mail ons, dan helpen we je verder.
          </p>
          <div className="svc mt-8">
            <section>
              <h2>Meestgestelde vragen</h2>
              <dl>
                {faq.map((f) => (
                  <div key={f.q}>
                    <dt>{f.q}</dt>
                    <dd>
                      {f.a}{' '}
                      <NextLink prefetch={false} href={`/klantenservice/${f.slug}`}>
                        Lees meer
                      </NextLink>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <h2>Zoek op onderwerp</h2>
              <dl>
                {topics.map((p) => (
                  <div key={p.slug}>
                    <dt>
                      <NextLink prefetch={false} href={`/klantenservice/${p.slug}`}>
                        {p.label}
                      </NextLink>
                    </dt>
                    <dd>{p.description}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <h2>Zo werkt het in het kort</h2>
              <ol>
                <li>Kies een e-bike en reken af zonder account.</li>
                <li>Je ontvangt een bevestiging en de betaalgegevens per e-mail.</li>
                <li>Na ontvangst van je betaling bevestigen we de levertijd.</li>
                <li>We bezorgen gratis in heel Nederland, rijklaar of in de fabrieksdoos.</li>
              </ol>
            </section>
            <section>
              <h2>Bedrijfsgegevens</h2>
              <p>
                EBIKE TE KOOP, ebike-te-koop.nl, e-mail {EMAIL}. Kamer van Koophandel: 84920194. Btw-nummer: NL863492810B01. Lees ook onze{' '}
                <NextLink prefetch={false} href="/klantenservice/algemene-voorwaarden">
                  algemene voorwaarden
                </NextLink>{' '}
                en de{' '}
                <NextLink prefetch={false} href="/klantenservice/privacy">
                  privacyverklaring
                </NextLink>
                .
              </p>
            </section>
            <section>
              <h2>Contact</h2>
              <p>
                Mail ons op <a href={`mailto:${EMAIL}`}>{EMAIL}</a> en vermeld je ordernummer als je een vraag hebt over een bestelling, of gebruik het{' '}
                <NextLink prefetch={false} href="/contact">
                  contactformulier
                </NextLink>
                .
              </p>
            </section>
          </div>
        </div>
        <aside>
          <ServiceTopics topics={topics} />
        </aside>
      </div>
    </div>
  );
}
