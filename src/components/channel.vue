<template>
  <el-select clearable v-model="chid" placeholder="请选择">
    <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
//  当前子组件拥有名称为slt的事件（是父组件声明的）
export default {
  name: 'ChannelCom',
  data () {
    return {
      chid: '',
      channelList: []
    }
  },
  created () {
    this.getChannelList()
  },
  props: {
    //  接收父给子出传递的频道信息
    cid: {
      default: 0 //  设置默认值
    }
  },
  //  监听（watch）
  watch: {
    cid: function (newV, oldV) {
      this.chid = newV
    },
    //    对chid做监听
    chid: function (newV, oldV) {
      //  调用自己的方法
      this.$emit('slt', this.chid)
    }
  },
  methods: {
    //  获得频道
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channelList = result.data.data.channels
            // console.log(result)
          }
        })
        .catch(err => {
          return this.$message.error('获取文章频道错误' + err)
        })
    }
  }
}
</script>

<style>
</style>
