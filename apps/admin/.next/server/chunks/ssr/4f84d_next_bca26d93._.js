module.exports = [
	31880,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 }),
			Object.defineProperty(c, "ReflectAdapter", {
				enumerable: !0,
				get: () => d,
			});
		class d {
			static get(a, b, c) {
				const d = Reflect.get(a, b, c);
				return "function" == typeof d ? d.bind(a) : d;
			}
			static set(a, b, c, d) {
				return Reflect.set(a, b, c, d);
			}
			static has(a, b) {
				return Reflect.has(a, b);
			}
			static deleteProperty(a, b) {
				return Reflect.deleteProperty(a, b);
			}
		}
	},
	67060,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 });
		var d = {
			MutableRequestCookiesAdapter: () => n,
			ReadonlyRequestCookiesError: () => i,
			RequestCookiesAdapter: () => j,
			appendMutableCookies: () => m,
			areCookiesMutableInCurrentPhase: () => p,
			createCookiesWithMutableAccessCheck: () => o,
			getModifiedCookieValues: () => l,
			responseCookiesToRequestCookies: () => r,
		};
		for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
		const f = a.r(98203),
			g = a.r(31880),
			h = a.r(56704);
		class i extends Error {
			constructor() {
				super(
					"Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options",
				);
			}
			static callable() {
				throw new i();
			}
		}
		class j {
			static seal(a) {
				return new Proxy(a, {
					get(a, b, c) {
						switch (b) {
							case "clear":
							case "delete":
							case "set":
								return i.callable;
							default:
								return g.ReflectAdapter.get(a, b, c);
						}
					},
				});
			}
		}
		const k = Symbol.for("next.mutated.cookies");
		function l(a) {
			const b = a[k];
			return b && Array.isArray(b) && 0 !== b.length ? b : [];
		}
		function m(a, b) {
			const c = l(b);
			if (0 === c.length) return !1;
			const d = new f.ResponseCookies(a),
				e = d.getAll();
			for (const a of c) d.set(a);
			for (const a of e) d.set(a);
			return !0;
		}
		class n {
			static wrap(a, b) {
				const c = new f.ResponseCookies(new Headers());
				for (const b of a.getAll()) c.set(b);
				let d = [],
					e = new Set(),
					i = () => {
						const a = h.workAsyncStorage.getStore();
						if (
							(a && (a.pathWasRevalidated = !0),
							(d = c.getAll().filter((a) => e.has(a.name))),
							b)
						) {
							const a = [];
							for (const b of d) {
								const c = new f.ResponseCookies(new Headers());
								c.set(b), a.push(c.toString());
							}
							b(a);
						}
					},
					j = new Proxy(c, {
						get(a, b, c) {
							switch (b) {
								case k:
									return d;
								case "delete":
									return (...b) => {
										e.add("string" == typeof b[0] ? b[0] : b[0].name);
										try {
											return a.delete(...b), j;
										} finally {
											i();
										}
									};
								case "set":
									return (...b) => {
										e.add("string" == typeof b[0] ? b[0] : b[0].name);
										try {
											return a.set(...b), j;
										} finally {
											i();
										}
									};
								default:
									return g.ReflectAdapter.get(a, b, c);
							}
						},
					});
				return j;
			}
		}
		function o(a) {
			const b = new Proxy(a.mutableCookies, {
				get(c, d, e) {
					switch (d) {
						case "delete":
							return (...d) => (q(a, "cookies().delete"), c.delete(...d), b);
						case "set":
							return (...d) => (q(a, "cookies().set"), c.set(...d), b);
						default:
							return g.ReflectAdapter.get(c, d, e);
					}
				},
			});
			return b;
		}
		function p(a) {
			return "action" === a.phase;
		}
		function q(a, b) {
			if (!p(a)) throw new i();
		}
		function r(a) {
			const b = new f.RequestCookies(new Headers());
			for (const c of a.getAll()) b.set(c);
			return b;
		}
	},
	75255,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 }),
			Object.defineProperty(c, "createDedupedByCallsiteServerErrorLoggerDev", {
				enumerable: !0,
				get: () => i,
			});
		const d = ((a, b) => {
			if (a && a.__esModule) return a;
			if (null === a || ("object" != typeof a && "function" != typeof a))
				return { default: a };
			var c = e(void 0);
			if (c && c.has(a)) return c.get(a);
			var d = { __proto__: null },
				f = Object.defineProperty && Object.getOwnPropertyDescriptor;
			for (var g in a)
				if ("default" !== g && Object.hasOwn(a, g)) {
					var h = f ? Object.getOwnPropertyDescriptor(a, g) : null;
					h && (h.get || h.set)
						? Object.defineProperty(d, g, h)
						: (d[g] = a[g]);
				}
			return (d.default = a), c && c.set(a, d), d;
		})(a.r(26358));
		function e(a) {
			if ("function" != typeof WeakMap) return null;
			var b = new WeakMap(),
				c = new WeakMap();
			return (e = (a) => (a ? c : b))(a);
		}
		const f = { current: null },
			g = "function" == typeof d.cache ? d.cache : (a) => a,
			h = console.warn;
		function i(a) {
			return (...b) => {
				h(a(...b));
			};
		}
		g((a) => {
			try {
				h(f.current);
			} finally {
				f.current = null;
			}
		});
	},
	44324,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 });
		var d = {
			isRequestAPICallableInsideAfter: () => j,
			throwForSearchParamsAccessInUseCache: () => i,
			throwWithStaticGenerationBailoutErrorWithDynamicError: () => h,
		};
		for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
		const f = a.r(94592),
			g = a.r(24725);
		function h(a, b) {
			throw Object.defineProperty(
				new f.StaticGenBailoutError(
					`Route ${a} with \`dynamic = "error"\` couldn't be rendered statically because it used ${b}. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
				),
				"__NEXT_ERROR_CODE",
				{ value: "E543", enumerable: !1, configurable: !0 },
			);
		}
		function i(a, b) {
			const c = Object.defineProperty(
				Error(
					`Route ${a.route} used \`searchParams\` inside "use cache". Accessing dynamic request data inside a cache scope is not supported. If you need some search params inside a cached function await \`searchParams\` outside of the cached function and pass only the required search params as arguments to the cached function. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
				),
				"__NEXT_ERROR_CODE",
				{ value: "E842", enumerable: !1, configurable: !0 },
			);
			throw (
				(Error.captureStackTrace(c, b), (a.invalidDynamicUsageError ??= c), c)
			);
		}
		function j() {
			const a = g.afterTaskAsyncStorage.getStore();
			return (null == a ? void 0 : a.rootTaskSpawnPhase) === "action";
		}
	},
	85113,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 }),
			Object.defineProperty(c, "cookies", { enumerable: !0, get: () => n });
		const d = a.r(67060),
			e = a.r(98203),
			f = a.r(56704),
			g = a.r(32319),
			h = a.r(28005),
			i = a.r(94592),
			j = a.r(78716),
			k = a.r(75255),
			l = a.r(44324),
			m = a.r(91456);
		function n() {
			const a = "cookies",
				b = f.workAsyncStorage.getStore(),
				c = g.workUnitAsyncStorage.getStore();
			if (b) {
				if (
					c &&
					"after" === c.phase &&
					!(0, l.isRequestAPICallableInsideAfter)()
				)
					throw Object.defineProperty(
						Error(
							`Route ${b.route} used \`cookies()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`,
						),
						"__NEXT_ERROR_CODE",
						{ value: "E843", enumerable: !1, configurable: !0 },
					);
				if (b.forceStatic)
					return p(
						d.RequestCookiesAdapter.seal(new e.RequestCookies(new Headers({}))),
					);
				if (b.dynamicShouldError)
					throw Object.defineProperty(
						new i.StaticGenBailoutError(
							`Route ${b.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
						),
						"__NEXT_ERROR_CODE",
						{ value: "E849", enumerable: !1, configurable: !0 },
					);
				if (c)
					switch (c.type) {
						case "cache": {
							const f = Object.defineProperty(
								Error(
									`Route ${b.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E831", enumerable: !1, configurable: !0 },
							);
							throw (
								(Error.captureStackTrace(f, n),
								(b.invalidDynamicUsageError ??= f),
								f)
							);
						}
						case "unstable-cache":
							throw Object.defineProperty(
								Error(
									`Route ${b.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E846", enumerable: !1, configurable: !0 },
							);
						case "prerender": {
							var k = b,
								q = c;
							const g = o.get(q);
							if (g) return g;
							const r = (0, j.makeHangingPromise)(
								q.renderSignal,
								k.route,
								"`cookies()`",
							);
							return o.set(q, r), r;
						}
						case "prerender-client": {
							const s = "`cookies`";
							throw Object.defineProperty(
								new m.InvariantError(
									`${s} must not be used within a Client Component. Next.js should be preventing ${s} from being included in Client Components statically, but did not in this case.`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E832", enumerable: !1, configurable: !0 },
							);
						}
						case "prerender-ppr":
							return (0, h.postponeWithTracking)(b.route, a, c.dynamicTracking);
						case "prerender-legacy":
							return (0, h.throwToInterruptStaticGeneration)(a, b, c);
						case "prerender-runtime":
							return (0, h.delayUntilRuntimeStage)(c, p(c.cookies));
						case "private-cache":
							return p(c.cookies);
						case "request":
							return (
								(0, h.trackDynamicDataInDynamicRender)(c),
								p(
									(0, d.areCookiesMutableInCurrentPhase)(c)
										? c.userspaceMutableCookies
										: c.cookies,
								)
							);
					}
			}
			(0, g.throwForMissingRequestStore)(a);
		}
		a.r(62713);
		const o = new WeakMap();
		function p(a) {
			const b = o.get(a);
			if (b) return b;
			const c = Promise.resolve(a);
			return o.set(a, c), c;
		}
		(0, k.createDedupedByCallsiteServerErrorLoggerDev)((a, b) => {
			const c = a ? `Route "${a}" ` : "This route ";
			return Object.defineProperty(
				Error(
					`${c}used ${b}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`,
				),
				"__NEXT_ERROR_CODE",
				{ value: "E830", enumerable: !1, configurable: !0 },
			);
		});
	},
	62554,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 });
		var d = { HeadersAdapter: () => h, ReadonlyHeadersError: () => g };
		for (var e in d) Object.defineProperty(c, e, { enumerable: !0, get: d[e] });
		const f = a.r(31880);
		class g extends Error {
			constructor() {
				super(
					"Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers",
				);
			}
			static callable() {
				throw new g();
			}
		}
		class h extends Headers {
			constructor(a) {
				super(),
					(this.headers = new Proxy(a, {
						get(b, c, d) {
							if ("symbol" == typeof c) return f.ReflectAdapter.get(b, c, d);
							const e = c.toLowerCase(),
								g = Object.keys(a).find((a) => a.toLowerCase() === e);
							if (void 0 !== g) return f.ReflectAdapter.get(b, g, d);
						},
						set(b, c, d, e) {
							if ("symbol" == typeof c) return f.ReflectAdapter.set(b, c, d, e);
							const g = c.toLowerCase(),
								h = Object.keys(a).find((a) => a.toLowerCase() === g);
							return f.ReflectAdapter.set(b, h ?? c, d, e);
						},
						has(b, c) {
							if ("symbol" == typeof c) return f.ReflectAdapter.has(b, c);
							const d = c.toLowerCase(),
								e = Object.keys(a).find((a) => a.toLowerCase() === d);
							return void 0 !== e && f.ReflectAdapter.has(b, e);
						},
						deleteProperty(b, c) {
							if ("symbol" == typeof c)
								return f.ReflectAdapter.deleteProperty(b, c);
							const d = c.toLowerCase(),
								e = Object.keys(a).find((a) => a.toLowerCase() === d);
							return void 0 === e || f.ReflectAdapter.deleteProperty(b, e);
						},
					}));
			}
			static seal(a) {
				return new Proxy(a, {
					get(a, b, c) {
						switch (b) {
							case "append":
							case "delete":
							case "set":
								return g.callable;
							default:
								return f.ReflectAdapter.get(a, b, c);
						}
					},
				});
			}
			merge(a) {
				return Array.isArray(a) ? a.join(", ") : a;
			}
			static from(a) {
				return a instanceof Headers ? a : new h(a);
			}
			append(a, b) {
				const c = this.headers[a];
				"string" == typeof c
					? (this.headers[a] = [c, b])
					: Array.isArray(c)
						? c.push(b)
						: (this.headers[a] = b);
			}
			delete(a) {
				delete this.headers[a];
			}
			get(a) {
				const b = this.headers[a];
				return void 0 !== b ? this.merge(b) : null;
			}
			has(a) {
				return void 0 !== this.headers[a];
			}
			set(a, b) {
				this.headers[a] = b;
			}
			forEach(a, b) {
				for (const [c, d] of this.entries()) a.call(b, d, c, this);
			}
			*entries() {
				for (const a of Object.keys(this.headers)) {
					const b = a.toLowerCase(),
						c = this.get(b);
					yield [b, c];
				}
			}
			*keys() {
				for (const a of Object.keys(this.headers)) {
					const b = a.toLowerCase();
					yield b;
				}
			}
			*values() {
				for (const a of Object.keys(this.headers)) {
					const b = this.get(a);
					yield b;
				}
			}
			[Symbol.iterator]() {
				return this.entries();
			}
		}
	},
	12444,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 }),
			Object.defineProperty(c, "headers", { enumerable: !0, get: () => m });
		const d = a.r(62554),
			e = a.r(56704),
			f = a.r(32319),
			g = a.r(28005),
			h = a.r(94592),
			i = a.r(78716),
			j = a.r(75255),
			k = a.r(44324),
			l = a.r(91456);
		function m() {
			const a = "headers",
				b = e.workAsyncStorage.getStore(),
				c = f.workUnitAsyncStorage.getStore();
			if (b) {
				if (
					c &&
					"after" === c.phase &&
					!(0, k.isRequestAPICallableInsideAfter)()
				)
					throw Object.defineProperty(
						Error(
							`Route ${b.route} used \`headers()\` inside \`after()\`. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/canary/app/api-reference/functions/after`,
						),
						"__NEXT_ERROR_CODE",
						{ value: "E839", enumerable: !1, configurable: !0 },
					);
				if (b.forceStatic) return o(d.HeadersAdapter.seal(new Headers({})));
				if (c)
					switch (c.type) {
						case "cache": {
							const a = Object.defineProperty(
								Error(
									`Route ${b.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E833", enumerable: !1, configurable: !0 },
							);
							throw (
								(Error.captureStackTrace(a, m),
								(b.invalidDynamicUsageError ??= a),
								a)
							);
						}
						case "unstable-cache":
							throw Object.defineProperty(
								Error(
									`Route ${b.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E838", enumerable: !1, configurable: !0 },
							);
					}
				if (b.dynamicShouldError)
					throw Object.defineProperty(
						new h.StaticGenBailoutError(
							`Route ${b.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
						),
						"__NEXT_ERROR_CODE",
						{ value: "E828", enumerable: !1, configurable: !0 },
					);
				if (c)
					switch (c.type) {
						case "prerender": {
							var j = b,
								p = c;
							const e = n.get(p);
							if (e) return e;
							const f = (0, i.makeHangingPromise)(
								p.renderSignal,
								j.route,
								"`headers()`",
							);
							return n.set(p, f), f;
						}
						case "prerender-client": {
							const q = "`headers`";
							throw Object.defineProperty(
								new l.InvariantError(
									`${q} must not be used within a client component. Next.js should be preventing ${q} from being included in client components statically, but did not in this case.`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E693", enumerable: !1, configurable: !0 },
							);
						}
						case "prerender-ppr":
							return (0, g.postponeWithTracking)(b.route, a, c.dynamicTracking);
						case "prerender-legacy":
							return (0, g.throwToInterruptStaticGeneration)(a, b, c);
						case "prerender-runtime":
							return (0, g.delayUntilRuntimeStage)(c, o(c.headers));
						case "private-cache":
							return o(c.headers);
						case "request":
							return (0, g.trackDynamicDataInDynamicRender)(c), o(c.headers);
					}
			}
			(0, f.throwForMissingRequestStore)(a);
		}
		a.r(62713);
		const n = new WeakMap();
		function o(a) {
			const b = n.get(a);
			if (b) return b;
			const c = Promise.resolve(a);
			return n.set(a, c), c;
		}
		(0, j.createDedupedByCallsiteServerErrorLoggerDev)((a, b) => {
			const c = a ? `Route "${a}" ` : "This route ";
			return Object.defineProperty(
				Error(
					`${c}used ${b}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`,
				),
				"__NEXT_ERROR_CODE",
				{ value: "E836", enumerable: !1, configurable: !0 },
			);
		});
	},
	647,
	(a, b, c) => {
		"use strict";
		Object.defineProperty(c, "__esModule", { value: !0 }),
			Object.defineProperty(c, "draftMode", { enumerable: !0, get: () => k });
		const d = a.r(32319),
			e = a.r(56704),
			f = a.r(28005),
			g = a.r(75255),
			h = a.r(94592),
			i = a.r(27543),
			j = a.r(91456);
		function k() {
			const a = e.workAsyncStorage.getStore(),
				b = d.workUnitAsyncStorage.getStore();
			switch (
				((!a || !b) && (0, d.throwForMissingRequestStore)("draftMode"), b.type)
			) {
				case "prerender-runtime":
					return (0, f.delayUntilRuntimeStage)(b, l(b.draftMode, a));
				case "request":
					return l(b.draftMode, a);
				case "cache":
				case "private-cache":
				case "unstable-cache": {
					const c = (0, d.getDraftModeProviderForCacheScope)(a, b);
					if (c) return l(c, a);
				}
				case "prerender":
				case "prerender-client":
				case "prerender-ppr":
				case "prerender-legacy":
					return l(null, a);
				default:
					return b;
			}
		}
		function l(a, b) {
			const c = n.get(a ?? m);
			return c || Promise.resolve(new o(a));
		}
		a.r(31880);
		const m = {},
			n = new WeakMap();
		class o {
			constructor(a) {
				this._provider = a;
			}
			get isEnabled() {
				return null !== this._provider && this._provider.isEnabled;
			}
			enable() {
				p("draftMode().enable()", this.enable),
					null !== this._provider && this._provider.enable();
			}
			disable() {
				p("draftMode().disable()", this.disable),
					null !== this._provider && this._provider.disable();
			}
		}
		function p(a, b) {
			const c = e.workAsyncStorage.getStore(),
				g = d.workUnitAsyncStorage.getStore();
			if (c) {
				if ((null == g ? void 0 : g.phase) === "after")
					throw Object.defineProperty(
						Error(
							`Route ${c.route} used "${a}" inside \`after()\`. The enabled status of \`draftMode()\` can be read inside \`after()\` but you cannot enable or disable \`draftMode()\`. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`,
						),
						"__NEXT_ERROR_CODE",
						{ value: "E845", enumerable: !1, configurable: !0 },
					);
				if (c.dynamicShouldError)
					throw Object.defineProperty(
						new h.StaticGenBailoutError(
							`Route ${c.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${a}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`,
						),
						"__NEXT_ERROR_CODE",
						{ value: "E553", enumerable: !1, configurable: !0 },
					);
				if (g)
					switch (g.type) {
						case "cache":
						case "private-cache": {
							const d = Object.defineProperty(
								Error(
									`Route ${c.route} used "${a}" inside "use cache". The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E829", enumerable: !1, configurable: !0 },
							);
							throw (
								(Error.captureStackTrace(d, b),
								(c.invalidDynamicUsageError ??= d),
								d)
							);
						}
						case "unstable-cache":
							throw Object.defineProperty(
								Error(
									`Route ${c.route} used "${a}" inside a function cached with \`unstable_cache()\`. The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E844", enumerable: !1, configurable: !0 },
							);
						case "prerender":
						case "prerender-runtime": {
							const b = Object.defineProperty(
								Error(
									`Route ${c.route} used ${a} without first calling \`await connection()\`. See more info here: https://nextjs.org/docs/messages/next-prerender-sync-headers`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E126", enumerable: !1, configurable: !0 },
							);
							return (0, f.abortAndThrowOnSynchronousRequestDataAccess)(
								c.route,
								a,
								b,
								g,
							);
						}
						case "prerender-client": {
							const d = "`draftMode`";
							throw Object.defineProperty(
								new j.InvariantError(
									`${d} must not be used within a Client Component. Next.js should be preventing ${d} from being included in Client Components statically, but did not in this case.`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E832", enumerable: !1, configurable: !0 },
							);
						}
						case "prerender-ppr":
							return (0, f.postponeWithTracking)(c.route, a, g.dynamicTracking);
						case "prerender-legacy": {
							g.revalidate = 0;
							const e = Object.defineProperty(
								new i.DynamicServerError(
									`Route ${c.route} couldn't be rendered statically because it used \`${a}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`,
								),
								"__NEXT_ERROR_CODE",
								{ value: "E558", enumerable: !1, configurable: !0 },
							);
							throw (
								((c.dynamicUsageDescription = a),
								(c.dynamicUsageStack = e.stack),
								e)
							);
						}
						case "request":
							(0, f.trackDynamicDataInDynamicRender)(g);
					}
			}
		}
		(0, g.createDedupedByCallsiteServerErrorLoggerDev)((a, b) => {
			const c = a ? `Route "${a}" ` : "This route ";
			return Object.defineProperty(
				Error(
					`${c}used ${b}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`,
				),
				"__NEXT_ERROR_CODE",
				{ value: "E835", enumerable: !1, configurable: !0 },
			);
		});
	},
	81452,
	(a, b, c) => {
		(b.exports.cookies = a.r(85113).cookies),
			(b.exports.headers = a.r(12444).headers),
			(b.exports.draftMode = a.r(647).draftMode);
	},
];

//# sourceMappingURL=4f84d_next_bca26d93._.js.map
