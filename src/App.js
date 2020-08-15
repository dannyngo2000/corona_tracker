import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./component/InfoBox";
import Map from "./component/Map";
import Table from "./component/Table";
import { sortFunction } from "./util/sortFunction";
import LineGraph from "./component/LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrint } from "./util/prettyPrint";
import numeral from "numeral";

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

//BAM naming convention
function App() {
  // Using hook, countries as variable, specify modifier to change value : setCountries
  const [countries, setCountries] = useState([]);

  //This is where we marked the selected country, it's original state is worldwide
  const [country, setCountry] = useState("worldwide");

  //This is where we get countryInfo, create another state

  const [countryInfo, setCountryInfo] = useState({});

  //This is the state for TABLE
  const [tableData, setTableData] = useState([]);

  //New state for mapCenter and mapZoom
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4769 });

  const [mapZoom, setMapZoom] = useState(3);

  //New state for mapCountries
  const [mapCountries, setMapCountries] = useState([]);

  //Cases types
  const [casesType, setCasesType] = useState("cases");

  //New state for setting map bounds

  //Making REQUEST to : "https://disease.sh/v3/covid-19/countries"

  useEffect(() => {
    fetch(`https://disease.sh/v3/covid-19/all`)
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);
  //Use useEffect to run the code based on a given condition
  useEffect(() => {
    //async function to get from the endpoint
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //United States, United Kingdom
            value: country.countryInfo.iso2, //US, UK
            flag: country.countryInfo.flag,
          }));

          //Sorting the country from one have more cases to less cases
          const sortedData = sortFunction(data);
          //Passing data into table data for TABLE
          setTableData(sortedData);

          //Set map countries
          setMapCountries(data);

          //Popping countries that we mapped to
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  //If we leave the array/square blank, the code will only once run when the component loads
  // Else, it will run once when the component load, and again when the stuff inside that square changed
  /** State : how to write a variable in React */

  //onChange to select the country
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    console.log(countryCode);
    //https://disease.sh/v3/covid-19/all for worldwide
    //Calling api to grab  https://disease.sh/v3/covid-19/countries/COUNTRY_CODE
    const url =
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        //This will mark the country but not the 2 digit-code because we specified the value as country in the Select
        //After that, we change the state of country
        setCountry(countryCode);

        //We are storing all of the data... from the response and display it
        setCountryInfo(data);

        //Passing in longitude, and lattitude from country in the API
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        } else {
          setMapCenter({ lat: 34.80746, lng: -40.4769 });
          setMapZoom(3);
        }
      });
  };

  return (
    <div className="app">
      <Card className="app__left">
        {/** Table */}
        <CardContent>
          <h3> Active cases from each country</h3>
          <Table countries={tableData}></Table>
          <h3>
            {" "}
            {country} {casesType} record:
          </h3>
        </CardContent>
        {/** Graph */}
        <LineGraph casesType={casesType} country={country}>
          {" "}
        </LineGraph>
      </Card>
      <div className="app__right">
        <div className="app__header">
          <h1>COVID-19 TRACKER: As of {today} </h1>
          {/** Header */}
          {/** Title + Select dropdown field */}
          {/**app__dropdwon is BAM convention, first part is component, second part is element" **/}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={
                //Marking dropdown country to be display
                country
              }
              onChange={onCountryChange}
            >
              {/** loop thru all the countries then dropdown list of options
               * by using states
               */}
              <MenuItem value="worldwide"> Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem
                  value={country.value}
                  style={{ backgroundImage: `url(${country.flag})` }}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/** InfoBox: Coronavirus cases*/}

          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Active"
            cases={prettyPrint(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format(0, 0)}
          ></InfoBox>

          {/** InfoBox: Recovered */}
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            className="recovered"
            title="Recovered"
            cases={prettyPrint(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format(0, 0)}
          >
            {" "}
          </InfoBox>

          {/** InfoBox: Death */}

          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            className="deaths"
            title="Deaths"
            cases={prettyPrint(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format(0, 0)}
          >
            cases{" "}
          </InfoBox>
          <InfoBox
            className="tests"
            title="Tests"
            cases={
              numeral(countryInfo.testsPerOneMillion).format(0, 0) +
              " tests/mil"
            }
            backgroundColour="#000000"
            total={numeral(countryInfo.tests).format(0, 0)}
          ></InfoBox>
        </div>
        {/** Map */}
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        <div>
          <a href="https://corona.lmao.ninja/">Data source</a>
        </div>
      </div>
    </div>
  );
}

export default App;
