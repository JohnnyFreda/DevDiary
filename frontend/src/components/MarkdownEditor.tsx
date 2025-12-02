import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');

  return (
    <div className="w-full" data-color-mode="light">
      <div className="mb-2 flex gap-2">
        <button
          type="button"
          onClick={() => setViewMode('edit')}
          className={`px-3 py-1 text-sm rounded ${
            viewMode === 'edit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setViewMode('preview')}
          className={`px-3 py-1 text-sm rounded ${
            viewMode === 'preview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setViewMode('split')}
          className={`px-3 py-1 text-sm rounded ${
            viewMode === 'split'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Split
        </button>
      </div>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview={viewMode === 'edit' ? 'edit' : viewMode === 'preview' ? 'preview' : 'live'}
        hideToolbar={false}
      />
    </div>
  );
}

