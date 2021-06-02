/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import Auth0 from 'react-native-auth0';

import { setToken } from '../src/actions/app.js';

const auth0 = new Auth0({
  domain: 'tridnguyen.auth0.com',
  clientId: 'z3IK464A6PogdpKe0LY0vTaKr6izei2a'
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  };

  const dispatch = useDispatch();

  const token = useSelector((state) => state.app.token);

  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState();

  async function login() {
    try {
      const creds = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: 'https://lists.cloud.tridnguyen.com'
      });
      setLoggedIn(true);
      dispatch(setToken(creds.accessToken));
    } catch (e) {
      console.error(e);
    }
  }

  async function logout() {
    try {
      await auth0.webAuth.clearSession({});
      setAccessToken(null);
      setLoggedIn(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white
        }}
      >
        {loggedIn && <Text>Access token: ${token}</Text>}
        {!loggedIn && <Button title="Log In" onPress={login} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400'
  },
  highlight: {
    fontWeight: '700'
  }
});

export default App;
