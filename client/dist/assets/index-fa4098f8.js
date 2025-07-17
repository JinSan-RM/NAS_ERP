import{r as f,b as Lt,a as R}from"./vendor-92c95717.js";import{f as Ot,d as l,P as ue,C as ht,L as Bt,S as Me,a as Dt,M as ut,U as xt,B as _t,H as Mt,b as At,c as Pt,e as Ft,g as mt,h as Ut,i as gt,j as Qt,k as qt,m as Ht,l as Ae,n as Ke,D as ft,A as bt,o as Yt,p as Gt,q as Vt,F as vt,R as Qe,r as qe,s as He,X as ke,t as de,u as Kt,v as Wt,w as jt,x as Xt,E as Jt,T as Zt,y as yt,z as es,G as $t}from"./ui-4213f29c.js";import{N as ts,u as ss,O as ns,B as rs,R as os,a as V,b as We}from"./router-9cc00d00.js";import{a as as,u as se,b as W,c as is,Q as ls,d as cs}from"./utils-9cf24c14.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(n){if(n.ep)return;n.ep=!0;const c=o(n);fetch(n.href,c)}})();var wt={exports:{}},Ne={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ds=f,ps=Symbol.for("react.element"),hs=Symbol.for("react.fragment"),us=Object.prototype.hasOwnProperty,xs=ds.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ms={key:!0,ref:!0,__self:!0,__source:!0};function kt(e,s,o){var r,n={},c=null,a=null;o!==void 0&&(c=""+o),s.key!==void 0&&(c=""+s.key),s.ref!==void 0&&(a=s.ref);for(r in s)us.call(s,r)&&!ms.hasOwnProperty(r)&&(n[r]=s[r]);if(e&&e.defaultProps)for(r in s=e.defaultProps,s)n[r]===void 0&&(n[r]=s[r]);return{$$typeof:ps,type:e,key:c,ref:a,props:n,_owner:xs.current}}Ne.Fragment=hs;Ne.jsx=kt;Ne.jsxs=kt;wt.exports=Ne;var t=wt.exports,Pe={},Xe=Lt;Pe.createRoot=Xe.createRoot,Pe.hydrateRoot=Xe.hydrateRoot;const Ct={colors:{primary:"#667eea",secondary:"#764ba2",success:"#10B981",warning:"#F59E0B",error:"#EF4444",info:"#3B82F6",gray:"#6B7280",background:"#f8fafc",surface:"#ffffff",text:"#1f2937",textSecondary:"#6b7280",border:"#e5e7eb"},spacing:{xs:"4px",sm:"8px",md:"16px",lg:"24px",xl:"32px"},borderRadius:{sm:"4px",md:"8px",lg:"12px"},shadows:{sm:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",md:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",lg:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"},breakpoints:{mobile:"768px",tablet:"1024px",desktop:"1200px"}},Nt=Ot`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: ${e=>e.theme.colors.background};
    color: ${e=>e.theme.colors.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
  }

  /* 스크롤바 스타일 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: ${e=>e.theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: ${e=>e.theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  /* 포커스 스타일 */
  :focus {
    outline: none;
  }

  :focus-visible {
    outline: 2px solid ${e=>e.theme.colors.primary};
    outline-offset: 2px;
  }

  /* 선택 스타일 */
  ::selection {
    background: rgba(102, 126, 234, 0.2);
    color: ${e=>e.theme.colors.text};
  }
