<template>
  <div>
    <el-pagination
        layout="prev,pager,next"
        :total="list.length/20">
    </el-pagination>
    <ul>
      <li v-for="item in list">
        <span>{{ item.name }}</span>
        <span>{{ item.date }}</span>
        <el-button type="danger" icon="el-icon-delete"></el-button>
      </li>
    </ul>
  </div>
</template>

<script>
Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

export default {
  name: "Login",
  props: {api: String},
  data() {
    return {
      list: [
        {
          name: '1',
          date: new Date(new Date().getTime()).format('yyyy-MM-dd')
        }
      ]
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
