<template>
  <el-container>
    <el-aside :width="show?'60px':'172px'">
      <img src="./logo_admin.png" alt />
      <el-menu
        id="outside"
        text-color="#919399"
        active-text-color="#ffffff"
        background-color="#363b4d"
        :collapse="show"
        :collapse-transition="false"
      >
        <el-menu-item index="1" :style="{width:show?'60px':'172px'}">
          <i class="iconfont icon-index"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:show?'60px':'172px'}">
          <template slot="title">
            <i class="iconfont icon-neirong"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item-group id="inside">
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              发布文章
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              内容列表
            </el-menu-item>
            <el-menu-item index="2-3">
              <i class="el-icon-menu"></i>
              评论列表
            </el-menu-item>
            <el-menu-item index="2-4">
              <i class="el-icon-menu"></i>
              素材管理
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3" :style="{width:show?'60px':'172px'}">
          <i class="iconfont icon-fensi"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="4" :style="{width:show?'60px':'172px'}">
          <i class="iconfont icon-shezhi"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div id="lf">
          <i
            @click="show=!show"
            style="cursor:pointer;"
            :class="show? 'el-icon-s-unfold':'el-icon-s-fold'"
          ></i>
          <span>江苏传智播客教育科技股份有限公司</span>
        </div>
        <div id="rg">
          <el-input type="text" placeholder="请输入搜索的文章内容" style="width:240px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <span id="message">消息</span>
          <!-- <div id="account"> -->
          <el-dropdown trigger="click">
            <span id="user" class="el-dropdown-link">
              <el-avatar :size="40" :src="photo"></el-avatar>
              {{ name }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>Git地址</el-dropdown-item>
              <el-dropdown-item divided @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- </div> -->
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '@/assets/iconfont/iconfont.css'
export default {
  data () {
    return {
      show: false
    }
  },
  computed: {
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    },
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    }
  },
  methods: {
    logout () {
      this.$confirm('确定要退出系统吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '您已退出账号!',
            duration: '1000'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  img {
    display: block;
    margin: 22px 10px;
    width: 150px;
    height: 36px;
  }
  .el-aside {
    width: 100%;
    height: 100%;
    background-color: #2e2f32;
    transition: 0.7s;
  }
  height: 100%;
  #outside {
    width: 100% !important;
    // background-color: #589df8;
    transition: 0.7s !important;
    .el-menu-item.is-active {
      width: 100% !important;
      background-color: #589df8 !important;
    }
    i {
      padding-right: 10px;
    }
    #inside {
      width: 100% !important;
      li {
        background-color: #333744 !important;
      }
      .el-menu-item.is-active {
        background-color: #589df8 !important;
      }
      i {
        width: 0px;
        padding-right: 14px;
        vertical-align: -2px;
      }
    }
  }
}
.el-header {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  #lf {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #2c3e50;
    span {
      padding-left: 8px;
    }
    .el-icon-s-fold,
    .el-icon-s-unfold {
      font-size: 22px;
    }
  }
  #rg {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    #message {
      margin-left: 20px;
    }
    .el-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      #user {
        display: flex;
        align-items: center;
      }
      .el-avatar {
        margin: 0 8px 0 20px;
      }
    }
  }
}
.el-main {
  background-color: rgb(209, 209, 209);
}
</style>
