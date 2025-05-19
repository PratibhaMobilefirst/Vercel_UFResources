import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderAsync } from 'docx-preview';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Image as ImageIcon,
  AlignLeft,
  Send,
  Save,
  Eraser,
  MoveRight
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PlaceholderExtension, { PlaceholderSidebar } from './PlaceholderExtension';
import { Mark, mergeAttributes } from '@tiptap/core';
import UnderlineExtension from '@tiptap/extension-underline';

const HighlightMark = Mark.create({
  name: 'highlightMark',
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-highlight-mark]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-highlight-mark': 'true',
        style: 'background-color: #e0e7ff;', // sky blue
      }),
      0,
    ];
  },
});


interface DocumentEditorProps {
  onBack: () => void;
  initialFile?: File | null;
}

const DocumentEditor = ({onBack, initialFile} : DocumentEditorProps) => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewPages, setPreviewPages] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExtension, PlaceholderExtension],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (initialFile) {
      handleFileUpload(initialFile);
    }
  }, [initialFile]);

  useEffect(() => {
    const handler = (e: any) => {
      highlightMatches(e.detail);
    };
    window.addEventListener('placeholderValueChange', handler);
    return () => window.removeEventListener('placeholderValueChange', handler);
  }, [editor]);

  const handleAutoDetectPlaceholder = () => {
    // This is where you'd implement the placeholder detection logic
    const selection = window.getSelection();
    if (selection && editor) {
      const placeholder = '{PLACEHOLDER}';
      editor.chain().focus().insertContent(placeholder).run();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();

      if (file.name.endsWith('.docx')) {
        // Handle DOCX files
        if (containerRef.current && previewContainerRef.current) {
          // Clear previous content
          containerRef.current.innerHTML = '';
          previewContainerRef.current.innerHTML = '';
          
          // Render DOCX content
          await renderAsync(arrayBuffer, containerRef.current, containerRef.current, {
            className: 'docx-viewer',
            inWrapper: false,
          });

          // Create preview pages
          await renderAsync(arrayBuffer, previewContainerRef.current, previewContainerRef.current, {
            className: 'docx-preview',
            inWrapper: false,
          });

          // Get preview pages
          const pages = Array.from(previewContainerRef.current.children).map(
            child => child.outerHTML
          );
          setPreviewPages(pages);

          // Set editor content
          if (containerRef.current.innerHTML && editor) {
            editor.commands.setContent(containerRef.current.innerHTML);
            setContent(containerRef.current.innerHTML);
          }
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    }
  };

  const handleInsertPlaceholder = () => {
    if (editor) {
      editor.chain().focus().insertContent({
        type: 'placeholder',
        attrs: { value: '' }
      }).run();
    }
  };

  const highlightMatches = (searchTerm: string) => {
    if (!editor) return;

    // Remove previous highlights
    editor.commands.unsetMark('highlightMark');

    if (!searchTerm) return;

    const regex = new RegExp(searchTerm, 'gi');
    const text = editor.getText();

    let match;
    let offset = 0;
    let found = false;
    while ((match = regex.exec(text)) !== null) {
      found = true;
      const from = match.index + 1; // Tiptap is 1-based
      const to = from + match[0].length;
      editor.commands.setTextSelection({ from, to });
      editor.commands.setMark('highlightMark');
    }
    editor.commands.setTextSelection({ from: 1, to: 1 }); // Remove selection
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa]">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="hover:bg-gray-100 p-1 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-medium">Template Editor</h1>
          </div>

          {/* Center toolbar */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full hover:bg-gray-100 p-0 font-semibold text-gray-700"
            >
              T
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full hover:bg-gray-100 p-0"
            >
              <Eraser className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full hover:bg-gray-100 p-0"
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full hover:bg-gray-100 p-0"
            >
              <AlignLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-10 h-10 rounded-full hover:bg-gray-100 p-0"
            >
              <MoveRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-600 hover:bg-blue-50 px-4 py-2 h-9"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 h-9"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Document preview */}
          <div className="w-[220px] bg-white border-r overflow-y-auto p-4">
            {previewPages.map((page, index) => (
              <div
                key={index}
                className={`relative mb-4 cursor-pointer group ${
                  selectedPage === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPage(index)}
              >
                <div className="aspect-[1/1.4] bg-white border rounded-lg overflow-hidden shadow-sm">
                  <div
                    className="w-full h-full transform scale-[0.2] origin-top-left"
                    dangerouslySetInnerHTML={{ __html: page }}
                  />
                </div>
                <div className="absolute bottom-2 right-2 bg-gray-900/70 text-white text-xs px-2 py-0.5 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto bg-gray-50 p-8">
            <div className="max-w-[816px] mx-auto bg-white shadow-sm rounded-lg min-h-[1056px] p-16">
              {fileName ? (
                <div className="prose max-w-none">
                  <h1 className="text-center text-xl font-bold mb-6">Simple Will Document</h1>
                  <EditorContent editor={editor} />
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  Choose a document to edit
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar - Place Holders */}
          <div className="w-[280px] bg-white border-l overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium">Place Holders</h2>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={handleInsertPlaceholder}
              >
                Auto Detect Placeholder
              </Button>
            </div>
            {editor && <PlaceholderSidebar editor={editor} />}
          </div>
        </div>
      </div>

      {/* Hidden elements */}
      <input
        id="file-upload"
        type="file"
        accept=".docx"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        className="hidden"
      />
      <div ref={containerRef} className="hidden" />
      <div ref={previewContainerRef} className="hidden" />
    </div>
  );
};

export default DocumentEditor;