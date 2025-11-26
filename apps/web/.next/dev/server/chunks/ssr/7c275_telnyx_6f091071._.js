module.exports = [
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/tslib.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__classPrivateFieldGet",
    ()=>__classPrivateFieldGet,
    "__classPrivateFieldSet",
    ()=>__classPrivateFieldSet
]);
function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
;
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/uuid.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * https://stackoverflow.com/a/2117523
 */ __turbopack_context__.s([
    "uuid4",
    ()=>uuid4
]);
let uuid4 = function() {
    const { crypto } = globalThis;
    if (crypto?.randomUUID) {
        uuid4 = crypto.randomUUID.bind(crypto);
        return crypto.randomUUID();
    }
    const u8 = new Uint8Array(1);
    const randomByte = crypto ? ()=>crypto.getRandomValues(u8)[0] : ()=>Math.random() * 0xff & 0xff;
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c)=>(+c ^ randomByte() & 15 >> +c / 4).toString(16));
}; //# sourceMappingURL=uuid.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/errors.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "castToError",
    ()=>castToError,
    "isAbortError",
    ()=>isAbortError
]);
function isAbortError(err) {
    return typeof err === 'object' && err !== null && // Spec-compliant fetch implementations
    ('name' in err && err.name === 'AbortError' || 'message' in err && String(err.message).includes('FetchRequestCanceledException'));
}
const castToError = (err)=>{
    if (err instanceof Error) return err;
    if (typeof err === 'object' && err !== null) {
        try {
            if (Object.prototype.toString.call(err) === '[object Error]') {
                // @ts-ignore - not all envs have native support for cause yet
                const error = new Error(err.message, err.cause ? {
                    cause: err.cause
                } : {});
                if (err.stack) error.stack = err.stack;
                // @ts-ignore - not all envs have native support for cause yet
                if (err.cause && !error.cause) error.cause = err.cause;
                if (err.name) error.name = err.name;
                return error;
            }
        } catch  {}
        try {
            return new Error(JSON.stringify(err));
        } catch  {}
    }
    return new Error(err);
}; //# sourceMappingURL=errors.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/values.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "coerceBoolean",
    ()=>coerceBoolean,
    "coerceFloat",
    ()=>coerceFloat,
    "coerceInteger",
    ()=>coerceInteger,
    "ensurePresent",
    ()=>ensurePresent,
    "hasOwn",
    ()=>hasOwn,
    "isAbsoluteURL",
    ()=>isAbsoluteURL,
    "isArray",
    ()=>isArray,
    "isEmptyObj",
    ()=>isEmptyObj,
    "isObj",
    ()=>isObj,
    "isReadonlyArray",
    ()=>isReadonlyArray,
    "maybeCoerceBoolean",
    ()=>maybeCoerceBoolean,
    "maybeCoerceFloat",
    ()=>maybeCoerceFloat,
    "maybeCoerceInteger",
    ()=>maybeCoerceInteger,
    "maybeObj",
    ()=>maybeObj,
    "safeJSON",
    ()=>safeJSON,
    "validatePositiveInteger",
    ()=>validatePositiveInteger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/error.mjs [app-rsc] (ecmascript)");
;
// https://url.spec.whatwg.org/#url-scheme-string
const startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
const isAbsoluteURL = (url)=>{
    return startsWithSchemeRegexp.test(url);
};
let isArray = (val)=>(isArray = Array.isArray, isArray(val));
let isReadonlyArray = isArray;
function maybeObj(x) {
    if (typeof x !== 'object') {
        return {};
    }
    return x ?? {};
}
function isEmptyObj(obj) {
    if (!obj) return true;
    for(const _k in obj)return false;
    return true;
}
function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function isObj(obj) {
    return obj != null && typeof obj === 'object' && !Array.isArray(obj);
}
const ensurePresent = (value)=>{
    if (value == null) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"](`Expected a value to be given but received ${value} instead.`);
    }
    return value;
};
const validatePositiveInteger = (name, n)=>{
    if (typeof n !== 'number' || !Number.isInteger(n)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"](`${name} must be an integer`);
    }
    if (n < 0) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"](`${name} must be a positive integer`);
    }
    return n;
};
const coerceInteger = (value)=>{
    if (typeof value === 'number') return Math.round(value);
    if (typeof value === 'string') return parseInt(value, 10);
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"](`Could not coerce ${value} (type: ${typeof value}) into a number`);
};
const coerceFloat = (value)=>{
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"](`Could not coerce ${value} (type: ${typeof value}) into a number`);
};
const coerceBoolean = (value)=>{
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return Boolean(value);
};
const maybeCoerceInteger = (value)=>{
    if (value == null) {
        return undefined;
    }
    return coerceInteger(value);
};
const maybeCoerceFloat = (value)=>{
    if (value == null) {
        return undefined;
    }
    return coerceFloat(value);
};
const maybeCoerceBoolean = (value)=>{
    if (value == null) {
        return undefined;
    }
    return coerceBoolean(value);
};
const safeJSON = (text)=>{
    try {
        return JSON.parse(text);
    } catch (err) {
        return undefined;
    }
}; //# sourceMappingURL=values.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/sleep.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "sleep",
    ()=>sleep
]);
const sleep = (ms)=>new Promise((resolve)=>setTimeout(resolve, ms)); //# sourceMappingURL=sleep.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/detect-platform.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "getPlatformHeaders",
    ()=>getPlatformHeaders,
    "isRunningInBrowser",
    ()=>isRunningInBrowser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/version.mjs [app-rsc] (ecmascript)");
