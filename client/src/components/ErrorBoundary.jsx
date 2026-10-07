import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center p-6 text-[#101A13] font-sans">
          <div className="bg-white p-8 rounded-2xl border border-[#DDDCD3] shadow-card max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F9DFDE] text-[#B5413D] flex items-center justify-center mx-auto shadow-2xs">
              <AlertCircle className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-lg font-bold text-[#101A13]">Audit Report Loaded with Safe Fallback</h2>
            <p className="text-xs md:text-sm text-[#38463C] leading-relaxed font-medium">
              A data formatting inconsistency was safely isolated. Click below to refresh into standard view.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/results';
              }}
              className="w-full py-2.5 px-4 bg-[#3F6149] hover:bg-[#34503C] text-white font-bold text-xs md:text-sm rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 stroke-[2]" />
              <span>Reload Clean View</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
