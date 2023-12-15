import { createSelector, createSlice } from '@reduxjs/toolkit'

import { qsoKey } from '@ham2k/lib-qson-tools'

const INITIAL_STATE = {
  status: 'ready',
  info: {},
  keys: {}
}

const OPERATION_INITIAL_STATE = {
  call: '',
  operator: '',
  station: '',
  position: '',
  grid: '',
  band: undefined,
  freq: undefined,
  mode: 'SSB',
  power: undefined,
  status: 'ready'
}

export const operationsSlice = createSlice({
  name: 'operations',

  initialState: INITIAL_STATE,

  reducers: {
    setOperationsStatus: (state, action) => {
      state.status = action.payload
    },
    setOperations: (state, action) => {
      state.info = action.payload
    },
    setOperation: (state, action) => {
      const info = action.payload
      if (info.power) info.power = parseInt(info.power, 10)

      state.info[action.payload.uuid] = { ...OPERATION_INITIAL_STATE, ...state.info[action.payload.uuid], ...info }

      const newInfo = state.info[action.payload.uuid]

      if (newInfo.description) {
        newInfo.name = newInfo.description
        if (newInfo.pota) {
          newInfo.name += ` (POTA ${newInfo.pota})`
        }
      } else if (newInfo.pota) {
        newInfo.name = `POTA ${newInfo.pota}`
      } else {
        newInfo.name = 'General Operation'
      }
    },
    deleteOperation: (state, action) => {
      state.info.delete(action.payload.uuid)
    }
  }

})

export const { actions } = operationsSlice

export const selectOperationsStatus = (state) => {
  return state?.operations?.status
}

export const selectOperation = (uuid) => createSelector(
  (state) => state?.operations?.info[uuid],
  (info) => info ?? {}
)

export const selectOperationsList = createSelector(
  (state) => state?.operations?.info,
  (info) => {
    return Object.values(info || {}).sort((a, b) => {
      return a.uuid?.localeCompare(b.uuid)
    })
  }
)

export default operationsSlice.reducer
