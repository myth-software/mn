# @mount-notion/sdk

## install

```bash
# npm
npm i -S @mount-notion/sdk

# yarn
yarn add @mount-notion/sdk
```

## overview

**summary**  
notion api responses are EXTREMELY deeply nested. sdk provides simple flattening of notion responses and simple expansion of properties. beyond that, it exports a wrapper around the notion api for easy configuration.

### example usage

```typescript
import {
  flattenPageResponse,
  expandProperties,
  notion,
} from '@mount-notion/sdk';

const page = await notion.pages.retrieve({
  page_id,
});

const [person, PROPERTIES] = flattenPageResponse<People>(page);

const properties = expandProperties<People>(person, {
  properties: PROPERTIES,
});

const updatedPerson = await notion.pages.update(
  {
    page_id,
    properties,
  },
  { flattenResponse: true }
);
```
