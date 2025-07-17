import{r as f,b as Tt,a as T}from"./vendor-92c95717.js";import{N as Rt,u as zt,O as It,B as Lt,R as Bt,a as G,b as Ve}from"./router-9cc00d00.js";import{f as Ot,d as l,P as ue,C as pt,L as Dt,S as _e,a as _t,M as ut,U as ht,B as Mt,H as At,b as Pt,c as Ft,e as Ut,g as xt,h as Qt,i as mt,j as qt,k as Ht,m as Gt,l as Me,n as Ke,D as gt,A as ft,o as Yt,p as Vt,q as Kt,F as bt,R as Ue,r as Qe,s as qe,X as we,t as ce,u as Wt,v as Xt,w as vt,x as Jt,E as Zt,T as es,y as jt,z as ts,G as ss}from"./ui-d59cf173.js";import{a as ns,u as te,b as V,c as rs,Q as os,d as as}from"./utils-9cf24c14.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const a of c.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(n){if(n.ep)return;n.ep=!0;const c=o(n);fetch(n.href,c)}})();var yt={exports:{}},Ce={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var is=f,ls=Symbol.for("react.element"),cs=Symbol.for("react.fragment"),ds=Object.prototype.hasOwnProperty,ps=is.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,us={key:!0,ref:!0,__self:!0,__source:!0};function $t(e,s,o){var r,n={},c=null,a=null;o!==void 0&&(c=""+o),s.key!==void 0&&(c=""+s.key),s.ref!==void 0&&(a=s.ref);for(r in s)ds.call(s,r)&&!us.hasOwnProperty(r)&&(n[r]=s[r]);if(e&&e.defaultProps)for(r in s=e.defaultProps,s)n[r]===void 0&&(n[r]=s[r]);return{$$typeof:ls,type:e,key:c,ref:a,props:n,_owner:ps.current}}Ce.Fragment=cs;Ce.jsx=$t;Ce.jsxs=$t;yt.exports=Ce;var t=yt.exports,Ae={},We=Tt;Ae.createRoot=We.createRoot,Ae.hydrateRoot=We.hydrateRoot;function wt(e){var s,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e))for(s=0;s<e.length;s++)e[s]&&(o=wt(e[s]))&&(r&&(r+=" "),r+=o);else for(s in e)e[s]&&(r&&(r+=" "),r+=s);return r}function W(){for(var e,s,o=0,r="";o<arguments.length;)(e=arguments[o++])&&(s=wt(e))&&(r&&(r+=" "),r+=s);return r}const de=e=>typeof e=="number"&&!isNaN(e),se=e=>typeof e=="string",P=e=>typeof e=="function",ye=e=>se(e)||P(e)?e:null,Te=e=>f.isValidElement(e)||se(e)||P(e)||de(e);function hs(e,s,o){o===void 0&&(o=300);const{scrollHeight:r,style:n}=e;requestAnimationFrame(()=>{n.minHeight="initial",n.height=r+"px",n.transition=`all ${o}ms`,requestAnimationFrame(()=>{n.height="0",n.padding="0",n.margin="0",setTimeout(s,o)})})}function Ne(e){let{enter:s,exit:o,appendPosition:r=!1,collapse:n=!0,collapseDuration:c=300}=e;return function(a){let{children:i,position:x,preventExitTransition:p,done:h,nodeRef:d,isIn:b}=a;const u=r?`${s}--${x}`:s,j=r?`${o}--${x}`:o,m=f.useRef(0);return f.useLayoutEffect(()=>{const g=d.current,v=u.split(" "),C=k=>{k.target===d.current&&(g.dispatchEvent(new Event("d")),g.removeEventListener("animationend",C),g.removeEventListener("animationcancel",C),m.current===0&&k.type!=="animationcancel"&&g.classList.remove(...v))};g.classList.add(...v),g.addEventListener("animationend",C),g.addEventListener("animationcancel",C)},[]),f.useEffect(()=>{const g=d.current,v=()=>{g.removeEventListener("animationend",v),n?hs(g,h,c):h()};b||(p?v():(m.current=1,g.className+=` ${j}`,g.addEventListener("animationend",v)))},[b]),T.createElement(T.Fragment,null,i)}}function Xe(e,s){return e!=null?{content:e.content,containerId:e.props.containerId,id:e.props.toastId,theme:e.props.theme,type:e.props.type,data:e.props.data||{},isLoading:e.props.isLoading,icon:e.props.icon,status:s}:{}}const F={list:new Map,emitQueue:new Map,on(e,s){return this.list.has(e)||this.list.set(e,[]),this.list.get(e).push(s),this},off(e,s){if(s){const o=this.list.get(e).filter(r=>r!==s);return this.list.set(e,o),this}return this.list.delete(e),this},cancelEmit(e){const s=this.emitQueue.get(e);return s&&(s.forEach(clearTimeout),this.emitQueue.delete(e)),this},emit(e){this.list.has(e)&&this.list.get(e).forEach(s=>{const o=setTimeout(()=>{s(...[].slice.call(arguments,1))},0);this.emitQueue.has(e)||this.emitQueue.set(e,[]),this.emitQueue.get(e).push(o)})}},he=e=>{let{theme:s,type:o,...r}=e;return T.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:s==="colored"?"currentColor":`var(--toastify-icon-color-${o})`,...r})},Re={info:function(e){return T.createElement(he,{...e},T.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))},warning:function(e){return T.createElement(he,{...e},T.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))},success:function(e){return T.createElement(he,{...e},T.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))},error:function(e){return T.createElement(he,{...e},T.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))},spinner:function(){return T.createElement("div",{className:"Toastify__spinner"})}};function xs(e){const[,s]=f.useReducer(u=>u+1,0),[o,r]=f.useState([]),n=f.useRef(null),c=f.useRef(new Map).current,a=u=>o.indexOf(u)!==-1,i=f.useRef({toastKey:1,displayedToast:0,count:0,queue:[],props:e,containerId:null,isToastActive:a,getToast:u=>c.get(u)}).current;function x(u){let{containerId:j}=u;const{limit:m}=i.props;!m||j&&i.containerId!==j||(i.count-=i.queue.length,i.queue=[])}function p(u){r(j=>u==null?[]:j.filter(m=>m!==u))}function h(){const{toastContent:u,toastProps:j,staleId:m}=i.queue.shift();b(u,j,m)}function d(u,j){let{delay:m,staleId:g,...v}=j;if(!Te(u)||function(A){return!n.current||i.props.enableMultiContainer&&A.containerId!==i.props.containerId||c.has(A.toastId)&&A.updateId==null}(v))return;const{toastId:C,updateId:k,data:w}=v,{props:S}=i,B=()=>p(C),L=k==null;L&&i.count++;const z={...S,style:S.toastStyle,key:i.toastKey++,...Object.fromEntries(Object.entries(v).filter(A=>{let[U,D]=A;return D!=null})),toastId:C,updateId:k,data:w,closeToast:B,isIn:!1,className:ye(v.className||S.toastClassName),bodyClassName:ye(v.bodyClassName||S.bodyClassName),progressClassName:ye(v.progressClassName||S.progressClassName),autoClose:!v.isLoading&&(N=v.autoClose,I=S.autoClose,N===!1||de(N)&&N>0?N:I),deleteToast(){const A=Xe(c.get(C),"removed");c.delete(C),F.emit(4,A);const U=i.queue.length;if(i.count=C==null?i.count-i.displayedToast:i.count-1,i.count<0&&(i.count=0),U>0){const D=C==null?i.props.limit:1;if(U===1||D===1)i.displayedToast++,h();else{const Q=D>U?U:D;i.displayedToast=Q;for(let _=0;_<Q;_++)h()}}else s()}};var N,I;z.iconOut=function(A){let{theme:U,type:D,isLoading:Q,icon:_}=A,q=null;const Y={theme:U,type:D};return _===!1||(P(_)?q=_(Y):f.isValidElement(_)?q=f.cloneElement(_,Y):se(_)||de(_)?q=_:Q?q=Re.spinner():(ne=>ne in Re)(D)&&(q=Re[D](Y))),q}(z),P(v.onOpen)&&(z.onOpen=v.onOpen),P(v.onClose)&&(z.onClose=v.onClose),z.closeButton=S.closeButton,v.closeButton===!1||Te(v.closeButton)?z.closeButton=v.closeButton:v.closeButton===!0&&(z.closeButton=!Te(S.closeButton)||S.closeButton);let O=u;f.isValidElement(u)&&!se(u.type)?O=f.cloneElement(u,{closeToast:B,toastProps:z,data:w}):P(u)&&(O=u({closeToast:B,toastProps:z,data:w})),S.limit&&S.limit>0&&i.count>S.limit&&L?i.queue.push({toastContent:O,toastProps:z,staleId:g}):de(m)?setTimeout(()=>{b(O,z,g)},m):b(O,z,g)}function b(u,j,m){const{toastId:g}=j;m&&c.delete(m);const v={content:u,props:j};c.set(g,v),r(C=>[...C,g].filter(k=>k!==m)),F.emit(4,Xe(v,v.props.updateId==null?"added":"updated"))}return f.useEffect(()=>(i.containerId=e.containerId,F.cancelEmit(3).on(0,d).on(1,u=>n.current&&p(u)).on(5,x).emit(2,i),()=>{c.clear(),F.emit(3,i)}),[]),f.useEffect(()=>{i.props=e,i.isToastActive=a,i.displayedToast=o.length}),{getToastToRender:function(u){const j=new Map,m=Array.from(c.values());return e.newestOnTop&&m.reverse(),m.forEach(g=>{const{position:v}=g.props;j.has(v)||j.set(v,[]),j.get(v).push(g)}),Array.from(j,g=>u(g[0],g[1]))},containerRef:n,isToastActive:a}}function Je(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientX:e.clientX}function Ze(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientY:e.clientY}function ms(e){const[s,o]=f.useState(!1),[r,n]=f.useState(!1),c=f.useRef(null),a=f.useRef({start:0,x:0,y:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,boundingRect:null,didMove:!1}).current,i=f.useRef(e),{autoClose:x,pauseOnHover:p,closeToast:h,onClick:d,closeOnClick:b}=e;function u(w){if(e.draggable){w.nativeEvent.type==="touchstart"&&w.nativeEvent.preventDefault(),a.didMove=!1,document.addEventListener("mousemove",v),document.addEventListener("mouseup",C),document.addEventListener("touchmove",v),document.addEventListener("touchend",C);const S=c.current;a.canCloseOnClick=!0,a.canDrag=!0,a.boundingRect=S.getBoundingClientRect(),S.style.transition="",a.x=Je(w.nativeEvent),a.y=Ze(w.nativeEvent),e.draggableDirection==="x"?(a.start=a.x,a.removalDistance=S.offsetWidth*(e.draggablePercent/100)):(a.start=a.y,a.removalDistance=S.offsetHeight*(e.draggablePercent===80?1.5*e.draggablePercent:e.draggablePercent/100))}}function j(w){if(a.boundingRect){const{top:S,bottom:B,left:L,right:z}=a.boundingRect;w.nativeEvent.type!=="touchend"&&e.pauseOnHover&&a.x>=L&&a.x<=z&&a.y>=S&&a.y<=B?g():m()}}function m(){o(!0)}function g(){o(!1)}function v(w){const S=c.current;a.canDrag&&S&&(a.didMove=!0,s&&g(),a.x=Je(w),a.y=Ze(w),a.delta=e.draggableDirection==="x"?a.x-a.start:a.y-a.start,a.start!==a.x&&(a.canCloseOnClick=!1),S.style.transform=`translate${e.draggableDirection}(${a.delta}px)`,S.style.opacity=""+(1-Math.abs(a.delta/a.removalDistance)))}function C(){document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",C),document.removeEventListener("touchmove",v),document.removeEventListener("touchend",C);const w=c.current;if(a.canDrag&&a.didMove&&w){if(a.canDrag=!1,Math.abs(a.delta)>a.removalDistance)return n(!0),void e.closeToast();w.style.transition="transform 0.2s, opacity 0.2s",w.style.transform=`translate${e.draggableDirection}(0)`,w.style.opacity="1"}}f.useEffect(()=>{i.current=e}),f.useEffect(()=>(c.current&&c.current.addEventListener("d",m,{once:!0}),P(e.onOpen)&&e.onOpen(f.isValidElement(e.children)&&e.children.props),()=>{const w=i.current;P(w.onClose)&&w.onClose(f.isValidElement(w.children)&&w.children.props)}),[]),f.useEffect(()=>(e.pauseOnFocusLoss&&(document.hasFocus()||g(),window.addEventListener("focus",m),window.addEventListener("blur",g)),()=>{e.pauseOnFocusLoss&&(window.removeEventListener("focus",m),window.removeEventListener("blur",g))}),[e.pauseOnFocusLoss]);const k={onMouseDown:u,onTouchStart:u,onMouseUp:j,onTouchEnd:j};return x&&p&&(k.onMouseEnter=g,k.onMouseLeave=m),b&&(k.onClick=w=>{d&&d(w),a.canCloseOnClick&&h()}),{playToast:m,pauseToast:g,isRunning:s,preventExitTransition:r,toastRef:c,eventHandlers:k}}function kt(e){let{closeToast:s,theme:o,ariaLabel:r="close"}=e;return T.createElement("button",{className:`Toastify__close-button Toastify__close-button--${o}`,type:"button",onClick:n=>{n.stopPropagation(),s(n)},"aria-label":r},T.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},T.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function gs(e){let{delay:s,isRunning:o,closeToast:r,type:n="default",hide:c,className:a,style:i,controlledProgress:x,progress:p,rtl:h,isIn:d,theme:b}=e;const u=c||x&&p===0,j={...i,animationDuration:`${s}ms`,animationPlayState:o?"running":"paused",opacity:u?0:1};x&&(j.transform=`scaleX(${p})`);const m=W("Toastify__progress-bar",x?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${b}`,`Toastify__progress-bar--${n}`,{"Toastify__progress-bar--rtl":h}),g=P(a)?a({rtl:h,type:n,defaultClassName:m}):W(m,a);return T.createElement("div",{role:"progressbar","aria-hidden":u?"true":"false","aria-label":"notification timer",className:g,style:j,[x&&p>=1?"onTransitionEnd":"onAnimationEnd"]:x&&p<1?null:()=>{d&&r()}})}const fs=e=>{const{isRunning:s,preventExitTransition:o,toastRef:r,eventHandlers:n}=ms(e),{closeButton:c,children:a,autoClose:i,onClick:x,type:p,hideProgressBar:h,closeToast:d,transition:b,position:u,className:j,style:m,bodyClassName:g,bodyStyle:v,progressClassName:C,progressStyle:k,updateId:w,role:S,progress:B,rtl:L,toastId:z,deleteToast:N,isIn:I,isLoading:O,iconOut:A,closeOnClick:U,theme:D}=e,Q=W("Toastify__toast",`Toastify__toast-theme--${D}`,`Toastify__toast--${p}`,{"Toastify__toast--rtl":L},{"Toastify__toast--close-on-click":U}),_=P(j)?j({rtl:L,position:u,type:p,defaultClassName:Q}):W(Q,j),q=!!B||!i,Y={closeToast:d,type:p,theme:D};let ne=null;return c===!1||(ne=P(c)?c(Y):f.isValidElement(c)?f.cloneElement(c,Y):kt(Y)),T.createElement(b,{isIn:I,done:N,position:u,preventExitTransition:o,nodeRef:r},T.createElement("div",{id:z,onClick:x,className:_,...n,style:m,ref:r},T.createElement("div",{...I&&{role:S},className:P(g)?g({type:p}):W("Toastify__toast-body",g),style:v},A!=null&&T.createElement("div",{className:W("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!O})},A),T.createElement("div",null,a)),ne,T.createElement(gs,{...w&&!q?{key:`pb-${w}`}:{},rtl:L,theme:D,delay:i,isRunning:s,isIn:I,closeToast:d,hide:h,type:p,style:k,className:C,controlledProgress:q,progress:B||0})))},Se=function(e,s){return s===void 0&&(s=!1),{enter:`Toastify--animate Toastify__${e}-enter`,exit:`Toastify--animate Toastify__${e}-exit`,appendPosition:s}},bs=Ne(Se("bounce",!0));Ne(Se("slide",!0));Ne(Se("zoom"));Ne(Se("flip"));const Pe=f.forwardRef((e,s)=>{const{getToastToRender:o,containerRef:r,isToastActive:n}=xs(e),{className:c,style:a,rtl:i,containerId:x}=e;function p(h){const d=W("Toastify__toast-container",`Toastify__toast-container--${h}`,{"Toastify__toast-container--rtl":i});return P(c)?c({position:h,rtl:i,defaultClassName:d}):W(d,ye(c))}return f.useEffect(()=>{s&&(s.current=r.current)},[]),T.createElement("div",{ref:r,className:"Toastify",id:x},o((h,d)=>{const b=d.length?{...a}:{...a,pointerEvents:"none"};return T.createElement("div",{className:p(h),style:b,key:`container-${h}`},d.map((u,j)=>{let{content:m,props:g}=u;return T.createElement(fs,{...g,isIn:n(g.toastId),style:{...g.style,"--nth":j+1,"--len":d.length},key:`toast-${g.key}`},m)}))}))});Pe.displayName="ToastContainer",Pe.defaultProps={position:"top-right",transition:bs,autoClose:5e3,closeButton:kt,pauseOnHover:!0,pauseOnFocusLoss:!0,closeOnClick:!0,draggable:!0,draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light"};let ze,J=new Map,le=[],vs=1;function Ct(){return""+vs++}function js(e){return e&&(se(e.toastId)||de(e.toastId))?e.toastId:Ct()}function pe(e,s){return J.size>0?F.emit(0,e,s):le.push({content:e,options:s}),s.toastId}function ke(e,s){return{...s,type:s&&s.type||e,toastId:js(s)}}function xe(e){return(s,o)=>pe(s,ke(e,o))}function $(e,s){return pe(e,ke("default",s))}$.loading=(e,s)=>pe(e,ke("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...s})),$.promise=function(e,s,o){let r,{pending:n,error:c,success:a}=s;n&&(r=se(n)?$.loading(n,o):$.loading(n.render,{...o,...n}));const i={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},x=(h,d,b)=>{if(d==null)return void $.dismiss(r);const u={type:h,...i,...o,data:b},j=se(d)?{render:d}:d;return r?$.update(r,{...u,...j}):$(j.render,{...u,...j}),b},p=P(e)?e():e;return p.then(h=>x("success",a,h)).catch(h=>x("error",c,h)),p},$.success=xe("success"),$.info=xe("info"),$.error=xe("error"),$.warning=xe("warning"),$.warn=$.warning,$.dark=(e,s)=>pe(e,ke("default",{theme:"dark",...s})),$.dismiss=e=>{J.size>0?F.emit(1,e):le=le.filter(s=>e!=null&&s.options.toastId!==e)},$.clearWaitingQueue=function(e){return e===void 0&&(e={}),F.emit(5,e)},$.isActive=e=>{let s=!1;return J.forEach(o=>{o.isToastActive&&o.isToastActive(e)&&(s=!0)}),s},$.update=function(e,s){s===void 0&&(s={}),setTimeout(()=>{const o=function(r,n){let{containerId:c}=n;const a=J.get(c||ze);return a&&a.getToast(r)}(e,s);if(o){const{props:r,content:n}=o,c={delay:100,...r,...s,toastId:s.toastId||e,updateId:Ct()};c.toastId!==e&&(c.staleId=e);const a=c.render||n;delete c.render,pe(a,c)}},0)},$.done=e=>{$.update(e,{progress:1})},$.onChange=e=>(F.on(4,e),()=>{F.off(4,e)}),$.POSITION={TOP_LEFT:"top-left",TOP_RIGHT:"top-right",TOP_CENTER:"top-center",BOTTOM_LEFT:"bottom-left",BOTTOM_RIGHT:"bottom-right",BOTTOM_CENTER:"bottom-center"},$.TYPE={INFO:"info",SUCCESS:"success",WARNING:"warning",ERROR:"error",DEFAULT:"default"},F.on(2,e=>{ze=e.containerId||e,J.set(ze,e),le.forEach(s=>{F.emit(0,s.content,s.options)}),le=[]}).on(3,e=>{J.delete(e.containerId||e),J.size===0&&F.off(0).off(1).off(5)});const ys={colors:{primary:"#667eea",secondary:"#764ba2",success:"#10B981",warning:"#F59E0B",error:"#EF4444",info:"#3B82F6",gray:"#6B7280",background:"#f8fafc",surface:"#ffffff",text:"#1f2937",textSecondary:"#6b7280",border:"#e5e7eb"},spacing:{xs:"4px",sm:"8px",md:"16px",lg:"24px",xl:"32px"},borderRadius:{sm:"4px",md:"8px",lg:"12px"},shadows:{sm:"0 1px 2px 0 rgba(0, 0, 0, 0.05)",md:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",lg:"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"},breakpoints:{mobile:"768px",tablet:"1024px",desktop:"1200px"}},$s=Ot`
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
`,ws=l.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`,ks=l.div`
  padding: ${e=>e.collapsed?"20px 10px":"20px"};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${e=>e.collapsed?"center":"space-between"};
  min-height: 80px;
`,Cs=l.div`
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
`,Ns=l.button`
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
`,Ss=l.div`
  text-align: center;
  padding: ${e=>e.collapsed?"10px 5px":"15px 20px"};
  opacity: ${e=>e.collapsed?"0":"0.8"};
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: ${e=>e.collapsed?"0":"60px"};
`,Es=l.nav`
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
`,Ie=l.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`,Le=l.div`
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
`,Rs=l(Rt)`
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
`,zs=l.div`
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
`,Is=l.div`
  position: relative;
  
  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`,Ls=({collapsed:e,onToggle:s})=>{const o=zt(),r=[{path:"/dashboard",label:"대시보드",icon:Dt},{path:"/purchase-requests",label:"구매 요청",icon:_e,badge:3},{path:"/inventory",label:"품목 관리",icon:ue},{path:"/receipts",label:"수령 관리",icon:_t},{path:"/kakao",label:"카톡 처리",icon:ut}],n=[{path:"/upload",label:"파일 관리",icon:ht},{path:"/statistics",label:"통계 분석",icon:Mt},{path:"/logs",label:"시스템 로그",icon:At}],c=[{path:"/suppliers",label:"공급업체",icon:Pt},{path:"/budgets",label:"예산 관리",icon:Ft},{path:"/users",label:"사용자 관리",icon:Ut},{path:"/notifications",label:"알림 설정",icon:xt},{path:"/settings",label:"시스템 설정",icon:Qt}],a=i=>{const x=i.icon,p=o.pathname===i.path;return t.jsx(Ts,{children:t.jsxs(Is,{children:[t.jsxs(Rs,{to:i.path,collapsed:e,className:p?"active":"",children:[t.jsx(x,{className:"nav-icon",size:20}),t.jsx("span",{className:"nav-text",children:i.label}),i.badge&&t.jsx("span",{className:"nav-badge",children:i.badge})]}),e&&t.jsx(zs,{show:e,className:"tooltip",children:i.label})]})},i.path)};return t.jsxs(ws,{collapsed:e,children:[t.jsxs(ks,{collapsed:e,children:[t.jsxs(Cs,{collapsed:e,children:[t.jsx("div",{className:"logo-icon",children:t.jsx(ue,{size:20})}),t.jsx("h1",{children:"ERP 시스템"})]}),t.jsx(Ns,{collapsed:e,onClick:s,children:t.jsx(pt,{size:20})})]}),t.jsx(Ss,{collapsed:e,children:"업무 자동화 및 관리"}),t.jsxs(Es,{children:[t.jsxs(Ie,{collapsed:e,children:[t.jsx(Le,{collapsed:e,children:"주요 기능"}),t.jsx(Be,{children:r.map(a)})]}),t.jsxs(Ie,{collapsed:e,children:[t.jsx(Le,{collapsed:e,children:"데이터 관리"}),t.jsx(Be,{children:n.map(a)})]}),t.jsxs(Ie,{collapsed:e,children:[t.jsx(Le,{collapsed:e,children:"시스템 관리"}),t.jsx(Be,{children:c.map(a)})]})]})]})},Bs=l.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${e=>e.theme.spacing.lg};
  height: 64px;
  background: ${e=>e.theme.colors.surface};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
`,Os=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.md};
`,Ds=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.sm};
`,_s=l.button`
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
`,Ms=l.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    display: none;
  }
`,As=l.input`
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
`,Ps=l(mt)`
  position: absolute;
  left: 12px;
  color: ${e=>e.theme.colors.textSecondary};
`,et=l.button`
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
`,Fs=l.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: ${e=>e.theme.colors.error};
  border-radius: 50%;
`,Us=l.div`
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
`,Qs=l.div`
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
`,K=({onToggleSidebar:e,sidebarCollapsed:s})=>t.jsxs(Bs,{children:[t.jsxs(Os,{children:[t.jsx(_s,{onClick:e,children:t.jsx(qt,{size:20})}),t.jsxs(Ms,{children:[t.jsx(Ps,{size:16}),t.jsx(As,{type:"text",placeholder:"검색..."})]})]}),t.jsxs(Ds,{children:[t.jsxs(et,{children:[t.jsx(xt,{size:20}),t.jsx(Fs,{})]}),t.jsxs(Us,{children:[t.jsx(Qs,{children:"관"}),t.jsx("span",{className:"user-name",children:"관리자"})]}),t.jsx(et,{children:t.jsx(Ht,{size:18})})]})]}),qs=l.div`
  display: flex;
  height: 100vh;
  background-color: ${e=>{var s;return((s=e.theme.colors)==null?void 0:s.background)||"#f8fafc"}};
`,Hs=l.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${e=>e.sidebarOpen?"250px":"70px"};
  transition: margin-left 0.3s ease;
`,Gs=l.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`,Ys=()=>{const[e,s]=f.useState(!0);return t.jsxs(qs,{children:[t.jsx(Ls,{isOpen:e,onToggle:()=>s(!e)}),t.jsxs(Hs,{sidebarOpen:e,children:[t.jsx(K,{onMenuClick:()=>s(!e)}),t.jsx(Gs,{children:t.jsx(It,{})})]})]})},Vs=Gt`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,Ks=l.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${e=>e.theme.spacing.xl};
  min-height: 200px;
`,Ws=l.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${e=>e.theme.colors.border};
  border-top: 4px solid ${e=>e.theme.colors.primary};
  border-radius: 50%;
  animation: ${Vs} 1s linear infinite;
`,Xs=l.div`
  margin-left: ${e=>e.theme.spacing.md};
  color: ${e=>e.theme.colors.textSecondary};
  font-size: 0.9rem;
`,ie=({text:e="로딩 중..."})=>t.jsxs(Ks,{children:[t.jsx(Ws,{}),e&&t.jsx(Xs,{children:e})]}),Js=()=>{const e=ns.create({baseURL:{}.VITE_API_URL||"http://localhost:3001/api",timeout:1e4,headers:{"Content-Type":"application/json"}});return e.interceptors.request.use(s=>{const o=localStorage.getItem("auth_token");return o&&(s.headers.Authorization=`Bearer ${o}`),s},s=>Promise.reject(s)),e.interceptors.response.use(s=>s,s=>{var o,r,n,c;return console.error("API Error:",{status:(o=s.response)==null?void 0:o.status,url:(r=s.config)==null?void 0:r.url,message:s.message,data:(n=s.response)==null?void 0:n.data}),((c=s.response)==null?void 0:c.status)===401&&localStorage.removeItem("auth_token"),Promise.reject(s)}),e},Z=Js(),E={get:(e,s)=>Z.get(e,{params:s}).then(o=>o.data),post:(e,s)=>Z.post(e,s).then(o=>o.data),put:(e,s)=>Z.put(e,s).then(o=>o.data),delete:e=>Z.delete(e).then(s=>s.data),download:(e,s)=>Z.get(e,{params:s,responseType:"blob"}).then(o=>o.data)},Zs={getStats:()=>E.get("/dashboard")},ee={getRequests:(e=1,s=20,o)=>E.get("/purchase-requests",{page:e,limit:s,...o}),getRequest:e=>E.get(`/purchase-requests/${e}`),createRequest:e=>E.post("/purchase-requests",e),updateRequest:(e,s)=>E.put(`/purchase-requests/${e}`,s),deleteRequest:e=>E.delete(`/purchase-requests/${e}`),approveRequest:e=>E.post(`/purchase-requests/${e.requestId}/approve`,{action:e.action,comments:e.comments}),getStats:()=>E.get("/purchase-requests/stats"),exportRequests:e=>E.download("/purchase-requests/export/excel",e)},Fe={getItems:(e=1,s=20,o)=>E.get("/inventory",{page:e,limit:s,...o}),getItem:e=>E.get(`/inventory/${e}`),createItem:e=>E.post("/inventory",e),updateItem:(e,s)=>E.put(`/inventory/${e}`,s),deleteItem:e=>E.delete(`/inventory/${e}`),updateItemStatus:(e,s,o)=>E.put(`/inventory/${e}/status`,{status:s,receivedDate:o}),getSuppliers:()=>E.get("/inventory/suppliers"),searchItems:(e,s=10)=>E.get("/inventory/search",{q:e,limit:s}),getLowStockItems:(e=5)=>E.get("/inventory/low-stock",{threshold:e}),exportData:e=>E.download(`/export/${e}`)},en={getReceipts:(e=1,s=20)=>E.get("/receipts",{page:e,limit:s}),createReceipt:e=>E.post("/receipts",e),exportReceipts:()=>E.download("/receipts/export")},tn={uploadExcel:e=>{const s=new FormData;return s.append("excelFile",e),Z.post("/upload",s,{headers:{"Content-Type":"multipart/form-data"}}).then(o=>o.data)},uploadFile:(e,s)=>{const o=new FormData;return o.append("file",e),s&&o.append("type",s),Z.post("/upload/file",o,{headers:{"Content-Type":"multipart/form-data"}}).then(r=>r.data)}},sn={parseMessage:e=>E.post("/kakao/parse",{message:e})},nn={getStats:()=>E.get("/statistics"),getMonthlyStats:e=>E.get("/statistics/monthly",{year:e}),getSupplierStats:()=>E.get("/statistics/suppliers"),getDepartmentStats:()=>E.get("/statistics/departments")},rn={getLogs:(e=1,s=50)=>E.get("/logs",{page:e,limit:s})},tt=l.div`
  padding: 20px;
`,on=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,me=l(Card)`
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
`,an=l.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: ${e=>e.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`,ln=l(Card)`
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
`,cn=l(Card)`
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
`,dn=()=>{var n,c,a,i,x,p,h;const{data:e,isLoading:s,error:o}=te("dashboard-stats",Zs.getStats,{refetchInterval:3e5});if(s)return t.jsx(ie,{});if(o)return t.jsx(tt,{children:t.jsx(Card,{children:t.jsx("div",{style:{textAlign:"center",padding:"40px"},children:t.jsx("p",{children:"대시보드 데이터를 불러오는 중 오류가 발생했습니다."})})})});const r=e==null?void 0:e.data;return t.jsxs(tt,{children:[t.jsx(K,{title:"대시보드",subtitle:"시스템 현황을 한눈에 확인하세요."}),t.jsxs(on,{children:[t.jsxs(me,{color:"#3B82F6",children:[t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsx("div",{className:"stat-value",children:((n=r==null?void 0:r.purchaseRequests)==null?void 0:n.total)||0}),t.jsx("div",{className:"stat-label",children:"전체 구매 요청"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(_e,{size:24})})]}),t.jsxs("div",{className:"stat-change positive",children:["이번 달 +",((c=r==null?void 0:r.purchaseRequests)==null?void 0:c.thisMonth)||0]})]}),t.jsx(me,{color:"#F59E0B",children:t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsx("div",{className:"stat-value",children:((a=r==null?void 0:r.purchaseRequests)==null?void 0:a.pending)||0}),t.jsx("div",{className:"stat-label",children:"승인 대기"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(Me,{size:24})})]})}),t.jsx(me,{color:"#10B981",children:t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsx("div",{className:"stat-value",children:((i=r==null?void 0:r.inventory)==null?void 0:i.receivedItems)||0}),t.jsx("div",{className:"stat-label",children:"수령 완료"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(Ke,{size:24})})]})}),t.jsxs(me,{color:"#8B5CF6",children:[t.jsxs("div",{className:"stat-header",children:[t.jsxs("div",{children:[t.jsxs("div",{className:"stat-value",children:["₩",(((x=r==null?void 0:r.budget)==null?void 0:x.usedBudget)||0).toLocaleString()]}),t.jsx("div",{className:"stat-label",children:"사용 예산"})]}),t.jsx("div",{className:"stat-icon",children:t.jsx(gt,{size:24})})]}),t.jsxs("div",{className:"stat-change",children:["활용률 ",((p=r==null?void 0:r.budget)==null?void 0:p.utilizationRate)||0,"%"]})]})]}),t.jsxs(an,{children:[t.jsxs(ln,{children:[t.jsxs("div",{className:"activity-header",children:[t.jsx("h3",{children:"최근 활동"}),t.jsx("span",{style:{fontSize:"0.9rem",color:"#666"},children:"최근 24시간"})]}),t.jsx("div",{className:"activity-list",children:((h=r==null?void 0:r.recentReceipts)==null?void 0:h.slice(0,5).map((d,b)=>t.jsxs("div",{className:"activity-item",children:[t.jsx("div",{className:"activity-icon",style:{background:"#10B98120",color:"#10B981"},children:t.jsx(ue,{size:20})}),t.jsxs("div",{className:"activity-content",children:[t.jsxs("div",{className:"activity-title",children:[d.itemName," 수령 완료"]}),t.jsxs("div",{className:"activity-time",children:[d.receiverName," • ",new Date(d.receivedDate).toLocaleString("ko-KR")]})]})]},d.id)))||t.jsx("div",{style:{textAlign:"center",color:"#666",padding:"20px"},children:"최근 활동이 없습니다."})})]}),t.jsxs(cn,{children:[t.jsx("h3",{children:"빠른 작업"}),t.jsxs("div",{className:"actions-grid",children:[t.jsxs("a",{href:"/purchase-requests",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(_e,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"구매 요청"}),t.jsx("div",{className:"action-desc",children:"새로운 구매 요청 등록"})]})]}),t.jsxs("a",{href:"/inventory",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(ue,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"품목 관리"}),t.jsx("div",{className:"action-desc",children:"재고 현황 확인"})]})]}),t.jsxs("a",{href:"/receipts",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(Ke,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"수령 처리"}),t.jsx("div",{className:"action-desc",children:"물품 수령 등록"})]})]}),t.jsxs("a",{href:"/kakao",className:"action-item",children:[t.jsx("div",{className:"action-icon",children:t.jsx(ft,{size:20})}),t.jsxs("div",{className:"action-content",children:[t.jsx("div",{className:"action-title",children:"카톡 처리"}),t.jsx("div",{className:"action-desc",children:"메시지 파싱"})]})]})]})]})]})]})},pn=l.div`
  overflow-x: auto;
  border-radius: ${e=>e.theme.borderRadius.lg};
  border: 1px solid ${e=>e.theme.colors.border};
  background: ${e=>e.theme.colors.surface};
`,un=l.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`,hn=l.thead`
  background: ${e=>e.theme.colors.background};
  border-bottom: 2px solid ${e=>e.theme.colors.border};
