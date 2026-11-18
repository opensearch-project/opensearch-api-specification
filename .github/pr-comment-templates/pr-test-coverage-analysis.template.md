## Spec Test Coverage Analysis
{{with .test_coverage}}

| Total                        | Tested                                                        |
|------------------------------|---------------------------------------------------------------|
| {{.total_operations_count}}  | {{.evaluated_operations_count}} ({{.evaluated_paths_pct}} %)  |

{{end}}