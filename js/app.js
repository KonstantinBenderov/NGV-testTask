"use strict"
// search for output fields
const output = document.querySelector('.output code'),
    fromEl = document.querySelector('#from'),
    toEl = document.querySelector('#to'),
    isSortingEl = document.querySelector('#isSorting'),
    directionEl = document.querySelector('#direction'),
    fromOrToEl = document.querySelector('#fromOrTo'),
    applyFilterButton = document.querySelector('#applyFilterButton')

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

const filterByPriceRange = (requestRange, isSorting, direction, fromOrTo) => {
    let result = []
    for (let course of courses) {

        let isPricelessCourse
        !course.prices[0] && !course.prices[1] ? isPricelessCourse = true : isPricelessCourse = false

        if (requestRange.includes(null) || requestRange.includes('')) {
            if (!!requestRange[1]) {
                if (!isPricelessCourse && (requestRange[1] >= course.prices[0] || requestRange[1] <= course.prices[1]))
                    result.push(course)
            } else if (!!requestRange[0]) {
                if (!isPricelessCourse && (requestRange[0] >= course.prices[0] && requestRange[0] <= course.prices[1])) {
                    result.push(course)
                }
            } else {
                result.push(course)
            }
        } else {
            requestRange[0] >= course.prices[0] && requestRange[0] <= course.prices[1] &&
            (requestRange[1] >= course.prices[0] || requestRange[1] <= course.prices[1]) ?
                result.push(course) : {}
        }
    }
    if (isSorting) {
        result = sortByAscDesc(result, fromOrTo, direction)
    }
    for (let res of result) {
        output.insertAdjacentHTML('beforeend',
            `${res.name}${' '.repeat(25-res.name.length)} ${res.prices[0]} ${res.prices[1]} <br>`)
    }
}

const sortByAscDesc = (courses, fromOrTo, direction) => {
    let idx
    switch (fromOrTo) {
        case 'TO':
            idx = 1
            break
        case 'FROM':
        default:
            idx = 0
            break
    }
    if (direction === 'DESC') {
        return courses.sort((a, b) => {
            return b.prices[idx] - a.prices[idx]
        })
    } else {
        return courses.sort((a, b) => {
            return a.prices[idx] - b.prices[idx]
        })
    }
}

const applyFilter = (requestRange, isSortingByPrice, direction, fromOrTo) => {
    let _fromPrice, _toPrice,
        itemFromClass, itemTillClass
    requestRange[0] === '' ? _fromPrice = 'null' : _fromPrice = +requestRange[0]
    requestRange[1] === '' ? _toPrice = 'null' : _toPrice = +requestRange[1]
    typeof _fromPrice === 'number' ? itemFromClass = 'number' : itemFromClass = 'literal'
    typeof _toPrice === 'number' ? itemTillClass = 'number' : itemTillClass = 'literal'
    output.innerHTML = `<code class="language-javascript hljs"><span 
        class="hljs-keyword">let</span> requestRange = [<span
        class="hljs-${itemFromClass}">${_fromPrice}</span>, <span
        class="hljs-${itemTillClass}">${_toPrice}</span>];</code>`
    filterByPriceRange(requestRange, isSortingByPrice, direction, fromOrTo)
}

applyFilterButton.onclick = () => applyFilter(
    [fromEl.value, toEl.value],
    isSortingEl.checked,
    directionEl.value,
    fromOrToEl.value
)

// clear output field
output.innerHTML = ''
// fill output field with results of testCases
for (let testCase in testCases) {
    let itemFromClass, itemTillClass
    typeof testCases[testCase][0] === 'number' ? itemFromClass = 'number' : itemFromClass = 'literal'
    typeof testCases[testCase][1] === 'number' ? itemTillClass = 'number' : itemTillClass = 'literal'

    output.insertAdjacentHTML('beforeend',
        `<code class="language-javascript hljs"><span 
        class="hljs-keyword">let</span> requiredRange${testCase} = [<span 
        class="hljs-${itemFromClass}">${testCases[testCase][0]}</span>, <span 
        class="hljs-${itemTillClass}">${testCases[testCase][1]}</span>];</code>`)
    filterByPriceRange(testCases[testCase], true, 'ASC', 'FROM')
}
