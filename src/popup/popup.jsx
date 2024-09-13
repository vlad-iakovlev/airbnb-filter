import { produce } from "immer";
import queryString from "query-string";
import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import amenities from "../amenities.json";

const App = () => {
  const [currentTab, setCurrentTab] = useState();
  const [parsedUrl, setParsedUrl] = useState();

  useEffect(() => {
    void (async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      setCurrentTab(tabs[0]);
    })();
  }, []);

  useEffect(() => {
    if (!currentTab) return;

    setParsedUrl(queryString.parseUrl(currentTab.url));
  }, [currentTab]);

  const handleAmenityChange = useCallback((event) => {
    const id = event.currentTarget.dataset.id;

    setParsedUrl(
      produce((draft) => {
        if (!draft) return;

        if (!draft.query["amenities[]"]) {
          draft.query["amenities[]"] = [id];
          return;
        }

        if (draft.query["amenities[]"].includes(id)) {
          draft.query["amenities[]"] = draft.query["amenities[]"].filter(
            (amenity) => amenity !== id,
          );
        } else {
          draft.query["amenities[]"].push(id);
        }
      }),
    );
  }, []);

  const handleApplyClick = useCallback(() => {
    if (!currentTab || !parsedUrl) return;

    chrome.tabs.update(currentTab.id, {
      url: queryString.stringifyUrl(parsedUrl),
    });
  }, [currentTab, parsedUrl]);

  if (!parsedUrl?.url.startsWith("https://www.airbnb.com/")) {
    return <h2>Open Airbnb search page to continue</h2>;
  }

  return (
    <div>
      <h2>Amenities</h2>

      <ul>
        {amenities.map(({ id, name }) => (
          <li key={id}>
            <label>
              <input
                data-id={id}
                type="checkbox"
                checked={parsedUrl?.query["amenities[]"]?.includes(id)}
                onChange={handleAmenityChange}
              />

              {name}
            </label>
          </li>
        ))}
      </ul>

      <button type="button" onClick={handleApplyClick}>
        Apply
      </button>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
