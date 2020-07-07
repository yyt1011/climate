const scatterSource = "The World Bank";

export default class Scatterplot {
  constructor(data, width, height, g1, G20) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.el = g1;
    this.G20 = G20;
    this.cleanData();
    this.dropdown();
    this.drawAxises();
    this.drawScatter();
  }

  cleanData() {
    this.data.forEach((element) => {
      return (element.value = parseFloat(element.co2emission));
    });
    this.filtered = this.data.filter((d) => {
      return d.year != "" && d.co2emission != "NA" && this.G20.includes(d.Code);
    });
    this.groupByCountry = d3
      .nest()
      .key((d) => d.Code)
      .entries(this.filtered);
  }

  dropdown() {
    const dropdown = d3.select("#country_select");
    dropdown
      .selectAll("option")
      .data(this.groupByCountry)
      .enter()
      .append("option")
      .attr("value", (d) => d.key)
      .text((d) => {
        return d.values[0].Name;
      });
  }

  drawAxises() {
    //x axis
    this.xMin = d3.min(this.filtered, (d) => d.year);
    //   d3.extent(filtered, (d) => {
    //     return d.year;
    // })
    const xTickFormat = (number) => {
      return d3.format("")(number);
    };
    this.xScale = d3
      .scaleLinear()
      .domain([this.xMin, "2020"])
      .range([0, this.width]);
    const xAxis = d3.axisBottom(this.xScale).tickFormat(xTickFormat);

    this.el
      .append("g")
      .attr("class", "x axis")
      .call(xAxis)
      .attr("transform", "translate(" + 0 + "," + this.height + ")")
      .select(".domain")
      .remove();

    // y axis
    this.yMax =
      Math.round(
        d3.max(this.filtered, (d) => {
          return d.value;
        }) / 5
      ) * 5;
    this.yScale = d3
      .scaleLinear()
      .domain([-10, this.yMax])
      .range([this.height, 0]);
    const yAxis = d3
      .axisLeft(this.yScale)
      .ticks(9)
      .tickSize(-this.width)
      .tickFormat(d3.format("+"));
    const yAxisWrap = this.el.append("g").attr("class", "y axis");
    yAxisWrap.call(yAxis).select(".domain").remove();

    //add units to first tick
    d3.selection.prototype.last = function () {
      // const last = this.size() - 1;
      // return d3.select(this[0][last]);
    };
    const ticks = yAxisWrap.selectAll(".tick text");
    console.log(ticks);

    const yFirstTick = yAxisWrap.selectAll(".tick text");
    yFirstTick.last();
    yAxisWrap
      .append("text")
      .attr("class", "label")
      .style("text-anchor", "middle")
      .attr(
        "transform",
        "translate(" + -40 + "," + this.height / 2 + ") rotate(-90)"
      )
      .attr("fill", "black")
      .text("CO2 emission, metric tons per capita");
    this.el
      .append("text")
      .attr("class", "source")
      .text(`Source: ${scatterSource}`)
      .attr("x", this.width - 120)
      .attr("y", this.height + 40);
  }

  drawScatter() {
    const scatterplot = this.el.append("g").attr("class", "scatter circles");

    const drawScatterplot = (country) => {
      let selectedCountry = this.groupByCountry.filter((d) => {
        return d.key == `${country}`;
      })[0].values;

      const scatterDataJoin = scatterplot
        .selectAll("circle")
        .data(selectedCountry);
      scatterDataJoin
        .enter()
        .append("circle")
        .merge(scatterDataJoin)
        .transition()
        .duration(2000)
        .attr("cx", (d) => this.xScale(d.year))
        .attr("cy", (d) => this.yScale(d.co2emission))
        .attr("r", 5)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("fill", "#42A5B3");
      scatterDataJoin.exit().remove();
    };

    //initiate scatterplot
    const selectButton = document.getElementById("country_select");
    const defaultCountry = selectButton.value;

    drawScatterplot(defaultCountry);
    //update
    selectButton.addEventListener("change", (event) => {
      drawScatterplot(event.target.value);
    });
  }
}