`,st=l.th`
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
`,xn=l.div`
  display: flex;
  align-items: center;
  gap: ${e=>e.theme.spacing.xs};
`,mn=l.div`
  display: flex;
  flex-direction: column;
  opacity: ${e=>e.active?1:.3};
  
  svg {
    width: 12px;
    height: 12px;
  }
`,gn=l.tbody``,fn=l.tr`
  transition: background-color 0.15s ease;
  
  &:hover {
    background: ${e=>e.theme.colors.background};
  }
  
  ${e=>e.selected&&`
    background: ${e.theme.colors.primary}10;
  `}
`,ge=l.td`
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
`,nt=l.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`,bn=l.div`
  text-align: center;
  padding: ${e=>e.theme.spacing.xl};
  color: ${e=>e.theme.colors.textSecondary};
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: ${e=>e.theme.spacing.md};
    opacity: 0.3;
  }
`,vn=l.div`
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
`;function He({columns:e,data:s,loading:o=!1,emptyMessage:r="데이터가 없습니다.",selectable:n=!1,selectedItems:c=[],onSelectItems:a,onSort:i,sortField:x,sortDirection:p}){const h=m=>{a&&a(m?s:[])},d=(m,g)=>{a&&a(g?[...c,m]:c.filter(v=>v!==m))},b=m=>{if(!i)return;let g="asc";x===m&&p==="asc"&&(g="desc"),i(m,g)},u=s.length>0&&c.length===s.length,j=c.length>0&&c.length<s.length;return t.jsx(pn,{children:t.jsxs(un,{children:[t.jsx(hn,{children:t.jsxs("tr",{children:[n&&t.jsx(st,{width:"40px",children:t.jsx(nt,{type:"checkbox",checked:u,ref:m=>{m&&(m.indeterminate=j)},onChange:m=>h(m.target.checked)})}),e.map(m=>t.jsx(st,{width:m.width,align:m.align,sortable:m.sortable,onClick:()=>m.sortable&&b(String(m.key)),children:m.sortable?t.jsxs(xn,{children:[m.label,t.jsxs(mn,{active:x===m.key,direction:p,children:[t.jsx(Yt,{}),t.jsx(Vt,{})]})]}):m.label},String(m.key)))]})}),t.jsx(gn,{children:o?t.jsx("tr",{children:t.jsx(ge,{colSpan:e.length+(n?1:0),children:t.jsxs(vn,{children:[t.jsx("div",{className:"loading-spinner"}),t.jsx("div",{children:"로딩 중..."})]})})}):s.length===0?t.jsx("tr",{children:t.jsx(ge,{colSpan:e.length+(n?1:0),children:t.jsxs(bn,{children:[t.jsx("div",{className:"empty-icon",children:"📋"}),t.jsx("div",{children:r})]})})}):s.map((m,g)=>{const v=c.includes(m);return t.jsxs(fn,{selected:v,children:[n&&t.jsx(ge,{children:t.jsx(nt,{type:"checkbox",checked:v,onChange:C=>d(m,C.target.checked)})}),e.map(C=>{const k=m[C.key],w=C.render?C.render(k,m):k;return t.jsx(ge,{align:C.align,children:w},String(C.key))})]},g)})})]})})}const jn=l.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${e=>e.theme.spacing.xs};
  margin-top: ${e=>e.theme.spacing.lg};
