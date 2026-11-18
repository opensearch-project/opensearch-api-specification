/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { read_yaml } from "helpers";
import StoryParser from "../../src/tester/StoryParser";
import _ from "lodash";

describe('StoryParser', () => {
  const story = StoryParser.parse(read_yaml('tools/tests/tester/fixtures/stories/passed/multiple_methods.yaml'))

  test('does not expand prologues', () => {
    expect(story.prologues?.length).toEqual(1)
    expect(story.prologues && story.prologues[0].method).toEqual('HEAD')
  })

  test('does not expand epilogues', () => {
    expect(story.epilogues?.length).toEqual(1)
    expect(story.epilogues && story.epilogues[0].method).toEqual('DELETE')
  })

  test('expands chapters', () => {
    expect(story.chapters?.length).toEqual(2)
    expect(_.map(story.chapters, (chapter) => chapter.method)).toEqual(['PUT', 'HEAD'])
  })
})