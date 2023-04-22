import React, {
  useContext,
  useEffect,
  useState
} from 'https://cdn.skypack.dev/react@17';
import Spinner from 'https://cdn.skypack.dev/react-bootstrap@1/Spinner';
import OctokitContext from '../../contexts/octokit.js';

function Budget() {
  const octokit = useContext(OctokitContext);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const commits = await octokit.rest.repos.listCommits({
          owner: 'tnguyen14',
          repo: 'budget'
        });
        console.log(commits);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <div>
      {isLoading && <Spinner animation="border" />}
      {error && error.message}
    </div>
  );
}

export default Budget;
