<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div class="text item">
        <!-- {{'列表内容 ' + o }} -->
        <el-form :model="searchForm" label-width="100px">
          <el-form-item label="文章列表：">
            <!-- 该group可以统一给多个radio单选按钮设置change事件，当一个radio选中后，可以被感知，之后可以调用getArticleList()方法，根据变化后的文章状态获取对应的文章列表数据 -->
            <el-radio-group v-model="searchForm.status">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              <el-radio label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：" prop="channel_id">
            <channel-com @slt="selectHandler">sacs</channel-com>
          </el-form-item>
          <el-form-item label="时间选择：">
            <el-date-picker
              v-model="timetotime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card style="{margin-top:'8px'}" shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到{{ tot }}条符合条件的内容</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text"></el-button> -->
      </div>
      <el-table :data="articleList">
        <el-table-column label="图片">
          <div class="block" slot-scope="stData">
            <span class="demonstration"></span>
            <el-image style="width: 140px; height: 100px" :src="stData.row.cover.images[0]"></el-image>
          </div>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 通过template统一设置接收作用域插槽数据 -->
          <template class="tag-group" slot-scope="saData">
            <el-tag size="small" v-if="saData.row.status === 0" type="info">草稿</el-tag>
            <el-tag size="small" v-else-if="saData.row.status === 1" type="success">待审核</el-tag>
            <el-tag size="small" v-else-if="saData.row.status === 2">审核通过</el-tag>
            <el-tag size="small" v-else-if="saData.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag size="small" v-else effect="light">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="时间"></el-table-column>
        <el-table-column prop="pubdate" label="操作">
          <!-- 内容区域设置当前列显示的信息 -->
          <template slot-scope="saData">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push(`/articleedit/${saData.row.id}`)"
            >修改</el-button>
            <el-button @click="del(saData.row.id)" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div id="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-size="searchForm.per_page"
          layout=" jumper, prev, pager, next"
          :total="tot"
          background
        ></el-pagination>
      </div>
    </el-card>
  </div>
  <!-- <div>文章列表页面</div> -->
</template>

<script>
//  引入公共频道列表组件
import ChannelCom from '@/components/channel.vue'

export default {
  name: 'ArticleList',
  components: {
    //  注册独立的频道组件
    ChannelCom
  },
  created () {
    // this.del()
    this.getArticleList() // 获取文章列表信息j
  },
  methods: {
    selectHandler (val) {
      this.searchForm.channel_id = val
    },
    //  删除文章方法
    del (id) {
      this.$confirm('确定要删除该数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let pro = this.$http.delete(`/articles/${id}`)
          pro
            .then(result => {
              //  刷新页面
              this.$message.success('文章删除成功！~')
              this.getArticleList()
            })
            .catch(err => {
              return this.$message.error('删除文章失败' + err)
            })
        })
        .catch(() => {})
    },
    handleSizeChange (val) {
      this.searchForm.per_page = val
      this.getArticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getArticleList()
    },
    getArticleList () {
      //  把searFrom内部为空的成员过滤掉
      let searchData = {}
      for (var i in this.searchForm) {
        //  searchFrom[i]的对象为真
        if (this.searchForm[i]) {
          //  i代表对象的成员属性名称，status、channe_id...
          //  就把searchForm为真的值，传入到searchData中
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData }) //   get请求方式，传参格式为：{params:传入的参数}
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.articleList = result.data.data.results
            this.tot = result.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('登录时间已过期，请重新登录！~' + err)
        })
    }
  },
  //    watch：监听器
  watch: {
    timetotime: function (newv, oldv) {
      //  data名称：function(newv,oldv)
      //  newv：data更新后的值
      //  oldv：data更新前的旧值
      if (newv) {
        //    当newv变化时
        //    把newv拆分为两份，赋予给begin_pubdate和end_pubdate
        this.searchForm.begin_pubdate = newv[0] //    文章发布开始时间
        this.searchForm.end_pubdate = newv[1] //    文章发布结束时间
      } else {
        //    清除监听器中的时间
        this.searchForm.begin_pubdate = '' //    文章发布开始时间
        this.searchForm.end_pubdate = '' //    文章发布结束时间
      }
      this.getArticleList()
    },
    searchForm: {
      handler: function (newv, oldv) {
        this.getArticleList()
      },
      deep: true
    }
  },
  data () {
    return {
      //  接收到的是一个**数组**信息，里边的第1、2个单元分别代表开始日期和结束日期
      // 临时成员，接收范围时间，后期分配给begin_pubdate和end_pubdate
      articleList: [],
      timetotime: '',
      tot: 0,
      searchForm: {
        status: '', //   文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        channel_id: '', //   频道信息
        begin_pubdate: '', //    文章发布开始时间
        end_pubdate: '', //   文章发布结束时间
        page: 1, //  默认获取第1页数据
        per_page: 10 //  每页返回10条记录
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 8px;
  &:nth-child(2) {
    /deep/ .el-table {
      /deep/ .el-table__header {
        /deep/ th {
          text-align: center;
        }
      }
    }
    /deep/ .el-table__body-wrapper {
      /deep/ tr {
        /deep/ td {
          text-align: center;
        }
      }
    }
  }
  /deep/ .el-card__header {
    border-bottom: 1px dashed #cccccc;
  }
  #Pagination {
    display: flex;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>
