function encode() {
  var output = encodePHP(editor.getValue());
  document.getElementById("output").value = output;
  document.getElementById("stats").innerHTML = output.length + " chars";
}

document.getElementById("encode").onclick = encode;

function copy() {
  let textarea = document.getElementById("output");
  textarea.select();
  document.execCommand("copy");
}
editor.setValue("<?php\n\techo \"Hello World\";\n?>");
encode();

document.getElementById("copy").onclick = copy;