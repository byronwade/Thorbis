// biome-ignore-all lint: generated file
/* eslint-disable */
import { workflowEntrypoint } from "workflow/runtime";

const workflowCode = `var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js"(exports, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\\d+)?\\.?\\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?\$/i.exec(str);
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    __name(parse, "parse");
    function fmtShort(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return Math.round(ms2 / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms2 / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms2 / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms2 / s) + "s";
      }
      return ms2 + "ms";
    }
    __name(fmtShort, "fmtShort");
    function fmtLong(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return plural(ms2, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms2, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms2, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms2, msAbs, s, "second");
      }
      return ms2 + " ms";
    }
    __name(fmtLong, "fmtLong");
    function plural(ms2, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms2 / n) + " " + name + (isPlural ? "s" : "");
    }
    __name(plural, "plural");
  }
});

// src/workflows/company-trial.ts
var company_trial_exports = {};
__export(company_trial_exports, {
  companyTrialWorkflow: () => companyTrialWorkflow
});

// node_modules/.pnpm/@workflow+utils@4.0.1-beta.2/node_modules/@workflow/utils/dist/index.js
var import_ms = __toESM(require_ms(), 1);

// node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/symbols.js
var WORKFLOW_USE_STEP = Symbol.for("WORKFLOW_USE_STEP");
var WORKFLOW_CREATE_HOOK = Symbol.for("WORKFLOW_CREATE_HOOK");
var WORKFLOW_SLEEP = Symbol.for("WORKFLOW_SLEEP");
var WORKFLOW_CONTEXT = Symbol.for("WORKFLOW_CONTEXT");
var WORKFLOW_GET_STREAM_ID = Symbol.for("WORKFLOW_GET_STREAM_ID");
var STREAM_NAME_SYMBOL = Symbol.for("WORKFLOW_STREAM_NAME");
var STREAM_TYPE_SYMBOL = Symbol.for("WORKFLOW_STREAM_TYPE");
var BODY_INIT_SYMBOL = Symbol.for("BODY_INIT");
var WEBHOOK_RESPONSE_WRITABLE = Symbol.for("WEBHOOK_RESPONSE_WRITABLE");

// node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/sleep.js
async function sleep(param) {
  const sleepFn = globalThis[WORKFLOW_SLEEP];
  if (!sleepFn) {
    throw new Error("\`sleep()\` can only be called inside a workflow function");
  }
  return sleepFn(param);
}
__name(sleep, "sleep");

// src/workflows/company-trial.ts
async function companyTrialWorkflow({ companyId, trialLengthDays = DEFAULT_TRIAL_LENGTH_DAYS }) {
  await markTrialStarted(companyId, trialLengthDays);
  await sleep(\`\${trialLengthDays}d\`);
  await expireTrial(companyId);
}
__name(companyTrialWorkflow, "companyTrialWorkflow");
async function markTrialStarted(companyId, trialLengthDays) {
  return globalThis[Symbol.for("WORKFLOW_USE_STEP")]("step//src/workflows/company-trial.ts//markTrialStarted")(companyId, trialLengthDays);
}
__name(markTrialStarted, "markTrialStarted");
async function expireTrial(companyId) {
  return globalThis[Symbol.for("WORKFLOW_USE_STEP")]("step//src/workflows/company-trial.ts//expireTrial")(companyId);
}
__name(expireTrial, "expireTrial");
companyTrialWorkflow.workflowId = "workflow//src/workflows/company-trial.ts//companyTrialWorkflow";

// virtual-entry.js
globalThis.__private_workflows = /* @__PURE__ */ new Map();
Object.values(company_trial_exports).map((item) => item?.workflowId && globalThis.__private_workflows.set(item.workflowId, item));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzLy5wbnBtL21zQDIuMS4zL25vZGVfbW9kdWxlcy9tcy9pbmRleC5qcyIsICJzcmMvd29ya2Zsb3dzL2NvbXBhbnktdHJpYWwudHMiLCAibm9kZV9tb2R1bGVzLy5wbnBtL0B3b3JrZmxvdyt1dGlsc0A0LjAuMS1iZXRhLjIvbm9kZV9tb2R1bGVzL0B3b3JrZmxvdy91dGlscy9zcmMvaW5kZXgudHMiLCAibm9kZV9tb2R1bGVzLy5wbnBtL0B3b3JrZmxvdytjb3JlQDQuMC4xLWJldGEuMTFfQGF3cy1zZGsrY2xpZW50LXN0c0AzLjkzMi4wX0BvcGVudGVsZW1ldHJ5K2FwaUAxLjkuMC9ub2RlX21vZHVsZXMvQHdvcmtmbG93L2NvcmUvc3JjL3N5bWJvbHMudHMiLCAibm9kZV9tb2R1bGVzLy5wbnBtL0B3b3JrZmxvdytjb3JlQDQuMC4xLWJldGEuMTFfQGF3cy1zZGsrY2xpZW50LXN0c0AzLjkzMi4wX0BvcGVudGVsZW1ldHJ5K2FwaUAxLjkuMC9ub2RlX21vZHVsZXMvQHdvcmtmbG93L2NvcmUvc3JjL3NsZWVwLnRzIiwgInZpcnR1YWwtZW50cnkuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogSGVscGVycy5cbiAqLyB2YXIgcyA9IDEwMDA7XG52YXIgbSA9IHMgKiA2MDtcbnZhciBoID0gbSAqIDYwO1xudmFyIGQgPSBoICogMjQ7XG52YXIgdyA9IGQgKiA3O1xudmFyIHkgPSBkICogMzY1LjI1O1xuLyoqXG4gKiBQYXJzZSBvciBmb3JtYXQgdGhlIGdpdmVuIGB2YWxgLlxuICpcbiAqIE9wdGlvbnM6XG4gKlxuICogIC0gYGxvbmdgIHZlcmJvc2UgZm9ybWF0dGluZyBbZmFsc2VdXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEB0aHJvd3Mge0Vycm9yfSB0aHJvdyBhbiBlcnJvciBpZiB2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIG51bWJlclxuICogQHJldHVybiB7U3RyaW5nfE51bWJlcn1cbiAqIEBhcGkgcHVibGljXG4gKi8gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih2YWwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiB2YWw7XG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnICYmIHZhbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBwYXJzZSh2YWwpO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsKSkge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5sb25nID8gZm10TG9uZyh2YWwpIDogZm10U2hvcnQodmFsKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCd2YWwgaXMgbm90IGEgbm9uLWVtcHR5IHN0cmluZyBvciBhIHZhbGlkIG51bWJlci4gdmFsPScgKyBKU09OLnN0cmluZ2lmeSh2YWwpKTtcbn07XG4vKipcbiAqIFBhcnNlIHRoZSBnaXZlbiBgc3RyYCBhbmQgcmV0dXJuIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqLyBmdW5jdGlvbiBwYXJzZShzdHIpIHtcbiAgICBzdHIgPSBTdHJpbmcoc3RyKTtcbiAgICBpZiAoc3RyLmxlbmd0aCA+IDEwMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBtYXRjaCA9IC9eKC0/KD86XFxkKyk/XFwuP1xcZCspICoobWlsbGlzZWNvbmRzP3xtc2Vjcz98bXN8c2Vjb25kcz98c2Vjcz98c3xtaW51dGVzP3xtaW5zP3xtfGhvdXJzP3xocnM/fGh8ZGF5cz98ZHx3ZWVrcz98d3x5ZWFycz98eXJzP3x5KT8kL2kuZXhlYyhzdHIpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgbiA9IHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICAgIHZhciB0eXBlID0gKG1hdGNoWzJdIHx8ICdtcycpLnRvTG93ZXJDYXNlKCk7XG4gICAgc3dpdGNoKHR5cGUpe1xuICAgICAgICBjYXNlICd5ZWFycyc6XG4gICAgICAgIGNhc2UgJ3llYXInOlxuICAgICAgICBjYXNlICd5cnMnOlxuICAgICAgICBjYXNlICd5cic6XG4gICAgICAgIGNhc2UgJ3knOlxuICAgICAgICAgICAgcmV0dXJuIG4gKiB5O1xuICAgICAgICBjYXNlICd3ZWVrcyc6XG4gICAgICAgIGNhc2UgJ3dlZWsnOlxuICAgICAgICBjYXNlICd3JzpcbiAgICAgICAgICAgIHJldHVybiBuICogdztcbiAgICAgICAgY2FzZSAnZGF5cyc6XG4gICAgICAgIGNhc2UgJ2RheSc6XG4gICAgICAgIGNhc2UgJ2QnOlxuICAgICAgICAgICAgcmV0dXJuIG4gKiBkO1xuICAgICAgICBjYXNlICdob3Vycyc6XG4gICAgICAgIGNhc2UgJ2hvdXInOlxuICAgICAgICBjYXNlICdocnMnOlxuICAgICAgICBjYXNlICdocic6XG4gICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICAgICAgcmV0dXJuIG4gKiBoO1xuICAgICAgICBjYXNlICdtaW51dGVzJzpcbiAgICAgICAgY2FzZSAnbWludXRlJzpcbiAgICAgICAgY2FzZSAnbWlucyc6XG4gICAgICAgIGNhc2UgJ21pbic6XG4gICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgcmV0dXJuIG4gKiBtO1xuICAgICAgICBjYXNlICdzZWNvbmRzJzpcbiAgICAgICAgY2FzZSAnc2Vjb25kJzpcbiAgICAgICAgY2FzZSAnc2Vjcyc6XG4gICAgICAgIGNhc2UgJ3NlYyc6XG4gICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgcmV0dXJuIG4gKiBzO1xuICAgICAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgICAgICBjYXNlICdtaWxsaXNlY29uZCc6XG4gICAgICAgIGNhc2UgJ21zZWNzJzpcbiAgICAgICAgY2FzZSAnbXNlYyc6XG4gICAgICAgIGNhc2UgJ21zJzpcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG4vKipcbiAqIFNob3J0IGZvcm1hdCBmb3IgYG1zYC5cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gbXNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovIGZ1bmN0aW9uIGZtdFNob3J0KG1zKSB7XG4gICAgdmFyIG1zQWJzID0gTWF0aC5hYnMobXMpO1xuICAgIGlmIChtc0FicyA+PSBkKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gZCkgKyAnZCc7XG4gICAgfVxuICAgIGlmIChtc0FicyA+PSBoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gaCkgKyAnaCc7XG4gICAgfVxuICAgIGlmIChtc0FicyA+PSBtKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbSkgKyAnbSc7XG4gICAgfVxuICAgIGlmIChtc0FicyA+PSBzKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gcykgKyAncyc7XG4gICAgfVxuICAgIHJldHVybiBtcyArICdtcyc7XG59XG4vKipcbiAqIExvbmcgZm9ybWF0IGZvciBgbXNgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBtc1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi8gZnVuY3Rpb24gZm10TG9uZyhtcykge1xuICAgIHZhciBtc0FicyA9IE1hdGguYWJzKG1zKTtcbiAgICBpZiAobXNBYnMgPj0gZCkge1xuICAgICAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgZCwgJ2RheScpO1xuICAgIH1cbiAgICBpZiAobXNBYnMgPj0gaCkge1xuICAgICAgICByZXR1cm4gcGx1cmFsKG1zLCBtc0FicywgaCwgJ2hvdXInKTtcbiAgICB9XG4gICAgaWYgKG1zQWJzID49IG0pIHtcbiAgICAgICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIG0sICdtaW51dGUnKTtcbiAgICB9XG4gICAgaWYgKG1zQWJzID49IHMpIHtcbiAgICAgICAgcmV0dXJuIHBsdXJhbChtcywgbXNBYnMsIHMsICdzZWNvbmQnKTtcbiAgICB9XG4gICAgcmV0dXJuIG1zICsgJyBtcyc7XG59XG4vKipcbiAqIFBsdXJhbGl6YXRpb24gaGVscGVyLlxuICovIGZ1bmN0aW9uIHBsdXJhbChtcywgbXNBYnMsIG4sIG5hbWUpIHtcbiAgICB2YXIgaXNQbHVyYWwgPSBtc0FicyA+PSBuICogMS41O1xuICAgIHJldHVybiBNYXRoLnJvdW5kKG1zIC8gbikgKyAnICcgKyBuYW1lICsgKGlzUGx1cmFsID8gJ3MnIDogJycpO1xufVxuIiwgImltcG9ydCB7IHNsZWVwIH0gZnJvbSBcIndvcmtmbG93XCI7XG4vKipfX2ludGVybmFsX3dvcmtmbG93c3tcIndvcmtmbG93c1wiOntcInNyYy93b3JrZmxvd3MvY29tcGFueS10cmlhbC50c1wiOntcImNvbXBhbnlUcmlhbFdvcmtmbG93XCI6e1wid29ya2Zsb3dJZFwiOlwid29ya2Zsb3cvL3NyYy93b3JrZmxvd3MvY29tcGFueS10cmlhbC50cy8vY29tcGFueVRyaWFsV29ya2Zsb3dcIn19fSxcInN0ZXBzXCI6e1wic3JjL3dvcmtmbG93cy9jb21wYW55LXRyaWFsLnRzXCI6e1wiZXhwaXJlVHJpYWxcIjp7XCJzdGVwSWRcIjpcInN0ZXAvL3NyYy93b3JrZmxvd3MvY29tcGFueS10cmlhbC50cy8vZXhwaXJlVHJpYWxcIn0sXCJtYXJrVHJpYWxTdGFydGVkXCI6e1wic3RlcElkXCI6XCJzdGVwLy9zcmMvd29ya2Zsb3dzL2NvbXBhbnktdHJpYWwudHMvL21hcmtUcmlhbFN0YXJ0ZWRcIn19fX0qLztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21wYW55VHJpYWxXb3JrZmxvdyh7IGNvbXBhbnlJZCwgdHJpYWxMZW5ndGhEYXlzID0gREVGQVVMVF9UUklBTF9MRU5HVEhfREFZUyB9KSB7XG4gICAgYXdhaXQgbWFya1RyaWFsU3RhcnRlZChjb21wYW55SWQsIHRyaWFsTGVuZ3RoRGF5cyk7XG4gICAgYXdhaXQgc2xlZXAoYCR7dHJpYWxMZW5ndGhEYXlzfWRgKTtcbiAgICBhd2FpdCBleHBpcmVUcmlhbChjb21wYW55SWQpO1xufVxuYXN5bmMgZnVuY3Rpb24gbWFya1RyaWFsU3RhcnRlZChjb21wYW55SWQsIHRyaWFsTGVuZ3RoRGF5cykge1xuICAgIHJldHVybiBnbG9iYWxUaGlzW1N5bWJvbC5mb3IoXCJXT1JLRkxPV19VU0VfU1RFUFwiKV0oXCJzdGVwLy9zcmMvd29ya2Zsb3dzL2NvbXBhbnktdHJpYWwudHMvL21hcmtUcmlhbFN0YXJ0ZWRcIikoY29tcGFueUlkLCB0cmlhbExlbmd0aERheXMpO1xufVxuYXN5bmMgZnVuY3Rpb24gZXhwaXJlVHJpYWwoY29tcGFueUlkKSB7XG4gICAgcmV0dXJuIGdsb2JhbFRoaXNbU3ltYm9sLmZvcihcIldPUktGTE9XX1VTRV9TVEVQXCIpXShcInN0ZXAvL3NyYy93b3JrZmxvd3MvY29tcGFueS10cmlhbC50cy8vZXhwaXJlVHJpYWxcIikoY29tcGFueUlkKTtcbn1cbmNvbXBhbnlUcmlhbFdvcmtmbG93LndvcmtmbG93SWQgPSBcIndvcmtmbG93Ly9zcmMvd29ya2Zsb3dzL2NvbXBhbnktdHJpYWwudHMvL2NvbXBhbnlUcmlhbFdvcmtmbG93XCI7XG4iLCBudWxsLCBudWxsLCBudWxsLCAiZ2xvYmFsVGhpcy5fX3ByaXZhdGVfd29ya2Zsb3dzID0gbmV3IE1hcCgpO1xuaW1wb3J0ICogYXMgd29ya2Zsb3dGaWxlMCBmcm9tICcuL3NyYy93b3JrZmxvd3MvY29tcGFueS10cmlhbC50cyc7XG4gICAgICAgICAgICBPYmplY3QudmFsdWVzKHdvcmtmbG93RmlsZTApLm1hcChpdGVtID0+IGl0ZW0/LndvcmtmbG93SWQgJiYgZ2xvYmFsVGhpcy5fX3ByaXZhdGVfd29ya2Zs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
`;

export const POST = workflowEntrypoint(workflowCode);
