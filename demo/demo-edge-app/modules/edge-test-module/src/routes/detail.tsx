interface DetailPageProps {
  params?: Record<string, string>;
}

export default function EdgeTestDetailPage({ params }: DetailPageProps) {
  const id = params?.id ?? '';
  return (
    <div>
      <h1>Edge Test Detail</h1>
      <p data-testid="route-param">{id}</p>
    </div>
  );
}
