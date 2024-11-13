import vue from 'vue'
import Vuex from 'vuex'
import router,{resetRouter} from "../router";
vue.use(Vuex)

function addNewRoute(menuList) {
    console.log(menuList)
    let routes = router.options.routes
    console.log(routes)
    routes.forEach(routeItem=>{
        if(routeItem.path=="/Index"){
            menuList.forEach(menu=>{
                let childRoute =  {
                    path:'/'+menu.menuclick,
                    name:menu.menuname,
                    meta:{
                        title:menu.menuname
                    },
                    component:()=>import('../components/'+menu.menucomponent)
                }

                routeItem.children.push(childRoute)

                routeItem.children.push({
                    path:'/storage/schedule',
                    name:'调度任务',
                    meta:{
                        title:'调度任务'
                    },
                    component:()=>import('../components/storage/ScheduleManage.vue')
                })
            })
        }
    })

    resetRouter()
    router.addRoutes(routes)
}

export default new Vuex.Store({
    state: {
        menu: []
    },
    mutations: {
        setMenu(state,menuList) {
            state.menu = menuList

            addNewRoute(menuList)
        }
    },
    getters: {
        getMenu(state) {
            return state.menu
        }
    }
    
})