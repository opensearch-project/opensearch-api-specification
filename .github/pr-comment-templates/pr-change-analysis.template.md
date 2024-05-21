# Changes Analysis

**Commit SHA:** {{.after_sha}}
**Comparing To SHA:** {{.before_sha}}

## API Changes

### Summary
{{.api_changes_summary}}

### Report
The full API changes report is available at: {{.api_changes_report_url}}

## API Coverage
{{with .api_coverage}}

|               | Before                                              | After                                             | Δ                                                 |
|--------------:|-----------------------------------------------------|---------------------------------------------------|---------------------------------------------------|
|   Covered (%) | {{.before.covered}} ({{.before.covered_pct}} %)     | {{.after.covered}} ({{.after.covered_pct}} %)     | {{.covered_delta}} ({{.covered_pct_delta}} %)     |
| Uncovered (%) | {{.before.uncovered}} ({{.before.uncovered_pct}} %) | {{.after.uncovered}} ({{.after.uncovered_pct}} %) | {{.uncovered_delta}} ({{.uncovered_pct_delta}} %) |
|       Unknown | {{.before.specified_but_not_provided}}              | {{.after.specified_but_not_provided}}             | {{.specified_but_not_provided_delta}}             |

{{end}}