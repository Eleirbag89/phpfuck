function toBytesArray(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

const zero = "([]^[])";
const one = "([]^[[]])";
const array = "[]";
const array_str = "[].[]";

const number = (n) => {
  if (n == 0) {
    return zero;
  }
  let value = zero;
  for (let i = 0; i < n; i++) {
    value = `${value}+${one}`;
  }
  return value;
};

const map = {};

map.A = `(${array_str})[${number(0)}]`;
map.r = `(${array_str})[${number(1)}]`;
map.a = `(${array_str})[${number(3)}]`;
map.y = `(${array_str})[${number(4)}]`;
map.c = `(${zero}.${zero}^${number(2)}.${zero}^(${map.a}))`;
map.h = `(${number(1)}.${zero}^(${map.A})^(${map.a})^(${map.y}))`;

const fromString = s => s.split('').map(x => {
  if (!(x in map)) {
    const parsedChars = []
    toBytesArray(x).forEach(b => parsedChars.push(`(${fromString("chr")})(${number(b)})`));
    return `(${parsedChars.join('.')})`;

  }
  return map[x];
}).join('.');

function escape(str) {
  const regexComment = /\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g
  str.replaceAll(regexComment, "");
  str = str.trim();
  str = str.replace(/^(<\?php)/, "");
  str = str.replace(/^(<\?)/, "");
  str = str.replace(/(\?>)$/, "");
  str = str.replaceAll("\n", '');
  str = str.replaceAll("\r", '');
  str = str.replaceAll("\t", '');
  str = str.replaceAll('\\"', '\\\\"');
  str = str.replaceAll('"', '\\"');


  str = '"' + str + '"';
  console.log(str);
  return str;
}

function encodePHP(code) {
  code = escape(code);

  const json_decode_func = `(${fromString("json_decode")})(${fromString('["",')}.${fromString(code)}.${fromString("]")})`;
  return `<?php\n(${fromString("create_function")})(...${json_decode_func})()\n?>`;
}