;
const isRunningInBrowser = ()=>{
    return(// @ts-ignore
    ("TURBOPACK compile-time value", "undefined") !== 'undefined' && // @ts-ignore
    typeof window.document !== 'undefined' && // @ts-ignore
    typeof navigator !== 'undefined');
};
/**
 * Note this does not detect 'browser'; for that, use getBrowserInfo().
 */ function getDetectedPlatform() {
    if (typeof Deno !== 'undefined' && Deno.build != null) {
        return 'deno';
    }
    if (typeof EdgeRuntime !== 'undefined') {
        return 'edge';
    }
    if (Object.prototype.toString.call(typeof globalThis.process !== 'undefined' ? globalThis.process : 0) === '[object process]') {
        return 'node';
    }
    return 'unknown';
}
const getPlatformProperties = ()=>{
    const detectedPlatform = getDetectedPlatform();
    if (detectedPlatform === 'deno') {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': normalizePlatform(Deno.build.os),
            'X-Stainless-Arch': normalizeArch(Deno.build.arch),
            'X-Stainless-Runtime': 'deno',
            'X-Stainless-Runtime-Version': typeof Deno.version === 'string' ? Deno.version : Deno.version?.deno ?? 'unknown'
        };
    }
    if (typeof EdgeRuntime !== 'undefined') {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': 'Unknown',
            'X-Stainless-Arch': `other:${EdgeRuntime}`,
            'X-Stainless-Runtime': 'edge',
            'X-Stainless-Runtime-Version': globalThis.process.version
        };
    }
    // Check if Node.js
    if (detectedPlatform === 'node') {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': normalizePlatform(globalThis.process.platform ?? 'unknown'),
            'X-Stainless-Arch': normalizeArch(globalThis.process.arch ?? 'unknown'),
            'X-Stainless-Runtime': 'node',
            'X-Stainless-Runtime-Version': globalThis.process.version ?? 'unknown'
        };
    }
    const browserInfo = getBrowserInfo();
    if (browserInfo) {
        return {
            'X-Stainless-Lang': 'js',
            'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
            'X-Stainless-OS': 'Unknown',
            'X-Stainless-Arch': 'unknown',
            'X-Stainless-Runtime': `browser:${browserInfo.browser}`,
            'X-Stainless-Runtime-Version': browserInfo.version
        };
    }
    // TODO add support for Cloudflare workers, etc.
    return {
        'X-Stainless-Lang': 'js',
        'X-Stainless-Package-Version': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$version$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VERSION"],
        'X-Stainless-OS': 'Unknown',
        'X-Stainless-Arch': 'unknown',
        'X-Stainless-Runtime': 'unknown',
        'X-Stainless-Runtime-Version': 'unknown'
    };
};
// Note: modified from https://github.com/JS-DevTools/host-environment/blob/b1ab79ecde37db5d6e163c050e54fe7d287d7c92/src/isomorphic.browser.ts
function getBrowserInfo() {
    if (typeof navigator === 'undefined' || !navigator) {
        return null;
    }
    // NOTE: The order matters here!
    const browserPatterns = [
        {
            key: 'edge',
            pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'ie',
            pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'ie',
            pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'chrome',
            pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'firefox',
            pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/
        },
        {
            key: 'safari',
            pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/
        }
    ];
    // Find the FIRST matching browser
    for (const { key, pattern } of browserPatterns){
        const match = pattern.exec(navigator.userAgent);
        if (match) {
            const major = match[1] || 0;
            const minor = match[2] || 0;
            const patch = match[3] || 0;
            return {
                browser: key,
                version: `${major}.${minor}.${patch}`
            };
        }
    }
    return null;
}
const normalizeArch = (arch)=>{
    // Node docs:
    // - https://nodejs.org/api/process.html#processarch
    // Deno docs:
    // - https://doc.deno.land/deno/stable/~/Deno.build
    if (arch === 'x32') return 'x32';
    if (arch === 'x86_64' || arch === 'x64') return 'x64';
    if (arch === 'arm') return 'arm';
    if (arch === 'aarch64' || arch === 'arm64') return 'arm64';
    if (arch) return `other:${arch}`;
    return 'unknown';
};
const normalizePlatform = (platform)=>{
    // Node platforms:
    // - https://nodejs.org/api/process.html#processplatform
    // Deno platforms:
    // - https://doc.deno.land/deno/stable/~/Deno.build
    // - https://github.com/denoland/deno/issues/14799
    platform = platform.toLowerCase();
    // NOTE: this iOS check is untested and may not work
    // Node does not work natively on IOS, there is a fork at
    // https://github.com/nodejs-mobile/nodejs-mobile
    // however it is unknown at the time of writing how to detect if it is running
    if (platform.includes('ios')) return 'iOS';
    if (platform === 'android') return 'Android';
    if (platform === 'darwin') return 'MacOS';
    if (platform === 'win32') return 'Windows';
    if (platform === 'freebsd') return 'FreeBSD';
    if (platform === 'openbsd') return 'OpenBSD';
    if (platform === 'linux') return 'Linux';
    if (platform) return `Other:${platform}`;
    return 'Unknown';
};
let _platformHeaders;
const getPlatformHeaders = ()=>{
    return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
}; //# sourceMappingURL=detect-platform.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/shims.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "CancelReadableStream",
    ()=>CancelReadableStream,
    "ReadableStreamFrom",
    ()=>ReadableStreamFrom,
    "ReadableStreamToAsyncIterable",
    ()=>ReadableStreamToAsyncIterable,
    "getDefaultFetch",
    ()=>getDefaultFetch,
    "makeReadableStream",
    ()=>makeReadableStream
]);
function getDefaultFetch() {
    if (typeof fetch !== 'undefined') {
        return fetch;
    }
    throw new Error('`fetch` is not defined as a global; Either pass `fetch` to the client, `new Telnyx({ fetch })` or polyfill the global, `globalThis.fetch = fetch`');
}
function makeReadableStream(...args) {
    const ReadableStream = globalThis.ReadableStream;
    if (typeof ReadableStream === 'undefined') {
        // Note: All of the platforms / runtimes we officially support already define
        // `ReadableStream` as a global, so this should only ever be hit on unsupported runtimes.
        throw new Error('`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`');
    }
    return new ReadableStream(...args);
}
function ReadableStreamFrom(iterable) {
    let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
    return makeReadableStream({
        start () {},
        async pull (controller) {
            const { done, value } = await iter.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        },
        async cancel () {
            await iter.return?.();
        }
    });
}
function ReadableStreamToAsyncIterable(stream) {
    if (stream[Symbol.asyncIterator]) return stream;
    const reader = stream.getReader();
    return {
        async next () {
            try {
                const result = await reader.read();
                if (result?.done) reader.releaseLock(); // release lock when stream becomes closed
                return result;
            } catch (e) {
                reader.releaseLock(); // release lock when stream becomes errored
                throw e;
            }
        },
        async return () {
            const cancelPromise = reader.cancel();
            reader.releaseLock();
            await cancelPromise;
            return {
                done: true,
                value: undefined
            };
        },
        [Symbol.asyncIterator] () {
            return this;
        }
    };
}
async function CancelReadableStream(stream) {
    if (stream === null || typeof stream !== 'object') return;
    if (stream[Symbol.asyncIterator]) {
        await stream[Symbol.asyncIterator]().return?.();
        return;
    }
    const reader = stream.getReader();
    const cancelPromise = reader.cancel();
    reader.releaseLock();
    await cancelPromise;
} //# sourceMappingURL=shims.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/request-options.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "FallbackEncoder",
    ()=>FallbackEncoder
]);
const FallbackEncoder = ({ headers, body })=>{
    return {
        bodyHeaders: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    };
}; //# sourceMappingURL=request-options.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/formats.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RFC1738",
    ()=>RFC1738,
    "RFC3986",
    ()=>RFC3986,
    "default_format",
    ()=>default_format,
    "default_formatter",
    ()=>default_formatter,
    "formatters",
    ()=>formatters
]);
const default_format = 'RFC3986';
const default_formatter = (v)=>String(v);
const formatters = {
    RFC1738: (v)=>String(v).replace(/%20/g, '+'),
    RFC3986: default_formatter
};
const RFC1738 = 'RFC1738';
const RFC3986 = 'RFC3986'; //# sourceMappingURL=formats.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/utils.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assign_single_source",
    ()=>assign_single_source,
    "combine",
    ()=>combine,
    "compact",
    ()=>compact,
    "decode",
    ()=>decode,
    "encode",
    ()=>encode,
    "has",
    ()=>has,
    "is_buffer",
    ()=>is_buffer,
    "is_regexp",
    ()=>is_regexp,
    "maybe_map",
    ()=>maybe_map,
    "merge",
    ()=>merge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/formats.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/values.mjs [app-rsc] (ecmascript)");
