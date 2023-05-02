type Deps = any

export type ExampleService = {
  getIndexList: () => Promise<[]>
}

export const createExampleService = (deps: Deps): ExampleService => {
  return {
    getIndexList: async () => [],
  }
}
