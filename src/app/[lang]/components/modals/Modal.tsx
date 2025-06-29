import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: string;
  iconBgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon = "📢",
  iconBgColor = "bg-blue-500",
  gradientFrom = "from-blue-500",
  gradientTo = "to-purple-600"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 max-w-md w-full mx-4 border border-blue-500/20 shadow-2xl transform transition-all duration-300">
        <div className="relative">
          {/* Icon Header */}
          <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 ${iconBgColor} rounded-full p-3 shadow-lg border-4 border-gray-800`}>
            <span className="text-3xl">{icon}</span>
          </div>
          
          <br />
          
          {/* Title */}
          <h2 className={`text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradientFrom} ${gradientTo} mt-6 mb-6 text-center`}>
            {title}
          </h2>

          {/* Content */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-5 border border-blue-500/20 shadow-lg">
              {children}
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:${gradientFrom.replace('from-', 'from-')}/90 hover:${gradientTo.replace('to-', 'to-')}/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;