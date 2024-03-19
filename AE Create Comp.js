// Define the array of layer names
var layer_names = ["Backdrop", "Shoes Bottom", "Outerwear Bottom", "Bottoms Bottom", "Headwear Bottom", "Skins", "Headwear Middle", "Shoes Top", "Bottoms Top", "Outerwear Top", "Eyes", "Headwear Top", "Backdrop Tint"];

// Layer items
var attributes = ["Backdrop", "Headwear", "Eyes", "Outerwear", "Bottoms", "Shoes", "Skins", "GM Cup"];

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

// Setup a project
function projectSetUp(compDur)
{
    // Create a new project
    var siliconsProject = app.newProject();

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
}

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

// Import image sequence
function importImageSequences(files, frames_in_sequence, folder_index, tag)
{
    // Get folder
    var folder = app.project.items[folder_index];
    // Initiate tag_index with default values
    var tag_index = 0;

    // Set start_iter to 0 if it's not provided
    if (typeof tag === 'undefined' || tag == true)
    {
        tag_index = getItemIndex(folder.name, attributes) + 1;
    }

    // Loop through each file
    for (var file_index = 0; file_index < files.length;)
    {
        // Get the first frame from the sequence
        var first_file = files[file_index];

        // Import the image sequence into the project
        var import_options = new ImportOptions(first_file);

        // Set sequence flag to true
        import_options.sequence = true;

        // Import the sequence
        var imported_sequence = app.project.importFile(import_options);

        // Put the sequence in the appropriate folder in after effects
        // If name < folder name the item was imported before the folder so need to add 1
        if (imported_sequence.name > folder.name)
        {
            // Place in appropriate folder
            imported_sequence.parentFolder = folder;
        }

        else
        {
            // Place in appropriate folder
            imported_sequence.parentFolder = app.project.items[folder_index + 1];
        }
        
        // Set label to the imported sequence
        imported_sequence.label = tag_index;

        // Iterate!
        file_index = file_index + frames_in_sequence;
    }
}

// Import still images
function importStillImages(files, folder_index, tag)
{
    // Get folder item
    var folder = app.project.items[folder_index];
    // Initiate tag_index with default values
    var tag_index = 0;

    // Set start_iter to 0 if it's not provided
    if (typeof tag === 'undefined' || tag == true)
    {
        tag_index = getItemIndex(folder.name, attributes) + 1;
    }

    // Loop through each file
    for (var file_index = 0; file_index < files.length; file_index++)
    {
        // Get the file
        var file = files[file_index];
        
        // Import the file into the project
        imported_file = app.project.importFile(new ImportOptions(file));

        // Put the image in the appropriate folder in after effects
        // If name < folder name the item was imported before the folder so need to add 1
        if (file.name > folder.name)
        {
            // Place in appropriate folder
            imported_file.parentFolder = folder;
        }

        else
        {
            // Place in appropriate folder
            imported_file.parentFolder = app.project.items[folder_index + 1];
        }
        // Set label to the imported file
        imported_file.label = tag_index;
    }
}

// Find index of the AE folder
function findFolderIndex(folder_name)
{
    // Find the index of destination folder in AE
    for (var i = 1; i < app.project.items.length; i++)
    {
        if (app.project.items[i].name == folder_name && app.project.items[i] instanceof FolderItem)
        {
            return (i);
        }
    }
    alert("Folder with name '${folder_name}' not present in AE!")
    return(-1);
}

// Import files from scene folder
function importFromFolder(origin_folder_path, scene_num)
{
    // Scene to setup
    var scene_name = scenes[scene_num];
    // Scene frame length
    var scene_length = scenes_length[scene_num];

    // Construct scene path
    var scene_path = origin_folder_path + scene_name;

    // Check if the folder exists
    var scene_folder = new Folder(scene_path);

    // Get all files in the folder
    var origin_files = scene_folder.getFiles();

    // Iterate over each file / folder in the original folder
    for (folder_index = 0; folder_index < origin_files.length; folder_index++)
    {
        // Child folder name
        var child_folder_name = origin_files[folder_index].name;
        // Fix whitespace characters
        child_folder_name = child_folder_name.replace(/%20/g, " ");
        // Get child path
        var child_folder_path = scene_path + "/" + child_folder_name;
        // Get child folder
        var child_folder = new Folder(child_folder_path);
        // Get files
        var child_files = child_folder.getFiles();

        // Find the index of destination folder in AE
        var index = findFolderIndex(child_folder_name)

        // Import sequences
        if (child_folder_name != "Backdrop")
        {
            importImageSequences(child_files, scene_length, index);
        }

        // Import stills
        else
        {
            importStillImages(child_files, index);
        }
    }
}

// ⋇⋆✦⋆⋇ RENDER SETTINGS ⋇⋆✦⋆⋇

// Define the import folder path
var origin_folder_path = "F:/Silicons Animations/Optimization/RNDR/20240305/";

// Scene to use: 0 ~ Wave 1 ~ Idle 2 ~ Strut Walk 3 ~ GM
var scene_num = 3;

// ⋇⋆✦⋆⋇ RENDER SETTINGS ⋇⋆✦⋆⋇

// Scenes and their appropriate lengths
scenes = ["Wave", "Idle", "Strut Walk", "GM"]
scenes_length = [31, 284, 43, 100]

// Setup project
projectSetUp(scene_length);

// Import images and sequences from folder
importFromFolder(origin_folder_path, scene_num);

// ----- Cache folders and comps -----

// Create a hashmap for folders and comps
var foldersDict = {};
var compsDict = {};

// ----- MAYBE I can store the actual folder / comp in the hashmap -----
// Cache folders and comps
for (var item_index = 1; item_index < app.project.items.length; item_index++)
{
    var item = app.project.items[item_index];
    // Cache folders
    if (item instanceof FolderItem)
    {
        foldersDict[item_index] = item.name;
    }
    // Cache comps
    else if (item instanceof CompItem)
    {
        compsDict[item_index] = item.name;
    }
    else
    {
        continue;
    }
}

// ----- Get image sequences into comps -----
for (var folder_index in foldersDict)
{
    // Get the actual folder
    var folder = app.project.items[folder_index];
    // Get the folder name
    var folder_name = foldersDict[folder_index];

    for (var comp_index in compsDict)
    {
        var comp_name = compsDict[comp_index];
        if (comp_name.indexOf(folder_name) >= 0)
        {
            // HANDLE IMPORTING FILES FROM FOLDER INTO THE COMP
            alert("Folder: " + folder_name + " Index: " + folder_index + " Comp: " + comp_name + " Index: " + comp_index);
        }
    }
}