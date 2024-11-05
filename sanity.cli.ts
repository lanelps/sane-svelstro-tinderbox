import {defineCliConfig} from 'sanity/cli'

const PROJECT_ID =
  process.env.PUBLIC_SANITY_STUDIO_PROJECT_ID! || process.env.PUBLIC_SANITY_PROJECT_ID!
const DATASET = process.env.PUBLIC_SANITY_STUDIO_DATASET! || process.env.PUBLIC_SANITY_DATASET!

export default defineCliConfig({
  api: {
    projectId: PROJECT_ID,
    dataset: DATASET,
  },
  autoUpdates: true,
})
