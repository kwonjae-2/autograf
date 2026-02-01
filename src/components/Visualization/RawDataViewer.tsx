/**
 * Raw Data Viewer
 */

import { useState } from 'react';
import type { QueryResult } from '../../types';

interface RawDataViewerProps {
  data: QueryResult;
}

export function RawDataViewer({ data }: RawDataViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <span className="text-sm text-slate-400">Raw JSON</span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="relative border-t border-slate-800">
          <pre className="p-4 text-xs font-mono text-slate-400 overflow-x-auto max-h-80 scrollbar-thin">
            {jsonString}
          </pre>
          <button
            type="button"
            onClick={() => void navigator.clipboard.writeText(jsonString)}
            className="absolute top-2 right-2 px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded hover:bg-slate-700 hover:text-slate-300"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
