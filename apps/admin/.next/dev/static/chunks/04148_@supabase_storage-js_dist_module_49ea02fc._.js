(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StorageApiError",
    ()=>StorageApiError,
    "StorageError",
    ()=>StorageError,
    "StorageUnknownError",
    ()=>StorageUnknownError,
    "isStorageError",
    ()=>isStorageError
]);
class StorageError extends Error {
    constructor(message){
        super(message);
        this.__isStorageError = true;
        this.name = 'StorageError';
    }
}
function isStorageError(error) {
    return typeof error === 'object' && error !== null && '__isStorageError' in error;
}
class StorageApiError extends StorageError {
    constructor(message, status, statusCode){
        super(message);
        this.name = 'StorageApiError';
        this.status = status;
        this.statusCode = statusCode;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            statusCode: this.statusCode
        };
    }
}
class StorageUnknownError extends StorageError {
    constructor(message, originalError){
        super(message);
        this.name = 'StorageUnknownError';
        this.originalError = originalError;
    }
} //# sourceMappingURL=errors.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/helpers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPlainObject",
    ()=>isPlainObject,
    "recursiveToCamel",
    ()=>recursiveToCamel,
    "resolveFetch",
    ()=>resolveFetch,
    "resolveResponse",
    ()=>resolveResponse
]);
const resolveFetch = (customFetch)=>{
    if (customFetch) {
        return (...args)=>customFetch(...args);
    }
    return (...args)=>fetch(...args);
};
const resolveResponse = ()=>{
    return Response;
};
const recursiveToCamel = (item)=>{
    if (Array.isArray(item)) {
        return item.map((el)=>recursiveToCamel(el));
    } else if (typeof item === 'function' || item !== Object(item)) {
        return item;
    }
    const result = {};
    Object.entries(item).forEach(([key, value])=>{
        const newKey = key.replace(/([-_][a-z])/gi, (c)=>c.toUpperCase().replace(/[-_]/g, ''));
        result[newKey] = recursiveToCamel(value);
    });
    return result;
};
const isPlainObject = (value)=>{
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
}; //# sourceMappingURL=helpers.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/fetch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "get",
    ()=>get,
    "head",
    ()=>head,
    "post",
    ()=>post,
    "put",
    ()=>put,
    "remove",
    ()=>remove
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/helpers.js [app-client] (ecmascript)");
;
;
;
const _getErrorMessage = (err)=>{
    var _a;
    return err.msg || err.message || err.error_description || (typeof err.error === 'string' ? err.error : (_a = err.error) === null || _a === void 0 ? void 0 : _a.message) || JSON.stringify(err);
};
const handleError = (error, reject, options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(void 0, void 0, void 0, function*() {
        const Res = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveResponse"])();
        if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
            error.json().then((err)=>{
                const status = error.status || 500;
                const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || status + '';
                reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageApiError"](_getErrorMessage(err), status, statusCode));
            }).catch((err)=>{
                reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageUnknownError"](_getErrorMessage(err), err));
            });
        } else {
            reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageUnknownError"](_getErrorMessage(error), error));
        }
    });
const _getRequestParams = (method, options, parameters, body)=>{
    const params = {
        method,
        headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
    };
    if (method === 'GET' || !body) {
        return params;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(body)) {
        params.headers = Object.assign({
            'Content-Type': 'application/json'
        }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
    } else {
        params.body = body;
    }
    if (options === null || options === void 0 ? void 0 : options.duplex) {
        params.duplex = options.duplex;
    }
    return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest(fetcher, method, url, options, parameters, body) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return new Promise((resolve, reject)=>{
            fetcher(url, _getRequestParams(method, options, parameters, body)).then((result)=>{
                if (!result.ok) throw result;
                if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
                return result.json();
            }).then((data)=>resolve(data)).catch((error)=>handleError(error, reject, options));
        });
    });
}
function get(fetcher, url, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'GET', url, options, parameters);
    });
}
function post(fetcher, url, body, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'POST', url, options, parameters, body);
    });
}
function put(fetcher, url, body, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
    });
}
function head(fetcher, url, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'HEAD', url, Object.assign(Object.assign({}, options), {
            noResolveJson: true
        }), parameters);
    });
}
function remove(fetcher, url, body, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
    });
} //# sourceMappingURL=fetch.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StreamDownloadBuilder.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StreamDownloadBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)");
;
;
class StreamDownloadBuilder {
    constructor(downloadFn, shouldThrowOnError){
        this.downloadFn = downloadFn;
        this.shouldThrowOnError = shouldThrowOnError;
    }
    then(onfulfilled, onrejected) {
        return this.execute().then(onfulfilled, onrejected);
    }
    execute() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const result = yield this.downloadFn();
                return {
                    data: result.body,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
} //# sourceMappingURL=StreamDownloadBuilder.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/BlobDownloadBuilder.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StreamDownloadBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StreamDownloadBuilder.js [app-client] (ecmascript)");
var _a;
;
;
;
class BlobDownloadBuilder {
    constructor(downloadFn, shouldThrowOnError){
        this.downloadFn = downloadFn;
        this.shouldThrowOnError = shouldThrowOnError;
        this[_a] = 'BlobDownloadBuilder';
        this.promise = null;
    }
    asStream() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StreamDownloadBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.downloadFn, this.shouldThrowOnError);
    }
    then(onfulfilled, onrejected) {
        return this.getPromise().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.getPromise().catch(onrejected);
    }
    finally(onfinally) {
        return this.getPromise().finally(onfinally);
    }
    getPromise() {
        if (!this.promise) {
            this.promise = this.execute();
        }
        return this.promise;
    }
    execute() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const result = yield this.downloadFn();
                return {
                    data: yield result.blob(),
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
}
_a = Symbol.toStringTag;
const __TURBOPACK__default__export__ = BlobDownloadBuilder;
 //# sourceMappingURL=BlobDownloadBuilder.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StorageFileApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/buffer/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/helpers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$BlobDownloadBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/BlobDownloadBuilder.js [app-client] (ecmascript)");
