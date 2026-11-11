// Server component: renders one or more JSON-LD blocks. Escapes "<" so data can never close the script tag.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, '\u003c') }} />
      ))}
    </>
  );
}
