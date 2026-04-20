import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Test connection as per guidelines
async function testConnection() {
  try {
    // Attempting to read a dummy doc to verify connection
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase connected successfully");
  } catch (error: any) {
    if (error.message?.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network.");
    } else {
      // It's fine if doc doesn't exist, as long as it's not a connection error
      console.log("Firebase initialized");
    }
  }
}

testConnection();

export interface FirestoreErrorInfo {
  error: string;
  operationType: "create" | "update" | "delete" | "list" | "get" | "write";
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: any[];
  }
}

export function handleFirestoreError(error: any, operation: FirestoreErrorInfo["operationType"], path: string | null = null): void {
  const user = auth.currentUser;
  const info: FirestoreErrorInfo = {
    error: error.message || "Unknown error",
    operationType: operation,
    path,
    authInfo: {
      userId: user?.uid || "unauthenticated",
      email: user?.email || "",
      emailVerified: user?.emailVerified || false,
      isAnonymous: user?.isAnonymous || true,
      providerInfo: user?.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName,
        email: p.email
      })) || []
    }
  };
  
  if (error.code === 'permission-denied') {
    throw new Error(JSON.stringify(info));
  }
  throw error;
}
