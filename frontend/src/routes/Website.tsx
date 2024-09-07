import MainSection from "../mainSection";

const Website = () => {
  return (
    <MainSection title="Website">
      <p>Welcome to the more technical explanation of my website!</p>
      <p>
        It's is hosted on an OrangePi-5 which is running a version of linux. In
        order to protect myself I did not open any ports to the internet but
        rather I am using a service called cloudflare which acts as a reverse
        proxy hosting my page online.
      </p>
      <p>
        The website is somewhat slow to to return a response on the image
        gatherer due to the hardware limitations of the orangePi-5.
      </p>
      <p>
        I bought my own domain from google domains and used that for cloudflare
        to redirect my traffic. In order for that to work I had to use the
        cloudflare DNS servers which I simply added to the Google domain for my
        website to be found online.
      </p>
      <p>
        I have a linode server that checks uptime for my website response and my
        ImageGatherer post request. It checks if the website itself is up every
        30 seconds and it sends a post request for the ImageGatherer every 60
        seconds.
      </p>
    </MainSection>
  );
};

export default Website;
