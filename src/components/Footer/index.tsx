import logo from '../../../public/images/nic-logo.png';
import './style.scss';

const Footer = () =>{
return(
<div className="footer-container">
    <div className="left-text">Copyright © 2025 Government of Assam</div>
    <div className="right-text-container">
        <div className="text">Designed & Developed by © NIC </div>
        <div className="image-container">
            <img src={logo} alt="logo" />
        </div>
    </div>
</div>    
)
}

export default Footer;