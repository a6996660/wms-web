<template>
  <div>
    <h1>日志查看</h1>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入日志名称" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      
      开始时间:<el-input v-model="createTime" placeholder="开始时间" type="datetime-local" style="width: 200px ;"> </el-input>
      结束时间:<el-input v-model="createTime" placeholder="结束时间" type="datetime-local"  style="width: 200px;"> </el-input>
   
<!--      <el-select v-model="borrowerName" placeholder="请选择仓库" style="margin-left: 5px;">-->
<!--        <el-option-->
<!--            v-for="item in storageData"-->
<!--            :key="item.id"-->
<!--            :label="item.name"-->
<!--            :value="item.id">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-select v-model="borrowerName" placeholder="请选择分类" style="margin-left: 5px;">-->
<!--        <el-option-->
<!--            v-for="item in goodstypeData"-->
<!--            :key="item.id"-->
<!--            :label="item.name"-->
<!--            :value="item.id">-->
<!--        </el-option>-->
<!--      </el-select>-->

      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="exportExcel">导出</el-button>


    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
    >
<!--      <el-table-column prop="id" label="ID" width="200">-->
<!--      </el-table-column>-->
      <el-table-column prop="name" label="日志名称" width="180">
      </el-table-column>
      <el-table-column prop="type" label="日志类型" width="180">
      </el-table-column>
      <el-table-column prop="message" label="日志内容" width="180">
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="180">
      </el-table-column>
      <el-table-column prop="createtime" label="日志时间" width="180">
      </el-table-column>
      <el-table-column label="备注" align="left" min-width="300" :show-overflow-tooltip="true">
      <template slot-scope="{row}">
        <span>{{ row.remark }}</span>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20,30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "RecordManage",
  data() {

    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      storageData: [],
      // goodstypeData:[],
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      id: '',
      name: '',
      type: '',
      message: '',
      operator: '',
      createtime: '',
      remark: '',
      centerDialogVisible: false,
      form: {
        id: '',
        name: '',
        type: '',
        message: '',
        operator: '',
        createtime: '',
        remark: '',
      },
    }
  },
  methods: {
    exportExcel() {
      this.$axios.get(this.$httpUrl + '/log/export', { responseType: 'blob' })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '日志.xlsx');
            document.body.appendChild(link);
            link.click();
          })
          .catch(error => {
            console.error('导出 Excel 失败:', error);
          });
    },
    formatStorage(row) {
      let temp = this.storageData.find(item => {
        return item.id == row.storage
      })

      return temp && temp.name
    },
    formatGoodstype(row) {
      let temp = this.goodstypeData.find(item => {
        return item.id == row.goodstype
      })

      return temp && temp.name
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNum = val
      this.loadPost()
    },
    resetParam() {
      this.startDate = ''
      this.endDate = ''
      this.borrowerName = ''
    },
    loadStorage() {
      this.$axios.post(this.$httpUrl + '/log/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.userName
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.blzc = res.data
          this.total = res.total
        } else {
          alert('获取数据失败')
        }

      })
    },
    // loadGoodstype(){
    //     this.$axios.get(this.$httpUrl+'/goodstype/list').then(res=>res.data).then(res=>{
    //         console.log(res)
    //         if(res.code==200){
    //             this.goodstypeData=res.data
    //         }else{
    //             alert('获取数据失败')
    //         }
    //
    //     })
    // },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/log/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          startDate: this.startDate,
          endDate: this.endDate,
          businessNumber: this.businessNumber,
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          alert('获取数据失败')
        }

      })
    },
  },
  beforeMount() {
    this.loadStorage()
    // this.loadGoodstype()
    this.loadPost()

  }
}
</script>

<style scoped>

</style>