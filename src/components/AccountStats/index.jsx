import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';
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
  const yearsToLoad = useSelector((state) => state.app.yearsToLoad);
  const initialLoad = useSelector((state) => state.app.initialLoad);

  return (
    <div className="stats account-stats">
      <Tabs
        className="tabs-selector"
        value={tab}
        onChange={(e, newValue) => {
          setTab(newValue);
        }}
      >
        <Tab label="Weekly Chart" />
        <Tab className="weekly-averages" label="Weekly Averages" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <CategoriesChart />
      </TabPanel>
      <TabPanel className="weekly-averages" value={tab} index={1}>
        <WeeklyAverages />
        <YearAverages />
      </TabPanel>
    </div>
  );
}

export default AccountStats;
