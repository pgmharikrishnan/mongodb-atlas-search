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
## Example

```bash
import * as pluralize from 'mongoose-legacy-pluralize';
import { get, isEqual } from 'lodash';
 const collectionOptions = get(schema.schema, 'options');
    const collectionName =
      collectionOptions?.collection ?? pluralize(schema.name);
    const atlasSearchIndex = <AtlasSearchIndex[]>(
      await atlasSearch.getAtlasSearchIndexes(collectionName)
    );
    const defaultIndex = atlasSearchIndex.find(
      (a) => a.name === 'default',
    );

    // Building mappings from mongoose schema
    const atlasMapping = atlasSearch.buildMappingFromSchema(
      schema.schema,
    );
    if (defaultIndex) {
      // Default index exists so patch flow
      if (isEqual(atlasMapping, defaultIndex.mappings)) {
        // No changes in mapping skipping patch
      } else {
        // New changes in mapping sending patch request
        const patchResponse = await atlasSearch.patchAtlasSearchIndex(
          defaultIndex.indexID,
          {
            database: defaultIndex.database,
            collectionName: defaultIndex.collectionName,
            name: defaultIndex.name,
            mappings: atlasMapping,
          },
        );
        console.log(JSON.stringify(atlasMapping, null, 4));
        console.log(JSON.stringify(patchResponse, null, 4));
        console.log(`Mapping updated for ${collectionName}`);
      }
    } else {
      // Default index does not exists so creating default index
      console.log('Initiating creation of default index');
      const createResponse = await atlasSearch.createAtlasSearchIndex({
        database: databaseName,
        collectionName: collectionName,
        name: 'default',
        mappings: atlasMapping,
      });
      console.log(JSON.stringify(atlasMapping, null, 4));
      console.log(JSON.stringify(createResponse, null, 4));
      console.log(`Mapping created for ${collectionName}`);
    }
  }
},
```
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

