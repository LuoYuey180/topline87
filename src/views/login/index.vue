<template>
  <div class="login-container">
    <div class="login-box">
      <el-form :rules="loginFormRules" :model="loginForm" ref="loginFormRef" class="demo-ruleForm">
        <img src="./logo_index.png" alt />
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号" v-model="loginForm.mobile">
            <i slot="prefix">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dianhua" />
              </svg>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="loginForm.code">
            <i slot="prefix">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-renzheng" />
              </svg>
            </i>
          </el-input>
        </el-form-item>
        <el-form-item prop="xieyi" style="text-align:left;">
          <el-checkbox style="margin-right:12px;" v-model="loginForm.xieyi"></el-checkbox>
          <span>我已阅读并同意用户协议和隐私条款</span>
        </el-form-item>
        <el-form-item prop="name">
          <el-button
            :loading="isActive"
            :disabled="isActive"
            @click="login()"
            type="primary"
            style="width:100%;"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//  对gt.js文件进行导入
import '@/assets/js/gt.js'
//  引入iconfont的样式文件
import '@/assets/iconfont/iconfont.js'
export default {
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        //  如果valid为真，表单验证成功
        if (valid) {
          if (this.cptobj !== null) {
            return this.cptobj.verify()
          }
          //  登录按钮禁用、等待
          this.isActive = true
          //  axios获得初始化极验秘钥信息
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            //  axios请求成功
            .then(result => {
              //  对接收返回的极验秘钥信息进行处理

              let { data } = result.data
              //  通过window的全局变量，就可以解决initGeetest未定义的问题
              window.initGeetest(
                {
                  // 以下配置参数来自服务端 SDK
                  gt: data.gt,
                  challenge: data.challenge,
                  offline: !data.success,
                  new_captcha: true,
                  product: 'bind' // 通过登录按钮激活
                },
                captchaObj => {
                  // 这里可以调用验证实例 captchaObj 的实例方法
                  captchaObj
                    .onReady(() => {
                      captchaObj.verify()
                      this.cptobj = captchaObj
                      //  登录按钮禁用、等待
                      this.isActive = false
                      // 验证码ready之后才能调用verify方法显示验证码
                    })
                    .onSuccess(() => {
                      //  人的行为正确
                      this.loginAct()

                      // your code
                    })
                    .onError(() => {
                      // your code
                    })
                }
              )
            })
            //  axios请求失败
            .catch(err => {
              return this.$message.error('获得信息错误' + err)
            })
        }
      })
    },
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          // console.log(result)
          if (result.data.message === 'OK') {
            window.sessionStorage.setItem(
              'userinfo',
              JSON.stringify(result.data.data)
            )
            this.$router.push({ name: 'home' })
          }
        })
        .catch(err => {
          // return alert('用户名或密码错误：' + err)
          // return this.$message.error('用户名或密码错误' + err)
          return this.$message({
            type: 'error',
            message: '用户名或密码错误' + err,
            duration: 1000
          })
        })
    }
  },
  data () {
    // 自定义校验函数，验证协议
    var xieyiTest = function (rule, value, callback) {
      // rule:校验规则，一般不用
      // value:当前被校验的信息
      // callback：回调函数，校验成功或失败都需要执行
      // if (value) {
      //   callback()
      // } else {
      //   callback(new Error('请无条件遵守规矩'))
      // }

      value ? callback() : callback(new Error('请勾选协议条款！'))
    }
    return {
      isActive: false,
      cptobj: null,
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号必填' },
          { pattern: /^1[345789]\d{9}$/, message: '手机格式不正确' }
        ],
        code: [{ required: true, message: '验证码必填' }],
        xieyi: [{ validator: xieyiTest, trigger: 'blur' }]
      },
      loginForm: {
        mobile: '18810606114', //   手机号码
        code: '246810',
        xieyi: false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url('login_bg.jpg');
  background-size: cover;
  .login-box {
    width: 400px;
    height: 370px;
    background-color: rgb(255, 255, 255);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-form {
      width: 75%;
      img {
        width: 60%;
        margin: 20px 0;
      }
      .el-input {
        .icon {
          width: 18px;
          height: 18px;
          vertical-align: -5px;
          fill: currentColor;
          overflow: hidden;
          path {
            fill: red;
          }
        }
      }
    }
  }
}
</style>
