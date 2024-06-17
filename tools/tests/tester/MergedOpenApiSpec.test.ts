/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger } from 'Logger'
import MergedOpenApiSpec from "tester/MergedOpenApiSpec"

const spec = new MergedOpenApiSpec('tools/tests/tester/fixtures/specs/complete', new Logger())

test('adds additionalProperties when not present', () => {
  const responses: any = spec.spec().components?.responses
  const schema = responses['info@200'].content['application/json'].schema  
  expect(schema.additionalProperties).toEqual({ not: true, errorMessage: 'property is not defined in the spec' })
})

test('does not add additionalProperties when present', () => {
  const responses: any = spec.spec().components?.responses
  const schema = responses['info@201'].content['application/json'].schema  
  expect(schema.additionalProperties).toEqual(true)
})
