import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🔍 ErrorBoundary caught an error:', error);
    console.error('🔍 Error info:', errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              An error occurred while rendering this component. This might be due to invalid data being passed to the component.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {this.state.error?.toString()}
              </pre>
              {this.state.errorInfo && (
                <>
                  <h3 className="font-semibold text-gray-800 mb-2 mt-4">Component Stack:</h3>
                  <pre className="text-sm text-gray-600 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 