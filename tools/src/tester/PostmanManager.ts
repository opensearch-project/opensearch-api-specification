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

    if (full_path) {
      const pathParts = full_path.split('/').filter(Boolean);

      // Начинаем с папки, которая идет сразу после "tests"
      const startIndex = pathParts.indexOf('tests');
      
      // Если "tests" есть в пути, берём все папки, начиная с пути после tests
      if (startIndex !== -1) {
        folders.push(...pathParts.slice(startIndex + 1)); // Вытягиваем все части пути после "tests"
      }
    }

    let currentFolder = this.collection.item;

    // Создание всех папок по частям
    folders.forEach(folder => {
      let existingFolder = currentFolder.find((item: any) => item.name === folder);

      if (!existingFolder) {
        existingFolder = { name: folder, item: [] };
        currentFolder.push(existingFolder);
      }

      currentFolder = existingFolder.item;
    });

    // Создаем структуру для конкретного теста (файл)
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
        body: body ? { mode: content_type === 'application/json' ? 'raw' : 'formdata', raw: JSON.stringify(body) } : undefined,
      },
    };

    // Проверяем, есть ли уже такой элемент, чтобы не добавлять его снова
    const exists = currentFolder.some((existingItem: any) => existingItem.name === item.name);
    if (!exists) {
      currentFolder.push(item);
    }
  }

  save_collection(): void {
    fs.writeFileSync(this.collection_path, JSON.stringify(this.collection, null, 2));
  }
}
