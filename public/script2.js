console.log(d3.version)


let pac76SankeyJson = {
    "nodes": [],
    "links": []
}

let groupByFirst = []

// temp stuff for "igv style" barchart
let maxReadNum = 2806

// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 40, left: 90 },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// ----------------
// Create a tooltip
// ----------------
var tooltip = d3.select("#my_dataviz").append("div")
    .style("opacity", 0)
    //.attr("class", "tooltip")
    .style("width", "150px")
    .style("height", "90px")
    .style("position", "absolute")
    .style("background-color", "lightsteelblue")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    
    
    // sort data when needed 
        d3.select('#sortBySelect').on("change", function() {
            const selectedOption = this.value
            switch(selectedOption) {
                case 'count':
                    data2.sort((a,b) => {
                        return d3.ascending(a.count, b.count)
                    })
                    break;
                
                case 'coverage':
                    data2.sort((a,b) => {
                        return d3.ascending(a.coverage, b.coverage)
                    })
                    break;
            }
        })

// turn full csv to node link json
function doStuff() {
    d3.json('tiles.json').then((data) => {

        // fix tiles section to be array of objects
        data.map((d) => {
            let stringArr = d.tiles.split(',')
            let tileArr = []
            stringArr.forEach((v) => {
                let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': 't' }
                obj.name = v.split('[')[0]
                obj.start = v.split('[')[1].split(']')[0].split('-')[0]
                obj.end = v.split('[')[1].split(']')[0].split('-')[1]
                obj.strand = v.split('(')[1].split(')')[0]
                tileArr.push(obj)
            })
            d.tiles = tileArr
        })

        // fix tiles to each be an independent line
        let data2 = []

        data.forEach((d, di) => {

            let tileCov = 0
            d.tiles.forEach((x) => {
                let dif = x.end - x.start
                tileCov += dif
            })

            tileCov = (tileCov / maxReadNum) * 100
            tileCov = Math.round(tileCov * 100) / 100

            d.tiles.forEach((x, xi) => {
                let obj = {
                    "id": di,
                    "count": d.count,
                    "dist": d.dist,
                    "tile": {
                        "tile_id": xi,
                        "name": x.name,
                        "start": x.start,
                        "end": x.end,
                        "strand": x.strand
                    },
                    "coverage": tileCov
                }
                data2.push(obj)

            })

        })
        
        console.log(data2)

        /**
         *  Plot data in horizontal bar chart "igv style"
         * 
         */
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, maxReadNum + 94]) // round maxReadNum up some how in future
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(data.map(function (d, i) { return i; }))
            .padding(.1);
        svg.append("g")
            .call(d3.axisLeft(y))

        // color palette = one color per type
        var color = d3.scaleOrdinal()
            .domain(["SMRT-Bell", "Payload"])
            .range(['#4daf4a', '#A020F0', '#e41a1c', '#377eb8', '#FFFF00'])



        //Bars
        svg.selectAll("myRect")
            .data(data2)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.tile.start) }) // have the x value start at the start of first tile
            .attr("y", function (d) { return y(d.id); })
            .attr("width", function (d) { return x(d.tile.end - d.tile.start); }) // width is end - start
            .attr("height", y.bandwidth())
            .attr("fill", function (d) { return color(d.tile.name) })
            .attr("stroke", "grey")
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                //tooltip.html("Read ID: " + d.id + "<br/>" + "Read Count: " + d.count)
                tooltip.html("Read ID: " + d.id + "<br/>" + "Read Count: " + d.count + " <br/>" + "Coverage: " + d.coverage + "%")
                    .style("top", (event.pageY + 30) + "px")
                    .style("left", (event.pageX + 50) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        // first attempts at splitting data for sankey plots
        /*
        groupByFirst = []

        let numCols = 1
        // get number of columns
        data.forEach((d) => {
            if (d.tiles.length > numCols) {
                numCols = d.tiles.length
            }
        })

        // make master array with array for each column
        let masterArray = []
        for (let i = 0; i < numCols; i++) {
            masterArray.push([])
        }

        // push everything to appropriate list in master array
        data.forEach((d) => {
            for (i = 0; i < d.tiles.length; i++) {
                masterArray[i].push(d.tiles[i].name)
            }
        })

        // clean master array into objects with counts
        masterArray.forEach((col, colInd) => {
            let setArr = [...new Set(col)]
            let newArr = []
            setArr.forEach((set) => {
                newArr.push({ 'node': set, 'count': 0 })
            })
            col.forEach((x) => {
                newArr.map((obj, objInd) => {
                    if (obj.node === x) {
                        newArr[objInd].count = obj.count + 1
                    }
                })
            })
            masterArray[colInd] = newArr
        })
        console.log(masterArray)

        // make a list of nodes
        let listOfNodes = []
        let countId = 0
        masterArray.forEach((col, colInd) => {
            col.forEach((x, i) => {
                listOfNodes.push({ 'id': countId, 'name': x.node })
                countId++
            })
        })

        console.log(listOfNodes)


        // extract data into those columns
        // condense to sets with values

        // group by first
        // if (groupByFirst.length > 0) {
        //     // check if it has value
        //     let alreadyHas = false
        //     groupByFirst.forEach((v) => {
        //         if (alreadyHas) {
        //             return;
        //         }

        //         if (v.node === d.tiles[0].name) {
        //             alreadyHas = true
        //             v.count = v.count + 1
        //             return
        //         }
        //     })

        //     if (!alreadyHas) {
        //         groupByFirst.push({ 'node': d.tiles[0].name, 'count': 1})
        //     }

        // } else {
        //     groupByFirst.push({ 'node': d.tiles[0].name, 'count': 1})
        // }


        console.log(groupByFirst)*/




    })
}

doStuff()
// turn json to sankey



// plan for node link
let pac76NodeJson = {
    "nodes": [
        { 'id': 0, "name": "SMRT-Bell" },
        { 'id': 1, "name": "Payload" }
    ],
    "links": []
}
