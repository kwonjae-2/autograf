/**
 * Raw Data Viewer Component
 */

import { useState } from 'react';
import type { QueryResult } from '../../types';

interface RawDataViewerProps {
  data: QueryResult;
  className?: string;
}

export function RawDataViewer({ data, className = '' }: RawDataViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          원본 데이터 (JSON)
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="relative">
          <pre className="p-4 bg-gray-900 text-gray-100 text-xs overflow-x-auto max-h-96">
            <code>{jsonString}</code>
          </pre>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(jsonString);
            }}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
          >
            복사
          </button>
        </div>
      )}
    </div>
  );
}
