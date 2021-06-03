import React from 'react';
import { View, Text } from 'react-native';
import getStyles from './index.style.js';

function Header() {
  const styles = getStyles();
  return (
    <View style={styles.header}>
      <Text style={styles.heading}>Ledge</Text>
    </View>
  );
}

export default Header;
