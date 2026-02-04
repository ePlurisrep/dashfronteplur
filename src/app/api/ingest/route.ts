'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';

async function normalizeAndSaveData(source: string, data: string | Buffer) {
  console.log(`Normalizing and saving data from source: ${source}`);

  let processedData: string;

  if (source === 'pdf') {
    // Store the PDF data as a base64 string
    processedData = data.toString('base64'); 
    console.log(`Received PDF data with size: ${data.length}`);
  } else {
    processedData = data.toString();
    console.log(`Received text data: ${data}`);
  }

  try {
    const docRef = await db.collection('ingested_data').add({
      source,
      data: processedData,
      createdAt: new Date(),
    });
    console.log('Document written with ID: ', docRef.id);
    return { success: true, message: 'Data normalized and saved successfully.' };
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Could not save data to the database.');
  }
}

export async function POST(req: NextRequest) {
  try {
    const { source, data } = await req.json();

    if (!source || !data) {
      return NextResponse.json({ error: 'Missing source or data' }, { status: 400 });
    }

    let processedData: string | Buffer = data;

    if (source === 'pdf' && typeof data === 'string' && data.startsWith('http')) {
      try {
        const response = await fetch(data);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
        }
        const pdfBuffer = await response.arrayBuffer();
        processedData = Buffer.from(pdfBuffer);
        console.log(`Successfully fetched PDF from ${data}`);
      } catch (error) {
        console.error("Error fetching PDF from URL:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: `Error fetching PDF from URL: ${errorMessage}` }, { status: 500 });
      }
    }

    const result = await normalizeAndSaveData(source, processedData);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error during ingestion:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: `An error occurred during ingestion: ${errorMessage}` }, { status: 500 });
  }
}