`,Oe=l.button`
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
`,yn=l.span`
  margin: 0 ${e=>e.theme.spacing.md};
  font-size: 0.9rem;
  color: ${e=>e.theme.colors.textSecondary};
`,Ge=({currentPage:e,totalPages:s,onPageChange:o,className:r})=>{const n=()=>{const i=[],x=[];for(let p=Math.max(2,e-2);p<=Math.min(s-1,e+2);p++)i.push(p);return e-2>2?x.push(1,"..."):x.push(1),x.push(...i),e+2<s-1?x.push("...",s):s>1&&x.push(s),x};if(s<=1)return null;const c=n();return t.jsxs(jn,{className:r,children:[t.jsx(Oe,{disabled:e===1,onClick:()=>o(e-1),children:t.jsx(pt,{})}),c.map((a,i)=>t.jsx(T.Fragment,{children:a==="..."?t.jsx(yn,{children:"..."}):t.jsx(Oe,{active:a===e,onClick:()=>o(a),children:a})},i)),t.jsx(Oe,{disabled:e===s,onClick:()=>o(e+1),children:t.jsx(Kt,{})})]})},$n=l.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`,re=l.div`
  margin-bottom: 16px;
`,oe=l.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
`,ae=l.input`
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
`,wn=l.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`,rt=l.button`
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
`,kn=({item:e,onSubmit:s,onCancel:o})=>{const[r,n]=f.useState({itemName:(e==null?void 0:e.itemName)||"",category:(e==null?void 0:e.category)||"",quantity:(e==null?void 0:e.quantity)||0,unit:(e==null?void 0:e.unit)||"",location:(e==null?void 0:e.location)||"",description:(e==null?void 0:e.description)||""}),c=i=>{i.preventDefault(),s({...r,id:e==null?void 0:e.id})},a=(i,x)=>{n(p=>({...p,[i]:x}))};return t.jsxs($n,{children:[t.jsx("h3",{children:e?"재고 항목 수정":"재고 항목 추가"}),t.jsxs("form",{onSubmit:c,children:[t.jsxs(re,{children:[t.jsx(oe,{children:"품목명"}),t.jsx(ae,{type:"text",value:r.itemName,onChange:i=>a("itemName",i.target.value),required:!0})]}),t.jsxs(re,{children:[t.jsx(oe,{children:"카테고리"}),t.jsx(ae,{type:"text",value:r.category,onChange:i=>a("category",i.target.value),required:!0})]}),t.jsxs(re,{children:[t.jsx(oe,{children:"수량"}),t.jsx(ae,{type:"number",value:r.quantity,onChange:i=>a("quantity",parseInt(i.target.value)||0),required:!0,min:"0"})]}),t.jsxs(re,{children:[t.jsx(oe,{children:"단위"}),t.jsx(ae,{type:"text",value:r.unit,onChange:i=>a("unit",i.target.value),required:!0})]}),t.jsxs(re,{children:[t.jsx(oe,{children:"보관 위치"}),t.jsx(ae,{type:"text",value:r.location,onChange:i=>a("location",i.target.value),required:!0})]}),t.jsxs(re,{children:[t.jsx(oe,{children:"설명"}),t.jsx(ae,{type:"text",value:r.description,onChange:i=>a("description",i.target.value),placeholder:"선택사항"})]}),t.jsxs(wn,{children:[t.jsx(rt,{type:"submit",variant:"primary",children:e?"수정":"추가"}),t.jsx(rt,{type:"button",variant:"secondary",onClick:o,children:"취소"})]})]})]})},Cn=l.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
`,Nn=l.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`,Sn=l.input`
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
`,En=l(mt)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
`,ot=l.select`
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
`,Tn=l.button`
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
`,Rn=({searchTerm:e="",category:s="",location:o="",onSearchChange:r=()=>{},onCategoryChange:n=()=>{},onLocationChange:c=()=>{},onFilter:a=()=>{}})=>t.jsxs(Cn,{children:[t.jsxs(Nn,{children:[t.jsx(En,{}),t.jsx(Sn,{type:"text",placeholder:"품목명으로 검색...",value:e,onChange:i=>r(i.target.value)})]}),t.jsxs(ot,{value:s,onChange:i=>n(i.target.value),children:[t.jsx("option",{value:"",children:"전체 카테고리"}),t.jsx("option",{value:"사무용품",children:"사무용품"}),t.jsx("option",{value:"전자기기",children:"전자기기"}),t.jsx("option",{value:"소모품",children:"소모품"}),t.jsx("option",{value:"기타",children:"기타"})]}),t.jsxs(ot,{value:o,onChange:i=>c(i.target.value),children:[t.jsx("option",{value:"",children:"전체 위치"}),t.jsx("option",{value:"창고A",children:"창고A"}),t.jsx("option",{value:"창고B",children:"창고B"}),t.jsx("option",{value:"사무실",children:"사무실"}),t.jsx("option",{value:"기타",children:"기타"})]}),t.jsxs(Tn,{onClick:a,children:[t.jsx(bt,{size:16}),"필터 적용"]})]}),zn=(e=1,s=20,o={})=>{var x,p,h,d,b,u,j,m,g,v,C,k,w,S,B;const r=useQueryClient(),{data:n,isLoading:c,error:a,refetch:i}=te(["inventory",e,s,o],()=>Fe.getItems(e,s,o),{keepPreviousData:!0,staleTime:5*60*1e3});return{items:((x=n==null?void 0:n.data)==null?void 0:x.items)||[],total:((p=n==null?void 0:n.data)==null?void 0:p.total)||0,totalPages:((h=n==null?void 0:n.data)==null?void 0:h.totalPages)||0,hasNext:((d=n==null?void 0:n.data)==null?void 0:d.hasNext)||!1,hasPrev:((b=n==null?void 0:n.data)==null?void 0:b.hasPrev)||!1,stats:{totalItems:((j=(u=n==null?void 0:n.data)==null?void 0:u.items)==null?void 0:j.length)||0,receivedItems:((v=(g=(m=n==null?void 0:n.data)==null?void 0:m.items)==null?void 0:g.filter(L=>L.received))==null?void 0:v.length)||0,pendingItems:((w=(k=(C=n==null?void 0:n.data)==null?void 0:C.items)==null?void 0:k.filter(L=>!L.received))==null?void 0:w.length)||0,totalValue:((B=(S=n==null?void 0:n.data)==null?void 0:S.items)==null?void 0:B.reduce((L,z)=>L+z.totalPrice,0))||0},loading:c,error:a,refetch:i,invalidate:()=>{r.invalidateQueries("inventory")}}},at=l.div`
  padding: 20px;
