import React, {
  useContext,
  useEffect,
  useState
} from 'https://cdn.skypack.dev/react@17';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import Pagination from 'https://cdn.skypack.dev/react-bootstrap@1/Pagination';
import toml from 'https://cdn.skypack.dev/@ltd/j-toml@1';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import { format } from 'https://cdn.skypack.dev/date-fns@2';
import OctokitContext from '../../contexts/octokit.js';
import BudgetContext from '../../contexts/budget.js';
import { DISPLAY_DATE_FORMAT } from '../../util/constants.js';

function Budget() {
  const octokit = useContext(OctokitContext);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  /*
   * budget example
   * {
   *   "Residence": {
   *     "amount": 750,
   *     "H06 Insurance": {
   *       "amount": 250,
   *       "comment": "test"
   *     }
   *   }
   * }
   */
  const [budget, setBudget] = useState({});
  const { versions, repo } = useContext(BudgetContext);
  const [selectedVersion, setSelectedVersion] = useState();
  const [displayVersions, setDisplayVersions] = useState([]);
  const [hasOlder, setHasOlder] = useState(false);
  const [hasNewer, setHasNewer] = useState(false);
  const [tally, setTally] = useState({
    budget: 0,
    year: 0,
    month: 0,
    paycheck: 0
  });

  useEffect(() => {
    if (!versions.length) {
      return;
    }
    // set latest version by default
    setSelectedVersion(versions.slice(-1)[0].sha);
  }, [versions]);

  useEffect(() => {
    if (!versions.length || !selectedVersion) {
      return;
    }
    const selectedIndex = versions.findIndex(
      (version) => version.sha == selectedVersion
    );
    if (selectedIndex < 0) {
      setError(new Error(`Unable to find version ${selectedVersion}`));
      return;
    }

    if (versions.length < 3) {
      setDisplayVersions(versions.slice());
    } else {
      const rightIndex = Math.min(selectedIndex + 1, versions.length);
      const leftIndex = Math.min(selectedIndex - 1, versions.length - 3);
      setDisplayVersions(
        versions.slice(leftIndex, Math.max(selectedIndex + 2, rightIndex + 1))
      );
      setHasNewer(rightIndex < versions.length - 1);
      setHasOlder(leftIndex > 0);
    }
    (async () => {
      setError();
      setBudget({});
      let content;
      try {
        setIsLoading(true);
        const weekly = await octokit.rest.repos.getContent({
          ...repo,
          path: 'Weekly.toml',
          ref: selectedVersion
        });
        content = atob(weekly.data.content);
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
      try {
        setBudget(
          toml.parse(content, {
            bigint: false
          })
        );
      } catch (e) {
        setError(e);
      }
    })();
  }, [selectedVersion, versions]);
  useEffect(() => {
    let totalBudgetAmount = 0;
    Object.values(budget).forEach((details) => {
      totalBudgetAmount = totalBudgetAmount + details.amount * 100;
    });
    setTally({
      budget: totalBudgetAmount,
      year: totalBudgetAmount * 52,
      month: (totalBudgetAmount * 52) / 12,
      paycheck: (totalBudgetAmount * 52) / 24
    });
  }, [budget]);
  return (
    <div>
      <div className="version-selector">
        {versions.length > 0 && (
          <Pagination size="sm">
            {hasOlder && <Pagination.Ellipsis />}
            {displayVersions.map((version) => (
              <Pagination.Item
                key={version.sha}
                active={version.sha == selectedVersion}
                data-sha={version.sha}
                onClick={(e) => {
                  setSelectedVersion(e.target.dataset.sha);
                }}
              >
                {format(version.date, DISPLAY_DATE_FORMAT)}
              </Pagination.Item>
            ))}
            {hasNewer && <Pagination.Ellipsis />}
          </Pagination>
        )}
      </div>
      {isLoading && <Spinner animation="border" />}
      {error && error.message}
      <table className="table table-borderless">
        <tbody>
          {budget &&
            Object.entries(budget).map(([category, details]) => {
              return (
                <tr className="stat" key={category}>
                  <td>
                    <details>
                      <summary>{category}</summary>
                      <table className="table table-borderless">
                        <tbody>
                          {details &&
                            Object.entries(details).map(
                              ([subCategory, subDetails]) => {
                                if (subCategory == 'amount') {
                                  return null;
                                }
                                return (
                                  <tr key={subCategory}>
                                    <td>{subCategory}</td>
                                    <td>{usd(subDetails.amount * 100)}</td>
                                  </tr>
                                );
                              }
                            )}
                        </tbody>
                      </table>
                    </details>
                  </td>
                  <td>{usd(details.amount * 100)}</td>
                </tr>
              );
            })}
          <tr className="stat">
            <td>Total</td>
            <td>{usd(tally.budget)}</td>
          </tr>
          <tr className="stat">
            <td>Year</td>
            <td>{usd(tally.year)}</td>
          </tr>
          <tr className="stat">
            <td>Paycheck</td>
            <td>{usd(tally.paycheck)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Budget;
