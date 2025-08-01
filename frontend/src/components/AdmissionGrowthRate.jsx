import axios from 'axios';
import { ArrowDownRight, ArrowUpRight, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

const AdmissionGrowthRate = () => {
  const [admissionData, setAdmissionData] = useState(null);
  const [alos, setAlos] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [admissionsRes, alosRes] = await Promise.all([
          axios.get('http://localhost:4580/api/v1/analytics/admission-growth-rate'),
          axios.get('http://localhost:4580/api/v1/analytics/average-length-of-stay'),
        ]);

        setAdmissionData(admissionsRes.data);
        setAlos(alosRes.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchData();
  }, []);

  if (!admissionData || !alos) return null;

  const {
    thisWeekAdmissions,
    lastWeekAdmissions,
    growthRate,
  } = admissionData;

  const averageLengthOfStay = alos.averageLengthOfStay;
  const isGrowthPositive = growthRate >= 0;

  return (
    <section className="w-full hover:shadow-md rounded-2xl p-6 flex flex-col gap-6 bg-white border border ">
      <h2 className="text-xl font-semibold text-gray-800">Admission Insights</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-sm text-gray-500">This Week's Admissions</p>
          <p className="text-2xl font-bold text-blue-600">{thisWeekAdmissions}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Last Week's Admissions</p>
          <p className="text-2xl font-bold text-gray-500">{lastWeekAdmissions}</p>
        </div>
        <div className="flex justify-center items-center gap-2">
          {isGrowthPositive ? (
            <ArrowUpRight className="text-green-600 w-6 h-6" />
          ) : (
            <ArrowDownRight className="text-red-600 w-6 h-6" />
          )}
          <div>
            <p className="text-sm text-gray-500">Growth Rate</p>
            <p
              className={`text-2xl font-bold ${
                isGrowthPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Math.abs(growthRate).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 h-full border-t pt-4 flex items-center justify-center gap-3 text-gray-700">
        <Timer className="w-5 h-5 text-blue-500" />
        <p className="text-sm">
          <strong>Average Length of Stay:</strong>{' '}
          <span className="text-blue-600 font-semibold">
            {averageLengthOfStay} days
          </span>
        </p>
      </div>
    </section>
  );
};

export default AdmissionGrowthRate;
