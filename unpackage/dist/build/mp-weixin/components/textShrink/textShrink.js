(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/textShrink/textShrink"],{"20e9":function(e,t,n){},2529:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n={props:{content:{type:String,default:"視劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩劇60年大系·人物卷》。2019年7月28日，文章宣布和馬伊琍離婚，兩，兩人育有兩女"},line:{type:Number,default:2},className:{type:String,default:"azhen-Shrink"}},data:function(){return{shrinkNode:[],normalNode:[],isOpen:!0,btnVisible:!0}},mounted:function(){var t=this,n=e.createSelectorQuery().in(this);n.selectAll(".textShrink").fields({size:!0},(function(e){e.forEach((function(e){t.shrinkNode.push(e.height)}))})),n.selectAll(".textNormal").fields({size:!0},(function(e){console.log(e),e.forEach((function(e){t.normalNode.push(e.height)})),t.btnVisible=t.isOpen=t.normalNode[0]>t.shrinkNode[0]})).exec()},methods:{toggleHandle:function(){this.isOpen=!this.isOpen}}};t.default=n}).call(this,n("543d")["default"])},"2e51":function(e,t,n){"use strict";var i;n.d(t,"b",(function(){return o})),n.d(t,"c",(function(){return r})),n.d(t,"a",(function(){return i}));var o=function(){var e=this,t=e.$createElement;e._self._c},r=[]},5471:function(e,t,n){"use strict";(function(e){n("10c2");i(n("66fd"));var t=i(n("ba6f"));function i(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("543d")["createPage"])},9876:function(e,t,n){"use strict";var i=n("20e9"),o=n.n(i);o.a},ba6f:function(e,t,n){"use strict";n.r(t);var i=n("2e51"),o=n("f18b");for(var r in o)"default"!==r&&function(e){n.d(t,e,(function(){return o[e]}))}(r);n("9876");var u,c=n("f0c5"),a=Object(c["a"])(o["default"],i["b"],i["c"],!1,null,"2fd065a6",null,!1,i["a"],u);t["default"]=a.exports},f18b:function(e,t,n){"use strict";n.r(t);var i=n("2529"),o=n.n(i);for(var r in i)"default"!==r&&function(e){n.d(t,e,(function(){return i[e]}))}(r);t["default"]=o.a}},[["5471","common/runtime","common/vendor"]]]);