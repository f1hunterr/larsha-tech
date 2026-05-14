type EventProps = Record<string, string | number | boolean>;

/**
 * Lightweight analytics hook — swap the body of `track` for any provider:
 * Google Analytics 4: window.gtag?.('event', event, props)
 * PostHog:           window.posthog?.capture(event, props)
 * Mixpanel:          window.mixpanel?.track(event, props)
 */
export function useAnalytics() {
  const track = (event: string, props?: EventProps) => {
    if (import.meta.env.DEV) {
      console.debug('[Analytics]', event, props ?? {});
    }
    // TODO: replace with real provider
    // window.gtag?.('event', event, props);
  };

  return { track };
}
