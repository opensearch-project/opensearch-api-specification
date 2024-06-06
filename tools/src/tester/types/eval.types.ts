export type LibraryEvaluation = StoryEvaluation[]

export interface StoryEvaluation {
  result: Result
  display_path: string
  full_path: string
  description: string
  message?: string
  chapters: ChapterEvaluation[]
  epilogues?: ChapterEvaluation[]
  prologues?: ChapterEvaluation[]
}

export interface ChapterEvaluation {
  title: string
  overall: Evaluation
  request?: {
    parameters?: Record<string, Evaluation>
    requestBody?: Evaluation
  }
  response?: {
    status: Evaluation
    payload: Evaluation
  }
  output_values?: EvaluationWithOutput
}

export class ChaptersEvaluations {
  evaluations: ChapterEvaluation[]
  outputs: StoryOutputs
  constructor () {
    this.evaluations = []
    this.outputs = {}
  }
  push (chapter_id: string, evaluation: ChapterEvaluation) {
    this.evaluations.push(evaluation)
    if(evaluation.output_values !== undefined) {
      this.outputs[chapter_id] = evaluation.output_values
    }
  }
}

export interface Evaluation {
  result: Result
  message?: string
  error?: Error
}

export type EvaluationWithOutput = Evaluation & {
  output?: ChapterOutput
}

export enum Result {
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR',
}

/**
 * A map of output values from the response.
 */
export type ChapterOutput = Record<string, any>

export type StoryOutputs = Record<string, ChapterOutput>
