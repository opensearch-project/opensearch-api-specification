/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from 'lodash'
import ClientModelBuilder from './ClientModelBuilder'
import { type ClientModel, MODEL_FORMAT, MODEL_VERSION } from './ClientModel'

export const MODEL_KEY = 'x-model'

// Writes the resolved client model into the bundled spec, next to the JSON Schema it is built from, so that the one
// published spec carries it and a generator reads fields and constraints instead of interpreting $ref/allOf/oneOf/anyOf:
// - every component schema gets `x-model`: its model entry (`type_kind`, `fields`, `constraints`, ...)
// - every response and request body component with a body gets `x-model`: the body's `media_type` and `type`
// - `components` gets `x-model`: the model `format` and `version`
// The schemas themselves are not changed, so the spec stays valid OpenAPI for validators, the spec tester and the
// generators that read JSON Schema. See "Client Model" in CLIENT_GENERATOR_GUIDE.md.
export default class ModelAnnotator {
  // Builds the model of a merged, normalized and labeled spec and writes it into the spec. Returns the model.
  annotate (spec: Record<string, any>): ClientModel {
    ModelAnnotator.strip(spec) // a model from an earlier run (before version extraction) may be stale
    const model = new ClientModelBuilder(spec).build()
    const components = spec.components as Record<string, any>
    for (const [name, entry] of Object.entries(model.types)) {
      if (_.isPlainObject(components.schemas?.[name])) components.schemas[name][MODEL_KEY] = entry
    }
    for (const [section, bodies] of [['responses', model.responses], ['requestBodies', model.request_bodies]] as const) {
      for (const [name, body] of Object.entries(bodies)) {
        if (_.isPlainObject(components[section]?.[name])) components[section][name][MODEL_KEY] = body
      }
    }
    components[MODEL_KEY] = { format: MODEL_FORMAT, version: MODEL_VERSION }
    return model
  }

  static strip (spec: Record<string, any>): void {
    const components = (spec.components ?? {}) as Record<string, any>
    delete components[MODEL_KEY]
    for (const section of ['schemas', 'responses', 'requestBodies']) {
      for (const component of Object.values((components[section] ?? {}) as Record<string, any>)) {
        if (_.isPlainObject(component)) delete component[MODEL_KEY]
      }
    }
  }
}
