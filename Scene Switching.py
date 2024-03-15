#----- Scene Switching -----
import bpy, os

# Scene to use: 0 ~ Wave 1 ~ Idle 2 ~ Strut Walk 3 ~ GM
# scene_num = 2

# Scenes and their lengths
scenes = ["Wave", "Idle", "Strut Walk", "GM"]
scenes_length = [31, 284, 43, 100]

# Collections that have alembic files
collections = ["Outerwear", "Bottoms"]

# Output folder
output_path = "../silicons_render/"

# Assets to render
skins = ["Apricot", "Arabescato Marble", "Baby Blue", "Black Glass", "Carbon", "Charcoal", "Cherry Blossom", "Chrome", "Eggshell", "Gold", "Gun Metal", "Ice", "Invisible", "Jacaranda", "Lime", "Navy Glass", "Purple Glass", "Smoke", "Vanilla", "Wool", "Zebra Marble"]


def shoesSwitch(switch_to_scene, scenes):
    objects = ["Shoes Collision Box L", "Shoes Collision Box R"]
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

def setupCacheFiles(collection_name, scene_num, switch_to_scene):
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
    shoesSwitch(switch_to_scene)
    hatsSwitch(switch_to_scene)

    # For each collection - Bottoms and Outerwear
    for collection_name in collections:
        setupCacheFiles(collection_name, scene_num, switch_to_scene)

    # Set end frame
    bpy.context.scene.frame_end = switch_to_length

def skinRender(skins, scene_name):
    # Important objects
    silicon = "Silicon Skin " + scene_name
    eyes = "Silicon Eyes " + scene_name
    backdrop = "Backdrop"
    
    # Setup the scene properly
    bpy.data.objects[silicon].hide_viewport = False
    bpy.data.objects[silicon].hide_render = False
    bpy.data.objects[silicon].is_holdout = False
    bpy.data.objects[silicon].is_shadow_catcher = False

    bpy.data.objects[backdrop].hide_viewport = False
    bpy.data.objects[backdrop].hide_render = False
    bpy.data.objects[backdrop].is_holdout = True
    bpy.data.objects[backdrop].is_shadow_catcher = False
    bpy.data.objects[backdrop].data.materials[0] = bpy.data.materials["Backdrop White"]

    bpy.data.objects[eyes].hide_viewport = True
    bpy.data.objects[eyes].hide_render = True
    bpy.data.objects[eyes].is_holdout = False
    bpy.data.objects[eyes].is_shadow_catcher = False

    # Store the original material
    original_mat = bpy.data.objects[silicon].data.materials[0].name

    for skin in skins:
        # Get material name
        material_name = "Skin " + skin
        
        # Set material!
        bpy.data.objects[silicon].data.materials[0] = bpy.data.materials[material_name]
        
        # Set output path THIS MIGHT NOT WORK
        output_path = "%s/%s/Skins/%s ####.png" % (output_path, scene_name, material_name)
        bpy.context.scene.render.filepath = output_path
        
        # Render!
        bpy.ops.render.render(animation = True)
    
    # Set the material back to the original one
    bpy.data.objects[silicon].data.materials[0] = bpy.data.materials[original_mat]



# For every scene (0 ~ Wave 1 ~ Idle 2 ~ Strut Walk 3 ~ GM)
for scene_num in range(4):

    # Get the scene and scene frame range to switch to
    scene_name = scenes[scene_num]
    scene_length = scenes_length[scene_num]

    # Switch to correct scene
    sceneSwitch(scene_name, scenes, scene_length, collections)

    # Render all the assets scripts
    skinRender()