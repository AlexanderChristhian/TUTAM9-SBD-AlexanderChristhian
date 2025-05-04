import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-pink-100 min-h-screen flex flex-col items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong 😕</h2>
            <details className="bg-red-50 p-3 rounded-md mb-4">
              <summary className="font-bold cursor-pointer">Error details</summary>
              <pre className="whitespace-pre-wrap mt-2 text-sm overflow-auto max-h-96">
                {this.state.error?.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
            >
              Try reloading the page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
