import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { TextInput } from 'react-native-paper'
import { TextInput as NativeTextInput, StyleSheet } from 'react-native'
import { useThemedStyles } from '../../styles/tools/useThemedStyles'

const LEFT_TRIM_REGEX = /^\s+/
const SPACES_REGEX = /\s/g
const NUMBER_WITH_SIGNS_REGEX = /[^0-9+-]/g
const SIGN_AFTER_A_DIGIT_REGEX = /(\d)[+-]/g

export default function ThemedTextInput ({
  style, textStyle, themeColor,
  label, placeholder, value, error,
  onChangeText, onChange, onSubmitEditing, onKeyPress,
  innerRef, fieldId,
  uppercase, trim, noSpaces, numeric
}) {
  const themeStyles = useThemedStyles()

  // const [localValue, setLocalValue] = useState()

  themeColor = themeColor ?? 'primary'

  // useEffect(() => {
  //   setLocalValue(value)
  // }, [value])

  const handleChange = useCallback((event) => {
    let { text } = event.nativeEvent

    text = text.replace(LEFT_TRIM_REGEX, '')

    if (uppercase) {
      text = text.toUpperCase()
    }
    if (trim) {
      text = text.trim()
    }
    if (noSpaces) {
      text = text.replace(SPACES_REGEX, '')
    }
    if (numeric) {
      text = text.replace(NUMBER_WITH_SIGNS_REGEX, '').replace(SIGN_AFTER_A_DIGIT_REGEX, '$1')
    }

    event.nativeEvent.text = text

    onChangeText && onChangeText(text)
    onChange && onChange({ ...event, fieldId })
  }, [onChangeText, onChange, fieldId, uppercase, noSpaces, numeric, trim])

  const colorStyles = useMemo(() => {
    return {
      paperInput: {
        color: themeStyles.theme.colors[themeColor],
        backgroundColor: themeStyles.theme.colors[`${themeColor}Container`]
      },
      nativeInput: {
        color: themeStyles.theme.colors[themeColor],
        backgroundColor: themeStyles.theme.colors[`${themeColor}Container`]
      }
    }
  }, [themeStyles, themeColor])

  const renderInput = useCallback((props) => {
    return (
      <NativeTextInput
        {...props}
        ref={innerRef}
        autoCapitalize={'none'}
        autoComplete={'off'}
        autoCorrect={false}
        spellCheck={false}
        keyboardType={'visible-password'}
        secureTextEntry={false}
        textContentType={'none'}
        returnKeyType={'send'}
        inputMode={'text'}
        style={[...props.style, textStyle]}
        placeholderTextColor={themeStyles.theme.colors.outline}
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false} // Prevent keyboard from hiding
        onKeyPress={onKeyPress}
      />
    )
  }, [themeStyles, onSubmitEditing, innerRef, textStyle])

  return (
    <TextInput
      style={[colorStyles.paperInput, style, { paddingVertical: 0 }]}
      textColor={themeStyles.theme.colors[themeColor]}
      selectionColor={themeStyles.theme.colors[themeColor]}
      underlineColor={themeStyles.theme.colors[themeColor]}
      activeUnderlineColor={themeStyles.theme.colors[themeColor]}
      mode={'flat'}
      dense={true}
      underlineStyle={extraStyles.underline}
      value={value ?? ' '}
      label={label}
      placeholder={placeholder}
      onChange={handleChange}
      // onFocus={handleFocus}
      // onBlur={handleBlur}
      render={renderInput}
      error={error}
    />
  )
}

const extraStyles = StyleSheet.create({
  underline: {
    marginTop: 0,
    borderRadius: 30
  }
})
