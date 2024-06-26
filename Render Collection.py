#----- Scene Switching -----
import bpy, os
from pathlib import Path

# Scene to use: 0 ~ Wave 1 ~ Idle 2 ~ Strut Walk 3 ~ GM
# scene_num = 2

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

outerwear_materials = ["Bomber Jacket Black", "Bomber Jacket Tan", "Bowler Black", "Bowler Crochet", "Bowler Eggshell", "Burnout Black", "Burnout Carbon", "Burnout Purple", "Burnout Red", "Burnout White", "Button Down Black", "Button Down Blue", "Button Down White", "CAW Hoodie Black", "CAW Hoodie Purple", "CAW Hoodie White", "Cardigan Black", "Cardigan Ice", "Cardigan Purple", "Denim Jacket Black", "Denim Jacket Blue", "Denim Jacket Chess", "Denim Jacket Salt Pan", "Flannel Barney", "Flannel Blue", "Flannel Tweed", "Fur Coat Ice", "Fur Coat Pistachio", "Fur Coat Purple", "Hoodie Black", "Hoodie Ice", "Hoodie Purple", "Hoodie White", "NY Sweater Black", "NY Sweater White", "Oversized T-Shirt Black", "Oversized T-Shirt Eggshell", "Oversized T-Shirt Grey", "Oversized T-Shirt Ice", "Oversized T-Shirt Purple", "Oversized T-Shirt White", "Prep Black", "Prep Eggshell", "Prep Ice Blue", "Prep Purple", "Prep Rose", "Puffer Vest Black", "Puffer Vest Ice", "Puffer Vest Purple", "Puffer Vest Purple Camo", "Puffer Vest Wool", "Puffer Ice Fur", "Puffer Black", "Puffer Gold", "Puffer Purple", "Puffer Wool", "Puffer Purple Camo", "Rugby Jersey Black", "Rugby Jersey Blue", "Rugby Jersey Pink", "Silicons FC - Alternate", "Silicons FC - Away", "Silicons FC - Home", "Sweater Black", "Sweater Duo", "Sweater Eggshell", "Sweater Ice", "Sweater Purple", "Sweater Purple Camo", "T-Shirt Crystal Ball", "T-Shirt Essential", "T-Shirt Flow", "T-Shirt GM", "T-Shirt Toly", "Two-Tone Black", "Two-Tone Blue", "Two-Tone Purple", "Two-Tone Rose", "V-Neck Black", "V-Neck Pistachio", "V-Neck White", "Varsity Jacket Black", "Varsity Jacket Tan", "Vest Blue", "Vest Purple", "Vest White"]

bottoms_items = ["Cargos", "Cargo Shorts", "Combat Shorts", "Front Pleats", "Joggers", "Jeans", "Skydivers", "Trousers"]

bottoms_materials = ["Cargos Black", "Cargos Eggshell", "Cargos Camo", "Cargo Shorts Black", "Cargo Shorts Eggshell", "Cargo Shorts Camo", "Combat Shorts Eggshell", "Combat Shorts Black", "Combat Shorts Camo", "Front Pleats Eggshell", "Front Pleats Black", "Front Pleats Camo", "Joggers Black", "Joggers Eggshell", "Jeans Black", "Jeans Blue", "Jeans Grey", "Jeans Salt Pan", "Jeans Monogram", "Jeans Houndstooth", "Jeans Blue Ripped", "Jeans Black Ripped", "Skydivers Black", "Skydivers Camo", "Skydivers Charcoal", "Skydivers Eggshell", "Trousers Black", "Trousers Brown", "Trousers Eggshell"]

shoes_items = ["2099s", "2288s", "Space Runners", "CAWs", "Skywalkers"]

shoes_materials = ["2099s Black", "2099s White", "2099s Carbon", "2099s Silver", "2099s Liquid", "2288s Black", "2288s Carbon", "2288s Silver", "2288s White", "Space Runners Black", "Space Runners Silver", "Space Runners White", "CAWs Black", "CAWs White", "CAWs Chrome", "Skywalkers Black", "Skywalkers White"]

# Backdrop materials
backdrop_materials = ["Aqua", "Blue", "Clouds", "Cream", "Green", "Orange", "Pink", "Purple", "Yellow"]

extra_objects = ["Cup GM"]

