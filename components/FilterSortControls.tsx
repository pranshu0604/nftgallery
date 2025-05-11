import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DisplayNft } from './types';

interface FilterSortControlsProps {
  nfts: DisplayNft[];
  onFilterSort: (filteredAndSortedNfts: DisplayNft[]) => void;
}

export default function FilterSortControls({ nfts, onFilterSort }: FilterSortControlsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'default'>('default');
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract all available attributes across all NFTs
  const allAttributes = React.useMemo(() => {
    const attributes = new Map<string, Set<string>>();
    
    nfts.forEach(nft => {
      if (nft.attributes && nft.attributes.length > 0) {
        nft.attributes.forEach(attr => {
          if (!attributes.has(attr.trait_type)) {
            attributes.set(attr.trait_type, new Set());
          }
          attributes.get(attr.trait_type)?.add(attr.value);
        });
      }
    });
    
    return attributes;
  }, [nfts]);
  
  // Selected attribute filters
  const [selectedAttributes, setSelectedAttributes] = useState<Map<string, Set<string>>>(
    new Map()
  );
  
  // Apply filtering and sorting
  const applyFilterSort = () => {
    let result = [...nfts];
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(nft => 
        nft.name.toLowerCase().includes(term) || 
        (nft.description && nft.description.toLowerCase().includes(term))
      );
    }
    
    // Filter by attributes
    if (selectedAttributes.size > 0) {
      result = result.filter(nft => {
        // For each attribute type we're filtering on
        for (const [attrType, attrValues] of selectedAttributes.entries()) {
          if (attrValues.size === 0) continue; // Skip if no values selected for this type
          
          // Find if the NFT has this attribute with a selected value
          const hasMatchingAttr = nft.attributes.some(
            attr => attr.trait_type === attrType && attrValues.has(attr.value)
          );
          
          // If it doesn't match any selected value for this attribute type, exclude it
          if (!hasMatchingAttr) return false;
        }
        // If it passed all attribute filters, include it
        return true;
      });
    }
    
    // Apply sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    onFilterSort(result);
  };
  
  // Toggle attribute value selection
  const toggleAttributeValue = (attrType: string, attrValue: string) => {
    setSelectedAttributes(prev => {
      const newMap = new Map(prev);
      
      if (!newMap.has(attrType)) {
        newMap.set(attrType, new Set([attrValue]));
      } else {
        const values = newMap.get(attrType)!;
        if (values.has(attrValue)) {
          values.delete(attrValue);
          if (values.size === 0) {
            newMap.delete(attrType);
          }
        } else {
          values.add(attrValue);
        }
      }
      
      return newMap;
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('default');
    setSelectedAttributes(new Map());
    onFilterSort([...nfts]);
  };
  
  // Apply filters when any filter/sort option changes
  React.useEffect(() => {
    applyFilterSort();
  }, [searchTerm, sortBy, selectedAttributes]);
  
  return (
    <div className="w-full">
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 px-4 bg-white dark:bg-[#2a353a] rounded-xl shadow-md flex items-center justify-between"
          whileTap={{ scale: 0.98 }}
        >
          <span className="font-medium text-[#2a353a] dark:text-white">Filter & Sort</span>
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
      
      {/* Filter & Sort Controls - Desktop always visible, mobile conditional */}
      <AnimatePresence>
        {(isOpen || window.innerWidth >= 768) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white/80 dark:bg-[#2a353a]/80 backdrop-blur-md shadow-lg rounded-xl p-4 border border-[#e6f0ed]/50 dark:border-[#232b2f]/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-[#2a353a] dark:text-white mb-2">
                    Search NFTs
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or description..."
                      className="w-full py-2 px-4 pr-10 rounded-lg border border-[#e6f0ed] dark:border-[#232b2f] bg-white dark:bg-[#1a2327] text-[#2a353a] dark:text-white placeholder-[#b8c6c9] dark:placeholder-[#5e6e6a] focus:ring-2 focus:ring-[#6ad7b7] focus:border-transparent outline-none transition"
                    />
                    <div className="absolute right-3 top-2.5 text-[#5e6e6a] dark:text-[#b8c6c9]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Sort Options */}
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-[#2a353a] dark:text-white mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'default')}
                    className="w-full py-2 px-4 rounded-lg border border-[#e6f0ed] dark:border-[#232b2f] bg-white dark:bg-[#1a2327] text-[#2a353a] dark:text-white focus:ring-2 focus:ring-[#6ad7b7] focus:border-transparent outline-none transition appearance-none"
                  >
                    <option value="default">Default</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>
                
                {/* Reset Button */}
                <div className="col-span-1 flex items-end">
                  <motion.button
                    onClick={resetFilters}
                    className="w-full py-2 px-4 bg-[#e6f0ed] dark:bg-[#232b2f] text-[#2a353a] dark:text-white rounded-lg hover:bg-[#d1e6e0] dark:hover:bg-[#2f3b42] transition"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset All Filters
                  </motion.button>
                </div>
              </div>
              
              {/* Attribute Filters */}
              {allAttributes.size > 0 && (
                <div className="mt-4 pt-4 border-t border-[#e6f0ed] dark:border-[#232b2f]">
                  <h3 className="text-sm font-medium text-[#2a353a] dark:text-white mb-3">Filter by Attributes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from(allAttributes.entries()).map(([attrType, values]) => (
                      <div key={attrType} className="overflow-hidden">
                        <h4 className="text-xs font-semibold text-[#5e6e6a] dark:text-[#b8c6c9] mb-2">{attrType}</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(values).map(value => {
                            const isSelected = selectedAttributes.get(attrType)?.has(value) || false;
                            
                            return (
                              <motion.button
                                key={`${attrType}-${value}`}
                                onClick={() => toggleAttributeValue(attrType, value)}
                                className={`
                                  text-xs py-1 px-2 rounded-md transition-all
                                  ${isSelected 
                                    ? 'bg-[#6ad7b7] text-white' 
                                    : 'bg-[#e6f0ed] dark:bg-[#232b2f] text-[#2a353a] dark:text-white'}
                                `}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {value}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
