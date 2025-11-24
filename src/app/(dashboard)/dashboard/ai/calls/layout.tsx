// Parent /dashboard/ai/layout.tsx already provides SectionLayout
// This layout just passes children through
export default function AICallsLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
