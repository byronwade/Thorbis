export default function AILayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="h-full w-full">{children}</div>;
}
