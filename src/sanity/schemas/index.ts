import type { SchemaTypeDefinition } from "sanity";
import { objects } from "./objects";
import { singletons, singletonTypes } from "./singletons";
import { collections } from "./collections";

export const schemaTypes: SchemaTypeDefinition[] = [
  ...objects,
  ...singletons,
  ...collections,
];

export { singletonTypes };
