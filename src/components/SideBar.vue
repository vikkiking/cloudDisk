<template>
  <div>
    <el-col style="width: 256px">
      <el-progress
        :percentage="35.5"
        :format="perc"
        class="capacity"
      />
      <!--<el-menu>
        <el-submenu index="/star">
          <router-link :to="{path:'/user/'+$store.state.me.username+'/star',params:{}}" slot="title">
            <i class="iconfont icon iconstar"></i>
            <span>收藏</span>
          </router-link>
        </el-submenu>
        <el-submenu index="/disk">
          <router-link :to="{path:'/user/'+$store.state.me.username+'/disk'}" slot="title">
            <i class="iconfont icon iconcloudDrive"></i>
            <span>我的网盘</span>
          </router-link>
       <el-submenu v-for="folder in folders" :index="'/'+folder.name">
            <template slot="title">
              <span>{{ folder.name }}</span>
            </template>
            <el-submenu :index="'/'+folder.name+'/'+sub_folder.name"
                        v-for="sub_folder in folder.sub_folders">
              <template slot="title">
                <span>{{ sub_folder.name }}</span>
              </template>
            </el-submenu>
          </el-submenu>
          目录结构

        </el-submenu>
        <el-submenu index="/bin">
          <router-link :to="{path:'/user/'+$store.state.me.username+'/bin'}" slot="title">
            <i class="iconfont icon iconbin"></i>
            <span>回收站</span>
          </router-link>
        </el-submenu>
      </el-menu>-->
      <el-menu>
        <el-menu-item>
          <router-link :to="{path:'/user/'+$store.state.me.username+'/star',params:{}}">
            <i class="iconfont icon iconstar" />
            <span>收藏</span>
          </router-link>
        </el-menu-item>
        <el-menu-item>
          <router-link :to="{path:'/user/'+$store.state.me.username+'/disk'}">
            <i class="iconfont icon iconcloudDrive" />
            <span>我的网盘</span>
          </router-link>
        </el-menu-item>
        <el-menu-item>
          <router-link :to="{path:'/user/'+$store.state.me.username+'/bin'}">
            <i class="iconfont icon iconbin" />
            <span>回收站</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-col>
    <div class="sideBar">
      <router-link
        to="../star"
        slot="title"
      >
        <i class="iconfont icon iconstar" />
      </router-link>
      <router-link
        to="../disk"
        slot="title"
      >
        <i class="iconfont icon iconcloudDrive" />
      </router-link>
      <router-link
        to="../bin"
        slot="title"
      >
        <i class="iconfont icon iconbin" />
      </router-link>
    </div>
  </div>
</template>
<script>

export default {
  computed:
      {
        preDiv(p) {
          return {width: p * 10 + 'px'}
        },
      },
  methods: {
    perc(used) {
      return '已用' + (used / 100 * 15).toFixed(2) + 'GB/15GB'
    }
  }
}
</script>
<style>
@import "../assets/iconfont/iconfont.css";

.el-menu-item a {
  width: 100%;
  display: block;
}
.el-aside {
  text-align: center;
  position: relative;
  overflow-x: hidden !important;
}

.sideBar {
  width: 60px;
  height: 100%;
  padding-top: 20px;
}

.sideBar i {
  width: 60px;
  height: 60px;
  float: left;
}

@media screen and (max-width: 900px) {
  .el-aside {
    width: 60px !important;
  }

  .el-aside .el-col {
    display: none;
  }

  .el-main {
    width: calc(100% - 1000px) !important;
  }

  .sideBar {
    display: block;
  }
}

@media screen and (min-width: 900px) {
  .el-aside {
    display: block;
  }

  .sideBar {
    display: none;
  }
}

.iconfont + span {
  margin-left: 24px;
}

.el-submenu__title, .el-menu-item {
  text-align: left;
}

.el-submenu__title a {
  display: block;
  width: 100%
}

.el-menu {
  border: none !important;
}

.capacity {
  margin-top: 20px;
}

.capacity::after {
  border-bottom: 1px solid #dadce0;
  content: '';
  display: block;
  margin: 20px 0;
}
</style>
