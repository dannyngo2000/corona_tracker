import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
//Draw red circles on the map, interactive tooltops popup from leaflet
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#262626",
    multiplier: 2000,
  },
};

export const displayDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    //We got latitude and longitude data from the the disease.sh api,
    //which means we can use it here

    //Each different color for different type of cases
    //Based on the number of cases, generate a circle accordingly
    //The center of a circle will be at that specific country latitude and longitude
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.7}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div
            className="info-cases"
            style={{ color: casesTypeColors.cases.hex }}
          >
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div
            className="info-recovered"
            style={{ color: casesTypeColors.recovered.hex }}
          >
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div
            className="info-deaths"
            style={{ color: casesTypeColors.deaths.hex }}
          >
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
