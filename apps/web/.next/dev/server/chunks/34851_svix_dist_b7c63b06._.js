module.exports = [
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApplicationInSerializer = void 0;
exports.ApplicationInSerializer = {
    _fromJsonObject (object) {
        return {
            metadata: object["metadata"],
            name: object["name"],
            rateLimit: object["rateLimit"],
            uid: object["uid"]
        };
    },
    _toJsonObject (self) {
        return {
            metadata: self.metadata,
            name: self.name,
            rateLimit: self.rateLimit,
            uid: self.uid
        };
    }
}; //# sourceMappingURL=applicationIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApplicationOutSerializer = void 0;
exports.ApplicationOutSerializer = {
    _fromJsonObject (object) {
        return {
            createdAt: new Date(object["createdAt"]),
            id: object["id"],
            metadata: object["metadata"],
            name: object["name"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"])
        };
    },
    _toJsonObject (self) {
        return {
            createdAt: self.createdAt,
            id: self.id,
            metadata: self.metadata,
            name: self.name,
            rateLimit: self.rateLimit,
            uid: self.uid,
            updatedAt: self.updatedAt
        };
    }
}; //# sourceMappingURL=applicationOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationPatch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApplicationPatchSerializer = void 0;
exports.ApplicationPatchSerializer = {
    _fromJsonObject (object) {
        return {
            metadata: object["metadata"],
            name: object["name"],
            rateLimit: object["rateLimit"],
            uid: object["uid"]
        };
    },
    _toJsonObject (self) {
        return {
            metadata: self.metadata,
            name: self.name,
            rateLimit: self.rateLimit,
            uid: self.uid
        };
    }
}; //# sourceMappingURL=applicationPatch.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseApplicationOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseApplicationOutSerializer = void 0;
const applicationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationOut.js [app-route] (ecmascript)");
exports.ListResponseApplicationOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>applicationOut_1.ApplicationOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>applicationOut_1.ApplicationOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseApplicationOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApiException = void 0;
class ApiException extends Error {
    constructor(code, body, headers){
        super(`HTTP-Code: ${code}\nHeaders: ${JSON.stringify(headers)}`);
        this.code = code;
        this.body = body;
        this.headers = {};
        headers.forEach((value, name)=>{
            this.headers[name] = value;
        });
    }
}
exports.ApiException = ApiException; //# sourceMappingURL=util.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SvixRequest = exports.HttpMethod = exports.LIB_VERSION = void 0;
const util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/util.js [app-route] (ecmascript)");
const uuid_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/uuid@10.0.0/node_modules/uuid/dist/esm-node/index.js [app-route] (ecmascript)");
exports.LIB_VERSION = "1.76.1";
const USER_AGENT = `svix-libs/${exports.LIB_VERSION}/javascript`;
var HttpMethod;
(function(HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["CONNECT"] = "CONNECT";
    HttpMethod["OPTIONS"] = "OPTIONS";
    HttpMethod["TRACE"] = "TRACE";
    HttpMethod["PATCH"] = "PATCH";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
class SvixRequest {
    constructor(method, path){
        this.method = method;
        this.path = path;
        this.queryParams = {};
        this.headerParams = {};
    }
    setPathParam(name, value) {
        const newPath = this.path.replace(`{${name}}`, encodeURIComponent(value));
        if (this.path === newPath) {
            throw new Error(`path parameter ${name} not found`);
        }
        this.path = newPath;
    }
    setQueryParam(name, value) {
        if (value === undefined || value === null) {
            return;
        }
        if (typeof value === "string") {
            this.queryParams[name] = value;
        } else if (typeof value === "boolean" || typeof value === "number") {
            this.queryParams[name] = value.toString();
        } else if (value instanceof Date) {
            this.queryParams[name] = value.toISOString();
        } else if (value instanceof Array) {
            if (value.length > 0) {
                this.queryParams[name] = value.join(",");
            }
        } else {
            const _assert_unreachable = value;
            throw new Error(`query parameter ${name} has unsupported type`);
        }
    }
    setHeaderParam(name, value) {
        if (value === undefined) {
            return;
        }
        this.headerParams[name] = value;
    }
    setBody(value) {
        this.body = JSON.stringify(value);
    }
    send(ctx, parseResponseBody) {
        return __awaiter(this, void 0, void 0, function*() {
            const response = yield this.sendInner(ctx);
            if (response.status == 204) {
                return null;
            }
            const responseBody = yield response.text();
            return parseResponseBody(JSON.parse(responseBody));
        });
    }
    sendNoResponseBody(ctx) {
        return __awaiter(this, void 0, void 0, function*() {
            yield this.sendInner(ctx);
        });
    }
    sendInner(ctx) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function*() {
            const url = new URL(ctx.baseUrl + this.path);
            for (const [name, value] of Object.entries(this.queryParams)){
                url.searchParams.set(name, value);
            }
            if (this.headerParams["idempotency-key"] === undefined && this.method.toUpperCase() === "POST") {
                this.headerParams["idempotency-key"] = "auto_" + (0, uuid_1.v4)();
            }
            const randomId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            if (this.body != null) {
                this.headerParams["content-type"] = "application/json";
            }
            const isCredentialsSupported = "credentials" in Request.prototype;
            const response = yield sendWithRetry(url, {
                method: this.method.toString(),
                body: this.body,
                headers: Object.assign({
                    accept: "application/json, */*;q=0.8",
                    authorization: `Bearer ${ctx.token}`,
                    "user-agent": USER_AGENT,
                    "svix-req-id": randomId.toString()
                }, this.headerParams),
                credentials: isCredentialsSupported ? "same-origin" : undefined,
                signal: ctx.timeout !== undefined ? AbortSignal.timeout(ctx.timeout) : undefined
            }, ctx.retryScheduleInMs, (_a = ctx.retryScheduleInMs) === null || _a === void 0 ? void 0 : _a[0], ((_b = ctx.retryScheduleInMs) === null || _b === void 0 ? void 0 : _b.length) || ctx.numRetries);
            return filterResponseForErrors(response);
        });
    }
}
exports.SvixRequest = SvixRequest;
function filterResponseForErrors(response) {
    return __awaiter(this, void 0, void 0, function*() {
        if (response.status < 300) {
            return response;
        }
        const responseBody = yield response.text();
        if (response.status === 422) {
            throw new util_1.ApiException(response.status, JSON.parse(responseBody), response.headers);
        }
        if (response.status >= 400 && response.status <= 499) {
            throw new util_1.ApiException(response.status, JSON.parse(responseBody), response.headers);
        }
        throw new util_1.ApiException(response.status, responseBody, response.headers);
    });
}
function sendWithRetry(url, init, retryScheduleInMs, nextInterval = 50, triesLeft = 2, retryCount = 1) {
    return __awaiter(this, void 0, void 0, function*() {
        const sleep = (interval)=>new Promise((resolve)=>setTimeout(resolve, interval));
        try {
            const response = yield fetch(url, init);
            if (triesLeft <= 0 || response.status < 500) {
                return response;
            }
        } catch (e) {
            if (triesLeft <= 0) {
                throw e;
            }
        }
        yield sleep(nextInterval);
        init.headers["svix-retry-count"] = retryCount.toString();
        nextInterval = (retryScheduleInMs === null || retryScheduleInMs === void 0 ? void 0 : retryScheduleInMs[retryCount]) || nextInterval * 2;
        return yield sendWithRetry(url, init, retryScheduleInMs, nextInterval, --triesLeft, ++retryCount);
    });
} //# sourceMappingURL=request.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/application.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Application = void 0;
const applicationIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationIn.js [app-route] (ecmascript)");
const applicationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationOut.js [app-route] (ecmascript)");
const applicationPatch_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationPatch.js [app-route] (ecmascript)");
const listResponseApplicationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseApplicationOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Application {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app");
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseApplicationOut_1.ListResponseApplicationOutSerializer._fromJsonObject);
    }
    create(applicationIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(applicationIn_1.ApplicationInSerializer._toJsonObject(applicationIn));
        return request.send(this.requestCtx, applicationOut_1.ApplicationOutSerializer._fromJsonObject);
    }
    getOrCreate(applicationIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app");
        request.setQueryParam("get_if_exists", true);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(applicationIn_1.ApplicationInSerializer._toJsonObject(applicationIn));
        return request.send(this.requestCtx, applicationOut_1.ApplicationOutSerializer._fromJsonObject);
    }
    get(appId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}");
        request.setPathParam("app_id", appId);
        return request.send(this.requestCtx, applicationOut_1.ApplicationOutSerializer._fromJsonObject);
    }
    update(appId, applicationIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/app/{app_id}");
        request.setPathParam("app_id", appId);
        request.setBody(applicationIn_1.ApplicationInSerializer._toJsonObject(applicationIn));
        return request.send(this.requestCtx, applicationOut_1.ApplicationOutSerializer._fromJsonObject);
    }
    delete(appId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/app/{app_id}");
        request.setPathParam("app_id", appId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    patch(appId, applicationPatch) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/api/v1/app/{app_id}");
        request.setPathParam("app_id", appId);
        request.setBody(applicationPatch_1.ApplicationPatchSerializer._toJsonObject(applicationPatch));
        return request.send(this.requestCtx, applicationOut_1.ApplicationOutSerializer._fromJsonObject);
    }
}
exports.Application = Application; //# sourceMappingURL=application.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalCapability.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppPortalCapabilitySerializer = exports.AppPortalCapability = void 0;
var AppPortalCapability;
(function(AppPortalCapability) {
    AppPortalCapability["ViewBase"] = "ViewBase";
    AppPortalCapability["ViewEndpointSecret"] = "ViewEndpointSecret";
    AppPortalCapability["ManageEndpointSecret"] = "ManageEndpointSecret";
    AppPortalCapability["ManageTransformations"] = "ManageTransformations";
    AppPortalCapability["CreateAttempts"] = "CreateAttempts";
    AppPortalCapability["ManageEndpoint"] = "ManageEndpoint";
})(AppPortalCapability = exports.AppPortalCapability || (exports.AppPortalCapability = {}));
exports.AppPortalCapabilitySerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=appPortalCapability.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalAccessIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppPortalAccessInSerializer = void 0;
const appPortalCapability_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalCapability.js [app-route] (ecmascript)");
const applicationIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationIn.js [app-route] (ecmascript)");
exports.AppPortalAccessInSerializer = {
    _fromJsonObject (object) {
        var _a;
        return {
            application: object["application"] ? applicationIn_1.ApplicationInSerializer._fromJsonObject(object["application"]) : undefined,
            capabilities: (_a = object["capabilities"]) === null || _a === void 0 ? void 0 : _a.map((item)=>appPortalCapability_1.AppPortalCapabilitySerializer._fromJsonObject(item)),
            expiry: object["expiry"],
            featureFlags: object["featureFlags"],
            readOnly: object["readOnly"],
            sessionId: object["sessionId"]
        };
    },
    _toJsonObject (self) {
        var _a;
        return {
            application: self.application ? applicationIn_1.ApplicationInSerializer._toJsonObject(self.application) : undefined,
            capabilities: (_a = self.capabilities) === null || _a === void 0 ? void 0 : _a.map((item)=>appPortalCapability_1.AppPortalCapabilitySerializer._toJsonObject(item)),
            expiry: self.expiry,
            featureFlags: self.featureFlags,
            readOnly: self.readOnly,
            sessionId: self.sessionId
        };
    }
}; //# sourceMappingURL=appPortalAccessIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalAccessOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppPortalAccessOutSerializer = void 0;
exports.AppPortalAccessOutSerializer = {
    _fromJsonObject (object) {
        return {
            token: object["token"],
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            token: self.token,
            url: self.url
        };
    }
}; //# sourceMappingURL=appPortalAccessOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationTokenExpireIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ApplicationTokenExpireInSerializer = void 0;
exports.ApplicationTokenExpireInSerializer = {
    _fromJsonObject (object) {
        return {
            expiry: object["expiry"],
            sessionIds: object["sessionIds"]
        };
    },
    _toJsonObject (self) {
        return {
            expiry: self.expiry,
            sessionIds: self.sessionIds
        };
    }
}; //# sourceMappingURL=applicationTokenExpireIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/dashboardAccessOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DashboardAccessOutSerializer = void 0;
exports.DashboardAccessOutSerializer = {
    _fromJsonObject (object) {
        return {
            token: object["token"],
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            token: self.token,
            url: self.url
        };
    }
}; //# sourceMappingURL=dashboardAccessOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/authentication.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Authentication = void 0;
const appPortalAccessIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalAccessIn.js [app-route] (ecmascript)");
const appPortalAccessOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalAccessOut.js [app-route] (ecmascript)");
const applicationTokenExpireIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationTokenExpireIn.js [app-route] (ecmascript)");
const dashboardAccessOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/dashboardAccessOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Authentication {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    appPortalAccess(appId, appPortalAccessIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/auth/app-portal-access/{app_id}");
        request.setPathParam("app_id", appId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(appPortalAccessIn_1.AppPortalAccessInSerializer._toJsonObject(appPortalAccessIn));
        return request.send(this.requestCtx, appPortalAccessOut_1.AppPortalAccessOutSerializer._fromJsonObject);
    }
    expireAll(appId, applicationTokenExpireIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/auth/app/{app_id}/expire-all");
        request.setPathParam("app_id", appId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(applicationTokenExpireIn_1.ApplicationTokenExpireInSerializer._toJsonObject(applicationTokenExpireIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    dashboardAccess(appId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/auth/dashboard-access/{app_id}");
        request.setPathParam("app_id", appId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.send(this.requestCtx, dashboardAccessOut_1.DashboardAccessOutSerializer._fromJsonObject);
    }
    logout(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/auth/logout");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.Authentication = Authentication; //# sourceMappingURL=authentication.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BackgroundTaskStatusSerializer = exports.BackgroundTaskStatus = void 0;
var BackgroundTaskStatus;
(function(BackgroundTaskStatus) {
    BackgroundTaskStatus["Running"] = "running";
    BackgroundTaskStatus["Finished"] = "finished";
    BackgroundTaskStatus["Failed"] = "failed";
})(BackgroundTaskStatus = exports.BackgroundTaskStatus || (exports.BackgroundTaskStatus = {}));
exports.BackgroundTaskStatusSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=backgroundTaskStatus.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BackgroundTaskTypeSerializer = exports.BackgroundTaskType = void 0;
var BackgroundTaskType;
(function(BackgroundTaskType) {
    BackgroundTaskType["EndpointReplay"] = "endpoint.replay";
    BackgroundTaskType["EndpointRecover"] = "endpoint.recover";
    BackgroundTaskType["ApplicationStats"] = "application.stats";
    BackgroundTaskType["MessageBroadcast"] = "message.broadcast";
    BackgroundTaskType["SdkGenerate"] = "sdk.generate";
    BackgroundTaskType["EventTypeAggregate"] = "event-type.aggregate";
    BackgroundTaskType["ApplicationPurgeContent"] = "application.purge_content";
})(BackgroundTaskType = exports.BackgroundTaskType || (exports.BackgroundTaskType = {}));
exports.BackgroundTaskTypeSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=backgroundTaskType.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BackgroundTaskOutSerializer = void 0;
const backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
const backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
exports.BackgroundTaskOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"],
            id: object["id"],
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._fromJsonObject(object["status"]),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._fromJsonObject(object["task"])
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data,
            id: self.id,
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._toJsonObject(self.status),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._toJsonObject(self.task)
        };
    }
}; //# sourceMappingURL=backgroundTaskOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseBackgroundTaskOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseBackgroundTaskOutSerializer = void 0;
const backgroundTaskOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskOut.js [app-route] (ecmascript)");
exports.ListResponseBackgroundTaskOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>backgroundTaskOut_1.BackgroundTaskOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>backgroundTaskOut_1.BackgroundTaskOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseBackgroundTaskOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/backgroundTask.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BackgroundTask = void 0;
const backgroundTaskOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskOut.js [app-route] (ecmascript)");
const listResponseBackgroundTaskOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseBackgroundTaskOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class BackgroundTask {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/background-task");
        request.setQueryParam("status", options === null || options === void 0 ? void 0 : options.status);
        request.setQueryParam("task", options === null || options === void 0 ? void 0 : options.task);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseBackgroundTaskOut_1.ListResponseBackgroundTaskOutSerializer._fromJsonObject);
    }
    listByEndpoint(options) {
        return this.list(options);
    }
    get(taskId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/background-task/{task_id}");
        request.setPathParam("task_id", taskId);
        return request.send(this.requestCtx, backgroundTaskOut_1.BackgroundTaskOutSerializer._fromJsonObject);
    }
}
exports.BackgroundTask = BackgroundTask; //# sourceMappingURL=backgroundTask.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointHeadersIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointHeadersInSerializer = void 0;
exports.EndpointHeadersInSerializer = {
    _fromJsonObject (object) {
        return {
            headers: object["headers"]
        };
    },
    _toJsonObject (self) {
        return {
            headers: self.headers
        };
    }
}; //# sourceMappingURL=endpointHeadersIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointHeadersOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointHeadersOutSerializer = void 0;
exports.EndpointHeadersOutSerializer = {
    _fromJsonObject (object) {
        return {
            headers: object["headers"],
            sensitive: object["sensitive"]
        };
    },
    _toJsonObject (self) {
        return {
            headers: self.headers,
            sensitive: self.sensitive
        };
    }
}; //# sourceMappingURL=endpointHeadersOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointHeadersPatchIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointHeadersPatchInSerializer = void 0;
exports.EndpointHeadersPatchInSerializer = {
    _fromJsonObject (object) {
        return {
            deleteHeaders: object["deleteHeaders"],
            headers: object["headers"]
        };
    },
    _toJsonObject (self) {
        return {
            deleteHeaders: self.deleteHeaders,
            headers: self.headers
        };
    }
}; //# sourceMappingURL=endpointHeadersPatchIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointInSerializer = void 0;
exports.EndpointInSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            headers: object["headers"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            secret: object["secret"],
            uid: object["uid"],
            url: object["url"],
            version: object["version"]
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            headers: self.headers,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            secret: self.secret,
            uid: self.uid,
            url: self.url,
            version: self.version
        };
    }
}; //# sourceMappingURL=endpointIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointOutSerializer = void 0;
exports.EndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            createdAt: new Date(object["createdAt"]),
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            id: object["id"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"]),
            url: object["url"],
            version: object["version"]
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            createdAt: self.createdAt,
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            id: self.id,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            uid: self.uid,
            updatedAt: self.updatedAt,
            url: self.url,
            version: self.version
        };
    }
}; //# sourceMappingURL=endpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointPatch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointPatchSerializer = void 0;
exports.EndpointPatchSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            secret: object["secret"],
            uid: object["uid"],
            url: object["url"],
            version: object["version"]
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            secret: self.secret,
            uid: self.uid,
            url: self.url,
            version: self.version
        };
    }
}; //# sourceMappingURL=endpointPatch.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointSecretOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointSecretOutSerializer = void 0;
exports.EndpointSecretOutSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=endpointSecretOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointSecretRotateIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointSecretRotateInSerializer = void 0;
exports.EndpointSecretRotateInSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=endpointSecretRotateIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointStats.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointStatsSerializer = void 0;
exports.EndpointStatsSerializer = {
    _fromJsonObject (object) {
        return {
            fail: object["fail"],
            pending: object["pending"],
            sending: object["sending"],
            success: object["success"]
        };
    },
    _toJsonObject (self) {
        return {
            fail: self.fail,
            pending: self.pending,
            sending: self.sending,
            success: self.success
        };
    }
}; //# sourceMappingURL=endpointStats.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointTransformationIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointTransformationInSerializer = void 0;
exports.EndpointTransformationInSerializer = {
    _fromJsonObject (object) {
        return {
            code: object["code"],
            enabled: object["enabled"]
        };
    },
    _toJsonObject (self) {
        return {
            code: self.code,
            enabled: self.enabled
        };
    }
}; //# sourceMappingURL=endpointTransformationIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointTransformationOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointTransformationOutSerializer = void 0;
exports.EndpointTransformationOutSerializer = {
    _fromJsonObject (object) {
        return {
            code: object["code"],
            enabled: object["enabled"]
        };
    },
    _toJsonObject (self) {
        return {
            code: self.code,
            enabled: self.enabled
        };
    }
}; //# sourceMappingURL=endpointTransformationOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointTransformationPatch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointTransformationPatchSerializer = void 0;
exports.EndpointTransformationPatchSerializer = {
    _fromJsonObject (object) {
        return {
            code: object["code"],
            enabled: object["enabled"]
        };
    },
    _toJsonObject (self) {
        return {
            code: self.code,
            enabled: self.enabled
        };
    }
}; //# sourceMappingURL=endpointTransformationPatch.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointUpdate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointUpdateSerializer = void 0;
exports.EndpointUpdateSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            url: object["url"],
            version: object["version"]
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            uid: self.uid,
            url: self.url,
            version: self.version
        };
    }
}; //# sourceMappingURL=endpointUpdate.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventExampleIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventExampleInSerializer = void 0;
exports.EventExampleInSerializer = {
    _fromJsonObject (object) {
        return {
            eventType: object["eventType"],
            exampleIndex: object["exampleIndex"]
        };
    },
    _toJsonObject (self) {
        return {
            eventType: self.eventType,
            exampleIndex: self.exampleIndex
        };
    }
}; //# sourceMappingURL=eventExampleIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseEndpointOutSerializer = void 0;
const endpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointOut.js [app-route] (ecmascript)");
exports.ListResponseEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>endpointOut_1.EndpointOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>endpointOut_1.EndpointOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageOutSerializer = void 0;
exports.MessageOutSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            eventId: object["eventId"],
            eventType: object["eventType"],
            id: object["id"],
            payload: object["payload"],
            tags: object["tags"],
            timestamp: new Date(object["timestamp"])
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            eventId: self.eventId,
            eventType: self.eventType,
            id: self.id,
            payload: self.payload,
            tags: self.tags,
            timestamp: self.timestamp
        };
    }
}; //# sourceMappingURL=messageOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/recoverIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecoverInSerializer = void 0;
exports.RecoverInSerializer = {
    _fromJsonObject (object) {
        return {
            since: new Date(object["since"]),
            until: object["until"] ? new Date(object["until"]) : null
        };
    },
    _toJsonObject (self) {
        return {
            since: self.since,
            until: self.until
        };
    }
}; //# sourceMappingURL=recoverIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/recoverOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecoverOutSerializer = void 0;
const backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
const backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
exports.RecoverOutSerializer = {
    _fromJsonObject (object) {
        return {
            id: object["id"],
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._fromJsonObject(object["status"]),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._fromJsonObject(object["task"])
        };
    },
    _toJsonObject (self) {
        return {
            id: self.id,
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._toJsonObject(self.status),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._toJsonObject(self.task)
        };
    }
}; //# sourceMappingURL=recoverOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/replayIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReplayInSerializer = void 0;
exports.ReplayInSerializer = {
    _fromJsonObject (object) {
        return {
            since: new Date(object["since"]),
            until: object["until"] ? new Date(object["until"]) : null
        };
    },
    _toJsonObject (self) {
        return {
            since: self.since,
            until: self.until
        };
    }
}; //# sourceMappingURL=replayIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/replayOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ReplayOutSerializer = void 0;
const backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
const backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
exports.ReplayOutSerializer = {
    _fromJsonObject (object) {
        return {
            id: object["id"],
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._fromJsonObject(object["status"]),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._fromJsonObject(object["task"])
        };
    },
    _toJsonObject (self) {
        return {
            id: self.id,
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._toJsonObject(self.status),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._toJsonObject(self.task)
        };
    }
}; //# sourceMappingURL=replayOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/endpoint.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Endpoint = void 0;
const endpointHeadersIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointHeadersIn.js [app-route] (ecmascript)");
const endpointHeadersOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointHeadersOut.js [app-route] (ecmascript)");
const endpointHeadersPatchIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointHeadersPatchIn.js [app-route] (ecmascript)");
const endpointIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointIn.js [app-route] (ecmascript)");
const endpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointOut.js [app-route] (ecmascript)");
const endpointPatch_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointPatch.js [app-route] (ecmascript)");
const endpointSecretOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointSecretOut.js [app-route] (ecmascript)");
const endpointSecretRotateIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointSecretRotateIn.js [app-route] (ecmascript)");
const endpointStats_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointStats.js [app-route] (ecmascript)");
const endpointTransformationIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointTransformationIn.js [app-route] (ecmascript)");
const endpointTransformationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointTransformationOut.js [app-route] (ecmascript)");
const endpointTransformationPatch_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointTransformationPatch.js [app-route] (ecmascript)");
const endpointUpdate_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointUpdate.js [app-route] (ecmascript)");
const eventExampleIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventExampleIn.js [app-route] (ecmascript)");
const listResponseEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseEndpointOut.js [app-route] (ecmascript)");
const messageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageOut.js [app-route] (ecmascript)");
const recoverIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/recoverIn.js [app-route] (ecmascript)");
const recoverOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/recoverOut.js [app-route] (ecmascript)");
const replayIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/replayIn.js [app-route] (ecmascript)");
const replayOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/replayOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Endpoint {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(appId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint");
        request.setPathParam("app_id", appId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseEndpointOut_1.ListResponseEndpointOutSerializer._fromJsonObject);
    }
    create(appId, endpointIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint");
        request.setPathParam("app_id", appId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(endpointIn_1.EndpointInSerializer._toJsonObject(endpointIn));
        return request.send(this.requestCtx, endpointOut_1.EndpointOutSerializer._fromJsonObject);
    }
    get(appId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, endpointOut_1.EndpointOutSerializer._fromJsonObject);
    }
    update(appId, endpointId, endpointUpdate) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(endpointUpdate_1.EndpointUpdateSerializer._toJsonObject(endpointUpdate));
        return request.send(this.requestCtx, endpointOut_1.EndpointOutSerializer._fromJsonObject);
    }
    delete(appId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    patch(appId, endpointId, endpointPatch) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(endpointPatch_1.EndpointPatchSerializer._toJsonObject(endpointPatch));
        return request.send(this.requestCtx, endpointOut_1.EndpointOutSerializer._fromJsonObject);
    }
    getHeaders(appId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, endpointHeadersOut_1.EndpointHeadersOutSerializer._fromJsonObject);
    }
    updateHeaders(appId, endpointId, endpointHeadersIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(endpointHeadersIn_1.EndpointHeadersInSerializer._toJsonObject(endpointHeadersIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    headersUpdate(appId, endpointId, endpointHeadersIn) {
        return this.updateHeaders(appId, endpointId, endpointHeadersIn);
    }
    patchHeaders(appId, endpointId, endpointHeadersPatchIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/headers");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(endpointHeadersPatchIn_1.EndpointHeadersPatchInSerializer._toJsonObject(endpointHeadersPatchIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    headersPatch(appId, endpointId, endpointHeadersPatchIn) {
        return this.patchHeaders(appId, endpointId, endpointHeadersPatchIn);
    }
    recover(appId, endpointId, recoverIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/recover");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(recoverIn_1.RecoverInSerializer._toJsonObject(recoverIn));
        return request.send(this.requestCtx, recoverOut_1.RecoverOutSerializer._fromJsonObject);
    }
    replayMissing(appId, endpointId, replayIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/replay-missing");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(replayIn_1.ReplayInSerializer._toJsonObject(replayIn));
        return request.send(this.requestCtx, replayOut_1.ReplayOutSerializer._fromJsonObject);
    }
    getSecret(appId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, endpointSecretOut_1.EndpointSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(appId, endpointId, endpointSecretRotateIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/secret/rotate");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(endpointSecretRotateIn_1.EndpointSecretRotateInSerializer._toJsonObject(endpointSecretRotateIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    sendExample(appId, endpointId, eventExampleIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/send-example");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(eventExampleIn_1.EventExampleInSerializer._toJsonObject(eventExampleIn));
        return request.send(this.requestCtx, messageOut_1.MessageOutSerializer._fromJsonObject);
    }
    getStats(appId, endpointId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/stats");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setQueryParam("since", options === null || options === void 0 ? void 0 : options.since);
        request.setQueryParam("until", options === null || options === void 0 ? void 0 : options.until);
        return request.send(this.requestCtx, endpointStats_1.EndpointStatsSerializer._fromJsonObject);
    }
    transformationGet(appId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, endpointTransformationOut_1.EndpointTransformationOutSerializer._fromJsonObject);
    }
    patchTransformation(appId, endpointId, endpointTransformationPatch) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(endpointTransformationPatch_1.EndpointTransformationPatchSerializer._toJsonObject(endpointTransformationPatch));
        return request.sendNoResponseBody(this.requestCtx);
    }
    transformationPartialUpdate(appId, endpointId, endpointTransformationIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/transformation");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(endpointTransformationIn_1.EndpointTransformationInSerializer._toJsonObject(endpointTransformationIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.Endpoint = Endpoint; //# sourceMappingURL=endpoint.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorKind.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConnectorKindSerializer = exports.ConnectorKind = void 0;
var ConnectorKind;
(function(ConnectorKind) {
    ConnectorKind["Custom"] = "Custom";
    ConnectorKind["CloseCrm"] = "CloseCRM";
    ConnectorKind["CustomerIo"] = "CustomerIO";
    ConnectorKind["Discord"] = "Discord";
    ConnectorKind["Hubspot"] = "Hubspot";
    ConnectorKind["Inngest"] = "Inngest";
    ConnectorKind["Loops"] = "Loops";
    ConnectorKind["Resend"] = "Resend";
    ConnectorKind["Salesforce"] = "Salesforce";
    ConnectorKind["Segment"] = "Segment";
    ConnectorKind["Sendgrid"] = "Sendgrid";
    ConnectorKind["Slack"] = "Slack";
    ConnectorKind["Teams"] = "Teams";
    ConnectorKind["TriggerDev"] = "TriggerDev";
    ConnectorKind["Windmill"] = "Windmill";
    ConnectorKind["Zapier"] = "Zapier";
})(ConnectorKind = exports.ConnectorKind || (exports.ConnectorKind = {}));
exports.ConnectorKindSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=connectorKind.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConnectorInSerializer = void 0;
const connectorKind_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorKind.js [app-route] (ecmascript)");
exports.ConnectorInSerializer = {
    _fromJsonObject (object) {
        return {
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            filterTypes: object["filterTypes"],
            instructions: object["instructions"],
            instructionsLink: object["instructionsLink"],
            kind: object["kind"] ? connectorKind_1.ConnectorKindSerializer._fromJsonObject(object["kind"]) : undefined,
            logo: object["logo"],
            name: object["name"],
            transformation: object["transformation"]
        };
    },
    _toJsonObject (self) {
        return {
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            filterTypes: self.filterTypes,
            instructions: self.instructions,
            instructionsLink: self.instructionsLink,
            kind: self.kind ? connectorKind_1.ConnectorKindSerializer._toJsonObject(self.kind) : undefined,
            logo: self.logo,
            name: self.name,
            transformation: self.transformation
        };
    }
}; //# sourceMappingURL=connectorIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeInSerializer = void 0;
exports.EventTypeInSerializer = {
    _fromJsonObject (object) {
        return {
            archived: object["archived"],
            deprecated: object["deprecated"],
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            groupName: object["groupName"],
            name: object["name"],
            schemas: object["schemas"]
        };
    },
    _toJsonObject (self) {
        return {
            archived: self.archived,
            deprecated: self.deprecated,
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            groupName: self.groupName,
            name: self.name,
            schemas: self.schemas
        };
    }
}; //# sourceMappingURL=eventTypeIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/environmentIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnvironmentInSerializer = void 0;
const connectorIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorIn.js [app-route] (ecmascript)");
const eventTypeIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeIn.js [app-route] (ecmascript)");
exports.EnvironmentInSerializer = {
    _fromJsonObject (object) {
        var _a, _b;
        return {
            connectors: (_a = object["connectors"]) === null || _a === void 0 ? void 0 : _a.map((item)=>connectorIn_1.ConnectorInSerializer._fromJsonObject(item)),
            eventTypes: (_b = object["eventTypes"]) === null || _b === void 0 ? void 0 : _b.map((item)=>eventTypeIn_1.EventTypeInSerializer._fromJsonObject(item)),
            settings: object["settings"]
        };
    },
    _toJsonObject (self) {
        var _a, _b;
        return {
            connectors: (_a = self.connectors) === null || _a === void 0 ? void 0 : _a.map((item)=>connectorIn_1.ConnectorInSerializer._toJsonObject(item)),
            eventTypes: (_b = self.eventTypes) === null || _b === void 0 ? void 0 : _b.map((item)=>eventTypeIn_1.EventTypeInSerializer._toJsonObject(item)),
            settings: self.settings
        };
    }
}; //# sourceMappingURL=environmentIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConnectorOutSerializer = void 0;
const connectorKind_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorKind.js [app-route] (ecmascript)");
exports.ConnectorOutSerializer = {
    _fromJsonObject (object) {
        return {
            createdAt: new Date(object["createdAt"]),
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            filterTypes: object["filterTypes"],
            id: object["id"],
            instructions: object["instructions"],
            instructionsLink: object["instructionsLink"],
            kind: connectorKind_1.ConnectorKindSerializer._fromJsonObject(object["kind"]),
            logo: object["logo"],
            name: object["name"],
            orgId: object["orgId"],
            transformation: object["transformation"],
            updatedAt: new Date(object["updatedAt"])
        };
    },
    _toJsonObject (self) {
        return {
            createdAt: self.createdAt,
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            filterTypes: self.filterTypes,
            id: self.id,
            instructions: self.instructions,
            instructionsLink: self.instructionsLink,
            kind: connectorKind_1.ConnectorKindSerializer._toJsonObject(self.kind),
            logo: self.logo,
            name: self.name,
            orgId: self.orgId,
            transformation: self.transformation,
            updatedAt: self.updatedAt
        };
    }
}; //# sourceMappingURL=connectorOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeOutSerializer = void 0;
exports.EventTypeOutSerializer = {
    _fromJsonObject (object) {
        return {
            archived: object["archived"],
            createdAt: new Date(object["createdAt"]),
            deprecated: object["deprecated"],
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            groupName: object["groupName"],
            name: object["name"],
            schemas: object["schemas"],
            updatedAt: new Date(object["updatedAt"])
        };
    },
    _toJsonObject (self) {
        return {
            archived: self.archived,
            createdAt: self.createdAt,
            deprecated: self.deprecated,
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            groupName: self.groupName,
            name: self.name,
            schemas: self.schemas,
            updatedAt: self.updatedAt
        };
    }
}; //# sourceMappingURL=eventTypeOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/environmentOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnvironmentOutSerializer = void 0;
const connectorOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorOut.js [app-route] (ecmascript)");
const eventTypeOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeOut.js [app-route] (ecmascript)");
exports.EnvironmentOutSerializer = {
    _fromJsonObject (object) {
        return {
            createdAt: new Date(object["createdAt"]),
            eventTypes: object["eventTypes"].map((item)=>eventTypeOut_1.EventTypeOutSerializer._fromJsonObject(item)),
            settings: object["settings"],
            transformationTemplates: object["transformationTemplates"].map((item)=>connectorOut_1.ConnectorOutSerializer._fromJsonObject(item)),
            version: object["version"]
        };
    },
    _toJsonObject (self) {
        return {
            createdAt: self.createdAt,
            eventTypes: self.eventTypes.map((item)=>eventTypeOut_1.EventTypeOutSerializer._toJsonObject(item)),
            settings: self.settings,
            transformationTemplates: self.transformationTemplates.map((item)=>connectorOut_1.ConnectorOutSerializer._toJsonObject(item)),
            version: self.version
        };
    }
}; //# sourceMappingURL=environmentOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/environment.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Environment = void 0;
const environmentIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/environmentIn.js [app-route] (ecmascript)");
const environmentOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/environmentOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Environment {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    export(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/environment/export");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.send(this.requestCtx, environmentOut_1.EnvironmentOutSerializer._fromJsonObject);
    }
    import(environmentIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/environment/import");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(environmentIn_1.EnvironmentInSerializer._toJsonObject(environmentIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.Environment = Environment; //# sourceMappingURL=environment.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeImportOpenApiIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeImportOpenApiInSerializer = void 0;
exports.EventTypeImportOpenApiInSerializer = {
    _fromJsonObject (object) {
        return {
            dryRun: object["dryRun"],
            replaceAll: object["replaceAll"],
            spec: object["spec"],
            specRaw: object["specRaw"]
        };
    },
    _toJsonObject (self) {
        return {
            dryRun: self.dryRun,
            replaceAll: self.replaceAll,
            spec: self.spec,
            specRaw: self.specRaw
        };
    }
}; //# sourceMappingURL=eventTypeImportOpenApiIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeFromOpenApi.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeFromOpenApiSerializer = void 0;
exports.EventTypeFromOpenApiSerializer = {
    _fromJsonObject (object) {
        return {
            deprecated: object["deprecated"],
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            groupName: object["groupName"],
            name: object["name"],
            schemas: object["schemas"]
        };
    },
    _toJsonObject (self) {
        return {
            deprecated: self.deprecated,
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            groupName: self.groupName,
            name: self.name,
            schemas: self.schemas
        };
    }
}; //# sourceMappingURL=eventTypeFromOpenApi.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeImportOpenApiOutData.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeImportOpenApiOutDataSerializer = void 0;
const eventTypeFromOpenApi_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeFromOpenApi.js [app-route] (ecmascript)");
exports.EventTypeImportOpenApiOutDataSerializer = {
    _fromJsonObject (object) {
        var _a;
        return {
            modified: object["modified"],
            toModify: (_a = object["to_modify"]) === null || _a === void 0 ? void 0 : _a.map((item)=>eventTypeFromOpenApi_1.EventTypeFromOpenApiSerializer._fromJsonObject(item))
        };
    },
    _toJsonObject (self) {
        var _a;
        return {
            modified: self.modified,
            to_modify: (_a = self.toModify) === null || _a === void 0 ? void 0 : _a.map((item)=>eventTypeFromOpenApi_1.EventTypeFromOpenApiSerializer._toJsonObject(item))
        };
    }
}; //# sourceMappingURL=eventTypeImportOpenApiOutData.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeImportOpenApiOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeImportOpenApiOutSerializer = void 0;
const eventTypeImportOpenApiOutData_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeImportOpenApiOutData.js [app-route] (ecmascript)");
exports.EventTypeImportOpenApiOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: eventTypeImportOpenApiOutData_1.EventTypeImportOpenApiOutDataSerializer._fromJsonObject(object["data"])
        };
    },
    _toJsonObject (self) {
        return {
            data: eventTypeImportOpenApiOutData_1.EventTypeImportOpenApiOutDataSerializer._toJsonObject(self.data)
        };
    }
}; //# sourceMappingURL=eventTypeImportOpenApiOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypePatch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypePatchSerializer = void 0;
exports.EventTypePatchSerializer = {
    _fromJsonObject (object) {
        return {
            archived: object["archived"],
            deprecated: object["deprecated"],
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            groupName: object["groupName"],
            schemas: object["schemas"]
        };
    },
    _toJsonObject (self) {
        return {
            archived: self.archived,
            deprecated: self.deprecated,
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            groupName: self.groupName,
            schemas: self.schemas
        };
    }
}; //# sourceMappingURL=eventTypePatch.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeUpdate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventTypeUpdateSerializer = void 0;
exports.EventTypeUpdateSerializer = {
    _fromJsonObject (object) {
        return {
            archived: object["archived"],
            deprecated: object["deprecated"],
            description: object["description"],
            featureFlag: object["featureFlag"],
            featureFlags: object["featureFlags"],
            groupName: object["groupName"],
            schemas: object["schemas"]
        };
    },
    _toJsonObject (self) {
        return {
            archived: self.archived,
            deprecated: self.deprecated,
            description: self.description,
            featureFlag: self.featureFlag,
            featureFlags: self.featureFlags,
            groupName: self.groupName,
            schemas: self.schemas
        };
    }
}; //# sourceMappingURL=eventTypeUpdate.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseEventTypeOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseEventTypeOutSerializer = void 0;
const eventTypeOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeOut.js [app-route] (ecmascript)");
exports.ListResponseEventTypeOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>eventTypeOut_1.EventTypeOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>eventTypeOut_1.EventTypeOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseEventTypeOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/eventType.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventType = void 0;
const eventTypeImportOpenApiIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeImportOpenApiIn.js [app-route] (ecmascript)");
const eventTypeImportOpenApiOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeImportOpenApiOut.js [app-route] (ecmascript)");
const eventTypeIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeIn.js [app-route] (ecmascript)");
const eventTypeOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeOut.js [app-route] (ecmascript)");
const eventTypePatch_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypePatch.js [app-route] (ecmascript)");
const eventTypeUpdate_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/eventTypeUpdate.js [app-route] (ecmascript)");
const listResponseEventTypeOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseEventTypeOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class EventType {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/event-type");
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        request.setQueryParam("include_archived", options === null || options === void 0 ? void 0 : options.includeArchived);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        return request.send(this.requestCtx, listResponseEventTypeOut_1.ListResponseEventTypeOutSerializer._fromJsonObject);
    }
    create(eventTypeIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/event-type");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(eventTypeIn_1.EventTypeInSerializer._toJsonObject(eventTypeIn));
        return request.send(this.requestCtx, eventTypeOut_1.EventTypeOutSerializer._fromJsonObject);
    }
    importOpenapi(eventTypeImportOpenApiIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/event-type/import/openapi");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(eventTypeImportOpenApiIn_1.EventTypeImportOpenApiInSerializer._toJsonObject(eventTypeImportOpenApiIn));
        return request.send(this.requestCtx, eventTypeImportOpenApiOut_1.EventTypeImportOpenApiOutSerializer._fromJsonObject);
    }
    get(eventTypeName) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/event-type/{event_type_name}");
        request.setPathParam("event_type_name", eventTypeName);
        return request.send(this.requestCtx, eventTypeOut_1.EventTypeOutSerializer._fromJsonObject);
    }
    update(eventTypeName, eventTypeUpdate) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/event-type/{event_type_name}");
        request.setPathParam("event_type_name", eventTypeName);
        request.setBody(eventTypeUpdate_1.EventTypeUpdateSerializer._toJsonObject(eventTypeUpdate));
        return request.send(this.requestCtx, eventTypeOut_1.EventTypeOutSerializer._fromJsonObject);
    }
    delete(eventTypeName, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/event-type/{event_type_name}");
        request.setPathParam("event_type_name", eventTypeName);
        request.setQueryParam("expunge", options === null || options === void 0 ? void 0 : options.expunge);
        return request.sendNoResponseBody(this.requestCtx);
    }
    patch(eventTypeName, eventTypePatch) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/api/v1/event-type/{event_type_name}");
        request.setPathParam("event_type_name", eventTypeName);
        request.setBody(eventTypePatch_1.EventTypePatchSerializer._toJsonObject(eventTypePatch));
        return request.send(this.requestCtx, eventTypeOut_1.EventTypeOutSerializer._fromJsonObject);
    }
}
exports.EventType = EventType; //# sourceMappingURL=eventType.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/health.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Health = void 0;
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Health {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    get() {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/health");
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.Health = Health; //# sourceMappingURL=health.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceConsumerPortalAccessIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestSourceConsumerPortalAccessInSerializer = void 0;
exports.IngestSourceConsumerPortalAccessInSerializer = {
    _fromJsonObject (object) {
        return {
            expiry: object["expiry"],
            readOnly: object["readOnly"]
        };
    },
    _toJsonObject (self) {
        return {
            expiry: self.expiry,
            readOnly: self.readOnly
        };
    }
}; //# sourceMappingURL=ingestSourceConsumerPortalAccessIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointHeadersIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointHeadersInSerializer = void 0;
exports.IngestEndpointHeadersInSerializer = {
    _fromJsonObject (object) {
        return {
            headers: object["headers"]
        };
    },
    _toJsonObject (self) {
        return {
            headers: self.headers
        };
    }
}; //# sourceMappingURL=ingestEndpointHeadersIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointHeadersOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointHeadersOutSerializer = void 0;
exports.IngestEndpointHeadersOutSerializer = {
    _fromJsonObject (object) {
        return {
            headers: object["headers"],
            sensitive: object["sensitive"]
        };
    },
    _toJsonObject (self) {
        return {
            headers: self.headers,
            sensitive: self.sensitive
        };
    }
}; //# sourceMappingURL=ingestEndpointHeadersOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointInSerializer = void 0;
exports.IngestEndpointInSerializer = {
    _fromJsonObject (object) {
        return {
            description: object["description"],
            disabled: object["disabled"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            secret: object["secret"],
            uid: object["uid"],
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            description: self.description,
            disabled: self.disabled,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            secret: self.secret,
            uid: self.uid,
            url: self.url
        };
    }
}; //# sourceMappingURL=ingestEndpointIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointOutSerializer = void 0;
exports.IngestEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            createdAt: new Date(object["createdAt"]),
            description: object["description"],
            disabled: object["disabled"],
            id: object["id"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"]),
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            createdAt: self.createdAt,
            description: self.description,
            disabled: self.disabled,
            id: self.id,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            uid: self.uid,
            updatedAt: self.updatedAt,
            url: self.url
        };
    }
}; //# sourceMappingURL=ingestEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointSecretIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointSecretInSerializer = void 0;
exports.IngestEndpointSecretInSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=ingestEndpointSecretIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointSecretOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointSecretOutSerializer = void 0;
exports.IngestEndpointSecretOutSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=ingestEndpointSecretOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointTransformationOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointTransformationOutSerializer = void 0;
exports.IngestEndpointTransformationOutSerializer = {
    _fromJsonObject (object) {
        return {
            code: object["code"],
            enabled: object["enabled"]
        };
    },
    _toJsonObject (self) {
        return {
            code: self.code,
            enabled: self.enabled
        };
    }
}; //# sourceMappingURL=ingestEndpointTransformationOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointTransformationPatch.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointTransformationPatchSerializer = void 0;
exports.IngestEndpointTransformationPatchSerializer = {
    _fromJsonObject (object) {
        return {
            code: object["code"],
            enabled: object["enabled"]
        };
    },
    _toJsonObject (self) {
        return {
            code: self.code,
            enabled: self.enabled
        };
    }
}; //# sourceMappingURL=ingestEndpointTransformationPatch.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointUpdate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpointUpdateSerializer = void 0;
exports.IngestEndpointUpdateSerializer = {
    _fromJsonObject (object) {
        return {
            description: object["description"],
            disabled: object["disabled"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            description: self.description,
            disabled: self.disabled,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            uid: self.uid,
            url: self.url
        };
    }
}; //# sourceMappingURL=ingestEndpointUpdate.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseIngestEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseIngestEndpointOutSerializer = void 0;
const ingestEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointOut.js [app-route] (ecmascript)");
exports.ListResponseIngestEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>ingestEndpointOut_1.IngestEndpointOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>ingestEndpointOut_1.IngestEndpointOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseIngestEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/ingestEndpoint.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestEndpoint = void 0;
const ingestEndpointHeadersIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointHeadersIn.js [app-route] (ecmascript)");
const ingestEndpointHeadersOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointHeadersOut.js [app-route] (ecmascript)");
const ingestEndpointIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointIn.js [app-route] (ecmascript)");
const ingestEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointOut.js [app-route] (ecmascript)");
const ingestEndpointSecretIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointSecretIn.js [app-route] (ecmascript)");
const ingestEndpointSecretOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointSecretOut.js [app-route] (ecmascript)");
const ingestEndpointTransformationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointTransformationOut.js [app-route] (ecmascript)");
const ingestEndpointTransformationPatch_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointTransformationPatch.js [app-route] (ecmascript)");
const ingestEndpointUpdate_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestEndpointUpdate.js [app-route] (ecmascript)");
const listResponseIngestEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseIngestEndpointOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class IngestEndpoint {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(sourceId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint");
        request.setPathParam("source_id", sourceId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseIngestEndpointOut_1.ListResponseIngestEndpointOutSerializer._fromJsonObject);
    }
    create(sourceId, ingestEndpointIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/endpoint");
        request.setPathParam("source_id", sourceId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(ingestEndpointIn_1.IngestEndpointInSerializer._toJsonObject(ingestEndpointIn));
        return request.send(this.requestCtx, ingestEndpointOut_1.IngestEndpointOutSerializer._fromJsonObject);
    }
    get(sourceId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, ingestEndpointOut_1.IngestEndpointOutSerializer._fromJsonObject);
    }
    update(sourceId, endpointId, ingestEndpointUpdate) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(ingestEndpointUpdate_1.IngestEndpointUpdateSerializer._toJsonObject(ingestEndpointUpdate));
        return request.send(this.requestCtx, ingestEndpointOut_1.IngestEndpointOutSerializer._fromJsonObject);
    }
    delete(sourceId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    getHeaders(sourceId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/headers");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, ingestEndpointHeadersOut_1.IngestEndpointHeadersOutSerializer._fromJsonObject);
    }
    updateHeaders(sourceId, endpointId, ingestEndpointHeadersIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/headers");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(ingestEndpointHeadersIn_1.IngestEndpointHeadersInSerializer._toJsonObject(ingestEndpointHeadersIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    getSecret(sourceId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/secret");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, ingestEndpointSecretOut_1.IngestEndpointSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(sourceId, endpointId, ingestEndpointSecretIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/secret/rotate");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(ingestEndpointSecretIn_1.IngestEndpointSecretInSerializer._toJsonObject(ingestEndpointSecretIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    getTransformation(sourceId, endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/transformation");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, ingestEndpointTransformationOut_1.IngestEndpointTransformationOutSerializer._fromJsonObject);
    }
    setTransformation(sourceId, endpointId, ingestEndpointTransformationPatch) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PATCH, "/ingest/api/v1/source/{source_id}/endpoint/{endpoint_id}/transformation");
        request.setPathParam("source_id", sourceId);
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(ingestEndpointTransformationPatch_1.IngestEndpointTransformationPatchSerializer._toJsonObject(ingestEndpointTransformationPatch));
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.IngestEndpoint = IngestEndpoint; //# sourceMappingURL=ingestEndpoint.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/adobeSignConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AdobeSignConfigSerializer = void 0;
exports.AdobeSignConfigSerializer = {
    _fromJsonObject (object) {
        return {
            clientId: object["clientId"]
        };
    },
    _toJsonObject (self) {
        return {
            clientId: self.clientId
        };
    }
}; //# sourceMappingURL=adobeSignConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/airwallexConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AirwallexConfigSerializer = void 0;
exports.AirwallexConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=airwallexConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/checkbookConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CheckbookConfigSerializer = void 0;
exports.CheckbookConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=checkbookConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/cronConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CronConfigSerializer = void 0;
exports.CronConfigSerializer = {
    _fromJsonObject (object) {
        return {
            contentType: object["contentType"],
            payload: object["payload"],
            schedule: object["schedule"]
        };
    },
    _toJsonObject (self) {
        return {
            contentType: self.contentType,
            payload: self.payload,
            schedule: self.schedule
        };
    }
}; //# sourceMappingURL=cronConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/docusignConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DocusignConfigSerializer = void 0;
exports.DocusignConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=docusignConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/easypostConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EasypostConfigSerializer = void 0;
exports.EasypostConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=easypostConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/githubConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GithubConfigSerializer = void 0;
exports.GithubConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=githubConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/hubspotConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HubspotConfigSerializer = void 0;
exports.HubspotConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=hubspotConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/orumIoConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrumIoConfigSerializer = void 0;
exports.OrumIoConfigSerializer = {
    _fromJsonObject (object) {
        return {
            publicKey: object["publicKey"]
        };
    },
    _toJsonObject (self) {
        return {
            publicKey: self.publicKey
        };
    }
}; //# sourceMappingURL=orumIoConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pandaDocConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PandaDocConfigSerializer = void 0;
exports.PandaDocConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=pandaDocConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/portIoConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PortIoConfigSerializer = void 0;
exports.PortIoConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=portIoConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/rutterConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RutterConfigSerializer = void 0;
exports.RutterConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=rutterConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/segmentConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SegmentConfigSerializer = void 0;
exports.SegmentConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=segmentConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/shopifyConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShopifyConfigSerializer = void 0;
exports.ShopifyConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=shopifyConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/slackConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlackConfigSerializer = void 0;
exports.SlackConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=slackConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/stripeConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StripeConfigSerializer = void 0;
exports.StripeConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=stripeConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/svixConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SvixConfigSerializer = void 0;
exports.SvixConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=svixConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/telnyxConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TelnyxConfigSerializer = void 0;
exports.TelnyxConfigSerializer = {
    _fromJsonObject (object) {
        return {
            publicKey: object["publicKey"]
        };
    },
    _toJsonObject (self) {
        return {
            publicKey: self.publicKey
        };
    }
}; //# sourceMappingURL=telnyxConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/vapiConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VapiConfigSerializer = void 0;
exports.VapiConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=vapiConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/veriffConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VeriffConfigSerializer = void 0;
exports.VeriffConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=veriffConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/zoomConfig.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ZoomConfigSerializer = void 0;
exports.ZoomConfigSerializer = {
    _fromJsonObject (object) {
        return {
            secret: object["secret"]
        };
    },
    _toJsonObject (self) {
        return {
            secret: self.secret
        };
    }
}; //# sourceMappingURL=zoomConfig.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestSourceInSerializer = void 0;
const adobeSignConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/adobeSignConfig.js [app-route] (ecmascript)");
const airwallexConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/airwallexConfig.js [app-route] (ecmascript)");
const checkbookConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/checkbookConfig.js [app-route] (ecmascript)");
const cronConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/cronConfig.js [app-route] (ecmascript)");
const docusignConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/docusignConfig.js [app-route] (ecmascript)");
const easypostConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/easypostConfig.js [app-route] (ecmascript)");
const githubConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/githubConfig.js [app-route] (ecmascript)");
const hubspotConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/hubspotConfig.js [app-route] (ecmascript)");
const orumIoConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/orumIoConfig.js [app-route] (ecmascript)");
const pandaDocConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pandaDocConfig.js [app-route] (ecmascript)");
const portIoConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/portIoConfig.js [app-route] (ecmascript)");
const rutterConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/rutterConfig.js [app-route] (ecmascript)");
const segmentConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/segmentConfig.js [app-route] (ecmascript)");
const shopifyConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/shopifyConfig.js [app-route] (ecmascript)");
const slackConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/slackConfig.js [app-route] (ecmascript)");
const stripeConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/stripeConfig.js [app-route] (ecmascript)");
const svixConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/svixConfig.js [app-route] (ecmascript)");
const telnyxConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/telnyxConfig.js [app-route] (ecmascript)");
const vapiConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/vapiConfig.js [app-route] (ecmascript)");
const veriffConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/veriffConfig.js [app-route] (ecmascript)");
const zoomConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/zoomConfig.js [app-route] (ecmascript)");
exports.IngestSourceInSerializer = {
    _fromJsonObject (object) {
        const type = object["type"];
        function getConfig(type) {
            switch(type){
                case "generic-webhook":
                    return {};
                case "cron":
                    return cronConfig_1.CronConfigSerializer._fromJsonObject(object["config"]);
                case "adobe-sign":
                    return adobeSignConfig_1.AdobeSignConfigSerializer._fromJsonObject(object["config"]);
                case "beehiiv":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "brex":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "checkbook":
                    return checkbookConfig_1.CheckbookConfigSerializer._fromJsonObject(object["config"]);
                case "clerk":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "docusign":
                    return docusignConfig_1.DocusignConfigSerializer._fromJsonObject(object["config"]);
                case "easypost":
                    return easypostConfig_1.EasypostConfigSerializer._fromJsonObject(object["config"]);
                case "github":
                    return githubConfig_1.GithubConfigSerializer._fromJsonObject(object["config"]);
                case "guesty":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "hubspot":
                    return hubspotConfig_1.HubspotConfigSerializer._fromJsonObject(object["config"]);
                case "incident-io":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "lithic":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "nash":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "orum-io":
                    return orumIoConfig_1.OrumIoConfigSerializer._fromJsonObject(object["config"]);
                case "panda-doc":
                    return pandaDocConfig_1.PandaDocConfigSerializer._fromJsonObject(object["config"]);
                case "port-io":
                    return portIoConfig_1.PortIoConfigSerializer._fromJsonObject(object["config"]);
                case "pleo":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "replicate":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "resend":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "rutter":
                    return rutterConfig_1.RutterConfigSerializer._fromJsonObject(object["config"]);
                case "safebase":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "sardine":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "segment":
                    return segmentConfig_1.SegmentConfigSerializer._fromJsonObject(object["config"]);
                case "shopify":
                    return shopifyConfig_1.ShopifyConfigSerializer._fromJsonObject(object["config"]);
                case "slack":
                    return slackConfig_1.SlackConfigSerializer._fromJsonObject(object["config"]);
                case "stripe":
                    return stripeConfig_1.StripeConfigSerializer._fromJsonObject(object["config"]);
                case "stych":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "svix":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "zoom":
                    return zoomConfig_1.ZoomConfigSerializer._fromJsonObject(object["config"]);
                case "telnyx":
                    return telnyxConfig_1.TelnyxConfigSerializer._fromJsonObject(object["config"]);
                case "vapi":
                    return vapiConfig_1.VapiConfigSerializer._fromJsonObject(object["config"]);
                case "open-ai":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "render":
                    return svixConfig_1.SvixConfigSerializer._fromJsonObject(object["config"]);
                case "veriff":
                    return veriffConfig_1.VeriffConfigSerializer._fromJsonObject(object["config"]);
                case "airwallex":
                    return airwallexConfig_1.AirwallexConfigSerializer._fromJsonObject(object["config"]);
                default:
                    throw new Error(`Unexpected type: ${type}`);
            }
        }
        return {
            type,
            config: getConfig(type),
            metadata: object["metadata"],
            name: object["name"],
            uid: object["uid"]
        };
    },
    _toJsonObject (self) {
        let config;
        switch(self.type){
            case "generic-webhook":
                config = {};
                break;
            case "cron":
                config = cronConfig_1.CronConfigSerializer._toJsonObject(self.config);
                break;
            case "adobe-sign":
                config = adobeSignConfig_1.AdobeSignConfigSerializer._toJsonObject(self.config);
                break;
            case "beehiiv":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "brex":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "checkbook":
                config = checkbookConfig_1.CheckbookConfigSerializer._toJsonObject(self.config);
                break;
            case "clerk":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "docusign":
                config = docusignConfig_1.DocusignConfigSerializer._toJsonObject(self.config);
                break;
            case "easypost":
                config = easypostConfig_1.EasypostConfigSerializer._toJsonObject(self.config);
                break;
            case "github":
                config = githubConfig_1.GithubConfigSerializer._toJsonObject(self.config);
                break;
            case "guesty":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "hubspot":
                config = hubspotConfig_1.HubspotConfigSerializer._toJsonObject(self.config);
                break;
            case "incident-io":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "lithic":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "nash":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "orum-io":
                config = orumIoConfig_1.OrumIoConfigSerializer._toJsonObject(self.config);
                break;
            case "panda-doc":
                config = pandaDocConfig_1.PandaDocConfigSerializer._toJsonObject(self.config);
                break;
            case "port-io":
                config = portIoConfig_1.PortIoConfigSerializer._toJsonObject(self.config);
                break;
            case "pleo":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "replicate":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "resend":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "rutter":
                config = rutterConfig_1.RutterConfigSerializer._toJsonObject(self.config);
                break;
            case "safebase":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "sardine":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "segment":
                config = segmentConfig_1.SegmentConfigSerializer._toJsonObject(self.config);
                break;
            case "shopify":
                config = shopifyConfig_1.ShopifyConfigSerializer._toJsonObject(self.config);
                break;
            case "slack":
                config = slackConfig_1.SlackConfigSerializer._toJsonObject(self.config);
                break;
            case "stripe":
                config = stripeConfig_1.StripeConfigSerializer._toJsonObject(self.config);
                break;
            case "stych":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "svix":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "zoom":
                config = zoomConfig_1.ZoomConfigSerializer._toJsonObject(self.config);
                break;
            case "telnyx":
                config = telnyxConfig_1.TelnyxConfigSerializer._toJsonObject(self.config);
                break;
            case "vapi":
                config = vapiConfig_1.VapiConfigSerializer._toJsonObject(self.config);
                break;
            case "open-ai":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "render":
                config = svixConfig_1.SvixConfigSerializer._toJsonObject(self.config);
                break;
            case "veriff":
                config = veriffConfig_1.VeriffConfigSerializer._toJsonObject(self.config);
                break;
            case "airwallex":
                config = airwallexConfig_1.AirwallexConfigSerializer._toJsonObject(self.config);
                break;
        }
        return {
            type: self.type,
            config: config,
            metadata: self.metadata,
            name: self.name,
            uid: self.uid
        };
    }
}; //# sourceMappingURL=ingestSourceIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/adobeSignConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AdobeSignConfigOutSerializer = void 0;
exports.AdobeSignConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=adobeSignConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/airwallexConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AirwallexConfigOutSerializer = void 0;
exports.AirwallexConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=airwallexConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/checkbookConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CheckbookConfigOutSerializer = void 0;
exports.CheckbookConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=checkbookConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/docusignConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DocusignConfigOutSerializer = void 0;
exports.DocusignConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=docusignConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/easypostConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EasypostConfigOutSerializer = void 0;
exports.EasypostConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=easypostConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/githubConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GithubConfigOutSerializer = void 0;
exports.GithubConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=githubConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/hubspotConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HubspotConfigOutSerializer = void 0;
exports.HubspotConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=hubspotConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/orumIoConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrumIoConfigOutSerializer = void 0;
exports.OrumIoConfigOutSerializer = {
    _fromJsonObject (object) {
        return {
            publicKey: object["publicKey"]
        };
    },
    _toJsonObject (self) {
        return {
            publicKey: self.publicKey
        };
    }
}; //# sourceMappingURL=orumIoConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pandaDocConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PandaDocConfigOutSerializer = void 0;
exports.PandaDocConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=pandaDocConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/portIoConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PortIoConfigOutSerializer = void 0;
exports.PortIoConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=portIoConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/rutterConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RutterConfigOutSerializer = void 0;
exports.RutterConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=rutterConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/segmentConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SegmentConfigOutSerializer = void 0;
exports.SegmentConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=segmentConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/shopifyConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShopifyConfigOutSerializer = void 0;
exports.ShopifyConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=shopifyConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/slackConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SlackConfigOutSerializer = void 0;
exports.SlackConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=slackConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/stripeConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StripeConfigOutSerializer = void 0;
exports.StripeConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=stripeConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/svixConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SvixConfigOutSerializer = void 0;
exports.SvixConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=svixConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/telnyxConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TelnyxConfigOutSerializer = void 0;
exports.TelnyxConfigOutSerializer = {
    _fromJsonObject (object) {
        return {
            publicKey: object["publicKey"]
        };
    },
    _toJsonObject (self) {
        return {
            publicKey: self.publicKey
        };
    }
}; //# sourceMappingURL=telnyxConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/vapiConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VapiConfigOutSerializer = void 0;
exports.VapiConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=vapiConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/veriffConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.VeriffConfigOutSerializer = void 0;
exports.VeriffConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=veriffConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/zoomConfigOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ZoomConfigOutSerializer = void 0;
exports.ZoomConfigOutSerializer = {
    _fromJsonObject (object) {
        return {};
    },
    _toJsonObject (self) {
        return {};
    }
}; //# sourceMappingURL=zoomConfigOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestSourceOutSerializer = void 0;
const adobeSignConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/adobeSignConfigOut.js [app-route] (ecmascript)");
const airwallexConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/airwallexConfigOut.js [app-route] (ecmascript)");
const checkbookConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/checkbookConfigOut.js [app-route] (ecmascript)");
const cronConfig_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/cronConfig.js [app-route] (ecmascript)");
const docusignConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/docusignConfigOut.js [app-route] (ecmascript)");
const easypostConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/easypostConfigOut.js [app-route] (ecmascript)");
const githubConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/githubConfigOut.js [app-route] (ecmascript)");
const hubspotConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/hubspotConfigOut.js [app-route] (ecmascript)");
const orumIoConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/orumIoConfigOut.js [app-route] (ecmascript)");
const pandaDocConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pandaDocConfigOut.js [app-route] (ecmascript)");
const portIoConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/portIoConfigOut.js [app-route] (ecmascript)");
const rutterConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/rutterConfigOut.js [app-route] (ecmascript)");
const segmentConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/segmentConfigOut.js [app-route] (ecmascript)");
const shopifyConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/shopifyConfigOut.js [app-route] (ecmascript)");
const slackConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/slackConfigOut.js [app-route] (ecmascript)");
const stripeConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/stripeConfigOut.js [app-route] (ecmascript)");
const svixConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/svixConfigOut.js [app-route] (ecmascript)");
const telnyxConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/telnyxConfigOut.js [app-route] (ecmascript)");
const vapiConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/vapiConfigOut.js [app-route] (ecmascript)");
const veriffConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/veriffConfigOut.js [app-route] (ecmascript)");
const zoomConfigOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/zoomConfigOut.js [app-route] (ecmascript)");
exports.IngestSourceOutSerializer = {
    _fromJsonObject (object) {
        const type = object["type"];
        function getConfig(type) {
            switch(type){
                case "generic-webhook":
                    return {};
                case "cron":
                    return cronConfig_1.CronConfigSerializer._fromJsonObject(object["config"]);
                case "adobe-sign":
                    return adobeSignConfigOut_1.AdobeSignConfigOutSerializer._fromJsonObject(object["config"]);
                case "beehiiv":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "brex":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "checkbook":
                    return checkbookConfigOut_1.CheckbookConfigOutSerializer._fromJsonObject(object["config"]);
                case "clerk":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "docusign":
                    return docusignConfigOut_1.DocusignConfigOutSerializer._fromJsonObject(object["config"]);
                case "easypost":
                    return easypostConfigOut_1.EasypostConfigOutSerializer._fromJsonObject(object["config"]);
                case "github":
                    return githubConfigOut_1.GithubConfigOutSerializer._fromJsonObject(object["config"]);
                case "guesty":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "hubspot":
                    return hubspotConfigOut_1.HubspotConfigOutSerializer._fromJsonObject(object["config"]);
                case "incident-io":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "lithic":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "nash":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "orum-io":
                    return orumIoConfigOut_1.OrumIoConfigOutSerializer._fromJsonObject(object["config"]);
                case "panda-doc":
                    return pandaDocConfigOut_1.PandaDocConfigOutSerializer._fromJsonObject(object["config"]);
                case "port-io":
                    return portIoConfigOut_1.PortIoConfigOutSerializer._fromJsonObject(object["config"]);
                case "pleo":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "replicate":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "resend":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "rutter":
                    return rutterConfigOut_1.RutterConfigOutSerializer._fromJsonObject(object["config"]);
                case "safebase":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "sardine":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "segment":
                    return segmentConfigOut_1.SegmentConfigOutSerializer._fromJsonObject(object["config"]);
                case "shopify":
                    return shopifyConfigOut_1.ShopifyConfigOutSerializer._fromJsonObject(object["config"]);
                case "slack":
                    return slackConfigOut_1.SlackConfigOutSerializer._fromJsonObject(object["config"]);
                case "stripe":
                    return stripeConfigOut_1.StripeConfigOutSerializer._fromJsonObject(object["config"]);
                case "stych":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "svix":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "zoom":
                    return zoomConfigOut_1.ZoomConfigOutSerializer._fromJsonObject(object["config"]);
                case "telnyx":
                    return telnyxConfigOut_1.TelnyxConfigOutSerializer._fromJsonObject(object["config"]);
                case "vapi":
                    return vapiConfigOut_1.VapiConfigOutSerializer._fromJsonObject(object["config"]);
                case "open-ai":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "render":
                    return svixConfigOut_1.SvixConfigOutSerializer._fromJsonObject(object["config"]);
                case "veriff":
                    return veriffConfigOut_1.VeriffConfigOutSerializer._fromJsonObject(object["config"]);
                case "airwallex":
                    return airwallexConfigOut_1.AirwallexConfigOutSerializer._fromJsonObject(object["config"]);
                default:
                    throw new Error(`Unexpected type: ${type}`);
            }
        }
        return {
            type,
            config: getConfig(type),
            createdAt: new Date(object["createdAt"]),
            id: object["id"],
            ingestUrl: object["ingestUrl"],
            metadata: object["metadata"],
            name: object["name"],
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"])
        };
    },
    _toJsonObject (self) {
        let config;
        switch(self.type){
            case "generic-webhook":
                config = {};
                break;
            case "cron":
                config = cronConfig_1.CronConfigSerializer._toJsonObject(self.config);
                break;
            case "adobe-sign":
                config = adobeSignConfigOut_1.AdobeSignConfigOutSerializer._toJsonObject(self.config);
                break;
            case "beehiiv":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "brex":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "checkbook":
                config = checkbookConfigOut_1.CheckbookConfigOutSerializer._toJsonObject(self.config);
                break;
            case "clerk":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "docusign":
                config = docusignConfigOut_1.DocusignConfigOutSerializer._toJsonObject(self.config);
                break;
            case "easypost":
                config = easypostConfigOut_1.EasypostConfigOutSerializer._toJsonObject(self.config);
                break;
            case "github":
                config = githubConfigOut_1.GithubConfigOutSerializer._toJsonObject(self.config);
                break;
            case "guesty":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "hubspot":
                config = hubspotConfigOut_1.HubspotConfigOutSerializer._toJsonObject(self.config);
                break;
            case "incident-io":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "lithic":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "nash":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "orum-io":
                config = orumIoConfigOut_1.OrumIoConfigOutSerializer._toJsonObject(self.config);
                break;
            case "panda-doc":
                config = pandaDocConfigOut_1.PandaDocConfigOutSerializer._toJsonObject(self.config);
                break;
            case "port-io":
                config = portIoConfigOut_1.PortIoConfigOutSerializer._toJsonObject(self.config);
                break;
            case "pleo":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "replicate":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "resend":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "rutter":
                config = rutterConfigOut_1.RutterConfigOutSerializer._toJsonObject(self.config);
                break;
            case "safebase":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "sardine":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "segment":
                config = segmentConfigOut_1.SegmentConfigOutSerializer._toJsonObject(self.config);
                break;
            case "shopify":
                config = shopifyConfigOut_1.ShopifyConfigOutSerializer._toJsonObject(self.config);
                break;
            case "slack":
                config = slackConfigOut_1.SlackConfigOutSerializer._toJsonObject(self.config);
                break;
            case "stripe":
                config = stripeConfigOut_1.StripeConfigOutSerializer._toJsonObject(self.config);
                break;
            case "stych":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "svix":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "zoom":
                config = zoomConfigOut_1.ZoomConfigOutSerializer._toJsonObject(self.config);
                break;
            case "telnyx":
                config = telnyxConfigOut_1.TelnyxConfigOutSerializer._toJsonObject(self.config);
                break;
            case "vapi":
                config = vapiConfigOut_1.VapiConfigOutSerializer._toJsonObject(self.config);
                break;
            case "open-ai":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "render":
                config = svixConfigOut_1.SvixConfigOutSerializer._toJsonObject(self.config);
                break;
            case "veriff":
                config = veriffConfigOut_1.VeriffConfigOutSerializer._toJsonObject(self.config);
                break;
            case "airwallex":
                config = airwallexConfigOut_1.AirwallexConfigOutSerializer._toJsonObject(self.config);
                break;
        }
        return {
            type: self.type,
            config: config,
            createdAt: self.createdAt,
            id: self.id,
            ingestUrl: self.ingestUrl,
            metadata: self.metadata,
            name: self.name,
            uid: self.uid,
            updatedAt: self.updatedAt
        };
    }
}; //# sourceMappingURL=ingestSourceOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseIngestSourceOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseIngestSourceOutSerializer = void 0;
const ingestSourceOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceOut.js [app-route] (ecmascript)");
exports.ListResponseIngestSourceOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>ingestSourceOut_1.IngestSourceOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>ingestSourceOut_1.IngestSourceOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseIngestSourceOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/rotateTokenOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RotateTokenOutSerializer = void 0;
exports.RotateTokenOutSerializer = {
    _fromJsonObject (object) {
        return {
            ingestUrl: object["ingestUrl"]
        };
    },
    _toJsonObject (self) {
        return {
            ingestUrl: self.ingestUrl
        };
    }
}; //# sourceMappingURL=rotateTokenOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/ingestSource.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IngestSource = void 0;
const ingestSourceIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceIn.js [app-route] (ecmascript)");
const ingestSourceOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceOut.js [app-route] (ecmascript)");
const listResponseIngestSourceOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseIngestSourceOut.js [app-route] (ecmascript)");
const rotateTokenOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/rotateTokenOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class IngestSource {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source");
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseIngestSourceOut_1.ListResponseIngestSourceOutSerializer._fromJsonObject);
    }
    create(ingestSourceIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/ingest/api/v1/source");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(ingestSourceIn_1.IngestSourceInSerializer._toJsonObject(ingestSourceIn));
        return request.send(this.requestCtx, ingestSourceOut_1.IngestSourceOutSerializer._fromJsonObject);
    }
    get(sourceId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/ingest/api/v1/source/{source_id}");
        request.setPathParam("source_id", sourceId);
        return request.send(this.requestCtx, ingestSourceOut_1.IngestSourceOutSerializer._fromJsonObject);
    }
    update(sourceId, ingestSourceIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/ingest/api/v1/source/{source_id}");
        request.setPathParam("source_id", sourceId);
        request.setBody(ingestSourceIn_1.IngestSourceInSerializer._toJsonObject(ingestSourceIn));
        return request.send(this.requestCtx, ingestSourceOut_1.IngestSourceOutSerializer._fromJsonObject);
    }
    delete(sourceId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/ingest/api/v1/source/{source_id}");
        request.setPathParam("source_id", sourceId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    rotateToken(sourceId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/token/rotate");
        request.setPathParam("source_id", sourceId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.send(this.requestCtx, rotateTokenOut_1.RotateTokenOutSerializer._fromJsonObject);
    }
}
exports.IngestSource = IngestSource; //# sourceMappingURL=ingestSource.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/ingest.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Ingest = void 0;
const dashboardAccessOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/dashboardAccessOut.js [app-route] (ecmascript)");
const ingestSourceConsumerPortalAccessIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ingestSourceConsumerPortalAccessIn.js [app-route] (ecmascript)");
const ingestEndpoint_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/ingestEndpoint.js [app-route] (ecmascript)");
const ingestSource_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/ingestSource.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Ingest {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    get endpoint() {
        return new ingestEndpoint_1.IngestEndpoint(this.requestCtx);
    }
    get source() {
        return new ingestSource_1.IngestSource(this.requestCtx);
    }
    dashboard(sourceId, ingestSourceConsumerPortalAccessIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/ingest/api/v1/source/{source_id}/dashboard");
        request.setPathParam("source_id", sourceId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(ingestSourceConsumerPortalAccessIn_1.IngestSourceConsumerPortalAccessInSerializer._toJsonObject(ingestSourceConsumerPortalAccessIn));
        return request.send(this.requestCtx, dashboardAccessOut_1.DashboardAccessOutSerializer._fromJsonObject);
    }
}
exports.Ingest = Ingest; //# sourceMappingURL=ingest.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IntegrationInSerializer = void 0;
exports.IntegrationInSerializer = {
    _fromJsonObject (object) {
        return {
            featureFlags: object["featureFlags"],
            name: object["name"]
        };
    },
    _toJsonObject (self) {
        return {
            featureFlags: self.featureFlags,
            name: self.name
        };
    }
}; //# sourceMappingURL=integrationIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationKeyOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IntegrationKeyOutSerializer = void 0;
exports.IntegrationKeyOutSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=integrationKeyOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IntegrationOutSerializer = void 0;
exports.IntegrationOutSerializer = {
    _fromJsonObject (object) {
        return {
            createdAt: new Date(object["createdAt"]),
            featureFlags: object["featureFlags"],
            id: object["id"],
            name: object["name"],
            updatedAt: new Date(object["updatedAt"])
        };
    },
    _toJsonObject (self) {
        return {
            createdAt: self.createdAt,
            featureFlags: self.featureFlags,
            id: self.id,
            name: self.name,
            updatedAt: self.updatedAt
        };
    }
}; //# sourceMappingURL=integrationOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationUpdate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.IntegrationUpdateSerializer = void 0;
exports.IntegrationUpdateSerializer = {
    _fromJsonObject (object) {
        return {
            featureFlags: object["featureFlags"],
            name: object["name"]
        };
    },
    _toJsonObject (self) {
        return {
            featureFlags: self.featureFlags,
            name: self.name
        };
    }
}; //# sourceMappingURL=integrationUpdate.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseIntegrationOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseIntegrationOutSerializer = void 0;
const integrationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationOut.js [app-route] (ecmascript)");
exports.ListResponseIntegrationOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>integrationOut_1.IntegrationOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>integrationOut_1.IntegrationOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseIntegrationOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/integration.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Integration = void 0;
const integrationIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationIn.js [app-route] (ecmascript)");
const integrationKeyOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationKeyOut.js [app-route] (ecmascript)");
const integrationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationOut.js [app-route] (ecmascript)");
const integrationUpdate_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/integrationUpdate.js [app-route] (ecmascript)");
const listResponseIntegrationOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseIntegrationOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Integration {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(appId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/integration");
        request.setPathParam("app_id", appId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseIntegrationOut_1.ListResponseIntegrationOutSerializer._fromJsonObject);
    }
    create(appId, integrationIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/integration");
        request.setPathParam("app_id", appId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(integrationIn_1.IntegrationInSerializer._toJsonObject(integrationIn));
        return request.send(this.requestCtx, integrationOut_1.IntegrationOutSerializer._fromJsonObject);
    }
    get(appId, integId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/integration/{integ_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("integ_id", integId);
        return request.send(this.requestCtx, integrationOut_1.IntegrationOutSerializer._fromJsonObject);
    }
    update(appId, integId, integrationUpdate) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/app/{app_id}/integration/{integ_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("integ_id", integId);
        request.setBody(integrationUpdate_1.IntegrationUpdateSerializer._toJsonObject(integrationUpdate));
        return request.send(this.requestCtx, integrationOut_1.IntegrationOutSerializer._fromJsonObject);
    }
    delete(appId, integId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/app/{app_id}/integration/{integ_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("integ_id", integId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    getKey(appId, integId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/integration/{integ_id}/key");
        request.setPathParam("app_id", appId);
        request.setPathParam("integ_id", integId);
        return request.send(this.requestCtx, integrationKeyOut_1.IntegrationKeyOutSerializer._fromJsonObject);
    }
    rotateKey(appId, integId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/integration/{integ_id}/key/rotate");
        request.setPathParam("app_id", appId);
        request.setPathParam("integ_id", integId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.send(this.requestCtx, integrationKeyOut_1.IntegrationKeyOutSerializer._fromJsonObject);
    }
}
exports.Integration = Integration; //# sourceMappingURL=integration.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/expungeAllContentsOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExpungeAllContentsOutSerializer = void 0;
const backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
const backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
exports.ExpungeAllContentsOutSerializer = {
    _fromJsonObject (object) {
        return {
            id: object["id"],
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._fromJsonObject(object["status"]),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._fromJsonObject(object["task"])
        };
    },
    _toJsonObject (self) {
        return {
            id: self.id,
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._toJsonObject(self.status),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._toJsonObject(self.task)
        };
    }
}; //# sourceMappingURL=expungeAllContentsOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseMessageOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseMessageOutSerializer = void 0;
const messageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageOut.js [app-route] (ecmascript)");
exports.ListResponseMessageOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>messageOut_1.MessageOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>messageOut_1.MessageOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseMessageOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointConsumerSeekIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PollingEndpointConsumerSeekInSerializer = void 0;
exports.PollingEndpointConsumerSeekInSerializer = {
    _fromJsonObject (object) {
        return {
            after: new Date(object["after"])
        };
    },
    _toJsonObject (self) {
        return {
            after: self.after
        };
    }
}; //# sourceMappingURL=pollingEndpointConsumerSeekIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointConsumerSeekOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PollingEndpointConsumerSeekOutSerializer = void 0;
exports.PollingEndpointConsumerSeekOutSerializer = {
    _fromJsonObject (object) {
        return {
            iterator: object["iterator"]
        };
    },
    _toJsonObject (self) {
        return {
            iterator: self.iterator
        };
    }
}; //# sourceMappingURL=pollingEndpointConsumerSeekOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointMessageOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PollingEndpointMessageOutSerializer = void 0;
exports.PollingEndpointMessageOutSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            eventId: object["eventId"],
            eventType: object["eventType"],
            headers: object["headers"],
            id: object["id"],
            payload: object["payload"],
            tags: object["tags"],
            timestamp: new Date(object["timestamp"])
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            eventId: self.eventId,
            eventType: self.eventType,
            headers: self.headers,
            id: self.id,
            payload: self.payload,
            tags: self.tags,
            timestamp: self.timestamp
        };
    }
}; //# sourceMappingURL=pollingEndpointMessageOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PollingEndpointOutSerializer = void 0;
const pollingEndpointMessageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointMessageOut.js [app-route] (ecmascript)");
exports.PollingEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>pollingEndpointMessageOut_1.PollingEndpointMessageOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>pollingEndpointMessageOut_1.PollingEndpointMessageOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator
        };
    }
}; //# sourceMappingURL=pollingEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/messagePoller.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessagePoller = void 0;
const pollingEndpointConsumerSeekIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointConsumerSeekIn.js [app-route] (ecmascript)");
const pollingEndpointConsumerSeekOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointConsumerSeekOut.js [app-route] (ecmascript)");
const pollingEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/pollingEndpointOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class MessagePoller {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    poll(appId, sinkId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/poller/{sink_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("sink_id", sinkId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("event_type", options === null || options === void 0 ? void 0 : options.eventType);
        request.setQueryParam("channel", options === null || options === void 0 ? void 0 : options.channel);
        request.setQueryParam("after", options === null || options === void 0 ? void 0 : options.after);
        return request.send(this.requestCtx, pollingEndpointOut_1.PollingEndpointOutSerializer._fromJsonObject);
    }
    consumerPoll(appId, sinkId, consumerId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/poller/{sink_id}/consumer/{consumer_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("sink_id", sinkId);
        request.setPathParam("consumer_id", consumerId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        return request.send(this.requestCtx, pollingEndpointOut_1.PollingEndpointOutSerializer._fromJsonObject);
    }
    consumerSeek(appId, sinkId, consumerId, pollingEndpointConsumerSeekIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/poller/{sink_id}/consumer/{consumer_id}/seek");
        request.setPathParam("app_id", appId);
        request.setPathParam("sink_id", sinkId);
        request.setPathParam("consumer_id", consumerId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(pollingEndpointConsumerSeekIn_1.PollingEndpointConsumerSeekInSerializer._toJsonObject(pollingEndpointConsumerSeekIn));
        return request.send(this.requestCtx, pollingEndpointConsumerSeekOut_1.PollingEndpointConsumerSeekOutSerializer._fromJsonObject);
    }
}
exports.MessagePoller = MessagePoller; //# sourceMappingURL=messagePoller.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageInSerializer = void 0;
const applicationIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/applicationIn.js [app-route] (ecmascript)");
exports.MessageInSerializer = {
    _fromJsonObject (object) {
        return {
            application: object["application"] ? applicationIn_1.ApplicationInSerializer._fromJsonObject(object["application"]) : undefined,
            channels: object["channels"],
            eventId: object["eventId"],
            eventType: object["eventType"],
            payload: object["payload"],
            payloadRetentionHours: object["payloadRetentionHours"],
            payloadRetentionPeriod: object["payloadRetentionPeriod"],
            tags: object["tags"],
            transformationsParams: object["transformationsParams"]
        };
    },
    _toJsonObject (self) {
        return {
            application: self.application ? applicationIn_1.ApplicationInSerializer._toJsonObject(self.application) : undefined,
            channels: self.channels,
            eventId: self.eventId,
            eventType: self.eventType,
            payload: self.payload,
            payloadRetentionHours: self.payloadRetentionHours,
            payloadRetentionPeriod: self.payloadRetentionPeriod,
            tags: self.tags,
            transformationsParams: self.transformationsParams
        };
    }
}; //# sourceMappingURL=messageIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/message.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.messageInRaw = exports.Message = void 0;
const expungeAllContentsOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/expungeAllContentsOut.js [app-route] (ecmascript)");
const listResponseMessageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseMessageOut.js [app-route] (ecmascript)");
const messageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageOut.js [app-route] (ecmascript)");
const messagePoller_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/messagePoller.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
const messageIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageIn.js [app-route] (ecmascript)");
class Message {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    get poller() {
        return new messagePoller_1.MessagePoller(this.requestCtx);
    }
    list(appId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/msg");
        request.setPathParam("app_id", appId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("channel", options === null || options === void 0 ? void 0 : options.channel);
        request.setQueryParam("before", options === null || options === void 0 ? void 0 : options.before);
        request.setQueryParam("after", options === null || options === void 0 ? void 0 : options.after);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        request.setQueryParam("tag", options === null || options === void 0 ? void 0 : options.tag);
        request.setQueryParam("event_types", options === null || options === void 0 ? void 0 : options.eventTypes);
        return request.send(this.requestCtx, listResponseMessageOut_1.ListResponseMessageOutSerializer._fromJsonObject);
    }
    create(appId, messageIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/msg");
        request.setPathParam("app_id", appId);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(messageIn_1.MessageInSerializer._toJsonObject(messageIn));
        return request.send(this.requestCtx, messageOut_1.MessageOutSerializer._fromJsonObject);
    }
    expungeAllContents(appId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/msg/expunge-all-contents");
        request.setPathParam("app_id", appId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.send(this.requestCtx, expungeAllContentsOut_1.ExpungeAllContentsOutSerializer._fromJsonObject);
    }
    get(appId, msgId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/msg/{msg_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        return request.send(this.requestCtx, messageOut_1.MessageOutSerializer._fromJsonObject);
    }
    expungeContent(appId, msgId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/app/{app_id}/msg/{msg_id}/content");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.Message = Message;
function messageInRaw(eventType, payload, contentType) {
    const headers = contentType ? {
        "content-type": contentType
    } : undefined;
    return {
        eventType,
        payload: {},
        transformationsParams: {
            rawPayload: payload,
            headers
        }
    };
}
exports.messageInRaw = messageInRaw; //# sourceMappingURL=message.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatus.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageStatusSerializer = exports.MessageStatus = void 0;
var MessageStatus;
(function(MessageStatus) {
    MessageStatus[MessageStatus["Success"] = 0] = "Success";
    MessageStatus[MessageStatus["Pending"] = 1] = "Pending";
    MessageStatus[MessageStatus["Fail"] = 2] = "Fail";
    MessageStatus[MessageStatus["Sending"] = 3] = "Sending";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
exports.MessageStatusSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=messageStatus.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatusText.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageStatusTextSerializer = exports.MessageStatusText = void 0;
var MessageStatusText;
(function(MessageStatusText) {
    MessageStatusText["Success"] = "success";
    MessageStatusText["Pending"] = "pending";
    MessageStatusText["Fail"] = "fail";
    MessageStatusText["Sending"] = "sending";
})(MessageStatusText = exports.MessageStatusText || (exports.MessageStatusText = {}));
exports.MessageStatusTextSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=messageStatusText.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointMessageOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointMessageOutSerializer = void 0;
const messageStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatus.js [app-route] (ecmascript)");
const messageStatusText_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatusText.js [app-route] (ecmascript)");
exports.EndpointMessageOutSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            eventId: object["eventId"],
            eventType: object["eventType"],
            id: object["id"],
            nextAttempt: object["nextAttempt"] ? new Date(object["nextAttempt"]) : null,
            payload: object["payload"],
            status: messageStatus_1.MessageStatusSerializer._fromJsonObject(object["status"]),
            statusText: messageStatusText_1.MessageStatusTextSerializer._fromJsonObject(object["statusText"]),
            tags: object["tags"],
            timestamp: new Date(object["timestamp"])
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            eventId: self.eventId,
            eventType: self.eventType,
            id: self.id,
            nextAttempt: self.nextAttempt,
            payload: self.payload,
            status: messageStatus_1.MessageStatusSerializer._toJsonObject(self.status),
            statusText: messageStatusText_1.MessageStatusTextSerializer._toJsonObject(self.statusText),
            tags: self.tags,
            timestamp: self.timestamp
        };
    }
}; //# sourceMappingURL=endpointMessageOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseEndpointMessageOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseEndpointMessageOutSerializer = void 0;
const endpointMessageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointMessageOut.js [app-route] (ecmascript)");
exports.ListResponseEndpointMessageOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>endpointMessageOut_1.EndpointMessageOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>endpointMessageOut_1.EndpointMessageOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseEndpointMessageOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageAttemptTriggerType.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageAttemptTriggerTypeSerializer = exports.MessageAttemptTriggerType = void 0;
var MessageAttemptTriggerType;
(function(MessageAttemptTriggerType) {
    MessageAttemptTriggerType[MessageAttemptTriggerType["Scheduled"] = 0] = "Scheduled";
    MessageAttemptTriggerType[MessageAttemptTriggerType["Manual"] = 1] = "Manual";
})(MessageAttemptTriggerType = exports.MessageAttemptTriggerType || (exports.MessageAttemptTriggerType = {}));
exports.MessageAttemptTriggerTypeSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=messageAttemptTriggerType.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageAttemptOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageAttemptOutSerializer = void 0;
const messageAttemptTriggerType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageAttemptTriggerType.js [app-route] (ecmascript)");
const messageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageOut.js [app-route] (ecmascript)");
const messageStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatus.js [app-route] (ecmascript)");
const messageStatusText_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatusText.js [app-route] (ecmascript)");
exports.MessageAttemptOutSerializer = {
    _fromJsonObject (object) {
        return {
            endpointId: object["endpointId"],
            id: object["id"],
            msg: object["msg"] ? messageOut_1.MessageOutSerializer._fromJsonObject(object["msg"]) : undefined,
            msgId: object["msgId"],
            response: object["response"],
            responseDurationMs: object["responseDurationMs"],
            responseStatusCode: object["responseStatusCode"],
            status: messageStatus_1.MessageStatusSerializer._fromJsonObject(object["status"]),
            statusText: messageStatusText_1.MessageStatusTextSerializer._fromJsonObject(object["statusText"]),
            timestamp: new Date(object["timestamp"]),
            triggerType: messageAttemptTriggerType_1.MessageAttemptTriggerTypeSerializer._fromJsonObject(object["triggerType"]),
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            endpointId: self.endpointId,
            id: self.id,
            msg: self.msg ? messageOut_1.MessageOutSerializer._toJsonObject(self.msg) : undefined,
            msgId: self.msgId,
            response: self.response,
            responseDurationMs: self.responseDurationMs,
            responseStatusCode: self.responseStatusCode,
            status: messageStatus_1.MessageStatusSerializer._toJsonObject(self.status),
            statusText: messageStatusText_1.MessageStatusTextSerializer._toJsonObject(self.statusText),
            timestamp: self.timestamp,
            triggerType: messageAttemptTriggerType_1.MessageAttemptTriggerTypeSerializer._toJsonObject(self.triggerType),
            url: self.url
        };
    }
}; //# sourceMappingURL=messageAttemptOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseMessageAttemptOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseMessageAttemptOutSerializer = void 0;
const messageAttemptOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageAttemptOut.js [app-route] (ecmascript)");
exports.ListResponseMessageAttemptOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>messageAttemptOut_1.MessageAttemptOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>messageAttemptOut_1.MessageAttemptOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseMessageAttemptOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageEndpointOutSerializer = void 0;
const messageStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatus.js [app-route] (ecmascript)");
const messageStatusText_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatusText.js [app-route] (ecmascript)");
exports.MessageEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            channels: object["channels"],
            createdAt: new Date(object["createdAt"]),
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            id: object["id"],
            nextAttempt: object["nextAttempt"] ? new Date(object["nextAttempt"]) : null,
            rateLimit: object["rateLimit"],
            status: messageStatus_1.MessageStatusSerializer._fromJsonObject(object["status"]),
            statusText: messageStatusText_1.MessageStatusTextSerializer._fromJsonObject(object["statusText"]),
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"]),
            url: object["url"],
            version: object["version"]
        };
    },
    _toJsonObject (self) {
        return {
            channels: self.channels,
            createdAt: self.createdAt,
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            id: self.id,
            nextAttempt: self.nextAttempt,
            rateLimit: self.rateLimit,
            status: messageStatus_1.MessageStatusSerializer._toJsonObject(self.status),
            statusText: messageStatusText_1.MessageStatusTextSerializer._toJsonObject(self.statusText),
            uid: self.uid,
            updatedAt: self.updatedAt,
            url: self.url,
            version: self.version
        };
    }
}; //# sourceMappingURL=messageEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseMessageEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseMessageEndpointOutSerializer = void 0;
const messageEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageEndpointOut.js [app-route] (ecmascript)");
exports.ListResponseMessageEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>messageEndpointOut_1.MessageEndpointOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>messageEndpointOut_1.MessageEndpointOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseMessageEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/messageAttempt.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MessageAttempt = void 0;
const listResponseEndpointMessageOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseEndpointMessageOut.js [app-route] (ecmascript)");
const listResponseMessageAttemptOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseMessageAttemptOut.js [app-route] (ecmascript)");
const listResponseMessageEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseMessageEndpointOut.js [app-route] (ecmascript)");
const messageAttemptOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageAttemptOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class MessageAttempt {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    listByEndpoint(appId, endpointId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/attempt/endpoint/{endpoint_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("status", options === null || options === void 0 ? void 0 : options.status);
        request.setQueryParam("status_code_class", options === null || options === void 0 ? void 0 : options.statusCodeClass);
        request.setQueryParam("channel", options === null || options === void 0 ? void 0 : options.channel);
        request.setQueryParam("tag", options === null || options === void 0 ? void 0 : options.tag);
        request.setQueryParam("before", options === null || options === void 0 ? void 0 : options.before);
        request.setQueryParam("after", options === null || options === void 0 ? void 0 : options.after);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        request.setQueryParam("with_msg", options === null || options === void 0 ? void 0 : options.withMsg);
        request.setQueryParam("event_types", options === null || options === void 0 ? void 0 : options.eventTypes);
        return request.send(this.requestCtx, listResponseMessageAttemptOut_1.ListResponseMessageAttemptOutSerializer._fromJsonObject);
    }
    listByMsg(appId, msgId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/attempt/msg/{msg_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("status", options === null || options === void 0 ? void 0 : options.status);
        request.setQueryParam("status_code_class", options === null || options === void 0 ? void 0 : options.statusCodeClass);
        request.setQueryParam("channel", options === null || options === void 0 ? void 0 : options.channel);
        request.setQueryParam("tag", options === null || options === void 0 ? void 0 : options.tag);
        request.setQueryParam("endpoint_id", options === null || options === void 0 ? void 0 : options.endpointId);
        request.setQueryParam("before", options === null || options === void 0 ? void 0 : options.before);
        request.setQueryParam("after", options === null || options === void 0 ? void 0 : options.after);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        request.setQueryParam("event_types", options === null || options === void 0 ? void 0 : options.eventTypes);
        return request.send(this.requestCtx, listResponseMessageAttemptOut_1.ListResponseMessageAttemptOutSerializer._fromJsonObject);
    }
    listAttemptedMessages(appId, endpointId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/endpoint/{endpoint_id}/msg");
        request.setPathParam("app_id", appId);
        request.setPathParam("endpoint_id", endpointId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("channel", options === null || options === void 0 ? void 0 : options.channel);
        request.setQueryParam("tag", options === null || options === void 0 ? void 0 : options.tag);
        request.setQueryParam("status", options === null || options === void 0 ? void 0 : options.status);
        request.setQueryParam("before", options === null || options === void 0 ? void 0 : options.before);
        request.setQueryParam("after", options === null || options === void 0 ? void 0 : options.after);
        request.setQueryParam("with_content", options === null || options === void 0 ? void 0 : options.withContent);
        request.setQueryParam("event_types", options === null || options === void 0 ? void 0 : options.eventTypes);
        return request.send(this.requestCtx, listResponseEndpointMessageOut_1.ListResponseEndpointMessageOutSerializer._fromJsonObject);
    }
    get(appId, msgId, attemptId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        request.setPathParam("attempt_id", attemptId);
        return request.send(this.requestCtx, messageAttemptOut_1.MessageAttemptOutSerializer._fromJsonObject);
    }
    expungeContent(appId, msgId, attemptId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/app/{app_id}/msg/{msg_id}/attempt/{attempt_id}/content");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        request.setPathParam("attempt_id", attemptId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    listAttemptedDestinations(appId, msgId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/app/{app_id}/msg/{msg_id}/endpoint");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        return request.send(this.requestCtx, listResponseMessageEndpointOut_1.ListResponseMessageEndpointOutSerializer._fromJsonObject);
    }
    resend(appId, msgId, endpointId, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/app/{app_id}/msg/{msg_id}/endpoint/{endpoint_id}/resend");
        request.setPathParam("app_id", appId);
        request.setPathParam("msg_id", msgId);
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.MessageAttempt = MessageAttempt; //# sourceMappingURL=messageAttempt.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointOutSerializer = void 0;
exports.OperationalWebhookEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            createdAt: new Date(object["createdAt"]),
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            id: object["id"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            updatedAt: new Date(object["updatedAt"]),
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            createdAt: self.createdAt,
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            id: self.id,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            uid: self.uid,
            updatedAt: self.updatedAt,
            url: self.url
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseOperationalWebhookEndpointOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ListResponseOperationalWebhookEndpointOutSerializer = void 0;
const operationalWebhookEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointOut.js [app-route] (ecmascript)");
exports.ListResponseOperationalWebhookEndpointOutSerializer = {
    _fromJsonObject (object) {
        return {
            data: object["data"].map((item)=>operationalWebhookEndpointOut_1.OperationalWebhookEndpointOutSerializer._fromJsonObject(item)),
            done: object["done"],
            iterator: object["iterator"],
            prevIterator: object["prevIterator"]
        };
    },
    _toJsonObject (self) {
        return {
            data: self.data.map((item)=>operationalWebhookEndpointOut_1.OperationalWebhookEndpointOutSerializer._toJsonObject(item)),
            done: self.done,
            iterator: self.iterator,
            prevIterator: self.prevIterator
        };
    }
}; //# sourceMappingURL=listResponseOperationalWebhookEndpointOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointHeadersIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointHeadersInSerializer = void 0;
exports.OperationalWebhookEndpointHeadersInSerializer = {
    _fromJsonObject (object) {
        return {
            headers: object["headers"]
        };
    },
    _toJsonObject (self) {
        return {
            headers: self.headers
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointHeadersIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointHeadersOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointHeadersOutSerializer = void 0;
exports.OperationalWebhookEndpointHeadersOutSerializer = {
    _fromJsonObject (object) {
        return {
            headers: object["headers"],
            sensitive: object["sensitive"]
        };
    },
    _toJsonObject (self) {
        return {
            headers: self.headers,
            sensitive: self.sensitive
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointHeadersOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointInSerializer = void 0;
exports.OperationalWebhookEndpointInSerializer = {
    _fromJsonObject (object) {
        return {
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            secret: object["secret"],
            uid: object["uid"],
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            secret: self.secret,
            uid: self.uid,
            url: self.url
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointSecretIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointSecretInSerializer = void 0;
exports.OperationalWebhookEndpointSecretInSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointSecretIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointSecretOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointSecretOutSerializer = void 0;
exports.OperationalWebhookEndpointSecretOutSerializer = {
    _fromJsonObject (object) {
        return {
            key: object["key"]
        };
    },
    _toJsonObject (self) {
        return {
            key: self.key
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointSecretOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointUpdate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpointUpdateSerializer = void 0;
exports.OperationalWebhookEndpointUpdateSerializer = {
    _fromJsonObject (object) {
        return {
            description: object["description"],
            disabled: object["disabled"],
            filterTypes: object["filterTypes"],
            metadata: object["metadata"],
            rateLimit: object["rateLimit"],
            uid: object["uid"],
            url: object["url"]
        };
    },
    _toJsonObject (self) {
        return {
            description: self.description,
            disabled: self.disabled,
            filterTypes: self.filterTypes,
            metadata: self.metadata,
            rateLimit: self.rateLimit,
            uid: self.uid,
            url: self.url
        };
    }
}; //# sourceMappingURL=operationalWebhookEndpointUpdate.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/operationalWebhookEndpoint.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhookEndpoint = void 0;
const listResponseOperationalWebhookEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/listResponseOperationalWebhookEndpointOut.js [app-route] (ecmascript)");
const operationalWebhookEndpointHeadersIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointHeadersIn.js [app-route] (ecmascript)");
const operationalWebhookEndpointHeadersOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointHeadersOut.js [app-route] (ecmascript)");
const operationalWebhookEndpointIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointIn.js [app-route] (ecmascript)");
const operationalWebhookEndpointOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointOut.js [app-route] (ecmascript)");
const operationalWebhookEndpointSecretIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointSecretIn.js [app-route] (ecmascript)");
const operationalWebhookEndpointSecretOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointSecretOut.js [app-route] (ecmascript)");
const operationalWebhookEndpointUpdate_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/operationalWebhookEndpointUpdate.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class OperationalWebhookEndpoint {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    list(options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/operational-webhook/endpoint");
        request.setQueryParam("limit", options === null || options === void 0 ? void 0 : options.limit);
        request.setQueryParam("iterator", options === null || options === void 0 ? void 0 : options.iterator);
        request.setQueryParam("order", options === null || options === void 0 ? void 0 : options.order);
        return request.send(this.requestCtx, listResponseOperationalWebhookEndpointOut_1.ListResponseOperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    create(operationalWebhookEndpointIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/operational-webhook/endpoint");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(operationalWebhookEndpointIn_1.OperationalWebhookEndpointInSerializer._toJsonObject(operationalWebhookEndpointIn));
        return request.send(this.requestCtx, operationalWebhookEndpointOut_1.OperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    get(endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/operational-webhook/endpoint/{endpoint_id}");
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, operationalWebhookEndpointOut_1.OperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    update(endpointId, operationalWebhookEndpointUpdate) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/operational-webhook/endpoint/{endpoint_id}");
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(operationalWebhookEndpointUpdate_1.OperationalWebhookEndpointUpdateSerializer._toJsonObject(operationalWebhookEndpointUpdate));
        return request.send(this.requestCtx, operationalWebhookEndpointOut_1.OperationalWebhookEndpointOutSerializer._fromJsonObject);
    }
    delete(endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.DELETE, "/api/v1/operational-webhook/endpoint/{endpoint_id}");
        request.setPathParam("endpoint_id", endpointId);
        return request.sendNoResponseBody(this.requestCtx);
    }
    getHeaders(endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/operational-webhook/endpoint/{endpoint_id}/headers");
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, operationalWebhookEndpointHeadersOut_1.OperationalWebhookEndpointHeadersOutSerializer._fromJsonObject);
    }
    updateHeaders(endpointId, operationalWebhookEndpointHeadersIn) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/operational-webhook/endpoint/{endpoint_id}/headers");
        request.setPathParam("endpoint_id", endpointId);
        request.setBody(operationalWebhookEndpointHeadersIn_1.OperationalWebhookEndpointHeadersInSerializer._toJsonObject(operationalWebhookEndpointHeadersIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
    getSecret(endpointId) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.GET, "/api/v1/operational-webhook/endpoint/{endpoint_id}/secret");
        request.setPathParam("endpoint_id", endpointId);
        return request.send(this.requestCtx, operationalWebhookEndpointSecretOut_1.OperationalWebhookEndpointSecretOutSerializer._fromJsonObject);
    }
    rotateSecret(endpointId, operationalWebhookEndpointSecretIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/operational-webhook/endpoint/{endpoint_id}/secret/rotate");
        request.setPathParam("endpoint_id", endpointId);
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(operationalWebhookEndpointSecretIn_1.OperationalWebhookEndpointSecretInSerializer._toJsonObject(operationalWebhookEndpointSecretIn));
        return request.sendNoResponseBody(this.requestCtx);
    }
}
exports.OperationalWebhookEndpoint = OperationalWebhookEndpoint; //# sourceMappingURL=operationalWebhookEndpoint.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/operationalWebhook.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OperationalWebhook = void 0;
const operationalWebhookEndpoint_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/operationalWebhookEndpoint.js [app-route] (ecmascript)");
class OperationalWebhook {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    get endpoint() {
        return new operationalWebhookEndpoint_1.OperationalWebhookEndpoint(this.requestCtx);
    }
}
exports.OperationalWebhook = OperationalWebhook; //# sourceMappingURL=operationalWebhook.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/aggregateEventTypesOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AggregateEventTypesOutSerializer = void 0;
const backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
const backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
exports.AggregateEventTypesOutSerializer = {
    _fromJsonObject (object) {
        return {
            id: object["id"],
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._fromJsonObject(object["status"]),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._fromJsonObject(object["task"])
        };
    },
    _toJsonObject (self) {
        return {
            id: self.id,
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._toJsonObject(self.status),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._toJsonObject(self.task)
        };
    }
}; //# sourceMappingURL=aggregateEventTypesOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appUsageStatsIn.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppUsageStatsInSerializer = void 0;
exports.AppUsageStatsInSerializer = {
    _fromJsonObject (object) {
        return {
            appIds: object["appIds"],
            since: new Date(object["since"]),
            until: new Date(object["until"])
        };
    },
    _toJsonObject (self) {
        return {
            appIds: self.appIds,
            since: self.since,
            until: self.until
        };
    }
}; //# sourceMappingURL=appUsageStatsIn.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appUsageStatsOut.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AppUsageStatsOutSerializer = void 0;
const backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
const backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
exports.AppUsageStatsOutSerializer = {
    _fromJsonObject (object) {
        return {
            id: object["id"],
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._fromJsonObject(object["status"]),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._fromJsonObject(object["task"]),
            unresolvedAppIds: object["unresolvedAppIds"]
        };
    },
    _toJsonObject (self) {
        return {
            id: self.id,
            status: backgroundTaskStatus_1.BackgroundTaskStatusSerializer._toJsonObject(self.status),
            task: backgroundTaskType_1.BackgroundTaskTypeSerializer._toJsonObject(self.task),
            unresolvedAppIds: self.unresolvedAppIds
        };
    }
}; //# sourceMappingURL=appUsageStatsOut.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/statistics.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Statistics = void 0;
const aggregateEventTypesOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/aggregateEventTypesOut.js [app-route] (ecmascript)");
const appUsageStatsIn_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appUsageStatsIn.js [app-route] (ecmascript)");
const appUsageStatsOut_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appUsageStatsOut.js [app-route] (ecmascript)");
const request_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/request.js [app-route] (ecmascript)");
class Statistics {
    constructor(requestCtx){
        this.requestCtx = requestCtx;
    }
    aggregateAppStats(appUsageStatsIn, options) {
        const request = new request_1.SvixRequest(request_1.HttpMethod.POST, "/api/v1/stats/usage/app");
        request.setHeaderParam("idempotency-key", options === null || options === void 0 ? void 0 : options.idempotencyKey);
        request.setBody(appUsageStatsIn_1.AppUsageStatsInSerializer._toJsonObject(appUsageStatsIn));
        return request.send(this.requestCtx, appUsageStatsOut_1.AppUsageStatsOutSerializer._fromJsonObject);
    }
    aggregateEventTypes() {
        const request = new request_1.SvixRequest(request_1.HttpMethod.PUT, "/api/v1/stats/usage/event-types");
        return request.send(this.requestCtx, aggregateEventTypesOut_1.AggregateEventTypesOutSerializer._fromJsonObject);
    }
}
exports.Statistics = Statistics; //# sourceMappingURL=statistics.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/HttpErrors.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HTTPValidationError = exports.ValidationError = exports.HttpErrorOut = void 0;
class HttpErrorOut {
    static getAttributeTypeMap() {
        return HttpErrorOut.attributeTypeMap;
    }
}
exports.HttpErrorOut = HttpErrorOut;
HttpErrorOut.discriminator = undefined;
HttpErrorOut.mapping = undefined;
HttpErrorOut.attributeTypeMap = [
    {
        name: "code",
        baseName: "code",
        type: "string",
        format: ""
    },
    {
        name: "detail",
        baseName: "detail",
        type: "string",
        format: ""
    }
];
class ValidationError {
    static getAttributeTypeMap() {
        return ValidationError.attributeTypeMap;
    }
}
exports.ValidationError = ValidationError;
ValidationError.discriminator = undefined;
ValidationError.mapping = undefined;
ValidationError.attributeTypeMap = [
    {
        name: "loc",
        baseName: "loc",
        type: "Array<string>",
        format: ""
    },
    {
        name: "msg",
        baseName: "msg",
        type: "string",
        format: ""
    },
    {
        name: "type",
        baseName: "type",
        type: "string",
        format: ""
    }
];
class HTTPValidationError {
    static getAttributeTypeMap() {
        return HTTPValidationError.attributeTypeMap;
    }
}
exports.HTTPValidationError = HTTPValidationError;
HTTPValidationError.discriminator = undefined;
HTTPValidationError.mapping = undefined;
HTTPValidationError.attributeTypeMap = [
    {
        name: "detail",
        baseName: "detail",
        type: "Array<ValidationError>",
        format: ""
    }
]; //# sourceMappingURL=HttpErrors.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/timing_safe_equal.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timingSafeEqual = void 0;
function assert(expr, msg = "") {
    if (!expr) {
        throw new Error(msg);
    }
}
function timingSafeEqual(a, b) {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    if (!(a instanceof DataView)) {
        a = new DataView(ArrayBuffer.isView(a) ? a.buffer : a);
    }
    if (!(b instanceof DataView)) {
        b = new DataView(ArrayBuffer.isView(b) ? b.buffer : b);
    }
    assert(a instanceof DataView);
    assert(b instanceof DataView);
    const length = a.byteLength;
    let out = 0;
    let i = -1;
    while(++i < length){
        out |= a.getUint8(i) ^ b.getUint8(i);
    }
    return out === 0;
}
exports.timingSafeEqual = timingSafeEqual; //# sourceMappingURL=timing_safe_equal.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/webhook.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Webhook = exports.WebhookVerificationError = void 0;
const timing_safe_equal_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/timing_safe_equal.js [app-route] (ecmascript)");
const base64 = __turbopack_context__.r("[project]/node_modules/.pnpm/@stablelib+base64@1.0.1/node_modules/@stablelib/base64/lib/base64.js [app-route] (ecmascript)");
const sha256 = __turbopack_context__.r("[project]/node_modules/.pnpm/fast-sha256@1.3.0/node_modules/fast-sha256/sha256.js [app-route] (ecmascript)");
const WEBHOOK_TOLERANCE_IN_SECONDS = 5 * 60;
class ExtendableError extends Error {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, ExtendableError.prototype);
        this.name = "ExtendableError";
        this.stack = new Error(message).stack;
    }
}
class WebhookVerificationError extends ExtendableError {
    constructor(message){
        super(message);
        Object.setPrototypeOf(this, WebhookVerificationError.prototype);
        this.name = "WebhookVerificationError";
    }
}
exports.WebhookVerificationError = WebhookVerificationError;
class Webhook {
    constructor(secret, options){
        if (!secret) {
            throw new Error("Secret can't be empty.");
        }
        if ((options === null || options === void 0 ? void 0 : options.format) === "raw") {
            if (secret instanceof Uint8Array) {
                this.key = secret;
            } else {
                this.key = Uint8Array.from(secret, (c)=>c.charCodeAt(0));
            }
        } else {
            if (typeof secret !== "string") {
                throw new Error("Expected secret to be of type string");
            }
            if (secret.startsWith(Webhook.prefix)) {
                secret = secret.substring(Webhook.prefix.length);
            }
            this.key = base64.decode(secret);
        }
    }
    verify(payload, headers_) {
        const headers = {};
        for (const key of Object.keys(headers_)){
            headers[key.toLowerCase()] = headers_[key];
        }
        let msgId = headers["svix-id"];
        let msgSignature = headers["svix-signature"];
        let msgTimestamp = headers["svix-timestamp"];
        if (!msgSignature || !msgId || !msgTimestamp) {
            msgId = headers["webhook-id"];
            msgSignature = headers["webhook-signature"];
            msgTimestamp = headers["webhook-timestamp"];
            if (!msgSignature || !msgId || !msgTimestamp) {
                throw new WebhookVerificationError("Missing required headers");
            }
        }
        const timestamp = this.verifyTimestamp(msgTimestamp);
        const computedSignature = this.sign(msgId, timestamp, payload);
        const expectedSignature = computedSignature.split(",")[1];
        const passedSignatures = msgSignature.split(" ");
        const encoder = new globalThis.TextEncoder();
        for (const versionedSignature of passedSignatures){
            const [version, signature] = versionedSignature.split(",");
            if (version !== "v1") {
                continue;
            }
            if ((0, timing_safe_equal_1.timingSafeEqual)(encoder.encode(signature), encoder.encode(expectedSignature))) {
                return JSON.parse(payload.toString());
            }
        }
        throw new WebhookVerificationError("No matching signature found");
    }
    sign(msgId, timestamp, payload) {
        if (typeof payload === "string") {} else if (payload.constructor.name === "Buffer") {
            payload = payload.toString();
        } else {
            throw new Error("Expected payload to be of type string or Buffer. Please refer to https://docs.svix.com/receiving/verifying-payloads/how for more information.");
        }
        const encoder = new TextEncoder();
        const timestampNumber = Math.floor(timestamp.getTime() / 1000);
        const toSign = encoder.encode(`${msgId}.${timestampNumber}.${payload}`);
        const expectedSignature = base64.encode(sha256.hmac(this.key, toSign));
        return `v1,${expectedSignature}`;
    }
    verifyTimestamp(timestampHeader) {
        const now = Math.floor(Date.now() / 1000);
        const timestamp = parseInt(timestampHeader, 10);
        if (isNaN(timestamp)) {
            throw new WebhookVerificationError("Invalid Signature Headers");
        }
        if (now - timestamp > WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new WebhookVerificationError("Message timestamp too old");
        }
        if (timestamp > now + WEBHOOK_TOLERANCE_IN_SECONDS) {
            throw new WebhookVerificationError("Message timestamp too new");
        }
        return new Date(timestamp * 1000);
    }
}
exports.Webhook = Webhook;
Webhook.prefix = "whsec_"; //# sourceMappingURL=webhook.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointDisabledTrigger.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EndpointDisabledTriggerSerializer = exports.EndpointDisabledTrigger = void 0;
var EndpointDisabledTrigger;
(function(EndpointDisabledTrigger) {
    EndpointDisabledTrigger["Manual"] = "manual";
    EndpointDisabledTrigger["Automatic"] = "automatic";
})(EndpointDisabledTrigger = exports.EndpointDisabledTrigger || (exports.EndpointDisabledTrigger = {}));
exports.EndpointDisabledTriggerSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=endpointDisabledTrigger.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ordering.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OrderingSerializer = exports.Ordering = void 0;
var Ordering;
(function(Ordering) {
    Ordering["Ascending"] = "ascending";
    Ordering["Descending"] = "descending";
})(Ordering = exports.Ordering || (exports.Ordering = {}));
exports.OrderingSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=ordering.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/statusCodeClass.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StatusCodeClassSerializer = exports.StatusCodeClass = void 0;
var StatusCodeClass;
(function(StatusCodeClass) {
    StatusCodeClass[StatusCodeClass["CodeNone"] = 0] = "CodeNone";
    StatusCodeClass[StatusCodeClass["Code1xx"] = 100] = "Code1xx";
    StatusCodeClass[StatusCodeClass["Code2xx"] = 200] = "Code2xx";
    StatusCodeClass[StatusCodeClass["Code3xx"] = 300] = "Code3xx";
    StatusCodeClass[StatusCodeClass["Code4xx"] = 400] = "Code4xx";
    StatusCodeClass[StatusCodeClass["Code5xx"] = 500] = "Code5xx";
})(StatusCodeClass = exports.StatusCodeClass || (exports.StatusCodeClass = {}));
exports.StatusCodeClassSerializer = {
    _fromJsonObject (object) {
        return object;
    },
    _toJsonObject (self) {
        return self;
    }
}; //# sourceMappingURL=statusCodeClass.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StatusCodeClass = exports.Ordering = exports.MessageStatusText = exports.MessageStatus = exports.MessageAttemptTriggerType = exports.EndpointDisabledTrigger = exports.ConnectorKind = exports.BackgroundTaskType = exports.BackgroundTaskStatus = exports.AppPortalCapability = void 0;
var appPortalCapability_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/appPortalCapability.js [app-route] (ecmascript)");
Object.defineProperty(exports, "AppPortalCapability", {
    enumerable: true,
    get: function() {
        return appPortalCapability_1.AppPortalCapability;
    }
});
var backgroundTaskStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskStatus.js [app-route] (ecmascript)");
Object.defineProperty(exports, "BackgroundTaskStatus", {
    enumerable: true,
    get: function() {
        return backgroundTaskStatus_1.BackgroundTaskStatus;
    }
});
var backgroundTaskType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/backgroundTaskType.js [app-route] (ecmascript)");
Object.defineProperty(exports, "BackgroundTaskType", {
    enumerable: true,
    get: function() {
        return backgroundTaskType_1.BackgroundTaskType;
    }
});
var connectorKind_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/connectorKind.js [app-route] (ecmascript)");
Object.defineProperty(exports, "ConnectorKind", {
    enumerable: true,
    get: function() {
        return connectorKind_1.ConnectorKind;
    }
});
var endpointDisabledTrigger_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/endpointDisabledTrigger.js [app-route] (ecmascript)");
Object.defineProperty(exports, "EndpointDisabledTrigger", {
    enumerable: true,
    get: function() {
        return endpointDisabledTrigger_1.EndpointDisabledTrigger;
    }
});
var messageAttemptTriggerType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageAttemptTriggerType.js [app-route] (ecmascript)");
Object.defineProperty(exports, "MessageAttemptTriggerType", {
    enumerable: true,
    get: function() {
        return messageAttemptTriggerType_1.MessageAttemptTriggerType;
    }
});
var messageStatus_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatus.js [app-route] (ecmascript)");
Object.defineProperty(exports, "MessageStatus", {
    enumerable: true,
    get: function() {
        return messageStatus_1.MessageStatus;
    }
});
var messageStatusText_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/messageStatusText.js [app-route] (ecmascript)");
Object.defineProperty(exports, "MessageStatusText", {
    enumerable: true,
    get: function() {
        return messageStatusText_1.MessageStatusText;
    }
});
var ordering_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/ordering.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Ordering", {
    enumerable: true,
    get: function() {
        return ordering_1.Ordering;
    }
});
var statusCodeClass_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/statusCodeClass.js [app-route] (ecmascript)");
Object.defineProperty(exports, "StatusCodeClass", {
    enumerable: true,
    get: function() {
        return statusCodeClass_1.StatusCodeClass;
    }
}); //# sourceMappingURL=index.js.map
}),
"[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Svix = exports.messageInRaw = exports.ValidationError = exports.HttpErrorOut = exports.HTTPValidationError = exports.ApiException = void 0;
const application_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/application.js [app-route] (ecmascript)");
const authentication_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/authentication.js [app-route] (ecmascript)");
const backgroundTask_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/backgroundTask.js [app-route] (ecmascript)");
const endpoint_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/endpoint.js [app-route] (ecmascript)");
const environment_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/environment.js [app-route] (ecmascript)");
const eventType_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/eventType.js [app-route] (ecmascript)");
const health_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/health.js [app-route] (ecmascript)");
const ingest_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/ingest.js [app-route] (ecmascript)");
const integration_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/integration.js [app-route] (ecmascript)");
const message_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/message.js [app-route] (ecmascript)");
const messageAttempt_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/messageAttempt.js [app-route] (ecmascript)");
const operationalWebhook_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/operationalWebhook.js [app-route] (ecmascript)");
const statistics_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/statistics.js [app-route] (ecmascript)");
const operationalWebhookEndpoint_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/operationalWebhookEndpoint.js [app-route] (ecmascript)");
var util_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/util.js [app-route] (ecmascript)");
Object.defineProperty(exports, "ApiException", {
    enumerable: true,
    get: function() {
        return util_1.ApiException;
    }
});
var HttpErrors_1 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/HttpErrors.js [app-route] (ecmascript)");
Object.defineProperty(exports, "HTTPValidationError", {
    enumerable: true,
    get: function() {
        return HttpErrors_1.HTTPValidationError;
    }
});
Object.defineProperty(exports, "HttpErrorOut", {
    enumerable: true,
    get: function() {
        return HttpErrors_1.HttpErrorOut;
    }
});
Object.defineProperty(exports, "ValidationError", {
    enumerable: true,
    get: function() {
        return HttpErrors_1.ValidationError;
    }
});
__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/webhook.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/models/index.js [app-route] (ecmascript)"), exports);
var message_2 = __turbopack_context__.r("[project]/node_modules/.pnpm/svix@1.76.1/node_modules/svix/dist/api/message.js [app-route] (ecmascript)");
Object.defineProperty(exports, "messageInRaw", {
    enumerable: true,
    get: function() {
        return message_2.messageInRaw;
    }
});
const REGIONS = [
    {
        region: "us",
        url: "https://api.us.svix.com"
    },
    {
        region: "eu",
        url: "https://api.eu.svix.com"
    },
    {
        region: "in",
        url: "https://api.in.svix.com"
    },
    {
        region: "ca",
        url: "https://api.ca.svix.com"
    },
    {
        region: "au",
        url: "https://api.au.svix.com"
    }
];
class Svix {
    constructor(token, options = {}){
        var _a, _b, _c;
        const regionalUrl = (_a = REGIONS.find((x)=>x.region === token.split(".")[1])) === null || _a === void 0 ? void 0 : _a.url;
        const baseUrl = (_c = (_b = options.serverUrl) !== null && _b !== void 0 ? _b : regionalUrl) !== null && _c !== void 0 ? _c : "https://api.svix.com";
        if (options.retryScheduleInMs) {
            this.requestCtx = {
                baseUrl,
                token,
                timeout: options.requestTimeout,
                retryScheduleInMs: options.retryScheduleInMs
            };
            return;
        }
        if (options.numRetries) {
            this.requestCtx = {
                baseUrl,
                token,
                timeout: options.requestTimeout,
                numRetries: options.numRetries
            };
            return;
        }
        this.requestCtx = {
            baseUrl,
            token,
            timeout: options.requestTimeout
        };
    }
    get application() {
        return new application_1.Application(this.requestCtx);
    }
    get authentication() {
        return new authentication_1.Authentication(this.requestCtx);
    }
    get backgroundTask() {
        return new backgroundTask_1.BackgroundTask(this.requestCtx);
    }
    get endpoint() {
        return new endpoint_1.Endpoint(this.requestCtx);
    }
    get environment() {
        return new environment_1.Environment(this.requestCtx);
    }
    get eventType() {
        return new eventType_1.EventType(this.requestCtx);
    }
    get health() {
        return new health_1.Health(this.requestCtx);
    }
    get ingest() {
        return new ingest_1.Ingest(this.requestCtx);
    }
    get integration() {
        return new integration_1.Integration(this.requestCtx);
    }
    get message() {
        return new message_1.Message(this.requestCtx);
    }
    get messageAttempt() {
        return new messageAttempt_1.MessageAttempt(this.requestCtx);
    }
    get operationalWebhook() {
        return new operationalWebhook_1.OperationalWebhook(this.requestCtx);
    }
    get statistics() {
        return new statistics_1.Statistics(this.requestCtx);
    }
    get operationalWebhookEndpoint() {
        return new operationalWebhookEndpoint_1.OperationalWebhookEndpoint(this.requestCtx);
    }
}
exports.Svix = Svix; //# sourceMappingURL=index.js.map
}),
];

//# sourceMappingURL=34851_svix_dist_b7c63b06._.js.map