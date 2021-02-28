<template>
  <div id="Context">
    <el-menu>
      <el-menu-item @click.native="handleDownload">
        下载
      </el-menu-item>
      <el-menu-item @click.native="handleDelete">
        删除
      </el-menu-item>
      <el-menu-item @click.native="handleRename">
        重命名
      </el-menu-item>
      <el-menu-item @click.native="handleMove">
        移动
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RContext",
  props: {
    target: Object,
    handleDelete: Function,
    handleDownload: Function,
    handleMove: Function
  },
  methods: {
    init(row, column, event) {
      let menu = document.querySelector('#Context'),
          temp = document.body.clientHeight - event.clientY
      if (temp < 250)
        menu.style.top = event.clientY - 112 + 'px'
      else menu.style.top = event.clientY + 'px'
      menu.style.left = event.clientX + 10 + 'px'
      document.addEventListener('click', this.hideMenu)
    },
    hideMenu() {
      this.$emit('hideMenu')
    },
    handleRename() {
      this.$prompt('请输入新名称', '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        axios.post(this.$store.state.api.rename, {
          path: this.target.path,
          newName: value
        }).then(res => {
          if (res.data.message === 'success') {
            this.$message.success('修改成功')
          } else this.$message.error('修改失败')
        })
      })/*.catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })*/
    }
  }
}
</script>

<style scoped>
#Context {
  position: absolute;
  width: 82px !important;
  z-index: 1000;
}

#Context .el-menu {
  border-radius: 8px;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
  0 3px 14px 2px rgba(0, 0, 0, 0.12),
  0 5px 5px -3px rgba(0, 0, 0, 0.20)
}

#Context li {
  height: 2em !important;
  line-height: 2em !important;
}
</style>
