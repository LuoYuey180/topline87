<template>
  <div id="articleadd">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <!-- 匿名插槽，内容主体 -->
      <div>
        <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="120px">
          <el-form-item prop="title" label="标题">
            <el-input v-model="addForm.title" type="text"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
            <quill-editor v-model="addForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="addForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
            <ul>
              <li @click="showDialog(item)" class="uploadbox" v-for="item in covernum" :key="item">
                <span>点击图标选择图片</span>
                <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
                <div v-else class="el-icon-picture-outline"></div>
              </li>
            </ul>
          </el-form-item>
          <el-form-item prop="channel_id" label="频道">
            <!-- 通过@符号给当前子组件创建一个事件，名称为slt，事件驱动方法为：selectHandler -->
            <!-- 请在组件methods中创建selectHandler -->
            <!-- 作用：接收子组件的信息 -->
            <channel-com @slt="selectHandler"></channel-com>
          </el-form-item>
          <el-form-item>
            <el-button @click="addarticle(false)" type="primary">发布</el-button>
            <el-button @click="addarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- <el-dialog
      title="素材展示"    对话框标题
      :visible.sync="dialogVisible"   对话框打开的开关，需要跟data小成员连接（true/false）
      width="30%"   对话框宽度
      :before-close="handleClose"   对话框关闭的回调处理
      >-->

      <!-- 对话框组件 -->
      <el-dialog @close="clearImage" title="素材展示" :visible.sync="dialogVisible" width="50%">
        <!-- 匿名插槽：对话框的主体内容 -->
        <ul>
          <li class="image-box" v-for="item in imageList" :key="item.id">
            <img @click="cliImage" :src="item.url" alt="没有图片" />
          </li>
        </ul>
        <!-- 命名插槽，脚步的两个按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="imageOk">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
//  引入富文本编辑器相关css文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//  引入富文本编辑器组件模块（ES6模块化-按需导入）
import { quillEditor } from 'vue-quill-editor'

//  引入channel.vue公共组件
import ChannelCom from '@/components/channel.vue'

export default {
  name: 'Articleadd',
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor,
    ChannelCom
  },
  created () {
    //  第一时间从服务器获取的图片素材进行页面响应
    this.getImageList()
  },
  computed: {
    //  设置当前图片‘选择框’个数
    covernum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  },
  data: function () {
    return {
      materialUrl: '', //   选中的素材图片的路径名地址信息
      xv: 0, // 记录单击选择框的序号信息
      imageList: [], //  素材图片列表
      querycdt: {
        collect: false,
        page: 1,
        per_page: 15
      },
      dialogVisible: false,
      addForm: {
        channel_id: '',
        cover: {
          type: 0,
          images: []
        },
        title: '',
        content: ''
      },
      addFormRules: {
        title: [
          {
            required: true,
            message: '标题为必填选项'
          },
          { min: 5, max: 30, message: '标题长度介于5-30个字符' }
        ],
        content: [
          {
            required: true,
            message: '内容标题为必填选项'
          }
        ],
        channel_id: [
          {
            required: true,
            message: '频道标题为必选选项'
          }
        ]
      }
    }
  },
  methods: {
    // 清除之前选择素材图片的痕迹(边框高亮、图片路径名)
    clearImage () {
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      this.materialUrl = '' // 清除图片路径名
    },
    //  素材图片选取好，点击‘对话框’确定按钮后，记录素材图片
    imageOk () {
      if (this.materialUrl) {
        //  给添加文章的表单域成员cover.image增加素材图片请求地址信息
        this.addForm.cover.images[this.xv] = this.materialUrl
        this.dialogVisible = false
      } else {
        this.$message.error('请选择一张图片，或者点击取消按钮！~')
      }
    },
    cliImage (e) {
      // console.log(e) //  鼠标事件对象
      // e.target  //  被点击图片（img）的DOM对象
      // e.target.parentNode  //  找到img的父级，即li标签
      // 给li设置border边框，高亮效果

      //  获取全部的li
      //  进行遍历，清除li的样式，只留下选中的样式
      let lis = document.querySelectorAll('.image-box')
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.border = ''
      }
      //  把当前选中的DOM节点设置css样式
      e.target.parentNode.style.border = '2px solid #409EFF'
      //  把当前选中图片的src地址信息赋予给materialUrl成员
      this.materialUrl = e.target.src
    },
    //  获取服务器的素材图片
    getImageList () {
      let pro = this.$http.get('/user/images', { params: this.querycdt })
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.imageList = result.data.data.results
          }
          // console.log(result)
        })
        .catch(err => {
          return this.$message.error('获取图片错误' + err)
        })
    },
    //  是否开启对话框
    showDialog (n) {
      this.xv = n - 1
      // console.log(n - 1)

      this.dialogVisible = true
    },
    selectHandler (val) {
      this.addForm.channel_id = val
    },
    addarticle (flag) {
      // 表单校验
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          // 把被添加的文章信息通过axios传递给服务器端存储
          // axios发起post请求的时候，不仅可以传递post数据还可以传递get请求字符串信息
          // this.$http.post(地址,post数据,get请求字符串信息)
          let pro = this.$http.post('/articles', this.addForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('发布文章成功！~')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('请选择图片或者选择无图') + err
            })
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.box-card {
  margin-top: 8px;
  /deep/ .el-card__header {
    border-bottom: 1px dashed #cccccc;
  }
  .el-form {
    margin-top: 25px;
    /deep/ .el-form-item {
      // 文章封面选择框样式
      .uploadbox {
        list-style: none;
        width: 200px;
        height: 200px;
        margin: 10px;
        float: left;
        cursor: pointer;
        span {
          width: 200px;
          height: 50px;
          line-height: 50px;
          display: block;
          text-align: center;
        }
        div {
          width: 200px;
          height: 140px;
          font-size: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
        }
        img {
          width: 200px;
          height: 140px;
          border-radius: 4px;
        }
      }
      /deep/ &:nth-child(1) {
        width: 560px;
      }
      /deep/ &:nth-child(2) {
        /deep/ .quill-editor {
          /deep/ .ql-container {
            height: 300px;
          }
        }
      }
      /deep/ &:nth-child(3) {
        width: 190%;
        /deep/ ul {
          overflow: hidden;
          padding: 0px;
          margin-left: -10px;
        }
      }
    }
  }
  /deep/ .el-dialog {
    /deep/ .el-dialog__header {
      padding: 20px 20px;
    }
    /deep/ .el-dialog__body {
      padding: 18px 18px 0 18px;
      border-top: 1px dashed #cccccc;
    }
    /deep/ ul {
      overflow: auto;
      margin: 0;
      padding-left: 0;
      /deep/ .image-box {
        list-style: none;
        width: 116px;
        height: 88px;
        background-color: #fff;
        margin: 10px;
        float: left;
        border: 1px solid #eee;
        border-radius: 6px;
        cursor: pointer;
        box-sizing: border-box;
        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }
    }
  }
  .clearfloat:after {
    display: block;
    clear: both;
    content: '';
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }
  #btn-bottom {
    padding: 35px 0 30px 120px;
    border-top: 1px dashed #cccccc;
    /deep/ .el-form-item {
      /deep/ .el-button {
        width: 100px;
        margin-right: 20px;
      }
    }
  }
}
</style>
