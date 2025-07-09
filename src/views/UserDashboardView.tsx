import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Estate, Locator, Contract } from '../types';
import { ContractType, estateNames } from '../types';
import { getLocatorDataForEstate, exportToNewSheet } from '../services/googleApiService';
import SecureWrapper from '../components/SecureWrapper';
import Header from '../components/Header';
import { FullPageSpinner } from '../components/Spinner';
import PdfViewer from '../components/PdfViewer';
import Button from '../components/Button';

interface UserDashboardViewProps {
  user: User;
  estate: Estate;
  onLogout: () => void;
}

const UserDashboardView: React.FC<UserDashboardViewProps> = ({ user, estate, onLogout }) => {
  const [locators, setLocators] = useState<Locator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pdfViewerState, setPdfViewerState] = useState<{ isOpen: boolean; url: string; title: string }>({ isOpen: false, url: '', title: '' });
  const [isExporting, setIsExporting] = useState(false);

  const fetchLocators = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLocatorDataForEstate(estate);
      setLocators(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch locator data.');
    } finally {
      setIsLoading(false);
    }
  }, [estate]);

  useEffect(() => {
    fetchLocators();
  }, [fetchLocators]);

  const filteredLocators = useMemo(() => {
    return locators.filter(locator =>
      locator.locatorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locators, searchTerm]);

  const openPdf = (contract: Contract) => {
    setPdfViewerState({ isOpen: true, url: contract.driveUrl, title: `${contract.fileName} (${contract.type})` });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
        const url = await exportToNewSheet(filteredLocators, estate);
        alert(`Successfully exported data to Google Sheets!`);
        window.open(url, '_blank');
    } catch (err: any) {
        alert(`Export failed: ${err.message}`);
    } finally {
        setIsExporting(false);
    }
  };

  if (isLoading) {
    return <FullPageSpinner message={`Loading data for ${estateNames[estate]}...`} />;
  }
  
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">{error}</div>;
  }

  return (
    <SecureWrapper>
      <div className="min-h-screen bg-gray-900">
        <Header title={`${estateNames[estate]} - Locators`} onLogout={onLogout}>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search locators..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white w-64"
                />
                <Button onClick={handleExport} isLoading={isExporting}>
                    Export to Sheets
                </Button>
            </div>
        </Header>
        <main className="p-8">
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  {['Locator', 'Address', 'Lot Area (SQM)', 'Type of Industry', 'Contracts'].map(header => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredLocators.length > 0 ? filteredLocators.map((locator) => (
                  <tr key={locator.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{locator.locatorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{locator.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{locator.lotArea.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{locator.industryType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {locator.contracts.length > 0 ? (
                        <select
                          onChange={(e) => {
                            const selectedContractId = e.target.value;
                            if(selectedContractId) {
                                const contract = locator.contracts.find(c => c.id === selectedContractId);
                                if (contract) openPdf(contract);
                            }
                            e.target.value = ''; // Reset dropdown
                          }}
                          className="bg-gray-600 text-white rounded-md p-2 border-0 focus:ring-2 focus:ring-red-500"
                          defaultValue=""
                        >
                          <option value="" disabled>View Contract...</option>
                          {Object.values(ContractType).map(type => (
                            locator.contracts.filter(c => c.type === type).length > 0 && (
                                <optgroup key={type} label={type}>
                                    {locator.contracts.filter(c => c.type === type).map(c => (
                                        <option key={c.id} value={c.id}>{c.fileName}</option>
                                    ))}
                                </optgroup>
                            )
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-500">No contracts</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No locators found for this estate or your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <PdfViewer 
        isOpen={pdfViewerState.isOpen} 
        onClose={() => setPdfViewerState({ isOpen: false, url: '', title: '' })} 
        url={pdfViewerState.url} 
        title={pdfViewerState.title} 
      />
    </SecureWrapper>
  );
};

export default UserDashboardView;