import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="feedback-modal" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-muted)'
          }}
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        <div className="modal-icon-wrap" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <CheckCircle2 size={54} color="#16a34a" />
        </div>

        <h3 style={{ fontSize: '22px', marginBottom: '10px', color: 'var(--color-primary)' }}>
          {title || 'Submission Confirmed'}
        </h3>

        <p style={{ fontSize: '15px', color: 'var(--color-text-body)', lineHeight: '1.6', marginBottom: '24px' }}>
          {message || 'Thank you for reaching out. A Senior Partner from MCP CONSULTANTS will review your submission and connect with you confidentially.'}
        </p>

        <button 
          className="btn btn-primary" 
          onClick={onClose}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Acknowledge &amp; Return
        </button>
      </div>
    </div>
  );
}
