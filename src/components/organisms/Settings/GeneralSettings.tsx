import React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/atoms/ui/button';

interface GeneralSettingsProps {
  className?: string;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ className }) => {
  const handleBitlyConnect = () => {
    // TODO: Implement Bitly connection logic
    console.log('Connecting to Bitly...');
  };

  return (
    <div className={cn("space-y-6", className)}>
      <p className="text-sm text-gray-500">
        These settings will help you to connect other application with product
      </p>
          
          {/* URL Shortening Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">URL Shortening</h3>
        <p className="text-sm text-gray-500 mb-6">
          Connect below app to shortening your URL
        </p>

        {/* Bitly Connection */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg 
                className="w-8 h-8 text-orange-500" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M11.614 8.25c-.15.187-.224.424-.224.71 0 .285.075.522.224.71.15.187.336.28.56.28.224 0 .41-.093.56-.28.15-.188.224-.425.224-.71 0-.286-.075-.523-.224-.71-.15-.188-.336-.281-.56-.281-.224 0-.41.093-.56.28zm-5.598 0c-.15.187-.224.424-.224.71 0 .285.075.522.224.71.15.187.336.28.56.28.224 0 .41-.093.56-.28.15-.188.224-.425.224-.71 0-.286-.075-.523-.224-.71-.15-.188-.336-.281-.56-.281-.224 0-.41.093-.56.28zm11.196 0c-.15.187-.224.424-.224.71 0 .285.075.522.224.71.15.187.336.28.56.28.224 0 .41-.093.56-.28.15-.188.224-.425.224-.71 0-.286-.075-.523-.224-.71-.15-.188-.336-.281-.56-.281-.224 0-.41.093-.56.28z"/>
                        </svg>
                      </div>
                      <div>
              <h4 className="text-sm font-medium text-gray-900">Bitly</h4>
            </div>
          </div>
          <Button
            onClick={handleBitlyConnect}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium"
          >
            CONNECT
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings; 