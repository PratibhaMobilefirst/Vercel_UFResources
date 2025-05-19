import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Trash2 } from 'lucide-react';

interface PlaceholderProps {
  node: any;
  updateAttributes: (attrs: any) => void;
  deleteNode: () => void;
}

let placeholderCounter = 1;

const PlaceholderComponent: React.FC<PlaceholderProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(props.node.attrs.value || `Placeholder ${placeholderCounter}`);
  const [showInput, setShowInput] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!props.node.attrs.value) {
      props.updateAttributes({ value: `Placeholder ${placeholderCounter}` });
      placeholderCounter++;
    }
  }, []);

  const handleDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.placeholder-input-popup')) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setInputPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY
    });
    setShowInput(true);
    setValue(props.node.attrs.value);
  };

  const handleSave = () => {
    props.updateAttributes({ value });
    setShowInput(false);
    window.dispatchEvent(new CustomEvent('placeholderValueChange', { detail: value }));
  };

  const handleCancel = () => {
    setShowInput(false);
    setValue(props.node.attrs.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <>
      <span
        className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded cursor-pointer hover:bg-blue-100"
        onClick={handlePlaceholderClick}
      >
        {value}
      </span>
      {showInput && (
        <div
          className="placeholder-input-popup fixed bg-white shadow-lg rounded-lg border border-gray-200 p-2 z-50"
          style={{
            left: inputPosition.x + 'px',
            top: inputPosition.y + 'px',
          }}
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border border-gray-300 rounded px-2 py-1 text-sm min-w-[200px]"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1 hover:bg-green-50 rounded-full"
            >
              <Check className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-red-50 rounded-full"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Sidebar component for displaying placeholders
export const PlaceholderSidebar = ({ editor }: { editor: any }) => {
  const [placeholders, setPlaceholders] = useState<any[]>([]);

  useEffect(() => {
    const updatePlaceholders = () => {
      if (!editor) return;
      
      const newPlaceholders: any[] = [];
      editor.state.doc.descendants((node: any, pos: number) => {
        if (node.type.name === 'placeholder') {
          newPlaceholders.push({ value: node.attrs.value, pos });
        }
      });
      setPlaceholders(newPlaceholders);
    };

    updatePlaceholders();
    editor.on('update', updatePlaceholders);
    return () => editor.off('update', updatePlaceholders);
  }, [editor]);

  const handleEdit = (pos: number) => {
    editor.commands.setNodeSelection(pos);
    const node = editor.state.doc.nodeAt(pos);
    if (node) {
      const domNode = editor.view.nodeDOM(pos);
      if (domNode) {
        (domNode as HTMLElement).click();
      }
    }
  };

  const handleDelete = (pos: number) => {
    editor.chain().focus().deleteRange({ from: pos, to: pos + 1 }).run();
  };

  return (
    <div className="space-y-2">
      {placeholders.map((ph, index) => (
        <div
          key={ph.pos}
          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 group"
        >
          <span className="text-sm text-gray-700">{ph.value}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(ph.pos)}
              className="p-1 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => handleDelete(ph.pos)}
              className="p-1 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const PlaceholderExtension = Node.create({
  name: 'placeholder',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      value: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-placeholder]'
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-placeholder': 'true' }),
      HTMLAttributes.value || '{placeholder}'
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PlaceholderComponent);
  },
});

export default PlaceholderExtension; 