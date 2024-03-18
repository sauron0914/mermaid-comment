const initState = {
  error: null,
  header: null,
}

const reducer = {
  init (state) {
    return { ...state, ...initState }
  },
  addHeader (state, payload) {
    return { ...state, header: payload.el }
  },
  removeHeader (state) {
    return { ...state, hasHeader: null }
  },
}

export default {
  state: {
    ...initState,
  },
  reducer (state, action) {
    const { type, payload } = action
    if (reducer[type]) {
      return reducer[type](state, payload)
    }
    throw new Error(`未定义action ${type}`)
  },
}
