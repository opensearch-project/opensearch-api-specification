/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { OutputReference } from "tester/OutputReference";

describe('OutputReference', () => {
  let f = (id: any, k: any): string => `[${id}:${k}]`

  describe('parse', () => {
    it('replaces', () => {
      expect(OutputReference.parse('string')).toEqual([])
      expect(OutputReference.parse('${k.v}')).toEqual([new OutputReference('k', 'v')])
      expect(OutputReference.parse('${k.value}')).toEqual([new OutputReference('k', 'value')])
      expect(OutputReference.parse('${k.v.m}')).toEqual([new OutputReference('k', 'v.m')])
      expect(OutputReference.parse('A reference to ${k.v.m} and ${x.y}.')).toEqual([
        new OutputReference('k', 'v.m'),
        new OutputReference('x', 'y')
      ])
    })
  })

  describe('replace', () => {
    it('replaces', () => {
      expect(OutputReference.replace('string', f)).toEqual('string')
      expect(OutputReference.replace('${k.v}', f)).toEqual('[k:v]')
      expect(OutputReference.replace('${k.value}', f)).toEqual('[k:value]')
      expect(OutputReference.replace('${k.v.m}', f)).toEqual('[k:v.m]')
      expect(OutputReference.replace('A reference to ${k.v.m} and ${x} and ${x.y}.', f)).toEqual(
        'A reference to [k:v.m] and [x:undefined] and [x:y].'
      )
    })
  })
});
