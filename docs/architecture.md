# Architecture

The source tree is organized around three stable boundaries:

- `src/app`: Next.js App Router routes, layouts and route-level metadata.
- `src/features`: product modules and business workflows. A feature owns its components, hooks, services, schemas and local types when they are specific to that feature.
- `src/shared`: reusable application primitives used by multiple features, including UI components, layout shell, hooks, Supabase/query helpers, services and shared domain types.

The product should evolve as a modular clinical platform. Generic workflows live in core features such as patients, users, organizations, activity, reports and training. Specialty-specific behavior should be isolated behind module registries or feature modules. The current clinical module is `oftalmo`, declared in `src/shared/lib/modules/clinical-modules.ts`.

Shared domain types live in `src/shared/types`. Prefer exported unions derived from `as const` arrays for product vocabularies such as roles, statuses and clinical result labels.

Imports should use explicit boundaries:

```ts
import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/lib/query/keys";
import type { ResultadoRD, UserRole } from "@/shared/types";
```

Avoid adding new global code outside `app`, `features` or `shared`.

When adding another specialty, prefer introducing a module-specific layer instead of expanding generic patient fields with specialty-only concepts. For example, cardiology or dermatology findings should not be added directly to the patient core unless they are universally useful across specialties.
