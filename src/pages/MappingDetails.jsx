import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import apiService from "../services/api";
import BookmarkButton from "../components/BookmarkButton";
import { useAuth } from "../contexts/AuthContext";

export default function MappingDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [mapping, setMapping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get mapping data from location state
    if (location.state?.mapping) {
      setMapping(location.state.mapping);
      setLoading(false);
    } else {
      // If no mapping data, redirect back to law-mapping page
      navigate('/law-mapping');
    }
  }, [location.state, navigate]);

  // Determine mapping type from the mapping data
  const getMappingType = () => {
    if (!mapping) return 'bns_ipc'; // default if mapping not loaded yet
    if (mapping.mapping_type) {
      return mapping.mapping_type;
    }
    // Try to determine from section fields
    if (mapping.ipc_section || mapping.bns_section) return 'bns_ipc';
    if (mapping.iea_section || mapping.bsa_section) return 'bsa_iea';
    if (mapping.crpc_section || mapping.bnss_section) return 'bnss_crpc';
    return 'bns_ipc'; // default
  };

  const goBack = () => {
    // Navigate back to law-mapping page with the correct mapping type
    if (mapping) {
      const mappingType = getMappingType();
      navigate(`/law-mapping?type=${mappingType}`);
    } else {
      navigate('/law-mapping');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading mapping details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={goBack}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mapping) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No mapping data available</p>
            <button
              onClick={goBack}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Use the getMappingType function defined earlier, but only if mapping exists
  const mappingType = mapping ? getMappingType() : 'bns_ipc';

  // Get section numbers based on mapping type
  const getSourceSection = () => {
    if (mappingType === 'bns_ipc') {
      return mapping.ipc_section || mapping.source_section;
    } else if (mappingType === 'bsa_iea') {
      return mapping.iea_section || mapping.source_section;
    } else {
      return mapping.crpc_section || mapping.source_section;
    }
  };
  
  const getTargetSection = () => {
    if (mappingType === 'bns_ipc') {
      return mapping.bns_section || mapping.target_section;
    } else if (mappingType === 'bsa_iea') {
      return mapping.bsa_section || mapping.target_section;
    } else {
      return mapping.bnss_section || mapping.target_section;
    }
  };

  const sourceSection = getSourceSection();
  const targetSection = getTargetSection();
  const subject = mapping.subject || mapping.title || 'Mapping';
  const summary = mapping.summary || mapping.description || mapping.source_description || '';

  // Get labels and colors based on mapping type
  const getMappingInfo = () => {
    if (mappingType === 'bns_ipc') {
      return {
        title: 'IPC ↔ BNS Mapping',
        sourceLabel: 'IPC Section',
        targetLabel: 'BNS Section',
        sourceAct: 'Indian Penal Code, 1860',
        targetAct: 'Bharatiya Nyaya Sanhita, 2023',
        sourceColor: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
        targetColor: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
      };
    } else if (mappingType === 'bsa_iea') {
      return {
        title: 'IEA ↔ BSA Mapping',
        sourceLabel: 'IEA Section',
        targetLabel: 'BSA Section',
        sourceAct: 'Indian Evidence Act, 1872',
        targetAct: 'Bharatiya Sakshya Adhiniyam, 2023',
        sourceColor: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
        targetColor: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
      };
    } else {
      return {
        title: 'CrPC ↔ BNSS Mapping',
        sourceLabel: 'CrPC Section',
        targetLabel: 'BNSS Section',
        sourceAct: 'Code of Criminal Procedure, 1973',
        targetAct: 'Bharatiya Nagarik Suraksha Sanhita, 2023',
        sourceColor: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
        targetColor: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
      };
    }
  };

  const mappingInfo = getMappingInfo();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      <div className="pt-20">
        <div className="flex-1 p-3 sm:p-4 lg:p-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="max-w-7xl mx-auto h-full">
            <div className="space-y-6">
              
              {/* Header Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        {mappingInfo.title}
                      </h1>
                      {isAuthenticated && mapping && (
                        <BookmarkButton
                          item={mapping}
                          type={
                            mappingType === 'bns_ipc' ? 'bns_ipc_mapping' : 
                            mappingType === 'bsa_iea' ? 'bsa_iea_mapping' : 
                            mappingType === 'bnss_crpc' ? 'bnss_crpc_mapping' : 
                            'bns_ipc_mapping'
                          }
                          size="small"
                          showText={false}
                        />
                      )}
                    </div>
                    <div className="w-16 h-1 bg-gradient-to-r" style={{ background: 'linear-gradient(90deg, #1E65AD 0%, #CF9B63 100%)' }}></div>
                  </div>
                  <button
                    onClick={goBack}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                  </button>
                </div>
              </div>

              {/* Main Content - Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Source Section Card */}
                <div className={`${mappingInfo.sourceColor.bg} rounded-xl shadow-lg border-2 ${mappingInfo.sourceColor.border} p-6`}>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      {mappingInfo.sourceLabel}
                    </h3>
                    {sourceSection && (
                      <div className={`text-5xl font-bold ${mappingInfo.sourceColor.text} mb-4`}>
                        {sourceSection}
                      </div>
                    )}
                    <div className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {mappingInfo.sourceAct}
                    </div>
                  </div>
                  
                  {/* Source Section Details */}
                  {mapping.ipc_description && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">Section Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.ipc_description}
                      </p>
                    </div>
                  )}
                  {mapping.iea_description && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">Section Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.iea_description}
                      </p>
                    </div>
                  )}
                  {mapping.crpc_description && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">Section Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.crpc_description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Target Section Card */}
                <div className={`${mappingInfo.targetColor.bg} rounded-xl shadow-lg border-2 ${mappingInfo.targetColor.border} p-6`}>
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      {mappingInfo.targetLabel}
                    </h3>
                    {targetSection && (
                      <div className={`text-5xl font-bold ${mappingInfo.targetColor.text} mb-4`}>
                        {targetSection}
                      </div>
                    )}
                    <div className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {mappingInfo.targetAct}
                    </div>
                  </div>
                  
                  {/* Target Section Details */}
                  {mapping.bns_description && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">Section Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.bns_description}
                      </p>
                    </div>
                  )}
                  {mapping.bsa_description && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">Section Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.bsa_description}
                      </p>
                    </div>
                  )}
                  {mapping.bnss_description && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <h4 className="text-sm font-semibold mb-2 text-gray-800">Section Description</h4>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                        {mapping.bnss_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Subject and Summary Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Subject: {subject}
                </h3>
                {summary && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Roboto, sans-serif' }}>
                      {summary}
                    </p>
                  </div>
                )}
              </div>

              {/* All Mapping Data Section - Shows all fields from API */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  Complete Mapping Information
                </h3>
                
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
                  {/* Left Column - Source Details */}
                  {/* <div className="space-y-4"> */}
                    {/* <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      Source Section Details
                    </h4> */}
                    
                    {/* IPC Section Fields */}
                    {/* {mapping.ipc_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">IPC Section Number</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.ipc_section}</p>
                      </div>
                    )}
                    {mapping.ipc_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">IPC Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.ipc_description}</p>
                      </div>
                    )} */}
                    
                    {/* IEA Section Fields */}
                    {/* {mapping.iea_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">IEA Section Number</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.iea_section}</p>
                      </div>
                    )}
                    {mapping.iea_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">IEA Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.iea_description}</p>
                      </div>
                    )} */}
                    
                    {/* CrPC Section Fields */}
                    {/* {mapping.crpc_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">CrPC Section Number</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.crpc_section}</p>
                      </div>
                    )}
                    {mapping.crpc_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">CrPC Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.crpc_description}</p>
                      </div>
                    )} */}
                    
                    {/* Generic Source Fields */}
                    {/* {mapping.source_section && !mapping.ipc_section && !mapping.iea_section && !mapping.crpc_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Source Section</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.source_section}</p>
                      </div>
                    )}
                    {mapping.source_description && !mapping.ipc_description && !mapping.iea_description && !mapping.crpc_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Source Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.source_description}</p>
                      </div>
                    )} */}
                  {/* </div> */}

                  {/* Right Column - Target Details */}
                  {/* <div className="space-y-4"> */}
                    {/* <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                      Target Section Details
                    </h4> */}
                    
                    {/* BNS Section Fields */}
                    {/* {mapping.bns_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">BNS Section Number</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.bns_section}</p>
                      </div>
                    )}
                    {mapping.bns_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">BNS Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.bns_description}</p>
                      </div>
                    )} */}
                    
                    {/* BSA Section Fields */}
                    {/* {mapping.bsa_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">BSA Section Number</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.bsa_section}</p>
                      </div>
                    )}
                    {mapping.bsa_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">BSA Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.bsa_description}</p>
                      </div>
                    )} */}
                    
                    {/* BNSS Section Fields */}
                    {/* {mapping.bnss_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">BNSS Section Number</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.bnss_section}</p>
                      </div>
                    )}
                    {mapping.bnss_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">BNSS Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.bnss_description}</p>
                      </div>
                    )} */}
                    
                    {/* Generic Target Fields */}
                    {/* {mapping.target_section && !mapping.bns_section && !mapping.bsa_section && !mapping.bnss_section && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Target Section</h5>
                        <p className="text-sm text-gray-900 font-medium">{mapping.target_section}</p>
                      </div>
                    )}
                    {mapping.target_description && !mapping.bns_description && !mapping.bsa_description && !mapping.bnss_description && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Target Description</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.target_description}</p>
                      </div>
                    )} */}
                  {/* </div> */}
                {/* </div> */}

                {/* Additional Fields Section */}
                <div>
                  {/* <h4 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                    Additional Information
                  </h4> */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* {mapping.id && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Mapping ID</h5>
                        <p className="text-sm text-gray-600">{mapping.id}</p>
                      </div>
                    )} */}
                    {mapping.mapping_type && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Mapping Type</h5>
                        <p className="text-sm text-gray-600">{mapping.mapping_type}</p>
                      </div>
                    )}
                    {mapping.title && mapping.title !== subject && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Title</h5>
                        <p className="text-sm text-gray-600">{mapping.title}</p>
                      </div>
                    )}
                    {mapping.description && mapping.description !== summary && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Description</h5>
                        <p className="text-sm text-gray-600">{mapping.description}</p>
                      </div>
                    )}
                    {mapping.notes && (
                      <div className="md:col-span-2">
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Notes</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.notes}</p>
                      </div>
                    )}
                    {mapping.comments && (
                      <div className="md:col-span-2">
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Comments</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.comments}</p>
                      </div>
                    )}
                    {mapping.remarks && (
                      <div className="md:col-span-2">
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Remarks</h5>
                        <p className="text-sm text-gray-600 leading-relaxed">{mapping.remarks}</p>
                      </div>
                    )}
                    {mapping.created_at && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Created At</h5>
                        <p className="text-sm text-gray-600">{new Date(mapping.created_at).toLocaleString()}</p>
                      </div>
                    )}
                    {mapping.updated_at && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-700 mb-1">Updated At</h5>
                        <p className="text-sm text-gray-600">{new Date(mapping.updated_at).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Display any other fields that might exist in the API response */}
                  {Object.keys(mapping).filter(key => 
                    !['id', 'subject', 'summary', 'title', 'description', 'mapping_type',
                      'ipc_section', 'bns_section', 'iea_section', 'bsa_section', 'crpc_section', 'bnss_section',
                      'ipc_description', 'bns_description', 'iea_description', 'bsa_description', 'crpc_description', 'bnss_description',
                      'source_section', 'target_section', 'source_description', 'target_description',
                      'notes', 'comments', 'remarks', 'created_at', 'updated_at'].includes(key)
                    && mapping[key] !== null && mapping[key] !== undefined && mapping[key] !== ''
                  ).length > 0 && (
                    <div >
                      <h4 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                        Acts Details 
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {Object.keys(mapping)
                          .filter(key => 
                            !['id', 'subject', 'summary', 'title', 'description', 'mapping_type',
                              'ipc_section', 'bns_section', 'iea_section', 'bsa_section', 'crpc_section', 'bnss_section',
                              'ipc_description', 'bns_description', 'iea_description', 'bsa_description', 'crpc_description', 'bnss_description',
                              'source_section', 'target_section', 'source_description', 'target_description',
                              'notes', 'comments', 'remarks', 'created_at', 'updated_at'].includes(key)
                            && mapping[key] !== null && mapping[key] !== undefined && mapping[key] !== ''
                          )
                          .map(key => (
                            <div key={key}>
                              <h5 className="text-sm font-semibold text-gray-700 mb-1 capitalize">
                                {key.replace(/_/g, ' ')}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {typeof mapping[key] === 'object' ? JSON.stringify(mapping[key], null, 2) : String(mapping[key])}
                              </p>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={goBack}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Mappings
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