`,In=l.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`,Ln=l.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`,Bn=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,fe=l(Card)`
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
`,On=()=>{const e=useQueryClient(),[s,o]=f.useState(1),[r,n]=f.useState({}),[c,a]=f.useState(!1),[i,x]=f.useState(null);f.useState([]);const{items:p,loading:h,error:d,totalPages:b,stats:u,refetch:j}=zn(s,20,r),m=V(Fe.deleteItem,{onSuccess:()=>{e.invalidateQueries("inventory"),$.success("품목이 삭제되었습니다.")},onError:N=>{var I,O;$.error(((O=(I=N.response)==null?void 0:I.data)==null?void 0:O.message)||"삭제 중 오류가 발생했습니다.")}}),g=V(Fe.exportData,{onSuccess:N=>{const I=window.URL.createObjectURL(N),O=document.createElement("a");O.href=I,O.download=`inventory_${new Date().toISOString().split("T")[0]}.xlsx`,document.body.appendChild(O),O.click(),document.body.removeChild(O),window.URL.revokeObjectURL(I),$.success("Excel 파일이 다운로드되었습니다.")},onError:()=>{$.error("내보내기 중 오류가 발생했습니다.")}}),v=f.useMemo(()=>[{key:"no",label:"번호",sortable:!0,width:"80px"},{key:"itemName",label:"품목명",sortable:!0,render:(N,I)=>t.jsxs("div",{children:[t.jsx("div",{style:{fontWeight:"bold"},children:N}),I.specifications&&t.jsx("div",{style:{fontSize:"0.85rem",color:"#666"},children:I.specifications})]})},{key:"quantity",label:"수량",sortable:!0,width:"100px",render:N=>N.toLocaleString()},{key:"unitPrice",label:"단가",sortable:!0,width:"120px",render:N=>`₩${N.toLocaleString()}`},{key:"totalPrice",label:"총액",sortable:!0,width:"140px",render:N=>`₩${N.toLocaleString()}`},{key:"supplier",label:"공급업체",sortable:!0,width:"150px"},{key:"status",label:"상태",width:"100px",render:N=>t.jsx(Dn,{status:N,children:z(N)})},{key:"actions",label:"관리",width:"120px",render:(N,I)=>t.jsxs(_n,{children:[t.jsx(Button,{size:"sm",variant:"outline",onClick:()=>k(I),children:"수정"}),t.jsx(Button,{size:"sm",variant:"danger",onClick:()=>w(I.no),children:"삭제"})]})}],[]),C=N=>{n(N),o(1)},k=N=>{x(N),a(!0)},w=async N=>{window.confirm("정말로 이 품목을 삭제하시겠습니까?")&&m.mutate(N)},S=()=>{g.mutate("inventory")},B=()=>{a(!1),x(null)},L=()=>{B(),j()},z=N=>({pending:"주문중",received:"수령완료",ordered:"발주완료"})[N]||N;return h?t.jsx(ie,{}):d?t.jsx(at,{children:t.jsx(Card,{children:t.jsxs("div",{style:{textAlign:"center",padding:"40px"},children:[t.jsx("p",{children:"데이터를 불러오는 중 오류가 발생했습니다."}),t.jsx(Button,{onClick:()=>j(),children:"다시 시도"})]})})}):t.jsxs(at,{children:[t.jsx(K,{title:"품목 관리",subtitle:"전체 품목 현황을 관리하고 모니터링할 수 있습니다."}),t.jsxs(Bn,{children:[t.jsxs(fe,{children:[t.jsx("h3",{children:(u==null?void 0:u.totalItems)||0}),t.jsx("p",{children:"전체 품목"})]}),t.jsxs(fe,{children:[t.jsx("h3",{children:(u==null?void 0:u.receivedItems)||0}),t.jsx("p",{children:"수령 완료"})]}),t.jsxs(fe,{children:[t.jsx("h3",{children:(u==null?void 0:u.pendingItems)||0}),t.jsx("p",{children:"주문 중"})]}),t.jsxs(fe,{children:[t.jsxs("h3",{children:["₩",((u==null?void 0:u.totalValue)||0).toLocaleString()]}),t.jsx("p",{children:"총 금액"})]})]}),t.jsxs(Card,{children:[t.jsxs(In,{children:[t.jsx(Rn,{onFilter:C}),t.jsxs(Ln,{children:[t.jsxs(Button,{variant:"outline",onClick:()=>j(),disabled:h,children:[t.jsx(Ue,{size:16}),"새로고침"]}),t.jsxs(Button,{variant:"secondary",onClick:S,disabled:g.isLoading,children:[t.jsx(Qe,{size:16}),"Excel 다운로드"]}),t.jsxs(Button,{onClick:()=>a(!0),children:[t.jsx(qe,{size:16}),"품목 추가"]})]})]}),t.jsx(He,{columns:v,data:p||[],loading:h,emptyMessage:"등록된 품목이 없습니다."}),t.jsx(Ge,{currentPage:s,totalPages:b,onPageChange:o})]}),t.jsx(Modal,{isOpen:c,onClose:B,title:i?"품목 수정":"새 품목 추가",size:"lg",children:t.jsx(kn,{item:i,onSuccess:L,onCancel:B})})]})},Dn=l.span`
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
`,_n=l.div`
  display: flex;
  gap: 5px;
