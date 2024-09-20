import { ReactNode } from "react";

const SectionComponent = ({
  children,
  props,
}: {
  children: ReactNode;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <div className="section" {...props}>
      {children}
    </div>
  );
};

export default SectionComponent;
