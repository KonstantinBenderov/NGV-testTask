"use strict"
// search for output fields
const outputs = document.querySelectorAll('.output code'),
    output1 = outputs[0],
    output2 = outputs[1]

// Input data
let courses = [
    {name: "Courses in England", prices: [0, 100]},
    {name: "Courses in Germany", prices: [500, null]},
    {name: "Courses in Italy", prices: [100, 200]},
    {name: "Courses in Russia", prices: [null, 400]},
    {name: "Courses in China", prices: [50, 250]},
    {name: "Courses in USA", prices: [200, null]},
    {name: "Courses in Kazakhstan", prices: [56, 324]},
    {name: "Courses in France", prices: [null, null]},
];

// test cases
let testCases = {
    1: [null, 200],
    2: [100, 350],
    3: [200, null],
}


const filterByPriceRange = (requestRange, isSorting = false, fromOrTo = 'from', direction = 'asc') => {
    let result = []
    for (let course of courses) {
        let resultString = `${course.name} ${course.prices} <br>`
        let courseEmptyPrice = course.prices[0] === null && course.prices[1] === null

        if (requestRange.includes(null)) {
            if (requestRange[0] === null) {
                if (!courseEmptyPrice && (requestRange[1] >= course.prices[0] && requestRange[1] <= course.prices[1]))
                    result.push(course)
            } else {
                if (!courseEmptyPrice && (requestRange[0] >= course.prices[0] && requestRange[0] <= course.prices[1])) {
                    result.push(course)
                }
            }
        } else {
            requestRange[0] >= course.prices[0] && requestRange[0] <= course.prices[1] &&
            requestRange[1] >= course.prices[0] || requestRange[1] <= course.prices[1] ?
                result.push(course) : {}
        }
    }
    if (isSorting) {
        result = filterAscDesc(result, fromOrTo, direction)
    }
    for (let res of result) {
        console.log(res)
        output1.insertAdjacentHTML('beforeend', `${res.name} ${res.prices} <br>`)
    }
}

const filterAscDesc = (courses, fromOrTo, direction) => {
    let idx
    switch (fromOrTo) {
        case 'to':
            idx = 1
            break
        case 'from':
        default:
            idx = 0
            break
    }
    if (direction === 'desc') {
        courses.sort((a, b) => {
            return b.prices[idx] - a.prices[idx]
        })
    } else {
        courses.sort((a, b) => {
            return a.prices[idx] - b.prices[idx]
        })
    }
}

// clear output field #1
output1.innerHTML = ''
for (let testCase in testCases) {
    let itemFromClass, itemTillClass
    typeof testCases[testCase][0] === 'number' ? itemFromClass = 'number' : itemFromClass = 'literal'
    typeof testCases[testCase][1] === 'number' ? itemTillClass = 'number' : itemTillClass = 'literal'

    output1.insertAdjacentHTML('beforeend',
        `<pre><code class="language-javascript hljs"><span 
        class="hljs-keyword">let</span> requiredRange${testCase} = [<span 
        class="hljs-${itemFromClass}">${testCases[testCase][0]}</span>, <span 
        class="hljs-${itemTillClass}">${testCases[testCase][1]}</span>];</code></pre>`)
    filterByPriceRange(testCases[testCase])
}

