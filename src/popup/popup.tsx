import assert from "assert";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { twMerge } from "tailwind-merge";
import amenities from "../amenities.json";
import "../styles.css";
import { normalizeQueryParameter } from "../utils/normalizeQueryParameter.js";

const sortedAmenities = amenities.sort((a, b) => a.name.localeCompare(b.name));

const App = () => {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab>();
  const [hasChanges, setHasChanges] = useState(false);
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

    setHasChanges(false);

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

      setHasChanges(true);

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

    window.close();
  }, [currentTab, parsedUrl, selectedAmenities]);

  if (!parsedUrl?.url.startsWith("https://www.airbnb.com/")) {
    return (
      <div className="font-semibold">Open Airbnb search page to continue</div>
    );
  }

  return (
    <div className={twMerge("flex flex-col gap-4", hasChanges && "pb-16")}>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Amenities</h2>

        <input
          className="w-full rounded-md border-2 border-gray-300 p-2"
          type="text"
          placeholder="Filter amenities"
          value={amenitiesFilter}
          onChange={handleAmenityInputChange}
        />

        <ul>
          {visibleAmenities.map(({ id, name }) => (
            <li key={id}>
              <label className="flex items-center gap-2">
                <input
                  className="flex flex-none"
                  data-id={id}
                  type="checkbox"
                  checked={selectedAmenities.includes(id)}
                  onChange={handleAmenityCheckboxChange}
                />

                <span className="flex-1 truncate">{name}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {hasChanges && (
        <div className="fixed inset-0 top-auto h-20 bg-white p-4">
          <button
            className="flex h-full w-full items-center justify-center bg-blue-500 text-white"
            type="button"
            onClick={handleApplyClick}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

const rootEl = document.getElementById("root");
assert(rootEl, "Root element not found");
const root = createRoot(rootEl);
root.render(<App />);
