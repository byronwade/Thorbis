(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/.pnpm/@telnyx+webrtc@2.25.2/node_modules/@telnyx/webrtc/lib/bundle.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Call",
    ()=>ct,
    "PreCallDiagnosis",
    ()=>vt,
    "SwEvent",
    ()=>u,
    "TelnyxRTC",
    ()=>ft
]);
function e(e, t) {
    var n = {};
    for(var i in e)Object.prototype.hasOwnProperty.call(e, i) && t.indexOf(i) < 0 && (n[i] = e[i]);
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
        var s = 0;
        for(i = Object.getOwnPropertySymbols(e); s < i.length; s++)t.indexOf(i[s]) < 0 && Object.prototype.propertyIsEnumerable.call(e, i[s]) && (n[i[s]] = e[i[s]]);
    }
    return n;
}
function t(e, t, n, i) {
    return new (n || (n = Promise))(function(s, o) {
        function r(e) {
            try {
                c(i.next(e));
            } catch (e) {
                o(e);
            }
        }
        function a(e) {
            try {
                c(i.throw(e));
            } catch (e) {
                o(e);
            }
        }
        function c(e) {
            var t;
            e.done ? s(e.value) : (t = e.value, t instanceof n ? t : new n(function(e) {
                e(t);
            })).then(r, a);
        }
        c((i = i.apply(e, t || [])).next());
    });
}
"function" == typeof SuppressedError && SuppressedError;
var n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto), i = new Uint8Array(16);
function s() {
    if (!n) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    return n(i);
}
for(var o = [], r = 0; r < 256; ++r)o[r] = (r + 256).toString(16).substr(1);
function a(e, t, n) {
    var i = t && n || 0;
    "string" == typeof e && (t = "binary" === e ? new Array(16) : null, e = null);
    var r = (e = e || {}).random || (e.rng || s)();
    if (r[6] = 15 & r[6] | 64, r[8] = 63 & r[8] | 128, t) for(var a = 0; a < 16; ++a)t[i + a] = r[a];
    return t || function(e, t) {
        var n = t || 0, i = o;
        return [
            i[e[n++]],
            i[e[n++]],
            i[e[n++]],
            i[e[n++]],
            "-",
            i[e[n++]],
            i[e[n++]],
            "-",
            i[e[n++]],
            i[e[n++]],
            "-",
            i[e[n++]],
            i[e[n++]],
            "-",
            i[e[n++]],
            i[e[n++]],
            i[e[n++]],
            i[e[n++]],
            i[e[n++]],
            i[e[n++]]
        ].join("");
    }(r);
}
const c = "wss://rtc.telnyx.com", d = {
    urls: "stun:stun.l.google.com:19302"
}, l = {
    urls: "stun:stun.telnyx.com:3478"
}, h = {
    urls: "turn:turn.telnyx.com:3478?transport=tcp",
    username: "testuser",
    credential: "testpassword"
};
var u;
!function(e) {
    e.SocketOpen = "telnyx.socket.open", e.SocketClose = "telnyx.socket.close", e.SocketError = "telnyx.socket.error", e.SocketMessage = "telnyx.socket.message", e.SpeedTest = "telnyx.internal.speedtest", e.Ready = "telnyx.ready", e.Error = "telnyx.error", e.Notification = "telnyx.notification", e.StatsFrame = "telnyx.stats.frame", e.StatsReport = "telnyx.stats.report", e.Messages = "telnyx.messages", e.Calls = "telnyx.calls", e.MediaError = "telnyx.rtc.mediaError", e.PeerConnectionFailureError = "telnyx.rtc.peerConnectionFailureError";
}(u || (u = {}));
var p = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : ("TURBOPACK compile-time truthy", 1) ? /*TURBOPACK member replacement*/ __turbopack_context__.g : "TURBOPACK unreachable";
function g(e, t) {
    return e(t = {
        exports: {}
    }, t.exports), t.exports;
}
var f = g(function(e) {
    var t, n;
    t = p, n = function() {
        var e = function() {}, t = "undefined", n = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), i = [
            "trace",
            "debug",
            "info",
            "warn",
            "error"
        ];
        function s(e, t) {
            var n = e[t];
            if ("function" == typeof n.bind) return n.bind(e);
            try {
                return Function.prototype.bind.call(n, e);
            } catch (t) {
                return function() {
                    return Function.prototype.apply.apply(n, [
                        e,
                        arguments
                    ]);
                };
            }
        }
        function o() {
            console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [
                console,
                arguments
            ])), console.trace && console.trace();
        }
        function r(t, n) {
            for(var s = 0; s < i.length; s++){
                var o = i[s];
                this[o] = s < t ? e : this.methodFactory(o, t, n);
            }
            this.log = this.debug;
        }
        function a(e, n, i) {
            return function() {
                typeof console !== t && (r.call(this, n, i), this[e].apply(this, arguments));
            };
        }
        function c(i, r, c) {
            return function(i) {
                return "debug" === i && (i = "log"), typeof console !== t && ("trace" === i && n ? o : void 0 !== console[i] ? s(console, i) : void 0 !== console.log ? s(console, "log") : e);
            }(i) || a.apply(this, arguments);
        }
        function d(e, n, s) {
            var o, a = this;
            n = null == n ? "WARN" : n;
            var d = "loglevel";
            function l() {
                var e;
                if (typeof window !== t && d) {
                    try {
                        e = window.localStorage[d];
                    } catch (e) {}
                    if (typeof e === t) try {
                        var n = window.document.cookie, i = n.indexOf(encodeURIComponent(d) + "=");
                        -1 !== i && (e = /^([^;]+)/.exec(n.slice(i))[1]);
                    } catch (e) {}
                    return void 0 === a.levels[e] && (e = void 0), e;
                }
            }
            "string" == typeof e ? d += ":" + e : "symbol" == typeof e && (d = void 0), a.name = e, a.levels = {
                TRACE: 0,
                DEBUG: 1,
                INFO: 2,
                WARN: 3,
                ERROR: 4,
                SILENT: 5
            }, a.methodFactory = s || c, a.getLevel = function() {
                return o;
            }, a.setLevel = function(n, s) {
                if ("string" == typeof n && void 0 !== a.levels[n.toUpperCase()] && (n = a.levels[n.toUpperCase()]), !("number" == typeof n && n >= 0 && n <= a.levels.SILENT)) throw "log.setLevel() called with invalid level: " + n;
                if (o = n, !1 !== s && function(e) {
                    var n = (i[e] || "silent").toUpperCase();
                    if (typeof window !== t && d) {
                        try {
                            return void (window.localStorage[d] = n);
                        } catch (e) {}
                        try {
                            window.document.cookie = encodeURIComponent(d) + "=" + n + ";";
                        } catch (e) {}
                    }
                }(n), r.call(a, n, e), typeof console === t && n < a.levels.SILENT) return "No console available for logging";
            }, a.setDefaultLevel = function(e) {
                n = e, l() || a.setLevel(e, !1);
            }, a.resetLevel = function() {
                a.setLevel(n, !1), function() {
                    if (typeof window !== t && d) {
                        try {
                            return void window.localStorage.removeItem(d);
                        } catch (e) {}
                        try {
                            window.document.cookie = encodeURIComponent(d) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
                        } catch (e) {}
                    }
                }();
            }, a.enableAll = function(e) {
                a.setLevel(a.levels.TRACE, e);
            }, a.disableAll = function(e) {
                a.setLevel(a.levels.SILENT, e);
            };
            var h = l();
            null == h && (h = n), a.setLevel(h, !1);
        }
        var l = new d, h = {};
        l.getLogger = function(e) {
            if ("symbol" != typeof e && "string" != typeof e || "" === e) throw new TypeError("You must supply a name when creating a logger.");
            var t = h[e];
            return t || (t = h[e] = new d(e, l.getLevel(), l.methodFactory)), t;
        };
        var u = typeof window !== t ? window.log : void 0;
        return l.noConflict = function() {
            return typeof window !== t && window.log === l && (window.log = u), l;
        }, l.getLoggers = function() {
            return h;
        }, l.default = l, l;
    }, e.exports ? e.exports = n() : t.log = n();
});
const v = f.getLogger("telnyx"), m = v.methodFactory;
v.methodFactory = (e, t, n)=>{
    const i = m(e, t, n);
    return function() {
        const e = [
            (new Date).toISOString().replace("T", " ").replace("Z", ""),
            "-"
        ];
        for(let t = 0; t < arguments.length; t++)e.push(arguments[t]);
        i.apply(void 0, e);
    };
}, v.setLevel(v.getLevel());
const b = (e)=>{
    const [t, n, i, s, o, r] = e;
    let a = {};
    try {
        a = JSON.parse(o.replace(/ID"/g, 'Id"'));
    } catch (e) {
        v.warn("Verto LA invalid media JSON string:", o);
    }
    return {
        participantId: Number(t),
        participantNumber: n,
        participantName: i,
        codec: s,
        media: a,
        participantData: r
    };
}, _ = (e)=>{
    if ("string" != typeof e) return e;
    try {
        return JSON.parse(e);
    } catch (t) {
        return e;
    }
}, y = (e)=>e instanceof Function || "function" == typeof e, w = (e)=>"object" == typeof document && "getElementById" in document ? "string" == typeof e ? document.getElementById(e) || null : "function" == typeof e ? e() : e instanceof HTMLMediaElement ? e : null : null, S = /^(ws|wss):\/\//, I = (e, t = null)=>{
    const { result: n = {}, error: i } = e;
    if (i) return {
        error: i
    };
    const { result: s = null } = n;
    if (null === s) return null !== t && (n.node_id = t), {
        result: n
    };
    const { code: o = null, node_id: r = null, result: a = null } = s;
    return o && "200" !== o ? {
        error: s
    } : a ? I(a, r) : {
        result: s
    };
}, C = (e, t)=>Math.floor(Math.random() * (t - e + 1) + e), k = ({ login: e, passwd: t, password: n, login_token: i })=>Boolean(e && (t || n) || i), E = ({ anonymous_login: e })=>Boolean(e) && Boolean(e.target_id) && Boolean(e.target_type), T = (e)=>{
    var t, n, i, s, o, r;
    let a = "", c = "";
    (null === (n = null === (t = null == e ? void 0 : e.result) || void 0 === t ? void 0 : t.params) || void 0 === n ? void 0 : n.state) && (a = null === (s = null === (i = null == e ? void 0 : e.result) || void 0 === i ? void 0 : i.params) || void 0 === s ? void 0 : s.state), (null === (o = null == e ? void 0 : e.params) || void 0 === o ? void 0 : o.state) && (c = null === (r = null == e ? void 0 : e.params) || void 0 === r ? void 0 : r.state);
    return a || c;
};
function R({ debounceTime: e }) {
    let t, n;
    return {
        promise: new Promise((i, s)=>{
            t = e ? x(i, e) : i, n = s;
        }),
        resolve: t,
        reject: n
    };
}
const x = (e, t)=>{
    let n;
    return (...i)=>{
        clearTimeout(n), n = window.setTimeout(()=>{
            e(...i);
        }, t);
    };
}, A = "telnyx-voice-sdk-id";
function O() {
    return sessionStorage.getItem(A);
}
var L, P, M;
"undefined" != typeof window && window.addEventListener("beforeunload", ()=>{
    sessionStorage.removeItem(A);
}), function(e) {
    e.Offer = "offer", e.Answer = "answer";
}(L || (L = {})), function(e) {
    e.Inbound = "inbound", e.Outbound = "outbound";
}(P || (P = {})), function(e) {
    e.Invite = "telnyx_rtc.invite", e.Attach = "telnyx_rtc.attach", e.Answer = "telnyx_rtc.answer", e.Info = "telnyx_rtc.info", e.Candidate = "telnyx_rtc.candidate", e.EndOfCandidates = "telnyx_rtc.endOfCandidates", e.Display = "telnyx_rtc.display", e.Media = "telnyx_rtc.media", e.Event = "telnyx_rtc.event", e.Bye = "telnyx_rtc.bye", e.Punt = "telnyx_rtc.punt", e.Broadcast = "telnyx_rtc.broadcast", e.Subscribe = "telnyx_rtc.subscribe", e.Unsubscribe = "telnyx_rtc.unsubscribe", e.ClientReady = "telnyx_rtc.clientReady", e.Modify = "telnyx_rtc.modify", e.Ringing = "telnyx_rtc.ringing", e.GatewayState = "telnyx_rtc.gatewayState", e.Ping = "telnyx_rtc.ping", e.Pong = "telnyx_rtc.pong";
}(M || (M = {}));
const N = {
    generic: "event",
    [M.Display]: "participantData",
    [M.Attach]: "participantData",
    conferenceUpdate: "conferenceUpdate",
    callUpdate: "callUpdate",
    vertoClientReady: "vertoClientReady",
    userMediaError: "userMediaError",
    peerConnectionFailureError: "peerConnectionFailureError"
}, D = {
    destinationNumber: "",
    remoteCallerName: "Outbound Call",
    remoteCallerNumber: "",
    callerName: "",
    callerNumber: "",
    audio: !0,
    useStereo: !1,
    debug: !1,
    debugOutput: "socket",
    attach: !1,
    screenShare: !1,
    userVariables: {},
    mediaSettings: {
        useSdpASBandwidthKbps: !1,
        sdpASBandwidthKbps: 0
    }
};
var U, j, $, F, G;
!function(e) {
    e[e.New = 0] = "New", e[e.Requesting = 1] = "Requesting", e[e.Trying = 2] = "Trying", e[e.Recovering = 3] = "Recovering", e[e.Ringing = 4] = "Ringing", e[e.Answering = 5] = "Answering", e[e.Early = 6] = "Early", e[e.Active = 7] = "Active", e[e.Held = 8] = "Held", e[e.Hangup = 9] = "Hangup", e[e.Destroy = 10] = "Destroy", e[e.Purge = 11] = "Purge";
}(U || (U = {})), function(e) {
    e.Participant = "participant", e.Moderator = "moderator";
}(j || (j = {})), function(e) {
    e.Join = "join", e.Leave = "leave", e.Bootstrap = "bootstrap", e.Add = "add", e.Modify = "modify", e.Delete = "delete", e.Clear = "clear", e.ChatMessage = "chatMessage", e.LayerInfo = "layerInfo", e.LogoInfo = "logoInfo", e.LayoutInfo = "layoutInfo", e.LayoutList = "layoutList", e.ModCmdResponse = "modCommandResponse";
}($ || ($ = {})), function(e) {
    e.Video = "videoinput", e.AudioIn = "audioinput", e.AudioOut = "audiooutput";
}(F || (F = {})), function(e) {
    e.REGED = "REGED", e.UNREGED = "UNREGED", e.NOREG = "NOREG", e.FAILED = "FAILED", e.FAIL_WAIT = "FAIL_WAIT", e.REGISTER = "REGISTER", e.TRYING = "TRYING", e.EXPIRED = "EXPIRED", e.UNREGISTER = "UNREGISTER";
}(G || (G = {}));
const B = "GLOBAL", V = {}, H = (e, t)=>`${e}|${t}`, q = (e, t = B)=>H(e, t) in V, W = (e, t, n = B)=>{
    const i = H(e, n);
    i in V || (V[i] = []), V[i].push(t);
}, J = (e, t, n = B)=>{
    const i = function(s) {
        K(e, i, n), t(s);
    };
    return i.prototype.targetRef = t, W(e, i, n);
}, K = (e, t, n = B)=>{
    if (!q(e, n)) return !1;
    const i = H(e, n);
    if (y(t)) {
        for(let e = V[i].length - 1; e >= 0; e--){
            const n = V[i][e];
            (t === n || n.prototype && t === n.prototype.targetRef) && V[i].splice(e, 1);
        }
    } else V[i] = [];
    return 0 === V[i].length && delete V[i], !0;
}, Q = (e, t, n = B, i = !0)=>{
    const s = i && n !== B;
    if (!q(e, n)) return s && Q(e, t), !1;
    const o = H(e, n), r = V[o].length;
    if (!r) return s && Q(e, t), !1;
    for(let e = r - 1; e >= 0; e--)V[o][e](t);
    return s && Q(e, t), !0;
}, z = (e)=>{
    const t = H(e, "");
    Object.keys(V).filter((e)=>0 === e.indexOf(t)).forEach((e)=>delete V[e]);
};
let Y = "undefined" != typeof WebSocket ? WebSocket : null;
const X = 0, Z = 1, ee = 2, te = 3;
class ne {
    constructor(e){
        this.session = e, this.previousGatewayState = "", this._wsClient = null, this._host = c, this._timers = {}, this._hasTrickleIceCanaryBeenUsed = !1, this._trickleIceCanaryEnabled = !1, this.upDur = null, this.downDur = null;
        const { host: t, env: n, region: i, trickleIce: s } = e.options;
        n && (this._host = "development" === n ? "wss://rtcdev.telnyx.com" : c), t && (this._host = ((e)=>`${S.test(e) ? "" : "wss://"}${e}`)(t)), i && (this._host = this._host.replace(/rtc(dev)?/, `${i}.rtc$1`)), s && (this._trickleIceCanaryEnabled = !0);
    }
    get connected() {
        return this._wsClient && this._wsClient.readyState === Z;
    }
    get connecting() {
        return this._wsClient && this._wsClient.readyState === X;
    }
    get closing() {
        return this._wsClient && this._wsClient.readyState === ee;
    }
    get closed() {
        return this._wsClient && this._wsClient.readyState === te;
    }
    get isAlive() {
        return this.connecting || this.connected;
    }
    get isDead() {
        return this.closing || this.closed;
    }
    connect() {
        const e = new URL(this._host);
        let t = O();
        this.session.options.rtcIp && this.session.options.rtcPort && (t = null, this._trickleIceCanaryEnabled = !1, e.searchParams.set("rtc_ip", this.session.options.rtcIp), e.searchParams.set("rtc_port", this.session.options.rtcPort.toString())), t && e.searchParams.set("voice_sdk_id", t), this._trickleIceCanaryEnabled && (e.searchParams.set("canary", "true"), t && !this._hasTrickleIceCanaryBeenUsed && (e.searchParams.delete("voice_sdk_id"), v.debug("first trickle ice canary connection. Refreshing voice_sdk_id")), this.session.options.trickleIce = !0, this._hasTrickleIceCanaryBeenUsed = !0), this._wsClient = new Y(e.toString()), this._wsClient.onopen = (e)=>Q(u.SocketOpen, e, this.session.uuid), this._wsClient.onclose = (e)=>Q(u.SocketClose, e, this.session.uuid), this._wsClient.onerror = (e)=>Q(u.SocketError, {
                error: e,
                sessionId: this.session.sessionid
            }, this.session.uuid), this._wsClient.onmessage = (e)=>{
            var t, n;
            const i = _(e.data);
            var s;
            if ("string" != typeof i) {
                if (i.voice_sdk_id && (s = i.voice_sdk_id, sessionStorage.setItem(A, s)), this._unsetTimer(i.id), v.debug("RECV: \n", JSON.stringify(i, null, 2), "\n"), G[`${null === (n = null === (t = null == i ? void 0 : i.result) || void 0 === t ? void 0 : t.params) || void 0 === n ? void 0 : n.state}`] || !Q(i.id, i)) {
                    const e = T(i);
                    Q(u.SocketMessage, i, this.session.uuid), Boolean(e) && (this.previousGatewayState = e);
                }
            } else this._handleStringResponse(i);
        };
    }
    sendRawText(e) {
        this._wsClient.send(e);
    }
    send(e) {
        const { request: t } = e, n = new Promise((e, n)=>{
            if (t.hasOwnProperty("result")) return e();
            J(t.id, (t)=>{
                const { result: i, error: s } = I(t);
                return s ? n(s) : e(i);
            });
        });
        return v.debug("SEND: \n", JSON.stringify(t, null, 2), "\n"), this._wsClient.send(JSON.stringify(t)), n;
    }
    close() {
        this._wsClient && (y(this._wsClient._beginClose) ? this._wsClient._beginClose() : this._wsClient.close()), this._wsClient = null;
    }
    _unsetTimer(e) {
        clearTimeout(this._timers[e]), delete this._timers[e];
    }
    _handleStringResponse(e) {
        if (/^#SP/.test(e)) switch(e[3]){
            case "U":
                this.upDur = parseInt(e.substring(4));
                break;
            case "D":
                this.downDur = parseInt(e.substring(4)), Q(u.SpeedTest, {
                    upDur: this.upDur,
                    downDur: this.downDur
                }, this.session.uuid);
        }
        else v.warn("Unknown message from socket", e);
    }
}
class ie {
    buildRequest(e) {
        this.request = Object.assign({
            jsonrpc: "2.0",
            id: a()
        }, e);
    }
}
const se = {
    id: "callID",
    destinationNumber: "destination_number",
    remoteCallerName: "remote_caller_id_name",
    remoteCallerNumber: "remote_caller_id_number",
    callerName: "caller_id_name",
    callerNumber: "caller_id_number",
    customHeaders: "custom_headers"
};
class oe extends ie {
    constructor(t = {}){
        if (super(), t.hasOwnProperty("dialogParams")) {
            const n = e(t.dialogParams, [
                "remoteSdp",
                "localStream",
                "remoteStream",
                "onNotification",
                "camId",
                "micId",
                "speakerId"
            ]);
            for(const e in se)e && n.hasOwnProperty(e) && (n[se[e]] = n[e], delete n[e]);
            t.dialogParams = n;
        }
        this.buildRequest({
            method: this.toString(),
            params: t
        });
    }
}
class re extends oe {
    constructor(e){
        super(), this.method = M.GatewayState;
        this.buildRequest({
            method: this.method,
            voice_sdk_id: e,
            params: {}
        });
    }
}
class ae {
    constructor(e){
        this.pendingRequestId = null, this.onSocketMessage = (e)=>t(this, void 0, void 0, function*() {
                e.id === this.pendingRequestId && this.gatewayStateTask.resolve(T(e));
            }), this.getIsRegistered = ()=>t(this, void 0, void 0, function*() {
                const e = new re(O());
                this.pendingRequestId = e.request.id, this.gatewayStateTask = R({}), this.session.execute(e);
                const t = yield this.gatewayStateTask.promise;
                return !!t && [
                    G.REGISTER,
                    G.REGED
                ].includes(t);
            }), this.session = e, this.gatewayStateTask = R({}), this.session.on("telnyx.socket.message", this.onSocketMessage);
    }
}
class ce extends oe {
    constructor(e){
        super(), this.method = M.Ping;
        this.buildRequest({
            method: this.method,
            voice_sdk_id: e,
            params: {}
        });
    }
}
class de {
    constructor(e){
        if (this.options = e, this.uuid = a(), this.sessionid = "", this.subscriptions = {}, this.signature = null, this.relayProtocol = null, this.contexts = [], this.timeoutErrorCode = -32e3, this.invalidMethodErrorCode = -32601, this.authenticationRequiredErrorCode = -32e3, this.connection = null, this._jwtAuth = !1, this._autoReconnect = !0, this._idle = !1, this._executeQueue = [], !this.validateOptions()) throw new Error("Invalid init options");
        this._onSocketOpen = this._onSocketOpen.bind(this), this.onNetworkClose = this.onNetworkClose.bind(this), this._onSocketMessage = this._onSocketMessage.bind(this), this._handleLoginError = this._handleLoginError.bind(this), this._attachListeners(), this.connection = new ne(this), this.registerAgent = new ae(this);
    }
    get __logger() {
        return v;
    }
    get connected() {
        return this.connection && this.connection.connected;
    }
    getIsRegistered() {
        return t(this, void 0, void 0, function*() {
            return this.registerAgent.getIsRegistered();
        });
    }
    get reconnectDelay() {
        return 1e3 * C(2, 6);
    }
    execute(e) {
        return this._idle ? new Promise((t)=>this._executeQueue.push({
                resolve: t,
                msg: e
            })) : this.connected ? this.connection.send(e) : new Promise((t)=>{
            this._executeQueue.push({
                resolve: t,
                msg: e
            }), this.connect();
        });
    }
    executeRaw(e) {
        this._idle ? this._executeQueue.push({
            msg: e
        }) : this.connection.sendRawText(e);
    }
    validateOptions() {
        return k(this.options) || E(this.options);
    }
    broadcast(e) {}
    disconnect() {
        return t(this, void 0, void 0, function*() {
            clearTimeout(this._reconnectTimeout), this.subscriptions = {}, this._autoReconnect = !1, this.relayProtocol = null, this._closeConnection(), yield sessionStorage.removeItem(this.signature), this._executeQueue = [], this._detachListeners();
        });
    }
    on(e, t) {
        return W(e, t, this.uuid), this;
    }
    off(e, t) {
        return K(e, t, this.uuid), this;
    }
    connect() {
        return t(this, void 0, void 0, function*() {
            this.connection || (this.connection = new ne(this)), this._attachListeners(), this.connection.isAlive || this.connection.connect();
        });
    }
    _handleLoginError(e) {
        Q(u.Error, {
            error: e,
            sessionId: this.sessionid
        }, this.uuid);
    }
    _onSocketOpen() {
        return t(this, void 0, void 0, function*() {
            this.options.keepConnectionAliveOnSocketClose && this._emptyExecuteQueues();
        });
    }
    onNetworkClose() {
        this.relayProtocol && z(this.relayProtocol);
        for(const e in this.subscriptions)z(e);
        this.subscriptions = {}, this.contexts = [], clearTimeout(this._keepAliveTimeout), this._autoReconnect && (this._reconnectTimeout = setTimeout(()=>this.connect(), this.reconnectDelay));
    }
    _onSocketMessage(e) {}
    _removeSubscription(e, t) {
        this._existsSubscription(e, t) && (t ? (delete this.subscriptions[e][t], K(e, null, t)) : (delete this.subscriptions[e], z(e)));
    }
    _addSubscription(e, t = null, n) {
        this._existsSubscription(e, n) || (this._existsSubscription(e) || (this.subscriptions[e] = {}), this.subscriptions[e][n] = {}, y(t) && W(e, t, n));
    }
    _existsSubscription(e, t) {
        return !(!this.subscriptions.hasOwnProperty(e) || !(!t || t && this.subscriptions[e].hasOwnProperty(t)));
    }
    _attachListeners() {
        this._detachListeners(), this.on(u.SocketOpen, this._onSocketOpen), this.on(u.SocketClose, this.onNetworkClose), this.on(u.SocketError, this.onNetworkClose), this.on(u.SocketMessage, this._onSocketMessage);
    }
    _detachListeners() {
        this.off(u.SocketOpen, this._onSocketOpen), this.off(u.SocketClose, this.onNetworkClose), this.off(u.SocketError, this.onNetworkClose), this.off(u.SocketMessage, this._onSocketMessage);
    }
    _emptyExecuteQueues() {
        this._executeQueue.forEach(({ resolve: e, msg: t })=>{
            "string" == typeof t ? this.executeRaw(t) : e(this.execute(t));
        });
    }
    _closeConnection() {
        this._idle = !0, clearTimeout(this._keepAliveTimeout), this.connection && this.connection.close();
    }
    _resetKeepAlive() {
        !1 === this._pong && (v.warn("No ping/pong received, forcing PING ACK to keep alive"), this.execute(new ce(O()))), clearTimeout(this._keepAliveTimeout), this._triggerKeepAliveTimeoutCheck();
    }
    _triggerKeepAliveTimeoutCheck() {
        this._pong = !1, this._keepAliveTimeout = setTimeout(()=>this._resetKeepAlive(), 35e3);
    }
    setPingReceived() {
        v.debug("Ping received"), this._pong = !0;
    }
    static on(e, t) {
        W(e, t);
    }
    static off(e) {
        K(e);
    }
    static uuid() {
        return a();
    }
    clearConnection() {
        this.connection = null;
    }
    hasAutoReconnect() {
        return this._autoReconnect;
    }
}
const le = (e)=>navigator.mediaDevices.getUserMedia(e), he = (e)=>e && e instanceof MediaStream, ue = (e, t)=>{
    const n = w(e);
    null !== n && (n.getAttribute("autoplay") || n.setAttribute("autoplay", "autoplay"), n.getAttribute("playsinline") || n.setAttribute("playsinline", "playsinline"), n.srcObject = t);
}, pe = (e, n)=>t(void 0, void 0, void 0, function*() {
        const t = w(e);
        if (null === t) return v.info("No HTMLMediaElement to attach the speakerId"), !1;
        if ("string" != typeof n) return v.info(`Invalid speaker deviceId: '${n}'`), !1;
        try {
            return yield t.setSinkId(n), !0;
        } catch (e) {
            return !1;
        }
    }), ge = (e)=>{
    e && "live" === e.readyState && e.stop();
}, fe = (e)=>{
    he(e) && e.getTracks().forEach(ge), e = null;
}, ve = (e)=>t(void 0, void 0, void 0, function*() {
        v.info("RTCService.getUserMedia", e);
        const { audio: t } = e;
        if (!t) return null;
        try {
            return yield le(e);
        } catch (e) {
            throw v.error("getUserMedia error: ", e), e;
        }
    }), me = (e = null, n = !1)=>t(void 0, void 0, void 0, function*() {
        let t = [];
        const i = yield navigator.mediaDevices.getUserMedia(((e = null)=>({
                audio: !e || e === F.AudioIn || e === F.AudioOut,
                video: !e || e === F.Video
            }))(e)).catch((e)=>(console.error(e), null));
        if (i) {
            if (fe(i), t = yield navigator.mediaDevices.enumerateDevices(), e && (t = t.filter((t)=>t.kind === e)), !0 === n) return t;
            const s = [];
            t = t.filter((e)=>{
                if (!e.groupId) return !0;
                const t = `${e.kind}-${e.groupId}`;
                return !s.includes(t) && (s.push(t), !0);
            });
        }
        return t;
    }), be = [
    [
        320,
        240
    ],
    [
        640,
        360
    ],
    [
        640,
        480
    ],
    [
        1280,
        720
    ],
    [
        1920,
        1080
    ]
], _e = (e, n, i)=>t(void 0, void 0, void 0, function*() {
        const t = yield me(i, !0);
        for(let i = 0; i < t.length; i++){
            const { deviceId: s, label: o } = t[i];
            if (e === s || n === o) return s;
        }
        return null;
    }), ye = (e)=>{
    const t = navigator.mediaDevices.getSupportedConstraints();
    Object.keys(e).map((n)=>{
        t.hasOwnProperty(n) && null !== e[n] && void 0 !== e[n] || delete e[n];
    });
}, we = (e, t)=>{
    if (!e) return !1;
    const { subscribed: n, alreadySubscribed: i } = Se(e);
    return n.includes(t) || i.includes(t);
}, Se = (e)=>{
    const t = {
        subscribed: [],
        alreadySubscribed: [],
        unauthorized: [],
        unsubscribed: [],
        notSubscribed: []
    };
    return Object.keys(t).forEach((n)=>{
        t[n] = e[`${n}Channels`] || [];
    }), t;
}, Ie = (e, t = null, n = null)=>{
    if (!he(e)) return null;
    let i = [];
    switch(t){
        case "audio":
            i = e.getAudioTracks();
            break;
        case "video":
            i = e.getVideoTracks();
            break;
        default:
            i = e.getTracks();
    }
    i.forEach((e)=>{
        switch(n){
            case "on":
            case !0:
                e.enabled = !0;
                break;
            case "off":
            case !1:
                e.enabled = !1;
                break;
            default:
                e.enabled = !e.enabled;
        }
    });
}, Ce = (e)=>{
    Ie(e, "audio", !0);
}, ke = (e)=>{
    Ie(e, "audio", !1);
}, Ee = (e)=>{
    Ie(e, "audio", null);
};
function Te() {
    try {
        const { browserInfo: e, name: t, version: n, supportAudio: i, supportVideo: s } = function() {
            if (!window || !window.navigator || !window.navigator.userAgent) throw new Error("You should use @telnyx/webrtc in a web browser such as Chrome|Firefox|Safari");
            if (navigator.userAgent.match(/chrom(e|ium)/gim) && !navigator.userAgent.match(/OPR\/[0-9]{2}/gi) && !navigator.userAgent.match(/edg/gim)) {
                const e = navigator.userAgent.match(/chrom(e|ium)\/[0-9]+\./gim)[0].split("/"), t = e[0], n = parseInt(e[1], 10);
                return {
                    browserInfo: navigator.userAgent,
                    name: t,
                    version: n,
                    supportAudio: !0,
                    supportVideo: !0
                };
            }
            if (navigator.userAgent.match(/firefox/gim) && !navigator.userAgent.match(/OPR\/[0-9]{2}/gi) && !navigator.userAgent.match(/edg/gim)) {
                const e = navigator.userAgent.match(/firefox\/[0-9]+\./gim)[0].split("/"), t = e[0], n = parseInt(e[1], 10);
                return {
                    browserInfo: navigator.userAgent,
                    name: t,
                    version: n,
                    supportAudio: !0,
                    supportVideo: !1
                };
            }
            if (navigator.userAgent.match(/safari/gim) && !navigator.userAgent.match(/OPR\/[0-9]{2}/gi) && !navigator.userAgent.match(/edg/gim)) {
                const e = navigator.userAgent.match(/safari/gim)[0], t = navigator.userAgent.match(/version\/[0-9]+\./gim)[0].split("/"), n = parseInt(t[1], 10);
                return {
                    browserInfo: navigator.userAgent,
                    name: e,
                    version: n,
                    supportAudio: !0,
                    supportVideo: !0
                };
            }
            if (navigator.userAgent.match(/edg/gim) && !navigator.userAgent.match(/OPR\/[0-9]{2}/gi)) {
                const e = navigator.userAgent.match(/edg\/[0-9]+\./gim)[0].split("/"), t = e[0], n = parseInt(e[1], 10);
                return {
                    browserInfo: navigator.userAgent,
                    name: t,
                    version: n,
                    supportAudio: !0,
                    supportVideo: !0
                };
            }
            throw new Error("This browser does not support @telnyx/webrtc. To see browser support list: `TelnyxRTC.webRTCSupportedBrowserList()`");
        }(), o = window.RTCPeerConnection, r = window.RTCSessionDescription, a = window.RTCIceCandidate, c = window.navigator && window.navigator.mediaDevices, d = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.mozGetUserMedia;
        return {
            browserInfo: e,
            browserName: t,
            browserVersion: n,
            supportWebRTC: !!(o && r && a && c && d),
            supportWebRTCAudio: i,
            supportWebRTCVideo: s,
            supportRTCPeerConnection: !!o,
            supportSessionDescription: !!r,
            supportIceCandidate: !!a,
            supportMediaDevices: !!c,
            supportGetUserMedia: !!ve
        };
    } catch (e) {
        return e.message;
    }
}
var Re;
function xe(e, t) {
    const n = document.getElementById(t);
    if (n) return n;
    if (e && t) {
        const n = document.createElement("audio");
        return n.id = t, n.loop = !0, n.src = e, n.preload = "auto", n.load(), document.body.appendChild(n), n;
    }
    return null;
}
function Ae(e) {
    e && (e._playFulfilled = !1, e._promise = e.play(), e._promise.then(()=>{
        e._playFulfilled = !0;
    }).catch((t)=>{
        console.error("playAudio", t), e._playFulfilled = !0;
    }));
}
function Oe(e) {
    e && (e._playFulfilled ? (e.pause(), e.currentTime = 0) : e._promise && e._promise.then ? e._promise.then(()=>{
        e.pause(), e.currentTime = 0;
    }) : setTimeout(()=>{
        e.pause(), e.currentTime = 0;
    }, 1e3));
}
!function(e) {
    e.not_supported = "not supported", e.full = "full", e.partial = "partial";
}(Re || (Re = {}));
var Le = "2.25.2", Pe = Le;
class Me extends oe {
    constructor(e, t, n, i, s = {}, o){
        super(), this.method = "login";
        const r = {
            login: e,
            passwd: t,
            login_token: n,
            userVariables: s,
            reconnection: o,
            loginParams: {},
            "User-Agent": {
                sdkVersion: Pe,
                data: navigator.userAgent
            }
        };
        i && (r.sessid = i), this.buildRequest({
            method: this.method,
            params: r
        });
    }
}
class Ne extends oe {
    constructor(e, t){
        super(), this.buildRequest({
            id: e,
            result: {
                method: t
            }
        });
    }
}
class De extends oe {
    toString() {
        return M.Invite;
    }
}
class Ue extends oe {
    toString() {
        return M.Answer;
    }
}
class je extends oe {
    toString() {
        return M.Attach;
    }
}
class $e extends oe {
    toString() {
        return M.Bye;
    }
}
class Fe extends oe {
    toString() {
        return M.Candidate;
    }
}
class Ge extends oe {
    toString() {
        return M.EndOfCandidates;
    }
}
class Be extends oe {
    toString() {
        return M.Modify;
    }
}
class Ve extends oe {
    toString() {
        return M.Info;
    }
}
class He extends oe {
    toString() {
        return M.Broadcast;
    }
}
class qe extends oe {
    toString() {
        return M.Subscribe;
    }
}
class We extends oe {
    toString() {
        return M.Unsubscribe;
    }
}
class Je extends ie {
    constructor(e, t){
        super(), this.method = "ai_conversation", this.buildRequest({
            method: this.method,
            params: {
                type: "conversation.item.create",
                previous_item_id: null,
                item: {
                    id: a(),
                    type: "message",
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text: e
                        },
                        ...null == t ? void 0 : t.map((e)=>({
                                type: "image_url",
                                image_url: {
                                    url: e
                                }
                            }))
                    ]
                }
            }
        });
    }
}
const Ke = (e, t)=>{
    const { contentType: n, canvasType: i, callID: s, canvasInfo: o = null, currentLayerIdx: r = -1 } = t;
    o && "mcu-personal-canvas" !== i && delete o.memberID;
    const a = {
        type: N.conferenceUpdate,
        call: e.calls[s],
        canvasInfo: Qe(o),
        currentLayerIdx: r
    };
    switch(n){
        case "layer-info":
            {
                const t = Object.assign({
                    action: $.LayerInfo
                }, a);
                Q(u.Notification, t, e.uuid);
                break;
            }
        case "layout-info":
            {
                const t = Object.assign({
                    action: $.LayoutInfo
                }, a);
                Q(u.Notification, t, e.uuid);
                break;
            }
    }
}, Qe = (e)=>{
    const t = JSON.stringify(e).replace(/memberID/g, "participantId").replace(/ID"/g, 'Id"').replace(/POS"/g, 'Pos"');
    return _(t);
};
var ze, Ye = g(function(e, t) {
    var n;
    function i() {}
    function s() {
        s.init.call(this);
    }
    function o(e) {
        return void 0 === e._maxListeners ? s.defaultMaxListeners : e._maxListeners;
    }
    function r(e, t, n, s) {
        var r, a, c;
        if ("function" != typeof n) throw new TypeError('"listener" argument must be a function');
        if ((a = e._events) ? (a.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), a = e._events), c = a[t]) : (a = e._events = new i, e._eventsCount = 0), c) {
            if ("function" == typeof c ? c = a[t] = s ? [
                n,
                c
            ] : [
                c,
                n
            ] : s ? c.unshift(n) : c.push(n), !c.warned && (r = o(e)) && 0 < r && c.length > r) {
                c.warned = !0;
                var d = new Error("Possible EventEmitter memory leak detected. " + c.length + " " + t + " listeners added. Use emitter.setMaxListeners() to increase limit");
                d.name = "MaxListenersExceededWarning", d.emitter = e, d.type = t, d.count = c.length, function(e) {
                    "function" == typeof console.warn ? console.warn(e) : console.log(e);
                }(d);
            }
        } else c = a[t] = n, ++e._eventsCount;
        return e;
    }
    function a(e, t, n) {
        function i() {
            e.removeListener(t, i), s || (s = !0, n.apply(e, arguments));
        }
        var s = !1;
        return i.listener = n, i;
    }
    function c(e) {
        var t = this._events;
        if (t) {
            var n = t[e];
            if ("function" == typeof n) return 1;
            if (n) return n.length;
        }
        return 0;
    }
    function d(e, t) {
        for(var n = Array(t); t--;)n[t] = e[t];
        return n;
    }
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), i.prototype = Object.create(null), s.EventEmitter = s, s.usingDomains = !1, s.prototype.domain = void 0, s.prototype._events = void 0, s.prototype._maxListeners = void 0, s.defaultMaxListeners = 10, s.init = function() {
        this.domain = null, s.usingDomains && n.active && !(this instanceof n.Domain) && (this.domain = n.active), this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = new i, this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, s.prototype.setMaxListeners = function(e) {
        if ("number" != typeof e || 0 > e || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
        return this._maxListeners = e, this;
    }, s.prototype.getMaxListeners = function() {
        return o(this);
    }, s.prototype.emit = function(e) {
        var t, n, i, s, o, r, a, c = "error" === e;
        if (r = this._events) c = c && null == r.error;
        else if (!c) return !1;
        if (a = this.domain, c) {
            if (t = arguments[1], !a) {
                if (t instanceof Error) throw t;
                var l = new Error('Uncaught, unspecified "error" event. (' + t + ")");
                throw l.context = t, l;
            }
            return t || (t = new Error('Uncaught, unspecified "error" event')), t.domainEmitter = this, t.domain = a, t.domainThrown = !1, a.emit("error", t), !1;
        }
        if (!(n = r[e])) return !1;
        var h = "function" == typeof n;
        switch(i = arguments.length){
            case 1:
                !function(e, t, n) {
                    if (t) e.call(n);
                    else for(var i = e.length, s = d(e, i), o = 0; o < i; ++o)s[o].call(n);
                }(n, h, this);
                break;
            case 2:
                !function(e, t, n, i) {
                    if (t) e.call(n, i);
                    else for(var s = e.length, o = d(e, s), r = 0; r < s; ++r)o[r].call(n, i);
                }(n, h, this, arguments[1]);
                break;
            case 3:
                !function(e, t, n, i, s) {
                    if (t) e.call(n, i, s);
                    else for(var o = e.length, r = d(e, o), a = 0; a < o; ++a)r[a].call(n, i, s);
                }(n, h, this, arguments[1], arguments[2]);
                break;
            case 4:
                !function(e, t, n, i, s, o) {
                    if (t) e.call(n, i, s, o);
                    else for(var r = e.length, a = d(e, r), c = 0; c < r; ++c)a[c].call(n, i, s, o);
                }(n, h, this, arguments[1], arguments[2], arguments[3]);
                break;
            default:
                for(s = Array(i - 1), o = 1; o < i; o++)s[o - 1] = arguments[o];
                !function(e, t, n, i) {
                    if (t) e.apply(n, i);
                    else for(var s = e.length, o = d(e, s), r = 0; r < s; ++r)o[r].apply(n, i);
                }(n, h, this, s);
        }
        return !0;
    }, s.prototype.addListener = function(e, t) {
        return r(this, e, t, !1);
    }, s.prototype.on = s.prototype.addListener, s.prototype.prependListener = function(e, t) {
        return r(this, e, t, !0);
    }, s.prototype.once = function(e, t) {
        if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
        return this.on(e, a(this, e, t)), this;
    }, s.prototype.prependOnceListener = function(e, t) {
        if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
        return this.prependListener(e, a(this, e, t)), this;
    }, s.prototype.removeListener = function(e, t) {
        var n, s, o, r, a;
        if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
        if (!(s = this._events)) return this;
        if (!(n = s[e])) return this;
        if (n === t || n.listener && n.listener === t) 0 == --this._eventsCount ? this._events = new i : (delete s[e], s.removeListener && this.emit("removeListener", e, n.listener || t));
        else if ("function" != typeof n) {
            for(o = -1, r = n.length; 0 < r--;)if (n[r] === t || n[r].listener && n[r].listener === t) {
                a = n[r].listener, o = r;
                break;
            }
            if (0 > o) return this;
            if (1 === n.length) {
                if (n[0] = void 0, 0 == --this._eventsCount) return this._events = new i, this;
                delete s[e];
            } else !function(e, t) {
                for(var n = t, i = n + 1, s = e.length; i < s; n += 1, i += 1)e[n] = e[i];
                e.pop();
            }(n, o);
            s.removeListener && this.emit("removeListener", e, a || t);
        }
        return this;
    }, s.prototype.removeAllListeners = function(e) {
        var t, n;
        if (!(n = this._events)) return this;
        if (!n.removeListener) return 0 === arguments.length ? (this._events = new i, this._eventsCount = 0) : n[e] && (0 == --this._eventsCount ? this._events = new i : delete n[e]), this;
        if (0 === arguments.length) {
            for(var s, o = Object.keys(n), r = 0; r < o.length; ++r)"removeListener" !== (s = o[r]) && this.removeAllListeners(s);
            return this.removeAllListeners("removeListener"), this._events = new i, this._eventsCount = 0, this;
        }
        if ("function" == typeof (t = n[e])) this.removeListener(e, t);
        else if (t) do {
            this.removeListener(e, t[t.length - 1]);
        }while (t[0])
        return this;
    }, s.prototype.listeners = function(e) {
        var t, n, i = this._events;
        return i ? n = (t = i[e]) ? "function" == typeof t ? [
            t.listener || t
        ] : function(e) {
            for(var t = Array(e.length), n = 0; n < t.length; ++n)t[n] = e[n].listener || e[n];
            return t;
        }(t) : [] : n = [], n;
    }, s.listenerCount = function(e, t) {
        return "function" == typeof e.listenerCount ? e.listenerCount(t) : c.call(e, t);
    }, s.prototype.listenerCount = c, s.prototype.eventNames = function() {
        return 0 < this._eventsCount ? Reflect.ownKeys(this._events) : [];
    };
    var l, h = new Uint8Array(16);
    function u() {
        if (!l && !(l = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
        return l(h);
    }
    var p = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
    for(var g = [], f = 0; 256 > f; ++f)g.push((f + 256).toString(16).substr(1));
    function v(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0, n = (g[e[t + 0]] + g[e[t + 1]] + g[e[t + 2]] + g[e[t + 3]] + "-" + g[e[t + 4]] + g[e[t + 5]] + "-" + g[e[t + 6]] + g[e[t + 7]] + "-" + g[e[t + 8]] + g[e[t + 9]] + "-" + g[e[t + 10]] + g[e[t + 11]] + g[e[t + 12]] + g[e[t + 13]] + g[e[t + 14]] + g[e[t + 15]]).toLowerCase();
        if (!function(e) {
            return "string" == typeof e && p.test(e);
        }(n)) throw TypeError("Stringified UUID is invalid");
        return n;
    }
    function m(e, t, n) {
        var i = (e = e || {}).random || (e.rng || u)();
        if (i[6] = 64 | 15 & i[6], i[8] = 128 | 63 & i[8], t) {
            n = n || 0;
            for(var s = 0; 16 > s; ++s)t[n + s] = i[s];
            return t;
        }
        return v(i);
    }
    function b(e, t) {
        if (!e || !t) return {};
        const n = {
            ...e
        };
        if (n.localCandidateId) {
            const e = t.get(n.localCandidateId);
            n.local = {
                ...e
            };
        }
        if (n.remoteCandidateId) {
            const e = t.get(n.remoteCandidateId);
            n.remote = {
                ...e
            };
        }
        return n;
    }
    function _(e, t, n) {
        return 8 * function(e, t, n) {
            const i = e[n], s = t ? t[n] : null;
            return null === i || null === s ? null : (i - s) / (e.timestamp - t.timestamp) * 1e3;
        }(e, t, n);
    }
    function y(e) {
        if (!e.entries) return e;
        const t = {};
        return e.forEach(function(e, n) {
            t[n] = e;
        }), t;
    }
    function w(e, t, n = {}) {
        if (!e) return null;
        let i = {
            audio: {
                inbound: [],
                outbound: []
            },
            video: {
                inbound: [],
                outbound: []
            },
            connection: {
                inbound: [],
                outbound: []
            }
        };
        n.remote && (i.remote = {
            audio: {
                inbound: [],
                outbound: []
            },
            video: {
                inbound: [],
                outbound: []
            }
        });
        for (const t of e.values())switch(t.type){
            case "outbound-rtp":
                {
                    const n = t.mediaType || t.kind, s = {};
                    let o = {};
                    if (![
                        "audio",
                        "video"
                    ].includes(n)) continue;
                    if (t.codecId) {
                        const n = e.get(t.codecId);
                        n && (s.clockRate = n.clockRate, s.mimeType = n.mimeType, s.payloadType = n.payloadType);
                    }
                    o = e.get(t.mediaSourceId) || e.get(t.trackId) || {}, i[n].outbound.push({
                        ...t,
                        ...s,
                        track: {
                            ...o
                        }
                    });
                    break;
                }
            case "inbound-rtp":
                {
                    let n = t.mediaType || t.kind, s = {};
                    const o = {};
                    if (![
                        "audio",
                        "video"
                    ].includes(n)) if (t.id.includes("Video")) n = "video";
                    else {
                        if (!t.id.includes("Audio")) continue;
                        n = "audio";
                    }
                    if (t.codecId) {
                        const n = e.get(t.codecId);
                        n && (o.clockRate = n.clockRate, o.mimeType = n.mimeType, o.payloadType = n.payloadType);
                    }
                    if (!i.connection.id && t.transportId) {
                        const n = e.get(t.transportId);
                        if (n && n.selectedCandidatePairId) {
                            const t = e.get(n.selectedCandidatePairId);
                            i.connection = b(t, e);
                        }
                    }
                    s = e.get(t.mediaSourceId) || e.get(t.trackId) || {}, i[n].inbound.push({
                        ...t,
                        ...o,
                        track: {
                            ...s
                        }
                    });
                    break;
                }
            case "peer-connection":
                i.connection.dataChannelsClosed = t.dataChannelsClosed, i.connection.dataChannelsOpened = t.dataChannelsOpened;
                break;
            case "remote-inbound-rtp":
                {
                    if (!n.remote) break;
                    let s = t.mediaType || t.kind;
                    const o = {};
                    if (![
                        "audio",
                        "video"
                    ].includes(s)) if (t.id.includes("Video")) s = "video";
                    else {
                        if (!t.id.includes("Audio")) continue;
                        s = "audio";
                    }
                    if (t.codecId) {
                        const n = e.get(t.codecId);
                        n && (o.clockRate = n.clockRate, o.mimeType = n.mimeType, o.payloadType = n.payloadType);
                    }
                    if (!i.connection.id && t.transportId) {
                        const n = e.get(t.transportId);
                        if (n && n.selectedCandidatePairId) {
                            const t = e.get(n.selectedCandidatePairId);
                            i.connection = b(t, e);
                        }
                    }
                    i.remote[s].inbound.push({
                        ...t,
                        ...o
                    });
                    break;
                }
            case "remote-outbound-rtp":
                {
                    if (!n.remote) break;
                    const s = t.mediaType || t.kind, o = {};
                    if (![
                        "audio",
                        "video"
                    ].includes(s)) continue;
                    if (t.codecId) {
                        const n = e.get(t.codecId);
                        n && (o.clockRate = n.clockRate, o.mimeType = n.mimeType, o.payloadType = n.payloadType);
                    }
                    i.remote[s].outbound.push({
                        ...t,
                        ...o
                    });
                    break;
                }
        }
        if (!i.connection.id) for (const t of e.values())"candidate-pair" === t.type && t.nominated && "succeeded" === t.state && (i.connection = b(t, e));
        return i = function(e, t) {
            return t ? (e.audio.inbound.map((e)=>{
                let n = t.audio.inbound.find((t)=>t.id === e.id);
                e.bitrate = _(e, n, "bytesReceived"), e.packetRate = _(e, n, "packetsReceived");
            }), e.audio.outbound.map((e)=>{
                let n = t.audio.outbound.find((t)=>t.id === e.id);
                e.bitrate = _(e, n, "bytesSent"), e.packetRate = _(e, n, "packetsSent");
            }), e.video.inbound.map((e)=>{
                let n = t.video.inbound.find((t)=>t.id === e.id);
                e.bitrate = _(e, n, "bytesReceived"), e.packetRate = _(e, n, "packetsReceived");
            }), e.video.outbound.map((e)=>{
                let n = t.video.outbound.find((t)=>t.id === e.id);
                e.bitrate = _(e, n, "bytesSent"), e.packetRate = _(e, n, "packetsSent");
            }), e) : e;
        }(i, t), i;
    }
    let S, I = {}, C = [];
    t.WebRTCStats = class extends s {
        constructor(e){
            if (super(), this.monitoringSetInterval = 0, this.connectionMonitoringSetInterval = 0, this.connectionMonitoringInterval = 1e3, this.remote = !0, this.peersToMonitor = {}, this.timeline = [], this.statsToMonitor = [
                "inbound-rtp",
                "outbound-rtp",
                "remote-inbound-rtp",
                "remote-outbound-rtp",
                "peer-connection",
                "data-channel",
                "stream",
                "track",
                "sender",
                "receiver",
                "transport",
                "candidate-pair",
                "local-candidate",
                "remote-candidate"
            ], "undefined" == typeof window) throw new Error("WebRTCStats only works in browser");
            const t = {
                ...e
            };
            this.isEdge = !!window.RTCIceGatherer, this.getStatsInterval = t.getStatsInterval || 1e3, this.rawStats = !!t.rawStats, this.statsObject = !!t.statsObject, this.filteredStats = !!t.filteredStats, this.shouldWrapGetUserMedia = !!t.wrapGetUserMedia, "boolean" == typeof t.remote && (this.remote = t.remote), this.debug = !!t.debug, this.logLevel = t.logLevel || "none", this.shouldWrapGetUserMedia && this.wrapGetUserMedia();
        }
        async addPeer(e, t) {
            return console.warn("The addPeer() method has been deprecated, please use addConnection()"), this.addConnection({
                peerId: e,
                pc: t
            });
        }
        async addConnection(e) {
            const { pc: t, peerId: n } = e;
            let { connectionId: i, remote: s } = e;
            if (s = "boolean" == typeof s ? s : this.remote, !(t && t instanceof RTCPeerConnection)) throw new Error("Missing argument 'pc' or is not of instance RTCPeerConnection");
            if (!n) throw new Error("Missing argument peerId");
            if (this.isEdge) throw new Error("Can't monitor peers in Edge at this time.");
            if (this.peersToMonitor[n]) {
                if (i && i in this.peersToMonitor[n]) throw new Error(`We are already monitoring connection with id ${i}.`);
                for(let e in this.peersToMonitor[n]){
                    const i = this.peersToMonitor[n][e];
                    if (i.pc === t) throw new Error(`We are already monitoring peer with id ${n}.`);
                    "closed" === i.pc.connectionState && this.removeConnection({
                        pc: i.pc
                    });
                }
            }
            const o = t.getConfiguration();
            return o.iceServers && o.iceServers.forEach(function(e) {
                delete e.credential;
            }), i || (i = m()), this.emitEvent({
                event: "addConnection",
                tag: "peer",
                peerId: n,
                connectionId: i,
                data: {
                    options: e,
                    peerConfiguration: o
                }
            }), this.monitorPeer({
                peerId: n,
                connectionId: i,
                pc: t,
                remote: s
            }), {
                connectionId: i
            };
        }
        getTimeline(e) {
            return this.timeline = this.timeline.sort((e, t)=>e.timestamp.getTime() - t.timestamp.getTime()), e ? this.timeline.filter((t)=>t.tag === e) : this.timeline;
        }
        get logger() {
            const e = (e)=>{
                const t = [
                    "none",
                    "error",
                    "warn",
                    "info",
                    "debug"
                ];
                return t.slice(0, t.indexOf(this.logLevel) + 1).indexOf(e) > -1;
            };
            return {
                error (...t) {
                    this.debug && e("error") && console.error("[webrtc-stats][error] ", ...t);
                },
                warn (...t) {
                    this.debug && e("warn") && console.warn("[webrtc-stats][warn] ", ...t);
                },
                info (...t) {
                    this.debug && e("info") && console.log("[webrtc-stats][info] ", ...t);
                },
                debug (...t) {
                    this.debug && e("debug") && console.debug("[webrtc-stats][debug] ", ...t);
                }
            };
        }
        removeConnection(e) {
            let t, { connectionId: n, pc: i } = e;
            if (!i && !n) throw new Error("Missing arguments. You need to either send pc or a connectionId.");
            if (n) {
                if ("string" != typeof n) throw new Error("connectionId must be a string.");
                for(let e in this.peersToMonitor)n in this.peersToMonitor[e] && (i = this.peersToMonitor[e][n].pc, t = e);
            } else if (i) {
                if (!(i instanceof RTCPeerConnection)) throw new Error("pc must be an instance of RTCPeerConnection.");
                for(let e in this.peersToMonitor)for(let s in this.peersToMonitor[e])this.peersToMonitor[e][s].pc === i && (n = s, t = e);
            }
            if (!i || !n) throw new Error("Could not find the desired connection.");
            return this.removePeerConnectionEventListeners(n, i), delete this.peersToMonitor[t][n], 0 === Object.values(this.peersToMonitor[t]).length && delete this.peersToMonitor[t], {
                connectionId: n
            };
        }
        removeAllPeers() {
            for(let e in this.peersToMonitor)this.removePeer(e);
        }
        removePeer(e) {
            if (this.logger.info(`Removing PeerConnection with id ${e}.`), this.peersToMonitor[e]) {
                for(let t in this.peersToMonitor[e]){
                    let n = this.peersToMonitor[e][t].pc;
                    this.removePeerConnectionEventListeners(t, n);
                }
                delete this.peersToMonitor[e];
            }
        }
        destroy() {
            this.removeAllPeers(), C.forEach((e)=>{
                this.removeTrackEventListeners(e);
            }), C = [], this.shouldWrapGetUserMedia && S && (navigator.mediaDevices.getUserMedia = S);
        }
        monitorPeer(e) {
            let { peerId: t, connectionId: n, pc: i, remote: s } = e;
            if (!i) return void this.logger.warn("Did not receive pc argument when calling monitorPeer()");
            const o = {
                pc: i,
                connectionId: n,
                stream: null,
                stats: {
                    parsed: null,
                    raw: null
                },
                options: {
                    remote: s
                }
            };
            if (this.peersToMonitor[t]) {
                if (n in this.peersToMonitor[t]) return void this.logger.warn(`Already watching connection with ID ${n}`);
                this.peersToMonitor[t][n] = o;
            } else this.peersToMonitor[t] = {
                [n]: o
            };
            this.addPeerConnectionEventListeners(t, n, i), 1 === this.numberOfMonitoredPeers && (this.startStatsMonitoring(), this.startConnectionStateMonitoring());
        }
        startStatsMonitoring() {
            this.monitoringSetInterval || (this.monitoringSetInterval = window.setInterval(()=>{
                this.numberOfMonitoredPeers || this.stopStatsMonitoring(), this.getStats().then((e)=>{
                    e.forEach((e)=>{
                        this.emitEvent(e);
                    });
                });
            }, this._getStatsInterval));
        }
        stopStatsMonitoring() {
            this.monitoringSetInterval && (window.clearInterval(this.monitoringSetInterval), this.monitoringSetInterval = 0);
        }
        async getStats(e = null) {
            this.logger.info(e ? `Getting stats from peer ${e}` : "Getting stats from all peers");
            let t = {};
            if (e) {
                if (!this.peersToMonitor[e]) throw new Error(`Cannot get stats. Peer with id ${e} does not exist`);
                t[e] = this.peersToMonitor[e];
            } else t = this.peersToMonitor;
            let n = [];
            for(const e in t)for(const i in t[e]){
                const s = t[e][i], o = s.pc;
                if (o && !this.checkIfConnectionIsClosed(e, i, o)) try {
                    const t = this.getTimestamp(), r = o.getStats(null);
                    if (r) {
                        const o = await r, a = this.getTimestamp(), c = y(o), d = {
                            remote: s.options.remote
                        }, l = w(o, s.stats.parsed, d), h = {
                            event: "stats",
                            tag: "stats",
                            peerId: e,
                            connectionId: i,
                            timeTaken: a - t,
                            data: l
                        };
                        !0 === this.rawStats && (h.rawStats = o), !0 === this.statsObject && (h.statsObject = c), !0 === this.filteredStats && (h.filteredStats = this.filteroutStats(c)), n.push(h), s.stats.parsed = l;
                    } else this.logger.error(`PeerConnection from peer ${e} did not return any stats data`);
                } catch (e) {
                    this.logger.error(e);
                }
            }
            return n;
        }
        startConnectionStateMonitoring() {
            this.connectionMonitoringSetInterval = window.setInterval(()=>{
                this.numberOfMonitoredPeers || this.stopConnectionStateMonitoring();
                for(const e in this.peersToMonitor)for(const t in this.peersToMonitor[e]){
                    const n = this.peersToMonitor[e][t].pc;
                    this.checkIfConnectionIsClosed(e, t, n);
                }
            }, this.connectionMonitoringInterval);
        }
        checkIfConnectionIsClosed(e, t, n) {
            const i = this.isConnectionClosed(n);
            if (i) {
                this.removeConnection({
                    pc: n
                });
                let i = "closed" === n.connectionState ? "onconnectionstatechange" : "oniceconnectionstatechange";
                this.emitEvent({
                    event: i,
                    peerId: e,
                    connectionId: t,
                    tag: "connection",
                    data: "closed"
                });
            }
            return i;
        }
        isConnectionClosed(e) {
            return "closed" === e.connectionState || "closed" === e.iceConnectionState;
        }
        stopConnectionStateMonitoring() {
            this.connectionMonitoringSetInterval && (window.clearInterval(this.connectionMonitoringSetInterval), this.connectionMonitoringSetInterval = 0);
        }
        wrapGetUserMedia() {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return void this.logger.warn("'navigator.mediaDevices.getUserMedia' is not available in browser. Will not wrap getUserMedia.");
            this.logger.info("Wrapping getUsermedia functions."), S = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
            const e = this.parseGetUserMedia.bind(this);
            navigator.mediaDevices.getUserMedia = (function() {
                return e({
                    constraints: arguments[0]
                }), S.apply(navigator.mediaDevices, arguments).then((t)=>(e({
                        stream: t
                    }), t), (t)=>(e({
                        error: t
                    }), Promise.reject(t)));
            }).bind(navigator.mediaDevices);
        }
        filteroutStats(e = {}) {
            const t = {
                ...e
            };
            for(const e in t){
                var n = t[e];
                this.statsToMonitor.includes(n.type) || delete t[e];
            }
            return t;
        }
        get peerConnectionListeners() {
            return {
                icecandidate: (e, t, n, i)=>{
                    this.logger.debug("[pc-event] icecandidate | peerId: ${peerId}", i), this.emitEvent({
                        event: "onicecandidate",
                        tag: "connection",
                        peerId: e,
                        connectionId: t,
                        data: i.candidate
                    });
                },
                track: (e, t, n, i)=>{
                    this.logger.debug(`[pc-event] track | peerId: ${e}`, i);
                    const s = i.track, o = i.streams[0];
                    e in this.peersToMonitor && t in this.peersToMonitor[e] && (this.peersToMonitor[e][t].stream = o), this.addTrackEventListeners(s, t), this.emitEvent({
                        event: "ontrack",
                        tag: "track",
                        peerId: e,
                        connectionId: t,
                        data: {
                            stream: o ? this.getStreamDetails(o) : null,
                            track: s ? this.getMediaTrackDetails(s) : null,
                            title: i.track.kind + ":" + i.track.id + " " + i.streams.map(function(e) {
                                return "stream:" + e.id;
                            })
                        }
                    });
                },
                signalingstatechange: (e, t, n)=>{
                    this.logger.debug(`[pc-event] signalingstatechange | peerId: ${e}`), this.emitEvent({
                        event: "onsignalingstatechange",
                        tag: "connection",
                        peerId: e,
                        connectionId: t,
                        data: {
                            signalingState: n.signalingState,
                            localDescription: n.localDescription,
                            remoteDescription: n.remoteDescription
                        }
                    });
                },
                iceconnectionstatechange: (e, t, n)=>{
                    this.logger.debug(`[pc-event] iceconnectionstatechange | peerId: ${e}`), this.emitEvent({
                        event: "oniceconnectionstatechange",
                        tag: "connection",
                        peerId: e,
                        connectionId: t,
                        data: n.iceConnectionState
                    });
                },
                icegatheringstatechange: (e, t, n)=>{
                    this.logger.debug(`[pc-event] icegatheringstatechange | peerId: ${e}`), this.emitEvent({
                        event: "onicegatheringstatechange",
                        tag: "connection",
                        peerId: e,
                        connectionId: t,
                        data: n.iceGatheringState
                    });
                },
                icecandidateerror: (e, t, n, i)=>{
                    this.logger.debug(`[pc-event] icecandidateerror | peerId: ${e}`), this.emitEvent({
                        event: "onicecandidateerror",
                        tag: "connection",
                        peerId: e,
                        connectionId: t,
                        error: {
                            errorCode: i.errorCode
                        }
                    });
                },
                connectionstatechange: (e, t, n)=>{
                    this.logger.debug(`[pc-event] connectionstatechange | peerId: ${e}`), this.emitEvent({
                        event: "onconnectionstatechange",
                        tag: "connection",
                        peerId: e,
                        connectionId: t,
                        data: n.connectionState
                    });
                },
                negotiationneeded: (e, t, n)=>{
                    this.logger.debug(`[pc-event] negotiationneeded | peerId: ${e}`), this.emitEvent({
                        event: "onnegotiationneeded",
                        tag: "connection",
                        peerId: e,
                        connectionId: t
                    });
                },
                datachannel: (e, t, n, i)=>{
                    this.logger.debug(`[pc-event] datachannel | peerId: ${e}`, i), this.emitEvent({
                        event: "ondatachannel",
                        tag: "datachannel",
                        peerId: e,
                        connectionId: t,
                        data: i.channel
                    });
                }
            };
        }
        addPeerConnectionEventListeners(e, t, n) {
            this.logger.debug(`Adding event listeners for peer ${e} and connection ${t}.`), I[t] = {}, Object.keys(this.peerConnectionListeners).forEach((i)=>{
                I[t][i] = this.peerConnectionListeners[i].bind(this, e, t, n), n.addEventListener(i, I[t][i], !1);
            });
        }
        parseGetUserMedia(e) {
            try {
                const t = {
                    event: "getUserMedia",
                    tag: "getUserMedia",
                    data: {
                        ...e
                    }
                };
                e.stream && (t.data.details = this.parseStream(e.stream), e.stream.getTracks().map((e)=>{
                    this.addTrackEventListeners(e), C.push(e);
                })), this.emitEvent(t);
            } catch (e) {}
        }
        parseStream(e) {
            const t = {
                audio: [],
                video: []
            };
            return e.getTracks().forEach((e)=>{
                t[e.kind].push(this.getMediaTrackDetails(e));
            }), t;
        }
        getMediaTrackDetails(e) {
            return {
                enabled: e.enabled,
                id: e.id,
                contentHint: e.contentHint,
                kind: e.kind,
                label: e.label,
                muted: e.muted,
                readyState: e.readyState,
                constructorName: e.constructor.name,
                capabilities: e.getCapabilities ? e.getCapabilities() : {},
                constraints: e.getConstraints ? e.getConstraints() : {},
                settings: e.getSettings ? e.getSettings() : {},
                _track: e
            };
        }
        getStreamDetails(e) {
            return {
                active: e.active,
                id: e.id,
                _stream: e
            };
        }
        getTrackEventObject(e) {
            return {
                mute: (t)=>{
                    this.emitEvent({
                        event: "mute",
                        tag: "track",
                        connectionId: e,
                        data: {
                            event: t
                        }
                    });
                },
                unmute: (t)=>{
                    this.emitEvent({
                        event: "unmute",
                        tag: "track",
                        connectionId: e,
                        data: {
                            event: t
                        }
                    });
                },
                overconstrained: (t)=>{
                    this.emitEvent({
                        event: "overconstrained",
                        tag: "track",
                        connectionId: e,
                        data: {
                            event: t
                        }
                    });
                },
                ended: (t)=>{
                    this.emitEvent({
                        event: "ended",
                        tag: "track",
                        connectionId: e,
                        data: {
                            event: t
                        }
                    }), this.removeTrackEventListeners(t.target);
                }
            };
        }
        addTrackEventListeners(e, t) {
            I[e.id] = {};
            const n = this.getTrackEventObject(t);
            Object.keys(n).forEach((t)=>{
                I[e.id][t] = n[t].bind(this), e.addEventListener(t, I[e.id][t]);
            }), I[e.id].readyState = setInterval(()=>{
                if ("ended" === e.readyState) {
                    let t = new CustomEvent("ended", {
                        detail: {
                            check: "readyState"
                        }
                    });
                    e.dispatchEvent(t);
                }
            }, 1e3);
        }
        removeTrackEventListeners(e) {
            if (e.id in I) {
                const t = this.getTrackEventObject();
                Object.keys(t).forEach((t)=>{
                    e.removeEventListener(t, I[e.id][t]);
                }), clearInterval(I[e.id].readyState), delete I[e.id];
            }
        }
        addToTimeline(e) {
            this.timeline.push(e), this.emit("timeline", e);
        }
        emitEvent(e) {
            const t = {
                ...e,
                timestamp: new Date
            };
            this.addToTimeline(t), t.tag && this.emit(t.tag, t);
        }
        set getStatsInterval(e) {
            if (!Number.isInteger(e)) throw new Error(`getStatsInterval should be an integer, got: ${e}`);
            this._getStatsInterval = e, this.monitoringSetInterval && (this.stopStatsMonitoring(), this.startStatsMonitoring());
        }
        get numberOfMonitoredPeers() {
            return Object.keys(this.peersToMonitor).length;
        }
        removePeerConnectionEventListeners(e, t) {
            e in I && (Object.keys(this.peerConnectionListeners).forEach((n)=>{
                t.removeEventListener(n, I[e][n], !1);
            }), delete I[e]), t.getSenders().forEach((e)=>{
                e.track && this.removeTrackEventListeners(e.track);
            }), t.getReceivers().forEach((e)=>{
                e.track && this.removeTrackEventListeners(e.track);
            });
        }
        getTimestamp() {
            return Date.now();
        }
        wrapGetDisplayMedia() {
            const e = this;
            if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
                const t = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices), n = function() {
                    return e.debug("navigator.mediaDevices.getDisplayMedia", null, arguments[0]), t.apply(navigator.mediaDevices, arguments).then(function(e) {
                        return e;
                    }, function(t) {
                        return e.debug("navigator.mediaDevices.getDisplayMediaOnFailure", null, t.name), Promise.reject(t);
                    });
                };
                navigator.mediaDevices.getDisplayMedia = n.bind(navigator.mediaDevices);
            }
        }
    };
});
(ze = Ye) && ze.__esModule && Object.prototype.hasOwnProperty.call(ze, "default") && ze.default;
var Xe = Ye.WebRTCStats;
function Ze(e) {
    const { packetsLost: t, packetsReceived: n, jitter: i, rtt: s } = e, o = function(e) {
        const { jitter: t, rtt: n } = e, i = t + n / 2;
        return .024 * i + .11 * (i - 177.3) * (i > 177.3 ? 1 : 0);
    }({
        rtt: s,
        jitter: i
    }), r = function(e) {
        const { packetsLost: t, packetsReceived: n } = e, i = t / (n + t) * 100;
        return 20 * Math.log(1 + i);
    }({
        packetsLost: t,
        packetsReceived: n
    }), a = 93.2 - o - r + 0, c = 1 + .035 * a + 7e-6 * a * (a - 60) * (100 - a);
    return Math.min(Math.max(c, 1), 5);
}
function et(e) {
    return isNaN(e) ? null : e > 4.2 ? "excellent" : e >= 4.1 && e <= 4.2 ? "good" : e >= 3.7 && e <= 4 ? "fair" : e >= 3.1 && e <= 3.6 ? "poor" : "bad";
}
class tt extends ie {
    constructor(e){
        super(), this.buildRequest({
            type: "debug_report_start",
            debug_report_id: e,
            debug_report_version: 1
        });
    }
}
class nt extends ie {
    constructor(e){
        super(), this.buildRequest({
            type: "debug_report_stop",
            debug_report_id: e,
            debug_report_version: 1
        });
    }
}
class it extends ie {
    constructor(e, t){
        super(), this.buildRequest({
            type: "debug_report_data",
            debug_report_id: e,
            debug_report_version: 1,
            debug_report_data: t
        });
    }
}
function st(e) {
    const n = a(), i = new Xe({
        getStatsInterval: 1e3,
        rawStats: !1,
        statsObject: !0,
        filteredStats: !1,
        remote: !0,
        debug: !1,
        logLevel: "warn"
    }), s = (i)=>t(this, void 0, void 0, function*() {
            "stats" === i.event && Q(u.StatsFrame, function({ data: e }) {
                var t, n, i, s, o, r, a, c;
                const { audio: d, remote: l } = e, { audio: h } = l, u = null !== (n = null === (t = h.inbound[0]) || void 0 === t ? void 0 : t.jitter) && void 0 !== n ? n : 1 / 0, p = null !== (s = null === (i = h.inbound[0]) || void 0 === i ? void 0 : i.roundTripTime) && void 0 !== s ? s : 1 / 0, g = null !== (r = null === (o = d.inbound[0]) || void 0 === o ? void 0 : o.packetsReceived) && void 0 !== r ? r : -1, f = null !== (c = null === (a = d.inbound[0]) || void 0 === a ? void 0 : a.packetsLost) && void 0 !== c ? c : -1, v = Ze({
                    jitter: 1e3 * u,
                    rtt: 1e3 * p,
                    packetsLost: f,
                    packetsReceived: g
                });
                return {
                    jitter: u,
                    rtt: p,
                    mos: v,
                    quality: et(v),
                    inboundAudio: d.inbound[0],
                    outboundAudio: d.outbound[0],
                    remoteInboundAudio: h.inbound[0],
                    remoteOutboundAudio: h.outbound[0]
                };
            }(i), e.uuid), yield e.execute(new it(n, i));
        });
    return {
        start: (o, r, a)=>t(this, void 0, void 0, function*() {
                yield e.execute(new tt(n)), i.on("timeline", s), yield new Promise((e)=>setTimeout(e, 500)), i.addConnection({
                    pc: o,
                    peerId: r,
                    connectionId: a
                });
            }),
        stop: (s)=>t(this, void 0, void 0, function*() {
                const t = i.getTimeline();
                if (Q(u.StatsReport, t, e.uuid), "file" === s) {
                    !function(e, t) {
                        const n = new Blob([
                            JSON.stringify(e)
                        ], {
                            type: "application/json"
                        }), i = URL.createObjectURL(n), s = document.createElement("a");
                        s.href = i, s.download = `${t}.json`, s.click(), URL.revokeObjectURL(i);
                    }(t, `webrtc-stats-${n}-${Date.now()}`);
                }
                yield e.execute(new nt(n)), i.removeAllPeers(), i.destroy();
            })
    };
}
class ot {
    constructor(e, n, i, s, o){
        this.type = e, this.options = n, this.onSdpReadyTwice = null, this.statsReporter = null, this._negotiating = !1, this._prevConnectionState = null, this._restartedIceOnConnectionStateFailed = !1, this.handleConnectionStateChange = (e)=>t(this, void 0, void 0, function*() {
                const { connectionState: e } = this.instance;
                if (console.log(`[${(new Date).toISOString()}] Connection State changed: ${this._prevConnectionState} -> ${e}`), "failed" === e || "disconnected" === e) {
                    const n = ()=>t(this, void 0, void 0, function*() {
                            this._isOffer() && !this._restartedIceOnConnectionStateFailed ? (this.instance.restartIce(), v.debug(`Peer Connection ${e}. Restarting ICE gathering.`), "failed" === e && (this._restartedIceOnConnectionStateFailed = !0, v.debug("ICE has been restarted on connection state failed.")), this._isTrickleIce() ? yield this.startTrickleIceNegotiation() : this.startNegotiation()) : this._restartedIceOnConnectionStateFailed && (v.debug("Peer Connection failed again after ICE restart. Closing unrecoverable call."), Q(u.PeerConnectionFailureError, {
                                error: new Error(`Peer Connection failed twice. previous state: ${this._prevConnectionState}, current state: ${e}`),
                                sessionId: this._session.sessionid
                            }, this.options.id)), window.removeEventListener("online", n);
                        });
                    navigator.onLine ? n() : window.addEventListener("online", n);
                }
                "connected" === this._prevConnectionState && "disconnected" === e && (yield this._resetJitterBuffer()), "disconnected" === this._prevConnectionState && "connected" === e && (yield this._resetJitterBuffer()), this._prevConnectionState = e, this._isTrickleIce() && ("connecting" === e && performance.mark("peer-connection-connecting"), "connected" === e && (performance.mark("peer-connection-connected"), console.group("Performance Metrics"), console.table(this.trickleIcePerformanceMetrics), console.groupEnd(), performance.clearMarks()));
            }), this._handleIceConnectionStateChange = (e)=>{
            console.log(`[${(new Date).toISOString()}] ICE Connection State`, this.instance.iceConnectionState);
        }, this._handleIceGatheringStateChange = (e)=>{
            console.log(`[${(new Date).toISOString()}] ICE Gathering State`, this.instance.iceGatheringState);
        }, this._setAudioCodec = (e)=>{
            if (this.options.preferred_codecs && 0 !== this.options.preferred_codecs.length) return e.setCodecPreferences ? e.setCodecPreferences(this.options.preferred_codecs) : void 0;
        }, v.info("New Peer with type:", this.type, "Options:", this.options), this._constraints = {
            offerToReceiveAudio: !0
        }, this._sdpReady = this._sdpReady.bind(this), this.handleSignalingStateChangeEvent = this.handleSignalingStateChangeEvent.bind(this), this.handleNegotiationNeededEvent = this.handleNegotiationNeededEvent.bind(this), this.handleTrackEvent = this.handleTrackEvent.bind(this), this.createPeerConnection = this.createPeerConnection.bind(this), this._session = i, this._trickleIceSdpFn = s, this._registerPeerEvents = o;
    }
    get isOffer() {
        return this.type === L.Offer;
    }
    get isAnswer() {
        return this.type === L.Answer;
    }
    get isDebugEnabled() {
        return this.options.debug || this._session.options.debug;
    }
    get debugOutput() {
        return this.options.debugOutput || this._session.options.debugOutput;
    }
    get keepConnectionAliveOnSocketClose() {
        return this.options.keepConnectionAliveOnSocketClose || this._session.options.keepConnectionAliveOnSocketClose;
    }
    startNegotiation() {
        performance.mark("ice-gathering-start"), this._negotiating = !0, this._isOffer() ? this._createOffer() : this._createAnswer();
    }
    startTrickleIceNegotiation() {
        return t(this, void 0, void 0, function*() {
            performance.mark("ice-gathering-start"), this._negotiating = !0, this._isOffer() ? yield this._createOffer().then(this._trickleIceSdpFn.bind(this)) : yield this._createAnswer().then(this._trickleIceSdpFn.bind(this));
        });
    }
    _logTransceivers() {
        v.info("Number of transceivers:", this.instance.getTransceivers().length), this.instance.getTransceivers().forEach((e, t)=>{
            v.info(`>> Transceiver [${t}]:`, e.mid, e.direction, e.stopped), v.info(`>> Sender Params [${t}]:`, JSON.stringify(e.sender.getParameters(), null, 2));
        });
    }
    get trickleIcePerformanceMetrics() {
        const e = performance.measure("new-call", "new-call-start", "new-call-end"), t = performance.measure("peer-creation", "peer-creation-start", "peer-creation-end"), n = performance.measure("ice-gathering", "ice-gathering-start", "ice-gathering-end"), i = performance.measure("sdp-send", "sdp-send-start", "sdp-send-end"), s = performance.measure("invite-send", "new-call-start", "sdp-send-start"), o = performance.measure("total-duration", "peer-creation-start", "sdp-send-end"), r = (e)=>`${e.toFixed(2)}ms`;
        return {
            "New Call": {
                duration: r(e.duration)
            },
            "Peer Creation": {
                duration: r(t.duration)
            },
            "ICE Gathering": {
                duration: r(n.duration)
            },
            [this._isOffer() ? "Invite Send" : "Answer Send"]: {
                duration: r(s.duration)
            },
            "SDP Send": {
                duration: r(i.duration)
            },
            "Total Duration": {
                duration: r(o.duration)
            }
        };
    }
    handleSignalingStateChangeEvent(e) {
        switch(v.info("signalingState:", this.instance.signalingState), this.instance.signalingState){
            case "stable":
                this._negotiating = !1;
                break;
            case "closed":
                this.instance = null;
                break;
            default:
                this._negotiating = !0;
        }
    }
    handleNegotiationNeededEvent() {
        v.info("Negotiation needed event"), "stable" !== this.instance.signalingState || this._negotiating ? v.debug("Skipping negotiation, state:", this.instance.signalingState, "negotiating:", this._negotiating) : this._isTrickleIce() ? this.startTrickleIceNegotiation() : this.startNegotiation();
    }
    handleTrackEvent(e) {
        const { streams: [t] } = e, { remoteElement: n, screenShare: i } = this.options;
        let { remoteStream: s } = this.options;
        s = t, !1 === i && ue(n, s);
    }
    createPeerConnection() {
        return t(this, void 0, void 0, function*() {
            var e;
            this.instance = (e = this._config(), new window.RTCPeerConnection(e)), this.instance.onsignalingstatechange = this.handleSignalingStateChangeEvent, this.instance.onnegotiationneeded = this.handleNegotiationNeededEvent, this.instance.ontrack = this.handleTrackEvent, this.instance.addEventListener("connectionstatechange", this.handleConnectionStateChange), this.instance.addEventListener("iceconnectionstatechange", this._handleIceConnectionStateChange), this.instance.addEventListener("icegatheringstatechange", this._handleIceGatheringStateChange), this.instance.addEventListener("addstream", (e)=>{
                this.options.remoteStream = e.stream;
            }), this._registerPeerEvents(this.instance), this._prevConnectionState = this.instance.connectionState, this.isAnswer && (yield this._setRemoteDescription({
                sdp: this.options.remoteSdp,
                type: L.Offer
            })), this.options.localStream = yield this._retrieveLocalStream().catch((e)=>(Q(u.MediaError, e, this.options.id), null)), performance.mark("peer-creation-end");
        });
    }
    init() {
        var e;
        return t(this, void 0, void 0, function*() {
            yield this.createPeerConnection(), yield null === (e = this.statsReporter) || void 0 === e ? void 0 : e.start(this.instance, this._session.sessionid, this._session.sessionid);
            const { localElement: t, localStream: n = null, screenShare: i = !1 } = this.options;
            if (he(n)) {
                const e = n.getAudioTracks();
                if (v.info("Local audio tracks: ", e), "object" == typeof this.options.audio && e.forEach((e)=>{
                    v.info("Local audio tracks constraints: ", e.getConstraints());
                }), this.isOffer && "function" == typeof this.instance.addTransceiver) {
                    const t = {
                        direction: "sendrecv",
                        streams: [
                            n
                        ]
                    };
                    e.forEach((e)=>{
                        this.options.userVariables.microphoneLabel = e.label;
                        const n = this.instance.addTransceiver(e, t);
                        this._setAudioCodec(n);
                    });
                } else "function" == typeof this.instance.addTrack ? (e.forEach((e)=>{
                    this.options.userVariables.microphoneLabel = e.label, this.instance.addTrack(e, n);
                }), this.instance.getTransceivers().forEach((e)=>this._setAudioCodec(e))) : this.instance.addStream(n);
                !1 === i && ue(t, n);
            }
            this.isOffer ? this.options.negotiateAudio && this._checkMediaToNegotiate("audio") : this._isTrickleIce() || this.startNegotiation(), this._isTrickleIce() && this.startTrickleIceNegotiation(), this._logTransceivers(), this.isDebugEnabled && (this.statsReporter = st(this._session));
        });
    }
    _getSenderByKind(e) {
        return this.instance.getSenders().find(({ track: t })=>t && t.kind === e);
    }
    _checkMediaToNegotiate(e) {
        if (!this._getSenderByKind(e)) {
            const t = this.instance.addTransceiver(e);
            v.info("Add transceiver", e, t);
        }
    }
    _createOffer() {
        return t(this, void 0, void 0, function*() {
            if (this._isOffer()) {
                this._constraints.offerToReceiveAudio = Boolean(this.options.audio), v.info("_createOffer - this._constraints", this._constraints);
                try {
                    const e = yield this.instance.createOffer(this._constraints);
                    return yield this._setLocalDescription(e), this._isTrickleIce() || this._sdpReady(), e;
                } catch (e) {
                    v.error("Peer _createOffer error:", e);
                }
            }
        });
    }
    _setRemoteDescription(e) {
        return t(this, void 0, void 0, function*() {
            v.debug("Setting remote description", e), yield this.instance.setRemoteDescription(e);
        });
    }
    _createAnswer() {
        return t(this, void 0, void 0, function*() {
            if (this._isAnswer()) {
                if ("stable" !== this.instance.signalingState && "have-remote-offer" !== this.instance.signalingState) return v.debug("Skipping negotiation, state:", this.instance.signalingState), console.log("  - But the signaling state isn't stable, so triggering rollback"), void (yield Promise.all([
                    this.instance.setLocalDescription({
                        type: "rollback"
                    }),
                    this.instance.setRemoteDescription({
                        sdp: this.options.remoteSdp,
                        type: L.Offer
                    })
                ]));
                this._logTransceivers();
                try {
                    const e = yield this.instance.createAnswer();
                    return yield this._setLocalDescription(e), e;
                } catch (e) {
                    v.error("Peer _createAnswer error:", e);
                }
            }
        });
    }
    _setLocalDescription(e) {
        return t(this, void 0, void 0, function*() {
            yield this.instance.setLocalDescription(e);
        });
    }
    _sdpReady() {
        y(this.onSdpReadyTwice) && this.onSdpReadyTwice(this.instance.localDescription);
    }
    _retrieveLocalStream() {
        return t(this, void 0, void 0, function*() {
            if (he(this.options.localStream)) return this.options.localStream;
            const e = yield (n = this.options, t(void 0, void 0, void 0, function*() {
                let { audio: e = !0, micId: t } = n;
                const { micLabel: i = "" } = n;
                return t && (t = yield _e(t, i, F.AudioIn).catch((e)=>null), t && ("boolean" == typeof e && (e = {}), e.deviceId = {
                    exact: t
                })), {
                    audio: e
                };
            }));
            var n;
            return ve(e);
        });
    }
    _resetJitterBuffer() {
        return t(this, void 0, void 0, function*() {
            try {
                const e = this.instance.getReceivers().find((e)=>e.track && "audio" === e.track.kind);
                e && "jitterBufferTarget" in e && (e.jitterBufferTarget = 20, v.debug("[jitter] target set to", e.jitterBufferTarget, "ms"));
            } catch (e) {
                v.error("Peer _resetJitterBuffer error:", e);
            }
        });
    }
    _isOffer() {
        return this.type === L.Offer;
    }
    _isAnswer() {
        return this.type === L.Answer;
    }
    _isTrickleIce() {
        return !0 === this.options.trickleIce;
    }
    _config() {
        const { prefetchIceCandidates: e, forceRelayCandidate: t } = this.options, n = {
            bundlePolicy: "balanced",
            iceCandidatePoolSize: e ? 10 : 0,
            iceServers: [
                d,
                h
            ],
            iceTransportPolicy: t ? "relay" : "all"
        };
        return v.info("RTC config", n), n;
    }
    close() {
        var e;
        return t(this, void 0, void 0, function*() {
            yield null === (e = this.statsReporter) || void 0 === e ? void 0 : e.stop(this.debugOutput), this.instance && (this.instance.close(), this.instance = null);
        });
    }
}
const rt = Pe;
class at {
    constructor(e, t){
        this.session = e, this.id = "", this.state = U[U.New], this.prevState = "", this.channels = [], this.role = j.Participant, this.extension = null, this._state = U.New, this._prevState = U.New, this.gotAnswer = !1, this.gotEarly = !1, this._lastSerno = 0, this._targetNodeId = null, this._iceTimeout = null, this._iceDone = !1, this._statsBindings = [], this._statsIntervalId = null, this._pendingIceCandidates = [], this._isRemoteDescriptionSet = !1, this._checkConferenceSerno = (e)=>{
            const t = e < 0 || !this._lastSerno || this._lastSerno && e === this._lastSerno + 1;
            return t && e >= 0 && (this._lastSerno = e), t;
        }, this._doStats = ()=>{
            this.peer && this.peer.instance && 0 !== this._statsBindings.length && this.peer.instance.getStats().then((e)=>{
                e.forEach((e)=>{
                    this._statsBindings.forEach((t)=>{
                        if (t.callback) {
                            if (t.constraints) {
                                for(var n in t.constraints)if (t.constraints.hasOwnProperty(n) && t.constraints[n] !== e[n]) return;
                            }
                            t.callback(e);
                        }
                    });
                });
            });
        };
        const { iceServers: n, speaker: i, micId: s, micLabel: o, camId: r, camLabel: a, localElement: c, remoteElement: d, options: l, mediaConstraints: { audio: h }, ringtoneFile: u, ringbackFile: p } = e;
        this.options = Object.assign({}, D, {
            audio: h,
            iceServers: n,
            localElement: c,
            remoteElement: d,
            micId: s,
            micLabel: o,
            camId: r,
            camLabel: a,
            speakerId: i,
            ringtoneFile: u,
            ringbackFile: p,
            debug: l.debug,
            debugOutput: l.debugOutput,
            trickleIce: l.trickleIce,
            prefetchIceCandidates: l.prefetchIceCandidates,
            keepConnectionAliveOnSocketClose: l.keepConnectionAliveOnSocketClose
        }, t), this._onMediaError = this._onMediaError.bind(this), this._onPeerConnectionFailureError = this._onPeerConnectionFailureError.bind(this), this._onTrickleIceSdp = this._onTrickleIceSdp.bind(this), this._registerPeerEvents = this._registerPeerEvents.bind(this), this._registerTrickleIcePeerEvents = this._registerTrickleIcePeerEvents.bind(this), this._init(), this.options && (this._ringtone = xe(this.options.ringtoneFile, "_ringtone"), this._ringback = xe(this.options.ringbackFile, "_ringback"));
    }
    get performanceMetrics() {
        const e = performance.measure("peer-creation", "peer-creation-start", "peer-creation-end"), t = performance.measure("ice-gathering", "ice-gathering-start", "ice-gathering-end"), n = performance.measure("sdp-send", "sdp-send-start", "sdp-send-end"), i = performance.measure("total-duration", "peer-creation-start", "sdp-send-end"), s = (e)=>`${e.toFixed(2)}ms`;
        return {
            "Peer Creation": {
                duration: s(e.duration)
            },
            "ICE Gathering": {
                duration: s(t.duration)
            },
            "SDP Send": {
                duration: s(n.duration)
            },
            "Total Duration": {
                duration: s(i.duration)
            }
        };
    }
    get nodeId() {
        return this._targetNodeId;
    }
    set nodeId(e) {
        this._targetNodeId = e;
    }
    get telnyxIDs() {
        return {
            telnyxCallControlId: this.options.telnyxCallControlId,
            telnyxSessionId: this.options.telnyxSessionId,
            telnyxLegId: this.options.telnyxLegId
        };
    }
    get localStream() {
        return this.options.localStream;
    }
    get remoteStream() {
        return this.options.remoteStream;
    }
    get memberChannel() {
        return `conference-member.${this.id}`;
    }
    invite() {
        return t(this, void 0, void 0, function*() {
            this.direction = P.Outbound, this.options.trickleIce && this._resetTrickleIceCandidateState(), performance.mark("peer-creation-start"), this.peer = new ot(L.Offer, this.options, this.session, this._onTrickleIceSdp, this.options.trickleIce ? this._registerTrickleIcePeerEvents : this._registerPeerEvents), yield this.peer.init();
        });
    }
    answer(e = {}) {
        var n;
        return t(this, void 0, void 0, function*() {
            performance.mark("new-call-start"), this.stopRingtone(), this.direction = P.Inbound, (null === (n = null == e ? void 0 : e.customHeaders) || void 0 === n ? void 0 : n.length) > 0 && (this.options = Object.assign(Object.assign({}, this.options), {
                customHeaders: e.customHeaders
            })), this.options.trickleIce && this._resetTrickleIceCandidateState(), performance.mark("peer-creation-start"), this.peer = new ot(L.Answer, this.options, this.session, this._onTrickleIceSdp, this.options.trickleIce ? this._registerTrickleIcePeerEvents : this._registerPeerEvents), yield this.peer.init(), performance.mark("new-call-end");
        });
    }
    playRingtone() {
        Ae(this._ringtone);
    }
    stopRingtone() {
        Oe(this._ringtone);
    }
    playRingback() {
        Ae(this._ringback);
    }
    stopRingback() {
        Oe(this._ringback);
    }
    hangup(e, t) {
        var n, i, s;
        let o = e || {}, r = !1 !== t;
        this.cause = o.cause || "NORMAL_CLEARING", this.causeCode = o.causeCode || 16, this.sipCode = o.sipCode || null, this.sipReason = o.sipReason || null, this.sipCallId = o.sip_call_id || null, this.options.customHeaders = [
            ...null !== (n = this.options.customHeaders) && void 0 !== n ? n : [],
            ...null !== (s = null === (i = null == o ? void 0 : o.dialogParams) || void 0 === i ? void 0 : i.customHeaders) && void 0 !== s ? s : []
        ], this.setState(U.Hangup);
        const a = ()=>{
            var e;
            return null === (e = this.peer) || void 0 === e || e.close(), this.setState(U.Destroy);
        };
        if (this.stopRingtone(), this.stopRingback(), r) {
            const e = new $e({
                sipCode: this.sipCode,
                sip_call_id: this.sipCallId,
                sessid: this.session.sessionid,
                dialogParams: this.options,
                cause: "USER_BUSY",
                causeCode: 17
            });
            this._execute(e).catch((e)=>{
                v.error("telnyx_rtc.bye failed!", e), Q(u.Error, {
                    error: e,
                    sessionId: this.session.sessionid
                }, this.session.uuid);
            }).then(a.bind(this));
        } else a();
    }
    hold() {
        const e = new Be({
            sessid: this.session.sessionid,
            action: "hold",
            dialogParams: this.options
        });
        return this._execute(e).then(this._handleChangeHoldStateSuccess.bind(this)).catch(this._handleChangeHoldStateError.bind(this));
    }
    unhold() {
        const e = new Be({
            sessid: this.session.sessionid,
            action: "unhold",
            dialogParams: this.options
        });
        return this._execute(e).then(this._handleChangeHoldStateSuccess.bind(this)).catch(this._handleChangeHoldStateError.bind(this));
    }
    toggleHold() {
        const e = new Be({
            sessid: this.session.sessionid,
            action: "toggleHold",
            dialogParams: this.options
        });
        return this._execute(e).then(this._handleChangeHoldStateSuccess.bind(this)).catch(this._handleChangeHoldStateError.bind(this));
    }
    dtmf(e) {
        const t = new Ve({
            sessid: this.session.sessionid,
            dtmf: e,
            dialogParams: this.options
        });
        this._execute(t);
    }
    message(e, t) {
        const n = {
            from: this.session.options.login,
            to: e,
            body: t
        }, i = new Ve({
            sessid: this.session.sessionid,
            msg: n,
            dialogParams: this.options
        });
        this._execute(i);
    }
    muteAudio() {
        ke(this.options.localStream);
    }
    unmuteAudio() {
        Ce(this.options.localStream);
    }
    toggleAudioMute() {
        Ee(this.options.localStream);
    }
    setAudioInDevice(e) {
        return t(this, void 0, void 0, function*() {
            const { instance: t } = this.peer, n = t.getSenders().find(({ track: { kind: e } })=>"audio" === e);
            if (n) {
                const t = yield le({
                    audio: {
                        deviceId: {
                            exact: e
                        }
                    }
                }), i = t.getAudioTracks()[0];
                n.replaceTrack(i), this.options.micId = e;
                const { localStream: s } = this.options;
                s.getAudioTracks().forEach((e)=>e.stop()), s.getVideoTracks().forEach((e)=>t.addTrack(e)), this.options.localStream = t;
            }
        });
    }
    muteVideo() {
        var e;
        e = this.options.localStream, Ie(e, "video", !1);
    }
    unmuteVideo() {
        var e;
        e = this.options.localStream, Ie(e, "video", !0);
    }
    toggleVideoMute() {
        var e;
        e = this.options.localStream, Ie(e, "video", null);
    }
    setVideoDevice(e) {
        return t(this, void 0, void 0, function*() {
            const { instance: t } = this.peer, n = t.getSenders().find(({ track: { kind: e } })=>"video" === e);
            if (n) {
                const t = yield le({
                    video: {
                        deviceId: {
                            exact: e
                        }
                    }
                }), i = t.getVideoTracks()[0];
                n.replaceTrack(i);
                const { localElement: s, localStream: o } = this.options;
                ue(s, t), this.options.camId = e, o.getAudioTracks().forEach((e)=>t.addTrack(e)), o.getVideoTracks().forEach((e)=>e.stop()), this.options.localStream = t;
            }
        });
    }
    deaf() {
        ke(this.options.remoteStream);
    }
    undeaf() {
        Ce(this.options.remoteStream);
    }
    toggleDeaf() {
        Ee(this.options.remoteStream);
    }
    setBandwidthEncodingsMaxBps(e, n) {
        return t(this, void 0, void 0, function*() {
            if (!this || !this.peer) return void v.error("Could not set bandwidth (reason: no peer connection). Dynamic bandwidth can only be set when there is a call running - is there any call running?)");
            const { instance: t } = this.peer, i = t.getSenders();
            if (!i) return void v.error("Could not set bandwidth (reason: no senders). Dynamic bandwidth can only be set when there is a call running - is there any call running?)");
            const s = i.find(({ track: { kind: e } })=>e === n);
            if (s) {
                const t = s.getParameters();
                t.encodings || (t.encodings = [
                    {
                        rid: "h"
                    }
                ]), v.info("Parameters: ", t), v.info("Setting max ", "audio" === n ? "audio" : "video", " bandwidth to: ", e, " [bps]"), t.encodings[0].maxBitrate = e, yield s.setParameters(t).then(()=>{
                    v.info("audio" === n ? "New audio" : "New video", " bandwidth settings in use: ", s.getParameters());
                }).catch((e)=>console.error(e));
            } else v.error("Could not set bandwidth (reason: no " + n + " sender). Dynamic bandwidth can only be set when there is a call running - is there any call running?)");
        });
    }
    setAudioBandwidthEncodingsMaxBps(e) {
        this.setBandwidthEncodingsMaxBps(e, "audio");
    }
    setVideoBandwidthEncodingsMaxBps(e) {
        this.setBandwidthEncodingsMaxBps(e, "video");
    }
    getStats(e, t) {
        if (!e) return;
        const n = {
            callback: e,
            constraints: t
        };
        if (this._statsBindings.push(n), !this._statsIntervalId) {
            const e = 2e3;
            this._startStats(e);
        }
    }
    setState(e) {
        switch(this._prevState = this._state, this._state = e, this.state = U[this._state].toLowerCase(), this.prevState = U[this._prevState].toLowerCase(), v.info(`Call ${this.id} state change from ${this.prevState} to ${this.state}`), this._dispatchNotification({
            type: N.callUpdate,
            call: this
        }), e){
            case U.Purge:
                this.hangup({
                    cause: "PURGE",
                    causeCode: "01"
                }, !1);
                break;
            case U.Active:
                setTimeout(()=>{
                    const { remoteElement: e, speakerId: t } = this.options;
                    e && t && pe(e, t);
                }, 0);
                break;
            case U.Destroy:
                this._finalize();
        }
    }
    handleMessage(e) {
        const { method: t, params: n } = e;
        switch(t){
            case M.Answer:
                if (this.gotAnswer = !0, this._state >= U.Active) return;
                this._state >= U.Early && this.setState(U.Active), this.gotEarly || this._onRemoteSdp(n.sdp), this.stopRingback(), this.stopRingtone();
                break;
            case M.Media:
                if (this._state >= U.Early) return;
                this.gotEarly = !0, this._onRemoteSdp(n.sdp);
                break;
            case M.Display:
            case M.Attach:
                {
                    const { display_name: e, display_number: i, display_direction: s } = n;
                    this.extension = i;
                    const o = s === P.Inbound ? P.Outbound : P.Inbound, r = {
                        type: N[t],
                        call: this,
                        displayName: e,
                        displayNumber: i,
                        displayDirection: o
                    };
                    Q(u.Notification, r, this.id) || Q(u.Notification, r, this.session.uuid);
                    break;
                }
            case M.Candidate:
                this._addIceCandidate(n);
                break;
            case M.Info:
            case M.Event:
                {
                    const e = Object.assign(Object.assign({}, n), {
                        type: N.generic,
                        call: this
                    });
                    Q(u.Notification, e, this.id) || Q(u.Notification, e, this.session.uuid);
                    break;
                }
            case M.Ringing:
                this.playRingback(), n.telnyx_call_control_id && (this.options.telnyxCallControlId = n.telnyx_call_control_id), n.telnyx_session_id && (this.options.telnyxSessionId = n.telnyx_session_id), n.telnyx_leg_id && (this.options.telnyxLegId = n.telnyx_leg_id);
                break;
            case M.Bye:
                const e1 = n.client_state || n.clientState;
                e1 && (this.options.clientState = e1), this.stopRingback(), this.stopRingtone(), this.hangup(n, !1);
        }
    }
    handleConferenceUpdate(e, n) {
        return t(this, void 0, void 0, function*() {
            if (!this._checkConferenceSerno(e.wireSerno) && e.name !== n.laName) return v.error("ConferenceUpdate invalid wireSerno or packet name:", e), "INVALID_PACKET";
            const { action: t, data: i, hashKey: s = String(this._lastSerno), arrIndex: o } = e;
            switch(t){
                case "bootObj":
                    {
                        this._lastSerno = 0;
                        const { chatChannel: e, infoChannel: t, modChannel: s, laName: o, conferenceMemberID: r, role: a } = n;
                        this._dispatchConferenceUpdate({
                            action: $.Join,
                            conferenceName: o,
                            participantId: Number(r),
                            role: a
                        }), e && (yield this._subscribeConferenceChat(e)), t && (yield this._subscribeConferenceInfo(t));
                        const c = [];
                        for(const e in i)c.push(Object.assign({
                            callId: i[e][0],
                            index: Number(e)
                        }, b(i[e][1])));
                        this._dispatchConferenceUpdate({
                            action: $.Bootstrap,
                            participants: c
                        });
                        break;
                    }
                case "add":
                    this._dispatchConferenceUpdate(Object.assign({
                        action: $.Add,
                        callId: s,
                        index: o
                    }, b(i)));
                    break;
                case "modify":
                    this._dispatchConferenceUpdate(Object.assign({
                        action: $.Modify,
                        callId: s,
                        index: o
                    }, b(i)));
                    break;
                case "del":
                    this._dispatchConferenceUpdate(Object.assign({
                        action: $.Delete,
                        callId: s,
                        index: o
                    }, b(i)));
                    break;
                case "clear":
                    this._dispatchConferenceUpdate({
                        action: $.Clear
                    });
                    break;
                default:
                    this._dispatchConferenceUpdate({
                        action: t,
                        data: i,
                        callId: s,
                        index: o
                    });
            }
        });
    }
    _addChannel(e) {
        this.channels.includes(e) || this.channels.push(e);
        const t = this.session.relayProtocol;
        this.session._existsSubscription(t, e) && (this.session.subscriptions[t][e] = Object.assign(Object.assign({}, this.session.subscriptions[t][e]), {
            callId: this.id
        }));
    }
    _subscribeConferenceChat(e) {
        return t(this, void 0, void 0, function*() {
            const t = {
                nodeId: this.nodeId,
                channels: [
                    e
                ],
                handler: (e)=>{
                    const { direction: t, from: n, fromDisplay: i, message: s, type: o } = e.data;
                    this._dispatchConferenceUpdate({
                        action: $.ChatMessage,
                        direction: t,
                        participantNumber: n,
                        participantName: i,
                        messageText: s,
                        messageType: o,
                        messageId: e.eventSerno
                    });
                }
            }, n = yield this.session.vertoSubscribe(t).catch((e)=>{
                v.error("ConfChat subscription error:", e);
            });
            we(n, e) && (this._addChannel(e), Object.defineProperties(this, {
                sendChatMessage: {
                    configurable: !0,
                    value: (t, n)=>{
                        this.session.vertoBroadcast({
                            nodeId: this.nodeId,
                            channel: e,
                            data: {
                                action: "send",
                                message: t,
                                type: n
                            }
                        });
                    }
                }
            }));
        });
    }
    _subscribeConferenceInfo(e) {
        return t(this, void 0, void 0, function*() {
            const t = {
                nodeId: this.nodeId,
                channels: [
                    e
                ],
                handler: (e)=>{
                    const { eventData: t } = e;
                    if ("layout-info" === t.contentType) t.callID = this.id, Ke(this.session, t);
                    else v.error("Conference-Info unknown contentType", e);
                }
            }, n = yield this.session.vertoSubscribe(t).catch((e)=>{
                v.error("ConfInfo subscription error:", e);
            });
            we(n, e) && this._addChannel(e);
        });
    }
    _confControl(e, t = {}) {
        const n = Object.assign({
            application: "conf-control",
            callID: this.id,
            value: null
        }, t);
        this.session.vertoBroadcast({
            nodeId: this.nodeId,
            channel: e,
            data: n
        });
    }
    _handleChangeHoldStateSuccess(e) {
        return "active" === e.holdState ? this.setState(U.Active) : this.setState(U.Held), !0;
    }
    _handleChangeHoldStateError(e) {
        return v.error(`Failed to ${e.action} on call ${this.id}`), !1;
    }
    _onRemoteSdp(e) {
        return t(this, void 0, void 0, function*() {
            const t = new RTCSessionDescription({
                sdp: e,
                type: L.Answer
            });
            yield this.peer.instance.setRemoteDescription(t).then(()=>{
                this.options.trickleIce && (this._isRemoteDescriptionSet = !0, this._flushPendingTrickleIceCandidates()), this.gotEarly && this.setState(U.Early), this.gotAnswer && this.setState(U.Active);
            }).catch((e)=>{
                v.error("Call setRemoteDescription Error: ", e), this.hangup();
            });
        });
    }
    _requestAnotherLocalDescription() {
        y(this.peer.onSdpReadyTwice) ? Q(u.Error, {
            error: new Error("SDP without candidates for the second time!"),
            sessionId: this.session.sessionid
        }, this.session.uuid) : (Object.defineProperty(this.peer, "onSdpReadyTwice", {
            value: this._onIceSdp.bind(this)
        }), this._iceDone = !1, this.peer.startNegotiation());
    }
    _onIceSdp(e) {
        var t, n;
        this._iceTimeout && clearTimeout(this._iceTimeout), this._iceTimeout = null, this._iceDone = !0;
        const { sdp: i, type: s } = e;
        if (-1 === i.indexOf("candidate")) return v.info("No candidate - retry \n"), void this._requestAnotherLocalDescription();
        null === (n = null === (t = this.peer) || void 0 === t ? void 0 : t.instance) || void 0 === n || n.removeEventListener("icecandidate", this._onIce), performance.mark("ice-gathering-end");
        let o = null;
        const r = {
            sessid: this.session.sessionid,
            sdp: i,
            dialogParams: this.options,
            "User-Agent": `Web-${rt}`
        };
        switch(s){
            case L.Offer:
                this.setState(U.Requesting), o = new De(r);
                break;
            case L.Answer:
                this.setState(U.Answering), o = !0 === this.options.attach ? new je(r) : new Ue(r);
                break;
            default:
                return v.error(`${this.id} - Unknown local SDP type:`, e), this.hangup({}, !1);
        }
        performance.mark("sdp-send-start"), this._execute(o).then((e)=>{
            const { node_id: t = null } = e;
            this._targetNodeId = t, s === L.Offer ? this.setState(U.Trying) : this.setState(U.Active);
        }).catch((e)=>{
            v.error(`${this.id} - Sending ${s} error:`, e), this.hangup();
        }).finally(()=>{
            performance.mark("sdp-send-end"), console.group("Performance Metrics"), console.table(this.performanceMetrics), console.groupEnd(), performance.clearMarks();
        });
    }
    _onTrickleIceSdp(e) {
        if (!e) return v.error("No SDP data provided"), this.hangup({}, !1);
        const { sdp: t, type: n } = e;
        let i = null;
        const s = {
            sessid: this.session.sessionid,
            sdp: t,
            dialogParams: this.options,
            trickle: !0,
            "User-Agent": `Web-${rt}`
        };
        switch(n){
            case L.Offer:
                this.setState(U.Requesting), i = new De(s);
                break;
            case L.Answer:
                this.setState(U.Answering), i = !0 === this.options.attach ? new je(s) : new Ue(s);
                break;
            default:
                return v.error(`${this.id} - Unknown local SDP type:`, e), this.hangup({}, !1);
        }
        performance.mark("sdp-send-start"), this._execute(i).then((e)=>{
            const { node_id: t = null } = e;
            this._targetNodeId = t, n === L.Offer ? this.setState(U.Trying) : this.setState(U.Active);
        }).catch((e)=>{
            v.error(`${this.id} - Sending ${n} error:`, e), this.hangup();
        }).finally(()=>{
            performance.mark("sdp-send-end");
        });
    }
    _onIce(e) {
        const { instance: t } = this.peer;
        null === this._iceTimeout && (this._iceTimeout = setTimeout(()=>this._onIceSdp(t.localDescription), 1e3)), e.candidate ? v.debug("RTCPeer Candidate:", e.candidate) : this._onIceSdp(t.localDescription);
    }
    _onTrickleIce(e) {
        e.candidate && e.candidate.candidate ? (v.debug("RTCPeer Candidate:", e.candidate), this._sendIceCandidate(e.candidate)) : this._sendEndOfCandidates();
    }
    _sendIceCandidate(e) {
        const t = new Fe({
            sessid: this.session.sessionid,
            candidate: e.candidate,
            sdpMLineIndex: e.sdpMLineIndex,
            sdpMid: e.sdpMid,
            dialogParams: this.options
        });
        this._execute(t);
    }
    _addIceCandidate(e) {
        if (!this._isRemoteDescriptionSet) return v.debug("Remote description not set. Queued ICE candidate.", e), void this._pendingIceCandidates.push(e);
        this._addIceCandidateToPeer(e);
    }
    _addIceCandidateToPeer(e) {
        const t = this.peer.instance.addIceCandidate(e);
        Promise.resolve(t).then(()=>{
            v.debug("Successfully added ICE candidate:", e);
        }).catch((t)=>{
            v.error("Failed to add ICE candidate:", t, e);
        });
    }
    _sendEndOfCandidates() {
        const e = new Ge({
            sessid: this.session.sessionid,
            endOfCandidates: !0,
            dialogParams: this.options
        });
        this._execute(e), performance.mark("ice-gathering-end");
    }
    _resetTrickleIceCandidateState() {
        this._pendingIceCandidates = [], this._isRemoteDescriptionSet = !1;
    }
    _flushPendingTrickleIceCandidates() {
        if (!this._pendingIceCandidates.length) return;
        const e = [
            ...this._pendingIceCandidates
        ];
        this._pendingIceCandidates = [], e.forEach((e)=>{
            this._addIceCandidateToPeer(e);
        });
    }
    _registerPeerEvents(e) {
        this._iceDone = !1, e.onicecandidate = (e)=>{
            this._iceDone || this._onIce(e);
        }, e.addEventListener("addstream", (e)=>{
            this.options.remoteStream = e.stream;
        }), e.addEventListener("track", (e)=>{
            this.options.remoteStream = e.streams[0];
            const { remoteElement: t, remoteStream: n, screenShare: i } = this.options;
            !1 === i && ue(t, n);
        });
    }
    _registerTrickleIcePeerEvents(e) {
        e.onicecandidate = (e)=>{
            this._onTrickleIce(e);
        }, e.onicegatheringstatechange = (t)=>{
            v.debug("ICE gathering state changed:", e.iceGatheringState), "complete" === e.iceGatheringState && v.debug("Finished gathering candidates");
        }, e.onicecandidateerror = (e)=>{
            v.debug("ICE candidate error:", e);
        }, e.addEventListener("addstream", (e)=>{
            this.options.remoteStream = e.stream;
        }), e.addEventListener("track", (e)=>{
            this.options.remoteStream = e.streams[0];
            const { remoteElement: t, remoteStream: n, screenShare: i } = this.options;
            !1 === i && ue(t, n);
        });
    }
    _onMediaError(e) {
        this._dispatchNotification({
            type: N.userMediaError,
            error: e
        }), this.hangup({}, !1);
    }
    _onPeerConnectionFailureError(e) {
        this._dispatchNotification({
            type: N.peerConnectionFailureError,
            error: e
        }), this.hangup({}, !1);
    }
    _dispatchConferenceUpdate(e) {
        this._dispatchNotification(Object.assign({
            type: N.conferenceUpdate,
            call: this
        }, e));
    }
    _dispatchNotification(e) {
        !0 !== this.options.screenShare && (Q(u.Notification, e, this.id, !1) || Q(u.Notification, e, this.session.uuid));
    }
    _execute(e) {
        return this.nodeId && (e.targetNodeId = this.nodeId), this.session.execute(e);
    }
    _init() {
        const { id: e, userVariables: t, remoteCallerNumber: n, onNotification: i } = this.options;
        var s;
        this.options.id = e ? e.toString() : a(), this.id = this.options.id, t && (s = t, 0 !== Object.keys(s).length) || (this.options.userVariables = this.session.options.userVariables || {}), n || (this.options.remoteCallerNumber = this.options.destinationNumber), this.session.calls[this.id] = this, W(u.MediaError, this._onMediaError, this.id), W(u.PeerConnectionFailureError, this._onPeerConnectionFailureError, this.id), y(i) && W(u.Notification, i.bind(this), this.id), this.setState(U.New), v.info("New Call with Options:", this.options);
    }
    _finalize() {
        this._stopStats(), this.peer && this.peer.instance && (this.peer.instance.close(), this.peer = null);
        const { remoteStream: e, localStream: t } = this.options;
        fe(e), fe(t), K(u.MediaError, null, this.id), K(u.PeerConnectionFailureError, null, this.id), this.session.calls[this.id] = null, delete this.session.calls[this.id];
    }
    _startStats(e) {
        this._statsIntervalId = setInterval(this._doStats, e), v.info("Stats started");
    }
    _stopStats() {
        this._statsIntervalId && (clearInterval(this._statsIntervalId), this._statsIntervalId = null), v.info("Stats stopped");
    }
}
at.setStateTelnyx = (e)=>{
    if (e) {
        switch(e._state){
            case U.Requesting:
            case U.Recovering:
            case U.Trying:
            case U.Early:
                e.state = "connecting";
                break;
            case U.Active:
                e.state = "active";
                break;
            case U.Held:
                e.state = "held";
                break;
            case U.Hangup:
            case U.Destroy:
                e.state = "done";
                break;
            case U.Answering:
                e.state = "ringing";
                break;
            case U.New:
                e.state = "new";
        }
        return e;
    }
};
class ct extends at {
    constructor(){
        super(...arguments), this._statsInterval = null, this.sendConversationMessage = (e, t)=>this.session.execute(new Je(e, t));
    }
    hangup(e = {}, t = !0) {
        this.screenShare instanceof ct && this.screenShare.hangup(e, t), super.hangup(e, t);
    }
    startScreenShare(e) {
        return t(this, void 0, void 0, function*() {
            const t = yield (n = {
                video: !0
            }, navigator.mediaDevices.getDisplayMedia(n));
            var n;
            t.getTracks().forEach((e)=>{
                e.addEventListener("ended", ()=>{
                    this.screenShare && this.screenShare.hangup();
                });
            });
            const { remoteCallerName: i, remoteCallerNumber: s, callerName: o, callerNumber: r } = this.options, a = Object.assign({
                screenShare: !0,
                localStream: t,
                destinationNumber: `${this.extension}-screen`,
                remoteCallerName: i,
                remoteCallerNumber: `${s}-screen`,
                callerName: `${o} (Screen)`,
                callerNumber: `${r} (Screen)`
            }, e);
            return this.screenShare = new ct(this.session, a), this.screenShare.invite(), this.screenShare;
        });
    }
    stopScreenShare() {
        this.screenShare instanceof ct && this.screenShare.hangup();
    }
    setAudioOutDevice(e) {
        return t(this, void 0, void 0, function*() {
            this.options.speakerId = e;
            const { remoteElement: t, speakerId: n } = this.options;
            return !(!t || !n) && pe(t, n);
        });
    }
    _finalize() {
        this._stats(!1), super._finalize();
    }
    _stats(e = !0) {
        if (!1 === e) return clearInterval(this._statsInterval);
        v.setLevel(2), this._statsInterval = window.setInterval(()=>t(this, void 0, void 0, function*() {
                const e = yield this.peer.instance.getStats(null);
                let t = "";
                const n = [
                    "certificate",
                    "codec",
                    "peer-connection",
                    "stream",
                    "local-candidate",
                    "remote-candidate"
                ], i = [
                    "id",
                    "type",
                    "timestamp"
                ];
                e.forEach((e)=>{
                    n.includes(e.type) || (t += `\n${e.type}\n`, Object.keys(e).forEach((n)=>{
                        i.includes(n) || (t += `\t${n}: ${e[n]}\n`);
                    }));
                }), v.info(t);
            }), 2e3);
    }
}
class dt extends de {
    constructor(e){
        super(e), this.calls = {}, this.autoRecoverCalls = !0, this._iceServers = [], this._localElement = null, this._remoteElement = null, this._jwtAuth = !0, this._audioConstraints = !0, this._speaker = null, this._onlineHandler = null, this._offlineHandler = null, this._wasOffline = !1, this.iceServers = e.iceServers, this.ringtoneFile = e.ringtoneFile, this.ringbackFile = e.ringbackFile, this._setupNetworkListeners();
    }
    get reconnectDelay() {
        return 1e3;
    }
    getIsRegistered() {
        const e = Object.create(null, {
            getIsRegistered: {
                get: ()=>super.getIsRegistered
            }
        });
        return t(this, void 0, void 0, function*() {
            return e.getIsRegistered.call(this);
        });
    }
    connect() {
        const e = Object.create(null, {
            connect: {
                get: ()=>super.connect
            }
        });
        return t(this, void 0, void 0, function*() {
            e.connect.call(this);
        });
    }
    checkPermissions(e = !0, n = !0) {
        return t(this, void 0, void 0, function*() {
            try {
                const t = yield ve({
                    audio: e,
                    video: n
                });
                return fe(t), !0;
            } catch (e) {
                return !1;
            }
        });
    }
    logout() {
        this.disconnect();
    }
    disconnect() {
        const e = Object.create(null, {
            disconnect: {
                get: ()=>super.disconnect
            }
        });
        return t(this, void 0, void 0, function*() {
            Object.keys(this.calls).forEach((e)=>this.calls[e].setState(U.Purge)), this.calls = {}, this._cleanupNetworkListeners(), yield e.disconnect.call(this);
        });
    }
    handleLoginError(e) {
        super._handleLoginError(e);
    }
    speedTest(e) {
        return new Promise((t, n)=>{
            if (J(u.SpeedTest, (n)=>{
                const { upDur: i, downDur: s } = n, o = s ? 8 * e / (s / 1e3) / 1024 : 0;
                t({
                    upDur: i,
                    downDur: s,
                    upKps: (i ? 8 * e / (i / 1e3) / 1024 : 0).toFixed(0),
                    downKps: o.toFixed(0)
                });
            }, this.uuid), !(e = Number(e))) return n(`Invalid parameter 'bytes': ${e}`);
            this.executeRaw(`#SPU ${e}`);
            let i = e / 1024;
            e % 1024 && i++;
            const s = ".".repeat(1024);
            for(let e = 0; e < i; e++)this.executeRaw(`#SPB ${s}`);
            this.executeRaw("#SPE");
        });
    }
    getDevices() {
        return me().catch((e)=>(Q(u.MediaError, e, this.uuid), []));
    }
    getVideoDevices() {
        return me(F.Video).catch((e)=>(Q(u.MediaError, e, this.uuid), []));
    }
    getAudioInDevices() {
        return me(F.AudioIn).catch((e)=>(Q(u.MediaError, e, this.uuid), []));
    }
    getAudioOutDevices() {
        return me(F.AudioOut).catch((e)=>(console.error("getAudioOutDevices", e), Q(u.MediaError, e, this.uuid), []));
    }
    validateDeviceId(e, t, n) {
        return _e(e, t, n);
    }
    getDeviceResolutions(e) {
        return t(this, void 0, void 0, function*() {
            try {
                return yield ((e)=>t(void 0, void 0, void 0, function*() {
                        const t = [], n = yield ve({
                            video: {
                                deviceId: {
                                    exact: e
                                }
                            }
                        }), i = n.getVideoTracks()[0];
                        for(let e = 0; e < be.length; e++){
                            const [n, s] = be[e];
                            (yield i.applyConstraints({
                                width: {
                                    exact: n
                                },
                                height: {
                                    exact: s
                                }
                            }).then(()=>!0).catch(()=>!1)) && t.push({
                                resolution: `${n}x${s}`,
                                width: n,
                                height: s
                            });
                        }
                        return fe(n), t;
                    }))(e);
            } catch (e) {
                throw e;
            }
        });
    }
    get mediaConstraints() {
        return {
            audio: this._audioConstraints
        };
    }
    setAudioSettings(n) {
        return t(this, void 0, void 0, function*() {
            if (!n) throw new Error("You need to provide the settings object");
            const { micId: i, micLabel: s } = n, o = e(n, [
                "micId",
                "micLabel"
            ]);
            return ye(o), this._audioConstraints = yield ((e, n, i, s)=>t(void 0, void 0, void 0, function*() {
                    const { deviceId: t } = s;
                    if (void 0 === t && (e || n)) {
                        const t = yield _e(e, n, i).catch((e)=>null);
                        t && (s.deviceId = {
                            exact: t
                        });
                    }
                    return s;
                }))(i, s, "audioinput", o), this.micId = i, this.micLabel = s, this._audioConstraints;
        });
    }
    disableMicrophone() {
        this._audioConstraints = !1;
    }
    enableMicrophone() {
        this._audioConstraints = !0;
    }
    set iceServers(e) {
        const t = {
            urls: [
                "stun:stun.l.google.com:19302"
            ]
        };
        this._iceServers = "boolean" == typeof e ? e ? [
            t
        ] : [] : e || [
            h,
            l,
            t
        ];
    }
    get iceServers() {
        return this._iceServers;
    }
    set speaker(e) {
        this._speaker = e;
    }
    get speaker() {
        return this._speaker;
    }
    set localElement(e) {
        this._localElement = w(e);
    }
    get localElement() {
        return this._localElement;
    }
    set remoteElement(e) {
        this._remoteElement = w(e);
    }
    get remoteElement() {
        return this._remoteElement;
    }
    vertoBroadcast({ nodeId: e, channel: t = "", data: n }) {
        if (!t) throw new Error(`Invalid channel for broadcast: ${t}`);
        const i = new He({
            sessid: this.sessionid,
            eventChannel: t,
            data: n
        });
        e && (i.targetNodeId = e), this.execute(i).catch((e)=>e);
    }
    vertoSubscribe({ nodeId: e, channels: n = [], handler: i }) {
        return t(this, void 0, void 0, function*() {
            if (!(n = n.filter((e)=>e && !this._existsSubscription(this.relayProtocol, e))).length) return {};
            const t = new qe({
                sessid: this.sessionid,
                eventChannel: n
            });
            e && (t.targetNodeId = e);
            const s = yield this.execute(t), { unauthorized: o = [], subscribed: r = [] } = Se(s);
            return o.length && o.forEach((e)=>this._removeSubscription(this.relayProtocol, e)), r.forEach((e)=>this._addSubscription(this.relayProtocol, i, e)), s;
        });
    }
    vertoUnsubscribe({ nodeId: e, channels: n = [] }) {
        return t(this, void 0, void 0, function*() {
            if (!(n = n.filter((e)=>e && this._existsSubscription(this.relayProtocol, e))).length) return {};
            const t = new We({
                sessid: this.sessionid,
                eventChannel: n
            });
            e && (t.targetNodeId = e);
            const i = yield this.execute(t), { unsubscribed: s = [], notSubscribed: o = [] } = Se(i);
            return s.forEach((e)=>this._removeSubscription(this.relayProtocol, e)), o.forEach((e)=>this._removeSubscription(this.relayProtocol, e)), i;
        });
    }
    _setupNetworkListeners() {
        "undefined" != typeof window && (this._onlineHandler = ()=>{
            this._wasOffline && this.connected && (this._closeConnection(), this.connect()), this._wasOffline = !1;
        }, this._offlineHandler = ()=>{
            this._wasOffline = !0;
        }, window.addEventListener("online", this._onlineHandler), window.addEventListener("offline", this._offlineHandler));
    }
    _cleanupNetworkListeners() {
        "undefined" != typeof window && this._onlineHandler && this._offlineHandler && (window.removeEventListener("online", this._onlineHandler), window.removeEventListener("offline", this._offlineHandler), this._onlineHandler = null, this._offlineHandler = null);
    }
    static telnyxStateCall(e) {
        return ct.setStateTelnyx(e);
    }
}
class lt {
    constructor(e, t){
        this.code = t, this.message = e;
    }
}
class ht extends oe {
    constructor(e){
        super(), this.method = "anonymous_login";
        const { target_type: t, target_id: n, target_version_id: i, userVariables: s, sessionId: o, reconnection: r } = e, a = {
            target_type: t,
            target_id: n,
            userVariables: s,
            reconnection: r,
            "User-Agent": {
                sdkVersion: Pe,
                data: navigator.userAgent
            }
        };
        o && (a.sessid = o), i && (a.target_version_id = i), this.buildRequest({
            method: this.method,
            params: a
        });
    }
}
const ut = Pe;
class pt {
    constructor(e){
        this.session = e, this.handleLogin = ()=>t(this, void 0, void 0, function*() {
                const { login: e, password: t, passwd: n, login_token: i, userVariables: s } = this.session.options, o = new Me(e, t || n, i, this.session.sessionid, s, !!O()), r = yield this.session.execute(o).catch(this.session.handleLoginError);
                r && (this.session.sessionid = r.sessid);
            }), this.handleAnonymousLogin = ()=>t(this, void 0, void 0, function*() {
                const { anonymous_login: e } = this.session.options, t = new ht({
                    target_id: e.target_id,
                    target_type: e.target_type,
                    target_version_id: e.target_version_id,
                    sessionId: this.session.sessionid,
                    userVariables: this.session.options.userVariables,
                    reconnection: !!O()
                }), n = yield this.session.execute(t).catch(this.session.handleLoginError);
                n && (this.session.sessionid = n.sessid);
            });
    }
    _ack(e, t) {
        const n = new Ne(e, t);
        this.nodeId && (n.targetNodeId = this.nodeId), this.session.execute(n);
    }
    reconnectDelay() {
        return 1e3 * C(2, 6);
    }
    handleMessage(e) {
        var n;
        const { session: i } = this, { id: s, method: o, params: r = {}, voice_sdk_id: a } = e, c = null == r ? void 0 : r.callID, d = null == r ? void 0 : r.eventChannel, l = null == r ? void 0 : r.eventType, h = o === M.Attach;
        let p = !1;
        if ("channelPvtData" === l) return this._handlePvtEvent(r.pvtData);
        if (c && i.calls.hasOwnProperty(c)) {
            if (!h) return i.calls[c].handleMessage(e), void this._ack(s, o);
            p = (i.calls[c].options.keepConnectionAliveOnSocketClose || i.options.keepConnectionAliveOnSocketClose) && Boolean(null === (n = this.session.calls[c].peer) || void 0 === n ? void 0 : n.instance), p ? v.info(`[${(new Date).toISOString()}][${c}] re-attaching call due to ATTACH`) : (v.debug(`Session Options: ${i.options}`), v.debug(`Call: ${i.calls[c]}`), v.info(`[${(new Date).toISOString()}][${c}] Hanging up the call due to ATTACH`), i.calls[c].hangup({}, !1));
        }
        const g = ()=>{
            var e, t, n, s, o, a;
            const d = {
                id: c,
                remoteSdp: r.sdp,
                destinationNumber: r.callee_id_number,
                remoteCallerName: r.caller_id_name,
                remoteCallerNumber: r.caller_id_number,
                callerName: r.callee_id_name,
                callerNumber: r.callee_id_number,
                attach: h,
                mediaSettings: r.mediaSettings,
                debug: null !== (e = i.options.debug) && void 0 !== e && e,
                debugOutput: null !== (t = i.options.debugOutput) && void 0 !== t ? t : "socket",
                trickleIce: null !== (n = i.options.trickleIce) && void 0 !== n && n,
                prefetchIceCandidates: null !== (s = i.options.prefetchIceCandidates) && void 0 !== s && s,
                forceRelayCandidate: null !== (o = i.options.forceRelayCandidate) && void 0 !== o && o,
                keepConnectionAliveOnSocketClose: null !== (a = i.options.keepConnectionAliveOnSocketClose) && void 0 !== a && a
            };
            r.telnyx_call_control_id && (d.telnyxCallControlId = r.telnyx_call_control_id), r.telnyx_session_id && (d.telnyxSessionId = r.telnyx_session_id), r.telnyx_leg_id && (d.telnyxLegId = r.telnyx_leg_id), r.client_state && (d.clientState = r.client_state), r.dialogParams && r.dialogParams.custom_headers && r.dialogParams.custom_headers.length && (d.customHeaders = r.dialogParams.custom_headers);
            const l = new ct(i, d);
            return l.nodeId = this.nodeId, l;
        }, f = new re(a), m = new ce(a);
        switch(o){
            case M.Ping:
                this.session.setPingReceived(), this.session.execute(m).then(()=>{
                    pt.receivedAuthenticationRequired = 0;
                }).catch((e)=>t(this, void 0, void 0, function*() {
                        e.code === this.session.authenticationRequiredErrorCode && (pt.receivedAuthenticationRequired += 1, pt.receivedAuthenticationRequired > 1 && this.session.hasAutoReconnect() && (v.warn("Ping failed twice with Authentication Required. Re-logging in..."), k(this.session.options) ? this.handleLogin() : E(this.session.options) && this.handleAnonymousLogin()));
                    }));
                break;
            case M.Punt:
                if (p) return void v.info(`[${(new Date).toISOString()}][${c}] Ignoring PUNT due to keepConnectionAliveOnSocketClose`);
                i.disconnect();
                break;
            case M.Invite:
                {
                    const e = g();
                    e.playRingtone(), e.setState(U.Ringing), e.direction = P.Inbound, this._ack(s, o);
                    break;
                }
            case M.Attach:
                {
                    if (p) return void this.session.execute(new je({
                        sessid: this.session.sessionid,
                        sdp: this.session.calls[c].peer.instance.localDescription.sdp,
                        dialogParams: this.session.calls[c].options,
                        "User-Agent": `Web-${ut}`
                    }));
                    v.info(`[${(new Date).toISOString()}][${c}] Re-creating call instance.`);
                    const t = g();
                    this.session.autoRecoverCalls ? t.answer() : t.setState(U.Recovering), t.handleMessage(e);
                    break;
                }
            case M.Event:
            case "webrtc.event":
                if (!d) return void v.error("Verto received an unknown event:", r);
                const n1 = i.relayProtocol, a1 = d.split(".")[0];
                i._existsSubscription(n1, d) ? Q(n1, r, d) : d === i.sessionid ? this._handleSessionEvent(r.eventData) : i._existsSubscription(n1, a1) ? Q(n1, r, a1) : i.calls.hasOwnProperty(d) ? i.calls[d].handleMessage(e) : Q(u.Notification, r, i.uuid);
                break;
            case M.Info:
                r.type = N.generic, Q(u.Notification, r, i.uuid);
                break;
            case M.ClientReady:
                this.session.execute(f);
                break;
            default:
                {
                    const t = T(e);
                    if (t) {
                        switch(t){
                            case G.REGISTER:
                            case G.REGED:
                                i.connection.previousGatewayState !== G.REGED && i.connection.previousGatewayState !== G.REGISTER && (this.session._triggerKeepAliveTimeoutCheck(), pt.retriedRegister = 0, r.type = N.vertoClientReady, Q(u.Ready, r, i.uuid), i.options.trickleIce && (v.debug("Trickle ICE is enabled. Checking Gateway support"), this.session.execute(new Fe({
                                    candidate: ""
                                })).catch((e)=>{
                                    e.code === this.session.invalidMethodErrorCode ? (console.warn("Trickle ICE is not supported by the server, disabling it."), v.debug("Trickle ICE check error:", JSON.stringify(e, null, 2)), i.options.trickleIce = !1) : v.debug("Trickle ICE check:", JSON.stringify(e, null, 2));
                                })));
                                break;
                            case G.UNREGED:
                            case G.NOREG:
                                if (pt.retriedRegister += 1, 5 === pt.retriedRegister) {
                                    pt.retriedRegister = 0, Q(u.Error, {
                                        error: new lt("Fail to register the user, the server tried 5 times", "UNREGED|NOREG"),
                                        sessionId: i.sessionid
                                    }, i.uuid);
                                    break;
                                }
                                setTimeout(()=>{
                                    this.session.execute(f);
                                }, this.reconnectDelay());
                                break;
                            case G.FAILED:
                            case G.FAIL_WAIT:
                                if (i.connection.previousGatewayState !== G.FAILED && i.connection.previousGatewayState !== G.FAIL_WAIT) {
                                    if (!this.session.hasAutoReconnect()) {
                                        pt.retriedConnect = 0, Q(u.Error, {
                                            error: new lt("Fail to connect the server, the server tried 5 times", "FAILED|FAIL_WAIT"),
                                            sessionId: i.sessionid
                                        }, i.uuid);
                                        break;
                                    }
                                    if (pt.retriedConnect += 1, 5 === pt.retriedConnect) {
                                        pt.retriedConnect = 0, Q(u.Error, {
                                            error: new Error("Connection Retry Failed"),
                                            sessionId: i.sessionid
                                        }, i.uuid);
                                        break;
                                    }
                                    setTimeout(()=>{
                                        this.session.disconnect().then(()=>{
                                            this.session.clearConnection(), this.session.connect();
                                        });
                                    }, this.reconnectDelay());
                                }
                                break;
                            default:
                                v.warn("GatewayState message unknown method:", e);
                        }
                        break;
                    }
                    v.debug("Verto message unknown method:", e);
                    break;
                }
        }
    }
    _retrieveCallId(e, t) {
        const n = Object.keys(this.session.calls);
        if ("bootObj" !== e.action) return n.find((e)=>this.session.calls[e].channels.includes(t));
        {
            const t = e.data.find((e)=>n.includes(e[0]));
            if (t instanceof Array) return t[0];
        }
    }
    _handlePvtEvent(e) {
        return t(this, void 0, void 0, function*() {
            const { session: t } = this, n = t.relayProtocol, { action: i, laChannel: s, laName: o, chatChannel: r, infoChannel: a, modChannel: c, conferenceMemberID: d, role: l, callID: h } = e;
            switch(i){
                case "conference-liveArray-join":
                    {
                        const n = ()=>{
                            t.vertoBroadcast({
                                nodeId: this.nodeId,
                                channel: s,
                                data: {
                                    liveArray: {
                                        command: "bootstrap",
                                        context: s,
                                        name: o
                                    }
                                }
                            });
                        }, i = {
                            nodeId: this.nodeId,
                            channels: [
                                s
                            ],
                            handler: ({ data: i })=>{
                                const r = h || this._retrieveCallId(i, s);
                                if (r && t.calls.hasOwnProperty(r)) {
                                    const a = t.calls[r];
                                    a._addChannel(s), a.extension = o, a.handleConferenceUpdate(i, e).then((e)=>{
                                        "INVALID_PACKET" === e && n();
                                    });
                                }
                            }
                        }, r = yield t.vertoSubscribe(i).catch((e)=>{
                            v.error("liveArray subscription error:", e);
                        });
                        we(r, s) && n();
                        break;
                    }
                case "conference-liveArray-part":
                    {
                        let e = null;
                        if (s && t._existsSubscription(n, s)) {
                            const { callId: i = null } = t.subscriptions[n][s];
                            if (e = t.calls[i] || null, null !== i) {
                                const n = {
                                    type: N.conferenceUpdate,
                                    action: $.Leave,
                                    conferenceName: o,
                                    participantId: Number(d),
                                    role: l
                                };
                                Q(u.Notification, n, i, !1) || Q(u.Notification, n, t.uuid), null === e && K(u.Notification, null, i);
                            }
                        }
                        const i = [
                            s,
                            r,
                            a,
                            c
                        ];
                        t.vertoUnsubscribe({
                            nodeId: this.nodeId,
                            channels: i
                        }).then(({ unsubscribedChannels: t = [] })=>{
                            e && (e.channels = e.channels.filter((e)=>!t.includes(e)));
                        }).catch((e)=>{
                            v.error("liveArray unsubscribe error:", e);
                        });
                        break;
                    }
            }
        });
    }
    _handleSessionEvent(e) {
        switch(e.contentType){
            case "layout-info":
            case "layer-info":
                Ke(this.session, e);
                break;
            case "logo-info":
                {
                    const t = {
                        type: N.conferenceUpdate,
                        action: $.LogoInfo,
                        logo: e.logoURL
                    };
                    Q(u.Notification, t, this.session.uuid);
                    break;
                }
        }
    }
}
pt.retriedConnect = 0, pt.retriedRegister = 0, pt.receivedAuthenticationRequired = 0;
class gt extends dt {
    constructor(e){
        super(e), this.relayProtocol = "verto-protocol", this.timeoutErrorCode = -329990, this.handleLoginOnSocketOpen = ()=>t(this, void 0, void 0, function*() {
                this._idle = !1;
                const { login: e, password: t, passwd: n, login_token: i, userVariables: s, autoReconnect: o = !0 } = this.options, r = new Me(e, t || n, i, this.sessionid, s, !!O()), a = yield this.execute(r).catch(this._handleLoginError);
                a && (this._autoReconnect = o, this.sessionid = a.sessid);
            }), this.handleAnonymousLoginOnSocketOpen = ()=>t(this, void 0, void 0, function*() {
                this._idle = !1;
                const { anonymous_login: e } = this.options, t = new ht({
                    target_id: e.target_id,
                    target_type: e.target_type,
                    target_version_id: e.target_version_id,
                    sessionId: this.sessionid,
                    userVariables: this.options.userVariables,
                    reconnection: !!O()
                }), n = yield this.execute(t).catch(this._handleLoginError);
                n && (this.sessionid = n.sessid);
            }), window.addEventListener("beforeunload", (e)=>{
            this.calls && Object.keys(this.calls).forEach((e)=>{
                this.calls[e] && (v.info(`Hanging up call due to page unload: ${e}`), this.calls[e].hangup({}, !0));
            });
        });
    }
    validateOptions() {
        return k(this.options) || E(this.options);
    }
    newCall(e) {
        if (!this.validateCallOptions(e)) throw new Error("Verto.newCall() error: destinationNumber is required.");
        performance.mark("new-call-start");
        const t = new ct(this, e);
        return t.invite(), performance.mark("new-call-end"), t;
    }
    broadcast(e) {
        return this.vertoBroadcast(e);
    }
    subscribe(e) {
        return this.vertoSubscribe(e);
    }
    unsubscribe(e) {
        return this.vertoUnsubscribe(e);
    }
    validateCallOptions(e) {
        return !!E(this.options) || Boolean(e.destinationNumber);
    }
    _onSocketOpen() {
        return t(this, void 0, void 0, function*() {
            return k(this.options) ? this.handleLoginOnSocketOpen() : E(this.options) ? this.handleAnonymousLoginOnSocketOpen() : void 0;
        });
    }
    _onSocketMessage(e) {
        new pt(this).handleMessage(e);
    }
}
class ft extends gt {
    constructor(e){
        super(e), console.log(`SDK version: ${Le}`);
    }
    newCall(e) {
        return super.newCall(e);
    }
    static webRTCInfo() {
        return Te();
    }
    static webRTCSupportedBrowserList() {
        return [
            {
                operationSystem: "Android",
                supported: [
                    {
                        browserName: "Chrome",
                        features: [
                            "audio"
                        ],
                        supported: Re.full
                    },
                    {
                        browserName: "Firefox",
                        features: [
                            "audio"
                        ],
                        supported: Re.partial
                    },
                    {
                        browserName: "Safari",
                        supported: Re.not_supported
                    },
                    {
                        browserName: "Edge",
                        supported: Re.not_supported
                    }
                ]
            },
            {
                operationSystem: "iOS",
                supported: [
                    {
                        browserName: "Chrome",
                        supported: Re.not_supported
                    },
                    {
                        browserName: "Firefox",
                        supported: Re.not_supported
                    },
                    {
                        browserName: "Safari",
                        features: [
                            "video",
                            "audio"
                        ],
                        supported: Re.full
                    },
                    {
                        browserName: "Edge",
                        supported: Re.not_supported
                    }
                ]
            },
            {
                operationSystem: "Linux",
                supported: [
                    {
                        browserName: "Chrome",
                        features: [
                            "video",
                            "audio"
                        ],
                        supported: Re.full
                    },
                    {
                        browserName: "Firefox",
                        features: [
                            "audio"
                        ],
                        supported: Re.partial
                    },
                    {
                        browserName: "Safari",
                        supported: Re.not_supported
                    },
                    {
                        browserName: "Edge",
                        supported: Re.not_supported
                    }
                ]
            },
            {
                operationSystem: "MacOS",
                supported: [
                    {
                        browserName: "Chrome",
                        features: [
                            "video",
                            "audio"
                        ],
                        supported: Re.full
                    },
                    {
                        browserName: "Firefox",
                        features: [
                            "audio"
                        ],
                        supported: Re.partial
                    },
                    {
                        browserName: "Safari",
                        features: [
                            "video",
                            "audio"
                        ],
                        supported: Re.full
                    },
                    {
                        browserName: "Edge",
                        features: [
                            "audio"
                        ],
                        supported: Re.partial
                    }
                ]
            },
            {
                operationSystem: "Windows",
                supported: [
                    {
                        browserName: "Chrome",
                        features: [
                            "video",
                            "audio"
                        ],
                        supported: Re.full
                    },
                    {
                        browserName: "Firefox",
                        features: [
                            "audio"
                        ],
                        supported: Re.partial
                    },
                    {
                        browserName: "Safari",
                        supported: Re.not_supported
                    },
                    {
                        browserName: "Edge",
                        features: [
                            "audio"
                        ],
                        supported: Re.partial
                    }
                ]
            }
        ];
    }
}
class vt {
    static run(e) {
        return t(this, void 0, void 0, function*() {
            const t = R({}), n = R({}), i = new ft(e.credentials);
            yield i.connect(), i.on(u.Ready, t.resolve), i.on(u.Error, t.reject), i.on(u.MediaError, t.reject), i.on(u.MediaError, t.reject), i.on(u.Notification, (e)=>{
                e.call && e.call.sipCode >= 400 && n.reject(new Error(e.call.sipReason));
            }), W(u.StatsReport, (e)=>{
                n.resolve(vt.mapReport(e));
            }), yield t.promise, yield i.newCall({
                destinationNumber: e.texMLApplicationNumber,
                debug: !0
            });
            const s = yield n.promise;
            return yield i.disconnect(), s;
        });
    }
    static mapReport(e) {
        var t, n, i, s, o, r, a, c, d, l, h, u, p;
        const g = [], f = [];
        for (const t of e)switch(t.event){
            case "onicecandidate":
                t.data && g.push(t.data);
                break;
            case "stats":
                f.push(t.data);
        }
        let v = 0, m = 1 / 0, b = -1 / 0, _ = 0, y = 1 / 0, w = -1 / 0, S = 0;
        f.forEach((e)=>{
            var t, n, i;
            if (!(null === (t = e.remote.audio.inbound) || void 0 === t ? void 0 : t[0])) return;
            v += 1;
            const s = null !== (n = e.remote.audio.inbound[0].jitter) && void 0 !== n ? n : 0, o = null !== (i = e.remote.audio.inbound[0].roundTripTime) && void 0 !== i ? i : 0;
            _ += s, S += o, b = Math.max(b, s), m = Math.min(m, s), w = Math.max(w, o), y = Math.min(y, o);
        });
        const I = S / v, C = _ / v, k = f[f.length - 1], E = Ze({
            jitter: 1e3 * C,
            rtt: 1e3 * I,
            packetsReceived: null !== (i = null === (n = null === (t = k.audio.inbound) || void 0 === t ? void 0 : t[0]) || void 0 === n ? void 0 : n.packetsReceived) && void 0 !== i ? i : 0,
            packetsLost: null !== (r = null === (o = null === (s = k.audio.inbound) || void 0 === s ? void 0 : s[0]) || void 0 === o ? void 0 : o.packetsLost) && void 0 !== r ? r : 0
        });
        return {
            iceCandidatePairStats: f[f.length - 1].connection,
            summaryStats: {
                mos: E,
                jitter: {
                    average: C,
                    max: b,
                    min: m
                },
                rtt: {
                    average: I,
                    max: w,
                    min: y
                },
                quality: et(E)
            },
            sessionStats: {
                packetsSent: null !== (a = k.connection.packetsSent) && void 0 !== a ? a : 0,
                bytesSent: null !== (c = k.connection.bytesSent) && void 0 !== c ? c : 0,
                bytesReceived: null !== (d = k.connection.bytesReceived) && void 0 !== d ? d : 0,
                packetsLost: null !== (u = null === (h = null === (l = k.remote.audio.inbound) || void 0 === l ? void 0 : l[0]) || void 0 === h ? void 0 : h.packetsLost) && void 0 !== u ? u : 0,
                packetsReceived: null !== (p = k.connection.packetsReceived) && void 0 !== p ? p : 0
            },
            iceCandidateStats: g
        };
    }
    getTelnyxIds() {
        return {
            telnyxCallControlId: "",
            telnyxSessionId: "",
            telnyxLegId: ""
        };
    }
}
;
}),
]);

//# sourceMappingURL=6ef68_%40telnyx_webrtc_lib_bundle_mjs_30d1b3e9._.js.map