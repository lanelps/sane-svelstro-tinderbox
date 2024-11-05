import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineDocuments, presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";

import type { PluginOptions } from "sanity";

import { schemaTypes } from "./src/schemas";
import { deskStructure } from "./src/desk";
import { locate } from "./src/structure/locate.ts";

const isDev = import.meta.env.DEV;
const PROJECT_ID = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const DATASET = import.meta.env.PUBLIC_SANITY_DATASET;
const PREVIEW_URL =
  import.meta.env.PUBLIC_SANITY_STUDIO_PREVIEW_URL || "http://localhost:4321/";

if (!PROJECT_ID || !DATASET) {
  throw new Error(
    `Missing environment variable(s). Check if named correctly in .env file.\n\nShould be:\nPUBLIC_SANITY_STUDIO_PROJECT_ID=${PROJECT_ID}\nPUBLIC_SANITY_STUDIO_DATASET=${DATASET}\n\nAvailable environment variables:\n${JSON.stringify(
      import.meta.env,
      null,
      2
    )}`
  );
}

export default defineConfig({
  name: "default",
  title: "boilerplate",

  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({ structure: deskStructure }),
    // presentationTool({ previewUrl: PREVIEW_URL }),
    presentationTool({
      previewUrl: PREVIEW_URL,
      title: "Presentation",
      resolve: {
        // *todo* apparently non-functional as yet
        mainDocuments: defineDocuments([
          {
            route: "/projects/:slug",
            filter: `_type == "project" && slug.current == $slug`,
          },
        ]),
        locations: locate,
      },
    }),
    isDev ? visionTool() : null,
  ].filter((plugin): plugin is PluginOptions => plugin !== null),

  schema: {
    types: schemaTypes,
  },
});
