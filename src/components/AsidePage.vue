<template>
    <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="height: 100%;"
            default-active="/Home"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
    >
       <el-menu-item index="/Home">
           <i class="el-icon-s-home"></i>
           <span slot="title">首页</span>
       </el-menu-item>

        <el-menu-item :index="'/'+item.menuclick" v-for="(item,i) in menu" :key="i">
            <i :class="item.menuicon"></i>
            <span slot="title">{{item.menuname}}</span>
        </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span slot="title">个人服务</span>
        </template>
          <el-menu-item index="/storage/schedule">
            <span slot="title">调度任务</span>
          </el-menu-item>
<!--          <el-menu-item index="1-2">选项2</el-menu-item>-->
     
<!--        <el-menu-item-group title="分组2">-->
<!--          <el-menu-item index="1-3">选项3</el-menu-item>-->
<!--        </el-menu-item-group>-->
<!--        <el-submenu index="1-4">-->
<!--          <template slot="title">选项4</template>-->
<!--          <el-menu-item index="1-4-1">选项4-1</el-menu-item>-->
<!--        </el-submenu>-->
      </el-submenu>


    </el-menu>
</template>

<script>
    export default {
        name: "AsidePage",
        data(){
            return {
                //isCollapse:false

               /* menu:[
                    {
                        menuClick:'Admin',
                        menuName:'管路员管理',
                        menuIcon:'el-icon-s-custom'
                    },{
                        menuClick:'User',
                        menuName:'用户管理',
                        menuIcon:'el-icon-user-solid'
                    }
                ]*/
            }
        },
        computed:{
            "menu":{
                get(){
                    return this.$store.state.menu
                }
            }
        },
        props:{
            isCollapse:Boolean
        }
    }
</script>

<style scoped>

</style>