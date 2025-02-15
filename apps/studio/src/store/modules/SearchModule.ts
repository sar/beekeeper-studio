import { FavoriteQuery } from "@/common/appdb/models/favorite_query";
import { TableOrView } from "@/lib/db/models";
import FlexSearch from "flexsearch";
import { Module } from "vuex";
import { State as RootState } from '../index'

interface FlexWorker {
  addAsync(id: any, item: string): Promise<void>
  searchAsync(term: string): Promise<number[]>
  removeAsync(id: any): Promise<void>
}

interface IndexItem {
  title: string
  item: FavoriteQuery | TableOrView
  type: 'query' | 'table'
}

interface State {
  searchIndex: FlexWorker
}

export const SearchModule: Module<State, RootState> = {
  namespaced: true,
  state: () => ({
    // @ts-ignore
    searchIndex: new FlexSearch.Worker({ tokenize: 'forward' })
  }),
  getters: {
    database(_state: State, _getters, root: RootState): IndexItem[] {
      const tables: IndexItem[] = root.tables.map((t) => {
        const title = t.schema ? `${t.schema}.${t.name}` : t.name
        return { item: t, type: 'table', title, id: title }
      })
      const favorites: IndexItem[] = root.favorites.map((f) => ({ item: f, type: 'query', title: f.title, id: f.id }))
      return [...tables, ...favorites]
    },
  },
  mutations: {
  },

}