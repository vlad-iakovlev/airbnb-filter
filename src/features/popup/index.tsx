import { FilterIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/common/Button.jsx";
import { Amenities } from "@/features/amenities/index.jsx";
import { normalizeQueryParameter } from "@/utils/normalizeQueryParameter.js";
import { usePageUrl } from "./usePageUrl.js";

export const Popup = () => {
  const [pageUrl, setPageUrl] = usePageUrl();
  const [hasChanges, setHasChanges] = useState(false);
  const [activeAmenities, setActiveAmenities] = useState<string[]>([]);

  const isAirbnbPage = pageUrl?.url.startsWith("https://www.airbnb.com/");

  useEffect(() => {
    if (!pageUrl) return;
    setHasChanges(false);
    setActiveAmenities(normalizeQueryParameter(pageUrl.query["amenities[]"]));
  }, [pageUrl]);

  const handleActiveAmenitiesChange = useCallback(
    (activeAmenities: React.SetStateAction<string[]>) => {
      setHasChanges(true);
      setActiveAmenities(activeAmenities);
    },
    [],
  );

  const handleApplyClick = useCallback(() => {
    void (async () => {
      if (!pageUrl) return;

      await setPageUrl({
        ...pageUrl,
        query: {
          ...pageUrl.query,
          "amenities[]": activeAmenities,
        },
      });

      window.close();
    })();
  }, [activeAmenities, pageUrl, setPageUrl]);

  return (
    <>
      <div className="sticky inset-0 bottom-auto flex items-center gap-2 border-b bg-background p-4">
        <FilterIcon className="h-6 w-6 flex-none text-primary" />

        <h2 className="flex-1 truncate text-xl font-semibold leading-tight tracking-tight">
          Airbnb Filters
        </h2>
      </div>

      <div className="flex w-80 flex-col gap-6 p-4">
        {isAirbnbPage ? (
          <>
            <Amenities
              active={activeAmenities}
              onActiveChange={handleActiveAmenitiesChange}
            />
          </>
        ) : (
          "Open Airbnb search page to continue"
        )}
      </div>

      {isAirbnbPage && hasChanges && (
        <div className="sticky inset-0 top-auto border-t bg-background p-4">
          <Button className="w-full" onClick={handleApplyClick}>
            Apply
          </Button>
        </div>
      )}
    </>
  );
};
