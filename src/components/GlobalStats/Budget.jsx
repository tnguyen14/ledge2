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
import { DISPLAY_DATE_FORMAT } from '../../util/constants.js';

const repo = {
  owner: 'tnguyen14',
  repo: 'budget'
};

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
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const commits = await octokit.rest.repos.listCommits(repo);
        const budgetVersions = commits.data.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message,
          // DO I NEED TO WORRY ABOUT TIMEZONE HERE??
          date: new Date(commit.commit.committer.date)
        }));
        // set latest version by default
        setSelectedVersion(budgetVersions[0].sha);
        setVersions(budgetVersions.reverse());
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedVersion) {
        return;
      }
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
        console.log(content);
        setError(e);
      }
    })();
  }, [selectedVersion]);
  return (
    <div>
      <div className="version-selector">
        {versions.length ? (
          <Pagination size="sm">
            <Pagination.Prev />
            {versions.map((version) => (
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
            <Pagination.Next />
          </Pagination>
        ) : null}
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
        </tbody>
      </table>
    </div>
  );
}

export default Budget;
