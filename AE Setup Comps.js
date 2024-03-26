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
        items = ["Bomber Jacket", "Bowler", "Burnout", "Button Down", "Cardigan", "Denim Jacket", "Flannel", "Fur Coat", "Hoodie", "CAW Hoodie", "Sweater", "T-Shirt", "NY Sweater", "Oversized T-Shirt", "Vest", "Prep", "Puffer", "Puffer Vest", "Fur Puffer" , "Rugby Jersey", "Silicons FC", "Two-Tone", "V-Neck", "Varsity Jacket"];

        materials = ["Bomber Jacket Black", "Bomber Jacket Tan", "Bowler Black", "Bowler Crochet", "Bowler Eggshell", "Burnout Black", "Burnout Carbon", "Burnout Purple", "Burnout Red", "Burnout White", "Button Down Black", "Button Down Blue", "Button Down White", "Cardigan Black", "Cardigan Ice", "Cardigan Purple", "Denim Jacket Black", "Denim Jacket Blue", "Denim Jacket Chess", "Denim Jacket Salt Pan", "Flannel Barney", "Flannel Blue", "Flannel Tweed", "Fur Coat Ice", "Fur Coat Pistachio", "Fur Coat Purple", "Hoodie Black", "Hoodie Ice", "Hoodie Purple", "Hoodie White", "CAW Hoodie Black", "CAW Hoodie Purple", "CAW Hoodie White", "Sweater Black", "Sweater Duo", "Sweater Eggshell", "Sweater Ice", "Sweater Purple", "Sweater Purple Camo", "T-Shirt Crystal Ball", "T-Shirt Essential", "T-Shirt Flow", "T-Shirt GM", "T-Shirt Toly", "NY Sweater Black", "NY Sweater White", "Oversized T-Shirt Black", "Oversized T-Shirt Eggshell", "Oversized T-Shirt Grey", "Oversized T-Shirt Ice", "Oversized T-Shirt Purple", "Oversized T-Shirt White", "Vest Blue", "Vest Purple", "Vest White", "Prep Black", "Prep Eggshell", "Prep Ice Blue", "Prep Purple", "Prep Rose", "Puffer Black", "Puffer Gold", "Puffer Purple", "Puffer Wool", "Puffer Purple Camo", "Puffer Vest Black", "Puffer Vest Ice", "Puffer Vest Purple", "Puffer Vest Purple Camo", "Puffer Vest Wool", "Puffer Ice Fur", "Rugby Jersey Black", "Rugby Jersey Blue", "Rugby Jersey Pink", "Silicons FC - Alternate", "Silicons FC - Away", "Silicons FC - Home", "Two-Tone Black", "Two-Tone Blue", "Two-Tone Purple", "Two-Tone Rose", "V-Neck Black", "V-Neck Pistachio", "V-Neck White", "Varsity Jacket Black", "Varsity Jacket Tan"];
    
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
        
        for (var j = 1; j <= current_layer.numLayers; j++)
        {
            var layer = current_layer.layer(j);

            if (layer.name.indexOf(layerNameFilter) >= 0 && layer.name.indexOf("Comp Mask"))
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