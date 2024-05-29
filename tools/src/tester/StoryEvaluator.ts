import { type Chapter, type Story, type SupplementalChapter } from './types/story.types'
import { type ChapterEvaluation, Result, type StoryEvaluation } from './types/eval.types'
import ChapterEvaluator from './ChapterEvaluator'
import type ChapterReader from './ChapterReader'
import SharedResources from './SharedResources'
import { overall_result } from './helpers'

export interface StoryFile {
  display_path: string
  full_path: string
  story: Story
}

export default class StoryEvaluator {
  story: Story
  display_path: string
  full_path: string
  has_errors: boolean = false
  chapter_reader: ChapterReader

  constructor (story_file: StoryFile) {
    this.story = story_file.story
    this.display_path = story_file.display_path
    this.full_path = story_file.full_path
    this.chapter_reader = SharedResources.get_instance().chapter_reader
  }

  async evaluate (): Promise<StoryEvaluation> {
    if (this.story.skip) {
      return {
        result: Result.SKIPPED,
        display_path: this.display_path,
        full_path: this.full_path,
        description: this.story.description,
        chapters: []
      }
    }
    const prologues = await this.#evaluate_supplemental_chapters(this.story.prologues ?? [])
    const chapters = await this.#evaluate_chapters(this.story.chapters)
    const epilogues = await this.#evaluate_supplemental_chapters(this.story.epilogues ?? [])
    return {
      display_path: this.display_path,
      full_path: this.full_path,
      description: this.story.description,
      chapters,
      prologues,
      epilogues,
      result: overall_result(prologues.concat(chapters).concat(epilogues).concat(prologues).map(e => e.overall))
    }
  }

  async #evaluate_chapters (chapters: Chapter[]): Promise<ChapterEvaluation[]> {
    if (this.has_errors) return []
    let has_errors: boolean = this.has_errors

    const evaluations: ChapterEvaluation[] = []

    for (const chapter of chapters) {
      const evaluator = new ChapterEvaluator(chapter)
      const evaluation = await evaluator.evaluate(has_errors)
      has_errors = has_errors || evaluation.overall.result === Result.ERROR
      evaluations.push(evaluation)
    }

    return evaluations
  }

  async #evaluate_supplemental_chapters (chapters: SupplementalChapter[]): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    for (const chapter of chapters) {
      const title = `${chapter.method} ${chapter.path}`
      const response = await this.chapter_reader.read(chapter)
      const status = chapter.status ?? []
      if (status.includes(response.status)) evaluations.push({ title, overall: { result: Result.PASSED } })
      else {
        this.has_errors = true
        evaluations.push({ title, overall: { result: Result.ERROR, message: response.message, error: response.error as Error } })
      }
    }
    return evaluations
  }
}
