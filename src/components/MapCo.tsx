import { useEffect } from "react";
import VillageMap from "./VillageMap";



type MapCoType = {
    mapdata: any;
    dag_no: string;
}

const MapCo: React.FC<MapCoType> = ({mapdata, dag_no}) => {

    useEffect(() => {
        if (dag_no && mapdata?.features) {
            console.log(dag_no);
            // const featureWithArea = calculateAreaByKide(mapdata, dag_no);
            // if (featureWithArea) {
            //     setMatchedFeatureWithArea(featureWithArea);
            //     setAreaSm(featureWithArea.properties.area_sqm);
            //     setTriggerLandRevenue(featureWithArea.properties.area_sqm);
            //     // toast.success("Area fectched from draft Bhunaksa successfully");
            // } else {
            //     setMatchedFeatureWithArea('');-
            //     setAreaSm(0);
            //     // toast.error('Survey number does not exist in draft Bhunaksa');
            // }
        }
    }, [mapdata, dag_no]);


    return (
        <div style={{ padding: "15px 15px" }}>
            <VillageMap geoJsonData={mapdata} />
        </div>
    );
};

export default MapCo;