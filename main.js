import Scatterplot from "./scatterplot.js";
import Line from "./line.js";

const width = 800;
const height = 600;
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const container = d3.select("#chart");

const G20 = [
  "ARG",
  "AUS",
  "BRA",
  "CAN",
  "CHN",
  "FRA",
  "DEU",
  "IND",
  "IDN",
  "ITA",
  "JPN",
  "MEX",
  "RUS",
  "SAU",
  "ZAF",
  "KOR",
  "TUR",
  "GBR",
  "USA",
];

const svg = container
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
const g1 = svg
  .append("g")
  .attr("id", "scatterplot")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const g2 = svg
  .append("g")
  .attr("class", "linechart")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/country_long.csv").then(function (data) {
  const scatterPlot = new Scatterplot(data, width, height, g1, G20);
});

d3.csv("./data/climate_avg.csv").then(function (data) {
  const line = new Line(data, width, height, g2);
});
