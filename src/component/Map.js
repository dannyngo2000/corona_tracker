import React from "react";
import "./Map.css";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { displayDataOnMap } from "../util/displayDataOnMap";
//Using react-leaflet to display map
function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="app__map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        ></TileLayer>

        {/** Function that loops through an draw a circle on the screen */}
        {displayDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}
export default Map;
