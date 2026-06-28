import { useEffect } from 'react';

const SITE_NAME = 'Larsha Tech';
const DEFAULT_TITLE = 'Larsha Tech — Laptop & Computer Repair | Web Development Bangalore';
const DEFAULT_DESC = 'Larsha Tech: Fast laptop & computer repair, virus removal, OS installation, SSD upgrades, and professional website development in Bangalore. Free diagnostics. Repair time based on diagnosis. No hidden fees. Call +91 80884 61724.';
const BASE_URL = 'https://larsha.com';

interface PageMeta {
  title: string;
  description: string;
  path?: string;
}

function setMeta(name: string, content: string) {
  const el = document.querySelector(`meta[name="${name}"]`);
  if (el) el.setAttribute('content', content);
}

function setOg(property: string, content: string) {
  const el = document.querySelector(`meta[property="${property}"]`);
  if (el) el.setAttribute('content', content);
}

export function usePageMeta({ title, description, path = '' }: PageMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta('description', description);
    setOg('og:title', fullTitle);
    setOg('og:description', description);
    setOg('og:url', `${BASE_URL}${path}`);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${BASE_URL}${path}`);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('description', DEFAULT_DESC);
      setOg('og:title', DEFAULT_TITLE);
      setOg('og:description', DEFAULT_DESC);
      setOg('og:url', `${BASE_URL}/`);
      const c = document.querySelector('link[rel="canonical"]');
      if (c) c.setAttribute('href', `${BASE_URL}/`);
    };
  }, [title, description, path]);
}
