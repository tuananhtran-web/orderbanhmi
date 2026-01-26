
// Fix: Use compat version of Firebase for v8-style API compatibility in a v9+ environment
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Add storage import

// --- CẤU HÌNH FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDOs-8wXm0iqck_9XaIvDJM5vOS1gftnc4",
  authDomain: "orderbanhmi-cd79f.firebaseapp.com",
  projectId: "orderbanhmi-cd79f",
  storageBucket: "orderbanhmi-cd79f.firebasestorage.app",
  messagingSenderId: "91405657195",
  appId: "1:91405657195:web:a06adac1aa7ebd16cb7d2e",
  measurementId: "G-RQ8XQXT2HB",
  databaseURL: "https://orderbanhmi-cd79f-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Khởi tạo Firebase
// Fix: Use compat initializeApp to resolve property missing error on modular SDK
const app = firebase.initializeApp(firebaseConfig);

/**
 * CẬP NHẬT: Sử dụng firebase.firestore() cho khả năng tương thích với môi trường hiện tại.
 * Fix: Use compat firestore to resolve property missing error on modular SDK
 */
const db = firebase.firestore();
const storage = firebase.storage(); // Export storage

// --- CẤU HÌNH CLOUDINARY ---
const CLOUDINARY_CLOUD_NAME = "deuqalvq5"; 
const CLOUDINARY_UPLOAD_PRESET = "banhmi_preset"; 

// --- HELPER UPLOAD ẢNH (Cloudinary) ---
export const uploadFileToFirebase = async (file: File, folder: string = 'general'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

// --- COLLECTION PREFIX ---
// Thêm tiền tố để tách biệt dữ liệu với các app khác dùng chung Firebase Project
export const DB_PREFIX = 'bm_';

// Helper để lấy tên collection có prefix
export const getCollection = (name: string) => db.collection(`${DB_PREFIX}${name}`);

export { db, storage, firebase };
