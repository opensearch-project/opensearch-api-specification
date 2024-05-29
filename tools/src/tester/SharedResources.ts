import type ChapterReader from './ChapterReader'
import type SchemaValidator from './SchemaValidator'
import type SpecParser from './SpecParser'

interface Resources {
  chapter_reader: ChapterReader
  schema_validator: SchemaValidator
  spec_parser: SpecParser
}

export default class SharedResources {
  private static instance: SharedResources | undefined
  chapter_reader: ChapterReader
  schema_validator: SchemaValidator
  spec_parser: SpecParser

  private constructor (resources: Resources) {
    this.chapter_reader = resources.chapter_reader
    this.schema_validator = resources.schema_validator
    this.spec_parser = resources.spec_parser
  }

  public static create_instance (resources: Resources): void {
    if (SharedResources.instance) throw new Error('SharedResources instance has already been created.')
    SharedResources.instance = new SharedResources(resources)
  }

  public static get_instance (): SharedResources {
    if (SharedResources.instance) return SharedResources.instance
    throw new Error('SharedResources instance has not been created.')
  }
}
