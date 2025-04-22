import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { LearningType, LearningStage } from "../../shared/enums/Assignment"; // Adjust the path if necessary

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/


const schema = a.schema({
    Assignment: a
    .model({
      title: a.string().required(), // Title of the assignment
      content: a.string().required(), // Content or description of the assignment
      ageRange: a.customType({
          lower: a.integer().required(), // Lower age limit
          upper: a.integer().required(), // Upper age limit
        }),
      workSet: a.string(), // Optional work set name
      learningType: a.enum(Object.values(LearningType)), // Type of learning
      learningStage: a.enum(Object.values(LearningStage)), // Stage of learning
      scaffolding: a
        .customType({
          chunks: a.boolean(), // Break assignment into smaller chunks
          guidance: a.boolean(), // Guidance or supervision
          visualAids: a.boolean(), // Additional visual aids
        }),
    })
    .authorization((allow) => [allow.publicApiKey()])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
