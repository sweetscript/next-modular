interface SlugPageProps {
  params?: Record<string, string>;
}

export default function StaticTestSlugPage({ params }: SlugPageProps) {
  const slug = params?.slug ?? '';
  return (
    <div>
      <h1>Static Test Page</h1>
      <p data-testid="route-param">{slug}</p>
    </div>
  );
}
