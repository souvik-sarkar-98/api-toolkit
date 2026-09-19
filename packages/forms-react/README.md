# `@ssdev-toolkit/forms-react`

React renderer for `@ssdev-toolkit/forms-core`: hook, form component, and optional Bootstrap / Zod / unstyled entry points.

## Install

```bash
npm install @ssdev-toolkit/forms-core @ssdev-toolkit/forms-react
```

**Peers:** `react` and `react-dom` (^18 or ^19). Optional: `react-hook-form` (^7), `zod` (^3 or ^4).

## Entry points

| Import | Purpose |
|--------|---------|
| `@ssdev-toolkit/forms-react` | `CustomForm`, `useCustomForm`, `createCustomFormResolver` |
| `@ssdev-toolkit/forms-react/unstyled` | Headless field components (bring your own markup) |
| `@ssdev-toolkit/forms-react/bootstrap` | Bootstrap preset + class names |
| `@ssdev-toolkit/forms-react/bootstrap.css` | Preset stylesheet (import in the host app) |
| `@ssdev-toolkit/forms-react/zod` | Zod helpers for the definition |

Override look-and-feel with the `components` and `classNames` props; you do not have to use Bootstrap.

## Usage

```tsx
import { CustomForm } from '@ssdev-toolkit/forms-react';
import { createPublicBootstrapFormComponents } from '@ssdev-toolkit/forms-react/bootstrap';
import '@ssdev-toolkit/forms-react/bootstrap.css';

<CustomForm
  definition={definition}
  initialValues={{}}
  components={createPublicBootstrapFormComponents()}
  onSubmit={async (values) => {
    await save(values);
  }}
/>
```

Headless:

```tsx
import { useCustomForm } from '@ssdev-toolkit/forms-react';

const form = useCustomForm({ definition, initialValues });
form.setValue('email', value);
const { valid } = form.validate();
```

## Build (this repo)

```bash
npm run build -w @ssdev-toolkit/forms-react
```

Fixed version group with `forms-core` and `forms-angular`. Overview: [root README](../../README.md).