;
;
;
;
;
const DEFAULT_SEARCH_OPTIONS = {
    limit: 100,
    offset: 0,
    sortBy: {
        column: 'name',
        order: 'asc'
    }
};
const DEFAULT_FILE_OPTIONS = {
    cacheControl: '3600',
    contentType: 'text/plain;charset=UTF-8',
    upsert: false
};
class StorageFileApi {
    constructor(url, headers = {}, bucketId, fetch){
        this.shouldThrowOnError = false;
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFetch"])(fetch);
    }
    /**
     * Enable throwing errors instead of returning them.
     */ throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    /**
     * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
     *
     * @param method HTTP method.
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     */ uploadOrUpdate(method, path, fileBody, fileOptions) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                let body;
                const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
                let headers = Object.assign(Object.assign({}, this.headers), method === 'POST' && {
                    'x-upsert': String(options.upsert)
                });
                const metadata = options.metadata;
                if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                    body = new FormData();
                    body.append('cacheControl', options.cacheControl);
                    if (metadata) {
                        body.append('metadata', this.encodeMetadata(metadata));
                    }
                    body.append('', fileBody);
                } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                    body = fileBody;
                    // Only append if not already present
                    if (!body.has('cacheControl')) {
                        body.append('cacheControl', options.cacheControl);
                    }
                    if (metadata && !body.has('metadata')) {
                        body.append('metadata', this.encodeMetadata(metadata));
                    }
                } else {
                    body = fileBody;
                    headers['cache-control'] = `max-age=${options.cacheControl}`;
                    headers['content-type'] = options.contentType;
                    if (metadata) {
                        headers['x-metadata'] = this.toBase64(this.encodeMetadata(metadata));
                    }
                    // Node.js streams require duplex option for fetch in Node 20+
                    // Check for both web ReadableStream and Node.js streams
                    const isStream = typeof ReadableStream !== 'undefined' && body instanceof ReadableStream || body && typeof body === 'object' && 'pipe' in body && typeof body.pipe === 'function';
                    if (isStream && !options.duplex) {
                        options.duplex = 'half';
                    }
                }
                if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
                    headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
                }
                const cleanPath = this._removeEmptyFolders(path);
                const _path = this._getFinalPath(cleanPath);
                const data = yield (method == 'PUT' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["put"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/${_path}`, body, Object.assign({
                    headers
                }, (options === null || options === void 0 ? void 0 : options.duplex) ? {
                    duplex: options.duplex
                } : {}));
                return {
                    data: {
                        path: cleanPath,
                        id: data.Id,
                        fullPath: data.Key
                    },
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Uploads a file to an existing bucket.
     *
     * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param fileBody The body of the file to be stored in the bucket.
     */ upload(path, fileBody, fileOptions) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
        });
    }
    /**
     * Upload a file with a token generated from `createSignedUploadUrl`.
     * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
     * @param token The token generated from `createSignedUploadUrl`
     * @param fileBody The body of the file to be stored in the bucket.
     */ uploadToSignedUrl(path, token, fileBody, fileOptions) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            const cleanPath = this._removeEmptyFolders(path);
            const _path = this._getFinalPath(cleanPath);
            const url = new URL(this.url + `/object/upload/sign/${_path}`);
            url.searchParams.set('token', token);
            try {
                let body;
                const options = Object.assign({
                    upsert: DEFAULT_FILE_OPTIONS.upsert
                }, fileOptions);
                const headers = Object.assign(Object.assign({}, this.headers), {
                    'x-upsert': String(options.upsert)
                });
                if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
                    body = new FormData();
                    body.append('cacheControl', options.cacheControl);
                    body.append('', fileBody);
                } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
                    body = fileBody;
                    body.append('cacheControl', options.cacheControl);
                } else {
                    body = fileBody;
                    headers['cache-control'] = `max-age=${options.cacheControl}`;
                    headers['content-type'] = options.contentType;
                }
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["put"])(this.fetch, url.toString(), body, {
                    headers
                });
                return {
                    data: {
                        path: cleanPath,
                        fullPath: data.Key
                    },
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Creates a signed upload URL.
     * Signed upload URLs can be used to upload files to the bucket without further authentication.
     * They are valid for 2 hours.
     * @param path The file path, including the current file name. For example `folder/image.png`.
     * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
     */ createSignedUploadUrl(path, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                let _path = this._getFinalPath(path);
                const headers = Object.assign({}, this.headers);
                if (options === null || options === void 0 ? void 0 : options.upsert) {
                    headers['x-upsert'] = 'true';
                }
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, {
                    headers
                });
                const url = new URL(this.url + data.url);
                const token = url.searchParams.get('token');
                if (!token) {
                    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageError"]('No token returned by API');
                }
                return {
                    data: {
                        signedUrl: url.toString(),
                        path,
                        token
                    },
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Replaces an existing file at the specified path with a new one.
     *
     * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
     * @param fileBody The body of the file to be stored in the bucket.
     */ update(path, fileBody, fileOptions) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
        });
    }
    /**
     * Moves an existing file to a new path in the same bucket.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
     * @param options The destination options.
     */ move(fromPath, toPath, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/move`, {
                    bucketId: this.bucketId,
                    sourceKey: fromPath,
                    destinationKey: toPath,
                    destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Copies an existing file to a new path in the same bucket.
     *
     * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
     * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
     * @param options The destination options.
     */ copy(fromPath, toPath, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/copy`, {
                    bucketId: this.bucketId,
                    sourceKey: fromPath,
                    destinationKey: toPath,
                    destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
                }, {
                    headers: this.headers
                });
                return {
                    data: {
                        path: data.Key
                    },
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
     *
     * @param path The file path, including the current file name. For example `folder/image.png`.
     * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
     * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     * @param options.transform Transform the asset before serving it to the client.
     */ createSignedUrl(path, expiresIn, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                let _path = this._getFinalPath(path);
                let data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({
                    expiresIn
                }, (options === null || options === void 0 ? void 0 : options.transform) ? {
                    transform: options.transform
                } : {}), {
                    headers: this.headers
                });
                const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? '' : options.download}` : '';
                const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
                data = {
                    signedUrl
                };
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
     *
     * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
     * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
     * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     */ createSignedUrls(paths, expiresIn, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/sign/${this.bucketId}`, {
                    expiresIn,
                    paths
                }, {
                    headers: this.headers
                });
                const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? '' : options.download}` : '';
                return {
                    data: data.map((datum)=>Object.assign(Object.assign({}, datum), {
                            signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null
                        })),
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
     *
     * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
     * @param options.transform Transform the asset before serving it to the client.
     */ download(path, options) {
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined';
        const renderPath = wantsTransformation ? 'render/image/authenticated' : 'object';
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        const queryString = transformationQuery ? `?${transformationQuery}` : '';
        const _path = this._getFinalPath(path);
        const downloadFn = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
                headers: this.headers,
                noResolveJson: true
            });
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$BlobDownloadBuilder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](downloadFn, this.shouldThrowOnError);
    }
    /**
     * Retrieves the details of an existing file.
     * @param path
     */ info(path) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            const _path = this._getFinalPath(path);
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.fetch, `${this.url}/object/info/${_path}`, {
                    headers: this.headers
                });
                return {
                    data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["recursiveToCamel"])(data),
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Checks the existence of a file.
     * @param path
     */ exists(path) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            const _path = this._getFinalPath(path);
            try {
                yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["head"])(this.fetch, `${this.url}/object/${_path}`, {
                    headers: this.headers
                });
                return {
                    data: true,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error) && error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageUnknownError"]) {
                    const originalError = error.originalError;
                    if ([
                        400,
                        404
                    ].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
                        return {
                            data: false,
                            error
                        };
                    }
                }
                throw error;
            }
        });
    }
    /**
     * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
     * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
     *
     * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
     * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
     * @param options.transform Transform the asset before serving it to the client.
     */ getPublicUrl(path, options) {
        const _path = this._getFinalPath(path);
        const _queryString = [];
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? '' : options.download}` : '';
        if (downloadQueryParam !== '') {
            _queryString.push(downloadQueryParam);
        }
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined';
        const renderPath = wantsTransformation ? 'render/image' : 'object';
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        if (transformationQuery !== '') {
            _queryString.push(transformationQuery);
        }
        let queryString = _queryString.join('&');
        if (queryString !== '') {
            queryString = `?${queryString}`;
        }
        return {
            data: {
                publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`)
            }
        };
    }
    /**
     * Deletes files within the same bucket
     *
     * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
     */ remove(paths) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remove"])(this.fetch, `${this.url}/object/${this.bucketId}`, {
                    prefixes: paths
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Get file metadata
     * @param id the file id to retrieve metadata
     */ // async getMetadata(
    //   id: string
    // ): Promise<
    //   | {
    //       data: Metadata
    //       error: null
    //     }
    //   | {
    //       data: null
    //       error: StorageError
    //     }
    // > {
    //   try {
    //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
    //     return { data, error: null }
    //   } catch (error) {
    //     if (isStorageError(error)) {
    //       return { data: null, error }
    //     }
    //     throw error
    //   }
    // }
    /**
     * Update file metadata
     * @param id the file id to update metadata
     * @param meta the new file metadata
     */ // async updateMetadata(
    //   id: string,
    //   meta: Metadata
    // ): Promise<
    //   | {
    //       data: Metadata
    //       error: null
    //     }
    //   | {
    //       data: null
    //       error: StorageError
    //     }
    // > {
    //   try {
    //     const data = await post(
    //       this.fetch,
    //       `${this.url}/metadata/${id}`,
    //       { ...meta },
    //       { headers: this.headers }
    //     )
    //     return { data, error: null }
    //   } catch (error) {
    //     if (isStorageError(error)) {
    //       return { data: null, error }
    //     }
    //     throw error
    //   }
    // }
    /**
     * Lists all the files and folders within a path of the bucket.
     * @param path The folder path.
     * @param options Search options including limit (defaults to 100), offset, sortBy, and search
     */ list(path, options, parameters) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), {
                    prefix: path || ''
                });
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, {
                    headers: this.headers
                }, parameters);
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * @experimental this method signature might change in the future
     * @param options search options
     * @param parameters
     */ listV2(options, parameters) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const body = Object.assign({}, options);
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/object/list-v2/${this.bucketId}`, body, {
                    headers: this.headers
                }, parameters);
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    encodeMetadata(metadata) {
        return JSON.stringify(metadata);
    }
    toBase64(data) {
        if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"] !== 'undefined') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Buffer"].from(data).toString('base64');
        }
        return btoa(data);
    }
    _getFinalPath(path) {
        return `${this.bucketId}/${path.replace(/^\/+/, '')}`;
    }
    _removeEmptyFolders(path) {
        return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
    }
    transformOptsToQueryString(transform) {
        const params = [];
        if (transform.width) {
            params.push(`width=${transform.width}`);
        }
        if (transform.height) {
            params.push(`height=${transform.height}`);
        }
        if (transform.resize) {
            params.push(`resize=${transform.resize}`);
        }
        if (transform.format) {
            params.push(`format=${transform.format}`);
        }
        if (transform.quality) {
            params.push(`quality=${transform.quality}`);
        }
        return params.join('&');
    }
} //# sourceMappingURL=StorageFileApi.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/version.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Generated automatically during releases by scripts/update-version-files.ts
// This file provides runtime access to the package version for:
// - HTTP request headers (e.g., X-Client-Info header for API requests)
// - Debugging and support (identifying which version is running)
// - Telemetry and logging (version reporting in errors/analytics)
// - Ensuring build artifacts match the published package version
__turbopack_context__.s([
    "version",
    ()=>version
]);
const version = '2.81.0'; //# sourceMappingURL=version.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_HEADERS",
    ()=>DEFAULT_HEADERS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/version.js [app-client] (ecmascript)");
;
const DEFAULT_HEADERS = {
    'X-Client-Info': `storage-js/${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]}`
}; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StorageBucketApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/helpers.js [app-client] (ecmascript)");
;
;
;
;
;
class StorageBucketApi {
    constructor(url, headers = {}, fetch, opts){
        this.shouldThrowOnError = false;
        const baseUrl = new URL(url);
        // if legacy uri is used, replace with new storage host (disables request buffering to allow > 50GB uploads)
        // "project-ref.supabase.co" becomes "project-ref.storage.supabase.co"
        if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
            const isSupabaseHost = /supabase\.(co|in|red)$/.test(baseUrl.hostname);
            if (isSupabaseHost && !baseUrl.hostname.includes('storage.supabase.')) {
                baseUrl.hostname = baseUrl.hostname.replace('supabase.', 'storage.supabase.');
            }
        }
        this.url = baseUrl.href.replace(/\/$/, '');
        this.headers = Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEADERS"]), headers);
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFetch"])(fetch);
    }
    /**
     * Enable throwing errors instead of returning them.
     */ throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    /**
     * Retrieves the details of all Storage buckets within an existing project.
     */ listBuckets(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const queryString = this.listBucketOptionsToQueryString(options);
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.fetch, `${this.url}/bucket${queryString}`, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves the details of an existing Storage bucket.
     *
     * @param id The unique identifier of the bucket you would like to retrieve.
     */ getBucket(id) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.fetch, `${this.url}/bucket/${id}`, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Creates a new Storage bucket
     *
     * @param id A unique identifier for the bucket you are creating.
     * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
     * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
     * The global file size limit takes precedence over this value.
     * The default value is null, which doesn't set a per bucket file size limit.
     * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
     * The default value is null, which allows files with all mime types to be uploaded.
     * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
     * @returns newly created bucket id
     * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
     *   - default bucket type is `STANDARD`
     */ createBucket(id_1) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, arguments, void 0, function*(id, options = {
            public: false
        }) {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/bucket`, {
                    id,
                    name: id,
                    type: options.type,
                    public: options.public,
                    file_size_limit: options.fileSizeLimit,
                    allowed_mime_types: options.allowedMimeTypes
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Updates a Storage bucket
     *
     * @param id A unique identifier for the bucket you are updating.
     * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
     * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
     * The global file size limit takes precedence over this value.
     * The default value is null, which doesn't set a per bucket file size limit.
     * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
     * The default value is null, which allows files with all mime types to be uploaded.
     * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
     */ updateBucket(id, options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["put"])(this.fetch, `${this.url}/bucket/${id}`, {
                    id,
                    name: id,
                    public: options.public,
                    file_size_limit: options.fileSizeLimit,
                    allowed_mime_types: options.allowedMimeTypes
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Removes all objects inside a single bucket.
     *
     * @param id The unique identifier of the bucket you would like to empty.
     */ emptyBucket(id) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/bucket/${id}/empty`, {}, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
     * You must first `empty()` the bucket.
     *
     * @param id The unique identifier of the bucket you would like to delete.
     */ deleteBucket(id) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remove"])(this.fetch, `${this.url}/bucket/${id}`, {}, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    listBucketOptionsToQueryString(options) {
        const params = {};
        if (options) {
            if ('limit' in options) {
                params.limit = String(options.limit);
            }
            if ('offset' in options) {
                params.offset = String(options.offset);
            }
            if (options.search) {
                params.search = options.search;
            }
            if (options.sortColumn) {
                params.sortColumn = options.sortColumn;
            }
            if (options.sortOrder) {
                params.sortOrder = options.sortOrder;
            }
        }
        return Object.keys(params).length > 0 ? '?' + new URLSearchParams(params).toString() : '';
    }
} //# sourceMappingURL=StorageBucketApi.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StorageAnalyticsApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StorageAnalyticsApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/helpers.js [app-client] (ecmascript)");
;
;
;
;
;
class StorageAnalyticsApi {
    /**
     * Creates a new StorageAnalyticsApi instance
     * @param url - The base URL for the storage API
     * @param headers - HTTP headers to include in requests
     * @param fetch - Optional custom fetch implementation
     */ constructor(url, headers = {}, fetch){
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, '');
        this.headers = Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEADERS"]), headers);
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFetch"])(fetch);
    }
    /**
     * Enable throwing errors instead of returning them in the response
     * When enabled, failed operations will throw instead of returning { data: null, error }
     *
     * @returns This instance for method chaining
     */ throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    /**
     * Creates a new analytics bucket using Iceberg tables
     * Analytics buckets are optimized for analytical queries and data processing
     *
     * @param name A unique name for the bucket you are creating
     * @returns Promise with newly created bucket name or error
     *
     * @example
     * ```typescript
     * const { data, error } = await storage.analytics.createBucket('analytics-data')
     * if (error) {
     *   console.error('Failed to create analytics bucket:', error.message)
     * } else {
     *   console.log('Created bucket:', data.name)
     * }
     * ```
     */ createBucket(name) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/bucket`, {
                    name
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves the details of all Analytics Storage buckets within an existing project
     * Only returns buckets of type 'ANALYTICS'
     *
     * @param options Query parameters for listing buckets
     * @param options.limit Maximum number of buckets to return
     * @param options.offset Number of buckets to skip
     * @param options.sortColumn Column to sort by ('id', 'name', 'created_at', 'updated_at')
     * @param options.sortOrder Sort order ('asc' or 'desc')
     * @param options.search Search term to filter bucket names
     * @returns Promise with list of analytics buckets or error
     *
     * @example
     * ```typescript
     * const { data, error } = await storage.analytics.listBuckets({
     *   limit: 10,
     *   offset: 0,
     *   sortColumn: 'created_at',
     *   sortOrder: 'desc',
     *   search: 'analytics'
     * })
     * if (data) {
     *   console.log('Found analytics buckets:', data.length)
     *   data.forEach(bucket => console.log(`- ${bucket.name}`))
     * }
     * ```
     */ listBuckets(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                // Build query string from options
                const queryParams = new URLSearchParams();
                if ((options === null || options === void 0 ? void 0 : options.limit) !== undefined) queryParams.set('limit', options.limit.toString());
                if ((options === null || options === void 0 ? void 0 : options.offset) !== undefined) queryParams.set('offset', options.offset.toString());
                if (options === null || options === void 0 ? void 0 : options.sortColumn) queryParams.set('sortColumn', options.sortColumn);
                if (options === null || options === void 0 ? void 0 : options.sortOrder) queryParams.set('sortOrder', options.sortOrder);
                if (options === null || options === void 0 ? void 0 : options.search) queryParams.set('search', options.search);
                const queryString = queryParams.toString();
                const url = queryString ? `${this.url}/bucket?${queryString}` : `${this.url}/bucket`;
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["get"])(this.fetch, url, {
                    headers: this.headers
                });
                return {
                    data: data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Deletes an existing analytics bucket
     * A bucket can't be deleted with existing objects inside it
     * You must first empty the bucket before deletion
     *
     * @param bucketId The unique identifier of the bucket you would like to delete
     * @returns Promise with success message or error
     *
     * @example
     * ```typescript
     * const { data, error } = await analyticsApi.deleteBucket('old-analytics-bucket')
     * if (error) {
     *   console.error('Failed to delete bucket:', error.message)
     * } else {
     *   console.log('Bucket deleted successfully:', data.message)
     * }
     * ```
     */ deleteBucket(bucketId) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["remove"])(this.fetch, `${this.url}/bucket/${bucketId}`, {}, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
} //# sourceMappingURL=StorageAnalyticsApi.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_HEADERS",
    ()=>DEFAULT_HEADERS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/version.js [app-client] (ecmascript)");
;
const DEFAULT_HEADERS = {
    'X-Client-Info': `storage-js/${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$version$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["version"]}`,
    'Content-Type': 'application/json'
}; //# sourceMappingURL=constants.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/errors.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Base error class for all Storage Vectors errors
 */ __turbopack_context__.s([
    "StorageVectorsApiError",
    ()=>StorageVectorsApiError,
    "StorageVectorsError",
    ()=>StorageVectorsError,
    "StorageVectorsErrorCode",
    ()=>StorageVectorsErrorCode,
    "StorageVectorsUnknownError",
    ()=>StorageVectorsUnknownError,
    "isStorageVectorsError",
    ()=>isStorageVectorsError
]);
class StorageVectorsError extends Error {
    constructor(message){
        super(message);
        this.__isStorageVectorsError = true;
        this.name = 'StorageVectorsError';
    }
}
function isStorageVectorsError(error) {
    return typeof error === 'object' && error !== null && '__isStorageVectorsError' in error;
}
class StorageVectorsApiError extends StorageVectorsError {
    constructor(message, status, statusCode){
        super(message);
        this.name = 'StorageVectorsApiError';
        this.status = status;
        this.statusCode = statusCode;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            statusCode: this.statusCode
        };
    }
}
class StorageVectorsUnknownError extends StorageVectorsError {
    constructor(message, originalError){
        super(message);
        this.name = 'StorageVectorsUnknownError';
        this.originalError = originalError;
    }
}
var StorageVectorsErrorCode;
(function(StorageVectorsErrorCode) {
    /** Internal server fault (HTTP 500) */ StorageVectorsErrorCode["InternalError"] = "InternalError";
    /** Resource already exists / conflict (HTTP 409) */ StorageVectorsErrorCode["S3VectorConflictException"] = "S3VectorConflictException";
    /** Resource not found (HTTP 404) */ StorageVectorsErrorCode["S3VectorNotFoundException"] = "S3VectorNotFoundException";
    /** Delete bucket while not empty (HTTP 400) */ StorageVectorsErrorCode["S3VectorBucketNotEmpty"] = "S3VectorBucketNotEmpty";
    /** Exceeds bucket quota/limit (HTTP 400) */ StorageVectorsErrorCode["S3VectorMaxBucketsExceeded"] = "S3VectorMaxBucketsExceeded";
    /** Exceeds index quota/limit (HTTP 400) */ StorageVectorsErrorCode["S3VectorMaxIndexesExceeded"] = "S3VectorMaxIndexesExceeded";
})(StorageVectorsErrorCode || (StorageVectorsErrorCode = {})); //# sourceMappingURL=errors.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/helpers.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Resolves the fetch implementation to use
 * Uses custom fetch if provided, otherwise uses native fetch
 *
 * @param customFetch - Optional custom fetch implementation
 * @returns Resolved fetch function
 */ __turbopack_context__.s([
    "isPlainObject",
    ()=>isPlainObject,
    "normalizeToFloat32",
    ()=>normalizeToFloat32,
    "resolveFetch",
    ()=>resolveFetch,
    "resolveResponse",
    ()=>resolveResponse,
    "validateVectorDimension",
    ()=>validateVectorDimension
]);
const resolveFetch = (customFetch)=>{
    if (customFetch) {
        return (...args)=>customFetch(...args);
    }
    return (...args)=>fetch(...args);
};
const resolveResponse = ()=>{
    return Response;
};
const isPlainObject = (value)=>{
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
};
const normalizeToFloat32 = (values)=>{
    // Use Float32Array to ensure proper precision
    return Array.from(new Float32Array(values));
};
const validateVectorDimension = (vector, expectedDimension)=>{
    if (expectedDimension !== undefined && vector.float32.length !== expectedDimension) {
        throw new Error(`Vector dimension mismatch: expected ${expectedDimension}, got ${vector.float32.length}`);
    }
}; //# sourceMappingURL=helpers.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/fetch.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "get",
    ()=>get,
    "post",
    ()=>post,
    "put",
    ()=>put,
    "remove",
    ()=>remove
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/helpers.js [app-client] (ecmascript)");
;
;
;
/**
 * Extracts error message from various error response formats
 * @param err - Error object from API
 * @returns Human-readable error message
 */ const _getErrorMessage = (err)=>err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
/**
 * Handles fetch errors and converts them to StorageVectors error types
 * @param error - The error caught from fetch
 * @param reject - Promise rejection function
 * @param options - Fetch options that may affect error handling
 */ const handleError = (error, reject, options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(void 0, void 0, void 0, function*() {
        // Check if error is a Response-like object (has status and ok properties)
        // This is more reliable than instanceof which can fail across realms
        const isResponseLike = error && typeof error === 'object' && 'status' in error && 'ok' in error && typeof error.status === 'number';
        if (isResponseLike && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
            const status = error.status || 500;
            const responseError = error;
            // Try to parse JSON body if available
            if (typeof responseError.json === 'function') {
                responseError.json().then((err)=>{
                    const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.code) || status + '';
                    reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageVectorsApiError"](_getErrorMessage(err), status, statusCode));
                }).catch(()=>{
                    // If JSON parsing fails, create an ApiError with the HTTP status code
                    const statusCode = status + '';
                    const message = responseError.statusText || `HTTP ${status} error`;
                    reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageVectorsApiError"](message, status, statusCode));
                });
            } else {
                // No json() method available, create error from status
                const statusCode = status + '';
                const message = responseError.statusText || `HTTP ${status} error`;
                reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageVectorsApiError"](message, status, statusCode));
            }
        } else {
            reject(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageVectorsUnknownError"](_getErrorMessage(error), error));
        }
    });
/**
 * Builds request parameters for fetch calls
 * @param method - HTTP method
 * @param options - Custom fetch options
 * @param parameters - Additional fetch parameters like AbortSignal
 * @param body - Request body (will be JSON stringified if plain object)
 * @returns Complete fetch request parameters
 */ const _getRequestParams = (method, options, parameters, body)=>{
    const params = {
        method,
        headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
    };
    if (method === 'GET' || !body) {
        return params;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(body)) {
        params.headers = Object.assign({
            'Content-Type': 'application/json'
        }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
    } else {
        params.body = body;
    }
    return Object.assign(Object.assign({}, params), parameters);
};
/**
 * Internal request handler that wraps fetch with error handling
 * @param fetcher - Fetch function to use
 * @param method - HTTP method
 * @param url - Request URL
 * @param options - Custom fetch options
 * @param parameters - Additional fetch parameters
 * @param body - Request body
 * @returns Promise with parsed response or error
 */ function _handleRequest(fetcher, method, url, options, parameters, body) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return new Promise((resolve, reject)=>{
            fetcher(url, _getRequestParams(method, options, parameters, body)).then((result)=>{
                if (!result.ok) throw result;
                if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
                // Handle empty responses (204, empty body)
                const contentType = result.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    return {};
                }
                return result.json();
            }).then((data)=>resolve(data)).catch((error)=>handleError(error, reject, options));
        });
    });
}
function get(fetcher, url, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'GET', url, options, parameters);
    });
}
function post(fetcher, url, body, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'POST', url, options, parameters, body);
    });
}
function put(fetcher, url, body, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
    });
}
function remove(fetcher, url, body, options, parameters) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
        return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
    });
} //# sourceMappingURL=fetch.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/VectorIndexApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VectorIndexApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/helpers.js [app-client] (ecmascript)");
;
;
;
;
;
class VectorIndexApi {
    constructor(url, headers = {}, fetch){
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, '');
        this.headers = Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEADERS"]), headers);
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFetch"])(fetch);
    }
    /**
     * Enable throwing errors instead of returning them in the response
     * When enabled, failed operations will throw instead of returning { data: null, error }
     *
     * @returns This instance for method chaining
     * @example
     * ```typescript
     * const client = new VectorIndexApi(url, headers)
     * client.throwOnError()
     * const { data } = await client.createIndex(options) // throws on error
     * ```
     */ throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    /**
     * Creates a new vector index within a bucket
     * Defines the schema for vectors including dimensionality, distance metric, and metadata config
     *
     * @param options - Index configuration
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.indexName - Unique name for the index within the bucket
     * @param options.dataType - Data type for vector components (currently only 'float32')
     * @param options.dimension - Dimensionality of vectors (e.g., 384, 768, 1536)
     * @param options.distanceMetric - Similarity metric ('cosine', 'euclidean', 'dotproduct')
     * @param options.metadataConfiguration - Optional config for non-filterable metadata keys
     * @returns Promise with empty response on success or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorConflictException` if index already exists (HTTP 409)
     * - `S3VectorMaxIndexesExceeded` if quota exceeded (HTTP 400)
     * - `S3VectorNotFoundException` if bucket doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { data, error } = await client.createIndex({
     *   vectorBucketName: 'embeddings-prod',
     *   indexName: 'documents-openai-small',
     *   dataType: 'float32',
     *   dimension: 1536,
     *   distanceMetric: 'cosine',
     *   metadataConfiguration: {
     *     nonFilterableMetadataKeys: ['raw_text', 'internal_id']
     *   }
     * })
     * ```
     */ createIndex(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/CreateIndex`, options, {
                    headers: this.headers
                });
                return {
                    data: data || {},
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves metadata for a specific vector index
     * Returns index configuration including dimension, distance metric, and metadata settings
     *
     * @param vectorBucketName - Name of the parent vector bucket
     * @param indexName - Name of the index to retrieve
     * @returns Promise with index metadata or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if index or bucket doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { data, error } = await client.getIndex('embeddings-prod', 'documents-openai-small')
     * if (data) {
     *   console.log('Index dimension:', data.index.dimension)
     *   console.log('Distance metric:', data.index.distanceMetric)
     * }
     * ```
     */ getIndex(vectorBucketName, indexName) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/GetIndex`, {
                    vectorBucketName,
                    indexName
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Lists vector indexes within a bucket with optional filtering and pagination
     * Supports prefix-based filtering and paginated results
     *
     * @param options - Listing options
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.prefix - Filter indexes by name prefix
     * @param options.maxResults - Maximum results per page (default: 100)
     * @param options.nextToken - Pagination token from previous response
     * @returns Promise with list of indexes and pagination token
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if bucket doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * // List all indexes in a bucket
     * const { data, error } = await client.listIndexes({
     *   vectorBucketName: 'embeddings-prod',
     *   prefix: 'documents-'
     * })
     * if (data) {
     *   console.log('Found indexes:', data.indexes.map(i => i.indexName))
     *   // Fetch next page if available
     *   if (data.nextToken) {
     *     const next = await client.listIndexes({
     *       vectorBucketName: 'embeddings-prod',
     *       nextToken: data.nextToken
     *     })
     *   }
     * }
     * ```
     */ listIndexes(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/ListIndexes`, options, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Deletes a vector index and all its data
     * This operation removes the index schema and all vectors stored in the index
     *
     * @param vectorBucketName - Name of the parent vector bucket
     * @param indexName - Name of the index to delete
     * @returns Promise with empty response on success or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if index or bucket doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * // Delete an index and all its vectors
     * const { error } = await client.deleteIndex('embeddings-prod', 'old-index')
     * if (!error) {
     *   console.log('Index deleted successfully')
     * }
     * ```
     */ deleteIndex(vectorBucketName, indexName) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/DeleteIndex`, {
                    vectorBucketName,
                    indexName
                }, {
                    headers: this.headers
                });
                return {
                    data: data || {},
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
} //# sourceMappingURL=VectorIndexApi.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/VectorDataApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VectorDataApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/helpers.js [app-client] (ecmascript)");
;
;
;
;
;
class VectorDataApi {
    constructor(url, headers = {}, fetch){
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, '');
        this.headers = Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEADERS"]), headers);
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFetch"])(fetch);
    }
    /**
     * Enable throwing errors instead of returning them in the response
     * When enabled, failed operations will throw instead of returning { data: null, error }
     *
     * @returns This instance for method chaining
     * @example
     * ```typescript
     * const client = new VectorDataApi(url, headers)
     * client.throwOnError()
     * const { data } = await client.putVectors(options) // throws on error
     * ```
     */ throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    /**
     * Inserts or updates vectors in batch (upsert operation)
     * Accepts 1-500 vectors per request. Larger batches should be split
     *
     * @param options - Vector insertion options
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.indexName - Name of the target index
     * @param options.vectors - Array of vectors to insert/update (1-500 items)
     * @returns Promise with empty response on success or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorConflictException` if duplicate key conflict occurs (HTTP 409)
     * - `S3VectorNotFoundException` if bucket or index doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { data, error } = await client.putVectors({
     *   vectorBucketName: 'embeddings-prod',
     *   indexName: 'documents-openai-small',
     *   vectors: [
     *     {
     *       key: 'doc-1',
     *       data: { float32: [0.1, 0.2, 0.3, ...] }, // 1536 dimensions
     *       metadata: { title: 'Introduction', page: 1 }
     *     },
     *     {
     *       key: 'doc-2',
     *       data: { float32: [0.4, 0.5, 0.6, ...] },
     *       metadata: { title: 'Conclusion', page: 42 }
     *     }
     *   ]
     * })
     * ```
     */ putVectors(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                // Validate batch size
                if (options.vectors.length < 1 || options.vectors.length > 500) {
                    throw new Error('Vector batch size must be between 1 and 500 items');
                }
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/PutVectors`, options, {
                    headers: this.headers
                });
                return {
                    data: data || {},
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves vectors by their keys in batch
     * Optionally includes vector data and/or metadata in response
     * Additional permissions required when returning data or metadata
     *
     * @param options - Vector retrieval options
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.indexName - Name of the index
     * @param options.keys - Array of vector keys to retrieve
     * @param options.returnData - Whether to include vector embeddings (requires permission)
     * @param options.returnMetadata - Whether to include metadata (requires permission)
     * @returns Promise with array of vectors or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if bucket or index doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { data, error } = await client.getVectors({
     *   vectorBucketName: 'embeddings-prod',
     *   indexName: 'documents-openai-small',
     *   keys: ['doc-1', 'doc-2', 'doc-3'],
     *   returnData: false,     // Don't return embeddings
     *   returnMetadata: true   // Return metadata only
     * })
     * if (data) {
     *   data.vectors.forEach(v => console.log(v.key, v.metadata))
     * }
     * ```
     */ getVectors(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/GetVectors`, options, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Lists/scans vectors in an index with pagination
     * Supports parallel scanning via segment configuration for high-throughput scenarios
     * Additional permissions required when returning data or metadata
     *
     * @param options - Vector listing options
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.indexName - Name of the index
     * @param options.maxResults - Maximum results per page (default: 500, max: 1000)
     * @param options.nextToken - Pagination token from previous response
     * @param options.returnData - Whether to include vector embeddings (requires permission)
     * @param options.returnMetadata - Whether to include metadata (requires permission)
     * @param options.segmentCount - Total parallel segments (1-16) for distributed scanning
     * @param options.segmentIndex - Zero-based segment index (0 to segmentCount-1)
     * @returns Promise with array of vectors, pagination token, or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if bucket or index doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * // Simple pagination
     * let nextToken: string | undefined
     * do {
     *   const { data, error } = await client.listVectors({
     *     vectorBucketName: 'embeddings-prod',
     *     indexName: 'documents-openai-small',
     *     maxResults: 500,
     *     nextToken,
     *     returnMetadata: true
     *   })
     *   if (error) break
     *   console.log('Batch:', data.vectors.length)
     *   nextToken = data.nextToken
     * } while (nextToken)
     *
     * // Parallel scanning (4 concurrent workers)
     * const workers = [0, 1, 2, 3].map(async (segmentIndex) => {
     *   const { data } = await client.listVectors({
     *     vectorBucketName: 'embeddings-prod',
     *     indexName: 'documents-openai-small',
     *     segmentCount: 4,
     *     segmentIndex,
     *     returnMetadata: true
     *   })
     *   return data?.vectors || []
     * })
     * const results = await Promise.all(workers)
     * ```
     */ listVectors(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                // Validate segment configuration
                if (options.segmentCount !== undefined) {
                    if (options.segmentCount < 1 || options.segmentCount > 16) {
                        throw new Error('segmentCount must be between 1 and 16');
                    }
                    if (options.segmentIndex !== undefined) {
                        if (options.segmentIndex < 0 || options.segmentIndex >= options.segmentCount) {
                            throw new Error(`segmentIndex must be between 0 and ${options.segmentCount - 1}`);
                        }
                    }
                }
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/ListVectors`, options, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Queries for similar vectors using approximate nearest neighbor (ANN) search
     * Returns top-K most similar vectors based on the configured distance metric
     * Supports optional metadata filtering (requires GetVectors permission)
     *
     * @param options - Query options
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.indexName - Name of the index
     * @param options.queryVector - Query embedding to find similar vectors
     * @param options.topK - Number of nearest neighbors to return (default: 10)
     * @param options.filter - Optional JSON filter for metadata (requires GetVectors permission)
     * @param options.returnDistance - Whether to include similarity distances
     * @param options.returnMetadata - Whether to include metadata (requires GetVectors permission)
     * @returns Promise with array of similar vectors ordered by distance
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if bucket or index doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * // Semantic search with filtering
     * const { data, error } = await client.queryVectors({
     *   vectorBucketName: 'embeddings-prod',
     *   indexName: 'documents-openai-small',
     *   queryVector: { float32: [0.1, 0.2, 0.3, ...] }, // 1536 dimensions
     *   topK: 5,
     *   filter: {
     *     category: 'technical',
     *     published: true
     *   },
     *   returnDistance: true,
     *   returnMetadata: true
     * })
     * if (data) {
     *   data.matches.forEach(match => {
     *     console.log(`${match.key}: distance=${match.distance}`)
     *     console.log('Metadata:', match.metadata)
     *   })
     * }
     * ```
     */ queryVectors(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/QueryVectors`, options, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Deletes vectors by their keys in batch
     * Accepts 1-500 keys per request
     *
     * @param options - Vector deletion options
     * @param options.vectorBucketName - Name of the parent vector bucket
     * @param options.indexName - Name of the index
     * @param options.keys - Array of vector keys to delete (1-500 items)
     * @returns Promise with empty response on success or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if bucket or index doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { error } = await client.deleteVectors({
     *   vectorBucketName: 'embeddings-prod',
     *   indexName: 'documents-openai-small',
     *   keys: ['doc-1', 'doc-2', 'doc-3']
     * })
     * if (!error) {
     *   console.log('Vectors deleted successfully')
     * }
     * ```
     */ deleteVectors(options) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                // Validate batch size
                if (options.keys.length < 1 || options.keys.length > 500) {
                    throw new Error('Keys batch size must be between 1 and 500 items');
                }
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/DeleteVectors`, options, {
                    headers: this.headers
                });
                return {
                    data: data || {},
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
} //# sourceMappingURL=VectorDataApi.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/VectorBucketApi.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>VectorBucketApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/constants.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/errors.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/helpers.js [app-client] (ecmascript)");
;
;
;
;
;
class VectorBucketApi {
    /**
     * Creates a new VectorBucketApi instance
     * @param url - The base URL for the storage vectors API
     * @param headers - HTTP headers to include in requests
     * @param fetch - Optional custom fetch implementation
     */ constructor(url, headers = {}, fetch){
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, '');
        this.headers = Object.assign(Object.assign({}, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_HEADERS"]), headers);
        this.fetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$helpers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveFetch"])(fetch);
    }
    /**
     * Enable throwing errors instead of returning them in the response
     * When enabled, failed operations will throw instead of returning { data: null, error }
     *
     * @returns This instance for method chaining
     * @example
     * ```typescript
     * const client = new VectorBucketApi(url, headers)
     * client.throwOnError()
     * const { data } = await client.createBucket('my-bucket') // throws on error
     * ```
     */ throwOnError() {
        this.shouldThrowOnError = true;
        return this;
    }
    /**
     * Creates a new vector bucket
     * Vector buckets are containers for vector indexes and their data
     *
     * @param vectorBucketName - Unique name for the vector bucket
     * @returns Promise with empty response on success or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorConflictException` if bucket already exists (HTTP 409)
     * - `S3VectorMaxBucketsExceeded` if quota exceeded (HTTP 400)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { data, error } = await client.createBucket('embeddings-prod')
     * if (error) {
     *   console.error('Failed to create bucket:', error.message)
     * }
     * ```
     */ createBucket(vectorBucketName) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/CreateVectorBucket`, {
                    vectorBucketName
                }, {
                    headers: this.headers
                });
                return {
                    data: data || {},
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Retrieves metadata for a specific vector bucket
     * Returns bucket configuration including encryption settings and creation time
     *
     * @param vectorBucketName - Name of the vector bucket to retrieve
     * @returns Promise with bucket metadata or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorNotFoundException` if bucket doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * const { data, error } = await client.getBucket('embeddings-prod')
     * if (data) {
     *   console.log('Bucket created at:', new Date(data.vectorBucket.creationTime! * 1000))
     * }
     * ```
     */ getBucket(vectorBucketName) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/GetVectorBucket`, {
                    vectorBucketName
                }, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Lists vector buckets with optional filtering and pagination
     * Supports prefix-based filtering and paginated results
     *
     * @param options - Listing options
     * @param options.prefix - Filter buckets by name prefix
     * @param options.maxResults - Maximum results per page (default: 100)
     * @param options.nextToken - Pagination token from previous response
     * @returns Promise with list of buckets and pagination token
     *
     * @throws {StorageVectorsApiError} With code:
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * // List all buckets with prefix 'prod-'
     * const { data, error } = await client.listBuckets({ prefix: 'prod-' })
     * if (data) {
     *   console.log('Found buckets:', data.buckets.length)
     *   // Fetch next page if available
     *   if (data.nextToken) {
     *     const next = await client.listBuckets({ nextToken: data.nextToken })
     *   }
     * }
     * ```
     */ listBuckets() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, arguments, void 0, function*(options = {}) {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/ListVectorBuckets`, options, {
                    headers: this.headers
                });
                return {
                    data,
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
    /**
     * Deletes a vector bucket
     * Bucket must be empty before deletion (all indexes must be removed first)
     *
     * @param vectorBucketName - Name of the vector bucket to delete
     * @returns Promise with empty response on success or error
     *
     * @throws {StorageVectorsApiError} With code:
     * - `S3VectorBucketNotEmpty` if bucket contains indexes (HTTP 400)
     * - `S3VectorNotFoundException` if bucket doesn't exist (HTTP 404)
     * - `InternalError` for server errors (HTTP 500)
     *
     * @example
     * ```typescript
     * // Delete all indexes first, then delete bucket
     * const { error } = await client.deleteBucket('old-bucket')
     * if (error?.statusCode === 'S3VectorBucketNotEmpty') {
     *   console.error('Must delete all indexes first')
     * }
     * ```
     */ deleteBucket(vectorBucketName) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            try {
                const data = yield (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["post"])(this.fetch, `${this.url}/DeleteVectorBucket`, {
                    vectorBucketName
                }, {
                    headers: this.headers
                });
                return {
                    data: data || {},
                    error: null
                };
            } catch (error) {
                if (this.shouldThrowOnError) {
                    throw error;
                }
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$errors$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isStorageVectorsError"])(error)) {
                    return {
                        data: null,
                        error
                    };
                }
                throw error;
            }
        });
    }
} //# sourceMappingURL=VectorBucketApi.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/StorageVectorsClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StorageVectorsClient",
    ()=>StorageVectorsClient,
    "VectorBucketScope",
    ()=>VectorBucketScope,
    "VectorIndexScope",
    ()=>VectorIndexScope
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$VectorIndexApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/VectorIndexApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$VectorDataApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/VectorDataApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$VectorBucketApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/VectorBucketApi.js [app-client] (ecmascript)");
;
;
;
;
class StorageVectorsClient extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$VectorBucketApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    constructor(url, options = {}){
        super(url, options.headers || {}, options.fetch);
    }
    /**
     * Access operations for a specific vector bucket
     * Returns a scoped client for index and vector operations within the bucket
     *
     * @param vectorBucketName - Name of the vector bucket
     * @returns Bucket-scoped client with index and vector operations
     *
     * @example
     * ```typescript
     * const bucket = client.bucket('embeddings-prod')
     *
     * // Create an index in this bucket
     * await bucket.createIndex({
     *   indexName: 'documents-openai',
     *   dataType: 'float32',
     *   dimension: 1536,
     *   distanceMetric: 'cosine'
     * })
     *
     * // List indexes in this bucket
     * const { data } = await bucket.listIndexes()
     * ```
     */ from(vectorBucketName) {
        return new VectorBucketScope(this.url, this.headers, vectorBucketName, this.fetch);
    }
}
class VectorBucketScope extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$VectorIndexApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    constructor(url, headers, vectorBucketName, fetch){
        super(url, headers, fetch);
        this.vectorBucketName = vectorBucketName;
    }
    /**
     * Creates a new vector index in this bucket
     * Convenience method that automatically includes the bucket name
     *
     * @param options - Index configuration (vectorBucketName is automatically set)
     * @returns Promise with empty response on success or error
     *
     * @example
     * ```typescript
     * const bucket = client.bucket('embeddings-prod')
     * await bucket.createIndex({
     *   indexName: 'documents-openai',
     *   dataType: 'float32',
     *   dimension: 1536,
     *   distanceMetric: 'cosine',
     *   metadataConfiguration: {
     *     nonFilterableMetadataKeys: ['raw_text']
     *   }
     * })
     * ```
     */ createIndex(options) {
        const _super = Object.create(null, {
            createIndex: {
                get: ()=>super.createIndex
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.createIndex.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName
            }));
        });
    }
    /**
     * Lists indexes in this bucket
     * Convenience method that automatically includes the bucket name
     *
     * @param options - Listing options (vectorBucketName is automatically set)
     * @returns Promise with list of indexes or error
     *
     * @example
     * ```typescript
     * const bucket = client.bucket('embeddings-prod')
     * const { data } = await bucket.listIndexes({ prefix: 'documents-' })
     * ```
     */ listIndexes() {
        const _super = Object.create(null, {
            listIndexes: {
                get: ()=>super.listIndexes
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, arguments, void 0, function*(options = {}) {
            return _super.listIndexes.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName
            }));
        });
    }
    /**
     * Retrieves metadata for a specific index in this bucket
     * Convenience method that automatically includes the bucket name
     *
     * @param indexName - Name of the index to retrieve
     * @returns Promise with index metadata or error
     *
     * @example
     * ```typescript
     * const bucket = client.bucket('embeddings-prod')
     * const { data } = await bucket.getIndex('documents-openai')
     * console.log('Dimension:', data?.index.dimension)
     * ```
     */ getIndex(indexName) {
        const _super = Object.create(null, {
            getIndex: {
                get: ()=>super.getIndex
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.getIndex.call(this, this.vectorBucketName, indexName);
        });
    }
    /**
     * Deletes an index from this bucket
     * Convenience method that automatically includes the bucket name
     *
     * @param indexName - Name of the index to delete
     * @returns Promise with empty response on success or error
     *
     * @example
     * ```typescript
     * const bucket = client.bucket('embeddings-prod')
     * await bucket.deleteIndex('old-index')
     * ```
     */ deleteIndex(indexName) {
        const _super = Object.create(null, {
            deleteIndex: {
                get: ()=>super.deleteIndex
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.deleteIndex.call(this, this.vectorBucketName, indexName);
        });
    }
    /**
     * Access operations for a specific index within this bucket
     * Returns a scoped client for vector data operations
     *
     * @param indexName - Name of the index
     * @returns Index-scoped client with vector data operations
     *
     * @example
     * ```typescript
     * const index = client.bucket('embeddings-prod').index('documents-openai')
     *
     * // Insert vectors
     * await index.putVectors({
     *   vectors: [
     *     { key: 'doc-1', data: { float32: [...] }, metadata: { title: 'Intro' } }
     *   ]
     * })
     *
     * // Query similar vectors
     * const { data } = await index.queryVectors({
     *   queryVector: { float32: [...] },
     *   topK: 5
     * })
     * ```
     */ index(indexName) {
        return new VectorIndexScope(this.url, this.headers, this.vectorBucketName, indexName, this.fetch);
    }
}
class VectorIndexScope extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$VectorDataApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    constructor(url, headers, vectorBucketName, indexName, fetch){
        super(url, headers, fetch);
        this.vectorBucketName = vectorBucketName;
        this.indexName = indexName;
    }
    /**
     * Inserts or updates vectors in this index
     * Convenience method that automatically includes bucket and index names
     *
     * @param options - Vector insertion options (bucket and index names automatically set)
     * @returns Promise with empty response on success or error
     *
     * @example
     * ```typescript
     * const index = client.bucket('embeddings-prod').index('documents-openai')
     * await index.putVectors({
     *   vectors: [
     *     {
     *       key: 'doc-1',
     *       data: { float32: [0.1, 0.2, ...] },
     *       metadata: { title: 'Introduction', page: 1 }
     *     }
     *   ]
     * })
     * ```
     */ putVectors(options) {
        const _super = Object.create(null, {
            putVectors: {
                get: ()=>super.putVectors
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.putVectors.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName,
                indexName: this.indexName
            }));
        });
    }
    /**
     * Retrieves vectors by keys from this index
     * Convenience method that automatically includes bucket and index names
     *
     * @param options - Vector retrieval options (bucket and index names automatically set)
     * @returns Promise with array of vectors or error
     *
     * @example
     * ```typescript
     * const index = client.bucket('embeddings-prod').index('documents-openai')
     * const { data } = await index.getVectors({
     *   keys: ['doc-1', 'doc-2'],
     *   returnMetadata: true
     * })
     * ```
     */ getVectors(options) {
        const _super = Object.create(null, {
            getVectors: {
                get: ()=>super.getVectors
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.getVectors.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName,
                indexName: this.indexName
            }));
        });
    }
    /**
     * Lists vectors in this index with pagination
     * Convenience method that automatically includes bucket and index names
     *
     * @param options - Listing options (bucket and index names automatically set)
     * @returns Promise with array of vectors and pagination token
     *
     * @example
     * ```typescript
     * const index = client.bucket('embeddings-prod').index('documents-openai')
     * const { data } = await index.listVectors({
     *   maxResults: 500,
     *   returnMetadata: true
     * })
     * ```
     */ listVectors() {
        const _super = Object.create(null, {
            listVectors: {
                get: ()=>super.listVectors
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, arguments, void 0, function*(options = {}) {
            return _super.listVectors.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName,
                indexName: this.indexName
            }));
        });
    }
    /**
     * Queries for similar vectors in this index
     * Convenience method that automatically includes bucket and index names
     *
     * @param options - Query options (bucket and index names automatically set)
     * @returns Promise with array of similar vectors ordered by distance
     *
     * @example
     * ```typescript
     * const index = client.bucket('embeddings-prod').index('documents-openai')
     * const { data } = await index.queryVectors({
     *   queryVector: { float32: [0.1, 0.2, ...] },
     *   topK: 5,
     *   filter: { category: 'technical' },
     *   returnDistance: true,
     *   returnMetadata: true
     * })
     * ```
     */ queryVectors(options) {
        const _super = Object.create(null, {
            queryVectors: {
                get: ()=>super.queryVectors
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.queryVectors.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName,
                indexName: this.indexName
            }));
        });
    }
    /**
     * Deletes vectors by keys from this index
     * Convenience method that automatically includes bucket and index names
     *
     * @param options - Deletion options (bucket and index names automatically set)
     * @returns Promise with empty response on success or error
     *
     * @example
     * ```typescript
     * const index = client.bucket('embeddings-prod').index('documents-openai')
     * await index.deleteVectors({
     *   keys: ['doc-1', 'doc-2', 'doc-3']
     * })
     * ```
     */ deleteVectors(options) {
        const _super = Object.create(null, {
            deleteVectors: {
                get: ()=>super.deleteVectors
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tslib$40$2$2e$8$2e$1$2f$node_modules$2f$tslib$2f$tslib$2e$es6$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["__awaiter"])(this, void 0, void 0, function*() {
            return _super.deleteVectors.call(this, Object.assign(Object.assign({}, options), {
                vectorBucketName: this.vectorBucketName,
                indexName: this.indexName
            }));
        });
    }
} //# sourceMappingURL=StorageVectorsClient.js.map
}),
"[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/StorageClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StorageClient",
    ()=>StorageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StorageFileApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StorageBucketApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StorageAnalyticsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/packages/StorageAnalyticsApi.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$StorageVectorsClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+storage-js@2.81.0/node_modules/@supabase/storage-js/dist/module/lib/vectors/StorageVectorsClient.js [app-client] (ecmascript)");
