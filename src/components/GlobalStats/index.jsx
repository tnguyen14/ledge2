import React, { useState } from 'https://cdn.skypack.dev/react@17';
import { useDispatch } from 'https://cdn.skypack.dev/react-redux@7';
import Tabs from 'https://cdn.skypack.dev/@material-ui/core@4/Tabs';
import Tab from 'https://cdn.skypack.dev/@material-ui/core@4/Tab';
import Box from 'https://cdn.skypack.dev/@material-ui/core@4/Box';
import WeeklyAverages from './WeeklyAverages.js';
import CategoriesChart from './CategoriesChart.js';
import CashflowChart from './CashflowChart.js';
import Budget from './Budget.js';
import { showCashflow } from '../../actions/app.js';

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
  const [tab, setTab] = useState(0);

  return (
    <div className="stats global-stats">
      <Tabs
        className="tabs-selector"
        value={tab}
        onChange={(e, newValue) => {
          setTab(newValue);
          // check if cashflow tab
          if (newValue == 2) {
            dispatch(showCashflow(true));
          } else {
            dispatch(showCashflow(false));
          }
        }}
      >
        <Tab label="Weekly Chart" />
        <Tab label="Weekly Averages" />
        <Tab label="Cash Flow" />
        <Tab label="Budget" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <CategoriesChart />
      </TabPanel>
      <TabPanel className="weekly-averages" value={tab} index={1}>
        <WeeklyAverages />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CashflowChart />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <Budget />
      </TabPanel>
    </div>
  );
}

export default GlobalStats;
