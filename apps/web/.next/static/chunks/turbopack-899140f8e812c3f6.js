(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
	"object" == typeof document ? document.currentScript : void 0,
	{
		otherChunks: [
			"static/chunks/b5bb08779fd5e009.js",
			"static/chunks/9d5d77b46a9f1004.js",
			"static/chunks/7cc64d4f1440e002.js",
			"static/chunks/790cb17e457e2f99.js",
			"static/chunks/cec87072ca4f8ba7.js",
			"static/chunks/e5c1a5e34e0a618b.js",
		],
		runtimeModuleIds: [246230],
	},
]),
	(() => {
		let e;
		if (!Array.isArray(globalThis.TURBOPACK)) return;
		const t = "/_next/",
			r = new WeakMap();
		function n(e, t) {
			(this.m = e), (this.e = t);
		}
		const o = n.prototype,
			l = Object.prototype.hasOwnProperty,
			i = "undefined" != typeof Symbol && Symbol.toStringTag;
		function s(e, t, r) {
			l.call(e, t) || Object.defineProperty(e, t, r);
		}
		function u(e, t) {
			let r = e[t];
			return r || ((r = c(t)), (e[t] = r)), r;
		}
		function c(e) {
			return { exports: {}, error: void 0, id: e, namespaceObject: void 0 };
		}
		function a(e, t) {
			s(e, "__esModule", { value: !0 }), i && s(e, i, { value: "Module" });
			let r = 0;
			for (; r < t.length; ) {
				const n = t[r++],
					o = t[r++];
				if ("number" == typeof o)
					if (0 === o) s(e, n, { value: t[r++], enumerable: !0, writable: !1 });
					else throw Error(`unexpected tag: ${o}`);
				else
					"function" == typeof t[r]
						? s(e, n, { get: o, set: t[r++], enumerable: !0 })
						: s(e, n, { get: o, enumerable: !0 });
			}
			Object.seal(e);
		}
		(o.s = function (e, t) {
			let r, n;
			null != t
				? (n = (r = u(this.c, t)).exports)
				: ((r = this.m), (n = this.e)),
				(r.namespaceObject = n),
				a(n, e);
		}),
			(o.j = function (e, t) {
				var n, o;
				let i, s, c;
				null != t
					? (s = (i = u(this.c, t)).exports)
					: ((i = this.m), (s = this.e));
				const a =
					((n = i),
					(o = s),
					(c = r.get(n)) ||
						(r.set(n, (c = [])),
						(n.exports = n.namespaceObject =
							new Proxy(o, {
								get(e, t) {
									if (l.call(e, t) || "default" === t || "__esModule" === t)
										return Reflect.get(e, t);
									for (const e of c) {
										const r = Reflect.get(e, t);
										if (void 0 !== r) return r;
									}
								},
								ownKeys(e) {
									const t = Reflect.ownKeys(e);
									for (const e of c)
										for (const r of Reflect.ownKeys(e))
											"default" === r || t.includes(r) || t.push(r);
									return t;
								},
							}))),
					c);
				"object" == typeof e && null !== e && a.push(e);
			}),
			(o.v = function (e, t) {
				(null != t ? u(this.c, t) : this.m).exports = e;
			}),
			(o.n = function (e, t) {
				let r;
				(r = null != t ? u(this.c, t) : this.m).exports = r.namespaceObject = e;
			});
		const f = Object.getPrototypeOf
				? (e) => Object.getPrototypeOf(e)
				: (e) => e.__proto__,
			p = [null, f({}), f([]), f(f)];
		function h(e, t, r) {
			let n = [],
				o = -1;
			for (
				let t = e;
				("object" == typeof t || "function" == typeof t) && !p.includes(t);
				t = f(t)
			)
				for (const r of Object.getOwnPropertyNames(t))
					n.push(
						r,
						(
							(e, t) => () =>
								e[t]
						)(e, r),
					),
						-1 === o && "default" === r && (o = n.length - 1);
			return (
				(r && o >= 0) ||
					(o >= 0 ? n.splice(o, 1, 0, e) : n.push("default", 0, e)),
				a(t, n),
				t
			);
		}
		function d(e) {
			const t = N(e, this.m);
			if (t.namespaceObject) return t.namespaceObject;
			const r = t.exports;
			return (t.namespaceObject = h(
				r,
				"function" == typeof r
					? function (...e) {
							return r.apply(this, e);
						}
					: Object.create(null),
				r && r.__esModule,
			));
		}
		function m() {
			let e, t;
			return {
				promise: new Promise((r, n) => {
					(t = n), (e = r);
				}),
				resolve: e,
				reject: t,
			};
		}
		(o.i = d),
			(o.A = function (e) {
				return this.r(e)(d.bind(this));
			}),
			(o.t =
				"function" == typeof require
					? require
					: () => {
							throw Error("Unexpected use of runtime require");
						}),
			(o.r = function (e) {
				return N(e, this.m).exports;
			}),
			(o.f = (e) => {
				function t(t) {
					if (l.call(e, t)) return e[t].module();
					const r = Error(`Cannot find module '${t}'`);
					throw ((r.code = "MODULE_NOT_FOUND"), r);
				}
				return (
					(t.keys = () => Object.keys(e)),
					(t.resolve = (t) => {
						if (l.call(e, t)) return e[t].id();
						const r = Error(`Cannot find module '${t}'`);
						throw ((r.code = "MODULE_NOT_FOUND"), r);
					}),
					(t.import = async (e) => await t(e)),
					t
				);
			});
		const b = Symbol("turbopack queues"),
			y = Symbol("turbopack exports"),
			O = Symbol("turbopack error");
		function g(e) {
			e &&
				1 !== e.status &&
				((e.status = 1),
				e.forEach((e) => e.queueCount--),
				e.forEach((e) => (e.queueCount-- ? e.queueCount++ : e())));
		}
		o.a = function (e, t) {
			const r = this.m,
				n = t ? Object.assign([], { status: -1 }) : void 0,
				o = new Set(),
				{ resolve: l, reject: i, promise: s } = m(),
				u = Object.assign(s, {
					[y]: r.exports,
					[b]: (e) => {
						n && e(n), o.forEach(e), u.catch(() => {});
					},
				}),
				c = {
					get: () => u,
					set(e) {
						e !== u && (u[y] = e);
					},
				};
			Object.defineProperty(r, "exports", c),
				Object.defineProperty(r, "namespaceObject", c),
				e(
					(e) => {
						const t = e.map((e) => {
								if (null !== e && "object" == typeof e) {
									if (b in e) return e;
									if (
										null != e &&
										"object" == typeof e &&
										"then" in e &&
										"function" == typeof e.then
									) {
										const t = Object.assign([], { status: 0 }),
											r = { [y]: {}, [b]: (e) => e(t) };
										return (
											e.then(
												(e) => {
													(r[y] = e), g(t);
												},
												(e) => {
													(r[O] = e), g(t);
												},
											),
											r
										);
									}
								}
								return { [y]: e, [b]: () => {} };
							}),
							r = () =>
								t.map((e) => {
									if (e[O]) throw e[O];
									return e[y];
								}),
							{ promise: l, resolve: i } = m(),
							s = Object.assign(() => i(r), { queueCount: 0 });
						function u(e) {
							e !== n &&
								!o.has(e) &&
								(o.add(e), e && 0 === e.status && (s.queueCount++, e.push(s)));
						}
						return t.map((e) => e[b](u)), s.queueCount ? l : r();
					},
					(e) => {
						e ? i((u[O] = e)) : l(u[y]), g(n);
					},
				),
				n && -1 === n.status && (n.status = 0);
		};
		const w = function (e) {
			const t = new URL(e, "x:/"),
				r = {};
			for (const e in t) r[e] = t[e];
			for (const t in ((r.href = e),
			(r.pathname = e.replace(/[?#].*/, "")),
			(r.origin = r.protocol = ""),
			(r.toString = r.toJSON = (...t) => e),
			r))
				Object.defineProperty(this, t, {
					enumerable: !0,
					configurable: !0,
					value: r[t],
				});
		};
		function j(e, t) {
			throw Error(`Invariant: ${t(e)}`);
		}
		(w.prototype = URL.prototype),
			(o.U = w),
			(o.z = (e) => {
				throw Error("dynamic usage of require is not supported");
			}),
			(o.g = globalThis);
		const R = n.prototype;
		var C,
			U =
				(((C = U || {})[(C.Runtime = 0)] = "Runtime"),
				(C[(C.Parent = 1)] = "Parent"),
				(C[(C.Update = 2)] = "Update"),
				C);
		const k = new Map();
		o.M = k;
		const v = new Map(),
			_ = new Map();
		async function P(e, t, r) {
			let n;
			if ("string" == typeof r) return A(e, t, S(r));
			const o = r.included || [],
				l = o.map((e) => !!k.has(e) || v.get(e));
			if (l.length > 0 && l.every((e) => e)) return void (await Promise.all(l));
			const i = r.moduleChunks || [],
				s = i.map((e) => _.get(e)).filter((e) => e);
			if (s.length > 0) {
				if (s.length === i.length) return void (await Promise.all(s));
				const r = new Set();
				for (const e of i) _.has(e) || r.add(e);
				for (const n of r) {
					const r = A(e, t, S(n));
					_.set(n, r), s.push(r);
				}
				n = Promise.all(s);
			} else {
				for (const o of ((n = A(e, t, S(r.path))), i)) _.has(o) || _.set(o, n);
			}
			for (const e of o) v.has(e) || v.set(e, n);
			await n;
		}
		R.l = function (e) {
			return P(1, this.m.id, e);
		};
		const $ = Promise.resolve(void 0),
			T = new WeakMap();
		function A(t, r, n) {
			let o = e.loadChunkCached(t, n),
				l = T.get(o);
			if (void 0 === l) {
				const e = T.set.bind(T, o, $);
				(l = o.then(e).catch((e) => {
					let o;
					switch (t) {
						case 0:
							o = `as a runtime dependency of chunk ${r}`;
							break;
						case 1:
							o = `from module ${r}`;
							break;
						case 2:
							o = "from an HMR update";
							break;
						default:
							j(t, (e) => `Unknown source type: ${e}`);
					}
					throw Error(
						`Failed to load chunk ${n} ${o}${e ? `: ${e}` : ""}`,
						e ? { cause: e } : void 0,
					);
				})),
					T.set(o, l);
			}
			return l;
		}
		function S(e) {
			return `${t}${e
				.split("/")
				.map((e) => encodeURIComponent(e))
				.join("/")}`;
		}
		(R.L = function (e) {
			return A(1, this.m.id, e);
		}),
			(R.R = function (e) {
				const t = this.r(e);
				return t?.default ?? t;
			}),
			(R.P = (e) => `/ROOT/${e ?? ""}`),
			(R.b = (e) => {
				const t = new Blob(
					[
						`self.TURBOPACK_WORKER_LOCATION = ${JSON.stringify(location.origin)};
self.TURBOPACK_NEXT_CHUNK_URLS = ${JSON.stringify(e.reverse().map(S), null, 2)};
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());`,
					],
					{ type: "text/javascript" },
				);
				return URL.createObjectURL(t);
			});
		const E = /\.js(?:\?[^#]*)?(?:#.*)?$/,
			K = /\.css(?:\?[^#]*)?(?:#.*)?$/;
		function x(e) {
			return K.test(e);
		}
		(o.w = function (t, r, n) {
			return e.loadWebAssembly(1, this.m.id, t, r, n);
		}),
			(o.u = function (t, r) {
				return e.loadWebAssemblyModule(1, this.m.id, t, r);
			});
		const M = {};
		o.c = M;
		const N = (e, t) => {
			const r = M[e];
			if (r) {
				if (r.error) throw r.error;
				return r;
			}
			return L(e, U.Parent, t.id);
		};
		function L(e, t, r) {
			const o = k.get(e);
			if ("function" != typeof o)
				throw Error(
					((e, t, r) => {
						let n;
						switch (t) {
							case 0:
								n = `as a runtime entry of chunk ${r}`;
								break;
							case 1:
								n = `because it was required from module ${r}`;
								break;
							case 2:
								n = "because of an HMR update";
								break;
							default:
								j(t, (e) => `Unknown source type: ${e}`);
						}
						return `Module ${e} was instantiated ${n}, but the module factory is not available.`;
					})(e, t, r),
				);
			const l = c(e),
				i = l.exports;
			M[e] = l;
			const s = new n(l, i);
			try {
				o(s, l, i);
			} catch (e) {
				throw ((l.error = e), e);
			}
			return (
				l.namespaceObject &&
					l.exports !== l.namespaceObject &&
					h(l.exports, l.namespaceObject),
				l
			);
		}
		function q(r) {
			let n,
				o = ((e) => {
					if ("string" == typeof e) return e;
					const r = decodeURIComponent(
						("undefined" != typeof TURBOPACK_NEXT_CHUNK_URLS
							? TURBOPACK_NEXT_CHUNK_URLS.pop()
							: e.getAttribute("src")
						).replace(/[?#].*$/, ""),
					);
					return r.startsWith(t) ? r.slice(t.length) : r;
				})(r[0]);
			return (
				2 === r.length
					? (n = r[1])
					: ((n = void 0),
						!((e, t, r, n) => {
							let o = 1;
							for (; o < e.length; ) {
								let t = e[o],
									n = o + 1;
								for (; n < e.length && "function" != typeof e[n]; ) n++;
								if (n === e.length)
									throw Error(
										"malformed chunk format, expected a factory function",
									);
								if (!r.has(t)) {
									const l = e[n];
									for (
										Object.defineProperty(l, "name", {
											value: "module evaluation",
										});
										o < n;
										o++
									)
										(t = e[o]), r.set(t, l);
								}
								o = n + 1;
							}
						})(r, 0, k)),
				e.registerChunk(o, n)
			);
		}
		const B = new Map();
		function W(e) {
			let t = B.get(e);
			if (!t) {
				let r, n;
				(t = {
					resolved: !1,
					loadingStarted: !1,
					promise: new Promise((e, t) => {
						(r = e), (n = t);
					}),
					resolve: () => {
						(t.resolved = !0), r();
					},
					reject: n,
				}),
					B.set(e, t);
			}
			return t;
		}
		e = {
			async registerChunk(e, t) {
				if ((W(S(e)).resolve(), null != t)) {
					for (const e of t.otherChunks)
						W(S("string" == typeof e ? e : e.path));
					if (
						(await Promise.all(t.otherChunks.map((t) => P(0, e, t))),
						t.runtimeModuleIds.length > 0)
					)
						for (const r of t.runtimeModuleIds)
							!((e, t) => {
								const r = M[t];
								if (r) {
									if (r.error) throw r.error;
									return;
								}
								L(t, U.Runtime, e);
							})(e, r);
				}
			},
			loadChunkCached: (e, t) =>
				((e, t) => {
					const r = W(t);
					if (r.loadingStarted) return r.promise;
					if (e === U.Runtime)
						return (r.loadingStarted = !0), x(t) && r.resolve(), r.promise;
					if ("function" == typeof importScripts)
						if (x(t));
						else if (E.test(t))
							self.TURBOPACK_NEXT_CHUNK_URLS.push(t),
								importScripts(TURBOPACK_WORKER_LOCATION + t);
						else
							throw Error(`can't infer type of chunk from URL ${t} in worker`);
					else {
						const e = decodeURI(t);
						if (x(t))
							if (
								document.querySelectorAll(
									`link[rel=stylesheet][href="${t}"],link[rel=stylesheet][href^="${t}?"],link[rel=stylesheet][href="${e}"],link[rel=stylesheet][href^="${e}?"]`,
								).length > 0
							)
								r.resolve();
							else {
								const e = document.createElement("link");
								(e.rel = "stylesheet"),
									(e.href = t),
									(e.onerror = () => {
										r.reject();
									}),
									(e.onload = () => {
										r.resolve();
									}),
									document.head.appendChild(e);
							}
						else if (E.test(t)) {
							const n = document.querySelectorAll(
								`script[src="${t}"],script[src^="${t}?"],script[src="${e}"],script[src^="${e}?"]`,
							);
							if (n.length > 0)
								for (const e of Array.from(n))
									e.addEventListener("error", () => {
										r.reject();
									});
							else {
								const e = document.createElement("script");
								(e.src = t),
									(e.onerror = () => {
										r.reject();
									}),
									document.head.appendChild(e);
							}
						} else throw Error(`can't infer type of chunk from URL ${t}`);
					}
					return (r.loadingStarted = !0), r.promise;
				})(e, t),
			async loadWebAssembly(e, t, r, n, o) {
				const l = fetch(S(r)),
					{ instance: i } = await WebAssembly.instantiateStreaming(l, o);
				return i.exports;
			},
			async loadWebAssemblyModule(e, t, r, n) {
				const o = fetch(S(r));
				return await WebAssembly.compileStreaming(o);
			},
		};
		const I = globalThis.TURBOPACK;
		(globalThis.TURBOPACK = { push: q }), I.forEach(q);
	})();
