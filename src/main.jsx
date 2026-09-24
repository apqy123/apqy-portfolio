import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, Check, Copy, Mail, Menu, ScanLine, Sparkles, X } from 'lucide-react'
import './style.css'
import InteractivePortrait from './InteractivePortrait'

const projects = [
  { number: '01', title: '万兽化身', english: 'BEAST SHIFT', category: '平台跳跃 / 解谜', award: '莉莉丝高校游戏创作大赛三等奖 · 网易 MiniGame 决赛', image: '/assets/beast-cover.jpg', video: '/assets/beast-trailer.mp4', alt: '万兽化身宣传封面', summary: '五种动物形态，五套运动逻辑。让每一次切换，成为穿越关卡的解题方式。', role: '主导形态规则与技能定义，参与关卡机制、路线和难度递进设计；实现角色控制、物理交互与图腾关卡。', tags: ['玩法设计', '关卡设计', 'Unity 2D'], href: 'https://www.bilibili.com/video/BV1Zg7z6SE3n/', color: 'blue' },
  { number: '02', title: '三脚猫行动', english: 'OPERATION CAT', category: '潜行 / 搜打撤 Roguelike', award: '网易 MiniGame 决赛一等奖', image: '/assets/operation-cat-cover.png', video: '/assets/operation-cat-trailer.mp4', alt: '三脚猫行动宣传封面', summary: '观察巡逻、潜入搜查、权衡背包，再赶在倒计时结束前完成撤离。', role: '担任主策划，设计核心循环、房间路线、敌人巡逻与撤离规则，并完成背包、武器、道具和成长系统。', tags: ['主策划', '系统设计', 'TapTap 引擎'], href: 'https://www.taptap.cn/app/894113?os=pc', color: 'pink' },
  { number: '03', title: '锚了个猫', english: 'ANCHOR CAT', category: '生存割草 / Roguelike', award: '2026 CIGA 游戏创作现场 · 玩家投票第一名', image: '/assets/anchor-cat.jpg', video: '/assets/anchor-cat-trailer.mp4', alt: '锚了个猫作品封面', summary: '在不断增强的敌潮中拾取能量、选择词条，把一场混战构筑成自己的节奏。', role: '担任主策划与全栈程序，规划自动攻击、升级三选一、敌人递增与技能进化；现场优化新手引导。', tags: ['主策划', '战斗成长', 'Game Jam'], href: 'https://www.bilibili.com/video/BV1n2M46NEcP/', color: 'yellow' },
]

const services = [
  { number: '01', title: '玩法设计', english: 'GAMEPLAY DESIGN', text: '以《万兽化身》的五种形态切换为例，从核心体验出发定义规则、手感与反馈。' },
  { number: '02', title: '关卡设计', english: 'LEVEL DESIGN', text: '在《三脚猫行动》中设计潜行路线、敌人巡逻、搜查节奏与限时撤离压力。' },
  { number: '03', title: '快速实装', english: 'DESIGN & BUILD', text: '使用 Unity、C# 与 Lua 把想法快速做成可玩原型，并根据测试反馈持续迭代。' },
]

const marquee = ['GAMEPLAY DESIGN', 'LEVEL DESIGN', 'UNITY', 'C#', 'LUA', 'UGC EDITOR', 'PROTOTYPING']

