import { useState } from "react";
import InputFieldComponent from "./InputFieldComponent";
import {
  isEmailValid,
  isFirstNameValid,
  isLastNameValid,
  isMessageValid,
} from "../TS/InputValidation";
import { messageMinimumLength } from "../settings";
import { sendEmail, TFormData } from "../TS/api";
import toast from "react-hot-toast";

const firstNameError =
  "First name cannot contain numbers and must be at least 1 character long!";
const lastNameError =
  "Last name cannot contain numbers and must be at least 1 character long!";
const emailError = "Email is not valid!";
const messageError = `Message has to be at least ${messageMinimumLength} characters long!`;

const ContactFormComponent = () => {
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWasSubmitted(true);
    if (
      isFirstNameValid(firstName) &&
      isLastNameValid(lastName) &&
      isEmailValid(email) &&
      isMessageValid(message)
    ) {
      const data: TFormData = {
        name: `${firstName} ${lastName}`,
        email: email,
        message: message,
      };
      sendEmail(data)
        .then(() => {
          setWasSubmitted(false);
          toast.success("Submitted form!");
          setFirstName("");
          setLastName("");
          setEmail("");
          setMessage("");
        })
        .catch(() => {
          toast.error("There was an error submitting your data");
        });
    }
  };

  return (
    <div className="contactFormWrapper">
      <h2>Contact me</h2>

      <form onSubmit={(e) => onFormSubmit(e)}>
        <InputFieldComponent
          labelTitle="First Name:"
          props={{
            onChange: (e) => setFirstName(e.target.value),
            type: "text",
            value: firstName,
          }}
        />
        {wasSubmitted && !isFirstNameValid(firstName) && (
          <div className="inputFieldErrorText">{firstNameError}</div>
        )}
        <InputFieldComponent
          labelTitle="Last Name:"
          props={{
            onChange: (e) => setLastName(e.target.value),
            type: "text",
            value: lastName,
          }}
        />
        {wasSubmitted && !isLastNameValid(lastName) && (
          <div className="inputFieldErrorText">{lastNameError}</div>
        )}
        <InputFieldComponent
          labelTitle="Email:"
          props={{
            onChange: (e) => setEmail(e.target.value),
            type: "email",
            value: email,
          }}
        ></InputFieldComponent>
        {wasSubmitted && !isEmailValid(email) && (
          <div className="inputFieldErrorText">{emailError}</div>
        )}

        <div className="textAreaWrapper">
          <label className="inputLabel">Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={600}
          >
            &#10;
          </textarea>
          {wasSubmitted && !isMessageValid(message) && (
            <div className="inputFieldErrorText">{messageError}</div>
          )}
        </div>

        <InputFieldComponent
          labelTitle=""
          wrapperProps={{ id: "contactFormSubmit" }}
          props={{ type: "submit" }}
        ></InputFieldComponent>
      </form>
    </div>
  );
};

export default ContactFormComponent;
