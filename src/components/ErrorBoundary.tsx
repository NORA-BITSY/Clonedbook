import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError() { 
    return { hasError: true }; 
  }
  
  componentDidCatch(err: unknown, info: unknown) {
    // TODO: send to Sentry/LogRocket
    console.error('App crash:', err, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <p>Please refresh. If this keeps happening, contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}