import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";

export const usePageUrl = () => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();

  useEffect(() => {
    void (async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      setCurrentTab(tabs?.[0]);
    })();
  }, []);

  const pageUrl = useMemo(() => {
    if (!currentTab?.url) return;
    return queryString.parseUrl(currentTab.url);
  }, [currentTab]);

  const setPageUrl = useCallback(
    async (url: queryString.ParsedUrl) => {
      if (!currentTab?.id) return;

      await chrome.tabs.update(currentTab.id, {
        url: queryString.stringifyUrl(url),
      });
    },
    [currentTab],
  );

  return [pageUrl, setPageUrl] as const;
};
