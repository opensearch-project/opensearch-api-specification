/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

/*
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file by running:
 * "npm run generate-types" in a terminal.
 */

/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "SupplementalChapter".
 */
export type SupplementalChapter = ChapterRequest & {
  /**
   * Array of success HTTP status codes. Default to [200, 201].
   */
  status?: number[];
};
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "HttpMethod".
 */
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Parameter".
 */
export type Parameter = (string | number | boolean)[] | string | number | boolean;
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Header".
 */
export type Header = string | number | boolean;
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Payload".
 */
export type Payload = {} | any[] | string | number | boolean;
/**
 * The semver range to execute the story or chapter against.
 *
 *
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Version".
 */
export type Version = string;
/**
 * The list of distributions that support this API.
 *
 *
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "DistributionsList".
 */
export type DistributionsList = string[];
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Chapter".
 */
export type Chapter = ChapterRequest & {
  method?: HttpMethod[] | HttpMethod;
  /**
   * A brief description of the chapter.
   */
  synopsis: string;
  /**
   * An explanation is provided to clarify why it has been skipped.
   */
  pending?: string;
  response?: ExpectedResponse;
  warnings?: Warnings;
};
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "ReadChapter".
 */
export type ReadChapter = Chapter & {
  response: ActualResponse;
};

export interface Story {
  $schema?: string;
  description: string;
  prologues?: SupplementalChapter[];
  epilogues?: SupplementalChapter[];
  chapters: Chapter[];
  version?: Version;
  distributions?: Distributions;
  warnings?: Warnings;
}
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "ChapterRequest".
 */
export interface ChapterRequest {
  /**
   * A unique identifier for the chapter, useful for accessing outputs.
   */
  id?: string;
  path: string;
  method: HttpMethod;
  parameters?: {
    [k: string]: Parameter;
  };
  request?: Request;
  output?: Output;
  version?: Version;
  distributions?: Distributions;
  retry?: Retry;
  response?: ExpectedResponse;
}
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Request".
 */
export interface Request {
  content_type?: string;
  headers?: {
    [k: string]: Header;
  };
  payload?: Payload;
}
/**
 * Describes output for a chapter.
 * The keys are the names for the variable in the chapter output.
 * The values are paths to the values in the response.
 * The values should be in the form:
 * - `payload.<payload-path>` for the payload
 * - `headers.<header-name>` for the headers.
 *
 *
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Output".
 */
export interface Output {
  [k: string]: string | DetailedOutput;
}
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "DetailedOutput".
 */
export interface DetailedOutput {
  path: string;
  default?: boolean | number | string;
}
/**
 * The list of distributions that support this API.
 *
 *
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Distributions".
 */
export interface Distributions {
  included?: DistributionsList;
  excluded?: DistributionsList;
}
/**
 * Number of times to retry on error.
 *
 *
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Retry".
 */
export interface Retry {
  /**
   * Number of retries.
   */
  count: number;
  /**
   * Number of milliseconds to wait before retrying.
   */
  wait?: number;
}
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "ExpectedResponse".
 */
export interface ExpectedResponse {
  /**
   * The expected HTTP status code. Default to 200.
   */
  status: number;
  content_type?: string;
  payload?: Payload;
  contains?: string[];
}
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "Warnings".
 */
export interface Warnings {
  /**
   * Enable/disable warnings about multiple paths being tested in the same story.
   */
  'multiple-paths-detected'?: boolean;
  /**
   * Enable/disable warnings about file paths that do not match paths tested in the story.
   */
  'invalid-path-detected'?: boolean;
}
/**
 * This interface was referenced by `Story`'s JSON-Schema
 * via the `definition` "ActualResponse".
 */
export interface ActualResponse {
  status: number;
  content_type: string;
  payload: Payload;
  /**
   * Error message for non 2XX responses.
   */
  message?: string;
  /**
   * Error object.
   */
  error?: {};
}

/* eslint-enable @typescript-eslint/ban-types */
/* eslint-enable @typescript-eslint/consistent-indexed-object-style */
