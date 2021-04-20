import { HttpMethod } from 'urllib';
import { Schema } from 'mongoose';
import { AtlasSearchIndex, AtlasSearchOptions } from './types';
export declare const dotSeperatedObjectILabel: (obj: any) => any;
export declare class MongoDbAtlas {
    databaseName: string;
    options: AtlasSearchOptions;
    constructor(options: AtlasSearchOptions, databaseName: string);
    digestRequest(url: string, options: {
        method: HttpMethod;
        data?: any;
        headers?: any;
    }): Promise<any>;
    buildUrl(url: string): string;
    createAtlasSearchIndex(searchIndex: Partial<AtlasSearchIndex>): Promise<any>;
    patchAtlasSearchIndex(indexId: string, searchIndex: Partial<AtlasSearchIndex>): Promise<any>;
    getAtlasSearchIndexes(collectionName: string): Promise<any>;
    buildMappingFromSchema(schema: Schema): any;
}
