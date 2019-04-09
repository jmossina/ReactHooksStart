import React from 'react';

// NB: the js object used as argument for createContext serves just as a helper for
// the IDE autocompletion feature, as it is however overridden by the value passed
// to the provider within App.js
const authContext = React.createContext({ status: false, login: () => {} });

export default authContext;
