import flagImage from '../../../public/images/flag.png';
import emblame from '../../../public/images/emblem.png';
import './style.scss';


const Header = () =>{
return(
    <div className="header">
        <div className="top-nav">
            <div className="flag-image-container">
            <img src={flagImage} alt="flag" />
            </div>
            <div className="text-container">
                <div className="text-one">Govt of Assam</div>
                <div className="separator"></div>
                <div className="text-two">Department of Revenue and Disaster Management </div>
            </div>
        </div>
        <div className="main-header">
            <div className="image-container">
                <img src={emblame} alt='emblame' />
            </div>
            <div className="text-container">
                <div className="text-top">Demarcation</div>
                <div className="text-bottom">Integrated Land Record Management System</div>
            </div>
        </div>
    </div>
)
}

export default Header;