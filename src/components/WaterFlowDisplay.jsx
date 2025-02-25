import React, { useState, useEffect } from "react";

const WaterFlowDisplay = () => {
  const [flowValue, setFlowValue] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchWaterFlowData = async () => {
    try {
      const response = await fetch(
        "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=12048000&parameterCd=00060"
      );
      const data = await response.json();

      // Extract the latest water flow value
      const flow = data?.value?.timeSeries[0]?.values[0]?.value[0]?.value;
      const dateTime = data?.value?.timeSeries[0]?.values[0]?.value[0]?.dateTime;

      if (flow) {
        setFlowValue(flow);
        setLastUpdated(new Date(dateTime).toLocaleString());
      }
    } catch (error) {
      console.error("Error fetching water flow data:", error);
    }
  };

  useEffect(() => {
    // Fetch data immediately when component mounts
    fetchWaterFlowData();

    // Refresh data every 15 minutes (900,000 ms)
    const interval = setInterval(fetchWaterFlowData, 900000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold">Water Flow Data</h2>
      <p className="text-lg">
        <strong>Flow (cfs):</strong> {flowValue !== null ? flowValue : "Loading..."}
      </p>
      {lastUpdated && <p className="text-sm text-gray-600">Last Updated: {lastUpdated}</p>}
    </div>
  );
};

export default WaterFlowDisplay;
