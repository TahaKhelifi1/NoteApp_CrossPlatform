import { ID } from "appwrite";
import databases, { listDocuments, APPWRITE_DATABASE_ID, APPWRITE_COLLECTION_ID } from "./database-service";

// Helper to normalize Appwrite document to local note shape
const normalize = (doc) => {
  return {
    id: doc.$id || doc.id,
    title: doc.title || "",
    content: doc.content || "",
    createdAt: doc.createdAt || doc.$createdAt || null,
    updatedAt: doc.updatedAt || doc.$updatedAt || null,
    userId: doc.userId || null,
    raw: doc,
  };
};

export const getNotes = async (userId = null) => {
  try {
    const queries = [];
    if (userId) {
      // Use Appwrite Query equal if userId is provided
      // Import Query dynamically to avoid errors if appwrite not installed yet
      // eslint-disable-next-line global-require
      const { Query } = require("appwrite");
      queries.push(Query.equal("userId", userId));
    }
    // Sort newest first using system createdAt field
    try {
      const { Query } = require("appwrite");
      queries.push(Query.orderDesc("$createdAt"));
    } catch (e) {
      // ignore if Query not available
    }

    const docs = await listDocuments(queries);
    return docs.map(normalize);
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

export const createNote = async (data) => {
  try {
    // Appwrite automatically manages $createdAt and $updatedAt
    const noteData = {
      title: data.title || "",
      content: data.content || "",
      userId: data.userId || "",
    };

    const response = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      ID.unique(),
      noteData
    );

    return normalize(response);
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    await databases.deleteDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId
    );
    return true;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};

export const updateNote = async (noteId, data) => {
  try {
    // Appwrite automatically updates $updatedAt
    const noteData = {
      title: data.title,
      content: data.content,
    };

    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      noteId,
      noteData
    );

    return normalize(response);
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};
