import { db } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

export const growthService = {
  /**
   * Updates user streak and points.
   */
  async recordAction(userId: string, points: number = 10) {
    const userRef = doc(db, 'users', userId);
    
    try {
      await updateDoc(userRef, {
        points: increment(points),
        lastActionAt: serverTimestamp(),
        // Simple streak logic could go here (comparing days)
      });
    } catch (e) {
      console.error("Failed to record growth action", e);
    }
  },

  /**
   * Fetches user identity stats.
   */
  async getIdentityStats(userId: string) {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data().identity || { label: 'Newbie', score: 10, archetype: 'Explorer' };
    }
    return { label: 'Newbie', score: 10, archetype: 'Explorer' };
  }
};
