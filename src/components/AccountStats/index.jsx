import React, { useState } from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Tabs from 'https://cdn.skypack.dev/@material-ui/core@4/Tabs';
import Tab from 'https://cdn.skypack.dev/@material-ui/core@4/Tab';
import Box from 'https://cdn.skypack.dev/@material-ui/core@4/Box';
import WeeklyAverages from './WeeklyAverages.js';
import CategoriesChart from './CategoriesChart.js';
import YearAverages from './YearAverages.js';
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

function AccountStats(props) {
  const dispatch = useDispatch();
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
        <Tab label="Cashflow" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <CategoriesChart />
      </TabPanel>
      <TabPanel className="weekly-averages" value={tab} index={1}>
        <WeeklyAverages />
        <YearAverages />
      </TabPanel>
      <TabPanel value={tab} index={2}></TabPanel>
    </div>
  );
}

export default AccountStats;
