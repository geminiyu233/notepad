const { app, Menu, shell, ipcMain } = require('electron');

let template = [{
    label: '文件',
    submenu: [{
        label: '新建',
        accelerator: 'Ctrl+N',
        click: (menuItem, browserWindow, event) => {
          // 1、主进程通知渲染进程进行新建操作
          browserWindow.webContents.send('actions', 'new');
        }
      },
      {
        label: '打开',
        accelerator: 'Ctrl+O',
        click: (menuItem, browserWindow, event) => {
          // 1、主进程通知渲染进程进行打开操作
          browserWindow.webContents.send('actions', 'open');
        }
      },
      {
        label: '保存',
        accelerator: 'Ctrl+S',
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send('actions', 'save');
        }
      },
      {
        label: '打印',
        accelerator: 'Ctrl+P',
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.print();
        }
      },
      {
        type: 'separator'
      },
      {
        label: '退出',
        accelerator: 'Ctrl+W',
        click: (menuItem, browserWindow, event) => {
          browserWindow.webContents.send('actions', 'exit');
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [{
        label: '撤销',
        role: 'undo'
      },
      {
        label: '恢复',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: '剪切',
        role: 'cut'
      },
      {
        label: '复制',
        role: 'copy'
      },
      {
        label: '粘贴',
        role: 'paste'
      },
      {
        label: '删除',
        role: 'delete'
      },
      {
        label: '全选',
        role: 'selectall'
      }
    ]
  },
  {
    label: '视图',
    submenu: [{
        label: '缩小',
        role: 'zoomin'
      },
      {
        label: '放大',
        role: 'zoomout'
      },
      {
        label: '重置缩放',
        role: 'resetzoom'
      },
      {
        label: '全屏',
        role: 'togglefullscreen'
      }
    ]
  },
  {
    label: '帮助',
    submenu: [{
        label: '关于',
        click: () => {
          shell.openExternal('https://www.baidu.com');
        }
      },

      {
        label: '重新加载',
        role: 'forcereload'
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

ipcMain.on('exit-app', () => {
  app.quit();
})