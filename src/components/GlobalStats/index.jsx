import React, { useState } from 'https://esm.sh/react@18.2.0';
import { useDispatch } from 'https://esm.sh/react-redux@9';
import Tabs from 'https://esm.sh/@mui/material@5.15.7/Tabs';
import Tab from 'https://esm.sh/@mui/material@5.15.7/Tab';
import Box from 'https://esm.sh/@mui/material@5.15.7/Box';
import WeeklyAverages from './WeeklyAverages.js';
import CategoriesChart from './CategoriesChart.js';
import CashflowChart from './CashflowChart.js';
import Budget from './Budget.js';
import { showCashflow, setSearchMode } from '../../slices/app.js';

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

function GlobalStats() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(1);

  return (
    <div className="stats global-stats">
      <Tabs
        className="tabs-selector"
        variant="scrollable"
        value={tab}
        onChange={(e, newValue) => {
          setTab(newValue);
          // search
          if (newValue == 0) {
            dispatch(setSearchMode(true));
          } else {
            dispatch(setSearchMode(false));
          }
          // cashflow
          if (newValue == 3) {
            dispatch(showCashflow(true));
          } else {
            dispatch(showCashflow(false));
          }
        }}
      >
        <Tab label="Search" />
        <Tab label="Chart" />
        <Tab label="Averages" />
        <Tab label="Cash Flow" />
        <Tab label="Budget" />
      </Tabs>
      <TabPanel value={tab} index={0}></TabPanel>
      <TabPanel value={tab} index={1}>
        <CategoriesChart />
      </TabPanel>
      <TabPanel className="weekly-averages" value={tab} index={2}>
        <WeeklyAverages />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <CashflowChart />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <Budget />
      </TabPanel>
    </div>
  );
}

export default GlobalStats;
