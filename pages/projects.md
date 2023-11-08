---
title: Projects - Chen Tao
display: Projects
description: List of projects that I am proud of
plum: true
wrapperClass: 'text-center'
projects:
  WPF:
    - name: 'Bosom Friends Of IoT'
      link: 'https://www.bilibili.com/video/BV1iz4y1E7sC/?vd_source=e69adc4cbcbf14d298fc66f0ae53c5c8'
      desc: 'A Smart IoT System based in ChatGPT'
      icon: 'i-carbon-iot-platform'
    - name: 'Nuclear Pipeline Inspection System'
      link: '/posts/nuclear'
      desc: 'Visual Pipeline Parameters'
      icon: 'i-ion-ios-nuclear'
    - name: 'Medical Label Print System'
      link: '/posts/medical'
      desc: 'Format Label Print in Medical'
      icon: 'i-carbon-reminder-medical'
    - name: 'Precision Lathe Control System'
      link: '/posts/lathe-control'
      desc: 'Precision Control of Lathe Movement'
      icon: 'i-carbon-ibm-z-cloud-mod-stack'
---



<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />

