module.exports = [
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/DataUtils.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"compareValues",
			() => compareValues,
			"findEntryInArray",
			() => findEntryInArray,
			"getAnyElementOfObject",
			() => getAnyElementOfObject,
			"getLinearRegression",
			() => getLinearRegression,
			"getPercentValue",
			() => getPercentValue,
			"hasDuplicate",
			() => hasDuplicate,
			"interpolateNumber",
			() => interpolateNumber,
			"isNullish",
			() => isNullish,
			"isNumOrStr",
			() => isNumOrStr,
			"isNumber",
			() => isNumber,
			"isPercent",
			() => isPercent,
			"mathSign",
			() => mathSign,
			"uniqueId",
			() => uniqueId,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isString.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNaN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isNaN.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/get.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isNumber.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isNil.js [app-ssr] (ecmascript)",
			);
		var mathSign = function mathSign(value) {
			if (value === 0) {
				return 0;
			}
			if (value > 0) {
				return 1;
			}
			return -1;
		};
		var isPercent = function isPercent(value) {
			return (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(value) && value.indexOf("%") === value.length - 1
			);
		};
		var isNumber = function isNumber(value) {
			return (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNumber$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(value) &&
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNaN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(value)
			);
		};
		var isNullish = function isNullish(value) {
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			])(value);
		};
		var isNumOrStr = function isNumOrStr(value) {
			return (
				isNumber(value) ||
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(value)
			);
		};
		var idCounter = 0;
		var uniqueId = function uniqueId(prefix) {
			var id = ++idCounter;
			return "".concat(prefix || "").concat(id);
		};
		var getPercentValue = function getPercentValue(percent, totalValue) {
			var defaultValue =
				arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
			var validate =
				arguments.length > 3 && arguments[3] !== undefined
					? arguments[3]
					: false;
			if (
				!isNumber(percent) &&
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(percent)
			) {
				return defaultValue;
			}
			var value;
			if (isPercent(percent)) {
				var index = percent.indexOf("%");
				value = (totalValue * parseFloat(percent.slice(0, index))) / 100;
			} else {
				value = +percent;
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNaN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(value)
			) {
				value = defaultValue;
			}
			if (validate && value > totalValue) {
				value = totalValue;
			}
			return value;
		};
		var getAnyElementOfObject = function getAnyElementOfObject(obj) {
			if (!obj) {
				return null;
			}
			var keys = Object.keys(obj);
			if (keys && keys.length) {
				return obj[keys[0]];
			}
			return null;
		};
		var hasDuplicate = function hasDuplicate(ary) {
			if (!Array.isArray(ary)) {
				return false;
			}
			var len = ary.length;
			var cache = {};
			for (var i = 0; i < len; i++) {
				if (!cache[ary[i]]) {
					cache[ary[i]] = true;
				} else {
					return true;
				}
			}
			return false;
		};
		var interpolateNumber = function interpolateNumber(numberA, numberB) {
			if (isNumber(numberA) && isNumber(numberB)) {
				return (t) => numberA + t * (numberB - numberA);
			}
			return () => numberB;
		};
		function findEntryInArray(ary, specifiedKey, specifiedValue) {
			if (!ary || !ary.length) {
				return null;
			}
			return ary.find(
				(entry) =>
					entry &&
					(typeof specifiedKey === "function"
						? specifiedKey(entry)
						: (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							])(entry, specifiedKey)) === specifiedValue,
			);
		}
		var getLinearRegression = function getLinearRegression(data) {
			if (!data || !data.length) {
				return null;
			}
			var len = data.length;
			var xsum = 0;
			var ysum = 0;
			var xysum = 0;
			var xxsum = 0;
			var xmin = Infinity;
			var xmax = -Infinity;
			var xcurrent = 0;
			var ycurrent = 0;
			for (var i = 0; i < len; i++) {
				xcurrent = data[i].cx || 0;
				ycurrent = data[i].cy || 0;
				xsum += xcurrent;
				ysum += ycurrent;
				xysum += xcurrent * ycurrent;
				xxsum += xcurrent * xcurrent;
				xmin = Math.min(xmin, xcurrent);
				xmax = Math.max(xmax, xcurrent);
			}
			var a =
				len * xxsum !== xsum * xsum
					? (len * xysum - xsum * ysum) / (len * xxsum - xsum * xsum)
					: 0;
			return {
				xmin: xmin,
				xmax: xmax,
				a: a,
				b: (ysum - a * xsum) / len,
			};
		};
		var compareValues = function compareValues(a, b) {
			if (isNumber(a) && isNumber(b)) {
				return a - b;
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(a) &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(b)
			) {
				return a.localeCompare(b);
			}
			if (a instanceof Date && b instanceof Date) {
				return a.getTime() - b.getTime();
			}
			return String(a).localeCompare(String(b));
		};
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/LogUtils.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		/* eslint no-console: 0 */ __turbopack_context__.s(["warn", () => warn]);
		var isDev =
			("TURBOPACK compile-time value", "development") !== "production";
		var warn = function warn(condition, format) {
			for (
				var _len = arguments.length,
					args = new Array(_len > 2 ? _len - 2 : 0),
					_key = 2;
				_key < _len;
				_key++
			) {
				args[_key - 2] = arguments[_key];
			}
			if (isDev && typeof console !== "undefined" && console.warn) {
				if (format === undefined) {
					console.warn("LogUtils requires an error message argument");
				}
				if (!condition) {
					if (format === undefined) {
						console.warn(
							"Minified exception occurred; use the non-minified dev environment " +
								"for the full error message and additional helpful warnings.",
						);
					} else {
						var argIndex = 0;
						console.warn(format.replace(/%s/g, () => args[argIndex++]));
					}
				}
			}
		};
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/ShallowEqual.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["shallowEqual", () => shallowEqual]);
		function shallowEqual(a, b) {
			/* eslint-disable no-restricted-syntax */ for (var key in a) {
				if (
					Object.hasOwn(a, key) &&
					(!Object.hasOwn(b, key) || a[key] !== b[key])
				) {
					return false;
				}
			}
			for (var _key in b) {
				if (Object.hasOwn(b, _key) && !Object.hasOwn(a, _key)) {
					return false;
				}
			}
			return true;
		}
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/types.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"EventKeys",
			() => EventKeys,
			"FilteredElementKeyMap",
			() => FilteredElementKeyMap,
			"SVGElementPropKeys",
			() => SVGElementPropKeys,
			"adaptEventHandlers",
			() => adaptEventHandlers,
			"adaptEventsOfChild",
			() => adaptEventsOfChild,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isObject.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		/**
		 * Determines how values are stacked:
		 *
		 * - `none` is the default, it adds values on top of each other. No smarts. Negative values will overlap.
		 * - `expand` make it so that the values always add up to 1 - so the chart will look like a rectangle.
		 * - `wiggle` and `silhouette` tries to keep the chart centered.
		 * - `sign` stacks positive values above zero and negative values below zero. Similar to `none` but handles negatives.
		 * - `positive` ignores all negative values, and then behaves like \`none\`.
		 *
		 * Also see https://d3js.org/d3-shape/stack#stack-offsets
		 * (note that the `diverging` offset in d3 is named `sign` in recharts)
		 */ //
		// Event Handler Types -- Copied from @types/react/index.d.ts and adapted for Props.
		//
		var SVGContainerPropKeys = ["viewBox", "children"];
		var SVGElementPropKeys = [
			"aria-activedescendant",
			"aria-atomic",
			"aria-autocomplete",
			"aria-busy",
			"aria-checked",
			"aria-colcount",
			"aria-colindex",
			"aria-colspan",
			"aria-controls",
			"aria-current",
			"aria-describedby",
			"aria-details",
			"aria-disabled",
			"aria-errormessage",
			"aria-expanded",
			"aria-flowto",
			"aria-haspopup",
			"aria-hidden",
			"aria-invalid",
			"aria-keyshortcuts",
			"aria-label",
			"aria-labelledby",
			"aria-level",
			"aria-live",
			"aria-modal",
			"aria-multiline",
			"aria-multiselectable",
			"aria-orientation",
			"aria-owns",
			"aria-placeholder",
			"aria-posinset",
			"aria-pressed",
			"aria-readonly",
			"aria-relevant",
			"aria-required",
			"aria-roledescription",
			"aria-rowcount",
			"aria-rowindex",
			"aria-rowspan",
			"aria-selected",
			"aria-setsize",
			"aria-sort",
			"aria-valuemax",
			"aria-valuemin",
			"aria-valuenow",
			"aria-valuetext",
			"className",
			"color",
			"height",
			"id",
			"lang",
			"max",
			"media",
			"method",
			"min",
			"name",
			"style",
			/*
			 * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
			 * that can use it and it conflicts with the recharts prop 'type'
			 * https://github.com/recharts/recharts/pull/3327
			 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
			 */ // 'type',
			"target",
			"width",
			"role",
			"tabIndex",
			"accentHeight",
			"accumulate",
			"additive",
			"alignmentBaseline",
			"allowReorder",
			"alphabetic",
			"amplitude",
			"arabicForm",
			"ascent",
			"attributeName",
			"attributeType",
			"autoReverse",
			"azimuth",
			"baseFrequency",
			"baselineShift",
			"baseProfile",
			"bbox",
			"begin",
			"bias",
			"by",
			"calcMode",
			"capHeight",
			"clip",
			"clipPath",
			"clipPathUnits",
			"clipRule",
			"colorInterpolation",
			"colorInterpolationFilters",
			"colorProfile",
			"colorRendering",
			"contentScriptType",
			"contentStyleType",
			"cursor",
			"cx",
			"cy",
			"d",
			"decelerate",
			"descent",
			"diffuseConstant",
			"direction",
			"display",
			"divisor",
			"dominantBaseline",
			"dur",
			"dx",
			"dy",
			"edgeMode",
			"elevation",
			"enableBackground",
			"end",
			"exponent",
			"externalResourcesRequired",
			"fill",
			"fillOpacity",
			"fillRule",
			"filter",
			"filterRes",
			"filterUnits",
			"floodColor",
			"floodOpacity",
			"focusable",
			"fontFamily",
			"fontSize",
			"fontSizeAdjust",
			"fontStretch",
			"fontStyle",
			"fontVariant",
			"fontWeight",
			"format",
			"from",
			"fx",
			"fy",
			"g1",
			"g2",
			"glyphName",
			"glyphOrientationHorizontal",
			"glyphOrientationVertical",
			"glyphRef",
			"gradientTransform",
			"gradientUnits",
			"hanging",
			"horizAdvX",
			"horizOriginX",
			"href",
			"ideographic",
			"imageRendering",
			"in2",
			"in",
			"intercept",
			"k1",
			"k2",
			"k3",
			"k4",
			"k",
			"kernelMatrix",
			"kernelUnitLength",
			"kerning",
			"keyPoints",
			"keySplines",
			"keyTimes",
			"lengthAdjust",
			"letterSpacing",
			"lightingColor",
			"limitingConeAngle",
			"local",
			"markerEnd",
			"markerHeight",
			"markerMid",
			"markerStart",
			"markerUnits",
			"markerWidth",
			"mask",
			"maskContentUnits",
			"maskUnits",
			"mathematical",
			"mode",
			"numOctaves",
			"offset",
			"opacity",
			"operator",
			"order",
			"orient",
			"orientation",
			"origin",
			"overflow",
			"overlinePosition",
			"overlineThickness",
			"paintOrder",
			"panose1",
			"pathLength",
			"patternContentUnits",
			"patternTransform",
			"patternUnits",
			"pointerEvents",
			"pointsAtX",
			"pointsAtY",
			"pointsAtZ",
			"preserveAlpha",
			"preserveAspectRatio",
			"primitiveUnits",
			"r",
			"radius",
			"refX",
			"refY",
			"renderingIntent",
			"repeatCount",
			"repeatDur",
			"requiredExtensions",
			"requiredFeatures",
			"restart",
			"result",
			"rotate",
			"rx",
			"ry",
			"seed",
			"shapeRendering",
			"slope",
			"spacing",
			"specularConstant",
			"specularExponent",
			"speed",
			"spreadMethod",
			"startOffset",
			"stdDeviation",
			"stemh",
			"stemv",
			"stitchTiles",
			"stopColor",
			"stopOpacity",
			"strikethroughPosition",
			"strikethroughThickness",
			"string",
			"stroke",
			"strokeDasharray",
			"strokeDashoffset",
			"strokeLinecap",
			"strokeLinejoin",
			"strokeMiterlimit",
			"strokeOpacity",
			"strokeWidth",
			"surfaceScale",
			"systemLanguage",
			"tableValues",
			"targetX",
			"targetY",
			"textAnchor",
			"textDecoration",
			"textLength",
			"textRendering",
			"to",
			"transform",
			"u1",
			"u2",
			"underlinePosition",
			"underlineThickness",
			"unicode",
			"unicodeBidi",
			"unicodeRange",
			"unitsPerEm",
			"vAlphabetic",
			"values",
			"vectorEffect",
			"version",
			"vertAdvY",
			"vertOriginX",
			"vertOriginY",
			"vHanging",
			"vIdeographic",
			"viewTarget",
			"visibility",
			"vMathematical",
			"widths",
			"wordSpacing",
			"writingMode",
			"x1",
			"x2",
			"x",
			"xChannelSelector",
			"xHeight",
			"xlinkActuate",
			"xlinkArcrole",
			"xlinkHref",
			"xlinkRole",
			"xlinkShow",
			"xlinkTitle",
			"xlinkType",
			"xmlBase",
			"xmlLang",
			"xmlns",
			"xmlnsXlink",
			"xmlSpace",
			"y1",
			"y2",
			"y",
			"yChannelSelector",
			"z",
			"zoomAndPan",
			"ref",
			"key",
			"angle",
		];
		var PolyElementKeys = ["points", "pathLength"];
		var FilteredElementKeyMap = {
			svg: SVGContainerPropKeys,
			polygon: PolyElementKeys,
			polyline: PolyElementKeys,
		};
		var EventKeys = [
			"dangerouslySetInnerHTML",
			"onCopy",
			"onCopyCapture",
			"onCut",
			"onCutCapture",
			"onPaste",
			"onPasteCapture",
			"onCompositionEnd",
			"onCompositionEndCapture",
			"onCompositionStart",
			"onCompositionStartCapture",
			"onCompositionUpdate",
			"onCompositionUpdateCapture",
			"onFocus",
			"onFocusCapture",
			"onBlur",
			"onBlurCapture",
			"onChange",
			"onChangeCapture",
			"onBeforeInput",
			"onBeforeInputCapture",
			"onInput",
			"onInputCapture",
			"onReset",
			"onResetCapture",
			"onSubmit",
			"onSubmitCapture",
			"onInvalid",
			"onInvalidCapture",
			"onLoad",
			"onLoadCapture",
			"onError",
			"onErrorCapture",
			"onKeyDown",
			"onKeyDownCapture",
			"onKeyPress",
			"onKeyPressCapture",
			"onKeyUp",
			"onKeyUpCapture",
			"onAbort",
			"onAbortCapture",
			"onCanPlay",
			"onCanPlayCapture",
			"onCanPlayThrough",
			"onCanPlayThroughCapture",
			"onDurationChange",
			"onDurationChangeCapture",
			"onEmptied",
			"onEmptiedCapture",
			"onEncrypted",
			"onEncryptedCapture",
			"onEnded",
			"onEndedCapture",
			"onLoadedData",
			"onLoadedDataCapture",
			"onLoadedMetadata",
			"onLoadedMetadataCapture",
			"onLoadStart",
			"onLoadStartCapture",
			"onPause",
			"onPauseCapture",
			"onPlay",
			"onPlayCapture",
			"onPlaying",
			"onPlayingCapture",
			"onProgress",
			"onProgressCapture",
			"onRateChange",
			"onRateChangeCapture",
			"onSeeked",
			"onSeekedCapture",
			"onSeeking",
			"onSeekingCapture",
			"onStalled",
			"onStalledCapture",
			"onSuspend",
			"onSuspendCapture",
			"onTimeUpdate",
			"onTimeUpdateCapture",
			"onVolumeChange",
			"onVolumeChangeCapture",
			"onWaiting",
			"onWaitingCapture",
			"onAuxClick",
			"onAuxClickCapture",
			"onClick",
			"onClickCapture",
			"onContextMenu",
			"onContextMenuCapture",
			"onDoubleClick",
			"onDoubleClickCapture",
			"onDrag",
			"onDragCapture",
			"onDragEnd",
			"onDragEndCapture",
			"onDragEnter",
			"onDragEnterCapture",
			"onDragExit",
			"onDragExitCapture",
			"onDragLeave",
			"onDragLeaveCapture",
			"onDragOver",
			"onDragOverCapture",
			"onDragStart",
			"onDragStartCapture",
			"onDrop",
			"onDropCapture",
			"onMouseDown",
			"onMouseDownCapture",
			"onMouseEnter",
			"onMouseLeave",
			"onMouseMove",
			"onMouseMoveCapture",
			"onMouseOut",
			"onMouseOutCapture",
			"onMouseOver",
			"onMouseOverCapture",
			"onMouseUp",
			"onMouseUpCapture",
			"onSelect",
			"onSelectCapture",
			"onTouchCancel",
			"onTouchCancelCapture",
			"onTouchEnd",
			"onTouchEndCapture",
			"onTouchMove",
			"onTouchMoveCapture",
			"onTouchStart",
			"onTouchStartCapture",
			"onPointerDown",
			"onPointerDownCapture",
			"onPointerMove",
			"onPointerMoveCapture",
			"onPointerUp",
			"onPointerUpCapture",
			"onPointerCancel",
			"onPointerCancelCapture",
			"onPointerEnter",
			"onPointerEnterCapture",
			"onPointerLeave",
			"onPointerLeaveCapture",
			"onPointerOver",
			"onPointerOverCapture",
			"onPointerOut",
			"onPointerOutCapture",
			"onGotPointerCapture",
			"onGotPointerCaptureCapture",
			"onLostPointerCapture",
			"onLostPointerCaptureCapture",
			"onScroll",
			"onScrollCapture",
			"onWheel",
			"onWheelCapture",
			"onAnimationStart",
			"onAnimationStartCapture",
			"onAnimationEnd",
			"onAnimationEndCapture",
			"onAnimationIteration",
			"onAnimationIterationCapture",
			"onTransitionEnd",
			"onTransitionEndCapture",
		];
		var adaptEventHandlers = function adaptEventHandlers(props, newHandler) {
			if (!props || typeof props === "function" || typeof props === "boolean") {
				return null;
			}
			var inputProps = props;
			if (
				/*#__PURE__*/ (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isValidElement"
				])(props)
			) {
				inputProps = props.props;
			}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(inputProps)
			) {
				return null;
			}
			var out = {};
			Object.keys(inputProps).forEach((key) => {
				if (EventKeys.includes(key)) {
					out[key] = newHandler || ((e) => inputProps[key](inputProps, e));
				}
			});
			return out;
		};
		var getEventHandlerOfChild = function getEventHandlerOfChild(
			originalHandler,
			data,
			index,
		) {
			return (e) => {
				originalHandler(data, index, e);
				return null;
			};
		};
		var adaptEventsOfChild = function adaptEventsOfChild(props, data, index) {
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(props) ||
				_typeof(props) !== "object"
			) {
				return null;
			}
			var out = null;
			Object.keys(props).forEach((key) => {
				var item = props[key];
				if (EventKeys.includes(key) && typeof item === "function") {
					if (!out) out = {};
					out[key] = getEventHandlerOfChild(item, data, index);
				}
			});
			return out;
		};
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/ReactUtils.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"LEGEND_TYPES",
			() => LEGEND_TYPES,
			"SCALE_TYPES",
			() => SCALE_TYPES,
			"TOOLTIP_TYPES",
			() => TOOLTIP_TYPES,
			"filterProps",
			() => filterProps,
			"filterSvgElements",
			() => filterSvgElements,
			"findAllByType",
			() => findAllByType,
			"findChildByType",
			() => findChildByType,
			"getDisplayName",
			() => getDisplayName,
			"getReactEventByType",
			() => getReactEventByType,
			"hasClipDot",
			() => hasClipDot,
			"isChildrenEqual",
			() => isChildrenEqual,
			"isSingleChildEqual",
			() => isSingleChildEqual,
			"isValidSpreadableProp",
			() => isValidSpreadableProp,
			"parseChildIndex",
			() => parseChildIndex,
			"renderByOrder",
			() => renderByOrder,
			"toArray",
			() => toArray,
			"validateWidthHeight",
			() => validateWidthHeight,
			"withoutType",
			() => withoutType,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/get.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isNil.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isString.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isFunction.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isObject.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$is$40$18$2e$3$2e$1$2f$node_modules$2f$react$2d$is$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/react-is@18.3.1/node_modules/react-is/index.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/DataUtils.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ShallowEqual$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/ShallowEqual.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/types.js [app-ssr] (ecmascript)",
			);
		var _excluded = ["children"],
			_excluded2 = ["children"];
		function _objectWithoutProperties(source, excluded) {
			if (source == null) return {};
			var target = _objectWithoutPropertiesLoose(source, excluded);
			var key, i;
			if (Object.getOwnPropertySymbols) {
				var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
				for (i = 0; i < sourceSymbolKeys.length; i++) {
					key = sourceSymbolKeys[i];
					if (excluded.indexOf(key) >= 0) continue;
					if (!Object.prototype.propertyIsEnumerable.call(source, key))
						continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function _objectWithoutPropertiesLoose(source, excluded) {
			if (source == null) return {};
			var target = {};
			for (var key in source) {
				if (Object.hasOwn(source, key)) {
					if (excluded.indexOf(key) >= 0) continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		var REACT_BROWSER_EVENT_MAP = {
			click: "onClick",
			mousedown: "onMouseDown",
			mouseup: "onMouseUp",
			mouseover: "onMouseOver",
			mousemove: "onMouseMove",
			mouseout: "onMouseOut",
			mouseenter: "onMouseEnter",
			mouseleave: "onMouseLeave",
			touchcancel: "onTouchCancel",
			touchend: "onTouchEnd",
			touchmove: "onTouchMove",
			touchstart: "onTouchStart",
			contextmenu: "onContextMenu",
			dblclick: "onDoubleClick",
		};
		var SCALE_TYPES = [
			"auto",
			"linear",
			"pow",
			"sqrt",
			"log",
			"identity",
			"time",
			"band",
			"point",
			"ordinal",
			"quantile",
			"quantize",
			"utc",
			"sequential",
			"threshold",
		];
		var LEGEND_TYPES = [
			"plainline",
			"line",
			"square",
			"rect",
			"circle",
			"cross",
			"diamond",
			"star",
			"triangle",
			"wye",
			"none",
		];
		var TOOLTIP_TYPES = ["none"];
		var getDisplayName = function getDisplayName(Comp) {
			if (typeof Comp === "string") {
				return Comp;
			}
			if (!Comp) {
				return "";
			}
			return Comp.displayName || Comp.name || "Component";
		};
		// `toArray` gets called multiple times during the render
		// so we can memoize last invocation (since reference to `children` is the same)
		var lastChildren = null;
		var lastResult = null;
		var toArray = function toArray(children) {
			if (children === lastChildren && Array.isArray(lastResult)) {
				return lastResult;
			}
			var result = [];
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"Children"
			].forEach(children, (child) => {
				if (
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					])(child)
				)
					return;
				if (
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$react$2d$is$40$18$2e$3$2e$1$2f$node_modules$2f$react$2d$is$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"isFragment"
					])(child)
				) {
					result = result.concat(toArray(child.props.children));
				} else {
					// @ts-expect-error this could still be Iterable<ReactNode> and TS does not like that
					result.push(child);
				}
			});
			lastResult = result;
			lastChildren = children;
			return result;
		};
		function findAllByType(children, type) {
			var result = [];
			var types = [];
			if (Array.isArray(type)) {
				types = type.map((t) => getDisplayName(t));
			} else {
				types = [getDisplayName(type)];
			}
			toArray(children).forEach((child) => {
				var childType =
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					])(child, "type.displayName") ||
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					])(child, "type.name");
				if (types.indexOf(childType) !== -1) {
					result.push(child);
				}
			});
			return result;
		}
		function findChildByType(children, type) {
			var result = findAllByType(children, type);
			return result && result[0];
		}
		var withoutType = function withoutType(children, type) {
			var newChildren = [];
			var types;
			if (Array.isArray(type)) {
				types = type.map((t) => getDisplayName(t));
			} else {
				types = [getDisplayName(type)];
			}
			toArray(children).forEach((child) => {
				var displayName = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$get$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(child, "type.displayName");
				if (displayName && types.indexOf(displayName) !== -1) {
					return;
				}
				newChildren.push(child);
			});
			return newChildren;
		};
		var validateWidthHeight = function validateWidthHeight(el) {
			if (!el || !el.props) {
				return false;
			}
			var _el$props = el.props,
				width = _el$props.width,
				height = _el$props.height;
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isNumber"
				])(width) ||
				width <= 0 ||
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isNumber"
				])(height) ||
				height <= 0
			) {
				return false;
			}
			return true;
		};
		var SVG_TAGS = [
			"a",
			"altGlyph",
			"altGlyphDef",
			"altGlyphItem",
			"animate",
			"animateColor",
			"animateMotion",
			"animateTransform",
			"circle",
			"clipPath",
			"color-profile",
			"cursor",
			"defs",
			"desc",
			"ellipse",
			"feBlend",
			"feColormatrix",
			"feComponentTransfer",
			"feComposite",
			"feConvolveMatrix",
			"feDiffuseLighting",
			"feDisplacementMap",
			"feDistantLight",
			"feFlood",
			"feFuncA",
			"feFuncB",
			"feFuncG",
			"feFuncR",
			"feGaussianBlur",
			"feImage",
			"feMerge",
			"feMergeNode",
			"feMorphology",
			"feOffset",
			"fePointLight",
			"feSpecularLighting",
			"feSpotLight",
			"feTile",
			"feTurbulence",
			"filter",
			"font",
			"font-face",
			"font-face-format",
			"font-face-name",
			"font-face-url",
			"foreignObject",
			"g",
			"glyph",
			"glyphRef",
			"hkern",
			"image",
			"line",
			"lineGradient",
			"marker",
			"mask",
			"metadata",
			"missing-glyph",
			"mpath",
			"path",
			"pattern",
			"polygon",
			"polyline",
			"radialGradient",
			"rect",
			"script",
			"set",
			"stop",
			"style",
			"svg",
			"switch",
			"symbol",
			"text",
			"textPath",
			"title",
			"tref",
			"tspan",
			"use",
			"view",
			"vkern",
		];
		var isSvgElement = function isSvgElement(child) {
			return (
				child &&
				child.type &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isString$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(child.type) &&
				SVG_TAGS.indexOf(child.type) >= 0
			);
		};
		var hasClipDot = function hasClipDot(dot) {
			return dot && _typeof(dot) === "object" && "clipDot" in dot;
		};
		var isValidSpreadableProp = function isValidSpreadableProp(
			property,
			key,
			includeEvents,
			svgElementType,
		) {
			var _FilteredElementKeyMa;
			/**
			 * If the svg element type is explicitly included, check against the filtered element key map
			 * to determine if there are attributes that should only exist on that element type.
			 * @todo Add an internal cjs version of https://github.com/wooorm/svg-element-attributes for full coverage.
			 */ var matchingElementTypeKeys =
				(_FilteredElementKeyMa =
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"FilteredElementKeyMap"
					] === null ||
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"FilteredElementKeyMap"
					] === void 0
						? void 0
						: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"FilteredElementKeyMap"
							][svgElementType]) !== null && _FilteredElementKeyMa !== void 0
					? _FilteredElementKeyMa
					: [];
			return (
				key.startsWith("data-") ||
				(!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(property) &&
					((svgElementType && matchingElementTypeKeys.includes(key)) ||
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"SVGElementPropKeys"
						].includes(key))) ||
				(includeEvents &&
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"EventKeys"
					].includes(key))
			);
		};
		var filterSvgElements = function filterSvgElements(children) {
			var svgElements = [];
			toArray(children).forEach((entry) => {
				if (isSvgElement(entry)) {
					svgElements.push(entry);
				}
			});
			return svgElements;
		};
		var filterProps = function filterProps(
			props,
			includeEvents,
			svgElementType,
		) {
			if (!props || typeof props === "function" || typeof props === "boolean") {
				return null;
			}
			var inputProps = props;
			if (
				/*#__PURE__*/ (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isValidElement"
				])(props)
			) {
				inputProps = props.props;
			}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isObject$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(inputProps)
			) {
				return null;
			}
			var out = {};
			/**
			 * Props are blindly spread onto SVG elements. This loop filters out properties that we don't want to spread.
			 * Items filtered out are as follows:
			 *   - functions in properties that are SVG attributes (functions are included when includeEvents is true)
			 *   - props that are SVG attributes but don't matched the passed svgElementType
			 *   - any prop that is not in SVGElementPropKeys (or in EventKeys if includeEvents is true)
			 */ Object.keys(inputProps).forEach((key) => {
				var _inputProps;
				if (
					isValidSpreadableProp(
						(_inputProps = inputProps) === null || _inputProps === void 0
							? void 0
							: _inputProps[key],
						key,
						includeEvents,
						svgElementType,
					)
				) {
					out[key] = inputProps[key];
				}
			});
			return out;
		};
		var isChildrenEqual = function isChildrenEqual(nextChildren, prevChildren) {
			if (nextChildren === prevChildren) {
				return true;
			}
			var count =
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Children"
				].count(nextChildren);
			if (
				count !==
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Children"
				].count(prevChildren)
			) {
				return false;
			}
			if (count === 0) {
				return true;
			}
			if (count === 1) {
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				return isSingleChildEqual(
					Array.isArray(nextChildren) ? nextChildren[0] : nextChildren,
					Array.isArray(prevChildren) ? prevChildren[0] : prevChildren,
				);
			}
			for (var i = 0; i < count; i++) {
				var nextChild = nextChildren[i];
				var prevChild = prevChildren[i];
				if (Array.isArray(nextChild) || Array.isArray(prevChild)) {
					if (!isChildrenEqual(nextChild, prevChild)) {
						return false;
					}
					// eslint-disable-next-line @typescript-eslint/no-use-before-define
				} else if (!isSingleChildEqual(nextChild, prevChild)) {
					return false;
				}
			}
			return true;
		};
		var isSingleChildEqual = function isSingleChildEqual(nextChild, prevChild) {
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(nextChild) &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(prevChild)
			) {
				return true;
			}
			if (
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(nextChild) &&
				!(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(prevChild)
			) {
				var _ref = nextChild.props || {},
					nextChildren = _ref.children,
					nextProps = _objectWithoutProperties(_ref, _excluded);
				var _ref2 = prevChild.props || {},
					prevChildren = _ref2.children,
					prevProps = _objectWithoutProperties(_ref2, _excluded2);
				if (nextChildren && prevChildren) {
					return (
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ShallowEqual$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"shallowEqual"
						])(nextProps, prevProps) &&
						isChildrenEqual(nextChildren, prevChildren)
					);
				}
				if (!nextChildren && !prevChildren) {
					return (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ShallowEqual$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"shallowEqual"
					])(nextProps, prevProps);
				}
				return false;
			}
			return false;
		};
		var renderByOrder = function renderByOrder(children, renderMap) {
			var elements = [];
			var record = {};
			toArray(children).forEach((child, index) => {
				if (isSvgElement(child)) {
					elements.push(child);
				} else if (child) {
					var displayName = getDisplayName(child.type);
					var _ref3 = renderMap[displayName] || {},
						handler = _ref3.handler,
						once = _ref3.once;
					if (handler && (!once || !record[displayName])) {
						var results = handler(child, displayName, index);
						elements.push(results);
						record[displayName] = true;
					}
				}
			});
			return elements;
		};
		var getReactEventByType = function getReactEventByType(e) {
			var type = e && e.type;
			if (type && REACT_BROWSER_EVENT_MAP[type]) {
				return REACT_BROWSER_EVENT_MAP[type];
			}
			return null;
		};
		var parseChildIndex = function parseChildIndex(child, children) {
			return toArray(children).indexOf(child);
		};
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/ResponsiveContainer.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["ResponsiveContainer", () => ResponsiveContainer]);
		/**
		 * @fileOverview Wrapper component to make charts adapt to the size of parent * DOM
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$throttle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/throttle.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/DataUtils.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/LogUtils.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/ReactUtils.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function _slicedToArray(arr, i) {
			return (
				_arrayWithHoles(arr) ||
				_iterableToArrayLimit(arr, i) ||
				_unsupportedIterableToArray(arr, i) ||
				_nonIterableRest()
			);
		}
		function _nonIterableRest() {
			throw new TypeError(
				"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
			);
		}
		function _unsupportedIterableToArray(o, minLen) {
			if (!o) return;
			if (typeof o === "string") return _arrayLikeToArray(o, minLen);
			var n = Object.prototype.toString.call(o).slice(8, -1);
			if (n === "Object" && o.constructor) n = o.constructor.name;
			if (n === "Map" || n === "Set") return Array.from(o);
			if (
				n === "Arguments" ||
				/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
			)
				return _arrayLikeToArray(o, minLen);
		}
		function _arrayLikeToArray(arr, len) {
			if (len == null || len > arr.length) len = arr.length;
			for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
			return arr2;
		}
		function _iterableToArrayLimit(r, l) {
			var t =
				null == r
					? null
					: ("undefined" != typeof Symbol && r[Symbol.iterator]) ||
						r["@@iterator"];
			if (null != t) {
				var e,
					n,
					i,
					u,
					a = [],
					f = !0,
					o = !1;
				try {
					if (((i = (t = t.call(r)).next), 0 === l)) {
						if (Object(t) !== t) return;
						f = !1;
					} else
						for (
							;
							!(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l);
							f = !0
						);
				} catch (r) {
					(o = !0), (n = r);
				} finally {
					try {
						if (
							!f &&
							null != t["return"] &&
							((u = t["return"]()), Object(u) !== u)
						)
							return;
					} finally {
						if (o) throw n;
					}
				}
				return a;
			}
		}
		function _arrayWithHoles(arr) {
			if (Array.isArray(arr)) return arr;
		}
		var ResponsiveContainer = /*#__PURE__*/ (0,
		__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
			"forwardRef"
		])((_ref, ref) => {
			var aspect = _ref.aspect,
				_ref$initialDimension = _ref.initialDimension,
				initialDimension =
					_ref$initialDimension === void 0
						? {
								width: -1,
								height: -1,
							}
						: _ref$initialDimension,
				_ref$width = _ref.width,
				width = _ref$width === void 0 ? "100%" : _ref$width,
				_ref$height = _ref.height,
				height = _ref$height === void 0 ? "100%" : _ref$height,
				_ref$minWidth = _ref.minWidth,
				minWidth = _ref$minWidth === void 0 ? 0 : _ref$minWidth,
				minHeight = _ref.minHeight,
				maxHeight = _ref.maxHeight,
				children = _ref.children,
				_ref$debounce = _ref.debounce,
				debounce = _ref$debounce === void 0 ? 0 : _ref$debounce,
				id = _ref.id,
				className = _ref.className,
				onResize = _ref.onResize,
				_ref$style = _ref.style,
				style = _ref$style === void 0 ? {} : _ref$style;
			var containerRef = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRef"
			])(null);
			var onResizeRef = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useRef"
			])();
			onResizeRef.current = onResize;
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useImperativeHandle"
			])(ref, () =>
				Object.defineProperty(containerRef.current, "current", {
					get: function get() {
						// eslint-disable-next-line no-console
						console.warn(
							"The usage of ref.current.current is deprecated and will no longer be supported.",
						);
						return containerRef.current;
					},
					configurable: true,
				}),
			);
			var _useState = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"useState"
				])({
					containerWidth: initialDimension.width,
					containerHeight: initialDimension.height,
				}),
				_useState2 = _slicedToArray(_useState, 2),
				sizes = _useState2[0],
				setSizes = _useState2[1];
			var setContainerSize = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useCallback"
			])((newWidth, newHeight) => {
				setSizes((prevState) => {
					var roundedWidth = Math.round(newWidth);
					var roundedHeight = Math.round(newHeight);
					if (
						prevState.containerWidth === roundedWidth &&
						prevState.containerHeight === roundedHeight
					) {
						return prevState;
					}
					return {
						containerWidth: roundedWidth,
						containerHeight: roundedHeight,
					};
				});
			}, []);
			(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useEffect"
			])(() => {
				var callback = function callback(entries) {
					var _onResizeRef$current;
					var _entries$0$contentRec = entries[0].contentRect,
						containerWidth = _entries$0$contentRec.width,
						containerHeight = _entries$0$contentRec.height;
					setContainerSize(containerWidth, containerHeight);
					(_onResizeRef$current = onResizeRef.current) === null ||
						_onResizeRef$current === void 0 ||
						_onResizeRef$current.call(
							onResizeRef,
							containerWidth,
							containerHeight,
						);
				};
				if (debounce > 0) {
					callback = (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$throttle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					])(callback, debounce, {
						trailing: true,
						leading: false,
					});
				}
				var observer = new ResizeObserver(callback);
				var _containerRef$current =
						containerRef.current.getBoundingClientRect(),
					containerWidth = _containerRef$current.width,
					containerHeight = _containerRef$current.height;
				setContainerSize(containerWidth, containerHeight);
				observer.observe(containerRef.current);
				return () => {
					observer.disconnect();
				};
			}, [setContainerSize, debounce]);
			var chartContent = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"useMemo"
			])(() => {
				var containerWidth = sizes.containerWidth,
					containerHeight = sizes.containerHeight;
				if (containerWidth < 0 || containerHeight < 0) {
					return null;
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"warn"
				])(
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"isPercent"
					])(width) ||
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"isPercent"
						])(height),
					"The width(%s) and height(%s) are both fixed numbers,\n       maybe you don't need to use a ResponsiveContainer.",
					width,
					height,
				);
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"warn"
				])(
					!aspect || aspect > 0,
					"The aspect(%s) must be greater than zero.",
					aspect,
				);
				var calculatedWidth = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isPercent"
				])(width)
					? containerWidth
					: width;
				var calculatedHeight = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isPercent"
				])(height)
					? containerHeight
					: height;
				if (aspect && aspect > 0) {
					// Preserve the desired aspect ratio
					if (calculatedWidth) {
						// Will default to using width for aspect ratio
						calculatedHeight = calculatedWidth / aspect;
					} else if (calculatedHeight) {
						// But we should also take height into consideration
						calculatedWidth = calculatedHeight * aspect;
					}
					// if maxHeight is set, overwrite if calculatedHeight is greater than maxHeight
					if (maxHeight && calculatedHeight > maxHeight) {
						calculatedHeight = maxHeight;
					}
				}
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"warn"
				])(
					calculatedWidth > 0 || calculatedHeight > 0,
					"The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.",
					calculatedWidth,
					calculatedHeight,
					width,
					height,
					minWidth,
					minHeight,
					aspect,
				);
				var isCharts =
					!Array.isArray(children) &&
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"getDisplayName"
					])(children.type).endsWith("Chart");
				return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].Children.map(children, (child) => {
					if (
						/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"default"
						].isValidElement(child)
					) {
						return /*#__PURE__*/ (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"cloneElement"
						])(
							child,
							_objectSpread(
								{
									width: calculatedWidth,
									height: calculatedHeight,
								},
								isCharts
									? {
											style: _objectSpread(
												{
													height: "100%",
													width: "100%",
													maxHeight: calculatedHeight,
													maxWidth: calculatedWidth,
												},
												child.props.style,
											),
										}
									: {},
							),
						);
					}
					return child;
				});
			}, [
				aspect,
				children,
				height,
				maxHeight,
				minHeight,
				minWidth,
				sizes,
				width,
			]);
			return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			].createElement(
				"div",
				{
					id: id ? "".concat(id) : undefined,
					className: (0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					])("recharts-responsive-container", className),
					style: _objectSpread(
						_objectSpread({}, style),
						{},
						{
							width: width,
							height: height,
							minWidth: minWidth,
							minHeight: minHeight,
							maxHeight: maxHeight,
						},
					),
					ref: containerRef,
				},
				chartContent,
			);
		});
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/DefaultTooltipContent.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"DefaultTooltipContent",
			() => DefaultTooltipContent,
		]);
		/**
		 * @fileOverview Default Tooltip Content
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$sortBy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/sortBy.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isNil.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/DataUtils.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		function _extends() {
			_extends = ("TURBOPACK compile-time truthy", 1)
				? Object.assign.bind()
				: "TURBOPACK unreachable";
			return _extends.apply(this, arguments);
		}
		function _slicedToArray(arr, i) {
			return (
				_arrayWithHoles(arr) ||
				_iterableToArrayLimit(arr, i) ||
				_unsupportedIterableToArray(arr, i) ||
				_nonIterableRest()
			);
		}
		function _nonIterableRest() {
			throw new TypeError(
				"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
			);
		}
		function _unsupportedIterableToArray(o, minLen) {
			if (!o) return;
			if (typeof o === "string") return _arrayLikeToArray(o, minLen);
			var n = Object.prototype.toString.call(o).slice(8, -1);
			if (n === "Object" && o.constructor) n = o.constructor.name;
			if (n === "Map" || n === "Set") return Array.from(o);
			if (
				n === "Arguments" ||
				/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
			)
				return _arrayLikeToArray(o, minLen);
		}
		function _arrayLikeToArray(arr, len) {
			if (len == null || len > arr.length) len = arr.length;
			for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
			return arr2;
		}
		function _iterableToArrayLimit(r, l) {
			var t =
				null == r
					? null
					: ("undefined" != typeof Symbol && r[Symbol.iterator]) ||
						r["@@iterator"];
			if (null != t) {
				var e,
					n,
					i,
					u,
					a = [],
					f = !0,
					o = !1;
				try {
					if (((i = (t = t.call(r)).next), 0 === l)) {
						if (Object(t) !== t) return;
						f = !1;
					} else
						for (
							;
							!(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l);
							f = !0
						);
				} catch (r) {
					(o = !0), (n = r);
				} finally {
					try {
						if (
							!f &&
							null != t["return"] &&
							((u = t["return"]()), Object(u) !== u)
						)
							return;
					} finally {
						if (o) throw n;
					}
				}
				return a;
			}
		}
		function _arrayWithHoles(arr) {
			if (Array.isArray(arr)) return arr;
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function defaultFormatter(value) {
			return Array.isArray(value) &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isNumOrStr"
				])(value[0]) &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isNumOrStr"
				])(value[1])
				? value.join(" ~ ")
				: value;
		}
		var DefaultTooltipContent = function DefaultTooltipContent(props) {
			var _props$separator = props.separator,
				separator = _props$separator === void 0 ? " : " : _props$separator,
				_props$contentStyle = props.contentStyle,
				contentStyle =
					_props$contentStyle === void 0 ? {} : _props$contentStyle,
				_props$itemStyle = props.itemStyle,
				itemStyle = _props$itemStyle === void 0 ? {} : _props$itemStyle,
				_props$labelStyle = props.labelStyle,
				labelStyle = _props$labelStyle === void 0 ? {} : _props$labelStyle,
				payload = props.payload,
				formatter = props.formatter,
				itemSorter = props.itemSorter,
				wrapperClassName = props.wrapperClassName,
				labelClassName = props.labelClassName,
				label = props.label,
				labelFormatter = props.labelFormatter,
				_props$accessibilityL = props.accessibilityLayer,
				accessibilityLayer =
					_props$accessibilityL === void 0 ? false : _props$accessibilityL;
			var renderContent = function renderContent() {
				if (payload && payload.length) {
					var listStyle = {
						padding: 0,
						margin: 0,
					};
					var items = (
						itemSorter
							? (0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$sortBy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"default"
								])(payload, itemSorter)
							: payload
					).map((entry, i) => {
						if (entry.type === "none") {
							return null;
						}
						var finalItemStyle = _objectSpread(
							{
								display: "block",
								paddingTop: 4,
								paddingBottom: 4,
								color: entry.color || "#000",
							},
							itemStyle,
						);
						var finalFormatter =
							entry.formatter || formatter || defaultFormatter;
						var value = entry.value,
							name = entry.name;
						var finalValue = value;
						var finalName = name;
						if (finalFormatter && finalValue != null && finalName != null) {
							var formatted = finalFormatter(value, name, entry, i, payload);
							if (Array.isArray(formatted)) {
								var _formatted = _slicedToArray(formatted, 2);
								finalValue = _formatted[0];
								finalName = _formatted[1];
							} else {
								finalValue = formatted;
							}
						}
						return (
							/*#__PURE__*/ // eslint-disable-next-line react/no-array-index-key
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement(
								"li",
								{
									className: "recharts-tooltip-item",
									key: "tooltip-item-".concat(i),
									style: finalItemStyle,
								},
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"isNumOrStr"
								])(finalName)
									? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"default"
										].createElement(
											"span",
											{
												className: "recharts-tooltip-item-name",
											},
											finalName,
										)
									: null,
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"isNumOrStr"
								])(finalName)
									? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
											"default"
										].createElement(
											"span",
											{
												className: "recharts-tooltip-item-separator",
											},
											separator,
										)
									: null,
								/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"default"
								].createElement(
									"span",
									{
										className: "recharts-tooltip-item-value",
									},
									finalValue,
								),
								/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"default"
								].createElement(
									"span",
									{
										className: "recharts-tooltip-item-unit",
									},
									entry.unit || "",
								),
							)
						);
					});
					return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					].createElement(
						"ul",
						{
							className: "recharts-tooltip-item-list",
							style: listStyle,
						},
						items,
					);
				}
				return null;
			};
			var finalStyle = _objectSpread(
				{
					margin: 0,
					padding: 10,
					backgroundColor: "#fff",
					border: "1px solid #ccc",
					whiteSpace: "nowrap",
				},
				contentStyle,
			);
			var finalLabelStyle = _objectSpread(
				{
					margin: 0,
				},
				labelStyle,
			);
			var hasLabel = !(0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isNil$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			])(label);
			var finalLabel = hasLabel ? label : "";
			var wrapperCN = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			])("recharts-default-tooltip", wrapperClassName);
			var labelCN = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			])("recharts-tooltip-label", labelClassName);
			if (
				hasLabel &&
				labelFormatter &&
				payload !== undefined &&
				payload !== null
			) {
				finalLabel = labelFormatter(label, payload);
			}
			var accessibilityAttributes = accessibilityLayer
				? {
						role: "status",
						"aria-live": "assertive",
					}
				: {};
			return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			].createElement(
				"div",
				_extends(
					{
						className: wrapperCN,
						style: finalStyle,
					},
					accessibilityAttributes,
				),
				/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].createElement(
					"p",
					{
						className: labelCN,
						style: finalLabelStyle,
					},
					/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					].isValidElement(finalLabel)
						? finalLabel
						: "".concat(finalLabel),
				),
				renderContent(),
			);
		};
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/tooltip/translate.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"getTooltipCSSClassName",
			() => getTooltipCSSClassName,
			"getTooltipTranslate",
			() => getTooltipTranslate,
			"getTooltipTranslateXY",
			() => getTooltipTranslateXY,
			"getTransformStyle",
			() => getTransformStyle,
		]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/DataUtils.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		var CSS_CLASS_PREFIX = "recharts-tooltip-wrapper";
		var TOOLTIP_HIDDEN = {
			visibility: "hidden",
		};
		function getTooltipCSSClassName(_ref) {
			var coordinate = _ref.coordinate,
				translateX = _ref.translateX,
				translateY = _ref.translateY;
			return (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			])(
				CSS_CLASS_PREFIX,
				_defineProperty(
					_defineProperty(
						_defineProperty(
							_defineProperty(
								{},
								"".concat(CSS_CLASS_PREFIX, "-right"),
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"isNumber"
								])(translateX) &&
									coordinate &&
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"isNumber"
									])(coordinate.x) &&
									translateX >= coordinate.x,
							),
							"".concat(CSS_CLASS_PREFIX, "-left"),
							(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"isNumber"
							])(translateX) &&
								coordinate &&
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"isNumber"
								])(coordinate.x) &&
								translateX < coordinate.x,
						),
						"".concat(CSS_CLASS_PREFIX, "-bottom"),
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"isNumber"
						])(translateY) &&
							coordinate &&
							(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"isNumber"
							])(coordinate.y) &&
							translateY >= coordinate.y,
					),
					"".concat(CSS_CLASS_PREFIX, "-top"),
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"isNumber"
					])(translateY) &&
						coordinate &&
						(0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"isNumber"
						])(coordinate.y) &&
						translateY < coordinate.y,
				),
			);
		}
		function getTooltipTranslateXY(_ref2) {
			var allowEscapeViewBox = _ref2.allowEscapeViewBox,
				coordinate = _ref2.coordinate,
				key = _ref2.key,
				offsetTopLeft = _ref2.offsetTopLeft,
				position = _ref2.position,
				reverseDirection = _ref2.reverseDirection,
				tooltipDimension = _ref2.tooltipDimension,
				viewBox = _ref2.viewBox,
				viewBoxDimension = _ref2.viewBoxDimension;
			if (
				position &&
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"isNumber"
				])(position[key])
			) {
				return position[key];
			}
			var negative = coordinate[key] - tooltipDimension - offsetTopLeft;
			var positive = coordinate[key] + offsetTopLeft;
			if (allowEscapeViewBox[key]) {
				return reverseDirection[key] ? negative : positive;
			}
			if (reverseDirection[key]) {
				var _tooltipBoundary = negative;
				var _viewBoxBoundary = viewBox[key];
				if (_tooltipBoundary < _viewBoxBoundary) {
					return Math.max(positive, viewBox[key]);
				}
				return Math.max(negative, viewBox[key]);
			}
			var tooltipBoundary = positive + tooltipDimension;
			var viewBoxBoundary = viewBox[key] + viewBoxDimension;
			if (tooltipBoundary > viewBoxBoundary) {
				return Math.max(negative, viewBox[key]);
			}
			return Math.max(positive, viewBox[key]);
		}
		function getTransformStyle(_ref3) {
			var translateX = _ref3.translateX,
				translateY = _ref3.translateY,
				useTranslate3d = _ref3.useTranslate3d;
			return {
				transform: useTranslate3d
					? "translate3d("
							.concat(translateX, "px, ")
							.concat(translateY, "px, 0)")
					: "translate(".concat(translateX, "px, ").concat(translateY, "px)"),
			};
		}
		function getTooltipTranslate(_ref4) {
			var allowEscapeViewBox = _ref4.allowEscapeViewBox,
				coordinate = _ref4.coordinate,
				offsetTopLeft = _ref4.offsetTopLeft,
				position = _ref4.position,
				reverseDirection = _ref4.reverseDirection,
				tooltipBox = _ref4.tooltipBox,
				useTranslate3d = _ref4.useTranslate3d,
				viewBox = _ref4.viewBox;
			var cssProperties, translateX, translateY;
			if (tooltipBox.height > 0 && tooltipBox.width > 0 && coordinate) {
				translateX = getTooltipTranslateXY({
					allowEscapeViewBox: allowEscapeViewBox,
					coordinate: coordinate,
					key: "x",
					offsetTopLeft: offsetTopLeft,
					position: position,
					reverseDirection: reverseDirection,
					tooltipDimension: tooltipBox.width,
					viewBox: viewBox,
					viewBoxDimension: viewBox.width,
				});
				translateY = getTooltipTranslateXY({
					allowEscapeViewBox: allowEscapeViewBox,
					coordinate: coordinate,
					key: "y",
					offsetTopLeft: offsetTopLeft,
					position: position,
					reverseDirection: reverseDirection,
					tooltipDimension: tooltipBox.height,
					viewBox: viewBox,
					viewBoxDimension: viewBox.height,
				});
				cssProperties = getTransformStyle({
					translateX: translateX,
					translateY: translateY,
					useTranslate3d: useTranslate3d,
				});
			} else {
				cssProperties = TOOLTIP_HIDDEN;
			}
			return {
				cssProperties: cssProperties,
				cssClasses: getTooltipCSSClassName({
					translateX: translateX,
					translateY: translateY,
					coordinate: coordinate,
				}),
			};
		}
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/TooltipBoundingBox.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["TooltipBoundingBox", () => TooltipBoundingBox]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$tooltip$2f$translate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/tooltip/translate.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}
		function _defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(
					target,
					_toPropertyKey(descriptor.key),
					descriptor,
				);
			}
		}
		function _createClass(Constructor, protoProps, staticProps) {
			if (protoProps) _defineProperties(Constructor.prototype, protoProps);
			if (staticProps) _defineProperties(Constructor, staticProps);
			Object.defineProperty(Constructor, "prototype", {
				writable: false,
			});
			return Constructor;
		}
		function _callSuper(t, o, e) {
			return (
				(o = _getPrototypeOf(o)),
				_possibleConstructorReturn(
					t,
					_isNativeReflectConstruct()
						? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)
						: o.apply(t, e),
				)
			);
		}
		function _possibleConstructorReturn(self, call) {
			if (call && (_typeof(call) === "object" || typeof call === "function")) {
				return call;
			} else if (call !== void 0) {
				throw new TypeError(
					"Derived constructors may only return object or undefined",
				);
			}
			return _assertThisInitialized(self);
		}
		function _assertThisInitialized(self) {
			if (self === void 0) {
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called",
				);
			}
			return self;
		}
		function _isNativeReflectConstruct() {
			try {
				var t = !Boolean.prototype.valueOf.call(
					Reflect.construct(Boolean, [], () => {}),
				);
			} catch (t) {}
			return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
				return !!t;
			})();
		}
		function _getPrototypeOf(o) {
			_getPrototypeOf = Object.setPrototypeOf
				? Object.getPrototypeOf.bind()
				: function _getPrototypeOf(o) {
						return o.__proto__ || Object.getPrototypeOf(o);
					};
			return _getPrototypeOf(o);
		}
		function _inherits(subClass, superClass) {
			if (typeof superClass !== "function" && superClass !== null) {
				throw new TypeError(
					"Super expression must either be null or a function",
				);
			}
			subClass.prototype = Object.create(superClass && superClass.prototype, {
				constructor: {
					value: subClass,
					writable: true,
					configurable: true,
				},
			});
			Object.defineProperty(subClass, "prototype", {
				writable: false,
			});
			if (superClass) _setPrototypeOf(subClass, superClass);
		}
		function _setPrototypeOf(o, p) {
			_setPrototypeOf = Object.setPrototypeOf
				? Object.setPrototypeOf.bind()
				: function _setPrototypeOf(o, p) {
						o.__proto__ = p;
						return o;
					};
			return _setPrototypeOf(o, p);
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		var EPSILON = 1;
		var TooltipBoundingBox = /*#__PURE__*/ ((_PureComponent) => {
			function TooltipBoundingBox() {
				var _this;
				_classCallCheck(this, TooltipBoundingBox);
				for (
					var _len = arguments.length, args = new Array(_len), _key = 0;
					_key < _len;
					_key++
				) {
					args[_key] = arguments[_key];
				}
				_this = _callSuper(this, TooltipBoundingBox, [].concat(args));
				_defineProperty(_this, "state", {
					dismissed: false,
					dismissedAtCoordinate: {
						x: 0,
						y: 0,
					},
					lastBoundingBox: {
						width: -1,
						height: -1,
					},
				});
				_defineProperty(_this, "handleKeyDown", (event) => {
					if (event.key === "Escape") {
						var _this$props$coordinat,
							_this$props$coordinat2,
							_this$props$coordinat3,
							_this$props$coordinat4;
						_this.setState({
							dismissed: true,
							dismissedAtCoordinate: {
								x:
									(_this$props$coordinat =
										(_this$props$coordinat2 = _this.props.coordinate) ===
											null || _this$props$coordinat2 === void 0
											? void 0
											: _this$props$coordinat2.x) !== null &&
									_this$props$coordinat !== void 0
										? _this$props$coordinat
										: 0,
								y:
									(_this$props$coordinat3 =
										(_this$props$coordinat4 = _this.props.coordinate) ===
											null || _this$props$coordinat4 === void 0
											? void 0
											: _this$props$coordinat4.y) !== null &&
									_this$props$coordinat3 !== void 0
										? _this$props$coordinat3
										: 0,
							},
						});
					}
				});
				return _this;
			}
			_inherits(TooltipBoundingBox, _PureComponent);
			return _createClass(TooltipBoundingBox, [
				{
					key: "updateBBox",
					value: function updateBBox() {
						if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
							var box = this.wrapperNode.getBoundingClientRect();
							if (
								Math.abs(box.width - this.state.lastBoundingBox.width) >
									EPSILON ||
								Math.abs(box.height - this.state.lastBoundingBox.height) >
									EPSILON
							) {
								this.setState({
									lastBoundingBox: {
										width: box.width,
										height: box.height,
									},
								});
							}
						} else if (
							this.state.lastBoundingBox.width !== -1 ||
							this.state.lastBoundingBox.height !== -1
						) {
							this.setState({
								lastBoundingBox: {
									width: -1,
									height: -1,
								},
							});
						}
					},
				},
				{
					key: "componentDidMount",
					value: function componentDidMount() {
						document.addEventListener("keydown", this.handleKeyDown);
						this.updateBBox();
					},
				},
				{
					key: "componentWillUnmount",
					value: function componentWillUnmount() {
						document.removeEventListener("keydown", this.handleKeyDown);
					},
				},
				{
					key: "componentDidUpdate",
					value: function componentDidUpdate() {
						var _this$props$coordinat5, _this$props$coordinat6;
						if (this.props.active) {
							this.updateBBox();
						}
						if (!this.state.dismissed) {
							return;
						}
						if (
							((_this$props$coordinat5 = this.props.coordinate) === null ||
							_this$props$coordinat5 === void 0
								? void 0
								: _this$props$coordinat5.x) !==
								this.state.dismissedAtCoordinate.x ||
							((_this$props$coordinat6 = this.props.coordinate) === null ||
							_this$props$coordinat6 === void 0
								? void 0
								: _this$props$coordinat6.y) !==
								this.state.dismissedAtCoordinate.y
						) {
							this.state.dismissed = false;
						}
					},
				},
				{
					key: "render",
					value: function render() {
						var _this2 = this;
						var _this$props = this.props,
							active = _this$props.active,
							allowEscapeViewBox = _this$props.allowEscapeViewBox,
							animationDuration = _this$props.animationDuration,
							animationEasing = _this$props.animationEasing,
							children = _this$props.children,
							coordinate = _this$props.coordinate,
							hasPayload = _this$props.hasPayload,
							isAnimationActive = _this$props.isAnimationActive,
							offset = _this$props.offset,
							position = _this$props.position,
							reverseDirection = _this$props.reverseDirection,
							useTranslate3d = _this$props.useTranslate3d,
							viewBox = _this$props.viewBox,
							wrapperStyle = _this$props.wrapperStyle;
						var _getTooltipTranslate = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$tooltip$2f$translate$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"getTooltipTranslate"
							])({
								allowEscapeViewBox: allowEscapeViewBox,
								coordinate: coordinate,
								offsetTopLeft: offset,
								position: position,
								reverseDirection: reverseDirection,
								tooltipBox: this.state.lastBoundingBox,
								useTranslate3d: useTranslate3d,
								viewBox: viewBox,
							}),
							cssClasses = _getTooltipTranslate.cssClasses,
							cssProperties = _getTooltipTranslate.cssProperties;
						var outerStyle = _objectSpread(
							_objectSpread(
								{
									transition:
										isAnimationActive && active
											? "transform "
													.concat(animationDuration, "ms ")
													.concat(animationEasing)
											: undefined,
								},
								cssProperties,
							),
							{},
							{
								pointerEvents: "none",
								visibility:
									!this.state.dismissed && active && hasPayload
										? "visible"
										: "hidden",
								position: "absolute",
								top: 0,
								left: 0,
							},
							wrapperStyle,
						);
						return (
							/*#__PURE__*/ // This element allow listening to the `Escape` key.
							// See https://github.com/recharts/recharts/pull/2925
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement(
								"div",
								{
									tabIndex: -1,
									className: cssClasses,
									style: outerStyle,
									ref: function ref(node) {
										_this2.wrapperNode = node;
									},
								},
								children,
							)
						);
					},
				},
			]);
		})(
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"PureComponent"
			],
		);
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/Global.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["Global", () => Global]);
		var parseIsSsrByDefault = function parseIsSsrByDefault() {
			return !(
				("TURBOPACK compile-time value", "undefined") !== "undefined" &&
				window.document &&
				window.document.createElement &&
				window.setTimeout
			);
		};
		var Global = {
			isSsr: parseIsSsrByDefault(),
			get: function get(key) {
				return Global[key];
			},
			set: function set(key, value) {
				if (typeof key === "string") {
					Global[key] = value;
				} else {
					var keys = Object.keys(key);
					if (keys && keys.length) {
						keys.forEach((k) => {
							Global[k] = key[k];
						});
					}
				}
			},
		};
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/payload/getUniqPayload.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["getUniqPayload", () => getUniqPayload]);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$uniqBy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/uniqBy.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isFunction.js [app-ssr] (ecmascript)",
			);
		function getUniqPayload(payload, option, defaultUniqBy) {
			if (option === true) {
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$uniqBy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(payload, defaultUniqBy);
			}
			if (
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(option)
			) {
				return (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$uniqBy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(payload, option);
			}
			return payload;
		}
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/Tooltip.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["Tooltip", () => Tooltip]);
		/**
		 * @fileOverview Tooltip
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$DefaultTooltipContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/DefaultTooltipContent.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$TooltipBoundingBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/TooltipBoundingBox.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$Global$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/Global.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$payload$2f$getUniqPayload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/payload/getUniqPayload.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}
		function _defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(
					target,
					_toPropertyKey(descriptor.key),
					descriptor,
				);
			}
		}
		function _createClass(Constructor, protoProps, staticProps) {
			if (protoProps) _defineProperties(Constructor.prototype, protoProps);
			if (staticProps) _defineProperties(Constructor, staticProps);
			Object.defineProperty(Constructor, "prototype", {
				writable: false,
			});
			return Constructor;
		}
		function _callSuper(t, o, e) {
			return (
				(o = _getPrototypeOf(o)),
				_possibleConstructorReturn(
					t,
					_isNativeReflectConstruct()
						? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)
						: o.apply(t, e),
				)
			);
		}
		function _possibleConstructorReturn(self, call) {
			if (call && (_typeof(call) === "object" || typeof call === "function")) {
				return call;
			} else if (call !== void 0) {
				throw new TypeError(
					"Derived constructors may only return object or undefined",
				);
			}
			return _assertThisInitialized(self);
		}
		function _assertThisInitialized(self) {
			if (self === void 0) {
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called",
				);
			}
			return self;
		}
		function _isNativeReflectConstruct() {
			try {
				var t = !Boolean.prototype.valueOf.call(
					Reflect.construct(Boolean, [], () => {}),
				);
			} catch (t) {}
			return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
				return !!t;
			})();
		}
		function _getPrototypeOf(o) {
			_getPrototypeOf = Object.setPrototypeOf
				? Object.getPrototypeOf.bind()
				: function _getPrototypeOf(o) {
						return o.__proto__ || Object.getPrototypeOf(o);
					};
			return _getPrototypeOf(o);
		}
		function _inherits(subClass, superClass) {
			if (typeof superClass !== "function" && superClass !== null) {
				throw new TypeError(
					"Super expression must either be null or a function",
				);
			}
			subClass.prototype = Object.create(superClass && superClass.prototype, {
				constructor: {
					value: subClass,
					writable: true,
					configurable: true,
				},
			});
			Object.defineProperty(subClass, "prototype", {
				writable: false,
			});
			if (superClass) _setPrototypeOf(subClass, superClass);
		}
		function _setPrototypeOf(o, p) {
			_setPrototypeOf = Object.setPrototypeOf
				? Object.setPrototypeOf.bind()
				: function _setPrototypeOf(o, p) {
						o.__proto__ = p;
						return o;
					};
			return _setPrototypeOf(o, p);
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function defaultUniqBy(entry) {
			return entry.dataKey;
		}
		function renderContent(content, props) {
			if (
				/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].isValidElement(content)
			) {
				return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].cloneElement(content, props);
			}
			if (typeof content === "function") {
				return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].createElement(content, props);
			}
			return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			].createElement(
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$DefaultTooltipContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"DefaultTooltipContent"
				],
				props,
			);
		}
		var Tooltip = /*#__PURE__*/ ((_PureComponent) => {
			function Tooltip() {
				_classCallCheck(this, Tooltip);
				return _callSuper(this, Tooltip, arguments);
			}
			_inherits(Tooltip, _PureComponent);
			return _createClass(Tooltip, [
				{
					key: "render",
					value: function render() {
						var _this$props = this.props,
							active = _this$props.active,
							allowEscapeViewBox = _this$props.allowEscapeViewBox,
							animationDuration = _this$props.animationDuration,
							animationEasing = _this$props.animationEasing,
							content = _this$props.content,
							coordinate = _this$props.coordinate,
							filterNull = _this$props.filterNull,
							isAnimationActive = _this$props.isAnimationActive,
							offset = _this$props.offset,
							payload = _this$props.payload,
							payloadUniqBy = _this$props.payloadUniqBy,
							position = _this$props.position,
							reverseDirection = _this$props.reverseDirection,
							useTranslate3d = _this$props.useTranslate3d,
							viewBox = _this$props.viewBox,
							wrapperStyle = _this$props.wrapperStyle;
						var finalPayload =
							payload !== null && payload !== void 0 ? payload : [];
						if (filterNull && finalPayload.length) {
							finalPayload = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$payload$2f$getUniqPayload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"getUniqPayload"
							])(
								payload.filter(
									(entry) =>
										entry.value != null &&
										(entry.hide !== true || this.props.includeHidden),
								),
								payloadUniqBy,
								defaultUniqBy,
							);
						}
						var hasPayload = finalPayload.length > 0;
						return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"default"
						].createElement(
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$TooltipBoundingBox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"TooltipBoundingBox"
							],
							{
								allowEscapeViewBox: allowEscapeViewBox,
								animationDuration: animationDuration,
								animationEasing: animationEasing,
								isAnimationActive: isAnimationActive,
								active: active,
								coordinate: coordinate,
								hasPayload: hasPayload,
								offset: offset,
								position: position,
								reverseDirection: reverseDirection,
								useTranslate3d: useTranslate3d,
								viewBox: viewBox,
								wrapperStyle: wrapperStyle,
							},
							renderContent(
								content,
								_objectSpread(
									_objectSpread({}, this.props),
									{},
									{
										payload: finalPayload,
									},
								),
							),
						);
					},
				},
			]);
		})(
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"PureComponent"
			],
		);
		_defineProperty(Tooltip, "displayName", "Tooltip");
		_defineProperty(Tooltip, "defaultProps", {
			accessibilityLayer: false,
			allowEscapeViewBox: {
				x: false,
				y: false,
			},
			animationDuration: 400,
			animationEasing: "ease",
			contentStyle: {},
			coordinate: {
				x: 0,
				y: 0,
			},
			cursor: true,
			cursorStyle: {},
			filterNull: true,
			isAnimationActive:
				!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$Global$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"Global"
				].isSsr,
			itemStyle: {},
			labelStyle: {},
			offset: 10,
			reverseDirection: {
				x: false,
				y: false,
			},
			separator: " : ",
			trigger: "hover",
			useTranslate3d: false,
			viewBox: {
				x: 0,
				y: 0,
				height: 0,
				width: 0,
			},
			wrapperStyle: {},
		});
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/container/Surface.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["Surface", () => Surface]);
		/**
		 * @fileOverview Surface
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/ReactUtils.js [app-ssr] (ecmascript)",
			);
		var _excluded = [
			"children",
			"width",
			"height",
			"viewBox",
			"className",
			"style",
			"title",
			"desc",
		];
		function _extends() {
			_extends = ("TURBOPACK compile-time truthy", 1)
				? Object.assign.bind()
				: "TURBOPACK unreachable";
			return _extends.apply(this, arguments);
		}
		function _objectWithoutProperties(source, excluded) {
			if (source == null) return {};
			var target = _objectWithoutPropertiesLoose(source, excluded);
			var key, i;
			if (Object.getOwnPropertySymbols) {
				var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
				for (i = 0; i < sourceSymbolKeys.length; i++) {
					key = sourceSymbolKeys[i];
					if (excluded.indexOf(key) >= 0) continue;
					if (!Object.prototype.propertyIsEnumerable.call(source, key))
						continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function _objectWithoutPropertiesLoose(source, excluded) {
			if (source == null) return {};
			var target = {};
			for (var key in source) {
				if (Object.hasOwn(source, key)) {
					if (excluded.indexOf(key) >= 0) continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function Surface(props) {
			var children = props.children,
				width = props.width,
				height = props.height,
				viewBox = props.viewBox,
				className = props.className,
				style = props.style,
				title = props.title,
				desc = props.desc,
				others = _objectWithoutProperties(props, _excluded);
			var svgView = viewBox || {
				width: width,
				height: height,
				x: 0,
				y: 0,
			};
			var layerClass = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			])("recharts-surface", className);
			return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			].createElement(
				"svg",
				_extends(
					{},
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"filterProps"
					])(others, true, "svg"),
					{
						className: layerClass,
						width: width,
						height: height,
						style: style,
						viewBox: ""
							.concat(svgView.x, " ")
							.concat(svgView.y, " ")
							.concat(svgView.width, " ")
							.concat(svgView.height),
					},
				),
				/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].createElement("title", null, title),
				/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].createElement("desc", null, desc),
				children,
			);
		}
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/shape/Symbols.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["Symbols", () => Symbols]);
		/**
		 * @fileOverview Curve
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$upperFirst$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/upperFirst.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$victory$2d$vendor$40$36$2e$9$2e$2$2f$node_modules$2f$victory$2d$vendor$2f$es$2f$d3$2d$shape$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/victory-vendor@36.9.2/node_modules/victory-vendor/es/d3-shape.js [app-ssr] (ecmascript) <locals>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbol$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol.js [app-ssr] (ecmascript) <export default as symbol>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolCircle$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/circle.js [app-ssr] (ecmascript) <export default as symbolCircle>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$cross$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolCross$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/cross.js [app-ssr] (ecmascript) <export default as symbolCross>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$diamond$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolDiamond$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/diamond.js [app-ssr] (ecmascript) <export default as symbolDiamond>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolSquare$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/square.js [app-ssr] (ecmascript) <export default as symbolSquare>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolStar$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/star.js [app-ssr] (ecmascript) <export default as symbolStar>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$triangle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolTriangle$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/triangle.js [app-ssr] (ecmascript) <export default as symbolTriangle>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$wye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolWye$3e$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/d3-shape@3.2.0/node_modules/d3-shape/src/symbol/wye.js [app-ssr] (ecmascript) <export default as symbolWye>",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/ReactUtils.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		var _excluded = ["type", "size", "sizeType"];
		function _extends() {
			_extends = ("TURBOPACK compile-time truthy", 1)
				? Object.assign.bind()
				: "TURBOPACK unreachable";
			return _extends.apply(this, arguments);
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function _objectWithoutProperties(source, excluded) {
			if (source == null) return {};
			var target = _objectWithoutPropertiesLoose(source, excluded);
			var key, i;
			if (Object.getOwnPropertySymbols) {
				var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
				for (i = 0; i < sourceSymbolKeys.length; i++) {
					key = sourceSymbolKeys[i];
					if (excluded.indexOf(key) >= 0) continue;
					if (!Object.prototype.propertyIsEnumerable.call(source, key))
						continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function _objectWithoutPropertiesLoose(source, excluded) {
			if (source == null) return {};
			var target = {};
			for (var key in source) {
				if (Object.hasOwn(source, key)) {
					if (excluded.indexOf(key) >= 0) continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		var symbolFactories = {
			symbolCircle:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolCircle$3e$__[
					"symbolCircle"
				],
			symbolCross:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$cross$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolCross$3e$__[
					"symbolCross"
				],
			symbolDiamond:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$diamond$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolDiamond$3e$__[
					"symbolDiamond"
				],
			symbolSquare:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolSquare$3e$__[
					"symbolSquare"
				],
			symbolStar:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolStar$3e$__[
					"symbolStar"
				],
			symbolTriangle:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$triangle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolTriangle$3e$__[
					"symbolTriangle"
				],
			symbolWye:
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$wye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolWye$3e$__[
					"symbolWye"
				],
		};
		var RADIAN = Math.PI / 180;
		var getSymbolFactory = function getSymbolFactory(type) {
			var name = "symbol".concat(
				(0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$upperFirst$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				])(type),
			);
			return (
				symbolFactories[name] ||
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2f$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbolCircle$3e$__[
					"symbolCircle"
				]
			);
		};
		var calculateAreaSize = function calculateAreaSize(size, sizeType, type) {
			if (sizeType === "area") {
				return size;
			}
			switch (type) {
				case "cross":
					return (5 * size * size) / 9;
				case "diamond":
					return (0.5 * size * size) / Math.sqrt(3);
				case "square":
					return size * size;
				case "star": {
					var angle = 18 * RADIAN;
					return (
						1.25 *
						size *
						size *
						(Math.tan(angle) - Math.tan(angle * 2) * Math.tan(angle) ** 2)
					);
				}
				case "triangle":
					return (Math.sqrt(3) * size * size) / 4;
				case "wye":
					return ((21 - 10 * Math.sqrt(3)) * size * size) / 8;
				default:
					return (Math.PI * size * size) / 4;
			}
		};
		var registerSymbol = function registerSymbol(key, factory) {
			symbolFactories[
				"symbol".concat(
					(0,
					__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$upperFirst$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
						"default"
					])(key),
				)
			] = factory;
		};
		var Symbols = function Symbols(_ref) {
			var _ref$type = _ref.type,
				type = _ref$type === void 0 ? "circle" : _ref$type,
				_ref$size = _ref.size,
				size = _ref$size === void 0 ? 64 : _ref$size,
				_ref$sizeType = _ref.sizeType,
				sizeType = _ref$sizeType === void 0 ? "area" : _ref$sizeType,
				rest = _objectWithoutProperties(_ref, _excluded);
			var props = _objectSpread(
				_objectSpread({}, rest),
				{},
				{
					type: type,
					size: size,
					sizeType: sizeType,
				},
			);
			/**
			 * Calculate the path of curve
			 * @return {String} path
			 */ var getPath = function getPath() {
				var symbolFactory = getSymbolFactory(type);
				var symbol = (0,
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$d3$2d$shape$40$3$2e$2$2e$0$2f$node_modules$2f$d3$2d$shape$2f$src$2f$symbol$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__symbol$3e$__[
					"symbol"
				])()
					.type(symbolFactory)
					.size(calculateAreaSize(size, sizeType, type));
				return symbol();
			};
			var className = props.className,
				cx = props.cx,
				cy = props.cy;
			var filteredProps = (0,
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$ReactUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"filterProps"
			])(props, true);
			if (cx === +cx && cy === +cy && size === +size) {
				return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].createElement(
					"path",
					_extends({}, filteredProps, {
						className: (0,
						__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"default"
						])("recharts-symbols", className),
						transform: "translate(".concat(cx, ", ").concat(cy, ")"),
						d: getPath(),
					}),
				);
			}
			return null;
		};
		Symbols.registerSymbol = registerSymbol;
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/DefaultLegendContent.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s([
			"DefaultLegendContent",
			() => DefaultLegendContent,
		]);
		/**
		 * @fileOverview Default Legend Content
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/isFunction.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/LogUtils.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Surface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/container/Surface.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$shape$2f$Symbols$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/shape/Symbols.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/types.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		function _extends() {
			_extends = ("TURBOPACK compile-time truthy", 1)
				? Object.assign.bind()
				: "TURBOPACK unreachable";
			return _extends.apply(this, arguments);
		}
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}
		function _defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(
					target,
					_toPropertyKey(descriptor.key),
					descriptor,
				);
			}
		}
		function _createClass(Constructor, protoProps, staticProps) {
			if (protoProps) _defineProperties(Constructor.prototype, protoProps);
			if (staticProps) _defineProperties(Constructor, staticProps);
			Object.defineProperty(Constructor, "prototype", {
				writable: false,
			});
			return Constructor;
		}
		function _callSuper(t, o, e) {
			return (
				(o = _getPrototypeOf(o)),
				_possibleConstructorReturn(
					t,
					_isNativeReflectConstruct()
						? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)
						: o.apply(t, e),
				)
			);
		}
		function _possibleConstructorReturn(self, call) {
			if (call && (_typeof(call) === "object" || typeof call === "function")) {
				return call;
			} else if (call !== void 0) {
				throw new TypeError(
					"Derived constructors may only return object or undefined",
				);
			}
			return _assertThisInitialized(self);
		}
		function _assertThisInitialized(self) {
			if (self === void 0) {
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called",
				);
			}
			return self;
		}
		function _isNativeReflectConstruct() {
			try {
				var t = !Boolean.prototype.valueOf.call(
					Reflect.construct(Boolean, [], () => {}),
				);
			} catch (t) {}
			return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
				return !!t;
			})();
		}
		function _getPrototypeOf(o) {
			_getPrototypeOf = Object.setPrototypeOf
				? Object.getPrototypeOf.bind()
				: function _getPrototypeOf(o) {
						return o.__proto__ || Object.getPrototypeOf(o);
					};
			return _getPrototypeOf(o);
		}
		function _inherits(subClass, superClass) {
			if (typeof superClass !== "function" && superClass !== null) {
				throw new TypeError(
					"Super expression must either be null or a function",
				);
			}
			subClass.prototype = Object.create(superClass && superClass.prototype, {
				constructor: {
					value: subClass,
					writable: true,
					configurable: true,
				},
			});
			Object.defineProperty(subClass, "prototype", {
				writable: false,
			});
			if (superClass) _setPrototypeOf(subClass, superClass);
		}
		function _setPrototypeOf(o, p) {
			_setPrototypeOf = Object.setPrototypeOf
				? Object.setPrototypeOf.bind()
				: function _setPrototypeOf(o, p) {
						o.__proto__ = p;
						return o;
					};
			return _setPrototypeOf(o, p);
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		var SIZE = 32;
		var DefaultLegendContent = /*#__PURE__*/ ((_PureComponent) => {
			function DefaultLegendContent() {
				_classCallCheck(this, DefaultLegendContent);
				return _callSuper(this, DefaultLegendContent, arguments);
			}
			_inherits(DefaultLegendContent, _PureComponent);
			return _createClass(DefaultLegendContent, [
				{
					key: "renderIcon",
					value: /**
					 * Render the path of icon
					 * @param {Object} data Data of each legend item
					 * @return {String} Path element
					 */ function renderIcon(data) {
						var inactiveColor = this.props.inactiveColor;
						var halfSize = SIZE / 2;
						var sixthSize = SIZE / 6;
						var thirdSize = SIZE / 3;
						var color = data.inactive ? inactiveColor : data.color;
						if (data.type === "plainline") {
							return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement("line", {
								strokeWidth: 4,
								fill: "none",
								stroke: color,
								strokeDasharray: data.payload.strokeDasharray,
								x1: 0,
								y1: halfSize,
								x2: SIZE,
								y2: halfSize,
								className: "recharts-legend-icon",
							});
						}
						if (data.type === "line") {
							return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement("path", {
								strokeWidth: 4,
								fill: "none",
								stroke: color,
								d: "M0,"
									.concat(halfSize, "h")
									.concat(thirdSize, "\n            A")
									.concat(sixthSize, ",")
									.concat(sixthSize, ",0,1,1,")
									.concat(2 * thirdSize, ",")
									.concat(halfSize, "\n            H")
									.concat(SIZE, "M")
									.concat(2 * thirdSize, ",")
									.concat(halfSize, "\n            A")
									.concat(sixthSize, ",")
									.concat(sixthSize, ",0,1,1,")
									.concat(thirdSize, ",")
									.concat(halfSize),
								className: "recharts-legend-icon",
							});
						}
						if (data.type === "rect") {
							return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement("path", {
								stroke: "none",
								fill: color,
								d: "M0,"
									.concat(SIZE / 8, "h")
									.concat(SIZE, "v")
									.concat((SIZE * 3) / 4, "h")
									.concat(-SIZE, "z"),
								className: "recharts-legend-icon",
							});
						}
						if (
							/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].isValidElement(data.legendIcon)
						) {
							var iconProps = _objectSpread({}, data);
							delete iconProps.legendIcon;
							return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].cloneElement(data.legendIcon, iconProps);
						}
						return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"default"
						].createElement(
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$shape$2f$Symbols$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"Symbols"
							],
							{
								fill: color,
								cx: halfSize,
								cy: halfSize,
								size: SIZE,
								sizeType: "diameter",
								type: data.type,
							},
						);
					},
				},
				{
					key: "renderItems",
					value: function renderItems() {
						var _this$props = this.props,
							payload = _this$props.payload,
							iconSize = _this$props.iconSize,
							layout = _this$props.layout,
							formatter = _this$props.formatter,
							inactiveColor = _this$props.inactiveColor;
						var viewBox = {
							x: 0,
							y: 0,
							width: SIZE,
							height: SIZE,
						};
						var itemStyle = {
							display: layout === "horizontal" ? "inline-block" : "block",
							marginRight: 10,
						};
						var svgStyle = {
							display: "inline-block",
							verticalAlign: "middle",
							marginRight: 4,
						};
						return payload.map((entry, i) => {
							var finalFormatter = entry.formatter || formatter;
							var className = (0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							])(
								_defineProperty(
									_defineProperty(
										{
											"recharts-legend-item": true,
										},
										"legend-item-".concat(i),
										true,
									),
									"inactive",
									entry.inactive,
								),
							);
							if (entry.type === "none") {
								return null;
							}
							// Do not render entry.value as functions. Always require static string properties.
							var entryValue = !(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							])(entry.value)
								? entry.value
								: null;
							(0,
							__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$LogUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"warn"
							])(
								!(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$isFunction$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"default"
								])(entry.value),
								'The name property is also required when using a function for the dataKey of a chart\'s cartesian components. Ex: <Bar name="Name of my Data"/>', // eslint-disable-line max-len
							);
							var color = entry.inactive ? inactiveColor : entry.color;
							return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement(
								"li",
								_extends(
									{
										className: className,
										style: itemStyle,
										key: "legend-item-".concat(i),
									},
									(0,
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$types$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"adaptEventsOfChild"
									])(this.props, entry, i),
								),
								/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"default"
								].createElement(
									__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$container$2f$Surface$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
										"Surface"
									],
									{
										width: iconSize,
										height: iconSize,
										viewBox: viewBox,
										style: svgStyle,
									},
									this.renderIcon(entry),
								),
								/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"default"
								].createElement(
									"span",
									{
										className: "recharts-legend-item-text",
										style: {
											color: color,
										},
									},
									finalFormatter
										? finalFormatter(entryValue, entry, i)
										: entryValue,
								),
							);
						});
					},
				},
				{
					key: "render",
					value: function render() {
						var _this$props2 = this.props,
							payload = _this$props2.payload,
							layout = _this$props2.layout,
							align = _this$props2.align;
						if (!payload || !payload.length) {
							return null;
						}
						var finalStyle = {
							padding: 0,
							margin: 0,
							textAlign: layout === "horizontal" ? align : "left",
						};
						return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
							"default"
						].createElement(
							"ul",
							{
								className: "recharts-default-legend",
								style: finalStyle,
							},
							this.renderItems(),
						);
					},
				},
			]);
		})(
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"PureComponent"
			],
		);
		_defineProperty(DefaultLegendContent, "displayName", "Legend");
		_defineProperty(DefaultLegendContent, "defaultProps", {
			iconSize: 14,
			layout: "horizontal",
			align: "center",
			verticalAlign: "middle",
			inactiveColor: "#ccc",
		});
	},
	"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/Legend.js [app-ssr] (ecmascript)",
	(__turbopack_context__) => {
		"use strict";

		__turbopack_context__.s(["Legend", () => Legend]);
		/**
		 * @fileOverview Legend
		 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/next@16.0.1_@opentelemetry+api@1.9.0_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$DefaultLegendContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/component/DefaultLegendContent.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/DataUtils.js [app-ssr] (ecmascript)",
			);
		var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$payload$2f$getUniqPayload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ =
			__turbopack_context__.i(
				"[project]/node_modules/.pnpm/recharts@2.15.4_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/recharts/es6/util/payload/getUniqPayload.js [app-ssr] (ecmascript)",
			);
		function _typeof(o) {
			"@babel/helpers - typeof";
			return (
				(_typeof =
					"function" == typeof Symbol && "symbol" == typeof Symbol.iterator
						? (o) => typeof o
						: (o) =>
								o &&
								"function" == typeof Symbol &&
								o.constructor === Symbol &&
								o !== Symbol.prototype
									? "symbol"
									: typeof o),
				_typeof(o)
			);
		}
		var _excluded = ["ref"];
		function ownKeys(e, r) {
			var t = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				r &&
					(o = o.filter(
						(r) => Object.getOwnPropertyDescriptor(e, r).enumerable,
					)),
					t.push.apply(t, o);
			}
			return t;
		}
		function _objectSpread(e) {
			for (var r = 1; r < arguments.length; r++) {
				var t = null != arguments[r] ? arguments[r] : {};
				r % 2
					? ownKeys(Object(t), !0).forEach((r) => {
							_defineProperty(e, r, t[r]);
						})
					: Object.getOwnPropertyDescriptors
						? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
						: ownKeys(Object(t)).forEach((r) => {
								Object.defineProperty(
									e,
									r,
									Object.getOwnPropertyDescriptor(t, r),
								);
							});
			}
			return e;
		}
		function _classCallCheck(instance, Constructor) {
			if (!(instance instanceof Constructor)) {
				throw new TypeError("Cannot call a class as a function");
			}
		}
		function _defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(
					target,
					_toPropertyKey(descriptor.key),
					descriptor,
				);
			}
		}
		function _createClass(Constructor, protoProps, staticProps) {
			if (protoProps) _defineProperties(Constructor.prototype, protoProps);
			if (staticProps) _defineProperties(Constructor, staticProps);
			Object.defineProperty(Constructor, "prototype", {
				writable: false,
			});
			return Constructor;
		}
		function _callSuper(t, o, e) {
			return (
				(o = _getPrototypeOf(o)),
				_possibleConstructorReturn(
					t,
					_isNativeReflectConstruct()
						? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)
						: o.apply(t, e),
				)
			);
		}
		function _possibleConstructorReturn(self, call) {
			if (call && (_typeof(call) === "object" || typeof call === "function")) {
				return call;
			} else if (call !== void 0) {
				throw new TypeError(
					"Derived constructors may only return object or undefined",
				);
			}
			return _assertThisInitialized(self);
		}
		function _assertThisInitialized(self) {
			if (self === void 0) {
				throw new ReferenceError(
					"this hasn't been initialised - super() hasn't been called",
				);
			}
			return self;
		}
		function _isNativeReflectConstruct() {
			try {
				var t = !Boolean.prototype.valueOf.call(
					Reflect.construct(Boolean, [], () => {}),
				);
			} catch (t) {}
			return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
				return !!t;
			})();
		}
		function _getPrototypeOf(o) {
			_getPrototypeOf = Object.setPrototypeOf
				? Object.getPrototypeOf.bind()
				: function _getPrototypeOf(o) {
						return o.__proto__ || Object.getPrototypeOf(o);
					};
			return _getPrototypeOf(o);
		}
		function _inherits(subClass, superClass) {
			if (typeof superClass !== "function" && superClass !== null) {
				throw new TypeError(
					"Super expression must either be null or a function",
				);
			}
			subClass.prototype = Object.create(superClass && superClass.prototype, {
				constructor: {
					value: subClass,
					writable: true,
					configurable: true,
				},
			});
			Object.defineProperty(subClass, "prototype", {
				writable: false,
			});
			if (superClass) _setPrototypeOf(subClass, superClass);
		}
		function _setPrototypeOf(o, p) {
			_setPrototypeOf = Object.setPrototypeOf
				? Object.setPrototypeOf.bind()
				: function _setPrototypeOf(o, p) {
						o.__proto__ = p;
						return o;
					};
			return _setPrototypeOf(o, p);
		}
		function _defineProperty(obj, key, value) {
			key = _toPropertyKey(key);
			if (key in obj) {
				Object.defineProperty(obj, key, {
					value: value,
					enumerable: true,
					configurable: true,
					writable: true,
				});
			} else {
				obj[key] = value;
			}
			return obj;
		}
		function _toPropertyKey(t) {
			var i = _toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		function _toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		function _objectWithoutProperties(source, excluded) {
			if (source == null) return {};
			var target = _objectWithoutPropertiesLoose(source, excluded);
			var key, i;
			if (Object.getOwnPropertySymbols) {
				var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
				for (i = 0; i < sourceSymbolKeys.length; i++) {
					key = sourceSymbolKeys[i];
					if (excluded.indexOf(key) >= 0) continue;
					if (!Object.prototype.propertyIsEnumerable.call(source, key))
						continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function _objectWithoutPropertiesLoose(source, excluded) {
			if (source == null) return {};
			var target = {};
			for (var key in source) {
				if (Object.hasOwn(source, key)) {
					if (excluded.indexOf(key) >= 0) continue;
					target[key] = source[key];
				}
			}
			return target;
		}
		function defaultUniqBy(entry) {
			return entry.value;
		}
		function renderContent(content, props) {
			if (
				/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].isValidElement(content)
			) {
				return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].cloneElement(content, props);
			}
			if (typeof content === "function") {
				return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"default"
				].createElement(content, props);
			}
			var ref = props.ref,
				otherProps = _objectWithoutProperties(props, _excluded);
			return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"default"
			].createElement(
				__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$component$2f$DefaultLegendContent$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
					"DefaultLegendContent"
				],
				otherProps,
			);
		}
		var EPS = 1;
		var Legend = /*#__PURE__*/ ((_PureComponent) => {
			function Legend() {
				var _this;
				_classCallCheck(this, Legend);
				for (
					var _len = arguments.length, args = new Array(_len), _key = 0;
					_key < _len;
					_key++
				) {
					args[_key] = arguments[_key];
				}
				_this = _callSuper(this, Legend, [].concat(args));
				_defineProperty(_this, "lastBoundingBox", {
					width: -1,
					height: -1,
				});
				return _this;
			}
			_inherits(Legend, _PureComponent);
			return _createClass(
				Legend,
				[
					{
						key: "componentDidMount",
						value: function componentDidMount() {
							this.updateBBox();
						},
					},
					{
						key: "componentDidUpdate",
						value: function componentDidUpdate() {
							this.updateBBox();
						},
					},
					{
						key: "getBBox",
						value: function getBBox() {
							if (this.wrapperNode && this.wrapperNode.getBoundingClientRect) {
								var box = this.wrapperNode.getBoundingClientRect();
								box.height = this.wrapperNode.offsetHeight;
								box.width = this.wrapperNode.offsetWidth;
								return box;
							}
							return null;
						},
					},
					{
						key: "updateBBox",
						value: function updateBBox() {
							var onBBoxUpdate = this.props.onBBoxUpdate;
							var box = this.getBBox();
							if (box) {
								if (
									Math.abs(box.width - this.lastBoundingBox.width) > EPS ||
									Math.abs(box.height - this.lastBoundingBox.height) > EPS
								) {
									this.lastBoundingBox.width = box.width;
									this.lastBoundingBox.height = box.height;
									if (onBBoxUpdate) {
										onBBoxUpdate(box);
									}
								}
							} else if (
								this.lastBoundingBox.width !== -1 ||
								this.lastBoundingBox.height !== -1
							) {
								this.lastBoundingBox.width = -1;
								this.lastBoundingBox.height = -1;
								if (onBBoxUpdate) {
									onBBoxUpdate(null);
								}
							}
						},
					},
					{
						key: "getBBoxSnapshot",
						value: function getBBoxSnapshot() {
							if (
								this.lastBoundingBox.width >= 0 &&
								this.lastBoundingBox.height >= 0
							) {
								return _objectSpread({}, this.lastBoundingBox);
							}
							return {
								width: 0,
								height: 0,
							};
						},
					},
					{
						key: "getDefaultPosition",
						value: function getDefaultPosition(style) {
							var _this$props = this.props,
								layout = _this$props.layout,
								align = _this$props.align,
								verticalAlign = _this$props.verticalAlign,
								margin = _this$props.margin,
								chartWidth = _this$props.chartWidth,
								chartHeight = _this$props.chartHeight;
							var hPos, vPos;
							if (
								!style ||
								((style.left === undefined || style.left === null) &&
									(style.right === undefined || style.right === null))
							) {
								if (align === "center" && layout === "vertical") {
									var box = this.getBBoxSnapshot();
									hPos = {
										left: ((chartWidth || 0) - box.width) / 2,
									};
								} else {
									hPos =
										align === "right"
											? {
													right: (margin && margin.right) || 0,
												}
											: {
													left: (margin && margin.left) || 0,
												};
								}
							}
							if (
								!style ||
								((style.top === undefined || style.top === null) &&
									(style.bottom === undefined || style.bottom === null))
							) {
								if (verticalAlign === "middle") {
									var _box = this.getBBoxSnapshot();
									vPos = {
										top: ((chartHeight || 0) - _box.height) / 2,
									};
								} else {
									vPos =
										verticalAlign === "bottom"
											? {
													bottom: (margin && margin.bottom) || 0,
												}
											: {
													top: (margin && margin.top) || 0,
												};
								}
							}
							return _objectSpread(_objectSpread({}, hPos), vPos);
						},
					},
					{
						key: "render",
						value: function render() {
							var _this2 = this;
							var _this$props2 = this.props,
								content = _this$props2.content,
								width = _this$props2.width,
								height = _this$props2.height,
								wrapperStyle = _this$props2.wrapperStyle,
								payloadUniqBy = _this$props2.payloadUniqBy,
								payload = _this$props2.payload;
							var outerStyle = _objectSpread(
								_objectSpread(
									{
										position: "absolute",
										width: width || "auto",
										height: height || "auto",
									},
									this.getDefaultPosition(wrapperStyle),
								),
								wrapperStyle,
							);
							return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
								"default"
							].createElement(
								"div",
								{
									className: "recharts-legend-wrapper",
									style: outerStyle,
									ref: function ref(node) {
										_this2.wrapperNode = node;
									},
								},
								renderContent(
									content,
									_objectSpread(
										_objectSpread({}, this.props),
										{},
										{
											payload: (0,
											__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$payload$2f$getUniqPayload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
												"getUniqPayload"
											])(payload, payloadUniqBy, defaultUniqBy),
										},
									),
								),
							);
						},
					},
				],
				[
					{
						key: "getWithHeight",
						value: function getWithHeight(item, chartWidth) {
							var _this$defaultProps$it = _objectSpread(
									_objectSpread({}, this.defaultProps),
									item.props,
								),
								layout = _this$defaultProps$it.layout;
							if (
								layout === "vertical" &&
								(0,
								__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$recharts$40$2$2e$15$2e$4_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$recharts$2f$es6$2f$util$2f$DataUtils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
									"isNumber"
								])(item.props.height)
							) {
								return {
									height: item.props.height,
								};
							}
							if (layout === "horizontal") {
								return {
									width: item.props.width || chartWidth,
								};
							}
							return null;
						},
					},
				],
			);
		})(
			__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$opentelemetry$2b$api$40$1$2e$9$2e$0_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__[
				"PureComponent"
			],
		);
		_defineProperty(Legend, "displayName", "Legend");
		_defineProperty(Legend, "defaultProps", {
			iconSize: 14,
			layout: "horizontal",
			align: "center",
			verticalAlign: "bottom",
		});
	},
];

//# sourceMappingURL=925b5_recharts_es6_4a07ad43._.js.map
