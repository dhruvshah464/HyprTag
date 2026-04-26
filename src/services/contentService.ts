import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { geminiService } from './geminiService';

export const contentService = {
  /**
   * Generates and saves content.
   */
  async generateAndSave(userId: string, topic: string, niche: string = 'General') {
    // 1. Logic Layer: AI Generation
    const result = await geminiService.generateContent(topic, niche);
    
    // 2. Data Layer: Storage
    const contentRef = collection(db, 'content');
    const docRef = await addDoc(contentRef, {
      userId,
      topic,
      niche,
      ...result,
      createdAt: serverTimestamp()
    });
    
    return { id: docRef.id, ...result };
  },

  /**
   * Fetches latest content for user.
   */
  async getLatestContent(userId: string, count: number = 5) {
    const q = query(
      collection(db, 'content'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
