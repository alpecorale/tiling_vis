
console.log(d3.version)

jscolor.presets.default = {
    position: 'right',
    palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
        '#fef100', '#22b14b', '#00a1e7', '#3f47cc', '#a349a4',
        '#ffffff', '#c3c3c3', '#b87957', '#feaec9', '#ffc80d',
        '#eee3af', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    ]
};


let groupByFirst = []
let allCleanOptions = []

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateColor(ele, key) {
    let newColor = ele.toRGBString()

    // turn all elements of key class into newColor
    const els = document.getElementsByClassName(key)

    Array.from(els).forEach((el) => {
        el.style.fill = newColor
    })
}

// opens and closes color switch div
document.getElementById('changeColorSwitch').addEventListener('change', () => {
    if (document.getElementById('colorChangerRow').style.display === 'flex'){
        document.getElementById('colorChangerRow').style.display = 'none'
    } else {
        document.getElementById('colorChangerRow').style.display = 'flex'
    }
})

// opens and closes clustering density
document.getElementById('clusteringSwitch').addEventListener('change', () => {
    if (document.getElementById('clusteringDiv').style.display === 'flex'){
        document.getElementById('clusteringDiv').style.display = 'none'
    } else {
        document.getElementById('clusteringDiv').style.display = 'flex'
    }
})

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
    const clustering = document.getElementById('clusteringSwitch').checked
    const density = document.getElementById('clusteringDensity').value // clustering density 

    let rawFileToPass = new FormData()

    Array.from(rawFile).forEach(x => {
        rawFileToPass.append('file', x)
    })
    rawFileToPass.append('format', fileFormat)
    rawFileToPass.append('clustering', clustering)
    rawFileToPass.append('density', density)

    // download References to cluster
    // going to need to wrap in something to see if Ref needs to be uploaded
    await fetch("/downloadRawData", {
        method: "POST",
        body: rawFileToPass,
    }).catch((error) => ("Something went wrong!", error));

    getAllCleanOptions()
}


let currentNumShowing = 50

