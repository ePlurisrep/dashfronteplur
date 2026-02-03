'use client';

import { useState, useTransition } from 'react';
import { Upload, Link as LinkIcon, File as FileIcon, X } from 'lucide-react';

export default function UploadPage() {
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setMessage('');
  };

  const handleUploadTypeChange = (type: 'file' | 'url') => {
    setUploadType(type);
    setFile(null);
    setUrl('');
    setMessage('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Ingesting data...');

    startTransition(async () => {
      let source = '';
      let data: any = null;

      if (uploadType === 'file' && file) {
        source = 'pdf';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          data = reader.result;
          const response = await fetch('/api/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source, data }),
          });
          const result = await response.json();
          setMessage(result.message || result.error);
          setFile(null); 
        };
      } else if (uploadType === 'url' && url) {
        source = 'pdf';
        data = url;
        const response = await fetch('/api/ingest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, data }),
        });
        const result = await response.json();
        setMessage(result.message || result.error);
        setUrl('');
      }
    });
  };


  return (
    <main 
      className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-2xl p-8 transition-all duration-300"
        >
          <div className="mb-6 text-center">
            <div className="inline-block bg-blue-600 rounded-full p-3 shadow-lg">
                <Upload className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">Ingest Data</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Upload a PDF file or provide a URL.</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-200 dark:bg-gray-700/50 p-1">
            <button
              type="button"
              onClick={() => handleUploadTypeChange('file')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${uploadType === 'file' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50'}`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => handleUploadTypeChange('url')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${uploadType === 'url' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600/50'}`}
            >
              From URL
            </button>
          </div>

          {uploadType === 'file' && (
            <div className="relative">
                <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileIcon className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"/>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 800x400px)</p>
                    </div>
                    <input id="file-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} accept=".pdf"/>
                </label>
                {file && (
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-2">
                        <span>{file.name}</span>
                        <button type="button" onClick={() => setFile(null)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
          )}

          {uploadType === 'url' && (
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="url"
                placeholder="https://example.com/document.pdf"
                value={url}
                onChange={handleUrlChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending || (uploadType === 'file' && !file) || (uploadType === 'url' && !url)}
            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isPending ? 'Ingesting...' : 'Ingest Data'}
          </button>

          {message && (
            <p className={`mt-4 text-center text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
