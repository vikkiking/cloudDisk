<template>
  <div>
    <div style="margin: 20px 0">
      <el-pagination
          layout="prev,pager,next,jumper"
          :total="total"
          :page-size="15"
          style="display: inline-block"
          :current-page.sync="currentPage"
      >
      </el-pagination>
      <span style="display: inline-block;float: right">
      <el-button type="success" @click="handlePass">通过</el-button>
      <el-button type="danger" @click="handleDelete">删除</el-button>
    </span>
    </div>
    <el-table
        border
        :data="currentTable"
        ref="multipleTable"
        v-loading="loading"
        tooltip-effect="dark"
        @row-click="select"
        @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
      />
      <el-table-column
          sortable
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
              <use xlink:href="#icon-docx"/>
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
          sortable
      >
        <template slot-scope="scope">
          {{ scope.row.dateFormat }}
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>

const axios = require("axios");
let date = new Date().getTime()
export default {
  props: {api: String},
  data() {
    return {
      regex: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      tableData: [],
      multipleSelection: [],
      loading: false,
      currentPage: 1,
      srcList: []
    }
  },
  computed: {
    currentTable() {
      let t = this.tableData.slice(15 * (this.currentPage - 1), 15 * this.currentPage - 1)
      this.srcList = []
      t.forEach(v => {
        this.srcList.push(v.url)
      })
      return t
    },
    total() {
      return this.tableData.length
    }
  },
  created() {
    /*function randomString(e) {
      e = e || 32;
      let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
          a = t.length,
          n = "";
      for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
      return n
    }*/
    axios.get(this.api).then(this.getFiles)
    /* for (let i = 0; i < 3000; i++) {
       let name = randomString(Math.random() * 50+5)
       this.tableData.push({
         date: date,
         dateFormat: new Date(date).format('yyyy-MM-dd'),
         creator: 'me',
         lastEditedBy: '',
         name: name,
         nameFormat: name.toLowerCase(),
         path: '',
         url: 'http://120.25.105.43:10219/avatars/1.jpg'
       })
     }*/
  },
  methods: {
    getFiles(result) {
      this.tableData = []
      result = JSON.parse(result.data.fileList)
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
    select(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    singleSelect(row) {
      this.$refs.multipleTable.clearSelection()
      this.select(row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelete() {
      if (this.multipleSelection.length > 0) {
        let fd = new FormData()
        this.multipleSelection.forEach(v => {
          fd.append('files', v.path)
        })
        fd.append('role', 'admin')
        fd.append('admin', this.$store.state.admin.adminName)
        axios.post(this.$store.state.api.delete, fd).then(res => {
          //提示删除结果
          axios.get(this.$store.state.api.pendingList, {
            params: {
              path: this.$route.path,
            }
          }).then(this.getFiles)
        })
      }
    },
    handlePass() {
      if (this.multipleSelection.length > 0) {
        let fd = new FormData()
        this.multipleSelection.forEach(v => {
          fd.append('files', v.path)
        })
        fd.append('role', 'admin')
        axios.post(this.$store.state.api.pass, fd).then(res => {
          axios.get(this.$store.state.api.pendingList, {
            params: {
              path: this.$route.path,
            }
          }).then(this.getFiles)
        })
      }
    }
  }
}
</script>

<style>

.el-table {
  width: 100%;
}

td, th {
  border-right: none !important;
}

td div {
  vertical-align: middle;
}

.el-image {
  width: 20px;
  height: 20px;
}
</style>
