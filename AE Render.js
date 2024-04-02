var comp = app.project.activeItem;

var debug = false;

var startNFT = prompt("Start NFT number:", 1); // Where to start rendering
var endNFT = prompt("End NFT number:", 1); // Where to end rendering
var renderItem = prompt("Render specific item? Seperate by comma and a space. (If not leave empty)", "") // Render only NFTs with a specific item
var outputFolder = prompt("Specify the output folder: ('./relative_path_from_script/)", "./render_folder/") // Specify output folder
var overwriteFiles = confirm("Auto overwrite files? (Overwrites any files in the output folder without prompting the user)");

function debugMessage(message, check)
{
    if (check)
    {
        alert(message);
    }
}

var renderItemsCheck = false;

if (renderItem == "")
{
    var renderItemsArray = null;
}

else
{
    renderItemsCheck = true;

    var renderItemsArray = (renderItem.toLowerCase()).split(", ");

    debugMessage((renderItemsArray, debug));
}

// Debug function
if (renderItem.toLowerCase().indexOf("debug") >= 0)
{
    var debug = true;
    renderItem = "";
    var renderItemsArray = null;
    renderItemsCheck = false;
}

// Load the CSV file
alert("Open .csv file.");
var csvFile = File.openDialog(); // new File("./Mint SoT - Hons - 0-5016.csv");
csvFile.open("r");

// Clear the Render Queue
var renderQueue = app.project.renderQueue;

while (renderQueue.numItems > 0)
{
    renderQueue.item(1).remove();
}

// Function to deselect all layers
function deselectAllLayers()
{
    app.executeCommand(app.findMenuCommandId("Deselect All"));
}

// Function to select all precomps in the current comp
function selectAllPrecomps()
{
    // Deselect all layers first
    deselectAllLayers();

    // Iterate through all layers in the composition and select them if they are precomps
    for (var i = 1; i <= comp.numLayers; i++)
    {
        var layer = comp.layer(i);
        if (layer instanceof AVLayer && layer.source instanceof CompItem)
        {
            layer.selected = true;
        }
        else
        {
            layer.selected = false;
        }
    }
}

// Function to hide all layers within selected pre-comps in the current composition
function hideLayersInPrecomps()
{
    // Check if the active item is a composition
    if (comp && comp instanceof CompItem)
    {
        // Get selected layers in the main composition
        var selectedLayers = comp.selectedLayers;

        // Iterate through selected layers
        for (var i = 0; i < selectedLayers.length; i++)
        {
            // Get the layer
            var layer = selectedLayers[i];

            // Iterate through layers in the selected pre-comp and hide them
            var preComp = layer.source;
            for (var j = 1; j <= preComp.numLayers; j++)
            {
                var preCompLayer = preComp.layer(j);
                preCompLayer.enabled = false;
            }
        }
    }
}