;
;
let has = (obj, key)=>(has = Object.hasOwn ?? Function.prototype.call.bind(Object.prototype.hasOwnProperty), has(obj, key));
const hex_table = /* @__PURE__ */ (()=>{
    const array = [];
    for(let i = 0; i < 256; ++i){
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }
    return array;
})();
function compact_queue(queue) {
    while(queue.length > 1){
        const item = queue.pop();
        if (!item) continue;
        const obj = item.obj[item.prop];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj)) {
            const compacted = [];
            for(let j = 0; j < obj.length; ++j){
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }
            // @ts-ignore
            item.obj[item.prop] = compacted;
        }
    }
}
function array_to_object(source, options) {
    const obj = options && options.plainObjects ? Object.create(null) : {};
    for(let i = 0; i < source.length; ++i){
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }
    return obj;
}
function merge(target, source, options = {}) {
    if (!source) {
        return target;
    }
    if (typeof source !== 'object') {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if (options && (options.plainObjects || options.allowPrototypes) || !has(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [
                target,
                source
            ];
        }
        return target;
    }
    if (!target || typeof target !== 'object') {
        return [
            target
        ].concat(source);
    }
    let mergeTarget = target;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(target) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(source)) {
        // @ts-ignore
        mergeTarget = array_to_object(target, options);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(target) && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(source)) {
        source.forEach(function(item, i) {
            if (has(target, i)) {
                const targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }
    return Object.keys(source).reduce(function(acc, key) {
        const value = source[key];
        if (has(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
}
function assign_single_source(target, source) {
    return Object.keys(source).reduce(function(acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
}
function decode(str, _, charset) {
    const strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
}
const limit = 1024;
const encode = (str, _defaultEncoder, charset, _kind, format)=>{
    // This code was originally written by Brian White for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }
    let string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }
    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }
    let out = '';
    for(let j = 0; j < string.length; j += limit){
        const segment = string.length >= limit ? string.slice(j, j + limit) : string;
        const arr = [];
        for(let i = 0; i < segment.length; ++i){
            let c = segment.charCodeAt(i);
            if (c === 0x2d || // -
            c === 0x2e || // .
            c === 0x5f || // _
            c === 0x7e || c >= 0x30 && c <= 0x39 || c >= 0x41 && c <= 0x5a || c >= 0x61 && c <= 0x7a || format === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RFC1738"] && (c === 0x28 || c === 0x29) // ( )
            ) {
                arr[arr.length] = segment.charAt(i);
                continue;
            }
            if (c < 0x80) {
                arr[arr.length] = hex_table[c];
                continue;
            }
            if (c < 0x800) {
                arr[arr.length] = hex_table[0xc0 | c >> 6] + hex_table[0x80 | c & 0x3f];
                continue;
            }
            if (c < 0xd800 || c >= 0xe000) {
                arr[arr.length] = hex_table[0xe0 | c >> 12] + hex_table[0x80 | c >> 6 & 0x3f] + hex_table[0x80 | c & 0x3f];
                continue;
            }
            i += 1;
            c = 0x10000 + ((c & 0x3ff) << 10 | segment.charCodeAt(i) & 0x3ff);
            arr[arr.length] = hex_table[0xf0 | c >> 18] + hex_table[0x80 | c >> 12 & 0x3f] + hex_table[0x80 | c >> 6 & 0x3f] + hex_table[0x80 | c & 0x3f];
        }
        out += arr.join('');
    }
    return out;
};
function compact(value) {
    const queue = [
        {
            obj: {
                o: value
            },
            prop: 'o'
        }
    ];
    const refs = [];
    for(let i = 0; i < queue.length; ++i){
        const item = queue[i];
        // @ts-ignore
        const obj = item.obj[item.prop];
        const keys = Object.keys(obj);
        for(let j = 0; j < keys.length; ++j){
            const key = keys[j];
            const val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({
                    obj: obj,
                    prop: key
                });
                refs.push(val);
            }
        }
    }
    compact_queue(queue);
    return value;
}
function is_regexp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
}
function is_buffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }
    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
}
function combine(a, b) {
    return [].concat(a, b);
}
function maybe_map(val, fn) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(val)) {
        const mapped = [];
        for(let i = 0; i < val.length; i += 1){
            mapped.push(fn(val[i]));
        }
        return mapped;
    }
    return fn(val);
} //# sourceMappingURL=utils.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/stringify.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stringify",
    ()=>stringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/utils.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/formats.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/values.mjs [app-rsc] (ecmascript)");
;
;
;
const array_prefix_generators = {
    brackets (prefix) {
        return String(prefix) + '[]';
    },
    comma: 'comma',
    indices (prefix, key) {
        return String(prefix) + '[' + key + ']';
    },
    repeat (prefix) {
        return String(prefix);
    }
};
const push_to_array = function(arr, value_or_array) {
    Array.prototype.push.apply(arr, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(value_or_array) ? value_or_array : [
        value_or_array
    ]);
};
let toISOString;
const defaults = {
    addQueryPrefix: false,
    allowDots: false,
    allowEmptyArrays: false,
    arrayFormat: 'indices',
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encodeDotInKeys: false,
    encoder: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["encode"],
    encodeValuesOnly: false,
    format: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default_format"],
    formatter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default_formatter"],
    /** @deprecated */ indices: false,
    serializeDate (date) {
        return (toISOString ?? (toISOString = Function.prototype.call.bind(Date.prototype.toISOString)))(date);
    },
    skipNulls: false,
    strictNullHandling: false
};
function is_non_nullish_primitive(v) {
    return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || typeof v === 'symbol' || typeof v === 'bigint';
}
const sentinel = {};
function inner_stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
    let obj = object;
    let tmp_sc = sideChannel;
    let step = 0;
    let find_flag = false;
    while((tmp_sc = tmp_sc.get(sentinel)) !== void undefined && !find_flag){
        // Where object last appeared in the ref tree
        const pos = tmp_sc.get(object);
        step += 1;
        if (typeof pos !== 'undefined') {
            if (pos === step) {
                throw new RangeError('Cyclic object value');
            } else {
                find_flag = true; // Break while
            }
        }
        if (typeof tmp_sc.get(sentinel) === 'undefined') {
            step = 0;
        }
    }
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate?.(obj);
    } else if (generateArrayPrefix === 'comma' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj)) {
        obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["maybe_map"])(obj, function(value) {
            if (value instanceof Date) {
                return serializeDate?.(value);
            }
            return value;
        });
    }
    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? // @ts-expect-error
            encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
        }
        obj = '';
    }
    if (is_non_nullish_primitive(obj) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["is_buffer"])(obj)) {
        if (encoder) {
            const key_value = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
            return [
                formatter?.(key_value) + '=' + // @ts-expect-error
                formatter?.(encoder(obj, defaults.encoder, charset, 'value', format))
            ];
        }
        return [
            formatter?.(prefix) + '=' + formatter?.(String(obj))
        ];
    }
    const values = [];
    if (typeof obj === 'undefined') {
        return values;
    }
    let obj_keys;
    if (generateArrayPrefix === 'comma' && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj)) {
        // we need to join elements in
        if (encodeValuesOnly && encoder) {
            // @ts-expect-error values only
            obj = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["maybe_map"])(obj, encoder);
        }
        obj_keys = [
            {
                value: obj.length > 0 ? obj.join(',') || null : void undefined
            }
        ];
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(filter)) {
        obj_keys = filter;
    } else {
        const keys = Object.keys(obj);
        obj_keys = sort ? keys.sort(sort) : keys;
    }
    const encoded_prefix = encodeDotInKeys ? String(prefix).replace(/\./g, '%2E') : String(prefix);
    const adjusted_prefix = commaRoundTrip && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj) && obj.length === 1 ? encoded_prefix + '[]' : encoded_prefix;
    if (allowEmptyArrays && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj) && obj.length === 0) {
        return adjusted_prefix + '[]';
    }
    for(let j = 0; j < obj_keys.length; ++j){
        const key = obj_keys[j];
        const value = // @ts-ignore
        typeof key === 'object' && typeof key.value !== 'undefined' ? key.value : obj[key];
        if (skipNulls && value === null) {
            continue;
        }
        // @ts-ignore
        const encoded_key = allowDots && encodeDotInKeys ? key.replace(/\./g, '%2E') : key;
        const key_prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj) ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjusted_prefix, encoded_key) : adjusted_prefix : adjusted_prefix + (allowDots ? '.' + encoded_key : '[' + encoded_key + ']');
        sideChannel.set(object, step);
        const valueSideChannel = new WeakMap();
        valueSideChannel.set(sentinel, sideChannel);
        push_to_array(values, inner_stringify(value, key_prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, // @ts-ignore
        generateArrayPrefix === 'comma' && encodeValuesOnly && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
    }
    return values;
}
function normalize_stringify_options(opts = defaults) {
    if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
        throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
    }
    if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
        throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
    }
    if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }
    const charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    let format = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default_format"];
    if (typeof opts.format !== 'undefined') {
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$utils$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["has"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatters"], opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    const formatter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatters"][format];
    let filter = defaults.filter;
    if (typeof opts.filter === 'function' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(opts.filter)) {
        filter = opts.filter;
    }
    let arrayFormat;
    if (opts.arrayFormat && opts.arrayFormat in array_prefix_generators) {
        arrayFormat = opts.arrayFormat;
    } else if ('indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = defaults.arrayFormat;
    }
    if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
        throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
    }
    const allowDots = typeof opts.allowDots === 'undefined' ? !!opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        // @ts-ignore
        allowDots: allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat: arrayFormat,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        format: format,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        // @ts-ignore
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
}
function stringify(object, opts = {}) {
    let obj = object;
    const options = normalize_stringify_options(opts);
    let obj_keys;
    let filter;
    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isArray"])(options.filter)) {
        filter = options.filter;
        obj_keys = filter;
    }
    const keys = [];
    if (typeof obj !== 'object' || obj === null) {
        return '';
    }
    const generateArrayPrefix = array_prefix_generators[options.arrayFormat];
    const commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;
    if (!obj_keys) {
        obj_keys = Object.keys(obj);
    }
    if (options.sort) {
        obj_keys.sort(options.sort);
    }
    const sideChannel = new WeakMap();
    for(let i = 0; i < obj_keys.length; ++i){
        const key = obj_keys[i];
        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        push_to_array(keys, inner_stringify(obj[key], key, // @ts-expect-error
        generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
    }
    const joined = keys.join(options.delimiter);
    let prefix = options.addQueryPrefix === true ? '?' : '';
    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }
    return joined.length > 0 ? prefix + joined : '';
} //# sourceMappingURL=stringify.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formats",
    ()=>formats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/formats.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$stringify$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/qs/stringify.mjs [app-rsc] (ecmascript)");
