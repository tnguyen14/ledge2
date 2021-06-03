import { StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import BootstrapStyleSheet from 'react-native-bootstrap-styles';

const { s } = new BootstrapStyleSheet();

const styles = EStyleSheet.create({
  header: {
    backgroundColor: '$colorGreen'
  },
  heading: {
    color: '$colorGray100',
    fontFamily: 'cursive',
    textAlign: 'center',
    paddingVertical: '0.25rem'
  }
});

export default function () {
  return {
    ...styles,
    heading: StyleSheet.compose(s.h1, styles.heading)
  };
}
