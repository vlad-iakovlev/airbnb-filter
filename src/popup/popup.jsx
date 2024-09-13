import { produce } from "immer";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import amenities from "../amenities.json";

const sortedAmenities = amenities.sort((a, b) => a.name.localeCompare(b.name));

const App = () => {
  const [currentTab, setCurrentTab] = useState();
  const [parsedUrl, setParsedUrl] = useState();
  const [amenitiesFilter, setAmenitiesFilter] = useState("");

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

  const visibleAmenities = useMemo(() => {
    if (!amenitiesFilter) return sortedAmenities;

    return sortedAmenities.filter(({ name }) =>
      name.toLowerCase().includes(amenitiesFilter.toLowerCase()),
    );
  }, [amenitiesFilter]);

  const handleAmenityInputChange = useCallback((event) => {
    setAmenitiesFilter(event.currentTarget.value);
  }, []);

  const handleAmenityCheckboxChange = useCallback((event) => {
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

      <input
        type="text"
        placeholder="Filter amenities"
        value={amenitiesFilter}
        onChange={handleAmenityInputChange}
      />

      <ul>
        {visibleAmenities.map(({ id, name }) => (
          <li key={id}>
            <label>
              <input
                data-id={id}
                type="checkbox"
                checked={parsedUrl?.query["amenities[]"]?.includes(id)}
                onChange={handleAmenityCheckboxChange}
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