`;function St(e){var s,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e))for(s=0;s<e.length;s++)e[s]&&(o=St(e[s]))&&(r&&(r+=" "),r+=o);else for(s in e)e[s]&&(r&&(r+=" "),r+=s);return r}function J(){for(var e,s,o=0,r="";o<arguments.length;)(e=arguments[o++])&&(s=St(e))&&(r&&(r+=" "),r+=s);return r}const pe=e=>typeof e=="number"&&!isNaN(e),ne=e=>typeof e=="string",F=e=>typeof e=="function",$e=e=>ne(e)||F(e)?e:null,Te=e=>f.isValidElement(e)||ne(e)||F(e)||pe(e);function gs(e,s,o){o===void 0&&(o=300);const{scrollHeight:r,style:n}=e;requestAnimationFrame(()=>{n.minHeight="initial",n.height=r+"px",n.transition=`all ${o}ms`,requestAnimationFrame(()=>{n.height="0",n.padding="0",n.margin="0",setTimeout(s,o)})})}function Se(e){let{enter:s,exit:o,appendPosition:r=!1,collapse:n=!0,collapseDuration:c=300}=e;return function(a){let{children:i,position:x,preventExitTransition:p,done:u,nodeRef:d,isIn:b}=a;const h=r?`${s}--${x}`:s,j=r?`${o}--${x}`:o,m=f.useRef(0);return f.useLayoutEffect(()=>{const g=d.current,v=h.split(" "),C=k=>{k.target===d.current&&(g.dispatchEvent(new Event("d")),g.removeEventListener("animationend",C),g.removeEventListener("animationcancel",C),m.current===0&&k.type!=="animationcancel"&&g.classList.remove(...v))};g.classList.add(...v),g.addEventListener("animationend",C),g.addEventListener("animationcancel",C)},[]),f.useEffect(()=>{const g=d.current,v=()=>{g.removeEventListener("animationend",v),n?gs(g,u,c):u()};b||(p?v():(m.current=1,g.className+=` ${j}`,g.addEventListener("animationend",v)))},[b]),R.createElement(R.Fragment,null,i)}}function Je(e,s){return e!=null?{content:e.content,containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,status:s}:{}}const Q={list:new Map,emitQueue:new Map,on(e,s){return this.list.has(e)||this.list.set(e,[]),this.list.get(e).push(s),this},off(e,s){if(s){const o=this.list.get(e).filter(r=>r!==s);return this.list.set(e,o),this}return this.list.delete(e),this},cancelEmit(e){const s=this.emitQueue.get(e);return s&&(s.forEach(clearTimeout),this.emitQueue.delete(e)),this},emit(e){this.list.has(e)&&this.list.get(e).forEach(s=>{const o=setTimeout(()=>{s(...[].slice.call(arguments,1))},0);this.emitQueue.has(e)||this.emitQueue.set(e,[]),this.emitQueue.get(e).push(o)})}},xe=e=>{let{theme:s,type:o,...r}=e;return R.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:s==="colored"?"currentColor":`var(--toastify-icon-color-${o})`,...r})},ze={info:function(e){return R.createElement(xe,{...e},R.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(e){return R.createElement(xe,{...e},R.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(e){return R.createElement(xe,{...e},R.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(e){return R.createElement(xe,{...e},R.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return R.createElement("div",{className:"Toastify__spinner"})}};function fs(e){const[,s]=f.useReducer(h=>h+1,0),[o,r]=f.useState([]),n=f.useRef(null),c=f.useRef(new Map).current,a=h=>o.indexOf(h)!==-1,i=f.useRef({toastKey:1,displayedToast:0,count:0,queue:[],props:e,containerId:null,isToastActive:a,getToast:h=>c.get(h)}).current;function x(h){let{containerId:j}=h;const{limit:m}=i.props;!m||j&&i.containerId!==j||(i.count-=i.queue.length,i.queue=[])}function p(h){r(j=>h==null?[]:j.filter(m=>m!==h))}function u(){const{toastContent:h,toastProps:j,staleId:m}=i.queue.shift();b(h,j,m)}function d(h,j){let{delay:m,staleId:g,...v}=j;if(!Te(h)||function(P){return!n.current||i.props.enableMultiContainer&&P.containerId!==i.props.containerId||c.has(P.toastId)&&P.updateId==null}(v))return;const{toastId:C,updateId:k,data:w}=v,{props:S}=i,B=()=>p(C),O=k==null;O&&i.count++;const I={...S,style:S.toastStyle,key:i.toastKey++,...Object.fromEntries(Object.entries(v).filter(P=>{let[q,_]=P;return _!=null})),toastId:C,updateId:k,data:w,closeToast:B,isIn:!1,className:$e(v.className||S.toastClassName),bodyClassName:$e(v.bodyClassName||S.bodyClassName),progressClassName:$e(v.progressClassName||S.progressClassName),autoClose:!v.isLoading&&(N=v.autoClose,L=S.autoClose,N===!1||pe(N)&&N>0?N:L),deleteToast(){const P=Je(c.get(C),"removed");c.delete(C),Q.emit(4,P);const q=i.queue.length;if(i.count=C==null?i.count-i.displayedToast:i.count-1,i.count<0&&(i.count=0),q>0){const _=C==null?i.props.limit:1;if(q===1||_===1)i.displayedToast++,u();else{const H=_>q?q:_;i.displayedToast=H;for(let M=0;M<H;M++)u()}}else s()}};var N,L;I.iconOut=function(P){let{theme:q,type:_,isLoading:H,icon:M}=P,Y=null;const K={theme:q,type:_};return M===!1||(F(M)?Y=M(K):f.isValidElement(M)?Y=f.cloneElement(M,K):ne(M)||pe(M)?Y=M:H?Y=ze.spinner():(re=>re in ze)(_)&&(Y=ze[_](K))),Y}(I),F(v.onOpen)&&(I.onOpen=v.onOpen),F(v.onClose)&&(I.onClose=v.onClose),I.closeButton=S.closeButton,v.closeButton===!1||Te(v.closeButton)?I.closeButton=v.closeButton:v.closeButton===!0&&(I.closeButton=!Te(S.closeButton)||S.closeButton);let D=h;f.isValidElement(h)&&!ne(h.type)?D=f.cloneElement(h,{closeToast:B,toastProps:I,data:w}):F(h)&&(D=h({closeToast:B,toastProps:I,data:w})),S.limit&&S.limit>0&&i.count>S.limit&&O?i.queue.push({toastContent:D,toastProps:I,staleId:g}):pe(m)?setTimeout(()=>{b(D,I,g)},m):b(D,I,g)}function b(h,j,m){const{toastId:g}=j;m&&c.delete(m);const v={content:h,props:j};c.set(g,v),r(C=>[...C,g].filter(k=>k!==m)),Q.emit(4,Je(v,v.props.updateId==null?"added":"updated"))}return f.useEffect(()=>(i.containerId=e.containerId,Q.cancelEmit(3).on(0,d).on(1,h=>n.current&&p(h)).on(5,x).emit(2,i),()=>{c.clear(),Q.emit(3,i)}),[]),f.useEffect(()=>{i.props=e,i.isToastActive=a,i.displayedToast=o.length}),{getToastToRender:function(h){const j=new Map,m=Array.from(c.values());return e.newestOnTop&&m.reverse(),m.forEach(g=>{const{position:v}=g.props;j.has(v)||j.set(v,[]),j.get(v).push(g)}),Array.from(j,g=>h(g[0],g[1]))},containerRef:n,isToastActive:a}}function Ze(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientX:e.clientX}function et(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientY:e.clientY}function bs(e){const[s,o]=f.useState(!1),[r,n]=f.useState(!1),c=f.useRef(null),a=f.useRef({start:0,x:0,y:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,boundingRect:null,didMove:!1}).current,i=f.useRef(e),{autoClose:x,pauseOnHover:p,closeToast:u,onClick:d,closeOnClick:b}=e;function h(w){if(e.draggable){w.nativeEvent.type==="touchstart"&&w.nativeEvent.preventDefault(),a.didMove=!1,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C),document.addEventListener("touchmove",v),document.addEventListener("touchend",C);const S=c.current;a.canCloseOnClick=!0,a.canDrag=!0,a.boundingRect=S.getBoundingClientRect(),S.style.transition="",a.x=Ze(w.nativeEvent),a.y=et(w.nativeEvent),e.draggableDirection==="x"?(a.start=a.x,a.removalDistance=S.offsetWidth*(e.draggablePercent/100)):(a.start=a.y,a.removalDistance=S.offsetHeight*(e.draggablePercent===80?1.5*e.draggablePercent:e.draggablePercent/100))}}function j(w){if(a.boundingRect){const{top:S,bottom:B,left:O,right:I}=a.boundingRect;w.nativeEvent.type!=="touchend"&&e.pauseOnHover&&a.x>=O&&a.x<=I&&a.y>=S&&a.y<=B?g():m()}}function m(){o(!0)}function g(){o(!1)}function v(w){const S=c.current;a.canDrag&&S&&(a.didMove=!0,s&&g(),a.x=Ze(w),a.y=et(w),a.delta=e.draggableDirection==="x"?a.x-a.start:a.y-a.start,a.start!==a.x&&(a.canCloseOnClick=!1),S.style.transform=`translate${e.draggableDirection}(${a.delta}px)`,S.style.opacity=""+(1-Math.abs(a.delta/a.removalDistance)))}function C(){document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),document.removeEventListener("touchmove",v),document.removeEventListener("touchend",C);const w=c.current;if(a.canDrag&&a.didMove&&w){if(a.canDrag=!1,Math.abs(a.delta)>a.removalDistance)return n(!0),void e.closeToast();w.style.transition="transform 0.2s, opacity 0.2s",w.style.transform=`translate${e.draggableDirection}(0)`,w.style.opacity="1"}}f.useEffect(()=>{i.current=e}),f.useEffect(()=>(c.current&&c.current.addEventListener("d",m,{once:!0}),F(e.onOpen)&&e.onOpen(f.isValidElement(e.children)&&e.children.props),()=>{const w=i.current;F(w.onClose)&&w.onClose(f.isValidElement(w.children)&&w.children.props)}),[]),f.useEffect(()=>(e.pauseOnFocusLoss&&(document.hasFocus()||g(),window.addEventListener("focus",m),window.addEventListener("blur",g)),()=>{e.pauseOnFocusLoss&&(window.removeEventListener("focus",m),window.removeEventListener("blur",g))}),[e.pauseOnFocusLoss]);const k={onMouseDown:h,onTouchStart:h,onMouseUp:j,onTouchEnd:j};return x&&p&&(k.onMouseEnter=g,k.onMouseLeave=m),b&&(k.onClick=w=>{d&&d(w),a.canCloseOnClick&&u()}),{playToast:m,pauseToast:g,isRunning:s,preventExitTransition:r,toastRef:c,eventHandlers:k}}function Et(e){let{closeToast:s,theme:o,ariaLabel:r="close"}=e;return R.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:n=>{n.stopPropagation(),s(n)},"aria-label":r},R.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},R.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function vs(e){let{delay:s,isRunning:o,closeToast:r,type:n="default",hide:c,className:a,style:i,controlledProgress:x,progress:p,rtl:u,isIn:d,theme:b}=e;const h=c||x&&p===0,j={...i,animationDuration:`${s}ms`,animationPlayState:o?"running":"paused",opacity:h?0:1};x&&(j.transform=`scaleX(${p})`);const m=J("Toastify__progress-bar",x?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${b}`,`Toastify__progress-bar--${n}`,{"Toastify__progress-bar--rtl":u}),g=F(a)?a({rtl:u,type:n,defaultClassName:m}):J(m,a);return R.createElement("div",{role:"progressbar","aria-hidden":h?"true":"false","aria-label":"notification timer",className:g,style:j,[x&&p>=1?"onTransitionEnd":"onAnimationEnd"]:x&&p<1?null:()=>{d&&r()}})}const js=e=>{const{isRunning:s,preventExitTransition:o,toastRef:r,eventHandlers:n}=bs(e),{closeButton:c,children:a,autoClose:i,onClick:x,type:p,hideProgressBar:u,closeToast:d,transition:b,position:h,className:j,style:m,bodyClassName:g,bodyStyle:v,progressClassName:C,progressStyle:k,updateId:w,role:S,progress:B,rtl:O,toastId:I,deleteToast:N,isIn:L,isLoading:D,iconOut:P,closeOnClick:q,theme:_}=e,H=J("Toastify__toast",`Toastify__toast-theme--${_}`,`Toastify__toast--${p}`,{"Toastify__toast--rtl":O},{"Toastify__toast--close-on-click":q}),M=F(j)?j({rtl:O,position:h,type:p,defaultClassName:H}):J(H,j),Y=!!B||!i,K={closeToast:d,type:p,theme:_};let re=null;return c===!1||(re=F(c)?c(K):f.isValidElement(c)?f.cloneElement(c,K):Et(K)),R.createElement(b,{isIn:L,done:N,position:h,preventExitTransition:o,nodeRef:r},R.createElement("div",{id:I,onClick:x,className:M,...n,style:m,ref:r},R.createElement("div",{...L&&{role:S},className:F(g)?g({type:p}):J("Toastify__toast-body",g),style:v},P!=null&&R.createElement("div",{className:J("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!D})},P),R.createElement("div",null,a)),re,R.createElement(vs,{...w&&!Y?{key:`pb-${w}`}:{},rtl:O,theme:_,delay:i,isRunning:s,isIn:L,closeToast:d,hide:u,type:p,style:k,className:C,controlledProgress:Y,progress:B||0})))},Ee=function(e,s){return s===void 0&&(s=!1),{enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:s}},ys=Se(Ee("bounce",!0));Se(Ee("slide",!0));Se(Ee("zoom"));Se(Ee("flip"));const Fe=f.forwardRef((e,s)=>{const{getToastToRender:o,containerRef:r,isToastActive:n}=fs(e),{className:c,style:a,rtl:i,containerId:x}=e;function p(u){const d=J("Toastify__toast-container",`Toastify__toast-container--${u}`,{"Toastify__toast-container--rtl":i});return F(c)?c({position:u,rtl:i,defaultClassName:d}):J(d,$e(c))}return f.useEffect(()=>{s&&(s.current=r.current)},[]),R.createElement("div",{ref:r,className:"Toastify",id:x},o((u,d)=>{const b=d.length?{...a}:{...a,pointerEvents:"none"};return R.createElement("div",{className:p(u),style:b,key:`container-${u}`},d.map((h,j)=>{let{content:m,props:g}=h;return R.createElement(js,{...g,isIn:n(g.toastId),style:{...g.style,"--nth":j+1,"--len":d.length},key:`toast-${g.key}`},m)}))}))});Fe.displayName="ToastContainer",Fe.defaultProps={position:"top-right",transition:ys,autoClose:5e3,closeButton:Et,pauseOnHover:!0,pauseOnFocusLoss:!0,closeOnClick:!0,draggable:!0,draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light"};let Ie,Z=new Map,ce=[],$s=1;function Rt(){return""+$s++}function ws(e){return e&&(ne(e.toastId)||pe(e.toastId))?e.toastId:Rt()}function he(e,s){return Z.size>0?Q.emit(0,e,s):ce.push({content:e,options:s}),s.toastId}function Ce(e,s){return{...s,type:s&&s.type||e,toastId:ws(s)}}function me(e){return(s,o)=>he(s,Ce(e,o))}function $(e,s){return he(e,Ce("default",s))}$.loading=(e,s)=>he(e,Ce("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...s})),$.promise=function(e,s,o){let r,{pending:n,error:c,success:a}=s;n&&(r=ne(n)?$.loading(n,o):$.loading(n.render,{...o,...n}));const i={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},x=(u,d,b)=>{if(d==null)return void $.dismiss(r);const h={type:u,...i,...o,data:b},j=ne(d)?{render:d}:d;return r?$.update(r,{...h,...j}):$(j.render,{...h,...j}),b},p=F(e)?e():e;return p.then(u=>x("success",a,u)).catch(u=>x("error",c,u)),p},$.success=me("success"),$.info=me("info"),$.error=me("error"),$.warning=me("warning"),$.warn=$.warning,$.dark=(e,s)=>he(e,Ce("default",{theme:"dark",...s})),$.dismiss=e=>{Z.size>0?Q.emit(1,e):ce=ce.filter(s=>e!=null&&s.options.toastId!==e)},$.clearWaitingQueue=function(e){return e===void 0&&(e={}),Q.emit(5,e)},$.isActive=e=>{let s=!1;return Z.forEach(o=>{o.isToastActive&&o.isToastActive(e)&&(s=!0)}),s},$.update=function(e,s){s===void 0&&(s={}),setTimeout(()=>{const o=function(r,n){let{containerId:c}=n;const a=Z.get(c||Ie);return a&&a.getToast(r)}(e,s);if(o){const{props:r,content:n}=o,c={delay:100,...r,...s,toastId:s.toastId||e,updateId:Rt()};c.toastId!==e&&(c.staleId=e);const a=c.render||n;delete c.render,he(a,c)}},0)},$.done=e=>{$.update(e,{progress:1})},$.onChange=e=>(Q.on(4,e),()=>{Q.off(4,e)}),$.POSITION={TOP_LEFT:"top-left",TOP_RIGHT:"top-right",TOP_CENTER:"top-center",BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",BOTTOM_CENTER:"bottom-center"},$.TYPE={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error",DEFAULT:"default"},Q.on(2,e=>{Ie=e.containerId||e,Z.set(Ie,e),ce.forEach(s=>{Q.emit(0,s.content,s.options)}),ce=[]}).on(3,e=>{Z.delete(e.containerId||e),Z.size===0&&Q.off(0).off(1).off(5)});const ks=l.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,Cs=l.div`
  padding: ${e=>e.collapsed?"20px 10px":"20px"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${e=>e.collapsed?"center":"space-between"};
  min-height: 80px;
`,Ns=l.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    font-size: ${e=>e.collapsed?"0":"1.5rem"};
    font-weight: 600;
    margin: 0;
    opacity: ${e=>e.collapsed?"0":"1"};
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .logo-icon {
    min-width: 32px;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,Ss=l.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.3s ease;
  display: ${e=>e.collapsed?"none":"flex"};
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`,Es=l.div`
  text-align: center;
  padding: ${e=>e.collapsed?"10px 5px":"15px 20px"};
  opacity: ${e=>e.collapsed?"0":"0.8"};
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: ${e=>e.collapsed?"0":"60px"};
`,Rs=l.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`,Le=l.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`,Oe=l.div`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  padding: 0 ${e=>(e.collapsed,"20px")};
  margin-bottom: 10px;
  opacity: ${e=>e.collapsed?"0":"1"};
  height: ${e=>e.collapsed?"0":"auto"};
  overflow: hidden;
  transition: all 0.3s ease;
`,Be=l.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`,Ts=l.li`
  margin-bottom: 2px;
`,zs=l(ts)`
  display: flex;
  align-items: center;
  padding: 12px ${e=>e.collapsed?"28px":"20px"};
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-left-color: #3498db;
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-left-color: #3498db;
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #3498db;
    }
  }
  
  .nav-icon {
    min-width: 20px;
    width: 20px;
    height: 20px;
    margin-right: ${e=>e.collapsed?"0":"15px"};
    transition: margin 0.3s ease;
  }
  
  .nav-text {
    font-size: 0.95rem;
    font-weight: 500;
    opacity: ${e=>e.collapsed?"0":"1"};
    transform: translateX(${e=>e.collapsed?"-10px":"0"});
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .nav-badge {
    margin-left: auto;
    background: #e74c3c;
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    opacity: ${e=>e.collapsed?"0":"1"};
    transition: all 0.3s ease;
  }
`,Is=l.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
  margin-left: 10px;
  opacity: ${e=>e.show?"1":"0"};
  visibility: ${e=>e.show?"visible":"hidden"};
  transition: all 0.3s ease;
  z-index: 1000;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.8);
  }
`,Ls=l.div`
  position: relative;
  
  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`,Os=({collapsed:e,onToggle:s})=>{const o=ss(),r=[{path:"/dashboard",label:"대시보드",icon:Bt},{path:"/purchase-requests",label:"구매 요청",icon:Me,badge:3},{path:"/inventory",label:"품목 관리",icon:ue},{path:"/receipts",label:"수령 관리",icon:Dt},{path:"/kakao",label:"카톡 처리",icon:ut}],n=[{path:"/upload",label:"파일 관리",icon:xt},{path:"/statistics",label:"통계 분석",icon:_t},{path:"/logs",label:"시스템 로그",icon:Mt}],c=[{path:"/suppliers",label:"공급업체",icon:At},{path:"/budgets",label:"예산 관리",icon:Pt},{path:"/users",label:"사용자 관리",icon:Ft},{path:"/notifications",label:"알림 설정",icon:mt},{path:"/settings",label:"시스템 설정",icon:Ut}],a=i=>{const x=i.icon,p=o.pathname===i.path;return t.jsx(Ts,{children:t.jsxs(Ls,{children:[t.jsxs(zs,{to:i.path,collapsed:e,className:p?"active":"",children:[t.jsx(x,{className:"nav-icon",size:20}),t.jsx("span",{className:"nav-text",children:i.label}),i.badge&&t.jsx("span",{className:"nav-badge",children:i.badge})]}),e&&t.jsx(Is,{show:e,className:"tooltip",children:i.label})]})},i.path)};return t.jsxs(ks,{collapsed:e,children:[t.jsxs(Cs,{collapsed:e,children:[t.jsxs(Ns,{collapsed:e,children:[t.jsx("div",{className:"logo-icon",children:t.jsx(ue,{size:20})}),t.jsx("h1",{children:"ERP 시스템"})]}),t.jsx(Ss,{collapsed:e,onClick:s,children:t.jsx(ht,{size:20})})]}),t.jsx(Es,{collapsed:e,children:"업무 자동화 및 관리"}),t.jsxs(Rs,{children:[t.jsxs(Le,{collapsed:e,children:[t.jsx(Oe,{collapsed:e,children:"주요 기능"}),t.jsx(Be,{children:r.map(a)})]}),t.jsxs(Le,{collapsed:e,children:[t.jsx(Oe,{collapsed:e,children:"데이터 관리"}),t.jsx(Be,{children:n.map(a)})]}),t.jsxs(Le,{collapsed:e,children:[t.jsx(Oe,{collapsed:e,children:"시스템 관리"}),t.jsx(Be,{children:c.map(a)})]})]})]})},Bs=l.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${e=>e.theme.spacing.lg};
  height: 64px;
  background: ${e=>e.theme.colors.surface};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
`,Ds=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
`,_s=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,Ms=l.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${e=>e.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${e=>e.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${e=>e.theme.colors.background};
  }
`,As=l.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    display: none;
  }
`,Ps=l.input`
  width: 300px;
  padding: 8px 12px 8px 40px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  background: ${e=>e.theme.colors.background};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.colors.primary}20;
  }
`,Fs=l(gt)`
  position: absolute;
  left: 12px;
  color: ${e=>e.theme.colors.textSecondary};
`,tt=l.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${e=>e.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${e=>e.theme.colors.text};
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background: ${e=>e.theme.colors.background};
  }
`,Us=l.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: ${e=>e.theme.colors.error};
  border-radius: 50%;
`,Qs=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.sm};
  border-radius: ${e=>e.theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${e=>e.theme.colors.background};
  }
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    .user-name {
      display: none;
    }
  }
`,qs=l.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary}, ${e=>e.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`,X=({onToggleSidebar:e,sidebarCollapsed:s})=>t.jsxs(Bs,{children:[t.jsxs(Ds,{children:[t.jsx(Ms,{onClick:e,children:t.jsx(Qt,{size:20})}),t.jsxs(As,{children:[t.jsx(Fs,{size:16}),t.jsx(Ps,{type:"text",placeholder:"검색..."})]})]}),t.jsxs(_s,{children:[t.jsxs(tt,{children:[t.jsx(mt,{size:20}),t.jsx(Us,{})]}),t.jsxs(Qs,{children:[t.jsx(qs,{children:"관"}),t.jsx("span",{className:"user-name",children:"관리자"})]}),t.jsx(tt,{children:t.jsx(qt,{size:18})})]})]}),Hs=l.div`
  display: flex;
  height: 100vh;
  background-color: ${e=>e.theme.colors.background};
  overflow: hidden;
`,Ys=l.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${e=>e.sidebarOpen?"280px":"80px"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${e=>e.theme.colors.background};
  border-radius: ${e=>e.sidebarOpen?"24px 0 0 0":"0"};
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
`,Gs=l.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${e=>e.theme.colors.gray}20;
    border-radius: 4px;
    
    &:hover {
      background: ${e=>e.theme.colors.gray}40;
    }
  }

  /* 컨텐츠가 로드될 때 페이드인 효과 */
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`,Vs=()=>{const[e,s]=f.useState(!0);return t.jsxs(Hs,{children:[t.jsx(Os,{isOpen:e,onToggle:()=>s(!e)}),t.jsxs(Ys,{sidebarOpen:e,children:[t.jsx(X,{onMenuClick:()=>s(!e)}),t.jsx(Gs,{children:t.jsx(ns,{})})]})]})},Ks=Ht`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,Ws=l.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${e=>e.theme.spacing.xl};
  min-height: 200px;
`,Xs=l.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${e=>e.theme.colors.border};
  border-top: 4px solid ${e=>e.theme.colors.primary};
  border-radius: 50%;
  animation: ${Ks} 1s linear infinite;
`,Js=l.div`
  margin-left: ${e=>e.theme.spacing.md};
  color: ${e=>e.theme.colors.textSecondary};
  font-size: 0.9rem;
`,le=({text:e="로딩 중..."})=>t.jsxs(Ws,{children:[t.jsx(Xs,{}),e&&t.jsx(Js,{children:e})]}),Zs=l.div`
  background: ${e=>e.theme.colors.surface};
  border-radius: ${e=>e.theme.borderRadius.lg};
  border: 1px solid ${e=>e.theme.colors.border};
  box-shadow: ${e=>e.theme.shadows.sm};
  padding: ${e=>e.padding||e.theme.spacing.lg};
  transition: all 0.2s ease;
  
  ${e=>e.hover&&`
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${e.theme.shadows.md};
    }
  `}
`,U=R.forwardRef(({children:e,className:s,padding:o,hover:r=!1},n)=>t.jsx(Zs,{ref:n,className:s,padding:o,hover:r,children:e}));U.displayName="Card";const en=()=>{const e=as.create({baseURL:{}.VITE_API_URL||"http://localhost:3001/api",timeout:1e4,headers:{"Content-Type":"application/json"}});return e.interceptors.request.use(s=>{const o=localStorage.getItem("auth_token");return o&&(s.headers.Authorization=`Bearer ${o}`),s},s=>Promise.reject(s)),e.interceptors.response.use(s=>s,s=>{var o,r,n,c;return console.error("API Error:",{status:(o=s.response)==null?void 0:o.status,url:(r=s.config)==null?void 0:r.url,message:s.message,data:(n=s.response)==null?void 0:n.data}),((c=s.response)==null?void 0:c.status)===401&&localStorage.removeItem("auth_token"),Promise.reject(s)}),e},ee=en(),E={get:(e,s)=>ee.get(e,{params:s}).then(o=>o.data),post:(e,s)=>ee.post(e,s).then(o=>o.data),put:(e,s)=>ee.put(e,s).then(o=>o.data),delete:e=>ee.delete(e).then(s=>s.data),download:(e,s)=>ee.get(e,{params:s,responseType:"blob"}).then(o=>o.data)},tn={getStats:()=>E.get("/dashboard")},te={getRequests:(e=1,s=20,o)=>E.get("/purchase-requests",{page:e,limit:s,...o}),getRequest:e=>E.get(`/purchase-requests/${e}`),createRequest:e=>E.post("/purchase-requests",e),updateRequest:(e,s)=>E.put(`/purchase-requests/${e}`,s),deleteRequest:e=>E.delete(`/purchase-requests/${e}`),approveRequest:e=>E.post(`/purchase-requests/${e.requestId}/approve`,{action:e.action,comments:e.comments}),getStats:()=>E.get("/purchase-requests/stats"),exportRequests:e=>E.download("/purchase-requests/export/excel",e)},Ue={getItems:(e=1,s=20,o)=>E.get("/inventory",{page:e,limit:s,...o}),getItem:e=>E.get(`/inventory/${e}`),createItem:e=>E.post("/inventory",e),updateItem:(e,s)=>E.put(`/inventory/${e}`,s),deleteItem:e=>E.delete(`/inventory/${e}`),updateItemStatus:(e,s,o)=>E.put(`/inventory/${e}/status`,{status:s,receivedDate:o}),getSuppliers:()=>E.get("/inventory/suppliers"),searchItems:(e,s=10)=>E.get("/inventory/search",{q:e,limit:s}),getLowStockItems:(e=5)=>E.get("/inventory/low-stock",{threshold:e}),exportData:e=>E.download(`/export/${e}`)},sn={getReceipts:(e=1,s=20)=>E.get("/receipts",{page:e,limit:s}),createReceipt:e=>E.post("/receipts",e),exportReceipts:()=>E.download("/receipts/export")},nn={uploadExcel:e=>{const s=new FormData;return s.append("excelFile",e),ee.post("/upload",s,{headers:{"Content-Type":"multipart/form-data"}}).then(o=>o.data)},uploadFile:(e,s)=>{const o=new FormData;return o.append("file",e),s&&o.append("type",s),ee.post("/upload/file",o,{headers:{"Content-Type":"multipart/form-data"}}).then(r=>r.data)}},rn={parseMessage:e=>E.post("/kakao/parse",{message:e})},on={getStats:()=>E.get("/statistics"),getMonthlyStats:e=>E.get("/statistics/monthly",{year:e}),getSupplierStats:()=>E.get("/statistics/suppliers"),getDepartmentStats:()=>E.get("/statistics/departments")},an={getLogs:(e=1,s=50)=>E.get("/logs",{page:e,limit:s})},st=l.div`
  padding: 20px;
`,ln=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,ge=l(U)`
  background: linear-gradient(135deg, ${e=>e.color}15 0%, ${e=>e.color}05 100%);
  border-left: 4px solid ${e=>e.color};
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .stat-icon {
    padding: 12px;
    border-radius: 50%;
    background: ${e=>e.color}20;
    color: ${e=>e.color};
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: ${e=>e.color};
    margin-bottom: 5px;
  }
  
  .stat-label {
    color: ${e=>e.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
  
  .stat-change {
    font-size: 0.8rem;
    margin-top: 8px;
    
    &.positive {
      color: ${e=>e.theme.colors.success};
    }
    
    &.negative {
      color: ${e=>e.theme.colors.error};
    }
  }
`,cn=l.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: ${e=>e.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`,dn=l(U)`
  .activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 1.2rem;
    }
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    transition: background 0.2s;
    
    &:hover {
      background: ${e=>e.theme.colors.background};
    }
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .activity-time {
      font-size: 0.8rem;
      color: ${e=>e.theme.colors.textSecondary};
    }
  }
`,pn=l(U)`
  h3 {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }
  
  .actions-grid {
    display: grid;
    gap: 12px;
  }
  
  .action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px solid ${e=>e.theme.colors.border};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
    
    &:hover {
      border-color: ${e=>e.theme.colors.primary};
      background: ${e=>e.theme.colors.primary}05;
      transform: translateY(-1px);
    }
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${e=>e.theme.colors.primary}15;
    color: ${e=>e.theme.colors.primary};
  }
  
  .action-content {
    .action-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .action-desc {
      font-size: 0.85rem;
      color: ${e=>e.theme.colors.textSecondary};
    }
  }
`,hn=()=>{var n,c,a,i,x,p,u;const{data:e,isLoading:s,error:o}=se("dashboard-stats",tn.getStats,{refetchInterval:3e5});if(s)return t.jsx(le,{});if(o)return t.jsx(st,{children:t.jsx(U,{children:t.jsx("div",{style:{textAlign:"center",padding:"40px"},children:t.jsx("p",{children:"대시보드 데이터를 불러오는 중 오류가 발생했습니다."})})})});const r=e==null?void 0:e.data;return t.jsxs(st,{children:[t.jsx(X,{title:"대시보드",subtitle:"시스템 현황을 한눈에 확인하세요."}),t.jsxs(ln,{children:[t.jsxs(ge,{color:"#3B82F6",children:[t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsx("div",{className:"stat-value",children:((n=r==null?void 0:r.purchaseRequests)==null?void 0:n.total)||0}),t.jsx("div",{className:"stat-label",children:"전체 구매 요청"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(Me,{size:24})})]}),t.jsxs("div",{className:"stat-change positive",children:["이번 달 +",((c=r==null?void 0:r.purchaseRequests)==null?void 0:c.thisMonth)||0]})]}),t.jsx(ge,{color:"#F59E0B",children:t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsx("div",{className:"stat-value",children:((a=r==null?void 0:r.purchaseRequests)==null?void 0:a.pending)||0}),t.jsx("div",{className:"stat-label",children:"승인 대기"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(Ae,{size:24})})]})}),t.jsx(ge,{color:"#10B981",children:t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsx("div",{className:"stat-value",children:((i=r==null?void 0:r.inventory)==null?void 0:i.receivedItems)||0}),t.jsx("div",{className:"stat-label",children:"수령 완료"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(Ke,{size:24})})]})}),t.jsxs(ge,{color:"#8B5CF6",children:[t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsxs("div",{className:"stat-value",children:["₩",(((x=r==null?void 0:r.budget)==null?void 0:x.usedBudget)||0).toLocaleString()]}),t.jsx("div",{className:"stat-label",children:"사용 예산"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(ft,{size:24})})]}),t.jsxs("div",{className:"stat-change",children:["활용률 ",((p=r==null?void 0:r.budget)==null?void 0:p.utilizationRate)||0,"%"]})]})]}),t.jsxs(cn,{children:[t.jsxs(dn,{children:[t.jsxs("div",{className:"activity-header",children:[t.jsx("h3",{children:"최근 활동"}),t.jsx("span",{style:{fontSize:"0.9rem",color:"#666"},children:"최근 24시간"})]}),t.jsx("div",{className:"activity-list",children:((u=r==null?void 0:r.recentReceipts)==null?void 0:u.slice(0,5).map((d,b)=>t.jsxs("div",{className:"activity-item",children:[t.jsx("div",{className:"activity-icon",style:{background:"#10B98120",color:"#10B981"},children:t.jsx(ue,{size:20})}),t.jsxs("div",{className:"activity-content",children:[t.jsxs("div",{className:"activity-title",children:[d.itemName," 수령 완료"]}),t.jsxs("div",{className:"activity-time",children:[d.receiverName," • ",new Date(d.receivedDate).toLocaleString("ko-KR")]})]})]},d.id)))||t.jsx("div",{style:{textAlign:"center",color:"#666",padding:"20px"},children:"최근 활동이 없습니다."})})]}),t.jsxs(pn,{children:[t.jsx("h3",{children:"빠른 작업"}),t.jsxs("div",{className:"actions-grid",children:[t.jsxs("a",{href:"/purchase-requests",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(Me,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"구매 요청"}),t.jsx("div",{className:"action-desc",children:"새로운 구매 요청 등록"})]})]}),t.jsxs("a",{href:"/inventory",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(ue,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"품목 관리"}),t.jsx("div",{className:"action-desc",children:"재고 현황 확인"})]})]}),t.jsxs("a",{href:"/receipts",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(Ke,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"수령 처리"}),t.jsx("div",{className:"action-desc",children:"물품 수령 등록"})]})]}),t.jsxs("a",{href:"/kakao",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(bt,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"카톡 처리"}),t.jsx("div",{className:"action-desc",children:"메시지 파싱"})]})]})]})]})]})]})},un=l.div`
  overflow-x: auto;
  border-radius: ${e=>e.theme.borderRadius.lg};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
`,xn=l.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`,mn=l.thead`
  background: ${e=>e.theme.colors.background};
  border-bottom: 2px solid ${e=>e.theme.colors.border};
