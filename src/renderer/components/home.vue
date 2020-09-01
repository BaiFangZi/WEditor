<template>
  <div id="editor"></div>
</template>

<script>
import "codemirror/lib/codemirror.css"; // codemirror
import "tui-editor/dist/tui-editor.css"; // editor ui
import "tui-editor/dist/tui-editor-contents.css"; // editor content

import Editor from "tui-editor";

import {
  createImgFile,
  openFile,
  saveFile,
  quit,
} from "@/utils/fileOperations.js";
import { ipcRenderer } from "electron";
export default {
  name: "home",
  data() {
    return {
      // textValue: "",
      imgData: "",
      imgID: 0,
      clientHeight: window.innerHeight,
      // title: ''
    };
  },
  created() {
    ipcRenderer.on("open", (e, filePath) => {
      let value = openFile(filePath);
      this.tuieditor.setValue(value);
    });
    ipcRenderer.on("save", (e, filePath) => {
      saveFile(this.tuieditor.getValue());
    });
    ipcRenderer.on("quit", (e, filePath) => {
      quit(this.tuieditor.getValue(), e);
      // quit(this.tuieditor.getValue(), (result) => {
      //   if (result != 1) {
      //     e.sender.send("quit-reply", result);
      //   } else {
      //     saveFile(this.tuieditor.getValue());
      //     e.sender.send("quit-reply", 1);
      //   }
      // });
    });
  },
  mounted() {
    this.initEditor();
    window.onresize = () => {
      document.querySelector("#editor").style.height =
        window.innerHeight - 32 + "px";
    };
    this.timingSave(30); //定时保存 单位 秒
    this.onChange();
  },
  destroyed() {
    if (!this.tuieditor) return;
    this.tuieditor.remove();
  },
  methods: {
    onPaste(e) {
      //图片复制的相关操作，
      let _this = this;
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      const item = e.clipboardData.items[0];
      if (item.kind === "file") {
        var pasteFile = item.getAsFile();
        var reader = new FileReader();
        reader.readAsDataURL(pasteFile);
        reader.onload = function(e) {
          const path = createImgFile(
            this.result,
            _this.$store.state.filePath,
            _this.imgID++
          );
          // _this.textValue += `![文本](${path})`;
        };
      }
    },
    initEditor() {
      this.$store.commit("setPath", "");
      // this.$store.commit("setValue", "");
      this.$store.commit("setSaveFlag", true);

      if (this.$el) {
        this.tuieditor = new Editor({
          el: document.querySelector("#editor"),
          initialEditType: "markdown",
          previewStyle: "vertical",
          height: this.clientHeight - 32 + "px",
        });
      }
      if (this.value) {
        this.tuieditor.setValue(this.value);
      }
    },
    timingSave(seconds) {
      setInterval(() => {
        if (this.$store.state.filePath) {
          saveFile(this.tuieditor.getValue());
          // this.onSave();
        }
      }, 1000 * seconds);
    },
    onChange() {
      let _this = this;
      document
        .querySelector(".te-editor .CodeMirror textarea")
        .addEventListener("input", function() {
          _this.$store.commit("setSaveFlag", false);
        });
    },
  },
  watch: {
    // "$store.state.textValue": function(newValue, oldValue) {
    //   // this.textValue = this.$store.state.textValue;
    // },
    "$store.state.saveFlag": function(newValue, oldValue) {
      if (newValue) {
        document.title = `WEditor ${this.$store.state.filePath}  `;
      } else {
        if (this.$store.state.filePath == "") {
          document.title = `WEditor new-file 正在编辑...`;
        } else {
          document.title = `WEditor ${this.$store.state.filePath} 正在编辑...`;
        }
      }
    },
  },
};
</script>

<style></style>
