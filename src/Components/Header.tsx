import { LogoFullFilePath, profilePicturePath } from "../settings";

const Header = () => {
  return (
    <div className="headerWrapper">
      <div className="profileImgWrapper">
        <div className="profileImgInner">
          <div className="profileImageFront">
            <img src={LogoFullFilePath} />
          </div>
          <div className="profileImageBack">
            <img src={profilePicturePath} />
          </div>
        </div>
      </div>
      <h1 className="headerTitleText">Coding is life!</h1>
    </div>
  );
};

export default Header;
