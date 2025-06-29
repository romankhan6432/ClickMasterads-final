import React, { useState } from 'react';
import Modal from './Modal';

const ExampleModalUsage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg active:scale-95"
      >
        Open Example Modal
      </button>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        icon="🎉"
        iconBgColor="bg-purple-500"
        gradientFrom="from-purple-400"
        gradientTo="to-pink-600"
      >
        <div className="space-y-4">
          <div className="transform transition-all duration-300 hover:translate-x-1">
            <div className="flex items-start space-x-3 group">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">✨</span>
              </div>
              <div className="flex-1">
                <h3 className="text-green-400 font-semibold mb-1">Feature One</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This is an example of how to use the Modal component with custom content.
                </p>
              </div>
            </div>
          </div>

          <div className="transform transition-all duration-300 hover:translate-x-1">
            <div className="flex items-start space-x-3 group">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-lg">🚀</span>
              </div>
              <div className="flex-1">
                <h3 className="text-blue-400 font-semibold mb-1">Feature Two</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  The modal supports custom icons, colors, and gradient backgrounds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExampleModalUsage;