function Metadatabuild(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

// Demo info
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });

    });
}
function Chartbuild(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

// Bar chart
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        var barLayout = {
            title: "Top 10 OTUs found in that individual",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Values"}
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Bubble chart

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Portland"
                }
            }
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 0},
            xaxis: {title: "OTU ID"}
        }

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

function init() {
    // Dropdown select element
    var selector = d3.select("#selDataset");

    // Populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        var firstSample = sampleNames[0];
        Chartbuild(firstSample);
        Metadatabuild(firstSample);
    });
}

function optionChanged(new_sample) {
    // Fetch new data
    Chartbuild(new_sample);
    Metadatabuild(new_sample);
}

// Start the dashboard
init();