;
const formats = {
    formatters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatters"],
    RFC1738: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RFC1738"],
    RFC3986: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["RFC3986"],
    default: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$qs$2f$formats$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default_format"]
};
;
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/uploads.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkFileSupport",
    ()=>checkFileSupport,
    "createForm",
    ()=>createForm,
    "getName",
    ()=>getName,
    "isAsyncIterable",
    ()=>isAsyncIterable,
    "makeFile",
    ()=>makeFile,
    "maybeMultipartFormRequestOptions",
    ()=>maybeMultipartFormRequestOptions,
    "multipartFormRequestOptions",
    ()=>multipartFormRequestOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/shims.mjs [app-rsc] (ecmascript)");
;
const checkFileSupport = ()=>{
    if (typeof File === 'undefined') {
        const { process } = globalThis;
        const isOldNode = typeof process?.versions?.node === 'string' && parseInt(process.versions.node.split('.')) < 20;
        throw new Error('`File` is not defined as a global, which is required for file uploads.' + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ''));
    }
};
function makeFile(fileBits, fileName, options) {
    checkFileSupport();
    return new File(fileBits, fileName ?? 'unknown_file', options);
}
function getName(value) {
    return (typeof value === 'object' && value !== null && ('name' in value && value.name && String(value.name) || 'url' in value && value.url && String(value.url) || 'filename' in value && value.filename && String(value.filename) || 'path' in value && value.path && String(value.path)) || '').split(/[\\/]/).pop() || undefined;
}
const isAsyncIterable = (value)=>value != null && typeof value === 'object' && typeof value[Symbol.asyncIterator] === 'function';
const maybeMultipartFormRequestOptions = async (opts, fetch)=>{
    if (!hasUploadableValue(opts.body)) return opts;
    return {
        ...opts,
        body: await createForm(opts.body, fetch)
    };
};
const multipartFormRequestOptions = async (opts, fetch)=>{
    return {
        ...opts,
        body: await createForm(opts.body, fetch)
    };
};
const supportsFormDataMap = /* @__PURE__ */ new WeakMap();
/**
 * node-fetch doesn't support the global FormData object in recent node versions. Instead of sending
 * properly-encoded form data, it just stringifies the object, resulting in a request body of "[object FormData]".
 * This function detects if the fetch function provided supports the global FormData object to avoid
 * confusing error messages later on.
 */ function supportsFormData(fetchObject) {
    const fetch = typeof fetchObject === 'function' ? fetchObject : fetchObject.fetch;
    const cached = supportsFormDataMap.get(fetch);
    if (cached) return cached;
    const promise = (async ()=>{
        try {
            const FetchResponse = 'Response' in fetch ? fetch.Response : (await fetch('data:,')).constructor;
            const data = new FormData();
            if (data.toString() === await new FetchResponse(data).text()) {
                return false;
            }
            return true;
        } catch  {
            // avoid false negatives
            return true;
        }
    })();
    supportsFormDataMap.set(fetch, promise);
    return promise;
}
const createForm = async (body, fetch)=>{
    if (!await supportsFormData(fetch)) {
        throw new TypeError('The provided fetch function does not support file uploads with the current global FormData class.');
    }
    const form = new FormData();
    await Promise.all(Object.entries(body || {}).map(([key, value])=>addFormValue(form, key, value)));
    return form;
};
// We check for Blob not File because Bun.File doesn't inherit from File,
// but they both inherit from Blob and have a `name` property at runtime.
const isNamedBlob = (value)=>value instanceof Blob && 'name' in value;
const isUploadable = (value)=>typeof value === 'object' && value !== null && (value instanceof Response || isAsyncIterable(value) || isNamedBlob(value));
const hasUploadableValue = (value)=>{
    if (isUploadable(value)) return true;
    if (Array.isArray(value)) return value.some(hasUploadableValue);
    if (value && typeof value === 'object') {
        for(const k in value){
            if (hasUploadableValue(value[k])) return true;
        }
    }
    return false;
};
const addFormValue = async (form, key, value)=>{
    if (value === undefined) return;
    if (value == null) {
        throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
    }
    // TODO: make nested formats configurable
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        form.append(key, String(value));
    } else if (value instanceof Response) {
        form.append(key, makeFile([
            await value.blob()
        ], getName(value)));
    } else if (isAsyncIterable(value)) {
        form.append(key, makeFile([
            await new Response((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$shims$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ReadableStreamFrom"])(value)).blob()
        ], getName(value)));
    } else if (isNamedBlob(value)) {
        form.append(key, value, getName(value));
    } else if (Array.isArray(value)) {
        await Promise.all(value.map((entry)=>addFormValue(form, key + '[]', entry)));
    } else if (typeof value === 'object') {
        await Promise.all(Object.entries(value).map(([name, prop])=>addFormValue(form, `${key}[${name}]`, prop)));
    } else {
        throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
    }
}; //# sourceMappingURL=uploads.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/to-file.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toFile",
    ()=>toFile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/uploads.mjs [app-rsc] (ecmascript)");
;
;
/**
 * This check adds the arrayBuffer() method type because it is available and used at runtime
 */ const isBlobLike = (value)=>value != null && typeof value === 'object' && typeof value.size === 'number' && typeof value.type === 'string' && typeof value.text === 'function' && typeof value.slice === 'function' && typeof value.arrayBuffer === 'function';
/**
 * This check adds the arrayBuffer() method type because it is available and used at runtime
 */ const isFileLike = (value)=>value != null && typeof value === 'object' && typeof value.name === 'string' && typeof value.lastModified === 'number' && isBlobLike(value);
const isResponseLike = (value)=>value != null && typeof value === 'object' && typeof value.url === 'string' && typeof value.blob === 'function';
async function toFile(value, name, options) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["checkFileSupport"])();
    // If it's a promise, resolve it.
    value = await value;
    // If we've been given a `File` we don't need to do anything
    if (isFileLike(value)) {
        if (value instanceof File) {
            return value;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeFile"])([
            await value.arrayBuffer()
        ], value.name);
    }
    if (isResponseLike(value)) {
        const blob = await value.blob();
        name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeFile"])(await getBytes(blob), name, options);
    }
    const parts = await getBytes(value);
    name || (name = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getName"])(value));
    if (!options?.type) {
        const type = parts.find((part)=>typeof part === 'object' && 'type' in part && part.type);
        if (typeof type === 'string') {
            options = {
                ...options,
                type
            };
        }
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["makeFile"])(parts, name, options);
}
async function getBytes(value) {
    let parts = [];
    if (typeof value === 'string' || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
    value instanceof ArrayBuffer) {
        parts.push(value);
    } else if (isBlobLike(value)) {
        parts.push(value instanceof Blob ? value : await value.arrayBuffer());
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAsyncIterable"])(value) // includes Readable, ReadableStream, etc.
    ) {
        for await (const chunk of value){
            parts.push(...await getBytes(chunk)); // TODO, consider validating?
        }
    } else {
        const constructor = value?.constructor?.name;
        throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ''}${propsForError(value)}`);
    }
    return parts;
}
function propsForError(value) {
    if (typeof value !== 'object' || value === null) return '';
    const props = Object.getOwnPropertyNames(value);
    return `; props: [${props.map((p)=>`"${p}"`).join(', ')}]`;
} //# sourceMappingURL=to-file.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/headers.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "buildHeaders",
    ()=>buildHeaders,
    "isEmptyHeaders",
    ()=>isEmptyHeaders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/values.mjs [app-rsc] (ecmascript)");
;
const brand_privateNullableHeaders = /* @__PURE__ */ Symbol('brand.privateNullableHeaders');
function* iterateHeaders(headers) {
    if (!headers) return;
    if (brand_privateNullableHeaders in headers) {
        const { values, nulls } = headers;
        yield* values.entries();
        for (const name of nulls){
            yield [
                name,
                null
            ];
        }
        return;
    }
    let shouldClear = false;
    let iter;
    if (headers instanceof Headers) {
        iter = headers.entries();
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isReadonlyArray"])(headers)) {
        iter = headers;
    } else {
        shouldClear = true;
        iter = Object.entries(headers ?? {});
    }
    for (let row of iter){
        const name = row[0];
        if (typeof name !== 'string') throw new TypeError('expected header name to be a string');
        const values = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isReadonlyArray"])(row[1]) ? row[1] : [
            row[1]
        ];
        let didClear = false;
        for (const value of values){
            if (value === undefined) continue;
            // Objects keys always overwrite older headers, they never append.
            // Yield a null to clear the header before adding the new values.
            if (shouldClear && !didClear) {
                didClear = true;
                yield [
                    name,
                    null
                ];
            }
            yield [
                name,
                value
            ];
        }
    }
}
const buildHeaders = (newHeaders)=>{
    const targetHeaders = new Headers();
    const nullHeaders = new Set();
    for (const headers of newHeaders){
        const seenHeaders = new Set();
        for (const [name, value] of iterateHeaders(headers)){
            const lowerName = name.toLowerCase();
            if (!seenHeaders.has(lowerName)) {
                targetHeaders.delete(name);
                seenHeaders.add(lowerName);
            }
            if (value === null) {
                targetHeaders.delete(name);
                nullHeaders.add(lowerName);
            } else {
                targetHeaders.append(name, value);
                nullHeaders.delete(lowerName);
            }
        }
    }
    return {
        [brand_privateNullableHeaders]: true,
        values: targetHeaders,
        nulls: nullHeaders
    };
};
const isEmptyHeaders = (headers)=>{
    for (const _ of iterateHeaders(headers))return false;
    return true;
}; //# sourceMappingURL=headers.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/path.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPathTagFunction",
    ()=>createPathTagFunction,
    "encodeURIPath",
    ()=>encodeURIPath,
    "path",
    ()=>path
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/error.mjs [app-rsc] (ecmascript)");
;
function encodeURIPath(str) {
    return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
const EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
const createPathTagFunction = (pathEncoder = encodeURIPath)=>function path(statics, ...params) {
        // If there are no params, no processing is needed.
        if (statics.length === 1) return statics[0];
        let postPath = false;
        const invalidSegments = [];
        const path1 = statics.reduce((previousValue, currentValue, index)=>{
            if (/[?#]/.test(currentValue)) {
                postPath = true;
            }
            const value = params[index];
            let encoded = (postPath ? encodeURIComponent : pathEncoder)('' + value);
            if (index !== params.length && (value == null || typeof value === 'object' && // handle values from other realms
            value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
                encoded = value + '';
                invalidSegments.push({
                    start: previousValue.length + currentValue.length,
                    length: encoded.length,
                    error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
                });
            }
            return previousValue + currentValue + (index === params.length ? '' : encoded);
        }, '');
        const pathOnly = path1.split(/[?#]/, 1)[0];
        const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
        let match;
        // Find all invalid segments
        while((match = invalidSegmentPattern.exec(pathOnly)) !== null){
            invalidSegments.push({
                start: match.index,
                length: match[0].length,
                error: `Value "${match[0]}" can\'t be safely passed as a path parameter`
            });
        }
        invalidSegments.sort((a, b)=>a.start - b.start);
        if (invalidSegments.length > 0) {
            let lastEnd = 0;
            const underline = invalidSegments.reduce((acc, segment)=>{
                const spaces = ' '.repeat(segment.start - lastEnd);
                const arrows = '^'.repeat(segment.length);
                lastEnd = segment.start + segment.length;
                return acc + spaces + arrows;
            }, '');
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"](`Path parameters result in path with invalid segments:\n${invalidSegments.map((e)=>e.error).join('\n')}\n${path1}\n${underline}`);
        }
        return path1;
    };