# Recursively hide objects
def recursivelyHide(obj, hide):
    # Hide the object
    obj.hide_render = hide
    obj.hide_viewport = hide
    # Iterate over all child objects of the current object
    for child in obj.children:
        # Recursively call the function for each child
        recursivelyHide(child, hide)

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
    for scene in scenes:
        object = bpy.data.objects["Silicon Rig " + scene]
        # Show objects from this scene
        if scene == switch_to_scene:
            recursivelyHide(object, False)
        # Hide all other scene objects
        else:
            recursivelyHide(object, True)

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

    print("⋇⋆✦⋆⋇ Switched to %s scene ⋇⋆✦⋆⋇" %(scenes[scene_num]))

# Render Backdrops
def backdropRender(scene, output, overwrite):
    object = bpy.data.objects["Silicon Rig " + scene]
    for scene in scenes:
        # Hide all other scene objects
        recursivelyHide(object, True)
    
    # Get the backdrop object
    backdrop = bpy.data.objects["Backdrop"]

    backdrop.hide_render = False
    backdrop.is_holdout = False
    backdrop.is_shadow_catcher = False

    for material in backdrop_materials:
        material_name = "Backdrop " + material
        backdrop.data.materials[0] = bpy.data.materials[material_name]

        # Set current frame to 1
        bpy.context.scene.frame_current = 1

        # Fix output path to only the current frame
        output_path = os.path.join(output, scene, "Backdrop", material)
        bpy.context.scene.render.filepath = output_path

        # Render single frame
        bpy.context.scene.render.use_overwrite = overwrite
        bpy.ops.render.render(animation = False, write_still = True)
    
# Render functions
def skinRender(skins_materials, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = "Silicon Skin " + scene_name
    eyes_obj = "Silicon Eyes " + scene_name
    backdrop_obj = "Backdrop"
    
    # Setup the scene properly
    bpy.data.objects[silicon_obj].hide_render = False
    bpy.data.objects[silicon_obj].is_holdout = False
    bpy.data.objects[silicon_obj].is_shadow_catcher = False

    bpy.data.objects[backdrop_obj].hide_render = False
    bpy.data.objects[backdrop_obj].is_holdout = True
    bpy.data.objects[backdrop_obj].is_shadow_catcher = False
    bpy.data.objects[backdrop_obj].data.materials[0] = bpy.data.materials["Backdrop White"]

    bpy.data.objects[eyes_obj].hide_render = True
    bpy.data.objects[eyes_obj].is_holdout = False
    bpy.data.objects[eyes_obj].is_shadow_catcher = False

    # Store the original material
    original_mat = bpy.data.objects[silicon_obj].data.materials[0].name

    for skin_name in skins_materials:
        # Get material name
        material_name = "Skin " + skin_name
        
        # Set material!
        bpy.data.objects[silicon_obj].data.materials[0] = bpy.data.materials[material_name]
        
        # Set output path THIS MIGHT NOT WORK
        output_path = "%s/%s/Skins/%s ####" % (output, scene_name, skin_name)
        bpy.context.scene.render.filepath = output_path
        
        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)
    
    # Set the material back to the original one
    bpy.data.objects[silicon_obj].data.materials[0] = bpy.data.materials[original_mat]

def eyesRender(eyes_materials, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = "Silicon Skin " + scene_name
    eyes_obj = "Silicon Eyes " + scene_name
    backdrop_obj = "Backdrop"
    
    # Setup the scene properly
    bpy.data.objects[backdrop_obj].hide_render = False
    bpy.data.objects[backdrop_obj].is_holdout = True
    bpy.data.objects[backdrop_obj].is_shadow_catcher = False
    bpy.data.objects[backdrop_obj].data.materials[0] = bpy.data.materials["Backdrop White"]

    bpy.data.objects[silicon_obj].hide_render = False
    bpy.data.objects[silicon_obj].is_holdout = True
    bpy.data.objects[silicon_obj].is_shadow_catcher = False

    bpy.data.objects[eyes_obj].hide_render = False
    bpy.data.objects[eyes_obj].is_holdout = False
    bpy.data.objects[eyes_obj].is_shadow_catcher = False

    # Enable compositor
    bpy.context.scene.use_nodes = True

    # Store the original material
    original_mat = bpy.data.objects[eyes_obj].data.materials[0].name

    for eyes_name in eyes_materials:
        # Get material name
        material_name = "Eyes " + eyes_name
        
        # Set material!
        bpy.data.objects[eyes_obj].data.materials[0] = bpy.data.materials[material_name]
        
        # Set output path THIS MIGHT NOT WORK
        output_path = "%s/%s/Eyes/%s ####" % (output, scene_name, eyes_name)
        bpy.context.scene.render.filepath = output_path
        
        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)
    
    # Set the material back to the original one
    bpy.data.objects[eyes_obj].data.materials[0] = bpy.data.materials[original_mat]

    # Disable compositor
    bpy.context.scene.use_nodes = False

