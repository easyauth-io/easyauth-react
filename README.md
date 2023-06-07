# Easyauth-React SDK

<div align="center">

[![Clerk documentation](https://img.shields.io/badge/-documentation-green)](https://easyauth.io/docs/quickstart/react/)

</div>

---

## Overview

EasyAuth is a simple and quick way to add authentication and user management to your React application. With EasyAuth, you can add sign up, sign in, and profile management features to your application in minutes.

## Getting Started

### Prerequisites

- React v16+
- Node.js v14+

### Installation

```sh
npm install @easyauth.io/easyauth-react
```

## Usage

Easyauth requires your application to be wrapped in the `<EasyauthProvider/>` context.

If using Create React App, set :

`REACT_APP_EASYAUTH_CLIENT_ID` to your clientId key

`REACT_APP_EASYAUTH_APP_URL` to https://<your_subdomain>.app.easyauth.io

`REACT_APP_EASYAUTH_REDIRECT_URL` to the url where user should redirect

in `.env.local` file to make the environment variable accessible on `process.env`.

Example App:

```jsx
//index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { EasyauthProvider } from "@easyauth.io/easyauth-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <EasyauthProvider>
      <App />
    </EasyauthProvider>
  </React.StrictMode>
);

//User can also pass authority,clientId,redirectUri explicitly as a prop in EasauthProvider component 
//for ex. <EasyauthProvider
    //      authority={process.env.REACT_APP_EASYAUTH_APP_URL}
    //      clientId={process.env.REACT_APP_EASYAUTH_CLIENT_ID}
    //      redirectUri={process.env.REACT_APP_EASYAUTH_REDIRECT_URL}
    //     >
    //      <App />
    //    </EasyauthProvider> 

//App.js

import { useEasyauth, UserProfile } from "@easyauth.io/easyauth-react";

function App() {
  const auth = useEasyauth();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <h1>Loading...</h1>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }
  if (auth.isAuthenticated) {
    return (
      <div className="App">
        <header className="App-header">
          <p>Hello {auth.user?.profile.sub} </p>
          <UserProfile />
          <button
            onClick={() => {
              auth.removeUser();
            }}
          >
            Log out
          </button>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => void auth.signinRedirect()}>Log in</button>
      </header>
    </div>
  );
}

export default App;
```

_For further details and examples, please refer to our [Documentation](https://easyauth.io/docs/quickstart/react/)._

## License

This project is licensed under the **MIT license**.

See [LICENSE](https://github.com/easyauth/easyauth-react/blob/main/LICENSE) for more information.