const path = /* @__PURE__ */ createPathTagFunction(encodeURIPath); //# sourceMappingURL=path.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/log.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "formatRequestDetails",
    ()=>formatRequestDetails,
    "loggerFor",
    ()=>loggerFor,
    "parseLogLevel",
    ()=>parseLogLevel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/values.mjs [app-rsc] (ecmascript)");
;
const levelNumbers = {
    off: 0,
    error: 200,
    warn: 300,
    info: 400,
    debug: 500
};
const parseLogLevel = (maybeLevel, sourceName, client)=>{
    if (!maybeLevel) {
        return undefined;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$values$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasOwn"])(levelNumbers, maybeLevel)) {
        return maybeLevel;
    }
    loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
    return undefined;
};
function noop() {}
function makeLogFn(fnLevel, logger, logLevel) {
    if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
        return noop;
    } else {
        // Don't wrap logger functions, we want the stacktrace intact!
        return logger[fnLevel].bind(logger);
    }
}
const noopLogger = {
    error: noop,
    warn: noop,
    info: noop,
    debug: noop
};
let cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
    const logger = client.logger;
    const logLevel = client.logLevel ?? 'off';
    if (!logger) {
        return noopLogger;
    }
    const cachedLogger = cachedLoggers.get(logger);
    if (cachedLogger && cachedLogger[0] === logLevel) {
        return cachedLogger[1];
    }
    const levelLogger = {
        error: makeLogFn('error', logger, logLevel),
        warn: makeLogFn('warn', logger, logLevel),
        info: makeLogFn('info', logger, logLevel),
        debug: makeLogFn('debug', logger, logLevel)
    };
    cachedLoggers.set(logger, [
        logLevel,
        levelLogger
    ]);
    return levelLogger;
}
const formatRequestDetails = (details)=>{
    if (details.options) {
        details.options = {
            ...details.options
        };
        delete details.options['headers']; // redundant + leaks internals
    }
    if (details.headers) {
        details.headers = Object.fromEntries((details.headers instanceof Headers ? [
            ...details.headers
        ] : Object.entries(details.headers)).map(([name, value])=>[
                name,
                name.toLowerCase() === 'authorization' || name.toLowerCase() === 'cookie' || name.toLowerCase() === 'set-cookie' ? '***' : value
            ]));
    }
    if ('retryOfRequestLogID' in details) {
        if (details.retryOfRequestLogID) {
            details.retryOf = details.retryOfRequestLogID;
        }
        delete details.retryOfRequestLogID;
    }
    return details;
}; //# sourceMappingURL=log.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/parse.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "defaultParseResponse",
    ()=>defaultParseResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/log.mjs [app-rsc] (ecmascript)");
