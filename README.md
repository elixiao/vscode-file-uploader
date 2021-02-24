# File Uploader README

A VSCode plugin for uploading project files to any HTTP server!

## Upload Files by Context Menu

Only three steps:

1. set user/workspace configuration
2. select files or folders
3. right click and choose [Upload Files] menu

![File Uploader](https://img.zlib.cn/screenshot/vscode-file-uploader.gif)

## Upload Files by CodeLens

CodeLens show up when lines starts with `var FileUploader `:

<button>▶ Upload Files</button>

```js
var FileUploader = {
  apiEndpoint: "http://localhost:7001/upload",
  httpHeaders: {
    authorization: "Bearer eyJhbGciOi...",
  },
  fileField: "file",
  formData: {
    name: "keliq",
    age: 12,
    hobbies: ["music", "coding"],
  },
};
```

![Upload File by CodeLens](https://img.zlib.cn/blog/vscode-file-uploader-codeLens-2.png)
