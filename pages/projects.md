---
title: Projects - Chen Tao
display: Projects
description: List of projects that I am proud of
wrapperClass: 'text-center'
art: connections
projects:
  Current Focus:
    - name: 'Cherry-Studio'
      link: 'https://github.com/CherryHQ/cherry-studio'
      desc: '🍒 Cherry Studio is a desktop client '
      icon: 🍒
    - name: 'Cherry-Studio App'
      link: 'https://github.com/CherryHQ/cherry-studio-app'
      desc: '🍒 Cherry Studio is a app client '
      icon: 🍒

  WPF:
    - name: 'Bosom Friends of IoT'
      link: 'https://www.bilibili.com/video/BV1iz4y1E7sC/?vd_source=e69adc4cbcbf14d298fc66f0ae53c5c8'
      desc: 'A Smart IoT System based in ChatGPT'
      icon: 'i-carbon-iot-platform'
    - name: 'Nuclear Pipeline Inspection System'
      link: '/posts/Projects/nuclear'
      desc: 'Visual Pipeline Parameters'
      icon: 'i-ion-ios-nuclear'
    - name: 'Medical Label Print System'
      link: '/posts/Projects/medical'
      desc: 'Format Label Print in Medical'
      icon: 'i-carbon-reminder-medical'
    - name: 'Precision Lathe Control System'
      link: '/posts/Projects/lathe-control'
      desc: 'Precision Control of Lathe Movement'
      icon: 'i-carbon-ibm-z-cloud-mod-stack'

  Avalonia:
    - name: 'Subtitle Translator'
      link: 'https://github.com/eeee0717/SubtitleTranslator'
      desc: 'A Tool to translate subtitle files'
      icon: 'i-carbon-translate'

  Rust:
    - name : 'Subtitle Translator Cli'
      link: 'https://github.com/eeee0717/subtitle-translator-cli'
      desc: 'A Command Line Tool to translate subtitle files'
      icon: 'i-carbon-translate'
    - name: 'Podwise AI'
      link: 'https://github.com/eeee0717/podwise-ai'
      desc: 'A platform to summarize podcast episodes'
      icon: 'i-carbon-microphone'

  Productivity:
    - name: 'Workspace'
      link: https://github.com/eeee0717/raycast-workspace
      desc: A Raycast extension that helps you to manage your workspace
      icon: 'i-carbon-workspace'
    - name: 'Toolkits'
      link: 'https://github.com/eeee0717/Toolkits'
      desc: 'A collection of useful tools for daily use'
      icon: 'i-carbon-campsite'

  Contributor:
    - name: 'LeetCode Master'
      link: 'https://github.com/youngyangyang04/leetcode-master'
      desc: 'LeetCode刷题指南，C#版贡献者'
      icon: 'i-simple-icons-leetcode'
    - name: 'CS Base'
      link: 'https://github.com/xiaolincoder/CS-Base'
      desc: '计算机基础知识'
      icon: 'i-carbon-ibm-cloud-sysdig-secure'

---

<!-- @layout-full-width -->

<ListProjects :projects="frontmatter.projects" />
