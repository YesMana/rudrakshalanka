import fs from 'fs';
import path from 'path';

const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  seoKeywords: string;
  heroTitle: string;
  heroSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  facebookUrl: string;
}

const defaultSettings: SiteSettings = {
  siteTitle: "Rudraksha Lanka - Authentic Healing Beads",
  siteDescription: "Discover authentic, original Rudraksha beads directly sourced from the Himalayas. Bring wealth, health, and peace into your life.",
  seoKeywords: "rudraksha sri lanka, original rudraksha, healing beads, spiritual jewelry, rudraksha mala",
  heroTitle: "Sacred Energy of the Himalayas",
  heroSubtitle: "Discover our collection of 100% authentic, certified Rudraksha beads for wealth, health, and spiritual awakening.",
  contactEmail: "yes.manujaya@gmail.com",
  contactPhone: "94770000000",
  facebookUrl: "https://www.facebook.com/profile.php?id=61591698745191"
};

export function getSettings(): SiteSettings {
  if (!fs.existsSync(settingsFilePath)) {
    // Ensure directory exists
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2), 'utf-8');
    return defaultSettings;
  }
  
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read settings', error);
    return defaultSettings;
  }
}

export function updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  const currentSettings = getSettings();
  const updated = { ...currentSettings, ...newSettings };
  fs.writeFileSync(settingsFilePath, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}
