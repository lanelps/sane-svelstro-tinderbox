import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";

import type { PluginOptions } from "sanity";

import { schema } from "./src/sanity/schemas";
import { deskStructure } from "./src/sanity/lib/desk";
import { resolve } from "./src/sanity/lib/resolve";

const isDev = import.meta.env.MODE === "development";

export default defineConfig({
  name: "default",
  title: "boilerplate",

  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,

  plugins: [
    structureTool({ structure: deskStructure }),
    presentationTool({ resolve, previewUrl: location.origin }),
    isDev ? visionTool() : null,
    muxInput(),
  ].filter((plugin): plugin is PluginOptions => plugin !== null),

  schema,
});
