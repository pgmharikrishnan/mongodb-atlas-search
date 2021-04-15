export const AtlasDataTypeMapping = {
  String: { type: 'string' },
  ObjectId: { type: 'objectId' },
  Date: { type: 'date' },
  SchemaDate: { type: 'date' },
  Number: { type: 'number' },
  Boolean: { type: 'boolean' },
  autocomplete: {
    foldDiacritics: false,
    maxGrams: 7,
    minGrams: 1,
    tokenization: 'edgeGram',
    type: 'autocomplete',
  },
} as any;

export interface AtlasSearchOptions {
  privateKey: string;
  publicKey: string;
  baseUrl: string;
  groupId: string;
  clusterName: string;
}

export interface AtlasSearchIndex {
  analyzer?: string;
  collectionName: string;
  database: string;
  indexID: string;
  mappings: any;
  name: string;
  searchAnalyzer?: string;
  status?: string;
}
