// biome-ignore-all lint: generated file
/* eslint-disable */

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
  "node_modules/.pnpm/ms@2.1.3/node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
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
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
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

// node_modules/.pnpm/workflow@4.0.1-beta.13_@aws-sdk+client-sts@3.932.0_@babel+core@7.28.5_@opentelemetry+api@1.9._ngfmuy4ezw7rmo57oj5ymg5lpm/node_modules/workflow/dist/internal/builtins.js
import { registerStepFunction } from "workflow/internal/private";
async function __builtin_response_array_buffer(res) {
  return res.arrayBuffer();
}
__name(__builtin_response_array_buffer, "__builtin_response_array_buffer");
async function __builtin_response_json(res) {
  return res.json();
}
__name(__builtin_response_json, "__builtin_response_json");
async function __builtin_response_text(res) {
  return res.text();
}
__name(__builtin_response_text, "__builtin_response_text");
registerStepFunction("__builtin_response_array_buffer", __builtin_response_array_buffer);
registerStepFunction("__builtin_response_json", __builtin_response_json);
registerStepFunction("__builtin_response_text", __builtin_response_text);

// src/workflows/company-trial.ts
import { registerStepFunction as registerStepFunction3 } from "workflow/internal/private";

// node_modules/.pnpm/@workflow+utils@4.0.1-beta.2/node_modules/@workflow/utils/dist/index.js
var import_ms = __toESM(require_ms(), 1);

// node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/index.js
import { createHook, createWebhook } from "../../../../../../node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/create-hook.js";
import { defineHook } from "../../../../../../node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/define-hook.js";
import { getStepMetadata } from "../../../../../../node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/step/get-step-metadata.js";
import { getWorkflowMetadata } from "../../../../../../node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/step/get-workflow-metadata.js";
import { sleep } from "../../../../../../node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/sleep.js";
import { getWritable } from "../../../../../../node_modules/.pnpm/@workflow+core@4.0.1-beta.11_@aws-sdk+client-sts@3.932.0_@opentelemetry+api@1.9.0/node_modules/@workflow/core/dist/step/writable-stream.js";

// node_modules/.pnpm/workflow@4.0.1-beta.13_@aws-sdk+client-sts@3.932.0_@babel+core@7.28.5_@opentelemetry+api@1.9._ngfmuy4ezw7rmo57oj5ymg5lpm/node_modules/workflow/dist/stdlib.js
import { registerStepFunction as registerStepFunction2 } from "workflow/internal/private";
async function fetch(...args) {
  return globalThis.fetch(...args);
}
__name(fetch, "fetch");
registerStepFunction2("step//node_modules/.pnpm/workflow@4.0.1-beta.13_@aws-sdk+client-sts@3.932.0_@babel+core@7.28.5_@opentelemetry+api@1.9._ngfmuy4ezw7rmo57oj5ymg5lpm/node_modules/workflow/dist/stdlib.js//fetch", fetch);

// src/workflows/company-trial.ts
import { DEFAULT_TRIAL_LENGTH_DAYS, ensureCompanyTrialStatus, expireCompanyTrialIfEligible } from "../../../../../lib/billing/trial-management.ts";
async function markTrialStarted(companyId, trialLengthDays) {
  await ensureCompanyTrialStatus({
    companyId,
    trialLengthDays
  });
}
__name(markTrialStarted, "markTrialStarted");
async function expireTrial(companyId) {
  await expireCompanyTrialIfEligible({
    companyId
  });
}
__name(expireTrial, "expireTrial");
registerStepFunction3("step//src/workflows/company-trial.ts//markTrialStarted", markTrialStarted);
registerStepFunction3("step//src/workflows/company-trial.ts//expireTrial", expireTrial);

// virtual-entry.js
import { stepEntrypoint } from "workflow/runtime";
export {
  stepEntrypoint as POST
};
