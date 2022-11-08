// turn json to sankey



// plan for node link
let pac76NodeJson = {
    "nodes": [
        { 'id': 0, "name": "SMRT-Bell" },
        { 'id': 1, "name": "Payload" }
    ],
    "links": []
}


// first attempts at splitting data for sankey plots

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


console.log(groupByFirst)