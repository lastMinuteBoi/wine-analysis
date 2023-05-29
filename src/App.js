import React, { useEffect, useState } from 'react';
import jsonData from './AlcoholData'; // Import the JSON data file
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    calculateStatistics();
  }, [data]);

  useEffect(() => {
    setData(jsonData);
  }, []);

  const calculateStatistics = () => {
    // Get unique alcohol types from the data
    const alcoholTypes = [...new Set(data.map(item => item.Alcohol))];

    // Initialize statistics object
    const stats = {
      flavanoids: {
        mean: {},
        median: {},
        mode: {}
      },
      gamma: {
        mean: {},
        median: {},
        mode: {}
      }
    };

    // Calculate statistics for each alcohol type
    alcoholTypes.forEach(type => {
      // Filter data for the current alcohol type
      const filteredData = data.filter(item => item.Alcohol === type);

      // Extract flavanoid and gamma values
      const flavanoidValues = filteredData.map(item => Number(item["Flavanoids"])); // Converted to number type since at least one of the Flavanoids is not an integer in the JSON data provided, but string type that was making the result NaN.
      const gammaValues = filteredData.map(item => (item.Ash * item.Hue) / item.Magnesium);

      // Calculate mean
      const flavanoidMean = flavanoidValues.reduce((sum, value) => sum + value, 0) / flavanoidValues.length;
      const gammaMean = gammaValues.reduce((sum, value) => sum + value, 0) / gammaValues.length;

      // Calculate median
      const flavanoidSortedValues = flavanoidValues.sort((a, b) => a - b);
      const gammaSortedValues = gammaValues.sort((a, b) => a - b);

      const flavanoidMiddleIndex = Math.floor(flavanoidSortedValues.length / 2);
      const gammaMiddleIndex = Math.floor(gammaSortedValues.length / 2);

      const flavanoidMedian = flavanoidSortedValues.length % 2 === 0
        ? (flavanoidSortedValues[flavanoidMiddleIndex - 1] + flavanoidSortedValues[flavanoidMiddleIndex]) / 2
        : flavanoidSortedValues[flavanoidMiddleIndex];

      const gammaMedian = gammaSortedValues.length % 2 === 0
        ? (gammaSortedValues[gammaMiddleIndex - 1] + gammaSortedValues[gammaMiddleIndex]) / 2
        : gammaSortedValues[gammaMiddleIndex];

      // Calculate mode
      const flavanoidCounts = {};
      const gammaCounts = {};
      let flavanoidMaxCount = 0;
      let gammaMaxCount = 0;
      let flavanoidMode = null;
      let gammaMode = null;

      flavanoidValues.forEach(value => {
        flavanoidCounts[value] = (flavanoidCounts[value] || 0) + 1;
        if (flavanoidCounts[value] > flavanoidMaxCount) {
          flavanoidMaxCount = flavanoidCounts[value];
          flavanoidMode = value;
        }
      });

      gammaValues.forEach(value => {
        gammaCounts[value] = (gammaCounts[value] || 0) + 1;
        if (gammaCounts[value] > gammaMaxCount) {
          gammaMaxCount = gammaCounts[value];
          gammaMode = value;
        }
      });

      // Update statistics object with calculated values
      stats.flavanoids.mean[type] = flavanoidMean;
      stats.gamma.mean[type] = gammaMean;
      stats.flavanoids.median[type] = flavanoidMedian;
      stats.gamma.median[type] = gammaMedian;
      stats.flavanoids.mode[type] = flavanoidMode;
      stats.gamma.mode[type] = gammaMode;
    });

    // Set the statistics state
    setStatistics(stats);
  };

  return (
    <div className="container">
      <h1>Alcohol Statistics</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {statistics.flavanoids && Object.keys(statistics.flavanoids.mean).length > 0 && (
                Object.keys(statistics.flavanoids.mean).map(alcoholType => (
                  <th key={alcoholType}>Class {alcoholType}</th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {statistics.flavanoids && (
              <>
                <tr>
                  <td>Flavanoids Mean</td>
                  {Object.keys(statistics.flavanoids.mean).map(alcoholType => (
                    <td key={alcoholType}>{statistics.flavanoids.mean[alcoholType]?.toFixed(3)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Flavanoids Median</td>
                  {Object.keys(statistics.flavanoids.median).map(alcoholType => (
                    <td key={alcoholType}>{statistics.flavanoids.median[alcoholType]?.toFixed(3)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Flavanoids Mode</td>
                  {Object.keys(statistics.flavanoids.mode).map(alcoholType => (
                    <td key={alcoholType}>{statistics.flavanoids.mode[alcoholType]?.toFixed(3)}</td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {statistics.gamma && statistics.gamma.mean && Object.keys(statistics.gamma.mean).length > 0 && (
                Object.keys(statistics.gamma.mean).map(alcoholType => (
                  <th key={alcoholType}>Class {alcoholType}</th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {statistics.gamma && (
              <>
                <tr>
                  <td>Gamma Mean</td>
                  {Object.keys(statistics.gamma.mean).map(alcoholType => (
                    <td key={alcoholType}>{statistics.gamma.mean[alcoholType]?.toFixed(3)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Gamma Median</td>
                  {Object.keys(statistics.gamma.median).map(alcoholType => (
                    <td key={alcoholType}>{statistics.gamma.median[alcoholType]?.toFixed(3)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Gamma Mode</td>
                  {Object.keys(statistics.gamma.mode).map(alcoholType => (
                    <td key={alcoholType}>{statistics.gamma.mode[alcoholType]?.toFixed(3)}</td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
