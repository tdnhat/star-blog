import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface QuillWrapperProps {
    value: string; // The current HTML value of the editor
    onChange: (data: { html: string; delta: any }) => void; // Callback for editor changes
    toolbar?: boolean; // Option to enable or disable the toolbar
}

const QuillWrapper: React.FC<QuillWrapperProps> = ({ value, onChange, toolbar = true }) => {
    const modules = {
        toolbar: toolbar
            ? [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image', 'code-block'],
                ['clean'],
            ]
            : false,
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'link',
        'image',
        'code-block',
    ];

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={(content, delta, source, editor) => {
                onChange({ html: editor.getHTML(), delta: editor.getContents() });
            }}
            modules={modules}
            formats={formats}
            className={`mb-4 ${toolbar ? 'h-[500px]' : 'h-[50px]'}`}
        />
    );
};

export default QuillWrapper;
