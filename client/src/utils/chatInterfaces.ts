
 export  interface message {
    text: string;
  
    
  }
 export  interface channelinfo {
    id: string;
    info: {
      id: string;
      name: string;
      created_by: string;
      created_at: string;
    } | null;
  }