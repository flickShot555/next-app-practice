import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const adminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
};

const hasAdminConfig = Object.values(adminConfig).every(Boolean);

const app = hasAdminConfig
  ? getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: adminConfig.projectId,
          clientEmail: adminConfig.clientEmail,
          privateKey: adminConfig.privateKey.replace(/\\n/g, "\n"),
        }),
      })
  : null;

const adminDb = app ? getFirestore(app) : null;

export { adminDb, hasAdminConfig };
