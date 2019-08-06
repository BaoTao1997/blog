module.exports = {
  title: 'BaoTao的前端日志',
  description: '欢迎访问我的前端日志',
  markdown: {
    lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/hero.png' }]
  ],
  themeConfig: {
    repo: "https://github.com/BaoTao1997",
    nav: [
      {
        text: "博客",
        link: "/blog/"
      },
      {
        text: "面试题",
        link: "/interview/"
      },
      {
        text: "阅读",
        link: "/book/"
      },
      {
        text: "项目",
        link: "/project/"
      },
      {
        text: "简历",
        link: "/resume/"
      }
    ],
    sidebarDepth: 4,
    sidebar: {
      '/blog/': [
        {
          title: '前端工程化',
          collapsable: false,
          children: [
            'engineering-optimize'
          ]
        },
        {
          title: 'Framework',
          collapsable: false,
          children: [
            "framework-mvvm",
            "framework-vue_curd"
          ]
        },
        {
          title: '网络协议',
          collapsable: false,
          children: [
            'osi-tcp',
            'osi-status_code',
            'osi-http_header',
            'osi-safety'
          ]
        },
        {
          title: '数据结构与算法',
          collapsable: false,
          children: [
            'data-structure-sort',
            'data-structure-binarytree'
          ]
        },
        {
          title: 'CSS',
          collapsable: false,
          children: [
            'css-repaint',
            'css-self-adaption'
          ]
        },
        {
          title: 'JS',
          collapsable: false,
          children: [
            'js-regex',
            'js-prototype',
            'js-promise',
            'js-eventloop'
          ]
        },
        {
          title: '运维与多人协作',
          collapsable: false,
          children: [
            'operation-git',
            'operation-blog'
          ]
        },
      ],
      '/interview/': [
        {
          title: '前端基础知识',
          collapsable: false,
          children: [
            "html",
            "css",
            "js",
            "node",
            "webpack",
            "vue",
            "react"
          ]
        },
        {
          title: '算法与网络',
          collapsable: false,
          children: [
            "network",
            "algorithm"
          ]
        },
      ],
      '/project/': [
        {
          title: '组件库',
          collapsable: false,
          children: [
            "component-colorPick",
            "component-datePick"
          ]
        },
        {
          title: '项目',
          collapsable: false,
          children: [
            "project-vrsystem"
          ]
        },
      ],
      '/resume/': [

      ],
    },
    serviceWorker: true,
    lastUpdated: "更新时间",
    docsDir: "docs",
    editLinks: true,
    editLinkText: "帮助我完善这篇内容🙏",
  }
};
