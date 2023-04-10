import os
import sqlite3

conn = sqlite3.connect('db.sqlite3')

image_filenames = os.listdir('media/post_images')

c = conn.cursor()
c.execute('SELECT image FROM api_post')

db_image_filenames = [row[0].split('/')[-1] for row in c.fetchall()]

for filename in image_filenames:
    if filename not in db_image_filenames:
        os.remove(os.path.join('media/post_images', filename))
        print(f'Removed {filename}')

conn.close()
