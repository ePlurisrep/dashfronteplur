'use server';

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp();
}

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    const snapshot = await db.collection('ingested_data').orderBy('createdAt', 'desc').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `An error occurred while fetching data: ${errorMessage}` }, { status: 500 });
  }
}
