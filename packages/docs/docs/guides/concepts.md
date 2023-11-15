# concepts

schematics generate code. the code is placed into a source directory. currently the source directory is unsafely overwritten, meaning any custom files are destroyed each time a schematic is run. schematics are configured in the config file.

```json title=".mountnotion.config.json (schematics excerpt)
{
  "schematics": [
    {
      "name": "caches",
      "options": {
        "basic": {
          "pageId": "b58cb937-0b25-4bea-802e-c89d40f5c7c9",
          "outDir": "packages/domain-injury-caches/src"
        }
      }
    }
  ]
}
```