def headwearRender(headwear_items, headwear_materials, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = bpy.data.objects["Silicon Skin " + scene_name]
    eyes_obj = bpy.data.objects["Silicon Eyes " + scene_name]
    backdrop_obj = bpy.data.objects["Backdrop"]
    
    # Setup the scene properly
    silicon_obj.hide_render = False
    silicon_obj.is_holdout = False
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    eyes_obj.hide_render = False
    eyes_obj.is_holdout = True
    eyes_obj.is_shadow_catcher = False
    backdrop_obj.data.materials[0] = bpy.data.materials["Eyes White"]

    backdrop_obj.hide_render = False
    backdrop_obj.is_holdout = True
    backdrop_obj.is_shadow_catcher = False
    backdrop_obj.data.materials[0] = bpy.data.materials["Backdrop White"]

    # Start the material index
    material_index = 0

    # Get the first material name
    material_name = headwear_materials[material_index]

    # Headwear render
    for headwear_name in headwear_items:
        # Get the actual object
        headwear_obj = bpy.data.objects[headwear_name]

        # Setup the render item
        headwear_obj.hide_render = False

        # Store the original material
        original_mat = headwear_obj.data.materials[0].name

        # Render all the item / material combinations
        while headwear_name in material_name:
            # Set material!
            headwear_obj.data.materials[0] = bpy.data.materials[material_name]
            
            # Set output path THIS MIGHT NOT WORK
            output_path = "%s/%s/Headwear/%s ####" % (output, scene_name, material_name)
            bpy.context.scene.render.filepath = output_path
            
            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)

            # Set material index to +1
            material_index = material_index + 1

            if material_index < len(headwear_materials):
                # Get the material name
                material_name = headwear_materials[material_index]     
            else:
                break

        
        # Set the material back to the original one
        headwear_obj.data.materials[0] = bpy.data.materials[original_mat]

        # Hide the item
        headwear_obj.hide_render = True

    # Comp mask setup
    silicon_obj.is_holdout = True
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]
    
    # Render headwear comp masks
    for headwear_name in headwear_items:
        # Get the actual object
        headwear_obj = bpy.data.objects[headwear_name]

        # Balaclava has a different material for the comp mask
        comp_mask_mat = "Comp Mask" if headwear_name != "Balaclava" else "Balaclava Comp Mask"

        # Set the item to render
        headwear_obj.hide_render = False

        # Store the original material
        original_mat = headwear_obj.data.materials[0]

        # Set the comp mask material
        headwear_obj.data.materials[0] = bpy.data.materials[comp_mask_mat]

        # Set output path THIS MIGHT NOT WORK
        output_path = "%s/%s/Headwear Comp Mask/%s ####" % (output, scene_name, headwear_name + " Comp Mask")
        bpy.context.scene.render.filepath = output_path

        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)

        # Restore the original material
        headwear_obj.data.materials[0] = original_mat

        # Hide the item
        headwear_obj.hide_render = True

