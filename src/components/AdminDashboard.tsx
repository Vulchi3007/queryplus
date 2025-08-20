import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, Calendar, Eye, Download } from 'lucide-react';
import { getUserAnalysisSummary, getUserDetailedAnalysis, AnalysisSummary, UserData, AnalysisRecord } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [summaryData, setSummaryData] = useState<AnalysisSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ user: UserData; analyses: AnalysisRecord[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = async () => {
    try {
      setLoading(true);
      const data = await getUserAnalysisSummary();
      setSummaryData(data);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading summary data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      const data = await getUserDetailedAnalysis(userId);
      setSelectedUser(data);
    } catch (err) {
      setError('Failed to load user details');
      console.error('Error loading user details:', err);
    }
  };

  const getStageColor = (stage: string) => {
    if (stage.includes('No Visible')) return 'bg-green-100 text-green-800';
    if (stage.includes('Stage 1')) return 'bg-yellow-100 text-yellow-800';
    if (stage.includes('Stage 2')) return 'bg-orange-100 text-orange-800';
    if (stage.includes('Stage 3')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Age', 'City', 'Mobile', 'Email', 'Total Analyses', 'Avg Probability', 'Last Analysis'].join(','),
      ...summaryData.map(user => [
        user.full_name,
        user.age,
        user.city,
        user.mobile,
        user.email || '',
        user.total_analyses,
        user.avg_probability?.toFixed(1) || '0',
        user.last_analysis_date ? new Date(user.last_analysis_date).toLocaleDateString() : 'Never'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qureplus-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadSummaryData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalUsers = summaryData.length;
  const totalAnalyses = summaryData.reduce((sum, user) => sum + user.total_analyses, 0);
  const avgProbability = summaryData.reduce((sum, user) => sum + (user.avg_probability || 0), 0) / totalUsers;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">QurePlus Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Monitor user activity and analysis results</p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">{totalAnalyses}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Probability</p>
                <p className="text-2xl font-bold text-gray-900">{avgProbability.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summaryData.filter(user => 
                    user.last_analysis_date && 
                    new Date(user.last_analysis_date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Analysis Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Analyses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Probability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Analysis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summaryData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        <div className="text-sm text-gray-500">{user.age} years, {user.city}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.mobile}</div>
                      <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {user.total_analyses}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.avg_probability ? `${user.avg_probability.toFixed(1)}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_analysis_date ? new Date(user.last_analysis_date).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => loadUserDetails(user.id)}
                        className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.user.full_name} - Analysis History
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">User Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="text-gray-600">Age:</span> {selectedUser.user.age} years</div>
                      <div><span className="text-gray-600">City:</span> {selectedUser.user.city}</div>
                      <div><span className="text-gray-600">Mobile:</span> {selectedUser.user.mobile}</div>
                      {selectedUser.user.email && (
                        <div><span className="text-gray-600">Email:</span> {selectedUser.user.email}</div>
                      )}
                      <div><span className="text-gray-600">Registered:</span> {new Date(selectedUser.user.created_at!).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div><span className="text-gray-600">Total Analyses:</span> {selectedUser.analyses.length}</div>
                      <div><span className="text-gray-600">Average Probability:</span> {
                        selectedUser.analyses.length > 0 
                          ? (selectedUser.analyses.reduce((sum, a) => sum + (a.probability || 0), 0) / selectedUser.analyses.length).toFixed(1) + '%'
                          : 'N/A'
                      }</div>
                      <div><span className="text-gray-600">Last Analysis:</span> {
                        selectedUser.analyses.length > 0 
                          ? new Date(selectedUser.analyses[0].created_at!).toLocaleDateString()
                          : 'Never'
                      }</div>
                    </div>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">Analysis History</h4>
                <div className="space-y-4">
                  {selectedUser.analyses.map((analysis) => (
                    <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-blue-600">{analysis.probability}%</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(analysis.stage!)}`}>
                            {analysis.stage}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(analysis.created_at!).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{analysis.reasoning}</p>
                      {analysis.image_url && (
                        <div className="mt-2">
                          <img 
                            src={analysis.image_url} 
                            alt="Analysis" 
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;