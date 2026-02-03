'use server';

import { writeFile } from 'fs/promises';

export async function upload(formData: FormData) {
  const file = formData.get("file") as File;
  const url = formData.get("url") as string;

  if (file) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // For this example, we'll just log the file details
    // In a real application, you would process the file here
    console.log("Received file:", file.name);
    console.log("File size:", file.size);
    console.log("File type:", file.type);

    return { message: `File "${file.name}" uploaded successfully` };
  } else if (url) {
    console.log("Received URL:", url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
      }
      const fileData = await response.arrayBuffer();
      const buffer = Buffer.from(fileData);
      // Now you can process the PDF buffer
      console.log("Successfully fetched PDF from URL.");
      console.log("File size:", buffer.length);
      return { message: `Successfully fetched PDF from ${url}` };
    } catch (error) {
      console.error("Error fetching PDF from URL:", error);
      if (error instanceof Error) {
        return { message: `Error fetching PDF from URL: ${error.message}` };
      }
      return { message: `An unknown error occurred while fetching the PDF from the URL.` };
    }
  } else {
    return { message: "No file or URL provided" };
  }
}
