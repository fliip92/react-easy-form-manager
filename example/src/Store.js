/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import { types, flow } from "mobx-state-tree";

export const demoStore = types.model("demoStore", {
  tab: types.optional(types.number, 0)
}).actions(self => ({
  changeTab(newTab){
    console.log(newTab)
    self.tab = newTab
  }
}))