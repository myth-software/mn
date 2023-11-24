# concepts

schematics generate code. the code is placed into a source directory. currently the source directory is unsafely overwritten, meaning any custom files are destroyed each time a schematic is run. schematics are configured in the config file.

```json title="mn.json (schematics excerpt)
{
  "schematics": [
    {
      "name": "schema",

      "outDir": "packages/domain-injury-schema/src"
    }
  ]
}
```
