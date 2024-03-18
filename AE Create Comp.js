// Define the array of layer names
var layer_names = ["Backdrop", "Shoes Bottom", "Outerwear Bottom", "Bottoms Bottom", "Headwear Bottom", "Skins", "Headwear Middle", "Shoes Top", "Bottoms Top", "Outerwear Top", "Eyes", "Headwear Top", "Backdrop Tint"];

// Layer items
var attributes = ["Backdrop", "Headwear", "Eyes", "Outerwear", "Bottoms", "Shoes", "Skins"];

// Comp masks
var comp_masks = ["Headwear", "Outerwear", "Bottoms", "Shoes"];

// name of the comp
var compName = "Silicons";
// comp width
var compW = 1920;
// comp height
var compH = 1920;
// pixel aspect ratio
var compAspect = 1.0;
// duration in frames
var compDur = 32;
// framerate
var compFR = 30;

// Function to assign color to layers / comps
function getItemIndex(item_name, array, start_iter)
{
    // Set start_iter to 0 if it's not provided
    if (typeof start_iter === 'undefined')
    {
        start_iter = 0;
    }

    // Check if substring is part of the string
    var check = -1;

    for (var i = start_iter; i < array.length; i++)
    {   
        // Update check - if > -1 attribute is part of item_name
        // Handle if check is not a constant
        if (typeof array[i] === 'string')
        {
            check = item_name.indexOf(array[i]);
        }
        else
        {
            check = item_name.indexOf(array[i].name);
        }

        // Debugging stuff
        // alert("Check: " + check + " array: " + array + " array name: " + item_name);

        // If check is true return the color index
        if (check >= 0)
        {
            return i;
            break;
        }
    }

    // If string isn't found
    if (check < 0)
    {
        return ("The '${item_name}' string is not in the array!");
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
// Set the label to none
mainComp.label = 0;

// Loop through the layer names array
for (var i = 0; i < layer_names.length; i++)
{   
    // Get the exact layer name
    var layer_name = layer_names[i]

    // Create a new composition for each layer name
    var comp = app.project.items.addComp(layer_name, compW, compH, compAspect, compDur, compFR);

    // Assign labels to the comp - labels start from 1
    comp.label = getItemIndex(layer_name, attributes)+1;

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

    // Assign labels to the folders
    attribute_folder.label = i+1;
}

// Create comp mask folders
for (var i = 0; i < comp_masks.length; i++)
{   
    // Get the attribute name
    var attribute = comp_masks[i]

    // Create a new folder for masks
    var comp_mask_folder = app.project.items.addFolder(attribute + " Comp Mask");

    // Assign labels to the folders - labels start from 1
    comp_mask_folder.label = getItemIndex(attribute, attributes)+1;
}

// Folder names array
var folder_cache = [];

// --------- Import ---------

// Define the import folder path
var origin_folder_path = "F:/Silicons Animations/Optimization/RNDR/Test";

// Check if the folder exists
var parent_folder = new Folder(origin_folder_path);
if (parent_folder.exists)
{
    // Get all files in the folder
    var parent_folders = parent_folder.getFiles();

    for (folder_index = 0; folder_index < parent_folders.length; folder_index++)
    {
        // Child folder name
        var child_folder_name = parent_folders[folder_index].name;
        // Get child path
        var child_folder_path = origin_folder_path + "/" + child_folder_name;
        // Get child folder
        var child_folder = new Folder(child_folder_path);
        // Get files
        var child_files = child_folder.getFiles();
        // Fix whitespace characters
        child_folder_name = child_folder_name.replace(/%20/g, " ");

        var index = -1; 
        for (var i = 1; i < app.project.items.length; i++)
        {
            if (app.project.items[i].name == child_folder_name.replace("%20", " ") && app.project.items[i] instanceof FolderItem)
            {
                index = i;
                break;
            }
        }
        // Loop through each file
        for (var file_index = 0; file_index < child_files.length; file_index++)
        {
            // Get i-file
            var file = child_files[file_index];
            
            // Import the file into the project
            imported_file = app.project.importFile(new ImportOptions(file));

            // If name < folder name the item was imported before the folder so need to add 1
            if (file.name > app.project.items[index].name)
            {
                // Place in appropriate folder
                imported_file.parentFolder = app.project.items[index];
            }

            else
            {
                // Place in appropriate folder
                imported_file.parentFolder = app.project.items[index+1];
            }
        }
    }    
}
