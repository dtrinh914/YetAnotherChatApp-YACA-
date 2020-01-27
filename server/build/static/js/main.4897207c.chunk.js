(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{128:function(e,t,a){e.exports=a(192)},133:function(e,t,a){},150:function(e,t,a){},155:function(e,t,a){},188:function(e,t){},191:function(e,t,a){},192:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(9),o=a.n(c),i=a(43),s=(a(133),a(8)),l=a(36);var u=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=Object(n.useState)(e),a=Object(s.a)(t,2),r=a[0],c=a[1];return[r,function(e){c(e.target.value)},function(){c("")}]},m=a(13),d=a.n(m),p=a(244),f=a(233);a(150);var g=function(e){var t=e.loggedIn,a=e.setUserData,n=u(),c=Object(s.a)(n,2),o=c[0],m=c[1],g=u(),v=Object(s.a)(g,2),E=v[0],b=v[1],h=Object(l.g)();return t?r.a.createElement(l.a,{to:"/chat"}):r.a.createElement("div",{className:"LoginPage"},r.a.createElement("form",{onSubmit:function(e){e.preventDefault(),d.a.post("/api/actions/login",{username:o,password:E,withCredentials:!0}).then((function(e){e.data.loggedIn&&(a(e.data),h.push("/chat"))})).catch((function(e){return console.log(e)}))}},r.a.createElement("h1",null,"Sign In"),r.a.createElement(p.a,{className:"sign-in",type:"text",name:"username",id:"username",label:"Username",variant:"outlined",value:o,onChange:m}),r.a.createElement(p.a,{className:"sign-in",type:"password",name:"password",id:"password",label:"Password",variant:"outlined",value:E,onChange:b}),r.a.createElement(f.a,{type:"submit",variant:"outlined"},"Login"),r.a.createElement(i.b,{to:"/users/new"},"Create User")))};a(155);var v=function(){var e=u(),t=Object(s.a)(e,2),a=t[0],n=t[1],c=u(),o=Object(s.a)(c,2),i=o[0],l=o[1];return r.a.createElement("div",{className:"CreateAccountPage"},r.a.createElement("form",{onSubmit:function(e){e.preventDefault(),d.a.post("/api/users/new",{username:a,password:i,withCredentials:!0}).then((function(e){console.log(e)}))}},r.a.createElement("h1",null,"Create an Account"),r.a.createElement("label",{htmlFor:"username"},"Username"),r.a.createElement("input",{type:"text",name:"username",id:"username",value:a,onChange:n}),r.a.createElement("label",{htmlFor:"password"},"Password"),r.a.createElement("input",{type:"password",name:"password",id:"password",value:i,onChange:l}),r.a.createElement("button",null,"Sign Up")))},E=a(31),b=a.n(E),h=a(196);var x=function(e){var t=e.name,a=e.id,n=e.index,c=e.setGroup;return r.a.createElement(h.a,{style:{padding:"2px 15px 2px 30px",fontSize:"0.85rem"},onClick:function(){c(a,t,n)},button:!0},t)},w=a(65),N=a.n(w),y=a(235),O=a(195),j=a(234),D=a(197),C=Object(D.a)({root:{padding:"10px 0px",textAlign:"center",margin:0},header:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 15px"},headerText:{fontWeight:700},list:{padding:0}});var I=function(e){var t=e.openNewGroup,a=e.groups,n=e.setGroup,c=C();return r.a.createElement("div",{className:c.root,"aria-label":"group-nav"},r.a.createElement("div",{className:c.header},r.a.createElement(j.a,{className:c.headerText},"Groups"),r.a.createElement(y.a,{className:c.create,color:"inherit",size:"small",onClick:t},r.a.createElement(N.a,{fontSize:"inherit"}))),r.a.createElement(O.a,{className:c.list},a.map((function(e,t){return r.a.createElement(x,{id:e.id,name:e.name,key:e.id,setGroup:n,index:t})}))))},k=a(248),G=Object(D.a)({root:{padding:"20px 0px",textAlign:"center",alignSelf:"center"},avatar:{marginBottom:"10px"}});function M(e){var t=e.username,a=G();return r.a.createElement("div",{className:a.root},r.a.createElement(k.a,{className:a.avatar},t[0].toUpperCase()),r.a.createElement(j.a,null,t))}var R=a(109),_=a.n(R),A=a(110),U=a.n(A),S=Object(D.a)({root:{display:"flex",justifyContent:"space-between",padding:0},text:{fontSize:"0.85rem",marginLeft:"10px"},icon:{color:"white",fontSize:"1rem"},buttons:{display:"flex",marginRight:"10px"}});function T(e){var t=e.groupName,a=e.groupId,n=e.acceptInvite,c=e.declineInvite,o=S();return r.a.createElement(h.a,{className:o.root},r.a.createElement(j.a,{className:o.text},t),r.a.createElement("div",{className:o.buttons},r.a.createElement(y.a,{size:"small",onClick:function(){n(a)}},r.a.createElement(_.a,{className:o.icon})),r.a.createElement(y.a,{size:"small",onClick:function(){c(a)}},r.a.createElement(U.a,{className:o.icon}))))}var P=Object(D.a)({root:{padding:"10px 0px",textAlign:"center",margin:0},headerText:{fontWeight:700},list:{padding:0,margin:0}});function W(e){var t=e.pendingInvites,a=e.acceptInvite,n=e.declineInvite,c=P();return r.a.createElement("div",{className:c.root,"aria-label":"group-invites"},r.a.createElement(j.a,{className:c.headerText},"Pending Invites"),r.a.createElement(O.a,{className:c.list},t.map((function(e){return r.a.createElement(T,{key:e._id,groupName:e.groupName,groupId:e._id,acceptInvite:a,declineInvite:n})}))))}var z=a(194),L=a(237),F=a(236),B=Object(D.a)({root:{display:"flex",position:"fixed",top:0,zIndex:5e3,height:"100%",width:"100%",justifyContent:"center",alignItems:"center",background:"rgba(0,0,0,0.4)"},hidden:{display:"none"},paper:{width:"70%",maxWidth:"500px",padding:"30px 30px"},loadbar:{marginBottom:"10px"},form:{display:"flex",flexDirection:"column"},textInput:{marginBottom:"15px"}});var H=function(e){var t=e.createNewGroup,a=e.close,c=u(""),o=Object(s.a)(c,2),i=o[0],l=o[1],m=u(""),d=Object(s.a)(m,2),g=d[0],v=d[1],E=Object(n.useState)({status:!1,err:""}),h=Object(s.a)(E,2),x=h[0],w=h[1],N=Object(n.useState)(!1),y=Object(s.a)(N,2),O=y[0],j=y[1],D=Object(n.useRef)(null),C=B();Object(n.useEffect)((function(){D.current.children[1].children[0].focus()}),[O]);var I=function(e){return""===e.trim()&&(w({status:!0,err:"This field is required."}),!0)},k=function(){var e;return b.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,b.a.awrap(t(i,g));case 2:e=a.sent,j(!1),1===e?G():w(0===e?{status:!0,err:"A group with this name already exists."}:{status:!0,err:"An error occured while processing your request."});case 5:case"end":return a.stop()}}))},G=function(){a()};return r.a.createElement("div",{className:C.root},r.a.createElement(F.a,{onClickAway:G},r.a.createElement(z.a,{className:C.paper},r.a.createElement(L.a,{className:O?C.loadbar:C.hidden}),r.a.createElement("form",{className:C.form,onSubmit:function(e){e.preventDefault(),I(i)||(j(!0),k())}},r.a.createElement(p.a,{ref:D,className:C.textInput,label:"Group Name",id:"Group Name",type:"text",name:"newGroupName",value:i,onChange:function(e){l(e)},error:x.status,helperText:x.err,disabled:O}),r.a.createElement(p.a,{className:C.textInput,label:"Group Description",id:"Group Description",type:"text",name:"newGroupDescription",value:g,onChange:v,disabled:O}),r.a.createElement(f.a,{type:"submit",disabled:O},"Create Group"),r.a.createElement(f.a,{onClick:G,disabled:O},"Close")))))},q=a(238),V=a(245),J=a(247),K=a(10),X=a(21);var $=function(e,t){var a,n,r,c,o=function(e){var t={};return e.map((function(e){return t[e._id]={username:e.username}})),t};switch(t.type){case"INIT":return a=t.payload.groups.map((function(e){var t=o(e.activeMembers);return e.memberMap=t,e})),t.payload.groups=a,t.payload;case"NEW_MSG":return a=e.groups.map((function(e){if(e._id===t.room){var a=[].concat(Object(X.a)(e.messages),[t.message]);return Object(K.a)({},e,{messages:a})}return e})),Object(K.a)({},e,{groups:a});case"ADD_GROUP":return t.payload.memberMap=o(t.payload.activeMembers),a=[].concat(Object(X.a)(e.groups),[t.payload]),c=Object(K.a)({},e.selected,{_id:t.payload._id,name:t.payload.groupName,index:a.length-1}),Object(K.a)({},e,{groups:a,selected:c});case"CHANGE_GROUP":return Object(K.a)({},e,{selected:{_id:t.selected,name:t.name,type:"group",index:t.index}});case"ADD_MEMBER":return a=e.groups.map((function(e){if(e._id===t.groupId){var a=e.pendingMembers;return a.push(t.memberId),Object(K.a)({},e,{pendingMembers:a})}return e})),Object(K.a)({},e,{groups:a});case"UPDATE_MEMBERS":return a=e.groups.map((function(e){return e._id===t.groupId?Object(K.a)({},e,{},t.payload,{memberMap:o(t.payload.activeMembers)}):e})),Object(K.a)({},e,{groups:a});case"UPDATE_PENDING":return n=t.payload,r=Object(K.a)({},e.user,{groupInvites:n}),Object(K.a)({},e,{user:r});case"DECLINE_INVITE":return n=e.user.groupInvites.filter((function(e){return e._id!==t.id})),r=Object(K.a)({},e.user,{groupInvites:n}),Object(K.a)({},e,{user:r});default:return e}},Q=Object(n.createContext)();function Y(e){var t=Object(n.useReducer)($,""),a=Object(s.a)(t,2),c=a[0],o=a[1];return r.a.createElement(Q.Provider,{value:{chatData:c,chatDispatch:o}},e.children)}var Z=function(e,t){var a,n;switch(t.type){case"ADDMEM":return a=e.rightNav,Object(K.a)({},e,{rightNav:Object(K.a)({},a,{addMem:t.open})});case"RIGHT":return a=e.rightNav,Object(K.a)({},e,{rightNav:Object(K.a)({},a,{root:t.open})});case"RIGHTDRAWER":return a=e.rightNav,Object(K.a)({},e,{rightNav:Object(K.a)({},a,{drawer:t.open})});case"LEFTDRAWER":return n=e.leftNav,Object(K.a)({},e,{leftNav:Object(K.a)({},n,{drawer:t.open})});case"NEWGROUP":return n=e.leftNav,Object(K.a)({},e,{leftNav:Object(K.a)({},n,{newGroup:t.open})});default:return e}},ee={rightNav:{root:!0,drawer:!1,addMem:!1},leftNav:{root:!0,drawer:!1,newGroup:!1}},te=Object(n.createContext)();function ae(e){var t=Object(n.useReducer)(Z,ee),a=Object(s.a)(t,2),c=a[0],o=a[1];return r.a.createElement(te.Provider,{value:{navData:c,navDispatch:o}},e.children)}var ne=Object(D.a)({root:{width:"250px",height:"100%",border:"none",background:"#424242",overflow:"auto"},paper:{display:"flex",flexDirection:"column",padding:"10px",color:"white"},divider:{width:"85%",backgroundColor:"#616161"}});function re(e){var t=e.joinRoom,a=e.updateMembers,c=Object(n.useContext)(Q),o=c.chatData,i=c.chatDispatch,s=Object(n.useContext)(te),l=s.navData,u=s.navDispatch,m=ne(),p=o.groups.map((function(e){return{name:e.groupName,id:e._id}})),f=l.leftNav.newGroup,g=o.user.username,v=o.user.groupInvites,E=r.a.createElement("div",{className:m.root},r.a.createElement("div",{className:m.paper},r.a.createElement(M,{username:g}),r.a.createElement(q.a,{className:m.divider,variant:"middle"}),r.a.createElement(I,{openNewGroup:function(){u({type:"NEWGROUP",open:!0}),u({type:"LEFTDRAWER",open:!1})},setGroup:function(e,t,a){i({type:"CHANGE_GROUP",selected:e,name:t,index:a}),u({type:"LEFT",open:!1}),u({type:"LEFTDRAWER",open:!1})},groups:p}),o.user.groupInvites.length>0?r.a.createElement(r.a.Fragment,null,r.a.createElement(q.a,{className:m.divider,variant:"middle"}),r.a.createElement(W,{pendingInvites:v,acceptInvite:function(e){var n;return b.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,r.next=3,b.a.awrap(d.a.post("/api/users/pendinginvites/"+e,{withCredentials:!0}));case 3:if(1!==(n=r.sent).data.status){r.next=9;break}return r.next=7,b.a.awrap(d.a.get("/api/groups/"+e,{withCredentials:!0}));case 7:1===(n=r.sent).data.status&&(i({type:"ADD_GROUP",payload:n.data.data[0]}),i({type:"DECLINE_INVITE",id:e}),t(e),a(e));case 9:r.next=14;break;case 11:r.prev=11,r.t0=r.catch(0),console.log(r.t0);case 14:case"end":return r.stop()}}),null,null,[[0,11]])},declineInvite:function(e){d.a.delete("/api/users/pendinginvites/"+e,{withCredentials:!0}).then((function(t){1===t.data.status&&(i({type:"DECLINE_INVITE",id:e}),a(e))})).catch((function(e){return console.log(e)}))}})):""));return r.a.createElement(r.a.Fragment,null,r.a.createElement(V.a,{xsDown:!0},E),r.a.createElement(V.a,{smUp:!0},r.a.createElement(J.a,{open:l.leftNav.drawer,ModalProps:{onBackdropClick:function(){l.leftNav.newGroup||u({type:"LEFTDRAWER",open:!1})}}},E)),f?r.a.createElement(H,{createNewGroup:function(e,a){var n,r;return b.a.async((function(c){for(;;)switch(c.prev=c.next){case 0:return c.next=2,b.a.awrap(d.a.post("/api/groups/",{newGroupName:e,description:a,withCredentials:!0}));case 2:if(1!==(n=c.sent).data.status){c.next=10;break}return r=n.data.data[0],i({type:"ADD_GROUP",payload:r}),t(r._id),c.abrupt("return",1);case 10:if(0!==n.data.status){c.next=14;break}return c.abrupt("return",0);case 14:return c.abrupt("return",-1);case 15:case"end":return c.stop()}}))},close:function(){u({type:"NEWGROUP",open:!1})}}):"")}var ce=a(239),oe=a(240),ie=a(231),se=a(241),le=a(232),ue=a(242),me=a(115),de=a.n(me),pe=a(114),fe=a.n(pe),ge=a(111),ve=a.n(ge),Ee=a(112),be=a.n(Ee),he=Object(D.a)({nav:{height:"40px",display:"flex",justifyContent:"center",zIndex:100},tool:{display:"flex",justifyContent:"space-between"},rightmenu:{position:"relative",left:"5px",background:"#424242",color:"white"}});var xe=function(e){var t=e.history,a=e.setUserData,c=Object(n.useContext)(Q).chatData,o=Object(n.useContext)(te),i=o.navData,l=o.navDispatch,u=he(),m=Object(n.useState)(!1),p=Object(s.a)(m,2),g=p[0],v=p[1],E=Object(n.useRef)(null),b=function(e){E.current&&E.current.contains(e.target)||v(!1)};function h(e){"Tab"===e.key&&(e.preventDefault(),v(!1))}var x=r.a.useRef(g);Object(n.useEffect)((function(){!0===x.current&&!1===g&&E.current.focus(),x.current=g}),[g]);var w=function(){d.a.get("/api/actions/logout",{withCredentials:!0}).then((function(e){!1===e.data.loggedIn&&(a(e.data),t.push("/"))})).catch((function(e){return console.log(e)}))},N=function(){l({type:"ADDMEM",open:!0})};return r.a.createElement(ce.a,{position:"static",className:u.nav},r.a.createElement(oe.a,{className:u.tool},r.a.createElement(V.a,{smUp:!0},r.a.createElement(y.a,{onClick:function(){l({type:"LEFTDRAWER",open:!0})},size:"small"},r.a.createElement(ve.a,null))),r.a.createElement(j.a,null,c.selected.name),r.a.createElement(V.a,{mdUp:!0},r.a.createElement(y.a,{ref:E,"aria-controls":g?"menu-list-grow":void 0,"aria-haspopup":"true",onClick:function(){v((function(e){return!e}))},size:"small"},r.a.createElement(be.a,null)),r.a.createElement(se.a,{anchorEl:E.current,open:g,role:void 0,transition:!0,disablePortal:!0},(function(e){var t=e.TransitionProps,a=e.placement;return r.a.createElement(ie.a,Object.assign({},t,{style:{transformOrigin:"bottom"===a?"center top":"center bottom"}}),r.a.createElement(z.a,{className:u.rightmenu},r.a.createElement(F.a,{onClickAway:b},r.a.createElement(le.a,{autoFocusItem:g,id:"menu-list-grow",onKeyDown:h},r.a.createElement(ue.a,{onClick:function(e){b(e),l({type:"RIGHTDRAWER",open:!0})}},"Group Information"),r.a.createElement(ue.a,{onClick:function(e){b(e),N()}},"Invite"),r.a.createElement(ue.a,{onClick:function(e){b(e),w()}},"Logout")))))}))),r.a.createElement(V.a,{smDown:!0},r.a.createElement("div",null,r.a.createElement(y.a,{onClick:function(){l({type:"RIGHT",open:!i.rightNav.root})},size:"small"},r.a.createElement(fe.a,null)),r.a.createElement(y.a,{onClick:N,size:"small"},r.a.createElement(de.a,null)),r.a.createElement(f.a,{onClick:w},"Log Out")))))},we=a(47),Ne=a.n(we),ye=a(243),Oe=a(66),je=Object(ye.a)({root:{alignItems:"start"},avatar:{margin:"0 15px"},span:{marginLeft:"10px"}});var De=function(e){var t=e.message,a=je(),n=new Date(t.time);return r.a.createElement(h.a,{className:a.root},r.a.createElement(k.a,{className:a.avatar},t.username[0].toUpperCase()),r.a.createElement("div",null,r.a.createElement(j.a,null,r.a.createElement("strong",null,t.username),r.a.createElement("span",{className:a.span},Object(Oe.a)(n,"hh:mm aa"))),r.a.createElement(j.a,null,t.text," ")))},Ce=Object(D.a)({root:{position:"relative",width:"100%",padding:"20px 0"},text:{position:"absolute",zIndex:80,top:0,left:"50%",transform:"translateX(-50%)",backgroundColor:"#fafafa",padding:"8px 12px",borderRadius:"25px",whiteSpace:"nowrap"},divider:{width:"95%",margin:"0 auto"}});function Ie(e){var t=e.date,a=Ce();return r.a.createElement("div",{className:a.root},r.a.createElement(j.a,{className:a.text},t),r.a.createElement(q.a,{className:a.divider}))}var ke=Object(D.a)({paper:{background:"#fafafa",overflow:"auto",flexGrow:1,flexShrink:100},list:{margin:0,padding:0,wordBreak:"break-word"}});var Ge=function(e){var t=e.currentGroup,a=ke();return r.a.createElement(z.a,{className:a.paper},r.a.createElement(O.a,{className:a.list},function(e){for(var a=[],n={},r=t.memberMap,c=0;c<e.length;c++){var o=new Date(e[c].time),i=Object(Oe.a)(o,"E MMMM dd, yyyy");n[i]||(n[i]=!0,a.push({date:i,type:"date"})),a.push(Object(K.a)({},e[c],{username:r[e[c].id].username,type:"message"}))}return a}(t.messages).map((function(e){return"message"===e.type?r.a.createElement(De,{key:Ne()(),message:e}):r.a.createElement(Ie,{date:e.date})}))))},Me=Object(D.a)({root:{display:"flex",height:"40px"},input:{fontSize:"1rem",flexGrow:"1"},button:{borderRadius:0}});var Re=function(e){var t=e.onConfirm,a=e.selected,c=Me(),o=u(),i=Object(s.a)(o,3),l=i[0],m=i[1],d=i[2];function p(){t(l),d()}return Object(n.useEffect)((function(){d()}),[a]),r.a.createElement("div",{className:c.root},r.a.createElement("input",{className:c.input,type:"text",value:l,onChange:m,onKeyPress:function(e){"Enter"===e.key&&(e.preventDefault(),p())}}),r.a.createElement(f.a,{className:c.button,color:"primary",variant:"contained",onClick:p},"Send"))},_e=a(116),Ae=a.n(_e),Ue=Object(D.a)({root:{display:"flex",alignItems:"center",justifyContent:"space-between"},avatar:{fontSize:"0.9rem",width:"20px",height:"20px",marginRight:"10px"},user:{display:"flex"},add:{fontSize:"1rem"}});function Se(e){var t,a=e.username,n=e.userId,c=e.status,o=e.sendInvite,i=Ue();switch(c){case"active":t=r.a.createElement(Ae.a,null);break;case"pending":t=r.a.createElement(f.a,null,"Pending");break;default:t=r.a.createElement(y.a,{size:"small",onClick:function(){o(n)}},r.a.createElement(N.a,{className:i.add}))}return r.a.createElement(h.a,{className:i.root},r.a.createElement("div",{className:i.user},r.a.createElement(k.a,{className:i.avatar},a[0].toUpperCase()),r.a.createElement("span",null,a)),t)}var Te=a(227),Pe=Object(D.a)({root:{display:"flex",position:"fixed",top:0,left:0,zIndex:500,height:"100%",width:"100%",justifyContent:"center",alignItems:"center",background:"rgba(0,0,0,0.4)"},paper:{padding:"15px",textAlign:"center",background:"white",height:"90%",maxHeight:"700px",width:"80%",maxWidth:"300px",overflow:"auto"}});function We(e){var t=e.sendInvite,a=e.filterResults,c=e.closeAddMem,o=Pe(),i=u(),l=Object(s.a)(i,2),m=l[0],p=l[1],g=Object(n.useState)([]),v=Object(s.a)(g,2),E=v[0],b=v[1];return r.a.createElement("div",{className:o.root},r.a.createElement(F.a,{onClickAway:c},r.a.createElement(z.a,{className:o.paper},r.a.createElement(j.a,null,"Add a Member"),r.a.createElement("form",{onSubmit:function(e){e.preventDefault(),function(e){var t="/api/users/search/"+e;d.a.get(t,{withCredentials:!0}).then((function(e){1===e.data.status&&b(e.data.data)}))}(m)}},r.a.createElement(Te.a,{className:o.input,id:"username",name:"username",placeholder:"Username",value:m,onChange:p}),r.a.createElement(O.a,null,a(E).map((function(e){return r.a.createElement(Se,{key:Ne()(),username:e.username,userId:e._id,status:e.status,sendInvite:t})}))),r.a.createElement(f.a,{className:o.button,type:"submit"},"Search")),r.a.createElement(f.a,{className:o.button,onClick:c},"Close"))))}function ze(e){var t=e.description;return r.a.createElement("div",null,r.a.createElement("p",null,t||"[No description has been written]"))}var Le=Object(D.a)({list:{margin:0},avatar:{marginRight:"10px"}});function Fe(e){var t=e.groupMembers,a=Le();return r.a.createElement("div",null,r.a.createElement("h2",null,"Group Members"),r.a.createElement(O.a,{className:a.list},t.map((function(e){return r.a.createElement(h.a,{key:Ne()()},r.a.createElement(k.a,{className:a.avatar},e.username[0].toUpperCase()),r.a.createElement("span",null,e.username))}))))}var Be=Object(D.a)({root:{width:"250px",height:"100%",background:"#424242",overflow:"auto"},hidden:{display:"none"},paper:{display:"flex",flexDirection:"column",padding:"15px",textAlign:"center",border:"none",color:"white"},divider:{width:"85%",backgroundColor:"#616161"}});function He(e){var t=e.updateInvite,a=e.updateMembers,c=Object(n.useContext)(te),o=c.navData,i=c.navDispatch,s=Object(n.useContext)(Q),l=s.chatData,u=s.chatDispatch,m=Be(),p=o.rightNav.addMem,f=l.selected.index,g=l.selected._id,v=l.user._id,E=l.groups[f].description,b=l.groups[f].activeMembers,h=l.groups[f],x=h.activeMembers,w=h.pendingMembers,N=h.pendingRequests,y=r.a.createElement("div",{className:m.paper},r.a.createElement(ze,{description:E}),r.a.createElement(q.a,{className:m.divider,variant:"middle"}),r.a.createElement(Fe,{groupMembers:b}));return r.a.createElement(r.a.Fragment,null,r.a.createElement(V.a,{smDown:!0},r.a.createElement("div",{className:o.rightNav.root?m.root:m.hidden},y)),r.a.createElement(V.a,{mdUp:!0},r.a.createElement(J.a,{open:o.rightNav.drawer,anchor:"right",ModalProps:{onBackdropClick:function(){i({type:"RIGHTDRAWER",open:!1})}}},r.a.createElement("div",{className:m.root},y))),p?r.a.createElement(We,{closeAddMem:function(){i({type:"ADDMEM",open:!1})},sendInvite:function(e){d.a.post("/api/groups/"+g+"/members",{userId:e,withCredentials:!0}).then((function(n){1===n.data.status&&(u({type:"ADD_MEMBER",groupId:g,memberId:e}),t(e),a(g))})).catch((function(e){console.log(e)}))},filterResults:function(e){for(var t=[],a=x.map((function(e){return e._id})),n=0;n<e.length;n++){var r=e[n];r._id!==v&&(a.includes(r._id)?r.status="active":w.includes(r._id)||N.includes(r._id)?r.status="pending":r.status="add",t.push(r))}return t}}):"")}var qe=Object(D.a)({root:{display:"flex",flexGrow:1,flexDirection:"column"}});function Ve(e){var t=e.newMessage,a=e.currentGroup,n=e.selected,c=e.updateInvite,o=e.updateMembers,i=e.history,s=e.setUserData,l=qe();return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",{className:l.root},r.a.createElement(xe,{history:i,setUserData:s}),r.a.createElement(Ge,{currentGroup:a}),r.a.createElement(Re,{onConfirm:t,selected:n})),r.a.createElement(He,{currentGroup:a,updateInvite:c,updateMembers:o}))}var Je,Ke=a(117),Xe=a.n(Ke),$e=Object(D.a)({root:{display:"flex",height:"100vh",width:"100vw"},middle:{display:"flex",flexGrow:1,flexDirection:"column"}});var Qe=function(e){var t=e.username,a=e.loggedIn,c=e.setUserData,o=$e(),i=Object(l.g)(),u=Object(n.useContext)(Q),m=u.chatData,p=u.chatDispatch,f=Object(n.useState)(!1),g=Object(s.a)(f,2),v=g[0],E=g[1];Object(n.useEffect)((function(){a?d.a.get("/api/actions/data",{withCredentials:!0}).then((function(e){p({type:"INIT",payload:e.data}),E(!0)})):i.push("/")}),[i,a,p]),Object(n.useEffect)((function(){v&&((Je=Xe()()).on("message",(function(e,t){p({type:"NEW_MSG",room:e,message:t})})),Je.on("update_pendinglist",(function(){d.a.get("/api/users/pendinginvites",{withCredentials:!0}).then((function(e){1===e.data.status&&p({type:"UPDATE_PENDING",payload:e.data.data})})).catch((function(e){return console.log(e)}))})),Je.on("update_memberlist",(function(e){d.a.get("/api/groups/"+e+"/members",{withCredentials:!0}).then((function(t){console.log(t),1===t.data.status&&p({type:"UPDATE_MEMBERS",groupId:e,payload:t.data.data})})).catch((function(e){return console.log(e)}))})),Je.on("connect",(function(){m.groups.forEach((function(e){Je.emit("room",e._id)})),Je.emit("user",m.user._id)})))}),[v]);var b=function(e){Je.emit("update_memberlist",e)};return v?r.a.createElement("div",{className:o.root},r.a.createElement(re,{username:t,joinRoom:function(e){Je.emit("room",e)},updateMembers:b}),m.groups.length>0?r.a.createElement(Ve,{currentGroup:m.groups[m.selected.index],newMessage:function(e){var t={id:m.user._id,text:e,time:new Date};Je.emit("message",m.selected._id,t),p({type:"NEW_MSG",room:m.selected._id,message:t})},updateMembers:b,selected:m.selected,updateInvite:function(e){Je.emit("update_pendinglist",e)},history:i,setUserData:c}):""):r.a.createElement("div",null,r.a.createElement("h1",null,"Loading"))};a(191);var Ye=function(){var e=Object(n.useState)({loggedIn:!1}),t=Object(s.a)(e,2),a=t[0],c=t[1];return Object(n.useEffect)((function(){d.a.get("/api/actions/loggedon",{withCredentials:!0}).then((function(e){return c(e.data)})).catch((function(e){return console.log(e)}))}),[]),r.a.createElement(l.d,null,r.a.createElement(l.b,{exact:!0,path:"/"},r.a.createElement(g,Object.assign({},a,{setUserData:c}))),r.a.createElement(l.b,{exact:!0,path:"/chat"},r.a.createElement(Y,null,r.a.createElement(ae,null,r.a.createElement(Qe,Object.assign({},a,{setUserData:c}))))),r.a.createElement(l.b,{exact:!0,path:"/users/new"},r.a.createElement(v,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(i.a,null,r.a.createElement(Ye,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[128,1,2]]]);
//# sourceMappingURL=main.4897207c.chunk.js.map