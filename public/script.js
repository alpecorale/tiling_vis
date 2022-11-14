console.log(d3.version)


let pac76SankeyJson = {
    "nodes": [],
    "links": []
}

let groupByFirst = []


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// turn full csv to node link json
 
d3.json('test_tiles.json').then((data) => {


    // temp stuff for "igv style" barchart
    // let maxReadNum = 2806 // for tiles.json
    let maxReadNum = 3500 // for test_tiles.json

    let data2 = []

    // fix tiles section to be array of objects
    data.map((d, i) => {

        // bobs data
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

        // get read coverage
        let tileCov = 0
        tileArr.forEach((x) => {
            let dif = x.end - x.start
            tileCov += dif
        })

        tileCov = (tileCov / maxReadNum) * 100
        tileCov = Math.round(tileCov * 100) / 100
        d.coverage = tileCov
        d.readNum = i


        // // parhams data
        // // Havent tested it but like lowkey this should work for generating the tiles
        // d.count = d.Length
        // d.dist = d.count / 100000 // distribution really doesnt matter
        // let stringArr = d.String.split(':')
        // let positionsArr = d.Positions.split(":")
        // let tileArr = []
        // stringArr.forEach((v, vi) => {
        //     let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': 't' }
        //     obj.name = v.slice(1)
        //     obj.start = positionsArr[vi].split('-')[0]
        //     obj.end = positionsArr[vi].split('-')[1]
        //     obj.strand = v.slice(0, 1)
        //     tileArr.push(obj)
        // })
        // d.tiles = tileArr

        // // get read coverage
        // let tileCov = 0
        // tileArr.forEach((x) => {
        //     let dif = x.end - x.start
        //     tileCov += dif
        // })

        // tileCov = (tileCov / maxReadNum) * 100
        // tileCov = Math.round(tileCov * 100) / 100
        // d.coverage = tileCov
        // d.readNum = i


    })

    // show first (x)
    d3.select('#showFirstSelect').on("change", async function () {
        const selectedOption = this.value
        console.log(selectedOption)
        switch (selectedOption) {

            case '-1':
                data = data
                break;

            case '20':
                data = data.slice(0, 20)
                break;

            case '50':
                data = data.slice(0, 5)
                break;
        }
        data2 = makeData2()
        d3.select("#my_dataviz").html("") // empty old and make new chart
        makePlot()
    })


    // sort data when needed 
    d3.select('#sortBySelect').on("change", async function () {
        const selectedOption = this.value
        switch (selectedOption) {
            case 'count':
                data.sort((a, b) => {
                    return d3.descending(a.count, b.count)
                })
                break;

            case 'coverage':
                data.sort((a, b) => {
                    return d3.descending(a.coverage, b.coverage)
                })
                console.log(data)
                break;
        }
        data2 = makeData2()
        d3.select("#my_dataviz").html("") // empty old and make new chart
        makePlot()
    })

    // fix tiles to each be an independent line
    function makeData2() {
        let result = []

        data.forEach((d, di) => {

            d.tiles.forEach((x, xi) => {
                let obj = {
                    "id": di,
                    "read_ID": d.readNum,
                    "count": d.count,
                    "dist": d.dist,
                    "tile": {
                        "tile_id": xi,
                        "name": x.name,
                        "start": x.start,
                        "end": x.end,
                        "strand": x.strand
                    },
                    "coverage": d.coverage
                }
                result.push(obj)

            })

        })

        return result
    }

    data2 = makeData2()



    function makePlot() {

        console.log('Data 2 inside makePlot: ', data2)

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
                "translate(" + margin.left + "," + margin.top + ")")
            
        // handle zoom
        function handleZoom(e) {
            d3.select('svg')
              .attr('transform', e.transform);
          }
        let zoom = d3.zoom()
            .on('zoom', handleZoom);    

        // d3.select('svg').call(zoom);

        // ----------------
        // Create a tooltip
        // ----------------
        var tooltip = d3.select("#my_dataviz").append("div")
            .style("opacity", 0)
            //.attr("class", "tooltip")
            //.style("width", "160px")
            //.style("height", "120px")
            .style("position", "absolute")
            .style("background-color", "lightsteelblue")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")
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
            //.domain(["SMRT-Bell", "Payload"])
            .domain(["ITR", "payload", "RepCap", "backbone", "Helper"])
            .range(['#e41a1c','#377eb8', '#4daf4a', '#A020F0', '#FFFF00'])
            // .range(['#e41a1c','url(#hash4_4)', '#4daf4a', '#A020F0', '#FFFF00'])



        //Bars
        svg.selectAll("myRect")
            .data(data2)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.tile.start) }) // have the x value start at the start of first tile
            .attr("y", function (d, i) { return y(d.id); })
            .attr("width", function (d) { return x(d.tile.end - d.tile.start); }) // width is end - start
            .attr("height", y.bandwidth())
            // .attr("fill", "url(#diagonal-stripe-2)") // might need to make this a function and add colors to different <svg> ids and set that as the range
            .attr("fill", function (d) { return color(d.tile.name) })
            .attr("stroke", "grey")
            .on("mouseover", function (event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html("Read ID: " + d.read_ID + "<br/>" + "Type: " + d.tile.name + "<br/>" + "Strandedness: " + d.tile.strand + "<br/>" + "Read Count: " + d.count + " <br/>" + "Coverage: " + d.coverage + "%" + "<br/ >" + "[Start-End]: [" + d.tile.start + '-' + d.tile.end + ']' )
                    .style("top", (event.pageY + 30) + "px")
                    .style("left", (event.pageX + 50) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


    }
    makePlot()

})


