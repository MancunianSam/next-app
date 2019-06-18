import fetch from "isomorphic-unfetch"
import Link from 'next/link';
const SignUp = props => {
    return (
	<>
	 <ul>
	          {props.shows.map(show => (
			          <li key={show.id}>
			            <Link as={`/p/${show.id}`} href={`/post?id=${show.id}`}>
			              <a>{show.name}</a>
			            </Link>
			          </li>
			        ))}
	        </ul>
        <form action="http://localhost:3000/signinredirect" method="POST">
            <input type="text"/>
	    <input type="submit" value="Submit"/>
        </form>      
	   </> 
    )

}

SignUp.getInitialProps = async function({query, res}) {
  const resp = await fetch(`https://api.tvmaze.com/search/shows?q=${query.id}`);
  console.log(query.id)
  const data = await resp.json();
  console.log(`Show data fetched. Count: ${data.length}`);
  return {
    shows: data.map(entry => entry.show)
  };
};

export default SignUp
