# mongodb-atlas-search

mongodb-atlas-search is a library for creating mongodb atlas mapping, automating the creation and updation of atlas indexes as needed. 

## Installation

```bash
npm i @pgmharikrishnan/mongodb-atlas-search
```

## Usage

```bash
import { MongoDbAtlas } from '@pgmharikrishnan/mongodb-atlas-search';
const options = {
  privateKey: string;
  publicKey: string;  // Get it from 'https://docs.atlas.mongodb.com/configure-api-access/'
  baseUrl: string;  // 'https://cloud.mongodb.com/api/atlas/v1.0/'
  groupId: string; 
  clusterName: string;
}
const databaseName="DbName"

## Initialising with credentials
const atlasSearch = new MongoDbAtlas(options,databaseName);

## Fetching indexes created on a collection
 atlasSearch.getAtlasSearchIndexes(collectionName) // 'returns array of AtlasSearchIndex'

## Building atlas mapping schema from mongoose schema
  const atlasMapping = atlasSearch.buildMappingFromSchema(schema.schema); //'returns atlas mapping'

## Creating new atlas search index on a collection
const createResponse = await atlasSearch.createAtlasSearchIndex({
  database: databaseName,
  collectionName: collectionName,
  name: 'default', // 'Index name'
  mappings: atlasMapping, // 'Generated atlas mapping from buildMappingFromSchema'
});

## Updating existing atlas search index
const patchResponse = await atlasSearch.patchAtlasSearchIndex(
  defaultIndex.indexID, // 'Can be fetched using getAtlasSearchIndexes"
  {
    database: defaultIndex.database,
    collectionName: defaultIndex.collectionName,
    name: defaultIndex.name,
    mappings: atlasMapping, // 'Generated atlas mapping from buildMappingFromSchema'
  },
);
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

