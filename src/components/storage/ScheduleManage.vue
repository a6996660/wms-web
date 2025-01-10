<template>
  <div>
    <h1>调度任务</h1>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入调度任务名称" suffix-icon="el-icon-search" style="width: 200px;"
                @keyup.enter.native="loadPost"></el-input>
      <el-button type="primary" style="margin-left: 5px;" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="addPage">新增</el-button>
      <el-button type="primary" style="margin-left: 5px;" @click="exportExcel">导出</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{ background: '#f2f5fc', color: '#555555' }"
              border
    >
<!--      <el-table-column prop="id" label="id" width="100" fixed v-show="false">-->
<!--      </el-table-column>-->
      <el-table-column prop="taskid" label="任务ID" width="70" fixed>
      </el-table-column>
      <el-table-column prop="name" label="任务名称" width="100" fixed>
      </el-table-column>
      <el-table-column prop="cron" label="定时时间" width="100">
      </el-table-column>
      <el-table-column prop="params" label="参数" width="100" min-width="100" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="tasktype" label="任务类型" width="80">
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="100">
      </el-table-column>
      <el-table-column prop="updatetime" label="更新时间" width="100">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status == '1' ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status == '1' ? '启用' : '停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="220" fixed="right">
        <template slot-scope="scope">
          <el-button
              v-if="scope.row.status == '1'"
              size="small"
              type="info"
              @click="enableAndStop(scope.row, '0')"
          >
            停用
          </el-button>
          <el-button
              v-else
              size="small"
              type="success"
              @click="enableAndStop(scope.row, '1')"
          >
            启用
          </el-button>
          <el-button size="small" type="primary" @click="mod(scope.row)">编辑</el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="del(scope.row.id)"
              style="margin-left: 5px;"
          >
            <el-button slot="reference" size="small" type="danger" >删除</el-button>
          </el-popconfirm>
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
        title="编辑"
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
        title="详情"
        :visible.sync="centerDialogVisible"
        width="80%"
        center>

      <el-form ref="form" :inline="false" :rules="rules" :model="form" label-position="left" label-width="200px"
               class="demo-ruleForm">
        <el-form-item label="id" >
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="任务ID">
          <el-input v-model="form.taskid"></el-input>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="定时时间">
          <el-input v-model="form.cron"></el-input>
        </el-form-item>
        <el-form-item label="参数">
          <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 10}"
              placeholder="请输入内容"
              v-model="form.params"></el-input>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-input v-model="form.tasktype"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="form.status" disabled></el-input>
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
  name: "ScheduleManage",
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      id: '',
      taskid: '',
      name: '',
      cron: '',
      params: '',
      tasktype: '',
      createtime: '',
      updatetime: '',
      status: '',
      centerDialogVisible: false,
      shouhuiPage: false,
      form: {
        id: '',
        taskid: '',
        name: '',
        cron: '',
        params: '',
        tasktype: '',
        createtime: '',
        updatetime: '',
        status: ''
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
      this.$axios.post(this.$httpUrl + '/taskschedule/importExcel', formData ,{ "Content-Type": "multipart/form-data;charset=utf-8"}).then(res => res.data).then(res => {
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
      this.$axios.get(this.$httpUrl + '/taskschedule/export', { responseType: 'blob' })
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
      this.$axios.post(this.$httpUrl + '/taskschedule/changeMoney', params).then(res => res.data).then(res => {
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
      this.form = {
        id: '',
        taskId: '',
        name: '',
        cron: '',
        params: '',
        taskType: '',
        createTime: '',
        updateTime: '',
        status: ''
      };
    },
    resetAddPage() {
      this.$refs.shouhuiPage.resetFields();
    },
    del(id) {
      console.log(id)

      this.$axios.get(this.$httpUrl + '/taskschedule/del?id=' + id).then(res => res.data).then(res => {
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
        this.form.taskid = row.taskid
        this.form.name = row.name
        this.form.cron = row.cron
        this.form.params = row.params
        this.form.tasktype = row.tasktype
      })
    },
    enableAndStop(row, type) {
      if (row) {
        if (type == '1') {
          this.form.status = "1";
          this.doEnable(row); //启用
        } else {
          this.form.status = "0";
          this.doStop(row); //停用
        }
      } else {
        console.log('error submit!!');
        return false;
      }
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
      this.$axios.post(this.$httpUrl + '/taskschedule/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/taskschedule/update', this.form).then(res => res.data).then(res => {
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
            message: res?.msg,
            type: 'error'
          });
        }

      })
    },
    doEnable(row) {
      this.$axios.post(this.$httpUrl + '/taskschedule/enableTask', row).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {

          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.loadPost()
          // this.resetForm()
        } else {
          this.$message({
            message: res?.msg,
            type: 'error'
          });
        }

      })
    },
    doStop(row) {
      this.$axios.post(this.$httpUrl + '/taskschedule/stopTask', row).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.loadPost()
          // this.resetForm()
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
      this.name = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/taskschedule/listPageC1', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name
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