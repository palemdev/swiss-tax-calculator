import type { CantonalTaxConfig, Municipality } from '../../types';
import { zugConfig, zugMunicipalities } from './zug';
import { schwyzConfig, schwyzMunicipalities } from './schwyz';

// All canton configurations
export const cantonConfigs: Record<string, CantonalTaxConfig> = {
  ZG: zugConfig,
  SZ: schwyzConfig,
};

// All municipalities by canton
export const municipalitiesByCantonCode: Record<string, Municipality[]> = {
  ZG: zugMunicipalities,
  SZ: schwyzMunicipalities,
};

// Flat list of all municipalities
export const allMunicipalities: Municipality[] = Object.values(municipalitiesByCantonCode).flat();

// Canton list for dropdowns (sorted alphabetically by name)
export const cantonList = [
  { code: 'SZ', name: 'Schwyz', nameFr: 'Schwytz' },
  { code: 'ZG', name: 'Zug', nameFr: 'Zoug' },
];

// Helper functions
export const getCantonConfig = (cantonCode: string): CantonalTaxConfig | undefined => {
  return cantonConfigs[cantonCode];
};

export const getMunicipalitiesByCantonCode = (cantonCode: string): Municipality[] => {
  const municipalities = municipalitiesByCantonCode[cantonCode] || [];
  return [...municipalities].sort((a, b) => a.name.localeCompare(b.name));
};

export const getMunicipalityById = (municipalityId: string): Municipality | undefined => {
  return allMunicipalities.find(m => m.id === municipalityId);
};

export const getCantonName = (cantonCode: string): string => {
  const config = cantonConfigs[cantonCode];
  return config?.cantonName || cantonCode;
};
