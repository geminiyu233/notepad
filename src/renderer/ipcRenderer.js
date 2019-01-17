const {
  remote,
  ipcRenderer
} = require("electron");
const {
  Menu,
  MenuItem,
  dialog
} = remote;
const fs = require("fs");
const textarea = document.getElementById("textarea");

// 右键textarea菜单
const menu = new Menu();
menu.append(new MenuItem({
  label: "全选",
  role: "selectall"
}));
menu.append(new MenuItem({
  type: "separator"
}));
menu.append(new MenuItem({
  label: "勾选",
  type: "checkbox",
  checked: true
}));
textarea.addEventListener(
  "contextmenu",
  e => {
    e.preventDefault();
    menu.popup({
      window: remote.getCurrentWindow()
    });
  },
  false
);

// 是否已保存， 当前文档路径
let isSaveed, currentFilePath;

// 初始化记事本
function initNotepad() {
  document.title = "新建文件.txt";
  isSaveed = false;
  currentFilePath = "";
}
initNotepad();

// 如果没有保存，文档右上角有*
textarea.oninput = function () {
  if (isSaveed) document.title += " *";
  isSaveed = false;
};

// 监听主进程
ipcRenderer.on("actions", (event, data) => {
  switch (data) {
    case "new":
      // 新建
      isSaveFile();
      break;
    case "open":
      // 打开
      // 1、询问是否保存当前文档
      isSaveFile();
      // 2、选择路径，读取文件内容到记事本
      dialog.showOpenDialog({
          properties: ["openFile"]
        },
        filePaths => {
          if (filePaths) {
            textarea.value = fs.readFileSync(filePaths[0]);
          }
        }
      );
      break;
    case "save":
      // 保存
      saveFilePath();
      break;
    case "exit":
      // 退出
      isSaveFile();
      ipcRenderer.send('exit-app');
  }
});

/**
 * 询问是否保存已有内容
 * 是-执行保存功能-初始化记事本；
 *
 */
function isSaveFile() {
  if (!isSaveed) {
    const index = dialog.showMessageBox(null, {
      type: "question",
      buttons: ["保存", "不保存"],
      defaultId: 0,
      message: "是否保存文件",
      title: "是否保存文件"
    });
    if (index === 0) {
      saveFilePath();
      textarea.value = "";
      initNotepad();
    }
  } else {
    textarea.value = "";
    initNotepad();
  }
}

/**
 * 判断是否有保存路径
 * 有- 直接保存
 * 无 - 选择路径
 *
 */
function saveFilePath() {
  if (!currentFilePath) {
    const filePaths = dialog.showSaveDialog({
      defaultPath: "新建文件.txt",
      filters: [{
        name: "All Files",
        extensions: ["*"]
      }]
    });
    if (filePaths) {
      currentFilePath = filePaths;
      fs.writeFileSync(currentFilePath, textarea.value);
      isSaveed = true;
      document.title = currentFilePath;
    }
  } else {
    fs.writeFileSync(currentFilePath, textarea.value);
    isSaveed = true;
    document.title = currentFilePath;
  }
}