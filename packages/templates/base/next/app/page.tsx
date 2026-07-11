export default function Home() {
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">BaseForge project</p>
        <h1>{{projectName}}</h1>
        <p className="description">
          Your generated Next.js app is ready. Start building from this clean App Router
          foundation.
        </p>
      </section>
    </main>
  );
}
