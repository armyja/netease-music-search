# Netease Albums

## 项目简介
这是一个使用网易云音乐API获取用户播放列表中歌曲信息的项目。它可以提取歌曲的详细信息并生成一个包含歌曲信息的JSON文件，同时提供一个前端界面展示这些歌曲。

## 功能
- 从网易云音乐获取用户播放列表的歌曲信息
- 处理歌曲的详细信息，包括歌曲名、专辑名、专辑封面等
- 在前端展示歌曲列表，并支持双击打开歌曲链接
- 使用颜色聚类算法提取专辑封面的主要颜色

## 技术栈
- Node.js
- Vue.js
- NeteaseCloudMusicApi
- dotenv

## 安装
1. 克隆项目：
   ```bash
   git clone <项目地址>
   cd netease-albums
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 创建一个`.env`文件并添加以下内容：
   ```env
   USER_TOKEN=你的用户令牌
   PLATLIST_ID=你的播放列表ID
   ```

## 使用
1. 运行后端脚本：
   ```bash
   node index.js
   ```
2. `cd data; python3 -m http.server`

3. 打开`http://127.0.0.1:8080` 在浏览器中查看前端界面。

## 许可证
本项目采用MIT许可证，详细信息请查看`LICENSE`文件。

## 贡献
欢迎任何形式的贡献！请提交问题或拉取请求。

## 联系
如有问题，请联系作者：[你的邮箱]