/* 세 화면(로그인·수업·교사용)이 함께 쓰는 도구 */
(() => {
  "use strict";
  const URL_ = "https://script.google.com/macros/s/AKfycbyhtaCm2c_xI7PT_7rsvYYks-WDyg6GFWry774lU-Wkgw5XJGoSRoX5CqwYZ-2jYbMwYw/exec";
  const ls = {
    get(k){ try{ return localStorage.getItem("esi-"+k); }catch(e){ return null; } },
    set(k,v){ try{ localStorage.setItem("esi-"+k,v); }catch(e){} },
    del(k){ try{ localStorage.removeItem("esi-"+k); }catch(e){} }
  };
  const today = () => new Intl.DateTimeFormat("sv-SE",{ timeZone:"Asia/Seoul" }).format(new Date());
  async function post(o, ms=30000){
    const ac = new AbortController(), t = setTimeout(() => ac.abort(), ms);
    try{
      const r = await fetch(URL_, { method:"POST", headers:{ "Content-Type":"text/plain;charset=utf-8" }, body:JSON.stringify(o), signal:ac.signal });
      return await r.json();
    }finally{ clearTimeout(t); }
  }
  function newKey(){ const b = new Uint8Array(12); crypto.getRandomValues(b); return [...b].map(x => x.toString(16).padStart(2,"0")).join(""); }
  function me(){
    try{ const m = JSON.parse(ls.get("me") || "null"); if (m && m.day === today() && m.cls && m.num && m.key) return m; }catch(e){}
    return null;
  }
  function setMe(m){ ls.set("me", JSON.stringify(m)); }
  function forget(){ ["me","st","dirty"].forEach(ls.del); }
  function theme(btn, onChange){
    const root = document.documentElement, t = ls.get("theme");
    if (t) root.dataset.theme = t;
    if (btn) btn.onclick = () => {
      const d = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
      root.dataset.theme = d ? "light" : "dark"; ls.set("theme", root.dataset.theme); if (onChange) onChange();
    };
  }
  const STAGES = ["① 생각 열기","② 해 보기","③ 전자의 이동 모형","④ 모형 완성하기","⑤ 확인 문제","⑥ 정리"];
  window.ESI = { ls, today, post, newKey, me, setMe, forget, theme, STAGES };
})();
