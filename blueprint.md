# Project Blueprint

## Overview

This is a Next.js application built with the App Router. It is integrated with Firebase for backend services and uses Tailwind CSS for styling. The project is configured for a modern, secure, and efficient development workflow within the Firebase Studio environment.

## Project Outline

### Core Technologies
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **Backend Integration:** Firebase
*   **Environment:** Firebase Studio (nix-based)

### Features & Implementation
*   **Firebase Setup:**
    *   Firebase SDK is integrated into the project.
    *   Firebase configuration is securely managed using environment variables (`.env.local`).
    *   A dedicated Firebase initialization module exists at `src/lib/firebase.ts`.
*   **Routing:** File-based routing with the App Router.
*   **Styling:** Global styles and Tailwind CSS are configured.

## Current Plan

### Task: Initial Firebase Integration and Setup
*   **Objective:** Securely configure Firebase in the Next.js application.
*   **Steps Completed:**
    1.  Created `.env.local` to store Firebase credentials securely.
    2.  Created `src/lib/firebase.ts` to initialize the Firebase app using the environment variables. This keeps sensitive information out of source code.
    3.  Configured Firebase MCP server in `.idx/mcp.json`.
