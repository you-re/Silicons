// Define the array of layer names
var layer_names = ["Backdrop", "Shoes Bottom", "Outerwear Bottom", "Bottoms Bottom", "Headwear Bottom", "Skins", "Headwear Middle", "Shoes Top", "Bottoms Top", "Outerwear Top", "Eyes", "Headwear Top", "Backdrop Tint"];

// Layer items
var attributes = ["Backdrop", "Headwear", "Eyes", "Outerwear", "Bottoms", "Shoes", "Skins"]

// name of the comp
var compName = "Silicons"
// comp width
var compW = 1920
// comp height
var compH = 1920
// pixel aspect ratio
var compAspect = 1.0
// duration in frames
var compDur = 32
// framerate
var compFR = 30

// Function to assign color to layers / comps
function getColor(item_name)
{
    // Check if substring is part of the string
    var check = -1;

    for (var i = 0; i < attributes.length; i++)
    {
        // Get the attribute from the attributes array
        var attribute = attributes[i];

        // Update check - if > -1 attribute is part of item_name
        check = item_name.indexOf(attribute);

        // Debugging stuff
        // alert("Check: " + check + " attribute: " + attribute + " attribute name: " + item_name);

        // If check is true return the color index
        if (check >= 0)
        {
            return i+1;
        }
    }

    // If string isn't found
    if (check < 0)
    {
        return ("The '${item_name}' string is not in the attributes array!");
    }
}

// Create a new project if one doesn't exist
if (!app.project)
{
    var siliconsProject = app.newProject();
    alert(siliconsProject.file.name);
}

// Create a new composition in the created project - (name, width, height, pixelAspect, duration, frameRate)
var mainComp = app.project.items.addComp(compName, compW, compH, compAspect, compDur, compFR);
// Open the main comp
mainComp.openInViewer();

// Loop through the layer names array
for (var i = 0; i < layer_names.length; i++)
{   
    // Get the exact layer name
    var layer_name = layer_names[i]

    // Create a new composition for each layer name
    var comp = app.project.items.addComp(layer_name, compW, compH, compAspect, compDur, compFR);

    // Assign labels to the comp
    comp.label = getColor(layer_name);

    // Add the duplicated composition item to the main composition
    var layer = mainComp.layers.add(comp);
}


// Create folders
for (var i = 0; i < attributes.length; i++)
{   
    // Get the attribute name
    var attribute = attributes[i]

    // Create a new folder for attributes
    var attribute_folder = app.project.items.addFolder(attribute);

    // Create a new folder for masks
    var comp_mask_folder = app.project.items.addFolder(attribute + " Comp Mask");

    // Assign labels to the folders
    attribute_folder.label = i+1;
    comp_mask_folder.label = i+1;
}

//