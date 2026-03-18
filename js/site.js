(function () {
  const ROOT = "";
  const path = location.pathname;
  const isEN = path.startsWith(`${ROOT}/en/`);
  const isPresale = path.includes("digitrade-presale");
  const headerFile = `${ROOT}${isEN ? "/en" : ""}${isPresale ? "/header-presale.html" : "/header.html"}`;
  const footerFile = `${ROOT}${isEN ? "/en" : ""}/footer.html`;

  // Theme restore (localStorage wins)
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.documentElement.classList.add("dark");
  if (saved === "light") document.documentElement.classList.remove("dark");

  // Auto dark on first visit
  if (!saved) {
    try {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    } catch {}
  }

  const inject = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  Promise.all([
    fetch(headerFile).then(r=>r.text()).then(h=>inject("header", h)),
    fetch(footerFile).then(r=>r.text()).then(f=>inject("footer", f))
  ]).then(()=>{ setActiveNavLink(); setActiveLangLink(); wireThemeToggle(); wireHamburgerMenu(); });

  function normalise(href){ try{ const u=new URL(href, location.origin); return u.pathname.replace(/\/+$/,""); }catch{ return href; } }
  function setActiveNavLink(){
    const cur = normalise(location.pathname);
    const nav = document.querySelector('.site-header .main-menu'); if(!nav) return;
    const links = nav.querySelectorAll('a[href]');
    let best=null, score=-1;
    links.forEach(a=>{ const href=normalise(a.getAttribute('href')); let s=0; if(href===cur) s=2; else if(cur.startsWith(href) && href!=='' && href!=='/') s=1; if(s>score){best=a; score=s;} });
    if(best) best.classList.add('active');
  }
  function setActiveLangLink(){
    const langMenu = document.querySelector('.site-header .lang-menu'); if(!langMenu) return;
    const links = langMenu.querySelectorAll('a[href]');
    const isEN = location.pathname.startsWith('/en/');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if ((isEN && href.includes('/en/')) || (!isEN && !href.includes('/en/'))) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
  function wireThemeToggle(){ const btn=document.querySelector('.theme-toggle'); if(!btn) return; btn.addEventListener('click',()=>{ const on=document.documentElement.classList.toggle('dark'); localStorage.setItem('theme', on? 'dark':'light'); }); }
  function wireHamburgerMenu(){ const btn=document.querySelector('.hamburger'); if(!btn) return; btn.addEventListener('click',()=>{ document.body.classList.toggle('mobile-menu-open'); }); const links = document.querySelectorAll('.main-menu a'); links.forEach(link => { link.addEventListener('click', () => { document.body.classList.remove('mobile-menu-open'); }); }); }
})();
