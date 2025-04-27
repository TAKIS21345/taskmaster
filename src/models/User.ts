import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  children: string[]; // Array of child document IDs
}

export interface Child {
  id: string;
  name: string;
  age: number;
  parentId: string;
}