/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import SchemasFolder from './components/SchemasFolder'
import NamespacesFolder from './components/NamespacesFolder'
import { type ValidationError } from 'types'
import SchemaRefsValidator from './SchemaRefsValidator'
import SupersededOperationsFile from './components/SupersededOperationsFile'
import InfoFile from './components/InfoFile'
import SchemaVisitingValidator from './SchemaVisitingValidator'
import SchemasValidator from './SchemasValidator'
import { type Logger } from '../Logger'
import { execSync } from 'child_process'
import { relative, resolve } from 'path'

export default class SpecValidator {
  logger: Logger
  superseded_ops_file: SupersededOperationsFile
  info_file: InfoFile
  namespaces_folder: NamespacesFolder
  schemas_folder: SchemasFolder
  schemas_validator: SchemasValidator
  schema_refs_validator: SchemaRefsValidator
  inline_object_schema_validator: SchemaVisitingValidator
  changedOnly: boolean

  constructor (root_folder: string, logger: Logger, changedOnly: boolean) {
    this.logger = logger
    this.superseded_ops_file = new SupersededOperationsFile(`${root_folder}/_superseded_operations.yaml`)
    this.info_file = new InfoFile(`${root_folder}/_info.yaml`)
    this.namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`)
    this.schemas_folder = new SchemasFolder(`${root_folder}/schemas`)
    this.schemas_validator = new SchemasValidator(root_folder, logger)
    this.schema_refs_validator = new SchemaRefsValidator(this.namespaces_folder, this.schemas_folder)
    this.inline_object_schema_validator = new SchemaVisitingValidator(this.namespaces_folder, this.schemas_folder)
    this.changedOnly = changedOnly
  }

  private getChangedFiles(): string[] {
    try {
      const output = execSync('git diff --name-only origin/main', { encoding: 'utf-8' })
      return output.split('\n').filter(file => file.endsWith('.yml') || file.endsWith('.yaml'))
    } catch (error) {
      this.logger.error('Error:' + error)
      return []
    }
  }

  validateChangedFiles(): ValidationError[] {
    const changedFiles = this.getChangedFiles()
  
    if (changedFiles.length === 0) {
      this.logger.log('No valid files to check')
      return []
    }
  
    this.logger.log(`Checking diff files:\n${changedFiles.join('\n')}`)
    let errors: ValidationError[] = []
  
    for (const file of changedFiles) {
      let normalizedFile = file
    
      if (file.startsWith('spec/')) {
        normalizedFile = relative(resolve('spec'), resolve(file))
      } else if (file.startsWith('schemas/')) {
        normalizedFile = relative(resolve('schemas'), resolve(file))
      }
    
      errors = errors.concat(this.inline_object_schema_validator.validateFile(normalizedFile))
    }
  
    return errors
  }

  validate (): ValidationError[] {
    if (this.changedOnly) return this.validateChangedFiles()

    const component_errors = [
      ...this.namespaces_folder.validate(),
      ...this.schemas_folder.validate()
    ]
    if (component_errors.length > 0) return component_errors

    return [
      ...this.schema_refs_validator.validate(),
      ...this.superseded_ops_file.validate(),
      ...this.info_file.validate(),
      ...this.inline_object_schema_validator.validate(),
      ...this.schemas_validator.validate()
    ]
  }
}
