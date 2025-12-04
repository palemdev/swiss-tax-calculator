
import { useTax } from '../../context/TaxContext';
import { Select } from '../common/Select';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { cantonList, getMunicipalitiesByCantonCode } from '../../data/cantons';
import { CIVIL_STATUS_OPTIONS, RELIGION_OPTIONS } from '../../data/constants';

export function TaxpayerForm() {
  const { taxpayer, updateTaxpayer } = useTax();

  const municipalities = getMunicipalitiesByCantonCode(taxpayer.canton);
  const isMarried = taxpayer.civilStatus === 'married';

  // When canton changes, reset municipality to first one in that canton
  const handleCantonChange = (cantonCode: string) => {
    const newMunicipalities = getMunicipalitiesByCantonCode(cantonCode);
    updateTaxpayer({
      canton: cantonCode,
      municipality: newMunicipalities[0]?.id || '',
    });
  };

  return (
    <Card title="Personal Information" subtitle="Your tax profile">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Select
          label="Civil Status"
          value={taxpayer.civilStatus}
          onChange={(value) => updateTaxpayer({ civilStatus: value as typeof taxpayer.civilStatus })}
          options={CIVIL_STATUS_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
          tooltip="Your marital status affects tax rates and deductions"
        />

        <Select
          label="Canton"
          value={taxpayer.canton}
          onChange={handleCantonChange}
          options={cantonList.map(c => ({ value: c.code, label: `${c.name} (${c.code})` }))}
          tooltip="The canton where you are tax resident"
        />

        <Select
          label="Municipality"
          value={taxpayer.municipality}
          onChange={(value) => updateTaxpayer({ municipality: value })}
          options={municipalities.map(m => ({ value: m.id, label: m.name }))}
          tooltip="Your municipality of residence (tax multiplier varies)"
        />

        <Select
          label="Religion"
          value={taxpayer.religion}
          onChange={(value) => updateTaxpayer({ religion: value as typeof taxpayer.religion })}
          options={RELIGION_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
          tooltip="Church tax applies for Catholic, Protestant, or Christ Catholic"
        />

        {isMarried && (
          <Select
            label="Partner's Religion"
            value={taxpayer.partnerReligion}
            onChange={(value) => updateTaxpayer({ partnerReligion: value as typeof taxpayer.partnerReligion })}
            options={RELIGION_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))}
            tooltip="Your spouse's religious affiliation"
          />
        )}

        <Input
          label="Number of Children"
          value={taxpayer.numberOfChildren}
          onChange={(value) => updateTaxpayer({ numberOfChildren: Math.max(0, Math.floor(value)) })}
          min={0}
          max={10}
          placeholder="0"
          tooltip="Children under 18 or in education qualify for deductions"
        />

        {taxpayer.numberOfChildren > 0 && (
          <Input
            label="Children in Childcare"
            value={taxpayer.childrenInChildcare}
            onChange={(value) =>
              updateTaxpayer({
                childrenInChildcare: Math.min(
                  Math.max(0, Math.floor(value)),
                  taxpayer.numberOfChildren
                ),
              })
            }
            min={0}
            max={taxpayer.numberOfChildren}
            placeholder="0"
            tooltip="Children using paid childcare (for childcare deduction)"
          />
        )}
      </div>
    </Card>
  );
}
