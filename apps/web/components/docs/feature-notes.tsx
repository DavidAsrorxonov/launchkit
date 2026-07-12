import { CodeBlock } from "@/components/docs/code-block";
import { features } from "@/components/docs/feature-notes-data";

export function FeatureNotes() {
  return (
    <div className="grid gap-4">
      {features.map((feature) => (
        <article
          key={feature.title}
          className="rounded-lg border border-border bg-card p-5"
        >
          <h3 className="text-base font-semibold text-foreground">
            {feature.title}
          </h3>
          <p className="mt-2 text-foreground">{feature.summary}</p>
          <ul className="mt-3 space-y-2">
            {feature.body.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {feature.examples ? (
            <div className="mt-4 space-y-3">
              {feature.examples.map((example) => (
                <div key={example.title}>
                  <h4 className="text-sm font-semibold text-foreground">
                    {example.title}
                  </h4>
                  <div className="mt-2">
                    <CodeBlock language={example.language}>
                      {example.code}
                    </CodeBlock>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
