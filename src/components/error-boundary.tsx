"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Something went wrong. Please refresh the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