def outerwearRender(outerwear_items, outerwear_materials, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = bpy.data.objects["Silicon Skin " + scene_name]
    eyes_obj = bpy.data.objects["Silicon Eyes " + scene_name]
    backdrop_obj = bpy.data.objects["Backdrop"]
    # Mask object
    pants_mask = bpy.data.objects["Pants Convex Hull " + scene_name]
    
    # Setup the scene properly
    silicon_obj.hide_render = False
    silicon_obj.is_holdout = False
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    eyes_obj.hide_render = False
    eyes_obj.is_holdout = True
    eyes_obj.is_shadow_catcher = False
    eyes_obj.data.materials[0] = bpy.data.materials["Eyes White"]

    backdrop_obj.hide_render = False
    backdrop_obj.is_holdout = True
    backdrop_obj.is_shadow_catcher = False
    backdrop_obj.data.materials[0] = bpy.data.materials["Backdrop White"]

    # Start the material index
    material_index = 0

    # Get the first material name
    material_name = outerwear_materials[material_index]

    # Outerwear render
    for outerwear_name in outerwear_items:
        # Get the actual object
        outerwear_obj = bpy.data.objects[outerwear_name]

        # Setup the render item
        outerwear_obj.hide_render = False

        # Store the original material
        original_mat = outerwear_obj.data.materials[0].name

        # Render all the item / material combinations
        while outerwear_name in material_name:            
            # Set material!
            outerwear_obj.data.materials[0] = bpy.data.materials[material_name]

            # Material comes before the item's name except when Silicons FC
            output_name = material_name.removeprefix(outerwear_name + " ") + " " + outerwear_name if outerwear_name != "Silicons FC" else material_name

            # Check if material is Puffer Ice Fur
            is_fur_puffer = True if (material_name == "Puffer Ice Fur") else False

            # Set fur to render if the item is puffer ice fur
            if(is_fur_puffer):
                outerwear_obj.modifiers["ParticleSystem"].show_render = True
                is_fur_puffer = True
            
            # Set output path
            output_path = "%s/%s/Outerwear/%s ####" % (output, scene_name, output_name)
            bpy.context.scene.render.filepath = output_path
            
            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)

            # Turn off the fur
            if(is_fur_puffer):
                bpy.data.objects["Puffer"].modifiers["ParticleSystem"].show_render = False
                is_fur_puffer = False
            
            # Set material index to +1
            material_index = material_index + 1

            if material_index < len(outerwear_materials):
                # Get the material name
                material_name = outerwear_materials[material_index]
            else:
                break
        
        # Set the material back to the original one
        outerwear_obj.data.materials[0] = bpy.data.materials[original_mat]

        # Setup the render item
        outerwear_obj.hide_render = True

    # Comp mask setup
    silicon_obj.is_holdout = True
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    # Activate mask object
    pants_mask.hide_render = False
    
    # Render outerwear comp masks
    for outerwear_name in outerwear_items:
        # Get the actual object
        outerwear_obj = bpy.data.objects[outerwear_name]

        # Store the original material
        original_mat = outerwear_obj.data.materials[0]

        # Set the comp mask material
        outerwear_obj.data.materials[0] = bpy.data.materials["Comp Mask"]

        # Set the item to render
        outerwear_obj.hide_render = False

        # Set output path
        output_path = "%s/%s/Outerwear Comp Mask/%s ####" % (output, scene_name, outerwear_name + " Comp Mask")
        bpy.context.scene.render.filepath = output_path

        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)

        if outerwear_name == "Puffer":
            # Render Ice Fur Puffer
            # Set fur to render
            outerwear_obj.modifiers["ParticleSystem"].show_render = True

            # Set output path
            output_path = "%s/%s/Outerwear Comp Mask/%s ####" % (output, scene_name, outerwear_name + " Fur Comp Mask")
            bpy.context.scene.render.filepath = output_path
            
            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)

            # Disable fur from rendering
            outerwear_obj.modifiers["ParticleSystem"].show_render = True

            # Render wool puffer
            # Set the comp mask material
            outerwear_obj.data.materials[0] = bpy.data.materials["Comp Mask Puffer Wool"]

            # Set output path
            output_path = "%s/%s/Outerwear Comp Mask/%s ####" % (output, scene_name, outerwear_name + " Wool Comp Mask")
            bpy.context.scene.render.filepath = output_path

            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)

        if outerwear_name == "Puffer Vest":
            # Render wool puffer vest
            # Set the comp mask material
            outerwear_obj.data.materials[0] = bpy.data.materials["Comp Mask Puffer Vest Wool"]

            # Set output path
            output_path = "%s/%s/Outerwear Comp Mask/%s ####" % (output, scene_name, outerwear_name + " Wool Comp Mask")
            bpy.context.scene.render.filepath = output_path

            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)
        
        # Restore the original material
        outerwear_obj.data.materials[0] = original_mat

        # Hide the item
        outerwear_obj.hide_render = True

    # Deactivate mask object
    pants_mask.hide_render = True

