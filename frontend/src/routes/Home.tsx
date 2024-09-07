import MainSection from "../mainSection";

const Home = () => {
  return (
    <MainSection title="Home">
      <p>
        Welcome to my website which serves as a central display of my projects.
      </p>
      <p>Check out more about each of my projects in the Portfolio tab.</p>
      <p>
        Short explanation about my Image gatherer! You enter any Reddit that you
        want to scan for posts with images attached as well as how many posts
        you want to scan (max is 100) and you can also add some filters which
        are applied to the title of the posts.
        <br />
        <br />
        It then takes the given information, checks if the Reddit is valid,
        downloads the posts, checks if there is an Image attached to the post,
        applies filters to the title of the post, returns all the image links
        that were found and sends them to the user.
        <br />
        <br />
        User can then look at them in the collection view with previews and
        click on images for a full scale preview. They can then either download
        all images or download only selected. The user can also favorite images
        and the links will be saved to local storage.
      </p>
    </MainSection>
  );
};

export default Home;
