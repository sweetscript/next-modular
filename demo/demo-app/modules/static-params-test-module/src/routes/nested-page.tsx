interface NestedPageProps {
  params?: Record<string, string>;
}

export default function StaticTestNestedPage({ params }: NestedPageProps) {
  const segments = params?.segments ?? '';
  return (
    <div>
      <h1>Static Test Nested Page</h1>
      <p data-testid="route-param">{segments}</p>
    </div>
  );
}