def bottomsRender(bottoms_items, bottoms_materials, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = bpy.data.objects["Silicon Skin " + scene_name]
    eyes_obj = bpy.data.objects["Silicon Eyes " + scene_name]
    backdrop_obj = bpy.data.objects["Backdrop"]
    # Mask object
    shoes_L_mask = bpy.data.objects["Shoes Collision Box L"]
    shoes_R_mask = bpy.data.objects["Shoes Collision Box R"]
    
    # Setup the scene properly
    silicon_obj.hide_render = False
    silicon_obj.is_holdout = False
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    eyes_obj.hide_render = False
    eyes_obj.is_holdout = True
    eyes_obj.is_shadow_catcher = False
    eyes_obj.data.materials[0] = bpy.data.materials["Eyes White"]

    backdrop_obj.hide_render = False
    backdrop_obj.is_holdout = True
    backdrop_obj.is_shadow_catcher = False
    backdrop_obj.data.materials[0] = bpy.data.materials["Backdrop White"]

    # Start the material index
    material_index = 0

    # Get the first material name
    material_name = bottoms_materials[material_index]

    # bottoms render
    for bottoms_name in bottoms_items:
        # Get the actual object
        bottoms_obj = bpy.data.objects[bottoms_name]

        # Setup the render item
        bottoms_obj.hide_render = False

        # Store the original material
        original_mat = bottoms_obj.data.materials[0].name

        # Render all the item / material combinations
        while bottoms_name in material_name:
            
            # Set material!
            bottoms_obj.data.materials[0] = bpy.data.materials[material_name]

            # Material comes before the item's name except when Silicons FC
            output_name = material_name.removeprefix(bottoms_name + " ") + " " + bottoms_name
            
            # Set output path
            output_path = "%s/%s/Bottoms/%s ####" % (output, scene_name, output_name)
            bpy.context.scene.render.filepath = output_path
            
            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)

            # Set material index to +1
            material_index = material_index + 1

            if material_index < len(bottoms_materials):
                # Get the material name
                material_name = bottoms_materials[material_index]
            else:
                break
        
        # Set the material back to the original one
        bottoms_obj.data.materials[0] = bpy.data.materials[original_mat]

        # Setup the render item
        bottoms_obj.hide_render = True

    # Comp mask setup
    silicon_obj.is_holdout = True
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    # Activate mask object
    shoes_L_mask.hide_render = False
    shoes_R_mask.hide_render = False
    shoes_L_mask.data.materials[0] = bpy.data.materials["Skin Invisible"]
    shoes_R_mask.data.materials[0] = bpy.data.materials["Skin Invisible"]
    
    # Turn hands mask on
    silicon_obj.modifiers["Hands Mask"].show_render = True
    
    # Render bottoms comp masks
    for bottoms_name in bottoms_items:
        # Get the actual object
        bottoms_obj = bpy.data.objects[bottoms_name]

        # Store the original material
        original_mat = bottoms_obj.data.materials[0]

        # Set the comp mask material
        bottoms_obj.data.materials[0] = bpy.data.materials["Comp Mask"]

        # Set the item to render
        bottoms_obj.hide_render = False

        # Set output path
        output_path = "%s/%s/Bottoms Comp Mask/%s ####" % (output, scene_name, bottoms_name + " Comp Mask")
        bpy.context.scene.render.filepath = output_path

        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)
        
        # Restore the original material
        bottoms_obj.data.materials[0] = original_mat

        # Hide the item
        bottoms_obj.hide_render = True

    # Deactivate mask object
    shoes_L_mask.hide_render = True
    shoes_R_mask.hide_render = True

    # Turn hands mask off
    silicon_obj.modifiers["Hands Mask"].show_render = False

