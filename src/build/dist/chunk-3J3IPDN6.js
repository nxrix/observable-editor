function v(c){for(var i=[],o=1;o<arguments.length;o++)i[o-1]=arguments[o];var n=Array.from(typeof c=="string"?[c]:c);n[n.length-1]=n[n.length-1].replace(/\r?\n([\t ]*)$/,"");var p=n.reduce(function(r,l){var e=l.match(/\n([\t ]+|(?!\s).)/g);return e?r.concat(e.map(function(g){var t,a;return(a=(t=g.match(/[\t ]/g))===null||t===void 0?void 0:t.length)!==null&&a!==void 0?a:0})):r},[]);if(p.length){var f=new RegExp(`
[	 ]{`.concat(Math.min.apply(Math,p),"}"),"g");n=n.map(function(r){return r.replace(f,`
`)})}n[0]=n[0].replace(/^\r?\n/,"");var u=n[0];return i.forEach(function(r,l){var e=u.match(/(?:^|\n)( *)$/),g=e?e[1]:"",t=r;typeof r=="string"&&r.includes(`
`)&&(t=String(r).split(`
`).map(function(a,h){return h===0?a:"".concat(g).concat(a)}).join(`
`)),u+=t+n[l+1]}),u}export{v as a};
