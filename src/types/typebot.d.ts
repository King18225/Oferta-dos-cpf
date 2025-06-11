
// Declare window.Typebot for global access if the script exposes it this way
declare global {
  interface Window {
    Typebot?: {
      initStandard: (options: { typebot: string; apiHost?: string; [key: string]: any }) => void;
      // You can add other Typebot methods here if you know them
    };
  }
}

// Declare the custom element for JSX
declare namespace JSX {
  interface IntrinsicElements {
    'typebot-standard': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        style?: React.CSSProperties;
        'typebot-id'?: string; // If typebot uses this attribute to identify instance
        // Add any other props Typebot uses on this element
      },
      HTMLElement
    >;
  }
}

export {}; // Ensures the file is treated as a module.
