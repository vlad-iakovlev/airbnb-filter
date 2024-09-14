import { SectionList } from "./List/index.jsx";
import { SectionTitle } from "./Title.jsx";

interface SectionProps {
  children: React.ReactNode;
}

export const Section = ({ children }: SectionProps) => (
  <div className="flex flex-col gap-4">{children}</div>
);

Section.List = SectionList;
Section.Title = SectionTitle;
