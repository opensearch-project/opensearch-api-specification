/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import InfoFile from 'linter/components/InfoFile'

test('validate()', () => {
  const validator = new InfoFile('./tools/tests/linter/fixtures/_info.yaml')
  expect(validator.validate()).toEqual([
    {
      file: 'fixtures/_info.yaml',
      location: '$schema',
      message: 'JSON Schema is required but not found in this file.'
    }
  ])
})
