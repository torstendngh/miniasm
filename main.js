var htmlTemplateStr = "DLOAD 8\n"
+"STORE 1\n"
+"STORE 2\n"
+"DLOAD 1\n"
+"STORE 3\n"
+"DLOAD 3\n"
+"STORE 4\n"
+"JEQ 21\n"
+"SUB 3\n"
+"JEQ 19\n"
+"STORE 4\n"
+"LOAD 1\n"
+"MULT 2\n"
+"STORE 1\n"
+"LOAD 4\n"
+"SUB 3\n"
+"STORE 4\n"
+"JGT 12\n"
+"LOAD 1\n"
+"JUMP 22\n"
+"LOAD 3\n"
+"END"

var codeEditor = document.getElementById('codeEditor');
var lineCounter = document.getElementById('lineCounter');

var lineCountCache = 0;
function line_counter() {
  var lineCount = codeEditor.value.split('\n').length;
  var outarr = new Array();
  if (lineCountCache != lineCount) {
    for (var x = 0; x < lineCount; x++) {
      outarr[x] = (x + 1) + " ";
    }
    lineCounter.value = outarr.join('\n');
  }
  lineCountCache = lineCount;
}

codeEditor.addEventListener('scroll', () => {
  lineCounter.scrollTop = codeEditor.scrollTop;
  lineCounter.scrollLeft = codeEditor.scrollLeft;
});

codeEditor.addEventListener('input', () => {
  line_counter();
});

codeEditor.addEventListener('keydown', (e) => {
  let { keyCode } = e;
  let { value, selectionStart, selectionEnd } = codeEditor;

  if (keyCode === 9) {  // TAB = 9
    e.preventDefault();
    codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
    codeEditor.setSelectionRange(selectionStart+2, selectionStart+1)
  }
});

codeEditor.value = htmlTemplateStr;
line_counter();

function parse() {

  let A = 0;
  let R = [];
  let table = [];

  let code = document.getElementById("codeEditor");
  let commands = code.value.split("\n");
  let tempCommands = commands
  commands = []
  for (let c of tempCommands) {
    c = c.split(" ")
    commands.push(c)
  }

  runCommand(0)

  function runCommand(i) {

    console.log(R)

    if (commands.length <= i) return

    let com = commands[i][0]
    let x = commands[i][1]-1

    let dataset = []
    dataset.push(i+1)
    dataset.push(com + (!isNaN(x) ? (" " + (x+1)) : ""))
    dataset.push(A)
    dataset.push(R.join(" "))
    table.push(dataset)

    switch (com) {
      case "LOAD":
        A = R[x];
        break;
      case "DLOAD":
        A = x+1;
        break;
      case "STORE":
        R[x] = A;
        break;
      case "STORE":
        R[x] = A;
        break;
      case "ADD":
        A = A + R[x];
        break;
      case "SUB":
        A = A - R[x];
        break;
      case "MULT":
        A = A * R[x];
        break;
      case "DIV":
        A = A / R[x];
        break;
      case "JUMP": {
          runCommand(x)
          return
        }
        break;
      case "JGE":
        if(A >= 0) {
          runCommand(x)
          return
        }
        break;
      case "JGT":
        if(A > 0) {
          runCommand(x)
          return
        }
        break;
      case "JLE":
        if(A <= 0) {
          runCommand(x)
          return
        }
        break;
      case "JLT":
        if(A < 0) {
          runCommand(x)
          return
        }
        break;
      case "JEQ":
        if(A == 0) {
          runCommand(x)
          return
        }
        break;
      case "JNE":
        if(A != 0) {
          runCommand(x)
          return
        }
        break;
      case "END":
        end()
        break;
    }

    function end() {
      document.getElementById("table-header").innerHTML = `
        <th>Line</th>
        <th>Command</th>
        <th>A</th>
      `

      for (let i = 0; i < R.length; i++) {
        document.getElementById("table-header").innerHTML += `<th>R${i+1}</th>`
      }

      for (let entry of table) {
        entry[3] = entry[3].split(" ")
        let rhtml = ``
        for (let i = 0; i < entry[3].length; i++) {
          rhtml += `<td class="mem">${entry[3][i]}</td>`
        }
        document.getElementById("table-body").innerHTML += `
          <tr>
            <td>${entry[0]}</td>
            <td class="tb-command">${entry[1]}</td>
            <td class="acum">${entry[2]}</td>
            ${rhtml}
          </tr>
        `
      }
    }

    if (com != "END") {
      runCommand(i+1)
    }
  }
}

document.getElementById("run-button").onclick = () => {
  document.getElementById("table-body").innerHTML = "";
  parse()
  showToast()
}

function showToast() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
