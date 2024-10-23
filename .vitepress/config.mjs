import { defineConfig } from 'vitepress'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 检查文件是否位于子模块中
function isSubmodule(file) {
  const submoduleConfig = path.join(__dirname, '../.gitmodules');

  console.log(`Checking if the file ${file} is in a submodule...`);

  if (fs.existsSync(submoduleConfig)) {
    console.log(`Found .gitmodules file at ${submoduleConfig}`);
    const configContent = fs.readFileSync(submoduleConfig, 'utf8');
    const isSub = configContent.includes(path.basename(path.dirname(file)));

    console.log(`Is ${file} in a submodule? ${isSub}`);
    return isSub;
  }

  console.log(`No .gitmodules file found, assuming ${file} is not in a submodule.`);
  return false;
}

// 获取某个文件的最后一次 Git 提交时间（包括处理子模块）
function getLastGitCommitTime(file) {
  let result;

  console.log(`Getting last Git commit time for file: ${file}`);

  if (isSubmodule(file)) {
    // 如果文件在子模块中，进入子模块目录获取提交时间
    const submodulePath = path.dirname(file);
    console.log(`File ${file} is in a submodule. Running git log in ${submodulePath}`);

    result = execSync(`git log -1 --format="%ad" -- ${path.basename(file)}`, { cwd: submodulePath }).toString().trim();
  } else {
    // 文件不在子模块，正常获取提交时间
    console.log(`File ${file} is not in a submodule. Running git log in the main repo.`);

    result = execSync(`git log -1 --format="%ad" -- ${file}`).toString().trim();
  }

  console.log(`Commit time for ${file}: ${result}`);

  return new Date(result);
}

/**
 * 生成侧边栏并按文件修改时间排序，同时支持黑名单过滤
 * @param {string} subDir - 子目录名称，例如 'blogs'
 * @param {string[]} blacklist - 文件黑名单，不包括后缀
 * @returns {Array} - 排序后的侧边栏数组
 */
function generateSidebar(subDir, blacklist = []) {
  const dir = path.resolve(__dirname, `../${subDir}`);  // 拼接固定的父级路径和子目录
  console.log(`Generating sidebar for directory: ${dir}`);

  const files = fs.readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .filter(file => !blacklist.includes(file.replace('.md', '')))
    .map(file => {
      const name = file.replace('.md', '');
      const fullPath = path.join(dir, file);

      console.log(`Processing file: ${file} (Full path: ${fullPath})`);

      const commitTime = getLastGitCommitTime(fullPath); // 获取 Git 提交时间

      return {
        text: name,
        link: `/${subDir}/${name}`, // 动态生成链接，指向传入的子目录
        commitTime, // 使用 Git 提交时间
      };
    });

  files.sort((a, b) => b.commitTime - a.commitTime); // 按提交时间排序

  console.log(`Sorted files by commit time:`, files.map(f => f.text));

  return files.map(({ text, link }) => ({ text, link }));
}

// 调用函数时传入子目录名称，例如 'blogs'
const sidebar = generateSidebar('blogs', ['index']);

console.log('Generated sidebar:', sidebar);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Ming's Blog",
  description: "",
  cleanUrls: true,
  ignoreDeadLinks: true,
  markdown: { attrs: { disable: true }, math: true },
  head: [
    ['link', { rel: 'icon', href: '/icons.png' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/icons.png',
    nav: [
      { text: 'BLOG', items: sidebar },
      { text: 'Me', link: '/' },
    ],
    sidebar: [{
      text: 'BLOG',
      items: sidebar
    }],

    outline: 'deep',
    lastUpdated: true,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Mingg817' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12.713l-11.99-7.06v14.12h23.98v-14.12l-11.99 7.06zm0-1.427l11.99-7.06h-23.98l11.99 7.06zm-12 10.52h24v-16.973l-12 7.07-12-7.07v16.973z"/></svg>'
        },
        link: 'mailto:yli2467-c@my.cityu.edu.hk',
        ariaLabel: 'Email'
      }
    ],

    search: {
      provider: 'local'
    },
  }
})
