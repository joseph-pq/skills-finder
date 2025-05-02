import { Type } from "@google/genai";

export const getRegistries = {
  name: "getRegistries",
  description: "Returns all registries.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      list: {
        type: Type.STRING,
        description: "The name of the registry to return",
        enum: ["jobs", "skills", "jobSkills"],
      },
      count: {
        type: Type.NUMBER,
        description: "The number of registries to return",
      },
      orderBy: {
        type: Type.STRING,
        description: "The field to order the registries by",
      },
    },
    required: ["list", "count", "orderBy"],
  },
};

export const groupBy = {
  name: "groupBy",
  description:
    "Groups a list of objects by a specified `key`. and return a new list with objects: {`key`: $keyValue, count: `size`}",
  parameters: {
    type: Type.OBJECT,
    properties: {
      list: {
        type: Type.STRING,
        description: "The name of the list of registries to group",
        enum: ["jobs", "skills", "jobSkills"],
      },
      newName: {
        type: Type.STRING,
        description: "The new name for the grouped list",
      },
      key: {
        type: Type.STRING,
        description: "The key to group by",
      },
    },
    required: ["list", "key", "newName"],
  },
};

export const joinLists = {
  name: "joinLists",
  description:
    "Joins two lists of objects by a specified key and returns a new list with objects of both lists",
  parameters: {
    type: Type.OBJECT,
    properties: {
      newName: {
        type: Type.STRING,
        description: "The new name for the joined list",
      },
      list1: {
        type: Type.STRING,
        description: "The name of the first list to join",
        enum: ["jobs", "skills", "jobSkills"],
      },
      list2: {
        type: Type.STRING,
        description: "The name of the second list to join",
        enum: ["jobs", "skills", "jobSkills"],
      },
      key1: {
        type: Type.STRING,
        description: "The key to join the first list by",
      },
      key2: {
        type: Type.STRING,
        description: "The key to join the second list by",
      },
    },
    required: ["list1", "list2", "key1", "key2"],
  },
};

export const functionDeclarations = [getRegistries, groupBy];
