export interface Photo {
  file_name: string
  file_path: string
  date_time: string
  gps: [number, number]
  f_number: number
  make: string
  focal_length_in_35mm_film: number
}

export interface GroupedPhotos {
  [key: string]: Photo[]
}

export interface MapInstance {
  map: any
  AMap: any
}