;
async function defaultParseResponse(client, props) {
    const { response, requestLogID, retryOfRequestLogID, startTime } = props;
    const body = await (async ()=>{
        // fetch refuses to read the body when the status code is 204.
        if (response.status === 204) {
            return null;
        }
        if (props.options.__binaryResponse) {
            return response;
        }
        const contentType = response.headers.get('content-type');
        const mediaType = contentType?.split(';')[0]?.trim();
        const isJSON = mediaType?.includes('application/json') || mediaType?.endsWith('+json');
        if (isJSON) {
            const json = await response.json();
            return json;
        }
        const text = await response.text();
        return text;
    })();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loggerFor"])(client).debug(`[${requestLogID}] response parsed`, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$utils$2f$log$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["formatRequestDetails"])({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        body,
        durationMs: Date.now() - startTime
    }));
    return body;
} //# sourceMappingURL=parse.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/utils/env.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
/**
 * Read an environment variable.
 *
 * Trims beginning and trailing whitespace.
 *
 * Will return undefined if the environment variable doesn't exist or cannot be accessed.
 */ __turbopack_context__.s([
    "readEnv",
    ()=>readEnv
]);
const readEnv = (env)=>{
    if (typeof globalThis.process !== 'undefined') {
        return globalThis.process.env?.[env]?.trim() ?? undefined;
    }
    if (typeof globalThis.Deno !== 'undefined') {
        return globalThis.Deno.env?.get?.(env)?.trim();
    }
    return undefined;
}; //# sourceMappingURL=env.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/error.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "APIConnectionError",
    ()=>APIConnectionError,
    "APIConnectionTimeoutError",
    ()=>APIConnectionTimeoutError,
    "APIError",
    ()=>APIError,
    "APIUserAbortError",
    ()=>APIUserAbortError,
    "AuthenticationError",
    ()=>AuthenticationError,
    "BadRequestError",
    ()=>BadRequestError,
    "ConflictError",
    ()=>ConflictError,
    "InternalServerError",
    ()=>InternalServerError,
    "NotFoundError",
    ()=>NotFoundError,
    "PermissionDeniedError",
    ()=>PermissionDeniedError,
    "RateLimitError",
    ()=>RateLimitError,
    "TelnyxError",
    ()=>TelnyxError,
    "UnprocessableEntityError",
    ()=>UnprocessableEntityError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/errors.mjs [app-rsc] (ecmascript)");
