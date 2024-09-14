interface SectionTitleProps {
  children: React.ReactNode;
}

export const SectionTitle = ({ children }: SectionTitleProps) => (
  <h3 className="text-lg font-semibold leading-tight tracking-tight">
    {children}
  </h3>
);
