import { useEffect, useState } from 'react';

export const MOBILE_SHELL_QUERY = '(max-width: 900px)';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = () => setMatches(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useIsMobileShell() {
  return useMediaQuery(MOBILE_SHELL_QUERY);
}
