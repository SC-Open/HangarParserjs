// separate time series data into x-axis and y-axis arrays
let xAxis = timeSeries.map(entry => moment(entry[0], 'YYYY MMM').format('MMM YY')).join(', ');
let yAxis = timeSeries.map(entry => entry[1]).join(', ');
let yAxis2 = timeSeries.map(entry => entry[2]).join(', ');

// create mermaid data
    let mermaidData = `
    ---
    config:
        xyChart:
            chartOrientation: vertical    
            width: 800
            height: 600
        themeVariables:
    ---
    xychart-beta
        title "Monthly Costs"
        x-axis [${xAxis}]
        y-axis "Cost (in $)"
        bar [${yAxis}]
        line [${yAxis2}]`;
// generate html code for mermaid chart
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Star Citizen Histogram</title>
        <script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
        <script>mermaid.initialize({startOnLoad:true});</script>
    </head>
    <body>
        <pre class="mermaid">
    ${mermaidData}
        </pre>
    </body>
    </html>
    `;
// write the html to chart.html
    fs.writeFile('chart.html', html, (err) => {
        if (err) throw err;
        console.log('Mermaid chart written to chart.html');
    });