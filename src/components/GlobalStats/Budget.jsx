import React, {
  useContext,
  useEffect,
  useState
} from 'https://cdn.skypack.dev/react@17';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import toml from 'https://cdn.skypack.dev/@ltd/j-toml@1';
import { usd } from 'https://cdn.skypack.dev/@tridnguyen/money@1';
import OctokitContext from '../../contexts/octokit.js';

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

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const commits = await octokit.rest.repos.listCommits(repo);
        setVersions(commits.data.map((commit) => commit));
        const weekly = await octokit.rest.repos.getContent({
          ...repo,
          path: 'Weekly.toml'
        });
        const content = atob(weekly.data.content);
        console.log(content);
        setBudget(
          toml.parse(content, {
            bigint: false
          })
        );
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    })();
  }, []);
  console.log(versions);
  console.log(budget);
  return (
    <div>
      {isLoading && <Spinner animation="border" />}
      {error && error.message}
      <table className="table table-borderless">
        <tbody>
          {Object.entries(budget).map(([category, details]) => {
            return (
              <tr className="stat" key={category}>
                <td>
                  <details>
                    <summary>{category}</summary>
                    <table className="table table-borderless">
                      <tbody>
                        {Object.entries(details).map(
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
