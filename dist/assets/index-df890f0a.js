(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))b(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&b(h)}).observe(document,{childList:!0,subtree:!0});function c(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function b(o){if(o.ep)return;o.ep=!0;const l=c(o);fetch(o.href,l)}})();const E=document.querySelectorAll(".notshown"),y=document.querySelector(".gallery-outer"),p=document.querySelector(".gallery-remote"),I=document.querySelector(".gallery-remote-outer"),a=Array.from(p.children),n=[a[0].firstElementChild,a[1].firstElementChild,a[2].firstElementChild],u=30,k=y.getBoundingClientRect().bottom+window.scrollY-window.innerHeight,m=document.querySelector(".play-icon"),i=document.querySelector(".pause-icon"),g=document.querySelector(".replay-icon");let r,s=0,w=document.getElementById("svg"),d=w.firstElementChild,O=w.lastElementChild,v=d.getTotalLength(),q=d.getBoundingClientRect().bottom+window.scrollY-window.innerHeight;const C=Array.from(w.parentElement.children);d.style.strokeDasharray=v+" "+v;d.style.strokeDashoffset=v;console.log(v);const D=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add("shown")})});new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add("shown")})});const S=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&i.classList.contains("block")?(t.target.classList.add("shown"),r=setInterval(f,u,n[s])):t.isIntersecting?t.target.classList.add("shown"):(clearInterval(r),r=0)})});function f(e){if(e.value<100)e.value++;else if(s<2){clearInterval(r),r=0;let t=a[s];n[s].value=0,s++;let c=a[s];t.classList.remove("grow"),c.classList.add("grow"),y.style.transform="translateX("+c.dataset.id*-33.3333+"%)",r=setInterval(f,u,n[s])}else clearInterval(r),r=0,m.classList.remove("block"),i.classList.remove("block"),g.classList.add("block")}p.addEventListener("click",e=>{const t=a[s],c=e.target;t!==c&&e.target!==p&&(clearInterval(r),r=0,t.classList.remove("grow"),n[s].value=0,c.classList.add("grow"),y.style.transform="translateX("+c.dataset.id*-33.3333+"%)",s=c.dataset.id,i.classList.contains("block")&&(r=setInterval(f,u,n[s])))});I.lastElementChild.addEventListener("click",()=>{if(r!==0)clearInterval(r),r=0,i.classList.remove("block"),g.classList.remove("block"),m.classList.add("block");else if(n[s].value!==100)r=setInterval(f,u,n[s]),m.classList.remove("block"),g.classList.remove("block"),i.classList.add("block");else if(n[2].value===100){for(let e=0;e<=2;e++)n[e].value=0;y.style.transform="translateX(0%)",a[s].classList.remove("grow"),s=0,a[s].classList.add("grow"),r=setInterval(f,u,n[s]),m.classList.remove("block"),g.classList.remove("block"),i.classList.add("block")}});function L(e){return new Promise(t=>setTimeout(t,e))}E.forEach(e=>D.observe(e));document.addEventListener("scroll",async()=>{window.scrollY>=k&&S.observe(I),window.scrollY>=q&&(await L(1e3),d.style.strokeDashoffset="0",await L(700),d.style.opacity="0",O.style.opacity="1",await L(350),C.forEach(e=>{e.style.opacity="1",e.style.transform="translate(-50%, -50%) scale(1)"}))});