import React from 'react';
import { Bug } from 'lucide-react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center text-center font-sans">
                    <Bug size={48} className="text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
                    <p className="text-gray-400 mb-6">The application crashed. Please show this to the developer.</p>

                    <div className="bg-gray-900 p-4 rounded-lg text-left overflow-auto w-full max-w-2xl border border-gray-800">
                        <h2 className="text-red-400 font-bold mb-2 text-sm">Error:</h2>
                        <pre className="text-xs text-white whitespace-pre-wrap mb-4 font-mono">
                            {this.state.error && this.state.error.toString()}
                        </pre>

                        <h2 className="text-gray-500 font-bold mb-2 text-sm">Stack Trace:</h2>
                        <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-blue-600 rounded-lg text-white font-bold hover:bg-blue-700 transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
