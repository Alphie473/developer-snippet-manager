import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Dark theme style for Prism, or choose another theme
// Import languages you want to support (e.g., javascript, python, css, sql)
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-json';

export default function CodeBlock({ code, language }) {
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