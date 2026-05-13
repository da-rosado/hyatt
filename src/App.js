import React, { useState, useEffect } from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b">{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

function App() {
  const [personalSpend, setPersonalSpend] = useState(() => {
    const saved = localStorage.getItem('personalSpend');
    return saved ? JSON.parse(saved) : Array(12).fill(0);
  });
  
  const [businessSpend, setBusinessSpend] = useState(() => {
    const saved = localStorage.getItem('businessSpend');
    return saved ? JSON.parse(saved) : Array(12).fill(0);
  });
  
  const [organicNights, setOrganicNights] = useState(() => {
    const saved = localStorage.getItem('organicNights');
    return saved ? parseFloat(saved) : 0;
  });
  
  const [mattressNights, setMattressNights] = useState(() => {
    const saved = localStorage.getItem('mattressNights');
    return saved ? parseFloat(saved) : 0;
  });
  
  const [freeNightUsed, setFreeNightUsed] = useState(() => {
    const saved = localStorage.getItem('freeNightUsed');
    return saved ? JSON.parse(saved) : {
      anniversary: false,
      spending: false,
      milestone30: false
    };
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('personalSpend', JSON.stringify(personalSpend));
  }, [personalSpend]);

  useEffect(() => {
    localStorage.setItem('businessSpend', JSON.stringify(businessSpend));
  }, [businessSpend]);

  useEffect(() => {
    localStorage.setItem('organicNights', organicNights.toString());
  }, [organicNights]);

  useEffect(() => {
    localStorage.setItem('mattressNights', mattressNights.toString());
  }, [mattressNights]);

  useEffect(() => {
    localStorage.setItem('freeNightUsed', JSON.stringify(freeNightUsed));
  }, [freeNightUsed]);

  // Calculate totals
  const totalPersonalSpend = personalSpend.reduce((sum, val) => sum + val, 0);
  const totalBusinessSpend = businessSpend.reduce((sum, val) => sum + val, 0);

  // Calculate nights from spending
  const personalAutoNights = 5;
  const personalSpendNights = Math.floor(totalPersonalSpend / 5000) * 2;
  const businessSpendNights = Math.floor(totalBusinessSpend / 10000) * 5;
  
  // Calculate free nights
  const spendingFreeNightEarned = totalPersonalSpend >= 15000;
  const freeNightsUsed = (freeNightUsed.anniversary ? 1 : 0) + 
                         (freeNightUsed.spending && spendingFreeNightEarned ? 1 : 0) + 
                         (freeNightUsed.milestone30 ? 1 : 0);

  // Total nights
  const totalNights = personalAutoNights + personalSpendNights + businessSpendNights + 
                      organicNights + mattressNights + freeNightsUsed;

  // Calculate remaining to next threshold
  const personalNextThreshold = (Math.floor(totalPersonalSpend / 5000) + 1) * 5000;
  const personalRemaining = personalNextThreshold - totalPersonalSpend;
  const businessNextThreshold = (Math.floor(totalBusinessSpend / 10000) + 1) * 10000;
  const businessRemaining = businessNextThreshold - totalBusinessSpend;

  const handlePersonalSpendChange = (index, value) => {
    const newSpend = [...personalSpend];
    newSpend[index] = parseFloat(value) || 0;
    setPersonalSpend(newSpend);
  };

  const handleBusinessSpendChange = (index, value) => {
    const newSpend = [...businessSpend];
    newSpend[index] = parseFloat(value) || 0;
    setBusinessSpend(newSpend);
  };

  const progressPercent = Math.min((totalNights / 60) * 100, 100);

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setPersonalSpend(Array(12).fill(0));
      setBusinessSpend(Array(12).fill(0));
      setOrganicNights(0);
      setMattressNights(0);
      setFreeNightUsed({ anniversary: false, spending: false, milestone30: false });
      localStorage.clear();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Hyatt Globalist Status Tracker 2026</CardTitle>
              <button
                onClick={resetData}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Reset All Data
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Progress to Globalist (60 Nights)</span>
                <span className="font-bold text-lg">{totalNights} / 60 Nights</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-semibold"
                  style={{ width: `${progressPercent}%` }}
                >
                  {progressPercent.toFixed(0)}%
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {60 - totalNights > 0 ? `${60 - totalNights} nights remaining` : 'Globalist achieved! 🎉'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card className="bg-purple-50">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-3">Personal Card</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Spend:</span>
                      <span className="font-semibold">${totalPersonalSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Automatic Nights:</span>
                      <span className="font-semibold">{personalAutoNights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spending Nights (2 per $5k):</span>
                      <span className="font-semibold">{personalSpendNights}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Total Nights:</span>
                      <span className="font-bold">{personalAutoNights + personalSpendNights}</span>
                    </div>
                    <div className="flex justify-between text-orange-600 mt-3">
                      <span>Next threshold:</span>
                      <span className="font-semibold">${personalRemaining.toLocaleString()} to go</span>
                    </div>
                    {spendingFreeNightEarned && (
                      <div className="text-green-600 font-semibold">
                        ✓ $15k Free Night Earned!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-3">Business Card</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Spend:</span>
                      <span className="font-semibold">${totalBusinessSpend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spending Nights (5 per $10k):</span>
                      <span className="font-semibold">{businessSpendNights}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-bold">Total Nights:</span>
                      <span className="font-bold">{businessSpendNights}</span>
                    </div>
                    <div className="flex justify-between text-orange-600 mt-3">
                      <span>Next threshold:</span>
                      <span className="font-semibold">${businessRemaining.toLocaleString()} to go</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Monthly Spending</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Month</th>
                        <th className="text-center py-2">Personal Card</th>
                        <th className="text-center py-2">Business Card</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months.map((month, index) => (
                        <tr key={month} className="border-b">
                          <td className="py-2 font-semibold">{month}</td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={personalSpend[index] || ''}
                              onChange={(e) => handlePersonalSpendChange(index, e.target.value)}
                              className="w-full px-3 py-1 border rounded text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <input
                              type="number"
                              value={businessSpend[index] || ''}
                              onChange={(e) => handleBusinessSpendChange(index, e.target.value)}
                              className="w-full px-3 py-1 border rounded text-center"
                              placeholder="0"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">Other Qualifying Nights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Organic Stays (Work/Vacation)</label>
                    <input
                      type="number"
                      value={organicNights || ''}
                      onChange={(e) => setOrganicNights(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Mattress Runs</label>
                    <input
                      type="number"
                      value={mattressNights || ''}
                      onChange={(e) => setMattressNights(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border rounded"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Free Night Certificates Used</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={freeNightUsed.anniversary}
                        onChange={(e) => setFreeNightUsed({...freeNightUsed, anniversary: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm">Anniversary Free Night</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={freeNightUsed.spending}
                        onChange={(e) => setFreeNightUsed({...freeNightUsed, spending: e.target.checked})}
                        className="mr-2"
                        disabled={!spendingFreeNightEarned}
                      />
                      <span className={`text-sm ${!spendingFreeNightEarned ? 'text-gray-400' : ''}`}>
                        $15k Spending Free Night {!spendingFreeNightEarned && '(not yet earned)'}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={freeNightUsed.milestone30}
                        onChange={(e) => setFreeNightUsed({...freeNightUsed, milestone30: e.target.checked})}
                        className="mr-2"
                        disabled={totalNights < 30}
                      />
                      <span className={`text-sm ${totalNights < 30 ? 'text-gray-400' : ''}`}>
                        30-Night Milestone Free Night {totalNights < 30 && '(not yet earned)'}
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 mt-6">
              <CardContent className="pt-6">
                <h3 className="font-bold text-xl mb-4">Total Qualifying Nights Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Personal Card (Automatic):</span>
                    <span className="font-semibold">{personalAutoNights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personal Card (Spending):</span>
                    <span className="font-semibold">{personalSpendNights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business Card (Spending):</span>
                    <span className="font-semibold">{businessSpendNights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organic Stays:</span>
                    <span className="font-semibold">{organicNights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mattress Runs:</span>
                    <span className="font-semibold">{mattressNights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Free Night Certificates Used:</span>
                    <span className="font-semibold">{freeNightsUsed} nights</span>
                  </div>
                  <div className="flex justify-between border-t-2 pt-2 mt-2">
                    <span className="font-bold text-lg">TOTAL QUALIFYING NIGHTS:</span>
                    <span className="font-bold text-lg text-green-600">{totalNights} nights</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
