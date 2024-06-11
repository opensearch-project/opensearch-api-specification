/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import path from 'path'
import os from 'os'
import fs from 'fs'
import NamespacesFolder from 'linter/components/NamespacesFolder'

describe('validate()', () => {
  test('when there invalid files', () => {
    const validator = new NamespacesFolder('./tools/tests/linter/fixtures/folder_validators/namespaces/invalid_files')
    expect(validator.validate()).toEqual([
      {
        file: 'invalid_files/indices.txt',
        location: 'File Extension',
        message: "Invalid file extension. Only '.yaml' files are allowed."
      },
      {
        file: 'invalid_files/invalid_spec.yaml',
        location: 'Operation: GET /{index}/_doc/{id}',
        message: 'Missing description property.'
      },
      {
        file: 'invalid_files/invalid_spec.yaml',
        location: 'Operation: GET /{index}/_doc/{id}',
        message: "Every parameter must be a reference object to '#/components/parameters/{x-operation-group}::{path|query}.{parameter_name}'."
      },
      {
        file: 'invalid_files/invalid_spec.yaml',
        location: 'Operation: GET /{index}/_doc/{id}',
        message: 'Path parameters must match the parameters in the path: {id}, {index}.'
      },
      {
        file: 'invalid_files/invalid_spec.yaml',
        location: 'Operation: GET /{index}/_doc/{id}',
        message: "The 200 response must be a reference object to '#/components/responses/invalid_spec.fetch@200'."
      }
    ])
  })

  test('when the files are valid but the folder is not', () => {
    const validator = new NamespacesFolder('./tools/tests/linter/fixtures/folder_validators/namespaces/invalid_folder')
    expect(validator.validate()).toEqual([
      {
        file: 'invalid_folder/',
        location: 'Folder',
        message: "Duplicate path '/{index}' found in namespaces: dup_path_a, dup_path_c."
      },
      {
        file: 'invalid_folder/',
        location: 'Folder',
        message: "Duplicate path '/{index}/_rollover' found in namespaces: dup_path_a, dup_path_b, dup_path_c."
      }
    ])
  })

  describe('with invalid YAML', () => {
    const invalid_yaml_path = path.join(os.tmpdir(), 'invalid_yaml')

    beforeAll(() => {
      fs.mkdirSync(invalid_yaml_path)
      fs.writeFileSync(`${invalid_yaml_path}/invalid_yaml.yaml`, "```\nInvalid YAML file\n```")
    })

    afterAll(() => {
      fs.rmdirSync(invalid_yaml_path, { recursive: true })
    })

    test('fails unable to parse YAML', () => {
      const validator = new NamespacesFolder(invalid_yaml_path)
      expect(validator.validate()).toEqual([
        {
          file: 'invalid_yaml/invalid_yaml.yaml',
          location: 'File Content',
          message: 'Unable to read or parse YAML.'
        }
      ])
    })
  })
})