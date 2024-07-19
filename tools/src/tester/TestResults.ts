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

export default class TestResults {
  protected _spec: MergedOpenApiSpec
  protected _evaluations: StoryEvaluations

  constructor(spec: MergedOpenApiSpec, evaluations: StoryEvaluations) {
    this._spec = spec
    this._evaluations = evaluations
  }

  evaluated_paths_count(): number {
    return _.uniq(_.compact(_.flatten(_.map(this._evaluations.evaluations, (evaluation) =>
      _.map(evaluation.chapters, (chapter) => chapter.path)
    )))).length
  }

  spec_paths_count(): number {
    return Object.values(this._spec.paths()).reduce((acc, methods) => acc + methods.length, 0);
  }
}
