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
import InlineEnumSchemaValidator from "./InlineEnumSchemaValidator";

interface Validator {
  validate(): ValidationError[]
}

export default class SpecValidator {
  logger: Logger
  namespaces_folder: NamespacesFolder
  schemas_folder: SchemasFolder
  validators: Validator[]

  constructor (root_folder: string, logger: Logger) {
    this.logger = logger
    this.namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`)
    this.schemas_folder = new SchemasFolder(`${root_folder}/schemas`)
    this.validators = [
      new SchemaRefsValidator(this.namespaces_folder, this.schemas_folder),
      new SupersededOperationsFile(`${root_folder}/_superseded_operations.yaml`),
      new InfoFile(`${root_folder}/_info.yaml`),
      new SchemasValidator(root_folder, logger),
      new SchemaVisitingValidator(this.namespaces_folder, this.schemas_folder),
      new InlineEnumSchemaValidator(this.namespaces_folder, this.schemas_folder)
    ]
  }

  validate (): ValidationError[] {
    const component_errors = [
      ...this.namespaces_folder.validate(),
      ...this.schemas_folder.validate()
    ]
    if (component_errors.length > 0) return component_errors

    return this.validators.flatMap((v) => v.validate())
  }
}
