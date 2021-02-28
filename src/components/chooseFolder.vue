<template>
  <el-dialog
    :visible.sync="currentVisible"
    id="choosePanel"
    :close-on-click-modal="false"
  >
    <el-tree
      :props="props"
      :load="loadNode"
      :highlight-current="true"
      @node-click="choose"
      accordion
      lazy
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="submit"
      >移至此</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    panelVisible: {
      type: Boolean,
      default: false
    },
    handleMove: Function,
  },
  data() {
    return {
      props: {
        label: 'name',
        //children: 'zones',
        //isLeaf:'leaf'
      },
      path: '',
      currentVisible: this.panelVisible
    }
  },
  watch: {
    panelVisible(v) {
      this.currentVisible = v
    },
    currentVisible(v) {
      this.$emit('on-change', v)
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.path = '/user/' + this.$store.state.me.username + '/disk'
        return resolve([{name: '我的网盘', path: this.path}])
      }
      //if (node.level > 1) return resolve([])
      setTimeout(() => {
        axios.get(this.$store.state.api.get, {
          params: {
            path: this.path
          }
        }).then(res => {
          res = JSON.parse(res.data.fileList)
          let data = []
          res.forEach(v => {
            if (v.type === 'dir')
              data.push({
                name: v.name,
                path: v.path
              })
          })
          resolve(data)
        })
      }, 200)
    },
    choose(cur) {
      this.path = cur.path
    },
    submit() {
      if (this.path === '') this.$message.warning('请选择一个目标文件夹')
      else {
        let fd = this.handleMove()
        fd.append('to', this.path)
        axios.post(this.$store.state.api.move, fd).then(res => {
          if (res.data.message === 'success')
            this.$message.success('success')
          else this.$message.error('failed')
        })
        this.currentVisible = false
      }
    }
  }
}
</script>

<style scoped>

</style>
