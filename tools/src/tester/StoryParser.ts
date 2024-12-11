/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import _ from "lodash";
import { ChapterRequest, Story } from "./types/story.types";
import { ParsedChapter, ParsedChapterRequest, ParsedStory } from "./types/parsed_story.types";

export default class StoryParser {
  static parse(story: Story): ParsedStory {
    return {
      ...story,
      chapters: this.#expand_chapters(story.chapters) as ParsedChapter[],
      prologues: this.#expand_chapters(story.prologues),
      epilogues: this.#expand_chapters(story.epilogues)
    }
  }

  static #chapter_methods(methods: string[] | string): string[] {
    return [...(Array.isArray(methods) ? methods : [methods])]
  }

  static #expand_chapters(chapters?: ChapterRequest[]): ParsedChapterRequest[] {
    if (chapters === undefined) return []
    return  _.flatMap(_.map(chapters, (chapter) => {
      return _.map(this.#chapter_methods(chapter.method), (method) => {
        return {
          ...chapter,
          method
        }
      })
    })) as ParsedChapterRequest[]
  }
}