`,nt=l.th`
  padding: ${e=>e.theme.spacing.md};
  text-align: ${e=>e.align||"left"};
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${e=>e.theme.colors.background};
  
  ${e=>e.width&&`width: ${e.width};`}
  
  ${e=>e.sortable&&`
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: ${e.theme.colors.border};
    }
  `}
`,gn=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,fn=l.div`
  display: flex;
  flex-direction: column;
  opacity: ${e=>e.active?1:.3};
  
  svg {
    width: 12px;
    height: 12px;
  }
`,bn=l.tbody``,vn=l.tr`
  transition: background-color 0.15s ease;
  
  &:hover {
    background: ${e=>e.theme.colors.background};
  }
  
  ${e=>e.selected&&`
    background: ${e.theme.colors.primary}10;
  `}
`,fe=l.td`
  padding: ${e=>e.theme.spacing.md};
  text-align: ${e=>e.align||"left"};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
  vertical-align: top;
  
  &:first-child {
    border-left: none;
  }
  
  &:last-child {
    border-right: none;
  }
`,rt=l.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`,jn=l.div`
  text-align: center;
  padding: ${e=>e.theme.spacing.xl};
  color: ${e=>e.theme.colors.textSecondary};
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: ${e=>e.theme.spacing.md};
    opacity: 0.3;
  }
`,yn=l.div`
  text-align: center;
  padding: ${e=>e.theme.spacing.xl};
  color: ${e=>e.theme.colors.textSecondary};
  
  .loading-spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid ${e=>e.theme.colors.border};
    border-top: 3px solid ${e=>e.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: ${e=>e.theme.spacing.md};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;function Ye({columns:e,data:s,loading:o=!1,emptyMessage:r="데이터가 없습니다.",selectable:n=!1,selectedItems:c=[],onSelectItems:a,onSort:i,sortField:x,sortDirection:p}){const u=m=>{a&&a(m?s:[])},d=(m,g)=>{a&&a(g?[...c,m]:c.filter(v=>v!==m))},b=m=>{if(!i)return;let g="asc";x===m&&p==="asc"&&(g="desc"),i(m,g)},h=s.length>0&&c.length===s.length,j=c.length>0&&c.length<s.length;return t.jsx(un,{children:t.jsxs(xn,{children:[t.jsx(mn,{children:t.jsxs("tr",{children:[n&&t.jsx(nt,{width:"40px",children:t.jsx(rt,{type:"checkbox",checked:h,ref:m=>{m&&(m.indeterminate=j)},onChange:m=>u(m.target.checked)})}),e.map(m=>t.jsx(nt,{width:m.width,align:m.align,sortable:m.sortable,onClick:()=>m.sortable&&b(String(m.key)),children:m.sortable?t.jsxs(gn,{children:[m.label,t.jsxs(fn,{active:x===m.key,direction:p,children:[t.jsx(Yt,{}),t.jsx(Gt,{})]})]}):m.label},String(m.key)))]})}),t.jsx(bn,{children:o?t.jsx("tr",{children:t.jsx(fe,{colSpan:e.length+(n?1:0),children:t.jsxs(yn,{children:[t.jsx("div",{className:"loading-spinner"}),t.jsx("div",{children:"로딩 중..."})]})})}):s.length===0?t.jsx("tr",{children:t.jsx(fe,{colSpan:e.length+(n?1:0),children:t.jsxs(jn,{children:[t.jsx("div",{className:"empty-icon",children:"📋"}),t.jsx("div",{children:r})]})})}):s.map((m,g)=>{const v=c.includes(m);return t.jsxs(vn,{selected:v,children:[n&&t.jsx(fe,{children:t.jsx(rt,{type:"checkbox",checked:v,onChange:C=>d(m,C.target.checked)})}),e.map(C=>{const k=m[C.key],w=C.render?C.render(k,m):k;return t.jsx(fe,{align:C.align,children:w},String(C.key))})]},g)})})]})})}const $n=l.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${e=>e.theme.spacing.sm};
  border: none;
  border-radius: ${e=>e.theme.borderRadius.md};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  /* 크기별 스타일 */
  ${e=>{switch(e.size){case"sm":return`
          padding: 6px 12px;
          font-size: 0.875rem;
          min-height: 32px;
        `;case"lg":return`
          padding: 12px 24px;
          font-size: 1.125rem;
          min-height: 48px;
        `;default:return`
          padding: 8px 16px;
          font-size: 1rem;
          min-height: 40px;
        `}}}
  
  /* 변형별 스타일 */
  ${e=>{const{colors:s}=e.theme;switch(e.variant){case"secondary":return`
          background: ${s.gray};
          color: white;
          &:hover:not(:disabled) {
            background: ${s.gray}dd;
            transform: translateY(-1px);
          }
        `;case"success":return`
          background: ${s.success};
          color: white;
          &:hover:not(:disabled) {
            background: ${s.success}dd;
            transform: translateY(-1px);
          }
        `;case"warning":return`
          background: ${s.warning};
          color: white;
          &:hover:not(:disabled) {
            background: ${s.warning}dd;
            transform: translateY(-1px);
          }
        `;case"danger":return`
          background: ${s.error};
          color: white;
          &:hover:not(:disabled) {
            background: ${s.error}dd;
            transform: translateY(-1px);
          }
        `;case"outline":return`
          background: transparent;
          color: ${s.primary};
          border: 1px solid ${s.primary};
          &:hover:not(:disabled) {
            background: ${s.primary}10;
            transform: translateY(-1px);
          }
        `;default:return`
          background: linear-gradient(135deg, ${s.primary}, ${s.secondary});
          color: white;
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: ${e.theme.shadows.md};
          }
        `}}}
  
  /* 비활성화 상태 */
  ${e=>e.disabled&&`
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}
  
  /* 로딩 상태 */
  ${e=>e.loading&&`
    cursor: wait;
    &:hover {
      transform: none;
    }
  `}