function ProjectMedia({ project }) {
  const videoRef = useRef(null)
  const [previewing, setPreviewing] = useState(false)

  function playPreview() {
    if (!project.video || !videoRef.current) return
    setPreviewing(true)
    videoRef.current.play().catch(() => setPreviewing(false))
  }

  function stopPreview() {
    if (!videoRef.current) return
    videoRef.current.pause()
    videoRef.current.currentTime = 0
    setPreviewing(false)
  }

  return (
    <a
      className={`project-image${previewing ? ' is-previewing' : ''}`}
      href={project.href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={playPreview}
      onMouseLeave={stopPreview}
      onFocus={playPreview}
      onBlur={stopPreview}
    >
      <img src={project.image} alt={project.alt} loading="lazy" />
      {project.video && <video ref={videoRef} src={project.video} muted loop playsInline preload="metadata" aria-hidden="true" />}
      <span className="project-open"><ArrowUpRight size={27} /></span>
    </a>
  )
}

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState('')
  const [scanlines, setScanlines] = useState(() => localStorage.getItem('scanlines') !== 'off')
  useReveal()

  useEffect(() => {
    document.body.classList.toggle('scanlines-off', !scanlines)
    localStorage.setItem('scanlines', scanlines ? 'on' : 'off')
  }, [scanlines])

  async function copyContact(value, key) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      window.setTimeout(() => setCopied(''), 1800)
    } catch { setCopied('') }
  }

  const closeMenu = () => setMenuOpen(false)
  return (
    <>
      <header className="site-header">
        <a className="logo" href="#top" onClick={closeMenu} aria-label="周雨杰个人网站首页"><span>ZYJ</span><small>GAME DESIGNER</small></a>
        <div className="header-actions">
          <button className={scanlines ? 'scan-toggle active' : 'scan-toggle'} type="button" onClick={() => setScanlines(value => !value)} aria-pressed={scanlines} title={scanlines ? '关闭扫描线' : '开启扫描线'}>
            <ScanLine size={17} /><span>扫描线</span><b>{scanlines ? 'ON' : 'OFF'}</b>
          </button>
          <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="主导航">
            <a href="#about" onClick={closeMenu}>关于</a><a href="#work" onClick={closeMenu}>作品</a><a className="nav-cta" href="#contact" onClick={closeMenu}>聊一聊 <ArrowUpRight size={16} /></a>
          </nav>
          <button className="menu-button" onClick={() => setMenuOpen(value => !value)} aria-label={menuOpen ? '关闭菜单' : '打开菜单'}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-copy" data-reveal>
            <p className="hello"><span>HEY!</span> 我是 APQY</p>
            <h1>我设计<br /><em>好玩的规则</em><br />和关卡。</h1>
            <p className="hero-intro">玩法策划、关卡策划与游戏开发者。<br />把脑海里的体验，做成真正能玩的游戏。</p>
            <div className="hero-actions"><a className="button button-dark" href="#work">看看我的作品 <ArrowDownRight size={20} /></a><a className="button button-outline" href="#about">关于我 <ArrowDownRight size={20} /></a></div>
          </div>
          <div className="hero-media hero-deck" data-reveal>
            <nav className="deck-stage" aria-label="选择主要作品">
              {projects.map((project, index) => (
                <a className={`deck-card deck-card-${index}`} href={`#project-${project.number}`} key={project.number} aria-label={`前往${project.title}项目`}>
                  <img src={project.image} alt="" />
                  <span className="deck-card-label"><b>{project.number}</b><strong>{project.title}</strong><ArrowDownRight size={18} /></span>
                </a>
              ))}
              <div className="hero-sticker"><Sparkles size={22} /><strong>SELECT</strong><span>A PROJECT</span></div>
            </nav>
            <nav className="deck-selectors" aria-label="快速选择作品">
              <span className="deck-selector-label"><b>03 PROJECTS</b> HOVER / CLICK</span>
              {projects.map(project => (
                <a href={`#project-${project.number}`} key={project.number}>
                  <b>{project.number}</b><span>{project.title}</span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <div className="marquee" aria-label="专业技能"><div className="marquee-track">{[...marquee, ...marquee].map((item, index) => <React.Fragment key={`${item}-${index}`}><span>{item}</span><i>✦</i></React.Fragment>)}</div></div>

        <section className="about" id="about">
          <div className="about-intro section">
            <div className="section-kicker" data-reveal><span>01</span> ABOUT ME</div>
            <div className="about-grid">
              <div className="about-content" data-reveal>
                <div className="about-title"><p>我的设计方式</p><h2>先找到乐趣，<br />再让它<span>落地。</span></h2></div>
                <div className="about-copy"><p className="about-role">游戏策划与开发者 · 软件工程本科生 · 独立游戏创作者</p><p>我专注玩法与关卡设计，也习惯亲手制作原型、测试手感，再根据玩家反馈迭代。比起堆叠系统，我更关心玩家做出的每一个选择是否有趣。</p><div className="contact-facts"><button type="button" onClick={() => copyContact('1659350664@qq.com', 'email')}><strong>EMAIL</strong><span>{copied === 'email' ? '已复制' : '1659350664@qq.com'}</span>{copied === 'email' ? <Check size={17} /> : <Copy size={17} />}</button><button type="button" onClick={() => copyContact('DBGCB22722LFE', 'wechat')}><strong>WECHAT</strong><span>{copied === 'wechat' ? '已复制' : 'DBGCB22722LFE'}</span>{copied === 'wechat' ? <Check size={17} /> : <Copy size={17} />}</button><button type="button" onClick={() => copyContact('1659350664', 'qq')}><strong>QQ</strong><span>{copied === 'qq' ? '已复制' : '1659350664'}</span>{copied === 'qq' ? <Check size={17} /> : <Copy size={17} />}</button></div><p className={`copy-notice${copied ? ' show' : ''}`} role="status" aria-live="polite">{copied === 'email' ? '邮箱已复制到剪贴板' : copied === 'wechat' ? '微信已复制到剪贴板' : copied === 'qq' ? 'QQ 已复制到剪贴板' : ''}</p></div>
              </div>
              <div className="profile-sculpt-wrap about-portrait-wrap" data-reveal><InteractivePortrait src="/assets/pixel-profile.png" alt="周雨杰的像素人物形象" /><span>PLAYER PROFILE</span></div>
            </div>
            <div className="service-grid" id="capabilities">{services.map(service => <article key={service.number} data-reveal><div className="service-number">{service.number}</div><p>{service.english}</p><h3>{service.title}</h3><span>{service.text}</span><ArrowUpRight className="service-icon" size={28} /></article>)}</div>
          </div>
        </section>

        <section className="work section" id="work">
          <div className="work-heading" data-reveal><div className="section-kicker"><span>02</span> SELECTED WORK</div><h2>做过的一些<br /><em>好玩东西。</em></h2><p>机制、空间、节奏与反馈。<br />每一个项目，都是一次完整的设计实验。</p></div>
          <div className="project-list">{projects.map(project => <article className={`project project-${project.color}`} id={`project-${project.number}`} key={project.number} data-reveal>
            <ProjectMedia project={project} />
            <div className="project-content"><div className="project-meta"><span>PROJECT {project.number}</span><span>{project.category}</span></div><p className="project-english">{project.english}</p><h3>{project.title}</h3><p className="award">★ {project.award}</p><p className="summary">{project.summary}</p><p className="role">{project.role}</p><div className="project-footer"><div>{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a href={project.href} target="_blank" rel="noreferrer">查看项目 <ArrowUpRight size={17} /></a></div></div>
          </article>)}</div>
          <p className="other-work" data-reveal>更多作品 / 木头喵 · 忘却不复 · 粉墨登场 · 爸妈小时候上学的路</p>
        </section>

        <section className="contact section" id="contact">
          <p className="contact-note" data-reveal>下一关，要不要一起？</p><h2 data-reveal>LET'S MAKE<br /><span>SOMETHING</span><br />FUN.</h2>
          <div className="contact-row" data-reveal><a className="button button-light" href="mailto:1659350664@qq.com?subject=%E6%B8%B8%E6%88%8F%E9%A1%B9%E7%9B%AE%E5%90%88%E4%BD%9C"><Mail size={19} /> 发邮件给我</a><button className="wechat" type="button" onClick={() => copyContact('DBGCB22722LFE', 'footer-wechat')}>{copied === 'footer-wechat' ? <Check size={18} /> : <Copy size={18} />} 微信 · {copied === 'footer-wechat' ? '已复制' : 'DBGCB22722LFE'}</button></div>
          <footer><span>© {new Date().getFullYear()} ZHOU YUJIE</span><a href="#top">BACK TO TOP ↑</a><span>GAME DESIGN PORTFOLIO</span></footer>
        </section>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
