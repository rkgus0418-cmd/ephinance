import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  setDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Report, Member } from '../types';
import { REPORTS, MEMBERS } from '../data';

const REPORTS_COLLECTION = 'reports';
const MEMBERS_COLLECTION = 'members';
const SETTINGS_COLLECTION = 'settings';

interface SiteSettings {
  logoUrl?: string;
  recruitmentTitle?: string;
  recruitmentDate?: string;
  recruitmentApplyUrl?: string;
  aboutContent?: {
    pipelineTitle?: string;
    pipelineDesc?: string;
    clinicalTitle?: string;
    clinicalDesc?: string;
    licensingTitle?: string;
    licensingDesc?: string;
    disciplineTitle?: string;
    disciplineDesc?: string;
  };
  curriculumContent?: {
    phases?: Array<{
      title: string;
      desc: string;
      details: string;
    }>;
  };
}

export const dataService = {
  async getReports(): Promise<Report[]> {
    try {
      const q = query(collection(db, REPORTS_COLLECTION));
      const querySnapshot = await getDocs(q);
      const results: Report[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Report);
      });

      if (results.length === 0) {
        return REPORTS;
      }

      // Sort by order first, then by date desc
      return results.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return b.date.localeCompare(a.date);
      });
    } catch (e) {
      console.error("Firebase error", e);
      return REPORTS;
    }
  },

  async getReportById(id: string): Promise<Report | null> {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Report;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  async addReport(report: Omit<Report, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), report);
    return docRef.id;
  },

  async updateReport(id: string, report: Partial<Report>): Promise<void> {
    const docRef = doc(db, REPORTS_COLLECTION, id);
    await updateDoc(docRef, report);
  },

  async deleteReport(id: string): Promise<void> {
    const docRef = doc(db, REPORTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Members
  async getMembers(): Promise<Member[]> {
    try {
      const q = query(collection(db, MEMBERS_COLLECTION));
      const querySnapshot = await getDocs(q);
      const results: Member[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as Member);
      });

      if (results.length === 0) {
        return MEMBERS;
      }

      // Sort by cohort desc, then by order
      return results.sort((a, b) => {
        if (a.cohort !== b.cohort) return b.cohort.localeCompare(a.cohort);
        return (a.order || 0) - (b.order || 0);
      });
    } catch (e) {
      return MEMBERS;
    }
  },

  async addMember(member: Omit<Member, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), member);
    return docRef.id;
  },

  async updateMember(id: string, member: Partial<Member>): Promise<void> {
    const docRef = doc(db, MEMBERS_COLLECTION, id);
    await updateDoc(docRef, member);
  },

  async deleteMember(id: string): Promise<void> {
    const docRef = doc(db, MEMBERS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Site Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, 'main_settings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as SiteSettings;
      }
      return {};
    } catch (e) {
      return {};
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, 'main_settings');
    await setDoc(docRef, settings, { merge: true });
  },

  // Storage
  async uploadPDF(file: File): Promise<string> {
    const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  async uploadImage(file: File): Promise<string> {
    // Compress image before uploading
    const compressedBlob = await new Promise<Blob>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1200;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          }, 'image/jpeg', 0.7);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, compressedBlob);
    return await getDownloadURL(snapshot.ref);
  }
};
