export default {
    add_data({ commit }, data_template) {
        commit('ADD_EVENT', data_template)
    },
    change_st({ commit }, index) {
        commit('CHANGE_STATE', index)
    },
    change_data({ commit }, changeJson) {
        commit('CHANGE_DATA', changeJson)
    },
    delect_once({ commit }, index) {
        commit('DELECT_ONCE', index)
    },
    batch_done({ commit }, obj) {
        commit('BATCH_DONE', obj)
    },
    batch_doing({ commit }, obj) {
        commit('BATCH_DOING', obj)
    },
    batch_delect({ commit }, obj) {
        commit('BATCH_DELECT', obj)
    }
}