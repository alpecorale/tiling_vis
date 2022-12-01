console.log(d3.version)

let groupByFirst = []
let allCleanOptions = []

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// get all file options
async function getAllCleanOptions() {
    // call get fxn
    await fetch('/getCleanDataOptions', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => {
        return response.json()
    }).then(json => {
        json.forEach(opt => {
            allCleanOptions.push(opt)
        })
    })

    // fill in track options
    let htmlProjectOptions = `<option value=''>None</option>`
    allCleanOptions.forEach(name => {
        htmlProjectOptions += `<option value="` + name + `">` + name + `</option>`
    })
    document.getElementById("pickDataset").innerHTML = htmlProjectOptions


}
getAllCleanOptions()




// turn full csv to node link json
async function loadFile() {

    const rawFile = document.getElementById('inputFile').files // rawFile

    const fileFormat = document.getElementById('fileFormat').value // format

    let rawFileToPass = new FormData()

    Array.from(rawFile).forEach(x => {
        rawFileToPass.append('file', x)
    })
    rawFileToPass.append('format', fileFormat)

    // download References to cluster
    // going to need to wrap in something to see if Ref needs to be uploaded
    await fetch("/downloadRawData", {
        method: "POST",
        body: rawFileToPass,
    }).catch((error) => ("Something went wrong!", error));


}


let currentNumShowing = 50

