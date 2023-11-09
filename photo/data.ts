import type { Component } from 'vue'

export const photoItems = Array.from(Object.entries(import.meta.glob('./*.jpg', { eager: true })))
  .map(([path, photo]: any) => ({
    date: path.slice(2, -3) as string,
    photo: photo.default as string,
  }))
  .sort((a, b) => b.date.localeCompare(a.date))
