import Vue from 'vue'
import Vuex from 'vuex'

import {
	createPersistedState,
	// createSharedMutations
} from 'vuex-electron'

// import modules from './modules'

Vue.use(Vuex)

const state = {
	// main: 0
	textValue: '',
	filePath: '',
	saveFlag: true,
	// imgBuffer: [],
}

const mutations = {
	setValue(state, value) {
		state.textValue = value
	},
	setPath(state, value) {
		state.filePath = value
	},
	setSaveFlag(state, value) {
		state.saveFlag = value
	},
	// setImgBuffer(state, value) {
	// 	state.imgBuffer.push(value)
	// },
	// clearImgBuffer(state, value) {
	// 	state.imgBuffer.length = 0
	// },
	// INCREMENT_MAIN_COUNTER (state) {
	//   state.main++
	// }
}

export default new Vuex.Store({
	state,
	mutations,
	plugins: [
		createPersistedState(),
		// createSharedMutations()
	],
	strict: process.env.NODE_ENV !== 'production'
})
