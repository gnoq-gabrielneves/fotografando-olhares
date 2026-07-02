# Architecture

The source tree is organized around three stable boundaries:

- `src/app`: Next.js App Router routes, layouts and route-level metadata.
- `src/features`: product modules and business workflows. A feature owns its components, hooks, services, schemas and local types when they are specific to that feature.
- `src/shared`: reusable application primitives used by multiple features, including UI components, layout shell, hooks, Supabase/query helpers, services and shared domain types.

Shared domain types live in `src/shared/types`. Prefer exported unions derived from `as const` arrays for product vocabularies such as roles, statuses and clinical result labels.

Imports should use explicit boundaries:

```ts
import { Button } from "@/shared/components/ui/button";
import { queryKeys } from "@/shared/lib/query/keys";
import type { ResultadoRD, UserRole } from "@/shared/types";
```

Avoid adding new global code outside `app`, `features` or `shared`.
