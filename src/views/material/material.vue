<template>
  <div id="material">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>素材管理</span>

        <el-upload
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          name="image"
          :headers="setToken"
          :show-file-list="false"
          :on-success="onSuccess"
        >
          <el-button type="primary" size="small">
            上传图片
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
      </div>
      <div class="text item">
        <ul>
          <li class="image-box" v-for="item in imageList" :key="item.id">
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button type="success" icon="el-icon-star-off" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Material',
  data () {
    return {
      imageList: []
    }
  },
  computed: {
    //    拼装el-upload需要的token信息
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  created () {
    this.getImageList()
  },
  methods: {
    onSuccess () {
      this.$message.success('图片上传成功！~')
      this.getImageList()
    },
    //  获取服务器的素材图片
    getImageList () {
      let pro = this.$http.get('/user/images')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
          console.log(result)
        })
        .catch(err => {
          return this.$message.error('获取图片错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
#material {
  .el-card {
    margin-top: 8px;
    /deep/ .clearfix {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .image-box {
      list-style: none;
      width: 200px;
      height: 200px;
      background-color: #fff;
      margin: 10px;
      float: left;
      border: 1px solid #eee;
      img {
        width: 200px;
        height: 140px;
      }
      .image-bot {
        width: 200px;
        height: 60px;
        line-height: 60px;
        text-align: center;
      }
    }
  }
}
</style>