// Function to show layers containing a specified string in the selected pre-comp
function showLayersContainingString(searchString)
{
    var selectedLayer = comp.selectedLayers[0];

    var preComp = selectedLayer.source;

    // Iterate through layers in the pre-comp and show layers containing the string
    for (var i = 1; i <= preComp.numLayers; i++)
    {
        var layer = preComp.layer(i);

        // Check if the layer name contains the specified string
        // indexOf returns -1 if the string is not a part of the layer name
        if (layer.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
        {
            layer.enabled = true;
        }
        else
        {
            layer.enabled = false;
        }
    }
}

// Iterate over all layers in the selected precomp
function precompLayers()
{
    // Iterate through layers in the selected pre-comp and hide them
    var preComp = comp.selectedLayers[0].source;
    for (var j = 1; j <= preComp.numLayers; j++)
    {
        var preCompLayer = preComp.layer(j);
        preCompLayer.enabled = false;
    }
}

// Read CSV data
var csvData = [];
while (!csvFile.eof)
{
    var line = csvFile.readln();
    var rowData = line.split(",");
    csvData.push(rowData);
}
csvFile.close();

// Select all precomps in the current comp
selectAllPrecomps()
debugMessage("All precomps selected!", debug);

// Call the function to hide layers within selected pre-comps
hideLayersInPrecomps();
debugMessage("All layers hidden!", debug);

// precompLayers();

function selectAllPrecompsContainingString(compName)
{
    // Deselect all layers first
    deselectAllLayers();

    // Select all precomps
    selectAllPrecomps()

    // Store the selected layers
    var selectedLayers = comp.selectedLayers;

    // Iterate through all layers in the composition and select them if they contain the string
    for (var i = 1; i <= selectedLayers.length; i++)
    {
        var layer = comp.layer(i);

        // indexOf returns -1 if the string is not a part of the layer name
        if (layer.name.toLowerCase().indexOf(compName.toLowerCase()) >= 0)
        {
            layer.selected = true;
        }

        else
        {
            layer.selected = false;
        }
    }
}

function renderComp(iter, outputFolder)
{
    // Check if there is an active composition
    if (app.project.activeItem instanceof CompItem)
    {
        // Reference to the active composition
        var comp = app.project.activeItem;
    
        // Reference to the render queue
        var renderQueue = app.project.renderQueue;
    
        // Create a new render queue item
        var renderQueueItem = renderQueue.items.add(comp);

        // Check if output folder exists
        var folder = new Folder(outputFolder);
        // If folder does not exist create one
        if (!folder.exists)
        {
            folder.create();
        }
        
        // Set render settings for the item if needed (e.g., output module, output file path)
        renderQueueItem.outputModule(1).file = new File(outputFolder + (iter - 1) + ".mp4");
    
        // Start the rendering process for all items in the render queue
        app.project.renderQueue.render();
    }

    // Alert when rendering is complete
    debugMessage(("Rendering completed successfully!"), debug);
}

// Function to show layers based on CSV data
function renderNTFs(csvData, startNFT, endNFT, renderItemsArray, outputFolder, overwriteFiles)
{
    startNFT = Number(startNFT) + 1; // Add 1 so it starts rendering the user specified NFT - csv data is offset by one row
    endNFT = Number(endNFT) + 1; // Add 1 so it starts rendering the user specified NFT - csv data is offset by one row

    debugMessage(("CSV data lenght: " + csvData.length), debug);

    // Iterate through each row in the CSV data
    for (var i = startNFT; (i < csvData.length) && (i <= endNFT); i++)
    {
        // Get the current row data
        var attributesRow = csvData[0]
        var rowData = csvData[i];

        var extendedRowData = "";
        
        // Convert row data to lower case
        for (var data = 0; data < attributesRow.length; data++)
        {
            extendedRowData = String(extendedRowData) + ", " + (attributesRow[data] + " " + rowData[data]);
        }

        var lowerCaseRowData = String(extendedRowData).toLowerCase();

        // Check if should render only specific item
        var goToNextRow = false;

        if (renderItemsCheck)
        {
            goToNextRow = true;

            for (item in renderItemsArray)
            {
                debugMessage((renderItemsArray[item] + "; " + lowerCaseRowData), debug);
                if ((lowerCaseRowData.indexOf(renderItemsArray[item]) > 0))
                {
                    goToNextRow = false;
                    break;
                }
            }
        }

        if (goToNextRow)
        {
            continue;
        }

        debugMessage("Iteration: " + i, debug);
        // Select all precomps in the current comp
        selectAllPrecomps()
        debugMessage("All precomps selected!", debug);

        // Call the function to hide layers within selected pre-comps
        hideLayersInPrecomps();
        debugMessage("All layers hidden!", debug);

        debugMessage(("Row data length: " + rowData.length), debug);

        // Iterate through each column in the CSV data
        for (var j = 1; j < attributesRow.length; j++)
        {
            var attribute = attributesRow[j]; // Name column

            var attributeData = rowData[j]; // Attribute column
            
            // ---- Need to implement so it works with " [0001" and " {0001" -----
            if (attribute.indexOf("Headwear") >= 0)
            {
                var splitString = attributeData.split(" ");
                var color = splitString.shift(); // Remove the first word
                splitString.push(color); // Add the first word to the end
                attributeData = splitString.join(" ");
            }
            else if (attribute.indexOf("Backdrop") < 0)
            {
                attributeData = attributeData.concat(" [0001"); // Some assets might contain same strings so need to also check for frame number
            }

            else
            {
                attributeData = attributeData;
            }
            
            // Debug message for the attribute name
            debugMessage(("Attribute: " + attribute + " Attribute data: " + attributeData), debug);
            
            // Select all precomps containing the string from attribute
            selectAllPrecompsContainingString(attribute);
            
            debugMessage(("All precomps containing string: '" + attribute + "' selected!"), debug);

            // Get the selected layers / precomps
            var selectedComps = comp.selectedLayers;

            // Iterate over each selected precomp
            for (var k = 0; k < selectedComps.length; k++)
            {
                var preComp = selectedComps[k];
                // Get layers inside comp
                var layers = preComp.source;

                debugMessage(("Precomp name: " + preComp.name + " Number of layers in comp: " + layers.numLayers), debug);
                
                // Iterate through layers in the pre-comp and show layers containing the string
                for (var l = 1; l <= layers.numLayers; l++)
                {
                    var layer = layers.layer(l);
                    var layer_name = layer.name.toLowerCase();
                    layer_name = layer_name.replace("oversized ", "");

                    // Check if the layer name contains the specified string
                    // indexOf returns -1 if the string is not a part of the layer name
                    if (layer_name.indexOf(attributeData.toLowerCase()) >= 0)
                    {
                        debugMessage(("Layer: " + l + " Layer name: " + layer.name + " Contains string: " + attributeData), debug);
                        layer.enabled = true;

                        continue;
                    }
                    else
                    {
                        debugMessage(("Layer: " + l + " Layer name: " + layer.name + " Does not contain string: " + attributeData), debug);
                    }
                }
            }
        }

        // If true surpress warnings
        if (overwriteFiles)
        {
            app.beginSuppressDialogs();
        }

        // Render!
        renderComp(i, outputFolder);
    }

    // End suppressing warnings
    app.endSuppressDialogs(true);
    // Alert when the script is done
    alert("Done!");
    debugMessage(("Script completed!"), debug);
}

// Call the function to render NFTs
renderNTFs(csvData, startNFT, endNFT, renderItemsArray, outputFolder, overwriteFiles);