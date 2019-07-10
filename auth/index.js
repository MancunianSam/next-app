import * as React from "react";

export const WithAuth = Child => {
    const verifyToken = (req) => {
        if (req.headers.Cookie && req.headers.Cookie.includes("token=")) {
            const token = req.headers.Cookie.split("=")[1]
            if (token) {
                const jwk = { "keys": [{ "alg": "RS256", "e": "AQAB", "kid": "uY288vrphM0XG+r9vwSueVIN4u7PhtNk06+WwTKZ8vY=", "kty": "RSA", "n": "tLMttnlm0zX4O_slQR1P_O-OnnJJg5N7efLyT19PDbHP6pqlQzSbIwK-EBphy2HWQkinOeA8eIxiiBcyBuMz6V0rhOi7RaMlPLuUp-OfAKs42yvOO75vdb_ZQlgv4XpEAaeoZzdQqB2SIpn8knIaYk17H8hW6P_z2S49tAV6PBeeL2j5kFYZzCJ6GWJZI-CaJW9LawtZi1y_Fw-SLOB3_v40x2i7n8A62_K8uYG080sp5rXo3REa36MEIqgnOh1i9KlcP4WAtNCGLJmXl-SCxdh987wLsV0mvIgJuWkytyItxUgkaC0tSUPs99yNO6gcPX4VBDsM2JbJ_tc6UkjJ5Q", "use": "sig" }, { "alg": "RS256", "e": "AQAB", "kid": "w3bfqVsChonE4z7WwKw1+Op2JXoZpD0/k1cqg98hxww=", "kty": "RSA", "n": "gKkBzP-s5-w3UrjuRrXGHrLzWwqSe-xsGhMbrP1fom1RiCoUw2jRDGJdnXFol4sSw0ZM6Dm-GzyX1xCz5TBcKnJEAACqbcUSCbWX9nSakg534QqlNIGnc1_OYUejtXtE5TSutKVaatlW1QTAyHEgpD9jkFdoUFeDfwW-YAseicRDLSqwxUj_Trrs8Gv_cOyvwutIkWE7nyAX0TTeMgYwEomFM8pkAewPpEiYdM9N07mz6L9OyfWkCMfCz445BmVu1xIAj2k7t76HjkBG-YUOFEgb7T9yn3F3tQrsD9rSxl89UlVmCuIVvEoZCu7e9Ll0IkvUl7911cUQy7PcFLawkQ", "use": "sig" }] }
                const pem = jwkToPem(jwk.keys[0])
                return new Promise((resolve, reject) => {
                    jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
                        if (err) {
                            reject(err)
                        }
                        resolve(decodedToken)
                    })
                })
            }
        } else {
            return new Promise((_, reject) => {
                reject("No token found in cookie")
            })
        }
    }

    const getTokenForCode = (res, code) => {
        console.log("getting token")
        const body = {
            grant_type: "authorization_code",
            code,
            client_id: process.env.CLIENT_ID,
            redirect_uri:
                `${process.env.REDIRECT_URL}/createcollection`
        };
        const params = new URLSearchParams(body)
        fetch("https://tdr.auth.eu-west-2.amazoncognito.com/oauth2/token", { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(res => res.text())
            .then(text => {
                const token = JSON.parse(text).id_token
                console.log("Found token")

                const domain = process.env.IS_OFFLINE ? "localhost" : "amazonaws.com"
                console.log(domain)
                res.setHeader('Set-Cookie', `token=${token}; Domain=${domain}`)

            }).catch(async err => {
                console.log(`Error ${await err}`)
                redirectToHome(res)
            })
    }

    const redirectToHome = res => {
        res.writeHead(301, {
            Location: 'http://localhost:3000/getcollection'
        })
        res.end()
    }

    const Auth = props => <Child {...props}></Child>

    Auth.getInitialProps = async ({ req, res, query }) => {
        if (query.code) {
            getTokenForCode(query.code, res)
        } else {
            verifyToken(req).then(async token => {
                console.log("token is valid")
                return {
                    ...(Child.getInitialProps ? await Child.getInitialProps(context) : {}),
                    something
                }

            }).catch(err => {
                console.log(err)
                redirectToHome(res)
                return {}
            }
            )
        }
        return {}
    }
    return Auth
}