;
class TelnyxError extends Error {
}
class APIError extends TelnyxError {
    constructor(status, error, message, headers){
        super(`${APIError.makeMessage(status, error, message)}`);
        this.status = status;
        this.headers = headers;
        this.error = error;
    }
    static makeMessage(status, error, message) {
        const msg = error?.message ? typeof error.message === 'string' ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
        if (status && msg) {
            return `${status} ${msg}`;
        }
        if (status) {
            return `${status} status code (no body)`;
        }
        if (msg) {
            return msg;
        }
        return '(no status code or body)';
    }
    static generate(status, errorResponse, message, headers) {
        if (!status || !headers) {
            return new APIConnectionError({
                message,
                cause: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$errors$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["castToError"])(errorResponse)
            });
        }
        const error = errorResponse;
        if (status === 400) {
            return new BadRequestError(status, error, message, headers);
        }
        if (status === 401) {
            return new AuthenticationError(status, error, message, headers);
        }
        if (status === 403) {
            return new PermissionDeniedError(status, error, message, headers);
        }
        if (status === 404) {
            return new NotFoundError(status, error, message, headers);
        }
        if (status === 409) {
            return new ConflictError(status, error, message, headers);
        }
        if (status === 422) {
            return new UnprocessableEntityError(status, error, message, headers);
        }
        if (status === 429) {
            return new RateLimitError(status, error, message, headers);
        }
        if (status >= 500) {
            return new InternalServerError(status, error, message, headers);
        }
        return new APIError(status, error, message, headers);
    }
}
class APIUserAbortError extends APIError {
    constructor({ message } = {}){
        super(undefined, undefined, message || 'Request was aborted.', undefined);
    }
}
class APIConnectionError extends APIError {
    constructor({ message, cause }){
        super(undefined, undefined, message || 'Connection error.', undefined);
        // in some environments the 'cause' property is already declared
        // @ts-ignore
        if (cause) this.cause = cause;
    }
}
class APIConnectionTimeoutError extends APIConnectionError {
    constructor({ message } = {}){
        super({
            message: message ?? 'Request timed out.'
        });
    }
}
class BadRequestError extends APIError {
}
class AuthenticationError extends APIError {
}
class PermissionDeniedError extends APIError {
}
class NotFoundError extends APIError {
}
class ConflictError extends APIError {
}
class UnprocessableEntityError extends APIError {
}
class RateLimitError extends APIError {
}
class InternalServerError extends APIError {
} //# sourceMappingURL=error.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/uploads.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$to$2d$file$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/to-file.mjs [app-rsc] (ecmascript)"); //# sourceMappingURL=uploads.mjs.map
;
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/resource.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "APIResource",
    ()=>APIResource
]);
class APIResource {
    constructor(client){
        this._client = client;
    }
} //# sourceMappingURL=resource.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/api-promise.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([
    "APIPromise",
    ()=>APIPromise
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/tslib.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$parse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/internal/parse.mjs [app-rsc] (ecmascript)");
var _APIPromise_client;
;
;
class APIPromise extends Promise {
    constructor(client, responsePromise, parseResponse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$parse$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["defaultParseResponse"]){
        super((resolve)=>{
            // this is maybe a bit weird but this has to be a no-op to not implicitly
            // parse the response body; instead .then, .catch, .finally are overridden
            // to parse the response
            resolve(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
        _APIPromise_client.set(this, void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldSet"])(this, _APIPromise_client, client, "f");
    }
    _thenUnwrap(transform) {
        return new APIPromise((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _APIPromise_client, "f"), this.responsePromise, async (client, props)=>transform(await this.parseResponse(client, props), props));
    }
    /**
     * Gets the raw `Response` instance instead of parsing the response
     * data.
     *
     * If you want to parse the response body but still get the `Response`
     * instance, you can use {@link withResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
     * to your `tsconfig.json`.
     */ asResponse() {
        return this.responsePromise.then((p)=>p.response);
    }
    /**
     * Gets the parsed response data and the raw `Response` instance.
     *
     * If you just want to get the raw `Response` instance without parsing it,
     * you can use {@link asResponse()}.
     *
     * 👋 Getting the wrong TypeScript type for `Response`?
     * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
     * to your `tsconfig.json`.
     */ async withResponse() {
        const [data, response] = await Promise.all([
            this.parse(),
            this.asResponse()
        ]);
        return {
            data,
            response
        };
    }
    parse() {
        if (!this.parsedPromise) {
            this.parsedPromise = this.responsePromise.then((data)=>this.parseResponse((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$internal$2f$tslib$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["__classPrivateFieldGet"])(this, _APIPromise_client, "f"), data));
        }
        return this.parsedPromise;
    }
    then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
    }
    catch(onrejected) {
        return this.parse().catch(onrejected);
    }
    finally(onfinally) {
        return this.parse().finally(onfinally);
    }
}
_APIPromise_client = new WeakMap(); //# sourceMappingURL=api-promise.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/version.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "VERSION",
    ()=>VERSION
]);
const VERSION = '4.2.0'; // x-release-please-version
 //# sourceMappingURL=version.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/webhooks.mjs [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Telnyx webhook verification following the standardwebhooks pattern.
 *
 * This class provides ED25519 signature verification for Telnyx webhooks
 * using the same interface pattern as the standardwebhooks library.
 *
 * @example Using base64 public key from Mission Control
 * const webhook = new TelnyxWebhook('eu2zvPjhY6odxV34Z/EsRiERvTodkev4Fq0SlK90Izg=');
 * webhook.verify(payload, headers);
 *
 * @example Using with Telnyx client
 * const client = new Telnyx({
 *   apiKey: process.env.TELNYX_API_KEY,
 *   publicKey: process.env.TELNYX_PUBLIC_KEY, // Base64 string from Mission Control
 * });
 *
 * // Express example
 * app.post('/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
 *   const event = client.webhooks.unwrap(req.body.toString(), { headers: req.headers });
 *   // Signature automatically verified
 * });
 */ __turbopack_context__.s([
    "TelnyxWebhook",
    ()=>TelnyxWebhook,
    "TelnyxWebhookVerificationError",
    ()=>TelnyxWebhookVerificationError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tweetnacl$40$1$2e$0$2e$3$2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tweetnacl@1.0.3/node_modules/tweetnacl/nacl-fast.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/error.mjs [app-rsc] (ecmascript)");
;
;
class TelnyxWebhookVerificationError extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TelnyxError"] {
    constructor(message){
        super(message);
        this.name = 'TelnyxWebhookVerificationError';
    }
}
class TelnyxWebhook {
    /**
     * Initialize the webhook verifier with a public key.
     *
     * @param key The public key for verification (base64 string from Telnyx Mission Control or Uint8Array)
     */ constructor(key){
        // Convert key to Uint8Array if it's a string
        if (typeof key === 'string') {
            try {
                // Telnyx provides keys in base64 format
                const keyBytes = Buffer.from(key, 'base64');
                if (keyBytes.length !== 32) {
                    throw new TelnyxWebhookVerificationError(`Invalid public key: expected 32 bytes, got ${keyBytes.length} bytes`);
                }
                this.verifyKey = new Uint8Array(keyBytes);
            } catch (exc) {
                if (exc instanceof TelnyxWebhookVerificationError) {
                    throw exc;
                }
                console.error('Error parsing public key:', exc);
                throw new TelnyxWebhookVerificationError(`Invalid key format: ${key}`);
            }
        } else {
            this.verifyKey = key;
        }
    }
    /**
     * Verify a webhook payload and headers.
     *
     * @param payload The webhook payload string
     * @param headers The webhook headers
     * @throws TelnyxWebhookVerificationError If verification fails
     */ verify(payload, headers) {
        // Extract required headers (case-insensitive lookup)
        const signatureHeader = this.getHeader(headers, 'telnyx-signature-ed25519');
        const timestampHeader = this.getHeader(headers, 'telnyx-timestamp');
        // Validate required headers
        if (!signatureHeader) {
            throw new TelnyxWebhookVerificationError('Missing required header: Telnyx-Signature-Ed25519');
        }
        if (!timestampHeader) {
            throw new TelnyxWebhookVerificationError('Missing required header: Telnyx-Timestamp');
        }
        // Validate timestamp format and prevent replay attacks
        try {
            const webhookTime = parseInt(timestampHeader, 10);
            const currentTime = Math.floor(Date.now() / 1000);
            // Allow 5 minutes tolerance
            if (Math.abs(currentTime - webhookTime) > 300) {
                throw new TelnyxWebhookVerificationError(`Webhook timestamp too old or too new: ${timestampHeader}`);
            }
        } catch (exc) {
            if (exc instanceof TelnyxWebhookVerificationError) {
                throw exc;
            }
            console.error('Error validating timestamp:', exc);
            throw new TelnyxWebhookVerificationError(`Invalid timestamp format: ${timestampHeader}`);
        }
        // Decode the signature from base64
        let signature;
        try {
            const signatureBuffer = Buffer.from(signatureHeader, 'base64');
            if (signatureBuffer.length !== 64) {
                throw new Error(`Invalid signature length: expected 64 bytes, got ${signatureBuffer.length} bytes`);
            }
            signature = new Uint8Array(signatureBuffer);
        } catch (exc) {
            console.error('Error decoding signature:', exc);
            throw new TelnyxWebhookVerificationError(`Invalid signature format: ${signatureHeader}`);
        }
        // Create the signed payload: timestamp|payload
        const signedPayload = new Uint8Array([
            ...Buffer.from(timestampHeader, 'utf8'),
            ...Buffer.from('|', 'utf8'),
            ...Buffer.from(payload, 'utf8')
        ]);
        // Verify the signature
        let isValid;
        try {
            isValid = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tweetnacl$40$1$2e$0$2e$3$2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sign"].detached.verify(signedPayload, signature, this.verifyKey);
        } catch (exc) {
            console.error('Error during signature verification:', exc);
            throw new TelnyxWebhookVerificationError('Signature verification failed due to cryptographic error');
        }
        if (!isValid) {
            throw new TelnyxWebhookVerificationError('Signature verification failed: signature does not match payload');
        }
    }
    /**
     * Helper method to get header value case-insensitively
     */ getHeader(headers, name) {
        const lowerName = name.toLowerCase();
        for (const [key, value] of Object.entries(headers)){
            if (key.toLowerCase() === lowerName) {
                return value;
            }
        }
        return undefined;
    }
} //# sourceMappingURL=webhooks.mjs.map
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/index.mjs [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/client.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$uploads$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/uploads.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$api$2d$promise$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/api-promise.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$core$2f$error$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/core/error.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$webhooks$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/webhooks.mjs [app-rsc] (ecmascript)"); //# sourceMappingURL=index.mjs.map
;
;
;
;
;
;
}),
"[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/client.mjs [app-rsc] (ecmascript) <export Telnyx as default>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Telnyx"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$telnyx$40$4$2e$2$2e$0$2f$node_modules$2f$telnyx$2f$client$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/telnyx@4.2.0/node_modules/telnyx/client.mjs [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=7c275_telnyx_6f091071._.js.map