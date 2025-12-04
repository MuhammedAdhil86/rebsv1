import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import moment from 'moment';
import { fetchPieChart } from '../../service/companyService';

const PieChartComponent = ({ month, year, employeeId }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define color mapping for different attendance types
  const colorMap = {
    'Absents': '#EF4444',   // Red
    'Present': '#10B981',   // Green
    'Leaves': '#3B82F6',    // Blue
    'Holidays': '#F59E0B',  // Amber
    'Weekly Offs': '#6B7280' // Gray
  };

  // Function to parse the attendance data
  const parseAttendanceData = (data) => {
    // Ensure we have data to work with
    if (!data || typeof data !== 'object') {
      console.error("Invalid data format received:", data);
      return [];
    }

    return Object.entries(data).map(([key, value]) => {
      // Convert key from snake_case to Title Case
      const displayName = key
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize words

      return {
        name: displayName,
        value: parseFloat(value), // Convert string to number
        color: colorMap[displayName] || '#9CA3AF' // Default gray if no color found
      };
    }).filter(item => item.value > 0); // Filter out zero values
  };

  useEffect(() => {
    const getAttendanceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Use the service function to fetch data from the API
        const response = await fetchPieChart(month, year, employeeId);
        
        // Access the data directly from the response
        // If your response is already in the format {absents: "67.74", present: "22.58", ...}
        // then use the response directly
        const data = response;
        
        const transformedData = parseAttendanceData(data);
        setChartData(transformedData);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError('Failed to load attendance data. Please try again.');
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have the required parameters
    if (month && year && employeeId) {
      getAttendanceData();
    } else {
      setIsLoading(false);
      setError('Missing required parameters: month, year, or employee ID');
    }
  }, [month, year, employeeId]);

  // For development/testing - display the example data you provided
  useEffect(() => {
    // This is for testing with the exact data format you provided
    if (!month || !year || !employeeId) {
      const exampleData = {
        "absents": "67.74",
        "present": "22.58",
        "leaves": "0.00",
        "holidays": "0.00",
        "weekly_offs": "9.68"
      };
      
      const transformedData = parseAttendanceData(exampleData);
      setChartData(transformedData);
      setIsLoading(false);
    }
  }, [month, year, employeeId]);

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 border text-black border-black bg-white">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 h-96 rounded-lg shadow-md">
      <h2 className="4xl:text-lg font-semibold mb-4 text-center text-black">
        Attendance Overview {month && year ? `(${moment().month(month - 1).format('MMMM')} ${year})` : ''}
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading attendance data...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No attendance data available for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PieChartComponent;