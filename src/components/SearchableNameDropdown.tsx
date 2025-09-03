import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, Loader2 } from 'lucide-react';
import { Employee, employees } from '@/content/employees';
import { texts } from '@/content/texts';

interface SearchableNameDropdownProps {
  value: string;
  onSelect: (employee: Employee) => void;
  onClear: () => void;
  onManualInput?: (name: string) => void;
  placeholder?: string;
}

const SearchableNameDropdown = ({
  value,
  onSelect,
  onClear,
  onManualInput,
  placeholder = texts.form.namePlaceholder,
}: SearchableNameDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredEmployees([]);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchValue.toLowerCase()) ||
          employee.jabatan.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredEmployees(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    if (value) {
      const employee = employees.find((emp) => emp.name === value);
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }
  }, [value]);

  const handleSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    onSelect(employee);
    setOpen(false);
    setSearchValue('');
  };

  const handleClear = () => {
    setSelectedEmployee(null);
    onClear();
    setSearchValue('');
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    onSelect({
      id: 'manual',
      name: value,
      email: '',
      jabatan: '',
      phone: '',
    });
    if (!open) setOpen(true);
  };

  const handleManualInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim() && !selectedEmployee && onManualInput) {
      onManualInput(searchValue.trim());
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      {selectedEmployee ? (
        <div className="flex items-center space-x-2">
          <Badge className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 border-blue-200">
            <div className="flex flex-col">
              <span className="font-medium">{selectedEmployee.name}</span>
              <span className="text-xs text-blue-600">{selectedEmployee.jabatan}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-4 w-4 p-0 hover:bg-blue-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative bg-white hover:bg-gray-50 rounded-md border border-gray-200">
              <Input
                value={searchValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={placeholder}
                className="bg-white/80 pr-10"
                onClick={() => setOpen(true)}
                onKeyDown={handleManualInput}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black bg-white/80 hover:text-black" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-white hover:bg-white text-black" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={texts.form.namePlaceholder}
                value={searchValue}
                onValueChange={handleInputChange}
              />
              <CommandList className="bg-white hover:bg-white text-black border border-gray-200">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6 bg-white">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-500">{texts.form.searching}</span>
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <CommandEmpty className="bg-white">{texts.form.noResults}</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {filteredEmployees.map((employee) => (
                      <CommandItem
                        key={employee.id}
                        value={employee.name}
                        onSelect={() => handleSelect(employee)}
                        className="flex flex-col items-start py-3 px-3 bg-white hover:bg-gray-50 focus:bg-gray-100 text-black"
                      >
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                        <div className="text-xs text-blue-600">{employee.jabatan}</div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default SearchableNameDropdown;
