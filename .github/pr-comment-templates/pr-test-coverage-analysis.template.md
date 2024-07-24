## Spec Test Coverage Analysis
{{with .test_coverage}}

| Total             | Tested                                                   |
|-------------------|----------------------------------------------------------|
| {{.paths_count}}  | {{.evaluated_paths_count}} ({{.evaluated_paths_pct}} %)  |

{{end}}