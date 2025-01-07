import fs from 'fs';

export class PostmanManager {
  private readonly collection: any;
  private readonly collectionPath: string;

  constructor(collectionPath: string = './postman_collection.json') {
    this.collectionPath = collectionPath;
    this.collection = {
      info: {
        name: "Generated Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
      },
      item: [],
    };
  }

  addToCollection(
    url: string | undefined,
    method: string,
    path: string,
    headers: Record<string, any> | undefined,
    params: Record<string, any>,
    body: any,
    contentType: string
  ): void {
    const item = {
      name: path,
      request: {
        method,
        header: Object.entries(headers || {}).map(([key, value]) => ({ key, value })),
        url: {
          raw: `${url}${path}`,
          path: path.split('/').filter(Boolean),
          query: Object.entries(params).map(([key, value]) => ({ key, value: value as string })),
        },
        body: body
          ? { mode: contentType === 'application/json' ? 'raw' : 'formdata', raw: JSON.stringify(body) }
          : undefined,
      },
    };

    this.collection.item.push(item);
  }

  saveCollection(): void {
    fs.writeFileSync(this.collectionPath, JSON.stringify(this.collection, null, 2));
  }
}
