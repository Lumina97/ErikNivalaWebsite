import React, { ReactNode } from "react";

const InputFieldComponent = ({
  Title,
  classname,
  props,
  children,
}: {
  Title: string;
  classname?: string;
  props: React.InputHTMLAttributes<HTMLInputElement>;
  children?: ReactNode;
}) => {
  return (
    <div className={`inputFieldContainer ${classname}`}>
      <label>{Title}</label>
      <input {...props} />
      {children}
    </div>
  );
};

export default InputFieldComponent;
