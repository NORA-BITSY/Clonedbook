import React from 'react';

const ErrorScreen = ({ onRetry, details }: { onRetry: () => void; details?: string }) => (
  <div>
    <h1>Something went wrong.</h1>
    <button onClick={onRetry}>Retry</button>
    {details && <pre>{details}</pre>}
  </div>
);

type Props = {
  children: React.ReactNode;
};

export class GlobalErrorBoundary extends React.Component<Props, {error?: Error}> {
  state = { error: undefined };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return <ErrorScreen onRetry={() => location.reload()} details={process.env.NODE_ENV==='development' ? this.state.error.stack : undefined} />;
    }
    return this.props.children;
  }
}
