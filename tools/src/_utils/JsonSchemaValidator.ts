/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import { Ajv2019 as AJV, ErrorsTextOptions, Options as AjvOptions, ValidateFunction } from 'ajv/dist/2019'
import ajv_errors, { ErrorMessageOptions } from 'ajv-errors'
import addFormats from 'ajv-formats';
import AjvErrorsParser from './AjvErrorsParser';

interface JsonSchemaValidatorOpts {
  ajv_opts?: AjvOptions,
  ajv_errors_opts?: ErrorMessageOptions,
  errors_text_opts?: ErrorsTextOptions
  additional_keywords?: string[],
  reference_schemas?: Record<string, Record<any, any>>
}

const DEFAULT_AJV_OPTS = {
  strict: true,
  allErrors: true
}

// Wrapper for AJV
export default class JsonSchemaValidator {
  private readonly ajv: AJV
  private readonly errors_parser: AjvErrorsParser
  private readonly _validate: ValidateFunction | undefined
  message: string | undefined

  constructor(default_schema?: Record<any, any>, options: JsonSchemaValidatorOpts = {}) {
    this.ajv = new AJV({ ...DEFAULT_AJV_OPTS, ...options.ajv_opts })
    addFormats(this.ajv);
    if (options.ajv_errors_opts != null) ajv_errors(this.ajv, options.ajv_errors_opts)
    for (const keyword of options.additional_keywords ?? []) this.ajv.addKeyword(keyword)
    Object.entries(options.reference_schemas ?? {}).forEach(([key, schema]) => this.ajv.addSchema(schema, key))
    this.errors_parser = new AjvErrorsParser(this.ajv, options.errors_text_opts)
    if (default_schema) this._validate = this.ajv.compile(default_schema)
  }

  validate_data(data: any, schema?: Record<any, any>): string | undefined {
    if (schema) return this.#validate(this.ajv.compile(schema), data)
    if (this._validate) return this.#validate(this._validate, data)
    throw new Error('No schema provided')
  }

  validate_schema(schema: any): string | undefined {
    const validate_func = this.ajv.validateSchema.bind(this.ajv) as ValidateFunction
    return this.#validate(validate_func, schema ?? {}, true)
  }

  #validate(validate_func: ValidateFunction, data: any, is_schema: boolean = false): string | undefined {
    const valid = validate_func(data) as boolean
    const errors = is_schema ? this.ajv.errors : validate_func.errors
    return valid ? undefined : this.errors_parser.parse(errors)
  }
}