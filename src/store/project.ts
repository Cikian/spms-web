import { defineStore } from 'pinia'

export const useProjectStore = defineStore({
  id: 'project',
  state: () => ({
    currentProId: '',
  }),
    actions: {
        setCurrentProId(id) {
        this.currentProId = id
        },
    },

})