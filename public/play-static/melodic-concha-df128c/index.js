const width = window.innerWidth;
const height = window.innerHeight;
const svg = d3.select("svg");
const color = d3.scaleOrdinal(d3.schemeCategory10);

const file = "migration_processed_emigration.csv"; // Change file here
const selectedYear = "2023"; // Change year here

d3.csv(file).then((data) => {
  const root = buildHierarchy(data, selectedYear);

  const pack = d3.pack()
    .size([width, height])
    .padding(3);

  const rootPacked = pack(d3.hierarchy(root)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value));

  const node = svg.selectAll("g")
    .data(rootPacked.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("class", "bubble");

  node.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => d.children ? color(d.data.name) : "#ccc")
    .attr("stroke", "#999");

  node.filter(d => !d.children)
    .append("text")
    .attr("dy", "0.3em")
    .style("text-anchor", "middle")
    .text(d => d.data.name);
});

function buildHierarchy(data, year) {
  const regions = d3.group(data, d => d.Region);

  const root = {
    name: "Vietnam",
    children: []
  };

  for (const [region, rows] of regions) {
    const regionNode = {
      name: region,
      children: []
    };

    rows.forEach(row => {
      const province = row.Province;
      const value = +row[year];
      if (province) {
        regionNode.children.push({ name: province, value });
      }
    });

    if (regionNode.children.length) {
      root.children.push(regionNode);
    }
  }

  return root;
}