async function loadVis() {


    // clear vis before loading new viz
    document.getElementById('my_dataviz').innerHTML = ''
    document.getElementById('visOptions').style.display = 'block'

    // d3.json('test_tiles.json').then((data) => { // bobs data
    // d3.json('ONT_BC_PH.json').then((data) => { // parhams data
    const pick = document.getElementById('pickDataset').value

    d3.json('clean_data/' + pick + '.json').then((data) => { // parhams data

        // temp stuff for "igv style" barchart
        // let maxReadNum = 2806 // for tiles.json
        // let maxReadNum = 3500 // for test_tiles.json // bob
        let maxReadNum = 0 // max read num is generated dynamically now

        let data2 = []

        // data = data.slice(0, 101)

        // fix tiles section to be array of objects
        data.map((d, i) => {

            // // bobs data
            // let stringArr = d.tiles.split(',')

            // let tileArr = []
            // stringArr.forEach((v) => {
            //     let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': 't', 'size': 0 }
            //     obj.name = v.split('[')[0]
            //     obj.start = v.split('[')[1].split(']')[0].split('-')[0]
            //     obj.end = v.split('[')[1].split(']')[0].split('-')[1]
            //     obj.strand = v.split('(')[1].split(')')[0]
            //     obj.size = obj.end - obj.start
            //     tileArr.push(obj)
            // })
            // d.tiles = tileArr
            // d.num_tiles = tileArr.length


            // // get read coverage
            // let tileCov = 0
            // tileArr.forEach((x) => {
            //     let dif = x.end - x.start
            //     tileCov += dif
            // })

            // tileCov = (tileCov / maxReadNum) * 100
            // tileCov = Math.round(tileCov * 100) / 100
            // d.coverage = tileCov
            // d.readID = i


            // parhams data
            d.count = d.Length
            d.dist = d.count / 100000 // distribution really doesnt matter
            let stringArr = d.String.split(':')
            let positionsArr = d.Positions.split(":")
            let tileArr = []
            let localMaxNum = 0
            stringArr.forEach((v, vi) => {
                let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': 't' }

                // clean names of + and other junk
                let cleanName = v.slice(1)
                cleanName = cleanName.split('+').join('_')

                obj.name = cleanName // maybe we should join name and strand tg and set up color map to do different shades for each
                obj.start = positionsArr[vi].split('-')[0]
                obj.end = positionsArr[vi].split('-')[1]
                obj.strand = v.slice(0, 1)
                obj.size = obj.end - obj.start
                tileArr.push(obj)

                //console.log('obj end', obj.end)
                if (parseInt(obj.end) > localMaxNum) { localMaxNum = parseInt(obj.end) }
            })
            d.tiles = tileArr
            d.num_tiles = tileArr.length

            // get read coverage
            let tileCov = 0
            tileArr.forEach((x) => {
                let dif = x.end - x.start
                tileCov += dif
            })

            tileCov = (tileCov / maxReadNum) * 100
            tileCov = Math.round(tileCov * 100) / 100
            d.coverage = tileCov
            d.readID = d.ReadID

            // get maxReadNum //um idk
            if (localMaxNum > maxReadNum) { 
                maxReadNum = localMaxNum
            }


        })

        // Handle color scheme changes
        let colorScheme = 'default'

        // d3.select('#greyColorScheme').on("click", async function () {

        //     if (colorScheme !== 'grey') {
        //         colorScheme = 'grey'
        //     } else {
        //         colorScheme = 'default'
        //     }
        //     d3.select("#my_dataviz").html("") // empty old and make new chart
        //     makePlot(data, data2)
        // })



        
        // show first (x)
        d3.select('#showFirstSelect').on("change", async function () {
            const selectedOption = this.value
            let tempData = data
            switch (selectedOption) {

                case '-1':
                    tempData = data
                    currentNumShowing = -1
                    break;
                case '20':
                    tempData = data.slice(0, 20)
                    currentNumShowing = 20
                    break;

                case '50':
                    tempData = data.slice(0, 50)
                    currentNumShowing = 50
                    break;
                case '100':
                    tempData = data.slice(0, 100)
                    currentNumShowing = 100
                    break;
            }
            data2 = makeData2(tempData)
            d3.select("#my_dataviz").html("") // empty old and make new chart
            makePlot(tempData, data2)
        })

        // show first (x)
        let hoverCheck = false
        d3.select('#hoverCheckbox').on("change", async function () {
            hoverCheck = !hoverCheck
            // if (hoverCheck) {
            //     // turn hover off
            // } else {
            //     // turn hover on

            // }
            data2 = makeData2(data.slice(0, currentNumShowing))
            d3.select("#my_dataviz").html("") // empty old and make new chart
            makePlot(data.slice(0, currentNumShowing), data2)
        })


        // // sort data when needed 
        // d3.select('#sortBySelect').on("change", async function () {
        //     const selectedOption = this.value
        //     switch (selectedOption) {
        //         case 'count':
        //             data.sort((a, b) => {
        //                 return d3.descending(a.count, b.count)
        //             })
        //             break;

        //         case 'coverage':
        //             data.sort((a, b) => {
        //                 return d3.descending(a.coverage, b.coverage)
        //             })
        //             console.log(data)
        //             break;
        //     }
        //     data2 = makeData2()
        //     d3.select("#my_dataviz").html("") // empty old and make new chart
        //     makePlot()
        // })

        // fix tiles to each be an independent line
        function makeData2(inputData) {
            let result = []

            inputData.forEach((d, di) => {

                d.tiles.forEach((x, xi) => {
                    let obj = {
                        "id": di,
                        "read_ID": d.readID,
                        "num_tiles": d.num_tiles,
                        "count": d.count,
                        "dist": d.dist,
                        "tile": {
                            "tile_id": xi,
                            "name": x.name,
                            "start": x.start,
                            "end": x.end,
                            "strand": x.strand,
                            "size": x.size
                        },
                        "coverage": d.coverage
                    }
                    result.push(obj)

                })

            })

            // order result by descending tile size so smaller tiles load last
            result.sort((a, b) => {
                if (a.tile.size < b.tile.size) return 1;
                if (a.tile.size > b.tile.size) return -1;
                return 0;
            })

            return result
        }

        data2 = makeData2(data.slice(0, currentNumShowing))


        // Color Legend
        let keys = []

        // can move this inside the something else prbly but its fine here
        data2.forEach(d => {
            let tileName = d.tile.name
            keys.push(tileName)
        })

        keys = [...new Set(keys)]
        console.log(keys)
        // ['Backbone', 'hPAH', 'RNA', 'LNA', 'BC_SV40', 'ITR', 'SA_2A', '5_MCS', '3_MCS']



        function makePlot(inputData, inputData2) {

            console.log('Data 2 inside makePlot: ', inputData2)

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

            // d3.select('svg').call(zoom); // to turn zoom back on


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
                .domain([0, maxReadNum + 100]) // round maxReadNum up some how in future
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
                .domain(inputData.map(function (d, i) { return i + 1; }))
                .padding(.1);
            svg.append("g")
                .call(d3.axisLeft(y))

            // color palette = one color per type
            var color = d3.scaleOrdinal()
                .domain(keys)
                // ['Backbone', 'hPAH', 'RNA', 'LNA', 'BC_SV40', 'ITR', 'SA_2A', '5_MCS', '3_MCS']

                .range(['grey', "#1f77b4", "#ff7f0e", "#d62728", "#2ca02c", 'black', "#9467bd", "#8c564b", "#e377c2", "#bcbd22", "#17becf"]) // category 10 but grey is moved and black is added so support for up to 11
            // .range(['#e41a1c','url(#hash4_4)', '#4daf4a', '#A020F0', '#FFFF00'])


            // Add one dot in the legend for each name.
            svg.selectAll("mydots")
                .data(keys)
                .enter()
                .append("circle")
                .attr("class", (d) => {
                    return "class" + d
                })
                .attr("cx", 800)
                .attr("cy", function (d, i) { return 150 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function (d) { return color(d) })
                .style("cursor", 'pointer')
                .on("click", (event, d) => {

                    // //  is the element currently visible ?
                    // let currentOpacity = d3.selectAll((".class" + d)).style("opacity")
                    // // Change the opacity: from 0 to 1 or from 1 to 0
                    // d3.selectAll(".class" + d).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

                    let currentColor = d3.selectAll((".class" + d)).style("fill")
                    d3.selectAll(".class" + d).transition().style("fill", currentColor !== 'rgb(211, 211, 211)' ? 'lightgrey' : color(d))
                })
                .on("dblclick", (event, d) => {
                    //  is the element currently visible ?
                    let currentOpacity = d3.selectAll((".class" + d + "Strand")).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll(".class" + d + "Strand").transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                })

            // Add text for legend.
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 820)
                .attr("y", function (d, i) { return 150 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("class", (d) => {
                    return "class" + d
                })
                .style("fill", function (d) { return color(d) })
                .text(function (d) { return d })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("cursor", 'pointer')
                .on("click", (event, d) => {

                    // //  is the element currently visible ?
                    // let currentOpacity = d3.selectAll((".class" + d)).style("opacity")
                    // // Change the opacity: from 0 to 1 or from 1 to 0
                    // d3.selectAll(".class" + d).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

                    let currentColor = d3.selectAll((".class" + d)).style("fill")
                    d3.selectAll(".class" + d).transition().style("fill", currentColor !== 'rgb(211, 211, 211)' ? 'lightgrey' : color(d))
                })
                .on("dblclick", (event, d) => {
                    //  is the element currently visible ?
                    let currentOpacity = d3.selectAll((".class" + d + "Strand")).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll(".class" + d + "Strand").transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                })



            //Bars
            svg.selectAll("myRect")
                .data(inputData2)
                .enter()
                .append("rect")
                .attr("class", (d) => {
                    return "class" + d.tile.name
                })
                .attr("x", function (d) { return x(d.tile.start) }) // have the x value start at the start of first tile
                .attr("y", function (d, i) { return y(d.id + 1); })
                .attr("width", function (d) { return x(d.tile.end - d.tile.start); }) // width is end - start
                .attr("height", y.bandwidth())
                // .attr("fill", "url(#diagonal-stripe-2)") // might need to make this a function and add colors to different <svg> ids and set that as the range
                .attr("fill", function (d) {
                    return color(d.tile.name)

                })
                .attr("stroke", "grey")
                .on("mouseover", function (event, d) {
                    if (hoverCheck) {return}
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html("Read ID: " + d.read_ID + "<br/>" + "Type: " + d.tile.name + "<br/>" + "Strandedness: " + d.tile.strand + "<br/>" + "Read Count: " + d.count + " <br/>" + "Coverage: " + d.coverage + "%" + "<br/ >" + "[Start-End]: [" + d.tile.start + '-' + d.tile.end + ']')
                        .style("top", (event.pageY + 30) + "px")
                        .style("left", (event.pageX + 50) + "px");
                })
                .on("mouseout", function (d) {
                    if (hoverCheck) {return}
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });



            // add plus or minus to barcodes
            svg.selectAll("myStrandedness")
                .data(inputData2)
                .enter()
                .append("text")
                .filter(d => {
                    return d.tile.name
                }) // filter for barcodes
                .attr("class", (d) => {

                    return "class" + d.tile.name + "Strand"
                })
                .attr('x', (d) => {
                    return x(d.tile.start)
                    // return (x(d.tile.start) + x(d.tile.end)) / 2
                })
                .attr('y', (d) => {
                    return y(d.id) + (.5 * y.bandwidth())
                })
                .text(function (d) { return d.tile.strand })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", "9px")
                .style("opacity", 0)


        }
        makePlot(data.slice(0, currentNumShowing), data2)



    })
}


