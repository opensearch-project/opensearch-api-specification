import { type Chapter, type Story, type SupplementalChapter } from './types/story.types'
import { type ChapterEvaluation, Result, type StoryEvaluation, ChaptersEvaluations, StoryOutputs, Evaluation } from './types/eval.types'
import ChapterEvaluator from './ChapterEvaluator'
import type ChapterReader from './ChapterReader'
import SharedResources from './SharedResources'
import { extract_output_values, overall_result } from './helpers'

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
    const story_outputs: StoryOutputs = {}
    const prologues = await this.#evaluate_supplemental_chapters(this.story.prologues ?? [], story_outputs)
    const chapters = await this.#evaluate_chapters(this.story.chapters, story_outputs)
    const epilogues = await this.#evaluate_supplemental_chapters(this.story.epilogues ?? [], story_outputs)
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

  async #evaluate_chapters (chapters: Chapter[], story_outputs: StoryOutputs): Promise<ChapterEvaluation[]> {
    if (this.has_errors) return []
    let has_errors: boolean = this.has_errors

    const evaluations: ChapterEvaluation[] = []
    let index = 0
    for (const chapter of chapters) {
      const evaluator = new ChapterEvaluator(chapter)
      const evaluation = await evaluator.evaluate(has_errors, story_outputs)
      has_errors = has_errors || evaluation.overall.result === Result.ERROR
      const chapter_id = chapter.id ?? index.toString()
      if(evaluation.output_values?.output !== undefined) {
        story_outputs[chapter_id] = evaluation.output_values?.output
      }
      evaluations.push(evaluation)
      index++
    }

    console.log(`Chapter evaluations outputs: ${JSON.stringify(story_outputs)}`)
    return evaluations
  }

  async #evaluate_supplemental_chapters (chapters: SupplementalChapter[], story_outputs: StoryOutputs): Promise<ChapterEvaluation[]> {
    const evaluations: ChapterEvaluation[] = []
    let index = 0
    for (const chapter of chapters) {
      const evaluation = await this.evaluate_supplemental_chapter(chapter, story_outputs)
      const chapter_id = chapter.id ?? index.toString()
      if(evaluation.output_values?.output !== undefined) {
        story_outputs[chapter_id] = evaluation.output_values?.output
      }
      evaluations.push(evaluation)
      index++
    }
    console.log(`Supplemental Chapter evaluations outputs: ${JSON.stringify(story_outputs)}`)
    return evaluations
  }

  async evaluate_supplemental_chapter(chapter: SupplementalChapter, story_outputs: StoryOutputs): Promise<ChapterEvaluation> {
    const title = `${chapter.method} ${chapter.path}`
    const response = await this.chapter_reader.read(chapter, story_outputs)
    const status = chapter.status ?? []
    const output_values = extract_output_values(response)
    let response_evaluation: ChapterEvaluation;
    const passed_evaluation = { title, overall: { result: Result.PASSED }, output_values: output_values }
    if(status.includes(response.status)){
      response_evaluation = passed_evaluation
    } else {
      response_evaluation = { title, overall: { result: Result.ERROR, message: response.message, error: response.error as Error }, output_values: output_values }
    }
    const result = overall_result([response_evaluation.overall, output_values])
    if(result == Result.PASSED) {
      return passed_evaluation
    } else {
      this.has_errors = true
      let message: string = "";
      if(response_evaluation.overall.result == Result.ERROR) {
        message+= `${response_evaluation.overall.message}\n`
      }
      if(output_values.result == Result.ERROR) {
        message+= `${output_values.message}\n`
      }
      return { title, overall: { result: Result.ERROR, message: message, error: response.error as Error }, output_values: output_values }
    }
  }
}