`,Mn=l.div`
  padding: 20px;
`,An=l.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
`,Pn=l.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`,Fn=()=>{var a,i;const[e,s]=f.useState(1),{data:o,isLoading:r,error:n}=te({queryKey:["receipts",e],queryFn:()=>en.getReceipts(e,20),keepPreviousData:!0}),c=[{key:"receiptNumber",label:"수령번호",sortable:!0,width:"120px"},{key:"itemName",label:"품목명",sortable:!0},{key:"receivedQuantity",label:"수령수량",width:"100px",render:(x,p)=>`${x}/${p.expectedQuantity}`},{key:"receiverName",label:"수령자",width:"100px"},{key:"department",label:"부서",width:"100px"},{key:"receivedDate",label:"수령일",width:"120px",render:x=>new Date(x).toLocaleDateString("ko-KR")}];return r?t.jsx(ie,{}):t.jsxs(Mn,{children:[t.jsx(K,{title:"수령 관리",subtitle:"물품 수령 현황을 확인하고 관리할 수 있습니다."}),t.jsxs(Card,{children:[t.jsx(An,{children:t.jsxs(Pn,{children:[t.jsxs(Button,{variant:"secondary",children:[t.jsx(Qe,{size:16}),"Excel 다운로드"]}),t.jsxs(Button,{children:[t.jsx(qe,{size:16}),"수령 등록"]})]})}),t.jsx(He,{columns:c,data:((a=o==null?void 0:o.data)==null?void 0:a.items)||[],loading:r,emptyMessage:"수령 내역이 없습니다."}),t.jsx(Ge,{currentPage:e,totalPages:((i=o==null?void 0:o.data)==null?void 0:i.totalPages)||0,onPageChange:s})]})]})},Un=l.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,Qn=l.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`,qn=l.select`
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
`,$e=({label:e,value:s,options:o,onChange:r,placeholder:n="선택하세요",disabled:c=!1,required:a=!1,className:i})=>{const x=p=>{r&&r(p.target.value)};return t.jsxs(Un,{className:i,children:[e&&t.jsxs(Qn,{children:[e,a&&t.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),t.jsxs(qn,{value:s||"",onChange:x,disabled:c,required:a,children:[n&&t.jsx("option",{value:"",disabled:!0,children:n}),o.map(p=>t.jsx("option",{value:p.value,disabled:p.disabled,children:p.label},p.value))]})]})},Ye={draft:"임시저장",submitted:"제출됨",pending_approval:"승인대기",approved:"승인됨",rejected:"거절됨",cancelled:"취소됨",purchased:"구매완료",received:"수령완료",closed:"완료"},Ee={low:"낮음",normal:"보통",high:"높음",emergency:"긴급"},it={draft:"#6B7280",submitted:"#3B82F6",pending_approval:"#F59E0B",approved:"#10B981",rejected:"#EF4444",cancelled:"#6B7280",purchased:"#8B5CF6",received:"#059669",closed:"#374151"},lt={low:"#10B981",normal:"#3B82F6",high:"#F59E0B",emergency:"#EF4444"},Nt={office_supplies:"사무용품",it_equipment:"IT장비",furniture:"가구",facility:"시설관리",marketing:"마케팅",travel:"출장",training:"교육",maintenance:"유지보수",software:"소프트웨어",service:"서비스",other:"기타"},Hn=l.form`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
`,Gn=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${e=>e.theme.spacing.md};
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`,ct=l.div`
  grid-column: 1 / -1;
`,Yn=l.textarea`
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
`,Vn=l.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  padding-top: ${e=>e.theme.spacing.md};
  border-top: 1px solid ${e=>e.theme.colors.border};
`,Kn=Object.entries(Nt).map(([e,s])=>({value:e,label:s})),Wn=Object.entries(Ee).map(([e,s])=>({value:e,label:s})),Xn=[{value:"direct",label:"직접구매"},{value:"quotation",label:"견적요청"},{value:"contract",label:"계약"},{value:"framework",label:"단가계약"},{value:"marketplace",label:"마켓플레이스"}],Jn=({request:e,onSuccess:s,onCancel:o})=>{const r=useQueryClient(),[n,c]=f.useState({itemName:(e==null?void 0:e.itemName)||"",specifications:(e==null?void 0:e.specifications)||"",quantity:(e==null?void 0:e.quantity)||1,estimatedPrice:(e==null?void 0:e.estimatedPrice)||0,preferredSupplier:(e==null?void 0:e.preferredSupplier)||"",category:(e==null?void 0:e.category)||"office_supplies",urgency:(e==null?void 0:e.urgency)||"medium",justification:(e==null?void 0:e.justification)||"",department:(e==null?void 0:e.department)||"",project:(e==null?void 0:e.project)||"",budgetCode:(e==null?void 0:e.budgetCode)||"",expectedDeliveryDate:e!=null&&e.expectedDeliveryDate?new Date(e.expectedDeliveryDate).toISOString().split("T")[0]:"",purchaseMethod:(e==null?void 0:e.purchaseMethod)||"direct"}),a=V(ee.createRequest,{onSuccess:()=>{r.invalidateQueries("purchase-requests"),$.success("구매 요청이 등록되었습니다."),s()},onError:d=>{var b,u;$.error(((u=(b=d.response)==null?void 0:b.data)==null?void 0:u.message)||"등록 중 오류가 발생했습니다.")}}),i=V(d=>ee.updateRequest(e.id,d),{onSuccess:()=>{r.invalidateQueries("purchase-requests"),$.success("구매 요청이 수정되었습니다."),s()},onError:d=>{var b,u;$.error(((u=(b=d.response)==null?void 0:b.data)==null?void 0:u.message)||"수정 중 오류가 발생했습니다.")}}),x=d=>{d.preventDefault();const b={...n,estimatedPrice:Number(n.estimatedPrice),quantity:Number(n.quantity)};e?i.mutate(b):a.mutate(b)},p=(d,b)=>{c(u=>({...u,[d]:b}))},h=a.isLoading||i.isLoading;return t.jsxs(Hn,{onSubmit:x,children:[t.jsxs(Gn,{children:[t.jsx(Input,{label:"품목명",value:n.itemName,onChange:d=>p("itemName",d.target.value),required:!0}),t.jsx(Input,{label:"수량",type:"number",value:n.quantity,onChange:d=>p("quantity",Number(d.target.value)),required:!0}),t.jsx(ct,{children:t.jsx(Input,{label:"사양",value:n.specifications,onChange:d=>p("specifications",d.target.value)})}),t.jsx(Input,{label:"예상 단가",type:"number",value:n.estimatedPrice,onChange:d=>p("estimatedPrice",Number(d.target.value))}),t.jsx(Input,{label:"선호 공급업체",value:n.preferredSupplier,onChange:d=>p("preferredSupplier",d.target.value)}),t.jsx($e,{label:"카테고리",value:n.category,options:Kn,onChange:d=>p("category",d)}),t.jsx($e,{label:"긴급도",value:n.urgency,options:Wn,onChange:d=>p("urgency",d)}),t.jsx(Input,{label:"부서",value:n.department,onChange:d=>p("department",d.target.value),required:!0}),t.jsx(Input,{label:"프로젝트",value:n.project||"",onChange:d=>p("project",d.target.value)}),t.jsx(Input,{label:"예산 코드",value:n.budgetCode||"",onChange:d=>p("budgetCode",d.target.value)}),t.jsx(Input,{label:"희망 납기일",type:"date",value:n.expectedDeliveryDate||"",onChange:d=>p("expectedDeliveryDate",d.target.value)}),t.jsx($e,{label:"구매방법",value:n.purchaseMethod,options:Xn,onChange:d=>p("purchaseMethod",d)}),t.jsx(ct,{children:t.jsxs("div",{children:[t.jsx("label",{children:"구매 사유"}),t.jsx(Yn,{value:n.justification,onChange:d=>p("justification",d.target.value),placeholder:"구매가 필요한 사유를 상세히 입력해주세요...",required:!0})]})})]}),t.jsxs(Vn,{children:[t.jsx(Button,{type:"button",variant:"outline",onClick:o,children:"취소"}),t.jsx(Button,{type:"submit",loading:h,children:e?"수정":"등록"})]})]})},Zn=l.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`,er=l.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`,tr=l.input`
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
`,be=({label:e,type:s="text",value:o,onChange:r,placeholder:n,disabled:c=!1,required:a=!1,className:i})=>t.jsxs(Zn,{className:i,children:[e&&t.jsxs(er,{children:[e,a&&t.jsx("span",{style:{color:"#ef4444"},children:"*"})]}),t.jsx(tr,{type:s,value:o||"",onChange:r,placeholder:n,disabled:c,required:a})]}),sr=l.button`
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
`,nr=l.div`
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
`,X=({children:e,variant:s="primary",size:o="md",disabled:r=!1,loading:n=!1,onClick:c,type:a="button",className:i})=>t.jsxs(sr,{variant:s,size:o,disabled:r||n,loading:n,onClick:c,type:a,className:i,children:[n&&t.jsx(nr,{}),e]}),rr=l.div`
  display: flex;
  gap: ${e=>e.theme.spacing.md};
  align-items: end;
  flex-wrap: wrap;
`;[...Object.entries(Ye).map(([e,s])=>({value:e,label:s}))];const or=[{value:"",label:"전체 긴급도"},...Object.entries(Ee).map(([e,s])=>({value:e,label:s}))],ar=({onFilter:e})=>{const[s,o]=f.useState({}),r=(c,a)=>{const i={...s,[c]:a||void 0};o(i),e(i)},n=()=>{o({}),e({})};return t.jsxs(rr,{children:[t.jsx(be,{placeholder:"품목명 또는 요청번호로 검색...",value:s.search||"",onChange:c=>r("search",c.target.value)}),t.jsx($e,{placeholder:"긴급도",value:s.urgency||"",options:or,onChange:c=>r("urgency",c)}),t.jsx(be,{placeholder:"부서",value:s.department||"",onChange:c=>r("department",c.target.value)}),t.jsx(be,{label:"시작일",type:"date",value:s.dateFrom||"",onChange:c=>r("dateFrom",c.target.value)}),t.jsx(be,{label:"종료일",type:"date",value:s.dateTo||"",onChange:c=>r("dateTo",c.target.value)}),t.jsxs(X,{variant:"outline",onClick:n,children:[t.jsx(bt,{size:16}),"초기화"]})]})},ir=l.div`
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
`,lr=l.div`
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
`,cr=l.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${e=>e.theme.spacing.lg};
  border-bottom: 1px solid ${e=>e.theme.colors.border};
`,dr=l.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
  margin: 0;
`,pr=l.button`
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
`,ur=l.div`
  padding: ${e=>e.theme.spacing.lg};
`,St=({isOpen:e,onClose:s,title:o,children:r,size:n="md",closable:c=!0})=>{f.useEffect(()=>{const i=x=>{x.key==="Escape"&&c&&s()};return e&&(document.addEventListener("keydown",i),document.body.style.overflow="hidden"),()=>{document.removeEventListener("keydown",i),document.body.style.overflow="unset"}},[e,s,c]);const a=i=>{i.target===i.currentTarget&&c&&s()};return e?t.jsx(ir,{isOpen:e,onClick:a,children:t.jsxs(lr,{size:n,children:[t.jsxs(cr,{children:[t.jsx(dr,{children:o}),c&&t.jsx(pr,{onClick:s,children:t.jsx(we,{size:20})})]}),t.jsx(ur,{children:r})]})}):null},hr=l.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
`,xr=l.div`
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
`,mr=l.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.sm};
`,gr=l.textarea`
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
`,fr=l.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  padding-top: ${e=>e.theme.spacing.md};
  border-top: 1px solid ${e=>e.theme.colors.border};
`,br=l.div`
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
`,vr=({request:e,isOpen:s,onClose:o,onSubmit:r,loading:n=!1})=>{const[c,a]=f.useState(null),[i,x]=f.useState(""),p=()=>{c&&r(c,i||void 0)},h=()=>{a(null),x(""),o()};return t.jsx(St,{isOpen:s,onClose:h,title:"구매 요청 승인",size:"lg",children:t.jsxs(hr,{children:[t.jsxs(xr,{children:[t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"요청번호:"}),t.jsx("span",{className:"value",children:e.requestNumber})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"품목명:"}),t.jsx("span",{className:"value",children:e.itemName})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"수량:"}),t.jsxs("span",{className:"value",children:[e.quantity.toLocaleString(),"개"]})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"예상금액:"}),t.jsxs("span",{className:"value",children:["₩",e.totalBudget.toLocaleString()]})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"요청자:"}),t.jsxs("span",{className:"value",children:[e.requesterName," (",e.department,")"]})]}),t.jsxs("div",{className:"info-row",children:[t.jsx("span",{className:"label",children:"요청일:"}),t.jsx("span",{className:"value",children:new Date(e.requestDate).toLocaleDateString("ko-KR")})]})]}),e.justification&&t.jsxs("div",{children:[t.jsx("h4",{children:"구매 사유"}),t.jsx("p",{style:{padding:"12px",background:"#f8fafc",borderRadius:"8px"},children:e.justification})]}),t.jsxs(mr,{children:[t.jsx("label",{htmlFor:"comments",children:"승인/거절 의견"}),t.jsx(gr,{id:"comments",value:i,onChange:d=>x(d.target.value),placeholder:"승인 또는 거절 사유를 입력해주세요... (선택사항)"})]}),c==="reject"&&t.jsxs(br,{children:[t.jsx(ft,{size:20}),t.jsx("span",{children:"거절 시 요청자에게 알림이 전송되며, 요청이 거절 상태로 변경됩니다."})]}),t.jsxs(fr,{children:[t.jsx(X,{variant:"outline",onClick:h,children:"취소"}),t.jsxs(X,{variant:"danger",onClick:()=>a("reject"),disabled:n,children:[t.jsx(we,{size:16}),"거절"]}),t.jsxs(X,{variant:"success",onClick:()=>a("approve"),disabled:n,children:[t.jsx(ce,{size:16}),"승인"]}),c&&t.jsx(X,{onClick:p,loading:n,variant:c==="approve"?"success":"danger",children:c==="approve"?"승인 확정":"거절 확정"})]})]})})},jr=l.div`
  display: flex;
  flex-direction: column;
  gap: ${e=>e.theme.spacing.lg};
`,ve=l.div`
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.background};
  border-radius: ${e=>e.theme.borderRadius.md};
  
  h3 {
    margin-bottom: ${e=>e.theme.spacing.md};
    color: ${e=>e.theme.colors.text};
    font-size: 1.1rem;
    font-weight: 600;
  }
`,De=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${e=>e.theme.spacing.md};
  
  @media (max-width: ${e=>e.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`,M=l.div`
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
`,yr=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${e=>{switch(e.status){case"pending_approval":return"#F59E0B20";case"approved":return"#10B98120";case"rejected":return"#EF444420";default:return"#6B728020"}}};
  color: ${e=>{switch(e.status){case"pending_approval":return"#F59E0B";case"approved":return"#10B981";case"rejected":return"#EF4444";default:return"#6B7280"}}};
`,$r=l.div`
  padding: ${e=>e.theme.spacing.md};
  background: ${e=>e.theme.colors.surface};
  border: 1px solid ${e=>e.theme.colors.border};
  border-radius: ${e=>e.theme.borderRadius.md};
  line-height: 1.6;
`,wr=l.div`
  display: flex;
  justify-content: flex-end;
  gap: ${e=>e.theme.spacing.sm};
  padding-top: ${e=>e.theme.spacing.md};
  border-top: 1px solid ${e=>e.theme.colors.border};
`,kr=({request:e,isOpen:s,onClose:o,onEdit:r,onApprove:n})=>{const c=["draft","submitted","rejected"].includes(e.status),a=e.status==="pending_approval";return t.jsx(St,{isOpen:s,onClose:o,title:"구매 요청 상세",size:"lg",children:t.jsxs(jr,{children:[t.jsxs(ve,{children:[t.jsx("h3",{children:"기본 정보"}),t.jsxs(De,{children:[t.jsxs(M,{children:[t.jsx(ue,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"요청번호"}),t.jsx("div",{className:"value",children:e.requestNumber})]})]}),t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"상태"}),t.jsx(yr,{status:e.status,children:Ye[e.status]})]})}),t.jsxs(M,{children:[t.jsx(Wt,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"요청자"}),t.jsx("div",{className:"value",children:e.requesterName})]})]}),t.jsxs(M,{children:[t.jsx(Xt,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"요청일"}),t.jsx("div",{className:"value",children:new Date(e.requestDate).toLocaleDateString("ko-KR")})]})]})]})]}),t.jsxs(ve,{children:[t.jsx("h3",{children:"품목 정보"}),t.jsxs(De,{children:[t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"품목명"}),t.jsx("div",{className:"value",children:e.itemName})]})}),t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"수량"}),t.jsxs("div",{className:"value",children:[e.quantity.toLocaleString(),"개"]})]})}),e.specifications&&t.jsx(M,{style:{gridColumn:"1 / -1"},children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"사양"}),t.jsx("div",{className:"value",children:e.specifications})]})}),t.jsxs(M,{children:[t.jsx(gt,{className:"icon",size:20}),t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"예상금액"}),t.jsxs("div",{className:"value",children:["₩",e.totalBudget.toLocaleString()]})]})]}),t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"카테고리"}),t.jsx("div",{className:"value",children:Nt[e.category]})]})}),t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"긴급도"}),t.jsx("div",{className:"value",children:Ee[e.urgency]})]})}),e.preferredSupplier&&t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"선호 공급업체"}),t.jsx("div",{className:"value",children:e.preferredSupplier})]})})]})]}),t.jsxs(ve,{children:[t.jsx("h3",{children:"부서 및 프로젝트 정보"}),t.jsxs(De,{children:[t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"부서"}),t.jsx("div",{className:"value",children:e.department})]})}),e.project&&t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"프로젝트"}),t.jsx("div",{className:"value",children:e.project})]})}),e.budgetCode&&t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"예산 코드"}),t.jsx("div",{className:"value",children:e.budgetCode})]})}),e.expectedDeliveryDate&&t.jsx(M,{children:t.jsxs("div",{className:"content",children:[t.jsx("div",{className:"label",children:"희망 납기일"}),t.jsx("div",{className:"value",children:new Date(e.expectedDeliveryDate).toLocaleDateString("ko-KR")})]})})]})]}),e.justification&&t.jsxs(ve,{children:[t.jsx("h3",{children:"구매 사유"}),t.jsx($r,{children:e.justification})]}),t.jsxs(wr,{children:[t.jsx(X,{variant:"outline",onClick:o,children:"닫기"}),c&&r&&t.jsxs(X,{variant:"outline",onClick:r,children:[t.jsx(vt,{size:16}),"수정"]}),a&&n&&t.jsxs(X,{variant:"success",onClick:n,children:[t.jsx(ce,{size:16}),"승인처리"]})]})]})})};Select,filters.category,categoryOptions;const Cr=(e=1,s=20,o={})=>{var p,h,d,b,u;const r=useQueryClient(),{data:n,isLoading:c,error:a,refetch:i}=te(["purchase-requests",e,s,o],()=>ee.getRequests(e,s,o),{keepPreviousData:!0,staleTime:5*60*1e3}),{data:x}=te(["purchase-requests-stats"],()=>ee.getStats(),{staleTime:10*60*1e3});return{requests:((p=n==null?void 0:n.data)==null?void 0:p.items)||[],total:((h=n==null?void 0:n.data)==null?void 0:h.total)||0,totalPages:((d=n==null?void 0:n.data)==null?void 0:d.totalPages)||0,hasNext:((b=n==null?void 0:n.data)==null?void 0:b.hasNext)||!1,hasPrev:((u=n==null?void 0:n.data)==null?void 0:u.hasPrev)||!1,stats:(x==null?void 0:x.data)||{total:0,pending:0,approved:0,rejected:0,thisMonth:0,lastMonth:0},loading:c,error:a,refetch:i,invalidate:()=>{r.invalidateQueries("purchase-requests"),r.invalidateQueries("purchase-requests-stats")}}},dt=l.div`
  padding: 20px;
`,Nr=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,je=l(Card)`
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
`,Sr=l.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`,Er=l.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`,Tr=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${e=>it[e.status]}20;
  color: ${e=>it[e.status]};
`,Rr=l.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${e=>lt[e.urgency]}20;
  color: ${e=>lt[e.urgency]};
`,zr=l.div`
  display: flex;
  gap: 5px;
`,Ir=l.span`
  font-weight: 600;
  color: ${e=>e.theme.colors.text};
`,Lr=l.div`
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
`,Br=()=>{const e=rs(),[s,o]=f.useState(1),[r,n]=f.useState({}),[c,a]=f.useState(!1),[i,x]=f.useState(null),[p,h]=f.useState(null),[d,b]=f.useState(null),[u,j]=f.useState([]),{requests:m,loading:g,error:v,totalPages:C,stats:k,refetch:w}=Cr(s,20,r),S=V(ee.deleteRequest,{onSuccess:()=>{e.invalidateQueries("purchase-requests"),$.success("구매 요청이 삭제되었습니다.")},onError:y=>{var R,H;$.error(((H=(R=y.response)==null?void 0:R.data)==null?void 0:H.message)||"삭제 중 오류가 발생했습니다.")}}),B=V(ee.approveRequest,{onSuccess:()=>{e.invalidateQueries("purchase-requests"),b(null),$.success("구매 요청이 처리되었습니다.")},onError:y=>{var R,H;$.error(((H=(R=y.response)==null?void 0:R.data)==null?void 0:H.message)||"승인 처리 중 오류가 발생했습니다.")}}),L=V(ee.exportRequests,{onSuccess:y=>{const R=window.URL.createObjectURL(y),H=document.createElement("a");H.href=R,H.download=`purchase_requests_${new Date().toISOString().split("T")[0]}.xlsx`,document.body.appendChild(H),H.click(),document.body.removeChild(H),window.URL.revokeObjectURL(R),$.success("Excel 파일이 다운로드되었습니다.")},onError:()=>{$.error("내보내기 중 오류가 발생했습니다.")}}),z=f.useMemo(()=>[{key:"requestNumber",label:"요청번호",sortable:!0,width:"120px",render:y=>t.jsx("span",{style:{fontFamily:"monospace",fontSize:"0.9rem"},children:y})},{key:"itemName",label:"품목 정보",sortable:!0,render:(y,R)=>t.jsxs(Lr,{children:[t.jsx("div",{className:"request-title",children:y}),t.jsxs("div",{className:"request-meta",children:[t.jsxs("span",{children:["수량: ",R.quantity.toLocaleString(),"개"]}),R.specifications&&t.jsxs("span",{children:["사양: ",R.specifications]})]})]})},{key:"totalBudget",label:"예상금액",sortable:!0,width:"120px",align:"right",render:y=>t.jsxs(Ir,{children:["₩",y.toLocaleString()]})},{key:"requesterName",label:"요청자",sortable:!0,width:"100px",render:(y,R)=>t.jsxs("div",{children:[t.jsx("div",{style:{fontWeight:"500"},children:y}),t.jsx("div",{style:{fontSize:"0.8rem",color:"#666"},children:R.department})]})},{key:"urgency",label:"긴급도",width:"80px",render:y=>t.jsxs(Rr,{urgency:y,children:[y==="emergency"&&t.jsx(Jt,{size:12}),Ee[y]]})},{key:"status",label:"상태",width:"120px",render:y=>t.jsxs(Tr,{status:y,children:[y==="pending_approval"&&t.jsx(Me,{size:12}),y==="approved"&&t.jsx(ce,{size:12}),y==="rejected"&&t.jsx(we,{size:12}),Ye[y]]})},{key:"requestDate",label:"요청일",sortable:!0,width:"100px",render:y=>new Date(y).toLocaleDateString("ko-KR")},{key:"actions",label:"관리",width:"150px",render:(y,R)=>t.jsxs(zr,{children:[t.jsx(Button,{size:"sm",variant:"outline",onClick:()=>I(R),title:"상세보기",children:t.jsx(Zt,{size:14})}),t.jsx(Button,{size:"sm",variant:"outline",onClick:()=>O(R),disabled:!Y(R),title:"수정",children:t.jsx(vt,{size:14})}),Et(R)&&t.jsx(Button,{size:"sm",variant:"success",onClick:()=>U(R),title:"승인처리",children:t.jsx(ce,{size:14})}),t.jsx(Button,{size:"sm",variant:"danger",onClick:()=>A(R.id),disabled:!ne(R),title:"삭제",children:t.jsx(es,{size:14})})]})}],[]),N=y=>{n(y),o(1)},I=y=>{h(y)},O=y=>{x(y),a(!0)},A=async y=>{window.confirm("정말로 이 구매 요청을 삭제하시겠습니까?")&&S.mutate(y)},U=y=>{b(y)},D=()=>{L.mutate(r)},Q=()=>{a(!1),x(null)},_=()=>{Q(),w()},q=(y,R)=>{d&&B.mutate({requestId:d.id,action:y,comments:R})},Y=y=>["draft","submitted","rejected"].includes(y.status),ne=y=>["draft","submitted","rejected"].includes(y.status),Et=y=>y.status==="pending_approval";return g?t.jsx(ie,{}):v?t.jsx(dt,{children:t.jsx(Card,{children:t.jsxs("div",{style:{textAlign:"center",padding:"40px"},children:[t.jsx("p",{children:"데이터를 불러오는 중 오류가 발생했습니다."}),t.jsx(Button,{onClick:()=>w(),children:"다시 시도"})]})})}):t.jsxs(dt,{children:[t.jsx(K,{title:"구매 요청 관리",subtitle:"구매 요청을 등록하고 승인 프로세스를 관리할 수 있습니다."}),t.jsxs(Nr,{children:[t.jsxs(je,{color:"#3B82F6",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(jt,{size:24}),t.jsx("span",{children:"전체 요청"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.total)||0}),t.jsx("div",{className:"stat-label",children:"총 구매 요청"}),t.jsxs("div",{className:"stat-change positive",children:["이번 달 +",(k==null?void 0:k.thisMonth)||0]})]}),t.jsxs(je,{color:"#F59E0B",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(Me,{size:24}),t.jsx("span",{children:"승인 대기"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.pending)||0}),t.jsx("div",{className:"stat-label",children:"처리 대기중"})]}),t.jsxs(je,{color:"#10B981",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(ce,{size:24}),t.jsx("span",{children:"승인 완료"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.approved)||0}),t.jsx("div",{className:"stat-label",children:"승인된 요청"})]}),t.jsxs(je,{color:"#EF4444",children:[t.jsxs("div",{className:"stat-header",children:[t.jsx(we,{size:24}),t.jsx("span",{children:"거절됨"})]}),t.jsx("div",{className:"stat-value",children:(k==null?void 0:k.rejected)||0}),t.jsx("div",{className:"stat-label",children:"거절된 요청"})]})]}),t.jsxs(Card,{children:[t.jsxs(Sr,{children:[t.jsx(ar,{onFilter:N}),t.jsxs(Er,{children:[t.jsxs(Button,{variant:"outline",onClick:()=>w(),disabled:g,children:[t.jsx(Ue,{size:16}),"새로고침"]}),t.jsxs(Button,{variant:"secondary",onClick:D,disabled:L.isLoading,children:[t.jsx(Qe,{size:16}),"Excel 다운로드"]}),t.jsxs(Button,{onClick:()=>a(!0),children:[t.jsx(qe,{size:16}),"구매 요청"]})]})]}),t.jsx(He,{columns:z,data:m||[],loading:g,emptyMessage:"등록된 구매 요청이 없습니다.",selectable:!0,selectedItems:u,onSelectItems:j}),t.jsx(Ge,{currentPage:s,totalPages:C,onPageChange:o})]}),t.jsx(Modal,{isOpen:c,onClose:Q,title:i?"구매 요청 수정":"새 구매 요청",size:"lg",children:t.jsx(Jn,{request:i,onSuccess:_,onCancel:Q})}),p&&t.jsx(kr,{request:p,isOpen:!!p,onClose:()=>h(null),onEdit:()=>{x(p),h(null),a(!0)},onApprove:()=>{b(p),h(null)}}),d&&t.jsx(vr,{request:d,isOpen:!!d,onClose:()=>b(null),onSubmit:q,loading:B.isLoading})]})},Or=l.div`
  padding: 20px;
`,Dr=l.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: ${e=>e.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`,_r=l.textarea`
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
`,Mr=l(Card)`
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
`,Ar=()=>{const[e,s]=f.useState(""),[o,r]=f.useState(null),n=V({mutationFn:sn.parseMessage,onSuccess:i=>{r(i.data),$.success("메시지가 성공적으로 파싱되었습니다.")},onError:i=>{var x,p;$.error(((p=(x=i.response)==null?void 0:x.data)==null?void 0:p.message)||"파싱 중 오류가 발생했습니다.")}}),c=()=>{if(!e.trim()){$.error("메시지를 입력해주세요.");return}n.mutate(e)},a=()=>{s(""),r(null)};return t.jsxs(Or,{children:[t.jsx(K,{title:"카카오톡 메시지 처리",subtitle:"카카오톡 메시지를 파싱하여 수령 정보를 추출합니다."}),t.jsxs(Dr,{children:[t.jsxs(Card,{children:[t.jsx("h3",{children:"메시지 입력"}),t.jsx(_r,{value:e,onChange:i=>s(i.target.value),placeholder:"카카오톡 메시지를 여기에 붙여넣기 하세요..."}),t.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"20px"},children:[t.jsxs(Button,{onClick:c,loading:n.isPending,disabled:!e.trim(),children:[t.jsx(ts,{size:16}),"파싱하기"]}),t.jsxs(Button,{variant:"outline",onClick:a,children:[t.jsx(Ue,{size:16}),"초기화"]})]})]}),t.jsxs(Mr,{children:[t.jsx("h3",{children:"파싱 결과"}),o?t.jsxs("div",{children:[o.itemNo&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"품목번호:"}),t.jsx("span",{className:"value",children:o.itemNo})]}),o.itemName&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"품목명:"}),t.jsx("span",{className:"value",children:o.itemName})]}),o.quantity&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"수량:"}),t.jsxs("span",{className:"value",children:[o.quantity,"개"]})]}),o.receiver&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"수령자:"}),t.jsx("span",{className:"value",children:o.receiver})]}),o.notes&&t.jsxs("div",{className:"result-item",children:[t.jsx("span",{className:"label",children:"메모:"}),t.jsx("span",{className:"value",children:o.notes})]})]}):t.jsxs("div",{style:{textAlign:"center",color:"#666",padding:"40px"},children:[t.jsx(ut,{size:48,style:{opacity:.3,marginBottom:"16px"}}),t.jsx("p",{children:"메시지를 파싱하면 결과가 여기에 표시됩니다."})]})]})]})]})},Pr=l.div`
  padding: 20px;
`,Fr=l.div`
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
`,Ur=l.input`
  display: none;
`,Qr=l.div`
  margin-top: 30px;
  
  .result-text {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: ${e=>e.theme.colors.success};
  }
`,qr=()=>{const[e,s]=f.useState(!1),[o,r]=f.useState(null),n=V(tn.uploadExcel,{onSuccess:h=>{var d;r(h.data),$.success(`Excel 파일이 업로드되었습니다. ${((d=h.data)==null?void 0:d.itemCount)||0}개 항목이 처리되었습니다.`)},onError:h=>{var d,b;$.error(((b=(d=h.response)==null?void 0:d.data)==null?void 0:b.message)||"업로드 중 오류가 발생했습니다.")}}),c=h=>{if(h){if(!h.name.endsWith(".xlsx")&&!h.name.endsWith(".xls")){$.error("Excel 파일만 업로드 가능합니다.");return}n.mutate(h)}},a=h=>{h.preventDefault(),s(!1);const d=h.dataTransfer.files;d.length>0&&c(d[0])},i=h=>{h.preventDefault(),s(!0)},x=()=>{s(!1)},p=()=>{const h=document.getElementById("file-input");h==null||h.click()};return t.jsxs(Pr,{children:[t.jsx(K,{title:"파일 관리",subtitle:"Excel 파일을 업로드하여 품목 데이터를 일괄 등록할 수 있습니다."}),t.jsxs(Card,{children:[t.jsxs(Fr,{isDragOver:e,onDrop:a,onDragOver:i,onDragLeave:x,onClick:p,children:[t.jsx(ht,{size:48,className:"upload-icon"}),t.jsx("div",{className:"upload-text",children:"Excel 파일을 여기에 끌어다 놓거나 클릭하여 선택하세요"}),t.jsx("div",{className:"upload-hint",children:".xlsx, .xls 파일만 지원됩니다"})]}),t.jsx(Ur,{id:"file-input",type:"file",accept:".xlsx,.xls",onChange:h=>{var b;const d=(b=h.target.files)==null?void 0:b[0];d&&c(d)}}),n.isLoading&&t.jsx("div",{style:{textAlign:"center",marginTop:"20px"},children:t.jsx("p",{children:"파일을 업로드하고 있습니다..."})}),o&&t.jsxs(Qr,{children:[t.jsxs("div",{className:"result-text",children:["✅ 업로드 완료! ",o.itemCount,"개의 품목이 등록되었습니다."]}),t.jsxs(Button,{variant:"outline",children:[t.jsx(jt,{size:16}),"처리 결과 확인"]})]})]})]})},Hr=l.div`
  padding: 20px;
`,Gr=()=>{const{data:e,isLoading:s}=te("statistics",nn.getStats);return s?t.jsx(ie,{}):t.jsxs(Hr,{children:[t.jsx(K,{title:"통계 분석",subtitle:"시스템 사용 현황과 트렌드를 분석합니다."}),t.jsx(Card,{children:t.jsxs("div",{style:{textAlign:"center",padding:"60px"},children:[t.jsx("h3",{children:"통계 기능 준비 중"}),t.jsx("p",{children:"차트와 분석 기능이 곧 추가될 예정입니다."})]})})]})},Yr=l.div`
  padding: 20px;
`,Vr=()=>{const{data:e,isLoading:s}=te("logs",()=>rn.getLogs());return s?t.jsx(ie,{}):t.jsxs(Yr,{children:[t.jsx(K,{title:"시스템 로그",subtitle:"시스템 활동 로그를 확인할 수 있습니다."}),t.jsx(Card,{children:t.jsxs("div",{style:{textAlign:"center",padding:"60px"},children:[t.jsx("h3",{children:"로그 기능 준비 중"}),t.jsx("p",{children:"시스템 로그 조회 기능이 곧 추가될 예정입니다."})]})})]})};const Kr=new os({defaultOptions:{queries:{refetchOnWindowFocus:!1,retry:1,staleTime:5*60*1e3}}}),Wr=()=>t.jsx(as,{client:Kr,children:t.jsxs(ss,{theme:ys,children:[t.jsx($s,{}),t.jsx(Lt,{children:t.jsxs("div",{className:"App",children:[t.jsx(Bt,{children:t.jsxs(G,{path:"/",element:t.jsx(Ys,{}),children:[t.jsx(G,{index:!0,element:t.jsx(Ve,{to:"/dashboard",replace:!0})}),t.jsx(G,{path:"dashboard",element:t.jsx(dn,{})}),t.jsx(G,{path:"inventory",element:t.jsx(On,{})}),t.jsx(G,{path:"receipts",element:t.jsx(Fn,{})}),t.jsx(G,{path:"purchase-requests",element:t.jsx(Br,{})}),t.jsx(G,{path:"kakao",element:t.jsx(Ar,{})}),t.jsx(G,{path:"upload",element:t.jsx(qr,{})}),t.jsx(G,{path:"statistics",element:t.jsx(Gr,{})}),t.jsx(G,{path:"logs",element:t.jsx(Vr,{})}),t.jsx(G,{path:"*",element:t.jsx(Ve,{to:"/dashboard",replace:!0})})]})}),t.jsx(Pe,{position:"top-right",autoClose:3e3,hideProgressBar:!1,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0,theme:"light"})]})})]})});const Xr=Ae.createRoot(document.getElementById("root"));Xr.render(t.jsx(T.StrictMode,{children:t.jsx(Wr,{})}));
//# sourceMappingURL=index-ee2e6ad1.js.map
