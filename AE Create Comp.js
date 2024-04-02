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
//var compDur = 32;
// framerate
var compFR = 30;

// Don't suppress dialogs
app.endSuppressDialogs(true);

// Setup a project
function projectSetUp(scene_num)
{
    // Set scene length in seconds
    var compDur = scenes_length[scene_num] / compFR;
    // Create a new project
    var siliconsProject = app.newProject();

    // Create a new composition in the created project - (name, width, height, pixelAspect, duration (seconds), frameRate)
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
function importImageSequences(files, frames_in_sequence, folder_index, tag_index)
{
    // Get folder
    var folder = app.project.items[folder_index];

    var prefix = "";
    if (folder.name.indexOf("Comp Mask") >= 0)
    {
        prefix = "Comp Mask ";
    }
    
    // Set tag index to 0 if it's not provided
    if (typeof tag_index === 'undefined')
    {
        // Initiate tag_index with default values
        tag_index = 0;
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

        imported_sequence.name = prefix + imported_sequence.name.replace(" Comp Mask", "");

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
function importStillImages(files, folder_index, tag_index)
{
    // Get folder item
    var folder = app.project.items[folder_index];

    // Set tag index to 0 if it's not provided
    if (typeof tag_index === 'undefined')
    {
        // Initiate tag_index with default values
        tag_index = 0;
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
        
        // Initiate tag index - +1 because AE starts counting from 1
        var tag_index = getItemIndex(child_folder_name, attributes) + 1;

        // Set tag to none - easier to differentiate mask layers from normal layers
        if (child_folder_name.split(" ").pop() == "Mask")
        {
            var tag_index = 0;
        }

        // Import sequences
        if (child_folder_name != "Backdrop")
        {
            importImageSequences(child_files, scene_length, index, tag_index);
        }

        // Import stills
        else
        {
            importStillImages(child_files, index, tag_index);
        }
    }
}

// ⋇⋆✦⋆⋇ RENDER SETTINGS ⋇⋆✦⋆⋇

// Define the import folder path
var origin_folder_path = prompt("Location of renders:", "F:\\Silicons Animations\\Optimization\\Send\\silicons_render");

// ----- QUICK FIX ----- Fix origin path
origin_folder_path = origin_folder_path.replace(/\\/g, "/");
if (origin_folder_path[origin_folder_path.length] != "/")
{
    origin_folder_path += "/";
}

// Scene to load
var scene_to_load = prompt("Scene to load ~ Wave ~ Idle ~ Strut Walk ~ GM ~ :", "Wave");

var scenes_dict =
{
    0 : "Wave",
    1 : "Idle",
    2 : "Strut Walk",
    3 : "GM"
};
// 
var scene_num = -1;

// Scene to use: ~ 0 Wave ~ 1 Idle ~ 2 Strut Walk ~ 3 GM ~
for (var scene in scenes_dict)
{
    if (scenes_dict[scene] == scene_to_load)
    {
        scene_num = scene;
    }
};

// alert("Scene number: " + scene_num);

// ⋇⋆✦⋆⋇ RENDER SETTINGS ⋇⋆✦⋆⋇

// Scenes and their appropriate lengths
var scenes = ["Wave", "Idle", "Strut Walk", "GM"]
var scenes_length = [31, 284, 43, 100]

// Setup project
projectSetUp(scene_num);

// Import images and sequences from folder
importFromFolder(origin_folder_path, scene_num);

// ----- Cache folders and comps -----

// Create a hashmap for folders and comps
var foldersDict = {};
var compsDict = {};

// ----- MAYBE I can store the actual folder / comp in the hashmap -----
// Cache folders and comps
for (var item_index = 1; item_index <= app.project.items.length; item_index++)
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
// First import the comp masks so they are in the bottom of the comp -> saves time when iterating over items
for (var folder_index in foldersDict)
{
    // Get the folder name
    var folder_name = foldersDict[folder_index];
    
    // For each comp
    for (var comp_index in compsDict)
    {
        // Get the comp name
        var comp_name = compsDict[comp_index];

        if (folder_name.split(" ").pop() == "Mask" && comp_name == folder_name.split(" ")[0] + " Top")
        {
            // Get the folder
            var folder = app.project.items[folder_index];

            // Get the comp
            var comp = app.project.items[comp_index];

            // Iterate over each item in the folder
            for (var item_index = 0; item_index < folder.items.length; item_index++)
            {
                // Get item from the folder
                var item = folder.items[item_index+1];

                // Add the item into the precomp
                var layer = comp.layers.add(item);

                // Add levels and adjust them to fix the white levels
                layer.effect.addProperty("ADBE Easy Levels2");

                // 1 == 32768.0 in AE
                var inBlack = 20000 / 32768;

                layer.effect("Levels")("Input Black").setValue(inBlack);
                layer.effect("Levels")("Input White").setValue(0);

                // Unmultiply
                layer.effect.addProperty("ADBE Shift Channels");
                layer.effect.addProperty("ADBE Remove Color Matting");

                // Set take alpha from Lightness - stupid AE counts from 1
                layer.effect("Shift Channels")("Take Alpha From").setValue(7);

                // Hide the layer
                layer.enabled = false;
            }
        }
    }
}

// ----- DIRTY FIX -----
// Quick fix for the Middle Hats comp
for (var folder_index in foldersDict)
{
    // Get the folder name
    var folder_name = foldersDict[folder_index];
    
    // For each comp
    for (var comp_index in compsDict)
    {
        // Get the comp name
        var comp_name = compsDict[comp_index];

        if (folder_name.split(" ").pop() == "Mask" && comp_name == folder_name.split(" ")[0] + " Middle")
        {
            // Get the folder
            var folder = app.project.items[folder_index];

            // Get the comp
            var comp = app.project.items[comp_index];

            // Iterate over each item in the folder
            for (var item_index = 0; item_index < folder.items.length; item_index++)
            {   
                // Get item from the folder
                var item = folder.items[item_index+1];

                if (item.name.indexOf("Balaclava") >= 0)
                {
                    // Add the item into the precomp
                    var layer = comp.layers.add(item);

                    // Add levels and adjust them to fix the white levels
                    layer.effect.addProperty("ADBE Easy Levels2");

                    // 1 == 32768.0 in AE
                    var inBlack = 20000 / 32768;

                    layer.effect("Levels")("Input Black").setValue(inBlack);
                    layer.effect("Levels")("Input White").setValue(0);

                    // Unmultiply
                    layer.effect.addProperty("ADBE Shift Channels");
                    layer.effect.addProperty("ADBE Remove Color Matting");

                    // Set take alpha from Lightness - stupid AE counts from 1
                    layer.effect("Shift Channels")("Take Alpha From").setValue(7);

                    // Hide the layer
                    layer.enabled = false;
                }
            }
        }
    }
}

// Import normal items to precomps
for (var folder_index in foldersDict)
{
    // Get the actual folder
    var folder = app.project.items[folder_index];
    // Get the folder name
    var folder_name = foldersDict[folder_index];

    for (var comp_index in compsDict)
    {   
        // ----- DIRTY FIX -----
        // Quick fix for the Middle Hats comp
        var comp_name = compsDict[comp_index];
        if (comp_name.indexOf(folder_name) >= 0 && !(comp_name.indexOf("Middle") >= 0))
        {
            // Get the precomp
            var precomp = app.project.items[comp_index];

            // Iterate over each item in the folder
            for (var item_index = 0; item_index < folder.items.length; item_index++)
            {
                // Get the actual item
                var item = folder.items[item_index+1];

                // Add the item into the precomp
                var layer = precomp.layers.add(item);

                // Hide the layer except if it's the first one
                layer.enabled = (item_index == 0);
            }
        }
        else if (comp_name.indexOf(folder_name) >= 0 && comp_name.indexOf("Middle") >= 0)
        {
            // Get the precomp
            var precomp = app.project.items[comp_index];

            // Iterate over each item in the folder
            for (var item_index = 0; item_index < folder.items.length; item_index++)
            {
                // Get the actual item
                var item = folder.items[item_index+1];

                if (item.name.indexOf("Balaclava") >= 0)
                {
                    // Add the item into the precomp
                    var layer = precomp.layers.add(item);

                    // Hide the layer except if it's the first one
                    layer.enabled = false;
                }
            }
        }
    }
}

// ----- Change the tint comp to actually tint the layers below -----
// Ugly function but whatever
for (var i = 1; i <= app.project.items.length; i++)
{
    var item = app.project.items[i]
    if (item.name == "Silicons")
    {
        // Store the main comp to reference later
        main_comp = item;
        // Open the main comp
        main_comp.openInViewer();
        break;
    }
}

for (var i = 1; i <= main_comp.numLayers; i++)
{
    if (main_comp.layer(i).name == "Backdrop Tint")
    {
        layer = main_comp.layer(i);
        // Set blending mode to "Color"
        layer.blendingMode = BlendingMode.COLOR;

        // Set opacity to 20%
        layer.opacity.setValue(20);
        break;
    }
}

// ----- CRAPPY MASKING MATERIAL / ITEMS CHECK -----
function getLayerMaskNames(assetGroup)
{
    var items = [];
    var materials = [];

    if (assetGroup == "Shoes")
    {
        items = ["2099s", "2288s", "CAWs", "Skywalkers", "Space Runners"];

        materials = ["2099s Black", "2099s Carbon", "2099s Liquid", "2099s Silver", "2099s White", "2288s Black", "2288s Carbon", "2288s Silver", "2288s White", "CAWs Black", "CAWs Chrome", "CAWs White", "Skywalkers Black", "Skywalkers White", "Space Runners Black", "Space Runners Silver", "Space Runners White"];
    
        // alert("Got Shoes!");
    }

    else if (assetGroup == "Bottoms")
    {
        items = ["Cargos", "Cargo Shorts", "Combat Shorts", "Front Pleats", "Joggers", "Jeans", "Skydivers", "Trousers"];

        materials = ["Cargos Black", "Cargos Eggshell", "Cargos Camo", "Cargo Shorts Black", "Cargo Shorts Eggshell", "Cargo Shorts Camo", "Combat Shorts Eggshell", "Combat Shorts Black", "Combat Shorts Camo", "Front Pleats Eggshell", "Front Pleats Black", "Front Pleats Camo", "Joggers Black", "Joggers Eggshell", "Jeans Black", "Jeans Blue", "Jeans Grey", "Jeans Salt Pan", "Jeans Monogram", "Jeans Houndstooth", "Jeans Blue Ripped", "Jeans Black Ripped", "Skydivers Black", "Skydivers Camo", "Skydivers Charcoal", "Skydivers Eggshell", "Trousers Black", "Trousers Brown", "Trousers Eggshell"]
    
        // alert("Got Bottoms!");
    }

    else if (assetGroup == "Outerwear")
    {
        items = ["Bomber Jacket", "Bowler", "Burnout", "Button Down", "Cardigan", "Denim Jacket", "Flannel", "Fur Coat", "Hoodie", "CAW Hoodie", "Sweater", "T-Shirt", "NY Sweater", "Oversized T-Shirt", "Vest", "Prep", "Puffer", "Puffer Vest", "Rugby Jersey", "Silicons FC", "Two-Tone", "V-Neck", "Varsity Jacket", "Puffer Fur", "Puffer Wool", "Puffer Vest Wool"]

        materials = ["Bomber Jacket Black", "Bomber Jacket Tan", "Bowler Black", "Bowler Crochet", "Bowler Eggshell", "Burnout Black", "Burnout Carbon", "Burnout Purple", "Burnout Red", "Burnout White", "Button Down Black", "Button Down Blue", "Button Down White", "Cardigan Black", "Cardigan Ice", "Cardigan Purple", "Denim Jacket Black", "Denim Jacket Blue", "Denim Jacket Chess", "Denim Jacket Salt Pan", "Flannel Barney", "Flannel Blue", "Flannel Tweed", "Fur Coat Ice", "Fur Coat Pistachio", "Fur Coat Purple", "Hoodie Black", "Hoodie Ice", "Hoodie Purple", "Hoodie White", "CAW Hoodie Black", "CAW Hoodie Purple", "CAW Hoodie White", "Sweater Black", "Sweater Duo", "Sweater Eggshell", "Sweater Ice", "Sweater Purple", "Sweater Purple Camo", "T-Shirt Crystal Ball", "T-Shirt Essential", "T-Shirt Flow", "T-Shirt GM", "T-Shirt Toly", "NY Sweater Black", "NY Sweater White", "Oversized T-Shirt Black", "Oversized T-Shirt Eggshell", "Oversized T-Shirt Grey", "Oversized T-Shirt Ice", "Oversized T-Shirt Purple", "Oversized T-Shirt White", "Vest Blue", "Vest Purple", "Vest White", "Prep Black", "Prep Eggshell", "Prep Ice Blue", "Prep Purple", "Prep Rose", "Puffer Black", "Puffer Gold", "Puffer Purple", "Puffer Wool", "Puffer Purple Camo", "Puffer Vest Black", "Puffer Vest Ice", "Puffer Vest Purple", "Puffer Vest Purple Camo", "Puffer Vest Wool", "Rugby Jersey Black", "Rugby Jersey Blue", "Rugby Jersey Pink", "Silicons FC - Alternate", "Silicons FC - Away", "Silicons FC - Home", "Two-Tone Black", "Two-Tone Blue", "Two-Tone Purple", "Two-Tone Rose", "V-Neck Black", "V-Neck Pistachio", "V-Neck White", "Varsity Jacket Black", "Varsity Jacket Tan", "Puffer Ice Fur", "Wool Puffer", "Wool Puffer Vest"];
    
        // alert("Got Outerwear!");
    }
    else if (assetGroup == "Headwear")
    {
        items = ["Fur Bucket", "Beanie", "Visor", "Headphones", "Denim Cap", "A Cap", "Babushka", "Flat Cap", "Backwards Cap", "Balaclava", "Cowboy Hat"];

        materials = ["Fur Bucket Eggshell", "Fur Bucket Purple", "Fur Bucket Black", "Fur Bucket Ice", "Fur Bucket Pistachio", "Beanie Pink", "Beanie Purple", "Beanie Blue", "Beanie Black", "Visor Chrome", "Visor Carbon", "Headphones Silver", "Headphones Black", "Denim Cap Black", "Denim Cap Blue", "A Cap Black", "A Cap Eggshell", "A Cap Purple", "A Cap Blue", "A Cap Pistachio", "Babushka Eggshell", "Babushka Doodles", "Babushka Black", "Babushka Floral", "Flat Cap Eggshell", "Flat Cap Black", "Flat Cap Pistachio", "Flat Cap Blue", "Flat Cap Purple", "Backwards Cap Eggshell", "Backwards Cap Black", "Backwards Cap Pistachio", "Backwards Cap Blue", "Backwards Cap Purple", "Balaclava Eggshell", "Balaclava Blue", "Balaclava Pistachio", "Balaclava Purple", "Balaclava Camo", "Cowboy Hat Black", "Cowboy Hat Eggshell"];
        
        // alert("Got Headwear!");
    }

    return(items); // , materials);
}

function compMaskDictCreate(itemList, current_layer)
{
    // Create an empty dict
    var layerIndexDict = {};

    // alert("Created layerIndexDict! Number of layers: " + current_layer.numLayers + " : " + current_layer.name);

    for (var i = 0; i<= itemList.length; i++)
    {   
        var item = itemList[i];
        var maskLayerName = "Comp Mask " + item + " [";

        // alert("Item: " + item + " Mask layer name: " + maskLayerName);
        
        for (var j = 1; j <= current_layer.numLayers; j++)
        {
            var layer = current_layer.layer(j);

            // alert("Current layer: " + layer.name);

            if (layer.name.indexOf(maskLayerName) >= 0)
            {
                layerName = layer.name;
                // layerIndexDict[item[j]] = layer[j]
                layerIndexDict[layer.name] = j;

                // alert("Precomp: " + current_layer.name + " Layer name: " + layer.name + " Index: " + j);

                continue;
            }
        }
    }
    return(layerIndexDict)
}

function setLayerMasks(itemList, maskDict, current_layer)
{   
    var i = 0;

    for (var maskLayer in maskDict)
    {   
        var item = itemList[i];
        var layerNameFilter = item; // + " {";

        var trackMatteLayer = current_layer.layer(maskLayer);

        // ----- Dirty fix for fur puffer and wool items -----
        if (trackMatteLayer.name.indexOf("Puffer Vest Wool") >= 0)
        {
            alert("This is executed!");
            layerNameFilter = "Wool Puffer Vest";
        }

        else if (trackMatteLayer.name.indexOf("Puffer Wool") >= 0)
        {
            alert("This is executed!");
            layerNameFilter = "Wool Puffer";
        }

        else if (trackMatteLayer.name.indexOf("Puffer Fur") >= 0)
        {
            alert("This is executed!");
            layerNameFilter = "Ice Fur Puffer";
        }
        
        for (var j = 1; j <= current_layer.numLayers; j++)
        {
            var layer = current_layer.layer(j);

            if (layer.name.indexOf(layerNameFilter) >= 0 && layer.name.indexOf("Comp Mask") < 0)
            {
                layer.setTrackMatte(trackMatteLayer, TrackMatteType.ALPHA);
            }
        }
        i++;
    }
}

// ----- ASSIGN MASKS -----
for (var i = 1; i <= app.project.items.length; i++)
{
    // Get the precomp
    var precomp = app.project.items[i];

    if (precomp.name.split(" ").pop() == "Top" || precomp.name.split(" ").pop() == "Middle")
    {
        // alert("Precomp name: " + precomp.name);

        // Get the name of the layer
        var layerGroup = precomp.name.split(" ")[0];

        // Get items and materials
        var items = getLayerMaskNames(layerGroup);

        var compMaskDict = compMaskDictCreate(items, precomp);
        setLayerMasks(items, compMaskDict, precomp);
    }
}