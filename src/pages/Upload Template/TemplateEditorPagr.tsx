import React from 'react';
import DocumentEditor from './DocumentEditor';
import { SidebarProvider } from '@/components/ui/sidebar';



const TemplateEditorPage = () => {
// 
return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gray-50">
        <DocumentEditor />
      </div>
    </SidebarProvider>
)
};

export default TemplateEditorPage;