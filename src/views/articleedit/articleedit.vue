<template>
  <div id="ArticleEdit">
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>修改文章</span>
      </div>
      <div>
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="120px">
          <el-form-item prop="title" label="标题">
            <el-input v-model="editForm.title" type="text"></el-input>
          </el-form-item>
          <el-form-item prop="content" label="内容">
            <quill-editor v-model="editForm.content"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
            <el-radio-group v-model="editForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="channel_id" label="频道">
            <channel-com @slt="selectHandler" :cid="editForm.channel_id"></channel-com>
          </el-form-item>
          <el-form-item>
            <el-button @click="editarticle(false)" type="primary">发布</el-button>
            <el-button @click="editarticle(true)">存入草稿</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div id="btn-bottom"></div> -->
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
  name: 'ArticleEdit',
  components: {
    // 简易成员赋值 quillEditor: quillEditor
    // 组件使用两种方式：<quillEditor></quillEditor> 或 <quill-editor></quill-editor>
    quillEditor,
    ChannelCom
  },
  //  计算属性
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  created () {
    //  获取频道列表方法
    // this.getChannelList()
    //  获取指定文章方法
    this.getArticleByAid()
  },
  data: function () {
    return {
      //   channelList: [],
      editForm: {
        channel_id: '',
        cover: {
          type: 0,
          images: []
        },
        title: '',
        content: ''
      },
      editFormRules: {
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
    selectHandler (val) {
      this.editForm.channel_id = val
      console.log(val)
    },
    getArticleByAid () {
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(result => {
          if (result.status === 200) {
            this.editForm = result.data.data
          }
          console.log(result)
        })
        .catch(err => {
          return this.$message.error('获取文章错误' + err)
        })
    },
    editarticle (flag) {
      // 表单校验
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          // 把被添加的文章信息通过axios传递给服务器端存储
          // axios发起post请求的时候，不仅可以传递post数据还可以传递get请求字符串信息
          // this.$http.post(地址,post数据,get请求字符串信息)
          let pro = this.$http.put(`/articles/${this.aid}`, this.editForm, {
            params: { draft: flag }
          })
          pro
            .then(result => {
              this.$message.success('修改文章成功！~')
              this.$router.push({ name: 'article' })
            })
            .catch(err => {
              return this.$message.error('修改文章错误' + err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 8px;
  /deep/ .el-card__header {
    border-bottom: 1px dashed #cccccc;
  }
  .el-form {
    margin-top: 25px;
    /deep/ .el-form-item {
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
      }
    }
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
