const width = 800;
const radius = width / 2;

const arc = d3.arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => d.y0)
  .outerRadius(d => d.y1);

const partition = data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);
  return d3.partition().size([2 * Math.PI, radius])(root);
};

d3.csv("international_cleaned.csv").then(raw => {
  const nested = d3.rollup(
    raw,
    v => ({
      VDV: d3.sum(v, d => +d.VDV),
      HCV: d3.sum(v, d => +d.HCV),
      HCB: d3.sum(v, d => +d.HCB),
      HCD: d3.sum(v, d => +d.HCD),
      details: v.map(d => ({
        country: d['Indonesia'] || d['Hồng Kông'], // Use actual column
        VDV: +d.VDV, HCV: +d.HCV, HCB: +d.HCB, HCD: +d.HCD
      }))
    }),
    d => d.Sport
  );

  const data = {
    name: "All Sports",
    children: Array.from(nested, ([sport, val]) => ({
      name: sport,
      children: ["HCV", "HCB", "HCD"].map(medal => ({
        name: medal,
        value: val[medal]
      })),
      value: val.VDV
    }))
  };

  const root = partition(data);
  const svg = d3.select("svg")
    .attr("viewBox", [0, 0, width, width])
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);

  const path = svg.selectAll("path")
    .data(root.descendants().filter(d => d.depth))
    .join("path")
    .attr("fill", d => {
      if (d.depth === 1) return d3.schemeCategory10[d.index % 10];
      if (d.data.name === "HCV") return "#FFD700";
      if (d.data.name === "HCB") return "#C0C0C0";
      if (d.data.name === "HCD") return "#CD7F32";
      return "#ccc";
    })
    .attr("d", arc)
    .each(function(d) {
      d.current = d;
    });

  path.each(function(d, i) {
    gsap.fromTo(this, {
      opacity: 0,
      scale: 0.8
    }, {
      opacity: 1,
      scale: 1,
      delay: i * 0.01,
      duration: 0.5
    });
  });
});
