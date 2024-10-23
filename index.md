---
layout: page
sidebar: false
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/68428618',
    name: 'YIMING LI',
    org: 'City University of Hong Kong',
    title: 'MSDS',
    links: [
      { icon: 'github', link: 'https://github.com/Mingg817' },
      {
        icon: {
          svg: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12.713l-11.99-7.06v14.12h23.98v-14.12l-11.99 7.06zm0-1.427l11.99-7.06h-23.98l11.99 7.06zm-12 10.52h24v-16.973l-12 7.07-12-7.07v16.973z"/>
          </svg>`,
        },
        link: 'mailto:yli2467-c@my.cityu.edu.hk',
      },
    ],
    
  },

]
</script>

<VPTeamPage>
  <VPTeamMembers
    :members="members"
  />
  <VPTeamPageTitle>
    <template #lead>
      My learning Notes or some tech Blogs. <br> 👨‍💻👨‍💻👨‍💻
    </template>
  </VPTeamPageTitle>

</VPTeamPage>
