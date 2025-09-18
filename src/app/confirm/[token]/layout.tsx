// Layout component to handle generateStaticParams for static export
export async function generateStaticParams() {
  // Provide static fallback parameters for build process
  // These will be used during static generation, but dynamic tokens will still work at runtime
  return [
    { token: "fallback-1" },
    { token: "fallback-2" },
    { token: "fallback-3" },
    { token: "sample-token" },
    { token: "test-token" },
  ];
}

export default function ConfirmTokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
