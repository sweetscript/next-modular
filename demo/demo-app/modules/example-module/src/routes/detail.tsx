import React from 'react';
import Link from 'next/link';

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default function ExampleModuleDetailPage({ params }: DetailPageProps) {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link 
        href="/example-module"
        style={{ 
          color: '#0070f3', 
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '1rem'
        }}
      >
        ← Back to ExampleModule
      </Link>
      
      <h1 style={{ marginBottom: '1.5rem', color: '#0070f3' }}>
        ExampleModule - Detail View
      </h1>
      
      <div style={{ padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0070f3' }}>
        <h2 style={{ marginBottom: '1rem', color: '#0070f3' }}>Dynamic Route Parameter</h2>
        <p style={{ marginBottom: '0.5rem' }}>
          <strong>ID:</strong> <code style={{ padding: '0.25rem 0.5rem', backgroundColor: '#fff', borderRadius: '4px' }}>{params.id}</code>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
          This page demonstrates a dynamic route pattern: <code>/[id]</code>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          The ID parameter is extracted from the URL and can be used to fetch data, 
          display specific content, or perform any logic based on the route.
        </p>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>What you can do here:</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>Fetch data based on the ID parameter</li>
          <li>Display item-specific information</li>
          <li>Implement CRUD operations</li>
          <li>Handle loading and error states</li>
        </ul>
      </div>
    </div>
  );
}
