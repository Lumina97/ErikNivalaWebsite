import React from "react";

const InputFieldComponent = ({
  Title,
  props,
}: {
  Title: string;
  props: React.InputHTMLAttributes<HTMLInputElement>;
}) => {
  return (
    <>
      <label>{Title}</label>
      <input {...props} />
    </>
  );
};

export default InputFieldComponent;
