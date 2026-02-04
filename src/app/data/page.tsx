"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, FileUp, Link as LinkIcon } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';

interface IngestedData {
  id: string;
  source: string;
  data: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function DataPage() {
  const [data, setData] = useState<IngestedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await httpClient.get<{ data: IngestedData[] }>('/api/data');
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const renderSourceIcon = (source: string) => {
    switch (source) {
      case 'pdf':
        return <LinkIcon className="h-5 w-5 text-gray-500" />;
      case 'text':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <FileUp className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="loader h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading ingested data...</p>
      </div>
    );
  }

  return (
    <main
      className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 md:p-8"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ingested Data</h1>
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
            <FileUp className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h2 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-200">No Data Yet</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You haven&apos;t ingested any data. Go to the upload page to get started.
            </p>
            <Link
              href="/upload"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:bg-blue-700 hover:scale-105"
            >
              Go to Upload
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <div
                key={item.id}
                className="transform-gpu rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {renderSourceIcon(item.source)}
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {item.source.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(item.createdAt.seconds * 1000).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-4 overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-900/50 p-3">
                    <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-all">
                      {item.source === 'pdf' ? 'PDF content stored as Base64' : item.data}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
