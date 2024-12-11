/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Chapter, ChapterRequest, HttpMethod, Story, SupplementalChapter } from "./story.types"

export interface ParsedChapterRequest extends ChapterRequest {
  method: HttpMethod
}

export type ParsedChapter = ParsedChapterRequest & Chapter
export type ParsedSupplementalChapter = ParsedChapterRequest & SupplementalChapter

export interface ParsedStory extends Story {
  chapters: ParsedChapter[]
  prologues?: ParsedSupplementalChapter[]
  epilogues?: ParsedSupplementalChapter[]
}
