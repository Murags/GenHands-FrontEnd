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

const placeholderVolunteers = [
  {
    id: 'v001',
    name: 'Alice Wonderland',
    email: 'alice.w@example.com',
    applicationDate: '2023-10-26',
    status: 'Pending Review',
    documents: [{ name: 'ID_Proof.pdf', url: '#' }, { name: 'Reference_Letter.pdf', url: '#' }],
    notes: 'Awaiting background check.'
  },
  {
    id: 'v002',
    name: 'Bob The Builder',
    email: 'bob.b@example.com',
    applicationDate: '2023-10-24',
    status: 'Approved',
    documents: [{ name: 'ID_Card.jpg', url: '#' }],
    notes: 'Cleared. Ready for orientation.'
  },
  {
    id: 'v003',
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    applicationDate: '2023-10-22',
    status: 'Needs More Info',
    documents: [],
    notes: 'Missing address proof. Emailed applicant.'
  },
  {
    id: 'v004',
    name: 'Diana Prince',
    email: 'diana.p@example.com',
    applicationDate: '2023-10-20',
    status: 'Rejected',
    documents: [],
    notes: 'Application incomplete after follow-up. Does not meet criteria.'
  },
  // Add more for pagination testing if needed
  { id: 'v005', name: 'Edward Scissorhands', email: 'ed.s@example.com', applicationDate: '2023-10-19', status: 'Pending Review', documents: [], notes: '' },
  { id: 'v006', name: 'Fiona Gallagher', email: 'fiona.g@example.com', applicationDate: '2023-10-18', status: 'Approved', documents: [], notes: '' },
  { id: 'v007', name: 'George Jetson', email: 'george.j@example.com', applicationDate: '2023-10-17', status: 'Pending Review', documents: [], notes: '' },
  { id: 'v008', name: 'Harry Potter', email: 'harry.p@example.com', applicationDate: '2023-10-16', status: 'Needs More Info', documents: [], notes: '' },
  { id: 'v009', name: 'Iris West', email: 'iris.w@example.com', applicationDate: '2023-10-15', status: 'Approved', documents: [], notes: '' },
  { id: 'v010', name: 'Jack Sparrow', email: 'jack.s@example.com', applicationDate: '2023-10-14', status: 'Rejected', documents: [], notes: '' },
  { id: 'v011', name: 'Kara Danvers', email: 'kara.d@example.com', applicationDate: '2023-10-13', status: 'Pending Review', documents: [], notes: '' },
];

const getStatusPillClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'bg-ghibli-green-light text-ghibli-green-dark';
    case 'Pending Review':
      return 'bg-ghibli-yellow-light text-ghibli-yellow-dark';
    case 'Needs More Info':
      return 'bg-ghibli-blue-light text-ghibli-blue-dark';
    case 'Rejected':
      return 'bg-ghibli-red-light text-ghibli-red-dark';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};

const ITEMS_PER_PAGE = 5; // Define how many items to show per page

const DashboardVolunteersPage = () => {
  const [allVolunteers, setAllVolunteers] = useState(placeholderVolunteers); // Made allVolunteers updatable
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const filteredVolunteers = useMemo(() => {
    if (!searchTerm) {
      return allVolunteers;
    }
    return allVolunteers.filter(
      (volunteer) =>
        volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openVolunteerDrawer = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDrawerOpen(true);
  };

  const closeVolunteerDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedVolunteer(null);
  };

  const handleUpdateVolunteerStatus = (volunteerId, newStatus, newNotes) => {
    setAllVolunteers(prevVolunteers =>
      prevVolunteers.map(v =>
        v.id === volunteerId ? { ...v, status: newStatus, notes: newNotes } : v
      )
    );
    console.log(`Updated volunteer ${volunteerId} to status ${newStatus} with notes: ${newNotes}`);
  };

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
              <tr key={volunteer.id} className="border-b border-ghibli-cream-light hover:bg-ghibli-cream-lightest transition-colors duration-150">
                <td className="p-3 text-sm text-ghibli-dark-blue whitespace-nowrap">
                  {volunteer.name}
                </td>
                <td className="p-3 text-sm text-ghibli-brown whitespace-nowrap">{volunteer.email}</td>
                <td className="p-3 text-sm text-ghibli-brown whitespace-nowrap">{volunteer.applicationDate}</td>
                <td className="p-3 text-center whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClass(volunteer.status)}`}
                  >
                    {volunteer.status}
                  </span>
                </td>
                <td className="p-3 text-center whitespace-nowrap space-x-2">
                  <button
                    onClick={() => openVolunteerDrawer(volunteer)}
                    className="p-1.5 text-ghibli-blue hover:text-ghibli-blue-dark transition-colors duration-150"
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
                  {searchTerm ? `No volunteers found matching "${searchTerm}".` : 'No volunteer applications found.'}
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
            onUpdateStatus={handleUpdateVolunteerStatus}
            onCloseDrawer={closeVolunteerDrawer}
          />
        )}
      </Drawer>

    </div>
  );
};

export default DashboardVolunteersPage;
