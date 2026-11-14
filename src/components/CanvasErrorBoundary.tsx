import { Component, type ReactNode } from 'react';

interface CanvasErrorBoundaryProps {
  fallbackTitle: string;
  fallbackDetail: string;
  children: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
}

export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[360px] w-full items-center justify-center rounded-xl border border-white/10 bg-[#0F131C] p-6 text-center">
          <div className="max-w-md">
            <div className="font-mono-tech text-xs uppercase tracking-wider text-[#D4A359]">
              Interactive 3D Fallback
            </div>
            <p className="font-display mt-2 text-2xl font-semibold text-white">
              {this.props.fallbackTitle}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#A1AAB8]">
              {this.props.fallbackDetail}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
