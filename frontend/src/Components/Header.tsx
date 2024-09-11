import { LogoFullFilePath } from "../settings";

const Header = () => {
  return (
    <div className="headerWrapper">
      <div className="profileImgAnimationWrapper">
        <div className="profileImgWrapper">
          <img src={LogoFullFilePath} />
        </div>
      </div>
      <h1 className="headerTitleText">Coding is life!</h1>
    </div>
  );
};

export default Header;
