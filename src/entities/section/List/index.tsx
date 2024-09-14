import { SectionListItem } from "./Item.jsx";

interface SectionListProps {
  children: React.ReactNode;
}

export const SectionList = ({ children }: SectionListProps) => (
  <ul className="flex flex-col gap-2">{children}</ul>
);

SectionList.Item = SectionListItem;
