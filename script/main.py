import os
from typing import Optional
from exif import Image
import json
from datetime import datetime


class Photos:
    file_name: Optional[str]
    file_path: Optional[str]
    date_time: Optional[str]
    gps_longitude: Optional[list]
    gps_latitude: Optional[list]
    gps: Optional[list]
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

    def combine_gps(self):
        if self.gps_longitude and self.gps_latitude is not None:
            self.gps = [
                round(
                    self.gps_longitude[0]
                    + self.gps_longitude[1] / 60
                    + self.gps_longitude[2] / 3600,
                    5,
                ),
                round(
                    self.gps_latitude[0]
                    + self.gps_latitude[1] / 60
                    + self.gps_latitude[2] / 3600,
                    5,
                ),
            ]


if __name__ == "__main__":
    photos = []
    file_path = os.path.join("..", "public", "photos")
    for filename in os.listdir(file_path):
        if filename.lower().endswith(".jpg"):
            full_path = os.path.join(file_path, filename)
            try:
                with open(full_path, "rb") as image_file:
                    my_image = Image(image_file)
                    photo = Photos(
                        file_name=filename,
                        file_path=os.path.join("photos", filename),
                        date_time=my_image.get("datetime"),
                        gps_longitude=my_image.get("gps_longitude"),
                        gps_latitude=my_image.get("gps_latitude"),
                        f_number=my_image.get("f_number"),
                        make=my_image.get("make"),
                        focal_length_in_35mm_film=my_image.get(
                            "focal_length_in_35mm_film"
                        ),
                    )
                    # 尝试重命名文件
                    if photo.date_time:
                        try:
                            # 解析日期时间
                            date_obj = datetime.strptime(
                                photo.date_time, "%Y:%m:%d %H:%M:%S"
                            )
                            # 生成新文件名
                            new_filename = date_obj.strftime("%Y%m%d_%H%M%S") + ".jpg"
                            new_full_path = os.path.join(file_path, new_filename)

                            # 如果目标文件名已存在，添加序号
                            base_name = date_obj.strftime("%Y%m%d_%H%M%S")
                            counter = 1
                            while os.path.exists(new_full_path):
                                new_filename = f"{base_name}_{counter}.jpg"
                                new_full_path = os.path.join(file_path, new_filename)
                                counter += 1

                            # 重命名文件
                            os.rename(full_path, new_full_path)
                            # 更新照片对象中的文件信息
                            photo.file_name = new_filename
                            photo.file_path = os.path.join("photos", new_filename)
                        except (ValueError, OSError) as e:
                            print(f"重命名文件 {filename} 时出错: {str(e)}")

                    photos.append(photo)
            except Exception as e:
                print(f"处理图片 {filename} 时出错: {str(e)}")
                # 添加一个没有EXIF数据的基本照片对象
                photo = Photos(
                    file_name=filename, file_path=os.path.join("photos", filename)
                )
                photos.append(photo)
            # Convert photo objects to dictionary
    photo_data = []
    for photo in photos:
        photo.combine_gps()
        photo_dict = {
            "file_name": photo.file_name,
            "file_path": photo.file_path,
            "date_time": photo.date_time,
            "gps": photo.gps,
            "f_number": photo.f_number,
            "make": photo.make,
            "focal_length_in_35mm_film": photo.focal_length_in_35mm_film,
        }
        photo_data.append(photo_dict)
    print(f"number:{len(photo_data)}")
    # Save to JSON file
    with open("photo.json", "w") as f:
        json.dump(photo_data, f, indent=4)
