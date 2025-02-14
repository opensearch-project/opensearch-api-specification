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
        name: "OpenSearch tests",
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
    content_type: string,
    full_path?: string
  ): void {
    const folders: string[] = [];
    console.log(full_path)
    if (full_path != null && full_path) {
      const path_parts = full_path.split('/').filter(Boolean);

      const start_index = path_parts.indexOf('tests');

      if (start_index !== -1) {
        folders.push(...path_parts.slice(start_index + 1));
      }
    }

    let current_folder = this.collection.item;
    folders.forEach(folder => {
      let existing_folder = current_folder.find((item: any) => item.name === folder);

      if (existing_folder == null) {
        existing_folder = { name: folder, item: [] };
        current_folder.push(existing_folder);
      }
      current_folder = existing_folder.item;
    });

    const item = {
      name: path,
      request: {
        method,
        header: Object.entries(headers ?? {}).map(([key, value]) => ({ key, value })),
        url: {
          raw: `${url}${path}`,
          host: url,
          path: path.split('/').filter(Boolean),
          query: Object.entries(params).map(([key, value]) => ({ key, value: String(value) })),
        },
        body: body != null ? { mode: content_type === 'application/json' ? 'raw' : 'formdata', raw: JSON.stringify(body) } : undefined,
      },
    };

    const exists = current_folder.some((existing_item: any) => existing_item.name === item.name);
    if (exists != null) {
      current_folder.push(item);
    }
  }

  save_collection(): void {
    fs.writeFileSync(this.collection_path, JSON.stringify(this.collection, null, 2));
  }
}