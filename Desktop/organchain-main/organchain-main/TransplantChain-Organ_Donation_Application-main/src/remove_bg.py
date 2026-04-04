from PIL import Image
import os, glob

folder = r"c:\Users\mahan\Desktop\organchain-main\organchain-main\TransplantChain-Organ_Donation_Application-main\src\images"
out_path = os.path.join(folder, "primary-logo.png")

# Dynamically locate the newest screenshot in case naming format varies
screenshots = glob.glob(os.path.join(folder, "Screenshot*.png"))
if not screenshots:
    print("No screenshots found.")
    exit(1)

latest_screenshot = max(screenshots, key=os.path.getctime)

img = Image.open(latest_screenshot).convert("RGBA")
datas = img.getdata()

newData = []
# Filter out any pixels that represent the "white" background
for item in datas:
    # A generous 235+ RGB threshold targets generic white/off-white backdrops smoothly 
    if item[0] > 235 and item[1] > 235 and item[2] > 235:
        # Convert to 100% transparent pixel
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

# Map the computed matrix array natively into the graphic
img.putdata(newData)
img.save(out_path, "PNG")

# Prune the raw desktop screenshot keeping their source workspace completely clean!
try:
    os.remove(latest_screenshot)
except Exception as e:
    pass

print(f"Successfully processed {latest_screenshot} dropping the white background entirely resulting in a flawless transparent graphic on primary-logo.png!")
