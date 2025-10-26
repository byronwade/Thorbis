"use client";

export default function AILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="fixed inset-0 top-[5.5rem] overflow-hidden lg:left-64">
      {children}
    </div>
  );
}
