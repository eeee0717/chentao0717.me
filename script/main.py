import os
from typing import Optional
from exif import Image
import json


class Photos:
    file_name: Optional[str]
    file_path: Optional[str]
    date_time: Optional[str]
    gps_longitude: Optional[float]
    gps_latitude: Optional[float]
    f_number: Optional[float]
    make: Optional[str]
    focal_length_in_35mm_film: Optional[float]

    def __init__(
        self,
        file_name=None,
        file_path=None,
        date_time=None,
        gps_longitude=None,
        gps_latitude=None,
        f_number=None,
        make=None,
        focal_length_in_35mm_film=None,
    ):
        self.file_name = file_name
        self.file_path = file_path
        self.date_time = date_time
        self.gps_longitude = gps_longitude
        self.gps_latitude = gps_latitude
        self.f_number = f_number
        self.make = make
        self.focal_length_in_35mm_film = focal_length_in_35mm_film


if __name__ == "__main__":
    photos = []
    for filename in os.listdir("."):
        if filename.lower().endswith(".jpg"):
            file_path = os.path.abspath(filename)
            with open(filename, "rb") as image_file:
                my_image = Image(image_file)
                photo = Photos(
                    file_name=filename,
                    file_path=file_path,
                    date_time=my_image.get("datetime"),
                    gps_longitude=my_image.get("gps_longitude"),
                    gps_latitude=my_image.get("gps_latitude"),
                    f_number=my_image.get("f_number"),
                    make=my_image.get("make"),
                    focal_length_in_35mm_film=my_image.get("focal_length_in_35mm_film"),
                )
                photos.append(photo)
            # Convert photo objects to dictionary
    photo_data = []
    for photo in photos:
        photo_dict = {
            "file_name": photo.file_name,
            "file_path": photo.file_path,
            "date_time": photo.date_time,
            "gps_longitude": photo.gps_longitude,
            "gps_latitude": photo.gps_latitude,
            "f_number": photo.f_number,
            "make": photo.make,
            "focal_length_in_35mm_film": photo.focal_length_in_35mm_film,
        }
        photo_data.append(photo_dict)

    # Save to JSON file
    with open("photo.json", "w") as f:
        json.dump(photo_data, f, indent=4)
