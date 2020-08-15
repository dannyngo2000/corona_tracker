import React from "react";
import numeral from "numeral";
import "./Table.css";
function Table({ countries }) {
  //Destructure the country and cases

  return (
    <div className="table">
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{numeral(cases).format("0,0")} </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;