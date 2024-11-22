import "../Style-UserProfile.scss";
import Logo from '../../../../src/assets/logo.png';
import {GoArrowLeft} from "react-icons/go";
import {Link} from "react-router-dom";

const ProfileDefaultHeader = ({ backLink = "/" }) => {
    return (
        <>
            <div className="header">
                <Link to={backLink}>
                    <GoArrowLeft size={56} />
                </Link>
                <img className="logo-img" src={Logo} alt={"Logo"} />
                <button>Account</button>
            </div>
        </>
    );
};

export default ProfileDefaultHeader;