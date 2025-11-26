import { Databases } from "appwrite";
import { client, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./appwrite-config";

// The database and collection IDs with fallback values
let APPWRITE_DATABASE_ID = "69158ec0000624c38e92";
let APPWRITE_COLLECTION_ID = "notes";

try {
  // eslint-disable-next-line import/no-unresolved
  const env = require("@env");
  if (env.APPWRITE_DATABASE_ID) APPWRITE_DATABASE_ID = env.APPWRITE_DATABASE_ID;
  if (env.APPWRITE_COLLECTION_ID) APPWRITE_COLLECTION_ID = env.APPWRITE_COLLECTION_ID;
} catch (e) {
  // Use hardcoded defaults if env not available
  console.log("Using default database configuration");
}

const databases = new Databases(client);

export { APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID };

export const listDocuments = async (queries = []) => {
  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      queries
    );
    return response.documents;
  } catch (error) {
    console.error("Error listing documents:", error);
    throw error;
  }
};

export default databases;
