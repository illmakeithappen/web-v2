import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: #fee;
  border: 3px solid #fcc;
  border-radius: 8px;
  padding: 2rem;
  margin: 1rem 0;
`;

const ErrorTitle = styled.h2`
  color: #c00;
  margin: 0 0 1rem 0;
`;

const ErrorMessage = styled.p`
  color: #600;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const ErrorStack = styled.pre`
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.8rem;
  color: #333;
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  cursor: pointer;

  summary {
    font-weight: 600;
    color: #600;
    user-select: none;
  }
`;

const ReloadButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #c00;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #a00;
    transform: translateY(-2px);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const timestamp = new Date().toISOString();

    // Log to console for debugging
    console.error('🚨 [ErrorBoundary] React Error Caught:', {
      timestamp,
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    });

    // Update state with error details
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReload = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>
            ⚠️ React Rendering Error (#{this.state.errorCount})
          </ErrorTitle>

          <ErrorMessage>
            {this.state.error?.message || 'An unknown error occurred'}
          </ErrorMessage>

          {this.state.error?.stack && (
            <ErrorDetails>
              <summary>📋 Error Stack Trace</summary>
              <ErrorStack>{this.state.error.stack}</ErrorStack>
            </ErrorDetails>
          )}

          {this.state.errorInfo?.componentStack && (
            <ErrorDetails>
              <summary>🔍 Component Stack</summary>
              <ErrorStack>{this.state.errorInfo.componentStack}</ErrorStack>
            </ErrorDetails>
          )}

          <ReloadButton onClick={this.handleReload}>
            🔄 Try Again
          </ReloadButton>

          {this.props.fallback && (
            <div style={{ marginTop: '1rem' }}>
              {this.props.fallback}
            </div>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
