'use server';

import { initializeApp, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp();
}

const adminApp = getApp();
const db = getFirestore(adminApp);

export { adminApp, db };
