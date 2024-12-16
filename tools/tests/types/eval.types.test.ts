/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { OutputReference } from "tester/types/eval.types";

describe('OutputReference', () => {
  let f = (id: any, k: any): string => `[${id}:${k}]`

  describe('replace', () => {
    it('replaces', () => {
      expect(OutputReference.replace('string', f)).toEqual('string')
      expect(OutputReference.replace('${k.v}', f)).toEqual('[k:v]')
      expect(OutputReference.replace('${k.value}', f)).toEqual('[k:value]')
      expect(OutputReference.replace('${k.v.m}', f)).toEqual('[k:v.m]')
    })
  })
});
