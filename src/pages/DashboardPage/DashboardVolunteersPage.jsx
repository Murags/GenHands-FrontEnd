import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  PencilIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import Drawer from '../../components/common/Drawer';
import VolunteerApplicationForm from '../../components/dashboard/forms/VolunteerApplicationForm';
import { getUsers } from '../../services/userService';
import { useQuery } from '@tanstack/react-query';

const getStatusPillClass = (status) => {
  switch (status) {
    case 'verified':
    case 'Approved':
      return 'bg-ghibli-green-light text-ghibli-green-dark';
    case 'pending':
    case 'Pending Review':
      return 'bg-ghibli-yellow-light text-ghibli-yellow-dark';
    case 'rejected':
    case 'Rejected':
      return 'bg-ghibli-red-light text-ghibli-red-dark';
    case 'Needs More Info':
      return 'bg-ghibli-blue-light text-ghibli-blue-dark';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const getStatusDisplayText = (status) => {
  switch (status) {
    case 'verified':
      return 'Approved';
    case 'pending':
      return 'Pending Review';
    case 'rejected':
      return 'Rejected';
    default:
      return status;
  }
};

const ITEMS_PER_PAGE = 5;

const statusTabs = [
  { key: 'pending', label: 'Pending', status: 'pending' },
  { key: 'verified', label: 'Approved', status: 'verified' },
  { key: 'rejected', label: 'Rejected', status: 'rejected' },
];

const DashboardVolunteersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const { data: allVolunteers, isLoading, isError, error } = useQuery({
    queryKey: ['volunteers', activeTab],
    queryFn: () => getUsers('volunteer', statusTabs.find(tab => tab.key === activeTab)?.status),
  });

  const filteredVolunteers = useMemo(() => {
    if (!allVolunteers) return [];
    if (!searchTerm) {
      return allVolunteers;
    }
    return allVolunteers.filter(
      (volunteer) =>
        (volunteer.name && volunteer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (volunteer.email && volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allVolunteers, searchTerm]);

  const totalPages = Math.ceil(filteredVolunteers.length / ITEMS_PER_PAGE);

  const currentVolunteers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredVolunteers.slice(startIndex, endIndex);
  }, [filteredVolunteers, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const openVolunteerDrawer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDrawerOpen(true);
  };

  const closeVolunteerDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVolunteer(null);
  };

  if (isLoading) return <div className="text-center p-6">Loading volunteers...</div>;
  if (isError) return <div className="text-center p-6 text-red-500">Error loading volunteers: {error.message}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-ghibli-dark-blue handwritten">Volunteer Management</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search volunteers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal-dark transition-colors duration-150 text-sm bg-ghibli-cream-lightest placeholder-ghibli-brown"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-ghibli-brown absolute left-3 top-1/2 transform -translate-y-1/2"/>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="border-b border-ghibli-brown-light">
          <nav className="-mb-px flex space-x-8">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`cursor-pointer py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                  activeTab === tab.key
                    ? 'border-ghibli-teal text-ghibli-teal'
                    : 'border-transparent text-ghibli-brown hover:text-ghibli-brown-dark hover:border-ghibli-brown-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-ghibli-cream shadow-ghibli rounded-t-lg p-2 md:p-4 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="border-b border-ghibli-brown-light">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-ghibli-brown tracking-wider">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-ghibli-brown tracking-wider">Email</th>
              <th className="p-3 text-left text-sm font-semibold text-ghibli-brown tracking-wider">Applied On</th>
              <th className="p-3 text-center text-sm font-semibold text-ghibli-brown tracking-wider">Status</th>
              <th className="p-3 text-center text-sm font-semibold text-ghibli-brown tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentVolunteers.map((volunteer) => (
              <tr key={volunteer._id} className="border-b border-ghibli-cream-light hover:bg-ghibli-cream-lightest transition-colors duration-150">
                <td className="p-3 text-sm text-ghibli-dark-blue whitespace-nowrap">
                  {volunteer.name}
                </td>
                <td className="p-3 text-sm text-ghibli-brown whitespace-nowrap">{volunteer.email}</td>
                <td className="p-3 text-sm text-ghibli-brown whitespace-nowrap">{volunteer.applicationDate || volunteer.createdAt || 'N/A'}</td>
                <td className="p-3 text-center whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(volunteer.verificationStatus || volunteer.status)}`}
                  >
                    {getStatusDisplayText(volunteer.verificationStatus || volunteer.status)}
                  </span>
                </td>
                <td className="p-3 text-center whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openVolunteerDrawer(volunteer)}
                    className="cursor-pointer p-1.5 text-ghibli-blue hover:text-ghibli-blue-dark transition-colors duration-150"
                    title="View Application & Documents"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredVolunteers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-ghibli-brown">
                  {searchTerm ? `No volunteers found matching "${searchTerm}".` : `No ${statusTabs.find(tab => tab.key === activeTab)?.label.toLowerCase()} volunteer applications found.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 0 && (
         <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={filteredVolunteers.length}
        />
      )}

      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeVolunteerDrawer}
        title="Volunteer Application Details"
      >
        {selectedVolunteer && (
          <VolunteerApplicationForm
            volunteer={selectedVolunteer}
            onCloseDrawer={closeVolunteerDrawer}
          />
        )}
      </Drawer>

    </div>
  );
};

export default DashboardVolunteersPage;
