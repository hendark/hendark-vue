// import nodeResolve from '@rollup/plugin-node-resolve';
import { parseHTML } from "./parse";
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function genProps(attrs) {
  let strs = [];
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === "style") {
      const obj = attr.value.split(";").reduce((pre, cur) => {
        const [key, value] = cur.split(":");
        if (key !== "") {
          pre[key] = value?.trim();
        }
        return pre;
      }, {});
      attr.value = obj;
    }
    strs.push(`${attr.name}:${JSON.stringify(attr.value)}`);
  }
  return `{${strs.join(",")}}`;
}

function gen(node) {
  if (node.type === 1) {
    return codegen(node);
  } else {
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}

function genChildren(children) {
  return children.map((child) => gen(child)).join(",");
}

function codegen(ast) {
  let children = genChildren(ast.children);
  let attrs = genProps(ast.attrs);
  let code = `_c(${JSON.stringify(ast.tag)},${
    ast.attrs.length > 0 ? attrs : "null"
  }${ast.children.length ? `,${children}` : ""})`;

  return code;
}

export function compileToFunction(template) {
  // 1.将template转成ast语法树
  let ast = parseHTML(template);

  // 2.生成render函数，返回虚拟dom
  let h = codegen(ast);

  let code = `with(this){return ${h}}`;
  let render = new Function(code);
  return render;
}
