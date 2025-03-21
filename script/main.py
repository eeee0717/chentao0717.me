import os
from typing import Optional
from exif import Image
import json
from datetime import datetime
from PIL import Image as Im
import pandas as pd


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


def get_gps_from_csv(current_dir, date_obj):
    csv_filename = date_obj.strftime("%Y-%m-%d-0000 0000.csv")
    csv_path = os.path.join(current_dir, csv_filename)
    gps_longitude = None
    gps_latitude = None
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        # 将date_time转化成时间戳，和csv中的时间戳进行比较，选取最接近的时间戳，并获取经纬度
        # df中的dataTime列为csv中的时间戳
        date_timestamp = date_obj.timestamp()
        df["diff"] = abs(df["dataTime"] - date_timestamp)
        df = df.sort_values(by="diff")
        select_row = df.head(1)
        if not select_row.empty:
            # Assuming CSV has longitude and latitude columns
            gps_longitude = [select_row["longitude"].iloc[0], 0, 0]
            gps_latitude = [select_row["latitude"].iloc[0], 0, 0]

    return gps_longitude, gps_latitude


def reset_photo_directory(source_dir: str, target_dir: str):
    """
    重置照片目录：删除目标目录下所有文件，并从源目录复制文件
    :param source_dir: 源目录路径（basic_photos）
    :param target_dir: 目标目录路径（photos）
    """
    # 确保目标目录存在
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)

    # 删除目标目录中的所有文件
    for filename in os.listdir(target_dir):
        file_path = os.path.join(target_dir, filename)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
                print(f"已删除: {filename}")
        except Exception as e:
            print(f"删除文件 {filename} 时出错: {e}")

    # 从源目录复制文件到目标目录
    for filename in os.listdir(source_dir):
        if filename.lower().endswith(".jpg"):
            source_path = os.path.join(source_dir, filename)
            target_path = os.path.join(target_dir, filename)
            try:
                with open(source_path, "rb") as src, open(target_path, "wb") as dst:
                    dst.write(src.read())
                print(f"已复制: {filename}")
            except Exception as e:
                print(f"复制文件 {filename} 时出错: {e}")


if __name__ == "__main__":
    photos = []
    basic_file_path = os.path.join("..", "public", "basic_photos")
    file_path = os.path.join("..", "public", "photos")
    reset_photo_directory(basic_file_path, file_path)

    for filename in os.listdir(file_path):
        if filename.lower().endswith(".jpg"):
            full_path = os.path.join(file_path, filename)
            try:
                with open(full_path, "rb") as image_file:
                    my_image = Image(image_file)
                    photo = Photos(
                        file_name=filename,
                        file_path=os.path.join("photos", filename),
                        date_time=my_image.get("datetime_original"),
                        gps_longitude=my_image.get("gps_longitude"),
                        gps_latitude=my_image.get("gps_latitude"),
                        f_number=my_image.get("f_number"),
                        make=my_image.get("make"),
                        focal_length_in_35mm_film=my_image.get(
                            "focal_length_in_35mm_film"
                        ),
                    )
                    # 尝试重命名文件
                    if photo.date_time is None:
                        photo.date_time = datetime.now().strftime("%Y:%m:%d %H:%M:%S")
                    date_obj = datetime.strptime(photo.date_time, "%Y:%m:%d %H:%M:%S")
                    if (photo.gps_latitude and photo.gps_longitude) is None:
                        try:
                            gps_longitude, gps_latitude = get_gps_from_csv(
                                basic_file_path, date_obj
                            )
                            photo.gps_latitude = gps_latitude
                            photo.gps_longitude = gps_longitude
                        except (ValueError, OSError) as e:
                            print(f"获取经纬度{filename} 时出错: {str(e)}")
                    try:
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
                        print(new_full_path)
                        # 更新照片对象中的文件信息
                        photo.file_name = new_filename
                        photo.file_path = os.path.join("/photos", new_filename)
                        im = Im.open(new_full_path)
                        im.save(new_full_path, quality=80)
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
