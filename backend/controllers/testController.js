/**
 * Test Controller for generating demo data
 */
// For demo purposes, we'll use hardcoded values instead of database queries
// This avoids any model import issues

/**
 * Generate demo dashboard data for testing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateDashboardDemo = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // For demo purposes, we'll use GHS as the currency
    const currency = 'GHS';
    
    // Generate random amounts
    const grossVolume = Math.floor(Math.random() * 50000) + 10000; // Between 10,000 and 60,000
    const netVolume = Math.floor(grossVolume * 0.95); // 95% of gross volume
    const availableBalance = Math.floor(netVolume * 0.7); // 70% of net volume
    const pendingBalance = Math.floor(netVolume * 0.2); // 20% of net volume
    const reservedBalance = Math.floor(netVolume * 0.1); // 10% of net volume
    
    // Generate trend data for the past 7 days
    const dailyTrendData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random values for each day
      const dailyGross = Math.floor((grossVolume / 7) * (0.7 + Math.random() * 0.6));
      const dailyNet = Math.floor(dailyGross * 0.95);
      const dailyCustomers = Math.floor(Math.random() * 5) + 1;
      const dailyFailedPayments = Math.floor(Math.random() * 3);
      
      dailyTrendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        grossVolume: dailyGross,
        netVolume: dailyNet,
        newCustomers: dailyCustomers,
        failedPayments: dailyFailedPayments
      });
    }
    
    // Calculate previous period values (last 7 days before the current period)
    const previousGrossVolume = Math.floor(grossVolume * (0.8 + Math.random() * 0.4));
    const previousNetVolume = Math.floor(previousGrossVolume * 0.95);
    const previousNewCustomers = Math.floor(Math.random() * 20) + 5;
    const previousFailedPayments = Math.floor(Math.random() * 10) + 1;
    
    // Calculate next payout date (next Monday)
    const nextPayoutDate = new Date(today);
    nextPayoutDate.setDate(nextPayoutDate.getDate() + (8 - nextPayoutDate.getDay()) % 7);
    
    // Generate top customers
    const topCustomers = [];
    for (let i = 0; i < 5; i++) {
      topCustomers.push({
        name: `Customer ${i + 1}`,
        spend: Math.floor(Math.random() * 10000) + 1000
      });
    }
    
    // Format the response
    const response = {
      today: {
        grossVolume: {
          amount: dailyTrendData[6].grossVolume,
          lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
          trend: ((dailyTrendData[6].grossVolume - dailyTrendData[5].grossVolume) / dailyTrendData[5].grossVolume) * 100,
          currency
        },
        balance: {
          amount: availableBalance,
          type: currency,
          trend: ((netVolume - previousNetVolume) / previousNetVolume) * 100
        },
        nextPayout: {
          amount: availableBalance,
          date: nextPayoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          currency
        }
      },
      overview: {
        grossVolume: {
          total: grossVolume,
          previousPeriod: previousGrossVolume,
          trend: dailyTrendData.map(day => ({ name: day.date, value: day.grossVolume })),
          lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
          currency
        },
        netVolume: {
          total: netVolume,
          previousPeriod: previousNetVolume,
          trend: dailyTrendData.map(day => ({ name: day.date, value: day.netVolume })),
          lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
          currency
        },
        newCustomers: {
          total: dailyTrendData.reduce((sum, day) => sum + day.newCustomers, 0),
          previousPeriod: previousNewCustomers,
          trend: dailyTrendData.map(day => ({ name: day.date, value: day.newCustomers })),
          lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        },
        failedPayments: {
          total: dailyTrendData.reduce((sum, day) => sum + day.failedPayments, 0),
          previousPeriod: previousFailedPayments,
          trend: dailyTrendData.map(day => ({ name: day.date, value: day.failedPayments })),
          lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        },
        topCustomers
      }
    };
    
    // Return the demo data
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error generating demo dashboard data:', error);
    return res.status(500).json({ error: 'Failed to generate demo dashboard data' });
  }
};

/**
 * Generate demo balance and payout data for testing
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.generateBalanceAndPayoutDemo = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // For demo purposes, we'll use GHS as the currency
    const currency = 'GHS';
    
    // Generate random amounts
    const availableBalance = Math.floor(Math.random() * 50000) + 10000; // Between 10,000 and 60,000
    const pendingBalance = Math.floor(availableBalance * 0.3); // 30% of available balance
    const reservedBalance = Math.floor(availableBalance * 0.1); // 10% of available balance
    
    // Calculate next payout date (next Monday)
    const today = new Date();
    const nextPayoutDate = new Date(today);
    nextPayoutDate.setDate(nextPayoutDate.getDate() + (8 - nextPayoutDate.getDay()) % 7);
    
    // Format the response
    const responseData = {
      availableBalance,
      pendingBalance,
      reservedBalance,
      currency,
      nextPayout: {
        amount: availableBalance,
        date: nextPayoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    };
    
    // Return the demo data
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error generating demo balance and payout data:', error);
    return res.status(500).json({ error: 'Failed to generate demo balance and payout data' });
  }
};
