import NamespaceFile from './NamespaceFile'
import { type ValidationError } from 'types'
import FolderValidator from './base/FolderValidator'

export default class NamespacesFolder extends FolderValidator<NamespaceFile> {
  constructor (folder_path: string) {
    super(folder_path, NamespaceFile)
  }

  validate_folder (): ValidationError[] {
    return this.validate_duplicate_paths()
  }

  validate_duplicate_paths (): ValidationError[] {
    const paths: Record<string, string[]> = {}
    for (const file of this.files) {
      if (file.spec().paths == null) continue
      Object.keys(file.spec().paths).sort().forEach((path) => {
        if (paths[path] == null) paths[path] = [file.namespace]
        else paths[path].push(file.namespace)
      })
    }
    return Object.entries(paths).map(([path, namespaces]) => {
      if (namespaces.length > 1) { return this.error(`Duplicate path '${path}' found in namespaces: ${namespaces.sort().join(', ')}.`) }
    }).filter((e) => e) as ValidationError[]
  }
}
