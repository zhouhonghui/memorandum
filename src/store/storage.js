export default class Storage {
    // 获取数据
    get_data (key) {
        if(localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key))
        }else{
            return []
        }
    }
    // 储存数据
    // 数据格式： {id: 1, date: "2018-12-15", state: false, event: "旅游"}
    set_data (key, value) {
        let str = JSON.stringify(value)
        localStorage.setItem(key, str)
    }
}