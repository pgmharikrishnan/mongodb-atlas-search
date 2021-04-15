import { HttpMethod, request } from 'urllib';
import { Schema } from 'mongoose';
import { AtlasDataTypeMapping, AtlasSearchIndex, AtlasSearchOptions } from './types';

export const dotSeperatedObjectILabel = (obj: any) => {
  const res = {} as any;
  (function recurse(obj, current = '') {
    for (const key in obj) {
      const value = obj[key];
      const newKey = current ? current + '.' + key : key; // joined key with dot
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        !value.hasOwnProperty('iLabel')
      ) {
        recurse(value, newKey); // it's a nested object, so do it again
      } else {
        res[newKey] = value; // it's not an object, so set the property
      }
    }
  })(obj);
  return res;
};

function getAttributeTypes(schema: any) {
  const response = {} as any;
  const schemaObj = schema.obj;
  const schemaObjKeys = Object.keys(schemaObj);
  schemaObjKeys.forEach((key) => {
    if (typeof schemaObj[key].type === 'object') {
      const className = schemaObj[key].type.constructor.name;
      if (className === 'Schema') {
        response[key] = getAttributeTypes(schemaObj[key].type);
      }
    }
    if (typeof schemaObj[key].type === 'function') {
      response[key] = {
        dataType: schemaObj[key].type.name,
        iLabel: schemaObj[key].label,
      };
    }
  });
  return response;
}
function getAtlasMapping(parsedSchema: any) {
  const response = {
    dynamic: false,
    fields: {},
  } as any;
  const fields = {} as any;
  const schemaObjKeys = Object.keys(parsedSchema);
  schemaObjKeys.forEach((key) => {
    if (typeof parsedSchema[key] === 'object') {
      const dataType = parsedSchema[key].dataType;
      if (dataType) {
        if (AtlasDataTypeMapping.hasOwnProperty(dataType)) fields[key] = AtlasDataTypeMapping[dataType];
        else console.log(dataType, 'Datatype doesnot exist');
      } else {
        fields[key] = {
          type: 'document',
          ...getAtlasMapping(parsedSchema[key]),
        };
      }
    }
  });
  response.fields = fields;
  return response;
}

export class MongoDbAtlas {
  public databaseName: string;
  public options: AtlasSearchOptions;
  constructor(options: AtlasSearchOptions, databaseName: string) {
    this.options = options;
    this.databaseName = databaseName;
    // this.client = new DigestFetch(this.options.publicKey, options.privateKey, {});
  }
  async digestRequest(url: string, options: { method: HttpMethod; body?: any; headers?: any }) {
    const response = await request(this.buildUrl(url), {
      ...options,
      digestAuth: `${this.options.publicKey}:${this.options.privateKey}`,
    });
    return response.data.toString();
  }
  buildUrl(url: string) {
    return this.options.baseUrl + url;
  }
  async makeRequest(collectionName: string) {
    const url = `groups/${this.options.groupId}/clusters/${this.options.clusterName}/fts/indexes/${this.databaseName}/${collectionName}`;
    return this.digestRequest(url, { method: 'GET' });
  }

  async createAtlasSearchIndex(searchIndex: Partial<AtlasSearchIndex>) {
    const url = `groups/${this.options.groupId}/clusters/${this.options.clusterName}/fts/indexes/`;
    return this.digestRequest(url, {
      method: 'POST',
      body: JSON.stringify(searchIndex),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async patchAtlasSearchIndex(indexId: string, searchIndex: Partial<AtlasSearchIndex>) {
    const url = `groups/${this.options.groupId}/clusters/${this.options.clusterName}/fts/indexes/${indexId}`;
    return await this.digestRequest(url, {
      method: 'PATCH',
      body: JSON.stringify(searchIndex),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getAtlasSearchIndexes(collectionName: string) {
    const url = `groups/${this.options.groupId}/clusters/${this.options.clusterName}/fts/indexes/${this.databaseName}/${collectionName}`;
    return this.digestRequest(url, { method: 'GET' });
  }

  buildMappingFromSchema(schema: Schema) {
    const parsedSchema = getAttributeTypes(schema);
    const atlasMapping = getAtlasMapping(parsedSchema);
    atlasMapping.fields.name = AtlasDataTypeMapping.autocomplete;
    return atlasMapping;
  }
}