`,wn=l.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`,T=({children:e,variant:s="primary",size:o="md",disabled:r=!1,loading:n=!1,onClick:c,type:a="button",className:i})=>t.jsxs($n,{variant:s,size:o,disabled:r||n,loading:n,onClick:c,type:a,className:i,children:[n&&t.jsx(wn,{}),e]}),kn=l.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${e=>e.theme.spacing.xs};
  margin-top: ${e=>e.theme.spacing.lg};
`,De=l.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  background: ${e=>e.active?e.theme.colors.primary:e.theme.colors.surface};
  color: ${e=>e.active?"white":e.theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${e=>e.active?e.theme.colors.primary:e.theme.colors.background};
    border-color: ${e=>e.theme.colors.primary};
  }

  &:disabled {
    background: ${e=>e.theme.colors.background};
    color: ${e=>e.theme.colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`,Cn=l.span`
  margin: 0 ${e=>e.theme.spacing.md};
  font-size: 0.9rem;
  color: ${e=>e.theme.colors.textSecondary};
`,Ge=({currentPage:e,totalPages:s,onPageChange:o,className:r})=>{const n=()=>{const i=[],x=[];for(let p=Math.max(2,e-2);p<=Math.min(s-1,e+2);p++)i.push(p);return e-2>2?x.push(1,"..."):x.push(1),x.push(...i),e+2<s-1?x.push("...",s):s>1&&x.push(s),x};if(s<=1)return null;const c=n();return t.jsxs(kn,{className:r,children:[t.jsx(De,{disabled:e===1,onClick:()=>o(e-1),children:t.jsx(ht,{})}),c.map((a,i)=>t.jsx(R.Fragment,{children:a==="..."?t.jsx(Cn,{children:"..."}):t.jsx(De,{active:a===e,onClick:()=>o(a),children:a})},i)),t.jsx(De,{disabled:e===s,onClick:()=>o(e+1),children:t.jsx(Vt,{})})]})},Nn=l.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`,oe=l.div`
  margin-bottom: 16px;
