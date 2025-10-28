import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import { useAuth } from "../contexts/AuthContext";

export default function Referral() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarnings: 0,
    pendingRewards: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/referral' } } });
      return;
    }
    
    // Load referral data from API
    const loadReferralData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await apiService.getReferralStats();
        // setReferralStats(response.data);
        
        // For now, initialize with empty data
        setReferralStats({
          totalReferrals: 0,
          successfulReferrals: 0,
          totalEarnings: 0,
          pendingRewards: 0
        });
      } catch (error) {
        console.error('Error loading referral data:', error);
        // Set empty stats on error
        setReferralStats({
          totalReferrals: 0,
          successfulReferrals: 0,
          totalEarnings: 0,
          pendingRewards: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadReferralData();
  }, [isAuthenticated, navigate]);

  const referralCode = user?.id ? `SALHAKAR${user.id.toString().slice(-6).toUpperCase()}` : 'SALHAKAR123456';

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    // You could add a toast notification here
    alert('Referral code copied to clipboard!');
  };

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
        <Navbar />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading referral program...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F9FAFC' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
            Referral Program
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Roboto, sans-serif' }}>
            Invite friends to सलहाकार and earn rewards for every successful referral. 
            Help others access legal services while earning money for yourself.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Total Referrals
                </p>
                <p className="text-3xl font-bold" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  {referralStats.totalReferrals}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Successful Referrals
                </p>
                <p className="text-3xl font-bold" style={{ color: '#10B981', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  {referralStats.successfulReferrals}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Total Earnings
                </p>
                <p className="text-3xl font-bold" style={{ color: '#CF9B63', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  ₹{referralStats.totalEarnings}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  Pending Rewards
                </p>
                <p className="text-3xl font-bold" style={{ color: '#F59E0B', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                  ₹{referralStats.pendingRewards}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
            Your Referral Code
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Share this code with your friends:
              </p>
              <p className="text-2xl font-mono font-bold" style={{ color: '#1E65AD' }}>
                {referralCode}
              </p>
            </div>
            
            <button
              onClick={copyReferralCode}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              style={{ fontFamily: 'Roboto, sans-serif' }}
            >
              Copy Code
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Or share your referral link:
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 break-all" style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {window.location.origin}/signup?ref={referralCode}
                </p>
              </div>
              
              <button
                onClick={shareReferralLink}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/referral/invite')}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Invite Friends
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Send personalized invitations to your friends and family
            </p>
          </button>

          <button
            onClick={() => navigate('/referral/rewards')}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Earn Rewards
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Learn about our reward structure and earning potential
            </p>
          </button>

          <button
            onClick={() => navigate('/referral/track')}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
              Track Referrals
            </h3>
            <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
              Monitor your referral activity and earnings in real-time
            </p>
          </button>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                Share Your Code
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Share your unique referral code or link with friends and family
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                They Sign Up
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Your friends sign up using your referral code and become active users
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1E65AD', fontFamily: 'Helvetica Hebrew Bold, sans-serif' }}>
                You Earn Rewards
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
                Earn ₹200 for each successful referral and ₹50 for each transaction they make
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
