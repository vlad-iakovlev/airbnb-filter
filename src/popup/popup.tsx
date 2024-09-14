import assert from "assert";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import amenities from "../amenities.json";
import { Button } from "../common/Button.jsx";
import { Checkbox } from "../common/Checkbox.jsx";
import { Input } from "../common/Input.jsx";
import { Label } from "../common/Label.jsx";
import { Portal } from "../common/Portal.jsx";
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

  const handleAmenityCheckboxChange = useCallback((id: string) => {
    setHasChanges(true);

    setSelectedAmenities((prev) =>
      prev.includes(id)
        ? prev.filter((amenity) => amenity !== id)
        : [...prev, id],
    );
  }, []);

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
      <div className="flex w-80 flex-col gap-6 p-4">
        Open Airbnb search page to continue
      </div>
    );
  }

  return (
    <div className="flex w-80 flex-col gap-6 p-4">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Amenities
        </h3>

        <Input
          type="text"
          placeholder="Filter amenities"
          value={amenitiesFilter}
          onChange={handleAmenityInputChange}
        />

        <ul className="flex flex-col gap-2">
          {visibleAmenities.map(({ id, name }) => (
            <li key={id}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="flex-none"
                  id={`amenities-${id}`}
                  checked={selectedAmenities.includes(id)}
                  onCheckedChange={() => handleAmenityCheckboxChange(id)}
                />

                <Label className="flex-1 truncate" htmlFor={`amenities-${id}`}>
                  {name}
                </Label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {hasChanges && (
        <Portal>
          <div className="sticky inset-0 top-auto border-t bg-background p-4">
            <Button className="w-full" onClick={handleApplyClick}>
              Apply
            </Button>
          </div>
        </Portal>
      )}
    </div>
  );
};

const rootEl = document.getElementById("root");
assert(rootEl, "Root element not found");
const root = createRoot(rootEl);
root.render(<App />);