`,ae=l.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
`,ie=l.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,Sn=l.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`,ot=l.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  
  ${e=>e.variant==="primary"?`
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background-color: #2563eb;
    }
  `:`
    background-color: white;
    color: #374151;
    border-color: #d1d5db;
    
    &:hover {
      background-color: #f9fafb;
    }
  `}
`,En=({item:e,onSubmit:s,onCancel:o})=>{const[r,n]=f.useState({itemName:(e==null?void 0:e.itemName)||"",category:(e==null?void 0:e.category)||"",quantity:(e==null?void 0:e.quantity)||0,unit:(e==null?void 0:e.unit)||"",location:(e==null?void 0:e.location)||"",description:(e==null?void 0:e.description)||""}),c=i=>{i.preventDefault(),s({...r,id:e==null?void 0:e.id})},a=(i,x)=>{n(p=>({...p,[i]:x}))};return t.jsxs(Nn,{children:[t.jsx("h3",{children:e?"재고 항목 수정":"재고 항목 추가"}),t.jsxs("form",{onSubmit:c,children:[t.jsxs(oe,{children:[t.jsx(ae,{children:"품목명"}),t.jsx(ie,{type:"text",value:r.itemName,onChange:i=>a("itemName",i.target.value),required:!0})]}),t.jsxs(oe,{children:[t.jsx(ae,{children:"카테고리"}),t.jsx(ie,{type:"text",value:r.category,onChange:i=>a("category",i.target.value),required:!0})]}),t.jsxs(oe,{children:[t.jsx(ae,{children:"수량"}),t.jsx(ie,{type:"number",value:r.quantity,onChange:i=>a("quantity",parseInt(i.target.value)||0),required:!0,min:"0"})]}),t.jsxs(oe,{children:[t.jsx(ae,{children:"단위"}),t.jsx(ie,{type:"text",value:r.unit,onChange:i=>a("unit",i.target.value),required:!0})]}),t.jsxs(oe,{children:[t.jsx(ae,{children:"보관 위치"}),t.jsx(ie,{type:"text",value:r.location,onChange:i=>a("location",i.target.value),required:!0})]}),t.jsxs(oe,{children:[t.jsx(ae,{children:"설명"}),t.jsx(ie,{type:"text",value:r.description,onChange:i=>a("description",i.target.value),placeholder:"선택사항"})]}),t.jsxs(Sn,{children:[t.jsx(ot,{type:"submit",variant:"primary",children:e?"수정":"추가"}),t.jsx(ot,{type:"button",variant:"secondary",onClick:o,children:"취소"})]})]})]})},Rn=l.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
`,Tn=l.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`,zn=l.input`
  width: 100%;
  padding: 8px 12px 8px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,In=l(gt)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
`,at=l.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,Ln=l.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
`,On=({searchTerm:e="",category:s="",location:o="",onSearchChange:r=()=>{},onCategoryChange:n=()=>{},onLocationChange:c=()=>{},onFilter:a=()=>{}})=>t.jsxs(Rn,{children:[t.jsxs(Tn,{children:[t.jsx(In,{}),t.jsx(zn,{type:"text",placeholder:"품목명으로 검색...",value:e,onChange:i=>r(i.target.value)})]}),t.jsxs(at,{value:s,onChange:i=>n(i.target.value),children:[t.jsx("option",{value:"",children:"전체 카테고리"}),t.jsx("option",{value:"사무용품",children:"사무용품"}),t.jsx("option",{value:"전자기기",children:"전자기기"}),t.jsx("option",{value:"소모품",children:"소모품"}),t.jsx("option",{value:"기타",children:"기타"})]}),t.jsxs(at,{value:o,onChange:i=>c(i.target.value),children:[t.jsx("option",{value:"",children:"전체 위치"}),t.jsx("option",{value:"창고A",children:"창고A"}),t.jsx("option",{value:"창고B",children:"창고B"}),t.jsx("option",{value:"사무실",children:"사무실"}),t.jsx("option",{value:"기타",children:"기타"})]}),t.jsxs(Ln,{onClick:a,children:[t.jsx(vt,{size:16}),"필터 적용"]})]}),Bn=(e=1,s=20,o={})=>{var x,p,u,d,b,h,j,m,g,v,C,k,w,S,B;const r=useQueryClient(),{data:n,isLoading:c,error:a,refetch:i}=se(["inventory",e,s,o],()=>Ue.getItems(e,s,o),{keepPreviousData:!0,staleTime:5*60*1e3});return{items:((x=n==null?void 0:n.data)==null?void 0:x.items)||[],total:((p=n==null?void 0:n.data)==null?void 0:p.total)||0,totalPages:((u=n==null?void 0:n.data)==null?void 0:u.totalPages)||0,hasNext:((d=n==null?void 0:n.data)==null?void 0:d.hasNext)||!1,hasPrev:((b=n==null?void 0:n.data)==null?void 0:b.hasPrev)||!1,stats:{totalItems:((j=(h=n==null?void 0:n.data)==null?void 0:h.items)==null?void 0:j.length)||0,receivedItems:((v=(g=(m=n==null?void 0:n.data)==null?void 0:m.items)==null?void 0:g.filter(O=>O.received))==null?void 0:v.length)||0,pendingItems:((w=(k=(C=n==null?void 0:n.data)==null?void 0:C.items)==null?void 0:k.filter(O=>!O.received))==null?void 0:w.length)||0,totalValue:((B=(S=n==null?void 0:n.data)==null?void 0:S.items)==null?void 0:B.reduce((O,I)=>O+I.totalPrice,0))||0},loading:c,error:a,refetch:i,invalidate:()=>{r.invalidateQueries("inventory")}}},it=l.div`
  padding: 20px;
