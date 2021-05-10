import React, { useState } from 'https://cdn.skypack.dev/react@16';
import Tabs from 'https://cdn.skypack.dev/@material-ui/core@4/Tabs';
import Tab from 'https://cdn.skypack.dev/@material-ui/core@4/Tab';
import Box from 'https://cdn.skypack.dev/@material-ui/core@4/Box';
import WeeklyAverages from './WeeklyAverages.js';
import CategoriesChart from './CategoriesChart.js';
import YearAverages from './YearAverages.js';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="tab-content">{children}</Box>}
    </div>
  );
}

function AccountStats(props) {
  const [tab, setTab] = useState(0);

  return (
    <div className="stats account-stats">
      <Tabs
        value={tab}
        onChange={(e, newValue) => {
          setTab(newValue);
        }}
      >
        <Tab label="Weekly Averages" />
        <Tab label="Past Years" />
        <Tab label="Chart" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <WeeklyAverages />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <YearAverages />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CategoriesChart />
      </TabPanel>
    </div>
  );
}

export default AccountStats;
