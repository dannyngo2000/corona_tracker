import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
          suggestedMin: 50,
          suggestedMax: 100,
        },
      },
    ],
  },
};

const buildChartData = (data, casesType = "cases") => {
  let chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }

  return chartData;
};

function LineGraph({ casesType, country }) {
  const [data, setData] = useState({});

  const url =
    country === "worldwide"
      ? `https://disease.sh/v3/covid-19/historical/all?lastdays=30`
      : `https://disease.sh/v3/covid-19/historical/${country}?lastdays=30`;

  useEffect(() => {
    const fetchData = async () => {
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (country !== "worldwide") {
            let chartData = buildChartData(data.timeline, casesType);
            setData(chartData);
          } else {
            let chartData = buildChartData(data, casesType);
            setData(chartData);
          }
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType, country]);

  return (
    <div>
      {/**Check if data exists**/}
      {data?.length > 0 &&
        (casesType === "recovered" ? (
          <Bar
            data={{
              datasets: [
                {
                  backgroundColor: "#99ff99",
                  borderColor: "#00cc00",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        ) : (
          <Bar
            data={{
              datasets: [
                {
                  backgroundColor: "#ff8080",
                  borderColor: "#ff1a1a",
                  data: data,
                },
              ],
            }}
            options={options}
          />
        ))}
    </div>
  );
}

export default LineGraph;
