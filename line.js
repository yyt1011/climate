export default class Line {
  constructor(data, width, height, g2) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.el = g2;
    this.cleanData();
    this.setScales();
    this.drawLines();
  }

  cleanData() {
    this.data.forEach((d) => {
      return (d.avg = +d.avg);
    });
    this.groupByCountry = d3
      .nest()
      .key((d) => d.Code)
      .entries(this.data);
  }

  setScales() {
    const xRange = d3.extent(this.data, (d) => d.Year);
    this.xScale = d3.scaleLinear().domain(xRange).range([0, this.width]);
    this.yMax = Math.round(d3.max(this.data, (d) => d.avg) / 5) * 5;
    this.yMin = Math.round(d3.min(this.data, (d) => d.avg) / 5) * 5;
    this.yScale = d3
      .scaleLinear()
      .domain([this.yMin, this.yMax])
      .range([this.height, 0]);
    const yAxis = d3.axisRight(this.yScale).ticks(8).tickFormat(d3.format("+"));
    this.el
      .append("g")
      .attr("class", "y axis right")
      .call(yAxis)
      .attr("transform", "translate(" + this.width + "," + 0 + ")")
      .select(".domain")
      .remove();
  }

  drawLines() {
    const line = d3
      .line()
      .x((d) => {
        // console.log(d);
        return this.xScale(d.Year);
      })
      .y((d) => {
        return this.yScale(d.avg);
      });

    const lines = this.el.append("g").attr("class", "lines");

    const drawLine = (country) => {
      const selectedCountry = this.groupByCountry.filter(
        (d) => d.key == country
      );
      // data() function will take an array, the length of the array will
      // determine how many lines you want to generate,
      //so in this case, I want to draw one line, I need to pass ARG --[{...}]-- instead of ARG.values
      // which will append 56 path
      // also ARG is an array but ARG[0] is an object, data() function can't take an object
      const lineDataJoin = lines.selectAll("path").data(selectedCountry);
      lineDataJoin
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .merge(lineDataJoin)
        .attr("fill", "none")
        .attr("stroke", "#E25A42")
        .attr("stroke-width", 2)
        .transition()
        .duration(1000)
        .attr("d", (d) => line(d.values));

      lineDataJoin.exit().remove();
    };
    const selectButton = document.getElementById("country_select");
    //initiate
    const defaultCountry = selectButton.value;
    drawLine(defaultCountry);
    //update
    selectButton.addEventListener("change", (event) => {
      drawLine(event.target.value);
    });
  }
}
