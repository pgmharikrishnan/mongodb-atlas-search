"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasDataTypeMapping = void 0;
exports.AtlasDataTypeMapping = {
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
};
