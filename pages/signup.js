import Link from "next/link";
const SignUp = ({ shows }) => {
  return (
    <>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            <Link as={`/p/${show.id}`} href={`/post?id=${show.id}`}>
              <a>{show.name}</a>
            </Link>
          </li>
        ))}
      </ul>
      <form
        name="cognitoSignInForm"
        action="https://m6t2cgd8uc.execute-api.eu-west-2.amazonaws.com/dev/authenticate"
        method="POST"
      >
        <input name="username" type="text" value="username" />
        <input name="password" type="password" value="P@ssword2" />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

SignUp.getInitialProps = async function({ query, res }) {
  return {
    shows: []
  };
};

export default SignUp;
