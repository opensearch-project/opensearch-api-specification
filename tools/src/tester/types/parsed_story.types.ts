/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Chapter, ChapterRequest, Story } from "./story.types"

// a chapter with a single method
export type ParsedChapter = ChapterRequest & Chapter

export interface ParsedStory extends Story {
  $schema: string
  chapters: ParsedChapter[]
}
