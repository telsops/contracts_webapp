import React from 'react';
import Modal from './Modal';

interface PdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;

  // Convert standard Google Drive link to embeddable link
  const embedUrl = url.replace("/view?usp=sharing", "/preview").replace("/edit?usp=sharing", "/preview");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div className="w-full h-[80vh] bg-gray-700">
             <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allow="fullscreen"
            ></iframe>
        </div>
    </Modal>
  );
};

export default PdfViewer;