async function loadVis() {


    // clear vis before loading new viz
    document.getElementById('my_dataviz').innerHTML = ''
    document.getElementById('my_dataviz_legend').innerHTML = ''
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
        const whichFormat = document.getElementById('fileFormatLoad').value

        // fix tiles section to be array of objects
        data.map((d, i) => {


            if (whichFormat === 'bob') {

                // bobs data
                let stringArr = d.tiles.split(',')

                let tileArr = []
                let localMaxNum = 0
                let count_each_obj = {}

                stringArr.forEach((v) => {
                    let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': 't', 'size': 0 }
                    obj.name = v.split('[')[0]
                    obj.start = v.split('[')[1].split(']')[0].split('-')[0]
                    obj.end = v.split('[')[1].split(']')[0].split('-')[1]
                    obj.strand = v.split('(')[1].split(')')[0]
                    obj.size = obj.end - obj.start
                    tileArr.push(obj)

                    if (parseInt(obj.end) > localMaxNum) { localMaxNum = parseInt(obj.end) }

                    // handle count each object
                    if (obj.name in count_each_obj) {
                        count_each_obj[obj.name] = count_each_obj[obj.name] + 1
                    } else {
                        count_each_obj[obj.name] = 1
                    }

                })
                // d.count = d.count // should already be set
                // d.dist = d.dist // should already be set

                d.tiles = tileArr
                d.num_tiles = tileArr.length
                d.local_max = localMaxNum
                d.count_each = count_each_obj
                d.total_length = localMaxNum


                // get read coverage
                let tileCov = 0
                tileArr.forEach((x) => {
                    let dif = x.end - x.start
                    tileCov += dif
                })

                // get maxReadNum 
                if (localMaxNum > maxReadNum) {
                    maxReadNum = localMaxNum
                }
                // maxReadNum = 4000

                tileCov = (tileCov / maxReadNum) * 100
                tileCov = Math.round(tileCov * 100) / 100
                d.coverage = tileCov
                d.readID = i
            }

            
            // if (whichFormat === 'parham') { // parhams data
            //     d.count = d.Length // length not count
            //     d.total_length = d.Length
            //     d.dist = d.Length / 100000 // distribution really doesnt matter
            //     let stringArr = d.String.split(':')
            //     let positionsArr = d.Positions.split(":")
            //     let tileArr = []
            //     let localMaxNum = 0
            //     let count_each_obj = {}
            //     stringArr.forEach((v, vi) => {
            //         let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': '+', 'size': 0 }

            //         // clean names of + and other junk
            //         let cleanName = v.slice(1)
            //         cleanName = cleanName.split('+').join('_')

            //         obj.name = cleanName // maybe we should join name and strand tg and set up color map to do different shades for each
            //         obj.start = positionsArr[vi].split('-')[0]
            //         obj.end = positionsArr[vi].split('-')[1]
            //         obj.strand = v.slice(0, 1)
            //         obj.size = obj.end - obj.start
            //         tileArr.push(obj)

            //         if (parseInt(obj.end) > localMaxNum) { localMaxNum = parseInt(obj.end) }

            //         // handle count each object
            //         if (cleanName in count_each_obj) {
            //             count_each_obj[cleanName] = count_each_obj[cleanName] + 1
            //         } else {
            //             count_each_obj[cleanName] = 1
            //         }
            //     })

            //     d.tiles = tileArr
            //     d.num_tiles = tileArr.length
            //     d.local_max = localMaxNum
            //     d.count_each = count_each_obj

            //     // get read coverage
            //     let tileCov = 0
            //     tileArr.forEach((x) => {
            //         let dif = x.end - x.start
            //         tileCov += dif
            //     })

            //     // get maxReadNum 
            //     if (localMaxNum > maxReadNum) {
            //         maxReadNum = localMaxNum
            //     }

            //     tileCov = (tileCov / maxReadNum) * 100 // lol compute after maxReadNum or get Infinity
            //     tileCov = Math.round(tileCov * 100) / 100
            //     d.coverage = tileCov
            //     d.readID = d.ReadID
            // }


            if (whichFormat === 'gustavo' || whichFormat === 'parham') {
                // gustavo data
                d.count = parseInt(d.Length) // length not count
                d.total_length = parseInt(d.Length)
                d.dist = parseInt(d.Length) / 100000 // distribution really doesnt matter
                let stringArr = d.String.split(':')
                let positionsArr = d.Positions.split(":")
                let tileArr = []
                let localMaxNum = 0
                let count_each_obj = {}
                stringArr.forEach((v, vi) => {
                    let obj = { 'name': '', 'start': 0, 'end': 0, 'strand': '+', 'size': 0 }

                    // clean names of + and other junk
                    let cleanName = v
                    if (v.slice(0, 1) === "+" || v.slice(0, 1) === '-') {
                        cleanName = cleanName.slice(1)
                    }
                    cleanName = cleanName.split('+').join('_')
                    cleanName = cleanName.split('.').join('')
                    cleanName = cleanName.split('/').join('bug')
                    cleanName = cleanName.split('|').join('BUG')

                    obj.name = cleanName // maybe we should join name and strand tg and set up color map to do different shades for each
                    obj.start = positionsArr[vi].split('-')[0]
                    obj.end = positionsArr[vi].split('-')[1]
                    obj.strand = v.slice(0, 1)
                    obj.size = obj.end - obj.start
                    tileArr.push(obj)

                    //console.log('obj end', obj.end)
                    if (parseInt(obj.end) > localMaxNum) { localMaxNum = parseInt(obj.end) }

                    // handle count each object
                    if (cleanName in count_each_obj) {
                        count_each_obj[cleanName] = count_each_obj[cleanName] + 1
                    } else {
                        count_each_obj[cleanName] = 1
                    }


                })
                d.tiles = tileArr
                d.num_tiles = tileArr.length
                d.local_max = localMaxNum
                d.count_each = count_each_obj

                // get read coverage
                let tileCov = 0
                tileArr.forEach((x) => {
                    let dif = x.end - x.start
                    tileCov += dif
                })

                // get maxReadNum 
                if (localMaxNum > maxReadNum) {
                    maxReadNum = localMaxNum
                }

                tileCov = (tileCov / maxReadNum) * 100 // lol compute after maxReadNum or get Infinity
                tileCov = Math.round(tileCov * 100) / 100
                d.coverage = tileCov
                d.readID = d.ReadID
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
            d3.select("#my_dataviz_legend").html("")
            makePlot(tempData, data2)
        })

        // hover toggle
        let hoverCheck = false
        d3.select('#hoverCheckbox').on("change", async function () {
            hoverCheck = !hoverCheck
            data2 = makeData2(data.slice(0, currentNumShowing))
            d3.select("#my_dataviz").html("") // empty old and make new chart
            d3.select('#my_dataviz_legend').html("")
            makePlot(data.slice(0, currentNumShowing), data2)
        })

        let brushCheck = true
        d3.select('#brushCheckbox').on("change", async function () {
            brushCheck = !brushCheck
            data2 = makeData2(data.slice(0, currentNumShowing))
            d3.select("#my_dataviz").html("") // empty old and make new chart
            d3.select('#my_dataviz_legend').html("")
            makePlot(data.slice(0, currentNumShowing), data2)
        })

        // show count for Each Type
        let countCheckWhich = ''
        d3.select('#countWhich').on("change", async function () {
            countCheckWhich = document.getElementById('countWhich').value
            data2 = makeData2(data.slice(0, currentNumShowing))
            d3.select("#my_dataviz").html("")
            d3.select('#my_dataviz_legend').html("")
            makePlot(data.slice(0, currentNumShowing), data2)
        })



        // sort data when needed 
        d3.select('#sortBySelect').on("change", async function () {
            const selectedOption = this.value
            switch (selectedOption) {
                // case 'readId':
                //     data.sort((a, b) => {
                //         return d3.descending(a.readID, b.readID)
                //     })
                //     break;
                case 'count':
                    data.sort((a, b) => {
                        return d3.descending(a.count, b.count)
                    })
                    break;

                case 'length':
                    data.sort((a, b) => {
                        return d3.descending(a.total_length, b.total_length)
                    })
                    break;

                case 'coverage':
                    data.sort((a, b) => {
                        return d3.descending(a.coverage, b.coverage)
                    })
                    break;

                case 'lengthLow':
                    data.sort((a, b) => {
                        return d3.ascending(a.total_length, b.total_length)
                    })
                    break;

                case 'coverageLow':
                    data.sort((a, b) => {
                        return d3.ascending(a.coverage, b.coverage)
                    })
                    break;

                default:
                    // pre sort with length to look pretty
                    data.sort((a, b) => {
                        return d3.descending(a.total_length, b.total_length)
                    })

                    // sort by selected object count
                    data.sort((a, b) => {
                        // check that field exists (handles output if one or both dont)
                        if (!a.count_each[selectedOption] && !b.count_each[selectedOption]) {
                            return 0
                        }
                        if (!a.count_each[selectedOption] && b.count_each[selectedOption]) {
                            return 1
                        }
                        if (a.count_each[selectedOption] && !b.count_each[selectedOption]) {
                            return -1
                        }
                        return d3.descending(a.count_each[selectedOption], b.count_each[selectedOption])
                    })

                    break;

            }
            data2 = makeData2(data.slice(0, currentNumShowing))
            d3.select("#my_dataviz").html("")
            d3.select('#my_dataviz_legend').html("")
            makePlot(data.slice(0, currentNumShowing), data2)
        })

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
                        "coverage": d.coverage,
                        "local_max": d.local_max,
                        "count_each": d.count_each
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


        // populate countWhich select box
        document.getElementById('countWhich').innerHTML = ""
        let noneOpt = document.createElement("option")
        noneOpt.value = ""
        noneOpt.innerHTML = "None"
        document.getElementById('countWhich').appendChild(noneOpt)
        keys.forEach(key => {


            let opt = document.createElement("option");
            opt.value = key;
            opt.innerHTML = key.split('bug').join('/').split('BUG').join('|'); // ik its dumb

            // then append it to the select element
            document.getElementById('countWhich').appendChild(opt);


        })
        // populate sort by
        document.getElementById('sortBySelect').innerHTML = ""
        let noneOpt2 = document.createElement("option")
        noneOpt2.value = ""
        noneOpt2.innerHTML = "None"
        document.getElementById('sortBySelect').appendChild(noneOpt2)
        const preExistingOptions = [
            { "value": "length", "text": "Length (H->L)" },
            { "value": "lengthLow", "text": "Length (L->H)" },
            { "value": "coverage", "text": "Coverage (H->L)" },
            { "value": "coverageLow", "text": "Coverage (L->H)" },
        ]
        preExistingOptions.forEach(key => {
            let opt2 = document.createElement("option");
            opt2.value = key.value;
            opt2.innerHTML = key.text;


            document.getElementById('sortBySelect').appendChild(opt2)
        })
        keys.forEach(key => {
            let opt2 = document.createElement("option");
            opt2.value = key;
            opt2.innerHTML = key.split('bug').join('/').split('BUG').join('|'); // ik its dumb


            document.getElementById('sortBySelect').appendChild(opt2)
        })



        function makePlot(inputData, inputData2) {

            console.log('Data 2 inside makePlot: ', inputData2)

            // set the dimensions and margins of the graph
            var margin = { top: 20, right: 30, bottom: 40, left: 90 },
                width = (window.innerWidth * .75) - margin.left - margin.right,
                height = (window.innerHeight * .75) - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3.select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")

            // append the svg object to the body of the page
            var svgLegend = d3.select("#my_dataviz_legend")
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

            // let brush = d3.brushX().extent( [ [0,100], [400,300] ] )

            // Add a clipPath: everything out of this area won't be drawn.
            var clip = svg.append("defs").append("svg:clipPath")
                .attr("id", "clip")
                .append("svg:rect")
                .attr("width", width)
                .attr("height", height)
                .attr("x", 0)
                .attr("y", 0);

            // Add brushing
            var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
                .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

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
                .domain([0, maxReadNum + (maxReadNum * .05)])
                .range([0, width]);
            let xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))

            xAxis.selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end")




            // Y axis
            var y = d3.scaleBand()
                .range([0, height])
                // .domain(inputData.map(function (d, i) { return d.readID; }))
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

            /*
            *
            *   LEGEND
            * 
            */

            // Add one dot in the legend for each name.
            svgLegend.selectAll("mydots")
                .data(keys)
                .enter()
                .append("circle")
                .attr("class", (d) => {
                    return "class" + d
                })
                .attr("cx", 5)
                .attr("cy", function (d, i) { return i * 25 })

                .attr("r", 7)
                .style("fill", function (d) { return color(d) })
                .style("cursor", 'pointer')
                .on("click", (event, d) => {
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
            svgLegend.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr("x", 25)
                .attr("y", function (d, i) { return i * 25 })
                .attr("class", (d) => {
                    return "class" + d
                })
                .style("fill", function (d) { return color(d) })
                .text(function (d) {
                    return d.split('bug').join('/').split('BUG').join('|') // this is dumb
                })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("cursor", 'pointer')
                .on("click", (event, d) => {

                    let currentColor = d3.selectAll((".class" + d)).style("fill")
                    d3.selectAll(".class" + d).transition().style("fill", currentColor !== 'rgb(211, 211, 211)' ? 'lightgrey' : color(d))
                })
                .on("dblclick", (event, d) => {
                    //  is the element currently visible ?
                    let currentOpacity = d3.selectAll((".class" + d + "Strand")).style("opacity")
                    // Change the opacity: from 0 to 1 or from 1 to 0
                    d3.selectAll(".class" + d + "Strand").transition().style("opacity", currentOpacity == 1 ? 0 : 1)
                })

                
            // add button in legend // cant but can add another shape and give it .on("click") event
            document.getElementById("colorChangerRow").innerHTML = ""
            jscolor.install()
            d3.select("#colorChangerRow").selectAll("colorChanger")
                .data(keys)
                .enter()
                .append('button')
                .text(d => {
                    return d.split('bug').join('/').split('BUG').join('|')
                })
                .attr('data-jscolor', (d) => {
                    let currentColor = d3.selectAll((".class" + d)).style("fill")
                    return `{value:'` + currentColor +  `',` + `onChange: 'updateColor(this, "class` + d + `")'` + `}`
                    // d3.selectAll(".class" + d).transition().style("fill", currentColor !== 'rgb(211, 211, 211)' ? 'lightgrey' : color(d))
                })
                

                jscolor.install(); // needed to intialize color buttons

                

            /*
            *
            * TILE
            * 
            */

            //Bars
            let bar = svg.append('g')
                .attr("clip-path", "url(#clip)")

            bar.selectAll("myRect")
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
                .attr("stroke", "black")
                .on("mouseover", function (event, d) {
                    if (hoverCheck) { return }
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(() => {
                        let toolTipMessage = ''

                        toolTipMessage += "Read ID: " + d.read_ID + "<br/>"
                        toolTipMessage += "Category: " + d.tile.name.split('bug').join('/').split('BUG').join('|') + "<br/>" // this is dumb
                        toolTipMessage += "Strandedness: " + d.tile.strand + "<br/>"
                        toolTipMessage += "Length: " + d.count + " <br/>"
                        toolTipMessage += "Coverage: " + d.coverage + "%" + "<br/ >"
                        toolTipMessage += "[Start-End]: [" + d.tile.start + '-' + d.tile.end + ']' + "<br/ >"
                        toolTipMessage += "Size: " + d.tile.size + "nt"

                        return toolTipMessage
                    })
                        .style("top", (event.pageY) + "px")
                        .style("left", (event.pageX + 80) + "px");
                })
                .on("mouseout", function (d) {
                    if (hoverCheck) { return }
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            if (brushCheck) {
                xAxis.append("g")
                    .attr("class", "brush")
                    .call(brush);
            }


            // A function that set idleTimeOut to null
            var idleTimeout
            function idled() { idleTimeout = null; }


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
                    return y(d.id + 1) + (.5 * y.bandwidth())
                })
                .text(function (d) { return d.tile.strand })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", () => {
                    switch (currentNumShowing) {
                        case 20:
                            return "15px"
                        case 50:
                            return "9px"
                        case 100:
                            return "5px"
                    }
                })
                .style("opacity", 0)

            // add count specific at end of rows
            svg.selectAll("myCount")
                .data(inputData2)
                .enter()
                .append("text")
                // .filter(d => {
                //     return d.tile.name
                // }) // filter for barcodes
                .attr("class", (d) => {
                    return "class" + d.tile.name + "Count"
                })
                .attr('x', (d) => {
                    return x(d.local_max + 30)
                })
                .attr('y', (d) => {
                    return y(d.id + 1) + (.5 * y.bandwidth())
                })
                .text(function (d) {
                    if (countCheckWhich in d.count_each) {
                        return "(" + d.count_each[countCheckWhich] + ")"
                    }

                })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", () => {
                    switch (currentNumShowing) {
                        case 20:
                            return "15px"
                        case 50:
                            return "9px"
                        case 100:
                            return "5px"
                    }
                })
                .style("opacity", 1)


            // A function that update the chart for given boundaries
            function updateChart(event) {

                extent = event.selection

                // If no selection, back to initial coordinate. Otherwise, update X axis domain
                if (!extent) {
                    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                    x.domain([0, maxReadNum + (maxReadNum * .05)])
                } else {
                    x.domain([x.invert(extent[0]), x.invert(extent[1])])
                    xAxis.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                }


                // Update axis and circle position
                xAxis.transition().duration(1000).call(d3.axisBottom(x))
                xAxis.selectAll("text")
                    .attr("transform", "translate(-10,0)rotate(-45)")
                    .style("text-anchor", "end")
                bar.selectAll("rect")
                    .transition().duration(1000)
                    .attr("x", function (d) {
                        if (!d.tile) { return }
                        if (x(parseInt(d.tile.start)) < 0) {
                            return 0
                        }
                        return x(parseInt(d.tile.start))
                    }) // have the x value start at the start of first tile
                    .attr("width", function (d) {
                        if (!d.tile) { return }
                        if (x(parseInt(d.tile.end)) < 0) { return 0 }
                        if (x(parseInt(d.tile.start)) <= 0) {
                            //if (x(parseInt(d.tile.end) <= 0)) {return 0}
                            return x(parseInt(d.tile.end))
                        }

                        return x(parseInt(d.tile.end)) - x(parseInt(d.tile.start));
                    })
                // .attr("y", function (d, i) { return y(d.id + 1); })
                // .attr("height", y.bandwidth())

            }


        }
        makePlot(data.slice(0, currentNumShowing), data2)



    })
}


