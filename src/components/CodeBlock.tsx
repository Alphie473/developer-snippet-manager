import React, { useEffect } from 'react';
// prismjs does not include TypeScript declarations.
// @ts-expect-error Missing declaration file for prismjs.
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme style for Prism, or choose another theme
// Import languages you want to support (e.g., javascript, python, css, sql)
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  return (
    <pre className={`language-${language || 'javascript'} rounded-lg p-4 text-sm overflow-x-auto`}>
      <code className={`language-${language || 'javascript'}`}>
        {code}
      </code>
    </pre>
  );
}