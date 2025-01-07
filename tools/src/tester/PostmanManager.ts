/*
* Copyright OpenSearch Contributors
* SPDX-License-Identifier: Apache-2.0
*
* The OpenSearch Contributors require contributions made to
* this file be licensed under the Apache-2.0 license or a
* compatible open source license.
*/

import fs from 'fs';

export class PostmanManager {
  private readonly collection: any;
  private readonly collection_path: string;

  constructor(collection_path: string = './postman_collection.json') {
    this.collection_path = collection_path;
    this.collection = {
      info: {
        name: "Generated Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: [],
    };
  }


  add_to_collection(
    url: string | undefined,
    method: string,
    path: string,
    headers: Record<string, any> | undefined,
    params: Record<string, any>,
    body: any,
    content_type: string
  ): void {
    const body_content = body
      ? (() => {
        switch (content_type) {
          case 'application/json':
            return { mode: 'raw', raw: JSON.stringify(body) };
          case 'text/plain':
            return { mode: 'raw', raw: body.toString() };
          case 'application/x-www-form-urlencoded':
            return {
              mode: 'urlencoded',
              urlencoded: Object.entries(body).map(([key, value]) => ({
                key,
                value: String(value),
              })),
            };

          case 'application/x-ndjson':
            return {
              mode: 'raw',
              raw: body.map((item: any) => JSON.stringify(item)).join('\n'),
            };
          default:
            throw new Error(`Unsupported content type: ${content_type}`);
        }
      })()
      : undefined;

    const item = {
      name: path,
      request: {
        method,
        header: Object.entries(headers ?? {}).map(([key, value]) => ({ key, value })),
        url: {
          raw: `${url}${path}`,
          path: path.split('/').filter(Boolean),
          query: Object.entries(params).map(([key, value]) => ({ key, value: String(value) })),
        },
        body: body_content,
      },
    };

    this.collection.item.push(item);
  }

  save_collection(): void {
    fs.writeFileSync(this.collection_path, JSON.stringify(this.collection, null, 2));
  }
}
