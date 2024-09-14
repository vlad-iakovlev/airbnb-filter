import { CheckedState } from "@radix-ui/react-checkbox";
import { useCallback, useId } from "react";
import { Checkbox } from "@/common/Checkbox.jsx";
import { Label } from "@/common/Label.jsx";

interface AmenitiesAmenityProps {
  id: string;
  name: string;
  isActive: boolean;
  onActiveChange: (id: string, value: boolean) => void;
}

export const AmenitiesAmenity = ({
  id,
  name,
  isActive,
  onActiveChange,
}: AmenitiesAmenityProps) => {
  const htmlId = useId();

  const handleChange = useCallback(
    (value: CheckedState) => {
      if (typeof value === "boolean") {
        onActiveChange(id, value);
      }
    },
    [id, onActiveChange],
  );

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className="flex-none"
        id={htmlId}
        checked={isActive}
        onCheckedChange={handleChange}
      />

      <Label className="flex-1 truncate" htmlFor={htmlId}>
        {name}
      </Label>
    </div>
  );
};
