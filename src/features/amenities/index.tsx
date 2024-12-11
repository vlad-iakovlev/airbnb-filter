import { useCallback, useMemo, useState } from "react";
import amenities from "@/amenities.json" with { type: "json" };
import { Input } from "@/common/Input.jsx";
import { Section } from "@/entities/section/index.jsx";
import { AmenitiesAmenity } from "./Amenity.jsx";

const sortedAmenities = amenities.sort((a, b) => a.name.localeCompare(b.name));

interface AmenitiesProps {
  active: string[];
  onActiveChange: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Amenities = ({ active, onActiveChange }: AmenitiesProps) => {
  const [search, setSearch] = useState("");

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.currentTarget.value);
    },
    [],
  );

  const visibleAmenities = useMemo(() => {
    if (!search) return sortedAmenities;

    return sortedAmenities.filter(({ name }) =>
      name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  const activeMap = useMemo(
    () => Object.fromEntries(active.map((id) => [id, true])),
    [active],
  );

  const handleActiveChange = useCallback(
    (id: string, value: boolean) => {
      onActiveChange((prev) => {
        const next = prev.filter((amenity) => amenity !== id);
        return value ? [...next, id] : next;
      });
    },
    [onActiveChange],
  );

  return (
    <Section>
      <Section.Title>Amenities</Section.Title>

      <Input
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleSearchChange}
      />

      <Section.List>
        {visibleAmenities.map(({ id, name }) => (
          <Section.List.Item key={id}>
            <AmenitiesAmenity
              id={id}
              name={name}
              isActive={activeMap[id] ?? false}
              onActiveChange={handleActiveChange}
            />
          </Section.List.Item>
        ))}
      </Section.List>
    </Section>
  );
};
