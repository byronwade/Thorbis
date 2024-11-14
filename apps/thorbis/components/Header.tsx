import Link from "next/link";

export function Header() {
	return (
		<header className="border-b">
			<div className="flex h-16 items-center px-4">
				<Link href="/" className="font-bold">
					Thorbis CMS
				</Link>
			</div>
		</header>
	);
}
