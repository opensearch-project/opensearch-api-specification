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
import { StoryEvaluations } from "./types/eval.types";
import { SpecTestCoverage } from "./types/test.types";
import { write_json } from "../helpers";

export default class TestResults {
  protected _spec: MergedOpenApiSpec
  protected _evaluations: StoryEvaluations
  protected _evaluated_paths?: string[]
  protected _unevaluated_paths?: string[]
  protected _spec_paths?: string[]

  constructor(spec: MergedOpenApiSpec, evaluations: StoryEvaluations) {
    this._spec = spec
    this._evaluations = evaluations
  }

  evaluated_paths(): string[] {
    if (this._evaluated_paths !== undefined) return this._evaluated_paths
    this._evaluated_paths = _.uniq(_.compact(_.flatten(_.map(this._evaluations.evaluations, (evaluation) =>
      _.map(evaluation.chapters, (chapter) => chapter.path)
    ))))
    return this._evaluated_paths
  }

  unevaluated_paths(): string[] {
    if (this._unevaluated_paths !== undefined) return this._unevaluated_paths
    this._unevaluated_paths = this.spec_paths().filter((path => !this.evaluated_paths().includes(path)))
    return this._unevaluated_paths
  }

  spec_paths(): string[] {
    if (this._spec_paths !== undefined) return this._spec_paths
    this._spec_paths = _.uniq(Object.entries(this._spec.paths()).flatMap(([path, path_item]) => {
      return Object.values(path_item).map((method) => `${method.toUpperCase()} ${path}`)
    }))

    return this._spec_paths
  }

  test_coverage(): SpecTestCoverage {
    return {
      evaluated_paths_count: this.evaluated_paths().length,
      paths_count: this.spec_paths().length,
      evaluated_paths_pct: this.spec_paths().length > 0 ? Math.round(
        this.evaluated_paths().length / this.spec_paths().length * 100 * 100
      ) / 100 : 0,
    }
  }

  write_coverage(file_path: string): void {
    write_json(file_path, this.test_coverage())
  }
}
