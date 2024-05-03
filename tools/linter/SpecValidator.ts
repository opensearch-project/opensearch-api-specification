import SchemasFolder from './components/SchemasFolder'
import NamespacesFolder from './components/NamespacesFolder'
import { type ValidationError } from '../types'
import SchemaRefsValidator from './SchemaRefsValidator'
import SupersededOperationsFile from './components/SupersededOperationsFile'
import InfoFile from './components/InfoFile'

export default class SpecValidator {
  superseded_ops_file: SupersededOperationsFile
  info_file: InfoFile
  namespaces_folder: NamespacesFolder
  schemas_folder: SchemasFolder
  schema_refs_validator: SchemaRefsValidator

  constructor (root_folder: string) {
    this.superseded_ops_file = new SupersededOperationsFile(`${root_folder}/_superseded_operations.yaml`)
    this.info_file = new InfoFile(`${root_folder}/_info.yaml`)
    this.namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`)
    this.schemas_folder = new SchemasFolder(`${root_folder}/schemas`)
    this.schema_refs_validator = new SchemaRefsValidator(this.namespaces_folder, this.schemas_folder)
  }

  validate (): ValidationError[] {
    const component_errors = [
      ...this.namespaces_folder.validate(),
      ...this.schemas_folder.validate()
    ]
    if (component_errors.length > 0) return component_errors

    return [
      ...this.schema_refs_validator.validate(),
      ...this.superseded_ops_file.validate(),
      ...this.info_file.validate()
    ]
  }
}
