import bannerImage from '../../../public/images/building permit-pana-banner.png';
import './style.scss';


const Banner = () =>{
return(
    <div className="banner-container">
        <div className="left-container">
            <img src={bannerImage} alt="banner" />
        </div>
        <div className="right-container">
            <div className="title">Know Exactly Where Your Land Begins and Ends</div>
            <div className="desc">Submit a demarcation request and get your boundary officially marked on the map and on the ground. Stay informed at every step and avoid future land disputes.</div>
            <div className="info">Scroll and provide the information requested below</div>
        </div>
    </div>
)
}

export default Banner;