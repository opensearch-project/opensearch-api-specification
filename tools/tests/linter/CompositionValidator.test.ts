/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Logger, LogLevel } from 'Logger'
import CompositionValidator from 'linter/CompositionValidator'

const FIXTURE = './tools/tests/linter/fixtures/composition_validator'
const GUIDE = 'CLIENT_GENERATOR_GUIDE.md#schema-composition'

describe('CompositionValidator', () => {
  test('without an allow-list, reports every unclassified union and conflicting allOf properties', () => {
    const validator = new CompositionValidator(FIXTURE, new Logger(LogLevel.error))
    expect(validator.validate()).toEqual([
      {
        file: 'namespaces/_core.yaml',
        location: '#/components/requestBodies/adopt/content/application~1json/schema',
        message: `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`
      },
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/Pet',
        message: `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`
      },
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/Sized',
        message: `allOf members declare property 'size' as both number and string. Client generators can't satisfy both (${GUIDE}).`
      }
    ])
  })

  test('skips allow-listed unions, and reports allow-listed unions that are now classified', () => {
    const validator = new CompositionValidator(FIXTURE, new Logger(LogLevel.error), `${FIXTURE}/allowlist.yaml`)
    expect(validator.validate()).toEqual([
      {
        file: 'namespaces/_core.yaml',
        location: '#/components/requestBodies/adopt/content/application~1json/schema',
        message: `This oneOf/anyOf can't be classified for client generators. Give every branch a title, or add a discriminator (${GUIDE}).`
      },
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/NamedPet',
        message: `This union is now classified. Remove it from ${FIXTURE}/allowlist.yaml (${GUIDE}).`
      },
      {
        file: 'schemas/animals.yaml',
        location: '#/components/schemas/Sized',
        message: `allOf members declare property 'size' as both number and string. Client generators can't satisfy both (${GUIDE}).`
      }
    ])
  })

  test('warns, without failing, about properties next to a composition keyword', () => {
    const logger = new Logger(LogLevel.error)
    const warn = jest.spyOn(logger, 'warn').mockImplementation(() => {})
    new CompositionValidator(FIXTURE, logger, `${FIXTURE}/allowlist.yaml`).validate()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith(`schemas/animals.yaml #/components/schemas/Lookup: properties next to a composition keyword. Write them as an allOf member instead (${GUIDE}).`)
  })
})
