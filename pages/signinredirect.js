import { setCookie } from 'nookies'
const SignInRedirect = () => {
  return (<div>Signing you in </div>)
}

SignInRedirect.getInitialProps = async function(ctx) {
   setCookie(ctx, 'token', token, {
	         maxAge: 30 * 24 * 60 * 60,
	         path: '/',
	       })
}
