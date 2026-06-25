"use client";

import React, { useState, useEffect, useRef } from 'react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const COUNTRY_CODES = [
  { code: '+34', flag: '🇪🇸' },
  { code: '+1', flag: '🇺🇸' },
  { code: '+58', flag: '🇻🇪' },
  { code: '+52', flag: '🇲🇽' },
  { code: '+54', flag: '🇦🇷' },
  { code: '+57', flag: '🇨🇴' },
  { code: '+56', flag: '🇨🇱' },
  { code: '+51', flag: '🇵🇪' },
  { code: '+44', flag: '🇬🇧' },
  { code: '+49', flag: '🇩🇪' },
  { code: '+33', flag: '🇫🇷' },
  { code: '+39', flag: '🇮🇹' },
];

export function PhoneInput({ value, onChange, className, placeholder = "600 000 000" }: PhoneInputProps) {
  const [prefix, setPrefix] = useState('');
  const [number, setNumber] = useState('');
  const [initialized, setInitialized] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialized && value) {
      const match = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (match) {
        if (match.code !== '+34') {
          setPrefix(match.code);
        }
        setNumber(value.slice(match.code.length).trim());
      } else {
        setNumber(value);
      }
      setInitialized(true);
    }
  }, [value, initialized]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrefixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrefix = e.target.value;
    setPrefix(newPrefix);
    onChange(`${newPrefix || '+34'} ${number}`);
    setIsDropdownOpen(true);
  };

  const handleSelectPrefix = (code: string) => {
    const selectedPrefix = code === '+34' ? '' : code;
    setPrefix(selectedPrefix);
    onChange(`${code} ${number}`);
    setIsDropdownOpen(false);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value;
    setNumber(newNumber);
    onChange(`${prefix || '+34'} ${newNumber}`);
  };

  const filteredCodes = prefix ? COUNTRY_CODES.filter(c => c.code.includes(prefix)) : COUNTRY_CODES;

  return (
    <div className={`flex rounded-md border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent bg-white relative ${className}`}>
      <div className="relative" ref={dropdownRef}>
        <input 
          type="text"
          value={prefix} 
          onChange={handlePrefixChange}
          onFocus={() => setIsDropdownOpen(true)}
          className="h-full w-[70px] py-2 pl-3 pr-2 bg-gray-50 border-r border-gray-300 text-gray-700 text-sm focus:outline-none rounded-l-md"
          placeholder="+34"
        />
        
        {isDropdownOpen && (
          <div className="absolute z-50 top-full left-0 mt-1 w-[120px] max-h-48 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-md py-1">
            {filteredCodes.length > 0 ? (
              filteredCodes.map(c => (
                <div 
                  key={c.code} 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                  onClick={() => handleSelectPrefix(c.code)}
                >
                  <span>{c.flag}</span>
                  <span className="font-medium">{c.code}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">No match</div>
            )}
          </div>
        )}
      </div>
      
      <input 
        type="tel"
        value={number}
        onChange={handleNumberChange}
        className="flex-1 px-3 py-2 text-sm outline-none bg-transparent w-full rounded-r-md"
        placeholder={placeholder}
      />
    </div>
  );
}
