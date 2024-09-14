import assert from "assert";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import amenities from "../amenities.json";
import { normalizeQueryParameter } from "../utils/normalizeQueryParameter.js";

const sortedAmenities = amenities.sort((a, b) => a.name.localeCompare(b.name));

const App = () => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();
  const [amenitiesFilter, setAmenitiesFilter] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  useEffect(() => {
    void (async () => {
      const tabs = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });

      setCurrentTab(tabs?.[0]);
    })();
  }, []);

  const parsedUrl = useMemo(() => {
    if (!currentTab?.url) return;

    return queryString.parseUrl(currentTab.url);
  }, [currentTab]);

  useEffect(() => {
    if (!parsedUrl) return;

    setSelectedAmenities(
      normalizeQueryParameter(parsedUrl.query["amenities[]"]),
    );
  }, [parsedUrl]);

  const visibleAmenities = useMemo(() => {
    if (!amenitiesFilter) return sortedAmenities;

    return sortedAmenities.filter(({ name }) =>
      name.toLowerCase().includes(amenitiesFilter.toLowerCase()),
    );
  }, [amenitiesFilter]);

  const handleAmenityInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmenitiesFilter(event.currentTarget.value);
    },
    [],
  );

  const handleAmenityCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const id = event.currentTarget.dataset.id;
      assert(id, "Amenity id not found");

      setSelectedAmenities((prev) =>
        prev.includes(id)
          ? prev.filter((amenity) => amenity !== id)
          : [...prev, id],
      );
    },
    [],
  );

  const handleApplyClick = useCallback(() => {
    if (!currentTab?.id || !parsedUrl) return;

    void chrome.tabs.update(currentTab.id, {
      url: queryString.stringifyUrl({
        ...parsedUrl,
        query: {
          ...parsedUrl.query,
          "amenities[]": selectedAmenities,
        },
      }),
    });
  }, [currentTab, parsedUrl, selectedAmenities]);

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
                checked={selectedAmenities.includes(id)}
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

const rootEl = document.getElementById("root");
assert(rootEl, "Root element not found");
const root = createRoot(rootEl);
root.render(<App />);