;
;
;
;
class StorageClient extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StorageBucketApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] {
    constructor(url, headers = {}, fetch, opts){
        super(url, headers, fetch, opts);
    }
    /**
     * Perform file operation in a bucket.
     *
     * @param id The bucket id to operate on.
     */ from(id) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StorageFileApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.url, this.headers, id, this.fetch);
    }
    /**
     * Access vector storage operations.
     *
     * @returns A StorageVectorsClient instance configured with the current storage settings.
     */ get vectors() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$lib$2f$vectors$2f$StorageVectorsClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StorageVectorsClient"](this.url + '/vector', {
            headers: this.headers,
            fetch: this.fetch
        });
    }
    /**
     * Access analytics storage operations using Iceberg tables.
     *
     * @returns A StorageAnalyticsApi instance configured with the current storage settings.
     * @example
     * ```typescript
     * const client = createClient(url, key)
     * const analytics = client.storage.analytics
     *
     * // Create an analytics bucket
     * await analytics.createBucket('my-analytics-bucket')
     *
     * // List all analytics buckets
     * const { data: buckets } = await analytics.listBuckets()
     *
     * // Delete an analytics bucket
     * await analytics.deleteBucket('old-analytics-bucket')
     * ```
     */ get analytics() {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$storage$2d$js$40$2$2e$81$2e$0$2f$node_modules$2f40$supabase$2f$storage$2d$js$2f$dist$2f$module$2f$packages$2f$StorageAnalyticsApi$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](this.url + '/iceberg', this.headers, this.fetch);
    }
} //# sourceMappingURL=StorageClient.js.map
}),
]);

//# sourceMappingURL=04148_%40supabase_storage-js_dist_module_49ea02fc._.js.map