`,Dn=l.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`,_n=l.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`,Mn=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,be=l(U)`
  text-align: center;
  background: linear-gradient(135deg, ${e=>e.theme.colors.primary} 0%, ${e=>e.theme.colors.secondary} 100%);
  color: white;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 5px;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`,An=()=>{const e=useQueryClient(),[s,o]=f.useState(1),[r,n]=f.useState({}),[c,a]=f.useState(!1),[i,x]=f.useState(null);f.useState([]);const{items:p,loading:u,error:d,totalPages:b,stats:h,refetch:j}=Bn(s,20,r),m=W(Ue.deleteItem,{onSuccess:()=>{e.invalidateQueries("inventory"),$.success("품목이 삭제되었습니다.")},onError:N=>{var L,D;$.error(((D=(L=N.response)==null?void 0:L.data)==null?void 0:D.message)||"삭제 중 오류가 발생했습니다.")}}),g=W(Ue.exportData,{onSuccess:N=>{const L=window.URL.createObjectURL(N),D=document.createElement("a");D.href=L,D.download=`inventory_${new Date().toISOString().split("T")[0]}.xlsx`,document.body.appendChild(D),D.click(),document.body.removeChild(D),window.URL.revokeObjectURL(L),$.success("Excel 파일이 다운로드되었습니다.")},onError:()=>{$.error("내보내기 중 오류가 발생했습니다.")}}),v=f.useMemo(()=>[{key:"no",label:"번호",sortable:!0,width:"80px"},{key:"itemName",label:"품목명",sortable:!0,render:(N,L)=>t.jsxs("div",{children:[t.jsx("div",{style:{fontWeight:"bold"},children:N}),L.specifications&&t.jsx("div",{style:{fontSize:"0.85rem",color:"#666"},children:L.specifications})]})},{key:"quantity",label:"수량",sortable:!0,width:"100px",render:N=>N.toLocaleString()},{key:"unitPrice",label:"단가",sortable:!0,width:"120px",render:N=>`₩${N.toLocaleString()}`},{key:"totalPrice",label:"총액",sortable:!0,width:"140px",render:N=>`₩${N.toLocaleString()}`},{key:"supplier",label:"공급업체",sortable:!0,width:"150px"},{key:"status",label:"상태",width:"100px",render:N=>t.jsx(Pn,{status:N,children:I(N)})},{key:"actions",label:"관리",width:"120px",render:(N,L)=>t.jsxs(Fn,{children:[t.jsx(T,{size:"sm",variant:"outline",onClick:()=>k(L),children:"수정"}),t.jsx(T,{size:"sm",variant:"danger",onClick:()=>w(L.no),children:"삭제"})]})}],[]),C=N=>{n(N),o(1)},k=N=>{x(N),a(!0)},w=async N=>{window.confirm("정말로 이 품목을 삭제하시겠습니까?")&&m.mutate(N)},S=()=>{g.mutate("inventory")},B=()=>{a(!1),x(null)},O=()=>{B(),j()},I=N=>({pending:"주문중",received:"수령완료",ordered:"발주완료"})[N]||N;return u?t.jsx(le,{}):d?t.jsx(it,{children:t.jsx(U,{children:t.jsxs("div",{style:{textAlign:"center",padding:"40px"},children:[t.jsx("p",{children:"데이터를 불러오는 중 오류가 발생했습니다."}),t.jsx(T,{onClick:()=>j(),children:"다시 시도"})]})})}):t.jsxs(it,{children:[t.jsx(X,{title:"품목 관리",subtitle:"전체 품목 현황을 관리하고 모니터링할 수 있습니다."}),t.jsxs(Mn,{children:[t.jsxs(be,{children:[t.jsx("h3",{children:(h==null?void 0:h.totalItems)||0}),t.jsx("p",{children:"전체 품목"})]}),t.jsxs(be,{children:[t.jsx("h3",{children:(h==null?void 0:h.receivedItems)||0}),t.jsx("p",{children:"수령 완료"})]}),t.jsxs(be,{children:[t.jsx("h3",{children:(h==null?void 0:h.pendingItems)||0}),t.jsx("p",{children:"주문 중"})]}),t.jsxs(be,{children:[t.jsxs("h3",{children:["₩",((h==null?void 0:h.totalValue)||0).toLocaleString()]}),t.jsx("p",{children:"총 금액"})]})]}),t.jsxs(U,{children:[t.jsxs(Dn,{children:[t.jsx(On,{onFilter:C}),t.jsxs(_n,{children:[t.jsxs(T,{variant:"outline",onClick:()=>j(),disabled:u,children:[t.jsx(Qe,{size:16}),"새로고침"]}),t.jsxs(T,{variant:"secondary",onClick:S,disabled:g.isLoading,children:[t.jsx(qe,{size:16}),"Excel 다운로드"]}),t.jsxs(T,{onClick:()=>a(!0),children:[t.jsx(He,{size:16}),"품목 추가"]})]})]}),t.jsx(Ye,{columns:v,data:p||[],loading:u,emptyMessage:"등록된 품목이 없습니다."}),t.jsx(Ge,{currentPage:s,totalPages:b,onPageChange:o})]}),t.jsx(Modal,{isOpen:c,onClose:B,title:i?"품목 수정":"새 품목 추가",size:"lg",children:t.jsx(En,{item:i,onSuccess:O,onCancel:B})})]})},Pn=l.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${({status:e,theme:s})=>{switch(e){case"received":return`
          background: ${s.colors.success}20;
          color: ${s.colors.success};
        `;case"pending":return`
          background: ${s.colors.warning}20;
          color: ${s.colors.warning};
        `;default:return`
          background: ${s.colors.gray}20;
          color: ${s.colors.gray};
        `}}}
`,Fn=l.div`
  display: flex;
  gap: 5px;
`,Un=l.div`
  padding: 20px;
`,Qn=l.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`,qn=l.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`,Hn=()=>{var a,i;const[e,s]=f.useState(1),{data:o,isLoading:r,error:n}=se({queryKey:["receipts",e],queryFn:()=>sn.getReceipts(e,20),keepPreviousData:!0}),c=[{key:"receiptNumber",label:"수령번호",sortable:!0,width:"120px"},{key:"itemName",label:"품목명",sortable:!0},{key:"receivedQuantity",label:"수령수량",width:"100px",render:(x,p)=>`${x}/${p.expectedQuantity}`},{key:"receiverName",label:"수령자",width:"100px"},{key:"department",label:"부서",width:"100px"},{key:"receivedDate",label:"수령일",width:"120px",render:x=>new Date(x).toLocaleDateString("ko-KR")}];return r?t.jsx(le,{}):t.jsxs(Un,{children:[t.jsx(X,{title:"수령 관리",subtitle:"물품 수령 현황을 확인하고 관리할 수 있습니다."}),t.jsxs(Card,{children:[t.jsx(Qn,{children:t.jsxs(qn,{children:[t.jsxs(Button,{variant:"secondary",children:[t.jsx(qe,{size:16}),"Excel 다운로드"]}),t.jsxs(Button,{children:[t.jsx(He,{size:16}),"수령 등록"]})]})}),t.jsx(Ye,{columns:c,data:((a=o==null?void 0:o.data)==null?void 0:a.items)||[],loading:r,emptyMessage:"수령 내역이 없습니다."}),t.jsx(Ge,{currentPage:e,totalPages:((i=o==null?void 0:o.data)==null?void 0:i.totalPages)||0,onPageChange:s})]})]})},Yn=l.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,Gn=l.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`,Vn=l.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
`,we=({label:e,value:s,options:o,onChange:r,placeholder:n="선택하세요",disabled:c=!1,required:a=!1,className:i})=>{const x=p=>{r&&r(p.target.value)};return t.jsxs(Yn,{className:i,children:[e&&t.jsxs(Gn,{children:[e,a&&t.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),t.jsxs(Vn,{value:s||"",onChange:x,disabled:c,required:a,children:[n&&t.jsx("option",{value:"",disabled:!0,children:n}),o.map(p=>t.jsx("option",{value:p.value,disabled:p.disabled,children:p.label},p.value))]})]})},Ve={draft:"임시저장",submitted:"제출됨",pending_approval:"승인대기",approved:"승인됨",rejected:"거절됨",cancelled:"취소됨",purchased:"구매완료",received:"수령완료",closed:"완료"},Re={low:"낮음",normal:"보통",high:"높음",emergency:"긴급"},lt={draft:"#6B7280",submitted:"#3B82F6",pending_approval:"#F59E0B",approved:"#10B981",rejected:"#EF4444",cancelled:"#6B7280",purchased:"#8B5CF6",received:"#059669",closed:"#374151"},ct={low:"#10B981",normal:"#3B82F6",high:"#F59E0B",emergency:"#EF4444"},Tt={office_supplies:"사무용품",it_equipment:"IT장비",furniture:"가구",facility:"시설관리",marketing:"마케팅",travel:"출장",training:"교육",maintenance:"유지보수",software:"소프트웨어",service:"서비스",other:"기타"},Kn=l.form`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
`,Wn=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${e=>e.theme.spacing.md};
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`,dt=l.div`
  grid-column: 1 / -1;
`,Xn=l.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border: 2px solid ${e=>e.hasError?e.theme.colors.error:e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  background: ${e=>e.theme.colors.surface};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.hasError?e.theme.colors.error:e.theme.colors.primary};
    box-shadow: 0 0 0 3px ${e=>e.hasError?e.theme.colors.error:e.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.colors.textSecondary};
  }
`,Jn=l.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  padding-top: ${e=>e.theme.spacing.md};
  border-top: 1px solid ${e=>e.theme.colors.border};
`,Zn=Object.entries(Tt).map(([e,s])=>({value:e,label:s})),er=Object.entries(Re).map(([e,s])=>({value:e,label:s})),tr=[{value:"direct",label:"직접구매"},{value:"quotation",label:"견적요청"},{value:"contract",label:"계약"},{value:"framework",label:"단가계약"},{value:"marketplace",label:"마켓플레이스"}],sr=({request:e,onSuccess:s,onCancel:o})=>{const r=useQueryClient(),[n,c]=f.useState({itemName:(e==null?void 0:e.itemName)||"",specifications:(e==null?void 0:e.specifications)||"",quantity:(e==null?void 0:e.quantity)||1,estimatedPrice:(e==null?void 0:e.estimatedPrice)||0,preferredSupplier:(e==null?void 0:e.preferredSupplier)||"",category:(e==null?void 0:e.category)||"office_supplies",urgency:(e==null?void 0:e.urgency)||"medium",justification:(e==null?void 0:e.justification)||"",department:(e==null?void 0:e.department)||"",project:(e==null?void 0:e.project)||"",budgetCode:(e==null?void 0:e.budgetCode)||"",expectedDeliveryDate:e!=null&&e.expectedDeliveryDate?new Date(e.expectedDeliveryDate).toISOString().split("T")[0]:"",purchaseMethod:(e==null?void 0:e.purchaseMethod)||"direct"}),a=W(te.createRequest,{onSuccess:()=>{r.invalidateQueries("purchase-requests"),$.success("구매 요청이 등록되었습니다."),s()},onError:d=>{var b,h;$.error(((h=(b=d.response)==null?void 0:b.data)==null?void 0:h.message)||"등록 중 오류가 발생했습니다.")}}),i=W(d=>te.updateRequest(e.id,d),{onSuccess:()=>{r.invalidateQueries("purchase-requests"),$.success("구매 요청이 수정되었습니다."),s()},onError:d=>{var b,h;$.error(((h=(b=d.response)==null?void 0:b.data)==null?void 0:h.message)||"수정 중 오류가 발생했습니다.")}}),x=d=>{d.preventDefault();const b={...n,estimatedPrice:Number(n.estimatedPrice),quantity:Number(n.quantity)};e?i.mutate(b):a.mutate(b)},p=(d,b)=>{c(h=>({...h,[d]:b}))},u=a.isLoading||i.isLoading;return t.jsxs(Kn,{onSubmit:x,children:[t.jsxs(Wn,{children:[t.jsx(Input,{label:"품목명",value:n.itemName,onChange:d=>p("itemName",d.target.value),required:!0}),t.jsx(Input,{label:"수량",type:"number",value:n.quantity,onChange:d=>p("quantity",Number(d.target.value)),required:!0}),t.jsx(dt,{children:t.jsx(Input,{label:"사양",value:n.specifications,onChange:d=>p("specifications",d.target.value)})}),t.jsx(Input,{label:"예상 단가",type:"number",value:n.estimatedPrice,onChange:d=>p("estimatedPrice",Number(d.target.value))}),t.jsx(Input,{label:"선호 공급업체",value:n.preferredSupplier,onChange:d=>p("preferredSupplier",d.target.value)}),t.jsx(we,{label:"카테고리",value:n.category,options:Zn,onChange:d=>p("category",d)}),t.jsx(we,{label:"긴급도",value:n.urgency,options:er,onChange:d=>p("urgency",d)}),t.jsx(Input,{label:"부서",value:n.department,onChange:d=>p("department",d.target.value),required:!0}),t.jsx(Input,{label:"프로젝트",value:n.project||"",onChange:d=>p("project",d.target.value)}),t.jsx(Input,{label:"예산 코드",value:n.budgetCode||"",onChange:d=>p("budgetCode",d.target.value)}),t.jsx(Input,{label:"희망 납기일",type:"date",value:n.expectedDeliveryDate||"",onChange:d=>p("expectedDeliveryDate",d.target.value)}),t.jsx(we,{label:"구매방법",value:n.purchaseMethod,options:tr,onChange:d=>p("purchaseMethod",d)}),t.jsx(dt,{children:t.jsxs("div",{children:[t.jsx("label",{children:"구매 사유"}),t.jsx(Xn,{value:n.justification,onChange:d=>p("justification",d.target.value),placeholder:"구매가 필요한 사유를 상세히 입력해주세요...",required:!0})]})})]}),t.jsxs(Jn,{children:[t.jsx(T,{type:"button",variant:"outline",onClick:o,children:"취소"}),t.jsx(T,{type:"submit",loading:u,children:e?"수정":"등록"})]})]})},nr=l.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,rr=l.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`,or=l.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`,ve=({label:e,type:s="text",value:o,onChange:r,placeholder:n,disabled:c=!1,required:a=!1,className:i})=>t.jsxs(nr,{className:i,children:[e&&t.jsxs(rr,{children:[e,a&&t.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),t.jsx(or,{type:s,value:o||"",onChange:r,placeholder:n,disabled:c,required:a})]}),ar=l.div`
  display: flex;
  gap: ${e=>e.theme.spacing.md};
  align-items: end;
  flex-wrap: wrap;
`;[...Object.entries(Ve).map(([e,s])=>({value:e,label:s}))];const ir=[{value:"",label:"전체 긴급도"},...Object.entries(Re).map(([e,s])=>({value:e,label:s}))],lr=({onFilter:e})=>{const[s,o]=f.useState({}),r=(c,a)=>{const i={...s,[c]:a||void 0};o(i),e(i)},n=()=>{o({}),e({})};return t.jsxs(ar,{children:[t.jsx(ve,{placeholder:"품목명 또는 요청번호로 검색...",value:s.search||"",onChange:c=>r("search",c.target.value)}),t.jsx(we,{placeholder:"긴급도",value:s.urgency||"",options:ir,onChange:c=>r("urgency",c)}),t.jsx(ve,{placeholder:"부서",value:s.department||"",onChange:c=>r("department",c.target.value)}),t.jsx(ve,{label:"시작일",type:"date",value:s.dateFrom||"",onChange:c=>r("dateFrom",c.target.value)}),t.jsx(ve,{label:"종료일",type:"date",value:s.dateTo||"",onChange:c=>r("dateTo",c.target.value)}),t.jsxs(T,{variant:"outline",onClick:n,children:[t.jsx(vt,{size:16}),"초기화"]})]})},cr=l.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${e=>e.isOpen?"flex":"none"};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${e=>e.theme.spacing.lg};
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`,dr=l.div`
  background: ${e=>e.theme.colors.surface};
  border-radius: ${e=>e.theme.borderRadius.lg};
  box-shadow: ${e=>e.theme.shadows.lg};
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
  position: relative;
  
  ${e=>{switch(e.size){case"sm":return"width: 100%; max-width: 400px;";case"lg":return"width: 100%; max-width: 800px;";case"xl":return"width: 100%; max-width: 1200px;";default:return"width: 100%; max-width: 600px;"}}}
  
  @keyframes slideIn {
    from {
      transform: scale(0.95) translateY(-10px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    margin: ${e=>e.theme.spacing.md};
    max-width: calc(100vw - ${e=>e.theme.spacing.lg});
  }
`,pr=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${e=>e.theme.spacing.lg};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
`,hr=l.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  margin: 0;
`,ur=l.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${e=>e.theme.colors.background};
    color: ${e=>e.theme.colors.text};
  }
`,xr=l.div`
  padding: ${e=>e.theme.spacing.lg};
`,zt=({isOpen:e,onClose:s,title:o,children:r,size:n="md",closable:c=!0})=>{f.useEffect(()=>{const i=x=>{x.key==="Escape"&&c&&s()};return e&&(document.addEventListener("keydown",i),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",i),document.body.style.overflow="unset"}},[e,s,c]);const a=i=>{i.target===i.currentTarget&&c&&s()};return e?t.jsx(cr,{isOpen:e,onClick:a,children:t.jsxs(dr,{size:n,children:[t.jsxs(pr,{children:[t.jsx(hr,{children:o}),c&&t.jsx(ur,{onClick:s,children:t.jsx(ke,{size:20})})]}),t.jsx(xr,{children:r})]})}):null},mr=l.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
`,gr=l.div`
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.background};
  border-radius: ${e=>e.theme.borderRadius.md};
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${e=>e.theme.spacing.sm};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .label {
    font-weight: 500;
    color: ${e=>e.theme.colors.textSecondary};
  }
  
  .value {
    font-weight: 600;
    color: ${e=>e.theme.colors.text};
  }
`,fr=l.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
`,br=l.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${e=>e.theme.spacing.sm} ${e=>e.theme.spacing.md};
  border: 2px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  background: ${e=>e.theme.colors.surface};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.colors.textSecondary};
  }
`,vr=l.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  padding-top: ${e=>e.theme.spacing.md};
  border-top: 1px solid ${e=>e.theme.colors.border};
`,jr=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.warning}10;
  border: 1px solid ${e=>e.theme.colors.warning}30;
  border-radius: ${e=>e.theme.borderRadius.md};
  color: ${e=>e.theme.colors.warning};
  
  svg {
    flex-shrink: 0;
  }
`,yr=({request:e,isOpen:s,onClose:o,onSubmit:r,loading:n=!1})=>{const[c,a]=f.useState(null),[i,x]=f.useState(""),p=()=>{c&&r(c,i||void 0)},u=()=>{a(null),x(""),o()};return t.jsx(zt,{isOpen:s,onClose:u,title:"구매 요청 승인",size:"lg",children:t.jsxs(mr,{children:[t.jsxs(gr,{children:[t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"요청번호:"}),t.jsx("span",{className:"value",children:e.requestNumber})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"품목명:"}),t.jsx("span",{className:"value",children:e.itemName})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"수량:"}),t.jsxs("span",{className:"value",children:[e.quantity.toLocaleString(),"개"]})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"예상금액:"}),t.jsxs("span",{className:"value",children:["₩",e.totalBudget.toLocaleString()]})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"요청자:"}),t.jsxs("span",{className:"value",children:[e.requesterName," (",e.department,")"]})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"요청일:"}),t.jsx("span",{className:"value",children:new Date(e.requestDate).toLocaleDateString("ko-KR")})]})]}),e.justification&&t.jsxs("div",{children:[t.jsx("h4",{children:"구매 사유"}),t.jsx("p",{style:{padding:"12px",background:"#f8fafc",borderRadius:"8px"},children:e.justification})]}),t.jsxs(fr,{children:[t.jsx("label",{htmlFor:"comments",children:"승인/거절 의견"}),t.jsx(br,{id:"comments",value:i,onChange:d=>x(d.target.value),placeholder:"승인 또는 거절 사유를 입력해주세요... (선택사항)"})]}),c==="reject"&&t.jsxs(jr,{children:[t.jsx(bt,{size:20}),t.jsx("span",{children:"거절 시 요청자에게 알림이 전송되며, 요청이 거절 상태로 변경됩니다."})]}),t.jsxs(vr,{children:[t.jsx(T,{variant:"outline",onClick:u,children:"취소"}),t.jsxs(T,{variant:"danger",onClick:()=>a("reject"),disabled:n,children:[t.jsx(ke,{size:16}),"거절"]}),t.jsxs(T,{variant:"success",onClick:()=>a("approve"),disabled:n,children:[t.jsx(de,{size:16}),"승인"]}),c&&t.jsx(T,{onClick:p,loading:n,variant:c==="approve"?"success":"danger",children:c==="approve"?"승인 확정":"거절 확정"})]})]})})},$r=l.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
`,je=l.div`
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.background};
  border-radius: ${e=>e.theme.borderRadius.md};
  
  h3 {
    margin-bottom: ${e=>e.theme.spacing.md};
    color: ${e=>e.theme.colors.text};
    font-size: 1.1rem;
    font-weight: 600;
  }
