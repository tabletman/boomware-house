'use client';

/**
 * Crisp Live Chat Widget
 * Integrates Crisp chat for customer support
 */

import { useEffect } from 'react';

interface CrispChatProps {
  websiteId?: string;
}

export function CrispChat({ websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID }: CrispChatProps) {
  useEffect(() => {
    // Skip if no website ID
    if (!websiteId) {
      console.log('Crisp chat disabled: No website ID provided');
      return;
    }

    // Load Crisp chat script
    interface CrispWindow extends Window {
      $crisp?: unknown[];
      CRISP_WEBSITE_ID?: string;
    }
    const crispWindow = window as CrispWindow;

    crispWindow.$crisp = [];
    crispWindow.CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);

    // Cleanup function
    return () => {
      // Remove Crisp on unmount
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (crispScript) {
        crispScript.remove();
      }
      delete crispWindow.$crisp;
      delete crispWindow.CRISP_WEBSITE_ID;
    };
  }, [websiteId]);

  return null; // This component doesn't render anything
}
