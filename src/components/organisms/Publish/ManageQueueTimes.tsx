import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CharacterCount from '@tiptap/extension-character-count';
import { Node, mergeAttributes } from '@tiptap/core';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface ManageQueueTimesProps {
  className?: string;
}

// Updated interface for scheduled times with better type safety
interface ScheduledTime {
  date: Date | null;
  time: string;
  minute: string;
  period: 'AM' | 'PM';
  showCalendar?: boolean;
}

// Link Modal Component
const LinkModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (url: string, text: string) => void }) => {
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Insert Link</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm(url, text);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

// Media Upload Modal Component
const MediaUploadModal = ({ 
  isOpen, 
  onClose, 
  onMediaSelect, 
  type 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onMediaSelect: (file: File) => void,
  type: 'image' | 'video' | 'gif'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Clean up preview URL when component unmounts
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    const isValidType = type === 'image' 
      ? file.type.startsWith('image/')
      : type === 'video'
        ? file.type.startsWith('video/')
        : file.type === 'image/gif';
    
    if (!isValidType) {
      alert(`Please select a valid ${type} file.`);
      return;
    }
    
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleConfirm = () => {
    if (selectedFile) {
      onMediaSelect(selectedFile);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium mb-4">Upload {type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'GIF'}</h3>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            type === 'image' || type === 'gif' ? (
              <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto" />
            ) : (
              <video src={previewUrl} className="max-h-48 mx-auto" controls />
            )
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Drag and drop, or click to select</p>
              <p className="text-xs text-gray-400 mt-1">Supports {type === 'image' ? 'JPG, PNG, WEBP' : type === 'video' ? 'MP4, WEBM' : 'GIF'} files</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/gif'}
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedFile}
            className={`px-4 py-2 rounded-md ${selectedFile ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Video Extension for TipTap
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes)]
  },
})

// Helper function for the MenuBar to insert video
const insertVideo = (editor: any, src: string) => {
  if (editor) {
    editor.chain().focus().insertContent(`<video src="${src}" controls></video>`).run();
  }
};

// Updated MenuBar component
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return (
      <div className="flex items-center gap-4 p-2 border border-gray-200 rounded-md mb-2 bg-gray-50">
        <div className="h-8 opacity-50">Loading editor...</div>
      </div>
    );
  }

  const formatOptions = [
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'heading-1', label: 'Heading 1' },
    { value: 'heading-2', label: 'Heading 2' },
    { value: 'heading-3', label: 'Heading 3' },
  ];

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else if (value.startsWith('heading-')) {
      const level = parseInt(value.split('-')[1]);
      editor.chain().focus().setHeading({ level }).run();
    }
  };

  const getCurrentFormat = () => {
    if (editor.isActive('heading', { level: 1 })) return 'heading-1';
    if (editor.isActive('heading', { level: 2 })) return 'heading-2';
    if (editor.isActive('heading', { level: 3 })) return 'heading-3';
    return 'paragraph';
  };

  // Handling emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const emojis = ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣'];

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
    setShowEmojiPicker(false);
  };

  // Media upload state management
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState<'image' | 'video' | 'gif' | null>(null);

  // New handlers for media upload
  const handleMediaUpload = (file: File) => {
    // Create object URL for the file
    const url = URL.createObjectURL(file);
    
    if (showMediaModal === 'image' || showMediaModal === 'gif') {
      editor.chain().focus().setImage({ src: url }).run();
    } else if (showMediaModal === 'video') {
      // Use the helper function to insert video
      insertVideo(editor, url);
    }
  };

  // Handle link insertion
  const handleLinkInsert = (url: string, text: string) => {
    if (text) {
      editor.chain().focus().insertContent(text).run();
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-md mb-2 bg-gray-50">
      <select 
        className="min-w-[120px] p-1.5 pr-7 border border-gray-200 rounded text-sm bg-white appearance-none bg-no-repeat bg-[right_8px_center] bg-[length:16px] cursor-pointer focus:outline-none focus:border-blue-400"
        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")" }}
        value={getCurrentFormat()}
        onChange={handleFormatChange}
      >
        {formatOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="flex gap-1 px-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 ${editor.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
      </div>
      
      <div className="flex gap-1 px-2 border-l border-r border-gray-200">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Numbered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg>
        </button>
      </div>
      
      <div className="flex gap-1 ml-auto">
        <button
          onClick={() => setShowLinkModal(true)}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Insert Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </button>
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-1.5 min-w-[28px] rounded text-gray-700 hover:bg-gray-100 relative`}
          title="Insert Emoji"
        >
          <span>😀</span>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 max-w-[280px] flex flex-wrap gap-1">
              {emojis.map((emoji, index) => (
                <button 
                  key={index} 
                  className="p-1 hover:bg-gray-100 rounded text-lg"
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </button>
        <button
          onClick={() => setShowMediaModal('image')}
          className="p-1.5 min-w-[28px] rounded text-gray-700 hover:bg-gray-100"
          title="Upload Image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </button>
      </div>
      
      {/* Modals */}
      <LinkModal 
        isOpen={showLinkModal} 
        onClose={() => setShowLinkModal(false)}
        onConfirm={handleLinkInsert}
      />
      
      {showMediaModal && (
        <MediaUploadModal
          isOpen={!!showMediaModal}
          onClose={() => setShowMediaModal(null)}
          onMediaSelect={handleMediaUpload}
          type={showMediaModal}
        />
      )}
    </div>
  );
};

// New BottomToolbar component that has direct access to the editor
const BottomToolbar = ({ 
  editor, 
  setShowMediaModal 
}: { 
  editor: any; 
  setShowMediaModal: React.Dispatch<React.SetStateAction<'image' | 'video' | 'gif' | null>>
}) => {
  if (!editor) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
      <div className="flex flex-wrap gap-2">
        {/* Text alignment icons moved from top toolbar */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded text-gray-600 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Align Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded text-gray-600 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Align Center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded text-gray-600 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
          title="Align Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
        </button>

        {/* Video & GIF upload moved from top toolbar */}
        <button
          onClick={() => setShowMediaModal('video')}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
          title="Upload Video"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        </button>
        
        <button
          onClick={() => setShowMediaModal('gif')}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
          title="Upload GIF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
            <path d="M8 12 L8 16"></path>
            <path d="M8 12 L10 12"></path>
            <path d="M12 12 L12 16"></path>
            <path d="M16 12 L14 12 L14 16"></path>
            <path d="M16 16 L14 16"></path>
          </svg>
        </button>

        {/* Advanced formatting tools */}
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600" title="Add Headers">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h8"></path><path d="M4 18V6"></path><path d="M12 18V6"></path><path d="M16 6h4"></path><path d="M20 12h-4"></path><path d="M16 18h4"></path></svg>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600" title="Add Table">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600" title="Add Quote">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3.5-2 6-6.5 6-9.46C9 9.91 7.54 8 5.5 8S2 9.91 2 11.54c0 2.47 2.61 3.43 3 3.46z"></path><path d="M13 21c3.5-2 6-6.5 6-9.46C19 9.91 17.54 8 15.5 8S12 9.91 12 11.54c0 2.47 2.61 3.43 3 3.46z"></path></svg>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600" title="Add Divider">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line></svg>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600" title="Clear Formatting">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.2 5H12v7"></path><path d="M5 5h5.2"></path><path d="M17.8 19h-6.6l2.6-3.5"></path><path d="m5 19 2.3-3"></path><path d="m18 5-6.5 9"></path></svg>
        </button>
      </div>
      
      <div className="ml-auto flex items-center">
        <span className="text-sm text-gray-500">Character count: {editor?.storage.characterCount.characters() ?? 0}</span>
      </div>
    </div>
  );
};

export const ManageQueueTimes: React.FC<ManageQueueTimesProps> = ({ className }) => {
  // Document click handler to close dropdowns when clicking outside
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedAccount, setSelectedAccount] = useState('AIMDek Technologies');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [postType, setPostType] = useState('specific');
  const [scheduledTimes, setScheduledTimes] = useState<ScheduledTime[]>([
    { date: new Date('2023-09-23'), time: '01', minute: '00', period: 'PM', showCalendar: false },
    { date: null, time: '01', minute: '00', period: 'AM', showCalendar: false }
  ]);

  // Click outside handler to close account dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as unknown as HTMLElement)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Click outside handler to close calendars
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.calendar-container') && !target.closest('.date-input')) {
        setScheduledTimes(prevTimes => 
          prevTimes.map(time => ({
            ...time,
            showCalendar: false
          }))
        );
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addScheduleTime = () => {
    setScheduledTimes([...scheduledTimes, { date: null, time: '01', minute: '00', period: 'PM', showCalendar: false }]);
  };

  const removeScheduleTime = (index: number) => {
    const newTimes = scheduledTimes.filter((_, i) => i !== index);
    setScheduledTimes(newTimes);
  };

  const updateScheduleTime = (index: number, field: string, value: any) => {
    const newTimes = [...scheduledTimes];
    newTimes[index] = { ...newTimes[index], [field]: value };
    setScheduledTimes(newTimes);
  };

  const toggleCalendar = (index: number) => {
    const newTimes = [...scheduledTimes];
    // Close all other calendars first
    newTimes.forEach((time, i) => {
      if (i !== index) {
        time.showCalendar = false;
      }
    });
    // Toggle the target calendar
    newTimes[index] = { 
      ...newTimes[index], 
      showCalendar: !newTimes[index].showCalendar 
    };
    setScheduledTimes(newTimes);
  };

  const handleDateChange = (date: Date, index: number) => {
    const newTimes = [...scheduledTimes];
    newTimes[index] = { 
      ...newTimes[index], 
      date, 
      showCalendar: false 
    };
    setScheduledTimes(newTimes);
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'EEE, MMM dd, yyyy');
  };

  // Initialize TipTap editor with additional extensions
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your post content...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right']
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md',
        },
      }),
      Video,
      CharacterCount.configure({
        limit: 280, // Twitter character limit
      }),
    ],
    onUpdate: ({ editor }) => {
      // Force re-render when content changes to update preview
      setEditorContent(editor.getHTML());
    }
  });

  // State to track editor content for preview
  const [editorContent, setEditorContent] = useState(
    '<p></p>'
  );

  // Sample tech firms for account dropdown
  const techFirms = [
    { name: 'AIMDek Technologies', handle: '@aimdektech', avatar: '/images/group-437.png' },
    { name: 'Tech Solutions Inc', handle: '@techsolutions', avatar: '/images/group-437.png' },
    { name: 'Digital Innovations', handle: '@digitalinnov', avatar: '/images/group-437.png' },
    { name: 'Future Systems', handle: '@futuresystems', avatar: '/images/group-437.png' },
    { name: 'Smart Tech Labs', handle: '@smarttechlabs', avatar: '/images/group-437.png' }
  ];

  const [setShowMediaModal] = useState<'image' | 'video' | 'gif' | null>(null);
  
  return (
    <div className={cn("w-full p-6 bg-gray-50", className)}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Schedule Post</h1>
        <p className="text-sm text-gray-600">Publish - Schedule Post</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left Column - Post Editor */}
        <div className="space-y-6">
          {/* Account Selection with Improved Dropdown */}
          <div 
            ref={accountDropdownRef}
            className="relative"
          >
            <div 
              className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center text-white">
                  <span className="text-xs">A</span>
                </div>
                <img src="/images/twitter-icon.png" alt="Twitter" className="w-5 h-5" />
              </div>
              <span className="ml-3 flex-grow font-medium">{selectedAccount}</span>
              <div>
                <svg 
                  className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
            
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {techFirms.map((firm) => (
                  <div 
                    key={firm.name} 
                    className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer ${selectedAccount === firm.name ? 'bg-blue-50' : ''}`}
                    onClick={() => {
                      setSelectedAccount(firm.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center text-white">
                      <span className="text-xs">A</span>
                    </div>
                    <div>
                      <div className="font-medium">{firm.name}</div>
                      <div className="text-xs text-gray-500">{firm.handle}</div>
                    </div>
                    {selectedAccount === firm.name && (
                      <svg className="ml-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="border border-gray-200 rounded-lg p-4">
            <MenuBar editor={editor} />
            <EditorContent 
              editor={editor} 
              className="min-h-[200px] border border-gray-200 rounded-md p-3 focus:outline-none"
            />
            
            {/* Use the BottomToolbar component */}
            <BottomToolbar editor={editor} setShowMediaModal={setShowMediaModal} />
          </div>

          {/* Scheduling */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium mb-4">When to post?</h3>
            
            <div className="flex flex-wrap gap-4 sm:gap-8 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="postType" 
                  value="now"
                  checked={postType === 'now'}
                  onChange={() => setPostType('now')}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Send Now</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="postType" 
                  value="specific"
                  checked={postType === 'specific'}
                  onChange={() => setPostType('specific')}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Specific Days & Times</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="postType" 
                  value="queue"
                  checked={postType === 'queue'}
                  onChange={() => setPostType('queue')}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Preferred Queue Time</span>
              </label>
            </div>
            
            {postType === 'specific' && (
              <div className="space-y-5">
                {scheduledTimes.map((schedule, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
                    {/* Date Selector with Calendar */}
                    <div className="w-full sm:w-1/2 relative">
                      <input
                        type="text"
                        value={schedule.date ? formatDate(schedule.date) : ''}
                        placeholder="Select Date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md cursor-pointer date-input"
                        readOnly
                        onClick={() => toggleCalendar(index)}
                      />
                      <svg 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        onClick={() => toggleCalendar(index)}
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      
                      {schedule.showCalendar && (
                        <div className="absolute top-full left-0 mt-2 z-20 calendar-container">
                          <Calendar
                            onChange={(date) => handleDateChange(date as Date, index)}
                            value={schedule.date || new Date()}
                            minDate={new Date()}
                            className="border border-gray-200 rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Time Selector (Hour, Minute, AM/PM) */}
                    <div className="flex gap-2">
                      <select
                        value={schedule.time}
                        onChange={(e) => updateScheduleTime(index, 'time', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-md appearance-none pr-8 bg-no-repeat bg-[right_8px_center] bg-[length:16px]"
                        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")" }}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={String(i + 1).padStart(2, '0')}>
                            {String(i + 1).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={schedule.minute}
                        onChange={(e) => updateScheduleTime(index, 'minute', e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-md appearance-none pr-8 bg-no-repeat bg-[right_8px_center] bg-[length:16px]"
                        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")" }}
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i} value={String(i * 5).padStart(2, '0')}>
                            {String(i * 5).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={schedule.period}
                        onChange={(e) => updateScheduleTime(index, 'period', e.target.value as 'AM' | 'PM')}
                        className="px-3 py-2 border border-gray-200 rounded-md appearance-none pr-8 bg-no-repeat bg-[right_8px_center] bg-[length:16px]"
                        style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")" }}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    
                    {/* Remove Button */}
                    <div className="ml-auto flex-shrink-0">
                      {index > 0 ? (
                        <button 
                          onClick={() => removeScheduleTime(index)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full"
                          title="Remove time"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      ) : (
                        <div className="w-10"></div> /* Spacer for alignment */
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Add time button */}
                <button 
                  onClick={addScheduleTime} 
                  className="flex items-center gap-2 text-blue-500 font-medium mt-2 p-2 hover:bg-blue-50 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  Add date & time
                </button>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md">
              Place Now
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-5 py-2.5 rounded-md">
              Save as Draft
            </button>
          </div>
        </div>
        
        {/* Right Column - Preview */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Post Preview</h2>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-md mb-6">
            Preview approximates how your content will display when published. Tests and updates by social networks may affect the final appearance.
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Post Header */}
            <div className="flex items-center gap-3 p-3 border-b border-gray-200">
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white">
                <span className="text-sm font-bold">A</span>
              </div>
              <div>
                <div className="font-bold">{selectedAccount}</div>
                <div className="text-gray-500 text-sm">
                  {techFirms.find(firm => firm.name === selectedAccount)?.handle ?? '@aimdektech'}
                </div>
              </div>
            </div>
            
            {/* Post Content - Using editor content for preview */}
            <div className="p-3">
              <div 
                className="text-sm mb-4 post-content-preview" 
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            </div>
            
            {/* Post Actions */}
            <div className="flex gap-6 p-3 border-t border-gray-200">
              <button className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </button>
              <button className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
              </button>
              <button className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQueueTimes; 
