var e,
	t,
	r = require("@radix-ui/react-use-layout-effect").useLayoutEffect,
	u =
		((e = {}),
		(t = require("react")),
		Object.keys(t).forEach((r) => {
			"default" !== r &&
				"__esModule" !== r &&
				Object.defineProperty(e, r, { enumerable: !0, get: () => t[r] });
		}),
		e);
const n = u["useId".toString()] || (() => {});
let c = 0;
(exports.useId = (e) => {
	const [t, o] = u.useState(n());
	return (
		r(() => {
			e || o((e) => (null != e ? e : String(c++)));
		}, [e]),
		e || (t ? `radix-${t}` : "")
	);
}),
	(exports.IdProvider = ({ children: e }) => (
		u.useEffect(() => {
			0;
		}, []),
		/*#__PURE__*/ u.createElement(u.Fragment, null, e)
	));
//# sourceMappingURL=index.js.map
