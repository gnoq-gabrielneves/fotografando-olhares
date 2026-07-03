import { formatIsoDateToBrazilian } from "@/shared/lib/format/date";
import { devblogPosts, devblogStats } from "../lib/devblog-posts";

export function DevblogTimeline() {
  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {devblogStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300"
            >
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                <Icon className="size-4 text-cyan-600" />
                {stat.label}
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-800">
            Histórico de mudanças
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Registro interno das entregas relevantes do sistema.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {devblogPosts.map((post) => {
            const Icon = post.icon;

            return (
              <article
                key={post.version}
                className="grid gap-5 px-5 py-6 transition-colors hover:bg-slate-50/70 lg:grid-cols-[180px_minmax(0,1fr)]"
              >
                <aside className="space-y-2">
                  <div className="inline-flex items-center rounded-md border border-cyan-100 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                    v{post.version}
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {formatIsoDateToBrazilian(post.date)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </aside>

                <div className="min-w-0 space-y-5">
                  <div className="flex gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-cyan-100 bg-cyan-50 text-cyan-700">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    {post.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-lg border border-slate-200 bg-white p-3 text-sm leading-5 text-slate-600"
                      >
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    {post.details.map((detail) => (
                      <div
                        key={detail.title}
                        className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                      >
                        <h4 className="text-sm font-semibold text-slate-800">
                          {detail.title}
                        </h4>
                        <ul className="mt-3 space-y-2">
                          {detail.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-6 text-slate-600"
                            >
                              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
