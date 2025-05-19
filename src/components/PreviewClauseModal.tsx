import React from 'react';
import { Dialog } from '@headlessui/react';

interface PreviewClauseModalProps {
  isOpen: boolean;
  onClose: () => void;
  clauseData?: {
    title: string;
    createdDate: string;
    lastModified: string;
    modifiedBy: string;
    content: string;
  };
}

export const PreviewClauseModal: React.FC<PreviewClauseModalProps> = ({
  isOpen,
  onClose,
  clauseData
}) => {
  if (!clauseData) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            width: '600px',
            maxHeight: '80vh',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Header Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333'
            }}>Preview Clause</h2>
          </div>

          {/* Document Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <p style={{ color: '#666', fontSize: '12px' }}>Created Date</p>
              <p style={{ fontSize: '14px' }}>{clauseData.createdDate}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '12px' }}>Last Modified</p>
              <p style={{ fontSize: '14px' }}>{clauseData.lastModified}</p>
            </div>
            <div>
              <p style={{ color: '#666', fontSize: '12px' }}>Modified By</p>
              <p style={{ fontSize: '14px' }}>{clauseData.modifiedBy}</p>
            </div>
          </div>

          {/* Document Title */}
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px'
          }}>{clauseData.title}</h3>

          {/* Document Content */}
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            maxHeight: '400px',
            overflowY: 'auto',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {clauseData.content}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
