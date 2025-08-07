import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);
const algorithm = 'aes-256-gcm';

function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  return key;
}

export interface EncryptedData {
  iv: string;
  authTag: string;
  data: string;
}

export async function encrypt(text: string): Promise<EncryptedData> {
  try {
    const password = getEncryptionKey();
    const salt = randomBytes(16);
    const iv = randomBytes(16);
    
    const key = (await scryptAsync(password, salt, 32)) as Buffer;
    const cipher = createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      iv: Buffer.concat([salt, iv]).toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedData: EncryptedData): Promise<string> {
  try {
    const password = getEncryptionKey();
    const combined = Buffer.from(encryptedData.iv, 'hex');
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 32);
    
    const key = (await scryptAsync(password, salt, 32)) as Buffer;
    const decipher = createDecipheriv(algorithm, key, iv);
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export async function encryptCredentials(credentials: any): Promise<string> {
  const jsonString = JSON.stringify(credentials);
  const encrypted = await encrypt(jsonString);
  return JSON.stringify(encrypted);
}

export async function decryptCredentials(encryptedString: string): Promise<any> {
  const encryptedData: EncryptedData = JSON.parse(encryptedString);
  const decrypted = await decrypt(encryptedData);
  return JSON.parse(decrypted);
}