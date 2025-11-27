import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { Handle, Position } from 'reactflow';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { carbonColors, carbonSpacing } from '../../../styles/carbonTheme';

const NodeContainer = styled.div`
  background: ${carbonColors.layer01};
  border: 2px solid ${props => props.$selected ? carbonColors.interactive01 : '#f1c21b'};
  border-radius: 8px;
  padding: ${carbonSpacing.spacing03};
  min-width: 280px;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.15s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${carbonSpacing.spacing02};
  margin-bottom: ${carbonSpacing.spacing02};
`;

const NodeIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #f1c21b;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #161616;
  font-size: 0.75rem;
  font-weight: 600;
`;

const NodeTitleInput = styled.input`
  flex: 1;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${carbonColors.text01};
  background: transparent;
  border: none;
  padding: 2px 4px;
  border-radius: 2px;

  &:hover {
    background: ${carbonColors.field01};
  }

  &:focus {
    outline: 2px solid ${carbonColors.focus};
    background: ${carbonColors.field01};
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: ${carbonColors.text02};
  cursor: pointer;
  padding: 2px;
  font-size: 0.75rem;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${NodeContainer}:hover & {
    opacity: 1;
  }

  &:hover {
    color: ${carbonColors.supportError};
  }
`;

const Toolbar = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: ${carbonSpacing.spacing02};
  padding-bottom: ${carbonSpacing.spacing02};
  border-bottom: 1px solid ${carbonColors.ui04};
  flex-wrap: wrap;
`;

const ToolbarButton = styled.button`
  padding: 4px 6px;
  background: ${props => props.$active ? carbonColors.layer02 : 'transparent'};
  border: 1px solid ${props => props.$active ? carbonColors.interactive01 : carbonColors.ui04};
  border-radius: 3px;
  color: ${props => props.$active ? carbonColors.text01 : carbonColors.text02};
  cursor: pointer;
  font-size: 0.625rem;
  font-weight: ${props => props.$active ? 600 : 400};
  transition: all 0.15s ease;

  &:hover {
    background: ${carbonColors.hoverUI};
  }
`;

const EditorWrapper = styled.div`
  .ProseMirror {
    min-height: 100px;
    max-height: 200px;
    overflow-y: auto;
    padding: ${carbonSpacing.spacing02};
    background: ${carbonColors.field01};
    border: 1px solid ${carbonColors.ui04};
    border-radius: 4px;
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${carbonColors.text01};

    &:focus {
      outline: 2px solid ${carbonColors.focus};
      outline-offset: -2px;
    }

    p {
      margin: 0 0 0.5em 0;

      &:last-child {
        margin-bottom: 0;
      }
    }

    h1, h2, h3 {
      margin: 0.5em 0;
      font-weight: 600;
    }

    h1 {
      font-size: 1.25rem;
    }

    h2 {
      font-size: 1.1rem;
    }

    h3 {
      font-size: 1rem;
    }

    ul, ol {
      margin: 0.5em 0;
      padding-left: 1.5em;
    }

    li {
      margin: 0.25em 0;
    }

    a {
      color: ${carbonColors.link01};
      text-decoration: underline;
    }

    strong {
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    code {
      background: ${carbonColors.ui03};
      padding: 0.1em 0.3em;
      border-radius: 2px;
      font-family: monospace;
      font-size: 0.75rem;
    }

    blockquote {
      border-left: 3px solid ${carbonColors.ui04};
      padding-left: 1em;
      margin: 0.5em 0;
      color: ${carbonColors.text02};
    }

    .is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: ${carbonColors.text03};
      pointer-events: none;
      height: 0;
    }
  }
`;

const handleStyle = {
  background: '#f1c21b',
  width: 10,
  height: 10,
  border: '2px solid white',
};

function TextNode({ data, selected }) {
  const [title, setTitle] = React.useState(data.title || 'Note');

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content: data.content || '',
    onUpdate: ({ editor }) => {
      if (data.onDataChange && data.id) {
        data.onDataChange(data.id, {
          title,
          content: editor.getHTML(),
        });
      }
    },
  });

  // Update parent data when title changes
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
    if (data.onDataChange && data.id) {
      data.onDataChange(data.id, {
        title: e.target.value,
        content: editor?.getHTML() || '',
      });
    }
  }, [data, editor]);

  // Handle node delete
  const handleDelete = (e) => {
    e.stopPropagation();
    if (data.onDelete && data.id) {
      data.onDelete(data.id);
    }
  };

  // Add link
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <NodeContainer $selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
      />

      <NodeHeader>
        <NodeIcon>N</NodeIcon>
        <NodeTitleInput
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="nodrag"
        />
        <DeleteButton onClick={handleDelete} title="Delete node">
          X
        </DeleteButton>
      </NodeHeader>

      <Toolbar className="nodrag">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          $active={editor.isActive('bold')}
          title="Bold"
        >
          B
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          $active={editor.isActive('italic')}
          title="Italic"
        >
          I
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          $active={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          $active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          $active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          List
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          $active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          1.
        </ToolbarButton>
        <ToolbarButton
          onClick={setLink}
          $active={editor.isActive('link')}
          title="Link"
        >
          Link
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          $active={editor.isActive('code')}
          title="Code"
        >
          Code
        </ToolbarButton>
      </Toolbar>

      <EditorWrapper className="nodrag">
        <EditorContent editor={editor} />
      </EditorWrapper>

      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
      />
    </NodeContainer>
  );
}

export default memo(TextNode);
