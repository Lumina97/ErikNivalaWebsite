import emailjs from "@emailjs/browser";

export type TFormData = {
  name: string;
  email: string;
  message: string;
};
export const sendEmail = async (data: TFormData) => {
  init();
  return emailjs.send("service_o8ay9sa", "template_xfv49lp", {
    from_name: data.name,
    message: data.message,
    from_email: data.email,
  });
};

const init = () => {
  emailjs.init({
    publicKey: "gUZOghklUU05IAq4c",
    // Do not allow headless browsers
    blockHeadless: true,
    limitRate: {
      // Set the limit rate for the application
      id: "app",
      // Allow 1 request per 10s
      throttle: 10000,
    },
  });
};
