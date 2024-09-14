interface SectionListItemProps {
  children: React.ReactNode;
}

export const SectionListItem = ({ children }: SectionListItemProps) => (
  <li>{children}</li>
);
