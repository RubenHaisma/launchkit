export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  type?: 'campaign' | 'test' | 'outreach';
}

export interface EmailLog {
  id: string;
  to: string | string[];
  subject: string;
  type: string;
  timestamp: string;
  status: 'sent' | 'failed';
  error?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<EmailLog> => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (result.success) {
      return {
        ...result.data,
        status: 'sent' as const,
      };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      id: Date.now().toString(),
      to: emailData.to,
      subject: emailData.subject,
      type: emailData.type || 'campaign',
      timestamp: new Date().toISOString(),
      status: 'failed' as const,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getEmailLogs = (): EmailLog[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const logs = localStorage.getItem('launchpilot-email-logs');
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
};

export const saveEmailLog = (log: EmailLog): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const logs = getEmailLogs();
    logs.unshift(log); // Add to beginning
    
    // Keep only last 100 logs
    const trimmedLogs = logs.slice(0, 100);
    
    localStorage.setItem('launchpilot-email-logs', JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Failed to save email log:', error);
  }
};