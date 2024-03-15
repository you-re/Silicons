import bpy
import csv

# Path to .csv file
relative_csv_path = "//./Scripting/Mint SoT - Hons - 0-5016.csv"

csv_file_path = bpy.path.abspath(relative_csv_path)

# NFT number that needs to be set up
nft_num = 123

# The actual nft is two lines ahead
ntf_csv_line = nft_num + 2

def collection_exists(collection_name):

    for collection in bpy.data.collections:
        if collection.name == collection_name:
            collectionFound = True
            return(True)
    
    return(False)

def create_dict(attribute_list, value_list):
    dictionary = {}
    for i in range(len(attribute_list)):
        dictionary.update({
            attribute_list[i]: value_list[i]
        })
    return(dictionary)


def get_csv_row(csv_path, csv_row):
    
    # Open the CSV file
    with open(csv_path, encoding="utf-8-sig", newline="") as csv_file:
        
        # Create a CSV reader object
        csv_reader = csv.reader(csv_file)

        # Iterate through the rows
        for i, row in enumerate(csv_reader):
            if i + 1 == csv_row:
                # Return the n-th row
                print(f"Read line {csv_row}: {row}")
                
                return(row)
                break
        else:
            # Handle the case where the specified line number is greater than the number of lines in the file
            return(-1)
            print(f"Line {csv_row} not found in the CSV file.")

nft_attributes = get_csv_row(csv_file_path, 1)

nft_items = get_csv_row(csv_file_path, ntf_csv_line)

nft_dictionary = create_dict(nft_attributes, nft_items)

for attribute in nft_attributes:    

    if collection_exists(attribute):

        collection = bpy.data.collections[attribute]

        for obj in collection.all_objects:
            # Get object name
            try:
                obj_name = obj.name
            except:
                continue
            
            
            if obj_name in nft_dictionary[attribute] or obj_name in attribute:
                if obj.hide_viewport:
                    obj.hide_viewport = False
                if obj.hide_render:
                    obj.hide_render = False
            else:
                bpy.data.objects[obj_name].select_set(True)
                bpy.context.view_layer.objects.active = bpy.data.objects[obj_name]
                bpy.ops.object.select_all(action='DESELECT')