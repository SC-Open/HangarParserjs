const fs = require('fs');
const moment = require('moment');

// read log.txt file and split new lines and store in rows
fs.readFile('log.txt', { encoding: 'utf-8' }, (err, data) => {
    if (err) throw err;
    let rows = data.split('\n');
console.log(`Number of rows read: ${rows.length}`);


// filter rows that contain 'order #' and 'value:'
    let matchingRows = rows.filter(row => row.includes('order #') && row.includes('value:'));
console.log(`Number of rows captured: ${matchingRows.length}`); // print the length of the matching rows
// extract date and cost from each row
    let dateCostPairs = [];
    rows.forEach((row) => {
        let dateMatch = row.match(/\b[A-Z][a-z]{2} \d{2} \d{4}\b/);
        // Include an optional minus sign before the dollar sign
        let costMatch = row.match(/-?\$\d+(\.\d+)?/);
        if (dateMatch && costMatch) {
            let date = moment(dateMatch[0], 'MMM DD YYYY');
            // Remove the dollar sign and optional minus sign before parsing the cost
            let cost = parseFloat(costMatch[0].replace(/[-$]/g, ''));
            // If the original string started with a minus sign, make the cost negative
            if (costMatch[0].startsWith('-')) {
                cost = -cost;
            }
            cost = Math.round(cost * 100) / 100;
            dateCostPairs.push([date, cost]);
        }
    });
console.log(`Number of date-cost pairs: ${dateCostPairs.length}`); // print the length of the date-cost pairs

// sort date-cost pairs by date
    dateCostPairs.sort((a, b) => a[0].isBefore(b[0]) ? -1 : 1);

    // separate sorted date-cost pairs into dates and costs arrays
    let sortedDates = dateCostPairs.map(pair => pair[0]);
    let sortedCosts = dateCostPairs.map(pair => pair[1]);

    // iterate through sortedDates and costs to create time series data
    let timeSeries = [];
    let previousMonthYear = null;
    let previousTotal = 0;

    for (let i = 0; i < sortedDates.length; i++) {
        let monthYear = sortedDates[i].format('YYYY MMM');
        let cost = sortedCosts[i];
        previousTotal += cost; //always add cost to the previousTotal
        if (previousMonthYear === monthYear) { // if the month and year are the same as the previous entry update the cost
            let lastEntry = timeSeries[timeSeries.length - 1];
            lastEntry[1] += cost; // update the cost for the current month
            lastEntry[2] = previousTotal; // update the cumulative total cost
        } else {
            let entry = [monthYear, cost, previousTotal]; // create a new entry
            timeSeries.push(entry);
            previousMonthYear = monthYear;
        }
    }
console.log(`Number of time series entries: ${timeSeries.length}`); // print the length of the time series data


// Generate an HTML chart from the time series data
let chartData = `labels: [${timeSeries.map(entry => `"${entry[0]}"`).join(', ')}],\n`;
chartData += `datasets: [{\n`;  // create a dataset for the current total
chartData += `label: 'Monthly',\n`;    // label the dataset
chartData += `data: [${timeSeries.map(entry => entry[1]).join(', ')}],\n`; // create the data for the dataset  
chartData += `borderColor: 'rgba(75, 192, 192, 1)',\n`; // set the border color
chartData += `fill: false\n`; // fill the data
chartData += `}, {\n`; // start a new dataset for the previous total
chartData += `label: 'Total',\n`; // label the new dataset
chartData += `data: [${timeSeries.map(entry => entry[2]).join(', ')}],\n`; // create the data for the new dataset
chartData += `borderColor: 'rgba(255, 99, 132, 1)',\n`; // set the border color for the new dataset
chartData += `fill: false\n`; // fill the data for the new dataset
chartData += `}]\n`; // end the datasets array
let chartHtml = fs.readFileSync('chartTemplate.html', { encoding: 'utf-8' });
chartHtml = chartHtml.replace('CHART_DATA', chartData);
fs.writeFileSync('chart.html', chartHtml);
console.log('chart.html written');
});

// write time series data to a chart with Chart.js
let ctx = document.getElementById('myChart').getContext('2d');

let labels = sortedTimeSeries.map(entry => moment(entry[0], 'YYYY MMM').format('MMM YY'));
let data1 = sortedTimeSeries.map(entry => entry[1]);
let data2 = sortedTimeSeries.map(entry => entry[2]);

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Cost',
            data: data1,
            borderColor: 'rgb(75, 192, 192)',
            fill: false
        }, {
            label: 'Cumulative Total',
            data: data2,
            borderColor: 'rgb(255, 99, 132)',
            fill: false
        }]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Time Series Chart'
        },
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'month',
                    displayFormats: {
                        month: 'MMM YY'
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});