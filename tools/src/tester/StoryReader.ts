/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from "lodash";
import { StoryFile } from "./types/eval.types";
import { Chapter, ChapterRequest, SupplementalChapter } from "./types/story.types";

export default class StoryReader {
  story_file: StoryFile
  display_path: string

  constructor(story_file: StoryFile) {
    this.story_file = story_file

    this.story_file.story.chapters = StoryReader.#expand_chapters(story_file.story.chapters) as Chapter[]
    this.story_file.story.prologues = StoryReader.#expand_chapters(story_file.story.prologues) as SupplementalChapter[]
    this.story_file.story.epilogues = StoryReader.#expand_chapters(story_file.story.epilogues) as SupplementalChapter[]
    this.display_path = story_file.display_path
  }

  static #chapter_methods(methods: string[] | string): string[] {
    return [...(Array.isArray(methods) ? methods : [methods])]
  }

  static #expand_chapters(chapters: ChapterRequest[] | undefined): ChapterRequest[] {
    if (chapters === undefined) return []
    return  _.flatMap(_.map(chapters, (chapter) => {
      return _.map(StoryReader.#chapter_methods(chapter.method), (method) => {
        return {
          ...chapter,
          method
        }
      })
    })) as ChapterRequest[]
  }
}