`,_e=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${e=>e.theme.spacing.md};
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`,A=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
  
  .icon {
    color: ${e=>e.theme.colors.primary};
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 0.85rem;
      color: ${e=>e.theme.colors.textSecondary};
      margin-bottom: 2px;
    }
    
    .value {
      font-weight: 500;
      color: ${e=>e.theme.colors.text};
    }
  }
`,wr=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${e=>{switch(e.status){case"pending_approval":return"#F59E0B20";case"approved":return"#10B98120";case"rejected":return"#EF444420";default:return"#6B728020"}}};
  color: ${e=>{switch(e.status){case"pending_approval":return"#F59E0B";case"approved":return"#10B981";case"rejected":return"#EF4444";default:return"#6B7280"}}};
`,kr=l.div`
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  line-height: 1.6;
`,Cr=l.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  padding-top: ${e=>e.theme.spacing.md};
  border-top: 1px solid ${e=>e.theme.colors.border};
`,Nr=({request:e,isOpen:s,onClose:o,onEdit:r,onApprove:n})=>{const c=["draft","submitted","rejected"].includes(e.status),a=e.status==="pending_approval";return t.jsx(zt,{isOpen:s,onClose:o,title:"구매 요청 상세",size:"lg",children:t.jsxs($r,{children:[t.jsxs(je,{children:[t.jsx("h3",{children:"기본 정보"}),t.jsxs(_e,{children:[t.jsxs(A,{children:[t.jsx(ue,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"요청번호"}),t.jsx("div",{className:"value",children:e.requestNumber})]})]}),t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"상태"}),t.jsx(wr,{status:e.status,children:Ve[e.status]})]})}),t.jsxs(A,{children:[t.jsx(Kt,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"요청자"}),t.jsx("div",{className:"value",children:e.requesterName})]})]}),t.jsxs(A,{children:[t.jsx(Wt,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"요청일"}),t.jsx("div",{className:"value",children:new Date(e.requestDate).toLocaleDateString("ko-KR")})]})]})]})]}),t.jsxs(je,{children:[t.jsx("h3",{children:"품목 정보"}),t.jsxs(_e,{children:[t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"품목명"}),t.jsx("div",{className:"value",children:e.itemName})]})}),t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"수량"}),t.jsxs("div",{className:"value",children:[e.quantity.toLocaleString(),"개"]})]})}),e.specifications&&t.jsx(A,{style:{gridColumn:"1 / -1"},children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"사양"}),t.jsx("div",{className:"value",children:e.specifications})]})}),t.jsxs(A,{children:[t.jsx(ft,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"예상금액"}),t.jsxs("div",{className:"value",children:["₩",e.totalBudget.toLocaleString()]})]})]}),t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"카테고리"}),t.jsx("div",{className:"value",children:Tt[e.category]})]})}),t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"긴급도"}),t.jsx("div",{className:"value",children:Re[e.urgency]})]})}),e.preferredSupplier&&t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"선호 공급업체"}),t.jsx("div",{className:"value",children:e.preferredSupplier})]})})]})]}),t.jsxs(je,{children:[t.jsx("h3",{children:"부서 및 프로젝트 정보"}),t.jsxs(_e,{children:[t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"부서"}),t.jsx("div",{className:"value",children:e.department})]})}),e.project&&t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"프로젝트"}),t.jsx("div",{className:"value",children:e.project})]})}),e.budgetCode&&t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"예산 코드"}),t.jsx("div",{className:"value",children:e.budgetCode})]})}),e.expectedDeliveryDate&&t.jsx(A,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"희망 납기일"}),t.jsx("div",{className:"value",children:new Date(e.expectedDeliveryDate).toLocaleDateString("ko-KR")})]})})]})]}),e.justification&&t.jsxs(je,{children:[t.jsx("h3",{children:"구매 사유"}),t.jsx(kr,{children:e.justification})]}),t.jsxs(Cr,{children:[t.jsx(T,{variant:"outline",onClick:o,children:"닫기"}),c&&r&&t.jsxs(T,{variant:"outline",onClick:r,children:[t.jsx(jt,{size:16}),"수정"]}),a&&n&&t.jsxs(T,{variant:"success",onClick:n,children:[t.jsx(de,{size:16}),"승인처리"]})]})]})})},Sr=(e=1,s=20,o={})=>{var p,u,d,b,h;const r=useQueryClient(),{data:n,isLoading:c,error:a,refetch:i}=se(["purchase-requests",e,s,o],()=>te.getRequests(e,s,o),{keepPreviousData:!0,staleTime:5*60*1e3}),{data:x}=se(["purchase-requests-stats"],()=>te.getStats(),{staleTime:10*60*1e3});return{requests:((p=n==null?void 0:n.data)==null?void 0:p.items)||[],total:((u=n==null?void 0:n.data)==null?void 0:u.total)||0,totalPages:((d=n==null?void 0:n.data)==null?void 0:d.totalPages)||0,hasNext:((b=n==null?void 0:n.data)==null?void 0:b.hasNext)||!1,hasPrev:((h=n==null?void 0:n.data)==null?void 0:h.hasPrev)||!1,stats:(x==null?void 0:x.data)||{total:0,pending:0,approved:0,rejected:0,thisMonth:0,lastMonth:0},loading:c,error:a,refetch:i,invalidate:()=>{r.invalidateQueries("purchase-requests"),r.invalidateQueries("purchase-requests-stats")}}},pt=l.div`
  padding: 20px;
`,Er=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,ye=l(U)`
  text-align: center;
  background: ${e=>e.color?`linear-gradient(135deg, ${e.color}20 0%, ${e.color}10 100%)`:"white"};
  border-left: 4px solid ${e=>e.color||e.theme.colors.primary};
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 15px;
    color: ${e=>e.color||e.theme.colors.primary};
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: ${e=>e.color||e.theme.colors.primary};
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: ${e=>e.theme.colors.textSecondary};
  }
  
  .stat-change {
    font-size: 0.8rem;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 12px;
    
    &.positive {
      background: ${e=>e.theme.colors.success}20;
      color: ${e=>e.theme.colors.success};
    }
    
    &.negative {
      background: ${e=>e.theme.colors.error}20;
      color: ${e=>e.theme.colors.error};
    }
  }
`,Rr=l.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`,Tr=l.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`,zr=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${e=>lt[e.status]}20;
  color: ${e=>lt[e.status]};
`,Ir=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${e=>ct[e.urgency]}20;
  color: ${e=>ct[e.urgency]};
`,Lr=l.div`
  display: flex;
  gap: 5px;
