import fetch from "isomorphic-unfetch"
const SignIn = ({ csrfToken }) => {
    return (
        <form method="POST" name="cognitoSignInForm" action="https://tdr.auth.eu-west-2.amazoncognito.com/login?response_type=code&client_id=7tmk95dur3gjqklinuvevgahl9&redirect_uri=https://wq2djqdgc3.execute-api.eu-west-2.amazonaws.com/dev/createcollection">
            <input type="text" name="username" value="username" />
            <input type="password" name="password" value="P@ssword2" />
            <input type="hidden" name="_csrf" value={csrfToken} />
            <input type="submit" value="Sign In" />
        </form>
    )
}

SignIn.getInitialProps = async function ({ res }) {
    const response = await fetch("https://tdr.auth.eu-west-2.amazoncognito.com/oauth2/authorize?response_type=code&client_id=7tmk95dur3gjqklinuvevgahl9&redirect_uri=https://wq2djqdgc3.execute-api.eu-west-2.amazonaws.com/dev/createcollection")
    const setCookies = response.headers.raw()['set-cookie']
    console.log(setCookies)
    const regex = /[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/
    const csrfToken = setCookies[0].match(regex)[0]
    res.setHeader('set-cookie', `XSRF-TOKEN=${csrfToken}; Domain=localhost;`)
    return { csrfToken }
}

export default SignIn