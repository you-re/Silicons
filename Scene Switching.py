#----- Scene Switching -----
import bpy, os
from pathlib import Path

# Scenes and their lengths
scenes = ["Wave", "Idle", "Strut Walk", "GM"]
scenes_length = [31, 284, 43, 100]

# Collections that have alembic files
collections = ["Outerwear", "Bottoms"]

# Assets to render
skins_materials = ["Apricot", "Arabescato Marble", "Baby Blue", "Black Glass", "Carbon", "Charcoal", "Cherry Blossom", "Chrome", "Eggshell", "Gold", "Gun Metal", "Ice", "Invisible", "Jacaranda", "Lime", "Navy Glass", "Purple Glass", "Smoke", "Vanilla", "Wool", "Zebra Marble"]

eyes_materials = ["Electric", "Apple", "Grape", "White", "Hot Pink", "Ice Blue", "Tangerine", "Red", "Teal", "Black", "Lavender", "Peach", "Pistachio", "Baby Pink", "Grey"]

headwear_items = ["Fur Bucket", "Beanie", "Visor", "Headphones", "Denim Cap", "A Cap", "Babushka", "Flat Cap", "Backwards Cap", "Balaclava", "Cowboy Hat"]

headwear_materials = ["Fur Bucket Eggshell", "Fur Bucket Purple", "Fur Bucket Black", "Fur Bucket Ice", "Fur Bucket Pistachio", "Beanie Pink", "Beanie Purple", "Beanie Blue", "Beanie Black", "Visor Chrome", "Visor Carbon", "Headphones Silver", "Headphones Black", "Denim Cap Black", "Denim Cap Blue", "A Cap Black", "A Cap Eggshell", "A Cap Purple", "A Cap Blue", "A Cap Pistachio", "Babushka Eggshell", "Babushka Doodles", "Babushka Black", "Babushka Floral", "Flat Cap Eggshell", "Flat Cap Black", "Flat Cap Pistachio", "Flat Cap Blue", "Flat Cap Purple", "Backwards Cap Eggshell", "Backwards Cap Black", "Backwards Cap Pistachio", "Backwards Cap Blue", "Backwards Cap Purple", "Balaclava Eggshell", "Balaclava Blue", "Balaclava Pistachio", "Balaclava Purple", "Balaclava Camo", "Cowboy Hat Black", "Cowboy Hat Eggshell"]

outerwear_items = ["Bomber Jacket", "Bowler", "Burnout", "Button Down", "CAW Hoodie", "Cardigan", "Denim Jacket", "Flannel", "Fur Coat", "Hoodie", "NY Sweater", "Oversized T-Shirt", "Prep", "Puffer Vest", "Puffer", "Rugby Jersey", "Silicons FC", "Sweater", "T-Shirt", "Two-Tone", "V-Neck", "Varsity Jacket", "Vest"]

outerwear_materials = ["Bomber Jacket Black", "Bomber Jacket Tan", "Bowler Black", "Bowler Crochet", "Bowler Eggshell", "Burnout Black", "Burnout Carbon", "Burnout Purple", "Burnout Red", "Burnout White", "Button Down Black", "Button Down Blue", "Button Down White", "CAW Hoodie Black", "CAW Hoodie Purple", "CAW Hoodie White", "Cardigan Black", "Cardigan Ice", "Cardigan Purple", "Denim Jacket Black", "Denim Jacket Blue", "Denim Jacket Chess", "Denim Jacket Salt Pan", "Flannel Barney", "Flannel Blue", "Flannel Tweed", "Fur Coat Ice", "Fur Coat Pistachio", "Fur Coat Purple", "Hoodie Black", "Hoodie Ice", "Hoodie Purple", "Hoodie White", "NY Sweater Black", "NY Sweater White", "Oversized T-Shirt Black", "Oversized T-Shirt Eggshell", "Oversized T-Shirt Grey", "Oversized T-Shirt Ice", "Oversized T-Shirt Purple", "Oversized T-Shirt White", "Prep Black", "Prep Eggshell", "Prep Ice Blue", "Prep Purple", "Prep Rose", "Puffer Vest Black", "Puffer Vest Ice", "Puffer Vest Purple", "Puffer Vest Purple Camo", "Puffer Vest Wool", "Puffer Black", "Puffer Gold", "Puffer Ice Fur", "Puffer Purple", "Puffer Wool", "Puffer Purple Camo", "Rugby Jersey Black", "Rugby Jersey Blue", "Rugby Jersey Pink", "Silicons FC - Alternate", "Silicons FC - Away", "Silicons FC - Home", "Sweater Black", "Sweater Duo", "Sweater Eggshell", "Sweater Ice", "Sweater Purple", "Sweater Purple Camo", "T-Shirt Crystal Ball", "T-Shirt Essential", "T-Shirt Flow", "T-Shirt GM", "T-Shirt Toly", "Two-Tone Black", "Two-Tone Blue", "Two-Tone Purple", "Two-Tone Rose", "V-Neck Black", "V-Neck Pistachio", "V-Neck White", "Varsity Jacket Black", "Varsity Jacket Tan", "Vest Blue", "Vest Purple", "Vest White"]

bottoms_items = ["Cargos", "Cargo Shorts", "Combat Shorts", "Front Pleats", "Joggers", "Jeans", "Skydivers", "Trousers"]

