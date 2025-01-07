import { messageMinimumLength } from "../settings";

export const isFirstNameValid = (firstName: string) => {
  return firstName.length > 0 && !/\d/.test(firstName);
};
export const isLastNameValid = (lastName: string) => {
  return lastName.length > 0 && !/\d/.test(lastName);
};

export const isEmailValid = (email: string) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return !!email?.match(regex);
};

export const isMessageValid = (message: string) => {
  return message.length >= messageMinimumLength;
};
