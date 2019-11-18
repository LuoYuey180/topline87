<template>
  <el-card shadow="never" class="box-card">
    <div slot="header" class="clearfix">
      <span>账户信息</span>
    </div>
    <div id="lt">
      <el-form
        ref="accountFormRef"
        :rules="accountFormRules"
        :model="accountForm"
        label-width="160px"
      >
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="accountForm.name"></el-input>
        </el-form-item>
        <el-form-item dsiabled label="手机号码：" prop="mobile">
          <el-input disabled v-model="accountForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="accountForm.email"></el-input>
        </el-form-item>
        <el-form-item label="简介：" prop="intro">
          <el-input rows="6" type="textarea" v-model="accountForm.intro"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="editAccount" type="primary" size="small">更新账户</el-button>
        </el-form-item>-->
      </el-form>
    </div>
    <div id="rt">
      <!--
          class="avatar-uploader" // 自定义组件样式
          action="https://jsonplaceholder.typicode.com/posts/" // 上传附件服务器端地址
          :show-file-list="false" // 图片是否是列表展示
          :on-success="handleAvatarSuccess" // 图片上传成功后的回调处理
          :before-upload="beforeAvatarUpload" // 图片上传前的回调处理
          :http-request="httpRequest" // 自定义上传行为，此时action和on-success无效了，action是必须项目，留空即可
      -->
      <el-upload action :show-file-list="false" :http-request="httpRequest">
        <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <p>点击头像进行更换</p>
      </el-upload>
      <div id="flexible-box">
        <el-form ref="accountFormRef" :rules="accountFormRules" :model="accountForm">
          <el-form-item>
            <el-button @click="editAccount" type="primary" size="medium">修改账户</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-card>
</template>

<script>
//  引入公共bus的Vue对象
import bus from '@/utils/bus.js'

export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        name: '',
        mobile: '',
        photo: '',
        email: '',
        intro: ''
      },
      accountFormRules: {
        name: [
          {
            required: true,
            message: '用户名必填'
          },
          {
            min: 1,
            max: 7,
            message: '用户名长度介于1-7个字符之间'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱必填'
          },
          {
            type: 'email',
            message: '邮箱格式不正确'
          }
        ]
        /*
            mobile: [
                { required: true, message: '手机号码必填' },
                { pattern: /^1[35789]\d{9}$/, message: '手机号码格式不对' }
            ]
        */
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    //    自定义上传头像行为
    //  resource参数：是一个对象，里面有正当上传的图片信息
    httpRequest (resource) {
      //  FormData表单数据对象收集表单信息，既上传图片信息
      let fd = new FormData()
      //  把图片的信息添加给fd对象
      fd.append('photo', resource.file)

      //    axios带着附件到达服务器存储
      let pro = this.$http.patch('/user/photo', fd)
      pro
        .then(result => {
          console.log(result)
          //  bus调用事件，给home传递更新后的名字
          bus.$emit('upAccountPhoto', result.data.data.photo)
          this.accountForm.photo = result.data.data.photo
          //   this.$message.success('修改头像成功！~')
        })
        .catch(err => {
          return this.$message.error('获取用户头像错误' + err)
        })
    },
    editAccount () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(result => {
              if (result.status === 201) {
                //  bus调用事件，给home传递更新后的名字
                bus.$emit('upAccountName', result.data.data.name)
                this.$message.success('修改账号成功！~')
              }
            })
            .catch(err => {
              return this.$message.error('获取信息失败' + err)
            })
        }
      })
    },
    getAccountInfo () {
      let pro = this.$http.get('/user/profile')
      pro
        .then(result => {
          if (result.status === 200) {
            this.accountForm = result.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取个人信息错误' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 8px;
  /deep/ .el-card__body {
    margin-top: 60px;
    height: 400px;
    display: flex;
    justify-content: space-between;
    #lt {
      width: 40%;
      height: 100%;
      /deep/ .el-form-item {
        /deep/ .el-input {
          width: 320px;
        }
        /deep/ .el-textarea {
          width: 320px;
        }
      }
    }
    #rt {
      display: flex;
      //   justify-content: center;
      //   align-items: center;
      flex-direction: column;
      width: 30%;
      height: 100%;
      margin: 30px 180px 0 0;
      text-align: center;
      p {
        font-size: 14px;
        color: #999;
        margin-bottom: 12px;
      }
      /deep/ .el-upload {
        width: 160px;
        height: 160px;
        img {
          border-radius: 100px;
          width: 160px;
          height: 160px;
        }
      }
      /deep/ #flexible-box {
        margin-top: 52px;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
}
</style>
