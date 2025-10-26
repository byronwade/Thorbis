"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <h2
        style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "bold" }}
      >
        404 - Page Not Found
      </h2>
      <p style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        Could not find the requested resource
      </p>
      <Link
        href="/"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#3b82f6",
          color: "white",
          borderRadius: "0.25rem",
          textDecoration: "none",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
