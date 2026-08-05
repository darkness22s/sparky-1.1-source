import{P as e,V as t,Z as n,t as r}from"./use-atom-query-runner-BCcLcfEE.js";import{$i as i,Aa as a,Ca as o,Co as s,H as c,Io as l,Ko as u,Lo as d,Qo as f,Uo as p,Yo as m,_o as h,a as g,as as _,ba as v,ho as y,j as b,ka as x,n as S,q as C,zo as w}from"./environments-H8or_7qJ.js";import{c as T,i as E,n as D,t as O}from"./tooltip-B84yBXVA.js";import{As as k,Kl as A,Ql as j,Wr as M,Yl as N,rl as P}from"./demo-8-603qMm.js";import{a as ee,i as te,l as ne,s as re}from"./toast-DYmlmOgz.js";import{$ as ie,Dt as ae,Et as oe,J as se,Q as F,Tt as ce,U as le,X as ue,Z as I,_t as de,bt as fe,c as pe,ft as me,gt as he,ht as ge,lt as _e,mt as ve,n as ye,o as be,s as xe,t as Se,ut as Ce,vt as we,yt as L}from"./composerMentionDrag-WrLoUUrF.js";import{Bt as Te,Ft as Ee,Gt as De,It as Oe,Nn as ke,Un as Ae,Ut as je,V as Me,ft as Ne,ht as Pe,kn as Fe,n as Ie,sr as Le,t as Re,vn as ze,vr as Be,z as Ve,zt as He}from"./scroll-area-BaGSrRPu.js";import{a as Ue,c as We,i as Ge,n as Ke,o as qe,r as Je,s as Ye,t as Xe}from"./fileCommentAnnotations-BOFt8Prq.js";var Ze=o(`folder-tree`,[[`path`,{d:`M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z`,key:`hod4my`}],[`path`,{d:`M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z`,key:`w4yl2u`}],[`path`,{d:`M3 5a2 2 0 0 0 2 2h3`,key:`f2jnh7`}],[`path`,{d:`M3 3v13a2 2 0 0 0 2 2h3`,key:`k8epm1`}]]),R=j(N(),1),Qe=typeof window>`u`?R.useEffect:R.useLayoutEffect;function $e({file:e,options:t,lineAnnotations:n,selectedLines:r,prerenderedHTML:i,metrics:a,hasGutterRenderUtility:o,hasCustomHeader:s,disableWorkerPool:c,contentEditable:l}){let u=he(),d=r!==void 0,f=(0,R.useContext)(Me),p=L(),m=(0,R.useRef)(null),h=He(r=>{if(r!=null){if(m.current!=null)throw Error(`File: An instance should not already exist when a node is created`);u==null?m.current=new Ye(et({controlledSelection:d,contentEditable:l,hasCustomHeader:s,hasEditor:p!==void 0,hasGutterRenderUtility:o,options:t}),c?void 0:f,!0):m.current=new qe(et({controlledSelection:d,contentEditable:l,hasCustomHeader:s,hasEditor:p!==void 0,hasGutterRenderUtility:o,options:t}),u,a,c?void 0:f,!0),m.current.hydrate({file:e,fileContainer:r,lineAnnotations:n,prerenderedHTML:i})}else{if(m.current==null)throw Error(`File: A File instance should exist when unmounting`);m.current.cleanUp(),m.current=null}});return Qe(()=>{if(m.current==null)return;let i=et({controlledSelection:d,contentEditable:l,hasCustomHeader:s,hasEditor:p!==void 0,hasGutterRenderUtility:o,options:t}),a=!Ve(m.current.options,i);m.current.setOptions(i),m.current.render({file:e,lineAnnotations:n,forceRender:a}),r!==void 0&&m.current.setSelectedLines(r)}),Qe(()=>{if(l&&m.current!=null){if(p===void 0)throw Error(`File: Editor is not attached`);return p.edit(m.current)}},[l,p]),{ref:h,getHoveredLine:(0,R.useCallback)(()=>m.current?.getHoveredLine(),[])}}function et({options:e,controlledSelection:t,contentEditable:n,hasCustomHeader:r,hasEditor:i,hasGutterRenderUtility:a}){let o=n&&i,s=t||a||r;if(!s&&!o)return e;let c={...e};return s&&(c={...c,controlledSelection:t,renderCustomHeader:r?je:e?.renderCustomHeader,renderGutterUtility:a?je:e?.renderGutterUtility}),o&&(c={...c,useTokenTransformer:!0}),c}var z=A();function tt({file:e,lineAnnotations:t,selectedLines:n,options:r,metrics:i,className:a,style:o,renderAnnotation:s,renderCustomHeader:c,renderHeaderPrefix:l,renderHeaderMetadata:u,prerenderedHTML:d,renderGutterUtility:f,disableWorkerPool:p=!1,contentEditable:m=!1}){let{ref:h,getHoveredLine:g}=$e({file:e,options:r,metrics:i,lineAnnotations:t,selectedLines:n,prerenderedHTML:d,hasGutterRenderUtility:f!=null,hasCustomHeader:c!=null,disableWorkerPool:p,contentEditable:m});return(0,z.jsx)(ke,{ref:h,className:a,style:o,children:de(We({file:e,renderAnnotation:s,renderCustomHeader:c,renderHeaderPrefix:l,renderHeaderMetadata:u,renderGutterUtility:f,lineAnnotations:t,getHoveredLine:g}),d)})}var nt=_(),rt=[`.avif`,`.gif`,`.ico`,`.jpeg`,`.jpg`,`.png`,`.svg`,`.webp`];function it(e,t){let n=e.split(/[?#]/,1)[0]?.toLowerCase()??``;return t.some(e=>n.endsWith(e))}function B(e){return it(e,rt)}var V=100,at=class{#e=[];#t=[];#n;constructor(e){this.#n=Math.max(1,e?.maxEntries??V)}get canUndo(){return this.#e.length>0}get canRedo(){return this.#t.length>0}clear(){this.#e.length=0,this.#t.length=0}clearRedo(){this.#t.length=0}push(e){this.#e.push(e),this.clearRedo(),this.#e.length>this.#n&&this.#e.shift()}setLastUndoSelectionsAfter(e){let t=this.#e[this.#e.length-1];t!==void 0&&(t.selectionsAfter=e.map(e=>({...e})))}setLastUndoLineAnnotations(e,t){let n=this.#e[this.#e.length-1];n!==void 0&&(n.lineAnnotationsBefore=e.slice(),n.lineAnnotationsAfter=t.slice())}peekUndo(){return this.#e[this.#e.length-1]}replaceLastUndo(e){if(this.#e.length===0){this.push(e);return}this.#e[this.#e.length-1]=e,this.clearRedo()}popUndoToRedo(){let e=this.#e.pop();if(e!==void 0)return this.#t.push(e),e}popRedoToUndo(){let e=this.#t.pop();if(e!==void 0)return this.#e.push(e),e}};function ot(e,t,n,r,i,a,o,s){let c=[...t].sort((e,t)=>e.start-t.start),l=[];for(let t=0,n=0;t<c.length;t++){let r=c[t],i=e.getTextSlice(r.start,r.end),a=r.start+n;l.push({start:a,end:a+r.text.length,text:i}),n+=r.text.length-(r.end-r.start)}return{forwardEdits:c.map(e=>({...e})),inverseEdits:l,versionBefore:n,versionAfter:r,selectionsBefore:i?.map(e=>({...e})),selectionsAfter:a?.map(e=>({...e})),lineAnnotationsBefore:o?.slice(),lineAnnotationsAfter:s?.slice()}}function st(e,t){if(e===void 0||e.forwardEdits.length===0||e.forwardEdits.length!==e.inverseEdits.length||e.forwardEdits.length!==t.forwardEdits.length||t.forwardEdits.length!==t.inverseEdits.length)return!1;let n;for(let r=0;r<e.forwardEdits.length;r++){let i=e.forwardEdits[r],a=e.inverseEdits[r],o=t.forwardEdits[r],s=t.inverseEdits[r],c=ut(o.start,e.forwardEdits),l=i.start<=i.end&&i.text.length>0&&!i.text.includes(`
`)&&!a.text.includes(`
`),u=o.start===o.end&&o.text.length>0&&s.text.length===0;if(l&&u){if(c!==i.end||(n??=`insert`,n!==`insert`))return!1;continue}let d=i.text.length===0&&i.end>i.start&&a.text.length>0,f=o.text.length===0&&o.end>o.start&&s.text.length>0;if(d&&f){if(c===i.end){if(n??=`delete`,n!==`delete`)return!1;continue}if(c+(o.end-o.start)!==i.start||(n??=`backspace`,n!==`backspace`))return!1;continue}return!1}return n!==void 0}function ct(e,t){let n=[],r=[];for(let i=0;i<e.forwardEdits.length;i++){let a=e.forwardEdits[i],o=e.inverseEdits[i],s=t.forwardEdits[i],c=t.inverseEdits[i],l=ut(s.start,e.forwardEdits);if(a.text.length>0){n.push({start:a.start,end:a.end,text:a.text+s.text}),r.push(o.text);continue}if(l===a.end){n.push({start:a.start,end:l+(s.end-s.start),text:``}),r.push(o.text+c.text);continue}n.push({start:Math.min(a.start,l),end:a.end,text:``}),r.push(c.text+o.text)}return{forwardEdits:n,inverseEdits:lt(n,r),versionBefore:e.versionBefore,versionAfter:t.versionAfter,selectionsBefore:e.selectionsBefore?.slice(),selectionsAfter:t.selectionsAfter?.slice(),lineAnnotationsBefore:e.lineAnnotationsBefore?.slice(),lineAnnotationsAfter:t.lineAnnotationsAfter?.slice()}}function lt(e,t){let n=[];for(let r=0,i=0;r<e.length;r++){let a=e[r],o=a.start+i;n.push({start:o,end:o+a.text.length,text:t[r]}),i+=a.text.length-(a.end-a.start)}return n}function ut(e,t){let n=e;for(let e of t){let t=e.end-e.start,r=e.text.length,i=r-t;if(!(n<e.start)){if(n>=e.start+r){n-=i;continue}n=e.start+Math.min(n-e.start,t)}}return n}var dt=1e5,ft=`\`~!@#$%^&*()-=+[{]}\\|;:'",.<>/?`,pt=class{static Original=0;static Added=1;constructor(e,t,n,r,i){this.source=e,this.offset=t,this.length=n,this.lineOffsetStart=r,this.lineOffsetEnd=i}get lineBreakCount(){return this.lineOffsetEnd-this.lineOffsetStart}},mt=class{lineOffsets;constructor(e){this.text=e,this.lineOffsets=Ne(e)}append(e){let t=this.text.length,n=Ne(e);for(let e=1;e<n.length;e++)this.lineOffsets.push(t+n[e]);return this.text+=e,t}},ht=class{left=null;right=null;parent=null;constructor(e,t=e.length,n=e.lineBreakCount){this.piece=e,this.subtreeLength=t,this.subtreeLineBreakCount=n}updateSubtreeLength(){this.subtreeLength=(this.left?.subtreeLength??0)+this.piece.length+(this.right?.subtreeLength??0),this.subtreeLineBreakCount=(this.left?.subtreeLineBreakCount??0)+this.piece.lineBreakCount+(this.right?.subtreeLineBreakCount??0)}},gt=class{#e;#t=new mt(``);#n=null;#r=[];#i=0;#a=0;#o=null;#s=null;constructor(e){this.#e=new mt(e),this.#y([this.#_(pt.Original,0,e.length)])}get lineCount(){return this.#a}getText(e){if(e===void 0)return this.#m();let t=this.offsetAt(e.start),n=this.offsetAt(e.end);return this.getTextSlice(t,n)}getLineText(e,t=!1){if(this.#o!==null&&this.#o[0]===e&&this.#o[1]===t)return this.#o[2];let n=this.#d(e);if(n===void 0)throw Error(`Line index out of range: ${e}`);let r=this.getTextSlice(n[0],n[1],!t);return this.#o=[e,t,r],this.#s=[e,t,r.length],r}getLineLength(e,t=!1){let n=this.#s,r=this.#o;if(n!==null&&n[0]===e&&n[1]===t)return n[2];if(r!==null&&r[0]===e&&r[1]===t){let n=r[2].length;return this.#s=[e,t,n],n}let i=this.#d(e);if(i===void 0)throw Error(`Line index out of range: ${e}`);let[a,o]=i,s=o-a;if(!t)for(;s>0&&_t(this.charAt(a+s-1).charCodeAt(0));)s--;return this.#s=[e,t,s],s}getTextSlice(e,t,n=!1){if(e>=t)return``;let r=H(e,0,this.#i),i=H(t,r,this.#i);if(r>=i)return``;let a=this.#l(r);if(a===void 0)return``;let o=[],[s,c]=a,l=i-r;for(;s!==null&&l>0;){let e=Math.min(s.piece.length-c,l),t=this.#g(s.piece.source),r=s.piece.offset+c,i=r+e;if(n)for(;i>r&&_t(t.text.charCodeAt(i-1));)i--;o.push(t.text.slice(r,i)),l-=e,c=0,s=this.#u(s)}return o.join(``)}charAt(e){let t=this.#l(e);if(t===void 0)return``;let[n,r]=t;return this.#g(n.piece.source).text.charAt(n.piece.offset+r)}includes(e){if(e.length===0)return!0;let t=vt(e),n=0,r=!1;return this.#h(i=>{for(let a=i.start;a<i.end;a++){let o=i.text.charCodeAt(a);for(;n>0&&o!==e.charCodeAt(n);)n=t[n-1];if(o===e.charCodeAt(n)&&n++,n===e.length)return r=!0,!1}return!0}),r}findNextNonOverlappingSubstring(e,t){if(e.length===0||e.length>this.#i)return;let n=yt(t,this.#i),r=n.reduce((e,[,t])=>Math.max(e,t),0),i=vt(e),a=0,o=0,s,c;return this.#h(t=>{for(let l=t.start;l<t.end;l++){let u=t.text.charCodeAt(l);for(;a>0&&u!==e.charCodeAt(a);)a=i[a-1];if(u===e.charCodeAt(a)&&a++,a===e.length){let t=o-e.length+1;if(!bt(n,t,t+e.length)){if(t>=r)return c=t,!1;s??=t}a=i[a-1]}o++}return!0}),c??s}search(e){if(e.text.length===0||this.#i===0||e.text.includes(`
`)||e.text.includes(`\r`)||e.regex&&(e.text.includes(`\\n`)||e.text.includes(`\\r`)))return[];let t;try{t=Dt(e.text,e.regex,e.caseSensitive)}catch{return[]}return this.#c(t,e.wholeWord,dt)}#c(e,t,n){let r=[],i=this.#i,a=e=>this.charAt(e);for(let o=0;o<this.#a;o++){let s=this.getLineText(o),c=this.offsetAt({line:o,character:0}),l=new RegExp(e.source,e.flags);l.lastIndex=0;let u;for(;(u=l.exec(s))!==null;){let e=u.index,o=u[0];if(o.length===0){l.lastIndex=At(s,e);continue}let d=c+e;if((!t||Tt(d,o.length,i,a))&&(r.push([d,d+o.length]),r.length>=n))return r;e===l.lastIndex&&(l.lastIndex=At(s,e))}}return r}insert(e,t){if(e.length===0)return;let n=H(t,0,this.#i),r=this.#t.append(e),i=this.#_(pt.Added,r,e.length),a=this.#v(),o=[],s=0,c=!1;for(let e of a){let t=s+e.length;if(!c&&n<=t){let t=n-s;t>0&&o.push(this.#_(e.source,e.offset,t)),o.push(i),t<e.length&&o.push(this.#_(e.source,e.offset+t,e.length-t)),c=!0}else o.push(e);s=t}c||o.push(i),this.#y(o),this.#o=null,this.#s=null}delete(e,t){if(t<=0||this.#i===0)return;let n=H(e,0,this.#i),r=H(n+t,n,this.#i);if(n===r)return;let i=[],a=0;for(let e of this.#v()){let t=a,o=a+e.length,s=H(n-t,0,e.length),c=H(o-r,0,e.length);s>0&&i.push(this.#_(e.source,e.offset,s)),c>0&&i.push(this.#_(e.source,e.offset+e.length-c,c)),a=o}this.#y(i),this.#o=null,this.#s=null}applyEdits(e){if(e.length===0)return;let t=0,n=0,r=0,i=this.#v(),a=e.map(e=>e.text.length===0?void 0:this.#_(pt.Added,this.#t.append(e.text),e.text.length)),o=[],s=()=>{let e=i[t];e!==void 0&&(n+=e.length,t++)},c=(e,r)=>{let a=H(e,0,this.#i),c=H(r,a,this.#i);for(;t<i.length&&n+i[t].length<=a;)s();for(;t<i.length&&a<c;){let e=i[t],r=n+e.length,l=H(a-n,0,e.length),u=Math.min(r,c),d=u-(n+l);d>0&&o.push(l===0&&d===e.length?e:this.#_(e.source,e.offset+l,d)),a=u,a>=r&&s()}};for(let t=0;t<e.length;t++){let n=e[t],i=H(n.start,r,this.#i),s=H(n.end,i,this.#i);c(r,i);let l=a[t];l!==void 0&&o.push(l),r=s}c(r,this.#i),this.#y(o),this.#o=null,this.#s=null}positionAt(e){let t=H(e,0,this.#i);if(this.#i===0)return{line:0,character:0};let n=this.#f(t);return{line:n,character:t-(n===0?0:this.#p(n-1))}}positionsAt(e){let t=Array.from({length:e.length});if(e.length===0)return t;if(this.#i===0)return t.fill({line:0,character:0});for(let n=0;n<e.length;n++)t[n]=this.positionAt(e[n]);return t}offsetAt(e){if(e.line<0||this.#i===0)return 0;if(e.line>=this.#a)throw Error(`Line index out of range: ${e.line}`);let t=this.#d(e.line);if(t===void 0)throw Error(`Line index out of range: ${e.line}`);let n=H(e.character,0,t[1]-t[0]);return t[0]+n}#l(e){if(e<0||e>=this.#i)return;let t=this.#n,n=e;for(;t!==null;){let e=t.left?.subtreeLength??0;if(n<e){t=t.left;continue}if(n-=e,n<t.piece.length)return[t,n];n-=t.piece.length,t=t.right}}#u(e){if(e.right!==null){let t=e.right;for(;t.left!==null;)t=t.left;return t}let t=e;for(;t.parent!==null&&t===t.parent.right;)t=t.parent;return t.parent}#d(e){if(e<0)throw Error(`Line index out of range: ${e}`);if(this.#i===0){if(e===0)return[0,0];throw Error(`Line index out of range: ${e}`)}if(e>=this.#a)throw Error(`Line index out of range: ${e}`);return[e===0?0:this.#p(e-1),e<this.#a-1?this.#p(e):this.#i]}#f(e){let t=this.#n,n=H(e,0,this.#i),r=0;for(;t!==null;){let e=t.left?.subtreeLength??0;if(n<e){t=t.left;continue}if(r+=t.left?.subtreeLineBreakCount??0,n-=e,n<=t.piece.length){let e=this.#g(t.piece.source);return r+=St(e.lineOffsets,t.piece.offset+n)-t.piece.lineOffsetStart,r}r+=t.piece.lineBreakCount,n-=t.piece.length,t=t.right}return this.#a-1}#p(e){let t=this.#n,n=e,r=0;for(;t!==null;){let e=t.left?.subtreeLineBreakCount??0;if(n<e){t=t.left;continue}let i=t.left?.subtreeLength??0;if(r+=i,n-=e,n<t.piece.lineBreakCount){let e=this.#g(t.piece.source).lineOffsets[t.piece.lineOffsetStart+n];return r+(e-t.piece.offset)}r+=t.piece.length,n-=t.piece.lineBreakCount,t=t.right}return this.#i}#m(){let e=[];return this.#h(t=>{e.push(t.text.slice(t.start,t.end))}),e.join(``)}#h(e){this.#x(this.#n,t=>{let n=this.#g(t.piece.source);return e({text:n.text,lineOffsets:n.lineOffsets,lineOffsetStart:t.piece.lineOffsetStart,lineOffsetEnd:t.piece.lineOffsetEnd,start:t.piece.offset,end:t.piece.offset+t.piece.length})})}#g(e){return e===pt.Original?this.#e:this.#t}#_(e,t,n){let r=this.#g(e);return new pt(e,t,n,St(r.lineOffsets,t),St(r.lineOffsets,t+n))}#v(){return this.#r}#y(e){let t=xt(e);this.#r=t;let n=0,r=0;for(let e of t)n+=e.length,r+=e.lineBreakCount;this.#n=this.#b(t,0,t.length,null),this.#i=n,this.#a=r+1}#b(e,t,n,r){if(t>=n)return null;let i=t+Math.floor((n-t)/2),a=new ht(e[i]);return a.parent=r,a.left=this.#b(e,t,i,a),a.right=this.#b(e,i+1,n,a),a.updateSubtreeLength(),a}#x(e,t){return e===null?!0:!this.#x(e.left,t)||t(e)===!1?!1:this.#x(e.right,t)}};function _t(e){return e===10||e===13}function H(e,t,n){return Math.min(Math.max(e,t),n)}function vt(e){let t=Array.from({length:e.length}).fill(0),n=0;for(let r=1;r<e.length;r++){let i=e.charCodeAt(r);for(;n>0&&i!==e.charCodeAt(n);)n=t[n-1];i===e.charCodeAt(n)&&n++,t[r]=n}return t}function yt(e,t){let n=[];for(let[r,i]of e){let e=H(r,0,t),a=H(i,e,t);e<a&&n.push([e,a])}n.sort((e,t)=>e[0]-t[0]);let r=[];for(let e of n){let t=r[r.length-1];if(t!==void 0&&e[0]<=t[1]){t[1]=Math.max(t[1],e[1]);continue}r.push(e)}return r}function bt(e,t,n){let r=0,i=e.length;for(;r<i;){let n=r+Math.floor((i-r)/2);e[n][1]<=t?r=n+1:i=n}let a=e[r];return a!==void 0&&a[0]<n}function xt(e){let t=[];for(let n of e){if(n.length===0)continue;let e=t[t.length-1];if(e!==void 0&&e.source===n.source&&e.offset+e.length===n.offset){t[t.length-1]=new pt(e.source,e.offset,e.length+n.length,e.lineOffsetStart,n.lineOffsetEnd);continue}t.push(n)}return t}function St(e,t){let n=0,r=e.length;for(;n<r;){let i=n+Math.floor((r-n)/2);e[i]<=t?n=i+1:r=i}return n}function Ct(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function wt(e){if(e<=32||e===127)return!0;let t=String.fromCharCode(e);return ft.includes(t)}function Tt(e,t,n,r){let i=e<=0||wt(Et(r,e-1)),a=e+t>=n||wt(Et(r,e+t));return i&&a}function Et(e,t){let n=e(t);return n.length===0?0:n.charCodeAt(0)}function Dt(e,t,n){let r=t?e:Ct(e);return new RegExp(r,`g${n?``:`i`}${t?`m`:``}`)}function Ot(e,t){return e.replace(/\$([$&]|\d+)/g,(e,n)=>n===`$`?`$`:n===`&`?t[0]??``:t[Number(n)]??``)}function kt(e,t,n,r,i,a){if(!r.regex)return r.replaceText;let o=e(i),s=n(o.line),c=i-t({line:o.line,character:0}),l=s.slice(c,c+(a-i)),u;try{u=Dt(r.text,!0,r.caseSensitive)}catch{return r.replaceText}let d=new RegExp(u.source,u.flags.replace(`g`,``)).exec(l);return d===null||d[0].length!==l.length?r.replaceText:Ot(r.replaceText,d)}function At(e,t){if(t+1<e.length){let n=e.charCodeAt(t),r=e.charCodeAt(t+1);if(n>=55296&&n<=56319&&r>=56320&&r<=57343)return t+2}return t+1}var jt=class{#e;#t;#n;#r;#i;constructor(e,t,n=`plaintext`,r=0,i=new at){this.#e=new URL(e,`file://`).toString(),this.#t=n,this.#n=r,this.#r=new gt(t),this.#i=i}get uri(){return this.#e}get languageId(){return this.#t}get version(){return this.#n}get lineCount(){return this.#r.lineCount}get canUndo(){return this.#i.canUndo}get canRedo(){return this.#i.canRedo}positionAt(e){return this.#r.positionAt(e)}positionsAt(e){return this.#r.positionsAt(e)}offsetAt(e){return this.#r.offsetAt(this.normalizePosition(e))}getText(e){return this.#r.getText(e)}getLineText(e,t){return this.#r.getLineText(e,t)}getLineLength(e,t){return this.#r.getLineLength(e,t)}charAt(e){return typeof e==`number`?this.#r.charAt(e):this.#r.charAt(this.offsetAt(e))}getTextSlice(e,t){return this.#r.getTextSlice(e,t)}findNextNonOverlappingSubstring(e,t){return this.#r.findNextNonOverlappingSubstring(e,t)}search(e){return this.#r.search(e)}applyEdits(e,t=!1,n,r){if(e.length!==0)return this.applyResolvedEdits(e.map(e=>this.#a(e)),t,n,r)}applyResolvedEdits(e,t=!1,n,r){if(e.length===0)return;let i=this.#o(e);if(t){let e=ot(this,i,this.#n,this.#n+1,n,r),t=this.#i.peekUndo(),a=this.#s(i);return this.#n++,a.lineDelta===0&&st(t,e)?this.#i.replaceLastUndo(ct(t,e)):this.#i.push(e),a}let a=this.#s(i);return this.#n++,a}setLastUndoSelectionsAfter(e){this.#i.setLastUndoSelectionsAfter(e)}setLastUndoLineAnnotations(e,t){this.#i.setLastUndoLineAnnotations(e,t)}undo(){let e=this.#i.popUndoToRedo();if(e===void 0)return;let t=this.#s(e.inverseEdits);if(t!==void 0)return this.#n=e.versionBefore,[t,e.selectionsBefore?.slice(),e.lineAnnotationsBefore?.slice()]}redo(){let e=this.#i.popRedoToUndo();if(e===void 0)return;let t=this.#s(e.forwardEdits);if(t!==void 0)return this.#n=e.versionAfter,[t,e.selectionsAfter?.slice(),e.lineAnnotationsAfter?.slice()]}normalizePosition(e){let t=Math.max(0,Math.min(e.line,this.lineCount-1));return{line:t,character:Math.max(0,Math.min(e.character,this.getLineLength(t)))}}#a(e){let t=this.offsetAt(e.range.start),n=this.offsetAt(e.range.end);if(t>n){let e=t;t=n,n=e}return{start:t,end:n,text:e.newText}}#o(e){let t=[...e].sort((e,t)=>e.start-t.start);for(let e=0;e<t.length-1;e++)if(t[e].end>t[e+1].start)throw Error(`Overlapping text edits are not supported`);return t}#s(e){let t=this.#r.lineCount,n=this.positionsAt(e.flatMap(e=>[e.start,e.end])),r=this.#c(e,n),i=n[0];this.#r.applyEdits(e);let a=this.#r.lineCount;return{startLine:r.startLine,startCharacter:i.character,endLine:Math.min(r.endLine,Math.max(0,a-1)),previousLineCount:t,lineCount:a,lineDelta:a-t,changedLineRanges:r.ranges}}#c(e,t){let n=1/0,r=0,i=0,a=[];for(let o=0;o<e.length;o++){let s=e[o],c=t[o*2].line,l=t[o*2+1].line,u=Mt(s.text),d=c+i,f=d+u;n=Math.min(n,c),r=Math.max(r,f);let p=a[a.length-1];p!==void 0&&d<=p[1]+1?a[a.length-1]=[p[0],Math.max(p[1],f)]:a.push([d,f]),i+=u-(l-c)}return n===1/0?{startLine:0,endLine:0,ranges:[[0,0]]}:{startLine:n,endLine:r,ranges:a}}};function Mt(e){let t=0;for(let n=0;n<e.length;n++)e.charCodeAt(n)===10&&t++;return t}var Nt=void 0,Pt=void 0,Ft=void 0;function It(){return Nt??=/macOS|MacIntel|iPhone|iPad|iPod/i.test(Vt())}function Lt(){return Pt??=/Linux/i.test(Vt())}function Rt(){return Ft??=`safari`in window&&`pushNotification`in window.safari||/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function zt({metaKey:e,ctrlKey:t},n=It()){return n?e&&!t:t&&!e}function Bt(e){if((It()||Lt())&&e.ctrlKey&&!e.altKey&&!e.metaKey)switch(e.key){case`a`:return`start`;case`e`:return`end`;case`p`:return`up`;case`n`:return`down`;case`f`:return`right`;case`b`:return`left`}if(!e.altKey&&!e.ctrlKey&&!e.metaKey){if(e.key===`ArrowUp`)return`up`;if(e.key===`ArrowDown`)return`down`;if(e.key===`ArrowLeft`)return`left`;if(e.key===`ArrowRight`)return`right`}if(zt(e)){if(e.key===`ArrowLeft`)return`textStart`;if(e.key===`ArrowRight`)return`end`}}function Vt(){let e=globalThis.navigator;return e?.platform??e?.userAgentData?.platform??`unknown`}var Ht={a:`selectAll`,d:`findNextMatch`};function Ut(e,t=It()){let n=zt(e,t),{shiftKey:r,altKey:i,key:a}=e,o=a.length===1?a.toLowerCase():a;if(n&&(o===`f`||e.code===`KeyF`))return i?`openSearchReplacePanel`:`openSearchPanel`;if(!i){if(!n&&o===`Tab`)return r?`outdent`:`indent`;if(n)return o===`z`?r?`redo`:`undo`:!t&&o===`y`?`redo`:o===`Home`||t&&o===`ArrowUp`?r?`expandSelectionDocStart`:`moveCursorToDocStart`:o===`End`||t&&o===`ArrowDown`?r?`expandSelectionDocEnd`:`moveCursorToDocEnd`:Ht[o]}}var Wt=`@layer base,theme,rendered,unsafe;::selection{background-color:#0000}@keyframes blinking{0%{opacity:1}50%{opacity:0}to{opacity:1}}:host,[data-code],[data-content]{position:relative}[data-content]{caret-color:var(--diffs-bg-caret);background-color:#0000;outline:none}[data-gutter-buffer],[data-line]:not([data-selected-line]),[data-line]:not([data-selected-line]) span,[data-line-annotation]{background-color:#0000}[data-column-number]{color:var(--diffs-editor-line-number-fg)}[data-column-number][data-selected-line]{background-color:var(--diffs-editor-line-number-active-bg);color:var(--diffs-editor-line-number-active-fg)}[data-column-number][data-active]{color:var(--diffs-editor-line-number-active-fg)}[data-line]{cursor:text}[data-line][data-selected-line]{background-color:var(--diffs-editor-line-highlight-bg)}[data-line][data-line-type=change-deletion]{background-color:var(--diffs-line-bg)}[data-editor-overlay]{display:contents}[data-caret],[data-selection-range],[data-match-range],[data-marker-range]{height:1lh;line-height:var(--diffs-line-height);pointer-events:none;position:absolute;top:0;left:0}[data-caret]{background-color:var(--diffs-bg-caret-override,var(--diffs-editor-cursor-fg,light-dark(color-mix(in lab, var(--diffs-fg) 50%, var(--diffs-bg)),color-mix(in lab, var(--diffs-fg) 75%, var(--diffs-bg)))));visibility:hidden;width:2px;animation:1.2s .8s infinite blinking}[data-selection-range]{z-index:-10;background-color:var(--diffs-editor-selection-bg)}[data-selection-corner]{background-color:var(--diffs-bg);width:100%;height:100%}[data-match-range]{z-index:-10;background-color:var(--diffs-editor-match-bg,var(--diffs-editor-selection-bg))}[data-match-range]:not([data-focus]){background-color:var(--diffs-editor-match-highlight-bg,light-dark(#ff963288,#ff963266))}[data-marker-range]{z-index:1;mask-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjMiPjxwYXRoIGQ9Im0wIDIuNSBsMiAtMS41IGwxIDAgbDIgMS41IGwxIDAiIHN0cm9rZT0iI2ZmZiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+);mask-position:0 100%;mask-size:6px 3px;mask-repeat:repeat-x}[data-marker-error]{background-color:var(--diffs-editor-error-fg,red)}[data-marker-warning]{background-color:var(--diffs-editor-warning-fg,#cca700)}[data-marker-info]{background-color:var(--diffs-editor-info-fg,#3794ff)}[data-marker-hint]{background-color:var(--diffs-editor-hint-fg,#6a6a6a)}[data-rtl]{border-top-left-radius:3px}[data-rtr]{border-top-right-radius:3px}[data-rbl]{border-bottom-left-radius:3px}[data-rbr]{border-bottom-right-radius:3px}@media (width>=480px){[data-content]{caret-color:#0000}[data-selection-action]{caret-color:currentColor}[data-content]:focus~[data-editor-overlay] [data-caret]{visibility:visible}}[data-editor-widget]{--diffs-widget-bg:color-mix(in lab, var(--diffs-fg) 4%, var(--diffs-bg));--diffs-widget-border:color-mix(in lab, var(--diffs-fg) 20%, transparent);--diffs-widget-shadow:inset 0 0 0 1px var(--diffs-bg), 0 4px 8px #00000013, 0 6px 18px #00000013;z-index:100;border:1px solid var(--diffs-widget-border);background-color:var(--diffs-widget-bg);width:fit-content;max-width:calc(100% - 24px);box-shadow:var(--diffs-widget-shadow);background-clip:padding-box;border-radius:9px;position:absolute;top:0;left:0}[data-marker-popup]{pointer-events:auto;min-width:180px;font-family:var(--diffs-header-font-fallback);padding:8px 12px;font-size:14px;line-height:1.4}[data-marker-popup] code{background-color:#0000;display:inline}[data-selection-action-icon]{z-index:10;width:1lh;height:1lh;color:color-mix(in lab, var(--diffs-fg) 40%, var(--diffs-bg));cursor:pointer;visibility:hidden;border-radius:4px;justify-content:center;align-items:center;transition:background-color .1s ease-in-out,color .1s ease-in-out;display:flex;position:absolute;top:0;left:-1lh}[data-selection-action-icon][data-visible=true]{visibility:visible}[data-selection-action-icon]:hover{background-color:color-mix(in lab, var(--diffs-fg) 8%, var(--diffs-bg));color:var(--diffs-fg)}[data-selection-action]{padding-inline-end:1ch}[data-search-panel]{z-index:100;flex-direction:column;justify-content:right;width:100%;height:fit-content;margin-bottom:4px;display:flex;position:sticky;top:12px;right:12px}[data-search-panel] [data-editor-widget]{z-index:100;max-width:100%;font-family:var(--diffs-header-font-fallback);align-items:flex-start;gap:8px;margin-inline:auto 12px;padding:4px;font-size:14px;display:flex;position:relative}[data-search-grid]{grid-template-columns:auto auto auto;align-items:center;gap:4px 6px;display:grid}[data-search-grid][data-mode=find] [data-replace-cell]{display:none}[data-input-box]{align-items:center;width:200px;display:flex;position:relative}[data-input-box] input{width:100%;min-width:0;color:var(--diffs-fg);background-color:var(--diffs-bg);border:1px solid color-mix(in lab, var(--diffs-fg) 12%, var(--diffs-bg));border-radius:6px;outline:none;flex-grow:1;padding-inline:6px;font-size:13px;line-height:24px}[data-input-box][data-find] input{padding-inline-end:72px}[data-input-box] input::selection{background-color:color-mix(in lab, var(--diffs-fg) 8%, var(--diffs-bg))}[data-search-toggles]{align-items:center;gap:1px;display:flex;position:absolute;top:50%;right:4px;transform:translateY(-50%)}[data-matches]{white-space:nowrap;min-width:50px;color:color-mix(in lab, var(--diffs-fg) 50%, var(--diffs-bg));flex-shrink:0;font-size:12px;font-weight:500;line-height:20px}[data-matches][data-no-matches]{color:color-mix(in lab, var(--diffs-fg) 35%, var(--diffs-bg))}[data-replace-actions],[data-search-nav]{align-items:center;display:flex}[data-search-panel] svg{fill:currentColor;display:block}[data-search-panel] [data-icon]{width:24px;height:24px;color:color-mix(in lab, var(--diffs-fg) 65%, var(--diffs-bg));cursor:pointer;border-radius:4px;flex-shrink:0;justify-content:center;align-items:center;transition:background-color .1s ease-in-out,color .1s ease-in-out;display:flex}[data-search-panel] [data-icon][data-disabled=true]{opacity:.25;pointer-events:none}[data-search-panel] [data-icon]:hover{color:var(--diffs-fg)}[data-search-panel] [data-icon][data-active=true]{color:light-dark(var(--diffs-modified-light),var(--diffs-modified-dark))}`;function U(e,t,n){let{style:r,dataset:i,children:a,...o}=t??{},s=document.createElement(e);return Object.assign(s,o),r!==void 0&&(typeof r==`string`?s.style.cssText=r:Object.assign(s.style,r)),i!==void 0&&(typeof i==`string`?s.dataset[i]=``:Array.isArray(i)?i.forEach(e=>{s.dataset[e]=``}):Object.assign(s.dataset,i)),a!==void 0&&s.replaceChildren(...a),n!==void 0&&n.appendChild(s),s}function W(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n)}function Gt(e,t=`line`){let n=e.dataset[t];if(n===void 0)return;let r=parseInt(n,10);if(!Number.isNaN(r))return r}function Kt(e,t){if(e.nodeType===3){let n=e.textContent?.length??0;return Math.max(0,Math.min(t,n))}return e.nodeType===1?Math.max(0,Math.min(t,e.childNodes.length)):0}function qt(e,t){return Object.assign(e,t)}function Jt(e,t){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>e.apply(this,r),t)}}function Yt(e,t=1e3){return Math.round(e*t)/t}function Xt(e,t){if(e.lineDelta===0)return;let n=e.startCharacter,r=Math.max(0,-e.lineDelta),i=r===0?void 0:e.startLine+(n===0?0:1),a=i===void 0?void 0:i+r,o=r>0?e.startLine+r:e.startLine+(n===0?0:1),s=[],c=!1;for(let n of t){if(n.side===`deletions`){s.push(n);continue}let t=n.lineNumber-1;if(i!==void 0&&a!==void 0&&t>=i&&t<a){c=!0;continue}if(t>=o){s.push({...n,lineNumber:t+e.lineDelta+1}),c=!0;continue}s.push(n)}return c?s:void 0}function Zt(e,t,n){let r=new Map,i=new Map;for(let t of e){let e=t.lineNumber;r.has(e)||r.set(e,[]),i.has(e)||i.set(e,[]),(t.side===`deletions`?i:r).get(e).push(Te(t))}let a=t.parentElement?.previousElementSibling,o,s;if(a!=null&&a instanceof HTMLElement&&a.dataset.deletions!==void 0)for(let e of a.children){let t=e,{gutter:n,content:r}=t.dataset;n===void 0?r!==void 0&&(s=t):o=t}Qt(t,n),s!==void 0&&Qt(s,o);let c=$t(r,t,n);if(s===void 0)return;let l=$t(i,s,o);requestAnimationFrame(()=>{en(r,i,c,l)})}function Qt(e,t){let n=[];for(let r=1;r<e.childElementCount;r++){let i=e.children[r];i.dataset.lineAnnotation!==void 0&&(n.push(i),t!==void 0&&n.push(t.children[r]))}for(let e of n)e.remove()}function $t(e,t,n){let r=new Map;for(let n of t.children){let t=Gt(n);if(t!==void 0){let i=e.get(t);if(i!==void 0){let e=U(`div`,{dataset:{lineAnnotation:`0,`+(t-1)},children:[U(`div`,{dataset:`annotationContent`,children:i.map(e=>U(`slot`,{name:e}))})]});n.after(e),r.set(t,e)}}}if(n!==void 0)for(let t of n.children){let n=Gt(t,`columnNumber`);if(n!==void 0&&e.has(n)){let e=U(`div`,{dataset:{gutterBuffer:`annotation`,bufferSize:`1`},style:{gridRow:`span 1`}});t.after(e)}}return r}function en(e,t,n,r){let i=new Map;for(let[t,n]of e.entries()){let e=r.get(t);if(n.length===0&&e!==void 0){let n=tn(e);n>0&&i.set(t,n)}}for(let[e,r]of t.entries()){let t=n.get(e);if(r.length===0&&t!==void 0){let n=tn(t);n>0&&i.set(e,n)}}nn(e,n,i),nn(t,r,i)}function tn(e){let t=e.firstElementChild;return t instanceof HTMLElement?t.getBoundingClientRect().height:0}function nn(e,t,n){for(let[r,i]of t.entries()){let t=e.get(r),a=n.get(r);t?.length===0&&a!==void 0&&i.style.setProperty(`--diffs-annotation-min-height`,`${a}px`)}}function rn(e,t=0){let n=Rn(e.startContainer,e.startOffset),r=Rn(e.endContainer,e.endOffset);if(!(n===null||r===null))return{start:n,end:r,direction:t}}function an(e,t,n,r){if(e===void 0)return[[],t];let{start:i,end:a}=t,o=[],s={...t},c=a.line;i.line<a.line&&a.character===0&&c--;for(let t=i.line;t<=c;t++){let c=e.getLineText(t);if(c===void 0)continue;let l=c.startsWith(`	`)?`	`:` `.repeat(n),u=0,d=l;if(r){if(c.startsWith(`	`))u=1;else if(c.startsWith(` `)){let e=c.length-c.trimStart().length;u=Math.min(l.length,e)}if(u===0)continue;d=``}o.push({range:{start:{line:t,character:0},end:{line:t,character:u}},newText:d});let f=d.length-u;t===i.line&&(s={...s,start:{...i,character:Math.max(0,i.character+f)}}),t===a.line&&(s={...s,end:{...a,character:Math.max(0,a.character+f)}})}return[o,s]}function on(e,t,n){let r=e.lineCount;return t.map(t=>{let{line:i,character:a}=n===`up`||n===`left`?t.start:t.end;if(n===`textStart`||n===`start`||n===`end`){if(n===`textStart`){let t=Fn(e.getLineText(i));a=a===t?0:t}else a=n===`start`?0:e.getLineLength(i);i=t.direction===-1?t.start.line:t.end.line}else if(n===`up`)i=Math.max(0,i-1);else if(n===`down`)i=Math.min(Math.max(r-1,0),i+1);else if(mn(t)){let t=e.getLineLength(i);a=Math.min(a,t),n===`left`?(a--,a<0&&(i===0?a=0:(i=Math.max(0,i-1),a=e.getLineLength(i)))):(a++,a>t&&(i===r-1?a--:(i=Math.min(Math.max(r-1,0),i+1),a=0)))}let o={line:i,character:a};return{start:o,end:o,direction:0}})}function sn(e,t,n){return t.map(t=>{let[r,i]=Mn(e,t),a=e.positionAt(i),[o]=on(e,[{start:a,end:a,direction:0}],n);return vn(e,r,e.offsetAt(o.start))})}function cn(e,t,n,r,i=2){if(t[t.length-1]===void 0)return{nextSelections:[]};let a=[];for(let e of t)a.push(e.start,e.end);let o=a.map(t=>e.offsetAt(t)),s=o[(t.length-1)*2],c=o[(t.length-1)*2+1],l=[],u=!0;for(let e=0;e<t.length;e++){let t={index:e,start:o[e*2],end:o[e*2+1]},n=l[l.length-1];n!==void 0&&(t.start<n.start||t.start===n.start&&t.end<n.end)&&(u=!1),l.push(t)}u||l.sort((e,t)=>{let n=e.start-t.start;if(n!==0)return n;let r=e.end-t.end;return r===0?e.index-t.index:r});let d=Ln(e,n,i),f=[],p=Array.from({length:t.length}),m=0,h,g=()=>{if(h===void 0)return;let t=Ln(e,{start:h.start,end:h.end,text:d.text},i),n=Pn(e,t.text,t.start);f.push({start:t.start,end:t.end,text:n});let r=[h.start+m+n.length,h.start+m+n.length];for(let e of h.indices)p[e]=r;m+=n.length-(t.end-t.start),h=void 0};for(let e of l){let t=Math.max(0,e.start+(d.start-s)),n=Math.max(t,e.end+(d.end-c));if(h!==void 0&&t<h.end){h.end=Math.max(h.end,n),h.indices.push(e.index);continue}g(),h={start:t,end:n,indices:[e.index]}}g();let _=e.applyResolvedEdits(f,!0,t),v=In(e,p.map(e=>{if(e===void 0)throw Error(`Missing next selection offsets`);return e}));if(e.setLastUndoSelectionsAfter(v),_!==void 0&&r!==void 0){let t=Xt(_,r);t!==void 0&&e.setLastUndoLineAnnotations(r,t)}return{nextSelections:v,change:_}}function ln(e,t,n,r){if(t.length!==n.length)throw Error(`Selection text replacements must match the selection count`);let i=[];for(let e of t)i.push(e.start,e.end);let a=i.map(t=>e.offsetAt(t)),o=[],s=!0;for(let e=0;e<t.length;e++){let t={index:e,start:a[e*2],end:a[e*2+1],text:n[e]},r=o[o.length-1];r!==void 0&&(t.start<r.start||t.start===r.start&&t.end<r.end)&&(s=!1),o.push(t)}s||o.sort((e,t)=>{let n=e.start-t.start;if(n!==0)return n;let r=e.end-t.end;return r===0?e.index-t.index:r});let c=n.every(e=>e===``),l,u=Array.from({length:t.length});if(c){l=[];let e=!1;for(let t of o){if(u[t.index]=t.end,t.start>=t.end)continue;e=!0;let n=l[l.length-1];n!==void 0&&t.start<n.end?l[l.length-1]={start:n.start,end:Math.max(n.end,t.end),text:``}:l.push({start:t.start,end:t.end,text:``})}if(!e)return{nextSelections:t};for(let e of o){let t=e.end,n=0,r=t;for(let e of l){if(t<=e.start)break;if(t>=e.end){n-=e.end-e.start;continue}r=e.start+n;break}r===t&&(r+=n),u[e.index]=r}}else{l=[];let t=0,n=-1;for(let r of o){if(r.start<n)throw Error(`Overlapping multi-selection edits are not supported`);n=r.end;let i=Pn(e,r.text,r.start);l.push({start:r.start,end:r.end,text:i}),u[r.index]=r.start+t+i.length,t+=i.length-(r.end-r.start)}}let d=e.applyResolvedEdits(l,!0,t),f=In(e,u.map(e=>[e,e]));if(e.setLastUndoSelectionsAfter(f),d!==void 0&&r!==void 0){let t=Xt(d,r);t!==void 0&&e.setLastUndoLineAnnotations(r,t)}return{nextSelections:f,change:d}}function un(e,t,n){let r=e.getText(),i=[],a=[];for(let n of t){let[t,o]=Mn(e,n);if(!mn(n)){a.push([t,o]);continue}let{line:s,character:c}=n.start,l=t,u=e.getLineLength(s),d;if(c>0&&c<u)d={start:l-1,end:l+1,text:r[l]+r[l-1]},a.push([l+1,l+1]);else if(c===u&&u>=2)d={start:l-2,end:l,text:r[l-1]+r[l-2]},a.push([l,l]);else if(c===0&&s>0&&u>0){let t=s-1,n=e.getLineLength(t),i=e.offsetAt({line:t,character:n}),o=n>0?i-1:i;d={start:o,end:l+1,text:r[l]+r.slice(i,l)+r.slice(o,i)},a.push([l+1,l+1])}else{a.push([t,o]);continue}i.push(d)}if(i.length===0)return{nextSelections:t};i.sort((e,t)=>e.start-t.start);for(let e=1;e<i.length;e++)if(i[e].start<i[e-1].end)throw Error(`Overlapping multi-selection edits are not supported`);let o=e.applyResolvedEdits(i,!0,t),s=In(e,a);if(e.setLastUndoSelectionsAfter(s),o!==void 0&&n!==void 0){let t=Xt(o,n);t!==void 0&&e.setLastUndoLineAnnotations(n,t)}return{nextSelections:s,change:o}}function dn(e,t,n){let r=t.map(t=>{let n=Nn(e,t);return{start:n.start,end:n.end,direction:0}});return ln(e,r,r.map(()=>``),n)}function fn(e,t,n,r){let i=t.map(t=>{if(!mn(t))return{start:t.start,end:t.end,direction:0};let r=hn(t),{line:i,character:a}=r,o=n?.(i,a)??0;if(a>o)return{start:{line:i,character:o},end:{line:i,character:a},direction:0};if(i===0)return{start:r,end:r,direction:0};let s=e.getLineLength(i-1);return{start:{line:i-1,character:s},end:{line:i,character:0},direction:0}});return ln(e,i,i.map(()=>``),r)}function pn(e,t,n){let r=t.map(t=>{let[n,r]=An(e,t);return{start:n,end:r,direction:0}});return ln(e,r,r.map(()=>``),n)}function mn(e){return e.start.line===e.end.line&&e.start.character===e.end.character}function hn(e){let{start:t,end:n,direction:r}=e;return r===-1?t:n}function gn(e){return e===`context`||e===`context-expanded`||e===`change-addition`}function _n(e,t){let n=mn(e),r=mn(t);return n&&r?G(e.start,t.start)===0:n?G(t.start,e.start)<=0&&G(e.start,t.end)<=0:r?G(e.start,t.start)<=0&&G(t.start,e.end)<=0:G(e.start,t.end)<0&&G(t.start,e.end)<0}function G(e,t){return e.line===t.line?e.character-t.character:e.line-t.line}function vn(e,t,n){let r=t===n?0:t<n?1:-1,i=Math.min(t,n),a=Math.max(t,n);return{start:e.positionAt(i),end:e.positionAt(a),direction:r}}function yn(e,t){let n=e.direction===-1?e.end:e.start,r=G(n,t.start),i=G(n,t.end),a=t.end;a=r<=0?t.end:i>=0?t.start:r===0?t.end:t.start;let o=G(n,a);return{start:o<=0?n:a,end:o<=0?a:n,direction:o===0?0:o<0?1:-1}}function bn(e,t){let n=G(t.start,e.start)<0,r=G(t.end,e.end)>0;return n&&!r?{start:t.start,end:e.end,direction:-1}:r&&!n?{start:e.start,end:t.end,direction:1}:e.direction===-1?{start:t.start,end:e.end,direction:G(t.start,e.end)===0?0:-1}:{start:e.start,end:t.end,direction:G(e.start,t.end)===0?0:1}}function xn(e,t){return Sn(e.map(e=>bn(e,t)))}function Sn(e){if(e.length<=1)return e;let t=new Set,n=[];for(let r=e.length-1;r>=0;r--){let i=e[r];if(i===void 0)continue;let a=0,o=n.length;for(;a<o;){let e=Math.floor((a+o)/2),t=n[e]?.selection;if(t===void 0)break;G(t.start,i.start)<0?a=e+1:o=e}let s=n[a-1]?.selection,c=n[a]?.selection;s!==void 0&&_n(s,i)||c!==void 0&&_n(c,i)||(n.splice(a,0,{index:r,selection:i}),t.add(r))}return e.filter((e,n)=>t.has(n))}function Cn(e,t){if(t.length===0)return;let n=t.map(t=>mn(t)?On(e,t):t),r=n.map(t=>e.getText(t)),i=r[0];if(i.length===0||r.some(e=>e!==i))return;let a=n.map(t=>[e.offsetAt(t.start),e.offsetAt(t.end)]),o=e.findNextNonOverlappingSubstring(i,a);if(o===void 0)return n.some((e,n)=>{let r=t[n];return G(e.start,r.start)!==0||G(e.end,r.end)!==0||e.direction!==r.direction})?n:void 0;let s=vn(e,o,o+i.length);return[...n,s]}function wn(e){let t=e.lineCount-1;return{start:{line:0,character:0},end:{line:t,character:e.getLineLength(t)},direction:1}}function Tn(e,t){let n=t?e.lineCount-1:0,r={line:n,character:t?e.getLineLength(n):0};return{start:r,end:r,direction:1}}function En(e,t){return[...t].sort((e,t)=>{let n=G(e.start,t.start);return n===0?G(e.end,t.end):n}).map(t=>mn(t)?e.getLineText(t.start.line,!1):e.getText(t)).join(`
`)}function Dn(e,t){let n=Math.max(0,t),r=zn(e),i=null;for(let e of r){i=e;let t=qn(e);if(n<=t+(e.textContent?.length??0)){let r=Bn(e,n<t?0:n-t);if(r!==null)return r}}if(i!==null){let e=Bn(i,i.textContent?.length??0);return e===null?[i,0]:e}let a=0,o=null;for(let t of e.childNodes){if(t.nodeType===1&&t.tagName===`BR`)return[t,0];if(t.nodeType!==3)continue;o=t;let e=Jn(o.textContent,o.textContent?.length??0);if(n<=a+e)return[o,Jn(o.textContent,n-a)];a+=e}return o===null?[e,0]:[o,Jn(o.textContent,o.textContent?.length??0)]}function On(e,t){let{line:n,character:r}=t.start,i=e.getLineText(n),a=kn(i,Math.max(0,Math.min(r,i.length)));return a===void 0?t:{start:{line:n,character:a.start},end:{line:n,character:a.end},direction:1}}function kn(e,t){let n=new Intl.Segmenter(void 0,{granularity:`word`});for(let r of n.segment(e)){if(r.isWordLike!==!0)continue;let e=r.index,n=e+r.segment.length;if(t>=e&&t<=n)return{start:e,end:n}}}function An(e,t){if(!mn(t))return[t.start,t.end];let n=hn(t),{line:r,character:i}=n;if(i===0){if(r===0)return[n,n];let t=e.getLineLength(r-1);return[{line:r-1,character:t},{line:r,character:0}]}let a=e.getLineText(r),o=[0],s=new Intl.Segmenter(void 0,{granularity:`grapheme`});for(let e of s.segment(a))e.index>0&&o.push(e.index);let c=i,l;for(;c>0;){let e=jn(a,c,!1,o),t=a.slice(e,c),n=/\S/.test(t)?/\p{Alphabetic}|\p{Number}|_/u.test(t)?1:2:0;if(l!==void 0&&n!==l)break;(t!==` `||c!==i)&&(l=n),c=e}return[{line:r,character:c},{line:r,character:i}]}function jn(e,t,n,r){if(n){for(let e of r)if(e>t)return e;return e.length}for(let e=r.length-1;e>=0;e--){let n=r[e];if(n<t)return n}return 0}function Mn(e,t){let n=t.direction===-1;return[e.offsetAt(n?t.end:t.start),e.offsetAt(hn(t))]}function Nn(e,t){if(!mn(t))return{start:t.start,end:t.end};let{line:n,character:r}=t.start,i=e.getLineText(n).length;return r<i?{start:{line:n,character:r},end:{line:n,character:i}}:n<e.lineCount-1?{start:{line:n,character:r},end:{line:n+1,character:0}}:{start:{line:n,character:r},end:{line:n,character:r}}}function Pn(e,t,n){if(t!==`
`&&t!==`\r
`)return t;let r=e.positionAt(n).line,i=e.getLineText(r),a=Fn(i);return a===0?t:t+i.slice(0,a)}function Fn(e){let t=0;for(;t<e.length;t++){let n=e.charCodeAt(t);if(n!==32&&n!==9)break}return t}function In(e,t){let n=[];for(let[e,r]of t)n.push(Math.min(e,r),Math.max(e,r));let r=e.positionsAt(n);return t.map(([e,t],n)=>{let i=e===t?0:e<t?1:-1;return{start:r[n*2],end:r[n*2+1],direction:i}})}function Ln(e,t,n){if(t.text!==``||t.start!==t.end-1)return t;let r=e.positionAt(t.end);if(r.character===0)return t;let i=e.getLineText(r.line),a=i.slice(0,r.character);if(/[^ \t]/.test(a)||i[r.character-1]===`	`)return t;let o=Math.max(0,r.character-n),s=i.slice(o,r.character);return s.length===n&&/^ +$/.test(s)?{...t,start:t.end-s.length}:t}function Rn(e,t){let n=e.nodeType===1?e:e.parentElement;for(;n!==null&&Kn(n)===void 0;)n=n.parentElement;if(n===null)return null;let r=Kn(n);if(r===void 0)return null;if(e.nodeType===3)return e.parentElement===null?null:Wn(e.parentElement)===null?{line:r,character:Un(n,e)+Jn(e.textContent,t)}:{line:r,character:Gn(e,t)};if(e.nodeType===1){let i=e;if(i.tagName===`DIV`){let e=0;for(let n=0;n<t;n++)e=Gn(i.childNodes[n]);return{line:r,character:e}}if(i.tagName===`BR`)return{line:r,character:0};if(i.tagName===`SPAN`){if(t<i.childNodes.length){let e=i.childNodes[t];if(e?.nodeType===1){let t=qn(e);if(t!==void 0)return{line:r,character:t};let n=Wn(e),i=n===null?void 0:qn(n);if(i!==void 0)return{line:r,character:i}}}return{line:r,character:t>0?Gn(i.childNodes[t-1]):Un(n,i)}}return{line:r,character:Un(n,i)}}return null}function zn(e){let t=[];for(let n of e.childNodes){if(n.nodeType!==1)continue;let e=n;if(e.tagName===`SPAN`){if(qn(e)!==void 0){t.push(e);continue}for(let n of e.childNodes)n.nodeType===1&&qn(n)!==void 0&&t.push(n)}}return t}function Bn(e,t){let n=Math.max(0,t),r=[{container:e,index:0}];for(;r.length>0;){let e=r[r.length-1];if(e.index>=e.container.childNodes.length){r.pop();continue}let t=e.container.childNodes[e.index];if(e.index++,t.nodeType===3){let e=Jn(t.textContent,t.textContent?.length??0);if(n<=e)return[t,n];n-=e}else t.nodeType===1&&r.push({container:t,index:0})}return null}function Vn(e,t){let n=0,r=[{container:e,index:0}];for(;r.length>0;){let e=r[r.length-1];if(e.index>=e.container.childNodes.length){r.pop();continue}let i=e.container.childNodes[e.index];if(i===t)return n;e.index++,i.nodeType===3?n+=Jn(i.textContent,i.textContent?.length??0):i.nodeType===1&&r.push({container:i,index:0})}return n}function Hn(e,t){let n=t;for(;n!==null;){if(n===e)return!0;n=n.parentElement}return!1}function Un(e,t){if(t.parentElement===e){let n=0,r=Array.prototype.indexOf.call(e.childNodes,t);for(let t=0;t<r;t++)n=Gn(e.childNodes[t]);return n}for(let n of zn(e))if(Hn(n,t))return qn(n)+(t.nodeType===3?Vn(n,t):0);let n=0,r=t.nodeType===1?t:t.parentElement;for(;r!==null&&r.parentElement!==null&&Kn(r.parentElement)===void 0;){let e=r.parentElement,t=Array.prototype.indexOf.call(e.childNodes,r);for(let r=0;r<t;r++)n=Gn(e.childNodes[r]);r=e}return n}function Wn(e){let t=e;for(;t!==null;){if(Kn(t)!==void 0)return null;if(qn(t)!==void 0)return t;t=t.parentElement}return null}function Gn(e,t){if(e===void 0)return 0;if(e.nodeType===3){let n=e.parentElement;if(n===null)return 0;let r=Wn(n);if(r===null)return 0;let i=qn(r);if(i===void 0)return 0;let a=t===void 0?Jn(e.textContent,e.textContent?.length??0):Jn(e.textContent,t);return i+Vn(r,e)+a}if(e.nodeType!==1)return 0;let n=e;if(n.tagName!==`SPAN`&&n.tagName!==`BR`)return 0;let r=qn(n);if(r!==void 0)return r+(n.textContent?.length??0);let i=0;for(let e of n.childNodes)i=Math.max(i,Gn(e));return i}function Kn(e){let{line:t}=e.dataset;if(t!==void 0){let e=parseInt(t,10);if(!Number.isNaN(e))return e-1}}function qn(e){let{char:t}=e.dataset;if(t!==void 0){let e=parseInt(t,10);if(!Number.isNaN(e))return e}}function Jn(e,t){let n=e??``,r=n.search(/[\r\n]/);return Math.min(t,r===-1?n.length:r)}var Yn=300,Xn=100,Zn=class{#e;#t=[];#n;#r;#i;#a;#o;#s;#c;#l=!1;constructor(e){this.#e=e}get markers(){return this.#t}isPopupVisible(){return this.#c!==void 0}setMarkers(e,t){this.#t=e.map(e=>({...e,start:t.normalizePosition(e.start),end:t.normalizePosition(e.end)})),this.removePopup()}listenHover(e){this.#i?.forEach(e=>e()),this.#i=void 0,this.#t.length!==0&&(this.#i=[W(e,`mouseover`,e=>{if(this.#e.isMouseDown())return;let t=e.composedPath()[0];if(t===void 0)return;let n=this.#u(t);n===void 0?(this.#d(),this.#m()):this.#p(n)}),W(e,`mouseleave`,()=>{this.#d(),this.#m()})])}removePopup(){this.#d(),this.#f(),this.#h()}cleanup(){this.#i?.forEach(e=>e()),this.#i=void 0,this.removePopup(),this.#t=[]}#u(e){let t=e.closest(`[data-line]`);if(t==null)return;let n=Gt(t);if(n===void 0)return;let r;if(e.tagName===`SPAN`){let t=e.dataset.char;if(t===void 0||(r=parseInt(t,10),Number.isNaN(r)))return}else if(e.tagName===`BR`)r=0;else return;let i={line:n-1,character:r};for(let e=this.#t.length-1;e>=0;e--)if(_n({start:i,end:i},this.#t[e]))return e}#d(){this.#a!==void 0&&(clearTimeout(this.#a),this.#a=void 0),this.#s=void 0}#f(){this.#o!==void 0&&(clearTimeout(this.#o),this.#o=void 0)}#p(e){if(e===this.#c||e===this.#s){this.#f();return}if(this.#d(),this.#f(),this.#n!==void 0){this.#g(e);return}this.#s=e,this.#a=setTimeout(()=>{this.#a=void 0,this.#s=void 0,this.#g(e)},Yn)}#m(){this.#l||(this.#f(),this.#o=setTimeout(()=>{this.#o=void 0,this.#l||this.removePopup()},Xn))}#h(){this.#r?.forEach(e=>e()),this.#r=void 0,this.#n?.remove(),this.#n=void 0,this.#c=void 0,this.#l=!1}#g(e){if(e===this.#c)return;let t=this.#e.getFileContainer()?.shadowRoot?.querySelector(`pre`),n=t?.querySelector(`[data-code]`);if(e>=this.#t.length||t==null||n==null)return;let{start:r,message:i}=this.#t[e],{line:a,character:o}=r,{getCharX:s,getLineY:c,getLineHeight:l}=this.#e,[u,d]=s(a,o),f=l(),p=c(a)+d*f+f,m=`translateX(${n.offsetLeft+u}px) translateY(${n.offsetTop+p}px)`,h=this.#n;if(h!==void 0){h.style.transform=m;let t=h.firstElementChild;t?.dataset.markerMessage!==void 0&&(typeof i==`string`?t.textContent=i:i instanceof HTMLElement?t.replaceChildren(i):t.innerHTML=i.html),this.#c=e;return}this.#n=U(`div`,{dataset:[`editorWidget`,`markerPopup`],style:{transform:m},children:[U(`div`,{dataset:`markerMessage`,...typeof i==`string`?{textContent:i}:i instanceof HTMLElement?{children:[i]}:{innerHTML:i.html}})]},t),this.#c=e,this.#r=[W(this.#n,`mouseenter`,()=>{this.#l=!0,this.#f()}),W(this.#n,`mouseleave`,()=>{this.#l=!1,this.#m()})]}};function Qn(e){switch(e){case`error`:return`markerError`;case`warning`:return`markerWarning`;case`info`:return`markerInfo`;case`hint`:return`markerHint`}}var $n=`<svg data-icon-sprite aria-hidden="true" width="0" height="0">
  <symbol id="diffs-editor-icon-close" viewBox="0 0 16 16">
    <path fill="currentColor" d="M3.21967 3.21967C3.51256 2.92678 3.98744 2.92678 4.28033 3.21967L8 6.93934L11.7197 3.21967C12.0126 2.92678 12.4874 2.92678 12.7803 3.21967C13.0732 3.51256 13.0732 3.98744 12.7803 4.28033L9.06066 8L12.7803 11.7197C13.0732 12.0126 13.0732 12.4874 12.7803 12.7803C12.4874 13.0732 12.0126 13.0732 11.7197 12.7803L8 9.06066L4.28033 12.7803C3.98744 13.0732 3.51256 13.0732 3.21967 12.7803C2.92678 12.4874 2.92678 12.0126 3.21967 11.7197L6.93934 8L3.21967 4.28033C2.92678 3.98744 2.92678 3.51256 3.21967 3.21967Z"></path>
  </symbol>
  <symbol id="diffs-editor-icon-arrow-up" viewBox="0 0 16 16">
    <path fill="currentColor" transform="rotate(-90 8 8)" d="M8.46967 4.21967C8.17678 4.51256 8.17678 4.98744 8.46967 5.28033L10.4393 7.25H3.75C3.33579 7.25 3 7.58579 3 8C3 8.41421 3.33579 8.75 3.75 8.75H10.4393L8.46967 10.7197C8.17678 11.0126 8.17678 11.4874 8.46967 11.7803C8.76256 12.0732 9.23744 12.0732 9.53033 11.7803L12.7803 8.53033C13.0732 8.23744 13.0732 7.76256 12.7803 7.46967L9.53033 4.21967C9.23744 3.92678 8.76256 3.92678 8.46967 4.21967Z"></path>
  </symbol>
  <symbol id="diffs-editor-icon-arrow-down" viewBox="0 0 16 16">
    <path fill="currentColor" transform="rotate(90 8 8)" d="M8.46967 4.21967C8.17678 4.51256 8.17678 4.98744 8.46967 5.28033L10.4393 7.25H3.75C3.33579 7.25 3 7.58579 3 8C3 8.41421 3.33579 8.75 3.75 8.75H10.4393L8.46967 10.7197C8.17678 11.0126 8.17678 11.4874 8.46967 11.7803C8.76256 12.0732 9.23744 12.0732 9.53033 11.7803L12.7803 8.53033C13.0732 8.23744 13.0732 7.76256 12.7803 7.46967L9.53033 4.21967C9.23744 3.92678 8.76256 3.92678 8.46967 4.21967Z"></path>
  </symbol>
  <symbol id="diffs-editor-icon-case" viewBox="0 0 16 16">
    <path fill="currentColor" d="M12.2969 12.9969C10.7109 12.9969 9.61719 12.0125 9.61719 10.5047C9.61719 9.06719 10.6172 8.16094 12.5 8.15312H14.6641V7.31719C14.6641 6.23906 14.0391 5.64531 12.9297 5.64531C11.875 5.64531 11.2734 6.18437 11.1953 7.00469H9.92969C10.0156 5.56719 10.9922 4.52031 12.9766 4.52031C14.7266 4.52031 16 5.47344 16 7.2V12.8641H14.7109V11.8406H14.6719C14.2578 12.5047 13.5078 12.9969 12.2969 12.9969ZM12.6562 11.8797C13.8047 11.8797 14.6641 11.1609 14.6641 10.1375V9.18437H12.6016C11.4766 9.18437 10.9922 9.71562 10.9922 10.4578C10.9922 11.4266 11.7969 11.8797 12.6562 11.8797Z"></path>
    <path fill="currentColor" d="M1.42188 12.8641H0L3.79688 2H5.1875L8.98438 12.8641H7.54688L6.46875 9.66094H2.5L1.42188 12.8641ZM4.50781 3.60938H4.46875L2.86719 8.55937H6.10156L4.50781 3.60938Z"></path>
  </symbol>
  <symbol id="diffs-editor-icon-whole-word" viewBox="0 0 16 16">
    <path fill="currentColor" d="M11.4089 9.99449C11.1417 9.99449 10.8961 9.95595 10.6722 9.87887C10.4519 9.80179 10.2605 9.69167 10.098 9.54852C9.93551 9.40537 9.81453 9.23469 9.73508 9.03648H9.67007V9.91191H8.5V2H9.70258V5.01721H9.76758C9.81092 4.86671 9.88314 4.7309 9.98426 4.60977C10.089 4.48497 10.2136 4.37853 10.358 4.29043C10.5025 4.19867 10.6668 4.13076 10.851 4.08672C11.0352 4.039 11.2302 4.01514 11.436 4.01514C11.8802 4.01514 12.2648 4.11792 12.5898 4.32347C12.9149 4.52535 13.164 4.81532 13.3374 5.19339C13.5107 5.57146 13.5974 6.02478 13.5974 6.55334V7.45079C13.5974 7.97568 13.5089 8.429 13.332 8.81074C13.1586 9.1888 12.9076 9.48061 12.579 9.68617C12.2504 9.89172 11.8604 9.99449 11.4089 9.99449ZM11.0785 8.99243C11.353 8.99243 11.5859 8.92636 11.7773 8.79422C11.9723 8.66208 12.1204 8.46937 12.2215 8.2161C12.3226 7.95916 12.3732 7.65267 12.3732 7.29663V6.73503C12.3732 6.37164 12.3208 6.06332 12.2161 5.81005C12.115 5.55311 11.9669 5.35673 11.7719 5.22092C11.5769 5.08511 11.3385 5.01721 11.0568 5.01721C10.7824 5.01721 10.5422 5.08328 10.3364 5.21542C10.1341 5.34389 9.97704 5.52925 9.86509 5.77151C9.75675 6.01009 9.70258 6.2964 9.70258 6.63042V7.47281C9.70258 7.77013 9.76036 8.03441 9.87592 8.26566C9.99509 8.49323 10.1576 8.67125 10.3635 8.79972C10.5729 8.92819 10.8113 8.99243 11.0785 8.99243Z"></path>
    <path fill="currentColor" d="M4.70482 9.99449C4.15229 9.99449 3.70087 9.83482 3.35057 9.51548C3.00388 9.19247 2.83054 8.75935 2.83054 8.2161C2.83054 7.70223 3.00207 7.28745 3.34515 6.97178C3.69184 6.65244 4.19562 6.49277 4.8565 6.49277H6.30284V5.94769C6.30284 5.61367 6.20533 5.36774 6.01032 5.20991C5.81531 5.04841 5.55349 4.96765 5.22485 4.96765C5.00817 4.96765 4.82941 4.99702 4.68857 5.05575C4.54773 5.11081 4.43758 5.18789 4.35813 5.28699C4.27868 5.38243 4.22271 5.49621 4.19021 5.62835H3.04722C3.06527 5.3861 3.12305 5.16586 3.22056 4.96765C3.32168 4.76577 3.46252 4.59326 3.64309 4.4501C3.82727 4.30328 4.05297 4.19133 4.32021 4.11425C4.59106 4.03716 4.90525 3.99862 5.26277 3.99862C5.67086 3.99862 6.04463 4.06286 6.38409 4.19133C6.72356 4.31613 6.99441 4.52168 7.19665 4.80798C7.39888 5.09429 7.5 5.4797 7.5 5.96421V9.9064H6.35701V9.1521H6.30284C6.21978 9.29892 6.10783 9.43657 5.96698 9.56504C5.82614 9.69351 5.65099 9.79812 5.44153 9.87887C5.23569 9.95595 4.99012 9.99449 4.70482 9.99449ZM5.07318 9.04749C5.3043 9.04749 5.51196 8.99977 5.69613 8.90434C5.88031 8.80523 6.02657 8.67309 6.13491 8.50791C6.24686 8.34274 6.30284 8.1537 6.30284 7.94081V7.31314H5.04609C4.69579 7.31314 4.43939 7.39206 4.27688 7.5499C4.11798 7.70773 4.03853 7.90961 4.03853 8.15554C4.03853 8.4602 4.14326 8.68594 4.35272 8.83276C4.56578 8.97591 4.80594 9.04749 5.07318 9.04749Z"></path>
    <path fill="currentColor" d="M2.5 12.5L13.5 12.5C14.3284 12.5 15 11.8284 15 11V9.5C15 9.22386 15.2239 9 15.5 9C15.7761 9 16 9.22386 16 9.5V11C16 12.3807 14.8807 13.5 13.5 13.5L2.5 13.5C1.11929 13.5 -7.56324e-07 12.3807 0 11L6.55675e-08 9.5C3.58362e-07 9.22386 0.223858 9 0.5 9C0.776142 9 1 9.22386 1 9.5L1 11C0.999999 11.8284 1.67157 12.5 2.5 12.5Z"></path>
  </symbol>
  <symbol id="diffs-editor-icon-regex" viewBox="0 0 16 16">
    <path fill="currentColor" d="M8.60788 6.59074C8.78227 6.46701 9.02141 6.60508 9.00146 6.81797L8.77564 9.22666C8.76189 9.37331 8.87726 9.5 9.02455 9.5H9.97548C10.1228 9.5 10.2381 9.37331 10.2244 9.22667L9.99858 6.81801C9.97862 6.60513 10.2178 6.46706 10.3922 6.59079L12.3652 7.99066C12.4853 8.07589 12.6527 8.03932 12.7264 7.91177L13.2018 7.08823C13.2755 6.96068 13.2234 6.79742 13.0896 6.73601L10.8907 5.72723C10.6963 5.63807 10.6963 5.36193 10.8907 5.27277L13.0896 4.264C13.2234 4.20258 13.2755 4.03932 13.2018 3.91177L12.7263 3.08824C12.6527 2.96068 12.4853 2.92411 12.3652 3.00934L10.3922 4.40921C10.2178 4.53294 9.97862 4.39486 9.99858 4.18198L10.2244 1.77334C10.2381 1.62669 10.1228 1.5 9.97548 1.5H9.02455C8.87726 1.5 8.76189 1.62669 8.77564 1.77334L9.00146 4.18203C9.02141 4.39491 8.78227 4.53298 8.60788 4.40926L6.63479 3.00934C6.51466 2.92411 6.34726 2.96068 6.27362 3.08823L5.79815 3.91177C5.72451 4.03932 5.77654 4.20258 5.91041 4.26399L8.10929 5.27277C8.30363 5.36193 8.30363 5.63807 8.10929 5.72723L5.91041 6.73601C5.77653 6.79742 5.7245 6.96068 5.79814 7.08824L6.27361 7.91177C6.34725 8.03932 6.51466 8.07589 6.63478 7.99066L8.60788 6.59074Z"></path>
    <path fill="currentColor" d="M4 11C3.44772 11 3 11.4477 3 12V13C3 13.5523 3.44772 14 4 14H5C5.55228 14 6 13.5523 6 13V12C6 11.4477 5.55228 11 5 11H4Z"></path>
  </symbol>
  <symbol id="diffs-editor-icon-quick" viewBox="0 0 20 20">
    <polygon points="11 3 9 9 16 9 9 17 11 11 4 11 11 3" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon>
  </symbol>
  <symbol id="diffs-editor-icon-replace" viewBox="0 0 20 20">
   <path d="m3,11h11c1.657,0,3-1.343,3-3v-3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
   <polyline points="7 7 3 11 7 15" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline>
  </symbol>
  <symbol id="diffs-editor-icon-replace-all" viewBox="0 0 20 20">
    <path d="m16,6H6c-1.657,0-3,1.343-3,3v1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
    <polyline points="13.25 8.75 16 6 13.25 3.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline>
    <path d="m4,14h10c1.657,0,3-1.343,3-3v-1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
    <polyline points="6.75 11.25 4 14 6.75 16.75" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline>
  </symbol>
</svg>`,er=()=>{let e=document.createElement(`div`);e.innerHTML=$n;let t=e.firstElementChild;if(t===null||!(t instanceof SVGSVGElement))throw Error(`Failed to create sprite element`);return t},tr=(e,t=16)=>`<svg width="${t}" height="${t}" aria-hidden="true" focusable="false">
<use href="#diffs-editor-icon-${e}"></use>
</svg>`,nr=class{#e;#t;#n;#r;constructor(e){let{textDocument:t,containerElement:n,defaultQuery:r,mode:i=`find`,initialMatch:a,scrollToMatch:o,applyReplace:s,onUpdate:c,onClose:l}=e,u={text:r,replaceText:``,caseSensitive:!1,wholeWord:!1,regex:!1},d={all:[],current:void 0},f=U(`div`,{dataset:{matches:``,noMatches:``},textContent:`No results`}),p=e=>{if(d.all=u.text===``?[]:t.search(u),this.#e.querySelectorAll(`[data-icon][data-disabled]`).forEach(e=>{e.dataset.disabled=String(d.all.length===0)}),u.text===``){f.textContent=`No results`,f.dataset.noMatches=``;return}if(d.all.length===0){f.textContent=`No results`,f.dataset.noMatches=``,d.current=void 0,c([]);return}if(delete f.dataset.noMatches,e?.syncSelection===!1){m(c(d.all,{syncSelection:!1}));return}m(c(d.all))};this.#n=p;let m=e=>{if(e===void 0)f.textContent=`${d.all.length} results`;else{let[t,n]=e;f.textContent=`${d.all.findIndex(e=>e[0]===t&&e[1]===n)+1} of ${d.all.length}`}d.current=e},h=(e,t)=>{u[e]=t,p()},g=(e=!1,t=!1)=>{let n=d.all,r=n[0];if(n.length>0)if(e){let e=d.current?.[0]??0;r=n.at(-1);for(let t of n)if(t[1]<=e)r=t;else break}else{let e=d.current?.[1]??0;for(let t of n)if(t[0]>=e){r=t;break}}r!==void 0&&(m(r),o(r,t)),d.current=r},_=(e,n)=>({start:e,end:n,text:kt(e=>t.positionAt(e),e=>t.offsetAt(e),e=>t.getLineText(e),u,e,n)}),v=()=>{if(u.text===``||d.all.length===0)return;let e=d.current;if(e===void 0&&(g(!1,!0),e=d.current,e===void 0))return;let[t,n]=e,r=_(t,n);s([r]),o([t+r.text.length,t+r.text.length],!0),d.current=void 0,p()},y=()=>{u.text===``||d.all.length===0||(s(d.all.map(([e,t])=>_(e,t))),d.current=void 0,p())},b=()=>{this.cleanup(),l()},x=(e,t,n)=>{let r=U(`div`,{dataset:{icon:e,active:String(u[n])},title:t,innerHTML:tr(e),onclick:()=>{let e=!u[n];r.dataset.active=String(e),h(n,e)}});return r},S=x(`case`,`Match Case`,`caseSensitive`),C=x(`whole-word`,`Whole Word`,`wholeWord`),w=x(`regex`,`Regexp`,`regex`),T=U(`input`,{type:`text`,placeholder:`Replace`,dataset:`replace`,value:``,oninput:e=>{u.replaceText=e.target.value}});this.#t=U(`input`,{type:`text`,placeholder:`Search`,dataset:`search`,value:r,oninput:e=>{u.text=e.target.value,d.current=void 0,p()},onkeydown:e=>{e.key===`Escape`?(e.preventDefault(),b()):e.key===`Enter`?(e.preventDefault(),g(!1,!0)):zt(e)&&(e.key===`f`||e.code===`KeyF`)&&(e.preventDefault(),M(e.altKey?`replace`:`find`))}});let E=U(`div`,{dataset:`searchToggles`,children:[S,C,w]}),D=U(`div`,{dataset:{inputBox:``,find:``},children:[this.#t,E]}),O=U(`div`,{dataset:{inputBox:``,replace:``,replaceCell:``},children:[T]}),k=U(`div`,{dataset:{replaceActions:``,replaceCell:``},children:[U(`div`,{dataset:{icon:`replace`},title:`Replace`,innerHTML:tr(`replace`),onclick:()=>{v()}}),U(`div`,{dataset:{icon:`replace-all`},title:`Replace All`,innerHTML:tr(`replace-all`),onclick:()=>{y()}})]}),A=U(`div`,{dataset:`searchNav`,children:[U(`div`,{dataset:{icon:`arrow-up`,disabled:`true`},title:`Previous`,innerHTML:tr(`arrow-up`),onclick:()=>{g(!0)}}),U(`div`,{dataset:{icon:`arrow-down`,disabled:`true`},title:`Next`,innerHTML:tr(`arrow-down`),onclick:()=>{g()}}),U(`div`,{dataset:{icon:`close`},title:`Close`,innerHTML:tr(`close`),onclick:b})]}),j=U(`div`,{dataset:{searchGrid:``,mode:i},children:[D,f,A,O,k]}),M=e=>{j.dataset.mode=e,this.#t.focus(),this.#t.select()};this.#r=M,this.#e=U(`div`,{dataset:`searchPanel`,children:[U(`div`,{dataset:`editorWidget`,children:[j]})]}),d.current=a,n.before(this.#e),requestAnimationFrame(()=>{a===void 0?c([]):p(),this.#t.select()})}focus(){this.#t.focus()}updateMatches(e){this.#n?.(e)}setMode(e){this.#r?.(e)}cleanup(){this.#e.remove()}},rr=class{static renderIcon(e,t,n,r){return U(`div`,{dataset:{selectionActionIcon:``,visible:`false`},title:`Selection Action`,style:{transform:`translateY(${t}px) translateX(${e}px)`},innerHTML:tr(`quick`),onclick:r},n)}#e;#t;#n;#r;#i;constructor(e,t,n,r=0,i){this.line=e;let a=`selection-action-`+e;this.#n=U(`div`,{dataset:`selectionActionSlot`,slot:a,style:`white-space: normal`,children:[t]},n),this.#e=U(`div`,{dataset:{gutterBuffer:`selectionAction`,bufferSize:`1`},style:`grid-row: span 1`}),this.#t=U(`div`,{dataset:{selectionAction:String(e)},style:{paddingInlineStart:r+1+`ch`},contentEditable:`false`,children:[U(`slot`,{name:a})]}),this.#r=new ResizeObserver(i),this.#r.observe(this.#n),this.#i=i}render(e){let t=e.previousElementSibling,n=this.line+1,r=t?.querySelector(`[data-column-number="${n}"]`),i=e.querySelector(`[data-line="${n}"]`);t!=null&&r!=null&&i!=null&&(r.after(this.#e),i.after(this.#t),t.style.gridRow=`span `+t.children.length,e.style.gridRow=`span `+e.children.length,this.#i())}cleanup(){let e=this.#e.parentElement,t=this.#t.parentElement;this.#e.remove(),this.#t.remove(),e!=null&&t!=null&&(e.style.gridRow=`span `+e.children.length,t.style.gridRow=`span `+t.children.length),this.#i(),this.#n.remove(),this.#r.disconnect()}},ir=class{#e;#t;#n;ch=-1;tabSize=2;lineHeight=20;paddingTop=0;init(e){if(this.#e===e&&this.#t!==void 0&&this.ch!==-1)return;if(this.#e=e,this.#t??=document.createElement(`canvas`).getContext(`2d`)??void 0,this.#t===void 0)throw Error(`Could not get canvas context`);let t=e.parentElement;if(t!==null){let{paddingTop:e}=getComputedStyle(t);e.endsWith(`px`)&&(this.paddingTop=parseFloat(e.slice(0,-2)))}let{fontSize:n,fontFamily:r,tabSize:i,lineHeight:a}=getComputedStyle(e);a.endsWith(`px`)?this.lineHeight=parseFloat(a.slice(0,-2)):n.endsWith(`px`)&&(this.lineHeight=Yt(parseFloat(n.slice(0,-2))*parseFloat(a)));let o=n+` `+r;(this.#n!==o||this.ch===-1)&&(this.#n=o,this.#t.font=o,this.ch=this.canvasMeasureTextWidth(`0`)),this.tabSize=parseInt(i,10)}measureTextWidth(e){let t=e.replaceAll(`	`,` `.repeat(this.tabSize));return ar(t)?this.domMeasureTextWidth(t):this.canvasMeasureTextWidth(t)}canvasMeasureTextWidth(e){if(this.#t===void 0)throw Error(`Metrics not initialized`);return Yt(this.#t.measureText(e).width)}domMeasureTextWidth(e){if(this.#e===void 0)throw Error(`Metrics not initialized`);let t=U(`span`,{style:{position:`absolute`,top:`0`,left:`0`,visibility:`hidden`,pointerEvents:`none`,whiteSpace:`pre`,font:`inherit`},textContent:e},this.#e);try{return t.getBoundingClientRect().width}finally{t.remove()}}};function ar(e){for(let t=0;t<e.length;t++){let n=e.charCodeAt(t);if(n>=55296&&n<=57343||n===8205||n===65038||n===65039)return!0}return!1}function or(e,t){let n=Math.max(0,Math.min(t,e.length));if(n===0||n===e.length||!ar(e))return n;let r=new Intl.Segmenter(void 0,{granularity:`grapheme`});for(let t of r.segment(e)){let e=t.index,r=e+t.segment.length;if(n>e&&n<r)return r;if(n<=e)break}return n}function sr(e){if(!ar(e))return;let t=[0],n=new Intl.Segmenter(void 0,{granularity:`grapheme`});for(let r of n.segment(e))t.push(r.index+r.segment.length);return t}function cr(e,t){let n=0;for(let r=0;r<e.length;r++){if(e.charCodeAt(r)>127)return-1;n+=e.charCodeAt(r)===9?t:1}return n}var lr=class e{static TOKENIZE_TIME_LIMIT=500;#e;#t;#n;#r;#i;#a;#o;#s;#c;#l;#u;#d=[Oe];#f=-1;#p=!0;#m=!1;#h=0;#g;#_=0;#v=!1;#y=Jt(async e=>{let{startingLine:t=0,totalLines:n=1/0}=e??{},r=Math.min(n===1/0?1/0:t+n,this.#a.lineCount);this.#t===void 0&&!fr(this.#a.languageId)&&(await this.#e.loadLanguage(this.#a.languageId),this.#t=this.#e.getLanguage(this.#a.languageId)),this.#O(r)},500);#b=({data:e})=>{if(typeof e!=`object`||!e)return;let{type:t,jobId:n}=e;t===`tokenize`&&typeof n==`number`&&n===this.#h&&this.#k(n)};get themeType(){return this.#r}constructor({codeOptions:e,highlighter:t,textDocument:n,setStyle:r,onDeferTokenize:i,__debug:a}){let{themeType:o=`system`,theme:s=Fe,tokenizeMaxLineLength:c=1e3}=e;if(this.#n=window.matchMedia(`(prefers-color-scheme: dark)`),o===`system`?this.#r=this.#n.matches?`dark`:`light`:this.#r=o,typeof s!=`string`){let e=new MutationObserver(e=>{for(let{type:t,attributeName:n}of e)if(t===`attributes`&&n!==null&&(n===`class`||n.startsWith(`data-`))){let e=getComputedStyle(document.body).colorScheme===`dark`?`dark`:`light`;this.#x(s[e],e);break}});e.observe(document.documentElement,{attributes:!0}),e.observe(document.body,{attributes:!0}),this.#u=[W(this.#n,`change`,e=>{let t=e.matches?`dark`:`light`;this.#x(s[t],t)}),()=>e.disconnect()]}this.#e=t,this.#a=n,this.#o=c,this.#s=r,this.#c=i,this.#l=a??!1,!fr(n.languageId)&&t.getLoadedLanguages().includes(n.languageId)&&(this.#t=t.getLanguage(n.languageId)),this.#i=[],this.#S(typeof s==`string`?s:s[this.#r])}#x(e,t){this.#r=t,this.#S(e),this.stopBackgroundTokenize(),this.#d=[Oe],this.#t!==void 0&&this.#a.lineCount>0&&this.#E(0)}#S(e){this.#i=this.#e.setTheme(e).colorMap;let{colors:t={}}=this.#e.getTheme(e),n=t[`editor.selectionBackground`],r=t[`editor.lineHighlightBackground`],i=t[`editorLineNumber.foreground`],a=t[`editorLineNumber.activeForeground`],o=t[`editorCursor.foreground`],s=t[`editor.findMatchBackground`],c=t[`editor.findMatchHighlightBackground`],l=t[`editorHint.foreground`],u=t[`editorInfo.foreground`],d=t[`editorWarning.foreground`],f=t[`editorError.foreground`];this.#s(`:host {
      --diffs-editor-selection-bg: ${n??`var(--diffs-line-bg)`};
      --diffs-editor-line-highlight-bg: ${r??`var(--diffs-line-bg)`};
      --diffs-editor-line-number-fg: ${i??`var(--diffs-fg-number)`};
      --diffs-editor-line-number-active-bg: ${r??`var(--diffs-line-bg, var(--diffs-bg))`};
      --diffs-editor-line-number-active-fg: ${a??`var(--diffs-selection-number-fg)`};
      --diffs-editor-match-bg: ${s??`unset`};
      --diffs-editor-match-highlight-bg: ${c??`unset`};
      --diffs-editor-cursor-fg: ${o??`unset`};
      --diffs-editor-hint-fg: ${l??`unset`};
      --diffs-editor-info-fg: ${u??`unset`};
      --diffs-editor-warning-fg: ${d??`unset`};
      --diffs-editor-error-fg: ${f??`unset`};
    }`)}cleanUp(){this.stopBackgroundTokenize(),this.#w(),this.#u?.forEach(e=>e()),this.#u=void 0}tokenize(e,t){if(this.#t===void 0&&!fr(this.#a.languageId))throw Error(`Grammar not loaded`);let{lineCount:n}=this.#a,{startingLine:r=0,totalLines:i=1/0}=t??{},a=i===1/0?n:Math.min(r+i,n),o=e.startLine,s=Math.max(r,o),c=t!==void 0&&i!==1/0&&e.lineDelta>0&&o<a&&e.endLine>=a,l=e.lineDelta===0,u=l||t===void 0||o>=s,d=l?e.changedLineRanges??[[o,e.endLine]]:[[o,e.endLine]],f=-1;if(o<s)for(let[e,t]of d)e<s&&(f=Math.max(f,Math.min(t,s-1)));let p=f>=o&&(l||e.lineDelta<0);l?this.#O(o):(this.#d.length=Math.min(this.#d.length,o+1),(t===void 0||o>=s)&&this.#O(s));let m=0,h=d[m][1],g,_=0,v=l?d[m][0]:s,y=this.#d[v]??Oe,b=!1,x=new Map,S=p?new Map:void 0;if(S!==void 0&&!l){let e=Math.min(f+1,s,a);if(e>o){this.#O(e);let t=o,n=this.#d[t]??Oe;for(;t<e;t++){let e=this.#D(t,n);n=e.state,S.set(t,e.resolvedTokens)}u&&(this.#d[e]=n)}}for(;v<a;){let e=l?this.#d[v+1]:void 0;u&&(this.#d[v]=y);let{resolvedTokens:t,state:n}=this.#D(v,y);if(y=n,v>=s?x.set(v,t):S?.set(v,t),u&&(this.#d[v+1]=y),b=v>=h&&l&&e!==void 0&&y.equals(e),b){m++;let e=d[m];if(e===void 0)break;if(e[0]>=a){g=e[0],_=m;break}this.#d[e[0]]===void 0?(h=e[1],v++):(v=e[0],y=this.#d[v]??y,h=e[1]),b=!1;continue}v++}if(u&&(v<a?this.#d[v+1]=y:this.#d[v]=y),S!==void 0&&S.size>0&&this.#c(S,this.#r),g!==void 0)this.#E(g,d,_);else if(!b&&v<n){let e=c&&o>=s?a:o<s&&!l?o:v;this.#E(e,l?d:void 0,m)}return x}prebuildStateStack(e){this.#y(e)}stopBackgroundTokenize(){this.#p||(this.#p=!0,this.#m=!1,this.#f=-1,this.#g=void 0,this.#_=0,this.#w())}pauseBackgroundTokenize(){this.#p||this.#m||(this.#l&&console.log(`[diffs/editor] background tokenization paused`,{jobId:this.#h}),this.#m=!0)}resumeBackgroundTokenize(){this.#p||!this.#m||this.#t===void 0||this.#f<0||(this.#l&&console.log(`[diffs/editor] background tokenization resumed`,{jobId:this.#h}),this.#m=!1,this.#T(this.#h))}#C(){this.#v||=(globalThis.addEventListener(`message`,this.#b),!0)}#w(){this.#v&&=(globalThis.removeEventListener(`message`,this.#b),!1)}#T(e){globalThis.postMessage({type:`tokenize`,jobId:e})}#E(e,t,n=0){if(fr(this.#a.languageId))return;let r=++this.#h;this.#l&&console.log(`[diffs/editor] background tokenization scheduled`,{jobId:r,startLine:e,changedLineRanges:t,changedRangeIndex:n}),this.#p=!1,this.#m=!1,this.#f=e,this.#g=t,this.#_=n,this.#C(),this.#T(r)}#D(t,n){let r=this.#a.getLineText(t);if(r.length>this.#o)return console.warn(`[diffs] Line(${t}) too long to tokenize: ${r.length}`),{resolvedTokens:[[0,``,r]],state:n};if(this.#t===void 0||r===``||r.trim()===``)return{resolvedTokens:[[0,``,r]],state:n};let i=ur(this.#t,this.#i,r,n,e.TOKENIZE_TIME_LIMIT);return{resolvedTokens:i.resolvedTokens,state:i.ruleStack}}#O(t){let n=Math.min(Math.max(0,t),this.#a.lineCount);if(this.#d.length>n||this.#t===void 0)return;let r=this.#d.length-1,i=this.#d[r]??Oe;for(;r<n;r++){this.#d[r]=i;let t=this.#a.getLineText(r);t.length<=this.#o&&t!==``&&t.trim()!==``&&(i=this.#t.tokenizeLine2(t,i,e.TOKENIZE_TIME_LIMIT).ruleStack)}this.#d[r]=i}#k(t){if(this.#p||this.#m||this.#t===void 0||t!==this.#h)return;let n=performance.now(),r=new Map,i=this.#a.lineCount,a=this.#g,o=this.#f,s=this.#d[o]??Oe,c=!1,l=this.#_,u=a?.[l]?.[1];for(;o<i;){this.#d[o]=s;let t=u===void 0?void 0:this.#d[o+1],i=this.#a.getLineText(o);if(i.length>this.#o)console.warn(`[diffs] Line(${o}) too long to tokenize: ${i.length}`),r.set(o,[[0,``,i]]);else if(i===``||i.trim()===``)r.set(o,[[0,``,i]]);else{let t=ur(this.#t,this.#i,i,s,e.TOKENIZE_TIME_LIMIT);r.set(o,t.resolvedTokens),s=t.ruleStack}if(this.#d[o+1]=s,c=u!==void 0&&o>=u&&t!==void 0&&s.equals(t),o++,c){l++;let e=a?.[l];if(e===void 0)break;if(u=e[1],this.#d[e[0]]===void 0)c=!1;else{o=e[0],s=this.#d[o]??s,c=!1;continue}}if(performance.now()-n>1)break}if(this.#c(r,this.#r),!(this.#p||this.#m||t!==this.#h)){if(c||o>=i){this.stopBackgroundTokenize();return}this.#f=o,this.#_=l,this.#T(t)}}};function ur(e,t,n,r,i){let a=e.tokenizeLine2(n,r,i);a.stoppedEarly&&console.warn(`[diffs] Time limit reached when tokenizing line: ${n.substring(0,100)}`);let o=a.tokens,s=o.length/2,c=[];for(let e=0;e<s;e++){let r=o[2*e],i=e+1<s?o[2*e+2]:n.length;if(r===i)continue;let a=o[2*e+1],l=t[Ee.getForeground(a)],u=n.slice(r,i);c.push([r,l,u])}return{ruleStack:a.ruleStack,resolvedTokens:c}}function dr(e,t){return e.map(([e,n,r])=>e===0&&n===``?r===``?U(`br`):r:U(`span`,{dataset:{char:e.toString()},style:`--diffs-token-${t}:${n};`,textContent:r}))}function fr(e){return e===`text`||e===`ansi`}var pr=class{#e;#t=!1;#n=new ir;#r;#i;#a;#o;#s;#c;#l;#u=new Map;#d=new Map;#f;#p;#m;#h;#g;#_;#v;#y;#b;#x;#S;#C;#w;#T;#E;#D;#O;#k;#A;#j;#M;#N=!1;#P=!1;#F=!1;#I=!1;#L;#R;#z;#B;#V;#H;#U;#W=!1;#G=!1;#K=(e,t)=>{if(this.#T?.updateRenderCache(e,t),this.#k!==void 0&&this.#k.totalLines!==1/0){let{startingLine:n,totalLines:r}=this.#k,i=Math.min(n+r,this.#O?.lineCount??0);for(let[r,a]of e)if(r>=n&&r<i){let e=this.#Te(r);e!==void 0&&e.replaceChildren(...dr(a,t))}}};constructor(e={}){this.#e=e}edit(e){let{useTokenTransformer:t,expandUnchanged:n,diffStyle:r,...i}=e.options,a=e.type===`file-diff`;return(t!==!0||n!==!0&&a||r===`unified`&&a)&&(e.setOptions({...i,useTokenTransformer:!0,expandUnchanged:!0,diffStyle:`split`}),e.rerender()),this.#T=e,this.#Y(),this.#s=e.attachEditor(this),()=>this.cleanUp()}applyEdits(e,t=!1){let n=this.#O;if(n==null)throw Error(`Editor is not attached`);let r=n.applyEdits(e,t,this.#B);r!==void 0&&this.#Ce(r,void 0,this.#we(r))}getState(){let e=this.#Se();if(e===void 0)throw Error(`Editor is not attached`);return{file:{...e,cacheKey:`edited-at-`+Date.now()},selections:this.#B,lineAnnotations:this.#D,renderRange:this.#k}}setState({file:e,lineAnnotations:t,renderRange:n,selections:r}){this.#q(),this.#J(),this.#z=r,this.#T?.render({file:{...e,cacheKey:`edited-at-`+Date.now()},lineAnnotations:t,renderRange:n})}setSelections(e){let t=this.#O;if(t===void 0)throw Error(`Text document is not initialized`);let n=e.map(e=>{let n=t.normalizePosition(e.start),r=t.normalizePosition(e.end);return{direction:e.direction===`none`?0:e.direction===`backward`?-1:1,start:n,end:r}});this.#oe(n),this.#re(!1,`center`)}setMarkers(e){let t=this.#O;if(t===void 0)throw Error(`Text document is not initialized`);if(e.length===0){this.#A?.cleanup(),this.#A=void 0,this.#oe(this.#B??[]);return}this.#A??=new Zn({getLineHeight:()=>this.#n.lineHeight,getFileContainer:()=>this.#v,getCharX:(e,t)=>this.#ke(e,t),getLineY:e=>this.#Oe(e),isMouseDown:()=>this.#F||this.#P}),this.#A.setMarkers(e,t),this.#b!==void 0&&this.#A.listenHover(this.#b),this.#oe(this.#B??[])}focus(e){let t=e?.preventScroll??!1,n=this.#B?.at(-1);if(n!==void 0){let e=n.direction===-1?n.end:n.start;this.#te(e,t)}else this.#te(void 0,t)}blur(){this.#b?.blur()}cleanUp(){this.#r?.cleanUp(),this.#r=void 0,this.#a?.forEach(e=>e()),this.#a=void 0,this.#i?.forEach(e=>e()),this.#i=void 0,this.#o?.forEach(e=>e()),this.#o=void 0,this.#s?.(),this.#s=void 0,this.#c=void 0,this.#l=void 0,this.#u.clear(),this.#d.clear(),this.#f=void 0,this.#p=void 0,this.#m?.remove(),this.#m=void 0,this.#h?.remove(),this.#h=void 0,this.#g?.remove(),this.#g=void 0,this.#_?.remove(),this.#_=void 0,this.#v=void 0,this.#y=void 0,this.#b?.removeAttribute(`contentEditable`),this.#b=void 0,this.#x?.remove(),this.#x=void 0,this.#w?.disconnect(),this.#w=void 0,this.#J()}__postponeBackgroundTokenizeToNextFrame(){let e=this.#r;e!==void 0&&(e.pauseBackgroundTokenize(),requestAnimationFrame(()=>{e.resumeBackgroundTokenize()}))}__syncRenderView=(e,t,n,r,i)=>{let a=t.shadowRoot;if(a==null){console.error(`[editor] Could not find the shadow root.`);return}let o,s,c;for(let e of a.querySelectorAll(`[data-code]`))if(e.dataset.deletions===void 0){o=e;for(let t of e.children){let e=t,{gutter:n,content:r}=e.dataset;n===void 0?r!==void 0&&(c=e):s=e}break}if(!(o===void 0||c===void 0)){if(this.#v!==t&&(this.#v=t,this.#m!==void 0&&t.appendChild(this.#m),this.#h!==void 0&&a.appendChild(this.#h),this.#g!==void 0&&a.appendChild(this.#g),this.#_!==void 0&&a.prepend(this.#_)),this.#O===void 0||this.#E===void 0||this.#E.name!==n.name||this.#E.contents!==n.contents||this.#E.lang!==n.lang||this.#E.cacheKey!==n.cacheKey){let t=new at({maxEntries:this.#e.historyMaxEntries}),r=new jt(n.name,n.contents,n.lang??Pe(n.name),0,t);this.#E=n,this.#O=r,this.#r?.cleanUp(),this.#r=new lr({highlighter:e,textDocument:r,codeOptions:this.#T?.options??{},onDeferTokenize:this.#K,setStyle:e=>{this.#g.textContent=e},__debug:this.#e.__debug}),this.#J(),this.#B=this.#z,this.#e.onAttach?.(this,this.#T),this.#O!==void 0&&this.#e.__debug===!0&&console.log(`[diffs/editor] text document changed !!!`)}if(this.#b!==c&&(this.#y=s,this.#b=qt(c,{contentEditable:`true`,role:`textbox`,ariaMultiLine:`true`,autocapitalize:`off`,writingSuggestions:`off`,autocorrect:!1,spellcheck:!1,translate:!1}),this.#x!==void 0&&c.after(this.#x),this.#n.init(c),this.#X(c,s),this.#b!==void 0&&this.#e.__debug===!0&&console.log(`[diffs/editor] full re-render triggered !!!`)),this.#q(),this.#t=this.#T?.options.overflow===`wrap`,this.#D=r,this.#k=i,this.#r?.prebuildStateStack(i),(this.#B!==void 0||this.#V!==void 0||this.#A!==void 0)&&this.#oe(this.#B??[]),this.#z!==void 0&&this.#C!==void 0?(this.#z=void 0,this.#re(!1,`center`)):this.#H===void 0?this.#B!==void 0&&this.#B.length>0&&!this.#G&&this.focus({preventScroll:!0}):this.#ae(this.#H,this.#U,this.#W),this.#G&&this.#j?.focus(),this.#M!==void 0&&this.#Me(this.#M.line)&&this.#b!==void 0&&this.#M.render(this.#b),this.#e.__debug===!0&&i!==void 0){let{startingLine:e,totalLines:t}=i;console.log(`[diffs/editor] render file:`,n.name,`RenderRange:`,e+`-`+(e+t),`of`,this.#O.lineCount,`lines`)}}};#q(){this.#u.clear(),this.#d.clear(),this.#f=void 0,this.#p=void 0}#J(){this.#c=void 0,this.#l=void 0,this.#T?.setSelectedLines(null),this.#N=!1,this.#S?.forEach(e=>e.remove()),this.#S=void 0,this.#B=void 0,this.#R=void 0,this.#H=void 0,this.#A?.cleanup(),this.#A=void 0,this.#j?.cleanup(),this.#j=void 0,this.#M?.cleanup(),this.#M=void 0}#Y(){this.#m=U(`style`,{dataset:`editorGlobalCss`,textContent:`
        [data-annotation-slot] {
          user-select: none;
          -webkit-user-select: none;
        }
      `}),this.#h=U(`style`,{dataset:`editorCss`,textContent:Wt}),this.#g=U(`style`,{dataset:`editorThemeCss`}),this.#_=er(),this.#x=U(`div`,{dataset:`editorOverlay`}),this.#a=[W(document,`selectionchange`,()=>{let e=this.#v?.shadowRoot;if(this.#N||e==null||this.#B!==void 0&&this.#B.length>1&&!this.#F)return;let t=document.getSelection()?.getComposedRanges({shadowRoots:[e]})?.[0];if(t===void 0||!this.#je(t))return;let n=rn(t,0);if(n!==void 0){if(this.#F&&this.#I&&this.#B!==void 0&&this.#B.length>0){let e=this.#B.at(-1);this.#oe([bn(e,n)]);return}this.#F?this.#L===void 0?this.#L=n:n=yn(this.#L,n):this.#L!==void 0&&(n.direction=yn(this.#L,n).direction),this.#R===void 0?this.#oe([n]):this.#oe([...this.#R.filter(e=>!_n(e,n)),n])}},{passive:!0}),W(document,`pointerup`,e=>{e.pointerType===`mouse`&&(this.#o?.forEach(e=>e()),this.#o=void 0,this.#P&&(this.#P=!1,this.#te()),this.#N=!1,this.#F=!1,this.#I=!1,this.#L=void 0,this.#R=void 0,this.#S?.forEach((e,t)=>{t.startsWith(`selectionActionIcon-`)&&(e.dataset.visible=`true`)}))},{passive:!0}),W(document,`keydown`,e=>{e.key===`Shift`&&(this.#L=this.#B?.at(-1))},{passive:!0}),W(document,`keyup`,e=>{e.key===`Shift`&&(this.#L=void 0)},{passive:!0})]}#X(e,t){let n=t=>{let n=t.composedPath()[0];return n!==void 0&&(n===e||e.contains(n))};if(this.#i?.forEach(e=>e()),this.#i=[W(e,`pointerdown`,t=>{if(t.pointerType===`mouse`&&(this.#A?.removePopup(),Rt()&&this.#D!==void 0&&this.#D.length>0&&(this.#o=[...e.querySelectorAll(`[data-line-annotation]`)].map(e=>[W(e,`mouseenter`,()=>{this.#N=!0}),W(e,`mouseleave`,()=>{this.#N=!1})]).flat()),this.#F=!0,this.#L=void 0,t.button===0&&zt(t)&&(this.#R=this.#B?.map(e=>({...e}))),t.shiftKey)){let e=this.#B?.at(-1);if(e!==void 0){let t=e.direction===-1?e.end:e.start;this.#ne({start:t,end:t,direction:0})}this.#I=!0}},{passive:!0}),W(e,`keydown`,e=>{if(e.key===`Escape`){if(e.preventDefault(),this.#j?.cleanup(),this.#j=void 0,this.#G=!1,this.#M?.cleanup(),this.#M=void 0,this.#B!==void 0&&this.#B.length>0){let e=this.#B.at(-1);if(!mn(e)||this.#B.length>1){let t=hn(e);this.#oe([{start:t,end:t,direction:0}]),this.#te(t)}}return}if(!n(e))return;let t=Bt(e),r=this.#O;if(this.#B!==void 0&&this.#B.length>0&&t!==void 0&&r!==void 0){e.shiftKey?this.#oe(sn(r,this.#B,t)):this.#oe(on(r,this.#B,t)),this.#re(),e.preventDefault();return}let i=Ut(e);i!==void 0&&(e.preventDefault(),this.#Z(i))}),W(e,`copy`,e=>{n(e)&&(e.preventDefault(),e.clipboardData?.setData(`text`,this.#me()))}),W(e,`cut`,e=>{n(e)&&(e.preventDefault(),e.clipboardData?.setData(`text`,this.#me()),this.#he(``))}),W(e,`paste`,e=>{if(!n(e))return;e.preventDefault();let t=e.clipboardData?.getData(`text`);t!==void 0&&this.#he(t)}),W(e,`beforeinput`,e=>{n(e)&&(e.preventDefault(),this.#ee(e.inputType,e.data))}),W(e,`drop`,e=>{n(e)&&e.preventDefault()}),W(e,`compositionstart`,e=>{n(e)&&(this.#N=!0)},{passive:!0}),W(e,`compositionend`,e=>{n(e)&&(this.#N=!1,this.#ee(`insertText`,e.data))},{passive:!0})],t!==void 0){let e=(e,t=!1)=>{let n=e;return n?.dataset.lineNumberContent===void 0?t&&n?.tagName===`SPAN`&&(n=n.closest(`[data-line]`)):n=n.parentElement??void 0,n},n=e=>{if(e===void 0)return;let t=e.dataset.lineType,n=Gt(e)??Gt(e,`columnNumber`);if(!(n===void 0||t===void 0||!gn(t)))return n-1};this.#i.push(W(t,`pointerdown`,t=>{if(this.#T?.options.enableLineSelection===!0)return;let r=this.#O,i=n(e(t.composedPath()[0]));if(i===void 0||r===void 0)return;this.#A?.removePopup();let a={start:{line:i,character:0},end:{line:i,character:r.getLineText(i).length},direction:1};this.#P=!0,this.#L=a,this.#oe([a]),this.#te(a.end),this.#o=[W(document,`mousemove`,t=>{if(!this.#P)return;let r=this.#O,i=n(e(t.composedPath()[0],!0));if(i===void 0||r===void 0)return;let a={start:{line:i,character:0},end:{line:i,character:r.getLineText(i).length},direction:1};this.#L===void 0?this.#L=a:a=yn(this.#L,a),this.#oe([a]),this.#te(a.end)},{passive:!0})]},{passive:!0}))}this.#A?.listenHover(e),this.#w?.disconnect(),this.#w=new ResizeObserver(()=>{this.#Q()}),this.#w.observe(e),this.#w.observe(e.parentElement)}#Z(e){let t=this.#O;if(t!==void 0)switch(e){case`openSearchPanel`:this.#fe(`find`);break;case`openSearchReplacePanel`:this.#fe(`replace`);break;case`findNextMatch`:{let e=this.#B;if(e===void 0)break;if(e.some(mn)){let n=e.map(e=>mn(e)?On(t,e):e);this.#oe(n),this.focus()}else{let n=Cn(t,e);n!==void 0&&(this.#oe(n),this.#re())}break}case`indent`:case`outdent`:if(this.#B!==void 0){let n=[],r=[];for(let i of this.#B){let a=i.start.line,o=e===`outdent`;if(a!==i.end.line||o){let e=an(t,i,this.#n.tabSize,o);n.push(...e[0]),r.push(e[1])}else{let e=t.charAt({line:a,character:0});this.#he(e===`	`?`	`:` `.repeat(this.#n.tabSize))}}let i=t.applyEdits(n,!0,this.#B,r);i!==void 0&&this.#Ce(i,r)}break;case`selectAll`:this.#oe([wn(t)]),this.focus();break;case`moveCursorToDocStart`:case`moveCursorToDocEnd`:{let n=e===`moveCursorToDocEnd`;this.#oe([Tn(t,n)]),this.#re()}break;case`expandSelectionDocStart`:case`expandSelectionDocEnd`:{let n=e===`expandSelectionDocEnd`,r=this.#B;r!==void 0&&(this.#oe(xn(r,Tn(t,n))),this.#re())}break;case`undo`:if(this.#O?.canUndo===!0){let e=this.#O.undo();e!==void 0&&this.#Ce(...e)}break;case`redo`:if(this.#O?.canRedo===!0){let e=this.#O.redo();e!==void 0&&this.#Ce(...e)}break}}#Q(){let e=this.#D?.length??0,t=this.#c,n=this.#l;this.#c=void 0,this.#l=void 0;let r=this.#Ee()!==t,i=this.#De()!==n;!r&&!i||(this.#f=void 0,this.#p=void 0,i&&(this.#t||e>0)&&(this.#u.clear(),this.#d.clear()),(this.#B!==void 0||this.#V!==void 0||this.#A!==void 0)&&(this.#oe(this.#B??[]),this.#B!==void 0&&this.focus()),this.#A?.removePopup())}#$(e,t,n=this.#k,r){let i=this.#r,a=this.#T,o=this.#E,s=this.#O,c=this.#y,l=this.#b;if(i===void 0||a===void 0||o===void 0||s===void 0||l===void 0)return;i.stopBackgroundTokenize();let u=performance.now(),d=i.tokenize(e,n),f=performance.now();if(d.size>0){let t=l.children,r=new Set(d.keys()),a=n?.startingLine??0;for(let n=e.startLine-a;n<t.length;n++){let e=t[n];if(e!==void 0){let t=Gt(e);if(t!==void 0){let n=t-1;if(d.has(n)){let t=d.get(n);if(e.replaceChildren(...dr(t,i.themeType)),r.delete(n),r.size===0)break}}}}if(r.size>0)for(let e of r){let t=d.get(e),n=String(e+1);U(`div`,{dataset:{line:n,lineType:`context`,lineIndex:e.toString()},children:dr(t,i.themeType)},l),c!==void 0&&U(`div`,{dataset:{lineType:`context`,columnNumber:n,lineIndex:e.toString()},children:[U(`span`,{dataset:{lineNumberContent:``},textContent:n})]},c)}}if(e.lineDelta<0)for(let t of[l.children,c?.children??[]])for(let n=t.length-1;n>=0;n--){let r=t[n],i=Gt(r)??Gt(r,`columnNumber`);if(i!==void 0){if(i-1<e.lineCount)break;r.remove()}}let p=Object.hasOwn(a,`fileDiff`),m=e.lineDelta!==0;if(m){let e=l.children.length;for(let t of l.children){let{bufferSize:n}=t.dataset;n!==void 0&&(e+=parseInt(n)-1)}l.style.gridRow=`span `+e,c!==void 0&&(c.style.gridRow=`span `+e)}a.updateRenderCache(d,i.themeType,p?!m:void 0),m&&a.applyDocumentChange(s,t,r),t!==void 0&&(this.#D=t,Zt(t,l,c)),this.#e.__debug===!0&&console.log(`[diffs/editor] re-render in: ${Yt(performance.now()-f)}ms,`,`tokenize in: ${Yt(f-u)}ms (${d.size} dirty lines)`)}#ee(e,t){switch(e){case`insertText`:this.#he(t??``);break;case`insertParagraph`:this.#he(`
`);break;case`deleteContentBackward`:this.#ge();break;case`deleteContentForward`:this.#ge(!0);break;case`deleteSoftLineBackward`:this.#_e();break;case`deleteHardLineForward`:this.#ye();break;case`deleteWordBackward`:this.#ve();break;case`insertTranspose`:this.#be();break;default:console.warn(`[diffs] Unknown input type: ${e}`,t);break}}#te(e,t=!0){e===void 0?this.#b?.focus({preventScroll:t}):(this.#N=!0,this.#ne({start:e,end:e,direction:0}),requestAnimationFrame(()=>{this.#b?.focus({preventScroll:t}),requestAnimationFrame(()=>{this.#N=!1})}))}#ne(e){let t=window.getSelection();if(t===null)return;let{start:n,end:r,direction:i}=e;G(n,r)>0&&([n,r]=[r,n]);let a=this.#Te(n.line),o=this.#Te(r.line);if(a===void 0||o===void 0)return;let[s,c]=Dn(a,n.character),[l,u]=Dn(o,r.character);i===-1&&([s,c,l,u]=[l,u,s,c]);try{t.setBaseAndExtent(s,Kt(s,c),l,Kt(l,u))}catch(e){console.error(`[diffs/editor] failed to update window selection:`,e)}}#re(e=!1,t=`nearest`){let n=this.#B?.at(-1);if(n===void 0)return;let r=this.#C;if(r!==void 0)r.scrollIntoView({block:t,inline:`nearest`}),e||this.#te(n.direction===-1?n.end:n.start);else{let t=hn(n);this.#ae(t.line,t.character,e)}}#ie(){let e=this.#T?.top??0,t=this.#j===void 0?0:48,n=this.#Ee()+this.#n.ch,r=this.#n.ch;return`${e+t}px ${r}px 0 ${n}px`}#ae(e,t=0,n=!1){this.__postponeBackgroundTokenizeToNextFrame();let r=U(`div`,{style:{position:`absolute`,left:`0`,width:`2px`,height:this.#n.lineHeight+`px`,scrollMargin:this.#ie()}});if(this.#Te(e)!==void 0){let[i,a]=this.#ke(e,t),o=this.#Oe(e)+a*this.#n.lineHeight;r.style.top=o+`px`,r.style.left=i+`px`,this.#x?.appendChild(r),r.scrollIntoView({block:`center`,inline:`nearest`}),n||this.#te({line:e,character:t}),this.#H=void 0,this.#U=void 0,this.#W=!1}else{let i=0;if(this.#H===e&&this.#b!==void 0)for(let t=this.#b.childElementCount-1;t>=0;t--){let n=this.#b.children[t],r=n.dataset.lineType,a=Gt(n);if(r!==void 0&&gn(r)&&a!==void 0){i=(e-a)*this.#n.lineHeight;break}}let a=((this.#D??[]).filter(t=>t.lineNumber<e).length+e)*this.#n.lineHeight+i;r.style.top=a+`px`,this.#v?.shadowRoot?.appendChild(r),r.scrollIntoView({block:`center`,inline:`nearest`}),this.#H===e&&i===0?(this.#H=void 0,this.#U=void 0,this.#W=!1):(this.#H=e,this.#U=t,this.#W=n)}r.remove()}#oe(e){if(this.__postponeBackgroundTokenizeToNextFrame(),this.#C=void 0,this.#T?.setSelectedLines(null),this.#y?.querySelectorAll(`[data-active]`).forEach(e=>e.removeAttribute(`data-active`)),e.length===0&&this.#V===void 0&&this.#A===void 0){this.#B=void 0,this.#S?.forEach(e=>e.remove()),this.#S?.clear();return}let t=document.createDocumentFragment(),n={fragment:t,elements:new Map};if(e.length>0){let t=Sn(e),r=t.at(-1);if(this.#B=t,mn(r)){let e=r.start.line+1;this.#T?.setSelectedLines({start:e,end:e})}else if(this.#y!==void 0){let e=hn(r);this.#y.querySelector(`[data-column-number="${e.line+1}"]`)?.setAttribute(`data-active`,``)}for(let e of t)mn(e)||this.#se(n,`selection`,e),this.#ue(n,e,e===r);this.#e.enabledSelectionAction===!0&&!mn(r)&&this.#de(n,r)}let r=this.#O;if(this.#V!==void 0&&r!==void 0){let e=this.#B?.at(-1),t=e===void 0?-1:r.offsetAt(e.start),i=e===void 0?-1:r.offsetAt(e.end);for(let[e,a]of this.#V){let o={start:r.positionAt(e),end:r.positionAt(a)},s=t===e&&i===a;this.#se(n,`match`,o,s?`focus`:void 0)}}if(this.#A!==void 0&&r!==void 0)for(let e of this.#A.markers)this.#se(n,`marker`,e,Qn(e.severity));this.#x?.appendChild(t),this.#S?.forEach(e=>e.remove()),this.#S?.clear(),this.#S=n.elements}#se(e,t,n,r){if(this.#O===void 0)return;let{start:i,end:a}=n;for(let n=i.line;n<=a.line;n++){if(!this.#Me(n))continue;let o=n===a.line,s=this.#O.getLineText(n),c=n===i.line?i.character:0,l=o?a.character:s.length;if(this.#t){let i=this.#De();if(2*this.#n.ch+this.#n.measureTextWidth(s)>i){this.#ce(e,n,s,c,l,o,t,r);continue}}let u=0,d=0,f=0;u=c===0?this.#Ee()+this.#n.ch:this.#ke(n,c)[0],!o&&t===`selection`&&(f=this.#n.ch),d=c===l?f:this.#ke(n,l)[0]-u+f,this.#le(e,t,n,0,u,d,r)}}#ce(e,t,n,r,i,a,o,s){let c=this.#Ae(t),l=c.length-1,u=this.#Ee()+this.#n.ch;for(let d=0;d<l;d++){let f=c[d],p=c[d+1],m=Math.max(r,f),h=Math.min(i,p);if(m>h)continue;let g,_,v=0;if(m===0)g=u;else{let e=n.slice(f,m),t=cr(e,this.#n.tabSize);g=u+(t===-1?this.#n.measureTextWidth(e):t*this.#n.ch)}if(!a&&d===l-1&&o===`selection`&&(v=this.#n.ch),m===h)_=v;else{let e=n.slice(m,h),t=cr(e,this.#n.tabSize);_=t===-1?this.#n.measureTextWidth(e):t*this.#n.ch,_+=v}this.#le(e,o,t,d,g,_,s)}}#le(e,t,n,r,i,a,o){if(a===0)return;let{ch:s,lineHeight:c}=this.#n,l=this.#Oe(n)+r*c,u=`width:${a}px;transform:translateX(${i}px) translateY(${l}px);`,d=`${t}-${i}-${l}-${a}${o??``}`,f=this.#S,p=(this.#e.roundedSelection??!0)&&t===`selection`,m=(n,r,i,a)=>{let o=this.#Oe(n)+r*c,l=`width:${s}px;transform:translateX(${i}px) translateY(${o}px);`,u={selectionCorner:``,[a]:``},d=`${t}-block-${i}-${o}-1ch`,p=d+`-`+a;if(a===`rbl`){let t=d+`-rtl`,n=e.elements.get(t);n!==void 0&&(n.remove(),e.elements.delete(t),p+=`-rtl`,u.rtl=``)}let m=e.elements.get(p);m===void 0&&(f?.has(p)===!0?(m=f.get(p),f.delete(p)):m=U(`div`,{dataset:`selectionRange`,style:{cssText:l},children:[U(`div`,{dataset:u})]},e.fragment),e.elements.set(p,m))},h=t=>{let o=i+a,c=t.dataset,l=e.previousSelectionRange;if((l===void 0||l.line!==n||l.wrapLine!==r)&&(e.previousSelectionRange={element:t,line:n,wrapLine:r,left:i,width:a}),l===void 0||o<=l.left)[`rtl`,`rtr`,`rbl`,`rbr`].forEach(e=>{c[e]=``});else{let e=l.line,t=l.wrapLine,a=l.left,u=l.element.dataset,d=a+l.width;a>i&&m(e,t,a-s,`rbr`),delete u.rbl,delete c.rtl,delete c.rtr,o>=d&&delete u.rbr,o>d&&(m(e,t,d,`rbl`),c.rtr=``),o<d&&m(n,r,o,`rtl`),i<a&&(c.rtl=``),c.rbl=``,c.rbr=``}},g=e.elements.get(d);if(g!==void 0){p&&h(g);return}f?.has(d)===!0?(g=f.get(d),f.delete(d)):g=U(`div`,{dataset:o?[t+`Range`,o]:t+`Range`,style:{cssText:u}},e.fragment),p&&h(g),e.elements.set(d,g)}#ue(e,t,n){let{line:r,character:i}=hn(t);if(!this.#Me(r))return;let[a,o]=this.#ke(r,i),s=`caret-`+r+`/`+o+`:`+i;if(e.elements.has(s))return;let c=U(`div`,{dataset:`caret`,style:{transform:`translateX(${a-1}px) translateY(${this.#Oe(r)+o*this.#n.lineHeight}px)`}},e.fragment);e.elements.set(s,c),n&&(c.style.scrollMargin=this.#ie(),this.#C=c)}#de(e,t){let n=hn(t).line;if(!this.#Me(n))return;let[r,i]=this.#ke(n,0),a=`selectionActionIcon-`+n+`(`+i+`)`;if(e.elements.has(a))return;let o=rr.renderIcon(r,this.#Oe(n)+i*this.#n.lineHeight,e.fragment,()=>{let e=()=>{this.#M?.cleanup(),this.#M=void 0},n=()=>{this.#u.clear(),this.#B!==void 0&&this.#oe(this.#B)};e();let r=this.#O,i=this.#e.renderSelectionAction,a=this.#v;if(r===void 0||i===void 0||a==null)return;let o=t.end.line,s=r.getLineText(o),c=i({textDocument:r,selection:t,applyEdits:e=>this.applyEdits(e,!0),getSelectionText:()=>this.#O?.getText(t)??``,replaceSelectionText:e=>{this.#he(e,[t])},close:()=>{e(),n(),this.#re()}}),l=0;for(let e=0;e<s.length;e++){let t=s.charCodeAt(e);if(t===32)l++;else if(t===9)l+=this.#n.tabSize;else break}this.#M=new rr(o,c,a,l,n),this.#oe([t]),this.#Me(o)&&this.#b!==void 0&&this.#M.render(this.#b)});e.elements.set(a,o)}#fe(e){if(this.#j!==void 0){this.#j.setMode(e);return}this.#pe(e)}#pe(e){this.#j?.cleanup();let t=this.#O,n=this.#v?.shadowRoot?.querySelector(`pre`),r=this.#B;if(t===void 0||n==null)return;let i=``,a;if(r!==void 0&&r.length>0){let e=r.at(-1);if(mn(e)){e=On(t,e),this.#oe([...r.slice(0,-1),e]);let n=t.getText(e);n!==``&&!n.includes(`
`)&&(i=n,a=[t.offsetAt(e.start),t.offsetAt(e.end)])}}let o=([e,n],r)=>{let i=vn(t,e,n);this.#oe([i]),this.#re(!0),this.#G=r};this.#j=new nr({textDocument:t,containerElement:n,defaultQuery:i,mode:e,initialMatch:a,scrollToMatch:o,applyReplace:e=>{if(e.length===0)return;let n=t.applyEdits(e.map(e=>({range:{start:t.positionAt(e.start),end:t.positionAt(e.end)},newText:e.text})),!0,this.#B);n!==void 0&&this.#Ce(n,void 0,this.#we(n),{skipSearchRefresh:!0})},onUpdate:(e,n)=>{if(e.length===0){this.#V=void 0,this.#oe(this.#B??[]);return}if(this.#V=e,n?.syncSelection===!1){this.#oe(this.#B??[]);let n=this.#B?.at(-1);if(n!==void 0){let r=t.offsetAt(n.start),i=t.offsetAt(n.end);for(let t of e)if(t[0]===r&&t[1]===i)return t}return}let r=this.#B?.at(-1),i=0,a;r!==void 0&&(i=t.offsetAt(r.start));for(let t of e)if(t[0]>=i){a=t;break}return a===void 0?this.#oe(this.#B??[]):o(a,!0),a},onClose:()=>{this.#j=void 0,this.#G=!1,this.#V=void 0,this.#oe(this.#B??[])}}),this.#G=!1}#me(){let e=this.#O,t=this.#B;return e===void 0||t===void 0?``:En(e,t)}#he(e,t=this.#B){if(t===void 0)return;let n=this.#O,r=t.at(-1);if(n===void 0||r===void 0)return;let{nextSelections:i,change:a}=Array.isArray(e)&&e.length===t.length?ln(n,t,e,this.#D):cn(n,t,{start:n.offsetAt(r.start),end:n.offsetAt(r.end),text:Array.isArray(e)?e.join(`
`):e},this.#D);a!==void 0&&this.#Ce(a,i,this.#we(a))}#ge(e=!1){let t=this.#B,n=this.#O;if(t===void 0||n===void 0)return;let r=t.at(-1);if(r===void 0)return;let i;if(mn(r)){let t=n.offsetAt(r.start),a=e?Math.min(n.getText().length,t+1):Math.max(0,t-1);i={start:Math.min(t,a),end:Math.max(t,a),text:``}}else i={start:n.offsetAt(r.start),end:n.offsetAt(r.end),text:``};this.#xe(i)}#_e(){let e=this.#B,t=this.#O;if(e===void 0||t===void 0)return;let{nextSelections:n,change:r}=fn(t,e,this.#t?(e,t)=>{let n=this.#Ae(e);for(let e=0;e+1<n.length;e++){let r=n[e],i=n[e+1];if(t>=r&&t<=i)return r}return 0}:void 0,this.#D);r!==void 0&&this.#Ce(r,n,this.#we(r))}#ve(){let e=this.#B,t=this.#O;if(e===void 0||t===void 0)return;let{nextSelections:n,change:r}=pn(t,e,this.#D);r!==void 0&&this.#Ce(r,n,this.#we(r))}#ye(){let e=this.#B,t=this.#O;if(e===void 0||t===void 0)return;let{nextSelections:n,change:r}=dn(t,e,this.#D);r!==void 0&&this.#Ce(r,n,this.#we(r))}#be(){let e=this.#B,t=this.#O;if(e===void 0||t===void 0)return;let{nextSelections:n,change:r}=un(t,e,this.#D);r!==void 0&&this.#Ce(r,n,this.#we(r))}#xe(e){if(this.#B===void 0||this.#O===void 0)return;let{nextSelections:t,change:n}=cn(this.#O,this.#B,e,this.#D,this.#n.tabSize);n!==void 0&&this.#Ce(n,t,this.#we(n))}#Se(){let e=this.#E,t=this.#O;if(e===void 0||t===void 0)return;let{contents:n,...r}=e;return Object.defineProperty(r,"contents",{enumerable:!0,get:()=>t.getText()}),r}#Ce(e,t,n,r){let i=this.#Se(),a=this.#e.onChange;if(i!==void 0&&a!==void 0&&a(i,n??this.#D),e.lineDelta!==0)for(let t of this.#u.keys())t>=e.startLine&&this.#u.delete(t);if(this.#t)for(let t of this.#d.keys())t>=e.startLine&&this.#d.delete(t);this.#p=void 0;let o=this.#k,s;if(o!==void 0&&t!==void 0&&t.length>0){let e=t.at(-1),n=o.startingLine+o.totalLines;e.end.line===n?o={...o,totalLines:o.totalLines+1}:e.end.line>n&&(s=!0)}if(this.#$(e,n,o,s),r?.skipSearchRefresh!==!0&&this.#j!==void 0&&this.#V!==void 0&&this.#j.updateMatches({syncSelection:!1}),t!==void 0){if(this.#oe(t),this.#C!==void 0)this.#C.scrollIntoView({block:`nearest`,inline:`nearest`});else if(t.length>0){let e=hn(t.at(-1));this.#ae(e.line,e.character)}this.focus({preventScroll:!0})}}#we(e){if(this.#D!==void 0){let t=Xt(e,this.#D);if(t!==void 0)return this.#O?.setLastUndoLineAnnotations(this.#D,t),t}}#Te(e){let t=this.#f;if(t!==void 0&&t[0]===e)return t[1];let n=this.#b;if(n===void 0)return;let r=null;if(this.#k!==void 0){let{startingLine:t}=this.#k,{children:i}=n;for(let n=e-t;n<=i.length;n++){let t=i[n];if(t===void 0)break;let a=Gt(t),o=t.dataset.lineType;if(a!==void 0&&a===e+1&&o!==void 0&&gn(o)){r=t;break}}}if(r??=n.querySelector(`[data-line="${e+1}"]`),r!==null)return t===void 0?this.#f=[e,r]:(t[0]=e,t[1]=r),r}#Ee(){if(this.#y===void 0)return 0;if(this.#c===void 0){let e=this.#b?.parentElement?.style.getPropertyValue(`--diffs-column-number-width`);e!==void 0&&e.length>2&&e.endsWith(`px`)?this.#c=parseInt(e.slice(0,-2),10):this.#c=this.#y.offsetWidth}return this.#c}#De(){if(this.#b===void 0)return 0;if(this.#l===void 0){let e=this.#b.parentElement?.style.getPropertyValue(`--diffs-column-content-width`);e!==void 0&&e.length>2&&e.endsWith(`px`)?this.#l=parseFloat(e.slice(0,-2)):this.#l=this.#b.offsetWidth}return this.#l}#Oe(e){let t=this.#u.get(e);if(t!==void 0)return t;let n=this.#Te(e);if(n===void 0)return-1;let r=n.offsetTop+this.#n.paddingTop;return this.#u.set(e,r),r}#ke(e,t){if(this.#p!==void 0&&this.#p[0]===e&&this.#p[1]===t)return[this.#p[2],this.#p[3]];let n=this.#O?.getLineText(e),r=this.#Ee()+this.#n.ch;if(n===void 0||n.length===0||t<=0)return[r,0];let i=or(n,Math.min(t,n.length)),a=n.slice(0,i),o=cr(a,this.#n.tabSize),s=0,c=0;if(s=o===-1?r+this.#n.measureTextWidth(a):r+o*this.#n.ch,this.#t){let t=this.#De();if(2*this.#n.ch+this.#n.measureTextWidth(n)>t){let t=this.#Ae(e);for(let e=0;e+1<t.length;e++){let a=t[e];if(i<=t[e+1]){c=e;let t=n.slice(a,i),o=cr(t,this.#n.tabSize);s=o===-1?r+this.#n.measureTextWidth(t):r+o*this.#n.ch;break}}}}return this.#p===void 0?this.#p=[e,t,s,c]:(this.#p[0]=e,this.#p[1]=t,this.#p[2]=s,this.#p[3]=c),[s,c]}#Ae(e){let t=this.#d.get(e);if(t!==void 0)return t;let n=this.#O?.getLineText(e);if(n===void 0||n.length===0){let t=new Uint32Array([0]);return this.#d.set(e,t),t}let r=U(`div`,{style:{position:`absolute`,top:`0`,left:`0`,width:`100%`,boxSizing:`border-box`,visibility:`hidden`,pointerEvents:`none`,whiteSpace:`pre-wrap`,wordBreak:`break-word`,font:`inherit`,paddingInline:`1ch`,tabSize:this.#n.tabSize.toString()},textContent:n},this.#b),i=r.firstChild,a=document.createRange(),o=[];try{let t=sr(n),s=r.getBoundingClientRect().left+this.#n.ch,c=0,l=-1/0;for(let e=0,r=0;e<n.length;){let n=t===void 0?e+1:t[r+1];a.setStart(i,e),a.setEnd(i,n);let{left:u,top:d}=a.getBoundingClientRect();if(d>l){let t=Rt()&&o.length>0&&u-s>this.#n.ch/2;o.push(t?c:e),l=d}c=e,e=n,r++}let u=new Uint32Array(o.length+1);for(let e=0;e<o.length;e++)u[e]=o[e];return u[o.length]=n.length,this.#d.set(e,u),u}finally{r.remove()}}#je({startContainer:e,endContainer:t}){let n=this.#b;return n===void 0?!1:n.contains(e)&&n.contains(t)}#Me(e){let t=this.#O?.lineCount??0;if(e<0||e>=t)return!1;if(this.#k===void 0)return!0;let{startingLine:n,totalLines:r}=this.#k;return e<n?!1:r===1/0?!0:e<n+r}},mr=`file-tree-container`,hr=`data-file-tree-style`,gr=`data-file-tree-unsafe-css`,_r=`data-file-tree-scrollbar-measure`,vr=`data-file-tree-scrollbar-gutter-measured`,yr=`--trees-scrollbar-gutter-measured`,br=`header`,xr=`context-menu`,Sr=`context-menu-trigger`,Cr=5,wr=1<<Cr,Tr=wr*4;function Er(){return{childIdByNameId:new Map,childIds:[],childPositionById:new Map,childVisibleChunkSums:null,totalChildSubtreeNodeCount:0,totalChildVisibleSubtreeCount:0}}function Dr(){return{childIdByNameId:null,childIds:[],childPositionById:null,childVisibleChunkSums:null,totalChildSubtreeNodeCount:0,totalChildVisibleSubtreeCount:0}}function Or(e,t){if(t.childIdByNameId!=null)return t.childIdByNameId;let n=new Map;for(let r of t.childIds){let t=e[r];t!=null&&n.set(t.nameId,r)}return t.childIdByNameId=n,n}function kr(e){if(e.childPositionById!=null)return e.childPositionById;let t=new Map;for(let n=0;n<e.childIds.length;n++){let r=e.childIds[n];r!=null&&t.set(r,n)}return e.childPositionById=t,t}function Ar(e,t){e.childPositionById!=null&&e.childPositionById.set(t,e.childIds.length),e.childIds.push(t)}function jr(e,t){if(e.childPositionById!=null)for(let n=t;n<e.childIds.length;n++){let t=e.childIds[n];t!=null&&e.childPositionById.set(t,n)}}function Mr(e,t){let n=0,r=0;for(let i of t.childIds){let t=e[i];t!=null&&(n+=t.subtreeNodeCount,r+=t.visibleSubtreeCount)}t.totalChildSubtreeNodeCount=n,t.totalChildVisibleSubtreeCount=r,Ir(e,t)}function Nr(e,t,n,r){if(e.totalChildSubtreeNodeCount+=n,e.totalChildVisibleSubtreeCount+=r,e.childVisibleChunkSums==null||r===0)return;let i=kr(e).get(t);if(i===void 0)return;let a=i>>Cr;e.childVisibleChunkSums[a]+=r}function Pr(e,t,n){let r=t.childVisibleChunkSums;if(r!=null){let i=n,a=0;for(let o of r){if(i<o){let r=Lr(e,t,a,i);return{...r,childVisibleIndex:n-r.localVisibleIndex}}i-=o,a+=wr}throw Error(`Visible child index ${String(n)} is out of range`)}let i=n;for(let r=0;r<t.childIds.length;r++){let a=t.childIds[r];if(a==null)continue;let o=e[a];if(o!=null){if(i<o.visibleSubtreeCount)return{childIndex:r,childVisibleIndex:n-i,localVisibleIndex:i};i-=o.visibleSubtreeCount}}throw Error(`Visible child index ${String(n)} is out of range`)}function Fr(e,t,n){let r=0,i=t.childVisibleChunkSums,a=0;if(i!=null){let e=n>>Cr;for(let t=0;t<e;t+=1)r+=i[t]??0;a=e<<Cr}for(let i=a;i<n;i+=1){let n=t.childIds[i];if(n==null)continue;let a=e[n];a!=null&&(r+=a.visibleSubtreeCount)}return r}function Ir(e,t){if(t.childIds.length<Tr){t.childVisibleChunkSums=null;return}let n=Math.ceil(t.childIds.length/wr),r=new Int32Array(n);for(let n=0;n<t.childIds.length;n++){let i=t.childIds[n];if(i==null)continue;let a=e[i];a!=null&&(r[n>>Cr]+=a.visibleSubtreeCount)}t.childVisibleChunkSums=r}function Lr(e,t,n,r){let i=Math.min(t.childIds.length,n+wr),a=r;for(let r=n;r<i;r++){let n=t.childIds[r];if(n==null)continue;let i=e[n];if(i!=null){if(a<i.visibleSubtreeCount)return{childIndex:r,localVisibleIndex:a};a-=i.visibleSubtreeCount}}throw Error(`Visible child index ${String(r)} is out of range`)}var Rr=7,zr=3,Br=1<<zr,Vr=4;function Hr(e,t,n=0){return e<<Vr|n<<zr|t}function Ur(e){return e.depthAndFlags>>>Vr}function Wr(e){return(e.depthAndFlags&Br)>>zr}function K(e){return(e.depthAndFlags&Br)!==0}function Gr(e){return e.depthAndFlags&Rr}function Kr(e,t){return(Gr(e)&t)!==0}function qr(e,t){e.depthAndFlags|=t}function Jr(e,t){e.depthAndFlags=Hr(t,Gr(e),Wr(e))}var Yr=Symbol(`benchmarkInstrumentation`);function Xr(e,t){return t==null||Object.defineProperty(e,Yr,{configurable:!0,enumerable:!1,value:t,writable:!1}),e}function Zr(e){return e==null?null:e[Yr]??null}function q(e,t,n){return e==null?n():e.measurePhase(t,n)}function Qr(e,t,n){!Number.isFinite(n)||e==null||e.setCounter(t,n)}function $r(e){return e>=48&&e<=57}function ei(e){let t=[],n=0,r=0;for(;r<e.length;){for(;r<e.length&&!$r(e.charCodeAt(r));)r+=1;if(r>=e.length)break;r>n&&t.push(e.slice(n,r));let i=0;for(;r<e.length&&$r(e.charCodeAt(r));)i=i*10+(e.charCodeAt(r)-48),r+=1;t.push(i),n=r}return(n<e.length||t.length===0)&&t.push(e.slice(n)),t}function ti(e){let t=e.toLowerCase();return{lowerValue:t,tokens:ei(t)}}function ni(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=e[r],i=t[r];if(n===i)continue;if(typeof n==`number`&&typeof i==`number`)return n<i?-1:1;let a=String(n),o=String(i);if(a!==o)return a<o?-1:1}return e.length===t.length?0:e.length<t.length?-1:1}function ri(e,t){if(e.tokens.length===1&&t.tokens.length===1&&typeof e.tokens[0]==`string`&&typeof t.tokens[0]==`string`)return e.lowerValue===t.lowerValue?0:e.lowerValue<t.lowerValue?-1:1;let n=ni(e.tokens,t.tokens);return n===0?e.lowerValue===t.lowerValue?0:e.lowerValue<t.lowerValue?-1:1:n}function ii(e,t,n){let r=ri(n(e),n(t));return r===0?e===t?0:e<t?-1:1:r}function ai(e,t){return ii(e,t,ti)}function oi(e,t){return t===e.segments.length-1?+!!e.isDirectory:1}function si(e,t){let n=Math.min(e.segments.length,t.segments.length);for(let r=0;r<n;r++){let n=e.segments[r],i=t.segments[r];if(n===i)continue;let a=oi(e,r);return a===oi(t,r)?ai(n,i):a===1?-1:1}return e.segments.length===t.segments.length?e.isDirectory===t.isDirectory?0:e.isDirectory?-1:1:e.segments.length<t.segments.length?-1:1}function ci(e,t){return si(e,t)}function li(e,t,n){let r=e=>{let t=n.get(e);if(t!=null)return t;let r=ti(e);return n.set(e,r),r},i=Math.min(e.segments.length,t.segments.length);for(let n=0;n<i;n++){let i=e.segments[n],a=t.segments[n];if(i===a)continue;let o=oi(e,n);return o===oi(t,n)?ii(i,a,r):o===1?-1:1}return e.segments.length===t.segments.length?e.isDirectory===t.isDirectory?0:e.isDirectory?-1:1:e.segments.length<t.segments.length?-1:1}function ui(e,t){let n=e.sortKeyById[t];if(n!==void 0)return n;let r=e.valueById[t],i=ti(r);return e.sortKeyById[t]=i,i}function di(e={}){return{flattenEmptyDirectories:e.flattenEmptyDirectories!==!1,sort:e.sort??`default`}}function fi(e){let t=e.length>0&&e.charCodeAt(e.length-1)===47,n=t?e.length-1:e.length,r=[],i=0;for(let t=0;t<n;t++)e.charCodeAt(t)===47&&(r.push(e.slice(i,t)),i=t+1);return r.push(e.slice(i,n)),{hasTrailingSlash:t,segments:r}}function pi(e){let{hasTrailingSlash:t,segments:n}=fi(e);return{basename:n[n.length-1]??``,isDirectory:t,path:e,segments:n}}function mi(e){if(e.length===0)return{requiresDirectory:!1,segments:[]};let{hasTrailingSlash:t,segments:n}=fi(e);return{requiresDirectory:t,segments:n}}var hi=``;function gi(){let e=new Map;return e.set(hi,0),{idByValue:e,valueById:[hi],sortKeyById:[ti(hi)]}}function _i(e,t){let n=e.idByValue.get(t);if(n!==void 0)return n;let r=e.valueById.length;return e.idByValue.set(t,r),e.valueById.push(t),r}function vi(e,t){let n=e.valueById[t];if(n===void 0)throw Error(`Unknown segment ID: ${String(t)}`);return n}var yi=Symbol(`pathStorePreparedInputKind`);function bi(e,t){return e[yi]=t,e}function xi(e){return{basename:e.basename,depth:e.segments.length,isDirectory:e.isDirectory,path:e.path,segments:e.segments}}function Si(e,t,n){return n==="default"?ci(e,t):n(xi(e),xi(t))}function Ci(){return{depthAndFlags:Hr(0,3,1),nameId:0,parentId:0,subtreeNodeCount:1,visibleSubtreeCount:1}}function wi(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++)if(e[r]!==t[r])return r;return n}function Ti(e){return e.isDirectory?e.segments.length:e.segments.length-1}function Ei(e){return Array.isArray(e)&&e.every(e=>typeof e==`object`&&!!e&&typeof e.path==`string`&&Array.isArray(e.segments)&&typeof e.basename==`string`&&typeof e.isDirectory==`boolean`)}function Di(e){return Array.isArray(e)&&e.every(e=>typeof e==`string`)}function Oi(e,t={}){return Pi(e,t).map(e=>e.path)}function ki(e,t={}){let n=Pi(e,t);return bi({paths:n.map(e=>e.path),preparedPaths:n},`prepared`)}function Ai(e){let t=e.length,n=!1;for(let r=0;r<t;r+=1){let t=e[r];if(t.length>0&&t.charCodeAt(t.length-1)===47){n=!0;break}}return bi({paths:e,presortedPaths:e,presortedPathsContainDirectories:n},`presorted`)}function ji(e){let t=e,n=t.preparedPaths;if(t[yi]===`prepared`&&n!=null)return n;if(!Ei(n))throw Error(`preparedInput must come from PathStore.prepareInput()`);return n}function Mi(e){let t=e;return t[yi]===`presorted`&&t.presortedPaths!=null||Di(t.presortedPaths)?t.presortedPaths:null}function Ni(e){let t=e;return typeof t.presortedPathsContainDirectories==`boolean`?t.presortedPathsContainDirectories:null}function Pi(e,t={}){let n=di(t),r=Zr(t);Qr(r,`workload.inputFiles`,e.length);let i=q(r,`store.preparePathEntries.parse`,()=>e.map(e=>pi(e)));return q(r,`store.preparePathEntries.sort`,()=>i.sort((e,t)=>Si(e,t,n.sort))),i}var Fi=class{directories=new Map;directoryStack=[0];presortedDirectoryNodeIds=[];initialExpandedPathSet;createdDirectoriesAllExpanded=!1;createdDirectoryCount=0;lastPreparedPath=null;nodes=[Ci()];options;instrumentation;segmentSortKeyCache=new Map;segmentTable=gi();hasDeferredDirectoryIndexes=!1;constructor(e={}){this.instrumentation=Zr(e),this.options=di(e);let t=e.initialExpandedPaths??null;if(t==null||t.length===0)this.initialExpandedPathSet=null;else{let e=new Set,n=t.length;for(let r=0;r<n;r+=1){let n=t[r],i=n.length;e.add(i>0&&n.charCodeAt(i-1)===47?n.slice(0,i-1):n)}this.initialExpandedPathSet=e,this.createdDirectoriesAllExpanded=!0}this.directories.set(0,Er())}appendPaths(e){return q(this.instrumentation,`store.builder.appendPaths.parse`,()=>this.appendPreparedPaths(e.map(e=>pi(e))))}appendPreparedPaths(e,t=!0){return this.createdDirectoriesAllExpanded=!1,q(this.instrumentation,`store.builder.appendPreparedPaths`,()=>{for(let n of e)this.appendPreparedPath(n,t)}),this}appendPresortedPaths(e,t=null){return q(this.instrumentation,`store.builder.appendPresortedPaths`,()=>{if(t===!1){this.appendPresortedFilePaths(e);return}this.createdDirectoriesAllExpanded=!1;let n=null,r=0,i=this.nodes,a=this.segmentTable,o=a.idByValue,s=a.valueById,c=this.directoryStack,l=0,u=``,d=0;for(let t of e){if(n===t)throw Error(`Duplicate path: "${t}"`);let e=t.length>0&&t.charCodeAt(t.length-1)===47,a=e?t.length-1:t.length,f=0,p=0;if(n!=null)if(u.length>0&&t.length>u.length&&t.startsWith(u))f=d,p=u.length;else{let r=Math.min(a,n.length),i=!0;for(let e=0;e<r;e++){let r=t.charCodeAt(e);if(r!==n.charCodeAt(e)){i=!1;break}r===47&&(f++,p=e+1)}i&&e&&r===a&&n.length>a&&n.charCodeAt(a)===47&&(f++,p=a+1)}l=f,r=f;let m=p,h=t.indexOf(`/`,m);for(;h>=0&&h<a;){let e=c[l];if(e===void 0)throw Error(`Directory stack underflow while building the path store`);r++;let n=t.slice(m,h),a=o.get(n);a===void 0&&(a=s.length,o.set(n,a),s.push(n));let u=i.length;i.push({depthAndFlags:Hr(r,0,1),nameId:a,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),this.recordCreatedDirectoryPath(t.slice(0,h)),l++,c[l]=u,m=h+1,h=t.indexOf(`/`,m)}if(e){if(m<a){let e=c[l];if(e===void 0)throw Error(`Unable to resolve directory parent for "${t}"`);r++;let n=t.slice(m,a),u=o.get(n);u===void 0&&(u=s.length,o.set(n,u),s.push(n));let d=i.length;i.push({depthAndFlags:Hr(r,0,1),nameId:u,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),l++,c[l]=d}let e=c[l];if(e===void 0)throw Error(`Unable to resolve directory node for "${t}"`);this.promoteDirectoryToExplicit(e,t)}else{let e=c[l];if(e===void 0)throw Error(`Unable to resolve file parent for "${t}"`);let n=t.slice(m),a=o.get(n);a===void 0&&(a=s.length,o.set(n,a),s.push(n)),i.push({depthAndFlags:Hr(r+1,0),nameId:a,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1})}m!==u.length&&(u=t.substring(0,m),d=r),n=t}c.length=l+1,n!=null&&(this.lastPreparedPath=pi(n)),this.hasDeferredDirectoryIndexes=!0}),this}appendPresortedFilePaths(e){let t=null,n=0,r=this.nodes,i=this.segmentTable,a=i.idByValue,o=i.valueById,s=this.directoryStack,c=0,l=``,u=0;for(let i of e){if(t===i)throw Error(`Duplicate path: "${i}"`);let e=i.length,d=0,f=0;if(t!=null)if(l.length>0&&i.length>l.length&&i.startsWith(l))d=u,f=l.length;else{let n=Math.min(e,t.length);for(let e=0;e<n;e++){let n=i.charCodeAt(e);if(n!==t.charCodeAt(e))break;n===47&&(d++,f=e+1)}}c=d,n=d;let p=f,m=i.indexOf(`/`,p);for(;m>=0;){let e=s[c];if(e===void 0)throw Error(`Directory stack underflow while building the path store`);n++;let t=i.slice(p,m),l=a.get(t);l===void 0&&(l=o.length,a.set(t,l),o.push(t));let u=r.length;r.push({depthAndFlags:Hr(n,0,1),nameId:l,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),this.recordCreatedDirectoryPath(i.slice(0,m)),this.presortedDirectoryNodeIds.push(u),c++,s[c]=u,p=m+1,m=i.indexOf(`/`,p)}let h=s[c];if(h===void 0)throw Error(`Unable to resolve file parent for "${i}"`);let g=i.slice(p),_=a.get(g);_===void 0&&(_=o.length,a.set(g,_),o.push(g)),r.push({depthAndFlags:Hr(n+1,0),nameId:_,parentId:h,subtreeNodeCount:1,visibleSubtreeCount:1}),p!==l.length&&(l=i.substring(0,p),u=n),t=i}s.length=c+1,t!=null&&(this.lastPreparedPath=pi(t)),this.hasDeferredDirectoryIndexes=!0}finish(e={}){let t=e.skipSubtreeCountPass===!0;return this.hasDeferredDirectoryIndexes?(q(this.instrumentation,`store.builder.buildDirectoryIndexes`,()=>this.buildPresortedFinish(t)),this.hasDeferredDirectoryIndexes=!1):t||q(this.instrumentation,`store.builder.computeSubtreeCounts`,()=>this.computeSubtreeCounts(0)),{directories:this.directories,nodes:this.nodes,options:this.options,rootId:0,segmentTable:this.segmentTable,presortedDirectoryNodeIds:this.presortedDirectoryNodeIds.length>0?this.presortedDirectoryNodeIds:null}}didMatchAllInitialExpandedPaths(){return this.createdDirectoriesAllExpanded&&this.initialExpandedPathSet!=null&&this.createdDirectoryCount===this.initialExpandedPathSet.size}appendPreparedPath(e,t){if(this.hasDeferredDirectoryIndexes&&=(this.buildDirectoryIndexes(),!1),this.lastPreparedPath!=null){if(e.path===this.lastPreparedPath.path)throw Error(`Duplicate path: "${e.path}"`);if(t&&(this.options.sort==="default"?li(this.lastPreparedPath,e,this.segmentSortKeyCache):Si(this.lastPreparedPath,e,this.options.sort))>0)throw Error(`Builder input must be sorted before appendPaths(): "${e.path}"`)}let n=this.lastPreparedPath,r=Ti(e),i=n==null?0:Ti(n),a=n==null?0:wi(n.segments,e.segments),o=Math.min(a,r,i);this.directoryStack.length=o+1;for(let n=o;n<r;n++){let r=this.directoryStack[this.directoryStack.length-1];if(r===void 0)throw Error(`Directory stack underflow while building the path store`);let i=t?this.getOrCreateDirectoryChild(r,e.segments[n]):this.createDirectoryChild(r,e.segments[n]);this.directoryStack.push(i)}if(e.isDirectory){let t=this.directoryStack[this.directoryStack.length-1];if(t===void 0)throw Error(`Unable to resolve directory node for "${e.path}"`);this.promoteDirectoryToExplicit(t,e.path),this.lastPreparedPath=e;return}let s=this.directoryStack[this.directoryStack.length-1];if(s===void 0)throw Error(`Unable to resolve file parent for "${e.path}"`);t?this.createFileChild(s,e.basename,e.path):this.createFileChildUnchecked(s,e.basename),this.lastPreparedPath=e}recordCreatedDirectoryPath(e){!this.createdDirectoriesAllExpanded||this.initialExpandedPathSet==null||(this.createdDirectoryCount+=1,this.initialExpandedPathSet.has(e)||(this.createdDirectoriesAllExpanded=!1))}createFileChild(e,t,n){let r=_i(this.segmentTable,t),i=this.getDirectoryIndex(e),a=i.childIdByNameId;if(a!=null&&a.get(r)!==void 0)throw Error(`Path collides with an existing entry: "${n}"`);let o=this.nodes[e];if(o===void 0)throw Error(`Unknown parent node ID: ${String(e)}`);let s=this.nodes.length;return this.nodes.push({depthAndFlags:Hr(Ur(o)+1,0),nameId:r,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),a?.set(r,s),Ar(i,s),s}createFileChildUnchecked(e,t){let n=_i(this.segmentTable,t),r=this.getDirectoryIndex(e),i=this.nodes[e];if(i===void 0)throw Error(`Unknown parent node ID: ${String(e)}`);let a=this.nodes.length;return this.nodes.push({depthAndFlags:Hr(Ur(i)+1,0),nameId:n,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),r.childIdByNameId!=null&&r.childIdByNameId.set(n,a),Ar(r,a),a}getOrCreateDirectoryChild(e,t){let n=_i(this.segmentTable,t),r=this.getDirectoryIndex(e);if(r.childIdByNameId!=null){let e=r.childIdByNameId.get(n);if(e!==void 0){let n=this.nodes[e];if(n!=null&&!K(n))throw Error(`Path collides with an existing file while creating directory "${t}"`);return e}}let i=this.nodes[e];if(i===void 0)throw Error(`Unknown parent node ID: ${String(e)}`);let a=this.nodes.length;return this.nodes.push({depthAndFlags:Hr(Ur(i)+1,0,1),nameId:n,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),r.childIdByNameId!=null&&r.childIdByNameId.set(n,a),Ar(r,a),this.directories.set(a,Er()),a}createDirectoryChild(e,t){let n=_i(this.segmentTable,t),r=this.getDirectoryIndex(e),i=this.nodes[e];if(i===void 0)throw Error(`Unknown parent node ID: ${String(e)}`);let a=this.nodes.length;return this.nodes.push({depthAndFlags:Hr(Ur(i)+1,0,1),nameId:n,parentId:e,subtreeNodeCount:1,visibleSubtreeCount:1}),r.childIdByNameId!=null&&r.childIdByNameId.set(n,a),Ar(r,a),this.directories.set(a,Er()),a}promoteDirectoryToExplicit(e,t){let n=this.nodes[e];if(n===void 0)throw Error(`Unknown directory node ID: ${String(e)}`);if(!K(n))throw Error(`Path is not a directory: "${t}"`);if(Kr(n,1))throw Error(`Duplicate path: "${t}"`);qr(n,1)}getDirectoryIndex(e){let t=this.directories.get(e);if(t!==void 0)return t;throw Error(`Unknown directory child index for node ${String(e)}`)}buildPresortedFinish(e){let t=this.nodes,n=this.directories;n.set(0,Dr());let r=-1,i=null;for(let e=1;e<t.length;e++){let a=t[e];if(a==null)continue;if(K(a)){let t=Dr();n.set(e,t),r=e,i=t}let o;a.parentId===r?o=i:(o=n.get(a.parentId),r=a.parentId,i=o??null),o?.childIds.push(e)}if(!e)for(let e=t.length-1;e>=1;e--){let n=t[e];if(n==null)continue;let r=t[n.parentId];r!=null&&(r.subtreeNodeCount+=n.subtreeNodeCount,r.visibleSubtreeCount+=n.visibleSubtreeCount)}}buildDirectoryIndexes(){let e=this.nodes;for(let t=1;t<e.length;t++){let n=e[t];if(n==null)continue;K(n)&&this.directories.set(t,Er());let r=this.directories.get(n.parentId);r!=null&&(r.childIdByNameId!=null&&r.childIdByNameId.set(n.nameId,t),Ar(r,t))}}computeSubtreeCounts(e){let t=this.nodes[e];if(t===void 0)throw Error(`Unknown node ID: ${String(e)}`);if(!K(t))return t.subtreeNodeCount=1,t.visibleSubtreeCount=1,1;let n=this.getDirectoryIndex(e),r=1;for(let e of n.childIds)r+=this.computeSubtreeCounts(e);return Mr(this.nodes,n),t.subtreeNodeCount=r,t.visibleSubtreeCount=r,r}};function Ii(e,t=`closed`,n=null){let r=Ri(t);return{activeNodeCount:e.nodes.length-1,collapsedDirectoryIds:new Set,collapseNewDirectoriesByDefault:!1,defaultExpansion:r,directoriesOpenByDefault:r===`open`,hasCollapsedDirectoryOverrides:!1,directoryLoadInfoById:new Map,expandedDirectoryIds:new Set,instrumentation:n,listeners:new Map,pathCacheByNodeId:new Map([[e.rootId,{path:``,version:0}]]),pathCacheVersion:0,snapshot:e,transactionStack:[]}}function Li(){return{affectedAncestorIds:new Set,affectedNodeIds:new Set,events:[]}}function Ri(e){if(typeof e!=`number`)return e;if(!Number.isInteger(e)||e<0)throw Error(`initialExpansion must be "open", "closed", or a non-negative integer depth. Received: ${String(e)}`);return e}function zi(e,t){return Kr(t,2)||e.defaultExpansion===`open`?!0:e.defaultExpansion===`closed`?!1:Ur(t)<=e.defaultExpansion}function Bi(e,t,n=e.snapshot.nodes[t]){return n==null||!K(n)?!1:e.directoriesOpenByDefault&&!e.hasCollapsedDirectoryOverrides?!0:e.collapsedDirectoryIds.has(t)?!1:e.expandedDirectoryIds.has(t)?!0:zi(e,n)}function Vi(e,t,n,r=e.snapshot.nodes[t]){if(r==null||!K(r))return;let i=zi(e,r);if(n){if(i){e.collapsedDirectoryIds.delete(t),e.hasCollapsedDirectoryOverrides=e.collapsedDirectoryIds.size>0;return}e.expandedDirectoryIds.add(t);return}if(i){e.collapsedDirectoryIds.add(t),e.hasCollapsedDirectoryOverrides=!0;return}e.expandedDirectoryIds.delete(t)}function Hi(e,t){let n=e.directoryLoadInfoById.get(t);if(n!=null)return n;let r={activeAttemptId:null,errorMessage:null,nextAttemptId:1,state:`loaded`};return e.directoryLoadInfoById.set(t,r),r}function Ui(e,t){return e.directoryLoadInfoById.get(t)?.state??`loaded`}function Wi(e,t){let n=Hi(e,t);if(n.state===`loading`&&n.activeAttemptId!=null)return{attemptId:n.activeAttemptId,nodeId:t,reused:!0};let r=n.nextAttemptId;return n.activeAttemptId=r,n.errorMessage=null,n.nextAttemptId+=1,n.state=`loading`,{attemptId:r,nodeId:t,reused:!1}}function Gi(e,t){let n=Hi(e,t);n.activeAttemptId=null,n.errorMessage=null,n.state=`unloaded`}function Ki(e,t,n){let r=e.directoryLoadInfoById.get(t);return r==null||r.activeAttemptId!==n?!1:(r.activeAttemptId=null,r.errorMessage=null,r.state=`loaded`,!0)}function qi(e,t,n){return e.directoryLoadInfoById.get(t)?.activeAttemptId===n}function Ji(e,t,n,r){let i=e.directoryLoadInfoById.get(t);return i==null||i.activeAttemptId!==n?!1:(i.activeAttemptId=null,i.errorMessage=r??null,i.state=`error`,!0)}function Yi(e,t){e.directoryLoadInfoById.delete(t)}function Xi(e,t,n){let r=n,i=e.listeners.get(t);return i==null?e.listeners.set(t,new Set([r])):i.add(r),()=>{let n=e.listeners.get(t);n!=null&&(n.delete(r),n.size===0&&e.listeners.delete(t))}}function Zi(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],canonicalChanged:!0,operation:`add`,path:e.path,projectionChanged:e.projectionChanged,visibleCountDelta:null}}function Qi(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],canonicalChanged:!0,operation:`remove`,path:e.path,projectionChanged:e.projectionChanged,recursive:e.recursive,visibleCountDelta:null}}function $i(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],canonicalChanged:!0,from:e.from,operation:`move`,projectionChanged:e.projectionChanged,to:e.to,visibleCountDelta:null}}function ea(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],canonicalChanged:!1,operation:`expand`,path:e.path,projectionChanged:!0,visibleCountDelta:null}}function ta(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],canonicalChanged:!1,operation:`collapse`,path:e.path,projectionChanged:!0,visibleCountDelta:null}}function na(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],canonicalChanged:!1,operation:`mark-directory-unloaded`,path:e.path,projectionChanged:e.projectionChanged,visibleCountDelta:null}}function ra(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],attemptId:e.attemptId,canonicalChanged:!1,operation:`begin-child-load`,path:e.path,projectionChanged:e.projectionChanged,reused:e.reused,visibleCountDelta:null}}function ia(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],attemptId:e.attemptId,canonicalChanged:e.childEvents.some(e=>e.canonicalChanged),childEvents:e.childEvents,operation:`apply-child-patch`,path:e.path,projectionChanged:e.projectionChanged,visibleCountDelta:null}}function aa(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],attemptId:e.attemptId,canonicalChanged:!1,operation:`complete-child-load`,path:e.path,projectionChanged:e.projectionChanged,stale:e.stale,visibleCountDelta:null}}function oa(e){return{affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],attemptId:e.attemptId,canonicalChanged:!1,errorMessage:e.errorMessage,operation:`fail-child-load`,path:e.path,projectionChanged:e.projectionChanged,stale:e.stale,visibleCountDelta:null}}function sa(e){return{activeNodeCountAfter:e.activeNodeCountAfter,activeNodeCountBefore:e.activeNodeCountBefore,affectedAncestorIds:e.affectedAncestorIds??[],affectedNodeIds:e.affectedNodeIds??[],cachedPathEntryCountAfter:e.cachedPathEntryCountAfter,cachedPathEntryCountBefore:e.cachedPathEntryCountBefore,canonicalChanged:!1,idsPreserved:e.idsPreserved,loadInfoEntryCountAfter:e.loadInfoEntryCountAfter,loadInfoEntryCountBefore:e.loadInfoEntryCountBefore,mode:e.mode,operation:`cleanup`,projectionChanged:e.projectionChanged,reclaimedCachedPathEntryCount:e.reclaimedCachedPathEntryCount,reclaimedLoadInfoEntryCount:e.reclaimedLoadInfoEntryCount,reclaimedNodeSlotCount:e.reclaimedNodeSlotCount,reclaimedSegmentCount:e.reclaimedSegmentCount,segmentCountAfter:e.segmentCountAfter,segmentCountBefore:e.segmentCountBefore,totalNodeSlotCountAfter:e.totalNodeSlotCountAfter,totalNodeSlotCountBefore:e.totalNodeSlotCountBefore,visibleCountDelta:null}}function ca(e,t,n){return{...n,visibleCountDelta:ya(e)-t}}function la(e,t){let n=ya(e),r=Li();e.transactionStack.push(r);try{t()}catch(t){throw fa(e,r,!1),t}fa(e,r,!0,ya(e)-n)}function ua(e,t){let n=e.instrumentation;if(n==null){da(e,t);return}q(n,`store.events.record`,()=>da(e,t))}function da(e,t){let n=e.transactionStack[e.transactionStack.length-1]??null;if(n==null){_a(e,t);return}n.events.push(t),ga(n,t)}function fa(e,t,n,r=null){if(e.transactionStack.pop()!==t)throw Error(`Transaction stack underflow`);if(!n)return;let i=e.transactionStack[e.transactionStack.length-1]??null;if(i!=null){let n=e.instrumentation;n==null?ha(i,t):q(n,`store.events.batch.merge`,()=>ha(i,t));return}let a=pa(t,r),o=e.instrumentation;if(o==null){_a(e,a);return}q(o,`store.events.batch.commit`,()=>_a(e,a))}function pa(e,t){return{affectedAncestorIds:[...e.affectedAncestorIds],affectedNodeIds:[...e.affectedNodeIds],canonicalChanged:e.events.some(e=>e.canonicalChanged),events:[...e.events],operation:`batch`,projectionChanged:e.events.some(e=>e.projectionChanged),visibleCountDelta:t}}function ma(e,t){for(let n of t.affectedAncestorIds)e.affectedAncestorIds.add(n);for(let n of t.affectedNodeIds)e.affectedNodeIds.add(n)}function ha(e,t){for(let n of t.events)e.events.push(n);ma(e,t)}function ga(e,t){for(let n of t.affectedNodeIds)e.affectedNodeIds.add(n);for(let n of t.affectedAncestorIds)e.affectedAncestorIds.add(n)}function _a(e,t){let n=e.instrumentation;if(n==null){va(e,t);return}q(n,`store.events.emit`,()=>va(e,t))}function va(e,t){e.listeners.get(t.operation)?.forEach(e=>e(t)),e.listeners.get(`*`)?.forEach(e=>e(t))}function ya(e){return e.snapshot.nodes[e.snapshot.rootId]?.visibleSubtreeCount??0}function ba(e,t){if(e.snapshot.options.flattenEmptyDirectories!==!0)return null;let n=e.snapshot.nodes[t];if(n==null||!K(n)||Kr(n,2))return null;let r=e.snapshot.directories.get(t);if(r==null||r.childIds.length!==1)return null;let i=r.childIds[0];if(i==null)return null;let a=e.snapshot.nodes[i];return a==null||!K(a)?null:i}function xa(e,t){let n=t;for(;;){let t=ba(e,n);if(t==null)return n;n=t}}function Sa(e,t){let n=[t],r=t;for(;;){let t=ba(e,r);if(t==null)return n;n.push(t),r=t}}function Ca(e,t){let n=t==null?e.snapshot.rootId:Ma(e,t);return n==null?[]:Pa(e,n)}function wa(e,t){let n=pi(t),r=n.isDirectory?n.segments:n.segments.slice(0,-1),i=Ya(e,Ja(e,r)),{createdNodeIds:a,directoryId:o}=Fa(e,r),s=new Set(a),c=o;if(n.isDirectory){let n=X(e,o);if(Kr(n,1))throw Error(`Path already exists: "${t}"`);qr(n,1),e.pathCacheByNodeId.set(o,{path:t,version:e.pathCacheVersion}),s.add(o)}else c=La(e,o,n.basename),s.add(c);ka(e,o);let l=Ya(e,o);return Zi({affectedAncestorIds:ja(e,c),affectedNodeIds:[...s],path:t,projectionChanged:Xa(i,l)})}function Ta(e,t,n){let r=Ma(e,t);if(r==null)throw Error(`Path does not exist: "${t}"`);let i=X(e,r);if(Kr(i,2))throw Error(`The root node cannot be removed`);if(K(i)&&Y(e,r).childIds.length>0&&n.recursive!==!0)throw Error(`Cannot remove a non-empty directory without recursive: "${t}"`);let a=i.parentId,o=Ya(e,a),s=Ka(e,r);Ba(e,a,r,i.nameId),qa(e,a),ka(e,a);let c=Ya(e,a);return Qi({affectedAncestorIds:ja(e,a),affectedNodeIds:s,path:t,projectionChanged:Xa(o,c),recursive:n.recursive===!0})}function Ea(e,t,n,r){let i=Ma(e,t);if(i==null)throw Error(`Source path does not exist: "${t}"`);let a=X(e,i);if(Kr(a,2))throw Error(`The root node cannot be moved`);let o=r.collision??`error`,s=Wa(e,i,n),c=Ya(e,a.parentId),l=Ya(e,s.parentId),u=vi(e.snapshot.segmentTable,a.nameId),d=_i(e.snapshot.segmentTable,s.basename);if(s.parentId===a.parentId&&u===s.basename)return null;if(K(a)&&eo(e,i,s.parentId))throw Error(`Cannot move a directory into one of its descendants`);let f=Or(e.snapshot.nodes,Y(e,s.parentId)).get(d),p=s.existingNodeId??f??null;if(p!=null&&p!==i&&Ga(e,p,o,Wr(a))===`skip`)return null;let m=a.parentId;Ba(e,m,i,a.nameId),a.parentId=s.parentId,a.nameId=d,e.pathCacheByNodeId.delete(i),$a(e,i),za(e,s.parentId,i),qa(e,m),e.pathCacheVersion++,ka(e,m),s.parentId!==m&&ka(e,s.parentId);let h=Ya(e,m),g=Ya(e,s.parentId);return $i({affectedAncestorIds:[...new Set([...ja(e,m),...ja(e,s.parentId)])],affectedNodeIds:[i],from:t,projectionChanged:Za([c,l],[h,g]),to:J(e,i)})}function Da(e,t){let n=e.pathCacheByNodeId.get(t);return n!=null&&n.version===e.pathCacheVersion?n.path:null}function Oa(e,t,n){return e.pathCacheByNodeId.set(t,{path:n,version:e.pathCacheVersion}),n}function J(e,t){let n=X(e,t),r=Da(e,t);if(r!=null)return r;if(Kr(n,2))return Oa(e,t,``);let i=J(e,n.parentId),a=vi(e.snapshot.segmentTable,n.nameId),o=i.length===0?a:`${i}${a}`;return Oa(e,t,K(n)?`${o}/`:o)}function ka(e,t){let n=e.instrumentation;if(n==null){no(e,t);return}q(n,`store.recomputeCountsUpwardFrom`,()=>no(e,t))}function Aa(e,t){let n=[[t,0]],{nodes:r,directories:i}=e.snapshot;for(;n.length>0;){let t=n[n.length-1],a=t[0],o=r[a];if(o==null||!K(o)){to(e,a,o,!0),n.pop();continue}let s=i.get(a);if(s==null||t[1]>=s.childIds.length){to(e,a,o,!0),n.pop();continue}let c=s.childIds[t[1]++];n.push([c,0])}}function ja(e,t){let n=[],r=t;for(;r!=null;){let t=X(e,r);if(n.push(r),r===e.snapshot.rootId)break;r=t.parentId}return n}function Ma(e,t){if(t.length===0)return e.snapshot.rootId;let n=mi(t);return Na(e,n.segments,n.requiresDirectory)}function Na(e,t,n){let r=e.snapshot.rootId;for(let n of t){let t=e.snapshot.segmentTable.idByValue.get(n);if(t===void 0)return null;let i=Y(e,r),a=Or(e.snapshot.nodes,i).get(t);if(a===void 0)return null;r=a}let i=X(e,r);return n&&!K(i)?null:r}function Y(e,t){let n=e.snapshot.directories.get(t);if(n===void 0)throw Error(`Unknown directory child index for node ${String(t)}`);return n}function X(e,t){let n=e.snapshot.nodes[t];if(n===void 0||Kr(n,4))throw Error(`Unknown node ID: ${String(t)}`);return n}function Pa(e,t){let n=e.snapshot.nodes[t];if(n===void 0||Kr(n,4))return[];if(!K(n))return[J(e,t)];if(Y(e,t).childIds.length===0)return Kr(n,1)&&!Kr(n,2)?[J(e,t)]:[];let r=[],i=[{childIndex:0,nodeId:t}];for(;i.length>0;){let t=i[i.length-1];if(t==null)break;let n=e.snapshot.nodes[t.nodeId];if(n===void 0||Kr(n,4)){i.pop();continue}if(!K(n)){r.push(J(e,t.nodeId)),i.pop();continue}let a=Y(e,t.nodeId);if(a.childIds.length===0){Kr(n,1)&&!Kr(n,2)&&r.push(J(e,t.nodeId)),i.pop();continue}let o=a.childIds[t.childIndex];if(o==null){i.pop();continue}t.childIndex++,i.push({childIndex:0,nodeId:o})}return r}function Fa(e,t){let n=[],r=e.snapshot.rootId;for(let i of t){let t=_i(e.snapshot.segmentTable,i),a=Y(e,r),o=Or(e.snapshot.nodes,a).get(t);if(o!==void 0){if(!K(X(e,o)))throw Error(`Cannot create a directory that collides with an existing file: "${i}"`);r=o;continue}r=Ia(e,r,t),n.push(r)}return{createdNodeIds:n,directoryId:r}}function Ia(e,t,n){let r=X(e,t),i=e.snapshot.nodes.length;return e.snapshot.nodes.push({depthAndFlags:Hr(Ur(r)+1,0,1),nameId:n,parentId:t,subtreeNodeCount:1,visibleSubtreeCount:1}),e.snapshot.directories.set(i,Er()),za(e,t,i),e.collapseNewDirectoriesByDefault&&(e.collapsedDirectoryIds.add(i),e.hasCollapsedDirectoryOverrides=!0),e.activeNodeCount++,i}function La(e,t,n){let r=_i(e.snapshot.segmentTable,n),i=Y(e,t);if(Or(e.snapshot.nodes,i).has(r))throw Error(`Path already exists: "${io(e,t,n)}"`);let a=X(e,t),o=e.snapshot.nodes.length;return e.snapshot.nodes.push({depthAndFlags:Hr(Ur(a)+1,0),nameId:r,parentId:t,subtreeNodeCount:1,visibleSubtreeCount:1}),za(e,t,o),e.activeNodeCount++,o}function Ra(e,t,n){let r=0,i=t.childIds.length;for(;r<i;){let a=r+i>>>1,o=t.childIds[a];if(o==null){i=a;continue}Va(e,n,o)<0?i=a:r=a+1}return r}function za(e,t,n){let r=Y(e,t),i=X(e,n);Or(e.snapshot.nodes,r).set(i.nameId,n),Nr(r,n,i.subtreeNodeCount,i.visibleSubtreeCount);let a=Ra(e,r,n);r.childIds.splice(a,0,n),jr(r,a),Ir(e.snapshot.nodes,r)}function Ba(e,t,n,r){let i=Y(e,t),a=kr(i),o=a.get(n)??-1;Or(e.snapshot.nodes,i).delete(r),a.delete(n);let s=e.snapshot.nodes[n];s!=null&&Nr(i,n,-s.subtreeNodeCount,-s.visibleSubtreeCount),o>=0&&(i.childIds.splice(o,1),jr(i,o),Ir(e.snapshot.nodes,i))}function Va(e,t,n){let r=e.snapshot.options.sort;return r==="default"?Ha(e,t,n):r(Ua(e,t),Ua(e,n))}function Ha(e,t,n){let r=X(e,t),i=X(e,n),a=K(r);if(a!==K(i))return a?-1:1;let o=ri(ui(e.snapshot.segmentTable,r.nameId),ui(e.snapshot.segmentTable,i.nameId));if(o!==0)return o;let s=vi(e.snapshot.segmentTable,r.nameId),c=vi(e.snapshot.segmentTable,i.nameId);return s===c?t<n?-1:1:s<c?-1:1}function Ua(e,t){let n=X(e,t),r=J(e,t),i=K(n),a=i?r.slice(0,-1):r;return{basename:vi(e.snapshot.segmentTable,n.nameId),depth:Ur(n),isDirectory:i,path:r,segments:a.length===0?[]:a.split(`/`)}}function Wa(e,t,n){let r=X(e,t),i=Ma(e,n);if(i!=null){let t=X(e,i);if(K(t))return{basename:vi(e.snapshot.segmentTable,r.nameId),existingNodeId:null,parentId:i};let a=mi(n).segments;return{basename:a[a.length-1]??``,existingNodeId:i,parentId:t.parentId}}let a=mi(n),o=a.segments[a.segments.length-1]??``,s=a.segments.slice(0,-1),c=s.length===0?e.snapshot.rootId:Na(e,s,!0);if(c==null)throw Error(`Destination parent does not exist: "${n}"`);return{basename:o,existingNodeId:null,parentId:c}}function Ga(e,t,n,r){if(n===`skip`)return`skip`;if(n===`error`)throw Error(`Destination already exists: "${J(e,t)}"`);let i=X(e,t);if(Wr(i)!==r)throw Error(`replace collision requires the same source and destination kinds`);if(K(i)&&Y(e,t).childIds.length>0)throw Error(`replace collision does not support non-empty directories`);let a=i.parentId,o=i.nameId;return Ka(e,t),Ba(e,a,t,o),qa(e,a),ka(e,a),`handled`}function Ka(e,t){let n=[],r=[{nodeId:t,visitedChildren:!1}];for(;r.length>0;){let t=r.pop();if(t==null)break;let i=X(e,t.nodeId);if(t.visitedChildren||!K(i)){K(i)&&e.snapshot.directories.delete(t.nodeId),qr(i,4),e.pathCacheByNodeId.delete(t.nodeId),e.collapsedDirectoryIds.delete(t.nodeId)&&(e.hasCollapsedDirectoryOverrides=e.collapsedDirectoryIds.size>0),e.expandedDirectoryIds.delete(t.nodeId),Yi(e,t.nodeId),e.activeNodeCount--,n.push(t.nodeId);continue}r.push({nodeId:t.nodeId,visitedChildren:!0});let a=Y(e,t.nodeId);for(let e=a.childIds.length-1;e>=0;e--){let t=a.childIds[e];t!=null&&r.push({nodeId:t,visitedChildren:!1})}}return n}function qa(e,t){let n=t;for(;n!=null;){let t=X(e,n);if(!K(t)||Kr(t,2)||Y(e,n).childIds.length>0)return;qr(t,1),n=t.parentId===n?null:t.parentId}}function Ja(e,t){let n=e.snapshot.rootId;for(let r of t){let t=e.snapshot.segmentTable.idByValue.get(r);if(t==null)break;let i=Or(e.snapshot.nodes,Y(e,n)).get(t);if(i==null||!K(X(e,i)))break;n=i}return n}function Ya(e,t){let n=Qa(e,t);if(n==null)return null;let r=xa(e,n),i=X(e,r),a=n===r?null:Sa(e,n).map(t=>J(e,t));return JSON.stringify({flattenedSegmentPaths:a,hasChildren:Y(e,r).childIds.length>0,path:J(e,r),terminalKind:Wr(i)})}function Xa(e,t){return Za([e],[t])}function Za(e,t){for(let n=0;n<e.length;n+=1){let r=e[n],i=t[n];if(r==null||i==null||r!==i)return!0}return!1}function Qa(e,t){let n=t;for(;n!=null;){let t=X(e,n);if(!K(t)||Kr(t,2))return null;if(!Bi(e,n,t))return n;n=t.parentId}return null}function $a(e,t){let n=X(e,t);if(Jr(n,(t===e.snapshot.rootId?-1:Ur(X(e,n.parentId)))+1),!K(n))return;let r=Y(e,t);for(let t of r.childIds)$a(e,t)}function eo(e,t,n){let r=n;for(;r!=null;){if(r===t)return!0;let n=X(e,r);if(r===e.snapshot.rootId)return!1;r=n.parentId}return!1}function to(e,t,n=X(e,t),r=!1){let i=e.instrumentation;if(i==null){ro(e,t,n,r);return}q(i,`store.recomputeNodeCounts`,()=>ro(e,t,n,r))}function no(e,t){let n=t;for(;n!=null;){let t=X(e,n),r=t.subtreeNodeCount,i=t.visibleSubtreeCount;if(to(e,n,t),n===e.snapshot.rootId)return;let a=t.subtreeNodeCount-r,o=t.visibleSubtreeCount-i,s=t.parentId;(a!==0||o!==0)&&Nr(Y(e,s),n,a,o),n=s}}function ro(e,t,n,r){if(!K(n)){n.subtreeNodeCount=1,n.visibleSubtreeCount=1;return}let i=Y(e,t);if(r){let t=e.instrumentation;t==null?Mr(e.snapshot.nodes,i):q(t,`store.recomputeNodeCounts.rebuildChildAggregates`,()=>Mr(e.snapshot.nodes,i))}let a=1+i.totalChildSubtreeNodeCount,o=i.totalChildVisibleSubtreeCount;if(n.subtreeNodeCount=a,Kr(n,2)){n.visibleSubtreeCount=o;return}n.visibleSubtreeCount=ba(e,t)==null?Bi(e,t,n)?1+o:1:o}function io(e,t,n){let r=J(e,t);return r.length===0?n:`${r}${n}`}function ao(e){return e!=null&&!Kr(e,4)}function oo(e,t){let n=e.snapshot.nodes[t];return!ao(n)||!K(n)||Kr(n,2)?null:n}function so(e){let t=0;for(let[n,r]of e.pathCacheByNodeId)r.version===e.pathCacheVersion&&ao(e.snapshot.nodes[n])&&(t+=1);return t}function co(e){return Math.max(0,e.valueById.length-1)}function lo(e){return{activeNodeCount:e.activeNodeCount,cachedPathEntryCount:so(e),loadInfoEntryCount:e.directoryLoadInfoById.size,segmentCount:co(e.snapshot.segmentTable),totalNodeSlotCount:Math.max(0,e.snapshot.nodes.length-1)}}function uo(e,t,n,r){return{activeNodeCountAfter:r.activeNodeCount,activeNodeCountBefore:n.activeNodeCount,cachedPathEntryCountAfter:r.cachedPathEntryCount,cachedPathEntryCountBefore:n.cachedPathEntryCount,idsPreserved:t,loadInfoEntryCountAfter:r.loadInfoEntryCount,loadInfoEntryCountBefore:n.loadInfoEntryCount,mode:e,reclaimedCachedPathEntryCount:n.cachedPathEntryCount-r.cachedPathEntryCount,reclaimedLoadInfoEntryCount:n.loadInfoEntryCount-r.loadInfoEntryCount,reclaimedNodeSlotCount:n.totalNodeSlotCount-r.totalNodeSlotCount,reclaimedSegmentCount:n.segmentCount-r.segmentCount,segmentCountAfter:r.segmentCount,segmentCountBefore:n.segmentCount,totalNodeSlotCountAfter:r.totalNodeSlotCount,totalNodeSlotCountBefore:n.totalNodeSlotCount}}function fo(e){let t=[],n=[];for(let n of e.collapsedDirectoryIds)oo(e,n)!=null&&t.push(J(e,n));for(let t of e.expandedDirectoryIds)oo(e,t)!=null&&n.push(J(e,t));return{collapsedPaths:t,expandedPaths:n}}function po(e){let t=[];for(let[n,r]of e.directoryLoadInfoById)oo(e,n)==null||Ui(e,n)===`loaded`||t.push({info:{activeAttemptId:null,errorMessage:r.errorMessage,nextAttemptId:r.nextAttemptId,state:r.state},path:J(e,n)});return t}function mo(e,t){e.collapsedDirectoryIds.clear(),e.hasCollapsedDirectoryOverrides=!1,e.expandedDirectoryIds.clear();for(let n of t.expandedPaths){let t=Ma(e,n);t!=null&&Vi(e,t,!0,X(e,t))}for(let n of t.collapsedPaths){let t=Ma(e,n);t!=null&&Vi(e,t,!1,X(e,t))}}function ho(e,t){e.directoryLoadInfoById.clear();for(let n of t){let t=Ma(e,n.path);t!=null&&oo(e,t)!=null&&e.directoryLoadInfoById.set(t,{activeAttemptId:null,errorMessage:n.info.errorMessage,nextAttemptId:n.info.nextAttemptId,state:n.info.state})}}function go(e){e.pathCacheVersion+=1,e.pathCacheByNodeId.clear(),e.pathCacheByNodeId.set(e.snapshot.rootId,{path:``,version:e.pathCacheVersion})}function _o(e){let t=e.snapshot.segmentTable,n=gi();for(let r of e.snapshot.nodes)if(ao(r)){if(Kr(r,2)){r.nameId=0;continue}r.nameId=_i(n,vi(t,r.nameId))}e.snapshot.segmentTable=n}function vo(e){for(let[t,n]of e.snapshot.directories){let r=e.snapshot.nodes[t];if(!ao(r)||!K(r)){e.snapshot.directories.delete(t);continue}let i=n.childIds.filter(n=>{let r=e.snapshot.nodes[n];return ao(r)&&r.parentId===t});n.childIds=i,n.childIdByNameId=new Map(i.map(t=>[X(e,t).nameId,t])),n.childPositionById=new Map(i.map((e,t)=>[e,t])),Mr(e.snapshot.nodes,n)}}function yo(e){let t=e.snapshot.nodes.length-1;for(;t>e.snapshot.rootId;){let n=e.snapshot.nodes[t];if(ao(n))break;--t}e.snapshot.nodes.length=t+1}function bo(e){let t=fo(e),n=po(e);q(e.instrumentation,`store.cleanup.stable.clearPathCaches`,()=>go(e)),q(e.instrumentation,`store.cleanup.stable.rebuildSegmentTable`,()=>_o(e)),q(e.instrumentation,`store.cleanup.stable.rebuildDirectoryIndexes`,()=>vo(e)),q(e.instrumentation,`store.cleanup.stable.trimTrailingRemovedNodeSlots`,()=>yo(e)),q(e.instrumentation,`store.cleanup.stable.restoreExpansionOverrides`,()=>mo(e,t)),q(e.instrumentation,`store.cleanup.stable.restoreDirectoryLoadInfos`,()=>ho(e,n)),q(e.instrumentation,`store.cleanup.stable.recomputeCounts`,()=>Aa(e,e.snapshot.rootId))}function xo(e){let t=fo(e),n=po(e),r=q(e.instrumentation,`store.cleanup.aggressive.listPaths`,()=>Ca(e)),i=Xr({...e.snapshot.options},e.instrumentation),a=q(e.instrumentation,`store.cleanup.aggressive.rebuildSnapshot`,()=>{let e=new Fi(i);return e.appendPaths(r),e.finish()});e.snapshot=a,e.activeNodeCount=a.nodes.length-1,e.pathCacheByNodeId=new Map([[a.rootId,{path:``,version:0}]]),e.pathCacheVersion=0,q(e.instrumentation,`store.cleanup.aggressive.restoreExpansionOverrides`,()=>mo(e,t)),q(e.instrumentation,`store.cleanup.aggressive.restoreDirectoryLoadInfos`,()=>ho(e,n)),q(e.instrumentation,`store.cleanup.aggressive.recomputeCounts`,()=>Aa(e,e.snapshot.rootId))}function So(e){for(let t of e.directoryLoadInfoById.values())if(t.state===`loading`&&t.activeAttemptId!=null)return!0;return!1}function Co(e,t){let n=lo(e);t===`stable`?q(e.instrumentation,`store.cleanup.stable`,()=>bo(e)):q(e.instrumentation,`store.cleanup.aggressive`,()=>xo(e));let r=lo(e);return uo(t,t===`stable`,n,r)}var wo=64;function To(e,t){let n=t+2;if(n<=e.length)return e;let r=e.length;for(;r<n;)r*=2;let i=new Int32Array(r);return i.fill(-1),i.set(e),i}function Eo(e){return X(e,e.snapshot.rootId).visibleSubtreeCount}function Do(e,t,n,r){let i=X(e,t.terminalNodeId),a=Math.max(1,i.visibleSubtreeCount);return Math.min(r-1,n+a-1)}function Oo(e,t,n,r){return{ancestorPaths:r,index:t.index,posInSet:t.posInSet,row:qo(e,t.cursor),setSize:t.setSize,subtreeEndIndex:Do(e,t.cursor,t.index,n)}}function ko(e,t,n,r,i,a){let o=Y(e,t),{childIndex:s,childVisibleIndex:c,localVisibleIndex:l}=Pr(e.snapshot.nodes,o,n),u=o.childIds[s];if(u==null)throw Error(`Visible index ${String(n)} is out of range`);return Ao(e,u,l,r+c,i+1,s,o.childIds.length,a)}function Ao(e,t,n,r,i,a,o,s){if(!K(X(e,t))){if(n===0)return{ancestors:s,cursor:{headNodeId:t,terminalNodeId:t,visibleDepth:i},index:r,posInSet:a,setSize:o};throw Error(`Visible index ${String(n)} is out of range for file`)}let c=Vo(e,t,i);if(n===0)return{ancestors:s,cursor:c,index:r,posInSet:a,setSize:o};let l=X(e,c.terminalNodeId);if(!K(l)||!Bi(e,c.terminalNodeId,l))throw Error(`Visible index ${String(n)} is out of range for collapsed directory`);return ko(e,c.terminalNodeId,n-1,r+1,c.visibleDepth,[...s,{cursor:c,index:r,posInSet:a,setSize:o}])}function jo(e,t){let n=Eo(e);if(t<0||t>=n)return null;let r=ko(e,e.snapshot.rootId,t,0,-1,[]),i=r.ancestors.map(t=>J(e,t.cursor.terminalNodeId)),a=null;return{ancestorPaths:i,get ancestorRows(){if(a!=null)return a;let t=[],i=[];for(let a of r.ancestors){let r=Oo(e,a,n,[...i]);t.push(r),i.push(r.row.path)}return a=t,a},index:r.index,posInSet:r.posInSet,row:qo(e,r.cursor),setSize:r.setSize,subtreeEndIndex:Do(e,r.cursor,r.index,n)}}function Mo(e,t,n){let r=e.instrumentation,i=Eo(e);if(i<=0||n<t)return[];let a=Math.max(0,Math.min(t,i-1)),o=Math.max(a,Math.min(n,i-1));if(r==null){if(a===0)return Ko(e,o+1);let t=[],n=Ro(e,a);for(let r=a;r<=o&&n!=null;r++){let r=qo(e,n);t.push(r),n=Uo(e,n)}return t}let s=[],c=0,l=0,u=q(r,`store.getVisibleSlice.selectFirstRow`,()=>Ro(e,a));for(let t=a;t<=o&&u!=null;t++){let t=q(r,`store.getVisibleSlice.materializeRow`,()=>qo(e,u));s.push(t),t.isFlattened&&(c++,l+=t.flattenedSegments?.length??0),u=q(r,`store.getVisibleSlice.advanceCursor`,()=>Uo(e,u))}return Qr(r,`workload.visibleRowsRead`,s.length),Qr(r,`workload.flattenedRowsRead`,c),Qr(r,`workload.flattenedSegmentsRead`,l),s}function No(e,t=Eo(e)){let n=e.instrumentation;return n==null?Go(e,t):q(n,`store.getVisibleTreeProjection`,()=>Go(e,t))}function Po(e){return Wo(No(e))}function Fo(e,t){let n=Ma(e,t);if(n==null||n===e.snapshot.rootId||K(X(e,n))&&xa(e,n)!==n)return null;let r=0,i=n,{nodes:a,rootId:o}=e.snapshot;for(;i!==o;){let t=X(e,i).parentId,n=Y(e,t),s=kr(n).get(i);if(s==null)throw Error(`Child ${String(i)} was not found in its parent index`);if(r+=Fr(a,n,s),t!==o){let n=X(e,t),a=ba(e,t);if(!Bi(e,t,n)&&a!==i)return null;xa(e,t)===t&&(r+=1)}i=t}return r}function Io(e,t){let n=Ma(e,t);if(n==null)throw Error(`Path does not exist: "${t}"`);let r=X(e,n);if(!K(r))throw Error(`Path is not a directory: "${t}"`);return Bi(e,n,r)?null:(Vi(e,n,!0,r),ka(e,n),ea({affectedAncestorIds:ja(e,n),affectedNodeIds:[n],path:t,projectionChanged:!0}))}function Lo(e,t){let n=Ma(e,t);if(n==null)throw Error(`Path does not exist: "${t}"`);let r=X(e,n);if(!K(r))throw Error(`Path is not a directory: "${t}"`);return Bi(e,n,r)?(Vi(e,n,!1,r),ka(e,n),ta({affectedAncestorIds:ja(e,n),affectedNodeIds:[n],path:t,projectionChanged:!0})):null}function Ro(e,t){return t<0||t>=Eo(e)?null:zo(e,e.snapshot.rootId,t,-1)}function zo(e,t,n,r){let i=Y(e,t),a=e.instrumentation,{childIndex:o,localVisibleIndex:s}=a==null?Pr(e.snapshot.nodes,i,n):q(a,`store.getVisibleSlice.selectChildIndex`,()=>Pr(e.snapshot.nodes,i,n)),c=i.childIds[o];if(c!=null)return Bo(e,c,s,r+1);throw Error(`Visible index ${String(n)} is out of range`)}function Bo(e,t,n,r){if(!K(X(e,t))){if(n===0)return{headNodeId:t,terminalNodeId:t,visibleDepth:r};throw Error(`Visible index ${String(n)} is out of range for file`)}let i=Vo(e,t,r);if(n===0)return i;let a=X(e,i.terminalNodeId);if(!K(a)||!Bi(e,i.terminalNodeId,a))throw Error(`Visible index ${String(n)} is out of range for collapsed directory`);return zo(e,i.terminalNodeId,n-1,i.visibleDepth)}function Vo(e,t,n){return K(X(e,t))?e.instrumentation==null?{headNodeId:t,terminalNodeId:xa(e,t),visibleDepth:n}:{headNodeId:t,terminalNodeId:q(e.instrumentation,`store.getVisibleSlice.flatten.resolveTerminalDirectory`,()=>xa(e,t)),visibleDepth:n}:{headNodeId:t,terminalNodeId:t,visibleDepth:n}}function Ho(e,t){let n=X(e,t);if(!K(n))return!0;let r=n.parentId;return r===e.snapshot.rootId?!0:ba(e,r)!==t}function Uo(e,t){let n=X(e,t.terminalNodeId);if(K(n)){let r=Y(e,t.terminalNodeId);if(Bi(e,t.terminalNodeId,n)&&r.childIds.length>0){let n=r.childIds[0];return n==null?null:Bo(e,n,0,t.visibleDepth+1)}}let r=t.terminalNodeId,i=t.visibleDepth;for(;;){let t=X(e,r);if(r===e.snapshot.rootId)return null;let n=t.parentId,a=Y(e,n),o=kr(a).get(r)??-1;if(o<0)throw Error(`Child ${String(r)} was not found in its parent index`);let s=a.childIds[o+1]??null;if(s!=null)return Bo(e,s,0,i);Ho(e,r)&&i--,r=n}}function Wo(e){let t=e.paths.length,n=Array(t);for(let r=0;r<t;r+=1){let t=e.getParentIndex(r);n[r]={index:r,parentPath:t>=0?e.paths[t]??null:null,path:e.paths[r]??``,posInSet:e.posInSetByIndex[r]??0,setSize:e.setSizeByIndex[r]??0}}return{getParentIndex:e.getParentIndex,rows:n,get visibleIndexByPath(){return e.visibleIndexByPath}}}function Go(e,t){let n=Array(t),r=new Int32Array(t),i=new Int32Array(t),a=new Int32Array(t),o=new Int32Array(wo);o.fill(-1);let s=0,{nodes:c,directories:l,segmentTable:u}=e.snapshot,d=[[l.get(e.snapshot.rootId),0,-1,``]],f=e.snapshot.options.flattenEmptyDirectories,p=e.pathCacheByNodeId,m=e.pathCacheVersion,h=u.valueById;for(;d.length>0&&s<t;){let t=d[d.length-1],u=t[0];if(t[1]>=u.childIds.length){d.pop();continue}let g=t[1],_=u.childIds[t[1]++],v=c[_],y=t[2]+1,b=t[3];o=To(o,y);let x,S=_;if(K(v))S=f?xa(e,_):_,x=S===_?`${b}${h[v.nameId]}/`:J(e,S);else{let e=p.get(_);x=e!=null&&e.version===m?e.path:`${b}${h[v.nameId]}`}r[s]=o[y],n[s]=x,i[s]=g,a[s]=u.childIds.length,o[y+1]=s,s+=1;let C=c[S];C!=null&&K(C)&&Bi(e,S,C)&&d.push([l.get(S),0,y,x])}s<t&&(n.length=s);let g=r.subarray(0,s),_=i.subarray(0,s),v=a.subarray(0,s),y=null;return{getParentIndex(e){return e<0||e>=s?-1:g[e]??-1},paths:n,posInSetByIndex:_,setSizeByIndex:v,get visibleIndexByPath(){if(y==null){y=new Map;for(let e=0;e<s;e+=1)y.set(n[e]??``,e)}return y}}}function Ko(e,t){let n=Array(t),r=0,{nodes:i,directories:a,segmentTable:o}=e.snapshot,s=[[a.get(e.snapshot.rootId),0,-1]],c=o.valueById,l=e.snapshot.options.flattenEmptyDirectories,u=e.pathCacheByNodeId,d=e.pathCacheVersion;for(;s.length>0&&r<t;){let t=s[s.length-1],o=t[0];if(t[1]>=o.childIds.length){s.pop();continue}let f=o.childIds[t[1]++],p=i[f],m=t[2]+1;if(!K(p)){let t=u.get(f);n[r++]={depth:m,flattenedSegments:void 0,hasChildren:!1,id:f,isExpanded:!1,isFlattened:!1,isLoading:!1,kind:`file`,loadState:void 0,name:c[p.nameId],path:t!=null&&t.version===d?t.path:J(e,f)};continue}let h=l?xa(e,f):f,g={headNodeId:f,terminalNodeId:h,visibleDepth:m};n[r++]=qo(e,g);let _=i[h];_!=null&&K(_)&&Bi(e,h,_)&&s.push([a.get(h),0,m])}return r<t&&(n.length=r),n}function qo(e,t){let n=X(e,t.terminalNodeId),r=K(n)?Jo(e,t):null,i=J(e,t.terminalNodeId),a=vi(e.snapshot.segmentTable,n.nameId),o=K(n)&&Y(e,t.terminalNodeId).childIds.length>0,s=t.headNodeId!==t.terminalNodeId,c=e.instrumentation,l=s?c==null?Sa(e,t.headNodeId).map(n=>{let r=X(e,n);return{isTerminal:n===t.terminalNodeId,name:vi(e.snapshot.segmentTable,r.nameId),nodeId:n,path:J(e,n)}}):q(c,`store.getVisibleSlice.flatten.collectSegments`,()=>Sa(e,t.headNodeId).map(n=>{let r=X(e,n);return{isTerminal:n===t.terminalNodeId,name:vi(e.snapshot.segmentTable,r.nameId),nodeId:n,path:J(e,n)}})):void 0;return{depth:t.visibleDepth,flattenedSegments:l,hasChildren:o,id:t.terminalNodeId,isExpanded:K(n)&&Bi(e,t.terminalNodeId,n),isFlattened:s,isLoading:r===`loading`,kind:K(n)?`directory`:`file`,loadState:r==null||r===`loaded`?void 0:r,name:a,path:i}}function Jo(e,t){if(t.headNodeId===t.terminalNodeId)return Ui(e,t.terminalNodeId);let n=Sa(e,t.headNodeId),r=!1,i=!1;for(let t of n){let n=Ui(e,t);if(n===`loading`)return`loading`;if(n===`error`){i=!0;continue}n===`unloaded`&&(r=!0)}return i?`error`:r?`unloaded`:`loaded`}function Yo(e){let{directories:t,nodes:n,options:r,rootId:i,presortedDirectoryNodeIds:a}=e.snapshot,o=r.flattenEmptyDirectories===!0,s=e=>{let r=n[e];if(r==null||!K(r))return;let i=t.get(e);if(i==null)throw Error(`Unknown directory child index for node ${String(e)}`);let a=i.childIds,s=a.length,c=0,l=0;for(let e=0;e<s;e++){let t=a[e];if(t==null)continue;let r=n[t];c+=r.subtreeNodeCount,l+=r.visibleSubtreeCount}i.totalChildSubtreeNodeCount=c,i.totalChildVisibleSubtreeCount=l,s>=128&&Ir(n,i),r.subtreeNodeCount=1+c;let u;if(o&&s===1){let e=n[a[0]];u=e!=null&&K(e)?l:1+l}else u=1+l;r.visibleSubtreeCount=u};if(a!=null)for(let e=a.length-1;e>=0;e--)s(a[e]);else for(let e=n.length-1;e>=1;e--)s(e);let c=n[i],l=t.get(i);if(c==null||l==null)return;let u=l.childIds,d=0,f=0;for(let e=0;e<u.length;e++){let t=u[e];if(t==null)continue;let r=n[t];d+=r.subtreeNodeCount,f+=r.visibleSubtreeCount}l.totalChildSubtreeNodeCount=d,l.totalChildVisibleSubtreeCount=f,Ir(n,l),c.subtreeNodeCount=1+d,c.visibleSubtreeCount=f}function Xo(e){return e.initialExpansion===`open`&&(e.initialExpandedPaths==null||e.initialExpandedPaths.length===0)}var Zo=class e{#e;constructor(e={}){let t=Zr(e),n=q(t,`store.builder.create`,()=>new Fi(e));if(e.preparedInput!=null){let t=Mi(e.preparedInput);t==null?n.appendPreparedPaths(ji(e.preparedInput),!1):n.appendPresortedPaths(t,Ni(e.preparedInput))}else{let r=e.paths??[];e.presorted===!0?n.appendPaths(r):n.appendPreparedPaths(q(t,`store.preparePathEntries`,()=>Pi(r,e)))}let r=q(t,`store.builder.finish`,()=>n.finish({skipSubtreeCountPass:!0})),i=q(t,`store.state.detectAllDirectoriesExpanded`,()=>(e.initialExpansion??`closed`)===`closed`&&n.didMatchAllInitialExpandedPaths());this.#e=q(t,`store.state.create`,()=>Ii(r,i?`open`:e.initialExpansion??`closed`,t)),i&&(this.#e.collapseNewDirectoriesByDefault=!0);let a=i?this.#e.snapshot.directories.size-1:q(t,`store.state.initializeExpandedPaths`,()=>this.initializeExpandedPaths(e.initialExpandedPaths));i||Xo(e)||(e.initialExpansion??`closed`)===`closed`&&a===this.#e.snapshot.directories.size-1||(e.initialExpandedPaths?.length??0)>0&&q(t,`store.state.checkAllDirectoriesExpanded`,()=>this.hasAllDirectoriesExpanded())?q(t,`store.state.initializeOpenVisibleCounts`,()=>Yo(this.#e)):q(t,`store.state.recomputeCounts`,()=>Aa(this.#e,this.#e.snapshot.rootId))}static preparePaths(e,t={}){return Oi(e,t)}static prepareInput(e,t={}){return ki(e,t)}static preparePresortedInput(e){return Ai(e)}list(e){return q(this.#e.instrumentation,`store.list`,()=>Ca(this.#e,e))}add(e){q(this.#e.instrumentation,`store.add`,()=>{let t=Eo(this.#e);ua(this.#e,ca(this.#e,t,wa(this.#e,e)))})}remove(e,t={}){q(this.#e.instrumentation,`store.remove`,()=>{let n=Eo(this.#e);ua(this.#e,ca(this.#e,n,Ta(this.#e,e,t)))})}move(e,t,n={}){q(this.#e.instrumentation,`store.move`,()=>{let r=Eo(this.#e),i=Ea(this.#e,e,t,n);i!=null&&ua(this.#e,ca(this.#e,r,i))})}batch(e){la(this.#e,()=>{if(typeof e==`function`){e(this);return}for(let t of e)switch(t.type){case`add`:this.add(t.path);break;case`remove`:this.remove(t.path,{recursive:t.recursive});break;case`move`:this.move(t.from,t.to,{collision:t.collision});break}})}getVisibleCount(){return q(this.#e.instrumentation,`store.getVisibleCount`,()=>Eo(this.#e))}getVisibleSlice(e,t){return q(this.#e.instrumentation,`store.getVisibleSlice`,()=>Mo(this.#e,e,t))}getVisibleRowContext(e){return q(this.#e.instrumentation,`store.getVisibleRowContext`,()=>jo(this.#e,e))}getVisibleTreeProjection(){return Po(this.#e)}getVisibleTreeProjectionData(e){return No(this.#e,e)}getVisibleIndex(e){return q(this.#e.instrumentation,`store.getVisibleIndex`,()=>Fo(this.#e,e))}getPathInfo(e){return q(this.#e.instrumentation,`store.getPathInfo`,()=>{let t=Ma(this.#e,e);if(t==null)return null;let n=X(this.#e,t);return{depth:Ur(n),kind:K(n)?`directory`:`file`,path:J(this.#e,t)}})}isExpanded(e){return q(this.#e.instrumentation,`store.isExpanded`,()=>{let t=this.requireDirectoryNodeId(e),n=X(this.#e,t);return Bi(this.#e,t,n)})}expand(e){q(this.#e.instrumentation,`store.expand`,()=>{let t=Eo(this.#e),n=Io(this.#e,e);n!=null&&ua(this.#e,ca(this.#e,t,n))})}collapse(e){q(this.#e.instrumentation,`store.collapse`,()=>{let t=Eo(this.#e),n=Lo(this.#e,e);n!=null&&ua(this.#e,ca(this.#e,t,n))})}on(e,t){return Xi(this.#e,e,t)}getDirectoryLoadState(e){let t=this.requireDirectoryNodeId(e);return Ui(this.#e,t)}markDirectoryUnloaded(e){q(this.#e.instrumentation,`store.markDirectoryUnloaded`,()=>{let t=this.requireDirectoryNodeId(e);if(Y(this.#e,t).childIds.length>0)throw Error(`Cannot mark a directory with known children as unloaded: "${e}"`);let n=Eo(this.#e);Gi(this.#e,t),ua(this.#e,ca(this.#e,n,na({affectedAncestorIds:ja(this.#e,t),affectedNodeIds:[t],path:e,projectionChanged:this.isDirectoryProjectionVisible(t)})))})}beginChildLoad(e){return q(this.#e.instrumentation,`store.beginChildLoad`,()=>{let t=this.requireDirectoryNodeId(e),n=Eo(this.#e),r=Wi(this.#e,t);return ua(this.#e,ca(this.#e,n,ra({affectedAncestorIds:ja(this.#e,t),affectedNodeIds:[t],attemptId:r.attemptId,path:e,projectionChanged:this.isDirectoryProjectionVisible(t),reused:r.reused}))),r})}applyChildPatch(e,t){return q(this.#e.instrumentation,`store.applyChildPatch`,()=>{let n=this.resolveActiveDirectoryNodeId(e.nodeId);if(n==null||Ui(this.#e,n)!==`loading`||!qi(this.#e,n,e.attemptId))return!1;let r=J(this.#e,n);this.validateChildPatch(r,t);let i=Eo(this.#e),a=[];for(let e of t.operations){Qo(r,e);let t=Eo(this.#e);switch(e.type){case`add`:a.push(ca(this.#e,t,wa(this.#e,e.path)));break;case`remove`:a.push(ca(this.#e,t,Ta(this.#e,e.path,{recursive:e.recursive})));break;case`move`:{let n=Ea(this.#e,e.from,e.to,{collision:e.collision});n!=null&&a.push(ca(this.#e,t,n));break}}}let o=a.some(e=>e.projectionChanged)||this.isDirectoryProjectionVisible(n);return ua(this.#e,ca(this.#e,i,ia({affectedAncestorIds:ja(this.#e,n),affectedNodeIds:[n],attemptId:e.attemptId,childEvents:a,path:J(this.#e,n),projectionChanged:o}))),!0})}completeChildLoad(e){return q(this.#e.instrumentation,`store.completeChildLoad`,()=>{let t=this.resolveActiveDirectoryNodeId(e.nodeId);if(t==null)return!1;let n=Eo(this.#e),r=Ki(this.#e,t,e.attemptId);return ua(this.#e,ca(this.#e,n,aa({affectedAncestorIds:ja(this.#e,t),affectedNodeIds:[t],attemptId:e.attemptId,path:J(this.#e,t),projectionChanged:this.isDirectoryProjectionVisible(t),stale:!r}))),r})}failChildLoad(e,t){return q(this.#e.instrumentation,`store.failChildLoad`,()=>{let n=this.resolveActiveDirectoryNodeId(e.nodeId);if(n==null)return!1;let r=Eo(this.#e),i=Ji(this.#e,n,e.attemptId,t);return ua(this.#e,ca(this.#e,r,oa({affectedAncestorIds:ja(this.#e,n),affectedNodeIds:[n],attemptId:e.attemptId,errorMessage:t,path:J(this.#e,n),projectionChanged:this.isDirectoryProjectionVisible(n),stale:!i}))),i})}cleanup(e={}){return q(this.#e.instrumentation,`store.cleanup`,()=>{if(this.#e.transactionStack.length>0)throw Error(`Cleanup cannot run during an open batch or transaction.`);if(So(this.#e))throw Error(`Cleanup cannot run while directory loads are active.`);let t=Eo(this.#e),n=Co(this.#e,e.mode??`stable`);return ua(this.#e,ca(this.#e,t,sa({...n,affectedAncestorIds:[],affectedNodeIds:[],projectionChanged:n.idsPreserved===!1}))),n})}getNodeCount(){return this.#e.activeNodeCount}initializeExpandedPaths(e){if(e==null||e.length===0)return 0;let t=0,n=[],r=[],i=0,a=null,o=this.#e.snapshot.segmentTable,s=o.valueById,c=this.#e.snapshot.nodes,l=new Map;for(let u of e){a!=null&&u<a&&(a=null,i=0,n.length=0,r.length=0);let e=u.length>0&&u.charCodeAt(u.length-1)===47?u.length-1:u.length;if(e===0){a=u,i=e,n.length=0,r.length=0;continue}let d=0,f=0;if(a!=null){let t=Math.min(e,i),n=!0;for(let e=0;e<t;e+=1){let t=u.charCodeAt(e);if(t!==a.charCodeAt(e)){n=!1;break}t===47&&(d+=1,f=e+1)}n&&(t===i&&e>t&&u.charCodeAt(t)===47?(d+=1,f=t+1):t===e&&i>t&&a.charCodeAt(t)===47&&(d+=1,f=e+1)),d=Math.min(d,r.length)}let p=d===0?this.#e.snapshot.rootId:r[d-1]??this.#e.snapshot.rootId,m=d,h=!0,g=f;for(;g<=e;){let t=u.indexOf(`/`,g),i=t===-1||t>e?e:t,a=u.slice(g,i),f=Y(this.#e,p).childIds,_=m===d?n[m]??0:0,v=_,y,b=l.get(a)??ti(a);l.set(a,b);let x=(e,t)=>{for(v=e;v<t;v+=1){let e=f[v],t=c[e],n=s[t.nameId];if(n===a)return y=e,!0;let r=ri(ui(o,t.nameId),b);if(r>0||r===0&&n>a)return!1}return!1};if(!x(_,f.length)&&_>0&&x(0,_),y===void 0){h=!1;break}if(!K(X(this.#e,y))){h=!1;break}if(n[m]=v,r[m]=y,p=y,m+=1,i===e)break;g=i+1}if(a=u,i=e,n.length=m,r.length=m,!h){a=null,i=0,n.length=0,r.length=0;continue}for(let e=d;e<m;e+=1){let n=r[e];if(n==null)continue;let i=X(this.#e,n);Bi(this.#e,n,i)||(Vi(this.#e,n,!0,i),t+=1)}}return t}hasAllDirectoriesExpanded(){for(let e of this.#e.snapshot.directories.keys()){if(e===this.#e.snapshot.rootId)continue;let t=X(this.#e,e);if(!Bi(this.#e,e,t))return!1}return!0}requireDirectoryNodeId(e){let t=Ma(this.#e,e);if(t==null)throw Error(`Path does not exist: "${e}"`);if(!K(X(this.#e,t)))throw Error(`Path is not a directory: "${e}"`);return t}resolveActiveDirectoryNodeId(e){try{if(!K(X(this.#e,e)))throw Error(`Node is not a directory: ${String(e)}`);return e}catch{return null}}isDirectoryProjectionVisible(e){let t=e;for(;t!==this.#e.snapshot.rootId;){let e=X(this.#e,t).parentId;if(e!==this.#e.snapshot.rootId){let n=X(this.#e,e),r=ba(this.#e,e);if(!Bi(this.#e,e,n)&&r!==t)return!1}t=e}return!0}validateChildPatch(t,n){new e({paths:this.list(t),presorted:!0,sort:this.#e.snapshot.options.sort}).batch(n.operations)}};function Qo(e,t){switch(t.type){case`add`:case`remove`:if(!t.path.startsWith(e)||t.path===e)throw Error(`Child patch operation must stay within ${e}: "${t.path}"`);break;case`move`:if(!t.from.startsWith(e)||!t.to.startsWith(e)||t.from===e||t.to===e)throw Error(`Child patch move must stay within ${e}: "${t.from}" -> "${t.to}"`);break}}var $o={compact:{itemHeight:24,factor:.8},default:{itemHeight:30,factor:1},relaxed:{itemHeight:36,factor:1.2}};function es(e,t){if(typeof e==`number`)return{itemHeight:t??$o.default.itemHeight,factor:e};let n=$o[e??`default`];return{itemHeight:t??n.itemHeight,factor:n.factor}}var ts=$o.default.itemHeight,ns=`@layer base, theme, unsafe;

@layer base {
  :host {
    /*
      CSS variables use a fallback stack to ensure user and theme colors slot
      in with ease. User colors take precedence over theme colors, which take
      precedence over defaults.

      Fallback order:

      1. --trees-*-override (explicit)
      2. --trees-theme-* (e.g. Shiki/VS Code tokens)
      3. defaults

      Theme variable names mirror Shiki/VS Code theme file JSON tokens.

      // Available CSS Color Overrides
      --trees-fg-override
      --trees-fg-muted-override
      --trees-bg-override
      --trees-bg-muted-override
      --trees-accent-override
      --trees-border-color-override

      --trees-focus-ring-color-override
      --trees-focus-ring-width-override
      --trees-focus-ring-offset-override

      --trees-search-fg-override
      --trees-search-font-weight-override
      --trees-search-bg-override

      --trees-selected-fg-override
      --trees-selected-bg-override
      --trees-selected-focused-border-color-override

      // Git Status Color Overrides
      --trees-status-added-override
      --trees-status-ignored-override
      --trees-status-modified-override
      --trees-status-renamed-override
      --trees-status-untracked-override
      --trees-status-deleted-override
      --trees-git-added-color-override
      --trees-git-ignored-color-override
      --trees-git-modified-color-override
      --trees-git-renamed-color-override
      --trees-git-untracked-color-override
      --trees-git-deleted-color-override

      // Built-in File Icon Color Overrides
      --trees-file-icon-color
      --trees-file-icon-color-astro
      --trees-file-icon-color-babel
      --trees-file-icon-color-bash
      --trees-file-icon-color-biome
      --trees-file-icon-color-bootstrap
      --trees-file-icon-color-browserslist
      --trees-file-icon-color-bun
      --trees-file-icon-color-c
      --trees-file-icon-color-cpp
      --trees-file-icon-color-claude
      --trees-file-icon-color-css
      --trees-file-icon-color-database
      --trees-file-icon-color-default
      --trees-file-icon-color-docker
      --trees-file-icon-color-eslint
      --trees-file-icon-color-git
      --trees-file-icon-color-go
      --trees-file-icon-color-graphql
      --trees-file-icon-color-html
      --trees-file-icon-color-image
      --trees-file-icon-color-javascript
      --trees-file-icon-color-json
      --trees-file-icon-color-markdown
      --trees-file-icon-color-mcp
      --trees-file-icon-color-npm
      --trees-file-icon-color-oxc
      --trees-file-icon-color-postcss
      --trees-file-icon-color-prettier
      --trees-file-icon-color-python
      --trees-file-icon-color-react
      --trees-file-icon-color-ruby
      --trees-file-icon-color-rust
      --trees-file-icon-color-sass
      --trees-file-icon-color-svg
      --trees-file-icon-color-svelte
      --trees-file-icon-color-svgo
      --trees-file-icon-color-swift
      --trees-file-icon-color-table
      --trees-file-icon-color-text
      --trees-file-icon-color-tailwind
      --trees-file-icon-color-terraform
      --trees-file-icon-color-typescript
      --trees-file-icon-color-vite
      --trees-file-icon-color-vscode
      --trees-file-icon-color-vue
      --trees-file-icon-color-wasm
      --trees-file-icon-color-webpack
      --trees-file-icon-color-yml
      --trees-file-icon-color-zig
      --trees-file-icon-color-zip

      // Density
      //
      // A unitless scale factor for padding, gaps, and indentation. Usually
      // set via \`density\` on useFileTree. Individual overrides take precedence.
      //
      //   Compact: 0.8
      //   Default: 1
      //   Relaxed: 1.2
      //
      --trees-density-override

      // Available CSS Layout Overrides
      --trees-gap-override
      --trees-border-radius-override
      --trees-font-family-override
      --trees-font-size-override
      --trees-font-weight-regular-override
      --trees-font-weight-semibold-override
      --trees-level-gap-override
      --trees-item-padding-x-override
      --trees-item-margin-x-override
      --trees-item-row-gap-override
      --trees-icon-width-override
      --trees-icon-nudge-override
      --trees-scrollbar-gutter-override
      --trees-padding-inline-override
    */

    --trees-accent: var(--trees-accent-override, #009fff);
    --trees-fg: var(
      --trees-fg-override,
      var(--trees-theme-sidebar-fg, light-dark(#6c6c71, #adadb1))
    );
    --trees-fg-muted: var(
      --trees-fg-muted-override,
      var(--trees-theme-sidebar-header-fg, light-dark(#84848a, #84848a))
    );
    --trees-bg: var(
      --trees-bg-override,
      var(--trees-theme-sidebar-bg, light-dark(#f8f8f8, #141415))
    );
    /* var(--trees-theme-list-hover-bg, light-dark(#dfebff59, #19283c59)) */
    --trees-bg-muted: var(
      --trees-bg-muted-override,
      var(
        --trees-theme-list-hover-bg,
        light-dark(
          color-mix(
            in lab,
            var(--trees-accent) var(--trees-bg-alpha-light, 8%),
            var(--trees-bg)
          ),
          color-mix(
            in lab,
            var(--trees-accent) var(--trees-bg-alpha-dark, 10%),
            var(--trees-bg)
          )
        )
      )
    );
    --trees-input-bg: var(
      --trees-input-bg-override,
      light-dark(#f8f8f8, #070707)
    );

    --trees-added-light: #16a994;
    --trees-added-dark: #00cab1;
    --trees-ignored-light: #adadb1;
    --trees-ignored-dark: #4a4a4e;
    --trees-modified-light: #1ca1c7;
    --trees-modified-dark: #08c0ef;
    --trees-renamed-light: #d5a910;
    --trees-renamed-dark: #ffd452;
    --trees-untracked-light: #16a994;
    --trees-untracked-dark: #00cab1;
    --trees-deleted-light: #ff2e3f;
    --trees-deleted-dark: #ff6762;

    --trees-border-color: var(
      --trees-border-color-override,
      var(--trees-theme-sidebar-border, light-dark(#eeeeef, #070707))
    );
    --trees-indent-guide-bg: var(
      --trees-indent-guide-bg-override,
      color-mix(in lab, var(--trees-fg-muted) 25%, transparent)
    );
    --trees-density: var(--trees-density-override, 1);
    --trees-border-radius: var(
      --trees-border-radius-override,
      calc(6px * var(--trees-density))
    );

    --trees-font-family: var(--trees-font-family-override, system-ui);
    --trees-font-size: var(--trees-font-size-override, 13px);
    --trees-font-weight-regular: var(--trees-font-weight-regular-override, 400);
    --trees-font-weight-semibold: var(
      --trees-font-weight-semibold-override,
      600
    );

    --trees-focus-ring-color: var(
      --trees-focus-ring-color-override,
      var(--trees-theme-focus-ring, var(--trees-accent))
    );
    --trees-focus-ring-width: var(--trees-focus-ring-width-override, 1px);
    --trees-focus-ring-offset: var(--trees-focus-ring-offset-override, -1px);

    --trees-search-fg: var(
      --trees-search-fg-override,
      var(--trees-theme-input-fg, var(--trees-fg))
    );
    --trees-search-font-weight: var(--trees-search-font-weight-override, 600);
    --trees-search-bg: var(
      --trees-search-bg-override,
      var(--trees-theme-input-bg, var(--trees-input-bg))
    );

    --trees-scrollbar-thumb: var(
      --trees-scrollbar-thumb-override,
      var(
        --trees-theme-scrollbar-thumb,
        color-mix(in lab, var(--trees-fg) 25%, var(--trees-bg))
      )
    );

    --trees-selected-fg: var(
      --trees-selected-fg-override,
      var(--trees-theme-list-active-selection-fg, var(--trees-fg))
    );
    --trees-selected-bg: var(
      --trees-selected-bg-override,
      var(
        --trees-theme-list-active-selection-bg,
        light-dark(
          color-mix(in lab, var(--trees-accent) 12%, var(--trees-bg)),
          color-mix(in lab, var(--trees-accent) 15%, var(--trees-bg))
        )
      )
    );
    --trees-selected-focused-border-color: var(
      --trees-selected-focused-border-color-override,
      var(--trees-theme-focus-ring, var(--trees-accent))
    );

    /* Git status (e.g. from Shiki theme gitDecoration.*) */
    --trees-status-added: var(
      --trees-status-added-override,
      var(
        --trees-theme-git-added-fg,
        light-dark(var(--trees-added-light), var(--trees-added-dark))
      )
    );
    --trees-status-ignored: var(
      --trees-status-ignored-override,
      var(
        --trees-theme-git-ignored-fg,
        light-dark(var(--trees-ignored-light), var(--trees-ignored-dark))
      )
    );
    --trees-status-modified: var(
      --trees-status-modified-override,
      var(
        --trees-theme-git-modified-fg,
        light-dark(var(--trees-modified-light), var(--trees-modified-dark))
      )
    );
    --trees-status-renamed: var(
      --trees-status-renamed-override,
      var(
        --trees-theme-git-renamed-fg,
        light-dark(var(--trees-renamed-light), var(--trees-renamed-dark))
      )
    );
    --trees-status-untracked: var(
      --trees-status-untracked-override,
      var(
        --trees-theme-git-untracked-fg,
        light-dark(var(--trees-untracked-light), var(--trees-untracked-dark))
      )
    );
    --trees-status-deleted: var(
      --trees-status-deleted-override,
      var(
        --trees-theme-git-deleted-fg,
        light-dark(var(--trees-deleted-light), var(--trees-deleted-dark))
      )
    );
    --trees-git-modified-color: var(
      --trees-git-modified-color-override,
      var(--trees-status-modified)
    );
    --trees-git-added-color: var(
      --trees-git-added-color-override,
      var(--trees-status-added)
    );
    --trees-git-ignored-color: var(
      --trees-git-ignored-color-override,
      var(--trees-status-ignored)
    );
    --trees-git-deleted-color: var(
      --trees-git-deleted-color-override,
      var(--trees-status-deleted)
    );
    --trees-git-renamed-color: var(
      --trees-git-renamed-color-override,
      var(--trees-status-renamed)
    );
    --trees-git-untracked-color: var(
      --trees-git-untracked-color-override,
      var(--trees-status-untracked)
    );

    --trees-icon-gray: light-dark(#84848a, #adadb1);
    --trees-icon-red: light-dark(#d52c36, #ff6762);
    --trees-icon-vermilion: light-dark(#ff8c5b, #d5512f);
    --trees-icon-orange: light-dark(#d47628, #ffa359);
    --trees-icon-yellow: light-dark(#d5a910, #ffd452);
    --trees-icon-green: light-dark(#199f43, #5ecc71);
    --trees-icon-teal: light-dark(#17a5af, #64d1db);
    --trees-icon-cyan: light-dark(#1ca1c7, #68cdf2);
    --trees-icon-blue: light-dark(#1a85d4, #69b1ff);
    --trees-icon-indigo: light-dark(#693acf, #9d6afb);
    --trees-icon-purple: light-dark(#a631be, #d568ea);
    --trees-icon-pink: light-dark(#d32a61, #ff678d);
    --trees-icon-mauve: light-dark(#594c5b, #79697b);

    --trees-file-icon-color-default: var(
      --trees-file-icon-color,
      var(--trees-icon-gray)
    );
    --trees-file-icon-color-astro: var(
      --trees-file-icon-color,
      var(--trees-icon-purple)
    );
    --trees-file-icon-color-babel: var(
      --trees-file-icon-color,
      var(--trees-icon-yellow)
    );
    --trees-file-icon-color-bash: var(
      --trees-file-icon-color,
      var(--trees-icon-green)
    );
    --trees-file-icon-color-biome: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-bootstrap: var(
      --trees-file-icon-color,
      var(--trees-icon-indigo)
    );
    --trees-file-icon-color-browserslist: var(
      --trees-file-icon-color,
      var(--trees-icon-yellow)
    );
    --trees-file-icon-color-bun: var(
      --trees-file-icon-color,
      var(--trees-icon-mauve)
    );
    --trees-file-icon-color-c: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-cpp: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-claude: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-css: var(
      --trees-file-icon-color,
      var(--trees-icon-indigo)
    );
    --trees-file-icon-color-database: var(
      --trees-file-icon-color,
      var(--trees-icon-purple)
    );
    --trees-file-icon-color-docker: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-eslint: var(
      --trees-file-icon-color,
      var(--trees-icon-indigo)
    );
    --trees-file-icon-color-git: var(
      --trees-file-icon-vermilion,
      var(--trees-icon-vermilion)
    );
    --trees-file-icon-color-go: var(
      --trees-file-icon-color,
      var(--trees-icon-cyan)
    );
    --trees-file-icon-color-graphql: var(
      --trees-file-icon-color,
      var(--trees-icon-pink)
    );
    --trees-file-icon-color-html: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-image: var(
      --trees-file-icon-color,
      var(--trees-icon-pink)
    );
    --trees-file-icon-color-javascript: var(
      --trees-file-icon-color,
      var(--trees-icon-yellow)
    );
    --trees-file-icon-color-json: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-markdown: var(
      --trees-file-icon-color,
      var(--trees-icon-green)
    );
    --trees-file-icon-color-mcp: var(
      --trees-file-icon-color,
      var(--trees-icon-teal)
    );
    --trees-file-icon-color-npm: var(
      --trees-file-icon-color,
      var(--trees-icon-red)
    );
    --trees-file-icon-color-oxc: var(
      --trees-file-icon-cyan,
      var(--trees-icon-cyan)
    );
    --trees-file-icon-color-postcss: var(
      --trees-file-icon-color,
      var(--trees-icon-red)
    );
    --trees-file-icon-color-prettier: var(
      --trees-file-icon-color,
      var(--trees-icon-teal)
    );
    --trees-file-icon-color-python: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-react: var(
      --trees-file-icon-color,
      var(--trees-icon-cyan)
    );
    --trees-file-icon-color-ruby: var(
      --trees-file-icon-color,
      var(--trees-icon-red)
    );
    --trees-file-icon-color-rust: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-sass: var(
      --trees-file-icon-color,
      var(--trees-icon-pink)
    );
    --trees-file-icon-color-svg: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-svelte: var(
      --trees-file-icon-color,
      var(--trees-icon-red)
    );
    --trees-file-icon-color-svgo: var(
      --trees-file-icon-color,
      var(--trees-icon-green)
    );
    --trees-file-icon-color-swift: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-table: var(
      --trees-file-icon-color,
      var(--trees-icon-teal)
    );
    --trees-file-icon-color-text: var(
      --trees-file-icon-color,
      var(--trees-icon-gray)
    );
    --trees-file-icon-color-tailwind: var(
      --trees-file-icon-color,
      var(--trees-icon-cyan)
    );
    --trees-file-icon-color-terraform: var(
      --trees-file-icon-color,
      var(--trees-icon-indigo)
    );
    --trees-file-icon-color-typescript: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-vite: var(
      --trees-file-icon-color,
      var(--trees-icon-purple)
    );
    --trees-file-icon-color-vscode: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-vue: var(
      --trees-file-icon-color,
      var(--trees-icon-green)
    );
    --trees-file-icon-color-wasm: var(
      --trees-file-icon-color,
      var(--trees-icon-indigo)
    );
    --trees-file-icon-color-webpack: var(
      --trees-file-icon-color,
      var(--trees-icon-blue)
    );
    --trees-file-icon-color-yml: var(
      --trees-file-icon-color,
      var(--trees-icon-red)
    );
    --trees-file-icon-color-zig: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );
    --trees-file-icon-color-zip: var(
      --trees-file-icon-color,
      var(--trees-icon-orange)
    );

    --trees-level-gap: var(
      --trees-level-gap-override,
      calc(8px * var(--trees-density))
    );
    --trees-item-padding-x: var(
      --trees-item-padding-x-override,
      calc(8px * var(--trees-density))
    );
    --trees-item-margin-x: var(
      --trees-item-margin-x-override,
      calc(2px * var(--trees-density))
    );
    --trees-item-row-gap: var(
      --trees-item-row-gap-override,
      calc(6px * var(--trees-density))
    );
    --trees-icon-width: var(--trees-icon-width-override, 16px);
    --trees-icon-nudge: var(
      --trees-icon-nudge-override,
      calc(1px * var(--trees-density))
    );
    --trees-row-height: var(--trees-item-height, 30px);
    --trees-git-lane-width: var(--trees-git-lane-width-override, 12px);
    --trees-action-lane-width: var(
      --trees-action-lane-width-override,
      calc(var(--trees-icon-width) + 2px)
    );
    /* Keep the floating trigger aligned with the row's action lane. Going in
       from the root's right edge: the scroll container reserves
       \`--trees-padding-inline\` of effective inset on each side (its asymmetric
       padding formula cancels the scrollbar gutter on the right), the row
       sits inside that inset, and its trailing \`--trees-item-padding-x\` is the
       action lane itself. The trigger's own focus-ring margin then trims one
       pixel back so the button's visible right edge lines up with the lane. */
    --trees-context-menu-trigger-inline-offset: calc(
      var(--trees-padding-inline) + var(--trees-item-padding-x) -
        var(--trees-focus-ring-width)
    );

    --trees-scrollbar-gutter: var(--trees-scrollbar-gutter-override, 6px);
    --trees-padding-inline: var(--trees-padding-inline-override, 16px);

    color-scheme: light dark;
    display: flex;
    flex-direction: column;
    font-size: var(--trees-font-size);
    color: var(--trees-fg);
    background-color: var(--trees-bg);
    --truncate-marker-background-color: var(--trees-bg);
    --truncate-marker-background-overlay-color: transparent;
    font-family: var(--trees-font-family);
    font-weight: var(--trees-font-weight-regular);
  }

  :host([data-file-tree-virtualized='true']) {
    height: 100%;
    overflow: hidden;
  }

  [data-file-tree-virtualized-wrapper='true'] {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  [data-file-tree-virtualized-root='true'] {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  [data-file-tree-virtualized-scroll='true'],
  [data-file-tree-scrollbar-measure='true'] {
    --trees-scrollbar-thumb-current: transparent;
    overflow-y: auto;
    scrollbar-gutter: stable;

    &:hover {
      --trees-scrollbar-thumb-current: var(--trees-scrollbar-thumb);
    }

    &::-webkit-scrollbar {
      width: var(--trees-scrollbar-gutter);
      height: var(--trees-scrollbar-gutter);
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--trees-scrollbar-thumb-current);
      border: 1px solid transparent;
      background-clip: content-box;
      border-radius: calc(var(--trees-scrollbar-gutter) / 2);
    }

    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
  }

  /* These are styles for a temporarily generated element to measure the size
   * of the scrollbar.  It's intended to be somewhat similar in scrollbar style
   * scope to the scrollable tree so \`--trees-scrollbar-gutter-measured\` is an
   * accurate reflection of the size the scrollbar gutter takes up. */
  [data-file-tree-scrollbar-measure='true'] {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    pointer-events: none;
    width: 100px;
    height: 100px;
  }

  @supports (-moz-appearance: none) {
    [data-file-tree-virtualized-scroll='true'],
    [data-file-tree-scrollbar-measure='true'] {
      scrollbar-width: thin;
      scrollbar-color: var(--trees-scrollbar-thumb-current) transparent;
    }
  }

  [data-file-tree-virtualized-scroll='true'] {
    position: relative;
    overflow-y: auto;
    flex: 1 1 0;
    min-height: 0;
    padding-inline: max(
        calc(var(--trees-padding-inline) - var(--trees-item-margin-x)),
        0px
      )
      /* NOTE(amadeus): We can assume that all Webkit based browser gutters
       * will align to the value of '--trees-scrollbar-gutter', however if not, then
       * \`--trees-scrollbar-gutter-measured\` should correct it. Mostly we are
       * hoping to avoid SSR alignment jumps if possible. In non-SSR'd environments
       * \`--trees-scrollbar-gutter-measured\` should always be immediately available.
       */
      max(
        calc(
          var(--trees-padding-inline) - var(--trees-item-margin-x) -
            var(
              --trees-scrollbar-gutter-measured,
              var(--trees-scrollbar-gutter)
            )
        ),
        0px
      );
  }

  @supports (-moz-appearance: none) {
    [data-file-tree-virtualized-scroll='true'] {
      padding-inline: max(
          calc(var(--trees-padding-inline) - var(--trees-item-margin-x)),
          0px
        )
        /* NOTE(amadeus): However on Firefox it can vary a little bit, but most
         * likely the majority of cases will default to a 0px width scrollbar lets
         * inherit that first to avoid SSR jumps. In non-SSR'd environments
         * \`--trees-scrollbar-gutter-measured\` should always be immediately available.
         */
        max(
          calc(
            var(--trees-padding-inline) - var(--trees-item-margin-x) -
              var(--trees-scrollbar-gutter-measured, 0px)
          ),
          0px
        );
    }
  }

  [data-file-tree-sticky-overlay='true'] {
    position: sticky;
    top: 0;
    height: 0;
    z-index: 4;
    overflow: visible;
    pointer-events: none;
  }

  /* The overlay DOM is kept populated even at scrollTop=0 so the browser has
   * the rendered rows on hand the moment scrolling begins — otherwise the
   * compositor paints a scrolled frame before React can mount the overlay,
   * and the topmost sticky folder jumps up by a couple of pixels before it
   * "snaps" into its pinned position. We hide it via CSS whenever the scroll
   * is at the top and no scroll is in progress, so the preview doesn't leak
   * through at rest. \`data-overlay-reveal\` is stamped on the root only when
   * the user initiates a scroll while already at the top — exactly the case
   * where we need the pre-mounted overlay to be visible through the first
   * compositor frame. It is deliberately distinct from the general
   * \`data-is-scrolling\` flag so a scroll that ends at the top (e.g. ArrowUp
   * navigation) re-hides the overlay the instant the scroll lands, rather
   * than waiting for the hover-suppression timer to elapse. */
  [data-file-tree-virtualized-root='true'][data-scroll-at-top='true']:not(
      [data-overlay-reveal]
    )
    [data-file-tree-sticky-overlay='true'] {
    visibility: hidden;
  }

  [data-file-tree-sticky-overlay-content='true'] {
    background-color: var(--trees-bg);
    position: relative;
    pointer-events: none;
  }

  [data-file-tree-virtualized-list='true'] {
    background-color: var(--trees-bg);
    position: relative;
    min-height: 100%;
    width: 100%;
    overflow-anchor: none;

    &[data-is-scrolling] {
      pointer-events: none;
    }
  }

  [data-file-tree-virtualized-sticky-offset='true'] {
    contain: layout size;
  }

  [data-file-tree-virtualized-sticky='true'] {
    position: sticky;
    top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    isolation: isolate;
    /* Promote to its own compositor layer so text inside the window is
     * rasterized once and GPU-translated during scroll. Without this, the
     * browser re-paints the window (and its text) at every scroll frame,
     * which produces visible 1px shake / character tearing. */
    will-change: transform;
  }

  [data-file-tree-search-container] {
    display: flex;
    padding: 0;
    padding-inline: var(--trees-padding-inline);
    margin-bottom: var(--trees-item-row-gap);
  }

  [data-file-tree-search-input] {
    --trees-focus-ring-width: 2px;
    font-family: var(--trees-font-family);
    font-size: var(--trees-font-size);
    flex: 1;
    height: var(--trees-row-height);
    /* 1px breathing room so the focus-visible outline isn't clipped when the
     * input sits flush against the top of the scroll container. */
    margin-block: 1px;
    padding-inline: var(--trees-item-padding-x);
    line-height: var(--trees-row-height);
    color: var(--trees-search-fg);
    background-color: var(--trees-search-bg);
    border: 1px solid var(--trees-border-color);
    border-radius: var(--trees-border-radius);
    outline: none;

    &::placeholder {
      color: color-mix(
        in lab,
        var(--trees-search-fg) 65%,
        var(--trees-search-bg)
      );
    }

    &:focus-visible,
    &[data-file-tree-search-input-fake-focus='true'] {
      outline: var(--trees-focus-ring-width) solid var(--trees-focus-ring-color);
      outline-offset: var(--trees-focus-ring-offset);
    }
  }

  /* The wrapper for the tree items */
  [role='tree'] {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--trees-gap-override, 0);
  }

  /* LIST ITEM */
  [data-type='item'] {
    color: inherit;
    font-family: var(--trees-font-family);
    font-size: var(--trees-font-size);
    text-align: start;
    outline: none;
    background-color: var(--trees-bg);
    border: none;
    position: relative;

    padding: 0 var(--trees-item-padding-x);
    margin: 0 var(--trees-item-margin-x);
    cursor: pointer;
    -webkit-user-select: none;
            user-select: none;
    -webkit-touch-callout: none;
    touch-action: manipulation;
    display: flex;
    flex: 0 0 var(--trees-row-height);
    align-items: center;
    height: var(--trees-row-height);
    line-height: var(--trees-row-height);
    gap: var(--trees-item-row-gap);
    border-radius: var(--trees-border-radius);
    /* Row states may be translucent, so markers paint the tree background first
     * and then the state color on top to avoid compositing the same alpha twice. */
    --truncate-marker-background-color: var(--trees-bg);
    --truncate-marker-background-overlay-color: transparent;
    --truncate-marker-block-inset: 0px;

    &:hover,
    &[data-item-context-hover='true'] {
      background-color: var(--trees-bg-muted);
      --truncate-marker-background-overlay-color: var(--trees-bg-muted);
    }

    &[data-item-focused='true'],
    &:focus-visible {
      z-index: 2;

      /* Flattened segment markers sit high enough to cover the row outline unless
       * their painted background is inset by the focus ring width. */
      [data-item-flattened-subitems] {
        --truncate-marker-block-inset: var(--trees-focus-ring-width);
      }

      &::before {
        position: absolute;
        inset: 0;
        content: '';
        display: block;
        border-radius: var(--trees-border-radius);
        outline: var(--trees-focus-ring-width) solid
          var(--trees-focus-ring-color);
        outline-offset: var(--trees-focus-ring-offset);
        pointer-events: none;
      }

      &[data-item-selected='true']::before {
        outline-color: var(--trees-selected-focused-border-color);
      }
    }

    &[data-item-selected='true'] {
      color: var(--trees-selected-fg);
      background-color: var(--trees-selected-bg);
      --truncate-marker-background-overlay-color: var(--trees-selected-bg);
      z-index: 3;

      [data-item-section='icon'] {
        color: var(--trees-selected-fg);
      }
    }

    &[data-item-search-match='true'] {
      font-weight: var(--trees-search-font-weight);
    }
  }

  [data-type='item'][data-file-tree-sticky-row='true'] {
    pointer-events: auto;
  }

  /* Sticky rows opt back into pointer events because the overlay wrapper is
   * inert. During scroll, put them back under the same hover suppression as
   * the virtualized list so translucent hover states and menu triggers do not
   * paint over rows moving beneath the sticky stack. */
  [data-file-tree-virtualized-root='true'][data-is-scrolling]
    [data-type='item'][data-file-tree-sticky-row='true'] {
    pointer-events: none;
  }

  [data-file-tree-virtualized-root='true'][data-is-scrolling]
    [data-type='item'][data-file-tree-sticky-row='true']:hover:not(
      [data-item-selected='true']
    ),
  [data-file-tree-virtualized-root='true'][data-is-scrolling]
    [data-type='item'][data-file-tree-sticky-row='true'][data-item-context-hover='true']:not(
      [data-item-selected='true']
    ) {
    background-color: var(--trees-bg);
    --truncate-marker-background-overlay-color: transparent;
  }

  [data-item-selected='true']:has(+ [data-item-selected='true']) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  [data-item-selected='true'] + [data-item-selected='true'] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  /* Flattened Directory Parts */
  [data-item-flattened-subitems] {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  [data-item-flattened-subitem]:hover,
  [data-item-flattened-subitem-drag-target='true'] {
    text-decoration: underline;
  }

  /* Icon for each item */
  [data-item-section='icon'] {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--trees-fg-muted);
    fill: currentColor;
    width: var(--trees-icon-width);
  }

  :where([data-item-section='icon'] > [data-icon-token]) {
    color: var(--trees-fg-muted);
  }

  [data-file-tree-colored-icons='true'] {
    [data-icon-token='astro'] {
      color: var(--trees-file-icon-color-astro);
    }
    [data-icon-token='babel'] {
      color: var(--trees-file-icon-color-babel);
    }
    [data-icon-token='bash'] {
      color: var(--trees-file-icon-color-bash);
    }
    [data-icon-token='biome'] {
      color: var(--trees-file-icon-color-biome);
    }
    [data-icon-token='bootstrap'] {
      color: var(--trees-file-icon-color-bootstrap);
    }
    [data-icon-token='browserslist'] {
      color: var(--trees-file-icon-color-browserslist);
    }
    [data-icon-token='bun'] {
      color: var(--trees-file-icon-color-bun);
    }
    [data-icon-token='c'] {
      color: var(--trees-file-icon-color-c);
    }
    [data-icon-token='cpp'] {
      color: var(--trees-file-icon-color-cpp);
    }
    [data-icon-token='claude'] {
      color: var(--trees-file-icon-color-claude);
    }
    [data-icon-token='css'] {
      color: var(--trees-file-icon-color-css);
    }
    [data-icon-token='database'] {
      color: var(--trees-file-icon-color-database);
    }
    [data-icon-token='default'] {
      color: var(--trees-file-icon-color-default);
    }
    [data-icon-token='docker'] {
      color: var(--trees-file-icon-color-docker);
    }
    [data-icon-token='eslint'] {
      color: var(--trees-file-icon-color-eslint);
    }
    [data-icon-token='git'] {
      color: var(--trees-file-icon-color-git);
    }
    [data-icon-token='go'] {
      color: var(--trees-file-icon-color-go);
    }
    [data-icon-token='graphql'] {
      color: var(--trees-file-icon-color-graphql);
    }
    [data-icon-token='html'] {
      color: var(--trees-file-icon-color-html);
    }
    [data-icon-token='image'] {
      color: var(--trees-file-icon-color-image);
    }
    [data-icon-token='javascript'] {
      color: var(--trees-file-icon-color-javascript);
    }
    [data-icon-token='json'] {
      color: var(--trees-file-icon-color-json);
    }
    [data-icon-token='markdown'] {
      color: var(--trees-file-icon-color-markdown);
    }
    [data-icon-token='mcp'] {
      color: var(--trees-file-icon-color-mcp);
    }
    [data-icon-token='npm'] {
      color: var(--trees-file-icon-color-npm);
    }
    [data-icon-token='oxc'] {
      color: var(--trees-file-icon-color-oxc);
    }
    [data-icon-token='postcss'] {
      color: var(--trees-file-icon-color-postcss);
    }
    [data-icon-token='prettier'] {
      color: var(--trees-file-icon-color-prettier);
    }
    [data-icon-token='python'] {
      color: var(--trees-file-icon-color-python);
    }
    [data-icon-token='react'] {
      color: var(--trees-file-icon-color-react);
    }
    [data-icon-token='ruby'] {
      color: var(--trees-file-icon-color-ruby);
    }
    [data-icon-token='rust'] {
      color: var(--trees-file-icon-color-rust);
    }
    [data-icon-token='sass'] {
      color: var(--trees-file-icon-color-sass);
    }
    [data-icon-token='svg'] {
      color: var(--trees-file-icon-color-svg);
    }
    [data-icon-token='svelte'] {
      color: var(--trees-file-icon-color-svelte);
    }
    [data-icon-token='svgo'] {
      color: var(--trees-file-icon-color-svgo);
    }
    [data-icon-token='swift'] {
      color: var(--trees-file-icon-color-swift);
    }
    [data-icon-token='table'] {
      color: var(--trees-file-icon-color-table);
    }
    [data-icon-token='text'] {
      color: var(--trees-file-icon-color-text);
    }
    [data-icon-token='tailwind'] {
      color: var(--trees-file-icon-color-tailwind);
    }
    [data-icon-token='terraform'] {
      color: var(--trees-file-icon-color-terraform);
    }
    [data-icon-token='typescript'] {
      color: var(--trees-file-icon-color-typescript);
    }
    [data-icon-token='vite'] {
      color: var(--trees-file-icon-color-vite);
    }
    [data-icon-token='vscode'] {
      color: var(--trees-file-icon-color-vscode);
    }
    [data-icon-token='vue'] {
      color: var(--trees-file-icon-color-vue);
    }
    [data-icon-token='wasm'] {
      color: var(--trees-file-icon-color-wasm);
    }
    [data-icon-token='webpack'] {
      color: var(--trees-file-icon-color-webpack);
    }
    [data-icon-token='yml'] {
      color: var(--trees-file-icon-color-yml);
    }
    [data-icon-token='zig'] {
      color: var(--trees-file-icon-color-zig);
    }
    [data-icon-token='zip'] {
      color: var(--trees-file-icon-color-zip);
    }
  }

  /* Chevron rotation and visual alignment */
  /* Chevron pointing down */
  [data-icon-name='file-tree-icon-chevron'] {
    &[data-align-capitals='false'] {
      transform: translate(0, var(--trees-icon-nudge));
    }
    &[data-align-capitals='true'] {
      transform: translate(0, 0);
    }
  }

  [data-item-section='content'] {
    flex: 0 1 auto;
    text-align: start;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Breaks middle truncate component to also set this */
    /* white-space: nowrap; */
  }

  [data-item-section='decoration'] {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    justify-content: flex-end;
    text-align: end;
    overflow: hidden;
    color: var(--trees-fg-muted);
  }

  [data-item-section='decoration'] > span {
    min-width: 0;
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  [data-item-section='git'],
  [data-item-section='action'] {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  [data-item-section='git'] {
    width: var(--trees-git-lane-width);
  }

  [data-item-section='action'] {
    width: var(--trees-action-lane-width);
    color: var(--trees-fg-muted);
    fill: currentColor;
    pointer-events: none;
  }

  [data-item-section='git'] > span,
  [data-item-section='action'] > span {
    width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  [data-item-action-affordance='decorative'] {
    opacity: 0.85;
  }

  [data-item-rename-input] {
    appearance: none;
    width: 100%;
    min-width: 0;
    height: calc(var(--trees-row-height) - 4px);
    font-family: inherit;
    font-size: inherit;
    /* line-height: calc(var(--trees-row-height) - 8px); */
    color: inherit;
    background-color: transparent;
    border: 0;
    padding-inline: 6px;
    outline: none;
    box-sizing: border-box;
  }

  [data-item-section='content']:has([data-item-rename-input])
    ~ [data-item-section='action'],
  [data-item-section='content']:has([data-item-rename-input])
    ~ [data-item-section='decoration'] {
    display: none;
  }

  /* Chevron pointing right */
  [aria-expanded='false'][data-item-type='folder']
    > [data-item-section='icon']
    > [data-icon-name='file-tree-icon-chevron'] {
    &[data-align-capitals='true'] {
      transform: rotate(-90deg)
        translate(
          calc(var(--trees-icon-nudge) / 2),
          calc(var(--trees-icon-nudge) / 2)
        );
    }
    &[data-align-capitals='false'] {
      transform: rotate(-90deg)
        translate(
          calc(var(--trees-icon-nudge) / 2 * -1),
          calc(var(--trees-icon-nudge) / 2)
        );
    }
  }

  /* LIST IDENTATION */
  /* Spacing container */
  [data-item-section='spacing'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: var(--trees-row-height);
    padding-left: calc(calc(var(--trees-icon-width) / 2) - 0.5px);

    &:empty {
      padding-left: 0;
    }
  }

  /* Spacing per level */
  [data-item-section='spacing-item'] {
    transform: translateX(-0.25px);
    display: inline-block;
    border-left: 1px solid var(--trees-indent-guide-bg);
    height: 100%;
    margin-right: calc(var(--trees-level-gap) - 1px);
    opacity: 0;
    transition: opacity 150ms ease;

    & + & {
      margin-left: calc(
        var(--trees-item-row-gap) + calc(var(--trees-icon-width) / 2) - 0.5px
      );
    }
  }

  :host(:hover) [data-item-section='spacing-item'] {
    opacity: 0.75;
  }

  /* Git status indicator */

  /* This is a folder that contains a git change */
  [data-item-contains-git-change='true'] > [data-item-section='git'] {
    color: var(--trees-git-modified-color);
    opacity: 0.5;
    fill: currentColor;
  }

  /* These are files that have a git change */
  [data-item-git-status] {
    &
      > :where([data-item-section='icon'])
      > :where(:not([data-icon-name='file-tree-icon-chevron'])) {
      color: var(--trees-item-git-status-color);
    }
    & > [data-item-section='content'] {
      color: var(--trees-item-git-status-color);
    }
    & > [data-item-section='git'] {
      color: var(--trees-item-git-status-color);
      font-weight: var(--trees-font-weight-semibold);
    }
  }

  [data-item-git-status='added'] {
    --trees-item-git-status-color: var(--trees-git-added-color);
  }

  [data-item-git-status='deleted'] {
    --trees-item-git-status-color: var(--trees-git-deleted-color);
  }

  [data-item-git-status='ignored'] {
    --trees-item-git-status-color: var(--trees-git-ignored-color);

    & > [data-item-section='icon'] {
      opacity: 0.5;
    }
  }

  [data-item-section='git'] [data-icon-name='file-tree-icon-dot'] {
    /* this is a nudge to align the dot with the likely lowercase text. it's slightly
    generalizable, but other fonts are gonna need other nudges i assume */
    transform: translateY(calc(0.65ex - 50%));
  }

  [data-item-git-status='modified'] {
    --trees-item-git-status-color: var(--trees-git-modified-color);
  }

  [data-item-git-status='renamed'] {
    --trees-item-git-status-color: var(--trees-git-renamed-color);
  }

  [data-item-git-status='untracked'] {
    --trees-item-git-status-color: var(--trees-git-untracked-color);
  }

  /* Drag and drop */
  [data-item-drag-target='true'] {
    background-color: var(--trees-selected-bg);
  }

  [data-item-dragging='true'] {
    opacity: 0.5;
  }

  /* Lock icon for locked paths (sibling of content) */
  [data-item-section='lock'] {
    flex: 0 0 auto;
    margin-left: auto;
    display: flex;
    align-items: center;
    color: var(--trees-fg-muted);
  }
  [data-item-section='lock'] svg {
    display: block;
  }

  [data-type='header-slot'] {
    display: block;
    flex: 0 0 auto;
  }

  [data-type='context-menu-wash'] {
    position: absolute;
    inset: 0;
    z-index: 3;
    background-color: transparent;
    touch-action: none;
  }

  [data-type='context-menu-anchor'] {
    position: absolute;
    top: 0;
    right: var(--trees-context-menu-trigger-inline-offset);
    z-index: 4;
    display: none;
    align-items: center;

    &[data-visible='true'] {
      display: flex;
    }
  }

  /* Hide the floating trigger while the scroll container is actively moving.
   * The anchor is positioned against the root, not the scroll content, so its
   * \`top\` follows the row via a React state update — one frame behind the
   * compositor. That delay is visible as the trigger hovering over the wrong
   * row during the first frame of a scroll. The \`data-is-scrolling\` flag on
   * the root is flipped synchronously on \`wheel\`/\`touchmove\`/\`keydown\` before
   * the compositor commits the next paint, so this selector hides the anchor
   * in the same frame the scroll begins. */
  [data-file-tree-virtualized-root='true'][data-is-scrolling]
    [data-type='context-menu-anchor'] {
    display: none;
  }

  [data-type='context-menu-anchor'] > slot[name='context-menu'] {
    display: block;
    width: 0;
    min-width: 0;
    flex: 0 0 0;
    overflow: visible;
  }

  /* Single floating context menu trigger */
  [data-type='context-menu-trigger'] {
    all: unset;
    align-items: center;
    justify-content: center;
    width: var(--trees-action-lane-width);
    color: var(--trees-fg-muted);
    fill: currentColor;
    cursor: pointer;
    font-family: var(--trees-font-family);
    font-size: var(--trees-font-size);
    border-top-right-radius: var(--trees-border-radius);
    border-bottom-right-radius: var(--trees-border-radius);
    margin: var(--trees-focus-ring-width);
    height: calc(var(--trees-row-height) - var(--trees-focus-ring-width) * 2);
    border-width: 0;
    transition: color 120ms ease;

    display: flex;
  }

  [data-type='context-menu-trigger']:hover,
  [data-type='context-menu-trigger'][aria-expanded='true'] {
    color: var(--trees-fg);
  }

  /** @pierre/truncate css here, manually copy pasted for now */
  [data-truncate-container] {
    /* CUSTOM TO TREES, TO SUPPORT THE OUTLINE */
    margin-top: -1px;
    margin-bottom: -1px;

    /* Width of the fade from default marker to text */
    --truncate-internal-marker-fade-width: var(
      --truncate-marker-fade-width,
      2px
    );
    /* Width of the solid color between the fade from the default marker to the text */
    --truncate-internal-marker-gap: var(--truncate-marker-gap, 0px);
    /* Opacity of the marker 'color' property, not of the element itself */
    --truncate-internal-marker-opacity: var(--truncate-marker-opacity, 50%);
    /* Opacity of the marker 'color' property specifically for the middle truncate, not opacity of the element itself */
    --truncate-internal-middle-marker-opacity: var(
      --truncate-middle-marker-opacity,
      80%
    );
    /* Background color of the default marker */
    --truncate-internal-marker-background-color: var(
      --truncate-marker-background-color,
      light-dark(white, black)
    );
    --truncate-internal-marker-background-overlay-color: var(
      --truncate-marker-background-overlay-color,
      transparent
    );
    --truncate-internal-marker-block-inset: var(
      --truncate-marker-block-inset,
      0px
    );
    /* Duration of the fade out animation for the marker */
    --truncate-internal-marker-fade-out-duration: var(
      --truncate-marker-fade-out-duration,
      0ms
    );
    /* Duration of the fade in animation for the marker */
    --truncate-internal-marker-fade-in-duration: var(
      --truncate-marker-fade-in-duration,
      100ms
    );

    /* FADE Variant specifics */
    --truncate-internal-fade-marker-color: var(
      --truncate-fade-marker-color,
      #000
    );
    --truncate-internal-fade-marker-width: var(
      --truncate-fade-marker-width,
      0.2lh
    );

    /*
    In some special cases people might be adding spacing in other ways
    that would benefit from being able to override this, however the container
    query below can't use this and would need to be redeclared with the overridden
    value. It's a bad time, but better than nothing.
    */
    --truncate-internal-single-line-height: 1lh;

    height: var(--truncate-internal-single-line-height);
    min-width: 0;
    overflow: hidden;
  }

  [data-truncate-marker] {
    display: flex;
    position: absolute;
    height: var(--truncate-internal-single-line-height);
    padding-block: var(--truncate-internal-marker-block-inset);
    box-sizing: border-box;
    align-items: center;
    background-clip: content-box;
    z-index: 2;
    color: color-mix(
      in srgb,
      currentColor var(--truncate-internal-marker-opacity),
      transparent
    );

    /* Core trick for hiding the marker until overflow occurs */
    opacity: 0;
    transition: opacity var(--truncate-internal-marker-fade-out-duration)
      ease-in-out;
  }

  @container measure (height > 1lh) {
    [data-truncate-marker] {
      opacity: 1;
      transition: opacity var(--truncate-internal-marker-fade-in-duration)
        ease-in-out;
    }
  }

  [data-truncate-grid] {
    display: grid;
    position: relative;
  }

  [data-truncate-content='visible'] {
    white-space: nowrap;
  }

  [data-truncate-content='overflow'] {
    opacity: 0;
    pointer-events: none;
    -webkit-user-select: none;
            user-select: none;
    word-break: break-all;
    margin-top: calc(-1 * var(--truncate-internal-single-line-height));
  }

  [data-truncate-marker-cell] {
    container: measure / size;
    overflow: visible;
    -webkit-user-select: none;
            user-select: none;
    pointer-events: none;
  }

  [data-truncate-container='truncate'] {
    & [data-truncate-grid] {
      grid-template-columns: minmax(0, max-content) 0;
    }
    & [data-truncate-marker] {
      right: 0;
    }
    & [data-truncate-fade] {
      margin-right: calc(-2 * var(--truncate-internal-fade-marker-width));
    }
  }

  [data-truncate-container='fruncate'] {
    & [data-truncate-grid] {
      grid-template-columns: 0 minmax(0, max-content) auto;
    }
    & [data-truncate-content] {
      direction: rtl;
    }
    & [data-truncate-content] > span {
      unicode-bidi: plaintext;
    }
    & [data-truncate-fade] {
      margin-left: calc(-2 * var(--truncate-internal-fade-marker-width));
    }
  }

  [data-truncate-variant='default'] {
    & [data-truncate-marker] {
      background-color: var(--truncate-internal-marker-background-color);
      background-image: linear-gradient(
        var(--truncate-internal-marker-background-overlay-color),
        var(--truncate-internal-marker-background-overlay-color)
      );
    }
    & [data-truncate-marker]::after,
    & [data-truncate-marker]::before {
      content: '';
      position: absolute;
      width: calc(
        var(--truncate-internal-marker-fade-width) +
          var(--truncate-internal-marker-gap)
      );
      inset-block-start: var(--truncate-internal-marker-block-inset);
      height: max(
        0px,
        calc(
          var(--truncate-internal-single-line-height) -
            var(--truncate-internal-marker-block-inset) * 2
        )
      );
      background-color: var(--truncate-internal-marker-background-color);
      background-image: linear-gradient(
        var(--truncate-internal-marker-background-overlay-color),
        var(--truncate-internal-marker-background-overlay-color)
      );
      mask-image: linear-gradient(
        var(--truncate-internal-fade-dir),
        #000 0%,
        #000 var(--truncate-internal-marker-gap),
        transparent 100%
      );
    }
    & [data-truncate-marker]::after {
      --truncate-internal-fade-dir: to right;
      right: calc(
        -1 *
          (
            var(--truncate-internal-marker-fade-width) +
              var(--truncate-internal-marker-gap)
          )
      );
    }
    & [data-truncate-marker]::before {
      --truncate-internal-fade-dir: to left;
      left: calc(
        -1 *
          (
            var(--truncate-internal-marker-fade-width) +
              var(--truncate-internal-marker-gap)
          )
      );
    }
  }

  [data-truncate-variant='fade'] {
    & [data-truncate-marker] {
      background: transparent;
    }
  }

  [data-truncate-fade] {
    box-shadow:
      0 0 calc(var(--truncate-internal-fade-marker-width) / 2)
        var(--truncate-internal-fade-marker-color),
      0 0 var(--truncate-internal-fade-marker-width)
        var(--truncate-internal-fade-marker-color);
    width: calc(var(--truncate-internal-fade-marker-width) * 2);
    height: calc(
      var(--truncate-internal-single-line-height) -
        (var(--truncate-internal-fade-marker-width) * 2)
    );
    margin: var(--truncate-internal-fade-marker-width) 0;
  }

  [data-truncate-group-container='middle'] {
    & [data-truncate-container] {
      --truncate-marker-opacity: var(--truncate-internal-middle-marker-opacity);
    }

    display: flex;
    min-width: 0;

    & > div {
      min-width: 0;
    }

    & > div[data-truncate-segment-priority='1'] {
      flex: 0 1 max-content;
    }
    & > div[data-truncate-segment-priority='2'] {
      flex: 0 999999 max-content;
    }
  }
}
`,rs=`@layer base, unsafe;`;function is(e){return`${rs}
@layer base {
  ${e}
}`}function as(e){return`${rs}
@layer unsafe {
  ${e}
}`}var os=new WeakMap;function ss(e){let t=os.get(e);if(t!=null)return t;let n=document.createElement(`div`);n.setAttribute(_r,`true`);let r=document.createElement(`div`);r.style.position=`relative`,r.style.height=`200%`,n.appendChild(r),e.appendChild(n);let i=Math.max(n.offsetWidth-n.clientWidth,0);return n.remove(),os.set(e,i),i}function cs(e,t){if(!e.isConnected)return;let n=ss(t);if(n==null)return;let r=t.querySelector(`style[${vr}]`),i=r instanceof HTMLStyleElement?r:document.createElement(`style`);r instanceof HTMLStyleElement||(i.setAttribute(vr,``),t.appendChild(i)),i.textContent=`:host { ${yr}: ${n}px; }`}var ls;function us(e){if(typeof CSSStyleSheet<`u`&&typeof CSSStyleSheet.prototype.replaceSync==`function`&&`adoptedStyleSheets`in e){ls??(ls=new CSSStyleSheet,ls.replaceSync(is(ns)));let t=!1;try{e.adoptedStyleSheets=[ls],t=!0}catch{}if(t){e.querySelector(`style[${hr}]`)?.remove();return}}if(e.querySelector(`style[data-file-tree-style]`)==null){let t=document.createElement(`style`);t.setAttribute(hr,``),t.textContent=is(ns),e.prepend(t)}}function ds(e,t){fs(e,t),us(t),cs(e,t)}function fs(e,t){let n=e.querySelector(`template[shadowrootmode="open"], template[data-file-tree-shadowrootmode="open"]`);n instanceof HTMLTemplateElement&&(t.childNodes.length>0||(t.appendChild(n.content.cloneNode(!0)),n.hasAttribute(`shadowrootmode`)&&n.remove()))}if(typeof HTMLElement<`u`&&customElements.get(`file-tree-container`)==null){class e extends HTMLElement{constructor(){super()}connectedCallback(){let e=this.shadowRoot??this.attachShadow({mode:`open`});ds(this,e)}}if(customElements.define(mr,e),typeof document<`u`)for(let e of Array.from(document.querySelectorAll(mr)))e instanceof HTMLElement&&ds(e,e.shadowRoot??e.attachShadow({mode:`open`}))}var ps=e=>e.startsWith(`f::`)?e.slice(3):e;function ms(e){let t=e.lastIndexOf(`/`);return t<0?{parentPath:``,baseName:e}:{parentPath:e.slice(0,t),baseName:e.slice(t+1)}}function hs(e,t){return e===``?t:`${e}/${t}`}function gs({files:e,path:t,isFolder:n,nextBasename:r}){let i=ps(t),a=r.trim();if(a.length===0)return{error:`Name cannot be empty.`};if(a.includes(`/`))return{error:`Name cannot include "/".`};let{parentPath:o,baseName:s}=ms(i);if(a===s)return{nextFiles:e,sourcePath:i,destinationPath:i,isFolder:n};let c=hs(o,a),l=Array(e.length),u=new Set;if(!n){let t=`${c}/`,r=!1;for(let n=0;n<e.length;n++){let a=e[n];if(a!==i&&a.startsWith(t))return{error:`"${c}" already exists.`};let o=a===i?c:a;if(u.has(o))return{error:`"${c}" already exists.`};u.add(o),l[n]=o,a===i&&(r=!0)}return r?{nextFiles:l,sourcePath:i,destinationPath:c,isFolder:n}:{error:`Could not find the selected file to rename.`}}let d=`${i}/`,f=`${c}/`,p=0;for(let t=0;t<e.length;t++){let n=e[t],r=n===i||n.startsWith(d);if(!r&&(n===c||n.startsWith(f)))return{error:`"${c}" already exists.`};let a=r?`${c}${n.slice(i.length)}`:n;if(u.has(a))return{error:`"${c}" already exists.`};u.add(a),l[t]=a,r&&p++}return p===0?{error:`Could not find the selected folder to rename.`}:{nextFiles:l,sourcePath:i,destinationPath:c,isFolder:n}}function _s(e){return e.endsWith(`/`)}function vs(e){let t=e.endsWith(`/`)?e.slice(0,-1):e,n=t.lastIndexOf(`/`),r=n<0?t:t.slice(n+1);return e.endsWith(`/`)?`${r}/`:r}function ys(e){let t=[],n=new Set;for(let r of e)n.has(r)||(n.add(r),t.push(r));let r=new Set;for(let e of t.toSorted((e,t)=>e.length===t.length?e.localeCompare(t):e.length-t.length)){let t=(e.endsWith(`/`)?e.slice(0,-1):e).split(`/`),n=!1;for(let e=0;e<t.length-1;e+=1){let i=`${t.slice(0,e+1).join(`/`)}/`;if(r.has(i)){n=!0;break}}n||r.add(e)}return t.filter(e=>r.has(e))}function bs(e,t){return t.includes(e)?ys(t):[e]}function xs(e,t){return e===t?!0:e==null||t==null?!1:e.kind===t.kind&&e.directoryPath===t.directoryPath&&e.flattenedSegmentPath===t.flattenedSegmentPath&&e.hoveredPath===t.hoveredPath}function Ss(e,t){return{draggedPaths:e,target:t}}function Cs(e,t){if(t.kind!==`directory`||t.directoryPath==null)return!1;for(let n of e)if(_s(n)&&(t.directoryPath===n||t.directoryPath.startsWith(n)))return!0;return!1}function ws(e,t){return t.kind===`root`||t.directoryPath==null?vs(e):t.directoryPath}function Ts(e,t){let n=e.map(e=>{let n=ws(e,t);return n===e?null:{from:e,to:n,type:`move`}}).filter(e=>e!=null);return n.length===0?null:{operations:n,result:{draggedPaths:e,operation:n.length===1?`move`:`batch`,target:t}}}function Es(e,t){if(e===t)return!0;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n+=1)if(e[n]!==t[n])return!1;return!0}function Ds(e,t,n){let{paths:r,preparedInput:i}=e;if(i==null){if(r==null)throw Error(`FileTree requires paths or preparedInput`);return{paths:r,preparedInput:void 0}}let a=i.paths;if(r==null)return{paths:a,preparedInput:i};if(!Es(Zo.preparePaths(r,n==null?{}:{sort:n}),a))throw Error(`FileTree ${t} received paths and preparedInput for different path lists`);return{paths:a,preparedInput:i}}function Os(e){return e.operation===`add`||e.operation===`remove`||e.operation===`move`||e.operation===`batch`}function ks(e,t,n){if(e===t)return n;let r=t.endsWith(`/`)?t:`${t}/`;return e.startsWith(r)?`${n.endsWith(`/`)?n:`${n}/`}${e.slice(r.length)}`:e}function As(e,t){if(e===t)return!0;let n=t.endsWith(`/`)?t:`${t}/`;return e.startsWith(n)}function js(e,t,n=!1){if(e==null)return null;switch(t.operation){case`add`:case`expand`:case`collapse`:case`mark-directory-unloaded`:case`begin-child-load`:case`apply-child-patch`:case`complete-child-load`:case`fail-child-load`:case`cleanup`:return e;case`remove`:return As(e,t.path)?n?e:null:e;case`move`:return ks(e,t.from,t.to);case`batch`:{let r=e;for(let e of t.events)if(r=js(r,e,n),r==null)return null;return r}}}function Ms(e){return{canonicalChanged:e.canonicalChanged,projectionChanged:e.projectionChanged,visibleCountDelta:e.visibleCountDelta}}function Ns(e){switch(e.operation){case`add`:return{...Ms(e),operation:`add`,path:e.path};case`remove`:return{...Ms(e),operation:`remove`,path:e.path,recursive:e.recursive};case`move`:return{...Ms(e),from:e.from,operation:`move`,to:e.to}}}function Ps(e){return{...Ms(e),events:e.events.filter(e=>e.operation===`add`||e.operation===`remove`||e.operation===`move`).map(e=>Ns(e)),operation:`batch`}}function Fs(e){switch(e.operation){case`add`:case`remove`:case`move`:return Ns(e);case`batch`:return Ps(e);default:return null}}function Is(e,t){if(e.size!==t.length)return!1;for(let n of t)if(!e.has(n))return!1;return!0}function Ls(e){let t=e.endsWith(`/`)?e.slice(0,-1):e;if(t.length===0)return[];let n=t.split(`/`);return n.slice(0,-1).map((e,t)=>`${n.slice(0,t+1).join(`/`)}/`)}function Rs(e){return Ls(e).at(-1)??null}function zs(e,t){return t==null?e:e.startsWith(t)?e.slice(t.length):e}function Bs(e){return e.endsWith(`/`)}var Vs=e=>e.toLowerCase();function Hs(e){let t=e.endsWith(`/`)?e.slice(0,-1):e,n=t.lastIndexOf(`/`);return n<0?t:t.slice(n+1)}function Us(e){return e.endsWith(`/`)?e.slice(0,-1):e}function Ws(e,t){return t&&!e.endsWith(`/`)?`${e}/`:e}var Gs=e=>{let t=e.trim();return t.length===0?``:(t.includes(`\\`)?t.replaceAll(`\\`,`/`):t).toLowerCase()},Ks=Symbol(`FILE_TREE_RENAME_VIEW`),qs=512,Js=512;function Ys(e){return e===`top`||e===`center`?e:`nearest`}function Xs(e,t,n){if(e===0)return-1;if(n!=null){let e=t(n);if(e!=null)return e;let r=Ls(n);for(let e=r.length-1;e>=0;--e){let n=r[e];if(n==null)continue;let i=t(n);if(i!=null)return i}}return 0}function Zs(e,t,n){if(e.paths.length===0)return{focusedIndex:-1,getParentIndex:e.getParentIndex,paths:e.paths,posInSetByIndex:e.posInSetByIndex,setSizeByIndex:e.setSizeByIndex};if(t==null)return{focusedIndex:0,getParentIndex:e.getParentIndex,paths:e.paths,posInSetByIndex:e.posInSetByIndex,setSizeByIndex:e.setSizeByIndex};let r=n??(t=>e.visibleIndexByPath.get(t)??null);return{focusedIndex:Xs(e.paths.length,r,t),getParentIndex:e.getParentIndex,paths:e.paths,posInSetByIndex:e.posInSetByIndex,setSizeByIndex:e.setSizeByIndex}}var Qs=class{#e;#t=new Set;#n=new Map;#r=null;#i=null;#a=new Map;#o=new Map;#s=-1;#c=null;#l=!1;#u=e=>-1;#d=new Map;#f=null;#p=null;#m=null;#h=null;#g=null;#_;#v;#y;#b=[];#x=new Int32Array;#S=new Int32Array;#C=void 0;#w=!1;#T=null;#E=``;#D=!1;#O=new Set;#k=[];#A;#j=null;#M=null;#N=null;#P=null;#F=null;#I=null;#L=null;#R=0;#z=null;#B=new Set;#V=0;#H;#U=0;#W=!1;#G=0;#K;constructor(e){let{dragAndDrop:t,fileTreeSearchMode:n,initialSearchQuery:r,initialSelectedPaths:i,renaming:a,onSearchChange:o,paths:s,preparedInput:c,...l}=e,u=Ds({paths:s,preparedInput:c},`constructor`,l.sort);this.#e=l,t!=null&&t!==!1&&(this.#r=t===!0?{}:t),this.#w=a!=null&&a!==!1,a!=null&&a!==!1&&a!==!0&&(this.#C=a.canRename,this.#v=a.onError,this.#_=a.onRename),this.#y=o,this.#A=n??`hide-non-matches`,this.#H=this.#le(u.paths,u.preparedInput);let d=i?.map(e=>this.#Ne(e)).filter(e=>e!=null)??[],f=d.at(-1)??null;d.length>0&&(this.#B=new Set(d),this.#z=f,this.#V=1),this.#je(f,!1),r!=null&&this.#Te(r,!1),this.#K=this.#Re()}destroy(){this.#K?.(),this.#K=null,this.#n.clear(),this.#t.clear(),this.#d.clear(),this.#i=null,this.#he()}focusFirstItem(){this.#be().length>0&&this.#Fe(0)}focusLastItem(){this.#G<=0||(this.#Ie(),this.#Fe(this.#G-1))}focusNextItem(){this.#Ae(1)}focusParentItem(){if(this.#c==null)return;let e=Rs(this.#c);if(e==null)return;let t=this.#Z(e);t>=0&&this.#Fe(t)}focusPath(e){let t=this.#H.getPathInfo(e)?.path??null;if(t==null)return;this.#Ie();let n=this.#Z(t);n>=0&&this.#Fe(n)}scrollToPath(e,t){let n=this.#H.getPathInfo(e)?.path??null;if(n==null)return;this.#Ie();let r=this.#xe(n);r<0||this.#Me(r)!=null&&(t?.focus!==!1&&this.#Fe(r,!1),this.#L={id:this.#R+=1,offset:Ys(t?.offset),visibleIndex:r},this.#De())}focusMountedPathFromInput(e){let t=this.#H.getPathInfo(e)?.path??null;if(t==null)return;let n=this.#Z(t);n>=0&&this.#Fe(n)}focusNearestPath(e){let t=this.resolveNearestVisiblePath(e);if(t==null)return null;let n=this.#Z(t);return n>=0?(this.#Fe(n),this.#be()[n]??t):null}focusPreviousItem(){this.#Ae(-1)}getFocusedIndex(){return this.#s}getFocusedItem(){return this.#c==null?null:this.#Q(this.#c)}getFocusedPath(){return this.#c}getScrollRequest(){return this.#L}clearScrollRequest(e){this.#L?.id===e&&(this.#L=null)}resolveNearestVisiblePath(e){let t=this.#be();if(this.#G===0)return null;if(e==null)return this.#c??t[0]??null;let n=this.#H.getPathInfo(e)?.path??e,r=this.#Z(n);return r>=0?t[r]??n:this.#X(n)??this.#c??t[0]??null}getSelectedPaths(){return[...this.#B]}getSelectionVersion(){return this.#V}getVisibleCount(){return this.#G}getVisibleRows(e,t){if(t<e||this.#G===0)return[];let n=Math.max(0,e),r=Math.min(this.#G-1,t);if(r<n)return[];let i=r-n+1;if(this.#F==null&&!this.#l&&r>=this.#b.length&&i<=Js){let e=[];for(let t=n;t<=r;t+=1){let n=this.#H.getVisibleRowContext(t);if(n==null)break;e.push(this.#ee(n))}return e}if(!this.#l&&r>=this.#b.length&&this.#Ie(),this.#F!=null){let e=Array.from({length:r-n+1},(e,t)=>this.#Se(n+t)),t=new Map,i=e[0]??-1,a=i;for(let n=1;n<=e.length;n+=1){let r=e[n];if(r!=null&&r===a+1){a=r;continue}if(i>=0&&this.#H.getVisibleSlice(i,a).forEach((e,n)=>{t.set(i+n,e)}),r==null){i=-1,a=-1;continue}i=r,a=r}return Array.from({length:r-n+1},(e,r)=>{let i=n+r,a=this.#Se(i),o=t.get(a),s=this.#b[a];if(o==null||s==null)throw Error(`Missing projection row for filtered visible index ${String(i)}`);return this.#$(o,i,a,{ancestorPaths:this.#re(a),path:s})})}return this.#H.getVisibleSlice(n,r).map((e,t)=>{let r=n+t,i=this.#b[r];if(i==null)throw Error(`Missing projection path for visible index ${String(r)}`);return this.#$(e,r,r,{ancestorPaths:this.#re(r),path:i})})}getStickyRowCandidates(e,t){if(this.#F!=null)return null;if(this.#G===0||e<=0||t<=0)return[];let n=[];for(let r=0;r<this.#G;r+=1){let i=e+r*t,a=Math.min(this.#G-1,Math.floor(i/t)),o=this.#te(a,r)??(a>0?this.#te(a-1,r):void 0);if(o==null)break;n.push({row:this.#ee(o),subtreeEndIndex:o.subtreeEndIndex})}return n}getItem(e){let t=this.#H.getPathInfo(e);return t==null?null:this.#Q(t.path,t)}resolveMountedDirectoryPathFromInput(e){let t=this.#H.getPathInfo(e);return t?.kind===`directory`?t.path:null}toggleMountedDirectoryFromInput(e){let t=this.resolveMountedDirectoryPathFromInput(e);t!=null&&this.#ze(t)}selectAllVisiblePaths(){this.#Ie();let e=[...this.#be()];this.#ae(e,this.#c??this.#z)}selectOnlyPath(e){let t=this.#Ne(e);t!=null&&this.#ae([t],t)}selectOnlyMountedPathFromInput(e){this.#ae([e],e)}selectPath(e){let t=this.#Ne(e);t==null||this.#B.has(t)||this.#ae([...this.#B,t])}deselectPath(e){let t=this.#Ne(e);t==null||!this.#B.has(t)||this.#ae([...this.#B].filter(e=>e!==t))}toggleFocusedSelection(){this.#c!=null&&this.togglePathSelectionFromInput(this.#c)}togglePathSelection(e){let t=this.#Ne(e);if(t!=null){if(this.#B.has(t)){this.deselectPath(t);return}this.selectPath(t)}}togglePathSelectionFromInput(e){let t=this.#Ne(e);if(t!=null){if(this.#B.has(t)){this.#ae([...this.#B].filter(e=>e!==t),t);return}this.#ae([...this.#B,t],t)}}selectPathRange(e,t){let n=this.#Ne(e);if(n==null)return;this.#Ie();let r=this.#z,i=r==null?-1:this.#Ce(r),a=this.#Ce(n);if(i===-1||a===-1){let e=t?[...this.#B,n]:[n];this.#ae(e,n);return}let[o,s]=i<=a?[i,a]:[a,i],c=this.#be().slice(o,s+1),l=t?[...this.#B,...c]:c;this.#ae(l,r)}extendSelectionFromFocused(e){if(this.#c==null)return;let t=this.#s;if(t===-1)return;let n=Math.min(this.#G-1,Math.max(0,t+e));if(n===t)return;!this.#l&&n>=this.#b.length&&this.#Ie();let r=this.#be(),i=r[t]??null,a=r[n]??null;if(i==null||a==null)return;let o=new Set(this.#B);o.has(i)&&o.has(a)?o.delete(i):o.add(a),this.#ae([...o],this.#z??i,!1),this.#Fe(n)}getDragAndDropConfig(){return this.#r}isDragAndDropEnabled(){return this.#r!=null}getDragSession(){return this.#i==null?null:{draggedPaths:[...this.#i.draggedPaths],primaryPath:this.#i.primaryPath,target:this.#i.target==null?null:{...this.#i.target}}}startDrag(e){if(this.#r==null)return!1;let t=this.#Ne(e);if(t==null||this.#M!=null&&this.#M.length>0)return!1;let n=this.getSelectedPaths(),r=bs(t,n);return this.#r.canDrag?.(r)===!1?!1:(n.includes(t)||this.#ae([t],t,!1),this.#Pe(t),this.#i={draggedPaths:r,primaryPath:t,target:null},this.#De(),!0)}setDragTarget(e){let t=this.#i;if(t==null)return;let n=e;if(n!=null){let e=Ss(t.draggedPaths,n);(Cs(t.draggedPaths,n)||this.#r?.canDrop?.(e)===!1)&&(n=null)}xs(t.target,n)||(this.#i={...t,target:n},this.#De())}cancelDrag(){this.#i!=null&&(this.#i=null,this.#De())}completeDrag(){let e=this.#i;if(e==null)return!1;this.#i=null;let t=e.target==null?null:{...e.target};if(t==null)return this.#De(),!1;let n=Ss(e.draggedPaths,t);if(Cs(e.draggedPaths,t)||this.#r?.canDrop?.(n)===!1)return this.#De(),!1;let r=Ts(e.draggedPaths,t);if(r==null)return this.#De(),!1;try{if(r.operations.length===1){let e=r.operations[0];if(e==null||e.type!==`move`)throw Error(`Expected a single move operation for one-item drops`);this.#H.move(e.from,e.to,{collision:e.collision})}else this.#ce(r.operations),this.#H.batch(r.operations)}catch(e){return this.#De(),this.#r?.onDropError?.(e instanceof Error?e.message:String(e),n),!1}return this.#r?.onDropComplete?.(r.result),!0}subscribe(e){return this.#t.add(e),e(),()=>{this.#t.delete(e)}}add(e){this.#H.add(e)}remove(e,t={}){this.#H.remove(e,t)}move(e,t,n={}){this.#H.move(e,t,n)}batch(e){this.#H.batch(e)}onMutation(e,t){let n=e,r=t,i=this.#n.get(n);return i??(i=new Set,this.#n.set(n,i)),i.add(r),()=>{let e=this.#n.get(n);e?.delete(r),e?.size===0&&this.#n.delete(n)}}setSearch(e){this.#Te(e,!0)}openSearch(e=``){this.#Te(e,!0)}closeSearch(){this.#Te(null,!0)}isSearchOpen(){return this.#M!==null}getSearchValue(){return this.#M??``}getSearchMatchingPaths(){return this.#k}focusNextSearchMatch(){this.#we(1)}focusPreviousSearchMatch(){this.#we(-1)}startRenaming(e=this.#c??``,t={}){if(!this.#w)return!1;let n=this.#H.getPathInfo(e);if(n==null)return!1;let r=n.path,i=Bs(r),a=Us(r);if(this.#C?.({isFolder:i,path:a})===!1)return!1;for(let e of Ls(r))this.#H.isExpanded(e)||this.#H.expand(e);return this.#ae([r],r,!1),this.#M!=null&&(this.#Te(null,!1),this.#y?.(this.#M)),this.#Pe(r),this.#T=r,this.#E=Hs(r),this.#D=t.removeIfCanceled??!1,this.#De(),!0}[Ks](){return{cancel:()=>{this.#q()},commit:()=>{this.#J()},getPath:()=>this.#T,getValue:()=>this.#E,isActive:()=>this.#T!=null,setValue:e=>{this.#Y(e)}}}#q(){if(this.#T==null)return;let e=this.#T,t=this.#D;if(this.#T=null,this.#E=``,this.#D=!1,t){this.remove(e,Bs(e)?{recursive:!0}:void 0);return}this.#Pe(e),this.#De()}#J(){let e=this.#T;if(e==null)return;if(this.#D&&this.#E.trim().length===0){this.#T=null,this.#E=``,this.#D=!1,this.remove(e,Bs(e)?{recursive:!0}:void 0);return}let t=Bs(e),n=gs({files:this.#H.list(),isFolder:t,nextBasename:this.#E,path:Us(e)});if(this.#T=null,this.#E=``,this.#D=!1,`error`in n){this.#Pe(e),this.#v?.(n.error),this.#De();return}if(n.sourcePath===n.destinationPath){this.#Pe(e),this.#De();return}this.#_?.({destinationPath:n.destinationPath,isFolder:n.isFolder,sourcePath:n.sourcePath}),this.move(Ws(n.sourcePath,t),Ws(n.destinationPath,t))}#Y(e){this.#T==null||this.#E===e||(this.#E=e,this.#De())}resetPaths(e,t={}){let n=this.#H.list().length,r=this.#G,i=Ds({paths:e,preparedInput:t.preparedInput},`resetPaths`,this.#e.sort),a=this.#le(i.paths,i.preparedInput,t.initialExpandedPaths),o=this.#c,s=this.#T,c=this.getSelectedPaths(),l=this.#z;this.#K?.(),this.#H=a,this.#d.clear(),this.#he();let u=c.map(e=>a.getPathInfo(e)?.path??null).filter(e=>e!=null),d=!Is(this.#B,u);this.#B=new Set(u),d&&(this.#V+=1),this.#z=l==null?null:a.getPathInfo(l)?.path??null,this.#T=s==null?null:a.getPathInfo(s)?.path??null,this.#T??(this.#E=``,this.#D=!1),this.#je(o,o!=null||u.length>0||this.#z!=null),this.#K=this.#Re(),this.#De(),this.#Oe({canonicalChanged:!0,operation:`reset`,pathCountAfter:i.paths.length,pathCountBefore:n,projectionChanged:!0,usedPreparedInput:t.preparedInput!=null,visibleCountDelta:this.#G-r})}#X(e){this.#Ie();let t=Rs(e),n=zs(e,t),r=null,i=null;for(let e of this.#be()){if(Rs(e)!==t)continue;let a=zs(e,t);if(a<n){r=e;continue}if(a>n){i=e;break}}return r??i}#Z(e){let t=this.#Ce(e);if(t!==-1)return t;let n=Ls(e);for(let e=n.length-1;e>=0;--e){let t=n[e];if(t==null)continue;let r=this.#Ce(t);if(r!==-1)return r}return this.#be().length>0?0:-1}#Q(e,t){let n=this.#d.get(e);if(n!=null)return n;let r=t??this.#H.getPathInfo(e);if(r==null)return null;let i=r.kind===`directory`?this.#oe(r.path):this.#se(r.path);return this.#d.set(r.path,i),i}#$(e,t,n,r){return{ancestorPaths:r.ancestorPaths,depth:e.depth,flattenedSegments:e.flattenedSegments?.map(e=>({isTerminal:e.isTerminal,name:e.name,path:e.path})),hasChildren:e.hasChildren,index:t,isExpanded:e.isExpanded,isFlattened:e.isFlattened,isFocused:r.path===this.#c,isSelected:this.#B.has(r.path),kind:e.kind,level:e.depth,name:e.name,path:r.path,posInSet:r.posInSet??this.#x[n]??0,setSize:r.setSize??this.#S[n]??0}}#ee(e){return this.#$(e.row,e.index,e.index,{ancestorPaths:e.ancestorPaths,path:e.row.path,posInSet:e.posInSet,setSize:e.setSize})}#te(e,t){let n=this.#H.getVisibleRowContext(e);return n==null?void 0:n.ancestorRows[t]??(t===n.ancestorRows.length&&n.row.kind===`directory`&&n.row.isExpanded?n:void 0)}#ne(e){let t=this.#a.get(e);if(t!=null)return t;let n=this.#u(e),r=n<0?[]:[...this.#ne(n),n];return this.#a.set(e,r),r}#re(e){let t=this.#o.get(e);if(t!=null)return t;let n=this.#ne(e).map(e=>this.#b[e]??``).filter(e=>e!==``);return this.#o.set(e,n),n}#ie(e){this.#H.collapse(e)}#ae(e,t=this.#z,n=!0){let r=[...new Set(e)],i=!Is(this.#B,r),a=this.#z!==t;!i&&!a||(this.#B=new Set(r),this.#z=t,i&&(this.#V+=1),n&&this.#De())}#oe(e){return{collapse:()=>{this.#ie(e)},deselect:()=>{this.deselectPath(e)},expand:()=>{this.#ke(e)},focus:()=>{this.focusPath(e)},getPath:()=>e,isDirectory:()=>!0,isExpanded:()=>this.#H.isExpanded(e),isFocused:()=>this.#c===e,isSelected:()=>this.#B.has(e),select:()=>{this.selectPath(e)},toggleSelect:()=>{this.togglePathSelection(e)},toggle:()=>{this.#ze(e)}}}#se(e){return{deselect:()=>{this.deselectPath(e)},focus:()=>{this.focusPath(e)},getPath:()=>e,isDirectory:()=>!1,isFocused:()=>this.#c===e,isSelected:()=>this.#B.has(e),select:()=>{this.selectPath(e)},toggleSelect:()=>{this.togglePathSelection(e)}}}#ce(e){let t=this.#H.list();this.#le(t).batch(e)}#le(e,t,n){return new Zo({...this.#e,paths:e,preparedInput:t??void 0,...n===void 0?{}:{initialExpandedPaths:n}})}#ue(){return this.#h??=this.#H.list(),this.#h}#de(){if(this.#m!=null)return this.#m;let e=new Set;for(let t of this.#ue()){e.add(t);for(let n of Ls(t))e.add(n)}return this.#m=[...e].sort(),this.#m}#fe(){return this.#g??=this.#ue().map(Vs),this.#g}#pe(){return this.#f??=this.#de().filter(e=>e.endsWith(`/`)),this.#f}#me(){return this.#p??=this.#pe().map(Vs),this.#p}#he(){this.#f=null,this.#p=null,this.#m=null,this.#h=null,this.#g=null}#ge(){return this.#pe().filter(e=>this.#H.isExpanded(e))}#_e(e){let t=new Set(this.#j??[]);if(e)for(let e of this.#B)for(let n of Ls(e))t.add(n);this.#ve(t)}#ve(e){this.#W=!0;try{for(let t of this.#pe()){let n=e.has(t),r=this.#H.isExpanded(t);n&&!r?this.#H.expand(t):!n&&r&&this.#H.collapse(t)}}finally{this.#W=!1}}#ye(){if(this.#M==null||this.#M.length===0){this.#k=[],this.#F=null,this.#I=null,this.#P=null,this.#G=this.#U;return}let e=this.#b;if(this.#k=e.filter(e=>this.#O.has(e)),this.#A!==`hide-non-matches`||this.#O.size===0){this.#F=null,this.#I=null,this.#P=null,this.#G=this.#U;return}let t=[],n=[],r=new Map;for(let[i,a]of e.entries())this.#N?.has(a)===!0&&(r.set(a,n.length),t.push(i),n.push(a));this.#F=t,this.#I=n,this.#P=r,this.#G=n.length}#be(){return this.#I??this.#b}#xe(e){return this.#I==null?this.#H.getVisibleIndex(e)??-1:this.#P?.get(e)??-1}#Se(e){return this.#F?.[e]??e}#Ce(e){return this.#P?.get(e)??this.#H.getVisibleIndex(e)??-1}#we(e){let t=this.#k;if(t.length===0)return;let n=this.#c,r=n==null?-1:t.indexOf(n),i=t[r<0?e>0?0:t.length-1:Math.min(t.length-1,Math.max(0,r+e))];i!=null&&this.focusPath(i)}#Te(e,t){let n=e==null?null:Gs(e),r=this.#M;if(r!==n){if(r==null&&n!=null&&(this.#j=this.#ge()),this.#M=n,n==null)this.#_e(!0),this.#j=null,this.#O.clear(),this.#N=null,this.#je(this.#c,!0);else if(n.length===0)this.#_e(!1),this.#O.clear(),this.#N=null,this.#je(this.#c,!0);else{let e=this.#Ee();this.#je(e,!0)}t&&(this.#y?.(this.#M),this.#De())}}#Ee(){if(this.#M==null||this.#M.length===0)return this.#O.clear(),this.#c;let e=this.#M,t=this.#ue(),n=this.#fe(),r=[],i=new Set,a=null;for(let o=0;o<t.length;o+=1){if(!n[o].includes(e))continue;let s=t[o];r.push(s),i.add(s),a??=s}let o=this.#pe(),s=this.#me();for(let t=0;t<o.length;t+=1){if(!s[t].includes(e))continue;let n=o[t];i.has(n)||(r.push(n),i.add(n),a??=n)}this.#O=i;let c=this.#A===`hide-non-matches`&&r.length>0?new Set:null;this.#N=c;let l=this.#A===`expand-matches`?new Set(this.#j??[]):new Set;for(let e of r){c?.add(e),e.endsWith(`/`)&&l.add(e);for(let t of Ls(e))l.add(t),c?.add(t)}return this.#ve(l),a??this.#c}#De(){for(let e of this.#t)e()}#Oe(e){this.#n.get(e.operation)?.forEach(t=>{t(e)}),this.#n.get(`*`)?.forEach(t=>{t(e)})}#ke(e){for(let t of Ls(e))this.#H.isExpanded(t)||this.#H.expand(t);this.#H.isExpanded(e)||this.#H.expand(e)}#Ae(e){let t=this.#G;if(t===0)return;let n=this.#s===-1?0:this.#s,r=Math.min(t-1,Math.max(0,n+e));(r!==n||this.#s===-1)&&(!this.#l&&this.#F==null&&r>=this.#b.length&&this.#Ie(),this.#Fe(r))}#je(e,t=!0){let n=this.#H.getVisibleCount();this.#U=n;let r=Zs(this.#H.getVisibleTreeProjectionData(t?void 0:Math.min(n,qs)),e,t?e=>this.#H.getVisibleIndex(e):void 0);this.#a.clear(),this.#o.clear(),this.#l=r.paths.length>=n,this.#u=r.getParentIndex,this.#b=r.paths,this.#x=r.posInSetByIndex,this.#S=r.setSizeByIndex,this.#ye(),this.#s=e==null?this.#be().length>0?0:-1:this.#Z(e),this.#c=this.#s<0?null:this.#Me(this.#s)}#Me(e){return this.#be()[e]??(this.#F==null?this.#H.getVisibleRowContext(e)?.row.path??null:null)}#Ne(e){return this.#H.getPathInfo(e)?.path??null}#Pe(e){if(e==null)return;let t=this.#Z(e);t>=0&&this.#Fe(t,!1)}#Fe(e,t=!0){let n=this.#Me(e);n!=null&&(this.#s===e&&this.#c===n||(this.#s=e,this.#c=n,t&&this.#De()))}#Ie(){this.#l||this.#je(this.#c,!0)}#Le(e){let t=js(this.#T,e);t==null&&this.#T!=null&&(this.#E=``),this.#T=t;let n=js(this.#c,e,!0),r=[...this.#B].map(t=>js(t,e)).filter(e=>e!=null).map(e=>this.#H.getPathInfo(e)?.path??null).filter(e=>e!=null),i=js(this.#z,e),a=i==null?null:this.#H.getPathInfo(i)?.path??null,o=[...new Set(r)];return Is(this.#B,o)||(this.#B=new Set(o),this.#V+=1),this.#z=a,n}#Re(){return this.#H.on(`*`,e=>{if(this.#W)return;e.canonicalChanged&&(this.#d.clear(),this.#he()),this.#i!=null&&Os(e)&&(this.#i=null);let t=Os(e)?this.#Le(e):this.#c,n=this.#M!=null&&this.#M.length>0?this.#Ee():this.#M===``?this.#c:t,r=this.#M!=null||e.operation!==`expand`&&e.operation!==`collapse`;this.#je(n,r),this.#De();let i=Fs(e);i!=null&&this.#Oe(i)})}#ze(e){if(this.#H.isExpanded(e)){this.#ie(e);return}this.#ke(e)}},$s=e=>{if(e==null||e.length===0)return`0`;let t=`${e.length}`;for(let n of e)t+=`\0${n.path}\0${n.status}`;return t};function ec(e){let t=e.endsWith(`/`),n=``,r=-1;for(let t=0;t<=e.length;t+=1){if(!(e[t]===`/`||t===e.length)){r===-1&&(r=t);continue}r!==-1&&(n!==``&&(n+=`/`),n+=e.slice(r,t),r=-1)}return n===``?null:{isDirectory:t,path:n}}function tc(e){let t=e.endsWith(`/`)?e.slice(0,-1):e;if(t.length===0)return[];let n=t.split(`/`);return n.slice(0,-1).map((e,t)=>`${n.slice(0,t+1).join(`/`)}/`)}function nc(e,t){return t?`${e}/`:e}function rc(e,t=null){let n=$s(e==null?void 0:[...e]);if(n===`0`)return null;if(t?.signature===n)return t;let r=new Map,i=new Set,a=new Set;for(let t of e??[]){let e=ec(t.path);if(e==null)continue;let n=nc(e.path,e.isDirectory);r.set(n,t.status),t.status===`ignored`&&e.isDirectory?a.add(n):e.isDirectory&&a.delete(n);for(let t of tc(e.path))i.add(t)}return{directoriesWithChanges:i,ignoredDirectoryPaths:a,signature:n,statusByPath:r}}var Z,ic,ac,oc,sc,cc,lc,uc,dc,fc,pc={},mc=[],hc=Array.isArray,gc=mc.slice,_c=Object.assign;function vc(e){e&&e.parentNode&&e.remove()}function yc(e,t,n){var r,i,a,o={};for(a in t)a==`key`?r=t[a]:a==`ref`&&typeof e!=`function`?i=t[a]:o[a]=t[a];return arguments.length>2&&(o.children=arguments.length>3?gc.call(arguments,2):n),bc(e,o,r,i,null)}function bc(e,t,n,r,i){var a={type:e,props:t,key:n,ref:r,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:i??++ic,__i:-1,__u:0};return i==null&&Z.vnode!=null&&Z.vnode(a),a}function xc(e){return e.children}function Sc(e,t){this.props=e,this.context=t,this.__g=0}function Cc(e,t){if(t==null)return e.__?Cc(e.__,e.__i+1):null;for(var n;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null)return n.__e;return typeof e.type==`function`?Cc(e):null}function wc(e){var t,n;if((e=e.__)!=null&&e.__c!=null){for(e.__e=null,t=0;t<e.__k.length;t++)if((n=e.__k[t])!=null&&n.__e!=null){e.__e=n.__e;break}return wc(e)}}function Tc(e){(8&e.__g||!(e.__g|=8)||!ac.push(e)||sc++)&&oc==Z.debounceRendering||((oc=Z.debounceRendering)||queueMicrotask)(Ec)}function Ec(){for(var e,t,n,r,i,a,o,s,c=1;ac.length;)ac.length>c&&ac.sort(cc),e=ac.shift(),c=ac.length,8&e.__g&&(n=void 0,i=(r=(t=e).__v).__e,a=[],o=[],(s=t.__P)&&((n=_c({},r)).__v=r.__v+1,Z.vnode&&Z.vnode(n),Pc(s,n,r,t.__n,s.namespaceURI,32&r.__u?[i]:null,a,i??Cc(r),!!(32&r.__u),o,s.ownerDocument),n.__v=r.__v,n.__.__k[n.__i]=n,Ic(a,n,o),n.__e!=i&&wc(n)));sc=0}function Dc(e,t,n,r,i,a,o,s,c,l,u,d){var f,p,m,h,g,_,v,y=r&&r.__k||mc,b=t.length;for(c=Oc(n,t,y,c,b),f=0;f<b;f++)(m=n.__k[f])!=null&&(p=m.__i==-1?pc:y[m.__i]||pc,m.__i=f,_=Pc(e,m,p,i,a,o,s,c,l,u,d),h=m.__e,m.ref&&p.ref!=m.ref&&(p.ref&&zc(p.ref,null,m),u.push(m.ref,m.__c||h,m)),g==null&&h!=null&&(g=h),(v=!!(4&m.__u))||p.__k===m.__k?c=kc(m,c,e,v):typeof m.type==`function`&&_!==void 0?c=_:h&&(c=h.nextSibling),m.__u&=-7);return n.__e=g,c}function Oc(e,t,n,r,i){var a,o,s,c,l,u=n.length,d=u,f=0;for(e.__k=Array(i),a=0;a<i;a++)(o=t[a])!=null&&typeof o!=`boolean`&&typeof o!=`function`?(c=a+f,(o=e.__k[a]=typeof o==`string`||typeof o==`number`||typeof o==`bigint`||o.constructor==String?bc(null,o,null,null,null):hc(o)?bc(xc,{children:o},null,null,null):o.constructor==null&&o.__b>0?bc(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o).__=e,o.__b=e.__b+1,s=null,(l=o.__i=Ac(o,n,c,d))!=-1&&(d--,(s=n[l])&&(s.__u|=2)),s==null||s.__v==null?(l==-1&&(i>u?f--:i<u&&f++),typeof o.type!=`function`&&(o.__u|=4)):l!=c&&(l==c-1?f--:l==c+1?f++:(l>c?f--:f++,o.__u|=4))):e.__k[a]=null;if(d)for(a=0;a<u;a++)(s=n[a])!=null&&!(2&s.__u)&&(s.__e==r&&(r=Cc(s)),Bc(s,s));return r}function kc(e,t,n,r){var i,a;if(typeof e.type==`function`){for(i=e.__k,a=0;i&&a<i.length;a++)i[a]&&(i[a].__=e,t=kc(i[a],t,n,r));return t}e.__e!=t&&(r&&(t&&e.type&&!t.parentNode&&(t=Cc(e)),n.insertBefore(e.__e,t||null)),t=e.__e);do t&&=t.nextSibling;while(t!=null&&t.nodeType==8);return t}function Ac(e,t,n,r){var i,a,o,s=e.key,c=e.type,l=t[n],u=l!=null&&(2&l.__u)==0;if(l===null&&e.key==null||u&&s==l.key&&c==l.type)return n;if(r>+!!u){for(i=n-1,a=n+1;i>=0||a<t.length;)if((l=t[o=i>=0?i--:a++])!=null&&!(2&l.__u)&&s==l.key&&c==l.type)return o}return-1}function jc(e,t,n){t[0]==`-`?e.setProperty(t,n??``):e[t]=n??``}function Mc(e,t,n,r,i){var a;n:if(t==`style`)if(typeof n==`string`)e.style.cssText=n;else{if(typeof r==`string`&&(e.style.cssText=r=``),r)for(t in r)n&&t in n||jc(e.style,t,``);if(n)for(t in n)r&&n[t]==r[t]||jc(e.style,t,n[t])}else if(t[0]==`o`&&t[1]==`n`)a=t!=(t=t.replace(lc,`$1`)),(t=t.slice(2))[0].toLowerCase()!=t[0]&&(t=t.toLowerCase()),e.__l||={},e.__l[t+a]=n,n?r?n.l=r.l:(n.l=uc,e.addEventListener(t,a?fc:dc,a)):e.removeEventListener(t,a?fc:dc,a);else{if(i==`http://www.w3.org/2000/svg`)t=t.replace(/xlink(H|:h)/,`h`).replace(/sName$/,`s`);else if(t!=`width`&&t!=`height`&&t!=`href`&&t!=`list`&&t!=`form`&&t!=`tabIndex`&&t!=`download`&&t!=`rowSpan`&&t!=`colSpan`&&t!=`role`&&t!=`popover`&&t in e)try{e[t]=n??``;break n}catch{}typeof n==`function`||(n==null||!1===n&&t[4]!=`-`?e.removeAttribute(t):e.setAttribute(t,t==`popover`&&n==1?``:n))}}function Nc(e){return function(t){if(this.__l){var n=this.__l[t.type+e];if(t.u==null)t.u=uc++;else if(t.u<n.l)return;return n(Z.event?Z.event(t):t)}}}function Pc(e,t,n,r,i,a,o,s,c,l,u){var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j,M=t.type;if(t.constructor!=null)return null;128&n.__u&&(c=!!(32&n.__u),n.__c.__z&&(s=t.__e=n.__e=(a=n.__c.__z)[0],n.__c.__z=null)),(d=Z.__b)&&d(t);n:if(typeof M==`function`)try{if(v=t.props,y=`prototype`in M&&M.prototype.render,b=(d=M.contextType)&&r[d.__c],x=d?b?b.props.value:d.__:r,n.__c?2&(f=t.__c=n.__c).__g&&(f.__g|=1,_=!0):(y?t.__c=f=new M(v,x):(t.__c=f=new Sc(v,x),f.constructor=M,f.render=Vc),b&&b.sub(f),f.props=v,f.state||={},f.context=x,f.__n=r,p=!0,f.__g|=8,f.__h=[],f._sb=[]),y&&f.__s==null&&(f.__s=f.state),y&&M.getDerivedStateFromProps!=null&&(f.__s==f.state&&(f.__s=_c({},f.__s)),_c(f.__s,M.getDerivedStateFromProps(v,f.__s))),m=f.props,h=f.state,f.__v=t,p)y&&M.getDerivedStateFromProps==null&&f.componentWillMount!=null&&f.componentWillMount(),y&&f.componentDidMount!=null&&f.__h.push(f.componentDidMount);else{if(y&&M.getDerivedStateFromProps==null&&v!==m&&f.componentWillReceiveProps!=null&&f.componentWillReceiveProps(v,x),!(4&f.__g)&&f.shouldComponentUpdate!=null&&!1===f.shouldComponentUpdate(v,f.__s,x)||t.__v==n.__v){for(t.__v!=n.__v&&(f.props=v,f.state=f.__s,f.__g&=-9),t.__e=n.__e,t.__k=n.__k,t.__k.some(function(e){e&&(e.__=t)}),S=0;S<f._sb.length;S++)f.__h.push(f._sb[S]);f._sb=[],f.__h.length&&o.push(f);break n}f.componentWillUpdate!=null&&f.componentWillUpdate(v,f.__s,x),y&&f.componentDidUpdate!=null&&f.__h.push(function(){f.componentDidUpdate(m,h,g)})}if(f.context=x,f.props=v,f.__P=e,f.__g&=-5,C=Z.__r,w=0,y){for(f.state=f.__s,f.__g&=-9,C&&C(t),d=f.render(f.props,f.state,f.context),T=0;T<f._sb.length;T++)f.__h.push(f._sb[T]);f._sb=[]}else do f.__g&=-9,C&&C(t),d=f.render(f.props,f.state,f.context),f.state=f.__s;while(8&f.__g&&++w<25);f.state=f.__s,f.getChildContext!=null&&(r=_c({},r,f.getChildContext())),y&&!p&&f.getSnapshotBeforeUpdate!=null&&(g=f.getSnapshotBeforeUpdate(m,h)),E=d,d!=null&&d.type===xc&&d.key==null&&(E=Lc(d.props.children)),s=Dc(e,hc(E)?E:[E],t,n,r,i,a,o,s,c,l,u),t.__u&=-161,f.__h.length&&o.push(f),_&&(f.__g&=-4)}catch(e){if(t.__v=null,c||a!=null)if(e.then){for(D=0,O=!1,t.__u|=c?160:128,t.__c.__z=[],k=0;k<a.length;k++)(A=a[k])==null||O||(A.nodeType==8&&A.data==`$s`?(D>0&&t.__c.__z.push(A),D++,a[k]=null):A.nodeType==8&&A.data==`/$s`?(--D>0&&t.__c.__z.push(A),O=D===0,s=a[k],a[k]=null):D>0&&(t.__c.__z.push(A),a[k]=null));if(!O){for(;s&&s.nodeType==8&&s.nextSibling;)s=s.nextSibling;a[a.indexOf(s)]=null,t.__c.__z=[s]}t.__e=s}else{for(j=a.length;j--;)vc(a[j]);Fc(t)}else t.__e=n.__e,t.__k=n.__k,e.then||Fc(t);Z.__e(e,t,n)}else s=t.__e=Rc(n.__e,t,n,r,i,a,o,c,l,u);return(d=Z.diffed)&&d(t),128&t.__u?void 0:s}function Fc(e){e&&e.__c&&(e.__c.__g|=4),e&&e.__k&&e.__k.forEach(Fc)}function Ic(e,t,n){for(var r=0;r<n.length;r++)zc(n[r],n[++r],n[++r]);Z.__c&&Z.__c(t,e),e.some(function(t){try{e=t.__h,t.__h=[],e.some(function(e){e.call(t)})}catch(e){Z.__e(e,t.__v)}})}function Lc(e){return typeof e!=`object`||!e||e.__b&&e.__b>0?e:hc(e)?e.map(Lc):_c({},e)}function Rc(e,t,n,r,i,a,o,s,c,l){var u,d,f,p,m,h,g,_,v=n.props,y=t.props,b=t.type;if(b==`svg`?i=`http://www.w3.org/2000/svg`:b==`math`?i=`http://www.w3.org/1998/Math/MathML`:i||=`http://www.w3.org/1999/xhtml`,a!=null){for(u=0;u<a.length;u++)if((m=a[u])&&`setAttribute`in m==!!b&&(b?m.localName==b:m.nodeType==3)){e=m,a[u]=null;break}}if(e==null){if(b==null)return l.createTextNode(y);e=l.createElementNS(i,b,y.is&&y),s&&=(Z.__m&&Z.__m(t,a),!1),a=null}if(b==null)v===y||s&&e.data==y||(e.data=y);else{if(a&&=gc.call(e.childNodes),v=n.props||pc,!s&&a!=null)for(v={},u=0;u<e.attributes.length;u++)v[(m=e.attributes[u]).name]=m.value;for(u in v)if(m=v[u],u!=`children`){if(u==`dangerouslySetInnerHTML`)f=m;else if(!(u in y)){if(u==`value`&&`defaultValue`in y||u==`checked`&&`defaultChecked`in y)continue;Mc(e,u,null,m,i)}}for(u in _=1&n.__u,y)m=y[u],u==`children`?p=m:u==`dangerouslySetInnerHTML`?d=m:u==`value`?h=m:u==`checked`?g=m:s&&typeof m!=`function`||v[u]===m&&!_||Mc(e,u,m,v[u],i);if(d)s||f&&(d.__html==f.__html||d.__html==e.innerHTML)||(e.innerHTML=d.__html),t.__k=[];else if(f&&(e.innerHTML=``),Dc(b==`template`?e.content:e,hc(p)?p:[p],t,n,r,b==`foreignObject`?`http://www.w3.org/1999/xhtml`:i,a,o,a?a[0]:n.__k&&Cc(n,0),s,c,l),a!=null)for(u=a.length;u--;)vc(a[u]);s||(u=`value`,b==`progress`&&h==null?e.removeAttribute(`value`):h==null||h===e[u]&&(b!==`progress`||h)||Mc(e,u,h,v[u],i),u=`checked`,g!=null&&g!=e[u]&&Mc(e,u,g,v[u],i))}return e}function zc(e,t,n){try{if(typeof e==`function`){var r=typeof e.__u==`function`;r&&e.__u(),r&&t==null||(e.__u=e(t))}else e.current=t}catch(e){Z.__e(e,n)}}function Bc(e,t,n){var r,i;if(Z.unmount&&Z.unmount(e),(r=e.ref)&&(r.current&&r.current!=e.__e||zc(r,null,t)),(r=e.__c)!=null){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){Z.__e(e,t)}r.__P=null}if(r=e.__k)for(i=0;i<r.length;i++)r[i]&&Bc(r[i],t,n||typeof e.type!=`function`);n||vc(e.__e),e.__e&&e.__e.__l&&(e.__e.__l=null),e.__e=e.__c=e.__=null}function Vc(e,t,n){return this.constructor(e,n)}function Hc(e,t){var n,r,i,a;t==document&&(t=document.documentElement),Z.__&&Z.__(e,t),r=(n=!!(e&&32&e.__u))?null:t.__k,e=t.__k=yc(xc,null,[e]),i=[],a=[],Pc(t,e,r||pc,pc,t.namespaceURI,r?null:t.firstChild?gc.call(t.childNodes):null,i,r?r.__e:t.firstChild,n,a,t.ownerDocument),Ic(i,e,a)}function Uc(e,t){e.__u|=32,Hc(e,t)}Z={__e:function(e,t,n,r){for(var i,a,o;t=t.__;)if((i=t.__c)&&!(1&i.__g)){i.__g|=4;try{if((a=i.constructor)&&a.getDerivedStateFromError!=null&&(i.setState(a.getDerivedStateFromError(e)),o=8&i.__g),i.componentDidCatch!=null&&(i.componentDidCatch(e,r||{}),o=8&i.__g),o)return void(i.__g|=2)}catch(t){e=t}}throw sc=0,e}},ic=0,Sc.prototype.setState=function(e,t){var n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=_c({},this.state);typeof e==`function`&&(e=e(_c({},n),this.props)),e&&_c(n,e),e!=null&&this.__v&&(t&&this._sb.push(t),Tc(this))},Sc.prototype.forceUpdate=function(e){this.__v&&(this.__g|=4,e&&this.__h.push(e),Tc(this))},Sc.prototype.render=xc,ac=[],sc=0,cc=function(e,t){return e.__v.__b-t.__v.__b},lc=/(PointerCapture)$|Capture$/i,uc=0,dc=Nc(!1),fc=Nc(!0);var Wc=0;Array.isArray;function Q(e,t,n,r,i,a){t||={};var o,s,c=t;if(`ref`in c&&typeof e!=`function`)for(s in c={},t)s==`ref`?o=t[s]:c[s]=t[s];var l={type:e,props:c,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--Wc,__i:-1,__u:0,__source:i,__self:a};return Z.vnode&&Z.vnode(l),l}var Gc=16,Kc=16,qc={};function Jc({name:e,remappedFrom:t,token:n,width:r,height:i,viewBox:a,label:o,alignCapitals:s=!1}){"use no memo";let c=`#${e.replace(/^#/,``)}`,{width:l,height:u,viewBox:d}=qc[e]??{width:Gc,height:Kc},f=r??l,p=i??u,m=a??d??`0 0 ${l} ${u}`;return Q(`svg`,{"data-icon-name":t??e,"data-icon-token":n,"data-align-capitals":s,...o==null?{"aria-hidden":!0}:{"aria-label":o,role:`img`},viewBox:m,width:f,height:p,children:Q(`use`,{href:c})})}var Yc=e=>{if(e.length<2)return[e,``];let t=Math.ceil(e.length/2);return[e.slice(0,t),e.slice(t)]},Xc=e=>{if(e.length<4)return[e,``];let t=e.lastIndexOf(`.`)+1,n=e.length-t>10,r=t>=1&&!n?t:Math.ceil(e.length/2);return[e.slice(0,r),e.slice(r)]},Zc=e=>{if(e.length<4)return[e,``];let t=e.lastIndexOf(`/`)+1,n=e.length-t>25,r=t>=1&&!n?t:Math.ceil(e.length/2);return[e.slice(0,r),e.slice(r)]},Qc=(e,{splitIndex:t}={})=>{if(typeof t!=`number`){let t=Math.ceil(e.length/2);return[e.slice(0,t),e.slice(t)]}return[e.slice(0,t),e.slice(t)]},$c=(e,{splitOffset:t}={})=>{if(typeof t!=`number`||t<=0||t>=e.length){let t=Math.ceil(e.length/2);return[e.slice(0,t),e.slice(t)]}let n=e.length-t;return[e.slice(0,n),e.slice(n)]},el=(e,{splitOffset:t}={})=>{if(typeof t!=`number`||t<=0||t>=e.length){let t=Math.ceil(e.length/2);return[e.slice(0,t),e.slice(t)]}let n=t;return[e.slice(0,n),e.slice(n)]};function tl({children:e,marker:t,variant:n=`default`}){"use no memo";return Q(`div`,{"aria-hidden":!0,"data-truncate-marker-cell":!0,children:Q(`div`,{"data-truncate-marker":!0,children:typeof t==`function`?t({children:e}):n===`fade`?Q(`span`,{"data-truncate-fade":!0}):t})})}function nl(e){"use no memo";let{mode:t,children:n}=e;return Q(`div`,{children:[Q(`div`,{"data-truncate-content":`visible`,children:t===`fruncate`?Q(`span`,{children:n}):n}),Q(`div`,{"data-truncate-content":`overflow`,"aria-hidden":!0,children:t===`fruncate`?Q(`span`,{children:n}):n})]})}function rl({children:e,mode:t=`truncate`,marker:n=`…`,variant:r=`default`,...i}){"use no memo";let a=Q(nl,{mode:t,children:e},`content`),o=Q(tl,{marker:n,mode:t,variant:r},`marker`),s=Q(`div`,{"data-truncate-fill":!0},`fill`);return Q(`div`,{"data-truncate-container":t,"data-truncate-variant":r,...i,children:Q(`div`,{"data-truncate-grid":!0,children:t===`truncate`?[a,o]:[o,a,s]})})}function il({children:e,...t}){"use no memo";return Q(rl,{mode:`truncate`,...t,children:e})}function al({children:e,...t}){"use no memo";return Q(rl,{mode:`fruncate`,...t,children:e})}function ol({children:e,contents:t,priority:n=`end`,split:r=`center`,minimumLength:i=12,className:a,style:o,...s}){"use no memo";let c=null,l=null;if(Array.isArray(t)){if(t.length!==2)return console.error(`MiddleTruncate: contents must be an array of two items`),null;c=Q(il,{...s,children:t[0]}),l=Q(al,{...s,children:t[1]})}else{if(typeof e!=`string`)return console.error(`MiddleTruncate: children must be a string`),null;if(e.length===0)return Q(`div`,{className:a,style:o});if(e.length<i)return Q(n===`end`?al:il,{...s,className:a,style:o,children:e});let t=null,u=null,d=null;if(typeof r==`string`)r===`center`?t=Yc:r===`extension`?t=Xc:r===`leaf-path`&&(t=Zc);else if(typeof r==`number`)t=Qc,u=r;else if(Array.isArray(r)){let[e,n]=r;d=n,e===`last`?t=$c:e===`first`&&(t=el)}else typeof r==`function`&&(t=r);t??=Yc;let[f,p]=t(e,{priority:n,variant:s.variant,splitIndex:typeof u==`number`?u:void 0,splitOffset:typeof d==`number`?d:void 0}),m=f.length>=p.length,h=n===`equal`&&!m,g=n===`equal`&&m,_={},v={};h&&(_.marker=``),g&&(v.marker=``),c=Q(il,{...s,..._,children:f}),l=Q(al,{...s,...v,children:p})}return Q(`div`,{"data-truncate-group-container":`middle`,className:a,style:o,children:[Q(`div`,{"data-truncate-segment-priority":n===`start`||n===`equal`?`1`:`2`,children:c}),Q(`div`,{"data-truncate-segment-priority":n===`end`||n===`equal`?`1`:`2`,children:l})]})}var sl={endIndex:-1,startIndex:-1};function cl(e,t,n){return Math.min(Math.max(e,t),n)}function ll(e,t){return e<0||t<e?sl:{endIndex:t,startIndex:e}}function ul(e){return e.startIndex<0||e.endIndex<e.startIndex}function dl(e,t){return ul(e)?0:(e.endIndex-e.startIndex+1)*t}function fl(e,t,n){if(t<=0)return-1;let r=t*n;return e<=0?0:e>=r?t:Math.floor(e/n)}function pl(e,t,n){return t<=0||e<=0?-1:e>=t*n?t-1:Math.ceil(e/n)-1}function ml(e){let t=new Map;return e.forEach((e,n)=>{if(e.kind!==`directory`||!e.isExpanded)return;let r=e.ancestorPaths.length,i=t.get(r);if(i==null){t.set(r,[n]);return}i.push(n)}),t}function hl(e,t){let n=0,r=e.length-1,i=-1;for(;n<=r;){let a=Math.floor((n+r)/2),o=e[a];if(o==null)break;if(o<=t){i=a,n=a+1;continue}r=a-1}return i}function gl(e){let t=new Map,n=[];for(let r=0;r<e.length;r+=1){let i=e[r];if(i==null)continue;let a=i.kind===`directory`&&i.isExpanded?[...i.ancestorPaths,i.path]:i.ancestorPaths,o=0;for(;o<n.length&&o<a.length&&n[o]===a[o];)o+=1;for(let e=n.length-1;e>=o;--e){let i=n[e];i!=null&&t.set(i,r-1)}n.length=o;for(let e=o;e<a.length;e+=1){let t=a[e];t!=null&&n.push(t)}}let r=e.length-1;for(let e of n)t.set(e,r);return t}function _l(e,t,n){if(e.length===0||t<=0)return[];let r=gl(e),i=ml(e),a=[];for(let r=0;r<e.length;r+=1){let o=i.get(r);if(o==null||o.length===0)break;let s=t+r*n,c=hl(o,Math.min(e.length-1,Math.floor(s/n))),l=null;for(;c>=0;){let t=o[c],n=t==null?null:e[t]??null;if(n!=null&&(r===0||n.ancestorPaths[r-1]===a[r-1]?.path)){l=n;break}--c}if(l==null)break;a.push(l)}return a.map((i,a)=>{let o=a*n,s=(r.get(i.path)??e.length-1)+1;if(s>=e.length)return{row:i,top:o};let c=s*n-t;return{row:i,top:Math.min(o,c-n)}}).filter(e=>e.top+n>0)}function vl(e,t){let n=t.totalRowCount??e.length,r=n*t.itemHeight,i=Math.max(0,t.viewportHeight),a=Math.max(0,Math.floor(t.overscan)),o=Math.max(0,r-i),s=cl(t.scrollTop,0,o),c=t.stickyRows??_l(e,s,t.itemHeight),l=c.reduce((e,n)=>Math.max(e,n.top+t.itemHeight),0),u=Math.min(r,s+l),d=Math.max(0,i-l),f=Math.max(0,r-u),p=fl(s,n,t.itemHeight),m=fl(u,n,t.itemHeight),h=l<=0||p<0||p>=n?-1:p,g=h===-1?-1:Math.min(n-1,m-1),_=h===-1||g<h?0:g-h+1,v=d<=0||m>=n?sl:ll(m,pl(u+d,n,t.itemHeight)),y=g+1,b=ul(v)?sl:ll(Math.max(y,v.startIndex-a),Math.min(n-1,v.endIndex+a)),x=dl(b,t.itemHeight);return{occlusion:{firstOccludedIndex:h,lastOccludedIndex:g,occludedCount:_},physical:{itemHeight:t.itemHeight,maxScrollTop:o,overscan:a,scrollTop:s,totalHeight:r,totalRowCount:n,viewportHeight:i},projected:{contentHeight:f,paneHeight:d,paneTop:u},sticky:{height:l,rows:c},visible:v,window:{endIndex:b.endIndex,height:x,offsetTop:ul(b)?0:b.startIndex*t.itemHeight,startIndex:b.startIndex}}}var yl={added:`A`,deleted:`D`,ignored:null,modified:`M`,renamed:`R`,untracked:`U`},bl={added:`Git status: added`,deleted:`Git status: deleted`,ignored:`Git status: ignored`,modified:`Git status: modified`,renamed:`Git status: renamed`,untracked:`Git status: untracked`},xl=`Contains git status items`;function Sl(e){let{currentScrollTop:t,focusedIndex:n,itemHeight:r,topInset:i=0,viewportHeight:a}=e;if(n<0)return null;let o=Math.max(0,i),s=n*r,c=s+r;if(s<t+o){let e=Math.max(0,s-o);return e===t?null:e}if(c>t+a){let e=c-a;return e===t?null:e}return null}function Cl(e){let{currentScrollTop:t,focusedIndex:n,itemHeight:r,offset:i,topInset:a=0,totalHeight:o,viewportHeight:s}=e;if(i===`nearest`)return Sl({currentScrollTop:t,focusedIndex:n,itemHeight:r,topInset:a,viewportHeight:s});if(n<0)return null;let c=Math.max(0,a),l=n*r,u=Math.max(0,s-c),d=i===`center`?c+Math.max(0,(u-r)/2):c,f=Math.max(0,o-s),p=Math.max(0,Math.min(l-d,f));return p===t?null:p}function wl(e){let{currentScrollTop:t,focusedIndex:n,itemHeight:r,targetViewportOffset:i,totalHeight:a,viewportHeight:o}=e;if(n<0)return null;let s=Math.max(0,i),c=n*r,l=c+r,u=t+s,d=t+o;if(c>=u&&l<=d)return null;let f=Math.max(0,a-o),p=Math.max(0,Math.min(c-s,f));return p===t?null:p}function Tl(e){if(e==null||!e.isConnected||e===document.body||e===document.documentElement)return!1;e.focus({preventScroll:!0});let t=e.getRootNode();return t instanceof ShadowRoot?t.activeElement===e:document.activeElement===e}function El(e){let t=e.getRootNode();if(t instanceof ShadowRoot){let e=t.activeElement;return e instanceof HTMLElement?e:null}let n=document.activeElement;return n instanceof HTMLElement&&e.contains(n)?n:null}function Dl(e,t){if(e==null)return t;let n=e.getBoundingClientRect().height;return n>0?n:e.clientHeight>0?e.clientHeight:t}function Ol(e,t){return e!=null&&e>0?e:t}function kl(e){let t=e.borderBoxSize,n=Array.isArray(t)?t[0]:t;return n!=null&&Number.isFinite(n.blockSize)&&n.blockSize>0?n.blockSize:e.contentRect.height>0?e.contentRect.height:null}function Al(e,t,n,r,i=0){let a=Sl({currentScrollTop:e.scrollTop,focusedIndex:t,itemHeight:n,topInset:i,viewportHeight:r});return a==null?!1:(e.scrollTop=a,!0)}function jl(e,t,n,r,i,a,o=0){let s=Cl({currentScrollTop:e.scrollTop,focusedIndex:t,itemHeight:n,offset:a,topInset:o,totalHeight:i,viewportHeight:r});return s==null?!1:(e.scrollTop=s,!0)}function Ml(e,t,n,r,i,a){let o=wl({currentScrollTop:e.scrollTop,focusedIndex:t,itemHeight:n,targetViewportOffset:a,totalHeight:i,viewportHeight:r});return o==null?!1:(e.scrollTop=o,!0)}function Nl(e,t,n,r){return n.end<n.start?null:e<n.start?-t:e>n.end?r:null}function Pl(e){let{renamingPath:t,previousRenamingPath:n,hasRenderedInput:r}=e;return t==null?`reset`:r?n===t?`ignore`:`focus-input`:`reveal-canonical`}function Fl({ariaLabel:e,isFlattened:t=!1,ref:n,value:r,onBlur:i,onInput:a}){return Q(`input`,{ref:n,"data-item-rename-input":!0,...t?{"data-item-flattened-rename-input":!0}:{},"aria-label":e,value:r,onBlur:i,onInput:a,onClick:e=>e.stopPropagation(),onMouseDown:e=>e.stopPropagation(),onPointerDown:e=>e.stopPropagation()})}function Il(e){let{row:t,mode:n,targetPath:r,ariaLabel:i,domId:a,isParked:o,itemHeight:s,features:c,state:l,extraStyle:u}=e,d=n===`sticky`,f=t.ancestorPaths.at(-1)??``,p={};return l.isFocusRinged&&(p[`data-item-focused`]=!0),t.isSelected&&(p[`data-item-selected`]=!0),l.isContextHovered&&(p[`data-item-context-hover`]=`true`),l.isDragTarget&&(p[`data-item-drag-target`]=!0),l.isDragging&&(p[`data-item-dragging`]=!0),l.effectiveGitStatus!=null&&(p[`data-item-git-status`]=l.effectiveGitStatus),l.containsGitChange&&(p[`data-item-contains-git-change`]=`true`),{"aria-expanded":!d&&t.kind===`directory`?t.isExpanded:void 0,"aria-haspopup":c.contextMenuEnabled?`menu`:void 0,"aria-label":i,"aria-level":d?void 0:t.level+1,"aria-posinset":d?void 0:t.posInSet+1,"aria-selected":d?void 0:t.isSelected?`true`:`false`,"aria-setsize":d?void 0:t.setSize,"data-file-tree-sticky-path":d?r:void 0,"data-file-tree-sticky-row":d?`true`:void 0,"data-item-context-menu-button-visibility":c.actionLaneEnabled?c.contextMenuButtonVisibility:void 0,"data-item-context-menu-trigger-mode":c.contextMenuEnabled?c.contextMenuTriggerMode:void 0,"data-item-has-context-menu-action-lane":c.actionLaneEnabled?`true`:void 0,"data-item-has-git-lane":c.gitLaneActive?`true`:void 0,"data-item-parent-path":f.length>0?f:void 0,"data-item-parked":o?`true`:void 0,"data-item-path":r,"data-item-type":t.kind===`directory`?`folder`:`file`,"data-type":`item`,id:d?void 0:a,role:d?void 0:`treeitem`,style:{minHeight:`${s}px`,...u},tabIndex:!d&&t.isFocused?0:-1,...p}}function Ll(e){let{event:t,mode:n,isSearchOpen:r,isDirectory:i}=e,a=t.ctrlKey||t.metaKey,o=t.shiftKey||a,s=t.shiftKey?{additive:a,kind:`range`}:a?{kind:`toggle`}:{kind:`single`};return{closeSearch:r,revealCanonical:n===`sticky`,selection:s,toggleDirectory:!o&&i}}var Rl,zl,Bl,Vl,Hl=Object.is,Ul=0,Wl=[],Gl=Z,Kl=Gl.__b,ql=Gl.__r,Jl=Gl.diffed,Yl=Gl.__c,Xl=Gl.unmount,Zl=Gl.__;function Ql(e,t){Gl.__h&&Gl.__h(zl,e,Ul||t),Ul=0;var n=zl.__H||={__:[],__h:[]};return e>=n.__.length&&n.__.push({}),n.__[e]}function $l(e){return Ul=1,eu(du,e)}function eu(e,t,n){var r=Ql(Rl++,2);if(r.t=e,!r.__c&&(r.__=[n?n(t):du(void 0,t),function(e){var t=r.__N?r.__N[0]:r.__[0],n=r.t(t,e);Hl(t,n)||(r.__N=[n,r.__[1]],r.__c.setState({}))}],r.__c=zl,!zl.__f)){var i=function(e,t,n){if(!r.__c.__H)return!0;var i=r.__c.__H.__.filter(function(e){return!!e.__c});if(i.every(function(e){return!e.__N}))return!a||a.call(this,e,t,n);var o=r.__c.props!==e;return i.forEach(function(e){if(e.__N){var t=e.__[0];e.__=e.__N,e.__N=void 0,Hl(t,e.__[0])||(o=!0)}}),a&&a.call(this,e,t,n)||o};zl.__f=!0;var a=zl.shouldComponentUpdate,o=zl.componentWillUpdate;zl.componentWillUpdate=function(e,t,n){if(4&this.__g){var r=a;a=void 0,i(e,t,n),a=r}o&&o.call(this,e,t,n)},zl.shouldComponentUpdate=i}return r.__N||r.__}function tu(e,t){var n=Ql(Rl++,3);!Gl.__s&&uu(n.__H,t)&&(n.__=e,n.u=t,zl.__H.__h.push(n))}function nu(e,t){var n=Ql(Rl++,4);!Gl.__s&&uu(n.__H,t)&&(n.__=e,n.u=t,zl.__h.push(n))}function $(e){return Ul=5,ru(function(){return{current:e}},[])}function ru(e,t){var n=Ql(Rl++,7);return uu(n.__H,t)&&(n.__=e(),n.__H=t,n.__h=e),n.__}function iu(e,t){return Ul=8,ru(function(){return e},t)}function au(){for(var e;e=Wl.shift();)if(e.__P&&e.__H)try{e.__H.__h.forEach(cu),e.__H.__h.forEach(lu),e.__H.__h=[]}catch(t){e.__H.__h=[],Gl.__e(t,e.__v)}}Gl.__b=function(e){zl=null,Kl&&Kl(e)},Gl.__=function(e,t){e&&t.__k&&t.__k.__m&&(e.__m=t.__k.__m),Zl&&Zl(e,t)},Gl.__r=function(e){ql&&ql(e),Rl=0;var t=(zl=e.__c).__H;t&&(Bl===zl?(t.__h=[],zl.__h=[],t.__.forEach(function(e){e.__N&&(e.__=e.__N),e.u=e.__N=void 0})):(t.__h.forEach(cu),t.__h.forEach(lu),t.__h=[],Rl=0)),Bl=zl},Gl.diffed=function(e){Jl&&Jl(e);var t=e.__c;t&&t.__H&&(t.__H.__h.length&&(Wl.push(t)!==1&&Vl===Gl.requestAnimationFrame||((Vl=Gl.requestAnimationFrame)||su)(au)),t.__H.__.forEach(function(e){e.u&&(e.__H=e.u),e.u=void 0})),Bl=zl=null},Gl.__c=function(e,t){t.some(function(e){try{e.__h.forEach(cu),e.__h=e.__h.filter(function(e){return!e.__||lu(e)})}catch(n){t.some(function(e){e.__h&&=[]}),t=[],Gl.__e(n,e.__v)}}),Yl&&Yl(e,t)},Gl.unmount=function(e){Xl&&Xl(e);var t,n=e.__c;n&&n.__H&&(n.__H.__.forEach(function(e){try{cu(e)}catch(e){t=e}}),n.__H=void 0,t&&Gl.__e(t,n.__v))};var ou=typeof requestAnimationFrame==`function`;function su(e){var t,n=function(){clearTimeout(r),ou&&cancelAnimationFrame(t),setTimeout(e)},r=setTimeout(n,35);ou&&(t=requestAnimationFrame(n))}function cu(e){var t=zl,n=e.__c;typeof n==`function`&&(e.__c=void 0,n()),zl=t}function lu(e){var t=zl;e.__c=e.__(),zl=t}function uu(e,t){return!e||e.length!==t.length||t.some(function(t,n){return!Hl(t,e[n])})}function du(e,t){return typeof t==`function`?t(e):t}function fu(e,t=null,n=null){"use no memo";let r=e.flattenedSegments;return r==null||r.length===0?t??e.name:Q(`span`,{"data-item-flattened-subitems":!0,children:r.map((e,i)=>{let a=i===r.length-1;return Q(xc,{children:[Q(`span`,{"data-item-flattened-subitem":e.path,"data-item-flattened-subitem-drag-target":n===e.path?`true`:void 0,children:a&&t!=null?t:Q(il,{children:e.name})}),i<r.length-1?` / `:``]},e.path)})})}function pu(e){return e.isFlattened?e.flattenedSegments?.findLast(e=>e.isTerminal)?.path??e.path:e.path}function mu(e){let t=e.flattenedSegments;return t==null||t.length===0?e.name:t.map(e=>e.name).join(` / `)}function hu(e,t,n,r){return e.map((e,i)=>{let a=i*n,o=e.subtreeEndIndex+1;if(o>=r)return{row:e.row,top:a};let s=o*n-t;return{row:e.row,top:Math.min(a,s-n)}}).filter(e=>e.top+n>0)}function gu({controller:e,itemHeight:t,overscan:n,scrollTop:r,stickyFolders:i,viewportHeight:a}){let o=e.getVisibleCount(),s=i&&o>0?e.getStickyRowCandidates(r,t):[],c=s==null&&i&&o>0?e.getVisibleRows(0,o-1):[],l=vl(c,{itemHeight:t,overscan:n,scrollTop:r,stickyRows:s==null?void 0:hu(s,r,t,o),totalRowCount:o,viewportHeight:a}),u=i&&r<=0&&o>0?e.getStickyRowCandidates(1,t):[],d=u!=null&&r<=0?hu(u,1,t,o):i&&r<=0&&c.length>0?_l(c,1,t):l.sticky.rows;return{overlayHeight:d.reduce((e,n)=>Math.max(e,n.top+t),0),overlayRows:d,snapshot:l,visibleRows:c}}var _u=400,vu=10,yu=40,bu=18;function xu(e,t,n){let r=e,i=document.elementFromPoint?.bind(document)??null,a=r.elementFromPoint?.(t,n)??i?.(t,n)??null;return e instanceof ShadowRoot&&(a==null||!e.contains(a))?Su(e,t,n):a instanceof HTMLElement?a:null}function Su(e,t,n){let r=Array.from(e.querySelectorAll(`[data-type="item"], [data-item-flattened-subitem]`));for(let e=r.length-1;e>=0;e--){let i=r[e],a=i.getBoundingClientRect();if(t>=a.left&&t<=a.right&&n>=a.top&&n<=a.bottom)return i}return null}function Cu(e){let t=e?.closest?.(`[data-type="item"]`);if(!(t instanceof HTMLElement))return null;let n=t.dataset.itemPath??null;if(n==null)return null;let r=e?.closest?.(`[data-item-flattened-subitem]`),i=r instanceof HTMLElement?r.getAttribute(`data-item-flattened-subitem`)??null:null;if(i!=null&&i.endsWith(`/`))return{directoryPath:i,flattenedSegmentPath:i,hoveredPath:n,kind:`directory`};if(t.dataset.itemType===`folder`)return{directoryPath:n,flattenedSegmentPath:null,hoveredPath:n,kind:`directory`};let a=t.dataset.itemParentPath??null;return a==null||a.length===0?{directoryPath:null,flattenedSegmentPath:null,hoveredPath:n,kind:`root`}:{directoryPath:a,flattenedSegmentPath:null,hoveredPath:n,kind:`directory`}}function wu(e){let t=e.cloneNode(!0);return t.removeAttribute(`id`),t.dataset.fileTreeDragPreview=`true`,t.setAttribute(`aria-hidden`,`true`),t.tabIndex=-1,Object.assign(t.style,{boxShadow:`0 4px 12px rgba(0, 0, 0, 0.15)`,left:`0px`,margin:`0`,pointerEvents:`none`,position:`fixed`,top:`0px`,willChange:`transform`,zIndex:`10000`}),t}function Tu(){return navigator.vendor!==`Apple Computer, Inc.`}function Eu(e,t){let n=e-t.top;if(n<yu)return-Math.ceil((yu-Math.max(0,n))/yu*bu);let r=t.bottom-e;return r<yu?Math.ceil((yu-Math.max(0,r))/yu*bu):0}function Du(e,t){if(e!=null){let t=yl[e];return t==null?null:{text:t,title:bl[e]}}return t?{icon:{name:`file-tree-icon-dot`,width:6,height:6},title:xl}:null}function Ou(e,t,n){if(t==null||t.size===0)return null;let r=[];for(let i=e.length-1;i>=0;--i){let a=e[i],o=n.get(a);if(o!=null){for(let e of r)n.set(e,o);return o?`ignored`:null}if(t.has(a)){n.set(a,!0);for(let e of r)n.set(e,!0);return`ignored`}r.push(a)}for(let e of r)n.set(e,!1);return null}function ku(e){return e!=null&&`toggle`in e}function Au(e){return e.code===`Space`||e.key===` `||e.key===`Spacebar`}function ju(e){return e.key.length===1&&/^[\p{L}\p{N}]$/u.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey}function Mu(e){return e==null?``:`[data-item-section="spacing-item"][data-ancestor-path="${e.replaceAll(`\\`,`\\\\`).replaceAll(`"`,`\\"`)}"] { opacity: 1; }`}function Nu(e){return e.shiftKey&&e.key===`F10`||e.key===`ContextMenu`}function Pu(e,t){return t&&Nu(e)||(e.ctrlKey||e.metaKey)&&Au(e)?!0:e.key===`ArrowDown`||e.key===`ArrowLeft`||e.key===`ArrowRight`||e.key===`ArrowUp`}var Fu=new Set([`ArrowDown`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`End`,`Home`,`PageDown`,`PageUp`]);function Iu(e){for(let t of e.composedPath())if(t instanceof HTMLElement&&(t.dataset.fileTreeContextMenuRoot===`true`||t.dataset.type===`context-menu-anchor`||t.dataset.type===`context-menu-trigger`||t.getAttribute(`slot`)===`context-menu`))return!0;return!1}function Lu(e){return{bottom:e.bottom,height:e.height,left:e.left,right:e.right,top:e.top,width:e.width,x:e.x,y:e.y}}function Ru(e,t){return{bottom:t,height:0,left:e,right:e,top:t,width:0,x:e,y:t}}function zu(e,t){if(e==null)return t.offsetTop;let n=t.getBoundingClientRect(),r=e.getBoundingClientRect();return n.top-r.top}function Bu(e,t,n){if(n==null){e.delete(t);return}e.set(t,n)}function Vu(e,t,n){if(e==null)return null;let r=t.get(e)??null;if(r!=null)return r;let i=n.get(e)??null;return i?.dataset.itemParked===`true`?null:i}function Hu(e){if(e==null)return[];let t=[];for(let n of e.querySelectorAll(`button[data-file-tree-sticky-row="true"]`)){if(!(n instanceof HTMLElement))continue;let e=n.dataset.fileTreeStickyPath;e!=null&&t.push(e)}return t}function Uu(e,t){if(e==null||t==null)return null;for(let n of e.querySelectorAll(`button[data-item-focused="true"][data-item-parked="true"]`))if(n instanceof HTMLElement&&n.dataset.itemPath===t)return n;return null}function Wu(e,t,n,r,i,a,o){let s=Math.max(0,a-i),c=t?.getBoundingClientRect()??null,l=c==null||n==null?null:n.getBoundingClientRect().top-c.top,u=Uu(e,r),d=c==null||u==null?null:u.getBoundingClientRect().top-c.top;return Math.max(0,Math.min(d??Math.max(l??0,s),Math.max(0,o-i)))}function Gu(e,t){return{kind:e.kind,name:mu(e),path:t}}function Ku(e){return e==null?void 0:`${e}__tree`}function qu(e,t,n){if(e!=null)return`${e}__focused-item-${encodeURIComponent(t)}${n?`__parked`:``}`}function Ju(e){return e===`file-tree-icon-chevron`||e===`file-tree-icon-dot`||e===`file-tree-icon-file`||e===`file-tree-icon-lock`}function Yu(e,t){if(e==null)return null;if(`text`in e)return Q(`span`,{title:e.title,children:e.text});let n=typeof e.icon==`string`?Ju(e.icon)?t(e.icon):{name:e.icon}:Ju(e.icon.name)?(()=>{let n=t(e.icon.name),{name:r,...i}=e.icon;return{...n,...i}})():e.icon;return Q(`span`,{title:e.title,children:Q(Jc,{...n})})}function Xu(e){e!=null&&Tl(e.querySelector([`button:not([disabled])`,`[href]`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex="-1"])`].join(`, `))??e)}function Zu(e,t,{actionLaneEnabled:n=!1,customDecoration:r=null,decorationLaneEnabled:i=!1,dragTargetFlattenedSegmentPath:a=null,gitDecoration:o=null,gitLaneActive:s=!1,renameInput:c=null,showDecorativeActionAffordance:l=!1}={}){let u=pu(e);return Q(xc,{children:[e.depth>0?Q(`div`,{"data-item-section":`spacing`,children:Array.from({length:e.depth}).map((t,n)=>Q(`div`,{"data-item-section":`spacing-item`,"data-ancestor-path":e.ancestorPaths[n]},n))}):null,Q(`div`,{"data-item-section":`icon`,children:e.kind===`directory`?Q(Jc,{...t(`file-tree-icon-chevron`)}):Q(Jc,{...t(`file-tree-icon-file`,u)})}),Q(`div`,{"data-item-section":`content`,children:e.isFlattened?fu(e,c,a):c??Q(ol,{minimumLength:5,split:`extension`,children:e.name})}),i?Q(`div`,{"data-item-section":`decoration`,children:r==null?null:Yu(r,t)}):null,s?Q(`div`,{"data-item-section":`git`,children:Yu(o,t)}):null,n?Q(`div`,{"data-item-section":`action`,children:l?Q(`span`,{"aria-hidden":`true`,"data-item-action-affordance":`decorative`,children:Q(Jc,{...t(`file-tree-icon-ellipsis`)})}):null}):null]})}function Qu(e,t,n,r={}){let{controller:i,renameView:a,visualFocusPath:o,contextHoverPath:s,draggedPathSet:c,dragTarget:l,dragAndDropEnabled:u,shouldSuppressContextMenu:d,handleRowDragStart:f,handleRowDragEnd:p,handleRowTouchStart:m,instanceId:h,itemHeight:g,gitStatusByPath:_,ignoredGitDirectories:v,ignoredInheritanceCache:y,directoriesWithGitChanges:b,gitLaneActive:x,contextMenuEnabled:S,contextMenuTriggerMode:C,contextMenuButtonTriggerEnabled:w,contextMenuButtonVisibility:T,contextMenuRightClickEnabled:E,registerRenameInput:D,registerButton:O,resolveIcon:k,renderDecorationForRow:A,openContextMenuForRow:j,onRowClick:M,onKeyDown:N}=e,P=pu(t),{isParked:ee=!1,mode:te=`flow`,style:ne}=r,re=te===`sticky`,ie=_?.get(P)??null??Ou(t.ancestorPaths,v,y),ae=t.kind===`directory`&&(b?.has(P)??!1),oe=A(t,P),se=Du(ie,ae),F=S&&w,ce=oe!=null||x||F,le=F&&T===`always`,ue=a.getPath()===P,I=ue?a.getValue():``,de=re||!ue?null:Q(Fl,{ref:D,ariaLabel:`Rename ${mu(t)}`,isFlattened:t.isFlattened,value:I,onBlur:()=>{a.commit()},onInput:e=>{a.setValue(e.currentTarget.value)}}),fe=Zu(t,k,{actionLaneEnabled:F,customDecoration:oe,decorationLaneEnabled:ce,dragTargetFlattenedSegmentPath:l?.flattenedSegmentPath??null,gitDecoration:se,gitLaneActive:x,renameInput:de,showDecorativeActionAffordance:le}),pe={...Il({ariaLabel:mu(t),domId:t.isFocused?qu(h,P,ee):void 0,extraStyle:ne,features:{actionLaneEnabled:F,contextMenuButtonVisibility:F?T:null,contextMenuEnabled:S,contextMenuTriggerMode:S?C:null,gitLaneActive:x},isParked:ee,itemHeight:g,mode:te,row:t,state:{containsGitChange:ae,effectiveGitStatus:ie,isContextHovered:s===P,isDragTarget:l?.kind===`directory`&&l.directoryPath===P,isDragging:c?.has(P)===!0,isFocusRinged:t.isFocused&&o===P},targetPath:P}),key:n,onContextMenu:S||u?e=>{if(d()){e.preventDefault();return}S&&(e.preventDefault(),E&&(i.focusMountedPathFromInput(P),j(t,P,{anchorRect:Ru(e.clientX,e.clientY),source:`right-click`})))}:void 0,onFocus:re?void 0:()=>{i.focusMountedPathFromInput(P)},onKeyDown:re?void 0:N,ref:e=>{O(P,e)}};return!re&&ue?Q(`div`,{...pe,children:fe}):Q(`button`,{...pe,type:`button`,draggable:u&&!ee,onDragEnd:u&&!ee?p:void 0,onDragStart:u&&!ee?e=>{f(e,t,P)}:void 0,onMouseDown:e=>{if(re){e.preventDefault();return}i.isSearchOpen()&&e.preventDefault()},onTouchStart:u&&!ee?e=>{m(e,t,P)}:void 0,onClick:e=>{M(e,t,P,te)},children:fe})}function $u(e,t,n){return t.end<t.start?[]:e.controller.getVisibleRows(t.start,t.end).filter(e=>!n.has(pu(e))).map((n,r)=>Qu(e,n,t.start+r))}function ed({composition:e,controller:t,gitStatusByPath:n,ignoredGitDirectories:r,directoriesWithGitChanges:i,icons:a,instanceId:o,itemHeight:s=ts,overscan:c=10,renamingEnabled:l=!1,renderRowDecoration:u,searchBlurBehavior:d=`close`,searchEnabled:f=!1,searchFakeFocus:p=!1,slotHost:m,stickyFolders:h=!1,initialViewportHeight:g=420}){"use no memo";let _=$(null),v=$(null),y=$(!1),b=$(null),x=$(null),S=$(null),C=$(null),w=$(null),T=$(new Map),E=$(new Map),D=$(()=>{}),O=$(null),k=$(0),A=$(!1),j=$(null);j.current!==t&&(A.current=!1,j.current=t);let M=$(!1),N=$(null),P=$(null),ee=$(!1),te=$(null),ne=$(null),re=$(null),ie=$(null),ae=$(null),oe=$(null),se=$(null),F=$(null),ce=$(!1),le=$(null),I=$(null),de=$(null),fe=$(null),pe=ru(()=>new Map,[]),[,me]=$l(0),[he,ge]=$l(null),[_e,ve]=$l(null),[ye,be]=$l(null),[xe,Se]=$l(null),[Ce,we]=$l(0),[L,Te]=$l(null),Ee=$(L);Ee.current=L;let De=$(null),Oe=$(null),ke=$(null),Ae=$(null),je=$(null),Me=$(!1),Ne=()=>{Oe.current=null,ke.current=null,Ae.current=null},Pe=(e,t)=>{Oe.current=e,ke.current=null,Ae.current=t==null?null:{path:e,scrollTop:t}},Fe=(e,t)=>{Oe.current=null,ke.current={path:e,viewportOffset:t},Ae.current=null},Ie=$(d===`retain`&&t.isSearchOpen()),[Le,Re]=$l(p);tu(()=>{p||Re(!1)},[p]);let ze=$(!1),Be=iu(()=>{ze.current=!0,Re(e=>e&&!1)},[]),[Ve,He]=$l(()=>gu({controller:t,itemHeight:s,overscan:c,scrollTop:0,stickyFolders:h,viewportHeight:g})),[Ue,We]=$l(!1);tu(()=>{We(!0)},[]);let Ge=e?.contextMenu?.enabled===!0||e?.contextMenu?.render!=null||e?.contextMenu?.onOpen!=null||e?.contextMenu?.onClose!=null,Ke=e?.contextMenu?.triggerMode??(Ge?`right-click`:`both`),qe=Ke===`both`||Ke===`button`,Je=e?.contextMenu?.buttonVisibility??`when-needed`,Ye=Ke===`both`||Ke===`right-click`;nu(()=>{let e=S.current;if(e==null)return;let t=e=>{if(!(e instanceof CustomEvent))return;let t=e.detail?.path??null;je.current=t,ve(t),Se(t==null?null:`pointer`)},n=e=>{e instanceof CustomEvent&&(Me.current=e.detail?.disabled===!0)};return e.addEventListener(`file-tree-debug-set-context-menu-trigger`,t),e.addEventListener(`file-tree-debug-set-scroll-suppression`,n),()=>{e.removeEventListener(`file-tree-debug-set-context-menu-trigger`,t),e.removeEventListener(`file-tree-debug-set-scroll-suppression`,n)}},[]);let Xe=iu((e,t)=>{Bu(T.current,e,t)},[]),Ze=iu((e,t)=>{Bu(E.current,e,t)},[]),R=iu(e=>{x.current=e},[]),Qe=iu(e=>Vu(e,E.current,T.current),[]),$e=n!=null||r!=null||i!=null,{resolveIcon:et}=ru(()=>ue(a),[a]),z=t[Ks](),tt=z.getPath(),nt=tt!=null,rt=t.isSearchOpen(),it=t.getSearchValue(),B=t.getFocusedPath(),V=t.getFocusedIndex(),at=t.getScrollRequest(),ot=t.isDragAndDropEnabled(),st=t.getDragSession(),ct=ru(()=>st==null?null:new Set(st.draggedPaths),[st]),lt=st?.target??null,ut=st?.primaryPath??null,dt=Ku(o),{overlayHeight:ft,overlayRows:pt,snapshot:mt,visibleRows:ht}=Ve,gt=mt.physical.viewportHeight,_t=ru(()=>({end:mt.window.endIndex,start:mt.window.startIndex}),[mt.window.endIndex,mt.window.startIndex]),H=pt,vt=mt.sticky.rows,yt=mt.physical.totalHeight,bt=mt.sticky.height,xt=ru(()=>new Set(vt.map(e=>pu(e.row))),[vt]),St=V>=0&&V>=_t.start&&V<=_t.end,Ct=iu((e,t)=>u?.({item:Gu(e,t),row:e})??null,[u]),wt=iu(e=>Tl(e==null?null:T.current.get(e)??null)?!0:Tl(S.current),[]),Tt=iu(e=>{wt(t.focusNearestPath(e))},[t,wt]),Et=$(Tt);Et.current=Tt;let Dt=$(!0),Ot=$(()=>{}),kt=iu((t=!0)=>{let n=Ee.current;n!=null&&(Dt.current=Dt.current&&t,Te(null),e?.contextMenu?.onClose?.(),Dt.current&&Tt(n.path))},[e?.contextMenu,Tt]);Ot.current=kt;let At=iu(e=>{let t=e==null?null:zu(S.current,e);be(e=>e===t?e:t)},[]),jt=iu((e,n,r)=>{let i=t.getItem(n);if(i==null)return;let a=Qe(n);if(a?.dataset.fileTreeStickyRow===`true`){let e=C.current;Pe(n,e?.scrollTop??null),M.current=!0,ge(e=>e===n?e:n)}i.focus(),At(a),Dt.current=!0,Te({anchorRect:r?.anchorRect??null,item:Gu(e,n),path:n,source:r?.source??`keyboard`})},[t,Qe,At]),Mt=iu(e=>{if(l){if(t.isSearchOpen()){let e=C.current,t=Dl(e,gt);te.current=V<0||e==null?null:Math.max(0,Math.min(V*s-e.scrollTop,Math.max(0,t-s))),ee.current=!0}t.startRenaming(e)!==!1&&(Se(`focus`),me(e=>e+1))}},[t,V,s,l,gt]),Nt=iu((e,{restoreTreeFocus:n=!0,targetOffset:r=`live-overlay`}={})=>{let i=C.current;if(i==null)return!1;t.focusPath(e);let a=t.getFocusedIndex();if(a<0)return!1;let o=t.getVisibleRows(a,a)[0]??null;if(o==null)return!1;let l=Dl(i,gt),u=t.getVisibleCount()*s,d=r===`sticky-parents`?o.ancestorPaths.length*s:gu({controller:t,itemHeight:s,overscan:c,scrollTop:i.scrollTop,stickyFolders:h,viewportHeight:l}).snapshot.sticky.height;return M.current=!0,Ml(i,a,s,l,u,d),D.current(),De.current=n?e:null,!0},[t,s,c,gt,h]),Pt=()=>y.current===!0||fe.current!=null||ce.current===!0,Ft=e=>typeof window.requestAnimationFrame==`function`?window.requestAnimationFrame(()=>{e()}):window.setTimeout(e,16),It=e=>{if(e!=null){if(typeof window.cancelAnimationFrame==`function`){window.cancelAnimationFrame(e);return}window.clearTimeout(e)}},Lt=()=>{ie.current!=null&&(clearTimeout(ie.current),ie.current=null),re.current=null},Rt=()=>{oe.current?.remove(),oe.current=null},zt=()=>{It(ne.current),ne.current=null,ae.current=null},Bt=e=>{let t=S.current?.getRootNode();if(t instanceof ShadowRoot){t.append(e);return}document.body.append(e)},Vt=()=>{F.current?.(),F.current=null,fe.current!=null&&(clearTimeout(fe.current),fe.current=null),ce.current=!1,le.current=null,de.current=null,I.current!=null&&(I.current.setAttribute(`draggable`,`true`),I.current.style.removeProperty(`touch-action`),I.current=null),Rt(),Lt(),zt(),se.current=null},Ht=(e,n)=>{let r=S.current?.getRootNode(),i=Cu(xu(r instanceof ShadowRoot?r:document,e,n));return t.setDragTarget(i),t.getDragSession()?.target??null},Ut=e=>{let n=t.getDragAndDropConfig()?.openOnDropDelay??800;if(e==null||e.kind!==`directory`||e.directoryPath==null||n<=0){Lt();return}let r=t.getItem(e.directoryPath),i=ku(r)?r:null;if(i==null||i.isExpanded()){Lt();return}let a=`${e.directoryPath}::${e.flattenedSegmentPath??``}`;re.current!==a&&(Lt(),re.current=a,ie.current=setTimeout(()=>{let n=t.getDragSession()?.target;n?.kind!==`directory`||n.directoryPath!==e.directoryPath||n.flattenedSegmentPath!==e.flattenedSegmentPath||i.expand()},n))},Wt=()=>{ne.current=null;let e=ae.current,n=C.current;if(e==null||n==null||t.getDragSession()==null)return;let r=n.getBoundingClientRect(),i=Eu(e.clientY,r);if(i===0)return;let a=Math.max(0,n.scrollHeight-n.clientHeight),o=Math.max(0,Math.min(a,n.scrollTop+i));o!==n.scrollTop&&(n.scrollTop=o,D.current()),Ut(Ht(e.clientX,e.clientY)),ne.current=Ft(Wt)},U=(e,t)=>{ae.current={clientX:e,clientY:t},ne.current??=Ft(Wt)},W=(e,n,r)=>{let i=e.currentTarget;if(i!=null){if(Vt(),Rt(),Lt(),zt(),t.startDrag(r)===!1){e.preventDefault();return}if(se.current=n,e.dataTransfer!=null&&(e.dataTransfer.effectAllowed=`move`,e.dataTransfer.dropEffect=`move`,e.dataTransfer.setData(`text/plain`,r),Tu())){let t=wu(i),n=i.getBoundingClientRect();Object.assign(t.style,{height:`${n.height}px`,opacity:`0.85`,transform:`translate3d(-9999px, 0px, 0)`,width:`${n.width}px`}),Bt(t),oe.current=t,e.dataTransfer.setDragImage(t,Math.max(0,e.clientX-n.left),Math.max(0,e.clientY-n.top))}}},Gt=()=>{Rt(),Lt(),zt(),se.current=null,t.cancelDrag()},Kt=(e,n,r)=>{if(fe.current!=null||ce.current)return;let i=e.touches[0],a=e.currentTarget;if(i==null||a==null)return;de.current={clientX:i.clientX,clientY:i.clientY},I.current=a,a.setAttribute(`draggable`,`false`);let o=(e={})=>{let t=e.restoreNativeDraggable??!ce.current;fe.current!=null&&(clearTimeout(fe.current),fe.current=null),document.removeEventListener(`touchmove`,s),document.removeEventListener(`touchend`,c),document.removeEventListener(`touchcancel`,c),F.current===o&&(F.current=null),t&&(a.setAttribute(`draggable`,`true`),I.current===a&&(I.current=null),de.current=null)},s=e=>{let t=e.touches[0],n=de.current;if(t==null||n==null)return;let r=t.clientX-n.clientX,i=t.clientY-n.clientY;r*r+i*i<=vu*vu||o()},c=()=>{o()};document.addEventListener(`touchmove`,s,{passive:!0}),document.addEventListener(`touchend`,c),document.addEventListener(`touchcancel`,c),F.current=o,fe.current=setTimeout(()=>{if(o({restoreNativeDraggable:!1}),t.startDrag(r)===!1){a.setAttribute(`draggable`,`true`),I.current===a&&(I.current=null),de.current=null;return}ce.current=!0,I.current=a,a.setAttribute(`draggable`,`false`),a.style.setProperty(`touch-action`,`none`),se.current=n;let e=a.getBoundingClientRect(),s=wu(a);Object.assign(s.style,{height:`${e.height}px`,opacity:`0.85`,transform:`translate3d(${e.left}px, ${e.top}px, 0)`,width:`${e.width}px`}),Bt(s),oe.current=s,le.current={x:i.clientX-e.left,y:i.clientY-e.top};let c=e=>{let t=e.touches[0];if(t==null)return;e.preventDefault();let n=le.current;n!=null&&oe.current!=null&&(oe.current.style.transform=`translate3d(${t.clientX-n.x}px, ${t.clientY-n.y}px, 0)`),Ut(Ht(t.clientX,t.clientY)),U(t.clientX,t.clientY)},l=e=>{let n=e.changedTouches[0];n!=null&&Ht(n.clientX,n.clientY),t.completeDrag(),Vt()},u=()=>{t.cancelDrag(),Vt()};F.current=()=>{document.removeEventListener(`touchmove`,c),document.removeEventListener(`touchend`,l),document.removeEventListener(`touchcancel`,u)},document.addEventListener(`touchmove`,c,{passive:!1}),document.addEventListener(`touchend`,l),document.addEventListener(`touchcancel`,u)},_u)},qt=e=>{if(L!=null){if(e.key===`Escape`){kt(),e.preventDefault(),e.stopPropagation();return}Fu.has(e.key)&&(e.preventDefault(),e.stopPropagation());return}if(z.isActive()){if(e.key===`Escape`)z.cancel();else if(e.key===`Enter`)z.commit();else return;Se(`focus`),me(e=>e+1),e.preventDefault(),e.stopPropagation();return}if(l&&e.key===`F2`){Mt(B??void 0),e.preventDefault(),e.stopPropagation();return}if(rt){if(e.key===`Escape`)ee.current=!1,te.current=null,t.closeSearch();else if(e.key===`Enter`){let e=t.getFocusedPath();e!=null&&t.selectOnlyPath(e);let n=C.current,r=Dl(n,gt);te.current=V<0||n==null?null:Math.max(0,Math.min(V*s-n.scrollTop,Math.max(0,r-s))),ee.current=!0,t.closeSearch()}else if(e.key===`ArrowDown`)t.focusNextSearchMatch();else if(e.key===`ArrowUp`)t.focusPreviousSearchMatch();else return;Se(`focus`),me(e=>e+1),e.preventDefault(),e.stopPropagation();return}if(f&&ju(e)){t.openSearch(e.key),me(e=>e+1),e.preventDefault(),e.stopPropagation();return}let n=Ge&&Nu(e),r=Pu(e,Ge),i=r&&S.current!=null?El(S.current):null,a=r?new Set(Hu(S.current)):new Set,o=i?.dataset.fileTreeStickyPath??null,c=i?.dataset.fileTreeStickyRow===`true`&&o!=null;if(c&&o!==B&&a.has(o)){let e=C.current;Pe(o,e?.scrollTop??null),t.focusPath(o)}let u=t.getFocusedPath(),d=t.getFocusedIndex(),p=t.getFocusedItem();if(p==null)return;let m=ku(p)?p:null,h=u!=null&&(xt.has(u)||c&&o===u&&a.has(u)),g=e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`ArrowRight`&&m!=null&&m.isExpanded(),_=e.key===`ArrowLeft`&&h&&m!=null&&m.isExpanded(),v=C.current,y=!0;if(e.shiftKey&&e.key===`ArrowDown`)t.extendSelectionFromFocused(1);else if(e.shiftKey&&e.key===`ArrowUp`)t.extendSelectionFromFocused(-1);else if(n&&u!=null&&d>=0){let e=t.getVisibleRows(d,d)[0]??null,n=Vu(u,E.current,T.current);e==null||n==null?y=!1:jt(e,u)}else if((e.ctrlKey||e.metaKey)&&Au(e))t.toggleFocusedSelection();else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()===`a`)t.selectAllVisiblePaths();else switch(e.key){case`ArrowDown`:t.focusNextItem();break;case`ArrowUp`:t.focusPreviousItem();break;case`ArrowRight`:m==null||m.isExpanded()?t.focusNextItem():m.expand();break;case`ArrowLeft`:m!=null&&m.isExpanded()?m.collapse():t.focusParentItem();break;case`Home`:t.focusFirstItem();break;case`End`:t.focusLastItem();break;default:y=!1}if(!y)return;Se(`focus`);let b=t.getFocusedPath(),x=b!=null&&(xt.has(b)||a.has(b)),w=g&&b!==u,D=n&&c&&o===u&&b===u;if((h||D)&&b!=null&&(w&&x||D))Pe(b,v?.scrollTop??null),M.current=!0,ge(e=>e===b?e:b);else{let t=e.key===`ArrowUp`&&h&&b!==u;b!=null&&(t||_&&b===u)?(Fe(b,Wu(S.current,v,i,u,s,bt,gt)),M.current=!0,ge(e=>e===b?e:b)):Ne()}me(e=>e+1),e.preventDefault(),e.stopPropagation()};nu(()=>{if(!(!f||!rt)){if(Ie.current){Ie.current=!1;return}Tl(w.current)}},[rt,f]),nu(()=>{let e=x.current;switch(Pl({hasRenderedInput:e!=null,previousRenamingPath:P.current,renamingPath:tt})){case`reset`:P.current=null;return;case`reveal-canonical`:tt!=null&&Nt(tt,{restoreTreeFocus:!1,targetOffset:`live-overlay`});return;case`ignore`:return;case`focus-input`:e!=null&&(De.current=null,P.current=tt,Tl(e),e.select());return}},[_t.end,_t.start,tt,Nt,xt]),nu(()=>{let e=S.current;if(e==null)return;let t=null,n=()=>{t!=null&&(clearTimeout(t),t=null)},r=()=>{let t=El(e)?.dataset.itemPath??null;ge(e=>e===t?e:t)},i=()=>{n(),M.current=!0,r()},a=i=>{let a=i.relatedTarget;if(a==null){n(),t=setTimeout(()=>{if(t=null,El(e)!=null){r();return}M.current=!1,ge(null)},0);return}if(!(a instanceof Node)||!e.contains(a)){n(),M.current=!1,ge(null);return}let o=a instanceof HTMLElement?a.dataset.itemPath??null:null;ge(e=>e===o?e:o)};return e.addEventListener(`focusin`,i),e.addEventListener(`focusout`,a),()=>{n(),e.removeEventListener(`focusin`,i),e.removeEventListener(`focusout`,a)}},[]),nu(()=>{let e=S.current;e!=null&&(mt.physical.scrollTop<=0?e.dataset.scrollAtTop=`true`:delete e.dataset.scrollAtTop)},[mt.physical.scrollTop]),nu(()=>{let e=null,n=C.current,r=b.current,i=S.current;if(n==null)return;O.current=Dl(n,g);let a=()=>{let e=t.getVisibleCount(),r=Ol(O.current,g),i=Math.max(0,e*s-r);n.scrollTop>i&&(n.scrollTop=i),He(gu({controller:t,itemHeight:s,overscan:c,scrollTop:Math.min(n.scrollTop,i),stickyFolders:h,viewportHeight:r}))};if(!A.current){A.current=!0;let e=t.getFocusedIndex();if(e>=0){let r=Ol(O.current,g),i=t.getVisibleRows(e,e)[0]??null;Al(n,e,s,r,h&&i!=null?Math.max(0,Math.min(i.ancestorPaths.length*s,Math.max(0,r-s))):0)}}D.current=a;let o=!1,l=t.subscribe(()=>{o?me(e=>e+1):o=!0,a()}),u=()=>{Me.current!==!0&&(r!=null&&(r.dataset.isScrolling??=``),i!=null&&(i.dataset.isScrolling??=``),y.current=!0,e!=null&&clearTimeout(e),e=setTimeout(()=>{r!=null&&delete r.dataset.isScrolling,i!=null&&delete i.dataset.isScrolling,y.current=!1,we(e=>e+1),e=null},50))},d=null,f=()=>{i!=null&&delete i.dataset.overlayReveal,d!=null&&(clearTimeout(d),d=null)},p=()=>{i==null||Me.current===!0||n.scrollTop>0||(i.dataset.overlayReveal=`true`,d!=null&&clearTimeout(d),d=setTimeout(()=>{f()},200))},m=()=>{if(a(),n.scrollTop>0&&f(),Ee.current!=null&&y.current&&Ot.current(),Me.current===!0){y.current=!1;return}ve(e=>e==null?e:null),u()},_=()=>{u(),p()},v=new Set([`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`PageUp`,`PageDown`,`Home`,`End`,` `,`Spacebar`]),x=e=>{v.has(e.key)&&_()};n.addEventListener(`scroll`,m,{passive:!0}),n.addEventListener(`wheel`,_,{passive:!0}),n.addEventListener(`touchmove`,_,{passive:!0}),n.addEventListener(`keydown`,x);let w=typeof ResizeObserver<`u`?new ResizeObserver(e=>{O.current=(e[0]==null?null:kl(e[0]))??Dl(n,g),a()}):null;return w?.observe(n),()=>{D.current=()=>{},l(),n.removeEventListener(`scroll`,m),n.removeEventListener(`wheel`,_),n.removeEventListener(`touchmove`,_),n.removeEventListener(`keydown`,x),e!=null&&clearTimeout(e),d!=null&&clearTimeout(d),r!=null&&delete r.dataset.isScrolling,i!=null&&(delete i.dataset.isScrolling,delete i.dataset.overlayReveal),y.current=!1,O.current=null,w?.disconnect()}},[t,g,s,c,h]),nu(()=>{Ge||L==null||kt(!1)},[kt,Ge,L]);let Jt=ru(()=>L==null?null:`${L.path}::${L.source}`,[L]);nu(()=>{if(Jt==null){m?.clearSlotContent(xr);return}let t=Ee.current;if(t==null)return;let n=v.current??_.current;if(n==null)return;let r={anchorElement:n,anchorRect:t.anchorRect??Lu(n.getBoundingClientRect()),close:e=>{Ot.current(e?.restoreFocus??!0)},restoreFocus:()=>{Dt.current&&Et.current(Ee.current?.path??null)}},i=e?.contextMenu?.render?.(t.item,r)??null;return m?.setSlotContent(xr,i),e?.contextMenu?.onOpen?.(t.item,r),Xu(i),queueMicrotask(()=>{i==null||!i.isConnected||document.activeElement===i&&Xu(i)}),()=>{m?.clearSlotContent(xr)}},[Jt,e?.contextMenu,m]),nu(()=>{L!=null&&t.getItem(L.path)==null&&kt()},[kt,L,t]),nu(()=>{if(L==null)return;let e=S.current?.getRootNode(),t=e instanceof ShadowRoot?e.host:S.current,n=e=>{let n=e.target;n instanceof Node&&(Iu(e)||_.current?.contains(n)!==!0&&t?.contains(n)!==!0&&kt())},r=e=>{e.key===`Escape`&&(e.preventDefault(),e.stopPropagation(),kt())};return document.addEventListener(`mousedown`,n,!0),document.addEventListener(`keydown`,r,!0),()=>{document.removeEventListener(`mousedown`,n,!0),document.removeEventListener(`keydown`,r,!0)}},[kt,L]),nu(()=>{let e=C.current,n=S.current;if(e==null||n==null){N.current=B;return}let r=B==null?null:T.current.get(B)??null,i=El(n),a=i?.dataset.itemPath??null,o=nt&&x.current===i,c=f&&w.current===i,l=ee.current&&!rt,u=te.current??0,d=De.current,p=Oe.current,m=ke.current,g=Ae.current,_=i!=null,v=M.current||_,y=N.current!==B,b=p!=null&&p===B&&B!=null,E=!1,O=!1;if(at!=null&&at.id!==k.current){k.current=at.id;let n=at.visibleIndex,r=t.getVisibleRows(n,n)[0]??null;if(r!=null){let t=h?Math.max(0,Math.min(r.ancestorPaths.length*s,Math.max(0,gt-s))):bt;E=!0,O=jl(e,n,s,gt,yt,at.offset,t)}t.clearScrollRequest(at.id)}let A=!E&&l&&Ml(e,V,s,gt,yt,u),j=!E&&d!=null&&d===B&&Ml(e,V,s,gt,yt,bt),P=!E&&m!=null&&m.path===B&&Ml(e,V,s,gt,yt,m.viewportOffset),ne=!E&&g!=null&&g.path===B&&e.scrollTop!==g.scrollTop;if(ne&&(e.scrollTop=g.scrollTop),(ne||O||j||P||A||v&&y&&d!==B&&!b&&Al(e,V,s,gt,bt))&&D.current(),E){N.current=B;return}if(!v){N.current=B;return}if(o){N.current=B;return}if(c&&!l){N.current=B;return}if(r==null){l&&V>=0&&(Ml(e,V,s,gt,yt,u),D.current()),N.current=B;return}(y||l||d===B||p===B||m?.path===B||g?.path===B||a==null||a!==B)&&(Tl(r),d===B&&(De.current=null),p===B&&(Oe.current=null),m?.path===B&&(ke.current=null),g?.path===B&&(Ae.current=null),ee.current=!1,te.current=null),N.current=B},[t,V,B,St,s,nt,rt,_t,gt,f,at,h,bt,yt,ht]);let Yt=V>=0&&V>=mt.visible.startIndex&&V<=mt.visible.endIndex,Xt=B!=null&&H.some(e=>pu(e.row)===B),Zt=Yt||Xt,Qt=qe&&M.current===!0&&Zt?B:null,$t=xe===`pointer`?_e:null,en=L?.path??je.current??$t??Qt??_e,tn=L?.source===`right-click`;nu(()=>{y.current&&L==null||At(Qe(en))},[L,Qe,_t,gt,Ce,H,en,At,ht]);let nn=iu(e=>{if(y.current||Iu(e))return;let t=e.target;if(!(t instanceof HTMLElement)||t.closest?.(`[data-type="context-menu-trigger"]`)!=null)return;let n=t.closest?.(`[data-file-tree-sticky-row="true"]`),r=t.closest?.(`[data-type="item"]`),i=n instanceof HTMLElement?n.dataset.fileTreeStickyPath??null:r instanceof HTMLElement?r.dataset.itemPath??null:null;i!=null&&Se(e=>e===`pointer`?e:`pointer`),ve(e=>e===i?e:i)},[]),rn=iu(()=>{ve(null)},[]);nu(()=>{if(!ot)return;let e=()=>{Vt(),t.cancelDrag()};return window.addEventListener(`dragend`,e),()=>{window.removeEventListener(`dragend`,e),Vt(),t.cancelDrag()}},[t,ot]);let an=e=>{if(!ot||t.getDragSession()==null||ce.current)return;let n=Cu(e.target instanceof HTMLElement?e.target:null);t.setDragTarget(n),Ut(t.getDragSession()?.target??null),U(e.clientX,e.clientY),e.dataTransfer!=null&&(e.dataTransfer.dropEffect=`move`),e.preventDefault()},on=e=>{if(!ot||t.getDragSession()==null||ce.current)return;let n=e.relatedTarget;n instanceof Node&&S.current?.contains(n)===!0||(Lt(),zt(),t.setDragTarget(null))},sn=e=>{!ot||t.getDragSession()==null||ce.current||(e.preventDefault(),Ht(e.clientX,e.clientY),t.completeDrag(),Rt(),Lt(),zt(),se.current=null)},cn=mt.window.height,ln=mt.window.offsetTop,un=Math.min(0,gt-cn),dn=Math.min(0,gt-cn-bt),fn=he===B||ee.current,pn=B!=null&&fn&&!St&&V>=0?ht[V]??t.getVisibleRows(V,V)[0]??null:null,mn=pn==null?null:Nl(V,s,_t,cn),hn=se.current,gn=ut!=null&&hn!=null&&hn.path===ut&&hn.index>=_t.start&&hn.index<=_t.end,_n=ut!=null&&hn!=null&&hn.path===ut&&!gn&&hn.path!==pn?.path?hn:null,G=_n==null?null:Nl(_n.index,s,_t,cn),vn=Mu((V>=0?ht[V]??t.getVisibleRows(V,V)[0]??null:null)?.ancestorPaths.at(-1)??null),yn=rt&&B!=null?qu(o,B,!St):void 0,bn=L?.path??(rt?B:he),xn=L?.path??_e,Sn=Qe(en),Cn=Ge&&qe&&!tn&&!nt&&Sn!=null&&ye!=null&&en!=null,wn=Ge&&(Cn||L!=null),Tn=L?.anchorRect,En=Tn==null&&Sn!=null&&ye!=null&&(L!=null||Cn)?ye:null,Dn=Tn==null?En==null?void 0:{top:`${En}px`}:{left:`${Tn.left}px`,position:`fixed`,right:`auto`,top:`${Tn.top}px`},On=tn?{opacity:`0`}:void 0,kn=iu((e,n,r,i)=>{let a=Ll({event:{ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey},isDirectory:n.kind===`directory`,isSearchOpen:rt,mode:i}),o=a.toggleDirectory&&n.kind===`directory`,s=o?t.resolveMountedDirectoryPathFromInput(r):null;if(o&&s==null)return;let c=s??r;switch(a.selection.kind){case`range`:t.selectPathRange(c,a.selection.additive);break;case`toggle`:t.togglePathSelectionFromInput(c);break;case`single`:t.selectOnlyMountedPathFromInput(c);break}let l=e.currentTarget instanceof HTMLElement?e.currentTarget:null,u=n.index>=mt.visible.startIndex&&n.index<=mt.visible.endIndex,d=i===`flow`&&u&&l!=null&&l.dataset.itemParked!==`true`;t.focusMountedPathFromInput(c),d&&(M.current=!0,ge(e=>e===c?e:c),Se(`focus`)),o&&t.toggleMountedDirectoryFromInput(c),a.closeSearch&&t.closeSearch(),a.revealCanonical&&Nt(c,{targetOffset:`sticky-parents`})},[t,rt,mt.visible.endIndex,mt.visible.startIndex,Nt]),An=()=>{if(y.current||!qe||en==null||Sn==null)return;let e=t.getItem(en);e!=null&&(At(Sn),Dt.current=!0,Te({anchorRect:null,item:{kind:e.isDirectory()?`directory`:`file`,name:Sn.getAttribute(`aria-label`)??en,path:e.getPath()},path:e.getPath(),source:`button`}))},jn={contextHoverPath:xn,contextMenuButtonTriggerEnabled:qe,contextMenuButtonVisibility:Je,contextMenuEnabled:Ge,contextMenuRightClickEnabled:Ye,contextMenuTriggerMode:Ke,controller:t,directoriesWithGitChanges:i,dragAndDropEnabled:ot,draggedPathSet:ct,dragTarget:lt,gitLaneActive:$e,gitStatusByPath:n,handleRowDragEnd:Gt,handleRowDragStart:W,handleRowTouchStart:Kt,ignoredGitDirectories:r,ignoredInheritanceCache:pe,instanceId:o,itemHeight:s,onKeyDown:qt,onRowClick:kn,openContextMenuForRow:jt,registerButton:Xe,registerRenameInput:R,renameView:z,renderDecorationForRow:Ct,resolveIcon:et,shouldSuppressContextMenu:Pt,visualFocusPath:bn},Mn={...jn,registerButton:Ze};return Q(`div`,{ref:S,id:dt,"data-file-tree-context-menu-button-visibility":Ge&&qe?Je:void 0,"data-file-tree-context-menu-trigger-mode":Ge?Ke:void 0,"data-file-tree-has-context-menu-action-lane":Ge&&qe?`true`:void 0,"data-file-tree-has-git-lane":$e?`true`:void 0,"data-file-tree-virtualized-root":`true`,onDragLeave:ot?on:void 0,onDragOver:ot?an:void 0,onDrop:ot?sn:void 0,onKeyDown:qt,onPointerLeave:Ge?rn:void 0,onPointerOver:Ge?nn:void 0,role:`tree`,tabIndex:-1,style:{outline:`none`,position:`relative`},children:[Q(`style`,{"data-file-tree-guide-style":`true`,dangerouslySetInnerHTML:{__html:vn}}),Q(`slot`,{name:br,"data-type":`header-slot`}),f?Q(`div`,{"data-file-tree-search-container":!0,"data-open":rt?`true`:`false`,children:Q(`input`,{ref:w,"aria-activedescendant":yn,"aria-controls":dt,placeholder:`Search…`,"data-file-tree-search-input":!0,"data-file-tree-search-input-fake-focus":Le?`true`:void 0,value:it,onBlur:()=>{d===`retain`&&!ze.current||t.closeSearch()},onFocus:Be,onPointerDown:Be,onInput:e=>{Be();let n=e.currentTarget;t.setSearch(n.value)}})}):null,Q(`div`,{ref:C,"data-file-tree-virtualized-scroll":`true`,children:[h&&Ue&&H.length>0?Q(`div`,{"aria-hidden":`true`,"data-file-tree-sticky-overlay":`true`,children:Q(`div`,{"data-file-tree-sticky-overlay-content":`true`,style:{height:`${ft}px`},children:H.map((e,t)=>Qu(Mn,e.row,`sticky:${pu(e.row)}`,{mode:`sticky`,style:{left:`0`,position:`absolute`,right:`0`,top:`${e.top}px`,zIndex:`${H.length-t}`}}))})}):null,Q(`div`,{ref:b,"data-file-tree-virtualized-list":`true`,style:{height:`${yt}px`},children:[Q(`div`,{"data-file-tree-virtualized-sticky-offset":`true`,"aria-hidden":`true`,style:{height:`${ln}px`}}),Q(`div`,{"data-file-tree-virtualized-sticky":`true`,style:{height:`${cn}px`,top:`${un}px`,bottom:`${dn}px`},children:[$u(jn,_t,xt),pn!=null&&mn!=null?Qu(jn,pn,`parked:${pn.path}`,{isParked:!0,style:{left:`0`,opacity:`0`,pointerEvents:ut===pn.path?`none`:void 0,position:`absolute`,right:`0`,top:`${mn}px`}}):null,_n!=null&&G!=null?Qu(jn,_n,`parked-drag:${_n.path}`,{isParked:!0,style:{left:`0`,opacity:`0`,pointerEvents:`none`,position:`absolute`,right:`0`,top:`${G}px`}}):null]})]})]}),Ge?Q(`div`,{ref:_,"data-type":`context-menu-anchor`,"data-visible":wn?`true`:`false`,style:Dn,children:[Q(`button`,{ref:v,type:`button`,"data-type":Sr,"aria-label":`Options`,"aria-haspopup":`menu`,"aria-expanded":L==null?`false`:`true`,"data-visible":Cn?`true`:`false`,onMouseDown:e=>{e.preventDefault()},onClick:e=>{if(e.preventDefault(),e.stopPropagation(),L!=null){kt();return}An()},tabIndex:-1,style:On,children:Q(Jc,{...et(`file-tree-icon-ellipsis`)})}),L==null?null:Q(`slot`,{name:xr})]}):null,L==null?null:Q(`div`,{"data-type":`context-menu-wash`,"aria-hidden":`true`,onMouseDownCapture:e=>{e.preventDefault(),kt()},onTouchStartCapture:e=>{e.preventDefault(),e.stopPropagation(),kt()},onTouchMoveCapture:e=>{e.preventDefault(),e.stopPropagation()},onWheelCapture:e=>{e.preventDefault(),e.stopPropagation()}})]})}var td={hydrateRoot:(e,t)=>{Uc(yc(ed,t),e)},renderRoot:(e,t)=>{Hc(yc(ed,t),e)},unmountRoot:e=>{Hc(null,e)}};function nd(e,t){td.renderRoot(e,t)}function rd(e,t){td.hydrateRoot(e,t)}function id(e){td.unmountRoot(e)}var ad=class{#e=new Map;#t=null;clearAll(){for(let e of this.#e.values())e.remove();this.#e.clear()}clearSlotContent(e){let t=this.#n(e);t!=null&&(t.remove(),this.#e.delete(e))}setHost(e){if(this.#t=e,e!=null){this.#i(e);for(let[e,t]of this.#e)this.#r(e,t)}}setSlotContent(e,t){let n=this.#n(e);if(n===t){t!=null&&(this.#e.set(e,t),this.#r(e,t));return}if(n?.remove(),t==null){this.#e.delete(e);return}this.#e.set(e,t),this.#r(e,t)}setSlotHtml(e,t){let n=t?.trim()??``;if(n.length===0){this.setSlotContent(e,null);return}let r=this.#n(e);if(r!=null&&r.innerHTML===n){this.#e.set(e,r),this.#r(e,r);return}let i=document.createElement(`div`);i.innerHTML=n,this.setSlotContent(e,i)}#n(e){let t=this.#e.get(e)??null;if(t!=null)return t;let n=this.#t;if(n==null)return null;for(let t of Array.from(n.children))if(t instanceof HTMLElement&&t.dataset.fileTreeManagedSlot===e)return t;return null}#r(e,t){t.slot=e,t.dataset.fileTreeManagedSlot=e,this.#t!=null&&t.parentNode!==this.#t&&this.#t.appendChild(t)}#i(e){for(let t of Array.from(e.children)){if(!(t instanceof HTMLElement))continue;let e=t.dataset.fileTreeManagedSlot;e==null||this.#e.has(e)||this.#e.set(e,t)}}},od=`__c`,sd=`__k`,cd=`__d`,ld=`__s`,ud=/[\s\n\\/='"\0<>]/,dd=/^(xlink|xmlns|xml)([A-Z])/,fd=/^(?:accessK|auto[A-Z]|cell|ch|col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z])/,pd=/^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/,md=new Set([`draggable`,`spellcheck`]);function hd(e){e.__g===void 0?e[cd]=!0:e.__g|=8}function gd(e){e.__g===void 0?e[cd]=!1:e.__g&=-9}function _d(e){return e.__g===void 0?!0===e[cd]:!!(8&e.__g)}var vd=/["&<]/;function yd(e){if(e.length===0||!1===vd.test(e))return e;for(var t=0,n=0,r=``,i=``;n<e.length;n++){switch(e.charCodeAt(n)){case 34:i=`&quot;`;break;case 38:i=`&amp;`;break;case 60:i=`&lt;`;break;default:continue}n!==t&&(r+=e.slice(t,n)),r+=i,t=n+1}return n!==t&&(r+=e.slice(t,n)),r}var bd={},xd=new Set(`animation-iteration-count.border-image-outset.border-image-slice.border-image-width.box-flex.box-flex-group.box-ordinal-group.column-count.fill-opacity.flex.flex-grow.flex-negative.flex-order.flex-positive.flex-shrink.flood-opacity.font-weight.grid-column.grid-row.line-clamp.line-height.opacity.order.orphans.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-miterlimit.stroke-opacity.stroke-width.tab-size.widows.z-index.zoom`.split(`.`)),Sd=/[A-Z]/g;function Cd(e){var t=``;for(var n in e){var r=e[n];if(r!=null&&r!==``){var i=n[0]==`-`?n:bd[n]||(bd[n]=n.replace(Sd,`-$&`).toLowerCase()),a=`;`;typeof r!=`number`||i.startsWith(`--`)||xd.has(i)||(a=`px;`),t=t+i+`:`+r+a}}return t||void 0}function wd(){this.__d=!0}function Td(e,t){return{__v:e,context:t,props:e.props,setState:wd,forceUpdate:wd,__d:!0,__h:[]}}function Ed(e,t,n){if(!e.s){if(n instanceof Dd){if(!n.s)return void(n.o=Ed.bind(null,e,t));1&t&&(t=n.s),n=n.v}if(n&&n.then)return void n.then(Ed.bind(null,e,t),Ed.bind(null,e,2));e.s=t,e.v=n;let r=e.o;r&&r(e)}}var Dd=function(){function e(){}return e.prototype.then=function(t,n){var r=new e,i=this.s;if(i){var a=1&i?t:n;if(a){try{Ed(r,1,a(this.v))}catch(e){Ed(r,2,e)}return r}return this}return this.o=function(e){try{var i=e.v;1&e.s?Ed(r,1,t?t(i):i):n?Ed(r,1,n(i)):Ed(r,2,i)}catch(e){Ed(r,2,e)}},r},e}(),Od,kd,Ad,jd,Md={},Nd=Array.isArray,Pd=Object.assign,Fd=``,Id=`<!--$s-->`,Ld=`<!--/$s-->`;function Rd(e,t){var n,r=e.type,i=!0;return e[od]?(i=!1,(n=e[od]).state=n[ld]):n=new r(e.props,t),e[od]=n,n.__v=e,n.props=e.props,n.context=t,hd(n),n.state??=Md,n[ld]??(n[ld]=n.state),r.getDerivedStateFromProps?n.state=Pd({},n.state,r.getDerivedStateFromProps(n.props,n.state)):i&&n.componentWillMount?(n.componentWillMount(),n.state=n[ld]===n.state?n.state:n[ld]):!i&&n.componentWillUpdate&&n.componentWillUpdate(),Ad&&Ad(e),n.render(n.props,n.state,t)}function zd(e,t,n,r,i,a,o){if(e==null||!0===e||!1===e||e===Fd)return Fd;var s=typeof e;if(s!=`object`)return s==`function`?Fd:s==`string`?yd(e):e+Fd;if(Nd(e)){var c,l=Fd;i[sd]=e;for(var u=e.length,d=0;d<u;d++){var f=e[d];if(f!=null&&typeof f!=`boolean`){var p,m=zd(f,t,n,r,i,a,o);typeof m==`string`?l+=m:(c||=Array(u),l&&c.push(l),l=Fd,Nd(m)?(p=c).push.apply(p,m):c.push(m))}}return c?(l&&c.push(l),c):l}if(e.constructor!==void 0)return Fd;e.__=i,Od&&Od(e);var h=e.type,g=e.props;if(typeof h==`function`){var _,v,y,b=t;if(h===xc){if(`tpl`in g){for(var x=Fd,S=0;S<g.tpl.length;S++)if(x+=g.tpl[S],g.exprs&&S<g.exprs.length){var C=g.exprs[S];if(C==null)continue;typeof C!=`object`||C.constructor!==void 0&&!Nd(C)?x+=C:x+=zd(C,t,n,r,e,a,o)}return x}if(`UNSTABLE_comment`in g)return`<!--`+yd(g.UNSTABLE_comment)+`-->`;v=g.children}else{if((_=h.contextType)!=null){var w=t[_.__c];b=w?w.props.value:_.__}var T=h.prototype&&typeof h.prototype.render==`function`;if(T)v=Rd(e,b),y=e[od];else{e[od]=y=Td(e,b);for(var E=0;_d(y)&&E++<25;){gd(y),Ad&&Ad(e);try{v=h.call(y,g,b)}catch(t){throw a&&t&&typeof t.then==`function`&&(e._suspended=!0),t}}hd(y)}if(y.getChildContext!=null&&(t=Pd({},t,y.getChildContext())),T&&Z.errorBoundaries&&(h.getDerivedStateFromError||y.componentDidCatch)){v=v!=null&&v.type===xc&&v.key==null&&v.props.tpl==null?v.props.children:v;try{return zd(v,t,n,r,e,a,!1)}catch(i){return h.getDerivedStateFromError&&(y[ld]=h.getDerivedStateFromError(i)),y.componentDidCatch&&y.componentDidCatch(i,Md),_d(y)?(v=Rd(e,t),(y=e[od]).getChildContext!=null&&(t=Pd({},t,y.getChildContext())),zd(v=v!=null&&v.type===xc&&v.key==null&&v.props.tpl==null?v.props.children:v,t,n,r,e,a,o)):Fd}finally{kd&&kd(e),jd&&jd(e)}}}v=v!=null&&v.type===xc&&v.key==null&&v.props.tpl==null?v.props.children:v;try{var D=zd(v,t,n,r,e,a,o);return kd&&kd(e),Z.unmount&&Z.unmount(e),e._suspended?typeof D==`string`?Id+D+Ld:Nd(D)?(D.unshift(Id),D.push(Ld),D):D.then(function(e){return Id+e+Ld}):D}catch(i){if(!a&&o&&o.onError){var O=function i(s){return o.onError(s,e,function(e,s){try{return zd(e,t,n,r,s,a,o)}catch(e){return i(e)}})}(i);if(O!==void 0)return O;var k=Z.__e;return k&&k(i,e),Fd}if(!a||!i||typeof i.then!=`function`)throw i;return i.then(function i(){try{var s=zd(v,t,n,r,e,a,o);return e._suspended?Id+s+Ld:s}catch(e){if(!e||typeof e.then!=`function`)throw e;return e.then(i)}})}}var A,j=`<`+h,M=Fd;for(var N in g){var P=g[N];if(typeof(P=Vd(P)?P.value:P)!=`function`||N===`class`||N===`className`){switch(N){case`children`:A=P;continue;case`key`:case`ref`:case`__self`:case`__source`:continue;case`htmlFor`:if(`for`in g)continue;N=`for`;break;case`className`:if(`class`in g)continue;N=`class`;break;case`defaultChecked`:N=`checked`;break;case`defaultSelected`:N=`selected`;break;case`defaultValue`:case`value`:switch(N=`value`,h){case`textarea`:A=P;continue;case`select`:r=P;continue;case`option`:r!=P||`selected`in g||(j+=` selected`)}break;case`dangerouslySetInnerHTML`:M=P&&P.__html;continue;case`style`:typeof P==`object`&&(P=Cd(P));break;case`acceptCharset`:N=`accept-charset`;break;case`httpEquiv`:N=`http-equiv`;break;default:if(dd.test(N))N=N.replace(dd,`$1:$2`).toLowerCase();else{if(ud.test(N))continue;N[4]!==`-`&&!md.has(N)||P==null?n?pd.test(N)&&(N=N===`panose1`?`panose-1`:N.replace(/([A-Z])/g,`-$1`).toLowerCase()):fd.test(N)&&(N=N.toLowerCase()):P+=Fd}}P!=null&&!1!==P&&(j=!0===P||P===Fd?j+` `+N:j+` `+N+`="`+(typeof P==`string`?yd(P):P+Fd)+`"`)}}if(ud.test(h))throw Error(h+` is not a valid HTML tag name in `+j+`>`);if(M||(typeof A==`string`?M=yd(A):A!=null&&!1!==A&&!0!==A&&(M=zd(A,t,h===`svg`||h!==`foreignObject`&&n,r,e,a,o))),kd&&kd(e),jd&&jd(e),!M&&Bd.has(h))return j+`/>`;var ee=`</`+h+`>`,te=j+`>`;return Nd(M)?[te].concat(M,[ee]):typeof M==`string`?te+M+ee:[te,M,ee]}var Bd=new Set([`area`,`base`,`br`,`col`,`command`,`embed`,`hr`,`img`,`input`,`keygen`,`link`,`meta`,`param`,`source`,`track`,`wbr`]);function Vd(e){return typeof e==`object`&&!!e&&typeof e.peek==`function`&&`value`in e}var Hd=0;function Ud(e){return e!=null&&e.length>0?e:(Hd+=1,`pst_ft_${Hd}`)}function Wd({initialVisibleRowCount:e,itemHeight:t}){return e==null?420:Math.max(0,e)*(t??ts)}function Gd(e){if(typeof document>`u`)return;let t=document.createElement(`div`);t.innerHTML=e;let n=t.querySelector(`svg`);return n instanceof SVGElement?n:void 0}function Kd(e){return e.querySelector(`#file-tree-icon-chevron`)instanceof SVGElement&&e.querySelector(`#file-tree-icon-file`)instanceof SVGElement&&e.querySelector(`#file-tree-icon-dot`)instanceof SVGElement&&e.querySelector(`#file-tree-icon-lock`)instanceof SVGElement}function qd(e){return Array.from(e.children).filter(e=>e instanceof SVGElement)}var Jd=class{static LoadedCustomComponent=!0;#e;#t;#n;#r;#i;#a;#o;#s;#c;#l=new ad;#u;#d;#f;#p;#m;#h;#g;#_;#v;#y=null;#b;#x=!1;#S=!1;constructor(e){let{composition:t,density:n,fileTreeSearchMode:r,gitStatus:i,id:a,initialSearchQuery:o,icons:s,itemHeight:c,onSearchChange:l,onSelectionChange:u,overscan:d,renderRowDecoration:f,renaming:p,search:m,searchBlurBehavior:h,searchFakeFocus:g,stickyFolders:_,unsafeCSS:v,initialVisibleRowCount:y,...b}=e;this.#e=t,this.#n=Ud(a),this.#p=rc(i),this.#m=s,this.#h=v,this.#r=u,this.#i=f,this.#a=p!=null&&p!==!1,this.#o=h,this.#s=m===!0,this.#c=g===!0,this.#u=es(n,c),this.#d={itemHeight:this.#u.itemHeight,overscan:d,stickyFolders:_,initialVisibleRowCount:y},this.#t=new Qs({...b,fileTreeSearchMode:r,initialSearchQuery:o,onSearchChange:l,renaming:p}),this.#v=this.#t.getSelectionVersion(),this.#y=this.#r==null?null:this.subscribe(()=>{this.#D()})}unmount(){this.#b!=null&&(id(this.#b),delete this.#b.dataset.fileTreeVirtualizedWrapper,this.#b=void 0),this.#l.clearAll(),this.#l.setHost(null),this.#f!=null&&(delete this.#f.dataset.fileTreeVirtualized,this.#I(this.#f),this.#f=void 0)}cleanUp(){this.unmount(),this.#y?.(),this.#y=null,this.#t.destroy()}getFileTreeContainer(){return this.#f}getItem(e){return this.#t.getItem(e)}getFocusedItem(){return this.#t.getFocusedItem()}getFocusedPath(){return this.#t.getFocusedPath()}getSelectedPaths(){return this.#t.getSelectedPaths()}getComposition(){return this.#e}getItemHeight(){return this.#u.itemHeight}getDensityFactor(){return this.#u.factor}subscribe(e){let t=!1;return this.#t.subscribe(()=>{if(!t){t=!0;return}e()})}focusPath(e){this.#t.focusPath(e)}scrollToPath(e,t){this.#t.scrollToPath(e,t)}focusNearestPath(e){return this.#t.focusNearestPath(e)}add(e){this.#t.add(e)}batch(e){this.#t.batch(e)}move(e,t,n){this.#t.move(e,t,n)}onMutation(e,t){return this.#t.onMutation(e,t)}setSearch(e){this.#t.setSearch(e)}openSearch(e){this.#t.openSearch(e)}closeSearch(){this.#t.closeSearch()}isSearchOpen(){return this.#t.isSearchOpen()}getSearchValue(){return this.#t.getSearchValue()}getSearchMatchingPaths(){return this.#t.getSearchMatchingPaths()}focusNextSearchMatch(){this.#t.focusNextSearchMatch()}focusPreviousSearchMatch(){this.#t.focusPreviousSearchMatch()}startRenaming(e,t){return this.#t.startRenaming(e,t)}remove(e,t){this.#t.remove(e,t)}resetPaths(e,t){this.#t.resetPaths(e,t)}setComposition(e){this.#e=e;let t=this.#T();t!=null&&(this.#O(),nd(t.wrapper,this.#w()))}setGitStatus(e){this.#p=rc(e,this.#p);let t=this.#T();t!=null&&nd(t.wrapper,this.#w())}setIcons(e){this.#m=e;let t=this.#T();t!=null&&(this.#E(t.host,t.wrapper),nd(t.wrapper,this.#w()))}hydrate({fileTreeContainer:e}){let t=this.#P(e),n=this.#N(t);this.#O(),rd(n,this.#w())}render({containerWrapper:e,fileTreeContainer:t}){let n=this.#P(t??this.#f,e),r=this.#N(n);this.#O(),nd(r,this.#w())}#C(){return{initialViewportHeight:Wd({initialVisibleRowCount:this.#d.initialVisibleRowCount,itemHeight:this.#d.itemHeight}),itemHeight:this.#d.itemHeight,overscan:this.#d.overscan,stickyFolders:this.#d.stickyFolders}}#w(){return{composition:this.#e,controller:this.#t,gitStatusByPath:this.#p?.statusByPath,ignoredGitDirectories:this.#p?.ignoredDirectoryPaths,directoriesWithGitChanges:this.#p?.directoriesWithChanges,icons:this.#m,instanceId:this.#n,renamingEnabled:this.#a,renderRowDecoration:this.#i,searchBlurBehavior:this.#o,searchEnabled:this.#s,searchFakeFocus:this.#c,slotHost:this.#l,...this.#C()}}#T(){let e=this.#f,t=this.#b;return e==null||t==null?null:{host:e,wrapper:t}}#E(e,t){let n=e.shadowRoot;n!=null&&(this.#k(n),this.#A(n)),this.#j(t)}#D(){let e=this.#r;if(e==null)return;let t=this.#t.getSelectionVersion();t!==this.#v&&(this.#v=t,e(this.#t.getSelectedPaths()))}#O(){let e=this.#e?.header?.render;if(e!=null){this.#l.setSlotContent(br,e());return}this.#l.setSlotHtml(br,this.#e?.header?.html??null)}#k(e){let t=qd(e).find(e=>Kd(e)),n=Gd(F(I(this.#m).set));n!=null&&(t!=null&&t.outerHTML===n.outerHTML||(t==null?e.prepend(n):t.replaceWith(n)))}#A(e){let t=qd(e),n=t.find(e=>Kd(e)),r=t.filter(e=>e!==n),i=I(this.#m).spriteSheet?.trim()??``;if(i.length===0){for(let e of r)e.remove();return}let a=Gd(i);if(a==null){for(let e of r)e.remove();return}if(!(r.length===1&&r[0].outerHTML===a.outerHTML)){for(let e of r)e.remove();e.appendChild(a)}}#j(e){let t=I(this.#m);t.colored&&ie(t.set)?e.dataset.fileTreeColoredIcons=`true`:delete e.dataset.fileTreeColoredIcons}#M(e){let t=e.querySelector(`style[${gr}]`);if(this.#g==null&&t instanceof HTMLStyleElement&&(this.#g=t),this.#h==null||this.#h===``){this.#g?.remove(),this.#g=void 0,this.#_=void 0;return}this.#g?.parentNode===e&&this.#_===this.#h||(this.#g??=document.createElement(`style`),this.#g.setAttribute(gr,``),this.#g.parentNode!==e&&e.appendChild(this.#g),this.#g.textContent=as(this.#h),this.#_=this.#h)}#N(e){if(this.#b!=null)return this.#b;let t=e.shadowRoot;if(t==null)throw Error(`FileTree requires a shadow root`);let n=Array.from(t.children).filter(e=>e instanceof HTMLDivElement&&typeof e.dataset.fileTreeId==`string`&&e.dataset.fileTreeId.length>0),r=n.find(e=>e.dataset.fileTreeId===this.#n)??n[0];return r!=null&&(this.#n=r.dataset.fileTreeId??this.#n),this.#b=r??document.createElement(`div`),this.#b.dataset.fileTreeId=this.#n,this.#b.dataset.fileTreeVirtualizedWrapper=`true`,this.#E(e,this.#b),this.#b.parentNode!==t&&t.appendChild(this.#b),this.#b}#P(e,t){let n=e??this.#f??document.createElement(`file-tree-container`);t!=null&&n.parentNode!==t&&t.appendChild(n);let r=n.shadowRoot??n.attachShadow({mode:`open`});return ds(n,r),this.#M(r),n.dataset.fileTreeVirtualized=`true`,n.style.display=`flex`,this.#F(n),this.#l.setHost(n),this.#f=n,n}#F(e){e.style.getPropertyValue(`--trees-item-height`)===``&&(e.style.setProperty(`--trees-item-height`,`${String(this.#u.itemHeight)}px`),this.#x=!0),e.style.getPropertyValue(`--trees-density-override`)===``&&(e.style.setProperty(`--trees-density-override`,String(this.#u.factor)),this.#S=!0)}#I(e){this.#x&&=(e.style.removeProperty(`--trees-item-height`),!1),this.#S&&=(e.style.removeProperty(`--trees-density-override`),!1)}},Yd=typeof window>`u`?R.useEffect:R.useLayoutEffect;function Xd(e,t,n){let r=e==null?null:(0,z.jsx)(`div`,{slot:br,children:e}),i=t!=null&&n!=null?(0,z.jsx)(`div`,{slot:xr,children:t(n.item,n.context)}):null;return r==null&&i==null?null:(0,z.jsxs)(z.Fragment,{children:[r,i]})}function Zd(e,t){return typeof window>`u`&&t!=null?(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`template`,{shadowrootmode:`open`,dangerouslySetInnerHTML:{__html:t.shadowHtml}}),e]}):(0,z.jsx)(z.Fragment,{children:e})}function Qd(e){let t=e.shadowRoot;return t?.querySelector(`[data-file-tree-id]`)instanceof HTMLElement||t?.querySelector(`[data-file-tree-id]`)instanceof SVGElement?!0:e.querySelector(`template[shadowrootmode="open"]`)instanceof HTMLTemplateElement}function $d(e,t,n,r,i){let a={...e??{}};if(t!=null&&delete a.header,n){let t=e?.contextMenu,n=t?.onClose,o=t?.onOpen;a.contextMenu={...t??{},enabled:!0,onClose:()=>{n?.(),r()},onOpen:(e,t)=>{i(e,t),o?.(e,t)}},delete a.contextMenu.render}return a.header!=null||a.contextMenu!=null?a:void 0}function ef({header:e,id:t,model:n,preloadedData:r,renderContextMenu:i,...a}){let[o,s]=(0,R.useState)(null),[c,l]=(0,R.useState)(null),u=(0,R.useRef)(n.getComposition()),d=(0,R.useRef)(n);d.current!==n&&(d.current=n,u.current=n.getComposition());let f=i!=null,p=(0,R.useCallback)(()=>{s(null)},[]),m=(0,R.useCallback)((e,t)=>{s({context:t,item:e})},[]),h=u.current,g=(0,R.useMemo)(()=>$d(h,e,f,p,m),[h,p,m,f,e]),_=(0,R.useCallback)(e=>{l(e)},[]);(0,R.useEffect)(()=>{f||s(null)},[f]),Yd(()=>{n.setComposition(g)},[g,n]),Yd(()=>{if(c!=null)return r!=null&&Qd(c)?n.hydrate({fileTreeContainer:c}):n.render({fileTreeContainer:c}),()=>{n.unmount(),n.setComposition(h)}},[h,c,n,r]);let v=Zd(Xd(e,i,o),r),y=t??r?.id,b={"--trees-item-height":`${String(n.getItemHeight())}px`,"--trees-density-override":n.getDensityFactor(),...a.style};return(0,z.jsx)(mr,{...a,id:y,ref:_,style:b,suppressHydrationWarning:r!=null,children:v})}function tf(e){let[t]=(0,R.useState)(()=>new Jd(e)),n=(0,R.useRef)({timeout:null,model:t});return(0,R.useEffect)(()=>{let{current:e}=n;return e.timeout!=null&&(clearTimeout(e.timeout),e.timeout=null),()=>{e.timeout=setTimeout(()=>e.model.cleanUp(),1)}},[]),{model:t}}var nf=e=>{if(typeof e!=`object`||!e)return null;let t=e;return typeof t.getAttribute==`function`?t.getAttribute(`data-item-path`):null};function rf(e){let t=[],n=[];return{isDragInProgress:()=>n.length>0,handleSelectionChange(e){t=e},handleDragStart(e){if(e.dataTransfer===null)return;let r=null;for(let t of e.composedPath())if(r=nf(t),r!==null)break;if(r===null)return;let i=t.includes(r)?t:[r],a=i.map(e=>ye(e)).filter(e=>e!==null);a.length!==0&&(n=i,e.dataTransfer.setData(Se,a.join(` `)))},handleDragEnd(){if(n.length!==0){for(let t of n)e.deselect(t);n=[]}}}}var af=``,of=p(m(!1)).pipe(u(`project-file-query:empty`));function sf(e,t,n){return Ae.optimisticFile({environmentId:e,cwd:t,relativePath:n})}function cf(e,t){return Ae.listEntries({environmentId:e,input:{cwd:t}})}function lf(e,t,n){return Ae.readFile({environmentId:e,input:{cwd:t,relativePath:n??af}})}function uf(e,t,n,r){l.set(sf(e,t,n),{confirmedAgainst:void 0,data:{relativePath:n,contents:r,byteLength:new TextEncoder().encode(r).byteLength,truncated:!1}})}function df(e,t,n){return l.get(sf(e,t,n))?.data??null}function ff(e,t,n,r){let i=sf(e,t,n),a=l.get(i);if(a?.data.contents!==r)return!1;let o=lf(e,t,n),s={...a,confirmedAgainst:l.get(o)};return l.set(i,s),l.refresh(o),y(l,o,{reportDefect:!1,reportFailure:!1}).then(e=>{e._tag===`Success`&&l.get(i)===s&&l.set(i,null)}),!0}function pf(e){if(e._tag!==`Failure`)return null;let t=k(e.cause);return t instanceof Error?t.message:`Workspace query failed.`}function mf(e,t){let n=(0,nt.c)(14),r;n[0]!==t||n[1]!==e?(r=cf(e,t),n[0]=t,n[1]=e,n[2]=r):r=n[2];let i=r,a=w(i),o=d(i),s;n[3]===o?s=n[4]:(s=()=>o(),n[3]=o,n[4]=s);let c=s,l;n[5]===a?l=n[6]:(l=P(f(a)),n[5]=a,n[6]=l);let u;n[7]===a?u=n[8]:(u=pf(a),n[7]=a,n[8]=u);let p;return n[9]!==c||n[10]!==a.waiting||n[11]!==l||n[12]!==u?(p={data:l,error:u,isPending:a.waiting,refresh:c},n[9]=c,n[10]=a.waiting,n[11]=l,n[12]=u,n[13]=p):p=n[13],p}function hf(e,t,n,r){let i=(0,nt.c)(20),a=r===void 0?!0:r,o;i[0]!==t||i[1]!==a||i[2]!==e||i[3]!==n?(o=a?lf(e,t,n):of,i[0]=t,i[1]=a,i[2]=e,i[3]=n,i[4]=o):o=i[4];let s=o,c=w(s),l=d(s),u;i[5]===l?u=i[6]:(u=()=>l(),i[5]=l,i[6]=u);let p=u,m;i[7]===c?m=i[8]:(m=P(f(c)),i[7]=c,i[8]=m);let h=m,g=n??af,_;i[9]!==t||i[10]!==e||i[11]!==g?(_=sf(e,t,g),i[9]=t,i[10]=e,i[11]=g,i[12]=_):_=i[12];let v=w(_),y=(n===null?null:v)?.data??h,b;i[13]===c?b=i[14]:(b=pf(c),i[13]=c,i[14]=b);let x;return i[15]!==p||i[16]!==c.waiting||i[17]!==y||i[18]!==b?(x={data:y,error:b,isPending:c.waiting,refresh:p},i[15]=p,i[16]=c.waiting,i[17]=y,i[18]=b,i[19]=x):x=i[19],x}var gf=`
  :host {
    --trees-bg-override: transparent;
    --trees-selected-bg-override: color-mix(in srgb, currentColor 12%, transparent);
    --trees-hover-bg-override: color-mix(in srgb, currentColor 7%, transparent);
    --trees-border-color-override: color-mix(in srgb, currentColor 14%, transparent);
    --trees-font-family-override: var(--font-sans);
    --trees-font-size-override: 12px;
  }
  button[data-type='item'] { border-radius: 5px; }
`;function _f(e){return e.kind===`directory`?`${e.path}/`:e.path}function vf({environmentId:e,cwd:t,projectName:r,onOpenFile:a}){let{resolvedTheme:o}=n(),s=be(),c=mf(e,t),l=c.data?.entries??[],u=(0,R.useMemo)(()=>new Map(l.map(e=>[e.path,e.kind])),[l]),d=(0,R.useRef)(u),f=(0,R.useMemo)(()=>l.map(_f),[l]),p=(0,R.useRef)([]),m=(0,R.useRef)(null);(0,R.useEffect)(()=>{let e=e=>{m.current={x:e.clientX,y:e.clientY,at:e.timeStamp}};return document.addEventListener(`contextmenu`,e,!0),()=>document.removeEventListener(`contextmenu`,e,!0)},[]);let h=async(e,t)=>{let n=T();if(!n){t.close();return}let r=e.path.replace(/\/$/,``),i=xe(r),a=m.current,o=a!==null&&performance.now()-a.at<1e3,c=t.anchorElement.getBoundingClientRect(),l=o?{x:a.x,y:a.y}:{x:c.left,y:c.bottom};try{let e=await n.contextMenu.show([{id:`copy-mention`,label:`Copy mention`},{id:`add-to-chat`,label:`Add to chat`}],l);if(e===`copy-mention`){try{await re(i),te.add({type:`success`,title:`Mention copied`,description:r})}catch(e){te.add({type:`error`,title:`Failed to copy mention`,description:e instanceof Error?e.message:`An error occurred.`})}return}if(e===`add-to-chat`){let e=s?.current;if(!e){te.add({type:`error`,title:`Unable to add to chat`,description:`Open a chat for this project and try again.`});return}e.insertTextAtEnd(`${i} `,{ensureLeadingBoundary:!0})||te.add({type:`error`,title:`Unable to add to chat`,description:`The chat isn't ready to accept input right now.`})}}finally{t.close()}},g=(0,R.useRef)(h);(0,R.useEffect)(()=>{g.current=h});let _=(0,R.useRef)(null),v=(0,R.useMemo)(()=>rf({deselect:e=>_.current?.getItem(e)?.deselect()}),[]),{model:y}=tf({composition:{contextMenu:{triggerMode:`right-click`,onOpen:(e,t)=>{g.current(e,t)}}},dragAndDrop:{canDrop:()=>!1},density:`compact`,fileTreeSearchMode:`hide-non-matches`,flattenEmptyDirectories:!0,initialExpansion:1,icons:se,onSelectionChange:e=>{if(v.handleSelectionChange(e),v.isDragInProgress())return;let t=e.at(-1)?.replace(/\/$/,``);t&&d.current.get(t)===`file`&&a(t)},paths:[],search:!0,unsafeCSS:gf});(0,R.useEffect)(()=>{p.current!==f&&(d.current=u,p.current=f,y.resetPaths(f))},[u,y,f]);let b=(0,R.useMemo)(()=>l.reduce((e,t)=>e+ +(t.kind===`file`),0),[l]),x=(0,R.useRef)(null);return(0,R.useEffect)(()=>{_.current=y},[y]),(0,R.useEffect)(()=>{let e=x.current;if(e===null)return;let t=e=>v.handleDragStart(e),n=()=>v.handleDragEnd();return e.addEventListener(`dragstart`,t,!0),e.addEventListener(`dragend`,n),()=>{e.removeEventListener(`dragstart`,t,!0),e.removeEventListener(`dragend`,n)}},[v]),(0,z.jsxs)(`div`,{ref:x,className:`flex min-h-0 flex-1 flex-col bg-background`,"data-file-browser-panel":`${e}:${t}`,children:[(0,z.jsxs)(`div`,{className:`flex h-9 shrink-0 items-center gap-2 border-b border-border/60 px-3`,children:[(0,z.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,z.jsx)(`div`,{className:`truncate text-xs font-medium text-foreground`,children:r}),(0,z.jsxs)(`div`,{className:`truncate text-[10px] leading-none text-muted-foreground`,children:[c.isPending&&c.data===null?`Indexing…`:`${b.toLocaleString()} files`,c.data?.truncated?` · partial`:``]})]}),(0,z.jsx)(`button`,{type:`button`,className:`rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground`,"aria-label":`Search workspace files`,onClick:()=>y.openSearch(),children:(0,z.jsx)(Be,{className:`size-3.5`})}),(0,z.jsx)(`button`,{type:`button`,className:`rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground`,"aria-label":`Refresh workspace files`,onClick:c.refresh,children:(0,z.jsx)(fe,{className:i(`size-3.5`,c.isPending&&`animate-spin`)})})]}),c.error&&c.data===null?(0,z.jsx)(`div`,{className:`p-4 text-xs leading-relaxed text-destructive`,children:c.error}):(0,z.jsx)(ef,{model:y,"aria-label":`${r} files`,className:`min-h-0 flex-1 overflow-hidden`,style:{colorScheme:o,"--trees-fg-override":`var(--foreground)`}})]})}function yf({root:e,editor:t,onDismiss:n}){n(),t.setSelections([]);let r=e.querySelector(`diffs-container`)?.shadowRoot?.activeElement;r instanceof HTMLElement&&r.blur()}function bf(e){return e.querySelector(`diffs-container`)?.shadowRoot?.activeElement?.hasAttribute(`data-content`)===!0}function xf({root:e,editor:t,isBlocked:n,onDismiss:r}){let i=i=>{n()||i.composedPath().includes(e)||yf({root:e,editor:t,onDismiss:r})},a=i=>{i.key!==`Escape`||n()||!bf(e)||(i.preventDefault(),i.stopImmediatePropagation(),yf({root:e,editor:t,onDismiss:r}))};return document.addEventListener(`pointerdown`,i,!0),document.addEventListener(`keydown`,a,!0),()=>{document.removeEventListener(`pointerdown`,i,!0),document.removeEventListener(`keydown`,a,!0)}}function Sf(e){let t=2166136261;for(let n=0;n<e.length;n+=1)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return`${e.length}:${(t>>>0).toString(36)}`}function Cf(e,t,n){return`${e}:${t}:${Sf(n)}`}function wf(e,t){let n=t.split(`/`).filter(Boolean);return[{label:e,path:``,kind:`project`},...n.map((e,t)=>({label:e,path:n.slice(0,t+1).join(`/`),kind:t===n.length-1?`file`:`directory`}))]}var Tf=e=>/\.(?:md|mdx)$/i.test(e);function Ef(e,t,n){return t<0||e[t]!==`[`||!/[ xX]/.test(e[t+1]??``)||e[t+2]!==`]`?e:`${e.slice(0,t+1)}${n?`x`:` `}${e.slice(t+2)}`}var Df=class{options;timer=null;latestContents=``;latestRevision=0;lastChangeAt=0;saving=!1;disposed=!1;constructor(e){this.options=e}change(e){this.latestContents=e,this.latestRevision+=1,this.lastChangeAt=Date.now(),this.options.onPendingChange(!0),this.schedule(this.options.debounceMs)}dispose(){this.disposed=!0,this.clearTimer(),this.latestRevision>0&&this.persistLatest()}schedule(e){this.clearTimer(),this.timer=setTimeout(()=>{this.timer=null,this.persistLatest()},e)}clearTimer(){this.timer!==null&&(clearTimeout(this.timer),this.timer=null)}async persistLatest(){if(this.saving||this.latestRevision===0)return;this.saving=!0;let e=this.latestContents,t=this.latestRevision,n=(await this.options.persist(e))._tag===`Success`;if(n&&this.options.onConfirmed(e),this.saving=!1,t===this.latestRevision){n&&this.options.onPendingChange(!1);return}let r=Math.max(0,this.options.debounceMs-(Date.now()-this.lastChangeAt));this.disposed?this.persistLatest():this.schedule(r)}},Of=`t3code.fileExplorerOpen`,kf=500,Af=`data-file-link-reveal`,jf=`
  [${Af}][data-line] {
    background-color: light-dark(
      color-mix(
        in lab,
        var(--diffs-computed-diff-line-bg) 82%,
        var(--diffs-bg-selection-override, var(--diffs-selection-base))
      ),
      color-mix(
        in lab,
        var(--diffs-computed-diff-line-bg) 75%,
        var(--diffs-bg-selection-override, var(--diffs-selection-base))
      )
    ) !important;
  }

  [${Af}][data-column-number] {
    background-color: light-dark(
      color-mix(
        in lab,
        var(--diffs-computed-diff-line-bg) 75%,
        var(--diffs-bg-selection-number-override, var(--diffs-selection-base))
      ),
      color-mix(
        in lab,
        var(--diffs-computed-diff-line-bg) 60%,
        var(--diffs-bg-selection-number-override, var(--diffs-selection-base))
      )
    ) !important;
    color: var(--diffs-selection-number-fg) !important;
  }
`;function Mf(e){let t=(0,nt.c)(8),n;t[0]!==e.absolutePath||t[1]!==e.threadRef.threadId?(n={_tag:`workspace-file`,threadId:e.threadRef.threadId,path:e.absolutePath},t[0]=e.absolutePath,t[1]=e.threadRef.threadId,t[2]=n):n=t[2];let r=me(e.environmentId,n),[i,a]=(0,R.useState)(null);if(r._tag===`Failure`||r._tag===`Success`&&i===r.url){let e;return t[3]===Symbol.for(`react.memo_cache_sentinel`)?(e=(0,z.jsx)(`div`,{className:`flex min-h-0 flex-1 items-center justify-center px-6 text-center text-xs leading-relaxed text-destructive`,children:`Unable to load workspace image.`}),t[3]=e):e=t[3],e}let o;return t[4]!==r._tag||t[5]!==r.url||t[6]!==e.alt?(o=r._tag===`Success`?(0,z.jsx)(`div`,{className:`flex min-h-0 flex-1 items-center justify-center overflow-auto p-4`,children:(0,z.jsx)(`img`,{className:`max-h-full max-w-full object-contain`,src:r.url,alt:e.alt,onError:()=>a(r.url)})}):(0,z.jsx)(`div`,{className:`flex min-h-0 flex-1 items-center justify-center text-muted-foreground`,children:(0,z.jsx)(ne,{className:`size-5 animate-spin`})}),t[4]=r._tag,t[5]=r.url,t[6]=e.alt,t[7]=o):o=t[7],o}function Nf(e,t){let n=1;for(let t=0;t<e.length;t+=1){let r=e.charCodeAt(t);r===10?n+=1:r===13&&(n+=1,e.charCodeAt(t+1)===10&&(t+=1))}return Math.min(Math.max(1,t),n)}function Pf(e,t){let n=e.shadowRoot??e;for(let e of n.querySelectorAll(`[${Af}]`))e.removeAttribute(Af);t!==null&&(n.querySelector(`[data-line="${t}"]`)?.setAttribute(Af,``),n.querySelector(`[data-column-number="${t}"]`)?.setAttribute(Af,``))}function Ff(e,t,n){let r=(0,nt.c)(7),[i]=(0,R.useState)(Rf),[a]=(0,R.useState)(Lf),[o]=(0,R.useState)(If),s;return r[0]!==i||r[1]!==a||r[2]!==o||r[3]!==e||r[4]!==t||r[5]!==n?(s=(r,s,c)=>{if(e===null)return;let l=()=>{let t=o.get(e);t!==void 0&&(cancelAnimationFrame(t),o.delete(e))};if(c===`unmount`){l();return}let u=t===null?null:Nf(s.file?.contents??``,t);if(Pf(r,u),!(s instanceof qe))return;if(a.get(e)!==n&&(l(),a.set(e,n)),u===null){r.style.minHeight=``;return}let d=r.closest(`.file-preview-virtualizer`);!d||(r.style.minHeight=`${Math.ceil(Math.max(s.height,d.clientHeight))}px`,i.get(e)===n||o.has(e))||o.set(e,requestAnimationFrame(()=>{if(o.delete(e),a.get(e)!==n||!r.isConnected)return;let t=s.getLinePosition(u);if(!t)return;let c=d.scrollTop+r.getBoundingClientRect().top-d.getBoundingClientRect().top,l=Math.max(0,c+t.top-Math.max(0,(d.clientHeight-t.height)/2)),f=Math.max(0,d.scrollHeight-d.clientHeight);d.scrollTop=Math.min(l,f),i.set(e,n)}))},r[0]=i,r[1]=a,r[2]=o,r[3]=e,r[4]=t,r[5]=n,r[6]=s):s=r[6],s}function If(){return new Map}function Lf(){return new Map}function Rf(){return new Map}function zf(e){let t=(0,nt.c)(19),{environmentId:n,cwd:r,relativePath:i,onPendingChange:a}=e,o=b(Ae.writeFile),s;t[0]!==a||t[1]!==i?(s=e=>a(i,e),t[0]=a,t[1]=i,t[2]=s):s=t[2];let c;t[3]!==r||t[4]!==n||t[5]!==i||t[6]!==o?(c=e=>o({environmentId:n,input:{cwd:r,relativePath:i,contents:e}}),t[3]=r,t[4]=n,t[5]=i,t[6]=o,t[7]=c):c=t[7];let l;t[8]!==r||t[9]!==n||t[10]!==i?(l=e=>{ff(n,r,i,e)},t[8]=r,t[9]=n,t[10]=i,t[11]=l):l=t[11];let u;t[12]!==s||t[13]!==c||t[14]!==l?(u=new Df({debounceMs:kf,onPendingChange:s,persist:c,onConfirmed:l}),t[12]=s,t[13]=c,t[14]=l,t[15]=u):u=t[15];let d=u,f,p;return t[16]===d?(f=t[17],p=t[18]):(f=()=>()=>d.dispose(),p=[d],t[16]=d,t[17]=f,t[18]=p),(0,R.useEffect)(f,p),d}function Bf(e){let t=(0,nt.c)(74),{environmentId:n,cwd:r,relativePath:i,composerDraftTarget:a,contents:o,resolvedTheme:s,revealRequestId:l,wordWrap:u,onPostRender:d,onPendingChange:f}=e,p=c(qf),m=c(Kf),h;t[0]===Symbol.for(`react.memo_cache_sentinel`)?(h=[],t[0]=h):h=t[0];let[g,_]=(0,R.useState)(h),[v,y]=(0,R.useState)(null),b=v?.revealRequestId===l?v.range:null,x;t[1]===l?x=t[2]:(x=e=>{y({revealRequestId:l,range:e})},t[1]=l,t[2]=x);let S=x,w=(0,R.useRef)(null),T=(0,R.useRef)(null),E;t[3]!==r||t[4]!==n||t[5]!==f||t[6]!==i?(E={environmentId:n,cwd:r,relativePath:i,onPendingChange:f},t[3]=r,t[4]=n,t[5]=f,t[6]=i,t[7]=E):E=t[7];let D=zf(E),O;t[8]!==p||t[9]!==a||t[10]!==r||t[11]!==n||t[12]!==i||t[13]!==D?(O=new pr({onChange:(e,t)=>{if(uf(n,r,i,e.contents),D.change(e.contents),t){let n=Ge(t);_(n);for(let t of n)for(let n of t.metadata.entries)n.kind===`comment`&&p(a,C({id:n.id,filePath:i,startLine:n.startLine,endLine:n.endLine,text:n.text,contents:e.contents}))}}}),t[8]=p,t[9]=a,t[10]=r,t[11]=n,t[12]=i,t[13]=D,t[14]=O):O=t[14];let k=O,A,j;t[15]===k?(A=t[16],j=t[17]):(A=()=>()=>{k.cleanUp()},j=[k],t[15]=k,t[16]=A,t[17]=j),(0,R.useEffect)(A,j);let M;t[18]!==a||t[19]!==m||t[20]!==S?(M=e=>{S(null),m(a,e),_(t=>t.flatMap(t=>{let n=t.metadata.entries.filter(t=>t.id!==e);return n.length>0?[{...t,metadata:{entries:n}}]:[]}))},t[18]=a,t[19]=m,t[20]=S,t[21]=M):M=t[21];let N=M,P;t[22]!==p||t[23]!==a||t[24]!==o||t[25]!==g||t[26]!==i||t[27]!==S?(P=(e,t)=>{S(null);let n=g.flatMap(Gf).find(t=>t.id===e);n&&p(a,C({id:n.id,filePath:i,startLine:n.startLine,endLine:n.endLine,text:t,contents:o})),_(n=>n.map(n=>({...n,metadata:{entries:n.metadata.entries.map(n=>n.id===e?{...n,kind:`comment`,text:t}:n)}})))},t[22]=p,t[23]=a,t[24]=o,t[25]=g,t[26]=i,t[27]=S,t[28]=P):P=t[28];let ee=P,te;t[29]===Symbol.for(`react.memo_cache_sentinel`)?(te=e=>{let{startLine:t,endLine:n}=Je(e),r={id:Ke(),kind:`draft`,startLine:t,endLine:n,text:``};_(e=>{let t=e.flatMap(Uf),i=t.findIndex(e=>e.lineNumber===n);return i<0?[...t,{lineNumber:n,metadata:{entries:[r]}}]:t.map((e,t)=>t===i?{...e,metadata:{entries:[...e.metadata.entries,r]}}:e)})},t[29]=te):te=t[29];let ne=te,re;t[30]===g?re=t[31]:(re=g.some(Vf),t[30]=g,t[31]=re);let ie=re,ae,oe;t[32]!==k||t[33]!==ie||t[34]!==S?(ae=()=>{let e=w.current;if(e)return xf({root:e,editor:k,isBlocked:()=>ie,onDismiss:()=>S(null)})},oe=[k,ie,S],t[32]=k,t[33]=ie,t[34]=S,t[35]=ae,t[36]=oe):(ae=t[35],oe=t[36]),(0,R.useEffect)(ae,oe);let se;t[37]===S?se=t[38]:(se=e=>{S(e),e&&ne(e)},t[37]=S,t[38]=se);let F=se,ce;t[39]!==d||t[40]!==b?(ce=(e,t,n)=>{d(e,t,n),T.current!==null&&(cancelAnimationFrame(T.current),T.current=null),n!==`unmount`&&(T.current=requestAnimationFrame(()=>{T.current=null,e.isConnected&&t.setSelectedLines(b,{notify:!1})}))},t[39]=d,t[40]=b,t[41]=ce):ce=t[41];let le=ce,ue;t[42]===Symbol.for(`react.memo_cache_sentinel`)?(ue={overscrollSize:600,intersectionObserverMargin:1200},t[42]=ue):ue=t[42];let I;t[43]!==o||t[44]!==r||t[45]!==i?(I=Cf(r,i,o),t[43]=o,t[44]=r,t[45]=i,t[46]=I):I=t[46];let de;t[47]!==o||t[48]!==i||t[49]!==I?(de={name:i,contents:o,cacheKey:I},t[47]=o,t[48]=i,t[49]=I,t[50]=de):de=t[50];let fe=!ie,pe=!ie,me=u?`wrap`:`scroll`,he;t[51]===s?he=t[52]:(he=ze(s),t[51]=s,t[52]=he);let _e;t[53]!==F||t[54]!==le||t[55]!==s||t[56]!==S||t[57]!==fe||t[58]!==pe||t[59]!==me||t[60]!==he?(_e={disableFileHeader:!0,enableGutterUtility:fe,enableLineSelection:pe,onGutterUtilityClick:S,onLineSelectionChange:S,onLineSelectionEnd:F,overflow:me,theme:he,themeType:s,unsafeCSS:jf,onPostRender:le},t[53]=F,t[54]=le,t[55]=s,t[56]=S,t[57]=fe,t[58]=pe,t[59]=me,t[60]=he,t[61]=_e):_e=t[61];let ve;t[62]!==N||t[63]!==ee?(ve=e=>(0,z.jsx)(`div`,{className:`py-1`,children:e.metadata.entries.map(e=>(0,z.jsx)(Ue,{kind:e.kind,rangeLabel:Xe(e.startLine,e.endLine),text:e.text,onCancel:()=>N(e.id),onComment:t=>ee(e.id,t),onDelete:()=>N(e.id)},e.id))}),t[62]=N,t[63]=ee,t[64]=ve):ve=t[64];let ye;t[65]!==g||t[66]!==b||t[67]!==de||t[68]!==_e||t[69]!==ve?(ye=(0,z.jsx)(`div`,{ref:w,className:`flex min-h-0 flex-1`,children:(0,z.jsx)(ge,{className:`file-preview-virtualizer min-h-0 flex-1 overflow-auto`,config:ue,children:(0,z.jsx)(tt,{file:de,options:_e,selectedLines:b,lineAnnotations:g,renderAnnotation:ve,className:`min-h-full`,contentEditable:!0})})}),t[65]=g,t[66]=b,t[67]=de,t[68]=_e,t[69]=ve,t[70]=ye):ye=t[70];let be;return t[71]!==k||t[72]!==ye?(be=(0,z.jsx)(we,{editor:k,children:ye}),t[71]=k,t[72]=ye,t[73]=be):be=t[73],be}function Vf(e){return e.metadata.entries.some(Hf)}function Hf(e){return e.kind===`draft`}function Uf(e){let t=e.metadata.entries.filter(Wf);return t.length>0?[{...e,metadata:{entries:t}}]:[]}function Wf(e){return e.kind!==`draft`}function Gf(e){return e.metadata.entries}function Kf(e){return e.removeReviewComment}function qf(e){return e.addReviewComment}function Jf(e){let t=(0,nt.c)(16),{environmentId:n,cwd:r,relativePath:i,contents:a,threadRef:o,onPendingChange:s}=e,c;t[0]!==r||t[1]!==n||t[2]!==s||t[3]!==i?(c={environmentId:n,cwd:r,relativePath:i,onPendingChange:s},t[0]=r,t[1]=n,t[2]=s,t[3]=i,t[4]=c):c=t[4];let l=zf(c),u;t[5]!==a||t[6]!==r||t[7]!==n||t[8]!==i||t[9]!==l?(u=e=>{let{markerOffset:t,checked:o}=e,s=df(n,r,i)?.contents??a,c=Ef(s,t,o);c!==s&&(uf(n,r,i,c),l.change(c))},t[5]=a,t[6]=r,t[7]=n,t[8]=i,t[9]=l,t[10]=u):u=t[10];let d;return t[11]!==a||t[12]!==r||t[13]!==u||t[14]!==o?(d=(0,z.jsx)(Re,{className:`min-h-0 flex-1`,children:(0,z.jsx)(le,{text:a,cwd:r,threadRef:o,className:`mx-auto max-w-4xl px-6 py-5`,onTaskListChange:u})}),t[11]=a,t[12]=r,t[13]=u,t[14]=o,t[15]=d):d=t[15],d}function Yf(){try{return x(Of,M)??!0}catch(e){return console.error(e),!0}}function Xf(a){let o=(0,nt.c)(78),{environmentId:c,cwd:l,projectName:u,relativePath:d,threadRef:f,composerDraftTarget:p,keybindings:m,availableEditors:_,revealLine:y,revealRequestId:x,onOpenFile:C,onPendingChange:w}=a,{resolvedTheme:T}=n(),k=De(Qf),A=g(),j=S(c),M;o[0]===Symbol.for(`react.memo_cache_sentinel`)?(M={reportFailure:!1},o[0]=M):M=o[0];let N=r(ve.createUrl,M),P;o[1]===Symbol.for(`react.memo_cache_sentinel`)?(P={reportFailure:!1},o[1]=P):P=o[1];let re=b(e.open,P),ie;o[2]===d?ie=o[3]:(ie=d!==null&&B(d),o[2]=d,o[3]=ie);let se=ie,F=hf(c,l,d,!se),[le,ue]=(0,R.useState)(Yf),I;o[4]===Symbol.for(`react.memo_cache_sentinel`)?(I={path:null,revealRequestId:null},o[4]=I):I=o[4];let[de,fe]=(0,R.useState)(I),me=(0,R.useRef)(null),he;o[5]===d?he=o[6]:(he=d?Tf(d):!1,o[5]=d,o[6]=he);let ye=he,be=ye&&de.path===d&&(y===null||de.revealRequestId===x),xe;o[7]===d?xe=o[8]:(xe=d!==null&&t()&&_e(d),o[7]=d,o[8]=xe);let Se=xe,we;o[9]!==l||o[10]!==d?(we=d?Le(d,l):null,o[9]=l,o[10]=d,o[11]=we):we=o[11];let L=we,Te;o[12]!==u||o[13]!==d?(Te=d?wf(u,d):[],o[12]=u,o[13]=d,o[14]=Te):Te=o[14];let Ee=Te,Oe=Ff(d,y,x),ke;o[15]===Symbol.for(`react.memo_cache_sentinel`)?(ke=()=>{(me.current?.querySelector(`[data-current-file-crumb='true']`))?.scrollIntoView({block:`nearest`,inline:`end`})},o[15]=ke):ke=o[15];let Ae;o[16]===d?Ae=o[17]:(Ae=[d],o[16]=d,o[17]=Ae),(0,R.useEffect)(ke,Ae);let je;o[18]===Symbol.for(`react.memo_cache_sentinel`)?(je=()=>{ue(Zf)},o[18]=je):je=o[18];let Me=je,Ne;o[19]!==L||o[20]!==N||o[21]!==j||o[22]!==re||o[23]!==f?(Ne=()=>{!L||!j||(async()=>{let e=await Ce({threadRef:f,filePath:L,httpBaseUrl:j,createAssetUrl:N,openPreview:re});if(e._tag===`Success`||h(e))return;let t=s(e);te.add(ee({type:`error`,title:`Unable to open file in browser`,description:t instanceof Error?t.message:`An error occurred.`}))})()},o[19]=L,o[20]=N,o[21]=j,o[22]=re,o[23]=f,o[24]=Ne):Ne=o[24];let Pe=Ne,Fe;o[25]!==L||o[26]!==_||o[27]!==Ee||o[28]!==Se||o[29]!==c||o[30]!==le||o[31]!==Pe||o[32]!==ye||o[33]!==m||o[34]!==A||o[35]!==u||o[36]!==d||o[37]!==be||o[38]!==x?(Fe=d?(0,z.jsxs)(`div`,{className:`surface-subheader gap-2 px-3`,"data-surface-subheader":!0,children:[(0,z.jsx)(Re,{ref:me,hideScrollbars:!0,scrollFade:!0,className:`min-w-0 flex-1 rounded-none`,"data-file-breadcrumbs":!0,children:(0,z.jsx)(`div`,{className:`flex h-full w-max min-w-full items-center text-xs`,children:Ee.map((e,t)=>(0,z.jsxs)(`div`,{className:`flex min-w-0 shrink-0 items-center`,"data-current-file-crumb":e.kind===`file`,children:[t>0?(0,z.jsx)(v,{className:`mx-1 size-3.5 shrink-0 text-muted-foreground/60`}):null,(0,z.jsx)(`span`,{className:i(`max-w-40 truncate`,e.kind===`file`?`font-medium text-foreground`:`text-muted-foreground`),title:e.path||u,children:e.label})]},e.path||`project`))})}),L&&c===A?(0,z.jsx)(pe,{environmentId:c,keybindings:m,availableEditors:_,openInCwd:L,compact:!0,enableShortcut:!1}):null,ye?(0,z.jsxs)(O,{children:[(0,z.jsx)(E,{render:(0,z.jsx)(Ie,{className:`shrink-0`,pressed:be,onPressedChange:e=>{fe({path:e?d:null,revealRequestId:e?x:null})},"aria-label":be?`Show markdown source`:`Show rendered markdown`,variant:`ghost`,size:`sm`,children:be?(0,z.jsx)(ae,{className:`size-3.5`}):(0,z.jsx)(ce,{className:`size-3.5`})})}),(0,z.jsx)(D,{children:be?`Show markdown source`:`Show rendered markdown`})]}):null,Se?(0,z.jsxs)(O,{children:[(0,z.jsx)(E,{render:(0,z.jsx)(Ie,{className:`shrink-0`,pressed:!1,onPressedChange:Pe,"aria-label":`Open file in preview browser`,variant:`ghost`,size:`sm`,children:(0,z.jsx)(oe,{className:`size-3.5`})})}),(0,z.jsx)(D,{children:`Open file in preview browser`})]}):null,(0,z.jsxs)(O,{children:[(0,z.jsx)(E,{render:(0,z.jsx)(Ie,{className:`shrink-0`,pressed:le,onPressedChange:Me,"aria-label":le?`Hide file explorer`:`Show file explorer`,variant:`ghost`,size:`sm`,children:(0,z.jsx)(Ze,{className:`size-3.5`})})}),(0,z.jsx)(D,{children:le?`Hide file explorer`:`Show file explorer`})]})]}):null,o[25]=L,o[26]=_,o[27]=Ee,o[28]=Se,o[29]=c,o[30]=le,o[31]=Pe,o[32]=ye,o[33]=m,o[34]=A,o[35]=u,o[36]=d,o[37]=be,o[38]=x,o[39]=Fe):Fe=o[39];let Be;o[40]!==F||o[41]!==d?(Be=d&&F.data?.truncated?(0,z.jsxs)(`div`,{className:`shrink-0 border-b border-amber-500/20 bg-amber-500/8 px-3 py-1.5 text-[11px] text-amber-700 dark:text-amber-300`,children:[`Preview limited to the first 1 MB of a `,F.data.byteLength.toLocaleString(),` byte file.`]}):null,o[40]=F,o[41]=d,o[42]=Be):Be=o[42];let Ve=d?`flex`:`hidden`,He;o[43]===Ve?He=o[44]:(He=i(`min-w-0 flex-1 flex-col overflow-hidden`,Ve),o[43]=Ve,o[44]=He);let Ue;o[45]!==L||o[46]!==p||o[47]!==l||o[48]!==c||o[49]!==F||o[50]!==se||o[51]!==ye||o[52]!==Oe||o[53]!==w||o[54]!==d||o[55]!==be||o[56]!==T||o[57]!==x||o[58]!==f||o[59]!==k?(Ue=d&&se&&L?(0,z.jsx)(Mf,{environmentId:c,threadRef:f,absolutePath:L,alt:d},L):d&&F.error&&F.data===null?(0,z.jsx)(`div`,{className:`flex min-h-0 flex-1 items-center justify-center px-6 text-center text-xs leading-relaxed text-destructive`,children:F.error}):d&&F.data===null?(0,z.jsx)(`div`,{className:`flex min-h-0 flex-1 items-center justify-center text-muted-foreground`,children:(0,z.jsx)(ne,{className:`size-5 animate-spin`})}):d&&F.data?ye&&be?(0,z.jsx)(Jf,{environmentId:c,cwd:l,relativePath:d,threadRef:f,contents:F.data.contents,onPendingChange:w}):F.data.truncated?(0,z.jsx)(ge,{className:`file-preview-virtualizer min-h-0 flex-1 overflow-auto`,config:{overscrollSize:600,intersectionObserverMargin:1200},children:(0,z.jsx)(tt,{file:{name:d,contents:F.data.contents,cacheKey:Cf(l,d,F.data.contents)},options:{disableFileHeader:!0,overflow:k?`wrap`:`scroll`,theme:ze(T),themeType:T,unsafeCSS:jf,onPostRender:Oe},className:`min-h-full`})},`${d}:${T}:${F.data.byteLength}`):(0,z.jsx)(Bf,{environmentId:c,cwd:l,relativePath:d,composerDraftTarget:p,contents:F.data.contents,resolvedTheme:T,revealRequestId:x,wordWrap:k,onPostRender:Oe,onPendingChange:w},`${d}:${T}`):null,o[45]=L,o[46]=p,o[47]=l,o[48]=c,o[49]=F,o[50]=se,o[51]=ye,o[52]=Oe,o[53]=w,o[54]=d,o[55]=be,o[56]=T,o[57]=x,o[58]=f,o[59]=k,o[60]=Ue):Ue=o[60];let We;o[61]!==He||o[62]!==Ue?(We=(0,z.jsx)(`div`,{className:He,children:Ue}),o[61]=He,o[62]=Ue,o[63]=We):We=o[63];let Ge;o[64]!==l||o[65]!==c||o[66]!==le||o[67]!==C||o[68]!==u||o[69]!==d?(Ge=le||d===null?(0,z.jsx)(`aside`,{className:i(`flex min-h-0 shrink-0 bg-background`,d?`w-[min(22rem,46%)] min-w-64 border-l border-border/60`:`min-w-0 flex-1`),children:(0,z.jsx)(vf,{environmentId:c,cwd:l,projectName:u,onOpenFile:C},`${c}:${l}`)}):null,o[64]=l,o[65]=c,o[66]=le,o[67]=C,o[68]=u,o[69]=d,o[70]=Ge):Ge=o[70];let Ke;o[71]!==We||o[72]!==Ge?(Ke=(0,z.jsxs)(`div`,{className:`flex min-h-0 flex-1 overflow-hidden`,children:[We,Ge]}),o[71]=We,o[72]=Ge,o[73]=Ke):Ke=o[73];let qe;return o[74]!==Fe||o[75]!==Be||o[76]!==Ke?(qe=(0,z.jsxs)(`div`,{className:`flex min-h-0 flex-1 flex-col overflow-hidden bg-background`,children:[Fe,Be,Ke]}),o[74]=Fe,o[75]=Be,o[76]=Ke,o[77]=qe):qe=o[77],qe}function Zf(e){let t=!e;try{a(Of,t,M)}catch(e){console.error(e)}return t}function Qf(e){return e.wordWrap}export{Xf as default};