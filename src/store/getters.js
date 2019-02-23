export default {
    max_id(state){
        let ids = []
        let max = 10000
        if(state.memorandum.length === 0){
            return max
        }else{
            state.memorandum.map(element => {
                ids.push(element.id)
            })
            let idsort = ids.sort((a, b) => a - b)
            max = Math.max(...idsort)
            return max
        }
    }
}