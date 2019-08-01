import * as React from "react";
import fetch from "isomorphic-unfetch"
import { URLSearchParams } from "url"
import jwkToPem from "jwk-to-pem"
import jsonwebtoken from "jsonwebtoken"

export const WithAuth = Child => {
    const verifyToken = (req) => {
        if (req.headers.cookie && req.headers.cookie.includes("token=")) {
            const token = req.headers.cookie.split("=")[1]
            if (token) {
                const jwk = { "keys": [{ "alg": "RS256", "e": "AQAB", "kid": "uY288vrphM0XG+r9vwSueVIN4u7PhtNk06+WwTKZ8vY=", "kty": "RSA", "n": "tLMttnlm0zX4O_slQR1P_O-OnnJJg5N7efLyT19PDbHP6pqlQzSbIwK-EBphy2HWQkinOeA8eIxiiBcyBuMz6V0rhOi7RaMlPLuUp-OfAKs42yvOO75vdb_ZQlgv4XpEAaeoZzdQqB2SIpn8knIaYk17H8hW6P_z2S49tAV6PBeeL2j5kFYZzCJ6GWJZI-CaJW9LawtZi1y_Fw-SLOB3_v40x2i7n8A62_K8uYG080sp5rXo3REa36MEIqgnOh1i9KlcP4WAtNCGLJmXl-SCxdh987wLsV0mvIgJuWkytyItxUgkaC0tSUPs99yNO6gcPX4VBDsM2JbJ_tc6UkjJ5Q", "use": "sig" }, { "alg": "RS256", "e": "AQAB", "kid": "w3bfqVsChonE4z7WwKw1+Op2JXoZpD0/k1cqg98hxww=", "kty": "RSA", "n": "gKkBzP-s5-w3UrjuRrXGHrLzWwqSe-xsGhMbrP1fom1RiCoUw2jRDGJdnXFol4sSw0ZM6Dm-GzyX1xCz5TBcKnJEAACqbcUSCbWX9nSakg534QqlNIGnc1_OYUejtXtE5TSutKVaatlW1QTAyHEgpD9jkFdoUFeDfwW-YAseicRDLSqwxUj_Trrs8Gv_cOyvwutIkWE7nyAX0TTeMgYwEomFM8pkAewPpEiYdM9N07mz6L9OyfWkCMfCz445BmVu1xIAj2k7t76HjkBG-YUOFEgb7T9yn3F3tQrsD9rSxl89UlVmCuIVvEoZCu7e9Ll0IkvUl7911cUQy7PcFLawkQ", "use": "sig" }] }
                const pem = jwkToPem(jwk.keys[0])
                return new Promise((resolve) => {
                    jsonwebtoken.verify(token, pem, { algorithms: ['RS256'] }, function (err, decodedToken) {
                        if (err) {
                            resolve(null)
                        }
                        resolve(decodedToken)
                    })
                })
            }
        } else {
            return new Promise(resolve => {
                resolve(null)
            })
        }
    }
    const getTokenForCode = async (code) => {
        console.log("getting token")
        const body = {
            grant_type: "authorization_code",
            code,
            client_id: process.env.CLIENT_ID,
            redirect_uri:
                `${process.env.REDIRECT_URL}/createcollection`
        };
        const params = new URLSearchParams(body)
        const response = await fetch("https://tdr.auth.eu-west-2.amazoncognito.com/oauth2/token", { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        const text = await response.text()
        const token = JSON.parse(text).id_token
        console.log("Found token")
        return token
    }


    const redirectToHome = res => {
        res.writeHead(301, {
            Location: 'http://localhost:3000/'
        })
        res.end()
    }

    const Auth = props => <Child {...props}></Child>

    Auth.getInitialProps = async ({ req, res, query }) => {
        let token = await verifyToken(req)
        if (!token && query.code) {
            token = await getTokenForCode(query.code)
        }
        if (!token) {
            redirectToHome(res)
        }

        return {
            ...(Child.getInitialProps ? await Child.getInitialProps({ req, res, query, token }) : {}),
        }
    }
    return Auth
}

