<template>
  <div class="memorandum">
    <el-row class="header">
      <el-col class="header-left" :span="12">备忘录</el-col>
      <el-col class="header-right" :span="12">
        <el-button @click="dialogFormVisible = true" type="primary" icon="el-icon-edit" circle></el-button>
      </el-col>
    </el-row>
    <el-row class="data-wrap">
      <el-col :span="24">
        <!-- table -->
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="日期"
            width="100">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            width="80">
            <template slot-scope="scope">
              <el-tag size="small" :type="scope.row.state === true ? 'success' : 'danger'">{{ scope.row.state === true ? '已办':'待办' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="dec"
            label="事件"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="hidden-xs-only"
                size="mini"
                type="success"
                @click="handledb(scope.$index, scope.row)">{{ scope.row.state === false ? '已办':'待办' }}</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                class="hidden-xs-only"
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px;padding-left: 15px;">
          <el-button @click="batch_done" size="small" type="success" plain>批量已办</el-button>
          <el-button @click="batch_doing" size="small" type="info" plain>批量待办</el-button>
          <el-button @click="batch_delect" size="small" type="danger" plain>批量删除</el-button>
        </div>
        <!-- table -->
      </el-col>
    </el-row>
    <!-- dialog -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form :model="form">
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker
            class="date-input"
            v-model="form.date"
            type="date"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="事件" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="form.dec">
          </el-input>
        </el-form-item>
        <el-form-item class="form-bottom-box">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button v-show="!changebtn" type="primary" @click="onSubmit">添加</el-button>
          <el-button v-show="changebtn" type="primary" @click="changeData">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- dialog -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'memorandum',
  data() {
      return {
        dialogFormVisible: false,
        title:'添加备忘事件',
        changebtn: false,
        index_data:'',
        form: {
          date: '',
          dec: ''
        },
        formLabelWidth: '40px',
        tableData3: this.$store.state.memorandum,
        multipleSelection: [],
        idlist: []
      }
    },
  computed:{
    ...mapGetters([
      'max_id'
    ])
  },
  methods: {
    handledb(index, row) {
      row.state = !row.state
      this.$store.dispatch('change_st', index)
    },
    handleEdit(index, row) {
      this.title = '修改备忘事件'
      this.changebtn = true
      this.form.date = row.date
      this.form.dec = row.dec
      this.dialogFormVisible = true
      this.index_data = index
    },
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('delect_once', index)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let ids = []
      this.multipleSelection.map(element => {
        ids.push(element.id)
        return ids
      })
      this.idlist = [...ids]
      console.log(ids)
      console.log(this.idlist)
    },
    handleClose() {
      this.title = '添加备忘事件'
      this.form.date = ''
      this.form.dec = ''
      this.changebtn = false
    },
    onSubmit() {
      let data_template = {id: 1, date: "2018-12-15", state: false, dec: "旅游"}
      let form = this.form
      data_template['date'] = form.date
      data_template['dec'] = form.dec
      data_template['id'] = this.max_id + 1
      let once = element => element.date === data_template.date && element.dec === data_template.dec
      let dataBox = this.$store.state.memorandum
      if(!(data_template.date && data_template.dec)){
        this.$message({
          message: '时间或事件不能为空',
          type: 'warning'
        });
      }else if(dataBox.some(once)){
        this.$message.error('相同时间内不能添加相同事件')
      }else{
        this.$store.dispatch('add_data', data_template)
        this.dialogFormVisible = false
      }
    },
    changeData() {
      let index = this.index_data
      let dataBox = this.$store.state.memorandum
      let once = element => element.date === this.form.date && element.dec === this.form.dec
      if(!(this.form.date && this.form.dec)){
        this.$message({
          message: '时间或事件不能为空',
          type: 'warning'
        });
      }else if((dataBox[index].date === this.form.date) && (dataBox[index].dec === this.form.dec)){
        this.dialogFormVisible = false
      }else if(dataBox.some(once)){
        this.$message.error('修改后的备忘信息已存在，您可以选择删除本条记录')
      }else{
        let changeJson = {index: index, date: this.form.date, dec: this.form.dec}
        this.$confirm('此操作将装修改备忘信息, 是否继续?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('change_data', changeJson)
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });
        this.dialogFormVisible = false
      }
    },
    batch_done() {
      if(this.idlist.length === 0){
        this.$message.error('请至少选择一条数据进行操作')
      }else{
        this.$store.dispatch('batch_done', this.idlist)
      }
    },
    batch_doing() {
      if(this.idlist.length === 0){
        this.$message.error('请至少选择一条数据进行操作')
      }else{
        this.$store.dispatch('batch_doing', this.idlist)
      }
    },
    batch_delect() {
      if(this.idlist.length === 0){
        this.$message.error('请至少选择一条数据进行操作')
      }else{
        this.$confirm('此操作将永久删除信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('batch_delect', this.idlist)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    }
  }
}
</script>

<style lang="less">
.header{
  padding: 15px 0;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 0 10px #ccc;
}
.header-left{
  padding-left: 30px;
  font-size: 26px;
  color: #409EFF;
  line-height: 40px;
}
.header-right{
  text-align: right;
  padding-right: 30px;
}
.data-wrap{
  margin-top: 20px;
}
.date-input{
  width: 100%!important;
}
.form-bottom-box{
  text-align: right;
  margin-bottom: 0;
  padding-top: 15px;
}
</style>