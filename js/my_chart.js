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