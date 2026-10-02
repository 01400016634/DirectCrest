declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'rotation-per-second'?: string;
        'interaction-prompt'?: string;
        'environment-image'?: string;
        'shadow-intensity'?: string;
        'disable-zoom'?: boolean;
        'disable-pan'?: boolean;
      };
    }
  }
}

export {};
