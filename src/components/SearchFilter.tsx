
import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchFilterProps {
  searchTerm: string; 
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  leaderFilter: string;
  onLeaderFilterChange: (value: string) => void;
  locationFilter: string;
  onLocationFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onPrint: () => void;
  resultCount: number;
  totalCount: number;
  leaders: string[];
  locations: string[];
}

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  leaderFilter,
  onLeaderFilterChange,
  locationFilter,
  onLocationFilterChange,
  onClearFilters,
  onPrint,
  resultCount,
  totalCount,
  leaders,
  locations
}: SearchFilterProps) => {
  const hasActiveFilters = useMemo(() => 
    searchTerm || 
    statusFilter !== 'all' || 
    dateFilter !== 'all' ||
    leaderFilter !== 'all' ||
    locationFilter !== 'all'
  , [searchTerm, statusFilter, dateFilter, leaderFilter, locationFilter]);

  const filterStats = useMemo(() => ({
    showing: resultCount,
    total: totalCount,
    percentage: totalCount > 0 ? Math.round((resultCount / totalCount) * 100) : 0
  }), [resultCount, totalCount]);

  return (
    <div className="modern-card rounded-xl p-4 mb-6 no-print">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-green-700" />
          <h3 className="font-semibold text-green-700">Filter & Pencarian</h3>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Badge className="bg-government-100 text-government border-government">
                {filterStats.showing} dari {filterStats.total} hasil ({filterStats.percentage}%)
              </Badge>
            </div>
          )}
        </div>
        <Button
          onClick={onPrint}
          variant="outline"
          size="sm"
          className="flex item-center gap-2 border border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-colors"
        >
          <Printer className="w-4 h-4 mr-2 text-green-700 group-hover:text-white transition" />
          Print
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black-400 w-4 h-4" stroke="black" />
          <Input
            placeholder="Cari judul, pemimpin, atau lokasi..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-700 focus:border-government focus:ring-government text-black placeholder:text-black"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="bg-white border-gray-700 focus:border-government text-black [&>svg]:text-black">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="scheduled">Terjadwal</SelectItem>
            <SelectItem value="ongoing">Berlangsung</SelectItem>
            <SelectItem value="completed">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="bg-white border-gray-700 focus:border-government text-black [&>svg]:text-black">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
            <SelectItem value="all" className="data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500">Semua Waktu</SelectItem>
            <SelectItem value="today" className="data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500">Hari Ini</SelectItem>
            <SelectItem value="week" className="data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500">Minggu Ini</SelectItem>
            <SelectItem value="month" className="data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500">Bulan Ini</SelectItem>
            <SelectItem value="upcoming" className="data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500">Akan Datang</SelectItem>
            <SelectItem value="past" className="data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500">Masa Lalu</SelectItem>
          </SelectContent>
        </Select>

        <Select value={leaderFilter} onValueChange={onLeaderFilterChange}>
          <SelectTrigger className="bg-white border-gray-700 focus:outline-none focus:border-gray-400 focus:ring-0 text-black [&>svg]:text-black">
            <SelectValue placeholder="Pemimpin" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200 shadow-lg z-50 max-h-60">
            <SelectItem value="all"className='data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-500'>Semua Pemimpin</SelectItem>
            {leaders.map((leader) => (
              <SelectItem key={leader} value={leader}>{leader}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="bg-white border-red-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600 font-medium">Filter aktif:</span>
          {searchTerm && (
            <Badge className="bg-government-50 text-government border-government">
              Pencarian: "{searchTerm}"
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge className="bg-government-50 text-government border-government">
              Status: {statusFilter}
            </Badge>
          )}
          {dateFilter !== 'all' && (
            <Badge className="bg-government-50 text-government border-government">
              Periode: {dateFilter}
            </Badge>
          )}
          {leaderFilter !== 'all' && (
            <Badge className="bg-gold-50 text-green-700 border-green-500">
              Pemimpin: {leaderFilter}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchFilter);
