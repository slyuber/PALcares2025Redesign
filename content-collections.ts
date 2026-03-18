import { defineSingleton, defineConfig } from "@content-collections/core";
import { z } from "zod";

const global = defineSingleton({
  name: "global",
  filePath: "content/global.json",
  parser: "json",
  schema: z.object({
    supportEmail: z.string().email(),
  }),
});

export default defineConfig({
  collections: [global],
});
