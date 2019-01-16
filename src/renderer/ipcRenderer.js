const { remote, ipcRenderer } = require('electron');
const { Menu, MenuItem, dialog } = remote;
const fs = require('fs')
const textarea = document.getElementById('textarea');

// 右键textarea菜单
const menu = new Menu();
menu.append(new MenuItem({ label: '全选', role: 'selectall' }));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: '勾选', type: 'checkbox', checked: true }));
textarea.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  menu.popup({ window: remote.getCurrentWindow() })
}, false);

// 打开
// 1、打开文件，2、fs读取文件，3、获取的内容赋值给文本框
ipcRenderer.on('actions', (event, data) => {
  switch(data) {
    case 'open':
      dialog.showOpenDialog({
        properties: ['openFile']
      }, (filePaths) => {
        textarea.value = fs.readFileSync(filePaths[0]);
      });
      break;
    case 'save':
      dialog.showSaveDialog({
        // defaultPath: 'aaa.txt',
        filters: [{
          name: 'All Files', extensions: ['*']
        }]
      }, (filePaths) => {
        fs.writeFile(filePaths, textarea.value, (err) => {
          console.log(err)
        })
      })
      break;
  }
})
