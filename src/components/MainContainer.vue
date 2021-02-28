<template>
  <div>
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      style="position: relative;height: 32px"
    >
      <el-breadcrumb-item
        v-for=" (name,key) in splitPath"
        :to="backTo(key)"
      >
        <template v-if="name==='star'">
          收藏
        </template>
        <template v-else-if="name==='disk'">
          我的网盘
        </template>
        <template v-else-if="name==='bin'">
          回收站
        </template>
        <template v-else>
          {{ name }}
        </template>
        <!--判断路径是否存在v-else-->
      </el-breadcrumb-item>
      <div class="menu">
        <el-button @click="toggleSelection()">
          取消选择
        </el-button>
        <el-dropdown>
          <i
            class="el-icon-more-outline"
            style="width: 40px"
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleCreate">
              新建文件夹
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleDownload">
              下载
            </el-dropdown-item>
            <!-- <el-dropdown-item>
               <el-upload
                   multiple
                   class="upload-demo"
                   :file-list="fileList"
                   :auto-upload="true"
                   :show-file-list="false"
                   :on-change="handleChange"
                   :on-remove="handleRemove"
                   :on-preview="handlePreview"
                   :before-remove="beforeRemove"
                   :on-exceed="handleExceed"
                   :data="{'path':this.$route.path+'/'}"
                   :action="this.$store.state.api.post">
                 <span>上传</span>
               </el-upload>
             </el-dropdown-item>-->
            <el-dropdown-item @click.native="handleDelete">
              删除
            </el-dropdown-item>
            <el-dropdown-item @click.native="handleMove">
              移动
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-breadcrumb>
    <!--上传列表，进度-->
    <div class="file-list">
      <div
        v-show="drawer"
        style="display: inline-flex"
      >
        <el-upload
          :style="'height:100%'"
          multiple
          ref="upload"
          class="upload-demo"
          :file-list="fileList"
          :auto-upload="false"
          :show-file-list="true"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :on-preview="handlePreview"
          :before-remove="beforeRemove"
          :on-exceed="handleExceed"
          action="#"
        >
          <!-- :data="{path:this.$route.path+'/',file:fileList}"
          :action="this.$store.state.api.post"-->
          <el-button
            type="primary"
            slot="trigger"
          >
            选取文件
          </el-button>
          <el-button
            type="success"
            @click="submitUpload"
          >
            确认上传
          </el-button>
        </el-upload>
        <!--<el-list :files="fileList"></el-list>-->
      </div>
      <div
        @click="drawer=!drawer"
        class="panel"
      >
        <!--<i class="el-icon-circle-close"></i>-->
        <i :class="{'el-icon-arrow-left':drawer,'el-icon-arrow-right':!drawer}" />
      </div>
    </div>
    <el-table
      border
      :data="tableData"
      ref="multipleTable"
      v-loading="loading"
      tooltip-effect="dark"
      @row-dblclick="enter"
      @row-contextmenu="showMenu"
      @row-click="select"
      style="margin-top: 20px;"
      height="calc(100vh - 136px)"
      @sort-change="changeOrder"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
      />
      <el-table-column
        sortable
        :sort-method="sort"
        prop="nameFormat"
        label="名称"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div
            slot="reference"
            class="name-wrapper "
          >
            <el-image
              v-if="scope.row.url"
              :src="scope.row.url"
              class="icon"
              :preview-src-list="srcList"
            />
            <svg
              class="icon"
              v-else
            >
              <use
                v-if="scope.row.type==='file'"
                xlink:href="#icon-docx"
              />
              <use
                v-else
                xlink:href="#icon-dir"
              />
            </svg>
            {{ scope.row.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="creator"
        label="创建者"
        width="70px"
      />
      <el-table-column
        prop="date"
        label="日期"
        width="150px"
        :sort-method="sort"
        sortable
      >
        <template slot-scope="scope">
          {{ scope.row.dateFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        width="70px"
        :sort-method="sort"
        sortable
      />
    </el-table>
    <r-context
      ref="RContext"
      @hideMenu="hideMenu"
      :target="multipleSelection[0]"
      :handle-delete="handleDelete"
      v-show="menuVisible"
      :handle-download="handleDownload"
      :handle-move="handleMove"
    />
    <choose-folder
      :panel-visible="panelVisible"
      :handle-move="handleMove"
      @on-change="changePanelVisible"
    />
  </div>
</template>
<script>
import axios from "axios";
import ElList from "element-ui/packages/upload/src/upload-list"
import RContext from "@/components/context"
import ChooseFolder from "@/components/chooseFolder"

export default {
  components: {ElList, RContext, ChooseFolder},
  name: 'MainContent',
  data() {
    return {
      regex: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      drawer: false,
      uploadBoardVisible: false,
      path: '',
      order: null,
      orderBy: '',
      tableData: [],
      multipleSelection: [],
      fileList: [],
      progress: 0,
      total: 0,
      loaded: 0,
      loading: false,
      srcList: [],
      menuVisible: false,
      panelVisible: false
    }
  },
  computed: {
    splitPath() {
      return this.$route.path.split('/').filter(i => i).slice(2)
    },
    show() {
      return this.fileList.length > 0
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.loading = true
        axios.get(this.$store.state.api.get, {
          params: {
            path: route.path,
          }
        }).then(this.getFiles)

      },
      immediate: true
    },
  },
  created() {
    this.loading = true
    axios.get(this.$store.state.api.get, {
      params: {
        path: this.$route.path,
      }
    }).then(this.getFiles)
  },
  methods: {
    enter(row) {
      if (row.type === 'dir') {
        this.loading = true
        this.tableData = []
        this.$router.push({
          path: this.$route.path + '/' + row.name
        })
        axios.get(this.$store.state.api.get, {
          params: {
            path: this.$route.path,
          }
        }).then(this.getFiles)
      } else {
        //查看文件
      }
    },
    backTo(k) {
      let t = this.$route.path.split('/').filter(i => i), prefix = ''
      for (let i = 0; i <= k + 2; i++)
        prefix += '/' + t[i]
      return prefix
    },
    sort(a, b) {
      if (this.order === null) {
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        return a[this.orderBy] > b[this.orderBy] ? 1 : -1
      } else {
        if (a.type === 'dir' && b.type !== 'dir') return 1;
        if (a.type !== 'dir' && b.type === 'dir') return -1;
        return a[this.orderBy] > b[this.orderBy] ? 1 : -1
      }
    },
    showMenu(row, column, event) {
      this.select(row)
      this.menuVisible = true
      this.$nextTick(() => {
        this.$refs.RContext.init(row, column, event)
      })
    },
    hideMenu() {
      this.menuVisible = false
      document.removeEventListener('click', this.hideMenu)
    },
    changeOrder(order) {
      this.order = order.order
      this.orderBy = order.prop
    },
    handleChange(file, fileList) {
      this.fileList = fileList
      /* let fl = new FormData()
       this.drawer = true
       this.fileList.forEach(v => {
         fl.append('files', v.raw)
       })
       fl.append('file', file.raw)
       fl.append('username', this.$store.state.me.username)
       fl.append('path', this.$route.path)
       console.log(this.$route.path)
       axios.post(this.$store.state.api.post, fl).then(this.getFiles)*/
    },
    getFiles(result) {
      this.tableData = []
      result = JSON.parse(result.data.fileList)
      result.sort((a, b) => {
        if (a.type === 'dir' && b.type !== 'dir') return -1
        if (a.type !== 'dir' && b.type === 'dir') return 1
        return 0
      })
      result.forEach(v => {
        this.tableData.push({
          date: v.date,
          dateFormat: new Date(v.date).format('yyyy-MM-dd hh:mm:ss'),
          creator: v.creator,
          lastEditedBy: '',
          name: v.name,
          nameFormat: v.name.toLowerCase(),
          path: v.path,
          size: v.size,
          type: v.type,
          url: v.url
        })
      })
      this.tableData.forEach(v => {
        if (this.regex.test(v.name)) this.srcList.push(v.url)
      })
      this.loading = false
    },
    submit() {
      let fl = new FormData()
      this.fileList.forEach(v => {
        fl.append('files', v.raw)
      })
      fl.append('path', this.$route.path + '/')
      axios.post(this.$store.state.api.post, fl).then(res => {
        console.log(res.data.message)
        this.loading = true
        this.getFiles(res)
      })
    },
    submitUpload() {
      const files = this.$refs.upload.uploadFiles
      if (files && files.length) {
        let fl = new FormData()
        this.fileList.forEach(v => {
          fl.append('files', v.raw)
        })
        this.progress = this.loaded = this.total = 0
        fl.append('path', this.$route.path + '/')
        axios.post(this.$store.state.api.post, fl, {
              onUploadProgress: progressEvent => {
                this.progress = Number.parseInt((progressEvent.login / progressEvent.total) * 100)
                this.loaded = progressEvent.loaded
                this.total = progressEvent.total
              },
            }
        ).then(res => {
          console.log(res)
          this.loading = true
          this.getFiles(res)
        })
      } else {
        this.$message.warning('至少选择一个文件')
      }
    },
    select(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleRemove() {
      console.log('remove')
    },
    handlePreview() {
    },
    beforeRemove() {
    },
    handleExceed(files, fileList) {
      console.log(files, fileList)
    },
    handleCreate() {
      this.$prompt('请输入名称', '新建文件夹', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        axios.post(this.$store.state.api.createFolder, {
          path: this.$route.path,
          folderName: value
        }).then(res => {
          if (res.data.message === 'success') {
            this.$message.success('创建成功')
            axios.get(this.$store.state.api.get, {
              params: {
                path: this.$route.path
              }
            }).then(this.getFiles)
          } else this.$message.error('创建失败，请重试')
        })
      })
    },
    handleDownload() {
      this.multipleSelection.forEach(row => {
        axios.get(row.url, {
          responseType: 'blob'
        }).then(res => {
          console.log(res)
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = res.data;
          a.download = row.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        /*const xhr = new XMLHttpRequest();
        xhr.open('get', row.url);
        xhr.responseType = 'blob';
        xhr.send();
        xhr.onload = function () {
          if (this.status === 200 || this.status === 304) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(this.response);
            fileReader.onload = function () {
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = this.result;
              a.download = row.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            };
          }
        };*/
      })
    },
    handleDelete() {
      if (this.multipleSelection.length > 0) {
        let fd = new FormData()
        this.multipleSelection.forEach(v => {
          fd.append('files', v.path)
        })
        fd.append('username', this.$store.state.me.username)
        axios.post(this.$store.state.api.delete, fd).then(res => {
          //提示删除结果

          axios.get(this.$store.state.api.get, {
            params: {
              path: this.$route.path,
            }
          }).then(this.getFiles)
        })
      }
    },
    handleMove() {
      if (this.multipleSelection.length > 0) {
        this.panelVisible = true
        let fd = new FormData()
        this.multipleSelection.forEach(v => {
          fd.append('files', v.path)
        })
        fd.append('username', this.$store.state.me.username)
        return fd
      }
      return null
    },
    changePanelVisible(v) {
      this.panelVisible = v
    },
    handleClose() {
      this.$confirm('确认取消上传？').then(res => upload).catch(res => {
      })
    }
  }
}
</script>
<style>
.el-dropdown-menu__item {
  text-align: center;
}

.upload-demo {
  display: flex;
  flex-direction: column;
}

.menu {
  position: absolute;
  right: 20px;
}

.menu > * {
  margin-left: 20px;
}

td, th {
  border-right: none !important;
  border-color: #dadce0 !important;
}

td div {
  vertical-align: middle;
}

.el-upload-list {
  overflow-y: scroll;
  padding: 20px 0;
  background-color: #eaffea;
}

.file-list {
  /* display: block !important;*/
  z-index: 2;
  bottom: 50px;
  left: 0;
  position: fixed;
  max-height: 300px;
  min-height: 100px;
  display: inline-flex;
}

.panel {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  font-size: 1.5em;
  display: flex;
  align-items: center;
}

.el-table {
  position: relative;
}
</style>

