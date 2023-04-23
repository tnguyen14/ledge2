import React, {
  useContext,
  useEffect,
  useState
} from 'https://cdn.skypack.dev/react@17';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import toml from 'https://cdn.skypack.dev/@ltd/j-toml@1';
import OctokitContext from '../../contexts/octokit.js';

const repo = {
  owner: 'tnguyen14',
  repo: 'budget'
};

function Budget() {
  const octokit = useContext(OctokitContext);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
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
      <ul>
        {Object.entries(budget).map(([category, details]) => {
          return (
            <li key={category}>
              <details>
                <summary>
                  {category}: {details.amount}
                </summary>
                <ul>
                  {Object.entries(details).map(([subCategory, subDetails]) => {
                    if (subCategory == 'amount') {
                      return null;
                    }
                    return (
                      <li key={subCategory}>
                        {subCategory}: {subDetails.amount}
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Budget;
