import storage from './storage'
import { ADD_EVENT,CHANGE_STATE,CHANGE_DATA,DELECT_ONCE,BATCH_DONE,BATCH_DOING,BATCH_DELECT } from './mutations-type'

export default {
    [ADD_EVENT](state, memorandum) {
        state.memorandum.unshift(memorandum)
        let stor = new storage()
        let key = 'memorandum'        
        stor.set_data(key, state.memorandum)
        state.id ++
    },
    [CHANGE_STATE](state, index){
        let bl = state.memorandum[index].state
        bl = !bl
        let stor = new storage()
        let key = 'memorandum'        
        stor.set_data(key, state.memorandum)
    },
    [CHANGE_DATA](state, changeJson) {
        let index = changeJson.index
        state.memorandum[index].date = changeJson.date
        state.memorandum[index].dec = changeJson.dec
        let stor = new storage()
        let key = 'memorandum'        
        stor.set_data(key, state.memorandum)
    },
    [DELECT_ONCE](state, index) {
        state.memorandum.splice(index, 1)
        let stor = new storage()
        let key = 'memorandum'        
        stor.set_data(key, state.memorandum)
    },
    [BATCH_DONE](state, obj) {
        obj.map(element => {
            let id = element
            state.memorandum.map((element, index) => {
                if(element.id === id){
                    let bl = state.memorandum[index]
                    bl.state = true
                    let stor = new storage()
                    let key = 'memorandum'        
                    stor.set_data(key, state.memorandum)
                }
            })
        })
    },
    [BATCH_DOING](state, obj) {
        obj.map(element => {
            let id = element
            state.memorandum.map((element, index) => {
                if(element.id === id){
                    let bl = state.memorandum[index]
                    bl.state = false
                    let stor = new storage()
                    let key = 'memorandum'        
                    stor.set_data(key, state.memorandum)
                }
            })
        })
    },
    [BATCH_DELECT](state, obj) {
        obj.map(element => {
            let id = element
            state.memorandum.map((element, index) => {
                if(element.id === id){
                    state.memorandum.splice(index, 1)
                    let stor = new storage()
                    let key = 'memorandum'        
                    stor.set_data(key, state.memorandum)
                }
            })
        })
    }
}