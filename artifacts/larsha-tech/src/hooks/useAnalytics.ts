declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

type EventProps = Record<string, string | number | boolean>;

export function useAnalytics() {
  const track = (event: string, props?: EventProps) => {
    if (import.meta.env.DEV) {
      console.debug('[Analytics]', event, props ?? {});
    }
    window.gtag?.('event', event, props);
  };

  return { track };
}
