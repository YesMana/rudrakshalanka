import fs from 'fs';
import path from 'path';

const adminsFilePath = path.join(process.cwd(), 'data', 'admins.json');

export interface AdminUser {
  id: string;
  type: 'google' | 'credentials';
  email?: string;
  username?: string;
  password?: string;
}

export const getAdmins = (): AdminUser[] => {
  if (!fs.existsSync(adminsFilePath)) {
    const dir = path.dirname(adminsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(adminsFilePath, JSON.stringify([], null, 2), 'utf-8');
    return [];
  }
  try {
    const data = fs.readFileSync(adminsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to parse admins.json:', error);
    return [];
  }
};

export const saveAdmin = (admin: AdminUser) => {
  const admins = getAdmins();
  admins.push(admin);
  fs.writeFileSync(adminsFilePath, JSON.stringify(admins, null, 2), 'utf-8');
};

export const deleteAdmin = (id: string) => {
  const admins = getAdmins();
  const filtered = admins.filter(a => a.id !== id);
  fs.writeFileSync(adminsFilePath, JSON.stringify(filtered, null, 2), 'utf-8');
};
