import React from "react";
import "./InfoBox.css";
import { Box } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
//Passing props in and destructure it into title and cases

function InfoBox({ backgroundColour, title, cases, total, ...props }) {
  //Using card element from materialUI
  return (
    <Box onClick={props.onClick} className="infoBox" color="primary.main">
      <CardContent>
        {/**Title */}
        <Typography className="infoBox__title" colour="textSecondary">
          <h2> {title} </h2>
        </Typography>
        {/**Number of cases */}

        {title === "Recovered" ? (
          <h2 className="infoBox__cases" style={{ color: "green" }}>
            {cases}{" "}
          </h2>
        ) : (
          <h2 className="infoBox__cases" style={{ color: "red" }}>
            {cases}{" "}
          </h2>
        )}

        {/* Total cases */}
        <Typography className="infoBox__total" colour="textSecondary">
          Total: {total} cases
        </Typography>
      </CardContent>
    </Box>
  );
}
export default InfoBox;
