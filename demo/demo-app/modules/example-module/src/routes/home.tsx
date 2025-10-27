'use client';

import React from 'react';
import Link from 'next/link';

export default function ExampleModuleHomePage() {
  const exampleItems = [
    { id: '123', name: 'Item 123' },
    { id: 'user-42', name: 'User 42' },
    { id: 'abc-xyz', name: 'ABC XYZ' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#0070f3' }}>
        ExampleModule Module
      </h1>
      <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
        Welcome to the example-module module!
      </p>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0070f3' }}>
        <h2 style={{ marginBottom: '1rem', color: '#0070f3' }}>Dynamic Routes</h2>
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Click on any link below to see the dynamic route in action:
        </p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {exampleItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
              <Link 
                href={`/example-module/${item.id}`}
                style={{ 
                  color: '#0070f3', 
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  display: 'block',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f3ff'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <strong>{item.name}</strong>
                <code style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                  /example-module/{item.id}
                </code>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Getting Started</h2>
        <ul style={{ lineHeight: '2' }}>
          <li>Customize this page in <code>src/routes/home.tsx</code></li>
          <li>Add more routes in the module definition</li>
          <li>Configure the module in your app's <code>modules.config.ts</code></li>
        </ul>
      </div>
    </div>
  );
}
