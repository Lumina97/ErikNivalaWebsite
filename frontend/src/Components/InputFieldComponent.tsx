import React, { ReactNode } from "react";

const InputFieldComponent = ({
  labelTitle,
  wrapperProps,
  props,
  children,
}: {
  labelTitle: string;
  wrapperProps?: React.InputHTMLAttributes<HTMLInputElement>;
  props: React.InputHTMLAttributes<HTMLInputElement>;
  children?: ReactNode;
}) => {
  return (
    <div {...wrapperProps}>
      <label className="inputLabel">{labelTitle}</label>
      <input {...props} />
      {children}
    </div>
  );
};

export default InputFieldComponent;