def shoesRender(shoes_items, shoes_materials, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = bpy.data.objects["Silicon Skin " + scene_name]
    eyes_obj = bpy.data.objects["Silicon Eyes " + scene_name]
    backdrop_obj = bpy.data.objects["Backdrop"]
    socks_obj = bpy.data.objects["Crew Socks"]

    samples = bpy.context.scene.cycles.samples
    bpy.context.scene.cycles.samples = 1024
    
    # Setup the scene properly
    silicon_obj.hide_render = False
    silicon_obj.is_holdout = False
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    eyes_obj.hide_render = True

    backdrop_obj.hide_render = False
    backdrop_obj.is_holdout = False
    backdrop_obj.is_shadow_catcher = True
    backdrop_obj.data.materials[0] = bpy.data.materials["Backdrop White"]

    # Start the material index
    material_index = 0

    # Get the first material name
    material_name = shoes_materials[material_index]

    # Turn mask on
    silicon_obj.modifiers["Shoes Mask"].show_render = True

    # Shoes render
    for shoes_name in shoes_items:
        # Get the actual object
        shoes_obj = bpy.data.objects[shoes_name]

        # Setup the render item
        shoes_obj.hide_render = False
        shoes_obj.is_holdout = False
        shoes_obj.is_shadow_catcher = False

        # Store the original material
        original_mat = shoes_obj.data.materials[0].name

        # Set socks to render
        if shoes_name in ["2099s", "CAWs"]:
            socks_obj.hide_render = False

        # Render all the item / material combinations
        while shoes_name in material_name:            
            # Set material!
            shoes_obj.data.materials[0] = bpy.data.materials[material_name]

            # Material comes before the item's name
            output_name = material_name.removeprefix(shoes_name + " ") + " " + shoes_name
            
            # Set output path
            output_path = "%s/%s/Shoes/%s ####" % (output, scene_name, output_name)
            bpy.context.scene.render.filepath = output_path
            
            # Render!
            renderTime(overwrite, singleFrame, startFrame, endFrame)

            # Set material index to +1
            material_index = material_index + 1
            
            if material_index < len(shoes_materials):
                # Get the material name
                material_name = shoes_materials[material_index]
            else:
                break
        
        # Set the material back to the original one
        shoes_obj.data.materials[0] = bpy.data.materials[original_mat]

        # Disable socks from rendering
        if shoes_name in ["2099s", "CAWs"]:
            socks_obj.hide_render = True

        # Setup the render item
        shoes_obj.hide_render = True

    # Comp mask setup
    silicon_obj.is_holdout = True
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    socks_obj.data.materials[0] = bpy.data.materials["Comp Mask"]
    
    # Render shoes comp masks
    for shoes_name in shoes_items:
        # Get the actual object
        shoes_obj = bpy.data.objects[shoes_name]

        # Store the original material
        original_mat = shoes_obj.data.materials[0]

        # Set socks to render
        if shoes_name in ["2099s", "CAWs"]:
            socks_obj.hide_render = False
        else:
            socks_obj.hide_render = True

        # Set the comp mask material
        shoes_obj.data.materials[0] = bpy.data.materials["Comp Mask"]

        # Set the item to render
        shoes_obj.hide_render = False

        # Set output path
        output_path = "%s/%s/Shoes Comp Mask/%s ####" % (output, scene_name, shoes_name + " Comp Mask")
        bpy.context.scene.render.filepath = output_path

        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)
        
        # Restore the original material
        shoes_obj.data.materials[0] = original_mat

        # Hide the item
        shoes_obj.hide_render = True

    # Turn mask off
    silicon_obj.modifiers["Shoes Mask"].show_render = False

    # Restore socks material
    socks_obj.data.materials[0] = bpy.data.materials["Crew Socks"]

    bpy.context.scene.cycles.samples = samples

def renderExtraObject(extra_objects, scene_name, output, overwrite = False, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end):
    # Important objects
    silicon_obj = bpy.data.objects["Silicon Skin " + scene_name]
    eyes_obj = bpy.data.objects["Silicon Eyes " + scene_name]
    backdrop_obj = bpy.data.objects["Backdrop"]
    
    # Setup the scene properly
    silicon_obj.hide_render = False
    silicon_obj.is_holdout = True
    silicon_obj.is_shadow_catcher = False
    silicon_obj.data.materials[0] = bpy.data.materials["Skin Invisible"]

    eyes_obj.hide_render = False
    eyes_obj.is_holdout = True
    eyes_obj.is_shadow_catcher = False

    backdrop_obj.hide_render = False
    backdrop_obj.is_holdout = True
    backdrop_obj.is_shadow_catcher = False
    backdrop_obj.data.materials[0] = bpy.data.materials["Backdrop White"]

    for object in extra_objects:
        bpy.data.objects[object].hide_render = False
        bpy.data.objects[object].is_holdout = False
        bpy.data.objects[object].is_shadow_catcher = False

        # Set output path
        output_path = "%s/%s/Extra Objects/%s ####" % (output, scene_name, object)
        bpy.context.scene.render.filepath = output_path

        # Render!
        renderTime(overwrite, singleFrame, startFrame, endFrame)
        
        # Hide the object
        bpy.data.objects[object].hide_render = True    

