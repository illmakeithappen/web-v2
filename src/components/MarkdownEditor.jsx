import React, { useRef, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import styled from 'styled-components';

const EditorWrapper = styled.div`
  width: 100%;
  height: ${props => props.height || '600px'};

  .toastui-editor-defaultUI {
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .toastui-editor-toolbar {
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }

  .toastui-editor-main {
    height: calc(${props => props.height || '600px'} - 50px);
  }
`;

const MarkdownEditor = ({
  initialValue = '',
  onChange,
  onSave,
  height = '600px',
  placeholder = 'Enter your markdown content here...'
}) => {
  const editorRef = useRef();

  useEffect(() => {
    if (editorRef.current && initialValue) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setMarkdown(initialValue);
    }
  }, [initialValue]);

  const handleChange = () => {
    if (editorRef.current && onChange) {
      const editorInstance = editorRef.current.getInstance();
      const markdown = editorInstance.getMarkdown();
      onChange(markdown);
    }
  };

  const handleKeyDown = (event) => {
    // Cmd+S (Mac) or Ctrl+S (Windows/Linux) to save
    if ((event.metaKey || event.ctrlKey) && event.key === 's') {
      event.preventDefault();
      if (onSave && editorRef.current) {
        const editorInstance = editorRef.current.getInstance();
        const markdown = editorInstance.getMarkdown();
        onSave(markdown);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSave]);

  return (
    <EditorWrapper height={height}>
      <Editor
        ref={editorRef}
        initialValue={initialValue}
        placeholder={placeholder}
        previewStyle="vertical"
        height={height}
        initialEditType="markdown"
        useCommandShortcut={true}
        usageStatistics={false}
        onChange={handleChange}
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'link', 'code', 'codeblock'],
          ['scrollSync']
        ]}
      />
    </EditorWrapper>
  );
};

export default MarkdownEditor;
