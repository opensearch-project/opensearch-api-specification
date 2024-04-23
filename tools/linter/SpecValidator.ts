import SchemasFolder from './components/SchemasFolder'
import NamespacesFolder from './components/NamespacesFolder'
import RootFile from './components/RootFile'
import { ValidationError } from '../types'
import PathRefsValidator from './PathRefsValidator'
import SchemaRefsValidator from './SchemaRefsValidator'

export default class SpecValidator {
  root_file: RootFile
  namespaces_folder: NamespacesFolder
  schemas_folder: SchemasFolder
  path_refs_validator: PathRefsValidator
  schema_refs_validator: SchemaRefsValidator

  constructor (root_folder: string) {
    this.root_file = new RootFile(`${root_folder}/opensearch-openapi.yaml`)
    this.namespaces_folder = new NamespacesFolder(`${root_folder}/namespaces`)
    this.schemas_folder = new SchemasFolder(`${root_folder}/schemas`)
    this.path_refs_validator = new PathRefsValidator(this.root_file, this.namespaces_folder)
    this.schema_refs_validator = new SchemaRefsValidator(this.namespaces_folder, this.schemas_folder)
  }

  validate (): ValidationError[] {
    const component_errors = [
      ...this.root_file.validate(),
      ...this.namespaces_folder.validate(),
      ...this.schemas_folder.validate()
    ]
    if (component_errors.length) return component_errors

    return [
      ...this.path_refs_validator.validate(),
      ...this.schema_refs_validator.validate()
    ]
  }
}