# This function is a mess, need to fix it
def renderTime(overwrite = True, singleFrame = False, startFrame = 1, endFrame = bpy.context.scene.frame_end, placeholders = True):
    # Get output path
    output_path = bpy.context.scene.render.filepath

    bpy.context.scene.render.use_placeholder = placeholders

    if overwrite:
        # Normal render
        if not singleFrame:
            bpy.context.scene.frame_start = startFrame
            bpy.context.scene.frame_end = endFrame
            bpy.ops.render.render(animation = True)
        else:
            # Set current frame to startFrame
            bpy.context.scene.frame_current = startFrame

            # Fix output path to only the current frame
            output_path = output_path.replace("####", "{:04d}".format(startFrame))
            bpy.context.scene.render.filepath = output_path

            # Render single frame
            bpy.ops.render.render(animation = False, write_still = True)
    else:
        if not singleFrame:
            bpy.context.scene.frame_start = startFrame
            bpy.context.scene.frame_end = endFrame
            bpy.context.scene.render.use_overwrite = False
            bpy.ops.render.render(animation = True)
        else:
            output_path = output_path.replace("####", "{:04d}".format(startFrame) + format)
            output_path = bpy.path.abspath(output_path)
            output_path = os.path.normpath(output_path)
            print(output_path)
            if Path(output_path).is_file():
                print("%s exists! Skipping..." %(output_path))
            else:
                # Set current frame to startFrame
                bpy.context.scene.frame_current = startFrame

                # Fix output path to only the current frame
                output_path = output_path.replace("####", "{:04d}".format(startFrame))
                bpy.context.scene.render.filepath = output_path

                # Render single frame
                bpy.ops.render.render(animation = False, write_still = True)

def disableItems(headwear_items, outerwear_items, bottoms_items, shoes_items, extra_objects):
    all_items = headwear_items + outerwear_items + bottoms_items + shoes_items + extra_objects
    for object in all_items:
        bpy.data.objects[object].hide_render = True

def renderScenes(singleScene = False, startRange = 0, endRange = 4):
    # Get the range
    renderRange = range(startRange, endRange)

    # Get the range
    if singleScene:
        renderRange = [startRange]

    # For every scene (0 ~ Wave 1 ~ Idle 2 ~ Strut Walk 3 ~ GM)
    for scene_num in renderRange:

        print("Scene number: " + str(scene_num))

        # Get the scene and scene frame range to switch to
        scene_name = scenes[scene_num]
        scene_length = scenes_length[scene_num]

        # Switch to correct scene
        sceneSwitch(scene_name, scenes, scene_length, collections, scene_num)

        backdropRender(scene_name, output_path, overwrite)

        # Hide cup if scene is GM
        if scene_name == "GM":
            renderExtraObject(extra_objects, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)

        # Render all the assets scripts
        skinRender(skins_materials, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)
        eyesRender(eyes_materials, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)
        headwearRender(headwear_items, headwear_materials, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)
        outerwearRender(outerwear_items, outerwear_materials, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)
        bottomsRender(bottoms_items, bottoms_materials, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)
        shoesRender(shoes_items, shoes_materials, scene_name, output_path, overwrite, renderSingleFrame, startFrame, scene_length)

# Disable all items from rendering
disableItems(headwear_items, outerwear_items, bottoms_items, shoes_items, extra_objects)

''' ⋇⋆✦⋆⋇ RENDER SETTINGS ⋇⋆✦⋆⋇ '''
# Specify output folder!
output_path = "//./silicons_render"

# Specify format!
format = ".png"
bpy.context.scene.render.image_settings.file_format = 'PNG'
bpy.context.scene.render.image_settings.color_mode = 'RGBA'
bpy.context.scene.render.image_settings.color_depth = '16'

bpy.context.scene.cycles.use_adaptive_sampling = True
bpy.context.scene.cycles.adaptive_threshold = 0.01
bpy.context.scene.cycles.samples = 256
bpy.context.scene.cycles.time_limit = 0

# Render single frame?
renderSingleFrame = False

# Where to start rendering - if render single frame this is the frame that will be rendered
startFrame = 1

# Render with overwriting?
overwrite = False

'''IMPORTANT: 
If you want to render all the scenes set:
renderSingleScene = False
startScene = 0
If you want to render a specific scene:
renderSingleScene = True
startScene = ~number of scene you want to render~
'''

# Render single scene? (0 Wave ~ 1 Idle ~ 2 Strut Walk ~ 3 GM)
renderSingleScene = False

# Start scene
startScene = 0

# Render the scenes!
renderScenes(renderSingleScene, startScene)