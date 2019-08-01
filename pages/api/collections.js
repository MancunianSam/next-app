import { gql } from "apollo-boost";

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';



const getClient = (req) => {
    const httpLink = createHttpLink({
        uri: "https://qad2wpgi3befniyihgl42yvfea.appsync-api.eu-west-2.amazonaws.com/graphql",
        fetch
    });

    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = req.cookies.token
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token
            }
        }
    });

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });


}

export default function handle(req, res) {
    if (req.method === 'POST') {
        createCollection(req, res)
    } else {
        getCollection(req, res)
    }
}

const getCollection = (req, res) => {
    const client = getClient(req)
    client.query({
        query: gql`
        query GetCollection{

  getCollections{
    collections {
      id,name, legalStatus, closure, copyright
    }
  }
}
        `
    }).then(result => res.end(JSON.stringify(result)))
}

const createCollection = (req, res) => {
    console.log(req.cookies.token)
    const client = getClient(req)
    client
        .mutate({
            mutation: gql`
      mutation {
           createCollection(name: "name", copyright: "copyright", closure: "closure", legalStatus: "legalStatus") {
              id
           }
    }
    `
        })
        .then(result => console.log(result));
    res.writeHead(301, {
        Location: 'http://localhost:3000/upload'
    })
    res.end('Hello World');
}