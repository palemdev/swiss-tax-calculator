import type { CantonalTaxConfig, Municipality } from '../../types';
import { zurichConfig, zurichMunicipalities } from './zurich';
import { bernConfig, bernMunicipalities } from './bern';
import { zugConfig, zugMunicipalities } from './zug';
import { genevaConfig, genevaMunicipalities } from './geneva';
import { vaudConfig, vaudMunicipalities } from './vaud';
import { schwyzConfig, schwyzMunicipalities } from './schwyz';
import { baselStadtConfig, baselStadtMunicipalities, baselLandConfig, baselLandMunicipalities } from './basel';

// All canton configurations
export const cantonConfigs: Record<string, CantonalTaxConfig> = {
  ZH: zurichConfig,
  BE: bernConfig,
  ZG: zugConfig,
  GE: genevaConfig,
  VD: vaudConfig,
  SZ: schwyzConfig,
  BS: baselStadtConfig,
  BL: baselLandConfig,
};

// All municipalities by canton
export const municipalitiesByCantonCode: Record<string, Municipality[]> = {
  ZH: zurichMunicipalities,
  BE: bernMunicipalities,
  ZG: zugMunicipalities,
  GE: genevaMunicipalities,
  VD: vaudMunicipalities,
  SZ: schwyzMunicipalities,
  BS: baselStadtMunicipalities,
  BL: baselLandMunicipalities,
};

// Flat list of all municipalities
export const allMunicipalities: Municipality[] = Object.values(municipalitiesByCantonCode).flat();

// Canton list for dropdowns
export const cantonList = [
  { code: 'ZH', name: 'Zürich', nameFr: 'Zurich' },
  { code: 'BE', name: 'Bern', nameFr: 'Berne' },
  { code: 'ZG', name: 'Zug', nameFr: 'Zoug' },
  { code: 'GE', name: 'Genève', nameFr: 'Genève' },
  { code: 'VD', name: 'Vaud', nameFr: 'Vaud' },
  { code: 'SZ', name: 'Schwyz', nameFr: 'Schwytz' },
  { code: 'BS', name: 'Basel-Stadt', nameFr: 'Bâle-Ville' },
  { code: 'BL', name: 'Basel-Landschaft', nameFr: 'Bâle-Campagne' },
];

// Helper functions
export const getCantonConfig = (cantonCode: string): CantonalTaxConfig | undefined => {
  return cantonConfigs[cantonCode];
};

export const getMunicipalitiesByCantonCode = (cantonCode: string): Municipality[] => {
  return municipalitiesByCantonCode[cantonCode] || [];
};

export const getMunicipalityById = (municipalityId: string): Municipality | undefined => {
  return allMunicipalities.find(m => m.id === municipalityId);
};

export const getCantonName = (cantonCode: string): string => {
  const config = cantonConfigs[cantonCode];
  return config?.cantonName || cantonCode;
};
