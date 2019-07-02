const compat = require("next-aws-lambda");
const reqResMapper = require('next-aws-lambda/lib/compatLayer')
const jsonwebtoken = require("jsonwebtoken")
const jwkToPem = require("jwk-to-pem")
const { URLSearchParams } = require('url')
const fetch = require('isomorphic-unfetch')

const auth = (event) => {
    if (event.headers.Cookie && event.headers.Cookie.includes("token=")) {
        const token = event.headers.Cookie.split("=")[1]
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

const getTokenForCode = (event, context, callback, page) => {
    console.log("getting token")
    const body = {
        grant_type: "authorization_code",
        code: event.queryStringParameters.code,
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

            event.multiValueHeaders = {
                ...event.headers,
                'Set-Cookie': `token=${token}`
            }

            console.log(event.multiValueHeaders)

            const { req, res } = reqResMapper(event, callback)
            res.setHeader('Set-Cookie', `token=${token}`)
            page.render(req, res)

        }).catch(async err => {
            console.log(`Error ${await err}`)
            redirectToHome(callback)
        })
}

const redirectToHome = callback => {
    const response = {
        statusCode: 301,
        headers: {
            Location: process.env.REDIRECT_URL,
        }
    };
    callback(null, response)
}

const authorisedUrls = [
    '/getcollection',
    '/createcollection'
]

module.exports = page => {
    const handler = (event, context, callback) => {
        // do any stuff you like
        if (authorisedUrls.indexOf(event.path) !== -1) {
            if (event.queryStringParameters && event.queryStringParameters.code) {
                getTokenForCode(event, context, callback, page)
            } else {

                auth(event).then(token => {
                    console.log(`Authorised token is ${token}`)
                    compat(page)(event, context, callback)

                }).catch(err => {
                    console.log(err)
                    redirectToHome(callback)
                }
                )
            }

        } else {
            console.log("Page does not need authorisation")
            compat(page)(event, context, callback)
        }
        // this makes sure the next page renders
        // do any other stuff you like

    };
    return handler;
};