`,Or=l.span`
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
`,Br=l.div`
  .request-title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .request-meta {
    font-size: 0.85rem;
    color: ${e=>e.theme.colors.textSecondary};
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`,Dr=()=>{const e=is(),[s,o]=f.useState(1),[r,n]=f.useState({}),[c,a]=f.useState(!1),[i,x]=f.useState(null),[p,u]=f.useState(null),[d,b]=f.useState(null),[h,j]=f.useState([]),{requests:m,loading:g,error:v,totalPages:C,stats:k,refetch:w}=Sr(s,20,r),S=W(te.deleteRequest,{onSuccess:()=>{e.invalidateQueries("purchase-requests"),$.success("구매 요청이 삭제되었습니다.")},onError:y=>{var z,G;$.error(((G=(z=y.response)==null?void 0:z.data)==null?void 0:G.message)||"삭제 중 오류가 발생했습니다.")}}),B=W(te.approveRequest,{onSuccess:()=>{e.invalidateQueries("purchase-requests"),b(null),$.success("구매 요청이 처리되었습니다.")},onError:y=>{var z,G;$.error(((G=(z=y.response)==null?void 0:z.data)==null?void 0:G.message)||"승인 처리 중 오류가 발생했습니다.")}}),O=W(te.exportRequests,{onSuccess:y=>{const z=window.URL.createObjectURL(y),G=document.createElement("a");G.href=z,G.download=`purchase_requests_${new Date().toISOString().split("T")[0]}.xlsx`,document.body.appendChild(G),G.click(),document.body.removeChild(G),window.URL.revokeObjectURL(z),$.success("Excel 파일이 다운로드되었습니다.")},onError:()=>{$.error("내보내기 중 오류가 발생했습니다.")}}),I=f.useMemo(()=>[{key:"requestNumber",label:"요청번호",sortable:!0,width:"120px",render:y=>t.jsx("span",{style:{fontFamily:"monospace",fontSize:"0.9rem"},children:y})},{key:"itemName",label:"품목 정보",sortable:!0,render:(y,z)=>t.jsxs(Br,{children:[t.jsx("div",{className:"request-title",children:y}),t.jsxs("div",{className:"request-meta",children:[t.jsxs("span",{children:["수량: ",z.quantity.toLocaleString(),"개"]}),z.specifications&&t.jsxs("span",{children:["사양: ",z.specifications]})]})]})},{key:"totalBudget",label:"예상금액",sortable:!0,width:"120px",align:"right",render:y=>t.jsxs(Or,{children:["₩",y.toLocaleString()]})},{key:"requesterName",label:"요청자",sortable:!0,width:"100px",render:(y,z)=>t.jsxs("div",{children:[t.jsx("div",{style:{fontWeight:"500"},children:y}),t.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:z.department})]})},{key:"urgency",label:"긴급도",width:"80px",render:y=>t.jsxs(Ir,{urgency:y,children:[y==="emergency"&&t.jsx(Xt,{size:12}),Re[y]]})},{key:"status",label:"상태",width:"120px",render:y=>t.jsxs(zr,{status:y,children:[y==="pending_approval"&&t.jsx(Ae,{size:12}),y==="approved"&&t.jsx(de,{size:12}),y==="rejected"&&t.jsx(ke,{size:12}),Ve[y]]})},{key:"requestDate",label:"요청일",sortable:!0,width:"100px",render:y=>new Date(y).toLocaleDateString("ko-KR")},{key:"actions",label:"관리",width:"150px",render:(y,z)=>t.jsxs(Lr,{children:[t.jsx(T,{size:"sm",variant:"outline",onClick:()=>L(z),title:"상세보기",children:t.jsx(Jt,{size:14})}),t.jsx(T,{size:"sm",variant:"outline",onClick:()=>D(z),disabled:!K(z),title:"수정",children:t.jsx(jt,{size:14})}),It(z)&&t.jsx(T,{size:"sm",variant:"success",onClick:()=>q(z),title:"승인처리",children:t.jsx(de,{size:14})}),t.jsx(T,{size:"sm",variant:"danger",onClick:()=>P(z.id),disabled:!re(z),title:"삭제",children:t.jsx(Zt,{size:14})})]})}],[]),N=y=>{n(y),o(1)},L=y=>{u(y)},D=y=>{x(y),a(!0)},P=async y=>{window.confirm("정말로 이 구매 요청을 삭제하시겠습니까?")&&S.mutate(y)},q=y=>{b(y)},_=()=>{O.mutate(r)},H=()=>{a(!1),x(null)},M=()=>{H(),w()},Y=(y,z)=>{d&&B.mutate({requestId:d.id,action:y,comments:z})},K=y=>["draft","submitted","rejected"].includes(y.status),re=y=>["draft","submitted","rejected"].includes(y.status),It=y=>y.status==="pending_approval";return g?t.jsx(le,{}):v?t.jsx(pt,{children:t.jsx(U,{children:t.jsxs("div",{style:{textAlign:"center",padding:"40px"},children:[t.jsx("p",{children:"데이터를 불러오는 중 오류가 발생했습니다."}),t.jsx(T,{onClick:()=>w(),children:"다시 시도"})]})})}):t.jsxs(pt,{children:[t.jsx(X,{title:"구매 요청 관리",subtitle:"구매 요청을 등록하고 승인 프로세스를 관리할 수 있습니다."}),t.jsxs(Er,{children:[t.jsxs(ye,{color:"#3B82F6",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(yt,{size:24}),t.jsx("span",{children:"전체 요청"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.total)||0}),t.jsx("div",{className:"stat-label",children:"총 구매 요청"}),t.jsxs("div",{className:"stat-change positive",children:["이번 달 +",(k==null?void 0:k.thisMonth)||0]})]}),t.jsxs(ye,{color:"#F59E0B",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(Ae,{size:24}),t.jsx("span",{children:"승인 대기"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.pending)||0}),t.jsx("div",{className:"stat-label",children:"처리 대기중"})]}),t.jsxs(ye,{color:"#10B981",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(de,{size:24}),t.jsx("span",{children:"승인 완료"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.approved)||0}),t.jsx("div",{className:"stat-label",children:"승인된 요청"})]}),t.jsxs(ye,{color:"#EF4444",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(ke,{size:24}),t.jsx("span",{children:"거절됨"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.rejected)||0}),t.jsx("div",{className:"stat-label",children:"거절된 요청"})]})]}),t.jsxs(U,{children:[t.jsxs(Rr,{children:[t.jsx(lr,{onFilter:N}),t.jsxs(Tr,{children:[t.jsxs(T,{variant:"outline",onClick:()=>w(),disabled:g,children:[t.jsx(Qe,{size:16}),"새로고침"]}),t.jsxs(T,{variant:"secondary",onClick:_,disabled:O.isLoading,children:[t.jsx(qe,{size:16}),"Excel 다운로드"]}),t.jsxs(T,{onClick:()=>a(!0),children:[t.jsx(He,{size:16}),"구매 요청"]})]})]}),t.jsx(Ye,{columns:I,data:m||[],loading:g,emptyMessage:"등록된 구매 요청이 없습니다.",selectable:!0,selectedItems:h,onSelectItems:j}),t.jsx(Ge,{currentPage:s,totalPages:C,onPageChange:o})]}),t.jsx(Modal,{isOpen:c,onClose:H,title:i?"구매 요청 수정":"새 구매 요청",size:"lg",children:t.jsx(sr,{request:i,onSuccess:M,onCancel:H})}),p&&t.jsx(Nr,{request:p,isOpen:!!p,onClose:()=>u(null),onEdit:()=>{x(p),u(null),a(!0)},onApprove:()=>{b(p),u(null)}}),d&&t.jsx(yr,{request:d,isOpen:!!d,onClose:()=>b(null),onSubmit:Y,loading:B.isLoading})]})},_r=l.div`
  padding: 20px;
`,Mr=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: ${e=>e.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`,Ar=l.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${e=>e.theme.spacing.md};
  border: 2px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  background: ${e=>e.theme.colors.surface};
  color: ${e=>e.theme.colors.text};
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${e=>e.theme.colors.primary};
    box-shadow: 0 0 0 3px ${e=>e.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${e=>e.theme.colors.textSecondary};
  }
`,Pr=l(U)`
  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${e=>e.theme.colors.border};
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .label {
    font-weight: 500;
    color: ${e=>e.theme.colors.textSecondary};
  }
  
  .value {
    font-weight: 600;
    color: ${e=>e.theme.colors.text};
  }
`,Fr=()=>{const[e,s]=f.useState(""),[o,r]=f.useState(null),n=W({mutationFn:rn.parseMessage,onSuccess:i=>{r(i.data),$.success("메시지가 성공적으로 파싱되었습니다.")},onError:i=>{var x,p;$.error(((p=(x=i.response)==null?void 0:x.data)==null?void 0:p.message)||"파싱 중 오류가 발생했습니다.")}}),c=()=>{if(!e.trim()){$.error("메시지를 입력해주세요.");return}n.mutate(e)},a=()=>{s(""),r(null)};return t.jsxs(_r,{children:[t.jsx(X,{title:"카카오톡 메시지 처리",subtitle:"카카오톡 메시지를 파싱하여 수령 정보를 추출합니다."}),t.jsxs(Mr,{children:[t.jsxs(U,{children:[t.jsx("h3",{children:"메시지 입력"}),t.jsx(Ar,{value:e,onChange:i=>s(i.target.value),placeholder:"카카오톡 메시지를 여기에 붙여넣기 하세요..."}),t.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"20px"},children:[t.jsxs(T,{onClick:c,loading:n.isPending,disabled:!e.trim(),children:[t.jsx(es,{size:16}),"파싱하기"]}),t.jsxs(T,{variant:"outline",onClick:a,children:[t.jsx(Qe,{size:16}),"초기화"]})]})]}),t.jsxs(Pr,{children:[t.jsx("h3",{children:"파싱 결과"}),o?t.jsxs("div",{children:[o.itemNo&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"품목번호:"}),t.jsx("span",{className:"value",children:o.itemNo})]}),o.itemName&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"품목명:"}),t.jsx("span",{className:"value",children:o.itemName})]}),o.quantity&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"수량:"}),t.jsxs("span",{className:"value",children:[o.quantity,"개"]})]}),o.receiver&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"수령자:"}),t.jsx("span",{className:"value",children:o.receiver})]}),o.notes&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"메모:"}),t.jsx("span",{className:"value",children:o.notes})]})]}):t.jsxs("div",{style:{textAlign:"center",color:"#666",padding:"40px"},children:[t.jsx(ut,{size:48,style:{opacity:.3,marginBottom:"16px"}}),t.jsx("p",{children:"메시지를 파싱하면 결과가 여기에 표시됩니다."})]})]})]})]})},Ur=l.div`
  padding: 20px;
`,Qr=l.div`
  border: 2px dashed ${e=>e.isDragOver?e.theme.colors.primary:e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.lg};
  padding: 60px 20px;
  text-align: center;
  background: ${e=>e.isDragOver?e.theme.colors.primary+"05":e.theme.colors.surface};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${e=>e.theme.colors.primary};
    background: ${e=>e.theme.colors.primary}05;
  }
  
  .upload-icon {
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  .upload-text {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: ${e=>e.theme.colors.text};
  }
  
  .upload-hint {
    color: ${e=>e.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`,qr=l.input`
  display: none;
`,Hr=l.div`
  margin-top: 30px;
  
  .result-text {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: ${e=>e.theme.colors.success};
  }
`,Yr=()=>{const[e,s]=f.useState(!1),[o,r]=f.useState(null),n=W(nn.uploadExcel,{onSuccess:u=>{var d;r(u.data),$.success(`Excel 파일이 업로드되었습니다. ${((d=u.data)==null?void 0:d.itemCount)||0}개 항목이 처리되었습니다.`)},onError:u=>{var d,b;$.error(((b=(d=u.response)==null?void 0:d.data)==null?void 0:b.message)||"업로드 중 오류가 발생했습니다.")}}),c=u=>{if(u){if(!u.name.endsWith(".xlsx")&&!u.name.endsWith(".xls")){$.error("Excel 파일만 업로드 가능합니다.");return}n.mutate(u)}},a=u=>{u.preventDefault(),s(!1);const d=u.dataTransfer.files;d.length>0&&c(d[0])},i=u=>{u.preventDefault(),s(!0)},x=()=>{s(!1)},p=()=>{const u=document.getElementById("file-input");u==null||u.click()};return t.jsxs(Ur,{children:[t.jsx(X,{title:"파일 관리",subtitle:"Excel 파일을 업로드하여 품목 데이터를 일괄 등록할 수 있습니다."}),t.jsxs(Card,{children:[t.jsxs(Qr,{isDragOver:e,onDrop:a,onDragOver:i,onDragLeave:x,onClick:p,children:[t.jsx(xt,{size:48,className:"upload-icon"}),t.jsx("div",{className:"upload-text",children:"Excel 파일을 여기에 끌어다 놓거나 클릭하여 선택하세요"}),t.jsx("div",{className:"upload-hint",children:".xlsx, .xls 파일만 지원됩니다"})]}),t.jsx(qr,{id:"file-input",type:"file",accept:".xlsx,.xls",onChange:u=>{var b;const d=(b=u.target.files)==null?void 0:b[0];d&&c(d)}}),n.isLoading&&t.jsx("div",{style:{textAlign:"center",marginTop:"20px"},children:t.jsx("p",{children:"파일을 업로드하고 있습니다..."})}),o&&t.jsxs(Hr,{children:[t.jsxs("div",{className:"result-text",children:["✅ 업로드 완료! ",o.itemCount,"개의 품목이 등록되었습니다."]}),t.jsxs(Button,{variant:"outline",children:[t.jsx(yt,{size:16}),"처리 결과 확인"]})]})]})]})},Gr=l.div`
  padding: 20px;
`,Vr=()=>{const{data:e,isLoading:s}=se("statistics",on.getStats);return s?t.jsx(le,{}):t.jsxs(Gr,{children:[t.jsx(X,{title:"통계 분석",subtitle:"시스템 사용 현황과 트렌드를 분석합니다."}),t.jsx(Card,{children:t.jsxs("div",{style:{textAlign:"center",padding:"60px"},children:[t.jsx("h3",{children:"통계 기능 준비 중"}),t.jsx("p",{children:"차트와 분석 기능이 곧 추가될 예정입니다."})]})})]})},Kr=l.div`
  padding: 20px;
`,Wr=()=>{const{data:e,isLoading:s}=se("logs",()=>an.getLogs());return s?t.jsx(le,{}):t.jsxs(Kr,{children:[t.jsx(X,{title:"시스템 로그",subtitle:"시스템 활동 로그를 확인할 수 있습니다."}),t.jsx(U,{children:t.jsxs("div",{style:{textAlign:"center",padding:"60px"},children:[t.jsx("h3",{children:"로그 기능 준비 중"}),t.jsx("p",{children:"시스템 로그 조회 기능이 곧 추가될 예정입니다."})]})})]})};const Xr=new ls({defaultOptions:{queries:{refetchOnWindowFocus:!1,retry:1,staleTime:5*60*1e3}}}),Jr=()=>t.jsx(cs,{client:Xr,children:t.jsxs($t,{theme:Ct,children:[t.jsx(Nt,{}),t.jsx(rs,{children:t.jsxs("div",{className:"App",children:[t.jsx(os,{children:t.jsxs(V,{path:"/",element:t.jsx(Vs,{}),children:[t.jsx(V,{index:!0,element:t.jsx(We,{to:"/dashboard",replace:!0})}),t.jsx(V,{path:"dashboard",element:t.jsx(hn,{})}),t.jsx(V,{path:"inventory",element:t.jsx(An,{})}),t.jsx(V,{path:"receipts",element:t.jsx(Hn,{})}),t.jsx(V,{path:"purchase-requests",element:t.jsx(Dr,{})}),t.jsx(V,{path:"kakao",element:t.jsx(Fr,{})}),t.jsx(V,{path:"upload",element:t.jsx(Yr,{})}),t.jsx(V,{path:"statistics",element:t.jsx(Vr,{})}),t.jsx(V,{path:"logs",element:t.jsx(Wr,{})}),t.jsx(V,{path:"*",element:t.jsx(We,{to:"/dashboard",replace:!0})})]})}),t.jsx(Fe,{position:"top-right",autoClose:3e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0,theme:"light"})]})})]})});const Zr=Pe.createRoot(document.getElementById("root"));Zr.render(t.jsx(R.StrictMode,{children:t.jsxs($t,{theme:Ct,children:[t.jsx(Nt,{}),t.jsx(Jr,{})]})}));
//# sourceMappingURL=index-fa4098f8.js.map
