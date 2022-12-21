const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
// 匹配属性值， key = "value"|'value'|value
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// v- @ : #
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
// a-z|A-Z|_ 可以有:
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
//匹配开始标签名<xxx a-z|A-Z|_开头
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配<div> <div/>
const startTagClose = /^\s*(\/?)>/;
// 匹配结束标签名</开头，a-z|A-Z|_然后是含数字字母_...结尾>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// {{msg}} 可以有空格
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
function parseHTML(html) {
  const ELEMENT_TYPE = 1;
  const TEXT_TYPE = 2;
  const stack = [];
  let curParent;
  let root;

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    };
  }

  // 构建ast树
  function start({ tag, attrs }) {
    let node = createASTElement(tag, attrs);
    if (!root) {
      root = node;
    }
    if (curParent) {
      node.parent = curParent;
      curParent.children.push(node)
    }
    stack.push(node);
    curParent = node;
  }
  function onText(text) {
    text = text.replace(/\s/g, "");
    if(text!==''){
      curParent.children.push({
        type: TEXT_TYPE,
        text,
        parent: curParent,
      });
    }
  }
  function end(tag) {
    const endTag = stack.pop();
    if (tag !== endTag.tag) {
      console.error("标签不合法", tag, endTag);
    }
    curParent = stack[stack.length - 1];
  }

  function advance(len) {
    html = html.substring(len);
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tag: start[1],
        attrs: [],
      };
      advance(start[0].length);
      // 非结束标签
      let end;
      while (!(end = html.match(startTagClose))) {
        const attr = html.match(attribute);
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        });
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }

  //匹配从startTagOpen attribute startTagClose defaultTagRE endTag
  while (html) {
    let textEnd = html.indexOf("<");
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch);
        continue;
      }

      let endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    }
    // 解析的文本
    if (textEnd > 0) {
      let text = html.substring(0, textEnd);
      if (text) {
        onText(text);
        advance(text.length);
      }
    }
  }
}

export function compileToFunction(template) {
  // 1.将template转成ast语法树
  let ast = parseHTML(template);
  // 2.生成render函数，返回虚拟dom
}
