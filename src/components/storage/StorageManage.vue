<template>
  <div>
    <div style="margin-bottom: 5px;">
      <el-input v-model="businessId" placeholder="请输入业务编号" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>

      <el-button type="primary" style="margin-left: 5px;" @click="addPage">新增</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="exportExcel">导出</el-button>

<!--      <el-upload-->
<!--          class="upload-demo"-->
<!--          action="string"-->
<!--          :show-file-list = "false"-->
<!--          :http-request="uploadFile"-->
<!--          :limit="1"-->
<!--          :on-exceed="handleExceed">-->
<!--        <el-button size="small" type="primary" style="margin-left: 5px;">点击上传</el-button>-->
<!--      </el-upload>-->
    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
    >
      <el-table-column prop="id" label="序号" width="100">
      </el-table-column>
      <el-table-column prop="bank" label="机构" width="100" fixed>
      </el-table-column>
      <el-table-column prop="userName" label="借款人名称" width="100" fixed>
      </el-table-column>
      <el-table-column prop="userType" label="客户类别" width="100">
      </el-table-column>
      <el-table-column prop="userId" label="客户编号" width="100">
      </el-table-column>
      <el-table-column prop="idc" label="证件号码" width="100">
      </el-table-column>
      <el-table-column prop="businessId" label="业务编号" width="100">
      </el-table-column>
      <el-table-column prop="firstDate" label="首贷日" width="100">
      </el-table-column>
      <el-table-column prop="fanganDate" label="发放日期" width="100">
      </el-table-column>
      <el-table-column prop="daoqiDate" label="到期日期" width="100">
      </el-table-column>
      <el-table-column prop="blxcDate" label="不良形成日期" width="100">
      </el-table-column>
      <el-table-column prop="fanganMoney" label="发放金额" width="100">
      </el-table-column>
      <el-table-column prop="daikuanMoney" label="贷款余额" width="100">
      </el-table-column>
      <el-table-column prop="bwqxMoney" label="表外欠息金额" width="100">
      </el-table-column>
      <el-table-column prop="dkglManager" label="贷款管理责任人" width="100">
      </el-table-column>
      <el-table-column prop="state" label="案件状态" width="100">
      </el-table-column>
      <el-table-column prop="caseId" label="案件编号" width="100">
      </el-table-column>
      <el-table-column prop="zhubManager" label="主办客户经理" width="100">
      </el-table-column>
      <el-table-column prop="danbWay" label="担保方式" width="100">
      </el-table-column>
      <el-table-column prop="danbName" label="担保人_抵质物名称" width="100">
      </el-table-column>
      <el-table-column prop="zbwsblDkje" label="转表外时不良贷款金额" width="100">
      </el-table-column>
      <el-table-column prop="zbwsblDklx" label="转表外时不良贷款利息" width="100">
      </el-table-column>
      <el-table-column prop="zbwDate" label="转表外日期" width="100">
      </el-table-column>
      <el-table-column prop="daikId" label="贷款账号" width="100">
      </el-table-column>
      <el-table-column prop="fafType" label="发放类别" width="100">
      </el-table-column>
      <el-table-column prop="hangyType" label="行业分类" width="100">
      </el-table-column>
      <el-table-column prop="daikUse" label="贷款用途" width="100">
      </el-table-column>
      <el-table-column prop="contactNum" label="联系电话（固话）" width="100">
      </el-table-column>
      <el-table-column prop="telNum" label="联系电话（手机）" width="100">
      </el-table-column>
      <el-table-column prop="jiexhjCount" label="借新还旧累计次数" width="100">
      </el-table-column>
      <el-table-column prop="firstJxhjDate" label="首次借新还旧日期" width="100">
      </el-table-column>
      <el-table-column prop="qianxCount" label="欠息累计次数" width="100">
      </el-table-column>
      <el-table-column prop="benjyqCount" label="本金逾期累计次数" width="100">
      </el-table-column>
      <el-table-column prop="zuijycCuisDate" label="最近一次催收时间" width="100">
      </el-table-column>
      <el-table-column prop="zuijycJinzdcDate" label="最近一次尽职调查时间" width="100">
      </el-table-column>
      <el-table-column prop="firstBulxcDate" label="首次不良形成日期" width="100">
      </el-table-column>
      <el-table-column prop="bankId" label="核心入账机构" width="100">
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button size="small" type="success" @click="shouhuiPageMethod(scope.row)">收回</el-button>
<!--          <el-popconfirm-->
<!--              title="确定删除吗？"-->
<!--              @confirm="del(scope.row.id)"-->
<!--              style="margin-left: 5px;"-->
<!--          >-->
<!--            <el-button slot="reference" size="small" type="danger">删除</el-button>-->
<!--          </el-popconfirm>-->
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

    <el-dialog
        title="收回操作"
        :visible.sync="shouhuiPage"
        width="30%"
        center>

      <el-form ref="shouhuiPage" :rules="rules" :model="form" label-width="160px">
        <el-form-item label="贷款余额发生额" prop="daikuanMoneySub">
          <el-input type="number" v-model="form.daikuanMoneySub"></el-input>
        </el-form-item>
        <el-form-item label="表外欠息金额发生额" prop="bwqxMoneySub">
          <el-input type="number" v-model="form.bwqxMoneySub"></el-input>
        </el-form-item>
        <el-form-item label="收回日期" prop="dateSub">
          <el-input type="datetime-local" v-model="form.dateSub"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="shouhuiPage = false">取 消</el-button>
    <el-button type="primary" @click="changeMoney">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
        title="新增信息"
        :visible.sync="centerDialogVisible"
        width="80%"
        center>

      <el-form ref="form" :inline="true" :rules="rules" :model="form" label-position="left" label-width="200px"
               class="demo-ruleForm">
        <el-form-item label="id">
          <el-input v-model="form.id" placeholder="id"></el-input>
        </el-form-item>
        <el-form-item label="机构">
          <el-input v-model="form.bank" placeholder="机构"></el-input>
        </el-form-item>
        <el-form-item label="借款人名称">
          <el-input v-model="form.userName" placeholder="借款人名称"></el-input>
        </el-form-item>
        <el-form-item label="客户类别">
          <el-input v-model="form.userType" placeholder="客户类别"></el-input>
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="form.userId" placeholder="客户编号"></el-input>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input v-model="form.idc" placeholder="证件号码"></el-input>
        </el-form-item>
        <el-form-item label="业务编号">
          <el-input v-model="form.businessId" placeholder="业务编号"></el-input>
        </el-form-item>
        <el-form-item label="首贷日">
          <el-input v-model="form.firstDate" placeholder="首贷日"  type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="发放日期">
          <el-input v-model="form.fanganDate" placeholder="发放日期"  type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="到期日期">
          <el-input v-model="form.daoqiDate" placeholder="到期日期"  type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="不良形成日期">
          <el-input v-model="form.blxcDate" placeholder="不良形成日期"  type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="发放金额">
          <el-input v-model="form.fanganMoney" placeholder="发放金额"></el-input>
        </el-form-item>
        <el-form-item label="贷款余额">
          <el-input v-model="form.daikuanMoney" placeholder="贷款余额"></el-input>
        </el-form-item>
        <el-form-item label="表外欠息金额">
          <el-input v-model="form.bwqxMoney" placeholder="表外欠息金额"></el-input>
        </el-form-item>
        <el-form-item label="贷款管理责任人">
          <el-input v-model="form.dkglManager" placeholder="贷款管理责任人"></el-input>
        </el-form-item>
        <el-form-item label="案件状态">
          <el-input v-model="form.state" placeholder="案件状态"></el-input>
        </el-form-item>
        <el-form-item label="案件编号">
          <el-input v-model="form.caseId" placeholder="案件编号"></el-input>
        </el-form-item>
        <el-form-item label="主办客户经理">
          <el-input v-model="form.zhubManager" placeholder="主办客户经理"></el-input>
        </el-form-item>
        <el-form-item label="担保方式">
          <el-input v-model="form.danbWay" placeholder="担保方式"></el-input>
        </el-form-item>
        <el-form-item label="担保人_抵质物名称">
          <el-input v-model="form.danbName" placeholder="担保人_抵质物名称"></el-input>
        </el-form-item>
        <el-form-item label="转表外时不良贷款金额">
          <el-input v-model="form.zbwsblDkje" placeholder="转表外时不良贷款金额"></el-input>
        </el-form-item>
        <el-form-item label="转表外时不良贷款利息">
          <el-input v-model="form.zbwsblDklx" placeholder="转表外时不良贷款利息"></el-input>
        </el-form-item>
        <el-form-item label="转表外日期">
          <el-input v-model="form.zbwDate" placeholder="转表外日期"  type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="贷款账号">
          <el-input v-model="form.daikId" placeholder="贷款账号"></el-input>
        </el-form-item>
        <el-form-item label="发放类别">
          <el-input v-model="form.fafType" placeholder="发放类别"></el-input>
        </el-form-item>
        <el-form-item label="行业分类">
          <el-input v-model="form.hangyType" placeholder="行业分类"></el-input>
        </el-form-item>
        <el-form-item label="贷款用途">
          <el-input v-model="form.daikUse" placeholder="贷款用途"></el-input>
        </el-form-item>
        <el-form-item label="联系电话（固话）">
          <el-input v-model="form.contactNum" placeholder="联系电话（固话）"></el-input>
        </el-form-item>
        <el-form-item label="联系电话（手机）">
          <el-input v-model="form.telNum" placeholder="联系电话（手机）"></el-input>
        </el-form-item>
        <el-form-item label="借新还旧累计次数">
          <el-input v-model="form.jiexhjCount" placeholder="借新还旧累计次数"></el-input>
        </el-form-item>
        <el-form-item label="首次借新还旧日期">
          <el-input v-model="form.firstJxhjDate" placeholder="首次借新还旧日期"  type="datetime-local"></el-input>
        </el-form-item>
        <el-form-item label="欠息累计次数">
          <el-input v-model="form.qianxCount" placeholder="欠息累计次数"></el-input>
        </el-form-item>
        <el-form-item label="本金逾期累计次数">
          <el-input v-model="form.benjyqCount" placeholder="本金逾期累计次数"></el-input>
        </el-form-item>
        <el-form-item label="最近一次催收时间">
          <el-input v-model="form.zuijycCuisDate" type="datetime-local" placeholder="选择日期时间">
          </el-input>
        </el-form-item>
        <el-form-item label="最近一次尽职调查时间">
          <el-input
              v-model="form.zuijycJinzdcDate"
              type="datetime-local"
              placeholder="选择日期时间">
            </el-input>
        </el-form-item>
        <el-form-item label="首次不良形成日期">
          <el-input
              v-model="form.firstBulxcDate"
              type="datetime-local"
              placeholder="选择日期">
            </el-input>
        </el-form-item>
        <el-form-item label="核心入账机构">
          <el-input v-model="form.bankId" placeholder="核心入账机构"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "StorageManage",
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      id: '',
      bank: '',
      userName: '',
      userType: '',
      userId: '',
      idc: '',
      businessId: '',
      firstDate: '',
      fafangDate: '',
      daoqiDate: '',
      blxcDate: '',
      fafangMoney: '',
      daikuanMoney: '',
      bwqxMoney: '',
      dkglManager: '',
      state: '',
      caseId: '',
      zhubManager: '',
      danbWay: '',
      danbName: '',
      zbwsbldkje: '',
      zbwslbdklx: '', // 纠正了变量名的拼写错误
      zbwDate: '',
      daikId: '',
      fafType: '', // 纠正了变量名的拼写错误
      hangyType: '', // 纠正了变量名的拼写错误
      daikUse: '',
      contactNum: '',
      telNum: '',
      jiexhjCount: '',
      firstJxhjDate: '', // 纠正了变量名的拼写错误
      qianxCount: '',
      benjyqCount: '',
      zuijycCuisDate: '', // 纠正了变量名的拼写错误
      zuijycJinzdcDate: '', // 纠正了变量名的拼写错误
      firstBulxcDate: '', // 纠正了变量名的拼写错误
      bankId: '',
      daikuanMoneySub: '',
      bwqxMoneySub: '',
      dateSub: '',
      centerDialogVisible: false,
      shouhuiPage: false,
      form: {
        id: '',
        bank: '',
        userName: '',
        userType: '',
        userId: '',
        idc: '',
        businessId: '',
        firstDate: '',
        fafangDate: '',
        daoqiDate: '',
        blxcDate: '',
        fafangMoney: '',
        daikuanMoney: '',
        bwqxMoney: '',
        dkglManager: '',
        state: '',
        caseId: '',
        zhubManager: '',
        danbWay: '',
        danbName: '',
        zbwsbldkje: '',
        zbwslbdklx: '', // 纠正了变量名的拼写错误
        zbwDate: '',
        daikId: '',
        fafType: '', // 纠正了变量名的拼写错误
        hangyType: '', // 纠正了变量名的拼写错误
        daikUse: '',
        contactNum: '',
        telNum: '',
        jiexhjCount: '',
        firstJxhjDate: '', // 纠正了变量名的拼写错误
        qianxCount: '',
        benjyqCount: '', //本金逾期累计次数
        zuijycCuisDate: '', // 最近一次催收时间
        zuijycJinzdcDate: '', // 最近一次尽职调查时间
        firstBulxcDate: '', // 首次不良形成日期
        bankId: '',  //核心入账机构
        daikuanMoneySub: '',
        bwqxMoneySub: '',
        dateSub: ''
      },
      rules: {
        dateSub: [
          {required: true, message: '请输入日期', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    //自定义上传文件
    uploadFile (file) {
      // this.formData.append("file", file.file);
      let formData = new FormData();
      formData.append("file", file.file);//拿到存在fileList的文件存放到formData中
      this.$axios.post(this.$httpUrl + '/blzc-data/importExcel', formData ,{ "Content-Type": "multipart/form-data;charset=utf-8"}).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
      // console.log(file.file, "sb2");
    },
    handleExceed(files, fileList) {
      console.log(files);
      console.log(fileList);
    },
    exportExcel() {
      this.$axios.get(this.$httpUrl + '/blzc-data/export', { responseType: 'blob' })
          .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.xlsx');
            document.body.appendChild(link);
            link.click();
          })
          .catch(error => {
            console.error('导出 Excel 失败:', error);
          });
    },
    changeMoney() {
      this.shouhuiPage =false
      let params = {
        user: sessionStorage.getItem('CurUser'),
        data: this.form
      }
      this.$axios.post(this.$httpUrl + '/blzc-data/changeMoney', params).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetAddPage()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })


    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    resetAddPage() {
      this.$refs.shouhuiPage.resetFields();
    },
    del(id) {
      console.log(id)

      this.$axios.get(this.$httpUrl + '/blzc-data/del?id=' + id).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.loadPost()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
    },
    mod(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id
        this.form.name = row.name
        this.form.remark = row.remark
      })
    },
    add() {

      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm()
      })

    },
    addPage() {

      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm()
      })

    },
    shouhuiPageMethod(row) {
      this.shouhuiPage = true
      this.$nextTick(() => {
        this.form.id = row.id
      })
    },
    doSave() {
      this.form.c = JSON.parse(sessionStorage.getItem('CurUser'))
      this.$axios.post(this.$httpUrl + '/blzc-data/save', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/blzc-data/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.centerDialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

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
      this.businessId = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/blzc-data/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          businessId: this.businessId
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
    }
  },
  beforeMount() {
    this.loadPost()
  }
}
</script>

<style scoped>

</style>