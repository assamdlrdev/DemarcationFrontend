import { useEffect, useRef, useState } from "react";

// npm install ol proj4 @types/proj4
import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import OlText from "ol/style/Text";
import Overlay from "ol/Overlay";
import { type FeatureLike } from "ol/Feature";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import "ol/ol.css";

// Register UTM Zone 45N (covers Assam / Northeast India)
proj4.defs(
  "EPSG:32645",
  "+proj=utm +zone=45 +datum=WGS84 +units=m +no_defs"
);
register(proj4);

// ─── Types ────────────────────────────────────────────────────────────────────

interface PopupContent {
  dagNo: number;
  area: string; // repurposed as village/mouza info
}

interface VillageMapProps {
  /** GeoJSON FeatureCollection to render */
  geoJsonData: object | null;
  /** Pass "NC_TO_C" to enable dag-range highlighting */
  caseType?: string | null;
  /** Minimum dag number to highlight (only used if caseType === "NC_TO_C") */
  minDagNo?: number | null;
  /** Maximum dag number to highlight (only used if caseType === "NC_TO_C") */
  maxDagNo?: number | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VillageMap({
  geoJsonData = null,
  caseType = null,
  minDagNo = null,
  maxDagNo = null,
}: VillageMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [noFeatures, setNoFeatures] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<PopupContent | null>(null);

  const highlightDags: boolean =
    caseType === "NC_TO_C" && minDagNo !== null && maxDagNo !== null;

  useEffect(() => {
    if (!geoJsonData || !mapRef.current || !popupRef.current) return;

    // Cleanup previous map instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(undefined);
      mapInstanceRef.current = null;
    }

    const format = new GeoJSON();
    const features = format.readFeatures(geoJsonData, {
      dataProjection: "EPSG:32645",
      featureProjection: "EPSG:3857",
    });

    if (features.length === 0) {
      setNoFeatures(true);
      setLoading(false);
      return;
    }

    setNoFeatures(false);

    const styleFunction = (feature: FeatureLike): Style => {
      const textValue = feature.get("TEXTPARCEL") as string | undefined;
      const intValue = parseInt(textValue ?? "", 10);

      let isHighlighted = false;
      if (highlightDags && !isNaN(intValue) && minDagNo !== null && maxDagNo !== null) {
        isHighlighted = intValue >= minDagNo && intValue <= maxDagNo;
      }

      return new Style({
        fill: new Fill({
          color: isHighlighted ? "rgba(255, 0, 0, 0.5)" : "rgba(201, 199, 77, 0.5)",
        }),
        stroke: new Stroke({
          color: isHighlighted ? "#ff0000" : "#17202A",
          width: isHighlighted ? 2 : 1,
        }),
        text: new OlText({
          font: "12px Verdana",
          text: isNaN(intValue) ? "" : intValue.toString(),
          fill: new Fill({ color: "black" }),
          stroke: new Stroke({ color: "white", width: 0.5 }),
        }),
      });
    };

    const vectorSource = new VectorSource({ features });

    const villVector = new VectorLayer({
      source: vectorSource,
      style: styleFunction,
    });

    const popup = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });

    const map = new Map({
      layers: [villVector],
      target: mapRef.current,
      view: new View({
        zoom: 4,
        minZoom: 0,
        maxZoom: 100,
      }),
      overlays: [popup],
    });

    const extent = vectorSource.getExtent();
    if (extent) {
      map.getView().fit(extent, {
        size: map.getSize(),
        maxZoom: 18,
        padding: [20, 20, 20, 20],
      });
    }

    map.on("pointermove", (evt) => {
      const feature = map.forEachFeatureAtPixel(
        evt.pixel,
        (f: FeatureLike) => f
      );

      if (feature) {
        const textValue = feature.get("TEXTPARCEL") as string | undefined;
        const intValue = parseInt(textValue ?? "", 10);
        const village = feature.get("VILLAGE") as string | undefined;
        const mouza = feature.get("MOUZA") as string | undefined;

        setPopupContent({ dagNo: intValue, area: `${village ?? ""}${mouza ? ` — ${mouza}` : ""}` });
        popup.setPosition(evt.coordinate);
      } else {
        setPopupContent(null);
        popup.setPosition(undefined);
      }
    });

    mapInstanceRef.current = map;
    setLoading(false);

    return () => {
      map.setTarget(undefined);
    };
  }, [geoJsonData, caseType, minDagNo, maxDagNo]);

  return (
    <div style={{ position: "relative", width: "100%", height: "600px", fontFamily: "Verdana, sans-serif" }}>
      {/* Map Container */}
      <div
        ref={mapRef}
        id="map1"
        style={{ width: "100%", height: "100%", background: "#e8e0d0" }}
      />

      {/* Popup Overlay Element */}
      <div ref={popupRef} style={{ position: "absolute" }}>
        {popupContent && (
          <div
            style={{
              background: "white",
              border: "1px solid #17202A",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              transform: "translate(-50%, calc(-100% - 10px))",
            }}
          >
            <div><strong>Dag No:</strong> {popupContent.dagNo}</div>
            <div><strong>Village:</strong> {popupContent.area}</div>
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid #17202A",
              }}
            />
          </div>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.7)",
            zIndex: 10,
          }}
        >
          <div style={{ fontSize: "14px", color: "#555" }}>Loading map…</div>
        </div>
      )}

      {/* No Features Alert */}
      {noFeatures && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "24px 32px",
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "8px" }}>ℹ️</div>
            <div style={{ fontSize: "14px", color: "#333" }}>
              The village map was not found on the Bhunaksha portal.
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "11px",
          zIndex: 5,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <div style={{ width: 14, height: 14, background: "rgba(201,199,77,0.5)", border: "1px solid #17202A", borderRadius: 2 }} />
          <span>Normal Dag</span>
        </div>
        {highlightDags && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: 14, height: 14, background: "rgba(255,0,0,0.5)", border: "2px solid #ff0000", borderRadius: 2 }} />
            <span>Highlighted ({minDagNo}–{maxDagNo})</span>
          </div>
        )}
      </div>
    </div>
  );
}

/*
──────────────────────────────────────────────────────────
USAGE EXAMPLE
──────────────────────────────────────────────────────────

import VillageMap from "./VillageMap";

// Basic usage
<VillageMap geoJsonData={myGeoJson} />

// With NC_TO_C highlight range
<VillageMap
  geoJsonData={myGeoJson}
  caseType="NC_TO_C"
  minDagNo={10}
  maxDagNo={50}
/>
*/
