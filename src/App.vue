<template>
  <div id="app">
    <top-bar/>
    <el-container>
      <el-aside
          width="256px"
          style="height: 100%"
      >
        <side-bar/>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'
import MainContainer from '@/components/MainContainer'


export default {
  components: {MainContainer, SideBar, TopBar},
}

</script>

<style>
@import "../public/css/public.css";
@import "../public/css/diskIcon/iconfont.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
}

body {
  margin: 0;
}

.el-main {
  padding-bottom: 0 !important;
}
</style>
