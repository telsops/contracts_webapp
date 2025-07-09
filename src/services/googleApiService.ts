import { GOOGLE_SCRIPT_URL, SPREADSHEET_ID, DRIVE_FOLDER_ID } from '../constants';
import type { Estate, Locator, ContractType } from '../types';

/**
 * =================================================================================
 * IMPORTANT NOTE FOR THE DEVELOPER
 * =================================================================================
 * This file acts as a bridge to your Google Apps Script backend.
 * Each function here corresponds to an action that your Apps Script web app
 * must handle. You need to deploy an Apps Script project as a web app and
 * replace the `GOOGLE_SCRIPT_URL` in `constants.ts` with your deployment URL.
 *
 * In your Apps Script `doPost(e)` and `doGet(e)` functions, you will receive a
 * parameter `action` in the request body (for POST) or query string (for GET).
 * You should use a switch statement on `action` to call the correct backend
 * Apps Script function.
 *
 * Example Apps Script `doPost(e)`:
 *
 * function doPost(e) {
 *   const params = JSON.parse(e.postData.contents);
 *   const action = params.action;
 *   let result;
 *
 *   try {
 *     switch(action) {
 *       case 'createUser':
 *         result = createUser(params.data);
 *         break;
 *       case 'addLocator':
 *         result = addLocator(params.data);
 *         break;
 *       // ... other cases
 *       default:
 *         throw new Error("Invalid action");
 *     }
 *     return ContentService.createTextOutput(JSON.stringify({ status: 'success', data: result }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.message }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 * =================================================================================
 */

// Helper to generate a unique ID. Your Apps Script can use `Utilities.getUuid()`
const generateSsid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// --- API Functions ---

export const createUser = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const ssid = generateSsid();
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' }, // Required for Apps Script
        body: JSON.stringify({
            action: 'createUser',
            spreadsheetId: SPREADSHEET_ID,
            data: { ssid, email, password }
        }),
    });
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return { success: true, message: "User created successfully." };
};

export const loginUser = async (email: string, password: string, estate: Estate): Promise<{ ssid: string; email: string }> => {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'loginUser');
    url.searchParams.append('spreadsheetId', SPREADSHEET_ID);
    url.searchParams.append('email', email);
    url.searchParams.append('password', password);
    url.searchParams.append('estate', estate);

    const response = await fetch(url.toString());
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result.data;
};

export const loginAdmin = async (email: string, password: string): Promise<{ email: string }> => {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'loginAdmin');
    url.searchParams.append('spreadsheetId', SPREADSHEET_ID);
    url.searchParams.append('email', email);
    url.searchParams.append('password', password);

    const response = await fetch(url.toString());
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result.data;
};


export const getLocatorDataForEstate = async (estate: Estate): Promise<Locator[]> => {
    const url = new URL(GOOGLE_SCRIPT_URL);
    url.searchParams.append('action', 'getLocators');
    url.searchParams.append('spreadsheetId', SPREADSHEET_ID);
    url.searchParams.append('estate', estate);

    const response = await fetch(url.toString());
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result.data;
};


export const addLocator = async (locatorData: Omit<Locator, 'id' | 'contracts'>): Promise<Locator> => {
     const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            action: 'addLocator',
            spreadsheetId: SPREADSHEET_ID,
            data: locatorData
        }),
    });
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result.data;
};

export const deleteLocator = async (locatorId: string): Promise<{ success: boolean }> => {
     const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            action: 'deleteLocator',
            spreadsheetId: SPREADSHEET_ID,
            data: { locatorId }
        }),
    });
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return { success: true };
};

export const uploadContractFile = async (locatorId: string, contractType: ContractType, file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = (e.target?.result as string).split(',')[1];
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    action: 'uploadContract',
                    spreadsheetId: SPREADSHEET_ID,
                    driveFolderId: DRIVE_FOLDER_ID,
                    data: {
                        locatorId,
                        contractType,
                        fileName: file.name,
                        mimeType: file.type,
                        fileData,
                    }
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.status === 'success') {
                    resolve(result.data);
                } else {
                    reject(new Error(result.message));
                }
            })
            .catch(error => reject(error));
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const deleteContract = async (contractId: string): Promise<{ success: boolean }> => {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            action: 'deleteContract',
            spreadsheetId: SPREADSHEET_ID,
            data: { contractId }
        }),
    });
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return { success: true };
};

export const exportToNewSheet = async (data: Locator[], estate: Estate): Promise<string> => {
     const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
            action: 'exportToSheet',
            data: { locators: data, estateName: estate }
        }),
    });
    const result = await response.json();
    if (result.status !== 'success') throw new Error(result.message);
    return result.data.url; // Apps script should return the URL of the new sheet
};