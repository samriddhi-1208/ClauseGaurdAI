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
        <div className="min-h-screen bg-[#0B0A08] flex items-center justify-center p-6 text-[#EDE5D5] font-sans selection:bg-[#E5C38E]/20">
          <div className="bg-[#12100D] p-8 rounded-xl border border-[#231F19] shadow-2xl max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#241314] border border-[#482325] text-[#ECA09B] flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-6 h-6 stroke-[1.8]" />
            </div>
            <h2 className="text-lg font-serif text-[#F4EFE5]">Audit Report Loaded with Safe Fallback</h2>
            <p className="text-xs md:text-sm text-[#8C806F] leading-relaxed">
              A data formatting inconsistency was safely isolated. Click below to refresh into standard view.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/results';
              }}
              className="w-full py-2.5 px-4 bg-[#E5C38E] hover:bg-[#D6B27B] text-[#12110E] font-semibold text-xs md:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
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
