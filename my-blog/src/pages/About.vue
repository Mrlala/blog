<template>
  <div class="about-page">
    <div class="header-section">
      <h2>关于本站</h2>
      <div class="decoration-line"></div>
    </div>

    <p class="intro">
      本博客系统为个人项目，支持文章发布、分类、标签、归档和后台管理。<br />
      你可以在这里查看我的开发记录和各种技术文章。
    </p>

    <div class="tech-section">
      <h3><i class="icon icon-tech"></i>技术栈</h3>
      <ul class="tech-list">
        <li><i class="icon icon-vue"></i>前端：Vue 3、Naive UI、Vite</li>
        <li><i class="icon icon-node"></i>后端：Node.js + Express、PostgreSQL</li>
        <li><i class="icon icon-docker"></i>部署：Node.js</li>
        <li><i class="icon icon-ai"></i>AI 辅助：ChatGPT、腾讯元宝</li>
      </ul>
    </div>

    <div class="project-section">
      <h3><i class="icon icon-info"></i>项目信息</h3>
      <div class="project-grid">
        <div class="project-item">
          <span class="label">版本号：</span>
          <span class="value">v1.2.0</span>
        </div>
        <div class="project-item">
          <span class="label">开发时间：</span>
          <span class="value">2025 年 7 月</span>
        </div>
        <div class="project-item">
          <span class="label">最后更新：</span>
          <span class="value">2025年 7 月</span>
        </div>
        <div class="project-item">
          <span class="label">源码地址：</span>
          <a href="https://github.com/Mrlala/blog" target="_blank" class="value link">
            <i class="icon icon-github"></i>GitHub
          </a>
        </div>
      </div>
    </div>

    <div class="author-section">
      <div class="author-avatar">

      </div>
      <div class="author-info">
        <h4>关于作者</h4>
        <p>全栈开发者，热爱技术分享，专注于Web开发和AI应用。</p>
        <div class="social-links">
          <a href="tencent://message/?uin=552124165&Site=&Menu=yes" class="social-link" title="QQ">
            <i class="icon icon-qq"></i>
          </a>
          <a href="https://github.com/Mrlala" target="_blank" class="social-link" title="GitHub">
            <i class="icon icon-github"></i>
          </a>
          <a href="mailto:552124165@qq.com" class="social-link" title="Email">
            <i class="icon icon-mail"></i>
          </a>
        </div>

      </div>
    </div>

    <div class="footer-section">
      <h3><i class="icon icon-copyright"></i>版权说明</h3>
      <p>
        本站内容除特别声明外，均为原创，采用
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
          CC BY-NC-SA 4.0
        </a> 协议许可，转载请注明出处。
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 3em auto;
  background: var(--card-color, #fff);
  border-radius: 1.2em;
  box-shadow: 0 4px 24px var(--card-shadow, #2563eb12);
  padding: 2.8em 2.5em 2.6em;
  font-size: 1.14em;
  color: var(--text-color-base, #222c3a);
  line-height: 1.76;
  position: relative;
  overflow: hidden;
}

.about-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #2563eb, #7c3aed, #2563eb);
}

.header-section {
  margin-bottom: 1.5em;
}

.header-section h2 {
  font-size: 1.8em;
  color: var(--primary-color, #2563eb);
  margin-bottom: 0.8em;
  position: relative;
  display: inline-block;
}

.decoration-line {
  height: 3px;
  width: 60px;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  margin-bottom: 1.5em;
  border-radius: 3px;
}

.intro {
  margin-bottom: 2em;
  font-size: 1.1em;
  color: var(--text-color-base, #4a5568);
}

.tech-section,
.project-section,
.author-section,
.footer-section {
  margin-top: 2.5em;
  padding-top: 2em;
  border-top: 1px solid var(--border-color, #e2e8f0);
}

h3 {
  font-size: 1.3em;
  color: var(--text-color-base, #222c3a);
  margin-bottom: 1em;
  display: flex;
  align-items: center;
}

.tech-list {
  margin-top: 1em;
  padding-left: 0;
  line-height: 1.8;
}

.tech-list li {
  list-style: none;
  padding: 0.6em 0;
  display: flex;
  align-items: center;
  color: var(--text-color-base, #4a5568);
  border-bottom: 1px dashed var(--border-color, #e2e8f0);
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1em 2em;
  margin-top: 1em;
  font-size: 1em;
}

.project-item {
  display: flex;
  align-items: center;
  padding: 0.8em 0;
}

.project-item .label {
  color: var(--text-color-base, #4a5568);
  font-weight: 500;
}

.project-item .value {
  color: var(--primary-color, #2563eb);
  margin-left: 0.3em;
  font-weight: 500;
}

.project-item .link {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.project-item .link:hover {
  text-decoration: underline;
}

.author-section {
  display: flex;
  gap: 2em;
  align-items: center;
}

.author-avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color, #2563eb);
}

.author-info h4 {
  margin: 0 0 0.5em;
  font-size: 1.2em;
  color: var(--primary-color, #2563eb);
}

.author-info p {
  margin: 0 0 1em;
  color: var(--text-color-base, #4a5568);
}

.social-links {
  display: flex;
  gap: 1em;
}

.social-link {
  color: var(--text-color-base, #4a5568);
  font-size: 1.2em;
  transition: color 0.2s;
}

.social-link:hover {
  color: var(--primary-color, #2563eb);
}

.footer-section p {
  margin-top: 1em;
  color: var(--text-color-base, #444);
  font-size: 0.95em;
}

.footer-section a {
  color: var(--primary-color, #2563eb);
  text-decoration: underline;
}

/* 图标样式 */
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-tech {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z'/%3E%3C/svg%3E");
}

.icon-vue {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2342b883'%3E%3Cpath d='M12 12l-8-8H2l10 10L22 4h-2l-8 8zM2 12l10 10L22 12h-2l-8 8-8-8H2z'/%3E%3C/svg%3E");
}

.icon-node {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2390c53f'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E");
}

.icon-docker {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232496ed'%3E%3Cpath d='M4 4h16v16H4V4zm2 2v12h12V6H6zm3 2h2v2H9V8zm3 0h2v2h-2V8zm-3 3h2v2H9v-2zm3 0h2v2h-2v-2zm-3 3h2v2H9v-2zm3 0h2v2h-2v-2z'/%3E%3C/svg%3E");
}

.icon-ai {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff6b6b'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2V7zm0 8h2v2h-2v-2z'/%3E%3C/svg%3E");
}

.icon-info {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2V7zm0 4h2v6h-2v-6z'/%3E%3C/svg%3E");
}

.icon-github {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z'/%3E%3C/svg%3E");
}

.icon-copyright {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.88-11.71c-2.05 0-3.71 1.67-3.71 3.71 0 2.05 1.67 3.71 3.71 3.71 1.12 0 2.14-.5 2.82-1.3l-1.15-1.15c-.35.5-.97.85-1.67.85-1.05 0-1.91-.86-1.91-1.91 0-1.05.86-1.91 1.91-1.91.7 0 1.32.35 1.67.85l1.15-1.15c-.68-.8-1.7-1.3-2.82-1.3z'/%3E%3C/svg%3E");
}

.icon-twitter {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231DA1F2'%3E%3Cpath d='M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'/%3E%3C/svg%3E");
}

.icon-linkedin {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230A66C2'%3E%3Cpath d='M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z'/%3E%3C/svg%3E");
}

.icon-mail {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%232563eb' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z'/%3E%3C/svg%3E");
}
.icon-qq {
  background-image: url("data:image/svg+xml,%3Csvg t='1698212313958' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' fill='%232563eb'%3E%3Cpath d='M877.568 684.032a264.96 264.96 0 0 0-51.2-86.016c-6.144-6.656-12.288-13.312-19.456-20.48 9.728-39.936 14.336-82.944 14.336-127.488 0-174.08-121.344-315.392-270.336-315.392S280.576 276.48 280.576 450.56c0 44.544 4.608 87.552 14.336 127.488-7.168 7.168-13.312 13.824-19.456 20.48a262.912 262.912 0 0 0-51.2 86.016 86.016 86.016 0 0 0 5.12 76.8c13.824 23.552 38.4 37.888 64.512 37.888 15.872 0 31.232-5.12 44.544-14.336 20.992 40.96 54.272 76.288 96.768 97.28l-64.512 61.952c-5.632 5.632-7.168 14.336-4.096 21.504 3.584 7.168 10.24 12.288 18.432 12.288h250.88c8.192 0 14.848-5.12 18.432-12.288 3.072-7.168 1.536-15.872-4.096-21.504l-64.512-61.952c42.496-20.992 76.288-56.32 96.768-97.28 13.312 9.216 28.672 14.336 44.544 14.336 26.112 0 50.688-14.336 64.512-37.888 11.264-24.064 11.264-52.224 1.024-76.8z'/%3E%3C/svg%3E");
}

@media (max-width: 768px) {
  .about-page {
    padding: 2em 1.5em;
    margin: 2em auto;
    border-radius: 0.8em;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .author-section {
    flex-direction: column;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>