bottoms_materials = ["Cargos Black", "Cargos Eggshell", "Cargos Camo", "Cargo Shorts Black", "Cargo Shorts Eggshell", "Cargo Shorts Camo", "Combat Shorts Eggshell", "Combat Shorts Black", "Combat Shorts Camo", "Front Pleats Eggshell", "Front Pleats Black", "Front Pleats Camo", "Joggers Black", "Joggers Eggshell", "Jeans Black", "Jeans Blue", "Jeans Grey", "Jeans Salt Pan", "Jeans Monogram", "Jeans Houndstooth", "Jeans Blue Ripped", "Jeans Black Ripped", "Skydivers Black", "Skydivers Camo", "Skydivers Charcoal", "Skydivers Eggshell", "Trousers Black", "Trousers Brown", "Trousers Eggshell"]

shoes_items = ["2099s", "2288s", "Space Runners", "CAWs", "Skywalkers"]

shoes_materials = ["2099s Black", "2099s White", "2099s Carbon", "2099s Silver", "2099s Liquid", "2288s Black", "2288s Carbon", "2288s Silver", "2288s White", "Space Runners Black", "Space Runners Silver", "Space Runners White", "CAWs Black", "CAWs White", "CAWs Chrome", "Skywalkers Black", "Skywalkers White"]

extra_objects = ["Cup GM"]

# Scene switching functions
def shoesSwitch(switch_to_scene, scenes):
    objects = ["Shoes Collision Box L", "Shoes Collision Box R", "Crew Socks"]
    for object_name in objects:
        object = bpy.data.objects[object_name]
        for scene in scenes:
            armature_name = "Armature " + scene
            # Hide viewport
            object.modifiers[armature_name].show_viewport = False
            # Hide render
            object.modifiers[armature_name].show_render = False
        # Show current scene
        armature_show = "Armature " + switch_to_scene
        object.modifiers[armature_show].show_viewport = True
        object.modifiers[armature_show].show_render = True

def siliconSwitch(switch_to_scene, scenes):
    objects = ["Silicon Rig", "Silicon Skin", "Silicon Eyes"]
    # Hide all other scene objects
    for object_name in objects:
        for scene in scenes:
            if scene == switch_to_scene:
                object = bpy.data.objects[object_name + " " + scene]
                object.hide_viewport = False
                object.hide_render = False
            else:
                object = bpy.data.objects[object_name + " " + scene]
                object.hide_viewport = True
                object.hide_render = True

    # Show / Hide cup
    cup = bpy.data.objects["Cup GM"]
    if switch_to_scene == "GM":
        cup.hide_viewport = False
        cup.hide_render = False
    else:
        cup.hide_viewport = True
        cup.hide_render = True

def hatsSwitch(switch_to_scene, scenes):
    # Get the collection
    collection = bpy.data.collections["Headwear"]
    
    # Can use scene array to
    for object in collection.objects:
        for scene in scenes:
            armature_name = "Armature " + scene
            # Hide viewport
            object.modifiers[armature_name].show_viewport = False
            # Hide render
            object.modifiers[armature_name].show_render = False
        # Show current scene
        armature_show = "Armature " + switch_to_scene
        object.modifiers[armature_show].show_viewport = True
        object.modifiers[armature_show].show_render = True

def setupCacheFiles(collection_name, scene_num, switch_to_scene, switch_to_length):
    # Get the collection
    collection = bpy.data.collections[collection_name]

    # Construct the object path - needed to setup the cache files
    object_path = "/%s_%s/Garment" %(str(scene_num+1), switch_to_scene)
    object_path = object_path.replace(" ", "_")

    # For each object in the collection
    for obj in collection.objects:
        
        # Construct the name of the cache file
        cache_file_name = "%s %s Sim Loop.abc" %(obj.name, switch_to_scene)
        
        # Change the cache and fix the object path
        obj.modifiers["MeshSequenceCache"].cache_file = bpy.data.cache_files[cache_file_name]
        obj.modifiers["MeshSequenceCache"].object_path = object_path    
                
        # Setup and assign the driver to loop the animation
        fcurve = bpy.data.cache_files[cache_file_name].driver_add("frame")
        new_driver = fcurve.driver
        new_driver.type = "SCRIPTED"
        new_driver.expression = "frame % " + str(switch_to_length+1)

# Full scene switch function
def sceneSwitch(switch_to_scene, scenes, switch_to_length, collections, scene_num):
    
    siliconSwitch(switch_to_scene, scenes)
    shoesSwitch(switch_to_scene, scenes)
    hatsSwitch(switch_to_scene, scenes)

    # For each collection - Bottoms and Outerwear
    for collection_name in collections:
        setupCacheFiles(collection_name, scene_num, switch_to_scene, switch_to_length)

    # Set end frame
    bpy.context.scene.frame_end = switch_to_length

def disableItems(headwear_items, outerwear_items, bottoms_items, shoes_items, extra_objects):
    all_items = headwear_items + outerwear_items + bottoms_items + shoes_items + extra_objects
    for object in all_items:
        bpy.data.objects[object].hide_render = True

# Disable all items from rendering
disableItems(headwear_items, outerwear_items, bottoms_items, shoes_items, extra_objects)

# Scene to switch to: 0 ~ Wave 1 ~ Idle 2 ~ Strut Walk 3 ~ GM
scene_num = 2

# Get the scene and scene frame range to switch to
scene_name = scenes[scene_num]
scene_length = scenes_length[scene_num]

# Switch to correct scene
sceneSwitch(scene_name, scenes, scene_length, collections, scene_num)