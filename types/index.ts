export interface User {
    id: string;
    name: string;
    avatar?: string;
    status: string;
    lastUpdated: string;
  }
  
  export interface Group {
    id: string;
    name: string;
    members: User[];
    inviteCode: string;
    createdAt: string;
  }
  
  export interface Notification {
    id: string;
    userId: string;
    userName: string;
    groupId: string;
    groupName: string;
    message: string;
    timestamp: string;
    read: boolean;
  }