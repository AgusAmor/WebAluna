/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ma=()=>{};var Jr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js=function(i){const e=[];let t=0;for(let r=0;r<i.length;r++){let o=i.charCodeAt(r);o<128?e[t++]=o:o<2048?(e[t++]=o>>6|192,e[t++]=o&63|128):(o&64512)===55296&&r+1<i.length&&(i.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(i.charCodeAt(++r)&1023),e[t++]=o>>18|240,e[t++]=o>>12&63|128,e[t++]=o>>6&63|128,e[t++]=o&63|128):(e[t++]=o>>12|224,e[t++]=o>>6&63|128,e[t++]=o&63|128)}return e},Ua=function(i){const e=[];let t=0,r=0;for(;t<i.length;){const o=i[t++];if(o<128)e[r++]=String.fromCharCode(o);else if(o>191&&o<224){const c=i[t++];e[r++]=String.fromCharCode((o&31)<<6|c&63)}else if(o>239&&o<365){const c=i[t++],h=i[t++],u=i[t++],g=((o&7)<<18|(c&63)<<12|(h&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(g>>10)),e[r++]=String.fromCharCode(56320+(g&1023))}else{const c=i[t++],h=i[t++];e[r++]=String.fromCharCode((o&15)<<12|(c&63)<<6|h&63)}}return e.join("")},Xs={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(i,e){if(!Array.isArray(i))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<i.length;o+=3){const c=i[o],h=o+1<i.length,u=h?i[o+1]:0,g=o+2<i.length,E=g?i[o+2]:0,S=c>>2,b=(c&3)<<4|u>>4;let T=(u&15)<<2|E>>6,L=E&63;g||(L=64,h||(T=64)),r.push(t[S],t[b],t[T],t[L])}return r.join("")},encodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(i):this.encodeByteArray(Js(i),e)},decodeString(i,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(i):Ua(this.decodeStringToByteArray(i,e))},decodeStringToByteArray(i,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<i.length;){const c=t[i.charAt(o++)],u=o<i.length?t[i.charAt(o)]:0;++o;const E=o<i.length?t[i.charAt(o)]:64;++o;const b=o<i.length?t[i.charAt(o)]:64;if(++o,c==null||u==null||E==null||b==null)throw new xa;const T=c<<2|u>>4;if(r.push(T),E!==64){const L=u<<4&240|E>>2;if(r.push(L),b!==64){const C=E<<6&192|b;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let i=0;i<this.ENCODED_VALS.length;i++)this.byteToCharMap_[i]=this.ENCODED_VALS.charAt(i),this.charToByteMap_[this.byteToCharMap_[i]]=i,this.byteToCharMapWebSafe_[i]=this.ENCODED_VALS_WEBSAFE.charAt(i),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]]=i,i>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)]=i,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)]=i)}}};class xa extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Fa=function(i){const e=Js(i);return Xs.encodeByteArray(e,!0)},Sn=function(i){return Fa(i).replace(/\./g,"")},Ys=function(i){try{return Xs.decodeString(i,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Va(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ja=()=>Va().__FIREBASE_DEFAULTS__,Ba=()=>{if(typeof process>"u"||typeof Jr>"u")return;const i=Jr.__FIREBASE_DEFAULTS__;if(i)return JSON.parse(i)},Ha=()=>{if(typeof document>"u")return;let i;try{i=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=i&&Ys(i[1]);return e&&JSON.parse(e)},Oi=()=>{try{return Ma()||ja()||Ba()||Ha()}catch(i){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${i}`);return}},Zs=i=>{var e,t;return(t=(e=Oi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[i]},Qs=i=>{const e=Zs(i);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},eo=()=>{var i;return(i=Oi())===null||i===void 0?void 0:i.config},to=i=>{var e;return(e=Oi())===null||e===void 0?void 0:e[`_${i}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gt(i){try{return(i.startsWith("http://")||i.startsWith("https://")?new URL(i).hostname:i).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ni(i){return(await fetch(i,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function no(i,e){if(i.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",o=i.iat||0,c=i.sub||i.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}}},i);return[Sn(JSON.stringify(t)),Sn(JSON.stringify(h)),""].join(".")}const xt={};function Wa(){const i={prod:[],emulator:[]};for(const e of Object.keys(xt))xt[e]?i.emulator.push(e):i.prod.push(e);return i}function Ga(i){let e=document.getElementById(i),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",i),t=!0),{created:t,element:e}}let Xr=!1;function Di(i,e){if(typeof window>"u"||typeof document>"u"||!gt(window.location.host)||xt[i]===e||xt[i]||Xr)return;xt[i]=e;function t(T){return`__firebase__banner__${T}`}const r="__firebase__banner",c=Wa().prod.length>0;function h(){const T=document.getElementById(r);T&&T.remove()}function u(T){T.style.display="flex",T.style.background="#7faaf0",T.style.position="fixed",T.style.bottom="5px",T.style.left="5px",T.style.padding=".5em",T.style.borderRadius="5px",T.style.alignItems="center"}function g(T,L){T.setAttribute("width","24"),T.setAttribute("id",L),T.setAttribute("height","24"),T.setAttribute("viewBox","0 0 24 24"),T.setAttribute("fill","none"),T.style.marginLeft="-6px"}function E(){const T=document.createElement("span");return T.style.cursor="pointer",T.style.marginLeft="16px",T.style.fontSize="24px",T.innerHTML=" &times;",T.onclick=()=>{Xr=!0,h()},T}function S(T,L){T.setAttribute("id",L),T.innerText="Learn more",T.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",T.setAttribute("target","__blank"),T.style.paddingLeft="5px",T.style.textDecoration="underline"}function b(){const T=Ga(r),L=t("text"),C=document.getElementById(L)||document.createElement("span"),U=t("learnmore"),k=document.getElementById(U)||document.createElement("a"),G=t("preprendIcon"),H=document.getElementById(G)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(T.created){const x=T.element;u(x),S(k,U);const V=E();g(H,G),x.append(H,C,k,V),document.body.appendChild(x)}c?(C.innerText="Preview backend disconnected.",H.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(H.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,C.innerText="Preview backend running in this workspace."),C.setAttribute("id",L)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",b):b()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ee(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function za(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ee())}function qa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ka(){const i=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof i=="object"&&i.id!==void 0}function Ja(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Xa(){const i=ee();return i.indexOf("MSIE ")>=0||i.indexOf("Trident/")>=0}function Ya(){try{return typeof indexedDB=="object"}catch{return!1}}function Za(){return new Promise((i,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),t||self.indexedDB.deleteDatabase(r),i(!0)},o.onupgradeneeded=()=>{t=!1},o.onerror=()=>{var c;e(((c=o.error)===null||c===void 0?void 0:c.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qa="FirebaseError";class ye extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Qa,Object.setPrototypeOf(this,ye.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,zt.prototype.create)}}class zt{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},o=`${this.service}/${e}`,c=this.errors[e],h=c?ec(c,r):"Error",u=`${this.serviceName}: ${h} (${o}).`;return new ye(o,u,r)}}function ec(i,e){return i.replace(tc,(t,r)=>{const o=e[r];return o!=null?String(o):`<${r}?>`})}const tc=/\{\$([^}]+)}/g;function nc(i){for(const e in i)if(Object.prototype.hasOwnProperty.call(i,e))return!1;return!0}function Ye(i,e){if(i===e)return!0;const t=Object.keys(i),r=Object.keys(e);for(const o of t){if(!r.includes(o))return!1;const c=i[o],h=e[o];if(Yr(c)&&Yr(h)){if(!Ye(c,h))return!1}else if(c!==h)return!1}for(const o of r)if(!t.includes(o))return!1;return!0}function Yr(i){return i!==null&&typeof i=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qt(i){const e=[];for(const[t,r]of Object.entries(i))Array.isArray(r)?r.forEach(o=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Mt(i){const e={};return i.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[o,c]=r.split("=");e[decodeURIComponent(o)]=decodeURIComponent(c)}}),e}function Ut(i){const e=i.indexOf("?");if(!e)return"";const t=i.indexOf("#",e);return i.substring(e,t>0?t:void 0)}function ic(i,e){const t=new rc(i,e);return t.subscribe.bind(t)}class rc{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let o;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");sc(e,["next","error","complete"])?o=e:o={next:e,error:t,complete:r},o.next===void 0&&(o.next=fi),o.error===void 0&&(o.error=fi),o.complete===void 0&&(o.complete=fi);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function sc(i,e){if(typeof i!="object"||i===null)return!1;for(const t of e)if(t in i&&typeof i[t]=="function")return!0;return!1}function fi(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ve(i){return i&&i._delegate?i._delegate:i}class Be{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new $a;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:t});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const r=this.normalizeInstanceIdentifier(e?.identifier),o=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(c){if(o)return null;throw c}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(cc(e))try{this.getOrInitializeService({instanceIdentifier:ze})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(t);try{const c=this.getOrInitializeService({instanceIdentifier:o});r.resolve(c)}catch{}}}}clearInstance(e=ze){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ze){return this.instances.has(e)}getOptions(e=ze){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[c,h]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(c);r===u&&h.resolve(o)}return o}onInit(e,t){var r;const o=this.normalizeInstanceIdentifier(t),c=(r=this.onInitCallbacks.get(o))!==null&&r!==void 0?r:new Set;c.add(e),this.onInitCallbacks.set(o,c);const h=this.instances.get(o);return h&&e(h,o),()=>{c.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const o of r)try{o(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:ac(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=ze){return this.component?this.component.multipleInstances?e:ze:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function ac(i){return i===ze?void 0:i}function cc(i){return i.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new oc(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var M;(function(i){i[i.DEBUG=0]="DEBUG",i[i.VERBOSE=1]="VERBOSE",i[i.INFO=2]="INFO",i[i.WARN=3]="WARN",i[i.ERROR=4]="ERROR",i[i.SILENT=5]="SILENT"})(M||(M={}));const lc={debug:M.DEBUG,verbose:M.VERBOSE,info:M.INFO,warn:M.WARN,error:M.ERROR,silent:M.SILENT},uc=M.INFO,dc={[M.DEBUG]:"log",[M.VERBOSE]:"log",[M.INFO]:"info",[M.WARN]:"warn",[M.ERROR]:"error"},fc=(i,e,...t)=>{if(e<i.logLevel)return;const r=new Date().toISOString(),o=dc[e];if(o)console[o](`[${r}]  ${i.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Li{constructor(e){this.name=e,this._logLevel=uc,this._logHandler=fc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in M))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?lc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,M.DEBUG,...e),this._logHandler(this,M.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,M.VERBOSE,...e),this._logHandler(this,M.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,M.INFO,...e),this._logHandler(this,M.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,M.WARN,...e),this._logHandler(this,M.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,M.ERROR,...e),this._logHandler(this,M.ERROR,...e)}}const pc=(i,e)=>e.some(t=>i instanceof t);let Zr,Qr;function gc(){return Zr||(Zr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function mc(){return Qr||(Qr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const io=new WeakMap,Ei=new WeakMap,ro=new WeakMap,pi=new WeakMap,Mi=new WeakMap;function _c(i){const e=new Promise((t,r)=>{const o=()=>{i.removeEventListener("success",c),i.removeEventListener("error",h)},c=()=>{t(Fe(i.result)),o()},h=()=>{r(i.error),o()};i.addEventListener("success",c),i.addEventListener("error",h)});return e.then(t=>{t instanceof IDBCursor&&io.set(t,i)}).catch(()=>{}),Mi.set(e,i),e}function yc(i){if(Ei.has(i))return;const e=new Promise((t,r)=>{const o=()=>{i.removeEventListener("complete",c),i.removeEventListener("error",h),i.removeEventListener("abort",h)},c=()=>{t(),o()},h=()=>{r(i.error||new DOMException("AbortError","AbortError")),o()};i.addEventListener("complete",c),i.addEventListener("error",h),i.addEventListener("abort",h)});Ei.set(i,e)}let Ti={get(i,e,t){if(i instanceof IDBTransaction){if(e==="done")return Ei.get(i);if(e==="objectStoreNames")return i.objectStoreNames||ro.get(i);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Fe(i[e])},set(i,e,t){return i[e]=t,!0},has(i,e){return i instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in i}};function vc(i){Ti=i(Ti)}function Ic(i){return i===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=i.call(gi(this),e,...t);return ro.set(r,e.sort?e.sort():[e]),Fe(r)}:mc().includes(i)?function(...e){return i.apply(gi(this),e),Fe(io.get(this))}:function(...e){return Fe(i.apply(gi(this),e))}}function wc(i){return typeof i=="function"?Ic(i):(i instanceof IDBTransaction&&yc(i),pc(i,gc())?new Proxy(i,Ti):i)}function Fe(i){if(i instanceof IDBRequest)return _c(i);if(pi.has(i))return pi.get(i);const e=wc(i);return e!==i&&(pi.set(i,e),Mi.set(e,i)),e}const gi=i=>Mi.get(i);function Ec(i,e,{blocked:t,upgrade:r,blocking:o,terminated:c}={}){const h=indexedDB.open(i,e),u=Fe(h);return r&&h.addEventListener("upgradeneeded",g=>{r(Fe(h.result),g.oldVersion,g.newVersion,Fe(h.transaction),g)}),t&&h.addEventListener("blocked",g=>t(g.oldVersion,g.newVersion,g)),u.then(g=>{c&&g.addEventListener("close",()=>c()),o&&g.addEventListener("versionchange",E=>o(E.oldVersion,E.newVersion,E))}).catch(()=>{}),u}const Tc=["get","getKey","getAll","getAllKeys","count"],Ac=["put","add","delete","clear"],mi=new Map;function es(i,e){if(!(i instanceof IDBDatabase&&!(e in i)&&typeof e=="string"))return;if(mi.get(e))return mi.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,o=Ac.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(o||Tc.includes(t)))return;const c=async function(h,...u){const g=this.transaction(h,o?"readwrite":"readonly");let E=g.store;return r&&(E=E.index(u.shift())),(await Promise.all([E[t](...u),o&&g.done]))[0]};return mi.set(e,c),c}vc(i=>({...i,get:(e,t,r)=>es(e,t)||i.get(e,t,r),has:(e,t)=>!!es(e,t)||i.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(bc(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function bc(i){const e=i.getComponent();return e?.type==="VERSION"}const Ai="@firebase/app",ts="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Re=new Li("@firebase/app"),Rc="@firebase/app-compat",Cc="@firebase/analytics-compat",kc="@firebase/analytics",Pc="@firebase/app-check-compat",Oc="@firebase/app-check",Nc="@firebase/auth",Dc="@firebase/auth-compat",Lc="@firebase/database",Mc="@firebase/data-connect",Uc="@firebase/database-compat",xc="@firebase/functions",Fc="@firebase/functions-compat",Vc="@firebase/installations",jc="@firebase/installations-compat",Bc="@firebase/messaging",Hc="@firebase/messaging-compat",$c="@firebase/performance",Wc="@firebase/performance-compat",Gc="@firebase/remote-config",zc="@firebase/remote-config-compat",qc="@firebase/storage",Kc="@firebase/storage-compat",Jc="@firebase/firestore",Xc="@firebase/ai",Yc="@firebase/firestore-compat",Zc="firebase",Qc="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Si="[DEFAULT]",eh={[Ai]:"fire-core",[Rc]:"fire-core-compat",[kc]:"fire-analytics",[Cc]:"fire-analytics-compat",[Oc]:"fire-app-check",[Pc]:"fire-app-check-compat",[Nc]:"fire-auth",[Dc]:"fire-auth-compat",[Lc]:"fire-rtdb",[Mc]:"fire-data-connect",[Uc]:"fire-rtdb-compat",[xc]:"fire-fn",[Fc]:"fire-fn-compat",[Vc]:"fire-iid",[jc]:"fire-iid-compat",[Bc]:"fire-fcm",[Hc]:"fire-fcm-compat",[$c]:"fire-perf",[Wc]:"fire-perf-compat",[Gc]:"fire-rc",[zc]:"fire-rc-compat",[qc]:"fire-gcs",[Kc]:"fire-gcs-compat",[Jc]:"fire-fst",[Yc]:"fire-fst-compat",[Xc]:"fire-vertex","fire-js":"fire-js",[Zc]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn=new Map,th=new Map,bi=new Map;function ns(i,e){try{i.container.addComponent(e)}catch(t){Re.debug(`Component ${e.name} failed to register with FirebaseApp ${i.name}`,t)}}function Ze(i){const e=i.name;if(bi.has(e))return Re.debug(`There were multiple attempts to register component ${e}.`),!1;bi.set(e,i);for(const t of bn.values())ns(t,i);for(const t of th.values())ns(t,i);return!0}function Un(i,e){const t=i.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),i.container.getProvider(e)}function ie(i){return i==null?!1:i.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ve=new zt("app","Firebase",nh);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Be("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ve.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=Qc;function rh(i,e={}){let t=i;typeof e!="object"&&(e={name:e});const r=Object.assign({name:Si,automaticDataCollectionEnabled:!0},e),o=r.name;if(typeof o!="string"||!o)throw Ve.create("bad-app-name",{appName:String(o)});if(t||(t=eo()),!t)throw Ve.create("no-options");const c=bn.get(o);if(c){if(Ye(t,c.options)&&Ye(r,c.config))return c;throw Ve.create("duplicate-app",{appName:o})}const h=new hc(o);for(const g of bi.values())h.addComponent(g);const u=new ih(t,r,h);return bn.set(o,u),u}function Ui(i=Si){const e=bn.get(i);if(!e&&i===Si&&eo())return rh();if(!e)throw Ve.create("no-app",{appName:i});return e}function pe(i,e,t){var r;let o=(r=eh[i])!==null&&r!==void 0?r:i;t&&(o+=`-${t}`);const c=o.match(/\s|\//),h=e.match(/\s|\//);if(c||h){const u=[`Unable to register library "${o}" with version "${e}":`];c&&u.push(`library name "${o}" contains illegal characters (whitespace or "/")`),c&&h&&u.push("and"),h&&u.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Re.warn(u.join(" "));return}Ze(new Be(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sh="firebase-heartbeat-database",oh=1,Ht="firebase-heartbeat-store";let _i=null;function so(){return _i||(_i=Ec(sh,oh,{upgrade:(i,e)=>{switch(e){case 0:try{i.createObjectStore(Ht)}catch(t){console.warn(t)}}}}).catch(i=>{throw Ve.create("idb-open",{originalErrorMessage:i.message})})),_i}async function ah(i){try{const t=(await so()).transaction(Ht),r=await t.objectStore(Ht).get(oo(i));return await t.done,r}catch(e){if(e instanceof ye)Re.warn(e.message);else{const t=Ve.create("idb-get",{originalErrorMessage:e?.message});Re.warn(t.message)}}}async function is(i,e){try{const r=(await so()).transaction(Ht,"readwrite");await r.objectStore(Ht).put(e,oo(i)),await r.done}catch(t){if(t instanceof ye)Re.warn(t.message);else{const r=Ve.create("idb-set",{originalErrorMessage:t?.message});Re.warn(r.message)}}}function oo(i){return`${i.name}!${i.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ch=1024,hh=30;class lh{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new dh(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),c=rs();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(h=>h.date===c))return;if(this._heartbeatsCache.heartbeats.push({date:c,agent:o}),this._heartbeatsCache.heartbeats.length>hh){const h=fh(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(h,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Re.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=rs(),{heartbeatsToSend:r,unsentEntries:o}=uh(this._heartbeatsCache.heartbeats),c=Sn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(t){return Re.warn(t),""}}}function rs(){return new Date().toISOString().substring(0,10)}function uh(i,e=ch){const t=[];let r=i.slice();for(const o of i){const c=t.find(h=>h.agent===o.agent);if(c){if(c.dates.push(o.date),ss(t)>e){c.dates.pop();break}}else if(t.push({agent:o.agent,dates:[o.date]}),ss(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class dh{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ya()?Za().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await ah(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return is(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const o=await this.read();return is(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function ss(i){return Sn(JSON.stringify({version:2,heartbeats:i})).length}function fh(i){if(i.length===0)return-1;let e=0,t=i[0].date;for(let r=1;r<i.length;r++)i[r].date<t&&(t=i[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ph(i){Ze(new Be("platform-logger",e=>new Sc(e),"PRIVATE")),Ze(new Be("heartbeat",e=>new lh(e),"PRIVATE")),pe(Ai,ts,i),pe(Ai,ts,"esm2017"),pe("fire-js","")}ph("");var gh="firebase",mh="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */pe(gh,mh,"app");function xi(i,e){var t={};for(var r in i)Object.prototype.hasOwnProperty.call(i,r)&&e.indexOf(r)<0&&(t[r]=i[r]);if(i!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(i);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(i,r[o])&&(t[r[o]]=i[r[o]]);return t}function ao(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _h=ao,co=new zt("auth","Firebase",ao());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rn=new Li("@firebase/auth");function yh(i,...e){Rn.logLevel<=M.WARN&&Rn.warn(`Auth (${tt}): ${i}`,...e)}function In(i,...e){Rn.logLevel<=M.ERROR&&Rn.error(`Auth (${tt}): ${i}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function le(i,...e){throw Fi(i,...e)}function ge(i,...e){return Fi(i,...e)}function ho(i,e,t){const r=Object.assign(Object.assign({},_h()),{[e]:t});return new zt("auth","Firebase",r).create(e,{appName:i.name})}function je(i){return ho(i,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fi(i,...e){if(typeof i!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=i.name),i._errorFactory.create(t,...r)}return co.create(i,...e)}function R(i,e,...t){if(!i)throw Fi(e,...t)}function Se(i){const e="INTERNAL ASSERTION FAILED: "+i;throw In(e),new Error(e)}function Ce(i,e){i||Se(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ri(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.href)||""}function vh(){return os()==="http:"||os()==="https:"}function os(){var i;return typeof self<"u"&&((i=self.location)===null||i===void 0?void 0:i.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ih(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(vh()||Ka()||"connection"in navigator)?navigator.onLine:!0}function wh(){if(typeof navigator>"u")return null;const i=navigator;return i.languages&&i.languages[0]||i.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e,t){this.shortDelay=e,this.longDelay=t,Ce(t>e,"Short delay should be less than long delay!"),this.isMobile=za()||Ja()}get(){return Ih()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vi(i,e){Ce(i.emulator,"Emulator should always be set here");const{url:t}=i.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Se("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Se("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Se("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Th=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ah=new Kt(3e4,6e4);function nt(i,e){return i.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:i.tenantId}):e}async function He(i,e,t,r,o={}){return uo(i,o,async()=>{let c={},h={};r&&(e==="GET"?h=r:c={body:JSON.stringify(r)});const u=qt(Object.assign({key:i.config.apiKey},h)).slice(1),g=await i._getAdditionalHeaders();g["Content-Type"]="application/json",i.languageCode&&(g["X-Firebase-Locale"]=i.languageCode);const E=Object.assign({method:e,headers:g},c);return qa()||(E.referrerPolicy="no-referrer"),i.emulatorConfig&&gt(i.emulatorConfig.host)&&(E.credentials="include"),lo.fetch()(await fo(i,i.config.apiHost,t,u),E)})}async function uo(i,e,t){i._canInitEmulator=!1;const r=Object.assign(Object.assign({},Eh),e);try{const o=new bh(i),c=await Promise.race([t(),o.promise]);o.clearNetworkTimeout();const h=await c.json();if("needConfirmation"in h)throw mn(i,"account-exists-with-different-credential",h);if(c.ok&&!("errorMessage"in h))return h;{const u=c.ok?h.errorMessage:h.error.message,[g,E]=u.split(" : ");if(g==="FEDERATED_USER_ID_ALREADY_LINKED")throw mn(i,"credential-already-in-use",h);if(g==="EMAIL_EXISTS")throw mn(i,"email-already-in-use",h);if(g==="USER_DISABLED")throw mn(i,"user-disabled",h);const S=r[g]||g.toLowerCase().replace(/[_\s]+/g,"-");if(E)throw ho(i,S,E);le(i,S)}}catch(o){if(o instanceof ye)throw o;le(i,"network-request-failed",{message:String(o)})}}async function xn(i,e,t,r,o={}){const c=await He(i,e,t,r,o);return"mfaPendingCredential"in c&&le(i,"multi-factor-auth-required",{_serverResponse:c}),c}async function fo(i,e,t,r){const o=`${e}${t}?${r}`,c=i,h=c.config.emulator?Vi(i.config,o):`${i.config.apiScheme}://${o}`;return Th.includes(t)&&(await c._persistenceManagerAvailable,c._getPersistenceType()==="COOKIE")?c._getPersistence()._getFinalTarget(h).toString():h}function Sh(i){switch(i){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class bh{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(ge(this.auth,"network-request-failed")),Ah.get())})}}function mn(i,e,t){const r={appName:i.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const o=ge(i,e,r);return o.customData._tokenResponse=t,o}function as(i){return i!==void 0&&i.enterprise!==void 0}class Rh{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return Sh(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function Ch(i,e){return He(i,"GET","/v2/recaptchaConfig",nt(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kh(i,e){return He(i,"POST","/v1/accounts:delete",e)}async function Cn(i,e){return He(i,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(i){if(i)try{const e=new Date(Number(i));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ph(i,e=!1){const t=ve(i),r=await t.getIdToken(e),o=ji(r);R(o&&o.exp&&o.auth_time&&o.iat,t.auth,"internal-error");const c=typeof o.firebase=="object"?o.firebase:void 0,h=c?.sign_in_provider;return{claims:o,token:r,authTime:Ft(yi(o.auth_time)),issuedAtTime:Ft(yi(o.iat)),expirationTime:Ft(yi(o.exp)),signInProvider:h||null,signInSecondFactor:c?.sign_in_second_factor||null}}function yi(i){return Number(i)*1e3}function ji(i){const[e,t,r]=i.split(".");if(e===void 0||t===void 0||r===void 0)return In("JWT malformed, contained fewer than 3 sections"),null;try{const o=Ys(t);return o?JSON.parse(o):(In("Failed to decode base64 JWT payload"),null)}catch(o){return In("Caught error parsing JWT payload as JSON",o?.toString()),null}}function cs(i){const e=ji(i);return R(e,"internal-error"),R(typeof e.exp<"u","internal-error"),R(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $t(i,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof ye&&Oh(r)&&i.auth.currentUser===i&&await i.auth.signOut(),r}}function Oh({code:i}){return i==="auth/user-disabled"||i==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const o=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ft(this.lastLoginAt),this.creationTime=Ft(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kn(i){var e;const t=i.auth,r=await i.getIdToken(),o=await $t(i,Cn(t,{idToken:r}));R(o?.users.length,t,"internal-error");const c=o.users[0];i._notifyReloadListener(c);const h=!((e=c.providerUserInfo)===null||e===void 0)&&e.length?po(c.providerUserInfo):[],u=Lh(i.providerData,h),g=i.isAnonymous,E=!(i.email&&c.passwordHash)&&!u?.length,S=g?E:!1,b={uid:c.localId,displayName:c.displayName||null,photoURL:c.photoUrl||null,email:c.email||null,emailVerified:c.emailVerified||!1,phoneNumber:c.phoneNumber||null,tenantId:c.tenantId||null,providerData:u,metadata:new Ci(c.createdAt,c.lastLoginAt),isAnonymous:S};Object.assign(i,b)}async function Dh(i){const e=ve(i);await kn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Lh(i,e){return[...i.filter(r=>!e.some(o=>o.providerId===r.providerId)),...e]}function po(i){return i.map(e=>{var{providerId:t}=e,r=xi(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mh(i,e){const t=await uo(i,{},async()=>{const r=qt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:c}=i.config,h=await fo(i,o,"/v1/token",`key=${c}`),u=await i._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";const g={method:"POST",headers:u,body:r};return i.emulatorConfig&&gt(i.emulatorConfig.host)&&(g.credentials="include"),lo.fetch()(h,g)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Uh(i,e){return He(i,"POST","/v2/accounts:revokeToken",nt(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){R(e.idToken,"internal-error"),R(typeof e.idToken<"u","internal-error"),R(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):cs(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){R(e.length!==0,"internal-error");const t=cs(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(R(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:o,expiresIn:c}=await Mh(e,t);this.updateTokensAndExpiration(r,o,Number(c))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:o,expirationTime:c}=t,h=new ht;return r&&(R(typeof r=="string","internal-error",{appName:e}),h.refreshToken=r),o&&(R(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),c&&(R(typeof c=="number","internal-error",{appName:e}),h.expirationTime=c),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new ht,this.toJSON())}_performRefresh(){return Se("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function De(i,e){R(typeof i=="string"||typeof i>"u","internal-error",{appName:e})}class oe{constructor(e){var{uid:t,auth:r,stsTokenManager:o}=e,c=xi(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Nh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=c.displayName||null,this.email=c.email||null,this.emailVerified=c.emailVerified||!1,this.phoneNumber=c.phoneNumber||null,this.photoURL=c.photoURL||null,this.isAnonymous=c.isAnonymous||!1,this.tenantId=c.tenantId||null,this.providerData=c.providerData?[...c.providerData]:[],this.metadata=new Ci(c.createdAt||void 0,c.lastLoginAt||void 0)}async getIdToken(e){const t=await $t(this,this.stsTokenManager.getToken(this.auth,e));return R(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Ph(this,e)}reload(){return Dh(this)}_assign(e){this!==e&&(R(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new oe(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){R(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await kn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ie(this.auth.app))return Promise.reject(je(this.auth));const e=await this.getIdToken();return await $t(this,kh(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,o,c,h,u,g,E,S;const b=(r=t.displayName)!==null&&r!==void 0?r:void 0,T=(o=t.email)!==null&&o!==void 0?o:void 0,L=(c=t.phoneNumber)!==null&&c!==void 0?c:void 0,C=(h=t.photoURL)!==null&&h!==void 0?h:void 0,U=(u=t.tenantId)!==null&&u!==void 0?u:void 0,k=(g=t._redirectEventId)!==null&&g!==void 0?g:void 0,G=(E=t.createdAt)!==null&&E!==void 0?E:void 0,H=(S=t.lastLoginAt)!==null&&S!==void 0?S:void 0,{uid:x,emailVerified:V,isAnonymous:te,providerData:W,stsTokenManager:y}=t;R(x&&y,e,"internal-error");const d=ht.fromJSON(this.name,y);R(typeof x=="string",e,"internal-error"),De(b,e.name),De(T,e.name),R(typeof V=="boolean",e,"internal-error"),R(typeof te=="boolean",e,"internal-error"),De(L,e.name),De(C,e.name),De(U,e.name),De(k,e.name),De(G,e.name),De(H,e.name);const p=new oe({uid:x,auth:e,email:T,emailVerified:V,displayName:b,isAnonymous:te,photoURL:C,phoneNumber:L,tenantId:U,stsTokenManager:d,createdAt:G,lastLoginAt:H});return W&&Array.isArray(W)&&(p.providerData=W.map(m=>Object.assign({},m))),k&&(p._redirectEventId=k),p}static async _fromIdTokenResponse(e,t,r=!1){const o=new ht;o.updateFromServerResponse(t);const c=new oe({uid:t.localId,auth:e,stsTokenManager:o,isAnonymous:r});return await kn(c),c}static async _fromGetAccountInfoResponse(e,t,r){const o=t.users[0];R(o.localId!==void 0,"internal-error");const c=o.providerUserInfo!==void 0?po(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!c?.length,u=new ht;u.updateFromIdToken(r);const g=new oe({uid:o.localId,auth:e,stsTokenManager:u,isAnonymous:h}),E={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:c,metadata:new Ci(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!c?.length};return Object.assign(g,E),g}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hs=new Map;function be(i){Ce(i instanceof Function,"Expected a class definition");let e=hs.get(i);return e?(Ce(e instanceof i,"Instance stored in cache mismatched with class"),e):(e=new i,hs.set(i,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class go{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}go.type="NONE";const ls=go;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(i,e,t){return`firebase:${i}:${e}:${t}`}class lt{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:o,name:c}=this.auth;this.fullUserKey=wn(this.userKey,o.apiKey,c),this.fullPersistenceKey=wn("persistence",o.apiKey,c),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Cn(this.auth,{idToken:e}).catch(()=>{});return t?oe._fromGetAccountInfoResponse(this.auth,t,e):null}return oe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new lt(be(ls),e,r);const o=(await Promise.all(t.map(async E=>{if(await E._isAvailable())return E}))).filter(E=>E);let c=o[0]||be(ls);const h=wn(r,e.config.apiKey,e.name);let u=null;for(const E of t)try{const S=await E._get(h);if(S){let b;if(typeof S=="string"){const T=await Cn(e,{idToken:S}).catch(()=>{});if(!T)break;b=await oe._fromGetAccountInfoResponse(e,T,S)}else b=oe._fromJSON(e,S);E!==c&&(u=b),c=E;break}}catch{}const g=o.filter(E=>E._shouldAllowMigration);return!c._shouldAllowMigration||!g.length?new lt(c,e,r):(c=g[0],u&&await c._set(h,u.toJSON()),await Promise.all(t.map(async E=>{if(E!==c)try{await E._remove(h)}catch{}})),new lt(c,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function us(i){const e=i.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(vo(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(mo(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(wo(e))return"Blackberry";if(Eo(e))return"Webos";if(_o(e))return"Safari";if((e.includes("chrome/")||yo(e))&&!e.includes("edge/"))return"Chrome";if(Io(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=i.match(t);if(r?.length===2)return r[1]}return"Other"}function mo(i=ee()){return/firefox\//i.test(i)}function _o(i=ee()){const e=i.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function yo(i=ee()){return/crios\//i.test(i)}function vo(i=ee()){return/iemobile/i.test(i)}function Io(i=ee()){return/android/i.test(i)}function wo(i=ee()){return/blackberry/i.test(i)}function Eo(i=ee()){return/webos/i.test(i)}function Bi(i=ee()){return/iphone|ipad|ipod/i.test(i)||/macintosh/i.test(i)&&/mobile/i.test(i)}function xh(i=ee()){var e;return Bi(i)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Fh(){return Xa()&&document.documentMode===10}function To(i=ee()){return Bi(i)||Io(i)||Eo(i)||wo(i)||/windows phone/i.test(i)||vo(i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ao(i,e=[]){let t;switch(i){case"Browser":t=us(ee());break;case"Worker":t=`${us(ee())}-${i}`;break;default:t=i}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${tt}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vh{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=c=>new Promise((h,u)=>{try{const g=e(c);h(g)}catch(g){u(g)}});r.onAbort=t,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const o of t)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jh(i,e={}){return He(i,"GET","/v2/passwordPolicy",nt(i,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bh=6;class Hh{constructor(e){var t,r,o,c;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=h.minPasswordLength)!==null&&t!==void 0?t:Bh,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(c=e.forceUpgradeOnSignin)!==null&&c!==void 0?c:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,o,c,h,u;const g={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,g),this.validatePasswordCharacterOptions(e,g),g.isValid&&(g.isValid=(t=g.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),g.isValid&&(g.isValid=(r=g.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),g.isValid&&(g.isValid=(o=g.containsLowercaseLetter)!==null&&o!==void 0?o:!0),g.isValid&&(g.isValid=(c=g.containsUppercaseLetter)!==null&&c!==void 0?c:!0),g.isValid&&(g.isValid=(h=g.containsNumericCharacter)!==null&&h!==void 0?h:!0),g.isValid&&(g.isValid=(u=g.containsNonAlphanumericCharacter)!==null&&u!==void 0?u:!0),g}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),o&&(t.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let o=0;o<e.length;o++)r=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,o,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $h{constructor(e,t,r,o){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ds(this),this.idTokenSubscription=new ds(this),this.beforeStateQueue=new Vh(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=co,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion,this._persistenceManagerAvailable=new Promise(c=>this._resolvePersistenceManagerAvailable=c)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=be(t)),this._initializationPromise=this.queue(async()=>{var r,o,c;if(!this._deleted&&(this.persistenceManager=await lt.create(this,e),(r=this._resolvePersistenceManagerAvailable)===null||r===void 0||r.call(this),!this._deleted)){if(!((o=this._popupRedirectResolver)===null||o===void 0)&&o._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((c=this.currentUser)===null||c===void 0?void 0:c.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Cn(this,{idToken:e}),r=await oe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(ie(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(u=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(u,u))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let o=r,c=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,u=o?._redirectEventId,g=await this.tryRedirectSignIn(e);(!h||h===u)&&g?.user&&(o=g.user,c=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(c)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return R(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await kn(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=wh()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ie(this.app))return Promise.reject(je(this));const t=e?ve(e):null;return t&&R(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&R(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ie(this.app)?Promise.reject(je(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ie(this.app)?Promise.reject(je(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(be(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await jh(this),t=new Hh(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new zt("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await Uh(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&be(e)||this._popupRedirectResolver;R(t,this,"argument-error"),this.redirectPersistenceManager=await lt.create(this,[be(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,o){if(this._deleted)return()=>{};const c=typeof t=="function"?t:t.next.bind(t);let h=!1;const u=this._isInitialized?Promise.resolve():this._initializationPromise;if(R(u,this,"internal-error"),u.then(()=>{h||c(this.currentUser)}),typeof t=="function"){const g=e.addObserver(t,r,o);return()=>{h=!0,g()}}else{const g=e.addObserver(t);return()=>{h=!0,g()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return R(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Ao(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);const o=await this._getAppCheckToken();return o&&(t["X-Firebase-AppCheck"]=o),t}async _getAppCheckToken(){var e;if(ie(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&yh(`Error while retrieving App Check token: ${t.error}`),t?.token}}function mt(i){return ve(i)}class ds{constructor(e){this.auth=e,this.observer=null,this.addObserver=ic(t=>this.observer=t)}get next(){return R(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Fn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Wh(i){Fn=i}function So(i){return Fn.loadJS(i)}function Gh(){return Fn.recaptchaEnterpriseScript}function zh(){return Fn.gapiScript}function qh(i){return`__${i}${Math.floor(Math.random()*1e6)}`}class Kh{constructor(){this.enterprise=new Jh}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class Jh{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const Xh="recaptcha-enterprise",bo="NO_RECAPTCHA";class Yh{constructor(e){this.type=Xh,this.auth=mt(e)}async verify(e="verify",t=!1){async function r(c){if(!t){if(c.tenantId==null&&c._agentRecaptchaConfig!=null)return c._agentRecaptchaConfig.siteKey;if(c.tenantId!=null&&c._tenantRecaptchaConfigs[c.tenantId]!==void 0)return c._tenantRecaptchaConfigs[c.tenantId].siteKey}return new Promise(async(h,u)=>{Ch(c,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(g=>{if(g.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{const E=new Rh(g);return c.tenantId==null?c._agentRecaptchaConfig=E:c._tenantRecaptchaConfigs[c.tenantId]=E,h(E.siteKey)}}).catch(g=>{u(g)})})}function o(c,h,u){const g=window.grecaptcha;as(g)?g.enterprise.ready(()=>{g.enterprise.execute(c,{action:e}).then(E=>{h(E)}).catch(()=>{h(bo)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Kh().execute("siteKey",{action:"verify"}):new Promise((c,h)=>{r(this.auth).then(u=>{if(!t&&as(window.grecaptcha))o(u,c,h);else{if(typeof window>"u"){h(new Error("RecaptchaVerifier is only supported in browser"));return}let g=Gh();g.length!==0&&(g+=u),So(g).then(()=>{o(u,c,h)}).catch(E=>{h(E)})}}).catch(u=>{h(u)})})}}async function fs(i,e,t,r=!1,o=!1){const c=new Yh(i);let h;if(o)h=bo;else try{h=await c.verify(t)}catch{h=await c.verify(t,!0)}const u=Object.assign({},e);if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){const g=u.phoneEnrollmentInfo.phoneNumber,E=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:g,recaptchaToken:E,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){const g=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:g,captchaResponse:h,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return r?Object.assign(u,{captchaResp:h}):Object.assign(u,{captchaResponse:h}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function ps(i,e,t,r,o){var c;if(!((c=i._getRecaptchaConfig())===null||c===void 0)&&c.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const h=await fs(i,e,t,t==="getOobCode");return r(i,h)}else return r(i,e).catch(async h=>{if(h.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await fs(i,e,t,t==="getOobCode");return r(i,u)}else return Promise.reject(h)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zh(i,e){const t=Un(i,"auth");if(t.isInitialized()){const o=t.getImmediate(),c=t.getOptions();if(Ye(c,e??{}))return o;le(o,"already-initialized")}return t.initialize({options:e})}function Qh(i,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(be);e?.errorMap&&i._updateErrorMap(e.errorMap),i._initializeWithPersistence(r,e?.popupRedirectResolver)}function el(i,e,t){const r=mt(i);R(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const o=!1,c=Ro(e),{host:h,port:u}=tl(e),g=u===null?"":`:${u}`,E={url:`${c}//${h}${g}/`},S=Object.freeze({host:h,port:u,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:o})});if(!r._canInitEmulator){R(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),R(Ye(E,r.config.emulator)&&Ye(S,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=E,r.emulatorConfig=S,r.settings.appVerificationDisabledForTesting=!0,gt(h)?(Ni(`${c}//${h}${g}`),Di("Auth",!0)):nl()}function Ro(i){const e=i.indexOf(":");return e<0?"":i.substr(0,e+1)}function tl(i){const e=Ro(i),t=/(\/\/)?([^?#/]+)/.exec(i.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const c=o[1];return{host:c,port:gs(r.substr(c.length+1))}}else{const[c,h]=r.split(":");return{host:c,port:gs(h)}}}function gs(i){if(!i)return null;const e=Number(i);return isNaN(e)?null:e}function nl(){function i(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",i):i())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hi{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Se("not implemented")}_getIdTokenResponse(e){return Se("not implemented")}_linkToIdToken(e,t){return Se("not implemented")}_getReauthenticationResolver(e){return Se("not implemented")}}async function il(i,e){return He(i,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rl(i,e){return xn(i,"POST","/v1/accounts:signInWithPassword",nt(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sl(i,e){return xn(i,"POST","/v1/accounts:signInWithEmailLink",nt(i,e))}async function ol(i,e){return xn(i,"POST","/v1/accounts:signInWithEmailLink",nt(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt extends Hi{constructor(e,t,r,o=null){super("password",r),this._email=e,this._password=t,this._tenantId=o}static _fromEmailAndPassword(e,t){return new Wt(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Wt(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ps(e,t,"signInWithPassword",rl);case"emailLink":return sl(e,{email:this._email,oobCode:this._password});default:le(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ps(e,r,"signUpPassword",il);case"emailLink":return ol(e,{idToken:t,email:this._email,oobCode:this._password});default:le(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ut(i,e){return xn(i,"POST","/v1/accounts:signInWithIdp",nt(i,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const al="http://localhost";class Qe extends Hi{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Qe(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):le("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:o}=t,c=xi(t,["providerId","signInMethod"]);if(!r||!o)return null;const h=new Qe(r,o);return h.idToken=c.idToken||void 0,h.accessToken=c.accessToken||void 0,h.secret=c.secret,h.nonce=c.nonce,h.pendingToken=c.pendingToken||null,h}_getIdTokenResponse(e){const t=this.buildRequest();return ut(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,ut(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,ut(e,t)}buildRequest(){const e={requestUri:al,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=qt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cl(i){switch(i){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function hl(i){const e=Mt(Ut(i)).link,t=e?Mt(Ut(e)).deep_link_id:null,r=Mt(Ut(i)).deep_link_id;return(r?Mt(Ut(r)).link:null)||r||t||e||i}class $i{constructor(e){var t,r,o,c,h,u;const g=Mt(Ut(e)),E=(t=g.apiKey)!==null&&t!==void 0?t:null,S=(r=g.oobCode)!==null&&r!==void 0?r:null,b=cl((o=g.mode)!==null&&o!==void 0?o:null);R(E&&S&&b,"argument-error"),this.apiKey=E,this.operation=b,this.code=S,this.continueUrl=(c=g.continueUrl)!==null&&c!==void 0?c:null,this.languageCode=(h=g.lang)!==null&&h!==void 0?h:null,this.tenantId=(u=g.tenantId)!==null&&u!==void 0?u:null}static parseLink(e){const t=hl(e);try{return new $i(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(){this.providerId=_t.PROVIDER_ID}static credential(e,t){return Wt._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=$i.parseLink(t);return R(r,"argument-error"),Wt._fromEmailAndCode(e,r.code,r.tenantId)}}_t.PROVIDER_ID="password";_t.EMAIL_PASSWORD_SIGN_IN_METHOD="password";_t.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Co{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt extends Co{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le extends Jt{constructor(){super("facebook.com")}static credential(e){return Qe._fromParams({providerId:Le.PROVIDER_ID,signInMethod:Le.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Le.credentialFromTaggedObject(e)}static credentialFromError(e){return Le.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Le.credential(e.oauthAccessToken)}catch{return null}}}Le.FACEBOOK_SIGN_IN_METHOD="facebook.com";Le.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me extends Jt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Qe._fromParams({providerId:Me.PROVIDER_ID,signInMethod:Me.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Me.credentialFromTaggedObject(e)}static credentialFromError(e){return Me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Me.credential(t,r)}catch{return null}}}Me.GOOGLE_SIGN_IN_METHOD="google.com";Me.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue extends Jt{constructor(){super("github.com")}static credential(e){return Qe._fromParams({providerId:Ue.PROVIDER_ID,signInMethod:Ue.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ue.credentialFromTaggedObject(e)}static credentialFromError(e){return Ue.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ue.credential(e.oauthAccessToken)}catch{return null}}}Ue.GITHUB_SIGN_IN_METHOD="github.com";Ue.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe extends Jt{constructor(){super("twitter.com")}static credential(e,t){return Qe._fromParams({providerId:xe.PROVIDER_ID,signInMethod:xe.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return xe.credentialFromTaggedObject(e)}static credentialFromError(e){return xe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return xe.credential(t,r)}catch{return null}}}xe.TWITTER_SIGN_IN_METHOD="twitter.com";xe.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,o=!1){const c=await oe._fromIdTokenResponse(e,r,o),h=ms(r);return new ft({user:c,providerId:h,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const o=ms(r);return new ft({user:e,providerId:o,_tokenResponse:r,operationType:t})}}function ms(i){return i.providerId?i.providerId:"phoneNumber"in i?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn extends ye{constructor(e,t,r,o){var c;super(t.code,t.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,Pn.prototype),this.customData={appName:e.name,tenantId:(c=e.tenantId)!==null&&c!==void 0?c:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,o){return new Pn(e,t,r,o)}}function ko(i,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(i):t._getIdTokenResponse(i)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?Pn._fromErrorAndOperation(i,c,e,r):c})}async function ll(i,e,t=!1){const r=await $t(i,e._linkToIdToken(i.auth,await i.getIdToken()),t);return ft._forOperation(i,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ul(i,e,t=!1){const{auth:r}=i;if(ie(r.app))return Promise.reject(je(r));const o="reauthenticate";try{const c=await $t(i,ko(r,o,e,i),t);R(c.idToken,r,"internal-error");const h=ji(c.idToken);R(h,r,"internal-error");const{sub:u}=h;return R(i.uid===u,r,"user-mismatch"),ft._forOperation(i,o,c)}catch(c){throw c?.code==="auth/user-not-found"&&le(r,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Po(i,e,t=!1){if(ie(i.app))return Promise.reject(je(i));const r="signIn",o=await ko(i,r,e),c=await ft._fromIdTokenResponse(i,r,o);return t||await i._updateCurrentUser(c.user),c}async function dl(i,e){return Po(mt(i),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fl(i){const e=mt(i);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}function Nd(i,e,t){return ie(i.app)?Promise.reject(je(i)):dl(ve(i),_t.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&fl(i),r})}function pl(i,e,t,r){return ve(i).onIdTokenChanged(e,t,r)}function gl(i,e,t){return ve(i).beforeAuthStateChanged(e,t)}function Dd(i,e,t,r){return ve(i).onAuthStateChanged(e,t,r)}function Ld(i){return ve(i).signOut()}const On="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oo{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(On,"1"),this.storage.removeItem(On),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ml=1e3,_l=10;class No extends Oo{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=To(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),o=this.localCache[t];r!==o&&e(t,o,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((h,u,g)=>{this.notifyListeners(h,g)});return}const r=e.key;t?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(r);!t&&this.localCache[r]===h||this.notifyListeners(r,h)},c=this.storage.getItem(r);Fh()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,_l):o()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},ml)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}No.type="LOCAL";const yl=No;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Do extends Oo{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Do.type="SESSION";const Lo=Do;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl(i){return Promise.all(i.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(o=>o.isListeningto(e));if(t)return t;const r=new Vn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:o,data:c}=t.data,h=this.handlersMap[o];if(!h?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const u=Array.from(h).map(async E=>E(t.origin,c)),g=await vl(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:g})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Vn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wi(i="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return i+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let c,h;return new Promise((u,g)=>{const E=Wi("",20);o.port1.start();const S=setTimeout(()=>{g(new Error("unsupported_event"))},r);h={messageChannel:o,onMessage(b){const T=b;if(T.data.eventId===E)switch(T.data.status){case"ack":clearTimeout(S),c=setTimeout(()=>{g(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),u(T.data.response);break;default:clearTimeout(S),clearTimeout(c),g(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:E,data:t},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(){return window}function wl(i){me().location.href=i}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mo(){return typeof me().WorkerGlobalScope<"u"&&typeof me().importScripts=="function"}async function El(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Tl(){var i;return((i=navigator?.serviceWorker)===null||i===void 0?void 0:i.controller)||null}function Al(){return Mo()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uo="firebaseLocalStorageDb",Sl=1,Nn="firebaseLocalStorage",xo="fbase_key";class Xt{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function jn(i,e){return i.transaction([Nn],e?"readwrite":"readonly").objectStore(Nn)}function bl(){const i=indexedDB.deleteDatabase(Uo);return new Xt(i).toPromise()}function ki(){const i=indexedDB.open(Uo,Sl);return new Promise((e,t)=>{i.addEventListener("error",()=>{t(i.error)}),i.addEventListener("upgradeneeded",()=>{const r=i.result;try{r.createObjectStore(Nn,{keyPath:xo})}catch(o){t(o)}}),i.addEventListener("success",async()=>{const r=i.result;r.objectStoreNames.contains(Nn)?e(r):(r.close(),await bl(),e(await ki()))})})}async function _s(i,e,t){const r=jn(i,!0).put({[xo]:e,value:t});return new Xt(r).toPromise()}async function Rl(i,e){const t=jn(i,!1).get(e),r=await new Xt(t).toPromise();return r===void 0?null:r.value}function ys(i,e){const t=jn(i,!0).delete(e);return new Xt(t).toPromise()}const Cl=800,kl=3;class Fo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ki(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>kl)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Mo()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Vn._getInstance(Al()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await El(),!this.activeServiceWorker)return;this.sender=new Il(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((t=r[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Tl()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ki();return await _s(e,On,"1"),await ys(e,On),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>_s(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Rl(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>ys(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const c=jn(o,!1).getAll();return new Xt(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:o,value:c}of e)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(c)&&(this.notifyListeners(o,c),t.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),t.push(o));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Cl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Fo.type="LOCAL";const Pl=Fo;new Kt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ol(i,e){return e?be(e):(R(i._popupRedirectResolver,i,"argument-error"),i._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gi extends Hi{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return ut(e,this._buildIdpRequest())}_linkToIdToken(e,t){return ut(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return ut(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Nl(i){return Po(i.auth,new Gi(i),i.bypassAuthState)}function Dl(i){const{auth:e,user:t}=i;return R(t,e,"internal-error"),ul(t,new Gi(i),i.bypassAuthState)}async function Ll(i){const{auth:e,user:t}=i;return R(t,e,"internal-error"),ll(t,new Gi(i),i.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(e,t,r,o,c=!1){this.auth=e,this.resolver=r,this.user=o,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:o,tenantId:c,error:h,type:u}=e;if(h){this.reject(h);return}const g={auth:this.auth,requestUri:t,sessionId:r,tenantId:c||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(g))}catch(E){this.reject(E)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Nl;case"linkViaPopup":case"linkViaRedirect":return Ll;case"reauthViaPopup":case"reauthViaRedirect":return Dl;default:le(this.auth,"internal-error")}}resolve(e){Ce(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Ce(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml=new Kt(2e3,1e4);class ct extends Vo{constructor(e,t,r,o,c){super(e,t,o,c),this.provider=r,this.authWindow=null,this.pollId=null,ct.currentPopupAction&&ct.currentPopupAction.cancel(),ct.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return R(e,this.auth,"internal-error"),e}async onExecution(){Ce(this.filter.length===1,"Popup operations only handle one event");const e=Wi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(ge(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(ge(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ct.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if(!((r=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ge(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Ml.get())};e()}}ct.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ul="pendingRedirect",En=new Map;class xl extends Vo{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=En.get(this.auth._key());if(!e){try{const r=await Fl(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}En.set(this.auth._key(),e)}return this.bypassAuthState||En.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Fl(i,e){const t=Bl(e),r=jl(i);if(!await r._isAvailable())return!1;const o=await r._get(t)==="true";return await r._remove(t),o}function Vl(i,e){En.set(i._key(),e)}function jl(i){return be(i._redirectPersistence)}function Bl(i){return wn(Ul,i.config.apiKey,i.name)}async function Hl(i,e,t=!1){if(ie(i.app))return Promise.reject(je(i));const r=mt(i),o=Ol(r,e),h=await new xl(r,o,t).execute();return h&&!t&&(delete h.user._redirectEventId,await r._persistUserIfCurrent(h.user),await r._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $l=600*1e3;class Wl{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Gl(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!jo(e)){const o=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";t.onError(ge(this.auth,o))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=$l&&this.cachedEventUids.clear(),this.cachedEventUids.has(vs(e))}saveEventToCache(e){this.cachedEventUids.add(vs(e)),this.lastProcessedEventTime=Date.now()}}function vs(i){return[i.type,i.eventId,i.sessionId,i.tenantId].filter(e=>e).join("-")}function jo({type:i,error:e}){return i==="unknown"&&e?.code==="auth/no-auth-event"}function Gl(i){switch(i.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return jo(i);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zl(i,e={}){return He(i,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ql=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Kl=/^https?/;async function Jl(i){if(i.config.emulator)return;const{authorizedDomains:e}=await zl(i);for(const t of e)try{if(Xl(t))return}catch{}le(i,"unauthorized-domain")}function Xl(i){const e=Ri(),{protocol:t,hostname:r}=new URL(e);if(i.startsWith("chrome-extension://")){const h=new URL(i);return h.hostname===""&&r===""?t==="chrome-extension:"&&i.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&h.hostname===r}if(!Kl.test(t))return!1;if(ql.test(i))return r===i;const o=i.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yl=new Kt(3e4,6e4);function Is(){const i=me().___jsl;if(i?.H){for(const e of Object.keys(i.H))if(i.H[e].r=i.H[e].r||[],i.H[e].L=i.H[e].L||[],i.H[e].r=[...i.H[e].L],i.CP)for(let t=0;t<i.CP.length;t++)i.CP[t]=null}}function Zl(i){return new Promise((e,t)=>{var r,o,c;function h(){Is(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Is(),t(ge(i,"network-request-failed"))},timeout:Yl.get()})}if(!((o=(r=me().gapi)===null||r===void 0?void 0:r.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((c=me().gapi)===null||c===void 0)&&c.load)h();else{const u=qh("iframefcb");return me()[u]=()=>{gapi.load?h():t(ge(i,"network-request-failed"))},So(`${zh()}?onload=${u}`).catch(g=>t(g))}}).catch(e=>{throw Tn=null,e})}let Tn=null;function Ql(i){return Tn=Tn||Zl(i),Tn}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eu=new Kt(5e3,15e3),tu="__/auth/iframe",nu="emulator/auth/iframe",iu={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ru=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function su(i){const e=i.config;R(e.authDomain,i,"auth-domain-config-required");const t=e.emulator?Vi(e,nu):`https://${i.config.authDomain}/${tu}`,r={apiKey:e.apiKey,appName:i.name,v:tt},o=ru.get(i.config.apiHost);o&&(r.eid=o);const c=i._getFrameworks();return c.length&&(r.fw=c.join(",")),`${t}?${qt(r).slice(1)}`}async function ou(i){const e=await Ql(i),t=me().gapi;return R(t,i,"internal-error"),e.open({where:document.body,url:su(i),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:iu,dontclear:!0},r=>new Promise(async(o,c)=>{await r.restyle({setHideOnLeave:!1});const h=ge(i,"network-request-failed"),u=me().setTimeout(()=>{c(h)},eu.get());function g(){me().clearTimeout(u),o(r)}r.ping(g).then(g,()=>{c(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const au={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},cu=500,hu=600,lu="_blank",uu="http://localhost";class ws{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function du(i,e,t,r=cu,o=hu){const c=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-r)/2,0).toString();let u="";const g=Object.assign(Object.assign({},au),{width:r.toString(),height:o.toString(),top:c,left:h}),E=ee().toLowerCase();t&&(u=yo(E)?lu:t),mo(E)&&(e=e||uu,g.scrollbars="yes");const S=Object.entries(g).reduce((T,[L,C])=>`${T}${L}=${C},`,"");if(xh(E)&&u!=="_self")return fu(e||"",u),new ws(null);const b=window.open(e||"",u,S);R(b,i,"popup-blocked");try{b.focus()}catch{}return new ws(b)}function fu(i,e){const t=document.createElement("a");t.href=i,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pu="__/auth/handler",gu="emulator/auth/handler",mu=encodeURIComponent("fac");async function Es(i,e,t,r,o,c){R(i.config.authDomain,i,"auth-domain-config-required"),R(i.config.apiKey,i,"invalid-api-key");const h={apiKey:i.config.apiKey,appName:i.name,authType:t,redirectUrl:r,v:tt,eventId:o};if(e instanceof Co){e.setDefaultLanguage(i.languageCode),h.providerId=e.providerId||"",nc(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[S,b]of Object.entries({}))h[S]=b}if(e instanceof Jt){const S=e.getScopes().filter(b=>b!=="");S.length>0&&(h.scopes=S.join(","))}i.tenantId&&(h.tid=i.tenantId);const u=h;for(const S of Object.keys(u))u[S]===void 0&&delete u[S];const g=await i._getAppCheckToken(),E=g?`#${mu}=${encodeURIComponent(g)}`:"";return`${_u(i)}?${qt(u).slice(1)}${E}`}function _u({config:i}){return i.emulator?Vi(i,gu):`https://${i.authDomain}/${pu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vi="webStorageSupport";class yu{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Lo,this._completeRedirectFn=Hl,this._overrideRedirectResult=Vl}async _openPopup(e,t,r,o){var c;Ce((c=this.eventManagers[e._key()])===null||c===void 0?void 0:c.manager,"_initialize() not called before _openPopup()");const h=await Es(e,t,r,Ri(),o);return du(e,h,Wi())}async _openRedirect(e,t,r,o){await this._originValidation(e);const c=await Es(e,t,r,Ri(),o);return wl(c),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:o,promise:c}=this.eventManagers[t];return o?Promise.resolve(o):(Ce(c,"If manager is not set, promise should be"),c)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await ou(e),r=new Wl(e);return t.register("authEvent",o=>(R(o?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(vi,{type:vi},o=>{var c;const h=(c=o?.[0])===null||c===void 0?void 0:c[vi];h!==void 0&&t(!!h),le(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=Jl(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return To()||_o()||Bi()}}const vu=yu;var Ts="@firebase/auth",As="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){R(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(i){switch(i){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Eu(i){Ze(new Be("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:h,authDomain:u}=r.options;R(h&&!h.includes(":"),"invalid-api-key",{appName:r.name});const g={apiKey:h,authDomain:u,clientPlatform:i,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Ao(i)},E=new $h(r,o,c,g);return Qh(E,t),E},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Ze(new Be("auth-internal",e=>{const t=mt(e.getProvider("auth").getImmediate());return(r=>new Iu(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),pe(Ts,As,wu(i)),pe(Ts,As,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tu=300,Au=to("authIdTokenMaxAge")||Tu;let Ss=null;const Su=i=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Au)return;const o=t?.token;Ss!==o&&(Ss=o,await fetch(i,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function Md(i=Ui()){const e=Un(i,"auth");if(e.isInitialized())return e.getImmediate();const t=Zh(i,{popupRedirectResolver:vu,persistence:[Pl,yl,Lo]}),r=to("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(r,location.origin);if(location.origin===c.origin){const h=Su(c.toString());gl(t,h,()=>h(t.currentUser)),pl(t,u=>h(u))}}const o=Zs("auth");return o&&el(t,`http://${o}`),t}function bu(){var i,e;return(e=(i=document.getElementsByTagName("head"))===null||i===void 0?void 0:i[0])!==null&&e!==void 0?e:document}Wh({loadJS(i){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",i),r.onload=e,r.onerror=o=>{const c=ge("internal-error");c.customData=o,t(c)},r.type="text/javascript",r.charset="UTF-8",bu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Eu("Browser");var bs=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var zi;(function(){var i;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(y,d){function p(){}p.prototype=d.prototype,y.D=d.prototype,y.prototype=new p,y.prototype.constructor=y,y.C=function(m,_,I){for(var f=Array(arguments.length-2),we=2;we<arguments.length;we++)f[we-2]=arguments[we];return d.prototype[_].apply(m,f)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,t),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(y,d,p){p||(p=0);var m=Array(16);if(typeof d=="string")for(var _=0;16>_;++_)m[_]=d.charCodeAt(p++)|d.charCodeAt(p++)<<8|d.charCodeAt(p++)<<16|d.charCodeAt(p++)<<24;else for(_=0;16>_;++_)m[_]=d[p++]|d[p++]<<8|d[p++]<<16|d[p++]<<24;d=y.g[0],p=y.g[1],_=y.g[2];var I=y.g[3],f=d+(I^p&(_^I))+m[0]+3614090360&4294967295;d=p+(f<<7&4294967295|f>>>25),f=I+(_^d&(p^_))+m[1]+3905402710&4294967295,I=d+(f<<12&4294967295|f>>>20),f=_+(p^I&(d^p))+m[2]+606105819&4294967295,_=I+(f<<17&4294967295|f>>>15),f=p+(d^_&(I^d))+m[3]+3250441966&4294967295,p=_+(f<<22&4294967295|f>>>10),f=d+(I^p&(_^I))+m[4]+4118548399&4294967295,d=p+(f<<7&4294967295|f>>>25),f=I+(_^d&(p^_))+m[5]+1200080426&4294967295,I=d+(f<<12&4294967295|f>>>20),f=_+(p^I&(d^p))+m[6]+2821735955&4294967295,_=I+(f<<17&4294967295|f>>>15),f=p+(d^_&(I^d))+m[7]+4249261313&4294967295,p=_+(f<<22&4294967295|f>>>10),f=d+(I^p&(_^I))+m[8]+1770035416&4294967295,d=p+(f<<7&4294967295|f>>>25),f=I+(_^d&(p^_))+m[9]+2336552879&4294967295,I=d+(f<<12&4294967295|f>>>20),f=_+(p^I&(d^p))+m[10]+4294925233&4294967295,_=I+(f<<17&4294967295|f>>>15),f=p+(d^_&(I^d))+m[11]+2304563134&4294967295,p=_+(f<<22&4294967295|f>>>10),f=d+(I^p&(_^I))+m[12]+1804603682&4294967295,d=p+(f<<7&4294967295|f>>>25),f=I+(_^d&(p^_))+m[13]+4254626195&4294967295,I=d+(f<<12&4294967295|f>>>20),f=_+(p^I&(d^p))+m[14]+2792965006&4294967295,_=I+(f<<17&4294967295|f>>>15),f=p+(d^_&(I^d))+m[15]+1236535329&4294967295,p=_+(f<<22&4294967295|f>>>10),f=d+(_^I&(p^_))+m[1]+4129170786&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^_&(d^p))+m[6]+3225465664&4294967295,I=d+(f<<9&4294967295|f>>>23),f=_+(d^p&(I^d))+m[11]+643717713&4294967295,_=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(_^I))+m[0]+3921069994&4294967295,p=_+(f<<20&4294967295|f>>>12),f=d+(_^I&(p^_))+m[5]+3593408605&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^_&(d^p))+m[10]+38016083&4294967295,I=d+(f<<9&4294967295|f>>>23),f=_+(d^p&(I^d))+m[15]+3634488961&4294967295,_=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(_^I))+m[4]+3889429448&4294967295,p=_+(f<<20&4294967295|f>>>12),f=d+(_^I&(p^_))+m[9]+568446438&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^_&(d^p))+m[14]+3275163606&4294967295,I=d+(f<<9&4294967295|f>>>23),f=_+(d^p&(I^d))+m[3]+4107603335&4294967295,_=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(_^I))+m[8]+1163531501&4294967295,p=_+(f<<20&4294967295|f>>>12),f=d+(_^I&(p^_))+m[13]+2850285829&4294967295,d=p+(f<<5&4294967295|f>>>27),f=I+(p^_&(d^p))+m[2]+4243563512&4294967295,I=d+(f<<9&4294967295|f>>>23),f=_+(d^p&(I^d))+m[7]+1735328473&4294967295,_=I+(f<<14&4294967295|f>>>18),f=p+(I^d&(_^I))+m[12]+2368359562&4294967295,p=_+(f<<20&4294967295|f>>>12),f=d+(p^_^I)+m[5]+4294588738&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^_)+m[8]+2272392833&4294967295,I=d+(f<<11&4294967295|f>>>21),f=_+(I^d^p)+m[11]+1839030562&4294967295,_=I+(f<<16&4294967295|f>>>16),f=p+(_^I^d)+m[14]+4259657740&4294967295,p=_+(f<<23&4294967295|f>>>9),f=d+(p^_^I)+m[1]+2763975236&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^_)+m[4]+1272893353&4294967295,I=d+(f<<11&4294967295|f>>>21),f=_+(I^d^p)+m[7]+4139469664&4294967295,_=I+(f<<16&4294967295|f>>>16),f=p+(_^I^d)+m[10]+3200236656&4294967295,p=_+(f<<23&4294967295|f>>>9),f=d+(p^_^I)+m[13]+681279174&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^_)+m[0]+3936430074&4294967295,I=d+(f<<11&4294967295|f>>>21),f=_+(I^d^p)+m[3]+3572445317&4294967295,_=I+(f<<16&4294967295|f>>>16),f=p+(_^I^d)+m[6]+76029189&4294967295,p=_+(f<<23&4294967295|f>>>9),f=d+(p^_^I)+m[9]+3654602809&4294967295,d=p+(f<<4&4294967295|f>>>28),f=I+(d^p^_)+m[12]+3873151461&4294967295,I=d+(f<<11&4294967295|f>>>21),f=_+(I^d^p)+m[15]+530742520&4294967295,_=I+(f<<16&4294967295|f>>>16),f=p+(_^I^d)+m[2]+3299628645&4294967295,p=_+(f<<23&4294967295|f>>>9),f=d+(_^(p|~I))+m[0]+4096336452&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~_))+m[7]+1126891415&4294967295,I=d+(f<<10&4294967295|f>>>22),f=_+(d^(I|~p))+m[14]+2878612391&4294967295,_=I+(f<<15&4294967295|f>>>17),f=p+(I^(_|~d))+m[5]+4237533241&4294967295,p=_+(f<<21&4294967295|f>>>11),f=d+(_^(p|~I))+m[12]+1700485571&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~_))+m[3]+2399980690&4294967295,I=d+(f<<10&4294967295|f>>>22),f=_+(d^(I|~p))+m[10]+4293915773&4294967295,_=I+(f<<15&4294967295|f>>>17),f=p+(I^(_|~d))+m[1]+2240044497&4294967295,p=_+(f<<21&4294967295|f>>>11),f=d+(_^(p|~I))+m[8]+1873313359&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~_))+m[15]+4264355552&4294967295,I=d+(f<<10&4294967295|f>>>22),f=_+(d^(I|~p))+m[6]+2734768916&4294967295,_=I+(f<<15&4294967295|f>>>17),f=p+(I^(_|~d))+m[13]+1309151649&4294967295,p=_+(f<<21&4294967295|f>>>11),f=d+(_^(p|~I))+m[4]+4149444226&4294967295,d=p+(f<<6&4294967295|f>>>26),f=I+(p^(d|~_))+m[11]+3174756917&4294967295,I=d+(f<<10&4294967295|f>>>22),f=_+(d^(I|~p))+m[2]+718787259&4294967295,_=I+(f<<15&4294967295|f>>>17),f=p+(I^(_|~d))+m[9]+3951481745&4294967295,y.g[0]=y.g[0]+d&4294967295,y.g[1]=y.g[1]+(_+(f<<21&4294967295|f>>>11))&4294967295,y.g[2]=y.g[2]+_&4294967295,y.g[3]=y.g[3]+I&4294967295}r.prototype.u=function(y,d){d===void 0&&(d=y.length);for(var p=d-this.blockSize,m=this.B,_=this.h,I=0;I<d;){if(_==0)for(;I<=p;)o(this,y,I),I+=this.blockSize;if(typeof y=="string"){for(;I<d;)if(m[_++]=y.charCodeAt(I++),_==this.blockSize){o(this,m),_=0;break}}else for(;I<d;)if(m[_++]=y[I++],_==this.blockSize){o(this,m),_=0;break}}this.h=_,this.o+=d},r.prototype.v=function(){var y=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);y[0]=128;for(var d=1;d<y.length-8;++d)y[d]=0;var p=8*this.o;for(d=y.length-8;d<y.length;++d)y[d]=p&255,p/=256;for(this.u(y),y=Array(16),d=p=0;4>d;++d)for(var m=0;32>m;m+=8)y[p++]=this.g[d]>>>m&255;return y};function c(y,d){var p=u;return Object.prototype.hasOwnProperty.call(p,y)?p[y]:p[y]=d(y)}function h(y,d){this.h=d;for(var p=[],m=!0,_=y.length-1;0<=_;_--){var I=y[_]|0;m&&I==d||(p[_]=I,m=!1)}this.g=p}var u={};function g(y){return-128<=y&&128>y?c(y,function(d){return new h([d|0],0>d?-1:0)}):new h([y|0],0>y?-1:0)}function E(y){if(isNaN(y)||!isFinite(y))return b;if(0>y)return k(E(-y));for(var d=[],p=1,m=0;y>=p;m++)d[m]=y/p|0,p*=4294967296;return new h(d,0)}function S(y,d){if(y.length==0)throw Error("number format error: empty string");if(d=d||10,2>d||36<d)throw Error("radix out of range: "+d);if(y.charAt(0)=="-")return k(S(y.substring(1),d));if(0<=y.indexOf("-"))throw Error('number format error: interior "-" character');for(var p=E(Math.pow(d,8)),m=b,_=0;_<y.length;_+=8){var I=Math.min(8,y.length-_),f=parseInt(y.substring(_,_+I),d);8>I?(I=E(Math.pow(d,I)),m=m.j(I).add(E(f))):(m=m.j(p),m=m.add(E(f)))}return m}var b=g(0),T=g(1),L=g(16777216);i=h.prototype,i.m=function(){if(U(this))return-k(this).m();for(var y=0,d=1,p=0;p<this.g.length;p++){var m=this.i(p);y+=(0<=m?m:4294967296+m)*d,d*=4294967296}return y},i.toString=function(y){if(y=y||10,2>y||36<y)throw Error("radix out of range: "+y);if(C(this))return"0";if(U(this))return"-"+k(this).toString(y);for(var d=E(Math.pow(y,6)),p=this,m="";;){var _=V(p,d).g;p=G(p,_.j(d));var I=((0<p.g.length?p.g[0]:p.h)>>>0).toString(y);if(p=_,C(p))return I+m;for(;6>I.length;)I="0"+I;m=I+m}},i.i=function(y){return 0>y?0:y<this.g.length?this.g[y]:this.h};function C(y){if(y.h!=0)return!1;for(var d=0;d<y.g.length;d++)if(y.g[d]!=0)return!1;return!0}function U(y){return y.h==-1}i.l=function(y){return y=G(this,y),U(y)?-1:C(y)?0:1};function k(y){for(var d=y.g.length,p=[],m=0;m<d;m++)p[m]=~y.g[m];return new h(p,~y.h).add(T)}i.abs=function(){return U(this)?k(this):this},i.add=function(y){for(var d=Math.max(this.g.length,y.g.length),p=[],m=0,_=0;_<=d;_++){var I=m+(this.i(_)&65535)+(y.i(_)&65535),f=(I>>>16)+(this.i(_)>>>16)+(y.i(_)>>>16);m=f>>>16,I&=65535,f&=65535,p[_]=f<<16|I}return new h(p,p[p.length-1]&-2147483648?-1:0)};function G(y,d){return y.add(k(d))}i.j=function(y){if(C(this)||C(y))return b;if(U(this))return U(y)?k(this).j(k(y)):k(k(this).j(y));if(U(y))return k(this.j(k(y)));if(0>this.l(L)&&0>y.l(L))return E(this.m()*y.m());for(var d=this.g.length+y.g.length,p=[],m=0;m<2*d;m++)p[m]=0;for(m=0;m<this.g.length;m++)for(var _=0;_<y.g.length;_++){var I=this.i(m)>>>16,f=this.i(m)&65535,we=y.i(_)>>>16,yt=y.i(_)&65535;p[2*m+2*_]+=f*yt,H(p,2*m+2*_),p[2*m+2*_+1]+=I*yt,H(p,2*m+2*_+1),p[2*m+2*_+1]+=f*we,H(p,2*m+2*_+1),p[2*m+2*_+2]+=I*we,H(p,2*m+2*_+2)}for(m=0;m<d;m++)p[m]=p[2*m+1]<<16|p[2*m];for(m=d;m<2*d;m++)p[m]=0;return new h(p,0)};function H(y,d){for(;(y[d]&65535)!=y[d];)y[d+1]+=y[d]>>>16,y[d]&=65535,d++}function x(y,d){this.g=y,this.h=d}function V(y,d){if(C(d))throw Error("division by zero");if(C(y))return new x(b,b);if(U(y))return d=V(k(y),d),new x(k(d.g),k(d.h));if(U(d))return d=V(y,k(d)),new x(k(d.g),d.h);if(30<y.g.length){if(U(y)||U(d))throw Error("slowDivide_ only works with positive integers.");for(var p=T,m=d;0>=m.l(y);)p=te(p),m=te(m);var _=W(p,1),I=W(m,1);for(m=W(m,2),p=W(p,2);!C(m);){var f=I.add(m);0>=f.l(y)&&(_=_.add(p),I=f),m=W(m,1),p=W(p,1)}return d=G(y,_.j(d)),new x(_,d)}for(_=b;0<=y.l(d);){for(p=Math.max(1,Math.floor(y.m()/d.m())),m=Math.ceil(Math.log(p)/Math.LN2),m=48>=m?1:Math.pow(2,m-48),I=E(p),f=I.j(d);U(f)||0<f.l(y);)p-=m,I=E(p),f=I.j(d);C(I)&&(I=T),_=_.add(I),y=G(y,f)}return new x(_,y)}i.A=function(y){return V(this,y).h},i.and=function(y){for(var d=Math.max(this.g.length,y.g.length),p=[],m=0;m<d;m++)p[m]=this.i(m)&y.i(m);return new h(p,this.h&y.h)},i.or=function(y){for(var d=Math.max(this.g.length,y.g.length),p=[],m=0;m<d;m++)p[m]=this.i(m)|y.i(m);return new h(p,this.h|y.h)},i.xor=function(y){for(var d=Math.max(this.g.length,y.g.length),p=[],m=0;m<d;m++)p[m]=this.i(m)^y.i(m);return new h(p,this.h^y.h)};function te(y){for(var d=y.g.length+1,p=[],m=0;m<d;m++)p[m]=y.i(m)<<1|y.i(m-1)>>>31;return new h(p,y.h)}function W(y,d){var p=d>>5;d%=32;for(var m=y.g.length-p,_=[],I=0;I<m;I++)_[I]=0<d?y.i(I+p)>>>d|y.i(I+p+1)<<32-d:y.i(I+p);return new h(_,y.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=E,h.fromString=S,zi=h}).apply(typeof bs<"u"?bs:typeof self<"u"?self:typeof window<"u"?window:{});var _n=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var i,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(n,s,a){return n==Array.prototype||n==Object.prototype||(n[s]=a.value),n};function t(n){n=[typeof globalThis=="object"&&globalThis,n,typeof window=="object"&&window,typeof self=="object"&&self,typeof _n=="object"&&_n];for(var s=0;s<n.length;++s){var a=n[s];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=t(this);function o(n,s){if(s)e:{var a=r;n=n.split(".");for(var l=0;l<n.length-1;l++){var v=n[l];if(!(v in a))break e;a=a[v]}n=n[n.length-1],l=a[n],s=s(l),s!=l&&s!=null&&e(a,n,{configurable:!0,writable:!0,value:s})}}function c(n,s){n instanceof String&&(n+="");var a=0,l=!1,v={next:function(){if(!l&&a<n.length){var w=a++;return{value:s(w,n[w]),done:!1}}return l=!0,{done:!0,value:void 0}}};return v[Symbol.iterator]=function(){return v},v}o("Array.prototype.values",function(n){return n||function(){return c(this,function(s,a){return a})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},u=this||self;function g(n){var s=typeof n;return s=s!="object"?s:n?Array.isArray(n)?"array":s:"null",s=="array"||s=="object"&&typeof n.length=="number"}function E(n){var s=typeof n;return s=="object"&&n!=null||s=="function"}function S(n,s,a){return n.call.apply(n.bind,arguments)}function b(n,s,a){if(!n)throw Error();if(2<arguments.length){var l=Array.prototype.slice.call(arguments,2);return function(){var v=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(v,l),n.apply(s,v)}}return function(){return n.apply(s,arguments)}}function T(n,s,a){return T=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?S:b,T.apply(null,arguments)}function L(n,s){var a=Array.prototype.slice.call(arguments,1);return function(){var l=a.slice();return l.push.apply(l,arguments),n.apply(this,l)}}function C(n,s){function a(){}a.prototype=s.prototype,n.aa=s.prototype,n.prototype=new a,n.prototype.constructor=n,n.Qb=function(l,v,w){for(var A=Array(arguments.length-2),F=2;F<arguments.length;F++)A[F-2]=arguments[F];return s.prototype[v].apply(l,A)}}function U(n){const s=n.length;if(0<s){const a=Array(s);for(let l=0;l<s;l++)a[l]=n[l];return a}return[]}function k(n,s){for(let a=1;a<arguments.length;a++){const l=arguments[a];if(g(l)){const v=n.length||0,w=l.length||0;n.length=v+w;for(let A=0;A<w;A++)n[v+A]=l[A]}else n.push(l)}}class G{constructor(s,a){this.i=s,this.j=a,this.h=0,this.g=null}get(){let s;return 0<this.h?(this.h--,s=this.g,this.g=s.next,s.next=null):s=this.i(),s}}function H(n){return/^[\s\xa0]*$/.test(n)}function x(){var n=u.navigator;return n&&(n=n.userAgent)?n:""}function V(n){return V[" "](n),n}V[" "]=function(){};var te=x().indexOf("Gecko")!=-1&&!(x().toLowerCase().indexOf("webkit")!=-1&&x().indexOf("Edge")==-1)&&!(x().indexOf("Trident")!=-1||x().indexOf("MSIE")!=-1)&&x().indexOf("Edge")==-1;function W(n,s,a){for(const l in n)s.call(a,n[l],l,n)}function y(n,s){for(const a in n)s.call(void 0,n[a],a,n)}function d(n){const s={};for(const a in n)s[a]=n[a];return s}const p="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function m(n,s){let a,l;for(let v=1;v<arguments.length;v++){l=arguments[v];for(a in l)n[a]=l[a];for(let w=0;w<p.length;w++)a=p[w],Object.prototype.hasOwnProperty.call(l,a)&&(n[a]=l[a])}}function _(n){var s=1;n=n.split(":");const a=[];for(;0<s&&n.length;)a.push(n.shift()),s--;return n.length&&a.push(n.join(":")),a}function I(n){u.setTimeout(()=>{throw n},0)}function f(){var n=Bn;let s=null;return n.g&&(s=n.g,n.g=n.g.next,n.g||(n.h=null),s.next=null),s}class we{constructor(){this.h=this.g=null}add(s,a){const l=yt.get();l.set(s,a),this.h?this.h.next=l:this.g=l,this.h=l}}var yt=new G(()=>new Zo,n=>n.reset());class Zo{constructor(){this.next=this.g=this.h=null}set(s,a){this.h=s,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let vt,It=!1,Bn=new we,Yi=()=>{const n=u.Promise.resolve(void 0);vt=()=>{n.then(Qo)}};var Qo=()=>{for(var n;n=f();){try{n.h.call(n.g)}catch(a){I(a)}var s=yt;s.j(n),100>s.h&&(s.h++,n.next=s.g,s.g=n)}It=!1};function ke(){this.s=this.s,this.C=this.C}ke.prototype.s=!1,ke.prototype.ma=function(){this.s||(this.s=!0,this.N())},ke.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function q(n,s){this.type=n,this.g=this.target=s,this.defaultPrevented=!1}q.prototype.h=function(){this.defaultPrevented=!0};var ea=(function(){if(!u.addEventListener||!Object.defineProperty)return!1;var n=!1,s=Object.defineProperty({},"passive",{get:function(){n=!0}});try{const a=()=>{};u.addEventListener("test",a,s),u.removeEventListener("test",a,s)}catch{}return n})();function wt(n,s){if(q.call(this,n?n.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,n){var a=this.type=n.type,l=n.changedTouches&&n.changedTouches.length?n.changedTouches[0]:null;if(this.target=n.target||n.srcElement,this.g=s,s=n.relatedTarget){if(te){e:{try{V(s.nodeName);var v=!0;break e}catch{}v=!1}v||(s=null)}}else a=="mouseover"?s=n.fromElement:a=="mouseout"&&(s=n.toElement);this.relatedTarget=s,l?(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=n.clientX!==void 0?n.clientX:n.pageX,this.clientY=n.clientY!==void 0?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0),this.button=n.button,this.key=n.key||"",this.ctrlKey=n.ctrlKey,this.altKey=n.altKey,this.shiftKey=n.shiftKey,this.metaKey=n.metaKey,this.pointerId=n.pointerId||0,this.pointerType=typeof n.pointerType=="string"?n.pointerType:ta[n.pointerType]||"",this.state=n.state,this.i=n,n.defaultPrevented&&wt.aa.h.call(this)}}C(wt,q);var ta={2:"touch",3:"pen",4:"mouse"};wt.prototype.h=function(){wt.aa.h.call(this);var n=this.i;n.preventDefault?n.preventDefault():n.returnValue=!1};var Qt="closure_listenable_"+(1e6*Math.random()|0),na=0;function ia(n,s,a,l,v){this.listener=n,this.proxy=null,this.src=s,this.type=a,this.capture=!!l,this.ha=v,this.key=++na,this.da=this.fa=!1}function en(n){n.da=!0,n.listener=null,n.proxy=null,n.src=null,n.ha=null}function tn(n){this.src=n,this.g={},this.h=0}tn.prototype.add=function(n,s,a,l,v){var w=n.toString();n=this.g[w],n||(n=this.g[w]=[],this.h++);var A=$n(n,s,l,v);return-1<A?(s=n[A],a||(s.fa=!1)):(s=new ia(s,this.src,w,!!l,v),s.fa=a,n.push(s)),s};function Hn(n,s){var a=s.type;if(a in n.g){var l=n.g[a],v=Array.prototype.indexOf.call(l,s,void 0),w;(w=0<=v)&&Array.prototype.splice.call(l,v,1),w&&(en(s),n.g[a].length==0&&(delete n.g[a],n.h--))}}function $n(n,s,a,l){for(var v=0;v<n.length;++v){var w=n[v];if(!w.da&&w.listener==s&&w.capture==!!a&&w.ha==l)return v}return-1}var Wn="closure_lm_"+(1e6*Math.random()|0),Gn={};function Zi(n,s,a,l,v){if(Array.isArray(s)){for(var w=0;w<s.length;w++)Zi(n,s[w],a,l,v);return null}return a=tr(a),n&&n[Qt]?n.K(s,a,E(l)?!!l.capture:!1,v):ra(n,s,a,!1,l,v)}function ra(n,s,a,l,v,w){if(!s)throw Error("Invalid event type");var A=E(v)?!!v.capture:!!v,F=qn(n);if(F||(n[Wn]=F=new tn(n)),a=F.add(s,a,l,A,w),a.proxy)return a;if(l=sa(),a.proxy=l,l.src=n,l.listener=a,n.addEventListener)ea||(v=A),v===void 0&&(v=!1),n.addEventListener(s.toString(),l,v);else if(n.attachEvent)n.attachEvent(er(s.toString()),l);else if(n.addListener&&n.removeListener)n.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return a}function sa(){function n(a){return s.call(n.src,n.listener,a)}const s=oa;return n}function Qi(n,s,a,l,v){if(Array.isArray(s))for(var w=0;w<s.length;w++)Qi(n,s[w],a,l,v);else l=E(l)?!!l.capture:!!l,a=tr(a),n&&n[Qt]?(n=n.i,s=String(s).toString(),s in n.g&&(w=n.g[s],a=$n(w,a,l,v),-1<a&&(en(w[a]),Array.prototype.splice.call(w,a,1),w.length==0&&(delete n.g[s],n.h--)))):n&&(n=qn(n))&&(s=n.g[s.toString()],n=-1,s&&(n=$n(s,a,l,v)),(a=-1<n?s[n]:null)&&zn(a))}function zn(n){if(typeof n!="number"&&n&&!n.da){var s=n.src;if(s&&s[Qt])Hn(s.i,n);else{var a=n.type,l=n.proxy;s.removeEventListener?s.removeEventListener(a,l,n.capture):s.detachEvent?s.detachEvent(er(a),l):s.addListener&&s.removeListener&&s.removeListener(l),(a=qn(s))?(Hn(a,n),a.h==0&&(a.src=null,s[Wn]=null)):en(n)}}}function er(n){return n in Gn?Gn[n]:Gn[n]="on"+n}function oa(n,s){if(n.da)n=!0;else{s=new wt(s,this);var a=n.listener,l=n.ha||n.src;n.fa&&zn(n),n=a.call(l,s)}return n}function qn(n){return n=n[Wn],n instanceof tn?n:null}var Kn="__closure_events_fn_"+(1e9*Math.random()>>>0);function tr(n){return typeof n=="function"?n:(n[Kn]||(n[Kn]=function(s){return n.handleEvent(s)}),n[Kn])}function K(){ke.call(this),this.i=new tn(this),this.M=this,this.F=null}C(K,ke),K.prototype[Qt]=!0,K.prototype.removeEventListener=function(n,s,a,l){Qi(this,n,s,a,l)};function Y(n,s){var a,l=n.F;if(l)for(a=[];l;l=l.F)a.push(l);if(n=n.M,l=s.type||s,typeof s=="string")s=new q(s,n);else if(s instanceof q)s.target=s.target||n;else{var v=s;s=new q(l,n),m(s,v)}if(v=!0,a)for(var w=a.length-1;0<=w;w--){var A=s.g=a[w];v=nn(A,l,!0,s)&&v}if(A=s.g=n,v=nn(A,l,!0,s)&&v,v=nn(A,l,!1,s)&&v,a)for(w=0;w<a.length;w++)A=s.g=a[w],v=nn(A,l,!1,s)&&v}K.prototype.N=function(){if(K.aa.N.call(this),this.i){var n=this.i,s;for(s in n.g){for(var a=n.g[s],l=0;l<a.length;l++)en(a[l]);delete n.g[s],n.h--}}this.F=null},K.prototype.K=function(n,s,a,l){return this.i.add(String(n),s,!1,a,l)},K.prototype.L=function(n,s,a,l){return this.i.add(String(n),s,!0,a,l)};function nn(n,s,a,l){if(s=n.i.g[String(s)],!s)return!0;s=s.concat();for(var v=!0,w=0;w<s.length;++w){var A=s[w];if(A&&!A.da&&A.capture==a){var F=A.listener,z=A.ha||A.src;A.fa&&Hn(n.i,A),v=F.call(z,l)!==!1&&v}}return v&&!l.defaultPrevented}function nr(n,s,a){if(typeof n=="function")a&&(n=T(n,a));else if(n&&typeof n.handleEvent=="function")n=T(n.handleEvent,n);else throw Error("Invalid listener argument");return 2147483647<Number(s)?-1:u.setTimeout(n,s||0)}function ir(n){n.g=nr(()=>{n.g=null,n.i&&(n.i=!1,ir(n))},n.l);const s=n.h;n.h=null,n.m.apply(null,s)}class aa extends ke{constructor(s,a){super(),this.m=s,this.l=a,this.h=null,this.i=!1,this.g=null}j(s){this.h=arguments,this.g?this.i=!0:ir(this)}N(){super.N(),this.g&&(u.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Et(n){ke.call(this),this.h=n,this.g={}}C(Et,ke);var rr=[];function sr(n){W(n.g,function(s,a){this.g.hasOwnProperty(a)&&zn(s)},n),n.g={}}Et.prototype.N=function(){Et.aa.N.call(this),sr(this)},Et.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Jn=u.JSON.stringify,ca=u.JSON.parse,ha=class{stringify(n){return u.JSON.stringify(n,void 0)}parse(n){return u.JSON.parse(n,void 0)}};function Xn(){}Xn.prototype.h=null;function or(n){return n.h||(n.h=n.i())}function la(){}var Tt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Yn(){q.call(this,"d")}C(Yn,q);function Zn(){q.call(this,"c")}C(Zn,q);var it={},ar=null;function Qn(){return ar=ar||new K}it.La="serverreachability";function cr(n){q.call(this,it.La,n)}C(cr,q);function At(n){const s=Qn();Y(s,new cr(s))}it.STAT_EVENT="statevent";function hr(n,s){q.call(this,it.STAT_EVENT,n),this.stat=s}C(hr,q);function Z(n){const s=Qn();Y(s,new hr(s,n))}it.Ma="timingevent";function lr(n,s){q.call(this,it.Ma,n),this.size=s}C(lr,q);function St(n,s){if(typeof n!="function")throw Error("Fn must not be null and must be a function");return u.setTimeout(function(){n()},s)}function bt(){this.g=!0}bt.prototype.xa=function(){this.g=!1};function ua(n,s,a,l,v,w){n.info(function(){if(n.g)if(w)for(var A="",F=w.split("&"),z=0;z<F.length;z++){var D=F[z].split("=");if(1<D.length){var J=D[0];D=D[1];var X=J.split("_");A=2<=X.length&&X[1]=="type"?A+(J+"="+D+"&"):A+(J+"=redacted&")}}else A=null;else A=w;return"XMLHTTP REQ ("+l+") [attempt "+v+"]: "+s+`
`+a+`
`+A})}function da(n,s,a,l,v,w,A){n.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+v+"]: "+s+`
`+a+`
`+w+" "+A})}function rt(n,s,a,l){n.info(function(){return"XMLHTTP TEXT ("+s+"): "+pa(n,a)+(l?" "+l:"")})}function fa(n,s){n.info(function(){return"TIMEOUT: "+s})}bt.prototype.info=function(){};function pa(n,s){if(!n.g)return s;if(!s)return null;try{var a=JSON.parse(s);if(a){for(n=0;n<a.length;n++)if(Array.isArray(a[n])){var l=a[n];if(!(2>l.length)){var v=l[1];if(Array.isArray(v)&&!(1>v.length)){var w=v[0];if(w!="noop"&&w!="stop"&&w!="close")for(var A=1;A<v.length;A++)v[A]=""}}}}return Jn(a)}catch{return s}}var ei={NO_ERROR:0,TIMEOUT:8},ga={},ti;function rn(){}C(rn,Xn),rn.prototype.g=function(){return new XMLHttpRequest},rn.prototype.i=function(){return{}},ti=new rn;function Pe(n,s,a,l){this.j=n,this.i=s,this.l=a,this.R=l||1,this.U=new Et(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ur}function ur(){this.i=null,this.g="",this.h=!1}var dr={},ni={};function ii(n,s,a){n.L=1,n.v=cn(Ee(s)),n.m=a,n.P=!0,fr(n,null)}function fr(n,s){n.F=Date.now(),sn(n),n.A=Ee(n.v);var a=n.A,l=n.R;Array.isArray(l)||(l=[String(l)]),Rr(a.i,"t",l),n.C=0,a=n.j.J,n.h=new ur,n.g=Gr(n.j,a?s:null,!n.m),0<n.O&&(n.M=new aa(T(n.Y,n,n.g),n.O)),s=n.U,a=n.g,l=n.ca;var v="readystatechange";Array.isArray(v)||(v&&(rr[0]=v.toString()),v=rr);for(var w=0;w<v.length;w++){var A=Zi(a,v[w],l||s.handleEvent,!1,s.h||s);if(!A)break;s.g[A.key]=A}s=n.H?d(n.H):{},n.m?(n.u||(n.u="POST"),s["Content-Type"]="application/x-www-form-urlencoded",n.g.ea(n.A,n.u,n.m,s)):(n.u="GET",n.g.ea(n.A,n.u,null,s)),At(),ua(n.i,n.u,n.A,n.l,n.R,n.m)}Pe.prototype.ca=function(n){n=n.target;const s=this.M;s&&Te(n)==3?s.j():this.Y(n)},Pe.prototype.Y=function(n){try{if(n==this.g)e:{const X=Te(this.g);var s=this.g.Ba();const at=this.g.Z();if(!(3>X)&&(X!=3||this.g&&(this.h.h||this.g.oa()||Lr(this.g)))){this.J||X!=4||s==7||(s==8||0>=at?At(3):At(2)),ri(this);var a=this.g.Z();this.X=a;t:if(pr(this)){var l=Lr(this.g);n="";var v=l.length,w=Te(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){$e(this),Rt(this);var A="";break t}this.h.i=new u.TextDecoder}for(s=0;s<v;s++)this.h.h=!0,n+=this.h.i.decode(l[s],{stream:!(w&&s==v-1)});l.length=0,this.h.g+=n,this.C=0,A=this.h.g}else A=this.g.oa();if(this.o=a==200,da(this.i,this.u,this.A,this.l,this.R,X,a),this.o){if(this.T&&!this.K){t:{if(this.g){var F,z=this.g;if((F=z.g?z.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!H(F)){var D=F;break t}}D=null}if(a=D)rt(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,si(this,a);else{this.o=!1,this.s=3,Z(12),$e(this),Rt(this);break e}}if(this.P){a=!0;let re;for(;!this.J&&this.C<A.length;)if(re=ma(this,A),re==ni){X==4&&(this.s=4,Z(14),a=!1),rt(this.i,this.l,null,"[Incomplete Response]");break}else if(re==dr){this.s=4,Z(15),rt(this.i,this.l,A,"[Invalid Chunk]"),a=!1;break}else rt(this.i,this.l,re,null),si(this,re);if(pr(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),X!=4||A.length!=0||this.h.h||(this.s=1,Z(16),a=!1),this.o=this.o&&a,!a)rt(this.i,this.l,A,"[Invalid Chunked Response]"),$e(this),Rt(this);else if(0<A.length&&!this.W){this.W=!0;var J=this.j;J.g==this&&J.ba&&!J.M&&(J.j.info("Great, no buffering proxy detected. Bytes received: "+A.length),ui(J),J.M=!0,Z(11))}}else rt(this.i,this.l,A,null),si(this,A);X==4&&$e(this),this.o&&!this.J&&(X==4?Br(this.j,this):(this.o=!1,sn(this)))}else Da(this.g),a==400&&0<A.indexOf("Unknown SID")?(this.s=3,Z(12)):(this.s=0,Z(13)),$e(this),Rt(this)}}}catch{}finally{}};function pr(n){return n.g?n.u=="GET"&&n.L!=2&&n.j.Ca:!1}function ma(n,s){var a=n.C,l=s.indexOf(`
`,a);return l==-1?ni:(a=Number(s.substring(a,l)),isNaN(a)?dr:(l+=1,l+a>s.length?ni:(s=s.slice(l,l+a),n.C=l+a,s)))}Pe.prototype.cancel=function(){this.J=!0,$e(this)};function sn(n){n.S=Date.now()+n.I,gr(n,n.I)}function gr(n,s){if(n.B!=null)throw Error("WatchDog timer not null");n.B=St(T(n.ba,n),s)}function ri(n){n.B&&(u.clearTimeout(n.B),n.B=null)}Pe.prototype.ba=function(){this.B=null;const n=Date.now();0<=n-this.S?(fa(this.i,this.A),this.L!=2&&(At(),Z(17)),$e(this),this.s=2,Rt(this)):gr(this,this.S-n)};function Rt(n){n.j.G==0||n.J||Br(n.j,n)}function $e(n){ri(n);var s=n.M;s&&typeof s.ma=="function"&&s.ma(),n.M=null,sr(n.U),n.g&&(s=n.g,n.g=null,s.abort(),s.ma())}function si(n,s){try{var a=n.j;if(a.G!=0&&(a.g==n||oi(a.h,n))){if(!n.K&&oi(a.h,n)&&a.G==3){try{var l=a.Da.g.parse(s)}catch{l=null}if(Array.isArray(l)&&l.length==3){var v=l;if(v[0]==0){e:if(!a.u){if(a.g)if(a.g.F+3e3<n.F)pn(a),dn(a);else break e;li(a),Z(18)}}else a.za=v[1],0<a.za-a.T&&37500>v[2]&&a.F&&a.v==0&&!a.C&&(a.C=St(T(a.Za,a),6e3));if(1>=yr(a.h)&&a.ca){try{a.ca()}catch{}a.ca=void 0}}else Ge(a,11)}else if((n.K||a.g==n)&&pn(a),!H(s))for(v=a.Da.g.parse(s),s=0;s<v.length;s++){let D=v[s];if(a.T=D[0],D=D[1],a.G==2)if(D[0]=="c"){a.K=D[1],a.ia=D[2];const J=D[3];J!=null&&(a.la=J,a.j.info("VER="+a.la));const X=D[4];X!=null&&(a.Aa=X,a.j.info("SVER="+a.Aa));const at=D[5];at!=null&&typeof at=="number"&&0<at&&(l=1.5*at,a.L=l,a.j.info("backChannelRequestTimeoutMs_="+l)),l=a;const re=n.g;if(re){const gn=re.g?re.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(gn){var w=l.h;w.g||gn.indexOf("spdy")==-1&&gn.indexOf("quic")==-1&&gn.indexOf("h2")==-1||(w.j=w.l,w.g=new Set,w.h&&(ai(w,w.h),w.h=null))}if(l.D){const di=re.g?re.g.getResponseHeader("X-HTTP-Session-Id"):null;di&&(l.ya=di,j(l.I,l.D,di))}}a.G=3,a.l&&a.l.ua(),a.ba&&(a.R=Date.now()-n.F,a.j.info("Handshake RTT: "+a.R+"ms")),l=a;var A=n;if(l.qa=Wr(l,l.J?l.ia:null,l.W),A.K){vr(l.h,A);var F=A,z=l.L;z&&(F.I=z),F.B&&(ri(F),sn(F)),l.g=A}else Vr(l);0<a.i.length&&fn(a)}else D[0]!="stop"&&D[0]!="close"||Ge(a,7);else a.G==3&&(D[0]=="stop"||D[0]=="close"?D[0]=="stop"?Ge(a,7):hi(a):D[0]!="noop"&&a.l&&a.l.ta(D),a.v=0)}}At(4)}catch{}}var _a=class{constructor(n,s){this.g=n,this.map=s}};function mr(n){this.l=n||10,u.PerformanceNavigationTiming?(n=u.performance.getEntriesByType("navigation"),n=0<n.length&&(n[0].nextHopProtocol=="hq"||n[0].nextHopProtocol=="h2")):n=!!(u.chrome&&u.chrome.loadTimes&&u.chrome.loadTimes()&&u.chrome.loadTimes().wasFetchedViaSpdy),this.j=n?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function _r(n){return n.h?!0:n.g?n.g.size>=n.j:!1}function yr(n){return n.h?1:n.g?n.g.size:0}function oi(n,s){return n.h?n.h==s:n.g?n.g.has(s):!1}function ai(n,s){n.g?n.g.add(s):n.h=s}function vr(n,s){n.h&&n.h==s?n.h=null:n.g&&n.g.has(s)&&n.g.delete(s)}mr.prototype.cancel=function(){if(this.i=Ir(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const n of this.g.values())n.cancel();this.g.clear()}};function Ir(n){if(n.h!=null)return n.i.concat(n.h.D);if(n.g!=null&&n.g.size!==0){let s=n.i;for(const a of n.g.values())s=s.concat(a.D);return s}return U(n.i)}function ya(n){if(n.V&&typeof n.V=="function")return n.V();if(typeof Map<"u"&&n instanceof Map||typeof Set<"u"&&n instanceof Set)return Array.from(n.values());if(typeof n=="string")return n.split("");if(g(n)){for(var s=[],a=n.length,l=0;l<a;l++)s.push(n[l]);return s}s=[],a=0;for(l in n)s[a++]=n[l];return s}function va(n){if(n.na&&typeof n.na=="function")return n.na();if(!n.V||typeof n.V!="function"){if(typeof Map<"u"&&n instanceof Map)return Array.from(n.keys());if(!(typeof Set<"u"&&n instanceof Set)){if(g(n)||typeof n=="string"){var s=[];n=n.length;for(var a=0;a<n;a++)s.push(a);return s}s=[],a=0;for(const l in n)s[a++]=l;return s}}}function wr(n,s){if(n.forEach&&typeof n.forEach=="function")n.forEach(s,void 0);else if(g(n)||typeof n=="string")Array.prototype.forEach.call(n,s,void 0);else for(var a=va(n),l=ya(n),v=l.length,w=0;w<v;w++)s.call(void 0,l[w],a&&a[w],n)}var Er=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ia(n,s){if(n){n=n.split("&");for(var a=0;a<n.length;a++){var l=n[a].indexOf("="),v=null;if(0<=l){var w=n[a].substring(0,l);v=n[a].substring(l+1)}else w=n[a];s(w,v?decodeURIComponent(v.replace(/\+/g," ")):"")}}}function We(n){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,n instanceof We){this.h=n.h,on(this,n.j),this.o=n.o,this.g=n.g,an(this,n.s),this.l=n.l;var s=n.i,a=new Pt;a.i=s.i,s.g&&(a.g=new Map(s.g),a.h=s.h),Tr(this,a),this.m=n.m}else n&&(s=String(n).match(Er))?(this.h=!1,on(this,s[1]||"",!0),this.o=Ct(s[2]||""),this.g=Ct(s[3]||"",!0),an(this,s[4]),this.l=Ct(s[5]||"",!0),Tr(this,s[6]||"",!0),this.m=Ct(s[7]||"")):(this.h=!1,this.i=new Pt(null,this.h))}We.prototype.toString=function(){var n=[],s=this.j;s&&n.push(kt(s,Ar,!0),":");var a=this.g;return(a||s=="file")&&(n.push("//"),(s=this.o)&&n.push(kt(s,Ar,!0),"@"),n.push(encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.s,a!=null&&n.push(":",String(a))),(a=this.l)&&(this.g&&a.charAt(0)!="/"&&n.push("/"),n.push(kt(a,a.charAt(0)=="/"?Ta:Ea,!0))),(a=this.i.toString())&&n.push("?",a),(a=this.m)&&n.push("#",kt(a,Sa)),n.join("")};function Ee(n){return new We(n)}function on(n,s,a){n.j=a?Ct(s,!0):s,n.j&&(n.j=n.j.replace(/:$/,""))}function an(n,s){if(s){if(s=Number(s),isNaN(s)||0>s)throw Error("Bad port number "+s);n.s=s}else n.s=null}function Tr(n,s,a){s instanceof Pt?(n.i=s,ba(n.i,n.h)):(a||(s=kt(s,Aa)),n.i=new Pt(s,n.h))}function j(n,s,a){n.i.set(s,a)}function cn(n){return j(n,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),n}function Ct(n,s){return n?s?decodeURI(n.replace(/%25/g,"%2525")):decodeURIComponent(n):""}function kt(n,s,a){return typeof n=="string"?(n=encodeURI(n).replace(s,wa),a&&(n=n.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),n):null}function wa(n){return n=n.charCodeAt(0),"%"+(n>>4&15).toString(16)+(n&15).toString(16)}var Ar=/[#\/\?@]/g,Ea=/[#\?:]/g,Ta=/[#\?]/g,Aa=/[#\?@]/g,Sa=/#/g;function Pt(n,s){this.h=this.g=null,this.i=n||null,this.j=!!s}function Oe(n){n.g||(n.g=new Map,n.h=0,n.i&&Ia(n.i,function(s,a){n.add(decodeURIComponent(s.replace(/\+/g," ")),a)}))}i=Pt.prototype,i.add=function(n,s){Oe(this),this.i=null,n=st(this,n);var a=this.g.get(n);return a||this.g.set(n,a=[]),a.push(s),this.h+=1,this};function Sr(n,s){Oe(n),s=st(n,s),n.g.has(s)&&(n.i=null,n.h-=n.g.get(s).length,n.g.delete(s))}function br(n,s){return Oe(n),s=st(n,s),n.g.has(s)}i.forEach=function(n,s){Oe(this),this.g.forEach(function(a,l){a.forEach(function(v){n.call(s,v,l,this)},this)},this)},i.na=function(){Oe(this);const n=Array.from(this.g.values()),s=Array.from(this.g.keys()),a=[];for(let l=0;l<s.length;l++){const v=n[l];for(let w=0;w<v.length;w++)a.push(s[l])}return a},i.V=function(n){Oe(this);let s=[];if(typeof n=="string")br(this,n)&&(s=s.concat(this.g.get(st(this,n))));else{n=Array.from(this.g.values());for(let a=0;a<n.length;a++)s=s.concat(n[a])}return s},i.set=function(n,s){return Oe(this),this.i=null,n=st(this,n),br(this,n)&&(this.h-=this.g.get(n).length),this.g.set(n,[s]),this.h+=1,this},i.get=function(n,s){return n?(n=this.V(n),0<n.length?String(n[0]):s):s};function Rr(n,s,a){Sr(n,s),0<a.length&&(n.i=null,n.g.set(st(n,s),U(a)),n.h+=a.length)}i.toString=function(){if(this.i)return this.i;if(!this.g)return"";const n=[],s=Array.from(this.g.keys());for(var a=0;a<s.length;a++){var l=s[a];const w=encodeURIComponent(String(l)),A=this.V(l);for(l=0;l<A.length;l++){var v=w;A[l]!==""&&(v+="="+encodeURIComponent(String(A[l]))),n.push(v)}}return this.i=n.join("&")};function st(n,s){return s=String(s),n.j&&(s=s.toLowerCase()),s}function ba(n,s){s&&!n.j&&(Oe(n),n.i=null,n.g.forEach(function(a,l){var v=l.toLowerCase();l!=v&&(Sr(this,l),Rr(this,v,a))},n)),n.j=s}function Ra(n,s){const a=new bt;if(u.Image){const l=new Image;l.onload=L(Ne,a,"TestLoadImage: loaded",!0,s,l),l.onerror=L(Ne,a,"TestLoadImage: error",!1,s,l),l.onabort=L(Ne,a,"TestLoadImage: abort",!1,s,l),l.ontimeout=L(Ne,a,"TestLoadImage: timeout",!1,s,l),u.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=n}else s(!1)}function Ca(n,s){const a=new bt,l=new AbortController,v=setTimeout(()=>{l.abort(),Ne(a,"TestPingServer: timeout",!1,s)},1e4);fetch(n,{signal:l.signal}).then(w=>{clearTimeout(v),w.ok?Ne(a,"TestPingServer: ok",!0,s):Ne(a,"TestPingServer: server error",!1,s)}).catch(()=>{clearTimeout(v),Ne(a,"TestPingServer: error",!1,s)})}function Ne(n,s,a,l,v){try{v&&(v.onload=null,v.onerror=null,v.onabort=null,v.ontimeout=null),l(a)}catch{}}function ka(){this.g=new ha}function Pa(n,s,a){const l=a||"";try{wr(n,function(v,w){let A=v;E(v)&&(A=Jn(v)),s.push(l+w+"="+encodeURIComponent(A))})}catch(v){throw s.push(l+"type="+encodeURIComponent("_badmap")),v}}function hn(n){this.l=n.Ub||null,this.j=n.eb||!1}C(hn,Xn),hn.prototype.g=function(){return new ln(this.l,this.j)},hn.prototype.i=(function(n){return function(){return n}})({});function ln(n,s){K.call(this),this.D=n,this.o=s,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(ln,K),i=ln.prototype,i.open=function(n,s){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=n,this.A=s,this.readyState=1,Nt(this)},i.send=function(n){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const s={headers:this.u,method:this.B,credentials:this.m,cache:void 0};n&&(s.body=n),(this.D||u).fetch(new Request(this.A,s)).then(this.Sa.bind(this),this.ga.bind(this))},i.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,Ot(this)),this.readyState=0},i.Sa=function(n){if(this.g&&(this.l=n,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=n.headers,this.readyState=2,Nt(this)),this.g&&(this.readyState=3,Nt(this),this.g)))if(this.responseType==="arraybuffer")n.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof u.ReadableStream<"u"&&"body"in n){if(this.j=n.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Cr(this)}else n.text().then(this.Ra.bind(this),this.ga.bind(this))};function Cr(n){n.j.read().then(n.Pa.bind(n)).catch(n.ga.bind(n))}i.Pa=function(n){if(this.g){if(this.o&&n.value)this.response.push(n.value);else if(!this.o){var s=n.value?n.value:new Uint8Array(0);(s=this.v.decode(s,{stream:!n.done}))&&(this.response=this.responseText+=s)}n.done?Ot(this):Nt(this),this.readyState==3&&Cr(this)}},i.Ra=function(n){this.g&&(this.response=this.responseText=n,Ot(this))},i.Qa=function(n){this.g&&(this.response=n,Ot(this))},i.ga=function(){this.g&&Ot(this)};function Ot(n){n.readyState=4,n.l=null,n.j=null,n.v=null,Nt(n)}i.setRequestHeader=function(n,s){this.u.append(n,s)},i.getResponseHeader=function(n){return this.h&&this.h.get(n.toLowerCase())||""},i.getAllResponseHeaders=function(){if(!this.h)return"";const n=[],s=this.h.entries();for(var a=s.next();!a.done;)a=a.value,n.push(a[0]+": "+a[1]),a=s.next();return n.join(`\r
`)};function Nt(n){n.onreadystatechange&&n.onreadystatechange.call(n)}Object.defineProperty(ln.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(n){this.m=n?"include":"same-origin"}});function kr(n){let s="";return W(n,function(a,l){s+=l,s+=":",s+=a,s+=`\r
`}),s}function ci(n,s,a){e:{for(l in a){var l=!1;break e}l=!0}l||(a=kr(a),typeof n=="string"?a!=null&&encodeURIComponent(String(a)):j(n,s,a))}function B(n){K.call(this),this.headers=new Map,this.o=n||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(B,K);var Oa=/^https?$/i,Na=["POST","PUT"];i=B.prototype,i.Ha=function(n){this.J=n},i.ea=function(n,s,a,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+n);s=s?s.toUpperCase():"GET",this.D=n,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():ti.g(),this.v=this.o?or(this.o):or(ti),this.g.onreadystatechange=T(this.Ea,this);try{this.B=!0,this.g.open(s,String(n),!0),this.B=!1}catch(w){Pr(this,w);return}if(n=a||"",a=new Map(this.headers),l)if(Object.getPrototypeOf(l)===Object.prototype)for(var v in l)a.set(v,l[v]);else if(typeof l.keys=="function"&&typeof l.get=="function")for(const w of l.keys())a.set(w,l.get(w));else throw Error("Unknown input type for opt_headers: "+String(l));l=Array.from(a.keys()).find(w=>w.toLowerCase()=="content-type"),v=u.FormData&&n instanceof u.FormData,!(0<=Array.prototype.indexOf.call(Na,s,void 0))||l||v||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[w,A]of a)this.g.setRequestHeader(w,A);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Dr(this),this.u=!0,this.g.send(n),this.u=!1}catch(w){Pr(this,w)}};function Pr(n,s){n.h=!1,n.g&&(n.j=!0,n.g.abort(),n.j=!1),n.l=s,n.m=5,Or(n),un(n)}function Or(n){n.A||(n.A=!0,Y(n,"complete"),Y(n,"error"))}i.abort=function(n){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=n||7,Y(this,"complete"),Y(this,"abort"),un(this))},i.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),un(this,!0)),B.aa.N.call(this)},i.Ea=function(){this.s||(this.B||this.u||this.j?Nr(this):this.bb())},i.bb=function(){Nr(this)};function Nr(n){if(n.h&&typeof h<"u"&&(!n.v[1]||Te(n)!=4||n.Z()!=2)){if(n.u&&Te(n)==4)nr(n.Ea,0,n);else if(Y(n,"readystatechange"),Te(n)==4){n.h=!1;try{const A=n.Z();e:switch(A){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var s=!0;break e;default:s=!1}var a;if(!(a=s)){var l;if(l=A===0){var v=String(n.D).match(Er)[1]||null;!v&&u.self&&u.self.location&&(v=u.self.location.protocol.slice(0,-1)),l=!Oa.test(v?v.toLowerCase():"")}a=l}if(a)Y(n,"complete"),Y(n,"success");else{n.m=6;try{var w=2<Te(n)?n.g.statusText:""}catch{w=""}n.l=w+" ["+n.Z()+"]",Or(n)}}finally{un(n)}}}}function un(n,s){if(n.g){Dr(n);const a=n.g,l=n.v[0]?()=>{}:null;n.g=null,n.v=null,s||Y(n,"ready");try{a.onreadystatechange=l}catch{}}}function Dr(n){n.I&&(u.clearTimeout(n.I),n.I=null)}i.isActive=function(){return!!this.g};function Te(n){return n.g?n.g.readyState:0}i.Z=function(){try{return 2<Te(this)?this.g.status:-1}catch{return-1}},i.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},i.Oa=function(n){if(this.g){var s=this.g.responseText;return n&&s.indexOf(n)==0&&(s=s.substring(n.length)),ca(s)}};function Lr(n){try{if(!n.g)return null;if("response"in n.g)return n.g.response;switch(n.H){case"":case"text":return n.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in n.g)return n.g.mozResponseArrayBuffer}return null}catch{return null}}function Da(n){const s={};n=(n.g&&2<=Te(n)&&n.g.getAllResponseHeaders()||"").split(`\r
`);for(let l=0;l<n.length;l++){if(H(n[l]))continue;var a=_(n[l]);const v=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const w=s[v]||[];s[v]=w,w.push(a)}y(s,function(l){return l.join(", ")})}i.Ba=function(){return this.m},i.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function Dt(n,s,a){return a&&a.internalChannelParams&&a.internalChannelParams[n]||s}function Mr(n){this.Aa=0,this.i=[],this.j=new bt,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Dt("failFast",!1,n),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Dt("baseRetryDelayMs",5e3,n),this.cb=Dt("retryDelaySeedMs",1e4,n),this.Wa=Dt("forwardChannelMaxRetries",2,n),this.wa=Dt("forwardChannelRequestTimeoutMs",2e4,n),this.pa=n&&n.xmlHttpFactory||void 0,this.Xa=n&&n.Tb||void 0,this.Ca=n&&n.useFetchStreams||!1,this.L=void 0,this.J=n&&n.supportsCrossDomainXhr||!1,this.K="",this.h=new mr(n&&n.concurrentRequestLimit),this.Da=new ka,this.P=n&&n.fastHandshake||!1,this.O=n&&n.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=n&&n.Rb||!1,n&&n.xa&&this.j.xa(),n&&n.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&n&&n.detectBufferingProxy||!1,this.ja=void 0,n&&n.longPollingTimeout&&0<n.longPollingTimeout&&(this.ja=n.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}i=Mr.prototype,i.la=8,i.G=1,i.connect=function(n,s,a,l){Z(0),this.W=n,this.H=s||{},a&&l!==void 0&&(this.H.OSID=a,this.H.OAID=l),this.F=this.X,this.I=Wr(this,null,this.W),fn(this)};function hi(n){if(Ur(n),n.G==3){var s=n.U++,a=Ee(n.I);if(j(a,"SID",n.K),j(a,"RID",s),j(a,"TYPE","terminate"),Lt(n,a),s=new Pe(n,n.j,s),s.L=2,s.v=cn(Ee(a)),a=!1,u.navigator&&u.navigator.sendBeacon)try{a=u.navigator.sendBeacon(s.v.toString(),"")}catch{}!a&&u.Image&&(new Image().src=s.v,a=!0),a||(s.g=Gr(s.j,null),s.g.ea(s.v)),s.F=Date.now(),sn(s)}$r(n)}function dn(n){n.g&&(ui(n),n.g.cancel(),n.g=null)}function Ur(n){dn(n),n.u&&(u.clearTimeout(n.u),n.u=null),pn(n),n.h.cancel(),n.s&&(typeof n.s=="number"&&u.clearTimeout(n.s),n.s=null)}function fn(n){if(!_r(n.h)&&!n.s){n.s=!0;var s=n.Ga;vt||Yi(),It||(vt(),It=!0),Bn.add(s,n),n.B=0}}function La(n,s){return yr(n.h)>=n.h.j-(n.s?1:0)?!1:n.s?(n.i=s.D.concat(n.i),!0):n.G==1||n.G==2||n.B>=(n.Va?0:n.Wa)?!1:(n.s=St(T(n.Ga,n,s),Hr(n,n.B)),n.B++,!0)}i.Ga=function(n){if(this.s)if(this.s=null,this.G==1){if(!n){this.U=Math.floor(1e5*Math.random()),n=this.U++;const v=new Pe(this,this.j,n);let w=this.o;if(this.S&&(w?(w=d(w),m(w,this.S)):w=this.S),this.m!==null||this.O||(v.H=w,w=null),this.P)e:{for(var s=0,a=0;a<this.i.length;a++){t:{var l=this.i[a];if("__data__"in l.map&&(l=l.map.__data__,typeof l=="string")){l=l.length;break t}l=void 0}if(l===void 0)break;if(s+=l,4096<s){s=a;break e}if(s===4096||a===this.i.length-1){s=a+1;break e}}s=1e3}else s=1e3;s=Fr(this,v,s),a=Ee(this.I),j(a,"RID",n),j(a,"CVER",22),this.D&&j(a,"X-HTTP-Session-Id",this.D),Lt(this,a),w&&(this.O?s="headers="+encodeURIComponent(String(kr(w)))+"&"+s:this.m&&ci(a,this.m,w)),ai(this.h,v),this.Ua&&j(a,"TYPE","init"),this.P?(j(a,"$req",s),j(a,"SID","null"),v.T=!0,ii(v,a,null)):ii(v,a,s),this.G=2}}else this.G==3&&(n?xr(this,n):this.i.length==0||_r(this.h)||xr(this))};function xr(n,s){var a;s?a=s.l:a=n.U++;const l=Ee(n.I);j(l,"SID",n.K),j(l,"RID",a),j(l,"AID",n.T),Lt(n,l),n.m&&n.o&&ci(l,n.m,n.o),a=new Pe(n,n.j,a,n.B+1),n.m===null&&(a.H=n.o),s&&(n.i=s.D.concat(n.i)),s=Fr(n,a,1e3),a.I=Math.round(.5*n.wa)+Math.round(.5*n.wa*Math.random()),ai(n.h,a),ii(a,l,s)}function Lt(n,s){n.H&&W(n.H,function(a,l){j(s,l,a)}),n.l&&wr({},function(a,l){j(s,l,a)})}function Fr(n,s,a){a=Math.min(n.i.length,a);var l=n.l?T(n.l.Na,n.l,n):null;e:{var v=n.i;let w=-1;for(;;){const A=["count="+a];w==-1?0<a?(w=v[0].g,A.push("ofs="+w)):w=0:A.push("ofs="+w);let F=!0;for(let z=0;z<a;z++){let D=v[z].g;const J=v[z].map;if(D-=w,0>D)w=Math.max(0,v[z].g-100),F=!1;else try{Pa(J,A,"req"+D+"_")}catch{l&&l(J)}}if(F){l=A.join("&");break e}}}return n=n.i.splice(0,a),s.D=n,l}function Vr(n){if(!n.g&&!n.u){n.Y=1;var s=n.Fa;vt||Yi(),It||(vt(),It=!0),Bn.add(s,n),n.v=0}}function li(n){return n.g||n.u||3<=n.v?!1:(n.Y++,n.u=St(T(n.Fa,n),Hr(n,n.v)),n.v++,!0)}i.Fa=function(){if(this.u=null,jr(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var n=2*this.R;this.j.info("BP detection timer enabled: "+n),this.A=St(T(this.ab,this),n)}},i.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Z(10),dn(this),jr(this))};function ui(n){n.A!=null&&(u.clearTimeout(n.A),n.A=null)}function jr(n){n.g=new Pe(n,n.j,"rpc",n.Y),n.m===null&&(n.g.H=n.o),n.g.O=0;var s=Ee(n.qa);j(s,"RID","rpc"),j(s,"SID",n.K),j(s,"AID",n.T),j(s,"CI",n.F?"0":"1"),!n.F&&n.ja&&j(s,"TO",n.ja),j(s,"TYPE","xmlhttp"),Lt(n,s),n.m&&n.o&&ci(s,n.m,n.o),n.L&&(n.g.I=n.L);var a=n.g;n=n.ia,a.L=1,a.v=cn(Ee(s)),a.m=null,a.P=!0,fr(a,n)}i.Za=function(){this.C!=null&&(this.C=null,dn(this),li(this),Z(19))};function pn(n){n.C!=null&&(u.clearTimeout(n.C),n.C=null)}function Br(n,s){var a=null;if(n.g==s){pn(n),ui(n),n.g=null;var l=2}else if(oi(n.h,s))a=s.D,vr(n.h,s),l=1;else return;if(n.G!=0){if(s.o)if(l==1){a=s.m?s.m.length:0,s=Date.now()-s.F;var v=n.B;l=Qn(),Y(l,new lr(l,a)),fn(n)}else Vr(n);else if(v=s.s,v==3||v==0&&0<s.X||!(l==1&&La(n,s)||l==2&&li(n)))switch(a&&0<a.length&&(s=n.h,s.i=s.i.concat(a)),v){case 1:Ge(n,5);break;case 4:Ge(n,10);break;case 3:Ge(n,6);break;default:Ge(n,2)}}}function Hr(n,s){let a=n.Ta+Math.floor(Math.random()*n.cb);return n.isActive()||(a*=2),a*s}function Ge(n,s){if(n.j.info("Error code "+s),s==2){var a=T(n.fb,n),l=n.Xa;const v=!l;l=new We(l||"//www.google.com/images/cleardot.gif"),u.location&&u.location.protocol=="http"||on(l,"https"),cn(l),v?Ra(l.toString(),a):Ca(l.toString(),a)}else Z(2);n.G=0,n.l&&n.l.sa(s),$r(n),Ur(n)}i.fb=function(n){n?(this.j.info("Successfully pinged google.com"),Z(2)):(this.j.info("Failed to ping google.com"),Z(1))};function $r(n){if(n.G=0,n.ka=[],n.l){const s=Ir(n.h);(s.length!=0||n.i.length!=0)&&(k(n.ka,s),k(n.ka,n.i),n.h.i.length=0,U(n.i),n.i.length=0),n.l.ra()}}function Wr(n,s,a){var l=a instanceof We?Ee(a):new We(a);if(l.g!="")s&&(l.g=s+"."+l.g),an(l,l.s);else{var v=u.location;l=v.protocol,s=s?s+"."+v.hostname:v.hostname,v=+v.port;var w=new We(null);l&&on(w,l),s&&(w.g=s),v&&an(w,v),a&&(w.l=a),l=w}return a=n.D,s=n.ya,a&&s&&j(l,a,s),j(l,"VER",n.la),Lt(n,l),l}function Gr(n,s,a){if(s&&!n.J)throw Error("Can't create secondary domain capable XhrIo object.");return s=n.Ca&&!n.pa?new B(new hn({eb:a})):new B(n.pa),s.Ha(n.J),s}i.isActive=function(){return!!this.l&&this.l.isActive(this)};function zr(){}i=zr.prototype,i.ua=function(){},i.ta=function(){},i.sa=function(){},i.ra=function(){},i.isActive=function(){return!0},i.Na=function(){};function ne(n,s){K.call(this),this.g=new Mr(s),this.l=n,this.h=s&&s.messageUrlParams||null,n=s&&s.messageHeaders||null,s&&s.clientProtocolHeaderRequired&&(n?n["X-Client-Protocol"]="webchannel":n={"X-Client-Protocol":"webchannel"}),this.g.o=n,n=s&&s.initMessageHeaders||null,s&&s.messageContentType&&(n?n["X-WebChannel-Content-Type"]=s.messageContentType:n={"X-WebChannel-Content-Type":s.messageContentType}),s&&s.va&&(n?n["X-WebChannel-Client-Profile"]=s.va:n={"X-WebChannel-Client-Profile":s.va}),this.g.S=n,(n=s&&s.Sb)&&!H(n)&&(this.g.m=n),this.v=s&&s.supportsCrossDomainXhr||!1,this.u=s&&s.sendRawJson||!1,(s=s&&s.httpSessionIdParam)&&!H(s)&&(this.g.D=s,n=this.h,n!==null&&s in n&&(n=this.h,s in n&&delete n[s])),this.j=new ot(this)}C(ne,K),ne.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ne.prototype.close=function(){hi(this.g)},ne.prototype.o=function(n){var s=this.g;if(typeof n=="string"){var a={};a.__data__=n,n=a}else this.u&&(a={},a.__data__=Jn(n),n=a);s.i.push(new _a(s.Ya++,n)),s.G==3&&fn(s)},ne.prototype.N=function(){this.g.l=null,delete this.j,hi(this.g),delete this.g,ne.aa.N.call(this)};function qr(n){Yn.call(this),n.__headers__&&(this.headers=n.__headers__,this.statusCode=n.__status__,delete n.__headers__,delete n.__status__);var s=n.__sm__;if(s){e:{for(const a in s){n=a;break e}n=void 0}(this.i=n)&&(n=this.i,s=s!==null&&n in s?s[n]:void 0),this.data=s}else this.data=n}C(qr,Yn);function Kr(){Zn.call(this),this.status=1}C(Kr,Zn);function ot(n){this.g=n}C(ot,zr),ot.prototype.ua=function(){Y(this.g,"a")},ot.prototype.ta=function(n){Y(this.g,new qr(n))},ot.prototype.sa=function(n){Y(this.g,new Kr)},ot.prototype.ra=function(){Y(this.g,"b")},ne.prototype.send=ne.prototype.o,ne.prototype.open=ne.prototype.m,ne.prototype.close=ne.prototype.close,ei.NO_ERROR=0,ei.TIMEOUT=8,ei.HTTP_ERROR=6,ga.COMPLETE="complete",la.EventType=Tt,Tt.OPEN="a",Tt.CLOSE="b",Tt.ERROR="c",Tt.MESSAGE="d",K.prototype.listen=K.prototype.K,B.prototype.listenOnce=B.prototype.L,B.prototype.getLastError=B.prototype.Ka,B.prototype.getLastErrorCode=B.prototype.Ba,B.prototype.getStatus=B.prototype.Z,B.prototype.getResponseJson=B.prototype.Oa,B.prototype.getResponseText=B.prototype.oa,B.prototype.send=B.prototype.ea,B.prototype.setWithCredentials=B.prototype.Ha}).apply(typeof _n<"u"?_n:typeof self<"u"?self:typeof window<"u"?window:{});const Rs="@firebase/firestore",Cs="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Q.UNAUTHENTICATED=new Q(null),Q.GOOGLE_CREDENTIALS=new Q("google-credentials-uid"),Q.FIRST_PARTY=new Q("first-party-uid"),Q.MOCK_USER=new Q("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yt="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt=new Li("@firebase/firestore");function ae(i,...e){if(pt.logLevel<=M.DEBUG){const t=e.map(qi);pt.debug(`Firestore (${Yt}): ${i}`,...t)}}function Bo(i,...e){if(pt.logLevel<=M.ERROR){const t=e.map(qi);pt.error(`Firestore (${Yt}): ${i}`,...t)}}function Ru(i,...e){if(pt.logLevel<=M.WARN){const t=e.map(qi);pt.warn(`Firestore (${Yt}): ${i}`,...t)}}function qi(i){if(typeof i=="string")return i;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(i)}catch{return i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gt(i,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Ho(i,r,t)}function Ho(i,e,t){let r=`FIRESTORE (${Yt}) INTERNAL ASSERTION FAILED: ${e} (ID: ${i.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Bo(r),new Error(r)}function Vt(i,e,t,r){let o="Unexpected state";typeof t=="string"?o=t:r=t,i||Ho(e,o,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O={CANCELLED:"cancelled",INVALID_ARGUMENT:"invalid-argument",FAILED_PRECONDITION:"failed-precondition"};class N extends ye{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Cu{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Q.UNAUTHENTICATED)))}shutdown(){}}class ku{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Pu{constructor(e){this.t=e,this.currentUser=Q.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Vt(this.o===void 0,42304);let r=this.i;const o=g=>this.i!==r?(r=this.i,t(g)):Promise.resolve();let c=new jt;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new jt,e.enqueueRetryable((()=>o(this.currentUser)))};const h=()=>{const g=c;e.enqueueRetryable((async()=>{await g.promise,await o(this.currentUser)}))},u=g=>{ae("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=g,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit((g=>u(g))),setTimeout((()=>{if(!this.auth){const g=this.t.getImmediate({optional:!0});g?u(g):(ae("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new jt)}}),0),h()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(ae("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Vt(typeof r.accessToken=="string",31837,{l:r}),new $o(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Vt(e===null||typeof e=="string",2055,{h:e}),new Q(e)}}class Ou{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Q.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Nu{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Ou(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Q.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ks{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Du{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ie(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Vt(this.o===void 0,3512);const r=c=>{c.error!=null&&ae("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const h=c.token!==this.m;return this.m=c.token,ae("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?t(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable((()=>r(c)))};const o=c=>{ae("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((c=>o(c))),setTimeout((()=>{if(!this.appCheck){const c=this.V.getImmediate({optional:!0});c?o(c):ae("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ks(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(Vt(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new ks(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lu(i){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(i);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<i;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mu(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const o=Lu(40);for(let c=0;c<o.length;++c)r.length<20&&o[c]<t&&(r+=e.charAt(o[c]%62))}return r}}function he(i,e){return i<e?-1:i>e?1:0}function xu(i,e){let t=0;for(;t<i.length&&t<e.length;){const r=i.codePointAt(t),o=e.codePointAt(t);if(r!==o){if(r<128&&o<128)return he(r,o);{const c=Mu(),h=Fu(c.encode(Ps(i,t)),c.encode(Ps(e,t)));return h!==0?h:he(r,o)}}t+=r>65535?2:1}return he(i.length,e.length)}function Ps(i,e){return i.codePointAt(e)>65535?i.substring(e,e+2):i.substring(e,e+1)}function Fu(i,e){for(let t=0;t<i.length&&t<e.length;++t)if(i[t]!==e[t])return he(i[t],e[t]);return he(i.length,e.length)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Os="__name__";class ue{constructor(e,t,r){t===void 0?t=0:t>e.length&&Gt(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Gt(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return ue.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof ue?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let o=0;o<r;o++){const c=ue.compareSegments(e.get(o),t.get(o));if(c!==0)return c}return he(e.length,t.length)}static compareSegments(e,t){const r=ue.isNumericId(e),o=ue.isNumericId(t);return r&&!o?-1:!r&&o?1:r&&o?ue.extractNumericId(e).compare(ue.extractNumericId(t)):xu(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return zi.fromString(e.substring(4,e.length-2))}}class se extends ue{construct(e,t,r){return new se(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(O.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((o=>o.length>0)))}return new se(t)}static emptyPath(){return new se([])}}const Vu=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class qe extends ue{construct(e,t,r){return new qe(e,t,r)}static isValidIdentifier(e){return Vu.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),qe.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Os}static keyField(){return new qe([Os])}static fromServerFormat(e){const t=[];let r="",o=0;const c=()=>{if(r.length===0)throw new N(O.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let h=!1;for(;o<e.length;){const u=e[o];if(u==="\\"){if(o+1===e.length)throw new N(O.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const g=e[o+1];if(g!=="\\"&&g!=="."&&g!=="`")throw new N(O.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=g,o+=2}else u==="`"?(h=!h,o++):u!=="."||h?(r+=u,o++):(c(),o++)}if(c(),h)throw new N(O.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new qe(t)}static emptyPath(){return new qe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e){this.path=e}static fromPath(e){return new Ke(se.fromString(e))}static fromName(e){return new Ke(se.fromString(e).popFirst(5))}static empty(){return new Ke(se.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&se.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return se.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new Ke(new se(e.slice()))}}function ju(i,e,t,r){if(e===!0&&r===!0)throw new N(O.INVALID_ARGUMENT,`${i} and ${t} cannot be used together.`)}function Bu(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)}function Hu(i){if(i===void 0)return"undefined";if(i===null)return"null";if(typeof i=="string")return i.length>20&&(i=`${i.substring(0,20)}...`),JSON.stringify(i);if(typeof i=="number"||typeof i=="boolean")return""+i;if(typeof i=="object"){if(i instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(i);return e?`a custom ${e} object`:"an object"}}return typeof i=="function"?"a function":Gt(12329,{type:typeof i})}function $u(i,e){if("_delegate"in i&&(i=i._delegate),!(i instanceof e)){if(e.name===i.constructor.name)throw new N(O.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Hu(i);throw new N(O.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return i}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(i,e){const t={typeString:i};return e&&(t.value=e),t}function Zt(i,e){if(!Bu(i))throw new N(O.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const o=e[r].typeString,c="value"in e[r]?{value:e[r].value}:void 0;if(!(r in i)){t=`JSON missing required field: '${r}'`;break}const h=i[r];if(o&&typeof h!==o){t=`JSON field '${r}' must be a ${o}.`;break}if(c!==void 0&&h!==c.value){t=`Expected '${r}' field to equal '${c.value}'`;break}}if(t)throw new N(O.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ns=-62135596800,Ds=1e6;class de{static now(){return de.fromMillis(Date.now())}static fromDate(e){return de.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Ds);return new de(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(O.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Ns)throw new N(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(O.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ds}_compareTo(e){return this.seconds===e.seconds?he(this.nanoseconds,e.nanoseconds):he(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:de._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Zt(e,de._jsonSchema))return new de(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Ns;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}de._jsonSchemaVersion="firestore/timestamp/1.0",de._jsonSchema={type:$("string",de._jsonSchemaVersion),seconds:$("number"),nanoseconds:$("number")};function Wu(i){return i.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(o){try{return atob(o)}catch(c){throw typeof DOMException<"u"&&c instanceof DOMException?new Gu("Invalid base64 string: "+c):c}})(e);return new et(t)}static fromUint8Array(e){const t=(function(o){let c="";for(let h=0;h<o.length;++h)c+=String.fromCharCode(o[h]);return c})(e);return new et(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let o=0;o<t.length;o++)r[o]=t.charCodeAt(o);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return he(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}et.EMPTY_BYTE_STRING=new et("");const Pi="(default)";class Dn{constructor(e,t){this.projectId=e,this.database=t||Pi}static empty(){return new Dn("","")}get isDefaultDatabase(){return this.database===Pi}isEqual(e){return e instanceof Dn&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(e,t=null,r=[],o=[],c=null,h="F",u=null,g=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=o,this.limit=c,this.limitType=h,this.startAt=u,this.endAt=g,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function qu(i){return new zu(i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ls,P;(P=Ls||(Ls={}))[P.OK=0]="OK",P[P.CANCELLED=1]="CANCELLED",P[P.UNKNOWN=2]="UNKNOWN",P[P.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",P[P.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",P[P.NOT_FOUND=5]="NOT_FOUND",P[P.ALREADY_EXISTS=6]="ALREADY_EXISTS",P[P.PERMISSION_DENIED=7]="PERMISSION_DENIED",P[P.UNAUTHENTICATED=16]="UNAUTHENTICATED",P[P.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",P[P.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",P[P.ABORTED=10]="ABORTED",P[P.OUT_OF_RANGE=11]="OUT_OF_RANGE",P[P.UNIMPLEMENTED=12]="UNIMPLEMENTED",P[P.INTERNAL=13]="INTERNAL",P[P.UNAVAILABLE=14]="UNAVAILABLE",P[P.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new zi([4294967295,4294967295],0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ku=41943040;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju=1048576;function Ii(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xu{constructor(e,t,r=1e3,o=1.5,c=6e4){this.Fi=e,this.timerId=t,this.d_=r,this.E_=o,this.A_=c,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),r=Math.max(0,Date.now()-this.m_),o=Math.max(0,t-r);o>0&&ae("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,o,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e,t,r,o,c){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=o,this.removalCallback=c,this.deferred=new jt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((h=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,o,c){const h=Date.now()+r,u=new Ki(e,t,h,o,c);return u.start(r),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(O.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var Ms,Us;(Us=Ms||(Ms={})).Fa="default",Us.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yu(i){const e={};return i.timeoutSeconds!==void 0&&(e.timeoutSeconds=i.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xs=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wo="firestore.googleapis.com",Fs=!0;class Vs{constructor(e){var t,r;if(e.host===void 0){if(e.ssl!==void 0)throw new N(O.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Wo,this.ssl=Fs}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Fs;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Ku;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Ju)throw new N(O.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ju("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Yu((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),(function(c){if(c.timeoutSeconds!==void 0){if(isNaN(c.timeoutSeconds))throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (must not be NaN)`);if(c.timeoutSeconds<5)throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (minimum allowed value is 5)`);if(c.timeoutSeconds>30)throw new N(O.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,o){return r.timeoutSeconds===o.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Go{constructor(e,t,r,o){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Vs({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(O.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(O.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Vs(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Cu;switch(r.type){case"firstParty":return new Nu(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(O.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=xs.get(t);r&&(ae("ComponentProvider","Removing Datastore"),xs.delete(t),r.terminate())})(this),Promise.resolve()}}function Zu(i,e,t,r={}){var o;i=$u(i,Go);const c=gt(e),h=i._getSettings(),u=Object.assign(Object.assign({},h),{emulatorOptions:i._getEmulatorOptions()}),g=`${e}:${t}`;c&&(Ni(`https://${g}`),Di("Firestore",!0)),h.host!==Wo&&h.host!==g&&Ru("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const E=Object.assign(Object.assign({},h),{host:g,ssl:c,emulatorOptions:r});if(!Ye(E,u)&&(i._setSettings(E),r.mockUserToken)){let S,b;if(typeof r.mockUserToken=="string")S=r.mockUserToken,b=Q.MOCK_USER;else{S=no(r.mockUserToken,(o=i._app)===null||o===void 0?void 0:o.options.projectId);const T=r.mockUserToken.sub||r.mockUserToken.user_id;if(!T)throw new N(O.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");b=new Q(T)}i._authCredentials=new ku(new $o(S,b))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Ji(this.firestore,e,this._query)}}class fe{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Xi(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new fe(this.firestore,e,this._key)}toJSON(){return{type:fe._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Zt(t,fe._jsonSchema))return new fe(e,r||null,new Ke(se.fromString(t.referencePath)))}}fe._jsonSchemaVersion="firestore/documentReference/1.0",fe._jsonSchema={type:$("string",fe._jsonSchemaVersion),referencePath:$("string")};class Xi extends Ji{constructor(e,t,r){super(e,t,qu(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new fe(this.firestore,null,new Ke(e))}withConverter(e){return new Xi(this.firestore,e,this._path)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const js="AsyncQueue";class Bs{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new Xu(this,"async_queue_retry"),this.oc=()=>{const r=Ii();r&&ae(js,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this._c=e;const t=Ii();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=Ii();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new jt;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Wu(e))throw e;ae(js,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((r=>{throw this.tc=r,this.nc=!1,Bo("INTERNAL UNHANDLED ERROR: ",Hs(r)),r})).then((r=>(this.nc=!1,r))))));return this._c=t,t}enqueueAfterDelay(e,t,r){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const o=Ki.createAndSchedule(this,e,t,r,(c=>this.lc(c)));return this.ec.push(o),o}ac(){this.tc&&Gt(47125,{hc:Hs(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function Hs(i){let e=i.message||"";return i.stack&&(e=i.stack.includes(i.message)?i.stack:i.message+`
`+i.stack),e}class Qu extends Go{constructor(e,t,r,o){super(e,t,r,o),this.type="firestore",this._queue=new Bs,this._persistenceKey=o?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Bs(e),this._firestoreClient=void 0,await e}}}function Ud(i,e){const t=typeof i=="object"?i:Ui(),r=typeof i=="string"?i:Pi,o=Un(t,"firestore").getImmediate({identifier:r});if(!o._initialized){const c=Qs("firestore");c&&Zu(o,...c)}return o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ae{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Ae(et.fromBase64String(e))}catch(t){throw new N(O.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Ae(et.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Ae._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Zt(e,Ae._jsonSchema))return Ae.fromBase64String(e.bytes)}}Ae._jsonSchemaVersion="firestore/bytes/1.0",Ae._jsonSchema={type:$("string",Ae._jsonSchemaVersion),bytes:$("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(O.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(O.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(O.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return he(this._lat,e._lat)||he(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Je._jsonSchemaVersion}}static fromJSON(e){if(Zt(e,Je._jsonSchema))return new Je(e.latitude,e.longitude)}}Je._jsonSchemaVersion="firestore/geoPoint/1.0",Je._jsonSchema={type:$("string",Je._jsonSchemaVersion),latitude:$("number"),longitude:$("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,o){if(r.length!==o.length)return!1;for(let c=0;c<r.length;++c)if(r[c]!==o[c])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Xe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Zt(e,Xe._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Xe(e.vectorValues);throw new N(O.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Xe._jsonSchemaVersion="firestore/vectorValue/1.0",Xe._jsonSchema={type:$("string",Xe._jsonSchemaVersion),vectorValues:$("object")};const ed=new RegExp("[~\\*/\\[\\]]");function td(i,e,t){if(e.search(ed)>=0)throw $s(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,i);try{return new zo(...e.split("."))._internalPath}catch{throw $s(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,i)}}function $s(i,e,t,r,o){let c=`Function ${e}() called with invalid data`;c+=". ";let h="";return new N(O.INVALID_ARGUMENT,c+i+h)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qo{constructor(e,t,r,o,c){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=o,this._converter=c}get id(){return this._key.path.lastSegment()}get ref(){return new fe(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new nd(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Ko("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class nd extends qo{data(){return super.data()}}function Ko(i,e){return typeof e=="string"?td(i,e):e instanceof zo?e._internalPath:e._delegate._internalPath}class yn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class dt extends qo{constructor(e,t,r,o,c,h){super(e,t,r,o,h),this._firestore=e,this._firestoreImpl=e,this.metadata=c}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new An(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Ko("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(O.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=dt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}dt._jsonSchemaVersion="firestore/documentSnapshot/1.0",dt._jsonSchema={type:$("string",dt._jsonSchemaVersion),bundleSource:$("string","DocumentSnapshot"),bundleName:$("string"),bundle:$("string")};class An extends dt{data(e={}){return super.data(e)}}class Bt{constructor(e,t,r,o){this._firestore=e,this._userDataWriter=t,this._snapshot=o,this.metadata=new yn(o.hasPendingWrites,o.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new An(this._firestore,this._userDataWriter,r.key,r,new yn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(O.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(o,c){if(o._snapshot.oldDocs.isEmpty()){let h=0;return o._snapshot.docChanges.map((u=>{const g=new An(o._firestore,o._userDataWriter,u.doc.key,u.doc,new yn(o._snapshot.mutatedKeys.has(u.doc.key),o._snapshot.fromCache),o.query.converter);return u.doc,{type:"added",doc:g,oldIndex:-1,newIndex:h++}}))}{let h=o._snapshot.oldDocs;return o._snapshot.docChanges.filter((u=>c||u.type!==3)).map((u=>{const g=new An(o._firestore,o._userDataWriter,u.doc.key,u.doc,new yn(o._snapshot.mutatedKeys.has(u.doc.key),o._snapshot.fromCache),o.query.converter);let E=-1,S=-1;return u.type!==0&&(E=h.indexOf(u.doc.key),h=h.delete(u.doc.key)),u.type!==1&&(h=h.add(u.doc),S=h.indexOf(u.doc.key)),{type:id(u.type),doc:g,oldIndex:E,newIndex:S}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(O.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Bt._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Uu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],o=[];return this.docs.forEach((c=>{c._document!==null&&(t.push(c._document),r.push(this._userDataWriter.convertObjectMap(c._document.data.value.mapValue.fields,"previous")),o.push(c.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function id(i){switch(i){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Gt(61501,{type:i})}}Bt._jsonSchemaVersion="firestore/querySnapshot/1.0",Bt._jsonSchema={type:$("string",Bt._jsonSchemaVersion),bundleSource:$("string","QuerySnapshot"),bundleName:$("string"),bundle:$("string")};(function(e,t=!0){(function(o){Yt=o})(tt),Ze(new Be("firestore",((r,{instanceIdentifier:o,options:c})=>{const h=r.getProvider("app").getImmediate(),u=new Qu(new Pu(r.getProvider("auth-internal")),new Du(h,r.getProvider("app-check-internal")),(function(E,S){if(!Object.prototype.hasOwnProperty.apply(E.options,["projectId"]))throw new N(O.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Dn(E.options.projectId,S)})(h,o),h);return c=Object.assign({useFetchStreams:t},c),u._setSettings(c),u}),"PUBLIC").setMultipleInstances(!0)),pe(Rs,Cs,e),pe(Rs,Cs,"esm2017")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jo="firebasestorage.googleapis.com",rd="storageBucket",sd=120*1e3,od=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ie extends ye{constructor(e,t,r=0){super(wi(e),`Firebase Storage: ${t} (${wi(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,Ie.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return wi(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var _e;(function(i){i.UNKNOWN="unknown",i.OBJECT_NOT_FOUND="object-not-found",i.BUCKET_NOT_FOUND="bucket-not-found",i.PROJECT_NOT_FOUND="project-not-found",i.QUOTA_EXCEEDED="quota-exceeded",i.UNAUTHENTICATED="unauthenticated",i.UNAUTHORIZED="unauthorized",i.UNAUTHORIZED_APP="unauthorized-app",i.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",i.INVALID_CHECKSUM="invalid-checksum",i.CANCELED="canceled",i.INVALID_EVENT_NAME="invalid-event-name",i.INVALID_URL="invalid-url",i.INVALID_DEFAULT_BUCKET="invalid-default-bucket",i.NO_DEFAULT_BUCKET="no-default-bucket",i.CANNOT_SLICE_BLOB="cannot-slice-blob",i.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",i.NO_DOWNLOAD_URL="no-download-url",i.INVALID_ARGUMENT="invalid-argument",i.INVALID_ARGUMENT_COUNT="invalid-argument-count",i.APP_DELETED="app-deleted",i.INVALID_ROOT_OPERATION="invalid-root-operation",i.INVALID_FORMAT="invalid-format",i.INTERNAL_ERROR="internal-error",i.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(_e||(_e={}));function wi(i){return"storage/"+i}function ad(){const i="An unknown error occurred, please check the error payload for server response.";return new Ie(_e.UNKNOWN,i)}function cd(){return new Ie(_e.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function hd(){return new Ie(_e.CANCELED,"User canceled the upload/download.")}function ld(i){return new Ie(_e.INVALID_URL,"Invalid URL '"+i+"'.")}function ud(i){return new Ie(_e.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+i+"'.")}function Ws(i){return new Ie(_e.INVALID_ARGUMENT,i)}function Xo(){return new Ie(_e.APP_DELETED,"The Firebase app was deleted.")}function dd(i){return new Ie(_e.INVALID_ROOT_OPERATION,"The operation '"+i+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=ce.makeFromUrl(e,t)}catch{return new ce(e,"")}if(r.path==="")return r;throw ud(e)}static makeFromUrl(e,t){let r=null;const o="([A-Za-z0-9.\\-_]+)";function c(V){V.path.charAt(V.path.length-1)==="/"&&(V.path_=V.path_.slice(0,-1))}const h="(/(.*))?$",u=new RegExp("^gs://"+o+h,"i"),g={bucket:1,path:3};function E(V){V.path_=decodeURIComponent(V.path)}const S="v[A-Za-z0-9_]+",b=t.replace(/[.]/g,"\\."),T="(/([^?#]*).*)?$",L=new RegExp(`^https?://${b}/${S}/b/${o}/o${T}`,"i"),C={bucket:1,path:3},U=t===Jo?"(?:storage.googleapis.com|storage.cloud.google.com)":t,k="([^?#]*)",G=new RegExp(`^https?://${U}/${o}/${k}`,"i"),x=[{regex:u,indices:g,postModify:c},{regex:L,indices:C,postModify:E},{regex:G,indices:{bucket:1,path:2},postModify:E}];for(let V=0;V<x.length;V++){const te=x[V],W=te.regex.exec(e);if(W){const y=W[te.indices.bucket];let d=W[te.indices.path];d||(d=""),r=new ce(y,d),te.postModify(r);break}}if(r==null)throw ld(e);return r}}class fd{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pd(i,e,t){let r=1,o=null,c=null,h=!1,u=0;function g(){return u===2}let E=!1;function S(...k){E||(E=!0,e.apply(null,k))}function b(k){o=setTimeout(()=>{o=null,i(L,g())},k)}function T(){c&&clearTimeout(c)}function L(k,...G){if(E){T();return}if(k){T(),S.call(null,k,...G);return}if(g()||h){T(),S.call(null,k,...G);return}r<64&&(r*=2);let x;u===1?(u=2,x=0):x=(r+Math.random())*1e3,b(x)}let C=!1;function U(k){C||(C=!0,T(),!E&&(o!==null?(k||(u=2),clearTimeout(o),b(0)):k||(u=1)))}return b(0),c=setTimeout(()=>{h=!0,U(!0)},t),U}function gd(i){i(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function md(i){return i!==void 0}function Gs(i,e,t,r){if(r<e)throw Ws(`Invalid value for '${i}'. Expected ${e} or greater.`);if(r>t)throw Ws(`Invalid value for '${i}'. Expected ${t} or less.`)}function _d(i){const e=encodeURIComponent;let t="?";for(const r in i)if(i.hasOwnProperty(r)){const o=e(r)+"="+e(i[r]);t=t+o+"&"}return t=t.slice(0,-1),t}var Ln;(function(i){i[i.NO_ERROR=0]="NO_ERROR",i[i.NETWORK_ERROR=1]="NETWORK_ERROR",i[i.ABORT=2]="ABORT"})(Ln||(Ln={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yd(i,e){const t=i>=500&&i<600,o=[408,429].indexOf(i)!==-1,c=e.indexOf(i)!==-1;return t||o||c}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(e,t,r,o,c,h,u,g,E,S,b,T=!0,L=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=o,this.successCodes_=c,this.additionalRetryCodes_=h,this.callback_=u,this.errorCallback_=g,this.timeout_=E,this.progressCallback_=S,this.connectionFactory_=b,this.retry=T,this.isUsingEmulator=L,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((C,U)=>{this.resolve_=C,this.reject_=U,this.start_()})}start_(){const e=(r,o)=>{if(o){r(!1,new vn(!1,null,!0));return}const c=this.connectionFactory_();this.pendingConnection_=c;const h=u=>{const g=u.loaded,E=u.lengthComputable?u.total:-1;this.progressCallback_!==null&&this.progressCallback_(g,E)};this.progressCallback_!==null&&c.addUploadProgressListener(h),c.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&c.removeUploadProgressListener(h),this.pendingConnection_=null;const u=c.getErrorCode()===Ln.NO_ERROR,g=c.getStatus();if(!u||yd(g,this.additionalRetryCodes_)&&this.retry){const S=c.getErrorCode()===Ln.ABORT;r(!1,new vn(!1,null,S));return}const E=this.successCodes_.indexOf(g)!==-1;r(!0,new vn(E,c))})},t=(r,o)=>{const c=this.resolve_,h=this.reject_,u=o.connection;if(o.wasSuccessCode)try{const g=this.callback_(u,u.getResponse());md(g)?c(g):c()}catch(g){h(g)}else if(u!==null){const g=ad();g.serverResponse=u.getErrorText(),this.errorCallback_?h(this.errorCallback_(u,g)):h(g)}else if(o.canceled){const g=this.appDelete_?Xo():hd();h(g)}else{const g=cd();h(g)}};this.canceled_?t(!1,new vn(!1,null,!0)):this.backoffId_=pd(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&gd(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class vn{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}}function Id(i,e){e!==null&&e.length>0&&(i.Authorization="Firebase "+e)}function wd(i,e){i["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Ed(i,e){e&&(i["X-Firebase-GMPID"]=e)}function Td(i,e){e!==null&&(i["X-Firebase-AppCheck"]=e)}function Ad(i,e,t,r,o,c,h=!0,u=!1){const g=_d(i.urlParams),E=i.url+g,S=Object.assign({},i.headers);return Ed(S,e),Id(S,t),wd(S,c),Td(S,r),new vd(E,i.method,S,i.body,i.successCodes,i.additionalRetryCodes,i.handler,i.errorHandler,i.timeout,i.progressCallback,o,h,u)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sd(i){if(i.length===0)return null;const e=i.lastIndexOf("/");return e===-1?"":i.slice(0,e)}function bd(i){const e=i.lastIndexOf("/",i.length-2);return e===-1?i:i.slice(e+1)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn{constructor(e,t){this._service=e,t instanceof ce?this._location=t:this._location=ce.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Mn(e,t)}get root(){const e=new ce(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return bd(this._location.path)}get storage(){return this._service}get parent(){const e=Sd(this._location.path);if(e===null)return null;const t=new ce(this._location.bucket,e);return new Mn(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw dd(e)}}function zs(i,e){const t=e?.[rd];return t==null?null:ce.makeFromBucketSpec(t,i)}function Rd(i,e,t,r={}){i.host=`${e}:${t}`;const o=gt(e);o&&(Ni(`https://${i.host}/b`),Di("Storage",!0)),i._isUsingEmulator=!0,i._protocol=o?"https":"http";const{mockUserToken:c}=r;c&&(i._overrideAuthToken=typeof c=="string"?c:no(c,i.app.options.projectId))}class Cd{constructor(e,t,r,o,c,h=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=o,this._firebaseVersion=c,this._isUsingEmulator=h,this._bucket=null,this._host=Jo,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=sd,this._maxUploadRetryTime=od,this._requests=new Set,o!=null?this._bucket=ce.makeFromBucketSpec(o,this._host):this._bucket=zs(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=ce.makeFromBucketSpec(this._url,e):this._bucket=zs(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Gs("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Gs("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(ie(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Mn(this,e)}_makeRequest(e,t,r,o,c=!0){if(this._deleted)return new fd(Xo());{const h=Ad(e,this._appId,r,o,t,this._firebaseVersion,c,this._isUsingEmulator);return this._requests.add(h),h.getPromise().then(()=>this._requests.delete(h),()=>this._requests.delete(h)),h}}async makeRequestWithTokens(e,t){const[r,o]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,o).getPromise()}}const qs="@firebase/storage",Ks="0.13.14";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yo="storage";function xd(i=Ui(),e){i=ve(i);const r=Un(i,Yo).getImmediate({identifier:e}),o=Qs("storage");return o&&kd(r,...o),r}function kd(i,e,t,r={}){Rd(i,e,t,r)}function Pd(i,{instanceIdentifier:e}){const t=i.getProvider("app").getImmediate(),r=i.getProvider("auth-internal"),o=i.getProvider("app-check-internal");return new Cd(t,r,o,e,tt)}function Od(){Ze(new Be(Yo,Pd,"PUBLIC").setMultipleInstances(!0)),pe(qs,Ks,""),pe(qs,Ks,"esm2017")}Od();export{Ud as a,xd as b,Nd as c,Md as g,rh as i,Dd as o,Ld as s};
