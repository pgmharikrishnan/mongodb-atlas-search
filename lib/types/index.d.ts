export declare const AtlasDataTypeMapping: any;
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
