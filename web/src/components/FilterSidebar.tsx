'use client';

import React, { useState } from 'react';
import {
  FilterState,
  MainCategory,
  SubCategory,
  Brand,
  Doelgroep,
  Motorpositie,
  Motormerk,
  Accucapaciteit,
  Actieradius,
  Framemaat,
  Versnelling,
  Aandrijving,
  Remtype,
  MaximaleSnelheid,
  ProductTag
} from '../types/ebike';
import { ACTIVE_TAXONOMY_CATEGORIES, BRANDS_WITH_PRODUCTS } from '../data/slim';
import { ChevronDown, ChevronUp, RotateCcw, Search, Check } from '@/components/icons';
import { formatEur } from '../utils/format';
import { useTr } from '@/i18n/locale';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalProductsCount
}) => {
  const tr = useTr();

  const [brandSearch, setBrandSearch] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categorie: true,
    merk: true,
    prijs: true,
    doelgroep: true,
    motor: true,
    accu: true,
    versnelling: false,
    aandrijving: false,
    framemaat: false,
    tags: true
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  };

  const filteredBrands = BRANDS_WITH_PRODUCTS.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const DOELGROEP_OPTIONS: Doelgroep[] = [
    'Dames (lage instap)',
    'Heren (diamant)',
    'Unisex (middeninstap)',
    'Kinderen'
  ];

  const MOTORPOSITIE_OPTIONS: Motorpositie[] = [
    'Middenmotor',
    'Voorwielmotor',
    'Achterwielmotor'
  ];

  const MOTORMERK_OPTIONS: Motormerk[] = [
    'Bosch',
    'Shimano STEPS',
    'Yamaha',
    'Brose',
    'Fazua',
    'Bafang',
    'Giant SyncDrive',
    'TQ',
    'Specialized',
    'Stromer',
    'Avinox'
  ];

  const ACCU_OPTIONS: Accucapaciteit[] = [
    '400 Wh',
    '500 Wh',
    '625 Wh',
    '750 Wh',
    '1000 Wh of meer'
  ];

  const FRAMEMAAT_OPTIONS: Framemaat[] = [
    '46 cm',
    '50 cm',
    '53 cm',
    '56 cm',
    '59 cm',
    '61 cm'
  ];

  const VERSNELLING_OPTIONS: Versnelling[] = [
    'Naafschakeling',
    'Derailleur',
    'Stepless (Enviolo)',
    'Single speed'
  ];

  const AANDRIJVING_OPTIONS: Aandrijving[] = ['Ketting', 'Riem'];

  const TAGS_OPTIONS: ProductTag[] = [
    'Fietsplan geschikt',
    'Direct leverbaar',
    'Lage instap',
    'Woon-werkverkeer',
    'Recreatief',
    'Sportief',
    'Gezinsfiets',
    'Lichtgewicht',
    'Aanbieding',
    'Bestseller'
  ];

  // Count active filters
  const activeCount =
    (filters.category !== 'Alle' ? 1 : 0) +
    (filters.subCategory !== 'Alle' ? 1 : 0) +
    filters.brands.length +
    filters.doelgroep.length +
    filters.motorpositie.length +
    filters.motormerk.length +
    filters.accucapaciteit.length +
    filters.framemaat.length +
    filters.versnelling.length +
    filters.aandrijving.length +
    filters.tags.length +
    (filters.maxPrice < 16000 ? 1 : 0);

  return (
    <aside className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {tr("Filters & Eigenschappen")}
          </h2>
          <div className="text-xs text-slate-500 mt-0.5">
            {tr(totalProductsCount)} {tr("fietsen gevonden")}
          </div>
        </div>

        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{tr("Reset (")}{tr(activeCount)})</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100 text-sm">
        {/* Category Accordion */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('categorie')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Productcategorie")}</span>
            {openSections.categorie ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.categorie && (
            <div className="mt-3 space-y-1">
              <button
                onClick={() => {
                  updateFilter('category', 'Alle');
                  updateFilter('subCategory', 'Alle');
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  filters.category === 'Alle'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{tr("Alle categorieën")}</span>
                {filters.category === 'Alle' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>

              {ACTIVE_TAXONOMY_CATEGORIES.map((cat) => (
                <div key={cat.main} className="space-y-0.5">
                  <button
                    onClick={() => {
                      updateFilter('category', cat.main);
                      updateFilter('subCategory', 'Alle');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      filters.category === cat.main && filters.subCategory === 'Alle'
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span>{tr(cat.main)}</span>
                    {filters.category === cat.main && filters.subCategory === 'Alle' && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </button>

                  {/* Subcategories */}
                  {filters.category === cat.main && (
                    <div className="pl-4 space-y-0.5 mt-0.5 border-l-2 border-slate-100">
                      {cat.subs.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => updateFilter('subCategory', sub)}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors ${
                            filters.subCategory === sub
                              ? 'bg-blue-100/60 text-blue-800 font-bold'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {tr(sub)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Brand Accordion (WooCommerce native Brands) */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('merk')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Merk (")}{filters.brands.length > 0 ? filters.brands.length : tr("Alle")})</span>
            {openSections.merk ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.merk && (
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={tr("Zoek merk (bijv. Gazelle, Cube)...")}
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                {filteredBrands.map((brand) => {
                  const isChecked = filters.brands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          updateFilter('brands', toggleArrayItem(filters.brands, brand))
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{tr(brand)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Prijs Filter */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('prijs')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Maximale Prijs")}</span>
            {openSections.prijs ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.prijs && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>{tr("Tot:")} {formatEur(filters.maxPrice)}</span>
                {filters.maxPrice < 16000 && (
                  <button
                    onClick={() => updateFilter('maxPrice', 16000)}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    {tr("Reset")}
                  </button>
                )}
              </div>
              <input
                type="range"
                min="1000"
                max="16000"
                step="250"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>€ 1.000</span>
                <span>€ 4.500</span>
                <span>€ 8.000+</span>
              </div>
            </div>
          )}
        </div>

        {/* Doelgroep (Framevorm / Type) */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('doelgroep')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Doelgroep & Framevorm")}</span>
            {openSections.doelgroep ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.doelgroep && (
            <div className="mt-3 space-y-1">
              {DOELGROEP_OPTIONS.map((dg) => (
                <label
                  key={dg}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={filters.doelgroep.includes(dg)}
                    onChange={() =>
                      updateFilter('doelgroep', toggleArrayItem(filters.doelgroep, dg))
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{tr(dg)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Motormerk & Positie */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('motor')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Motor (Merk & Positie)")}</span>
            {openSections.motor ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.motor && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {tr("Motormerk")}
                </div>
                {MOTORMERK_OPTIONS.map((merk) => (
                  <label
                    key={merk}
                    className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={filters.motormerk.includes(merk)}
                      onChange={() =>
                        updateFilter('motormerk', toggleArrayItem(filters.motormerk, merk))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{tr(merk)}</span>
                  </label>
                ))}
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {tr("Motorpositie")}
                </div>
                {MOTORPOSITIE_OPTIONS.map((pos) => (
                  <label
                    key={pos}
                    className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={filters.motorpositie.includes(pos)}
                      onChange={() =>
                        updateFilter('motorpositie', toggleArrayItem(filters.motorpositie, pos))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{tr(pos)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accucapaciteit */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('accu')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Accucapaciteit (Wh)")}</span>
            {openSections.accu ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.accu && (
            <div className="mt-3 space-y-1">
              {ACCU_OPTIONS.map((cap) => (
                <label
                  key={cap}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={filters.accucapaciteit.includes(cap)}
                    onChange={() =>
                      updateFilter('accucapaciteit', toggleArrayItem(filters.accucapaciteit, cap))
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{tr(cap)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Aandrijving (Riem vs Ketting) */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('aandrijving')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Aandrijving & Versnelling")}</span>
            {openSections.aandrijving ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.aandrijving && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {tr("Aandrijving")}
                </div>
                {AANDRIJVING_OPTIONS.map((aandrijving) => (
                  <label
                    key={aandrijving}
                    className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={filters.aandrijving.includes(aandrijving)}
                      onChange={() =>
                        updateFilter('aandrijving', toggleArrayItem(filters.aandrijving, aandrijving))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{aandrijving === 'Riem' ? tr("Belt drive / Riem (Onderhoudsvrij)") : tr("Ketting")}</span>
                  </label>
                ))}
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {tr("Type versnelling")}
                </div>
                {VERSNELLING_OPTIONS.map((v) => (
                  <label
                    key={v}
                    className="flex items-center gap-2 px-2 py-0.5 rounded hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={filters.versnelling.includes(v)}
                      onChange={() =>
                        updateFilter('versnelling', toggleArrayItem(filters.versnelling, v))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{tr(v)}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Framematen */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('framemaat')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Framemaat")}</span>
            {openSections.framemaat ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.framemaat && (
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {FRAMEMAAT_OPTIONS.map((maat) => {
                const isSelected = filters.framemaat.includes(maat);
                return (
                  <button
                    key={maat}
                    onClick={() =>
                      updateFilter('framemaat', toggleArrayItem(filters.framemaat, maat))
                    }
                    className={`py-1.5 px-2 text-xs font-semibold rounded border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {tr(maat)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Populaire Tags */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full font-semibold text-slate-800 hover:text-blue-600 text-left"
          >
            <span>{tr("Thema's & Tags")}</span>
            {openSections.tags ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openSections.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {TAGS_OPTIONS.map((tag) => {
                const isSelected = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => updateFilter('tags', toggleArrayItem(filters.tags, tag))}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tr(tag)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
