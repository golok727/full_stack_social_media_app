import os
import sqlite3

conn = sqlite3.connect('db.sqlite3')

# image_filenames = os.listdir('media/post_images')
image_filenames = os.listdir('media/profile_images')

c = conn.cursor()
# c.execute('SELECT image FROM api_post')
c.execute('SELECT profile_image FROM api_userprofile')

db_image_filenames = [row[0].split('/')[-1] for row in c.fetchall()]

for filename in image_filenames:
    if filename not in db_image_filenames:
        # Remove post images
        # os.remove(os.path.join('media/post_images', filename))
        # print(f'Removed {filename}')

        # remove profile images
        os.remove(os.path.join('media/profile_images', filename))
        print(f'Removed {filename}')

        print(f'{filename}')

conn.close()
