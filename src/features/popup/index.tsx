import { useCallback, useEffect, useState } from "react";
import { Button } from "@/common/Button.jsx";
import { Portal } from "@/common/Portal.jsx";
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
    <div className="flex w-80 flex-col gap-6 p-4">
      {isAirbnbPage ? (
        <>
          <Amenities
            active={activeAmenities}
            onActiveChange={handleActiveAmenitiesChange}
          />

          {hasChanges && (
            <Portal>
              <div className="sticky inset-0 top-auto border-t bg-background p-4">
                <Button className="w-full" onClick={handleApplyClick}>
                  Apply
                </Button>
              </div>
            </Portal>
          )}
        </>
      ) : (
        "Open Airbnb search page to continue"
      )}
    </div>
  );
};
