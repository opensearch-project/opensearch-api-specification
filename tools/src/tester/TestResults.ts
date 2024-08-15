/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from "lodash";
import MergedOpenApiSpec from "./MergedOpenApiSpec";
import { Operation, StoryEvaluations } from "./types/eval.types";
import { SpecTestCoverage } from "./types/test.types";
import { write_json } from "../helpers";

export default class TestResults {
  protected _spec: MergedOpenApiSpec
  protected _evaluations: StoryEvaluations
  protected _evaluated_operations?: Operation[]
  protected _unevaluated_operations?: Operation[]
  protected _operations?: Operation[]

  constructor(spec: MergedOpenApiSpec, evaluations: StoryEvaluations) {
    this._spec = spec
    this._evaluations = evaluations
  }

  evaluated_operations(): Operation[] {
    if (this._evaluated_operations !== undefined) return this._evaluated_operations
    this._evaluated_operations = _.uniq(_.compact(_.flatMap(this._evaluations.evaluations, (evaluation) =>
      _.map(evaluation.chapters, (chapter) => chapter.operation)
    )))
    return this._evaluated_operations
  }

  unevaluated_operations(): Operation[] {
    if (this._unevaluated_operations !== undefined) return this._unevaluated_operations
    this._unevaluated_operations = this.operations().filter((operation) =>
      !_.find(this.evaluated_operations(),
        (op) =>
          operation.method == op.method &&
          operation.path == op.path
      )
    )
    return this._unevaluated_operations
  }

  operations(): Operation[] {
    if (this._operations !== undefined) return this._operations
    this._operations = _.uniq(Object.entries(this._spec.paths()).flatMap(([path, path_item]) => {
      return Object.values(path_item).map((method) => {
        return { method: method.toUpperCase(), path }
      })
    }))

    return this._operations
  }

  test_coverage(): SpecTestCoverage {
    return {
      evaluated_operations_count: this.evaluated_operations().length,
      total_operations_count: this.operations().length,
      evaluated_paths_pct: this.operations().length > 0 ? Math.round(
        this.evaluated_operations().length / this.operations().length * 100 * 100
      ) / 100 : 0,
    }
  }

  write_coverage(file_path: string): void {
    write_json(file_path, this.test_coverage())
  }
}
