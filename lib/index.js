"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbAtlas = exports.dotSeperatedObjectILabel = void 0;
var urllib_1 = require("urllib");
var types_1 = require("./types");
var dotSeperatedObjectILabel = function (obj) {
    var res = {};
    (function recurse(obj, current) {
        if (current === void 0) { current = ''; }
        for (var key in obj) {
            var value = obj[key];
            var newKey = current ? current + '.' + key : key; // joined key with dot
            if (value &&
                typeof value === 'object' &&
                !Array.isArray(value) &&
                !(value instanceof Date) &&
                !value.hasOwnProperty('iLabel')) {
                recurse(value, newKey); // it's a nested object, so do it again
            }
            else {
                res[newKey] = value; // it's not an object, so set the property
            }
        }
    })(obj);
    return res;
};
exports.dotSeperatedObjectILabel = dotSeperatedObjectILabel;
function getAttributeTypes(schema) {
    var response = {};
    var schemaObj = schema.obj;
    var schemaObjKeys = Object.keys(schemaObj);
    schemaObjKeys.forEach(function (key) {
        if (typeof schemaObj[key].type === 'object') {
            var className = schemaObj[key].type.constructor.name;
            if (className === 'Schema') {
                response[key] = getAttributeTypes(schemaObj[key].type);
            }
        }
        if (typeof schemaObj[key].type === 'function') {
            response[key] = {
                dataType: schemaObj[key].type.name,
            };
        }
    });
    return response;
}
function getAtlasMapping(parsedSchema) {
    var response = {
        dynamic: false,
        fields: {},
    };
    var fields = {};
    var schemaObjKeys = Object.keys(parsedSchema);
    schemaObjKeys.forEach(function (key) {
        if (typeof parsedSchema[key] === 'object') {
            var dataType = parsedSchema[key].dataType;
            if (dataType) {
                if (types_1.AtlasDataTypeMapping.hasOwnProperty(dataType))
                    fields[key] = types_1.AtlasDataTypeMapping[dataType];
                else
                    console.log(dataType, 'Datatype doesnot exist');
            }
            else {
                fields[key] = __assign({ type: 'document' }, getAtlasMapping(parsedSchema[key]));
            }
        }
    });
    response.fields = fields;
    return response;
}
var MongoDbAtlas = /** @class */ (function () {
    function MongoDbAtlas(options, databaseName) {
        this.options = options;
        this.databaseName = databaseName;
        // this.client = new DigestFetch(this.options.publicKey, options.privateKey, {});
    }
    MongoDbAtlas.prototype.digestRequest = function (url, options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, urllib_1.request(this.buildUrl(url), __assign(__assign({}, options), { digestAuth: this.options.publicKey + ":" + this.options.privateKey }))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, JSON.parse(response.data.toString())];
                }
            });
        });
    };
    MongoDbAtlas.prototype.buildUrl = function (url) {
        return this.options.baseUrl + url;
    };
    MongoDbAtlas.prototype.createAtlasSearchIndex = function (searchIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = "groups/" + this.options.groupId + "/clusters/" + this.options.clusterName + "/fts/indexes/";
                console.log(searchIndex);
                return [2 /*return*/, this.digestRequest(url, {
                        method: 'POST',
                        data: searchIndex,
                        headers: { 'Content-Type': 'application/json' },
                    })];
            });
        });
    };
    MongoDbAtlas.prototype.patchAtlasSearchIndex = function (indexId, searchIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "groups/" + this.options.groupId + "/clusters/" + this.options.clusterName + "/fts/indexes/" + indexId;
                        return [4 /*yield*/, this.digestRequest(url, {
                                method: 'PATCH',
                                data: searchIndex,
                                headers: { 'Content-Type': 'application/json' },
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MongoDbAtlas.prototype.getAtlasSearchIndexes = function (collectionName) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                url = "groups/" + this.options.groupId + "/clusters/" + this.options.clusterName + "/fts/indexes/" + this.databaseName + "/" + collectionName;
                return [2 /*return*/, this.digestRequest(url, { method: 'GET' })];
            });
        });
    };
    MongoDbAtlas.prototype.buildMappingFromSchema = function (schema) {
        var parsedSchema = getAttributeTypes(schema);
        var atlasMapping = getAtlasMapping(parsedSchema);
        // atlasMapping.fields.name = AtlasDataTypeMapping.autocomplete;
        return atlasMapping;
    };
    return MongoDbAtlas;
}());
exports.MongoDbAtlas = MongoDbAtlas;
