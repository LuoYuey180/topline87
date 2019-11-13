<template>
  <div>
    <el-card shadow="never" class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <div class="text item">
        <!-- {{'列表内容 ' + o }} -->
        <el-form label-width="100px">
          <el-form-item label="文章列表：">
            <!-- 该group可以统一给多个radio单选按钮设置change事件，当一个radio选中后，可以被感知，之后可以调用getArticleList()方法，根据变化后的文章状态获取对应的文章列表数据 -->
            <el-radio-group @change="getArticleList()" v-model="searchForm.status">
              <el-radio label>全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              <el-radio label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道列表：">
            <el-select
              @change="getArticleList()"
              clearable
              v-model="searchForm.channel_id"
              placeholder="请选择"
            >
              <el-option
                v-for="item in channeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
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
          <img
            style="display:inline-block; width:140px; height:100px; background-color:#f5f5f5; text-align:center; line-height:100px; color:#cccccc"
            :src="stData.row.cover.images[0]"
            width="140"
            height="100"
            slot-scope="stData"
            alt="图片加载失败"
          />
          <!-- <span
            style="display:inline-block; width:140px; height:100px; background-color:#f5f5f5; text-align:center; line-height:100px; color:#cccccc"
          >图片加载失败</span>-->
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="status" label="状态">
          <div class="tag-group" slot-scope="saData">
            <el-tag size="small" v-if="saData.row.status === 0" effect="light">草稿</el-tag>
            <el-tag size="small" v-else-if="saData.row.status === 1" effect="light">待审核</el-tag>
            <el-tag size="small" v-else-if="saData.row.status === 2" effect="light">审核通过</el-tag>
            <el-tag size="small" v-else-if="saData.row.status === 3" effect="light">审核失败</el-tag>
            <el-tag size="small" v-else effect="light">已删除</el-tag>
          </div>
        </el-table-column>
        <el-table-column prop="pubdate" label="时间"></el-table-column>
        <el-table-column prop="pubdate" label="操作">
          <el-row>
            <el-button size="mini" type="primary">修改</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </el-row>
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
export default {
  created () {
    this.getChanneList() //  调用频道信息方法
    this.getArticleList() // 获取文章列表信息
  },
  methods: {
    handleSizeChange (val) {
      this.searchForm.per_page = val
      this.getArticleList()
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
      this.getArticleList()
    },
    getChanneList () {
      let pro = this.$http.get('/channels')
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            this.channeList = result.data.data.channels
            // console.log(result)
          }
        })
        .catch(err => {
          return this.$message.error('获得文章频道错误' + err)
        })
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
          // console.log(result)
        })
        .catch(err => {
          return this.$message.error('获得文章列表错误' + err)
        })
    }
  },
  name: 'ArticleList',
  watch: {
    //    watch：监听器
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
    }
  },
  data () {
    return {
      //  接收到的是一个**数组**信息，里边的第1、2个单元分别代表开始日期和结束日期
      // 临时成员，接收范围时间，后期分配给begin_pubdate和end_pubdate
      articleList: [],
      timetotime: [],
      channeList: [],
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

<style lang="less">
.box-card {
  margin-top: 8px;
  .el-card__header {
    border-bottom: 1px dashed #cccccc;
  }
  #Pagination {
    display: flex;
    justify-content: center;
    margin-top: 25px;
  }
}
</style>
